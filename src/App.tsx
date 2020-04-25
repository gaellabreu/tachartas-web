import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { CreateEvent } from './CreateEvent';
import EventList from './EventList';
import Event from './Models/Event';
import { Header } from './Header'
import { PlusOutlined } from '@ant-design/icons'
const App: React.FC = () => {

  const { Content } = Layout

  const [isVisible, toggleVisible] = useState(false);
  const [event, changeEvent] = useState(new Event());

  const toggleEventScreen = () => {
    toggleVisible(!isVisible)
    changeEvent(new Event())
  }

  return <Layout className="layout" style={{ height: 'inherit' }}>
    <Header />
    <Content style={{ padding: '20px' }}>
      <div style={{ background: '#fff', padding: 24, minHeight: '100%' }}>
        <Button
        style={{ marginBottom: '2%'}}
          type="primary"
          icon={<PlusOutlined />}
          onClick={toggleEventScreen}>Nuevo evento</Button>
        <EventList changeEvent={changeEvent} toggleVisible={toggleVisible} />
      </div>
    </Content>

    <CreateEvent
      isVisible={isVisible}
      close={() => toggleVisible(false)}
      event={event} />
  </Layout>

}

export default App;
