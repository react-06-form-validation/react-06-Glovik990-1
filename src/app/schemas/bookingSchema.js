import { z } from 'zod';

export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z.string().min(2, 'Booker name must be at least 2 characters long'),

    bookerEmail: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.string().email('Invalid email address').optional()
    ),

    eventName: z.string().min(2, 'Event name must be at least 2 characters long'),

    eventDate: z.preprocess(
      (val) => (val ? new Date(val) : undefined),
      z.date().refine((d) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d > today;
      }, 'Event date must be in the future')
    ),

    numberOfGuests: z.preprocess(
      (val) => (val !== '' ? Number(val) : undefined),
      z
        .number({ invalid_type_error: 'Number of Guests must be a number' })
        .int('Number of Guests must be an integer')
        .min(1, 'Number of Guests must be greater than or equal to 1')
        .max(10, 'Number of Guests must be less than or equal to 10')
    ),

    timeSlot: z
  .string()
  .min(1, 'Selected time slot is required')
  .refine((value) => availableTimeSlots.includes(value), {
    message: 'Selected time slot is unavailable',
  }),

    eventLink: z.string().url('Invalid URL. Please enter a valid event link'),
  });