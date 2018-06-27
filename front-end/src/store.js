import { createStore, applyMiddleware} from 'redux'
import {logger} from 'redux-logger'
import reducer from "./reducers/reducer";


export default createStore(
    reducer,
    {
        transcript: '',
        reservation_data: [],
        store: {
            message_list: [],
            mode: 0,
            page: 0,
            max_page: 0,
            system_state: 'initial_state',
            reservation_visible: false,
            allergic_response_visible: false,
            condition_history_visible: false,
            patient_info_visible: false,
            preview_visible: false,
            comment_visible: false,
            preview_image_num: null,
            reservation_day: null,
            reservation_time: null,
            reservation_recipient: null,
            flag: true,
            pos_x: 0,
            pos_y: 0,
            receiver_list: [],
            total_images: 4
        }
    },
    applyMiddleware(logger)
);