import React from 'react';
import {Calendar, Badge} from 'antd';
import 'antd/dist/antd.css';


class ScheduleTable extends React.Component {

    getListData = (value) => {
        let listData;
        switch (value.date()) {
            case 8:
                listData = [
                    { type: 'success', content: '7:00 Appointment with Qijiong Liu.' },
                    { type: 'success', content: '15:00 Appointment with Stats.' },
                ]; break;
            case 10:
                listData = [
                    { type: 'success', content: '7:00 Appointment with Mark Barrasso.' },
                    { type: 'success', content: '17：00 Appointment with Mark Barrasso.' },
                    { type: 'error', content: '12:00 Appointment cancelled.' },
                ]; break;
            case 15:
                listData = [
                    { type: 'success', content: '9:00 Event in building 16.' },
                    { type: 'success', content: '13:00 mid-year showcase presentation.' },
                    { type: 'error', content: '20:00 Appointment cancelled.' },
                    { type: 'error', content: '18:00 Appointment cancelled.' },
                ]; break;
            default:
        }
        return listData || [];
    };

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {
                    listData.map(item => (
                        <li key={item.content}>
                            <Badge status={item.type} text={item.content} />
                        </li>
                    ))
                }
            </ul>
        );
    };

    getMonthData = (value) => {
        if (value.month() === 8) {
            return 1394;
        }
    };

    monthCellRender = (value) => {
        const num = this.getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    render() {

        return (
            <Calendar style={{marginTop: '40px', backgroundColor: '#ffff'}} dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />
        )
    }
}

export default ScheduleTable;