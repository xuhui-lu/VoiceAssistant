import React from 'react';
import {Layout, Col, Row, Icon} from 'antd';
import 'antd/dist/antd.css';
import Recorder from '../helpers/recorder';
import {setStore, setTranscript, setReservationData, emptyReservation} from '../actions/actions';
import {connect} from 'react-redux';
import {voicePrompt, weekArray} from "../helpers/tools";

const Header = Layout;

class Navigator extends React.Component {

    constructor(props) {
        super(props);

        this.init();

        this.myHeaders = new Headers();

        this.myHeaders.append('Content-Type', 'application/json;charset=utf-8');
        this.myHeaders.append('Authorization', 'Bearer MThhNjBmNjYtYTg1ZS00MGNiLThiNjEtYzliMTlmYzA2NTlkNTFmYzJiYjQtY2Mx');



        this.state = {
            recording: false,
            volume: 0,
            intervalId: 0,
            loading: false
        };

    }

    init = () => {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            this.audio_context = new AudioContext();
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({audio: true}, this.startUserMedia, function (e) {
            console.log('No live audio input: ' + e);
        });
    };

    startUserMedia = (stream) => {

        let input = this.audio_context.createMediaStreamSource(stream);


        console.log('Media stream created.');
        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //console.log('Input connected to audio context destination.');

        this.recorder = new Recorder(input, this.updateResult);

        console.log('Recorder initialised.');

        this.controlRecording();
    };


    startRecording = () => {
        if (!window.speechSynthesis.speaking) {
            let id = setInterval(this.getCurrentVolume, 1);
            this.setState({
                recording: true,
                intervalId: id
            });

            this.recorder && this.recorder.record();
            console.log('Recording...');
        }
        else {
            setTimeout(this.startRecording, 100);
        }
    };

    stopRecording = () => {
        clearInterval(this.state.intervalId);

        this.setState({
            recording: false,
            volume: 0,
        });

        this.recorder && this.recorder.stop();

        console.log('Stopped recording.');
        // create WAV download link using audio data blob
        // this.createDownloadLink();

        this.recorder.clear();
    };

    // createDownloadLink = () => {
    //     this.recorder && this.recorder.exportWAV(this.updateResult);
    // };

    updateResult = (blob) => {
        // var url = URL.createObjectURL(blob);
        // var li = document.createElement('li');
        // var au = document.createElement('audio');
        // var hf = document.createElement('a');
        //
        // au.controls = true;
        // au.src = url;
        // hf.href = url;
        // hf.download = new Date().toISOString() + '.wav';
        // hf.innerHTML = hf.download;
        //
        // hf.click();


        this.setState({
            loading: true
        });

        let data = new FormData();
        const {store, mode} = this.props;

        data.append('file', blob);
        data.append('store', JSON.stringify(store));

        fetch('http://localhost:5000/v1/interaction', {
            method: 'POST',
            mode: 'cors',
            body: data
        })
            .then((response) => response.json())
            .then((response) => {
                    if (response['ok'] && response['transcript'] !== null && response['transcript'] !== '') {
                        if (mode === 1 || response['store'].mode === 1) {
                            if (response['store'].mode === 2) this.recorder.timeGap = 15;
                            else if (mode === 2) this.recorder.timeGap = 5;

                            this.props.setStore(response['store']);
                            this.props.setTranscript(response['transcript']);
                            this.stopRecording();
                            voicePrompt(response['prompt']);
                            console.log(response['prompt'].length);
                            // setTimeout(this.startRecording, response['prompt'].length * 30);
                            this.startRecording();
                            console.log(response['store']['system_state']);
                        }
                    }

                    this.setState({
                        loading: false
                    });
                }
            )
            .catch((error) => {
                    console.log(error);
                }
            );
    };

    // updateReservation = () => {
    //     let headers = new Headers();
    //     let data = {};
    //
    //     const {reservationDay, reservationTime, reservationRec, receiverList} = this.props;
    //
    //     let date = new Date();
    //
    //     date.setFullYear(2018, 4, 1);
    //
    //     date.setDate(date.getDate() - date.getDay() + reservationDay);
    //
    //
    //     const reservationDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //
    //     headers.append('Content-Type', 'application/json;charset=utf-8');
    //     data["date"] = reservationDate;
    //     data["day"] = reservationDay;
    //     data["time"] = reservationTime;
    //     data["recipient"] = receiverList[reservationRec].title;

