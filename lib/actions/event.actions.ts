"use server"

import { revalidatePath } from 'next/cache';
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, UpdateEventParams } from '../../types/index';
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

export const getAllEvents = async ({query,limit=6, page,category}:GetAllEventsParams) => {
    try {
        await connectToDatabase()

        const conditions = {}
        
        const eventsQuery = Event.find(conditions)
        .sort({ createAt: 'desc' })
        .skip(0)
        .limit(limit)
        
        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)


        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages:Math.ceil(eventsCount/limit)
        };

    } catch (error) {
        handleError(error)
    }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Event.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

