import React from 'react';
import {Layout} from 'antd';
import 'antd/dist/antd.css';
import 'isomorphic-fetch'
import Navigator from '../containers/Navigator'
import '../css/App.css';
import Content from '../containers/Content';

class App extends React.Component {

    constructor(props) {
        super(props);

        // this.init();
        //
        this.state = {
            //     recording: false,
        };
    }
    //
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.mode = )
    // }

    render() {
        return (
            <Layout className='App'>
                <Navigator/>
                <Content style={{width: '100%'}}/>
            </Layout>
        );
    }
}

export default App;