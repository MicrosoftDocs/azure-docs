---
title: Prebuilt domain reference | Microsoft Docs
description: Reference for the prebuilt domains, which are prebuilt collections of intents and entities from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: DeniseMak
manager: rstand
ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 11/02/2017
ms.author: v-demak
---

# Prebuilt domain reference
This reference provides information about the prebuilt domains, which are prebuilt collections of intents and entities that LUIS offers.

## List of prebuilt domains
LUIS offers 20 prebuilt domains. 

| Prebuilt domain | Description |
| ---------------- |-----------------------|
| Calendar | The Calendar domain provides intent and entities for adding, deleting, or editing an appointment, checking participants availability, and finding information about a calendar event.|
| Camera | The Camera domain provides intents and entities for taking pictures, recording videos, and broadcasting video to an application.|
| Communication | Sending messages and making phone calls.|
| Entertainment  | Handling queries related to music, movies, and TV.|
| Events | Booking tickets for concerts, festivals, sports games and comedy shows.|
| Fitness | Handling requests related to tracking fitness activities.|
| Gaming | Handling requests related to a game party in a multiplayer game.|
| HomeAutomation | Controlling smart home devices like lights and appliances.|
| MovieTickets | Booking tickets to movies at a movie theater.|
| Music | Playing music on a music player.|
| Note | The Note domain provides intents and entities related to creating, editing, and finding notes.|
| OnDevice | The OnDevice domain provides intents and entities related to controlling the device.|
| Places  | Handling queries related to places like businesses, institutions, restaurants, public spaces, and addresses.|
| Reminder | Handling requests related to creating, editing, and finding reminders.|
| RestaurantReservation | Handling requests to manage restaurant reservations.|
| Taxi | Handling bookings for a taxi.|
| Translate | Translating text to a target language.|
| TV | Controlling TVs.|
| Utilities  | Handling requests that are common in many domains, like "help", "repeat", "start over."|
| Weather | Getting weather reports and forecasts.|
| Web | Navigating to a website.|

For more detail on each domain, see the sections that follow.

## Calendar 

The Calendar domain provides intents and entities related to calendar entries. The Calendar intents include adding, deleting or editing an appointment, checking availability, and finding information about a calendar entry or appointment.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Add | Add a new one-time item to the calendar.| Make an appointment with Lisa at 2pm on Sunday <br/><br/>I want to schedule a meeting<br/><br/>I need to set up a meeting|
| CheckAvailability | Find availability for an appointment or meeting on the user's calendar or another person's calendar.| When is Jim available to meet? <br/><br/>Show when Carol is available tomorrow<br/><br/>Is Chris free on Saturday?|
| Delete | Request to delete a calendar entry.| Cancel my appointment with Carol. <br/><br/>Delete my 9 am meeting<br/>|
| Edit | Request to change an existing meeting or calendar entry.| Move my 9 am meeting to 10 am.<br/><br/>I want to update my schedule.<br/><br/>Reschdule my meeting with Ryan.|
| Find | Display my weekly calendar.| Find the dentist review appointment. <br/><br/>Show my calendar<br/>|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Location | Location of calendar item, meeting or appointment. Addresses, cities, and regions are good examples of locations.| 209 Nashville Gym <br/><br/>897 Pancake house<br/><br/>Garage|
| Subject | The title of a meeting or appointment.| Dentist's appointment <br/><br/>Lunch with Julia<br/><br/>Doctor's appointment|

## Camera 
The Camera domain provides intents and entities related to using a camera. The intents cover capturing a photo, selfie, screenshot or video, and broadcasting video to an application.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| CapturePhoto| Capture a photo.| Take a photo<br/><br/>capture|
| CaptureScreenshot | Capture a screenshot.| Take screen shot.<br/><br/>capture the screen.|
| CaptureSelfie | Capture a selfie.| Take a selfie <br/><br/>take a picture of me |
| CaptureVideo | Start recording video.| Start recording <br/><br/>Begin recording|
| StartBroadcasting| Start broadcasting video.| Start broadcasting to Facebook|
| StopBroadcasting| Stop broadcasting video.| Stop broadcasting|
| StopVideoRecording| Stop recording a video.| That's enough<br/><br/>stop recording|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| AppName | The name of an application to broadcast video to.| OneNote<br/><br/>Facebook<br/><br/>Skype|


## Communication 
The Communication domain provides intents and entities related to email, messages and phone calls.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| AddContact| Add a new contact to the user's list of contacts.|Add new contact <br/><br/>Save this number and put the name as Carol|
| AddMore| Add more to an email or text, as part of a step-wise email or text composition.|Add more to text <br/><br/>Add more to email body|
| Answer| Answer an incoming phone call.|Answer the call <br/><br/>Pick it up|
| AssignContactNickname| Assign a nickname to a contact.|Change Isaac to dad <br/>Edit Jim's nickname<br/>Add nickname to Patti Owens|
| CallVoiceMail| Connect to the user's voice mail.|Connect me to my voicemail box <br/>Voice mail<br/>Call voicemail|
| CheckIMStatus| Check the status of a contact in Skype.|Is Jim's online status set to away? <br/>Is Carol available to chat with?|
| Confirm| Confirm an action.|Yes<br/>Okay<br/>All right<br/>I confirm that I want to send this email.<br/>|
| Dial| Make a phone call.|Call Jim<br/>Please dial 311<br/>|
| FindContact| Find contact information by name.|Find Carol's number<br/>Show me Carol's number<br/>|
| FindSpeedDial| Find the speedial number a phone number is set to and vice versa.|What is my dial number 5?<br/>Do I have speed dial set?<br/>What is the dial number for 941-5555-333?|
| GetForwardingsStatus| Get the current status of call forwarding.|Is my call forwarding turned on?<br/>Tell me if my call status is on or off<br/>|
| Goback| Go back to the previous step.|Go back to twitter<br/>Go back a step<br/>Go back|
| Ignore| Ignore an incoming call.|Don't answer<br/>Ignore call|
| IgnoreWithMessage| Ignore an incoming call and reply with text instead.|Don't answer that call but send a message instead.<br/>Ignore and send a text back.|
| PressKey| Press a button or number on the keypad.|Dial star.<br/>Press 1 2 3.|
| ReadAloud| Read a message or email to the user.|Read text.<br/>What did she say in the message?|
| TurnForwardingOff| Make a phone call.|<br/><br/>|
| Redial| Redial or call a number again.|Redial.<br/>Redial my last call.|
| Reject| Reject an incoming call.|Reject call<br/>Can't answer now<br/>Not available at the moment and will call back later.|
| SendEmail| Send an email. This intent applies to email but not text messages.|Email to Mike Waters: Mike, that dinner last week was splendid.<br/>Send an email to Bob<br/>|
| SendMessage| Send a text message or an instant message.|Send text to Chris and Carol|
| SetSpeedDial| Set a speed dial shortcut for a contact's phone number.|Set speed dial one for Carol.<br/>Set up speed dial for mom.|
| ShowNext| See the next item, for example, in a list of text messages or emails.|Show the next one.<br/>Go to the next page.|
| ShowPrevious| See the previous item, for example, in a list of text messages or emails.|Show the previous one.<br/>Previous<br/>Go to previous.|
| StartOver| Start the system over or start a new session.|Start over<br/>New session<br/>restart|
| TurnForwardingOff| Turn off call forwarding.|Stop forwarding my calls<br/>Switch off call forwarding|
| TurnForwardingOn| Turn off the speaker phone.|Forwarding my calls to 3333<br/>Switch on call forwarding to 3333|
| TurnSpeakerOff| Turn off the speaker phone.|Take me off speaker.<br/>Turn off speakerphone.<br/>|
| TurnSpeakerOn| Turn on the speaker phone.|Speakerphone mode.<br/>Put speakerphone on.<br/>|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| AudioDeviceType | Type of audio device (speaker, headset, microphone, etc).| Speaker<br/>Hands-free<br/>Bluetooth|
| Category | The category of a message or email.| Important<br/>High priority|
| ContactAttribute | An attribute of the contact the user inquires about.| Birthdays<br/>Address<br/>Phone number|
| ContactName | The name of a contact or message recipient.| Carol<br/>Jim<br/>Chris|
| EmailSubject | The text used as the subject line for an email.| RE: interesting story|
| Line | The line the user wants to use to make a call or send a text/email from.| Work line<br/>British cell<br/>Skype|
| Message | The message to send as an email or text.| It was great meeting you today. See you again soon!|
| MessageType | The name of a contact or message recipient.| Text<br/>Email|
| OrderReference | The ordinal or relative position in a list, identifying an item to retrieve. For example, "last" or "recent" in "What was the last message I sent?"| Last<br/>Recent|
| SenderName | The name of the sender.| Patti Owens|

