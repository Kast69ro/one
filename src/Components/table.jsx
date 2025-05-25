import  { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Popover,
  Avatar,
  Divider,
  Modal,
  Input,
  Select,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Column } = Table;
const { Option } = Select;

const MyTable = () => {
  const [data, setData] = useState([
    {
      id: '1',
      name: 'KAstro',
      email: 'fake@.com',
      city: 'Moscow',
      status: false,
      phone: 8748347,
    },
    {
      id: '2',
      name: 'bot',
      email: 'fake@.com',
      city: 'Dushanbe',
      status: true,
      phone: 8748347,
    },
  ]);

  const [idx, setIdx] = useState(null);
  const [editX, setEditX] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editStatus, setEditStatus] = useState('true');
  const [editCity, setEditCity] = useState('Moscow');
  const [editPhone, setEditPhone] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setEditStatus('true');
    setEditCity('Moscow');
    setEditPhone('');
  };

  const handleClickEdit = (record) => {
    setIdx(record.id);
    setEditX(record);
    setName(record.name);
    setEmail(record.email);
    setEditStatus(record.status ? 'true' : 'false');
    setEditCity(record.city);
    setEditPhone(record.phone);
    setIsModalOpen(true);
    setPopoverVisible(null); 
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  const handleSaveEdit = () => {
    setData((prev) =>
      prev.map((user) =>
        user.id === idx
          ? {
              ...user,
              name,
              email,
              status: editStatus === 'true',
              city: editCity,
              phone: editPhone,
            }
          : user
      )
    );
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setData((prev) => prev.filter((user) => user.id !== idx));
    setPopoverVisible(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
    setPopoverVisible(null);
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveAdd = () => {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      status: editStatus === 'true',
      city: editCity,
      phone: editPhone,
    };
    setData((prev) => [...prev, newUser]);
    setIsAddModalOpen(false);
  };

  const handleShowInfo = (record) => {
    setEditX(record);
    setIsInfoModalOpen(true);
    setPopoverVisible(null);
  };

  const handleCancelInfo = () => {
    setIsInfoModalOpen(false);
  };

  const getPopoverContent = (record) => (
    <div style={{ width: 140 }}>
      <div
        onClick={() => handleShowInfo(record)}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '6px 0' }}
      >
        <UserOutlined style={{ marginRight: 8 }} />
        View profile
      </div>
      <div
        onClick={() => handleClickEdit(record)}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '6px 0' }}
      >
        <EditOutlined style={{ marginRight: 8 }} />
        Edit
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <div
        onClick={() => {
          setIdx(record.id);
          handleDelete();
        }}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'red', padding: '6px 0' }}
      >
        <DeleteOutlined style={{ marginRight: 8 }} />
        Delete
      </div>
    </div>
  );

  return (
    <>
      <div className='one'>
        <h1>User List</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add User
      </Button>
      </div>

      <Table dataSource={data} rowKey="id" pagination={{ pageSize: 5 }}>
        <Column
          title="Name"
          dataIndex="name"
          key="name"
          filters={Array.from(new Set(data.map((d) => d.name))).map((name) => ({
            text: name,
            value: name,
          }))}
          onFilter={(value, record) => record.name === value}
          render={(_, record) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#87d068' }}>{record.name[0].toUpperCase()}</Avatar>
              <div>
                <div style={{ fontWeight: 500 }}>{record.name}</div>
                <div style={{ color: 'gray', fontSize: 12 }}>{record.email}</div>
              </div>
            </div>
          )}
        />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="City"
          dataIndex="city"
          key="city"
          filters={[
            { text: 'Moscow', value: 'Moscow' },
            { text: 'Dushanbe', value: 'Dushanbe' },
            { text: 'Bokhtar', value: 'Bokhtar' },
          ]}
          onFilter={(value, record) => record.city === value}
        />
        <Column title="Phone" dataIndex="phone" key="phone" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          filters={[
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
          ]}
          onFilter={(value, record) => record.status === value}
          render={(status) => (
            <Tag color={status ? 'green' : 'rgba(116, 137, 152, 1)'}>
              {status ? 'Active' : 'Inactive'}
            </Tag>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Popover
              content={getPopoverContent(record)}
              trigger="click"
              placement="bottomRight"
              visible={popoverVisible === record.id}
              onVisibleChange={(visible) =>
                setPopoverVisible(visible ? record.id : null)
              }
            >
              <Button icon={<DownOutlined />}>Actions</Button>
            </Popover>
          )}
        />
      </Table>

      <Modal title="Edit User" open={isModalOpen} onOk={handleSaveEdit} onCancel={handleCancelEdit} okText="Save">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Phone"
          type="number"
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Select value={editStatus} onChange={setEditStatus} style={{ width: '100%', marginBottom: 16 }}>
          <Option value="true">Active</Option>
          <Option value="false">Inactive</Option>
        </Select>
        <Select value={editCity} onChange={setEditCity} style={{ width: '100%' }}>
          <Option value="Moscow">Moscow</Option>
          <Option value="Dushanbe">Dushanbe</Option>
          <Option value="Bokhtar">Bokhtar</Option>
        </Select>
      </Modal>

      <Modal title="Add User" open={isAddModalOpen} onOk={handleSaveAdd} onCancel={handleCancelAdd} okText="Add">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Phone"
          type="number"
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Select value={editStatus} onChange={setEditStatus} style={{ width: '100%', marginBottom: 16 }}>
          <Option value="true">Active</Option>
          <Option value="false">Inactive</Option>
        </Select>
        <Select value={editCity} onChange={setEditCity} style={{ width: '100%' }}>
          <Option value="Moscow">Moscow</Option>
          <Option value="Dushanbe">Dushanbe</Option>
          <Option value="Bokhtar">Bokhtar</Option>
        </Select>
      </Modal>

      <Modal
        title="User Profile"
        open={isInfoModalOpen}
        onCancel={handleCancelInfo}
        footer={null}
        width={400}
        height={500}
        style={{ top: 20, right: 0, position: 'fixed', marginLeft: 'auto' }}
        bodyStyle={{ padding: '24px',height:'500px' }}
        maskClosable={true}
      >
        <p><b>Name:</b> {editX.name}</p>
        <p><b>Email:</b> {editX.email}</p>
        <p><b>City:</b> {editX.city}</p>
        <p><b>Phone:</b> {editX.phone}</p>
        <p><b>Status:</b> {editX.status ? 'Active' : 'Inactive'}</p>
      </Modal>
    </>
  );
};

export default MyTable;
