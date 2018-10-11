---
title: Prebuilt domain reference - Azure| Microsoft Docs
titleSuffix: Azure
description: Reference for the prebuilt domains, which are prebuilt collections of intents and entities from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# Prebuilt domain reference
This reference provides information about the [prebuilt domains](luis-how-to-use-prebuilt-domains.md), which are prebuilt collections of intents and entities that LUIS offers.

[Custom domains](luis-how-to-start-new-app.md), by contrast, start with no intents and models. You can add any prebuilt domain intents and entities to a custom model.

## List of prebuilt domains
LUIS offers 20 prebuilt domains. 

| Prebuilt domain | Description | Supported Languages |
| ---------------- |-----------------------|:------:|
| Calendar | The Calendar domain provides intent and entities for adding, deleting, or editing an appointment, checking participants availability, and finding information about a calendar event.| en-US<br/> zh-CN |
| Camera | The Camera domain provides intents and entities for taking pictures, recording videos, and broadcasting video to an application.| en-US |
| Communication | Sending messages and making phone calls.| en-US <br/> zh-CN |
| Entertainment  | Handling queries related to music, movies, and TV.| en-US |
| Events | Booking tickets for concerts, festivals, sports games and comedy shows.| en-US |
| Fitness | Handling requests related to tracking fitness activities.| en-US |
| Gaming | Handling requests related to a game party in a multiplayer game.| en-US |
| HomeAutomation | Controlling smart home devices like lights and appliances.| en-US<br/> zh-CN |
| MovieTickets | Booking tickets to movies at a movie theater.| en-US |
| Music | Playing music on a music player.| en-US<br/> zh-CN |
| Note | The Note domain provides intents and entities related to creating, editing, and finding notes.| en-US<br/> zh-CN |
| OnDevice | The OnDevice domain provides intents and entities related to controlling the device.| en-US<br/> zh-CN |
| Places  | Handling queries related to places like businesses, institutions, restaurants, public spaces, and addresses.| en-US<br/> zh-CN |
| Reminder | Handling requests related to creating, editing, and finding reminders.| en-US<br/> zh-CN |
| RestaurantReservation | Handling requests to manage restaurant reservations.| en-US<br/> zh-CN |
| Taxi | Handling bookings for a taxi.| en-US<br/> zh-CN |
| Translate | Translating text to a target language.| en-US<br/> zh-CN |
| TV | Controlling TVs.| en-US |
| Utilities  | Handling requests that are common in many domains, like "help", "repeat", "start over."| en-US |
| Weather | Getting weather reports and forecasts.| en-US<br/> zh-CN |
| Web | Navigating to a website.| en-US<br/> zh-CN |

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
| Language | Language used in media, such as spoken language of movie or song.|French<br/>English<br/>Korean|
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
The MovieTickets domain provides intents and entities related to booking tickets to movies at a movie theater.

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

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| DecreaseVolume | Decrease the device volume.|decrease track volume<br/>volume down|
| IncreaseVolume | Increase the device volume.|increase track volume<br/>volume up|
| Mute |Mute the playing music.|Mute song<br/>Put the track on mute<br/>Mute music |
| Pause | Pause the playing music.|Pause<br/>Pause music<br/>Pause track|
| PlayMusic | Play music on a device.|play Kevin Durant<br/>play Paradise by Coldplay<br/>play Hello by Adele|
| Repeat |Repeat the playing music.|Repeat song<br/>Play the track gain<br/>Repeat music|
| Resume | Resume the playing music.|Resume song<br/>Start music again<br/>Unpause|
| SkipBack | Skip backwards a track.|Skip to the next song<br/>Play the next song|
| SkipForward |Skip forward a track.|Play the previous song<br/>Go back to the previous track |
| Stop | Stop an action relating to music playback. |Stop playing this album.|
| Unmute | Unmute a music playback device.| Unmute.|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| ArtistName | The actor, director, producer, writer, musician or artist associated with media to play on a device.|Elvis Presley<br/>Taylor Swift<br/>Adele<br/>Mozart|
| Genre | The genre of the music being requested.|Country music<br/>Broadway classics<br/>Play my classical music from the Baroque period|

## Note 
The Note domain provides intents and entities related to creating, editing, and finding notes.

