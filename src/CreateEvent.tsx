import React, { Component } from 'react';
import { Modal, Input, DatePicker, Row, Col, Button, InputNumber, notification, Upload, Icon, message } from 'antd';
import moment from 'moment';
import Event from './Models/Event';
import API from './API';

const { Dragger } = Upload;



class CreateEvent extends Component<any, any>{
    format = 'HH:mm';

    state = { event: new Event() }

     image = {
        name: 'filename',
        multiple: false,
        action: `https://tachartas.herokuapp.com/${this.state.event.id}/image`,
        onChange(info: any) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };   

    componentDidUpdate(prev: any) {
        if (prev.event.id !== this.props.event.id)
            this.setState({ event: this.props.event })
    }

    onChangeHandler = (e: any) => {
        const { name, value } = e.target
        this.setState(Object.assign(this.state.event, { [name]: value }))
    }

    onNumberChangeHandler = (e: any, name: string) => {
        this.setState(Object.assign(this.state.event, { [name]: e }));
    }


      

    onDateChange = (name: string, value: any) => this.setState(Object.assign(this.state.event, { [name]: moment(value).toISOString() }));

    saveHandler = () => {
        if ((this.state.event.start_time > this.state.event.end_time || this.state.event.end_time < this.state.event.start_time)
            && this.state.event.start_time
            && this.state.event.end_time) {
            notification.error({
                message: 'Error en horas',
                description: 'La hora de inicio no puede ser mayor que la hora fin, ni la hora final puede ser menor que la de inicio'
            });
        } else if (this.state.event.id) {
            API.put('event/' + this.state.event.id, this.state.event)
                .then((response: any) => {
                    notification.success({
                        message: 'Evento actualizado',
                        description: 'Su evento fue actualizado exitosamente'
                    })
                    this.props.close()
                })
                .catch((err: any) => notification.error(
                    {
                        message: 'Error al actualizar Evento',
                        description: 'Ha ocurrido un error al tratar de actualizar su evento'
                    }
                ));
        } else
            API.post('event', this.state.event)
                .then((response: any) => {
                    notification.success({
                        message: 'Evento creado',
                        description: 'Su evento fue creado exitosamente'
                    })
                    this.props.close()
                })
                .catch((err: any) => notification.error(
                    {
                        message: 'Error al crear Evento',
                        description: 'Ha ocurrido un error al tratar de crear su evento'
                    }
                ));

    }

    render() {

        console.log(this.state.event.id);
        return <Modal
            title={'Nuevo Evento'}
            visible={this.props.isVisible}
            onCancel={this.props.close}
            destroyOnClose={true}
            footer={[
                <Button key={1}
                    icon={'close'}
                    onClick={this.props.close} >Cerrar</Button>,
                <Button key={2}
                    icon={'save'}
                    type={'primary'}
                    onClick={this.saveHandler}>{this.props.event.id ? 'Actualizar' : 'Crear'}</Button>
            ]}>
            <Row>
                <Input
                    name={'name'}
                    placeholder='Nombre'
                    value={this.state.event.name}
                    onChange={this.onChangeHandler} />
            </Row>
            <Row>
                <Input
                    name={'venue'}
                    placeholder='Lugar'
                    value={this.state.event.venue}
                    onChange={this.onChangeHandler} />
            </Row>
            <Row>
                <label >Fecha evento: </label>
                <DatePicker placeholder={'Seleccione una fecha'} value={moment(this.state.event.date)} onChange={(e, value) => this.onDateChange('date', value)} />
            </Row>
            <Row>
                <Col span={12}>
                    <label htmlFor="start_time">Hora Inicio: </label>
                    <InputNumber max={23} min={0} placeholder={'Hora inicio'} value={this.state.event.start_time} onChange={(e) => this.onNumberChangeHandler(e, 'start_time')} name={'start_time'} />
                </Col>
                <Col span={12}>
                    <label htmlFor="end_time">Hora Fin: </label>
                    <InputNumber max={23} min={0} placeholder={'Hora fin'} value={this.state.event.end_time} onChange={(e) => this.onNumberChangeHandler(e, 'end_time')} name={'end_time'} />
                </Col>
            </Row>
            <Row>
                <Input.TextArea name={'description'} placeholder='Descripción' value={this.state.event.description} onChange={this.onChangeHandler} />
            </Row>              
            <Row>
                <Dragger {...this.image} method={"PUT"}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>          
            </Row>      
        </Modal>
    }
};

export default CreateEvent;