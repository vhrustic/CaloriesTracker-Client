import { Bar, Column } from '@ant-design/plots';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';

import { useBoundStore } from '../../store/store';
import './Reports.scss';

function Reports() {
  const getTotalEntriesReportData = useBoundStore((state) => state.getTotalEntriesReportData);
  const getAverageCaloriesReportData = useBoundStore((state) => state.getAverageCaloriesReportData);
  const averageCaloriesReport = useBoundStore((state) => state.averageCaloriesReport);
  const totalEntriesReport = useBoundStore((state) => state.totalEntriesReport);
  const [loadingData, setLoadingData] = useState(false);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      if (!totalEntriesReport) {
        await getTotalEntriesReportData();
      }
      if (!averageCaloriesReport) {
        await getAverageCaloriesReportData();
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const averageCaloriesConfig = {
    data: averageCaloriesReport || [],
    xField: 'averageCalories',
    yField: 'email',
    xAxis: { title: { text: 'Average Calories' } },
    yAxis: { title: { text: 'User' } },
    label: {
      position: 'middle'
    }
  };

  const totalEntriesConfig = {
    data: totalEntriesReport
      ? [
          { label: 'Two weeks ago', value: totalEntriesReport.twoWeeksBefore },
          { label: 'Last 7 days', value: totalEntriesReport.last7Days }
        ]
      : [],
    xField: 'label',
    yField: 'value',
    xAxis: { title: { text: 'Period' } },
    yAxis: { title: { text: 'Total Entries' } },
    label: {
      position: 'middle'
    }
  };

  return (
    <div className="reports">
      <Row>
        <h1>Reports</h1>
      </Row>
      <Row gutter={36}>
        <Col span={12}>
          <Card>
            <h2>Number of added entries in recent period</h2>
            <Column {...totalEntriesConfig} loading={loadingData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <h2>Average number of calories added per user for the last 7 days</h2>
            <Bar {...averageCaloriesConfig} loading={loadingData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Reports;