## Entertainment  
The Entertainment domain provides intents and entities related to searching for movies, music, games and TV shows.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Search| Search for movies, music, apps, games and TV shows.|Search the store for Halo.<br/>Search for Avatar.|

### Entities
| Entities name | Description | Examples |
| ---------------- |-----------------------|----|
| ContentRating | Media content rating like G, or R for movies.|Kids video.<br/>PG rated.|
| Genre | The genre of a movie, game, app or song.|Comedies<br/>Dramas<br/>Funny|
| Keyword| A generic search keyword specifying an attribute the doesn't exist in the more specific media slots.|Soundtracks<br/>Moon River<br/>Amelia Earhart|
| Language | Media content rating like G, or R for movies.|French<br/>English<br/>Korean|
| MediaFormat | The additional special technical type in which the media is formatted.|HD Movies<br/>3D movies<br/>Downloadable|
| MediaSource | The store or marketplace for acquiring the media.|Netflix<br/>Prime|
| MediaSubTypes| Media types smaller than movies and games.|Demos<br/>Dlc<br/>Trailers|
| Nationality| The country where a movie, show, or song was created.|French<br/>German<br/>Korean|
| Person| The actor, director, producer, musician or artist associated with a movie, app, game or TV show.|Madonna<br/>Stanley Kubrick|
| Role| Role played by a person in the creation of media.|Sings<br/>Directed by<br/>By|
| Title| The name of a movie, app, game, TV show, or song.|Friends<br/>Minecraft|
| Type| The type or media format of a movie, app, game, TV show, or song.|Music<br/>MovieTV <br/>shows|
| UserRating| User star or thumbs rating.|5 stars<br/>3 stars<br/>4 stars|

## Events 
The Events domain provides intents and entities related to booking tickets for events like concerts, festivals, sports games and comedy shows.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Book| Purchase tickets to an event.|I'd like to buy a ticket for the symphony this weekend.|


### Entities
| Entities name | Description | Examples |
| ---------------- |-----------------------|----|
| Address | Event location or address. |Palo Alto<br/>300 112th Ave SE <br/> Seattle |
| Name | The name of an event.|Shakespeare in the Park|
| PlaceName| The event location name.|Louvre<br/>Opera House<br/>Broadway|
| PlaceType | The type of the location the event will be held in.|Cafe<br/>Theatre<br/>Library|
| Type | The type of an event.|Concert<br/>Sports game|

## Fitness 
The Fitness domain provides intents and entities related to tracking fitness activities. The intents include saving notes, remaining time or distance, or saving activity results.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| AddNote| Adds supplemental notes to a tracked activity.|The difficulty of this run was 6/10<br/>The terrain I am on running on is asphalt<br/>I am using a 3 speed bike|
|GetRemaining| Gets the remaining time or distance for an activity.|How much time till the next lap?<br/>How many miles are remaining in my run? How much time for the split?|
| LogActivity| Save or log completed activity results.|Save my last run<br/>Log my Saturday morning walk<br/>store my previous swim|
| LogWeight| Save or log the user's current weight.|Save my current weight<br/>log my weight now<br/>store my current body weight|