### Examples
```
Add to my groceries note lettuce tomato bread coffee
Check off bananas from my grocery list
Remove all items from my vacation list
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| AddToNote | Add information to a note.|Add to my groceries note lettuce tomato bread coffee<br/>Add to my todo list<br/>add cupcakes to my Wunderlist|
| CheckOffItem | Check off items from a pre-existing note.|Check off bananas from my grocery list<br/>Mark cheese cake on my holiday shopping list as done|
| Clear | Clear all items from a pre-existing note.|Remove all items from my vacation list<br/>Clear all from my reading list|
| Confirm | Confirm an action relating to a note.|It's okay by me<br/>yes<br/>I am confirming keeping all items on lists|
| Create | Create a new note. | Create a list<br/>Note to remind me that Jason is in town first week of May|
| Delete | Delete an entire note. |Delete my vacation list <br/>delete my groceries note|
| DeleteNoteItem | Delete items from a pre-existing note.| Delete chips from my grocery list<br/>Remove pens from my school shopping list|
| ReadAloud | Read a list out loud.|Read me the first one<br/>Read me the details|
| ShowNext | See the next item in a list of notes.|Show the next one<br/>Next page<br/>Next|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| AppName | The note-taking application name.|Wunderlist<br/>OneNote|
| ContactName | The name of a contact in a note.|Carol<br/>Jim<br/>Chris|
| DataSource | Location of notes.|OneDrive<br/>Google docs<br/>my computer|
| DataType | The type of file or document, usually associated with particular software programs.|Slides<br/>Spreadsheet<br/>Worksheet|
| Text | The text of a note or reminder.|stretch before walking<br/>long run tomorrow|
| Title | Title of a note.|groceries<br/>people to call<br/>to-do|

## OnDevice 
The OnDevice domain provides intents and entities related to controlling the device.

### Examples
```
Close video player
Cancel playback
Can you make the screen brighter?
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| AreYouListening | Ask if the device is listening.|is this on?<br/>are you listening?|
|CloseApplication|Close the device application.|close video player|
|FileBug|File a bug on the device.|file a bug please<br/>Can you file a bug for me ?<br/>Let me report this bug|
|GoBack|Ask to go back one step or return to the previous step.|Go back please<br/>Go to previous screen<br/>Go back stop listening|
|Help| Request help.|Help please<br/>Hello<br/>What can you do?<br/>I need help| 
|LocateDevice|Locate the device.|Can you locate my phone<br/>Find tom's iphone<br/>Find my phone|
|LogIn|Log in to a service using the device.|Login please<br/>Facebook log in<br/>Log into LinkedIn|
|LogOut|Log out of a service using the device.|Log off my phone<br/>Log on to twitter<br/>Log out|
|MainMenu|View the main menu of a device.|View menu.|
|OpenApplication|Open an application on the device.|Open the alarm please<br/>Turn on camera<br/>Launch calendar|
|OpenSetting|Open a setting on the device.|Open network settings.|
|PairDevice|Pair the device.|Can you help me in pairing Bluetooth signal to phone<br/>Turn the bluetooth on and pair it with laptop<br/>Pair Bluetooth signal to my laptop|
|PowerOff | Turn off the device.|Can you shut down my computer<br/>Shutdown<br/>Turn off my mobile|
|QueryBattery|Get information about battery life.|Show me battery life.<br/>What's my battery status<br/>How much battery left now?<br/>Show me battery|
|QueryWifi|Get information about WiFi.|Get WiFi info.|
|Restart|Restart the device.|Please restart.|
|RingDevice| Ask the device to ring, in order to find it when it's lost.|Ring my phone.| 
|SetBrightness|Set the device brightness.|Set brightness to medium<br/>Set brightness to high<br/>Set brightness to low|
|SetupDevice|Initiate device setup.|I want to install OS setup<br/>Setup please<br/>Do setup for me|
|ShowAppBar|Show an app bar.|Show me the application bar<br/>Application bar please<br/>Let me see the application bar|
|ShowContextMenu|Show a context menu.|Let me see the context menu<br/>Context menu please<br/>Can you show me the context menu|
|Sleep|Put the device to sleep.|Go to sleep<br/>Sleep<br/>My computer sleep|
|SwitchApplication|Switch the application to use on the device.|Switch to my media player.|
|TurnDownBrightness|Turn down device brightness.|Dim the screen.|
|TurnOffSetting|Turn off a device setting.|Deactivate Bluetooth<br/>Disable data<br/>Disconnect bluetooth|
|TurnOnSetting|Turn on a device setting.|On <br/> Off|
|TurnUpBrightness|Turn up device brightness.|Can you make the screen brighter?|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| AppName | Name of an application on the device.|SoundCloud<br/>YouTube|
| BrightnessLevel | Set the brightness level on the device.|One hundred percent<br/>Fifty<br/>40%|
| ContactName | The name of a contact on the device.|Paul<br/>Marlen Max|
| DeviceType | The type of device. |Phone<br/>Kindle<br/>Laptop|
| MediaType | The media type handled by the device.|Music<br/>Movie<br/>TV shows|
| SettingType | A type of setting or settings panel that the user wants to edit.|WiFi<br/>Wireless Network<br/>Color Scheme<br/>Notification Center|

