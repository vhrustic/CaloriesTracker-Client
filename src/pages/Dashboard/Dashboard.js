import { FilterOutlined, InfoCircleOutlined, PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Popover, Row, Space, Switch, Table, Tag } from 'antd';
import { format, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';

import AddFoodEntryModal from '../../components/AddFoodEntryModal/AddFoodEntryModal';
import { useBoundStore } from '../../store/store';
import './Dashboard.scss';

function Dashboard() {
  const getFoodEntries = useBoundStore((state) => state.getFoodEntries);
  const getFoodEntriesTotals = useBoundStore((state) => state.getFoodEntriesTotals);
  const addEntry = useBoundStore((state) => state.addEntry);
  const foodEntries = useBoundStore((state) => state.foodEntries);
  const userInfo = useBoundStore((state) => state.userInfo);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [showOnlyLimitReached, setShowOnlyLimitReached] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);
  const [dataSource, setDataSource] = useState(foodEntries);
  const [showAddNewModal, setShowAddNewModal] = useState(false);

  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        setFetchingEntries(true);
        await getFoodEntries();
      } finally {
        setFetchingEntries(false);
      }
    };
    if (!foodEntries) {
      fetchFoodEntries();
    }
  }, []);

  useEffect(() => {
    if (foodEntries) {
      setDataSource(foodEntries);
    }
  }, [foodEntries]);

  const handleAddNewEntry = async (data) => {
    setShowAddNewModal(false);
    await addEntry({ ...data, takenAt: data.takenAt.toISOString() });
  };

  const handleShowOnlyLimitReached = async (enable) => {
    setFetchingEntries(true);
    try {
      if (enable) {
        setShowOnlyLimitReached(true);
        await getFoodEntriesTotals();
      } else {
        setShowOnlyLimitReached(false);
        await getFoodEntries();
      }
    } finally {
      setFetchingEntries(false);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (
      <div className="dashboard__filter-dropdown">
        <div>
          <DatePicker.RangePicker
            value={selectedKeys}
            onChange={(range) => {
              setSelectedKeys(range);
              setDateRangeFilter(range);
            }}
          />
        </div>
        <Space>
          <Button
            onClick={() => {
              clearFilters();
              setSelectedKeys(null);
              confirm({ closeDropdown: true });
            }}
            size="small"
          >
            Reset
          </Button>
          <Button
            type="primary"
            size="small"
            disabled={!selectedKeys?.length}
            onClick={() => {
              confirm({ closeDropdown: true });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (_value, record) =>
      isWithinInterval(new Date(record[dataIndex]), {
        start: dateRangeFilter[0].toDate(),
        end: dateRangeFilter[1].toDate()
      })
  });

  const getColumns = () => {
    const columns = [
      {
        title: 'Food',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        width: '25%'
      },
      {
        title: 'Calories',
        name: 'calories',
        dataIndex: 'calories',
        sorter: (a, b) => a.calories - b.calories,
        width: '25%'
      },
      {
        title: 'Date',
        name: 'takenAt',
        dataIndex: 'takenAt',
        render: (_text, record) => format(new Date(record.takenAt), 'MMM d, yyyy hh:mm a'),
        sorter: (a, b) => new Date(a.takenAt) - new Date(b.takenAt),
        width: '25%',
        ...getColumnSearchProps('takenAt')
      }
    ];

    if (showOnlyLimitReached && !fetchingEntries) {
      columns.push({
        title: (
          <span>
            Daily Total &nbsp;
            <Popover content={`Your daily limit is ${userInfo.settings.caloriesLimit} calories`}>
              <InfoCircleOutlined />
            </Popover>
          </span>
        ),
        name: 'dailyTotal',
        dataIndex: 'dailyTotal',
        render: (_text, record) => (
          <span>
            {record.dailyTotal}
            {record.dailyTotal > userInfo.settings.caloriesLimit && (
              <Tag color="orange" className="dashboard__tag">
                <WarningOutlined />
                &nbsp; Limit Reached
              </Tag>
            )}
          </span>
        ),
        sorter: (a, b) => a.dailyTotal - b.dailyTotal,
        width: '25%'
      });
    }

    return columns;
  };

  return (
    <div className="dashboard">
      <Row>
        <h1>Food entries</h1>
      </Row>
      <Row className="dashboard__header">
        <Col span={12}>
          <Form.Item label="Only days when limit is reached">
            <Switch checked={showOnlyLimitReached} onChange={handleShowOnlyLimitReached}></Switch>
          </Form.Item>
        </Col>
        <Col span={12} align="right">
          <Button type="primary" size="large" onClick={() => setShowAddNewModal(true)}>
            <PlusCircleOutlined /> Add new
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={getColumns()}
            dataSource={dataSource}
            loading={fetchingEntries}
            rowKey="id"
            pagination={false}
            showSorterTooltip={false}
          />
        </Col>
      </Row>

      <AddFoodEntryModal open={showAddNewModal} onCancel={() => setShowAddNewModal(false)} onOk={handleAddNewEntry} />
    </div>
  );
}

export default Dashboard;