    //     fetch("http://localhost:5000/v1/reservation", {
    //         method: "POST",
    //         mode: "cors",
    //         headers: headers,
    //         body: JSON.stringify(data)
    //     })
    //         .then((response) => response.json())
    //         .then((response) => {
    //             if (response.ok) {
    //                 voicePrompt('New Reservation has been added successfully!');
    //                 this.props.setReservationData(response['data']);
    //
    //                 let data = {
    //                     title: "appointment at " + weekArray[reservationDay] + " " + reservationTime + ":00"
    //                 };
    //
    //                 fetch("https://api.ciscospark.com/v1/rooms", {
    //                     method: 'POST',
    //                     headers: this.botHeaders,
    //                     body: JSON.stringify(data)
    //                 })
    //                     .then((response) => response.json())
    //                     .then((response) => {
    //                         let roomId = response['id'];
    //
    //                         fetch("https://api.ciscospark.com/v1/memberships?roomId=" + receiverList[reservationRec].id, {
    //                             method: 'GET',
    //                             headers: this.myHeaders,
    //                         })
    //                             .then((response) => response.json())
    //                             .then((response) => {
    //                                 let person1 = response['items'][0].personId;
    //                                 let person2 = response['items'][1].personId;
    //
    //                                 data = {
    //                                     roomId: roomId,
    //                                     personId: person1
    //                                 };
    //
    //                                 console.log(data);
    //                                 console.log(response);
    //
    //                                 fetch("https://api.ciscospark.com/v1/memberships", {
    //                                     method: 'POST',
    //                                     headers: this.botHeaders,
    //                                     body: JSON.stringify(data)
    //                                 })
    //                                     .then((response) => response.json())
    //                                     .then((response) => {
    //                                         console.log(response);
    //                                         // if (response.ok) message.success('The Message has been sent successfully!');
    //                                     });
    //
    //                                 data = {
    //                                     roomId: roomId,
    //                                     personId: person2
    //                                 };
    //
    //                                 fetch("https://api.ciscospark.com/v1/memberships", {
    //                                     method: 'POST',
    //                                     headers: this.botHeaders,
    //                                     body: JSON.stringify(data)
    //                                 })
    //                                     .then((response) => response.json())
    //                                     .then((response) => {
    //                                         console.log(response);
    //                                         // if (response.ok) message.success('The Message has been sent successfully!');
    //                                     });
    //
    //                                 data = {
    //                                     roomId: roomId,
    //                                     text: "Micheal just made an appointment with you at " + weekArray[reservationDay] + " " + reservationTime + ":00!"
    //                                 };
    //
    //                                 fetch("https://api.ciscospark.com/v1/messages", {
    //                                     method: 'POST',
    //                                     headers: this.botHeaders,
    //                                     body: JSON.stringify(data)
    //                                 }).then((response) => {
    //                                     console.log(response);
    //                                     this.props.emptyReservation();
    //                                 });
    //                             });
    //                     });
    //
    //             }
    //             else {
    //                 let utterThis = new window.SpeechSynthesisUtterance('The time slot is used or invalid!');
    //                 window.speechSynthesis.speak(utterThis);
    //             }
    //         });
    // };

    controlRecording = () => {
        const {recording} = this.state;

        if (!recording) {
            this.startRecording();
        }
        else {
            this.stopRecording();
        }
    };

    getCurrentVolume = () => {
        if (this.recorder.currentVolume > 10) {
            this.setState({
                volume: this.recorder.currentVolume - 10
            });
        }
        else if (this.state.volume !== 0) {
            this.setState({
                volume: 0
            });
        }
    };

    render() {
        const {volume, loading} = this.state;

        let headerStyle = {
            position: 'fixed',
            width: '100%',
            backgroundColor: this.props.store.mode === 2 ? '#ff9900' : this.props.store.mode === 1 ? '#14BC14' : '#001529'
        };


        let volumeBar = '';

        if (volume > 0) {
            for (var i = 0; i < volume / 2; i++) {
                volumeBar += 'l ';
                if (volumeBar.length > 100) break;
            }
        }


        return (
            <Header className='App-navigator' style={headerStyle}>
                <Row>
                    <Col span={10} style={{textAlign: 'left'}}><h1 style={{color: '#ffff'}}>{volumeBar}</h1></Col>
                    <Col span={4}>
                        {/*<Button onClick={this.controlRecording} type='primary' shape='circle' size='large'*/}
                        {/*loading={recording} icon='phone'/>*/}
                        {loading ? <Icon type="loading" style={{fontSize: 20}}/> :
                            <Icon type="user" style={{fontSize: 20}}/>}
                    </Col>
                    <Col span={10} style={{textAlign: 'right'}}><h1 style={{color: '#ffff'}}>{volumeBar}</h1></Col>
                </Row>
            </Header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mode: state.store.mode,
        store: state.store,
        reservationDay: state.store.reservation_day,
        reservationTime: state.store.reservation_time,
        reservationRec: state.store.reservation_recipient,
        receiverList: state.store.receiver_list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setStore: (store) => {
            dispatch(setStore(store))
        },
        setTranscript: (transcript) => {
            dispatch(setTranscript(transcript))
        },
        setReservationData: (reservationData) => {
            dispatch(setReservationData(reservationData))
        },
        emptyReservation: () => {
            dispatch(emptyReservation());
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Navigator);

