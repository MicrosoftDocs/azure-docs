<properties
	pageTitle="Azure Mobile Engagement Android SDK Integration"
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="RickSaling"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="04/19/2016"
	ms.author="ricksal" />

# Reporting Options with Engagement on Android

> [AZURE.SELECTOR]
- [Android](mobile-engagement-android-basic-reporting.md)

This topic describes additional reporting scenarios in your Android application. These are options that you can choose to apply to the app created in the [Getting Started](mobile-engagement-android-get-started.md) tutorial.

## Prerequisites
Before starting this tutorial, you must first complete the [Getting Started](mobile-engagement-android-get-started.md) tutorial.

> [AZURE.IMPORTANT] Your minimum Android SDK API level must be 10 or higher (Android 2.3.3 or higher).

The tutorial you completed was deliberately direct and simple, but there are a number of options you can choose from.

## Building with ProGuard

If you build your application package with ProGuard, you need to keep some classes. You can use the following configuration snippet:


			-keep public class * extends android.os.IInterface
			-keep class com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity$EngagementReachContentJS {
			<methods>;
		 	}

## Tags in the AndroidManifest.xml file

In the service tag in your AndroidManifest.xml file, the `android:label` attribute allows you to choose the name of the Engagement service as it will appear to the end-users in the "Running services" screen of their phone. We recommended setting this attribute to `"<Your application name>Service"` (e.g. `"AcmeFunGameService"`).

Specifying the `android:process` attribute ensures that the Engagement service will run in its own process (running Engagement in the same process as your application will make your main/UI thread potentially less responsive).

## Using Application.onCreate()

Any code you place in `Application.onCreate()` and in other application callbacks will be run for all your application's processes, including the Engagement service. It may have unwanted side effects, like unneeded memory allocations and threads in the Engagement's process, or duplicate broadcast receivers or services.

If you override `Application.onCreate()`, we recommend adding the following code snippet at the beginning of your `Application.onCreate()` function:

			 public void onCreate()
			 {
			   if (EngagementAgentUtils.isInDedicatedEngagementProcess(this))
			     return;

			   ... Your code...
			 }

You can do the same thing for `Application.onTerminate()`, `Application.onLowMemory()` and `Application.onConfigurationChanged(...)`.

You can also extend `EngagementApplication` instead of extending `Application`: the callback `Application.onCreate()` does the process check and calls `Application.onApplicationProcessCreate()` only if the current process is not the one hosting the Engagement service, the same rules apply for the other callbacks.

## Modifying your `Activity` classes

In the [Getting Started tutorial](mobile-engagement-android-get-started.md), all you had to do was to make your `*Activity` sub-classes inherit from the corresponding `Engagement*Activity` classes (e.g. if your legacy activity extended `ListActivity`, you would make it extend `EngagementListActivity`).

> [AZURE.IMPORTANT] When using `EngagementListActivity` or `EngagementExpandableListActivity`, make sure any call to `requestWindowFeature(...);` is made before the call to `super.onCreate(...);`, otherwise a crash will occur.

You can find these classes in the `src` folder, and can copy them into your project. The classes are also in the **JavaDoc**.

## Alternate method: call `startActivity()` and `endActivity()` manually

If you cannot or do not want to overload your `Activity` classes, you can instead start and end your activities by calling the `EngagementAgent`'s methods directly.

> [AZURE.IMPORTANT] The Android SDK never calls the `endActivity()` method, even when the application is closed (on Android, applications are actually never closed). Thus, it is *HIGHLY* recommended to call the `startActivity()` method in the `onResume` callback of *ALL* your activities, and the `endActivity()` method in the `onPause()` callback of *ALL* your activities. This is the only way to be sure that sessions will not be leaked. If a session is leaked, the Engagement service will never disconnect from the Engagement backend (since the service stays connected as long as a session is pending).

Here is an example:

			public class MyActivity extends Some3rdPartyActivity
			{
			  @Override
			  protected void onResume()
			  {
			    super.onResume();
			    String activityNameOnEngagement = EngagementAgentUtils.buildEngagementActivityName(getClass()); // Uses short class name and removes "Activity" at the end.
			    EngagementAgent.getInstance(this).startActivity(this, activityNameOnEngagement, null);
			  }

			  @Override
			  protected void onPause()
			  {
			    super.onPause();
			    EngagementAgent.getInstance(this).endActivity();
			  }
			}

This example is very similiar to the `EngagementActivity` class and its variants, whose source code is provided in the `src` folder.

## Advanced configuration (in AndroidManifest.xml)

### Wake locks

If you want to be sure that statistics are sent in real time when using Wifi or when the screen is off, add the following optional permission:

			<uses-permission android:name="android.permission.WAKE_LOCK"/>

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
