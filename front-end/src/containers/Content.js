import React from 'react';
import {Layout, Input, Row, Col, Modal, Table} from 'antd';
import 'antd/dist/antd.css';
import WelcomePage from "../components/WelcomePage";
import ScheduleTable from "../components/ScheduleTable";
import TimeChart from "../components/TimeChart";
import SidePanel from "../components/SidePanel";
import PatientInfoPage from "../components/PatientInfoPage";
import {weekArray} from '../helpers/tools';
import {connect} from 'react-redux';
import {setReceiverList, setReservationData, setStore} from '../actions/actions'
import ChatRoom from "../components/ChatRoom";
import ImagePreviewPage  from "../components/ImagePreviewPage"


const columns = [{
    title: "ID",
    dataIndex: "id",
    key: "id"
},
    {
        title: "Title",
        dataIndex: "title",
        key: "title"
    }
    ];

const imageState = new Set(['image_wall', 'preview', 'image_num', 'preview_comment', 'add_comment']);

class Content extends React.Component {

    constructor(props) {
        super(props);

        this.init();

    }

    init = () => {
        this.myHeaders = new Headers();

        this.myHeaders.append('Content-Type', 'application/json;charset=utf-8');
        this.myHeaders.append('Authorization', 'Bearer MThhNjBmNjYtYTg1ZS00MGNiLThiNjEtYzliMTlmYzA2NTlkNTFmYzJiYjQtY2Mx');

        fetch("https://api.ciscospark.com/v1/rooms", {
            method: 'GET',
            headers: this.myHeaders,
        }).then((response) => response.json())
            .then((response) => {
                this.props.setReceiverList(response.items);
            });
    };

    getReservationData = () => {
        let date = new Date();

        date.setFullYear(2018, 4, 1);

        let start_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let day = date.getDay();

        fetch('http://localhost:5000/v1/reservation?start_date=' + start_date + "&day=" + day, {
            method: 'GET',
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.ok) {
                    this.props.setReservationData(response['items']);
                }
            });
    };



    componentWillMount() {
        this.getReservationData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.store['system_state'] === 'confirm_reservation' && nextProps.store['system_state'] === 'reservation') {
            this.getReservationData();
        }
    }


    render() {
        const {receiverList, page, reservationDay, reservationTime, reservationRec, reservationVisible,
            reservationData, mode, allergicResponseVisible, conditionHistoryVisible, patientInfoVisible,
            systemState, messageList, previewVisible, previewImageNum, commentVisible, store} = this.props;


        let content;
        // let contentStyle = {width: '80%', marginTop: '40px', marginBottom: '50px'};
        let receivers = [];

        for (let item in receiverList) {
            receivers.push({key: item, id: item, title: receiverList[item].title});
        }

        let list = <Table columns={columns} dataSource={receivers} pagination={{pageSize: 10, current: page + 1}}
                          size="middle"/>;

        if (mode > 0) {
            if (systemState === 'chat_record') content = <ChatRoom messageList={messageList}/>;
            else if (imageState.has(systemState))
                content = <ImagePreviewPage previewVisible={previewVisible} previewImageNum={previewImageNum}
                                            commentVisible={commentVisible} setStore={this.props.setStore}
                                            store={store}/>;
            else content = (
                <Layout style={{padding: '0 30px 0 30px'}}>
                    <ScheduleTable/>
                </Layout>
            );
        }
        else content = <WelcomePage/>;

        return (
            <Layout className="App-content">
                <SidePanel/>
                {content}
                <PatientInfoPage allergicResponseVisible={allergicResponseVisible} conditionHistoryVisible={conditionHistoryVisible}
                patientInfoVisible={patientInfoVisible}/>
                <Modal
                    title="Reservation of this week"
                    width={950}
                    visible={reservationVisible}
                >
                    <Row>
                        <Col span={17}><TimeChart data={reservationData}/>
                            <div style={{width: '50%', marginLeft: '12%'}}>
                                day:<Input disabled={true}
                                           value={reservationDay === null ? "" : weekArray[reservationDay]}/>
                                time:<Input disabled={true}
                                            value={reservationTime === null ? "" : reservationTime + ":00"}/>
                                recipient:<Input disabled={true}
                                                 value={reservationRec === null ? "" : receiverList[reservationRec].title}/>
                            </div>
                        </Col>
                        <Col span={7}>{list}</Col>
                    </Row>
                </Modal>
                <Modal
                    title="Your contact list"
                    visible={false}
                >
                    {list}
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        store: state.store,
        mode: state.store.mode,
        receiverList: state.store.receiver_list,
        page: state.store.page,
        contentType: state.store.content_type,
        reservationDay: state.store.reservation_day,
        reservationTime: state.store.reservation_time,
        reservationRec: state.store.reservation_recipient,
        reservationVisible: state.store.reservation_visible,
        allergicResponseVisible: state.store.allergic_response_visible,
        conditionHistoryVisible: state.store.condition_history_visible,
        previewVisible: state.store.preview_visible,
        previewImageNum: state.store.preview_image_num,
        patientInfoVisible: state.store.patient_info_visible,
        transcript: state.transcript,
        messageList: state.store.message_list,
        reservationData: state.reservation_data,
        systemState: state.store.system_state,
        commentVisible: state.store.comment_visible
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setReceiverList: (receiverList) => {
            dispatch(setReceiverList(receiverList));
        },
        setReservationData: (reservationData) => {
            dispatch(setReservationData(reservationData))
        },
        setStore: (store) => {
            dispatch(setStore(store))
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Content);