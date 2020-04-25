import React, { useState, useEffect } from 'react';
import { Modal, Input, List, DatePicker, Row, Col, Button, InputNumber, notification, Upload, message, Divider, Typography, Select } from 'antd';
import { SaveOutlined, CloseOutlined, CloudUploadOutlined, PictureOutlined } from '@ant-design/icons'
import moment from 'moment';
import Event from './Models/Event';
import API from './API';
import { AxiosResponse } from 'axios';

const { Option } = Select
const { Dragger } = Upload;
const { Text } = Typography

interface CreateEventProps {
    isVisible: boolean,
    event: Event,
    close: () => void
}

export const CreateEvent = (props: CreateEventProps) => {

    const [event, changeEvent] = useState(new Event)
    const [categories, setCateogries] = useState(new Array)
    const [files, changeFiles] = useState(new Array)

    useEffect(() => {
        changeEvent(props.event)
        getCategoryList()
    }, [props.isVisible])

    const arrayBufferToBase64 = (buffer:any) => {
        console.log(buffer)
        let binary = '';
        let bytes = new Uint8Array(buffer);
        console.log(bytes)
        let len = bytes.byteLength;
        console.log(len)
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        console.log(binary)
        return btoa(binary);
    }
    
    const image = {
        name: 'filename',
        multiple: false,

        action: `https://tachartas.herokuapp.com/${event.id}/image`,
        onChange({ file }: any) {
            const { status } = file;
            if (status === 'done')
                message.success(`${file.name} file uploaded successfully.`);
            else if (status === 'error')
                message.error(`${file.name} file upload failed.`);
        },
    };

    const onChangeHandler = ({ target }: any) => {
        const { name, value }: any = target
        changeEvent({ ...event, [name]: value })
    }

    const onNumberChangeHandler = (e: any, name: string) => changeEvent({ ...event, [name]: e });
    const onDateChange = (name: string, value: any) => changeEvent({ ...event, [name]: moment(value).toISOString() })
    const onCategoryChange = (value: any) => changeEvent({ ...event, category: value})


    const validateDate = () => {
        let res = true
        if (event.end_time && event.start_time &&
            (event.start_time > event.end_time || event.end_time < event.start_time)) {
            res = false
            notification.error({
                message: 'Error en horas',
                description: 'La hora de inicio no puede ser mayor que la hora fin, ni la hora final puede ser menor que la de inicio'
            });
        }
        return res
    }

    const isEventIdEmpty = () => !event.id

    const putEvent = () => API.put('event/' + event.id, event)
        .then(() => {
            notification.success({
                message: 'Evento actualizado',
                description: 'Su evento fue actualizado exitosamente'
            })
            props.close()
        })
        .catch((err: any) => notification.error(
            {
                message: 'Error al actualizar Evento',
                description: 'Ha ocurrido un error al tratar de actualizar su evento'
            }
        ));

    const postEvent = () => API.post('event', event)
        .then(() => {
            notification.success({
                message: 'Evento creado',
                description: 'Su evento fue creado exitosamente'
            })
            props.close()
        })
        .catch(() => notification.error(
            {
                message: 'Error al crear Evento',
                description: 'Ha ocurrido un error al tratar de crear su evento'
            }
        ));

    const saveHandler = () => {
        if (!validateDate()) return

        isEventIdEmpty() ? postEvent() : putEvent()
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('filename', files[0]);
        API.put(`https://tachartas.herokuapp.com/event/${event.id}/image`, formData)
            .then((resp: any) => console.log(resp))
            .catch((err: any) => console.log(err))
    }

    const getCategoryList = () => {
        API.get('https://tachartas.herokuapp.com/category')
            .then((resp: AxiosResponse) => setCateogries([...resp.data]))
    }

    return <Modal
        title={event.id ? event.name : 'Nuevo Evento'}
        visible={props.isVisible}
        onCancel={props.close}
        destroyOnClose={true}
        footer={[
            <Button key={1}
                icon={<CloseOutlined />}
                onClick={props.close}>Cerrar</Button>,
            <Button key={2}
                icon={<SaveOutlined />}
                type={'primary'}
                onClick={saveHandler}>{event.id ? 'Actualizar' : 'Crear'}</Button>
        ]}>

        <Text strong>Nombre</Text>
        <Input
            name={'name'}
            value={event.name}
            onChange={onChangeHandler} />

        <Text strong>Lugar</Text>
        <Input
            name={'venue'}
            value={event.venue}
            onChange={onChangeHandler} />

        <Text strong>Descripción</Text>
        <Input.TextArea
            name={'description'}
            value={event.description} onChange={onChangeHandler} />

        <Text strong>Categoría</Text> <br/>
        <Select onSelect={onCategoryChange} defaultValue={event.category || undefined} style={{ width: '150px'}}>
            {categories.map((c: any) => <Option value={c.id} key={c.id}>{c.description}</Option>)}
        </Select>

        <Divider />

        <Row>
            <Col span={8}>
                <Text strong>Fecha evento</Text> <br />
                <DatePicker
                    placeholder={'Seleccione una fecha'}
                    value={moment(event.date)}
                    onChange={(e, value) => onDateChange('date', value)} />
            </Col>
            <Col span={8}>
                <Text strong>Hora de inicio</Text> <br />
                <InputNumber
                    name={'start_time'}
                    max={23}
                    min={0}
                    placeholder={'Hora inicio'}
                    value={event.start_time}
                    onChange={(e) => onNumberChangeHandler(e, 'start_time')} />
            </Col>
            <Col span={8}>
                <Text strong>Hora de fin</Text> <br />
                <InputNumber
                    max={23}
                    min={0}
                    placeholder={'Hora fin'}
                    value={event.end_time}
                    onChange={(e) => onNumberChangeHandler(e, 'end_time')} name={'end_time'} />
            </Col>
        </Row>
        <Row>
            {event.image_content && <img src={`data:image/png;base64,${event.image_content}`} />}
        </Row>
        <Row>
            <Upload fileList={files}
                onRemove={(file: any) => changeFiles([])}
                beforeUpload={(file: any, fileList: any) => {
                    changeFiles(fileList)
                    return false
                }}>
                <Button
                    icon={<PictureOutlined />}>Seleccionar imagenes</Button>
            </Upload>
            <Button
                disabled={!files.length}
                icon={<CloudUploadOutlined />}
                onClick={handleUpload}>Subir imagenes</Button>
        </Row>
    </Modal>
}