import React from 'react'
import { Button, Form, Input, Card, Row, Col } from 'antd';
import { orange } from '@ant-design/colors';

const LoginForm = ({ handleSubmit, username, password, handleUsernameChange, handlePasswordChange }) => {
  return (
    <Row justify="space-around" align="top" style={{ height: '100%', marginTop: 80 }}>
      <Col span={8}>
        <Card title="Inicio de sesión">
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={(values) => handleSubmit(values)}
          >
            <Form.Item
              label="Usuario"
              name="username"
              rules={[{ required: true, message: 'Ingrese su usuario' }]}
              onChange={handleUsernameChange}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Ingrese su contraseña' }]}
              onChange={handlePasswordChange}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button disabled={!(username && password)} type="primary" htmlType="submit" style={{ borderColor: orange.primary,backgroundColor: orange.primary }}>
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginForm;