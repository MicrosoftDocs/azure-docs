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

<!-- For example, instead of using builtin.intent.calendar.create_calendar_entry, use Calendar.Add -->
> [!IMPORTANT]
> We recommend that you use the [prebuilt domains](./luis-how-to-use-prebuilt-domains.md), instead of the Cortana prebuilt app. 
> For example, instead of **builtin.intent.calendar.create_calendar_entry**, use **Calendar.Add** from the **Calendar** prebuilt domain.
> The prebuilt domains provide these advantages: 
> * They provide packages of prebuilt and pretrained intents and entities that are designed to work well with each other. You can integrate a prebuilt domain directly into your app. For example, if you're building a fitness tracker, you can add the **Fitness** domain and have an entire set of intents and entities for tracking fitness activities, including intents for tracking weight and meal planning, remaining time or distance, and saving fitness activity notes.
> * The prebuilt domain intents are customizable. For example, if you want to provide reviews of hotels, you can train and customize the **Places.GetReviews** intent from the **Places** domain to recognize requests for hotel reviews.
> * The prebuilt domains are extensible. For example, if you want to use the **Places** prebuilt domain in a bot that searches for restaurants, and need an intent for getting the type of cuisine, you can build and train a **Places.GetCuisine** intent.

In addition to allowing you to build your own applications, LUIS also provides intents and entities the from Microsoft Cortana personal assistant as a prebuilt app. This is an "as-is" application. The intents and entities in this application cannot be edited or integrated into other LUIS apps. If you’d like your client to have access to both this prebuilt application and your own LUIS application, then your client will have to reference both LUIS apps.

The pre-built personal assistant app is available in these cultures (locales): English, French, Italian, Spanish and Chinese.

## Use the Cortana Prebuilt App

1. On **My Apps** page, click **Cortana prebuilt apps** and select your language, English for example. The following dialog box appears:

    ![Use Cortana prebuilt app](./Images/use-cortana.JPG)
2. In **Query**, type the utterance you want to interpret. For example, type "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"
3. From the **Subscription Key** list, select the subscription key to be used for this endpoint hit to Cortana app. 
4. Click the generated endpoint URL to access the endpoint and get the result of the query. The screenshot below shows the result returned in JSON format for the example utterance: "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"

    ![Cortana Query Result](./Images/Cortana-JSON-Result.JPG)

## Cortana prebuilt intents
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

## Prebuilt entities 

Here are some examples of entities the prebuilt personal assistant application can identify:

|Entity	|Example of entity in utterance |
|-------|------------------|
|builtin.alarm.alarm_state | turn `off` my wake up alarm	<br/> is my wake up alarm `on`	| 
|builtin.alarm.duration |snooze for `10 minutes`	<br/> snooze alarm for `5 minutes`	|
|builtin.alarm.start_date | set an alarm for `monday` at 7 am	<br/> set an alarm for `tomorrow` at noon	|
|builtin.alarm.start_time | create an alarm for `30 minutes`	<br/> set the alarm to go off `in 20 minutes`	|
|builtin.alarm.title | is my `wake up` alarm on	<br/> can you set an alarm for quarter to 12 monday to friday called `take antibiotics`	|
|builtin.calendar.absolute_location | create an appointment for tomorrow at `123 main street`	<br/> the meeting will take place in `cincinnati` on the 5th of june	|
|builtin.calendar.contact_name|put a marketing meeting on my calendar and be sure that `joe` is there <br/>i want to set up a lunch at il fornaio and invite `paul` |	
|builtin.calendar.destination_calendar|add this to my `work` schedule	<br/>put this on my `personal` calendar	|
|builtin.calendar.duration| set up an appointment for `an hour` at 6 tonight <br/>	book a `2 hour` meeting with joe |	
|builtin.calendar.end_date | create a calendar entry called vacation from tomorrow until `next monday` <br/>	block my time as busy until `monday, october 5th` |	
|builtin.calendar.end_time | the meeting ends at `5:30 PM` <br/> schedule it from 11 to `noon`	|	
|builtin.calendar.implicit_location | cancel the appointment at the dmv	<br/> change the location of miles' birthday to `poppy restaurant` |	
|builtin.calendar.move_earlier_time | push the meeting forward `an hour` <br/> move the dentist's appointment up `30 minutes`		|
|builtin.calendar.move_later_time | move my dentist appointment `30 minutes`	<br/> push the meeting out `an hour` |	
|builtin.calendar.original_start_date | reschedule my appointment at the barber from 'tuesday' to wednesday	<br/> move my meeting with ken from `monday` to tuesday	|
|builtin.calendar.original_start_time | reschedule my meeting from `2:00` to 3	<br/> change my dentist appointment from `3:30` to 4 |	
|builtin.calendar.start_date | what time does my party start on `flag day` <br/> schedule lunch for the `friday after next` at noon	
|builtin.calendar.start_time | i want to schedule it for `this morning`	<br/> i want to schedule it in the `morning` |	
|builtin.calendar.title | `vet appointment`	 <br/> `dentist` tuesday |
|builtin.communication.audio_device_type | make the call using `bluetooth`	<br/> call using my `headset` |	
|builtin.communication.contact_name | text `bob jones`	<br/> | call `sarah`|
|builtin.communication.destination_platform | call dave in `london`	<br/> call his `work line` |	
|builtin.communication.from_relationship_name | show calls from my `daughter` <br/> read the email from `mom`	|	
|builtin.communication.key | dial `star` <br/> 	press the `hash` key	|
|builtin.communication.message | email carly to say `i'm running late` <br/> please text angus smith `good luck on your exam` |	
|builtin.communication.message_category | new email marked for `follow up`	<br/> new email marked `high priority` |	
|builtin.communication.message_type | send an `email`	<br/> read my `text` messages aloud	|
|builtin.communication.phone_number | i want to dial `1-800-328-9459` <br/> 	call `555-555-5555` |	
|builtin.communication.relationship_name | text my `husband` <br/>	email `family`|	
|builtin.communication.slot_attribute | change the `recipient` <br/>	change the `text` |	

