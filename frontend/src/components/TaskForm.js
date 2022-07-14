import React from 'react'
import { Button, Form, Input, Card, Row, Col, DatePicker } from 'antd';
import moment from 'moment'
import { orange } from '@ant-design/colors';

export default function TaskForm ({ addTask, isUpdate, updateTask, taskSelected, showModal }) {
  const handleSubmit = ({
    task,
    mecanico,
    dateTask,
    marca,
    patente,
    modelo,
    costo,
  }) => {
    const newDate = new Date(dateTask)
    const taskObject = {
      content: task,
      mecanico,
      dateTask: newDate,
      marca,
      patente,
      modelo,
      costo
    }

    isUpdate ? updateTask(taskSelected.id, taskObject) : addTask(taskObject)
  }

  return (<Row justify="space-around" align="top" style={{ marginTop: isUpdate ? 0 : 80 }}>
    <Col span={isUpdate ? 16 : 8}>
      <Card title={isUpdate ? false : 'Crear nueva tarea'}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleSubmit}
          initialValues={{
            task: taskSelected && taskSelected.content,
            mecanico: taskSelected && taskSelected.mecanico,
            modelo: taskSelected && taskSelected.modelo,
            marca: taskSelected && taskSelected.marca,
            costo: taskSelected && taskSelected.costo,
            patente: taskSelected && taskSelected.patente,
            dateTask: taskSelected && moment(taskSelected.dateTask)
          }}
        >
          <Form.Item
            label="Tarea"
            name="task"
            rules={[{ required: true, message: 'Ingrese contenido de tarea' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mecánico"
            name="mecanico"
            rules={[{ required: true, message: 'Ingrese mecánico' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha"
            name="dateTask"
            rules={[{ required: true, message: 'Ingrese fecha' }]}
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
          <Form.Item
            label="Marca"
            name="marca"
            rules={[{ required: true, message: 'Ingrese marca' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Modelo"
            name="modelo"
            rules={[{ required: true, message: 'Ingrese modelo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Patente"
            name="patente"
            rules={[{ required: true, message: 'Ingrese patente' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Costo"
            name="costo"
            rules={[{ required: true, message: 'Ingrese costo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 22 }} style={{ textAlign: 'right' }}>
            {isUpdate && <Button type="primary" style={{ borderColor: orange.primary,backgroundColor: orange.primary, marginRight: 10 }} onClick={showModal}>
              Cancelar
            </Button>}
            <Button type="primary" htmlType="submit" style={{ borderColor: orange.primary,backgroundColor: orange.primary }}>
              {isUpdate ? 'Actualizar' : 'Registrar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Col>
  </Row>)
}