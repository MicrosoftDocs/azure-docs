---
title: Prebuilt domain reference - LUIS
titleSuffix: Azure Cognitive Services
description: Reference for the prebuilt domains, which are prebuilt collections of intents and entities from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 09/04/2019
ms.author: diberry
#source: https://raw.githubusercontent.com/Microsoft/luis-prebuilt-domains/master/README.md
#acrolinx bug for exception: https://mseng.visualstudio.com/TechnicalContent/_workitems/edit/1518317
---

# Prebuilt domain reference for your LUIS app
This reference provides information about the [prebuilt domains](luis-how-to-use-prebuilt-domains.md), which are prebuilt collections of intents and entities that LUIS offers.

[Custom domains](luis-how-to-start-new-app.md), by contrast, start with no intents and models. You can add any prebuilt domain intents and entities to a custom model.

# Supported Domains across Cultures

The table below summarizes the currently supported domains. Support for English is usually more complete than others. 

| Entity Type       | EN-US      | ZH-CN   | DE    | FR     | ES    | IT      | PT-BR |  JP  |      KO |        NL |    TR |
|:-----------------:|:-------:|:-------:|:-----:|:------:|:-----:|:-------:| :-------:| :-------:| :-------:| :-------:|  :-------:| 
| [Calendar](#calendar)    | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Communication](#communication)   | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Email](#email)           | ✓    | ✓       | ✓   | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [HomeAutomation](#homeautomation)           | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Notes](#notes)      | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Places](#places)    | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [RestaurantReservation](#restaurantreservation)   | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [ToDo](#todo)     | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Utilities](#utilities)          | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Weather](#weather)        | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |
| [Web](#web)    | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | ✓  | ✓      | ✓    | ✓    | ✓     | ✓  |

Prebuilt domains are **not supported** in:

* French Canadian
* Hindi
* Spanish Mexican

# Description for LUIS Prebuilt Domains
## **Calendar**
Calendar is anything about personal meetings and appointments, NOT public event (for example, world cup schedules, seattle event calendar) or generic calendar (for example, what day is it today, what does fall begin, when is Labor Day).
### **Intents**
Intent Name | Description | Examples
---------|----------|---------------
 AcceptEventEntry | Accept a(n) appointment/meeting/event on calendar. | Accept an appointment. <br> Accept the event <br> accept today's meeting.
 Cancel | Cancel the ongoing action by virtual assistant, such as canceling the process of creating a meeting. <br> ***Notice**: This intent mainly includes "Cancel" action in Calendar scenario. If you need general expression on "Cancel", please leverage "Cancel" intent in **Utilities** domain.* | It's ok, just cancel the event. <br> No, I just cancel the appointment.
 ChangeCalendarEntry | Change or reschedule the calendar entry. | Reschedule my 6 a.m. appointment tomorrow to 2 p.m. <br> Reschedule doctor's appointment for 5 PM <br> Reschedule lunch with jenny olson to Friday. <br> Change event time.
 CheckAvailability | Find availability for an appointment or meeting on the user's calendar or another person's calendar. | When is Jim available to meet? <br> Show when Carol is available tomorrow. <br> Is Chris free on Saturday?
 Confirm | Confirm whether to perform an operation/action based on previous intent. <br> ***Notice**: This intent mainly includes "Confirm" action for Calendar scenario. If you need more general expressions on "Confirm", please leverage "Confirm" intent in **Utilities** domain.*| That's correct, please create the meeting <br> Yes, thanks, connect to the meeting.
 ConnectToMeeting | Connect to a meeting. | Connect me to 11:00 conference call with Andy. <br> Accept the budget meeting call.
 ContactMeetingAttendees | Contact to the meeting attendees. | Tell the meeting I am running late to 3:00 meeting. <br> Notify colleagues for 8 am meeting that it needs to start at 8:30.
 CreateCalendarEntry | Add a new one-time item to the calendar. | Create a meeting about discussing issues. <br> create a meeting with abc@microsoft.com
 DeleteCalendarEntry | Request to delete a calendar entry.| Cancel my appointment with Carol. <br> Delete my 9 a.m. meeting. <br> Delete my event.
  FindCalendarEntry | Open the calendar application or search the calendar entry. | Find the dentist review appointment. <br> Show my calendar. <br> What's in my calendar on Thursday?
 FindCalendarWhen | Check the time when the schedule takes place. | When do I meet with Amber and Susan? <br> When do I have a brunch scheduled? 
 FindCalendarWhere | Check the place where the schedule takes place. | Where are my appointments tomorrow? <br>Where am i meeting with Stacy and Michael tomorrow for dinner?
  FindCalendarWho | Check the attendee(s) who will attend to the target schedule. | I want the confirmed attendants on tomorrow's meeting at 2. <br> Will jim be at the next nurses' meeting?
 FindCalendarDetail | Check and show the details for the schedule. | I need you to provide me the details of the meeting I have scheduled with my colleague Paul.
 FindDuration | Check the duration. | How much time will I have to pick up groceries? <br> How long do I have for lunch?
 FindMeetingRoom | Find the available meeting rooms. | What meet rooms do I have? <br> A new meeting location, find one.
 GoBack | Go back to last step or item.  <br> ***Notice**: Please refer to **Utilities** domain for more GoBack general utterances.* | Previous one <br> Back to last email.
 Reject | The user rejects what virtual assistant proposed. <br> ***Notice**: Please refer to **Utilities** domain for more Reject general utterances.* | Not need to set the event. <br> I have other things to do at that time.
ShowNext | Check the next event. <br> ***Notice**: Please refer to **Utilities** domain for more ShowNext general utterances.* | Give me my next event. <br> What is next in calendar?
 ShowPrevious | Check the previous event. <br> ***Notice**: Please refer to **Utilities** domain for more ShowPrevious general utterances.* | What is the schedule before that?
 TimeRemaining | Check the remaining time until next event. | Display how much time i have before my meetings. <br> Display the amount of time I have before my next meeting begins.
 
### **Entities**
Entity Name | Entity Type | Description | Examples | Slots
-------|-----------------------|-------------|---------|--------
ContactName | personName | The name of a contact or meeting attendee. | Meet with **Betsy**. <br>  Meet with **Aubrey** on July 3rd at 7 p.m. | Betsy <br> Aubrey <br> Amy 
DestinationCalendar | simple | The target calendar name. | lunch with mom Tuesday 12 **personal** <br> Use my **Google** calendar as my default calendar. <br> Update yoga class to mon wed at 3 p.m. list in **personal** calendar. | Google <br> personal <br> business <br> main
Duration | datetime | Duration of a meeting, appointment, or remaining time. | Add to work calender meeting with Gary to discuss scholarship details tomorrow at 11 am for **20 minutes**. <br> Add to the calendar an event at subway on Friday I'll be eating with Thomas for **an hour** at 9 p.m. | an hour <br> 2 days <br> 20 minutes 
EndDate | datetime | End date for a meeting or appointment. | Calendar add concert at bass hall Mary 3rd to **Mary 5th** | Mary 5th  
EndTime | datetime | End time for a meeting or appointment. | can you make it two thirty to **three** | three 
Location | simple | Location of calendar item, meeting or appointment.  Addresses, cities, and regions are good examples of locations. | put a meeting in **fremont** to put the tablet in Burma <br> pro bono meeting in **Edina** | 209 Nashville Gym <br> 897 Pancake house <br> Garage 
MeetingRoom | simple | Room for a meeting or appointment. | Add to work calendar meeting with jake at 2 p.m. in his **office** this Friday | his office <br> conference room <br> Room 2
MoveEarlierTimeSpan | datetime | The time user wants to move a meeting or appointment earlier. | Move my lunch date ahead by **30 minutes**. | 30 minutes <br> two hours 
MoveLaterTimeSpan |  datetime | The time user wants to move a meeting or appointment later. | push my meeting with orchid box back **4 hours**. | 4 hours <br> 15 minutes 
OrderReference | simple | The ordinal or relative position in a list, identifying an item to retrieve. | What's my next appointment for tomorrow? | next
OriginalEndDate | datetime | Original end date of a meeting or appointment. | Change my vacation from ending on **Friday** to Monday | Friday 
OriginalEndTime | datetime | Original end time of a meeting or appointment. | Make the one ending at **3** go until 4 | 3
OriginalStartDate | datetime | Original start date of a meeting or appointment. | Change **tomorrow**'s appointment from 10 a.m. to Wednesday at 9 a.m.  | tomorrow 
OriginalStartTime | datetime | Original start time of a meeting or appointment. | Change tomorrow's appointment from **10 a.m.** to Wednesday at 9 a.m. | 10 a.m.
PositionReference | ordinal | The absolute position in a list, identifying an item to retrieve. | The **second** one | second <br> No. 3 <br> number 5
RelationshipName | list | The relationship name of a contact. | add lunch at 1:00 P.M. with my **wife** | wife <br> husband <br> sister 
SlotAttribute | simple | The attribute user wants to query or edit. | change event **location** <br> change it the **time** to seven o'clock | location <br> time 
StartDate | datetime | Start date of a meeting or appointment. | Create a meeting on **Wednesday** at 4 p.m. | Wednesday 
StartTime | datetime | Start time of a meeting or appointment. | create a meeting on Wednesday at **4 p.m.** | 4 p.m.
Subject | simple, pattern.Any | Subject, such as title of a meeting or appointment. | What time is the **party preparation** meeting? | Dentist's <br> Lunch with Julia 
Message | simple, pattern.Any | The message to send to the attendees. | Alert attendees of dinner meeting that **I will be late**. | I will be late

## **Communication**
Requests to make calls, send texts/ IMs, find/add contacts and various other communication-related requests (generally outgoing). _Contact name only_ utterances do not belong to Communication domain.

### **Intents**
Intent Name | Description | Examples
---------|----------|---------
AddContact | Add a new contact to the user's list of contacts. | Add new contact.  <br>   Save this number and put the name as Jane.
AddFlag | Add flag to an email | Flag this email <br> Add a flag to this email.
AddMore | Add more to an email or text, as part of a step-wise email or text composition. | Add more to text.  <br>   Add more to email body.
Answer | Answer an incoming phone call. | Answer the call.  <br>   Pick it up.
AssignContactNickname | Assign a nickname to a contact. | Change Isaac to Dad.  <br>   Edit Jim's nickname. <br>   Add nickname to Patti Owens.
CallBack | Return a phone call. | Call back.
CallVoiceMail | Connect to the user's voice mail. | Connect me to my voicemail box. <br>Voice mail. <br>   Call voicemail.
Cancel | Cancel an operation. | Cancel. <br>   End it.
CheckIMStatus | Check the status of a contact in IM. | Is Jim's online status set to away? 
CheckMessages | Check for the new messages or emails. | Check my inbox <br>  Do I have any new mail?
Confirm | Confirm an action. | Yes, send it. <br> Right, I confirm that I want to send this email.
EndCall | End a phone call. | Hang up the call. <br> End up.
FindContact | Find contact information by name. | Find mum's number. <br>   Show me Carol's number.
FinishTask | Finish current task. | I'm done <br> That is all.
TurnForwardingOff | Turn off call forwarding. | Stop forwarding my calls. <br> Switch off call forwarding.
TurnForwardingOn | Turn on call forwarding. | Forwarding my calls to 3333 <br>  Switch on call forwarding to 3333.
GetForwardingsStatus | Get the current status of call forwarding. | Is my call forwarding turned on? <br>   Tell me if my call status is on or off.
GetNotifications | Get the notifications. | open my notifications <br>   can you check my phone facebook notifications
Goback | Go back to the previous step. | Go back to twitter <br>   Go back a step <br>   Go back
Ignore | Ignore an incoming call. | Don't answer <br>   Ignore call
IgnoreWithMessage | Ignore an incoming call and reply with text instead. | Don't answer that call but send a message instead. <br>   Ignore and send a text back.
Dial | Make a phone call. | Call Jim <br>   Please dial 311.
FindSpeedDial | Find the speedial number a phone number is set to and vice versa. | What is my dial number 5? <br>   Do I have speed dial set? <br>   What is the dial number for 941-5555-333?
Forward | Forward an email | Forward this email to Greg.
ReadAloud | Read a message or email to the user. | Read text. <br>   What did she say in the message?
PressKey | Press a button or number on the keypad. | Dial star. <br>   Press 1 2 3.
QueryLastText | Query the last text or message. | Who texted me? <br>   Who recently messaged me?
Redial | Redial or call a number again. | Redial. <br>   Redial my last call.
Reject | Reject an incoming call. | Reject call <br>   Can't answer now <br>   Not available at the moment and will call back later.
Reply | Reply a message. | respond to lore hound <br>   reply by typing i am on my way
SearchMessages | Search the messages by some conditions. | Can you search my emails sent by Jane?
SendEmail | Send an email. This intent applies to email but not text messages. | Email to Mike Waters: Mike, that dinner last week was splendid. <br>   Send an email to Bob.
SendMessage | Send a text message or an instant message. | Send text to Chris and Carol <br>   Facebook message greg <br>   
SetSpeedDial | Set a speed dial shortcut for a contact's phone number. | Set speed dial one for Carol. <br>   Set up speed dial for mom.
ShowCurrentNotification | Show current notifications. | Are there any new notifications? <br> Show me a notification.
ShowNext | See the next item, for example, in a list of text messages or emails. | Show the next one. <br>   Go to the next page.
ShowPrevious | See the previous item, for example, in a list of text messages or emails. | Show the previous one. <br>   Previous. <br>   Go to previous.
TurnSpeakerOff | Turn off the speaker phone. | Take me off speaker. <br>   Turn off speakerphone.
TurnSpeakerOn | Turn on the speaker phone. | Speakerphone mode. <br>   Put speakerphone on.

### **Entities**
Entity Name | Entity Type | Description | Examples | Slots
------|-------|----------|--------------|---------------
Attachment | simple | The attachment the user wants to send by text or email. | Email a **file** from onenote. <br> Send my housekeeping **doc** to Katie. | file <br> doc
AudioDeviceType | simple | Type of audio device (speaker, headset, microphone, etc.). | Answer using **hands-free**. <br> Redial on **speaker phone**. | speaker <br> hands-free <br> bluetooth
Category | simple | The category of a message or email, the category must has a clear definition in email system, such as "unread", "flag". Description w/o clear definition, for example, "new" and "recent" are not categories. | Mark all email as **read**  <br> New **high priority** email for Paul | important <br> high priority <br> read
ContactAttribute | simple | An attribute of the contact the user inquiries about.| Any **birthdays** next month I should know about? | birthdays <br> address <br> phone number
ContactName | personName  | The name of a contact or message recipient. | Send the mail to **Stevens** | Stevens
Date/Time | datetime | Datetime of an email received. | Read **today**'s mail <br> Who emailed me **today**? <br> who phoned at **7 p.m.**? | today <br> tomorrow
DestinationPhone | simple | The target user wants to call or send a text to. | make a call to **house** <br> send a text message to **home** | house <br> home
EmailAddress | email | The email address user wants to send or query. | send email to Megan.Flynn@MKF.com<br> abc@outlook.com 
EmailSubject | simple, pattern.Any | The text used as the subject line for an email. | Compose email to David with subject **hey**  | RE: interesting story
Key | simple | The key user wants to press. | Press the **space** key. <br> press **9** | pound <br> star <br> 8
Line | simple | The line user wants to use to send an email or a text from. | Read my last **hotmail** email. <br> Call Peter by **mobile**. <br> Call Dad using my **work** line.| hotmail <br> Skype <br> British cell
SenderName | personName | The name of the sender. | Read the email from **David** <br> Emails from Chanda | David <br> Chanda
FromRelationshipName | simple | The relationship name of the sender. | Read message from **Dad**. <br> Can you read me all text messages from **mom**? | Dad <br> Mom 
Message | simple, pattern.Any |  The message to send as an email or text.  | Send email saying "**I am busy**". | I am busy
OrderReference | simple | The ordinal or relative position in a list, identifying an item to retrieve. | What was the **last** message I sent? <br> Read **latest** nokia email. <br> Read **new** text messages. | last <br> latest <br> recent <br> newest
PositionReference | simple, ordinal | The ordinal or relative position in a list, identifying an item to retrieve.| What was the **first** message I sent? <br> The **3rd** one.| First <br> 3rd
phoneNumber | phoneNumber | The phone number user wants to call or send a text to. | send a text to **four one five six eight four five two eight four** | 3525214446
RelationshipName | simple | The relationship name of a contact or message recipient. | Email to my **wife** | wife
SearchTexts | simple, pattern.any | The texts used for filtering emails or messages | Search all emails that contain "**Surface Pro**" | Surface Pro
SpeedDial | simple | The speed dial. | Call **three four five**. <br> Set speed dial **one**. | 345 <br> 5

## **Email**
Email is a subdomain of the *Communication* domain. It mainly contains requests to send and receive messages through emails.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
AddMore | Add more to an email or text, as part of a step-wise email or text composition. | Add more to email body.
Cancel | Cancel an operation. <br> ***Notice**: Please refer to **Utilities** domain for more Cancel general utterances.* | Cancel. Don't send it. <br> End it.
CheckMessages | Check for the new messages/emails without conditional inquiry. If there is any condition, the utterances belong to *SearchMessage* intent. | Check my inbox. <br> Do i have any new mails? 
Confirm | Confirm an ongoing action related with processing emails. <br> ***Notice**: Please refer to **Utilities** domain for more Confirm general utterances.* | Yes, send it. <br> I confirm that I want to send this email.
Delete | Delete an email or the mails filtered by some conditions. | Put the email into recycle bin <br> Empty my inbox. <br> Remove Mary's email.
ReadAloud | Read a message or email to the user. <br> ***Notice**: Please refer to **Utilities** domain for more ReadAloud general utterances.*  | Read the email sent by Mary.
Reply | Reply a message to the current email. | Create a response to the email. <br> Reply by typing "thank you very much, best regards, John".
SearchMessages | Search the messages by some conditions, including sender name, time, and subject. | Show me the messages from Nisheen. <br> Can you search my emails titled "ABC"?
SendEmail | Send an email. | Email to Mike: Mike, that dinner last week was splendid. <br> Send an email to Bob.
ShowNext | See the next item(s) in a list of text messages or emails. <br> ***Notice**: Please refer to **Utilities** domain for more ShowNext general utterances.* | Show the next one. <br> Go to the next page.
ShowPrevious | Show the previous item(s) in a list of text messages or emails. <br> ***Notice**: Please refer to **Utilities** domain for more ShowPrevious general utterances.* | Show the previous one. <br> Previous. <br> Go to previous.
Forward | Forward an email. | Forward this email to Greg.
AddFlag | Add flag to an email. | Flag this email <br> Add a flag to this email.
QueryLastText | Query the last email. | Who sent email to me? <br> Who recently emailed me?


### **Entities**
Entity Name | Entity Type | Description | Examples | Slots
------|-------|----------|--------------|---------------
Attachment | simple | The attachment the user wants to send by text or email. | Email a **file** from onenote. <br> Send my housekeeping **doc** to Katie. | file <br> doc
ContactName | personName  | The name of a contact or message recipient. | Send the mail to **Stevens** | Stevens
Date | datetime | Date of an email received. | Read **today**'s mail <br> Who emailed me **today**? | today
EmailAddress | email | The email address user wants to send or query. | send email to Megan.Flynn@MKF.com<br> abc@outlook.com 
EmailSubject | simple, pattern.Any | The text used as the subject line for an email. | Compose email to David with subject **hey**  | RE: interesting story
SenderName | personName | The name of the sender. | Read the email from **David** <br> Emails from Chanda | David <br> Chanda
FromRelationshipName | simple | The relationship name of the sender. | Read message from **Dad**. <br> Can you read me all text messages from **mom**? | Dad <br> Mom 
Message | simple, pattern.Any |  The message to send as an email or text.  | Send email saying "**I am busy**". | I am busy
Category | simple | The category of a message or email, the category must has a clear definition in email system, such as "unread", "flag". Description w/o clear definition, for example, "new" and "recent" are not categories. | Mark all email as **read**  <br> New **high priority** email for Paul | important <br> high priority <br> read
OrderReference | simple | The ordinal or relative position in a list, identifying an item to retrieve. | What was the **last** message I sent? <br> Read **latest** nokia email. <br> Read **new** text messages. | last <br> latest <br> recent <br> newest
PositionReference | simple, ordinal | The ordinal or relative position in a list, identifying an item to retrieve.| What was the **first** message I sent? <br> The **3rd** one.| First <br> 3rd
RelationshipName | simple | The relationship name of a contact or message recipient. | Email to my **wife** | wife
Time | datetime | Time | send email **tonight**. | tonight
SearchTexts | simple, pattern.any | The texts used for filtering emails or messages | Search all emails that contain "**Surface Pro**" | Surface Pro 
Line | simple | The line user wants to use to send an email from. | Read my last **hotmail** email. <br> Send an email from my **work account**.| hotmail <br> work account 

## **HomeAutomation**
The HomeAutomation domain provides intents and entities related to controlling smart home devices. We mainly support the control command related to lights and air conditioner. But it has some generalization abilities on other electric appliances.
### **Supported Devices and Properties**
Device | Properties
-------|---------
Temperature sensor | Temperature
Light, lamp | On-off, brightness, color
TV, radio | On-off, volume
Air conditioner(A/C), thermostat | On-off, temperature, power
Fan | On-off, power
Outlets, dvd player, ice maker, etc. | On-off

### **Intents**
Intent Name | Description | Examples
---------|----------|---------
 TurnOff | User wants to turn off device or settings.  | Turn off the lights. <br> Switch off something. <br> Something off.
 TurnOn | Turn on a device or turn on and set the device to a particular setting or mode. | Turn on the light to 50%. <br> Turn on my coffee maker <br> Can you turn on my coffee maker?
 SetDevice | User wants to set the device to a particular setting or type.  | Set the air conditioner to 26 degrees. <br> Turn the lights blue. <br> Call this light as nightlight.
 QueryState | User asks for the state of a device or setting.  | What is the thermostat set to? <br> Is the A/C on? <br> What's the bedroom temperature?
 TurnUp | Turn up settings or brightness of devices. | Brighten the lights by 75 percent. <br> Up the brightness here by 10 percent.  <br> Make it warmer in the living room.
 TurnDown | Turning down BUT NOT off a device, either through dimming, the temperature or the brightness of the lights. | Turn down the library by 44%. <br> Dim the lights. <br> Make the room cooler.
### **Entities**
Entity Name | Entity Type | Description | Examples
-------|----------|--------------|---------------
DeviceName | List | User-defined text for their devices. | Blue<br> Christmas <br> Desk
DeviceType | List | Supported devices. | Lights <br> Air conditioner <br> nightlight
Location | simple | Location or room the device is in. | Kitchen<br> Downstairs <br> Bedroom
NumericalChange | simple | Amount by which a setting is increased or decreased. <br> <br> _The slot only appears with turn_up and turn_down intents._ | 3<br> 50%<br>
OrderReference | ordinal | The purpose of this slot is to capture the selection of the items. It indicates the position of the item on a list. | First<br> Second
Quantifier | List | Quantifier indicates how many instances of a particular entity are referenced. For example, "all", "every", etc. | All<br> Every<br> Everything
Setting | Simple | The setting the user wishes to set their device to, which includes scene, level, intensity, color, mode, temperature, state of the device. | Blue<br> 72 <br> Heat 
SettingType | List | The device setting the user is interested in. | Temperature<br> 
Time/Date |  datetime | Time and duration for operating a device| 5 minutes <br> 3 p.m.
Unit | List | To tag words like 'degrees', 'percent', "Fahrenheit", "Celsius" each unit term should be tagged separately. | Degrees<br> Percent


## **Notes**
Note domain facilitates creating notes and writing down items for users.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
AddToNote | Add information to an opened note. | Add to my planning note to contact my boss about the project.
Clear | Clear all items from a pre-existing note. | Remove all items from my vacation note. <br>Clear all from my reading note.
Confirm | Confirm an action relating to a note. <br> ***Notice**: This intent mainly includes "Confirm" action for Note scenario. If you need more general expressions on "Confirm", please leverage "Confirm" intent in **Utilities** domain.* | It's okay by me for this note. <br>I am confirming keeping all items on lists.
Create | Create a new note. | Create a note. <br>Note to remind me that Jason is in town first week of May. 
Delete | Delete an entire note. | Delete my vacation note. <br>Delete my groceries note.
ReadAloud | Read a note out loud. | Read me the first note. <br>Read me the details.
Close | Close the current note. | Close the note. <br>Close the current note.
Open | Open a pre-existing note. | Open my vocation note. <br>Open the note "planning".
RemoveSentence | Remove a sentence for a note. | Remove the last sentence. <br>Delete chips from my grocery note. <br>Remove pens from my school shopping note
ChangeTitle | Change the title of the note. | Named this note as "planning".

### **Entities**
Entity Name | Entity Type | Description | Examples 
------- | ------- | ------- | -------
Text | simple, pattern.Any | The text of a note or reminder. | stretch before walking <br> long run tomorrow
Title | simple, pattern.Any | Title of a note. | groceries <br> people to call <br> to-do
CreationDate | datetimeV2 | This slot is for when the user asks for notes created within a certain date/time window. | 
Quantifier | List | When a user asks to perform an action on 'all', 'every' or 'any' items or all text in a note. | all <br> any <br> every
OrderReference | ordinal | User wants to make actions with 'first', 'last', 'next', etc. items. | first <br> last


## **Places**
Places include businesses, institutions, restaurants, public spaces, and addresses. The domain supports place finding and inquiring the information a public place such as location, operating hours and distance. 
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
MakeCall | Make a phone call to a place. | applebees on 1000/200 Rojas St and call.
FindPlace | Search for a place (business, institution, restaurant, public space, address). But not: <li> Business name only: Starbucks <li> Location name only: Seattle/Norway <li> Cuisine, food or product only: Pizza/guacamole/Italian | Where's the nearest library? <br> Starbucks in Seattle. <br> Where's the nearest library? <br> 
GetAddress | Ask for the address of a place. | Show me the address of Guu on Robson street. <br> What is the address of the nearest Starbucks?
GetDistance | Ask about distance from current location to a specific place. | How far away is Holiday Inn?<br> How far is it to Bellevue square from here? <br> What's the distance to Tahoe?
GetPhoneNumber | Ask for the phone number of a place. | What is the phone number of the nearest Starbucks?<br> Give the number for Home Depot. <br> A phone number for Disneyland.
GetPriceRange | Ask for the range of per capita consumption for a place. | Average price of J.Sushi in Seattle. <br> Is the Cineplex half price on Wednesdays? <br> How much does a whole lobster dinner cost at Sizzler?
GetStarRating | Ask for the star rating of a place. | How is Zucca rated?<br> How many stars does the French Laundry have?<br> Is the aquarium in Monterrey good?
GetHours | Ask about the operating hours for a place. | At what time does Safeway close?<br> What are the hours for Home Depot?<br> Is Starbucks still open?
GetReviews | Ask for reviews of a place. | Show me reviews for Cheesecake Factory. <br> Read Cineplex reviews. <br> Are there any recent reviews for Humperdinks?
GetMenu | Ask for the menu items for a restaurant. | Does Zucca serve anything vegan? <br> What's on the menu at Sizzler? <br> Show me Applebee's menu.
RatePlace | Rate a place. | 4 star rating for Maxi's pizza in Kimberly. <br> Give 4-star to Bonefish on Tripadvisor. <br> Create a 4 star review for La Hacienda.
AddFavoritePlace | The user wants to add a location to their favorites or MVP list. | Save this location to my favorites. <br> Add Best Buy to my favorites.

### **Entities**
LUIS Entities | Entity Type | Description | Examples | Utterance Examples
--------------|-------------|-------------|----------|-------------------
AbsoluteLocation | simple | The location or address of a place. | Palo Alto <br> 300 112th Ave SE <br> Seattle | **1020 Middlefield Rd.** in **Palo Alto** <br> bird seed stores in **Seattle** <br> Get the distance from here to **300 112th Ave SE**.
Amenities | simple | The objective characteristics and benefits of a public place. | waterfront <br> free parking | Kirkland **waterfront** seafood restaurants. <br> Is there any **free parking** near me?
Cuisine | simple | A type of food, cuisine or cuisine nationality. | Chinese <br> Italian <br> Sushi <br> Noodle <br> | Help me find a **Chinese** restaurant. <br> What are the opening hours of the **Sushi** restaurant? <br> Where is the nearest **steak** house?
Date | datetime | datetime or duration for date of the targeted location. | tomorrow <br> today <br> 6 p.m. | What time does aquarium close **tomorrow**? <br> the Closest bike shop that is open after **6 p.m.**
Distance | dimension | The distance to a public place from user's currenct position. | 15 miles <br> 10 miles | a clothing store within **15 miles** <br> A kids' restaurant that is only **10 miles** away
MealType | List | Type of meal like breakfast or lunch. | breakfast <br> dinner | Search **breakfast** Greenwood Seattle <br> Find me a place to have my **lunch**.
Nearby | List | Describe a nearby place without absolute location or address. | nearest <br> in this area <br> around me | Find **nearest** indian restaurant. <br> Where is my **local** Wetherspoon? <br> Any good restaurants **around me**?
OpenStatus | List | Indicates whether a place is open or closed. | open <br> closed | What time does Yogurt Land **closed** today? <br> What are the **opening** hours for Costco?
PlaceName | simple | The name of a destination that is a business, restaurant, public attraction, or institution. The place name could contains a placetype if it is common used. | Central Park <br> Safeway <br> Walmart| What time does the **Safeway** pharmacy open? <br> Is **Walmart** open?
PlaceType | simple | The type of a destination that is a local business, restaurant, public attraction, or institution. | restaurant <br> opera <br> cinema | **cinemas** in Cambridge <br> Is there a **restaurant** near me?
PriceRange | simple | The price range of the products or service of the place. | cheap <br> cost effective <br> expensive | Find **affordable** appliance repair <br> What's a **cheap** pizza place that's open now?
Product | simple | The product offered by a place. | clothes <br> televisions | Where's the best place to get **food**? <br> Find me east kilbride looking for **televisions**.
Rating | simple | The rating of a place. | 5 stars <br> top <br> good | Are there any **good** places for me to go out and eat tomorrow <br> **best** Amsterdam restaurants <br> List **top** three pizza shops.


## **RestaurantReservation**
Restaurant reservation domain supports intents on handling reservation for restaurants.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
Reserve | Request a reservation for a restaurant. | Reserve at Zucca for two for tonight. <br> Book a table for tomorrow. <br> Table for 3 in Palo Alto at 7. <br> Make a reservation for 3 at Red Lobster.
DeleteReservation | Cancel or delete a reservation for a restaurant. | Cancel the reservation at Zucca tomorrow night. <br> Forget about my reservation for red lobster at 7:00 p.m. next Friday. <br> I don't need the reservation for Zucca, cancel it.
ChangeReservation | Change the time, place or number of people for an existing restaurant reservation. | Change my reservation to 9 p.m. <br> Change my reservation from Zucca to Red Lobster. <br> 7 people instead of 6 for the reservation at Zucca.
Confirm | Confirm an action related to reservation. <br> ***Notice**: This intent mainly includes "Confirm" action for Restaurant Reservation scenario. If you need more general expressions on "Confirm", please leverage "Confirm" intent in **Utilities** domain.* | Yes, I've made the reservations for tonight at 8 o'clock at the pasta maker. <br> Yes, just book it. <br> Confirm the reservation at Sushi Bar.
FindReservationDetail | Display the detailed information of the an existing reservation. | Find my reservation at renaissance San Diego <br> Show the reservation tomorrow. <br> Display details of my reservation for Zucca.
FindReservationWhere | Check the absolute location of the reservation. | Where is the location of Zucca in my reservation? <br> Show the locale of my reservation tomorrow.
FindReservationWhen | Check the exact time of the reservation | When is the reservation of Zucca for tomorrow? <br> The time for my reservation at Red Lobster.
Reject | The user rejects what virtual assistant proposed on managing a reservation. <br> ***Notice**:Please refer to **Utilities** domain for more Reject general utterances.* | Not need to set the event. | No, I don't want to change the reservation. <br> No, don't book it, I made a mistake.

### **Entities**
LUIS Entity | Entity Type | Description | Examples
-------|------|---------|-------------------
Address | simple | An event location or address for a reservation. | Palo Alto<br>300 112th Ave SE<br>Seattle
Atmosphere | List | A description of the atmosphere of a restaurant. | romantic<br>casual<br>good for groups<br>nice
Cuisine | simple | A type of food, cuisine or cuisine nationality. | Chinese<br>Italian<br>Mexican<br>Sushi<br>Noodle<br>steak
MealType | List | A meal type associated with a reservation. | breakfast<br>dinner<br>lunch<br>supper
PlaceName | simple | The name of a restaurant | Zucca<br>Cheesecake Factory<br>red lobster
Rating | simple | The rating of a place or restaurant. | 5 stars<br>3 stars<br>4-star
NumberPeople | simple | Number of people for reservation | 3<br>six
Time | datetime| The time for restaurant reservation | tomorrow<br>tonight<br>7:00 p.m.<br>Christmas Eve


## **ToDo**
_ToDo_ domain provides types of task lists for users to add, mark and delete their todo-items.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
AddToDo | The user wants to add task items for any of the list types. |  Remind me to buy milk. <br> Add an item called "buy milk" to my to-do list
Confirm | The user wants to confirm an ongoing action. The utterance contains explicit signal like "Yes" to confirm an operation. <br> <br> ***Notice**: This intent mainly includes "Confirm" action for ToDo scenario. If you need more general expressions on "Confirm", please leverage "Confirm" intent in **Utilities** domain.* | Please delete the task. <br> I'm sure I want to add this task. <br> Yes, I want to do that.
Cancel | The user wants to cancel ongoing action.  <br> <br> ***Notice**: This intent mainly includes "Confirm" action for Restaurant Reservation scenario. If you need more general expressions on "Confirm", please leverage "Confirm" intent in **Utilities** domain.* | No, forget it. <br> just cancel the task. <br> No, don't add it.
DeleteToDo | Delete an item in the task list by referring to its order or delete all to-do items. | Remove all tasks. <br> Help me to delete the second one.
MarkToDo | Mark a task as finished or done by referring to its order or task content. | Mark the task "buy milk" as finished. <br> Complete task reading. <br> Complete all.
ShowNextPage | A list will be split into several pages to shown. Show list items on the next page for the user. | Can you show next page in the shopping list? <br> What’s on the next? <br> What's next?
ShowPreviousPage | Show list items on the previous page for the user. | show previous. <br> I need to check previous tasks.
ShowToDo | Show all the items on the to-do list. | Show my shopping list. <br> Show my grocery list.

### **Entities**
LUIS Entity | Entity Type | Description | Examples
-------|------|---------|-------------------
ContainsAll | simple | Represent all or any items in task list | can you help to remove **all** tasks. <br> Finish **everything**.
ordinal | ordinal | An ordinal or numeric reference to an item. | Mark the **third** one as completed. <br> Delete the **first** task.
ListType | simple | Task list type.  | Add shoes to my **shopping** list.
FoodOfGrocery | List | Detect a list of food items | Remind me to buy **milk**. <br> Add **beef** to my grocery list.
TaskContent | simple, pattern.any | Detect the content of a task. | Remind me to **call my mother** please. <br> Add **celebrate John’s birthday** to my to-do list


## **Utilities**
_Utilities_ domain is a general domain among all _LUIS_ prebuilt models which contains common intents and utterances in difference scenarios.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
 Cancel | Cancel an action/request/task/service. | Cancel it. <br> Never mind, forget it.
 Confirm | Confirm an action. | Sure <br> Yes, please <br> Confirm.
 Reject | The user rejects what virtual assistant proposed. | No
 FinishTask | Finish a task the user started. | I am done. <br> That's all. <br> Finish.
 GoBack | Go back one step or return to a previous step. | Go back a step. <br> Go back.
 Help | Request for help. | Please help. <br> Open help.
 Repeat | Repeat an action. | Say it again.
 ShowNext | Show or tell the next item(s). | Show the next one.
 ShowPrevious | Show the previous item in a series. | Show previous one.
 StartOver | Restart the app or start a new session. | Restart.
 Stop | Tell the virtual assistant to stop talking.  | Stop saying this please.
 SelectAny | User asks to select any item or results shown on the screen. | Any of it. <br> Select any one.
 SelectNone | User selects none of the existing items and asks for more options. | Give me other suggestions. <br> None of them.
  SelectItem | User asks to select an item or results shown on the screen. | Select the third one. <br> Select the top right one.
 Escalate | Ask for a customer service to handle the issues. | Can I talk to a person?
 ReadAloud | Read something aloud to user. | Read this page. <br> Read it aloud.

### **Entities**
LUIS Entity | Entity Type | Description | Examples
------------|-------------|-------------|---------
ordinal | ordinal | An ordinal or numeric reference to an item. | The **second** one. <br> **Next** one.
number | number | Quantity of items user wants | The next **3** items
DirectionalReference | simple | A reference point for where on the screen an item is located. | The right one <br> upper

## **Weather**
Weather domain focuses on checking weather condition and advisories with location and time or checking time by weather conditions.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
 CheckWeatherValue | Ask for weather or a weather-related factor for a location on forecast or past information. <br> Weather-related factors include: <li> temperature </li> <li> rain/snow/precipitation </li> <li> dry/wet/humidity </li> <li> fog </li> <li> UV index </li> <li> inches of rain/snow </li> | What is the Air Quality Index in Beijing? <br> How much rain is expected in Seattle in March? <br> Record highest temperature of Hawaii.
 CheckWeatherTime | Ask for the time of forecasted or historical weather-related factors for a location. | When is it expected to rain? <br> A good time to go to Canada <br> When is the hottest month in Minnesota?
 QueryWeather | Ask about the weather condition or weather-related factors for a specific location for which a "yes, no or maybe" response is expected, or ask for activity advise that depends on the weather condition. | Will it rain tomorrow? <br> Is it sunny today? <br> Is May too early to go to Alaska?
 ChangeTemperatureUnit | Change the unit of weather, including Celsius,  Kelvin and Fahrenheit. | Convert in celsius. <br> Can i get that in Kelvin?
 GetWeatherAdvisory | Get weather advisories or alert from a specific location. | Are there weather advisories in Memphis? <br> Are there any weather alerts for my area?

### **Entities**
LUIS Entity | Entity Type | Description | Examples
------------|-------------|-------------|---------
Location | geography | The absolute or implicit location for a weather request. | Palo Alto<br>Shanghai<br>Seattle<br>Delvina<br>
Date/Time   | datetime | Datetime or duration for querying the weather. | November<br>hourly<br>morning<br>This weekend<br>10 day<br>
AdditionalWeatherCondition | list | Additional description word for weather, such as the speed or direction of wind. | direction<br>Fast<br>speed
Historic | simple | Description words of historical weather condition, including average、bordered cases in past time period. | past<br>historical/history<br>seasonal<br>best time<br>ever recorded
PrecipitationUnit | dimension | The precipitation for snow or rain. | 5 inches<br>6 cm
SuitableFor | simple | The description of a human activity under a weather condition, which is common when users query activity advice that depends on the weather condition. | jacket<br>umbrella<br>swimming
TemperatureUnit |temperature | temperature | 18 Celsius<br>7 Kelvin degrees
WeatherRange | simple | The specific condition of temperature, wind and other weather conditions among a period of time | maximum<br>high<br>low<br>average high<br>Highest
WeatherCondition | simple | Weather condition description | sunny<br>rain<br>raining<br>temperature<br>snow<br>hot
WindDirectionUnit | list | The direction words of wind | north<br>south<br>east<br>west<br>northeast


## **Web**
The Web domain provides the intent and entities for search for a website.
### **Intents**
Intent Name | Description | Examples
---------|----------|---------
 WebSearch | A request to navigate to a specified website or search in a search engine. | Search surface in google.com. <br> Find happy birthday song on web <br> Go to www.twitter.com.

### **Entities**
LUIS Entity | Entity Type | Description | Examples
------------|-------------|-------------|---------
SearchEngine | List | The search engine user wants to use. | Bing <br> Google
SearchText | simple, pattern.Any | The text user wants to search. <br> _Tag "friends in facebook" as SearchText if the website after "in" is not a search engine. Url should also tag as SearchText._ | Movie <br> Deep learning <br> Tom cruise
Link | url | The website link. | www.twitter.com

