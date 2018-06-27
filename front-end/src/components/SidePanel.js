import React from 'react'
import {Layout, Card, Col, Row, Icon} from 'antd'
import SiteMap from './SiteMap';

const {Meta} = Card;
const {Sider} = Layout;

class SidePanel extends React.Component {

    render() {
        return (
            <Sider style={{backgroundColor: '#fff'}} width={350}>
                <Card
                    cover={<img width={120}
                                src="avatar1.png" style={{
                        borderRadius: '50%', width: '120px', margin: 'auto',
                        marginTop: '20px'
                    }} alt="Avatar"/>}
                    style={{width: '100%'}}
                >
                    <Meta
                        title={
                            <div>
                                <Row><span style={{fontSize: '25px'}}>Xuhui Lu</span></Row>
                                <Row><span style={{color: '#BDBDBD'}}>San Jose</span></Row>
                            </div>}
                        description={<div>

                        </div>}
                    />
                </Card>
                <Card>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}>
                            <Icon type="user"/>
                        </Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>position</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>software engineer</span>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}>
                            <Icon type="team"/>
                        </Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>department</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>CTAO</span>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}><Icon type='contacts'/></Col>
                        <Col span={20}>
                            <Row style={{textAlign: 'left', fontSize: '12px'}}>
                                Contact Methods:
                            </Row>
                            <Row>
                                <Col span={4}/>
                                <Col span={6}>
                                    <img width="50%" src="contact-jabber-hover.png" alt="jabber"/>
                                </Col>
                                <Col span={1}/>
                                <Col span={6}>
                                    <img width="50%" src="contact-deskphone-hover.png" alt="deskphone"/>
                                </Col>
                                <Col span={1}/>
                                <Col span={6}>
                                    <img width="50%" src="contact-email-hover.png" alt="email"/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}><Icon type='phone'/></Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>phone</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>+1 408 324 4784</span>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}><Icon type='mail'/></Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>e-mail</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>xuhlu@cisco.com</span>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}><Icon type='environment'/></Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>address</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>Cisco Building 16
                                    <br/>
                                    3700 Cisco Way
                                    <br/>
                                    San Jose, CA 95134</span>
                            </Row>
                        </Col>
                    </Row>
                    <br/>
                </Card>
                {/*<Card>*/}
                <SiteMap/>
                {/*</Card>*/}
            </Sider>
        );
    }
}

export default SidePanel;