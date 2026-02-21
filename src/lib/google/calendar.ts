import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { getGoogleClient } from "./client";

const MEETLY_CALENDAR_SUMMARY = "Meetly";

/** Resolve the app-created calendar id for the user (create one if needed). Requires calendar.app.created scope. */
async function getOrCreateAppCalendar(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { googleCalendarId: true },
  });
  if (user?.googleCalendarId) return user.googleCalendarId;

  const client = await getGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });
  const res = await calendar.calendars.insert({
    requestBody: {
      summary: MEETLY_CALENDAR_SUMMARY,
      description: "Events and Meet sessions from Meetly",
    },
  });
  const calendarId = res.data.id;
  if (!calendarId) throw new Error("Failed to create Meetly calendar");

  await prisma.user.update({
    where: { id: userId },
    data: { googleCalendarId: calendarId },
  });
  return calendarId;
}

export async function createMeetEvent(params: {
  userId: string;
  startDate: string;
  timezone: string;
  summary: string;
  durationMinutes?: number;
}) {
  const { userId, startDate, timezone, summary, durationMinutes = 60 } = params;

  const calendarId = await getOrCreateAppCalendar(userId);
  const client = await getGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });

  const startDateTime = new Date(startDate);
  const endDateTime = new Date(
    startDateTime.getTime() + durationMinutes * 60000,
  );

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timezone,
      },
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
        },
      },
    },
  });

  return {
    meetingId: event.data.id!,
    hangoutLink: event.data.hangoutLink!,
    startDateTime: event.data.start?.dateTime!,
  };
}

export async function updateMeetEvent(params: {
  userId: string;
  meetingId: string;
  startDate: string;
  timezone: string;
  summary: string;
  durationMinutes?: number;
}) {
  const {
    userId,
    meetingId,
    startDate,
    timezone,
    summary,
    durationMinutes = 60,
  } = params;

  const calendarId = await getOrCreateAppCalendar(userId);
  const client = await getGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });

  const startDateTime = new Date(startDate);
  const endDateTime = new Date(
    startDateTime.getTime() + durationMinutes * 60000,
  );

  await calendar.events.patch({
    calendarId,
    eventId: meetingId,
    requestBody: {
      summary,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: timezone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: timezone,
      },
    },
    // This ensures Google Calendar sends reschedule emails to attendees
    sendUpdates: "all",
  });
}

export async function cancelMeetEvent(params: {
  userId: string;
  meetingId: string;
}) {
  const { userId, meetingId } = params;

  const calendarId = await getOrCreateAppCalendar(userId);
  const client = await getGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });

  await calendar.events.delete({
    calendarId,
    eventId: meetingId,
    // Notify all attendees that the event was cancelled
    sendUpdates: "all",
  });
}

export async function addAttendeeToMeet(params: {
  userId: string;
  meetingId: string;
  attendeeEmail: string;
}) {
  const { userId, meetingId, attendeeEmail } = params;

  const calendarId = await getOrCreateAppCalendar(userId);
  const client = await getGoogleClient(userId);
  const calendar = google.calendar({ version: "v3", auth: client });

  // Get existing event
  const event = await calendar.events.get({
    calendarId,
    eventId: meetingId,
  });

  const existingAttendees = event.data.attendees || [];

  // Add new attendee
  await calendar.events.patch({
    calendarId,
    eventId: meetingId,
    requestBody: {
      attendees: [
        ...existingAttendees,
        { email: attendeeEmail, responseStatus: "needsAction" },
      ],
    },
    sendUpdates: "all",
  });
}
