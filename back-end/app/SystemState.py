from transitions import Machine
from .main import views
from .DataAPI import DataAPI
import datetime
from .SparkHandler import SparkHandler
from .main import views

class SystemState(object):
    prompt = ''
    value = 0

    def set_next_page(self):
        if self.store['page'] == self.store['max_page']:
            self.prompt = "Current page is the last page."
        else:
            self.store['page'] = self.store['page'] + 1
            self.prompt = 'all right'

        self.store['system_state'] = self.state

    def set_last_page(self):
        if self.store['page'] == 0:
            self.prompt = "Current page is the first page."
        else:
            self.store['page'] = self.store['page'] - 1
            self.prompt = 'all right'

        self.store['system_state'] = self.state

    def set_window_closed(self):
        self.store['reservation_visible'] = False
        self.store['allergic_response_visible'] = False
        self.store['condition_history_visible'] = False
        self.store['preview_visible'] = False
        self.store['system_state'] = self.state
        self.prompt = 'All right'

    def set_information_hided(self):
        self.store['patient_info_visible'] = False
        self.store['system_state'] = self.state
        self.prompt = 'All right'

    def set_entrance(self):
        self.store['mode'] = 1
        self.store['content_type'] = 'schedule'
        self.prompt = 'Hello sir.'
        self.store['system_state'] = self.state

    def set_exit(self):
        self.store['mode'] = 0
        self.prompt = 'See you next time, sir.'
        self.store['system_state'] = self.state

    def set_reservation_cancelled(self):
        self.store['reservation_day'] = None
        self.store['reservation_time'] = None
        self.store['reservation_recipient'] = None
        self.prompt = "Your reservation has been cancelled already!"
        self.store['system_state'] = self.state

    def set_information_visible(self):
        self.prompt = 'Ok, this is the information of next patient.'
        self.store['patient_info_visible'] = True
        self.store['system_state'] = self.state

    def set_return_to_schedule(self):
        self.store['content_type'] = 'schedule'
        self.prompt = 'Ok, this is your schedule.'
        self.store['system_state'] = self.state

    def set_reservation_visible(self):
        self.store['reservation_visible'] = True
        self.prompt = 'Ok, this is your reservation of this week.'
        self.store['system_state'] = self.state

    def set_new_reservation(self):
        self.prompt = 'Please tell me the day of reservation.'
        self.store['system_state'] = self.state

    def set_reservation_day(self):
        self.store['reservation_day'] = self.value
        self.prompt = 'Please tell me the time of reservation.'
        self.store['system_state'] = self.state

    def set_reservation_time(self):
        self.store['reservation_time'] = self.value
        self.prompt = 'Please tell me the recipient of reservation.'
        self.store['system_state'] = self.state

    def set_reservation_recipient(self):
        if self.value <= len(self.store['receiver_list']):
            self.store['reservation_recipient'] = self.value
            self.prompt = 'Are you sure that you want to make a new reservation using these information?'
            self.store['system_state'] = self.state
        else:
            self.prompt = 'the recipient number is invalid. please input again.'

    def set_allergic_response_visible(self):
        self.prompt = 'Ok, this is the details of allergic responses.'
        self.store['allergic_response_visible'] = True
        self.store['system_state'] = self.state

    def set_condition_history_visible(self):
        self.prompt = 'Ok, this is the details of condition history.'
        self.store['condition_history_visible'] = True
        self.store['system_state'] = self.state

    def set_chat_record_visible(self):
        self.prompt = 'Ok, this is the chatting record before.'
        self.store['message_list'] = views.minute_taker.conversation_doc
        self.store['system_state'] = self.state

    def set_image(self):
        self.prompt = 'Ok, you can say preview image and its number to see more details.'
        self.store['system_state'] = self.state

    def set_image_preview(self):
        self.prompt = 'Which image you want to preview? Please tell me the number of it.'
        self.store['system_state'] = self.state

    def set_image_num(self):
        if self.value <= self.store['total_images']:
            self.store['preview_image_num'] = self.value
            self.store['preview_visible'] = True
            self.prompt = 'ok.'
            self.store['system_state'] = self.state
        else:
            self.prompt = 'the image number is invalid. please input again.'

    def set_confirm_reservation(self):
        recipient_id = self.store['reservation_recipient']
        recipient_info = self.store['receiver_list'][recipient_id]
        reservation_date = datetime.date(year=2018,
                                         month=4, day=29) + datetime.timedelta(days=self.store['reservation_day'])
        reservation_date = datetime.date.strftime(reservation_date, '%Y-%m-%d')

        if DataAPI.update_reservation_data(reservation_date=reservation_date,
                                           reservation_time=self.store['reservation_time'],
                                           reservation_day=self.store['reservation_day'],
                                           reservation_recipient=recipient_info['title']):
            self.prompt = 'Your reservation ' + 'with ' + self.store['receiver_list'][recipient_id]['title'] \
                          + ' will be made at' + str(self.store['reservation_time']) + ' o\'clock on ' \
                          + str(self.store['reservation_day']) + '.'
            spark_handler = SparkHandler()

            views.executor.submit(spark_handler.create_spark_room, reservation_date=reservation_date,
                                  reservation_time=self.store['reservation_time'],
                                  recipient_id=self.store['receiver_list'][recipient_id]['id'])

        else:
            self.prompt = 'Sorry, but this time slot is invalid.'

        self.store['reservation_day'] = None
        self.store['reservation_time'] = None
        self.store['reservation_recipient'] = None
        self.store['system_state'] = self.state

    def set_image_comment(self):
        self.prompt = 'ok, please confirm the comments on the image.'
        self.store['system_state'] = self.state
        self.store['comment_visible'] = True

    def set_image_comment_hidden(self):
        self.prompt = 'for sure.'
        self.store['system_state'] = self.state
        self.store['comment_visible'] = False

    def set_image_comment_adding(self):
        self.prompt = 'Ok, please remove the mouse over the position ' \
                      'that you want to add new comment and tell me what you want to add.'
        self.store['system_state'] = self.state

    def set_image_comment_added(self):
        self.prompt = 'Ok, the new comment has been added.'
        self.store['system_state'] = self.state
        DataAPI.update_image_comment(image_id=self.store['preview_image_num'], pos_x=self.store['pos_x'],
                                     pos_y=self.store['pos_y'], content=self.transcript)

    def __init__(self, store, transcript):
        self.transcript = transcript
        self.store = store
        self.states = ['initial_state', 'schedule', 'information', 'reservation', 'reservation_day',
                       'reservation_time', 'reservation_recipient', 'allergic_response', 'condition_history',
                       'chat_record', 'preview', 'image_wall', "image_num", 'confirm_reservation', 'preview_comment',
                       'add_comment']

        self.transitions = [
            {'trigger': 'entrance', 'source': 'initial_state', 'dest': 'schedule', 'after': 'set_entrance'},
            {'trigger': 'information_visible', 'source': 'schedule', 'dest': 'information',
             'after': 'set_information_visible'},
            {'trigger': 'allergic_response_visible', 'source': 'information', 'dest': 'allergic_response',
             'after': 'set_allergic_response_visible'},
            {'trigger': 'condition_history_visible', 'source': 'information', 'dest': 'condition_history',
             'after': 'set_condition_history_visible'},
            {'trigger': 'chat_record_visible', 'source': 'information', 'dest': 'chat_record',
             'after': 'set_chat_record_visible'},
            {'trigger': 'image', 'source': 'information', 'dest': 'image_wall',
             'after': 'set_image'},
            {'trigger': 'image_preview', 'source': 'image_wall', 'dest': 'image_num',
             'after': 'set_image_preview'},
            {'trigger': 'item_num', 'source': 'image_num', 'dest': 'preview', 'after': 'set_image_num'},
            {'trigger': 'return_to_schedule', 'source': 'chat_record', 'dest': 'information',
             'after': 'set_return_to_schedule'},
            {'trigger': 'return_to_schedule', 'source': 'image_wall', 'dest': 'information',
             'after': 'set_return_to_schedule'},
            {'trigger': 'information_hided', 'source': 'information', 'dest': 'schedule',
             'after': 'set_information_hided'},
            {'trigger': 'reservation_visible', 'source': 'schedule', 'dest': 'reservation',
             'after': 'set_reservation_visible'},
            {'trigger': 'new_reservation', 'source': 'reservation', 'dest': 'reservation_day',
             'after': 'set_new_reservation'},
            {'trigger': 'day', 'source': 'reservation_day', 'dest': 'reservation_time', 'after': 'set_reservation_day'},
            {'trigger': 'time', 'source': 'reservation_time', 'dest': 'reservation_recipient',
             'after': 'set_reservation_time'},
            {'trigger': 'item_num', 'source': 'reservation_recipient', 'dest': 'confirm_reservation',
             'after': 'set_reservation_recipient'},
            {'trigger': 'deny', 'source': 'confirm_reservation', 'dest': "reservation",
             'after': 'set_reservation_cancelled'},
            {'trigger': 'confirm', 'source': 'confirm_reservation', 'dest': 'reservation',
             'after': 'set_confirm_reservation'},
            {'trigger': 'next_page', 'source': 'reservation', 'dest': 'reservation', 'after': 'set_next_page'},
            {'trigger': 'last_page', 'source': 'reservation', 'dest': 'reservation', 'after': 'set_last_page'},
            {'trigger': 'window_closed', 'source': 'reservation', 'dest': 'schedule', 'after': 'set_window_closed'},
            {'trigger': 'window_closed', 'source': 'allergic_response', 'dest': 'information',
             'after': 'set_window_closed'},
            {'trigger': 'window_closed', 'source': 'condition_history', 'dest': 'information',
             'after': 'set_window_closed'},
            {'trigger': 'window_closed', 'source': 'preview', 'dest': 'image_wall', 'after': 'set_window_closed'},
            {'trigger': 'exit', 'source': 'schedule', 'dest': 'initial_state', 'after': 'set_exit'},
            {'trigger': 'exit', 'source': 'information', 'dest': 'initial_state', 'after': 'set_exit'},
            {'trigger': 'comment', 'source': 'preview', 'dest': 'preview_comment', 'after': 'set_image_comment'},
            {'trigger': 'comment_hidden', 'source': 'preview_comment', 'dest': 'preview',
             'after': 'set_image_comment_hidden'},
            {'trigger': 'comment_adding', 'source': 'preview_comment', 'dest': 'add_comment',
             'after': 'set_image_comment_adding'},
            {'trigger': 'sentence', 'source': 'add_comment', 'dest': 'preview_comment',
             'after': 'set_image_comment_added'}
        ]

        self.Machine = Machine(model=self, states=self.states, transitions=self.transitions,
                               initial=store['system_state'])
