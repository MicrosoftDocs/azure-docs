<properties
	pageTitle="Azure Mobile Engagement Web SDK APIs | Microsoft Azure"
	description="The latest updates and procedures for the Web SDK for Azure Mobile Engagement"
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
	ms.date="06/07/2016"
	ms.author="piyushjo" />

# Use the Azure Mobile Engagement API in a web application

This document is an addition to the document that tells you how to [integrate Mobile Engagement in a web application](mobile-engagement-web-integrate-engagement.md). It provides in-depth details about how to use the Azure Mobile Engagement API to report your application statistics.

The Mobile Engagement API is provided by the `engagement.agent` object. The default Azure Mobile Engagement Web SDK alias is `engagement`. You can redefine this alias from the SDK configuration.

## Mobile Engagement concepts

The following parts refine common [Mobile Engagement concepts](mobile-engagement-concepts.md) for the web platform.

### `Session` and `Activity`

If the user stays idle for more than a few seconds between two activities, the user's sequence of activities is split into two distinct sessions. These few seconds are called the session timeout.

If your web application doesn't declare the end of user activities by itself (by calling the `engagement.agent.endActivity` function), the Mobile Engagement server automatically expires the user session within three minutes after the application page is closed. This is called the server session timeout.

### `Crash`

Automated reports of uncaught JavaScript exceptions are not created by default. However, you can report crashes manually by using the `sendCrash` function (see the section on reporting crashes).

## Reporting activities

Reporting on user activity includes when a user starts a new activity, and when the user ends the current activity.

### User starts a new activity

	engagement.agent.startActivity("MyUserActivity");

You need to call `startActivity()` each time user activity changes. The first call to this function starts a new user session.

### User ends the current activity

	engagement.agent.endActivity();

You need to call `endActivity()` at least once when the user finishes their last activity. This informs the Mobile Engagement Web SDK that the user is currently idle, and that the user session needs to be closed after the session timeout expires. If you call `startActivity()` before the session timeout expires, the session is simply resumed.

Because there's no reliable call for when the navigator window is closed, it's often difficult or impossible to catch the end of user activities inside a web environment. That's why the Mobile Engagement server automatically expires the user session within three minutes after the application page is closed.

## Reporting events

Reporting on events covers session events and standalone events.

### Session events

Session events usually are used to report the actions performed by a user during the user's session.

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

### Standalone events

Unlike session events, standalone events can occur outside the context of a session.

For that, use ``engagement.agent.sendEvent`` instead of ``engagement.agent.sendSessionEvent``.

## Reporting errors

Reporting on errors covers session errors and standalone errors.

### Session errors

Session errors usually are used to report the errors that have an impact on the user during the user's session.

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

Unlike session errors, standalone errors can occur outside the context of a session.

For that, use `engagement.agent.sendError` instead of `engagement.agent.sendSessionError`.

## Reporting jobs

Reporting on jobs covers reporting errors and events that occur during a job, and reporting crashes.

**Example:**

If you want to monitor an AJAX request, you'd use the following:

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

### Reporting errors during a job

Errors can be related to a running job instead of to the current user session.

**Example:**

If you want to report an error if an AJAX request fails:

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

### Reporting events during a job

Events can be related to a running job instead of to the current user session, thanks to the `engagement.agent.sendJobEvent` function.

This function works exactly like `engagement.agent.sendJobError`.

### Reporting crashes

Use the `sendCrash` function to report crashes manually.

The `crashid` argument is a string that identifies the type of crash.
The `crash` argument usually is the stack trace of the crash as a string.

	engagement.agent.sendCrash(crashid, crash);

## Extra parameters

You can attach arbitrary data to an event, error, activity, or job.

The data can be any JSON object (but not an array or primitive type).

**Example:**

	var extras = {"video_id": 123, "ref_click": "http://foobar.com/blog"};
	engagement.agent.sendEvent("video_clicked", extras);

### Limits

Limits that apply to extra parameters are in the areas of regular expressions for keys, value types, and size.

#### Keys

Each key in the object must match the following regular expression:

	^[a-zA-Z][a-zA-Z_0-9]*

This means that keys must start with at least one letter, followed by letters, digits, or underscores (\_).

#### Values

Values are limited to string, number, and Boolean types.

#### Size

Extras are limited to 1,024 characters per call (after the Mobile Engagement Web SDK encodes it in JSON).

## Reporting application information

You can manually report tracking information (or any other application-specific information) by using the `sendAppInfo()` function.

Note that this information can be sent incrementally. Only the latest value for a specific key will be kept for a specific device.

Like event extras, you can use any JSON object to abstract application information. Note that arrays or sub-objects are treated as flat strings (using JSON serialization).

**Example:**

Here is a code sample for sending the user's gender and birth date:

	var appInfos = {"birthdate":"1983-12-07","gender":"female"};
	engagement.agent.sendAppInfo(appInfos);

### Limits

Limits that apply to application information are in the areas of regular expressions for keys, and size.

#### Keys

Each key in the object must match the following regular expression:

	^[a-zA-Z][a-zA-Z_0-9]*

This means that keys must start with at least one letter, followed by letters, digits, or underscores (\_).

#### Size

Application information is limited to 1,024 characters per call (after the Mobile Engagement Web SDK encodes it in JSON).

In the preceding example, the JSON sent to the server is 44 characters long:

	{"birthdate":"1983-12-07","gender":"female"}