<!-- 
builtin.communication.source_platform
call him from skype	
{
    "type": "builtin.communication.source_platform",
    "entity": "skype"
}
call him from my personal line	
{
    "type": "builtin.communication.source_platform",
    "entity": "personal line"
}
builtin.mystuff.attachment
with documents attached	
{
    "type": "builtin.mystuff.attachment",
    "entity": "attached"
}
find the email attachment bob sent	
{
    "type": "builtin.mystuff.attachment",
    "entity": "attachment"
}
builtin.mystuff.contact_name
find the spreadsheet lisa sent to me	
{
    "type": "builtin.mystuff.contact_name",
    "entity": "me",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "me"
    }
}
where's the document i sent to susan last night	
{
    "type": "builtin.mystuff.contact_name",
    "entity": "susan"
}
builtin.mystuff.data_source
c:\dev\	
{
    "type": "builtin.mystuff.data_source",
    "entity": "c:\dev\"
}
my desktop	
{
    "type": "builtin.mystuff.data_source",
    "entity": "desktop",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "desktop"
    }
}
builtin.mystuff.data_type
locate the document i worked on last night	
{
    "type": "builtin.mystuff.data_type",
    "entity": "document",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "Document"
    }
}
bring up mike's visio diagram	
{
    "type": "builtin.mystuff.data_type",
    "entity": "visio diagram"
}
builtin.mystuff.end_date
show me the docs i worked on between yesterday and today	
{
    "type": "builtin.mystuff.end_date",
    "entity": "today",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-10-17"
    }
}
find what doc i was working on before thursday the 31st	
{
    "type": "builtin.mystuff.end_date",
    "entity": "before thursday the 31st",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-08-31",
        "mod": "Before"
    }
}
builtin.mystuff.end_time
find files i saved before noon	
{
    "type": "builtin.mystuff.end_time",
    "entity": "before noon",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "2015-10-16T12:00:00"
    }
}
find what doc i was working on before 4pm	
{
    "type": "builtin.mystuff.end_time",
    "entity": "before 4pm",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "mod": "Before",
        "time": "2015-10-16T16"
    }
}
builtin.mystuff.file_action
open the spreadsheet i saved yesterday	
{
    "type": "builtin.mystuff.file_action",
    "entity": "saved"
}
find the spreadsheet kevin created	
{
    "type": "builtin.mystuff.file_action",
    "entity": "created"
}
builtin.mystuff.from_contact_name
find the proposal jason sent me	
{
    "type": "builtin.mystuff.from_contact_name",
    "entity": "jason"
}
open isaac 's last email	
{
    "type": "builtin.mystuff.from_contact_name",
    "entity": "isaac"
}
builtin.mystuff.keyword
show me the french conjugation files	
{
    "type": "builtin.mystuff.keyword",
    "entity": "french conjugation"
}
find the marketing plan i drafted yesterday	
{
    "type": "builtin.mystuff.keyword",
    "entity": "marketing plan"
}
builtin.mystuff.location
the document i edited at work	
{
    "type": "builtin.mystuff.location",
    "entity": "work",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "work"
    }
}
photos i took in paris	
{
    "type": "builtin.mystuff.location",
    "entity": "paris"
}
builtin.mystuff.message_category
look for my new emails	
{
    "type": "builtin.mystuff.message_category",
    "entity": "new"
}
search for my high priority email	
{
    "type": "builtin.mystuff.message_category",
    "entity": "high priority"
}
builtin.mystuff.message_type
check my email	
{
    "type": "builtin.mystuff.message_type",
    "entity": "email",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "email"
    }
}
show me my text messages	
{
    "type": "builtin.mystuff.message_type",
    "entity": "text",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "sms"
    }
}
builtin.mystuff.source_platform
search my hotmail email for email from john	
{
    "type": "builtin.mystuff.source_platform",
    "entity": "hotmail"
}
find the document i sent from work	
{
    "type": "builtin.mystuff.source_platform",
    "entity": "work"
}
builtin.mystuff.start_date
find notes from january	
{
    "type": "builtin.mystuff.start_date",
    "entity": "january",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-01"
    }
}
find the email i send rob after january 1st	
{
    "type": "builtin.mystuff.start_date",
    "entity": "after january 1st",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-01-01",
        "mod": "After"
    }
}
builtin.mystuff.start_time
find that email i sent rob sometime before 2pm but after noon?	
{
    "type": "builtin.mystuff.start_time",
    "entity": "after noon",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "2015-10-16T12:00:00"
    }
}
find the worksheet kristin sent to me that i edited last night	
{
    "type": "builtin.mystuff.start_time",
    "entity": "last night",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "2015-10-16TNI"
    }
}
builtin.mystuff.title
c:\dev\mystuff.txt	
{
    "type": "builtin.mystuff.title",
    "entity": "c:\dev\mystuff.txt"
}
*.txt	
{
    "type": "builtin.mystuff.title",
    "entity": "*.txt"
}
builtin.mystuff.transform_action
download the file john sent me	
{
    "type": "builtin.mystuff.transform_action",
    "entity": "download"
}
open my annotation guidelines doc	
{
    "type": "builtin.mystuff.transform_action",
    "entity": "open"
}
builtin.note.note_text
create a grocery list including pork chops, applesauce and milk	
{
    "type": "builtin.note.note_text",
    "entity": "pork chops, applesauce and milk"
}
make a note to buy milk	
{
    "type": "builtin.note.note_text",
    "entity": "buy milk"
}
builtin.note.title
make a note called grocery list	
{
    "type": "builtin.note.title",
    "entity": "grocery list"
}
make a note called people to call	
{
    "type": "builtin.note.title",
    "entity": "people to call"
}
builtin.ondevice.music_artist_name
play everything by rufus wainwright	
{
    "type": "builtin.ondevice.music_artist_name",
    "entity": "rufus wainwright"
}
play garth brooks music	
{
    "type": "builtin.ondevice.music_artist_name",
    "entity": "garth brooks"
}
builtin.ondevice.music_genre
show classic rock songs	
{
    "type": "builtin.ondevice.music_genre",
    "entity": "classic rock"
}
play my classical music from the baroque period	
{
    "type": "builtin.ondevice.music_genre",
    "entity": "classical"
}
builtin.ondevice.music_playlist
shuffle all britney spears from workout playlist	
{
    "type": "builtin.ondevice.music_playlist",
    "entity": "workout"
}
play breakup playlist	
{
    "type": "builtin.ondevice.music_playlist",
    "entity": "breakup"
}
builtin.ondevice.music_song_name
play summertime	
{
    "type": "builtin.ondevice.music_song_name",
    "entity": "summertime"
}
play me and bobby mcgee	
{
    "type": "builtin.ondevice.music_song_name",
    "entity": "me and bobby mcgee"
}
builtin.ondevice.setting_type
quiet hours	
{
    "type": "builtin.ondevice.setting_type",
    "entity": "quiet hours",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "Do not disturb"
    }
}
airplane mode	
{
    "type": "builtin.ondevice.setting_type",
    "entity": "airplane mode",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "Airplane mode"
    }
}
builtin.places.absolute_location
take me to the intersection of 5th and pike	
{
    "type": "builtin.places.absolute_location",
    "entity": "5th and pike"
}
no , i want directions to 1 microsoft way redmond wa 98052	
{
    "type": "builtin.places.absolute_location",
    "entity": "1 microsoft way redmond wa 98052"
}
builtin.places.atmosphere
look for interesting places to go out	
{
    "type": "builtin.places.atmosphere",
    "entity": "interesting"
}
where can i find a casual restaurant	
{
    "type": "builtin.places.atmosphere",
    "entity": "casual"
}
builtin.places.audio_device_type
call the post office on hands free	
{
    "type": "builtin.places.audio_device_type",
    "entity": "hands free"
}
call papa john's with speakerphone	
{
    "type": "builtin.places.audio_device_type",
    "entity": "speakerphone"
}
builtin.places.avoid_route
avoid the toll road	
{
    "type": "builtin.places.avoid_route",
    "entity": "toll road"
}
get me to san francisco avoiding the construction on 101	
{
    "type": "builtin.places.avoid_route",
    "entity": "construction on 101"
}
builtin.places.cuisine
halal deli near mountain view	
{
    "type": "builtin.places.cuisine",
    "entity": "halal"
}
kosher fine dining on the peninsula	
{
    "type": "builtin.places.cuisine",
    "entity": "kosher"
}
builtin.places.date
make a reservation for next friday the 12th	
{
    "type": "builtin.places.date",
    "entity": "next friday the 12th",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-10-23"
    }
}
is mashiko open on mondays ?	
{
    "type": "builtin.places.date",
    "entity": "mondays",
    "resolution": {
        "resolution_type": "builtin.datetime.set",
        "set": "XXXX-WXX-1"
    }
}
builtin.places.discount_type
find a coupon for macy's	
{
    "type": "builtin.places.discount_type",
    "entity": "coupon"
}
find me a coupon	
{
    "type": "builtin.places.discount_type",
    "entity": "coupon"
}
builtin.places.distance
is there a good diner within 5 miles of here	
{
    "type": "builtin.places.distance",
    "entity": "within 5 miles"
}
find ones within 15 miles	
{
    "type": "builtin.places.distance",
    "entity": "within 15 miles"
}
builtin.places.from_absolute_location
directions from 45 elm street to home	
{
    "type": "builtin.places.from_absolute_location",
    "entity": "45 elm street"
}
get me directions from san francisco to palo alto	
{
    "type": "builtin.places.from_absolute_location",
    "entity": "san francisco"
}
builtin.places.from_place_name
driving from the post office to 56 center street	
{
    "type": "builtin.places.from_place_name",
    "entity": "post office"
}
get me directions from home depot to lowes	
{
    "type": "builtin.places.from_place_name",
    "entity": "home depot"
}
builtin.places.from_place_type
directions to downtown from work	
{
    "type": "builtin.places.from_place_type",
    "entity": "work"
}
get me directions from the drug store to home	
{
    "type": "builtin.places.from_place_type",
    "entity": "drug store"
}
builtin.places.meal_type
nearby places for dinner	
{
    "type": "builtin.places.meal_type",
    "entity": "dinner",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "restaurants"
    }
}
find a good place for a business lunch	
{
    "type": "builtin.places.meal_type",
    "entity": "lunch",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "restaurants"
    }
}
builtin.places.nearby
show me some cool shops near me	
{
    "type": "builtin.places.nearby",
    "entity": "near"
}
are there any good lebanese restaurants around here?	
{
    "type": "builtin.places.nearby",
    "entity": "around"
}
builtin.places.open_status
when is the mall closed	
{
    "type": "builtin.places.open_status",
    "entity": "closed"
}
get me the opening hours of the store	
{
    "type": "builtin.places.open_status",
    "entity": "opening"
}
builtin.places.place_name
take me to central park	
{
    "type": "builtin.places.place_name",
    "entity": "central park"
}
look up the eiffel tower	
{
    "type": "builtin.places.place_name",
    "entity": "eiffel tower"
}
builtin.places.place_type
atms	
{
    "type": "builtin.places.place_type",
    "entity": "atms",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "atms"
    }
}
post office	
{
    "type": "builtin.places.place_type",
    "entity": "post office",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "postal services"
    }
}
builtin.places.prefer_route
show directions by the shortest route	
{
    "type": "builtin.places.prefer_route",
    "entity": "shortest"
}
take the fastest route	
{
    "type": "builtin.places.prefer_route",
    "entity": "fastest"
}
builtin.places.price_range
give me places that are moderately affordable	
{
    "type": "builtin.places.price_range",
    "entity": "moderately affordable",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "average"
    }
}
i want an expensive one	
{
    "type": "builtin.places.price_range",
    "entity": "expensive",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "expensive"
    }
}
builtin.places.product
where can i get fresh fish around here	
{
    "type": "builtin.places.product",
    "entity": "fresh fish"
}
where around here sells bare minerals	
{
    "type": "builtin.places.product",
    "entity": "bare minerals"
}
builtin.places.public_transportation_route
bus schedule for the m2 bus	
{
    "type": "builtin.places.public_transportation_route",
    "entity": "m2"
}
bus route 3x	
{
    "type": "builtin.places.public_transportation_route",
    "entity": "3x"
}
builtin.places.rating
show 3 star restaurants	
{
    "type": "builtin.places.rating",
    "entity": "3 star"
}
show results that are 3 stars or higher	
{
    "type": "builtin.places.rating",
    "entity": "3 stars or higher",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": ">=3"
    }
}
builtin.places.reservation_number
book a table for seven people	
{
    "type": "builtin.places.reservation_number",
    "entity": "seven"
}
make a reservation for two at il fornaio	
{
    "type": "builtin.places.reservation_number",
    "entity": "two"
}
builtin.places.results_number
show me the 10 coffee shops closest to here	
{
    "type": "builtin.places.results_number",
    "entity": "10"
}
show me top 3 aquariums	
{
    "type": "builtin.places.results_number",
    "entity": "3",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "3"
    }
}
builtin.places.service_provided
where can i go to whale watch by bus ?	
{
    "type": "builtin.places.service_provided",
    "entity": "whale watch"
}
i need a mechanic to fix my brakes	
{
    "type": "builtin.places.service_provided",
    "entity": "fix my brakes"
}
builtin.places.time
i want places that are open on saturday at 8 am	
{
    "type": "builtin.places.time",
    "entity": "8 am",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "XXXX-WXX-6T08"
    }
}
is mashiko open now ?	
{
    "type": "builtin.places.time",
    "entity": "now",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "PRESENT_REF"
    }
}
builtin.places.transportation_company
train schedules for new jersey transit	
{
    "type": "builtin.places.transportation_company",
    "entity": "new jersey transit"
}
can i get there on bart	
{
    "type": "builtin.places.transportation_company",
    "entity": "bart"
}
builtin.places.transportation_type
where is a music store i can get to on foot ?	
{
    "type": "builtin.places.transportation_type",
    "entity": "on foot",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "walking"
    }
}
give me biking directions to mashiko	
{
    "type": "builtin.places.transportation_type",
    "entity": "biking",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "bicycle"
    }
}
builtin.places.travel_time
i want to be able to drive less than 15 minutes	
{
    "type": "builtin.places.travel_time",
    "entity": "less than 15 minutes",
    "resolution": {
        "resolution_type": "builtin.datetime.duration",
        "duration": "PT15M"
    }
}
i want somewhere i can get to in under 15 minutes	
{
    "type": "builtin.places.travel_time",
    "entity": "under 15 minutes",
    "resolution": {
        "resolution_type": "builtin.datetime.duration",
        "duration": "PT15M"
    }
}
builtin.reminder.absolute_location
remind me to call my dad when i land in chicago	
{
    "type": "builtin.reminder.absolute_location",
    "entity": "chicago"
}
when i get back to seattle remind me to get gas	
{
    "type": "builtin.reminder.absolute_location",
    "entity": "seattle"
}
builtin.reminder.contact_name
when bob calls, remind me to tell him the joke	
{
    "type": "builtin.reminder.contact_name",
    "entity": "bob"
}
create a reminder to mention the school bus when i talk to arthur	
{
    "type": "builtin.reminder.contact_name",
    "entity": "arthur"
}
builtin.reminder.leaving_absolute_location
reminder pick up craig when leaving 1200 main	
{
    "type": "builtin.reminder.leaving_absolute_location",
    "entity": "1200 main"
}
builtin.reminder.leaving_implicit_location
remind me to get gas when i leave work	
{
    "type": "builtin.reminder.leaving_implicit_location",
    "entity": "work",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "work"
    }
}
builtin.reminder.original_start_date
change the reminder about the lawn from saturday to sunday	
{
    "type": "builtin.reminder.original_start_date",
    "entity": "saturday"
}
move my reminder about school from monday to tuesday	
{
    "type": "builtin.reminder.original_start_date",
    "entity": "monday"
}
builtin.reminder.relationship_name
when my husband calls, remind me to tell him about the pta meeting	
{
    "type": "builtin.reminder.relationship_name",
    "entity": "husband",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "husband"
    }
}
remind me again when mom calls	
{
    "type": "builtin.reminder.relationship_name",
    "entity": "mom",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "mother"
    }
}
builtin.reminder.reminder_text
can you remind me to bring up my small spot of patchy skin when dr smith'calls	
{
    "type": "builtin.reminder.reminder_text",
    "entity": "bring up my small spot of patchy skin"
}
remind me to pick up dry cleaning at 4:40	
{
    "type": "builtin.reminder.reminder_text",
    "entity": "pick up dry cleaning"
}
builtin.reminder.start_date
remind me the thursday after next at 8 pm	
{
    "type": "builtin.reminder.start_date",
    "entity": "thursday after next"
}
remind me next thursday the 18th at 8 pm	
{
    "type": "builtin.reminder.start_date",
    "entity": "next thursday the 18th"
}
builtin.reminder.start_time
create a reminder in 30 minutes	
{
    "type": "builtin.reminder.start_time",
    "entity": "in 30 minutes"
}
create a reminder to water the plants this evening at 7	
{
    "type": "builtin.reminder.start_time",
    "entity": "this evening at 7"
}
builtin.weather.absolute_location
will it rain in boston	
{
    "type": "builtin.weather.absolute_location",
    "entity": "boston"
}
what's the forecast for seattle?	
{
    "type": "builtin.weather.absolute_location",
    "entity": "seattle"
}
builtin.weather.date_range
weather in nyc this weekend	
{
    "type": "builtin.weather.date_range",
    "entity": "this weekend",
    "resolution": {
        "resolution_type": "builtin.datetime.date",
        "date": "2015-W42-WE"
    }
}
look up the five day forecast in hollywood florida	
{
    "type": "builtin.weather.date_range",
    "entity": "five day",
    "resolution": {
        "resolution_type": "builtin.datetime.duration",
        "duration": "P5D"
    }
}
builtin.weather.suitable_for
can i go hiking in shorts this weekend?	
{
    "type": "builtin.weather.suitable_for",
    "entity": "hiking"
}
will it be nice enough to walk to the game today?	
{
    "type": "builtin.weather.suitable_for",
    "entity": "walk"
}
builtin.weather.temperature_unit
what is the temperature today in kelvin	
{
    "type": "builtin.weather.temperature_unit",
    "entity": "kelvin",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "kelvin"
    }
}
show me the temps in celsius	
{
    "type": "builtin.weather.temperature_unit",
    "entity": "celsius",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "celsius"
    }
}
builtin.weather.time_range
does it look like it will snow tonight?	
{
    "type": "builtin.weather.time_range",
    "entity": "tonight",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "2015-10-17TNI"
    }
}
is it windy right now?	
{
    "type": "builtin.weather.time_range",
    "entity": "now",
    "resolution": {
        "resolution_type": "builtin.datetime.time",
        "time": "PRESENT_REF"
    }
}
builtin.weather.weather_condition
show precipitation	
{
    "type": "builtin.weather.weather_condition",
    "entity": "precipitation",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "rain"
    }
}
how thick is the snow at lake tahoe now?	
{
    "type": "builtin.weather.weather_condition",
    "entity": "snow",
    "resolution": {
        "resolution_type": "metadataItems",
        "metadataType": "CanonicalEntity",
        "value": "snow"
    }
}
-->
