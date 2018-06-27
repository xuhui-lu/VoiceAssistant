export function setTranscript(transcript) {
    return {
        type: "TRANSCRIPT",
        transcript: transcript
    }
}

export function setReceiverList(receiverList) {
    return {
        type: "RECEIVER_LIST",
        receiverList: receiverList
    }
}

export function setStore(store) {
    return {
        type: "STORE",
        store: store
    }
}

export function setReservationData(reservationData) {
    return {
        type: "RESERVATION_DATA",
        reservationData: reservationData
    }
}

export function emptyReservation() {
    return {
        type: "EMPTY_RESERVATION"
    }
}