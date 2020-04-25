import moment from 'moment';

export default class Event {
    constructor(obj = null) {
        Object.assign(this, obj)
    }

    id = ''
    name = ''
    venue = ''
    date:string = moment().toISOString()
    start_time:number = 0
    end_time:number = 23
    description = ''
    category = ''
    image_content = ''
}