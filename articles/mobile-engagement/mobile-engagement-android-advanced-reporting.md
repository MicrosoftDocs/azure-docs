<properties
	pageTitle="Advanced reporting options for Azure Mobile Engagement Android SDK"
	description="Describes how to do advanced reporting to capture analytics for Azure Mobile Engagement Android SDK"
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
	ms.date="08/10/2016"
	ms.author="piyushjo;ricksal" />

# Advanced Reporting with Engagement on Android

> [AZURE.SELECTOR]
- [Universal Windows](mobile-engagement-windows-store-integrate-engagement.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md)
- [iOS](mobile-engagement-ios-integrate-engagement.md)
- [Android](mobile-engagement-android-advanced-reporting.md)

This topic describes additional reporting scenarios in your Android application. You can apply these options to the app created in the [Getting Started](mobile-engagement-android-get-started.md) tutorial.

## Prerequisites

[AZURE.INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

The tutorial you completed was deliberately direct and simple, but there are advanced options you can choose.

## Modifying your `Activity` classes

In the [Getting Started tutorial](mobile-engagement-android-get-started.md), all you had to do was to make your `*Activity` subclasses inherit from the corresponding `Engagement*Activity` classes. For example, if your legacy activity extended `ListActivity`, you would make it extend `EngagementListActivity`.

> [AZURE.IMPORTANT] When using `EngagementListActivity` or `EngagementExpandableListActivity`, make sure any call to `requestWindowFeature(...);` is made before the call to `super.onCreate(...);`, otherwise a crash occurs.

You can find these classes in the `src` folder, and can copy them into your project. The classes are also in the **JavaDoc**.

## Alternate method: call `startActivity()` and `endActivity()` manually

If you cannot or do not want to overload your `Activity` classes, you can instead start and end your activities by calling the `EngagementAgent`'s methods directly.

> [AZURE.IMPORTANT] The Android SDK never calls the `endActivity()` method, even when the application is closed (on Android, applications are never closed). Thus, it is *HIGHLY* recommended to call the `startActivity()` method in the `onResume` callback of *ALL* your activities, and the `endActivity()` method in the `onPause()` callback of *ALL* your activities. This is the only way to be sure that sessions are not leaked. If a session is leaked, the Engagement service never disconnects from the Engagement backend (since the service stays connected as long as a session is pending).

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

This example is similar to the `EngagementActivity` class and its variants, whose source code is provided in the `src` folder.

## Using Application.onCreate()

Any code you place in `Application.onCreate()` and in other application callbacks is run for all your application's processes, including the Engagement service. It may have unwanted side effects, like unneeded memory allocations and threads in the Engagement's process, or duplicate broadcast receivers or services.

If you override `Application.onCreate()`, we recommend adding the following code snippet at the beginning of your `Application.onCreate()` function:

	 public void onCreate()
	 {
	   if (EngagementAgentUtils.isInDedicatedEngagementProcess(this))
	     return;

	   ... Your code...
	 }

You can do the same thing for `Application.onTerminate()`, `Application.onLowMemory()`, and `Application.onConfigurationChanged(...)`.

You can also extend `EngagementApplication` instead of extending `Application`: the callback `Application.onCreate()` does the process check and calls `Application.onApplicationProcessCreate()` only if the current process is not the one hosting the Engagement service, the same rules apply for the other callbacks.

## Tags in the AndroidManifest.xml file

In the service tag in the AndroidManifest.xml file, the `android:label` attribute allows you to choose the name of the Engagement service as it appears to end users in the "Running services" screen of their phone. We recommended setting this attribute to `"<Your application name>Service"` (for example, `"AcmeFunGameService"`).

Specifying the `android:process` attribute ensures that the Engagement service runs in its own process (running Engagement in the same process as your application makes your main/UI thread potentially less responsive).

## Building with ProGuard

If you build your application package with ProGuard, you need to keep some classes. You can use the following configuration snippet:

	-keep public class * extends android.os.IInterface
	-keep class com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity$EngagementReachContentJS {
	<methods>;
 	}
