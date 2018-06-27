import React from 'react';
import {Layout} from 'antd';
import 'antd/dist/antd.css';

class WelcomePage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
          records: 0,
            date: new Date().toLocaleTimeString() + ',' + new Date().toLocaleDateString()
        };
    }

    handleSignShow = () => {
        const {records} = this.state;

        if (records < 32) {
            this.setState({
                records: records + 1
            });
        }
    };

    handleTimeRefresh = () => {
        this.setState({
            date: new Date().toLocaleTimeString() + ',' + new Date().toLocaleDateString()
        });
    };

    componentWillMount() {
        if (this.state.records < 32) {
            setInterval(this.handleSignShow, 300);
        }

        setInterval(this.handleTimeRefresh, 100);
    }

    render() {
        const {records, date} = this.state;

        return (
            <Layout style={{marginTop: '40px', marginLeft: '10%', marginBottom: '100px', padding: '40px', backgroundColor: '#ffff', width: '80%', borderRadius: '10px'}}>
                <div style={{width: '100%', float: "left"}}>
                    <div key='1' style={{MozUserSelect: 'None', WebkitUserSelect: 'None', fontFamily: 'Lucida Family', fontSize: 27, opacity: records < 8? records / 8 : 1}}>
                        Welcome you to use the Cisco Doctor Voice-controlled Assistant today!
                    </div>
                    &nbsp;
                    <div key='2' style={{MozUserSelect: 'None', WebkitUserSelect: 'None', fontFamily: 'Lucida Family', fontSize: 30, opacity: records < 16? (records - 8) / 8 : 1}}>
                        Today is {date}.
                    </div>
                    &nbsp;
                    <div key='3' style={{MozUserSelect: 'None', WebkitUserSelect: 'None', fontFamily: 'Lucida Family', fontSize: 35, opacity: records < 24? (records - 16) / 8 : 1}}>
                        Up to now, we already have xxx users...
                    </div>
                    &nbsp;
                    <div key='4' style={{MozUserSelect: 'None', WebkitUserSelect: 'None', fontFamily: 'Lucida Family', fontSize: 40, opacity: records < 32? (records - 24) / 8 : 1}}>
                        Hope you can have a happy journey here!
                    </div>
                </div>
            </Layout>
        );
    }

}

export default WelcomePage;