## Places  
The Places domain provides intents for handling queries related to places like businesses, institution, restaurants, public spaces and addresses.

### Examples
```
Save this location to my favorites
How far away is Holiday Inn?
At what time does Safeway close?
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| AddFavoritePlace | Add a location to the user's favorites list.|Save this location to my favorites<br/>Add this address to my favorites|
|CheckAccident|Ask whether there is an accident on a specified road.|Is there an accident on 880?<br/>Show me accident information|
|CheckAreaTraffic|Check the traffic for a general area or highway, not on a specified route.|Traffic in Seattle<br/>What's the traffic like in Seattle?|
|CheckIntoPlace|Check in to a place using social media.|Check me in on Foursquare<br/>Check in here|
|CheckRouteTraffic| Check the traffic of a specific route specified by the user.|How is the traffic to Mashiko?<br/>Show me the traffice to Kirkland<br/>How is the traffic to Seattle?| 
|Confirm|Confirm an action relating to a place.|Confirm my restaurant reservation.|
|Exit|Action to exit a task relating to a place.|Quit please<br/>Quit giving me directions|
|FindPlace|Search for a place (business, institution, restaurant, public space, address).|Where's the nearest library?<br/>Find me a good Italian restaurant in Mountain View|
|GetAddress| Ask for the address of a place.|Show me the address of Guu on Robson street<br/>What is the address of the nearest Starbucks?| 
|GetDistance|Ask about distance to a specific place.|How far away is Holiday Inn?<br/>how far is it to Bellevue square from here<br/>what's the distance to Tahoe|
|GetHours|Ask about the operating hours for a place.|At what time does Safeway close?<br/>What are the hours for Home Depot?<br/>Is Starbucks still open?|
|GetMenu|Ask for the menu items for a restaurant.|Does Zucca serve anything vegan?<br/>What's on the menu at Sizzler<br/>Show me Applebee's menu|
|GetPhoneNumber| Ask for the phone number of a place.|What is the phone number of the nearest Starbucks?<br/>Give the number for Home Depot| 
|GetPriceRange| Asks for the price range of a place.|Is Zucca cheap?<br/>Is the Cineplex half price on Wednesdays?<br/>How much does a whole lobster dinner cost at Sizzler?|
|GetReviews|Ask for reviews of a place.|Show me reviews for Cheesecase Factory<br/>Read Cineplex reviews in Yelp|
|GetRoute|Ask for directions to a place.|How to walk to Bellevue square<br/>Show me the shortest way to 8th and 59th from here<br/>Get me directions to Mountain View CA|
|GetStarRating|Ask for the star rating of a place.|How is Zucca rated according to Yelp?<br/>How many stars does the French Laundry have?<br/>Is the aquarium in Monterrey good?|
|GetTransportationSchedule|Get the bus schedule for a place.|What time is the next bus to downtown?<br/>Show me the buses in King County|
|GetTravelTime|Ask for the travel time to a specified destination.|How long will it take to get to San Francisco from here<br/>What's the driving time to Denver from SF|
|MakeCall|Make a phone call to a place.|Call mom<br/>I would like to place a Skype call to Anna<br/>Call Jim|
|MakeReservation|Request a reservation for a restaurant or other business.|Reserve at Zucca for two for tonight<br/>Book a table for tomorrow<br/>Table for 3 in Palo Alto at 8|
|MapQuestions|Request information about directions or whether a specified road goes to a destination.|Does 13 pass through downtown?<br/>Can I take 880 to Oakland?|
|Rating|Get the rating description of a restaurant or place.|How many stars does the Contoso Inn have?|
|ReadAloud|Read a list of places out loud.|Read me the first one<br/>Read me the details|
|SelectItem|Choose an item from a list of choices relating to a place or places.|Pick the second one<br/>Select the first|
|ShowMap|Show a map of an area.|Show a map for the second one<br/>Show map<br/>Find San Francisco on the map|
|ShowNext|Show the next item in a series.|Show the next one<br/>go to the next page|
|ShowPrevious|Show the previous item in a series.|show previous one<br/>previous<br/>go to previous|
|StartOver|Restart the app or start a new session.|Start over<br/>New session<br/>
restart|
|TakesReservations|Ask whether a place accepts reservations.|Does the art gallery accept reservations<br/>Is it possible to make a reservation at the Olive Garden

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| AbsoluteLocation | The location or address of a place.|Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| Amenities | The objective characteristics/benefits of a place.|kids eat free<br/>waterfront<br/>free parking|
| Atmosphere | The atmosphere of a place.|kid-friendly<br/>casual restaurant<br/>sporty|
| Cuisine | The cuisine of a place. |Mediterranean<br/>Italian<br/>Indian|
| DestinationAddress| A destination location or address.|Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| DestinationPlaceName| The name of a destination that is a business, restaurant, public attraction, or institution.|central park<br/>safeway<br/>walmart|
| DestinationPlaceType | The type of a destination that is a local business, restaurant, public attraction, or institution. |Restaurant<br/>Opera<br/>Cinema|
| Distance | The distance to a place.|15 miles<br/>5 miles<br/>10 miles away|
| MealType | Type of meal like breakfast or lunch. |breakfast<br/>dinner<br/>lunch<br/>supper|
| OpenStatus | Indicates whether a place is open or closed.|Open<br/>closed<br/>opening|
| PlaceName | The name of a place.|Cheesecake Factory|
| PlaceType | The type of a place.|Cafe<br/>Theatre<br/>Library|
| PreferredRoute | The preferred route specified by the user. | 101 <br/>202 <br/>Route 401|
| Product | The product offered by a place. | Clothes<br/>Digital ASR Cameras<br/>Fresh fish | 
| PublicTransportationRoute | The name of the public transportation route that the user is searching for. | Northeast corridor train<br/>Bus route 3X |
| Rating | The rating of a place. | 5 stars<br/>3 stars<br/>4 stars|
| RouteAvoidanceCriteria | Criteria for avoiding specific routes like avoiding accidents, constructions or tolls | Tolls <br/>Constructions<br/>Route 11|
| ServiceProvided | This is the service provided by a business or place such as haircut, snow plowing, landscaping. | haircut<br/>mechanic<br/>plumber|
| TransportationCompany | The name of a transport provider.|Amtrak<br/>Acela<br/>Greyhound|
| TransportationType | The transportation type.|Bus<br/>Train<br/>Driving|

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
The RestaurantReservation domain provides intents and entities related to managing restaurant reservations.

### Examples
```
Reserve at Zucca for two for tonight
Book a table at BJ's for tomorrow
Table for 3 in Palo Alto at 7
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Reserve | Request a reservation for a restaurant. |Reserve at Zucca for two for tonight<br/>Book a table for tomorrow<br/>Table for 3 in Palo Alto at 7|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Address| An event location or address for a reservation.|Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| Amenities | An attribute describing the amenities of a place.|ocean view<br/>non smoking|
| AppName | The name of an application for making reservations.|OpenTable<br/>Yelp<br/>TripAdvisor|
| Atmosphere | A description of the atmosphere of a restaurant or other place.|romantic<br/>casual<br/>good for groups|
| Cuisine | A type of food, cuisine or cuisine nationality. |Chinese<br/>Italian<br/>Mexican|
| MealType | A meal type associated with a reservation.|breakfast<br/>dinner<br/>lunch<br/>supper|
| PlaceName | The name of a local business, restaurant, public attraction, or institution.|IHOP<br/>Cheesecake Factory<br/>Louvre|
| PlaceType | The type of a local business, restaurant, public attraction, or institution.|restaurant<br/>opera<br/>cinema|
| Rating | The rating of a place or restaurant.|5 stars<br/>3 stars<br/>4 stars|

