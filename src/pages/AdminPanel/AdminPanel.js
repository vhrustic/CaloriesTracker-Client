import { DeleteOutlined, EditOutlined, LineChartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Table } from 'antd';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  adminAddFoodEntry,
  adminDeleteFoodEntry,
  adminGetFoodEntry,
  adminUpdateFoodEntry
} from '../../api/food-entry-api';
import AddFoodEntryModal from '../../components/AddFoodEntryModal/AddFoodEntryModal';
import routes from '../../config/routes';
import { useBoundStore } from '../../store/store';
import './AdminPanel.scss';

function AdminPanel() {
  const getAllFoodEntries = useBoundStore((state) => state.getAllFoodEntries);
  const allFoodEntries = useBoundStore((state) => state.allFoodEntries);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (!allFoodEntries) {
      fetchFoodEntries({ page: currentPage });
    }
  }, []);

  const fetchFoodEntries = async (pagination) => {
    try {
      setFetchingEntries(true);
      await getAllFoodEntries(pagination);
    } finally {
      setFetchingEntries(false);
    }
  };

  const handleModalOk = async (data, isEdit) => {
    setShowAddNewModal(false);
    if (isEdit) {
      await adminUpdateFoodEntry(data.id, { ...data, id: undefined });
    } else {
      await adminAddFoodEntry({ ...data, takenAt: data.takenAt.toISOString() });
    }
    setEditingEntry(null);
    await fetchFoodEntries({ page: currentPage });
  };

  const handleHideAddModal = () => {
    setShowAddNewModal(false);
    setEditingEntry(null);
  };

  const handleEditEntry = async (id) => {
    const { data } = await adminGetFoodEntry(id);
    setShowAddNewModal(true);
    setEditingEntry(data);
  };

  const handleDeleteEntry = (entry) => {
    return Modal.confirm({
      title: 'Delete record',
      content: `Are you sure you want to delete food entry: ${entry.name} (${entry.calories}kcal)?`,
      onOk: async () => {
        await adminDeleteFoodEntry(entry.id);
        fetchFoodEntries({ page: currentPage });
      }
    });
  };

  const onPageChange = (page) => {
    fetchFoodEntries({ page });
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
      },
      {
        title: 'User',
        dataIndex: 'user.email',
        key: 'user.email',
        render: (_text, record) => record.user.email,
        width: '20%'
      },
      {
        title: 'Food',
        dataIndex: 'name',
        key: 'name',
        width: '20%'
      },
      {
        title: 'Calories',
        name: 'calories',
        dataIndex: 'calories',
        width: '20%'
      },
      {
        title: 'Date',
        name: 'takenAt',
        dataIndex: 'takenAt',
        render: (_text, record) => format(new Date(record.takenAt), 'MMM d, yyyy hh:mm a'),
        width: '20%'
      },
      {
        title: 'Actions',
        name: 'actions',
        width: '10%',
        render: (_text, record) => (
          <Space>
            <Button size="small" onClick={() => handleEditEntry(record.id)}>
              <EditOutlined />
            </Button>
            <Button size="small" onClick={() => handleDeleteEntry(record)}>
              <DeleteOutlined />
            </Button>
          </Space>
        )
      }
    ];

    return columns;
  };

  return (
    <div className="admin-panel">
      <Row className="admin-panel__header">
        <Col span={12}>
          <h1>Food entries</h1>
        </Col>
        <Col span={12} align="right">
          <Button type="primary" size="large" onClick={() => setShowAddNewModal(true)}>
            <PlusCircleOutlined /> Add new
          </Button>
        </Col>
      </Row>
      <Row className="admin-panel__reports-link">
        <Link to={routes(true).reports.path}>
          <LineChartOutlined /> &nbsp;
          <strong>Check the reports</strong>
        </Link>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={getColumns()}
            dataSource={allFoodEntries?.items}
            loading={fetchingEntries}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: allFoodEntries?.meta.itemsPerPage,
              total: allFoodEntries?.meta.totalItems
            }}
            onChange={(newPagination) => {
              if (currentPage !== newPagination.current) {
                setCurrentPage(newPagination.current);
                onPageChange(newPagination.current);
              }
            }}
            showSorterTooltip={false}
          />
        </Col>
      </Row>

      <AddFoodEntryModal
        isAdmin
        open={showAddNewModal}
        onCancel={handleHideAddModal}
        onOk={handleModalOk}
        foodEntry={editingEntry}
      />
    </div>
  );
}

export default AdminPanel;
