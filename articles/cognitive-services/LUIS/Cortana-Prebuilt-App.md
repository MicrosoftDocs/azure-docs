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
| builtin.intent.alarm.time_remaining| how much longer do i have until "wake-up"? <br/> how much time until my next alarm?|
| builtin.intent.alarm.turn_off_alarm | turn off my 7am alarm <br/> turn off my wake up alarm |
| builtin.intent.calendar.change_calendar_entry| change an appointment<br/>move my meeting from today to tomorrow|
|builtin.intent.calendar.check_availability|is tim busy on friday?<br/>is brian free on saturday|
|builtin.intent.calendar.connect_to_meeting|connect to a meeting<br/>join the meeting online|
|builtin.intent.calendar.create_calendar_entry|i need to schedule an appointment with tony for friday<br/>make an appointment with lisa at 2pm on sunday|
|builtin.intent.calendar.delete_calendar_entry|delete my appointment<br/>remove the meeting at 3 pm tomorrow from my calendar|
|builtin.intent.calendar.find_calendar_entry|show my calendar<br/>display my weekly calendar|
|builtin.intent.calendar.find_calendar_when|when is my next meeting with jon?<br/>what time is my appointment with larry on monday?|
|builtin.intent.calendar.find_calendar_where|show me the location of my 6 o'clock meeting<br/>where is that meeting with jon?|
|builtin.intent.calendar.find_calendar_who|who is this meeting with?<br/>who else is invited?|
|builtin.intent.calendar.find_calendar_why|what are the details of my 11 o'clock meeting?<br/>what is that meeting with jon about?|
|builtin.intent.calendar.find_duration|how long is my next meeting<br/>how many minutes long is my meeting this afternoon|
|builtin.intent.calendar.time_remaining|how much time until my next appointment?<br/>how much more time do i have before the meeting?|
|builtin.intent.communication.add_contact|save this number and put the name as jose<br/>put jason in my contacts list|
|builtin.intent.communication.answer_phone|answer<br/>answer the call|
|builtin.intent.communication.assign_nickname|edit nickname for nickolas<br/>add a nickname for john doe|
|builtin.intent.communication.call_voice_mail|voice mail<br/>call voicemail|
|builtin.intent.communication.find_contact|show me my contacts<br/>find contacts|
|builtin.intent.communication.forwarding_off|stop forwarding my calls<br/>switch off call forwarding|
|builtin.intent.communication.forwarding_on|set call forwarding to send calls to home phone<br/>forward calls to home phone|
|builtin.intent.communication.ignore_incoming|do not answer that call<br/>not now, i'm busy|
|builtin.intent.communication.ignore_with_message|don't answer that call but send a message instead<br/>ignore and send a text back|
|builtin.intent.communication.make_call|call bob and john<br/>call mom and dad|
|builtin.intent.communication.press_key|dial star<br/>press the 1 2 3|
|builtin.intent.communication.read_aloud|read text<br/>what did she say in the message|
|builtin.intent.communication.redial|redial my last call<br/>redial|
|builtin.intent.communication.send_email|email to mike waters mike that dinner last week was splendid<br/>send an email to bob|
|builtin.intent.communication.send_text|send text to bob and john<br/>message|
|builtin.intent.communication.speakerphone_off|take me off speaker<br/>turn off speakerphone|
|builtin.intent.communication.speakerphone_on|speakerphone mode<br/>put speakerphone on|
|builtin.intent.mystuff.find_attachment|find the document john emailed me yesterday <br/>find the doc from john|
|builtin.intent.mystuff.find_my_stuff|i want to edit my shopping list from yesterday<br/>find my chemistry notes from september
|builtin.intent.mystuff.search_messages|open message <br/>messages|
|builtin.intent.mystuff.transform_my_stuff|share my shopping list with my husband<br/>delete my shopping list|
|builtin.intent.ondevice.open_setting|open cortana settings <br/>jump to notifications|
|builtin.intent.ondevice.pause|turn off music<br/>music off|
|builtin.intent.ondevice.play_music|i want to hear owner of a lonely heart<br/>play some gospel music|
|builtin.intent.ondevice.recognize_song|tell me what this song is<br/>analyze and retrieve title of song|
|builtin.intent.ondevice.repeat|repeat this track<br/>play this song again|
|builtin.intent.ondevice.resume|restart music<br/>start music again|
|builtin.intent.ondevice.skip_back|back up a track<br/>previous song|
|builtin.intent.ondevice.skip_forward|next song<br/>skip ahead a track|
|builtin.intent.ondevice.turn_off_setting|wifi off<br/>disable airplane mode|
|builtin.intent.ondevice.turn_on_setting|wifi on<br/>turn on bluetooth|
|builtin.intent.places.add_favorite_place|add this address to my favorites<br/>save this location to my favorites|
|builtin.intent.places.book_public_transportation|buy a train ticket<br/>book a tram pass|
|builtin.intent.places.book_taxi|can you find me a ride at this hour?<br/>find a taxi|
|builtin.intent.places.check_area_traffic|what's the traffic like on 520<br/>how is the traffic on i-5|
|builtin.intent.places.check_into_place|check into joya<br/>check in here|
|builtin.intent.places.check_route_traffic|show me the traffic on the way to kirkland<br/>how is the traffic to seattle?|
|builtin.intent.places.find_place|where do i live <br/>give me the top 3 japanese restaurants|
|builtin.intent.places.get_address|show me the address of guu on robson street<br/>what is the address of the nearest starbucks?|
|builtin.intent.places.get_coupon|find deals on tvs in my area<br/>discounts in mountain view|
|builtin.intent.places.get_distance|how far away is holiday inn?<br/>what's the distance to tahoe|
|builtin.intent.places.get_hours|what are bar del corso's hours on mondays?<br/>when is the library open?|
|builtin.intent.places.get_menu|show me applebee's menu<br/>what's on the menu at sizzler|
|builtin.intent.places.get_phone_number|give the number for home depot<br/>what is the phone number of the nearest starbucks?|
|builtin.intent.places.get_price_range|how much does dinner at red lobster cost<br/>how expensive is purple cafe|
|builtin.intent.places.get_reviews|show me reviews for local hardware stores<br/>i want to see restaurant reviews|
|builtin.intent.places.get_route|give me directions to|it is possible to get to pizza hut on foot|
|builtin.intent.places.get_star_rating|how many stars does the french laundry have?<br/>is the aquarium in monterrey good?|
|builtin.intent.places.get_transportation_schedule|what time does the san francisco ferry leave?<br/>when is the latest train to seattle?|
|builtin.intent.places.get_travel_time|what's the driving time to denver from sf<br/>how long will it take to get to san francisco from here|
|builtin.intent.places.make_call|call dr smith in bellevue<br/>call the home depot on 1st street|
|builtin.intent.places.rate_place|give a rating for this restaurant<br/>rate il fornaio 5 stars on yelp|
|builtin.intent.places.show_map|what's my current location <br/>what's my location|
|builtin.intent.places.takes_reservations|is it possible to make a reservation at the olive garden<br/>does the art gallery accept reservations|
|builtin.intent.reminder.change_reminder|change a reminder<br/>move my picture day reminder up 30 minutes|
|builtin.intent.reminder.create_single_reminder|remind me to wake up at 7 am<br/>remind me to go trick or treating with luca at 4:40pm|
|builtin.intent.reminder.delete_reminder|delete this reminder<br/>delete my picture reminder|
|builtin.intent.reminder.find_reminder|do i have any reminders set up for today<br/>do i have a reminder set for luca's party|
|builtin.intent.reminder.read_aloud|read reminder out loud<br/>read that reminder|
|builtin.intent.reminder.snooze|snooze that reminder until tomorrow<br/>snooze this reminder|
|builtin.intent.reminder.turn_off_reminder|turn off reminder<br/>dismiss airport pick up reminder|
|builtin.intent.weather.change_temperature_unit|change from fahrenheit to kelvin<br/>change from fahrenheit to celsius|
|builtin.intent.weather.check_weather|show me the forecast for my upcoming trip to seattle<br/>how will the weather be this weekend|
|builtin.intent.weather.check_weather_facts|what is the weather like in hawaii in december?<br/>what was the temperature this time last year?|
|builtin.intent.weather.compare_weather|give me a comparison between the temperature high and lows of dallas and houston, tx<br/>how does the weather compare to slc and nyc|
|builtin.intent.weather.get_frequent_locations|give me my most frequent location<br/>show most often stops|
|builtin.intent.weather.get_weather_advisory|weather warnings<br/>show weather advisory for sacramento|
|builtin.intent.weather.get_weather_maps|display a weather map<br/>show me weather maps for africa|
|builtin.intent.weather.question_weather|will it be foggy tomorrow morning?<br/>will i need to shovel snow this weekend?|
|builtin.intent.weather.show_weather_progression|show local weather radar<br/>begin radar|
|builtin.intent.none|how old are you<br/>open camera|