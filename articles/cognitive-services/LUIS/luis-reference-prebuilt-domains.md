---
title: Prebuilt domain reference
titleSuffix: Azure
description: Reference for the prebuilt domains, which are prebuilt collections of intents and entities from Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/07/2019
ms.author: diberry
#gen-tool: https://github.com/diberry/swagger-tools/blob/master/luis-app.js
---

# Prebuilt domain reference for your LUIS app
This reference provides information about the [prebuilt domains](luis-how-to-use-prebuilt-domains.md), which are prebuilt collections of intents and entities that LUIS offers.

[Custom domains](luis-how-to-start-new-app.md), by contrast, start with no intents and models. You can add any prebuilt domain intents and entities to a custom model.

## List of prebuilt domains

LUIS offers the following prebuilt domains. 

| Prebuilt domain | Description | 
| ---------------- |-----------------------|
| [Calendar](#calendar) | The Calendar domain provides intent and entities for adding, deleting, or editing an appointment, checking participants availability, and finding information about a calendar event.|
| [Communication](#communication) | Sending messages and making phone calls.| 
| [Email](#email)|Manage email tasks such as reading, replying and flagging emails.|
| [HomeAutomation](#homeautomation) | Controlling smart home devices like lights and appliances.| 
| [Note](#note) | Manage note taking tasks such as creating, editing, and finding notes.|
| [Places](#places)  | Handling queries related to places like businesses, institutions, restaurants, public spaces, and addresses.| 
| [RestaurantReservation](#restaurantreservation) | Manage tasks associated with reservations, such as booking a table at a restaurant or changing or canceling a reservation at a restaurant.| 
| [ToDo](#todo) | Handling requests for task list. |
| [Utilities](#utilities)  | Handling requests that are common in many domains, like 'help', 'repeat', 'start over.'|
| [Weather](#weather) | Getting weather reports and forecasts.| 
| [Web](#web) | Navigating to a website.|

## Supported domains across cultures

The table below summarizes the currently supported domains. Support for English is usually more complete than others.

| Entity Type       | EN-US      | ZH-CN   | DE    | FR     | ES    | IT      | PT-BR |  JP  |      KO |        NL |    TR |
|:-----------------:|:-------:|:-------:|:-----:|:------:|:-----:|:-------:| :-------:| :-------:| :-------:| :-------:|  :-------:| 
| Calendar    | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -      | -    | -    | -     | -  |
| Communication   | ✓    | -       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Email           | ✓    | ✓       | ✓   | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| HomeAutomation           | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Notes      | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| Places    | ✓    | -       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| RestaurantReservation   | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| ToDo     | ✓    | ✓       | ✓    | ✓     | ✓     | ✓  | -  | -      | -    | -    | -     | -  |
| ToDo_IPA        | ✓    | ✓       | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Utilities          | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Weather        | ✓    | ✓        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |
| Web    | ✓    | -        | ✓    | ✓      | ✓     | ✓       | -  | -      | -    | -    | -     | -  |

<!-- 04/18/2019 - this section (below this comment) generated from https://github.com/diberry/swagger-tools/blob/master/luis-app.js -->

## Calendar

### Intents 

* AcceptEventEntry
* Cancel
* ChangeCalendarEntry
* CheckAvailability
* Confirm
* ConnectToMeeting
* ContactMeetingAttendees
* CreateCalendarEntry
* DeleteCalendarEntry
* FindCalendarDetail
* FindCalendarEntry
* FindCalendarWhen
* FindCalendarWhere
* FindCalendarWho
* FindDuration
* FindMeetingRoom
* GoBack
* None
* Reject
* ShowNext
* ShowPrevious
* TimeRemaining


### Entities 

* DestinationCalendar
* Duration
* EndDate
* EndTime
* Location
* MeetingRoom
* Message
* MoveEarlierTimeSpan
* MoveLaterTimeSpan
* OrderReference
* OriginalEndDate
* OriginalEndTime
* OriginalStartDate
* OriginalStartTime
* PositionReference
* SlotAttribute
* StartDate
* StartTime
* Subject


### List entities 

* RelationshipName


### Prebuilt entities 

* personName


## Communication

### Intents 

* AddContact
* AddFlag
* AddMore
* Answer
* AssignContactNickname
* CallBack
* CallVoiceMail
* Cancel
* CheckIMStatus
* CheckMessages
* Confirm
* Dial
* EndCall
* FindContact
* FindSpeedDial
* FinishTask
* Forward
* GetForwardingsStatus
* GetNotifications
* GoBack
* Ignore
* IgnoreWithMessage
* None
* PressKey
* QueryLastText
* ReadAloud
* Redial
* Reject
* Reply
* SearchMessages
* SendEmail
* SendMessage
* SetSpeedDial
* ShowNext
* ShowPrevious
* TurnForwardingOff
* TurnForwardingOn
* TurnSpeakerOff
* TurnSpeakerOn


### Entities 

* Attachment
* AudioDeviceType
* Category
* ContactAttribute
* ContactName
* DestinationPhone
* EmailPlatform
* EmailSubject
* FromRelationshipName
* Key
* Line
* Message
* MessageType
* OrderReference
* PositionReference
* RelationshipName
* SearchTexts
* SenderName
* SpeedDial


### Prebuilt entities 

* datetimeV2
* email
* phonenumber


## Email

### Intents 

* AddFlag
* AddMore
* Cancel
* CheckMessages
* Confirm
* Delete
* Forward
* None
* QueryLastText
* ReadAloud
* Reply
* SearchMessages
* SendEmail
* ShowNext
* ShowPrevious


### Entities 

* Attachment
* Category
* ContactName
* Date
* EmailSubject
* FromRelationshipName
* Line
* Message
* OrderReference
* PositionReference
* RelationshipName
* SearchTexts
* SenderName
* Time


### Pattern.Any entities 

* EmailSubject.Any
* Message.Any
* SearchTexts.Any


### Prebuilt entities 

* email
* ordinal


## HomeAutomation

### Intents 

* None
* QueryState
* SetDevice
* TurnDown
* TurnOff
* TurnOn
* TurnUp


### Entities 

* DeviceName
* Duration
* Location
* NumericalChange
* Setting
* Time
* Unit


### List entities 

* DeviceType
* Quantifier
* SettingType


### Prebuilt entities 

* ordinal


## Note

### Intents 

* AddToNote
* ChangeTitle
* Clear
* Close
* Create
* Delete
* None
* Open
* ReadAloud
* RemoveSentence


### Entities 

* OrderReference
* Quantifier
* Text
* Title


### Pattern.Any entities 

* Text.any
* Title.any


### Prebuilt entities 

* datetimeV2
* ordinal


## Places

### Intents 

* AddFavoritePlace
* FindPlace
* GetAddress
* GetDistance
* GetHours
* GetMenu
* GetPhoneNumber
* GetPriceRange
* GetReviews
* GetStarRating
* MakeCall
* None
* RatePlace


### Entities 

* AbsoluteLocation
* Amenities
* Cuisine
* PlaceName
* PlaceType
* PriceRange
* Product
* Rating


### List entities 

* MealType
* Nearby
* OpenStatus


### Prebuilt entities 

* datetimeV2
* dimension


## RestaurantReservation

### Intents 

* ChangeReservation
* Confirm
* DeleteReservation
* FindReservationEntry
* FindReservationWhen
* FindReservationWhere
* None
* Reject
* Reserve


### Entities 

* Address
* Cuisine
* NumberPeople
* PlaceName
* Rating
* Time


### List entities 

* Atmosphere
* MealType


## ToDo

### Intents 

* AddToDo
* Cancel
* Confirm
* DeleteToDo
* MarkToDo
* None
* ShowNextPage
* ShowPreviousPage
* ShowToDo


### Entities 

* ContainsAll
* ListType
* TaskContent


### Pattern.Any entities 

* TaskContent.Any


### Prebuilt entities 

* ordinal


## Utilities

### Intents 

* Cancel
* Confirm
* Escalate
* FinishTask
* GoBack
* Help
* None
* ReadAloud
* Reject
* Repeat
* SelectAny
* SelectItem
* SelectNone
* ShowNext
* ShowPrevious
* StartOver
* Stop


### Entities 

* DirectionalReference


### Prebuilt entities 

* number
* ordinal


## Weather

### Intents 

* ChangeTemperatureUnit
* CheckWeatherTime
* CheckWeatherValue
* GetWeatherAdvisory
* None
* QueryWeather


### Entities 

* Historic
* SuitableFor
* TemperatureRange
* WeatherCondition


### List entities 

* AdditionalWeatherCondition
* WindDirectionUnit


### Prebuilt entities 

* datetimeV2
* dimension
* geographyV2
* temperature


## Web

### Intents 

* None
* WebSearch


### Entities 

* SearchText


### List entities 

* SearchEngine


### Prebuilt entities 

* url
