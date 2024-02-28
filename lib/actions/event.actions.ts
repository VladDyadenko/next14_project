"use server"

import { CreateEventParams, UpdateEventParams } from '../../types/index';
import { connectToDatabase } from '../database';
import Category from '../database/models/category.model';
import Event from '../database/models/event.model';
import User from '../database/models/user.model';
import { handleError } from '../utils';

const populateEvent = async (query: any) => {
    return query
    .populate({path:"organizer", model:User, select:'_id firstName lastName'})
    .populate({path:"category", model:Category, select:'_id name'})
}

export const createEvent = async ({ event, userId, path }: CreateEventParams) => {
    try {
        await connectToDatabase();
       

        const organizer = await User.findById(userId);
        if (!organizer) {
            throw new Error("Organazer not found")
        }
        const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
        
         return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        console.log(error)
        handleError(error)
    }
}

export const getEventById = async (eventId:string) => {
    try {
        await connectToDatabase()
        
        const event = await populateEvent(Event.findById(eventId));
          
        if (!event) {
            throw new Error("Event not found")
        }

        return JSON.parse(JSON.stringify(event));

    } catch (error) {
        handleError(error)
    }
}
// export const updateEvent = async ({ event }: UpdateEventParams) => {
//     try {
//         await connectToDatabase();
//         const {_id}=event
//         const currentEvent = await Event.findById(_id);
//         if (!currentEvent) {
//             throw new Error("Event not found")
//         }
//         const updatedEvent = await Event.findByIdAndUpdate({event })
        
//          return JSON.parse(JSON.stringify(updatedEvent))
//     } catch (error) {
//         handleError(error)
//     }
// }