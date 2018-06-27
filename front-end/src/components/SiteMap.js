import React from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class SiteMap extends React.Component {

    static defaultProps = {
        center: {
            lat: 37.4093039000,
            lng: -121.9260668000
        },
        zoom: 17
    };

    render() {
        return (
        <div style={{ height: '180px', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyCVfM1eK_mUqdLqXuxDHjgfzlq2nU6nlms'}}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
            >
                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text={'Kreyser Avrora'}
                />
            </GoogleMapReact>
        </div>
        );
    }
}

export default SiteMap;