<properties
	pageTitle="Mobile Engagement Concepts"
	description="Mobile Engagement Concepts"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="kpiteira"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="01/24/2015"
	ms.author="kapiteir" />

#Azure Mobile Engagement Concepts

Mobile Engagement defines a few concepts common to all supported platforms. This page briefly describes those concepts.

This page is a good start if you are new to Mobile Engagement. Also make sure to read the documentation specific to the platform you are using, as it will refine the concepts described in this page with more details and examples as well as possible limitations.

##Devices and Users
Mobile Engagement identifies users by generating a unique identifier for each device. This identifier is called the device identifier (or `deviceid`). It is generated in such a way that all applications running of the same device share the same device identifier.

Implicitly, it means that Mobile Engagement considers one device to belong to exactly one user, and thus, users and devices are equivalent concepts.

##Sessions and Activities
A session is one use of the application performed by a user, from the time he starts using it, until he stops.

An activity is one use of a given sub-part of the application performed by one user (it is usually a screen, but it can be anything suitable to the application).

A user can only perform one activity at a time.

An activity is identified by a name (limited to 64 characters) and can optionally embed some extra data (in the limit of 1024 bytes).

Sessions are automatically computed from the sequence of activities performed by users.: a session starts when the user starts his first activity and stops when he finishes his last activity. This means that sessions does not need to be explicitly started or stopped. Instead, activities does: if no activity is reported, no session is reported.

##Events
Events are used to report instant actions (like button pressed or articles read by users).

An event can be related to the current session, to a running job or can be stand alone.

An event is identified by a name (limited to 64 characters) and can optionally embed some extra data (in the limit of 1024 bytes).

##Error
Errors are used to report issues correctly detected by the application (like incorrect user actions, or API call failures).

An error can be related to the current session, to a running job or can be stand alone.

An error is identified by a name (limited to 64 characters) and can optionally embed some extra data (in the limit of 1024 bytes).

##Job
Jobs are used to report actions having a duration (like duration of API calls, display time of ads, duration of background tasks or duration of user actions).

A job is not related to a session, because task can be performed in background, without any user interaction.

A job is identified by a name (limited to 64 characters) and can optionally embed some extra data (in the limit of 1024 bytes).

##Crash
Crashes are issued automatically by the Mobile Engagement SDK to report application failures (i.e. issues not detected by the application that make it crash).

##Application information
Application information (or `app info`) are used to tag users, i.e. to associate some data to the users of an application (this is similar to web cookies, except that app info are stored server side on the Mobile Engagement platform).

An app info can be registered by using Mobile Engagement SDK’s API or by using Mobile Engagement platform’s Device API.

An app info is a key/value pair associated to a device. The key is the name of the app info (limited to 64 ASCII letters [a-zA-Z], numbers [0-9] and underscores [_]). The value (limited to 1024 characters) can be any string, integer, date (yyyy-MM-dd) or boolean (true or false).

Any number of app info can be associated to a device, within the limits defined by the Mobile Engagement pricing terms. For one given key, Mobile Engagement only keeps track of the latest value set (no history). Setting or changing the value of an app info forces Mobile Engagement to re-evaluate audience criteria set on this app info (if any) meaning that app info can be used to trigger realtime pushes.

##Extra data
Extra data (or extras) is some arbitrary data that can be attached to events, errors, activities and jobs.

Extras are structured similarly to JSON objects: they are made of a tree of key/value pairs. Keys are limited to 64 ASCII letters [a-zA-Z], numbers [0-9] and underscores [_]) and the total size of extras is limited to 1024 characters (once encoded in JSON by the Mobile Engagement SDK).

The whole tree of key/value pairs is stored as a JSON object. Nevertheless, only the first level of keys/values is decomposed to be directly accessible to some advanced functions like Segments (e.g. you can easily define a segment “SciFi fans” made of all users having sent at least 10 times the event named “content_viewed” with the extra key “content_type” set to the value “scifi” in the last month). It is thus highly recommended to send only extras made of simple lists of key/value pairs using scalar values (e.g. strings, dates, integers or boolean).
