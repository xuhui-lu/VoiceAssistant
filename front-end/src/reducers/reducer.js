const reducer = (state = {
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
        flag: false,
        pos_x: 0,
        pos_y: 0,
        receiver_list: [],
        total_images: 4
    }
}, action) => {
    switch (action.type) {
        case 'TRANSCRIPT':
            state = {
                ...state,
                transcript: action.transcript
            };
            break;
        case 'STORE':
            state = {
                ...state,
                store: action.store
            };
            break;
        case 'RECEIVER_LIST':
            state = {
                ...state,
                store: {
                    ...state.store,
                    receiver_list: action.receiverList,
                    max_page: action.receiverList.length / 10 + 1
                }
            };
            break;
        case 'RESERVATION_DATA':
            state = {
                ...state,
                reservation_data: action.reservationData
            };
            break;
        case 'EMPTY_RESERVATION':
            state = {
                ...state,
                store: {
                    ...state.store,
                    reservation_day: null,
                    reservation_recipient: null,
                    reservation_time: null
                }
            };
            break;
        default:
            break;
    }

    return state;
};

export default reducer;