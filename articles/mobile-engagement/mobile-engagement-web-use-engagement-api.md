<properties
	pageTitle="Azure Mobile Engagement Web SDK APIs"
	description="Latest updates and procedures for Web SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="web"
	ms.devlang="js"
	ms.topic="article"
	ms.date="02/29/2016"
	ms.author="piyushjo" />

# How to Use the Engagement API in a Web application

This document is an add-on to the document [How to Integrate Engagement on Android](mobile-engagement-web-integrate-engagement.md). It provides in depth details about how to use the Engagement API to report your application statistics.

The Engagement API is provided by the ``engagement.agent`` object.

## Engagement concepts

The following parts refine the common [Mobile Engagement Concepts](mobile-engagement-concepts.md), for the Web platform.

### `Session` and `Activity`

If the user stays more than a few seconds idle between two *activities*, then his sequence of *activities* is split in two distinct *sessions*. These few seconds are called the *session timeout*.

If your Web application doesn't declare the end of the user activities by itself (by calling the
`engagement.agent.endActivity` function), the Engagement server will automatically expire the user session 30 minutes
after the last call to the `engagement.agent.startActivity` function.  This behavior is called the server *session timeout*.

### `Crash`

There is no automated report of JavaScript uncaught exceptions. Nevertheless, you can report crashes manually by using the `sendCrash` function (see below).

## Reporting Activities

### User starts a new Activity

	engagement.agent.startActivity("MyUserActivity");

You need to call `startActivity()` each time the user activity changes. The first call to this function starts a new
user session.

### User ends his current Activity

	engagement.agent.endActivity();

You need to call `endActivity()` at least once when the user finishes his last activity. This informs the Engagement SDK that the user is currently idle, and that the user session need to be closed once the session timeout will expire (if you call `startActivity()` before the session timeout expires, the session is simply resumed).

It is often difficult or impossible to catch the end of user activities inside web environments (no reliable call when the navigator window is closed). That's why the Engagement server automatically expires the user sessions 30 minutes after the last call to the `engagement.agent.startActivity` function.

## Reporting Events

### Session events

Session events are usually used to report the actions performed by a user during his session.

**Example without extra data:**

	loginButton.onclick = function() {
	  engagement.agent.sendSessionEvent('login');
	  // [...]
	}

**Example with extra data:**

	loginButton.onclick = function() {
	  engagement.agent.sendSessionEvent('login', {user: 'alice'});
	  // [...]
	}

### Standalone Events

Contrary to session events, standalone events can occur outside of the context of a session.

For that, use ``engagement.agent.sendEvent`` instead of ``engagement.agent.sendSessionEvent``.

## Reporting Errors

### Session errors

Session errors are usually used to report the errors impacting the user during his session.

**Example without extra data:**

	var validateForm = function() {
	  // [...]
	  if (password.length < 6) {
	    engagement.agent.sendSessionError('password_too_short');
	  }
	  // [...]
	}

**Example with extra data:**

	var validateForm = function() {
	  // [...]
	  if (password.length < 6) {
	    engagement.agent.sendSessionError('password_too_short', {length: 4});
	  }
	  // [...]
	}

### Standalone errors

Contrary to session errors, standalone errors can occur outside of the context of a session.

For that, use `engagement.agent.sendError` instead of `engagement.agent.sendSessionError`.

## Reporting Jobs

### Example

Suppose you want to monitor an Ajax request:
			
	// [...]
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	  // [...]
	    engagement.agent.endJob('publish');
	  }
	}
	engagement.agent.startJob('publish');
	xhr.send();
	// [...]

### Reporting Errors during a Job

Errors can be related to a running job instead of being related to the current user session.

**Example:**

Suppose you want to report an error if an Ajax request fails:

	// [...]
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // [...]
	    if (xhr.status == 0 || xhr.status >= 400) {
	      engagement.agent.sendJobError('publish_xhr', 'publish', {status: xhr.status, statusText: xhr.statusText});
	    }
	    engagement.agent.endJob('publish');
	  }
	}
	engagement.agent.startJob('publish');
	xhr.send();
	// [...]

### Reporting Events during a job

Events can be related to a running job instead of being related to the current user session thanks to the `engagement.agent.sendJobEvent` function.

This function works exactly like the `engagement.agent.sendJobError`.

### Reporting Crashes

the `sendCrash` function is used to report crashes manually.

the `crashid` argument is a string used to identify the type of the crash.
the `crash` argument is usually the stack trace of the crash as a string.

	engagement.agent.sendCrash(crashid, crash);

## Extra parameters

Arbitrary data can be attached to an event, an error, an activity or a job.

This data can be any JSON object (not an array or primitive types).

**Example**

	var extras = {"video_id": 123, "ref_click": "http://foobar.com/blog"};
	engagement.agent.sendEvent("video_clicked", extras);

### Limits

#### Keys

Each key in the object must match the following regular expression:

`^[a-zA-Z][a-zA-Z_0-9]*`

It means that keys must start with at least one letter, followed by letters, digits or underscores (\_).

#### Values

Values are limited to string, number and boolean types.

#### Size

Extras are limited to **1024** characters per call (once encoded in JSON by the SDK).

## Reporting Application Information

You can manually report tracking information (or any other application specific information) using the `sendAppInfo()` function.

Note that these information can be sent incrementally: only the latest value for a given key will be kept for a given device.

Like event extras, any JSON object can be used to abstract application information, note that arrays or sub-objects will be treated as flat strings (using JSON serialization).

### Example

Here is a code sample to send user gender and birthdate:

	var appInfos = {"birthdate":"1983-12-07","gender":"female"};
	engagement.agent.sendAppInfo(appInfos);

### Limits

#### Keys

Each key in the object must match the following regular expression:

`^[a-zA-Z][a-zA-Z_0-9]*`

It means that keys must start with at least one letter, followed by letters, digits or underscores (\_).

#### Size

Application information are limited to **1024** characters per call (once encoded in JSON by the SDK).

In the previous example, the JSON sent to the server is 44 characters long:

			{"birthdate":"1983-12-07","gender":"female"}
 
