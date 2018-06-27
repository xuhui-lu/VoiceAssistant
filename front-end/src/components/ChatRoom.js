import React from 'react';
import {Avatar, Row, Col, Card, Layout} from 'antd';
import 'antd/dist/antd.css';
import '../css/ChatRoom.css'

class ChatRoom extends React.Component {

    componentDidUpdate() {
        let page = document.getElementById('chatPage');

        page.scrollTop = page.scrollHeight;
    }

    render() {
        const {messageList} = this.props;
        let chatView = [];

        for (let i = 0; i < messageList.length; i++) {
            let item = messageList[i];
            if (item['role'] === 'doc') {
                chatView.push(
                    <Row key={i}>
                        <Col span={20}>
                            <div className="speech right">
                                {item['transcript']}
                            </div>
                        </Col>
                        <Col span={4}>
                            <Avatar style={{backgroundColor: '#87d068'}}>D</Avatar>
                        </Col>
                    </Row>
                );
            }

            else {
                chatView.push(
                    <Row key={i}>
                        <Col span={4}>
                            <Avatar style={{backgroundColor: '#f56a00'}}>P</Avatar>
                        </Col>
                        <Col span={20}>
                            <div className="speech left">
                                {item['transcript']}
                            </div>
                        </Col>
                    </Row>
                );
            }
        }

        return (
            <Layout style={{padding: '0 30px 0 30px'}}>
                <Card bodyStyle={{height: 600, padding: 10}} title={'MessageBox'}
                      style={{width: '100%', marginTop: '50px'}}>
                    <div id='chatPage' style={{height: '100%', overflow: 'scroll'}}>
                        {chatView}
                    </div>
                </Card>
            </Layout>
        );
    }

}

export default ChatRoom;