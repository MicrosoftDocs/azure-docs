<properties
	pageTitle="Advanced Configuration for Android Mobile Engagement"
	description="Advanced configuration options for Android for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="piyushjo;ricksal" />

# Advanced Configuration for Android Mobile Engagement

> [AZURE.SELECTOR]
- [Android](mobile-engagement-android-logging.md)

This procedure describes how to configure various advanced configuration options for Engagement Android apps.

## Prerequisites

[AZURE.INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

## Permission Requirements
A number of options require specific permissions, all of which are listed here for reference, as well as in-line in the specific feature. Add these permissions to the AndroidManifest.xml of your project immediately before or after the `<application>` tag.


### Basic reporting
These permissions are required for basic reporting fucntionality.

		<uses-permission android:name="android.permission.INTERNET"/>
		<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
		<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
		<uses-permission android:name="android.permission.VIBRATE" />
		<uses-permission android:name="android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"/>

### Wake locks

If you want to be sure that statistics are sent in real time when using Wifi or when the screen is off, add the following optional permission:

		<uses-permission android:name="android.permission.WAKE_LOCK"/>

### Background reporting

By default, real time location reporting is only active when the application runs in foreground (i.e. during a session). To enable reporting also in the background, permissions are required.

		<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

And starting with Android M, [some permissions are managed at run time](mobile-engagement-android-location-reporting.md#Android-M-Permissions).

### Real-time location reporting
You must ensure that this permission is present:

<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

Or you can keep using ``ACCESS_FINE_LOCATION`` if you already use it in your application.

### GPS Based Reporting
You must ensure that this permission is present:

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>


## Manifest file configuration options

### Crash report

If you want to disable crash reports, add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:reportCrash" android:value="false"/>

### Burst threshold

By default, the Engagement service reports logs in real time. If your application reports logs very frequently, it is better to buffer the logs and to report them all at once on a regular time base (this is called the "burst mode"). To do so, add this code between the `<application>` and `</application>` tags:

		<meta-data android:name="engagement:burstThreshold" android:value="{interval between too bursts (in milliseconds)}"/>

The burst mode slightly increase the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration will be rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). It is recommended to use a burst threshold no longer than 30000 (30s).

### Session timeout

By default, a session is ended 10s after the end of its last activity (which usually occurs by pressing the Home or Back key, by setting the phone idle or by jumping into another application). This is to avoid a session split each time the user exit and return to the application very quickly (which can happen when he pick up a image, check a notification, etc.). You may want to modify this parameter. To do so, add this (between the `<application>` and `</application>` tags):

		<meta-data android:name="engagement:sessionTimeout" android:value="{session timeout (in milliseconds)}"/>

## Disable log reporting

### Using a method call

If you want Engagement to stop sending logs, you can call:

			EngagementAgent.getInstance(context).setEnabled(false);

This call is persistent: it uses a shared preferences file.

If Engagement is active when you call this function, it may take 1 minute for the service to stop. However it won't launch the service at all the next time you launch the application.

You can enable log reporting again by calling the same function with `true`.

### Integration in your own `PreferenceActivity`

Instead of calling this function, you can also integrate this setting directly in your existing `PreferenceActivity`.

You can configure Engagement to use your preferences file (with the desired mode) in the `AndroidManifest.xml` file with `application meta-data`:

-   The `engagement:agent:settings:name` key is used to define the name of the shared preferences file.
-   The `engagement:agent:settings:mode` key is used to define the mode of the shared preferences file, you should use the same mode as in your `PreferenceActivity`. The mode must be passed as a number: if you are using a combination of constant flags in your code, check the total value.

Engagement always use the `engagement:key` boolean key within the preferences file for managing this setting.

The following example of `AndroidManifest.xml` shows the default values:

			<application>
			    [...]
			    <meta-data
			      android:name="engagement:agent:settings:name"
			      android:value="engagement.agent" />
			    <meta-data
			      android:name="engagement:agent:settings:mode"
			      android:value="0" />

Then you can add a `CheckBoxPreference` in your preference layout like the following one:

			<CheckBoxPreference
			  android:key="engagement:enabled"
			  android:defaultValue="true"
			  android:title="Use Engagement"
			  android:summaryOn="Engagement is enabled."
			  android:summaryOff="Engagement is disabled." />
