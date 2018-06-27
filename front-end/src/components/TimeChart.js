import { registerShape, Chart, Axis, Tooltip, Coord, Polygon } from 'viser-react';
import * as React from 'react';

registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
        if (cfg.points && cfg.points.length) {
            const attrs: any = {
                stroke: '#fff',
                lineWidth: 1,
                fill: cfg.color,
                fillOpacity: cfg.opacity,
            };
            const points = cfg.points;
            const path = [
                [ 'M', points[0].x, points[0].y ],
                [ 'L', points[1].x, points[1].y ],
                [ 'L', points[2].x, points[2].y ],
                [ 'L', points[3].x, points[3].y ],
                [ 'Z' ]
            ];
            attrs.path = this.parsePath(path);
            const polygon = container.addShape('path', {
                attrs
            });

            // if (cfg.origin._origin.lastWeek) {
            //     const linePath = [
            //         [ 'M', points[2].x, points[2].y ],
            //         [ 'L', points[3].x, points[3].y ],
            //     ];
            //     // 最后一周的多边形添加右侧边框
            //     container.addShape('path', {
            //         zIndex: 1,
            //         attrs: {
            //             path: this.parsePath(linePath),
            //             lineWidth: 1,
            //             stroke: '#404040'
            //         }
            //     });
            //     if (cfg.origin._origin.lastDay) {
            //         container.addShape('path', {
            //             zIndex: 1,
            //             attrs: {
            //                 path: this.parsePath([
            //                     [ 'M', points[1].x, points[1].y ],
            //                     [ 'L', points[2].x, points[2].y ],
            //                 ]),
            //                 lineWidth: 1,
            //                 stroke: '#404040'
            //             }
            //         });
            //     }
            // }
            container.sort();
            return polygon;
        }
    }
});



const scale = [{
    dataKey: 'day',
    type: 'cat',
    values: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.' ]
}, {
    dataKey: 'time',
    type: 'cat'
}, {
    dataKey: 'commits',
    sync: true
}];

const axis1Opts: any = {
    dataKey: 'time',
    position: 'top',
    tickLine: null,
    line: null,
    label: {
        offset: 12,
        textStyle: {
            fontSize: 12,
            fill: '#666',
            textBaseline: 'top'
        },
        formatter: (val: any) => {
            if (parseInt(val, 10) % 2 === 0) {
                return val + ":00";
            }

            return '';
        }
    }
};

const axis2Opts: any = {
    dataKey: 'day',
    grid: null,
};

const tooltipOpts: any = {
    title: 'date',
    items: ['recepient']
};

class TimeChart extends React.Component {
    // state = {
    //     data: [],
    // };


    render() {
        // const { data } = this.state;
        console.log(this.props.data);

        return (
            <div>
                <Chart forceFit height={400} data={this.props.data} scale={scale}>
                    <Tooltip {...tooltipOpts} />
                    <Axis {...axis1Opts}/>
                    <Axis {...axis2Opts}/>
                    <Coord type="rect" direction="TL"/>
                    <Polygon color={['commits', '#BAE7FF-#1890FF-#0050B3']} position="time*day*date" tooltip={['recipient', (recipient) => {
                        return {
                            name: "appointment",
                            value: recipient
                        };
                    }]} shape="boundary-polygon"/>
                </Chart>
            </div>
        );
    }
}

export default TimeChart;

