import React from 'react';
import { Table, notification } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import API from './API';
import Event from './Models/Event';
import { AxiosResponse } from 'axios';
import moment from 'moment';

export default class EventList extends React.Component<any, any> {
    state = {
        events: [] as Event[]
    }

    columns = [
        { title: 'Nombre', dataIndex: 'name' },
        { title: 'Lugar', dataIndex: 'venue' },
        { title: 'Fecha', dataIndex: 'date', render: (value:any) => moment(value).format('DD/MM/YYYY') },
        {
            title: '', render: (e: any) => <EditTwoTone twoToneColor={'purple'} onClick={() => {
                this.props.changeEvent(e)
                this.props.toggleVisible(true)
            }}/>
        },
        { title: '', render: () => <DeleteTwoTone twoToneColor={'red'} onClick={() => notification.error({
            message: 'NOT IMPLEMENTED',
            description: 'DELETE FEATURE NOT READY'
        })}/> },
    ]

    getEvents = () => {
        API.post('event/filter', {})
            .then((response: AxiosResponse) => this.setState({ events: response.data }))
            .catch(() => notification.error({ message: 'Ha ocurrido un error' }));
    }

    componentDidMount() {
        this.getEvents()
    }

    render() {
        return <Table
            size={'small'}
            dataSource={this.state.events}
            columns={this.columns} />
    }
}