### Entities
| Entities name | Description | Examples |
| ---------------- |-----------------------|----|
| ActivityType | The type of activity to track. |Run<br/>Walk<br/>Swim<br/>Cycle |
| Food | A type of food to track in a fitness app. |Banana<br/>Salmon<br/>Protein Shake|
| MealType| The meal type to track in a health or fitness app.|Breakfast<br/>Dinner<br/>Lunch<br/>Supper|
| Measurement| A type of measurements for time, distance or weight, for use in a fitness or health app.|Kilometers<br/>Miles<br/>Minutes<br/>Kilograms|
| Number | A numeric quantity for use in a fitness or health app.|19<br/>three<br/>200<br/>one|
| StatType | A statistic type on aggregated data, for use in a fitness or health app.|Sum<br/>Average<br/>Maximum<br/>Minimum|

## Gaming 
The Gaming domain provides intents and entities related to managing a game party in a multiplayer game.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| InviteParty| Invite a contact to join a gaming party.|Invite this player to my party<br/>Come to my party<br/>Join my clan|
|LeaveParty| Gets the remaining time or distance for an activity.|I'm out<br/>I'm leaving this party for another<br/>I am quitting|
| StartParty| Start a gaming party in a multiplayer game.|Dude let's start a party<br/>start a party<br/>should we start a clan tonight|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Contact| A contact name to use in a multiplayer game.|Carol<br/>Jim|


## HomeAutomation 
The HomeAutomation domain provides intents and entities related to controlling smart home devices like lights and appliances.

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| TurnOff| Turn off, close, or unlock a device.|Turn off the lights<br/>Stop the coffee maker<br/>Close garage door|
|TurnOn| Turn on a device or set the device to a particular setting or mode.|turn on my coffee maker<br/>can you turn on my coffee maker?<br/>Set the thermostat to 72 degrees.|


### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Device | A type of device that can be turned on or off.|coffee maker<br/>thermostat<br/>lights|
| Operation | The state to set of the device.|lock<br/>open<br/>on<br/>off|
| Room | The location or room the device is in.|living room<br/>bedroom<br/>kitchen|

## MovieTickets 
The Movie Tickets domain provides intents and entities related to booking tickets to movies at a movie theater.

### Examples
```
Book me two tickets for Captain Omar and the two Musketeers
Cancel tickets
When is Captain Omar showing?
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Book | Purchase movie tickets.|Book me two tickets for Captain Omar and the two musketeers<br/>I want to buy a ticket for tomorrow's movie<br/>I want a ticket for Captian Omar Part 2 next Wednesday|
|GetShowTime| Get the showtime of a movie.|When is Captain Omar showing?|


### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Address | The address of a movie theater.|Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| MovieTitle | The title of a movie.|Life of Pi<br/>Hunger Games<br/>Inception|
| PlaceName | The name of a movie theater or cinema.|Cinema Amir<br/>Alexandria Theatre<br/>New York Theater|
| PlaceType | The type of location a movie is showing at.|cinema<br/>theater<br/>IMAX cinema|

## Music 
The Music domain provides intents and entities related to playing music on a music player.

### Examples
```
play Beethoven
Increase track volume
Skip to the next song
```
<!--11Intents
2Entities -->

## Note 
The Note domain provides intents and entities related to creating, editing, and finding notes.

### Examples
```
Add to my groceries note lettuce tomato bread coffee
Check off bananas from my grocery list
Remove all items from my vacation list
```
<!--9Intents
6Entities -->

## OnDevice 
The OnDevice domain provides intents and entities related to controlling the device.

### Examples
```
Close video player
Cancel playback
Can you make the screen brighter?
```
<!--27Intents
6Entities -->

## Places  
The Places domain provides intents for handling queries related to places like businesses, institution, restaurants, public spaces and addresses.

### Examples
```
Save this location to my favorites
How far away is Holiday Inn?
At what time does Safeway close?
```
<!--30Intents
20Entities -->

## Reminder 
The reminder domain provides intents and entities for creating, editing, and finding reminders.

### Examples
```
Change my interview to 9 am tomorrow
Remind me to buy milk on my way back home
Can you check if I have a reminder about Christine's birthday?
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Change| Change a reminder.|Change my interview to 9 am tomorrow<br/>Move my assignment reminder to tomorrow|
| Create| Create a new reminder.|Create a reminder<br/>Remind me to buy milk<br/>I want to remember to call Rebecca when I'm at home|
| Delete | Delete a reminder.|Delete my picture reminder<br/>Delete this reminder|
| Find | Find a reminder.|Do I have a reminder about my anniversary?<br/>Can you check if I have a reminder about Christine's birthday?|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Text | The text description of a reminder.|pick up dry cleaning<br/>dropping my car off at the service center|

