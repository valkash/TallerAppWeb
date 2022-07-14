import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Layout, List, Button, Row, Col, Divider, Modal, Table } from 'antd';
import { orange } from '@ant-design/colors';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Notification from './components/Notification'
import taskService from './services/Tasks'
import loginService from './services/login'
import LoginForm from './components/LoginForm.js'
import TaskForm from './components/TaskForm.js'
import './App.css'

const { Header, Content } = Layout;

const App = () => {
  const [tasks, setTasks] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [visible, setVisible] = useState(false)
  const [task, setTask] = useState({})

  useEffect(() => {
    taskService
      .getAll()
      .then(initialTasks => {
        setTasks(initialTasks)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTaskAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      taskService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    taskService.setToken(null)
    window.localStorage.removeItem('loggedTaskAppUser')
  }

  const addTask = (taskObject) => {
    taskService
      .create(taskObject)
      .then(returnedTask => {
        setTasks(tasks.concat(returnedTask))
      })
  }

  const updateTask = (id, taskObject) => {
    taskService
      .update(id, taskObject)
      .then((response) => {
        const updatedTasks = tasks.map(task => {
          if (task.id === id) {
            return {...task, content: taskObject.content};
          }

          return task;
        });

        setTasks(updatedTasks)
        setVisible(false)
      })
  }

  const deleteTask = (id) => {
    taskService
      .remove(id)
      .then(returnedTask => {
        setTasks(tasks.filter((task) => !(task.id === id)))
      })
  }

  const handleLogin = async ({ username, password}) => {
    try {
      const user = await loginService.login({
        username,
        password
      })
  
      window.localStorage.setItem(
        'loggedTaskAppUser', JSON.stringify(user)
      )

      taskService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch(e) {
      setErrorMessage('Problemas con credenciales')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const columns = [
    {
      title: 'Tarea',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Mecánico',
      dataIndex: 'mecanico',
      key: 'mecanico',
    },
    {
      title: 'Patente',
      dataIndex: 'patente',
      key: 'patente',
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
      key: 'costo',
    },
    {
      title: 'Fecha',
      dataIndex: 'dateTask',
      key: 'dateTask',
      render: (value, item) => {
        return <>
          {moment(value).format('YYYY-MM-DD')}
        </>
      },
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
    },
    {
      title: 'Acciones',
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (item) => {
        return <>
          <a style={{ color: orange.primary, marginRight: 10 }} onClick={() => {setVisible(!visible); setTask(item)}}><EditOutlined /></a>
          <a style={{ color: orange.primary }} onClick={() => deleteTask(item.id)}><DeleteOutlined /></a>
        </>
      },
    },
  ];

  return (
    <Layout className="App app-page">
      <Header style={{ textAlign: 'right' }} >
        {user && <Button
          type="primary"
          onClick={handleLogout}
          style={{ borderColor: orange.primary, backgroundColor: orange.primary }}
        >
          Cerrar sesión
        </Button>}
      </Header>
      <Content>
        <Notification message={errorMessage} />
        {user
            ? <>
                <TaskForm addTask={addTask} />
                <Row justify="space-around" align="top" style={{ marginTop: 30, marginBottom: 80 }}>
                  <Col span={20}>
                    <Divider orientation="left">Tareas</Divider>
                    <Table dataSource={tasks} columns={columns} />;
                  </Col>
                </Row>
              </>
            : <LoginForm
                username={username}
                password={password}
                handleUsernameChange={
                  ({target}) => setUsername(target.value)}
                handlePasswordChange={
                  ({target}) => setPassword(target.value)
                }
                handleSubmit={handleLogin}
              />
        }<Modal
          footer={false}
          title="Editar tarea"
          destroyOnClose
          visible={visible}
          onCancel={() => setVisible(!visible)}
          destroyOnClose
          width={900}
        >
        <TaskForm updateTask={updateTask} isUpdate taskSelected={task} showModal={() => setVisible(!visible)} />
      </Modal>
      </Content>
    </Layout>
  )
}

export default App 