## Taxi 
 
The Taxi domain provides intents and entities for creating and managing taxi bookings.

### Examples
```
Get me a cab at 3 pm
How much longer do I have to wait for my taxi?
Cancel my Uber
```

### Intents
| Intent name | Description | Examples |
| ---------------- |-----------------------|----|
| Book | Call a taxi. |Get me a cab<br/>Find a taxi<br/>Book me an uber x|
| Cancel | Cancel an action relating to booking a taxi.|Cancel my taxi<br/>Cancel my Uber|
| Track | Track a taxi route.|How much longer do I have to wait for my taxi?<br/>Where is my Uber?|

### Entities
| Entity name | Description | Examples |
| ---------------- |-----------------------|----|
| Address| The address associated with booking a taxi. |Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| DestinationAddress| A destination location or address. |Palo Alto<br/>300 112th Ave SE<br/>Seattle|
| DestinationPlaceName | The name of a destination that is a local business, restaurant, public attraction, or institution. |Central Park<br/>Safeway<br/>Walmart|
| DestinationPlaceType | The type of a destination that is a local business, restaurant, public attraction, or institution. |Restaurant<br/>Opera<br/>Cinema|
| PlaceName | Name of local business, restaurant, public attraction, or institution. |Central Park<br/>Safeway<br/>Walmart|
| PlaceType| The type of place in a request to book a taxi.|Restaurant<br/>Opera<br/>Cinema|
| TransportationCompany | The name of a transport provider.|Amtrak<br/>Acela<br/>Greyhound|
| TransportationType | The transportation type.|Bus<br/>Train<br/>Driving|

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

