import React from 'react';
import {Layout, Card, Col, Row, Icon, List, Modal, Table} from 'antd'

const {Sider} = Layout;
const {Meta} = Card;

const allergic_columns = [{
    title: 'Substance',
    dataIndex: 'substance',
    key: 'substance'
}, {
    title: 'Recorded Date',
    dataIndex: 'recordedDate',
    key: 'recordedDate',
}, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
}, {
    title: 'Criticality',
    dataIndex: 'criticality',
    key: 'criticality',
}, {
    title: 'Recorder',
    dataIndex: 'recorder',
    key: 'recorder',
}, {
    title: 'Reaction',
    dataIndex: 'reaction',
    key: 'reaction',
},
    {
    title: 'Note',
    dataIndex: 'note',
    key: 'note',
}];

const allergic_data = [{
    key: '1',
    substance: 'PENICILLIN G',
    recordedDate: '2015-08-24T23:11:36Z',
    status: 'confirmed',
    criticality: 'CRITL',
    recorder: 'MOORE, SEAN',
    reaction: 'Hive',
    note: 'Severity low enough to be prescribed if needed.'
}, {
    key: '2',
    substance: 'SHELLFISH-DERIVED PRODUCTS',
    recordedDate: '2015-11-07T20:55:10Z',
    status: 'confirmed',
    criticality: 'CRITL',
    recorder: 'MOORE, SEAN',
    reaction: 'Itching',
    note: ''
}, {
    key: '3',
    substance: 'STRAWBERRY',
    recordedDate: '2015-11-07T20:56:34Z',
    status: 'confirmed',
    criticality: 'CRITL',
    recorder: 'MOORE, SEAN',
    reaction: 'Anaphylaxis',
    note: ''
}];

const condition_columns = [{
    title: 'Condition',
    dataIndex: 'condition',
    key: 'condition'
}, {
    title: 'Recorded Date',
    dataIndex: 'recordedDate',
    key: 'recordedDate',
}, {
    title: 'ClinicalStatus',
    dataIndex: 'clinicalStatus',
    key: 'clinicalStatus',
}, {
    title: 'VerificationStatus',
    dataIndex: 'verificationStatus',
    key: 'verificationStatus',
}, {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
}, {
    title: 'Recorder',
    dataIndex: 'recorder',
    key: 'recorder',
}, {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
}];

const condition_data = [{
    key: '1',
    condition: 'Agoraphobia',
    recordedDate: '2015-08-24',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'diagnosis',
    recorder: 'MOORE, SEAN',
    severity: 'medium'
}, {
    key: '2',
    condition: 'Chronic cough',
    recordedDate: '2015-08-24',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'diagnosis',
    recorder: 'MOORE, SEAN',
    severity: 'medium'
}, {
    key: '3',
    condition: 'Asthma',
    recordedDate: '2015-08-24',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'Diagnosis - Health Concern',
    recorder: 'MOORE, SEAN',
    severity: 'low'
}, {
    key: '4',
    condition: 'Hemoglobin A1c above reference range',
    recordedDate: '2016-02-11',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'diagnosis',
    recorder: 'MOORE, SEAN',
    severity: 'medium'
}, {
    key: '5',
    condition: 'TB (pulmonary tuberculosis)',
    recordedDate: '2016-02-11',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'diagnosis',
    recorder: 'MOORE, SEAN',
    severity: 'medium'
}, {
    key: '6',
    condition: 'Zika virus disease',
    recordedDate: '2016-04-23',
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'diagnosis',
    recorder: 'MOORE, SEAN',
    severity: 'medium'
}];


const allergic_list = [
    'PENICILLIN G',
    'SHELLFISH-DERIVED PRODUCTS',
    'STRAWBERRY'
];

const condition_list = [
    'Agoraphobia',
    'Chronic cough',
    'Asthma',
    'Hemoglobin A1c above reference range',
    'TB (pulmonary tuberculosis)',
    'Zika virus disease'
];

class PatientInfoPage extends React.Component {

    render() {
        const {allergicResponseVisible, conditionHistoryVisible, patientInfoVisible} = this.props;

        return (
            <Sider
                // collapsible
                collapsed={!patientInfoVisible}
                collapsedWidth={0}
                style={{backgroundColor: '#fff'}} width={350} >
                <Card
                    style={{width: '100%'}}
                >
                    <Meta
                        avatar={
                                <img width={120}
                                     src="avatar2.png" style={{
                                    borderRadius: '50%', width: '120px'
                                     }} alt="Avatar"/>
                            }
                        title={
                            <Row><span style={{fontSize: '20px'}}>Mark Barrasso</span></Row>
                        }
                        description={
                            <div>
                                <span style={{fontSize: '12px', textAlign: 'left'}}>
                                    I have suffered from fever in a long time run, and some factors prevent me from using some effective medicine.
                                </span>
                            </div>
                        }
                    />
                </Card>
                <Card>
                    <Row style={{textAlign: 'left', fontSize: '20px'}}>
                        <Col span={4}><img src='ico-sex.png' alt="sex-icon" height={20}/></Col>
                        <Col span={20}>
                            <Row>
                                <span style={{fontSize: '12px'}}>sex</span>
                            </Row>
                            <Row>
                                <span style={{fontSize: '16px'}}>male</span>
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
                                <span style={{fontSize: '16px'}}>
                                    320 Crescent Village Cir.
                                    <br/>
                                    San Jose, CA 95134</span>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row>
                    </Row>
                    <List
                        size="small"
                        header={<div>allergic responses:</div>}
                        bordered
                        dataSource={allergic_list}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                    />
                    <br/>
                {/*</Card>*/}
                {/*<Card>*/}
                    <Row>
                    </Row>
                    <List
                        size="small"
                        header={<div>condition history:</div>}
                        bordered
                        dataSource={condition_list}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                    />
                </Card>
                <Modal
                    title="details of allergic responses"
                    visible={allergicResponseVisible}
                    width={1200}
                >
                    <Table columns={allergic_columns} dataSource={allergic_data} />
                </Modal>
                <Modal
                    title="details of condition history"
                    visible={conditionHistoryVisible}
                    width={1200}
                >
                    <Table columns={condition_columns} dataSource={condition_data} />
                </Modal>
            </Sider>
        );
    }
}

export default PatientInfoPage;