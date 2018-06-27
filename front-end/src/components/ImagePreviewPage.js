import React from 'react';
import {Card, Modal, Layout, Row, Col} from 'antd'

const ImageList = ['brain_MRI.jpg', 'breast_MRI.jpg', 'kidney_MRI.jpg', 'lung_MRI.jpg'];

class ImagePreviewPage extends React.Component {

    state = {
        commentList: []
    };

    getElementLeft = (element) => {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    };

    getElementTop = (element) => { //元素距顶部文档的距离
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    };

    showMousePosition = (e) => {
        const {store} = this.props;
        if (store['system_state'] === 'add_comment') {
            store['pos_x'] = e.offsetX;
            store['pos_y'] = e.offsetY;

            this.props.setStore(store);

            console.log(e.offsetX);
            console.log(e.offsetY);
        }
    };


    componentDidMount() {
        this.top = 0;
        this.left = 0;
        document.addEventListener ('mousemove', this.showMousePosition, false);
    }


    componentWillReceiveProps(nextProps) {

        const commentVisible = !this.props.commentVisible && nextProps.commentVisible;
        const commentAdded = (this.props.store['system_state'] === 'add_comment')
            && (nextProps.store['system_state'] === 'preview_comment')

        if (commentVisible || commentAdded) {
            const {previewImageNum} = this.props;
            const header = new Headers();

            header.append('Content-Type', 'application/json;charset=utf-8');


            fetch("http://localhost:5000/v1/comments/" + previewImageNum, {
                method: "GET",
                mode: "cors",
                headers: header
            })
                .then((response) => response.json())
                .then((response) => {
                    this.setState({
                        commentList: response['comment_list'],
                    });
                });
        }
    }


    render() {
        const {previewImageNum, previewVisible, commentVisible} = this.props;
        let commentElements = [];

        if (commentVisible) {
            const {commentList} = this.state;


            for (let i in commentList) {

                let x = commentList[i]['pos_x'];
                let y = commentList[i]['pos_y'];
                commentElements.push(
                    <span key={i} style={{position: 'absolute', left: x, top: y, color: '#ffff'}}>
                        {commentList[i]['content']}
                    </span>
                );
            }
        }

        return (
            <Layout style={{padding: '20px 30px 0 30px'}}>
                <Row>
                    <Col span={1}>
                        1.
                    </Col>
                    <Col span={7}>
                        <Card
                            hoverable
                            style={{width: '100%'}}>
                            <img width="100%" alt="example" src="brain_MRI.jpg"/>
                        </Card>
                    </Col>
                    <Col span={1}>
                        2.
                    </Col>
                    <Col span={7}>
                        <Card
                            hoverable
                            style={{width: '100%'}}>
                            <img width="100%" alt="example" src="breast_MRI.jpg"/>
                        </Card>
                    </Col>
                    <Col span={1}>
                        3.
                    </Col>
                    <Col span={7}>
                        <Card
                            hoverable
                            style={{width: '100%'}}>
                            <img width="100%" alt="example" src="kidney_MRI.jpg"/>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={1}>
                        4.
                    </Col>
                    <Col span={7}>
                        <Card
                            hoverable
                            style={{width: '100%'}}>
                            <img width="100%" alt="example" src="lung_MRI.jpg"/>
                        </Card>
                    </Col>
                </Row>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={800}>
                    <img alt="example" ref="previewImage" style={{width: '100%'}} src={ImageList[previewImageNum - 1]}/>
                    {commentElements}
                </Modal>
            </Layout>
        )
    }
}

export default ImagePreviewPage;