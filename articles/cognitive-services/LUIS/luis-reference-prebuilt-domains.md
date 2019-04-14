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
---

# Prebuilt domain reference for your LUIS app
This reference provides information about the [prebuilt domains](luis-how-to-use-prebuilt-domains.md), which are prebuilt collections of intents and entities that LUIS offers.

[Custom domains](luis-how-to-start-new-app.md), by contrast, start with no intents and models. You can add any prebuilt domain intents and entities to a custom model.

## List of prebuilt domains
LUIS offers 20 prebuilt domains. 

| Prebuilt domain | Description | 
| ---------------- |-----------------------|
| [Calendar](#calendar) | The Calendar domain provides intent and entities for adding, deleting, or editing an appointment, checking participants availability, and finding information about a calendar event.|
| [Communication](#communication) | Sending messages and making phone calls.| 
| [Email](#email)|Send email.|
| [HomeAutomation](#omeAutomation) | Controlling smart home devices like lights and appliances.| 
| [Note](#note) | The Note domain provides intents and entities related to creating, editing, and finding notes.|
| [Places](#places)  | Handling queries related to places like businesses, institutions, restaurants, public spaces, and addresses.| 
| [RestaurantReservation](#restaurantreservation) | Handling requests to manage restaurant reservations.| 
| [ToDo](#todo) |  |
| [Utilities](#utilities)  | Handling requests that are common in many domains, like "help", "repeat", "start over."|
| [Weather](#weather) | Getting weather reports and forecasts.| 
| [Web](#web) | Navigating to a website.|

<!-- this section generated from https://github.com/diberry/swagger-tools/blob/master/luis-app.js -->

## Calendar

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it
* zh-cn

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it

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

### Supported languages

* de-de
* en-us
* es-es
* fr-fr
* it-it

### Intents 

* None
* WebSearch


### Entities 

* SearchText


### List entities 

* SearchEngine


### Prebuilt entities 

* url