## RestaurantReservation 
The Reservation domain provides intents and entities related to managing restaurant reservations.

### Examples
```
Reserve at Zucca for two for tonight
Book a table at BJ's for tomorrow
Table for 3 in Palo Alto at 7
```
<!--1Intents
9Entities -->

## Taxi 
 
The Taxi domain provides intents and entities for creating and managing taxi bookings.

### Examples
```
Get me a cab at 3 pm
How much longer do I have to wait for my taxi?
Cancel my Uber
```
<!--3Intents
8Entitiess -->

## Translate 
The Translate domain provides intents and entities related to translating text to a target language.

### Examples
```
Translate to French
Translate hello to German
Translate this sentence to English
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Translate| Translate text to another language.|Translate to French<br/>Translate hello to German|


### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| TargetLanguage | The target language of a translation.|French<br/>German<br/>Korean|
| Text | The text to translate.|Hello World<br/>Good morning<br/>Good evening|

## TV 
 
The TV domain provides intents and entities for controlling TVs.

### Examples
```
Switch channel to BBC
Show TV guide
Watch National Geographic
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| ChangeChannel| Change a channel on a TV.|Change channel to CNN<br/>Switch channel to BBC<br/>Go to channel 4|
| ShowGuide| Show the TV guide.|Show TV guide<br/>what is on movie channel now?<br/>show my program list|
| WatchTV| Ask to watch a TV channel.|I want to watch the Disney channel<br/>go to TV please<br/>Watch National Geographic|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| ChannelName | The name of a TV channel.|CNN<br/>BBC<br/>Movie channel|

## Utilities  
The Utilities domain provides intents for tasks that are common to many tasks, such as greetings, cancellation, confirmation, help, repetition, navigation, starting and stopping.

### Examples
```
Go back to Twitter
Please help
Repeat last question please
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Cancel | Cancel an action.|Cancel the message<br/>I don't want to send the email anymore|
| Confirm | Confirm an action.|Yeah ohh I confirm<br/>Good I am confirming<br/>Okay I am confirming|
| FinishTask | Finish a task the user started.|I am done<br/>I am finished<br/>It is done|
| GoBack | Go back one step or return to a previous step.|Go back to Twitter<br/>Go back a step<br/>Go back|
| Help | Request for help.|Please help<br/>open help<br/>help|
| Repeat | Repeat an action.|Repeat last question please<br/>repeat last song|
| ShowNext | Show the next item in a series. |Show the next one<br/>go to the next page|
| ShowPrevious | Show the previous item in a series.|show previous one|
| StartOver | Restart the app or start a new session.|Start over<br/>New session<br/>restart|
| Stop | Stop an action.| Stop saying this please<br/>Shut up<br/>Stop please|

## Weather 
The Weather domain provides intents and entities for getting weather reports and forecasts.

### Examples
```
weather in London in september
What?s the 10 day forecast?
What's the average temperature in India in september?
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| GetCondition | Get historic facts related to weather. |weather in London in September<br/>What's the average temperature in India in September?|
| GetForecast | Get the current weather and forecast for the next few days. |How is the weather today?<br/>What's the 10 day forecast?<br/>How will the weather be this weekend?|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Location| The absolute location for a weather request.|Seattle<br/>Paris<br/>Palo Alto|

## Web 
The Web domain provides an intent for navigating to a website.

### Examples
```
Navigate to facebook.com
Go to www.twitter.com
Navigate to www.bing.com
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Navigate | A request to navigate to a specified website. |Navigate to facebook.com<br/>Go to www.twitter.com|

