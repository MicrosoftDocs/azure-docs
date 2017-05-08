---
title: Use Cortana pre-built app from LUIS | Microsoft Docs
description: Use Cortana personal assistant, a pre-built application from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/31/2017
ms.author: cahann
---

# Cortana Prebuilt App

In addition to allowing you to build your own applications, LUIS also provides selected models from Microsoft Cortana personal assistant as a prebuilt application. This is an "as-is" application; the intents and entities in this application cannot be edited or integrated into other LUIS applications. If you’d like your client to have access to both this prebuilt application and your own LUIS application, then your client will have to make two separate HTTP calls.

The pre-built personal assistant application is available in these cultures (locales): English, French, Italian, Spanish and Chinese.

**To use the Cortana Prebuilt App:**

1. On **My Apps** page, click **Cortana prebuilt apps** and select your language, English for example. The following dialog box appears:

    ![Use Cortana prebuilt app](./Images/use-cortana.JPG)
2. In **Query**, type the utterance you want to interpret. For example, type "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"
3. From the **Subscription Key** list, select the subscription key to be used for this endpoint hit to Cortana app. 
4. Click the generated endpoint URL to access the endpoint and get the result of the query. The screenshot below shows the result returned in JSON format for the example utterance: "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"

    ![Cortana Query Result](./Images/Cortana-JSON-Result.JPG)

## Prebuilt Intents
The pre-built personal assistant application can identify the following intents:

| Intent | Example utterances |
|--------| ------------------|
| builtin.intent.alarm.alarm_other|update my 7:30 alarm to be eight o'clock <br/>change my alarm from 8am to 9am |
| builtin.intent.alarm.delete_alarm|delete an alarm <br/>delete my alarm "wake up"|
| builtin.intent.alarm.find_alarm|what time is my wake-up alarm set for? <br/> is my wake-up alarm on? |
| builtin.intent.alarm.set_alarm|turn on my wake up alarm<br/>can you set an alarm for 12 called take antibiotics?|
| builtin.intent.alarm.snooze|snooze alarm for 5 minutes<br/>snooze alarm|
| builtin.intent.alarm.time_remaining| how much longer do i have until "wake-up"? | how much time until my next alarm?|
| builtin.intent.alarm.turn_off_alarm | turn off my 7am alarm | turn off my wake up alarm |
| builtin.intent.calendar.change_calendar_entry| change an appointment|move my meeting from today to tomorrow|
|builtin.intent.calendar.check_availability|is tim busy on friday?|is brian free on saturday|
|builtin.intent.calendar.connect_to_meeting|connect to a meeting|join the meeting online|
|builtin.intent.calendar.create_calendar_entry|i need to schedule an appointment with tony for friday|make an appointment with lisa at 2pm on sunday|
|builtin.intent.calendar.delete_calendar_entry|delete my appointment|remove the meeting at 3 pm tomorrow from my calendar|
|builtin.intent.calendar.find_calendar_entry|show my calendar|display my weekly calendar|
|builtin.intent.calendar.find_calendar_when|when is my next meeting with jon?|what time is my appointment with larry on monday?|
|builtin.intent.calendar.find_calendar_where|show me the location of my 6 o'clock meeting|where is that meeting with jon?|
|builtin.intent.calendar.find_calendar_who|who is this meeting with?|who else is invited?|
|builtin.intent.calendar.find_calendar_why|what are the details of my 11 o'clock meeting?|what is that meeting with jon about?|
|builtin.intent.calendar.find_duration|how long is my next meeting|how many minutes long is my meeting this afternoon|
|builtin.intent.calendar.time_remaining|how much time until my next appointment?|how much more time do i have before the meeting?|
|builtin.intent.communication.add_contact|save this number and put the name as jose|put jason in my contacts list|
|builtin.intent.communication.answer_phone|answer|answer the call|
|builtin.intent.communication.assign_nickname|edit nickname for nickolas|add a nickname for john doe|
|builtin.intent.communication.call_voice_mail|voice mail|call voicemail|
|builtin.intent.communication.find_contact|show me my contacts|find contacts|
|builtin.intent.communication.forwarding_off|stop forwarding my calls|switch off call forwarding|
|builtin.intent.communication.forwarding_on|set call forwarding to send calls to home phone|forward calls to home phone|
|builtin.intent.communication.ignore_incoming|do not answer that call|not now, i'm busy|
|builtin.intent.communication.ignore_with_message|don't answer that call but send a message instead|ignore and send a text back|
|builtin.intent.communication.make_call|call bob and john|call mom and dad|
|builtin.intent.communication.press_key|dial star|press the 1 2 3|
|builtin.intent.communication.read_aloud|read text|what did she say in the message|
|builtin.intent.communication.redial|redial my last call|redial|
|builtin.intent.communication.send_email|email to mike waters mike that dinner last week was splendid|send an email to bob|
|builtin.intent.communication.send_text|send text to bob and john|message|
|builtin.intent.communication.speakerphone_off|take me off speaker|turn off speakerphone|
|builtin.intent.communication.speakerphone_on|speakerphone mode|put speakerphone on|