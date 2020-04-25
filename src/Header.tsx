import React from 'react'
import { Menu, Layout } from 'antd'

export const Header: React.FC = () => {

    const { Header } = Layout
    return <Header style={{ background: '#7200ca' }}>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px', background: 'transparent' }}>
            <Menu.Item key="1">Eventos abiertos</Menu.Item>
            <Menu.Item key="2">Histórico</Menu.Item>
            <Menu.Item key="3">Configuración</Menu.Item>
            <Menu.Item key="4">Configuración</Menu.Item>
        </Menu>
    </Header>
}