<properties 
	pageTitle="Azure Mobile Engagement Android SDK Integration" 
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#How to Integrate Engagement on Android

> [AZURE.SELECTOR] 
- [Windows Universal](mobile-engagement-windows-store-integrate-engagement.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md) 
- [iOS](mobile-engagement-ios-integrate-engagement.md) 
- [Android](mobile-engagement-android-integrate-engagement.md) 

This procedure describes the simplest way to activate Engagement's Analytics and Monitoring functions in your Android application.

> [AZURE.IMPORTANT] Your minimum Android SDK API level must be 10 or higher (Android 2.3.3 or higher).
 
The following steps are enough to activates the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API (see [How to use the advanced Mobile Engagement tagging API in your Android](mobile-engagement-android-use-engagement-api.md) since these statistics are application dependent.

##Embed the Engagement SDK and service into your Android project

Get `mobile-engagement-VERSION.jar` and put them into the `libs` folder of your Android project (create the libs folder if it does not exist yet).

> [AZURE.IMPORTANT]
> If you build your application package with ProGuard, you need to keep some classes. You can use the following configuration snippet:
>
> 
			-keep public class * extends android.os.IInterface
			-keep class com.microsoft.azure.engagement.reach.activity.EngagementWebAnnouncementActivity$EngagementReachContentJS {
			<methods>;
		 	}

Specify your Engagement connection string by calling the following method in the launcher activity:

			EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
			engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
			EngagementAgent.getInstance(this).init(engagementConfiguration);

The connection string for your application is displayed on Azure Portal.

-   If missing, add the following Android permissions (before the `<application>` tag):

			<uses-permission android:name="android.permission.INTERNET"/>
			<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

-   On a few device models we cannot generate the Engagement device identifier from the ANDROID\_ID (it can be buggy or unavailable). In that case, the SDK generates a random device identifier and tries to save it on the device's external storage so that other Engagement applications can share the same device identifier (it's also saved as a shared preference to ensure that the application itself always use the same device identifier, whatever happens to the external storage). For this mechanism to work properly, you need to add the following permission if missing (before the `<application>` tag):

			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

-   Add the following section (between the `<application>` and `</application>` tags):

			<service
			  android:name="com.microsoft.azure.engagement.service.EngagementService"
			  android:exported="false"
			  android:label="<Your application name>Service"
			  android:process=":Engagement"/>

-   Change `<Your application name>` by the name of your application.

> [AZURE.TIP] The `android:label` attribute allows you to choose the name of the Engagement service as it will appear to the end-users in the "Running services" screen of their phone. It is recommended to set this attribute to `"<Your application name>Service"` (e.g. `"AcmeFunGameService"`).

Specifying the `android:process` attribute ensures that the Engagement service will run in its own process (running Engagement in the same process as your application will make your main/UI thread potentially less responsive).

> [AZURE.NOTE] Any code you place in `Application.onCreate()` and other application callbacks will be run for all your application's processes, including the Engagement service. It may have unwanted side effects (like unneeded memory allocations and threads in the Engagement's process, duplicate broadcast receivers or services).

If you override `Application.onCreate()`, it's recommended to add the following code snippet at the beginning of your `Application.onCreate()` function:

			 public void onCreate()
			 {
			   if (EngagementAgentUtils.isInDedicatedEngagementProcess(this))
			     return;
			
			   ... Your code...
			 }

You can do the same thing for `Application.onTerminate()`, `Application.onLowMemory()` and `Application.onConfigurationChanged(...)`.

You can also extend `EngagementApplication` instead of extending `Application`: the callback `Application.onCreate()` does the process check and calls `Application.onApplicationProcessCreate()` only if the current process is not the one hosting the Engagement service, the same rules apply for the other callbacks.

##Basic reporting

### Recommended method: overload your `Activity` classes

In order to activate the report of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, you just have to make all your `*Activity` sub-classes inherit from the corresponding `Engagement*Activity` classes (e.g. if your legacy activity extends `ListActivity`, make it extends `EngagementListActivity`).

**Without Engagement :**

			package com.company.myapp;
			
			import android.app.Activity;
			import android.os.Bundle;
			
			public class MyApp extends Activity
			{
			  @Override
			  public void onCreate(Bundle savedInstanceState)
			  {
			    super.onCreate(savedInstanceState);
			    setContentView(R.layout.main);
			  }
			}

**With Engagement :**

			package com.company.myapp;
			
			import com.microsoft.azure.engagement.activity.EngagementActivity;
			import android.os.Bundle;
			
			public class MyApp extends EngagementActivity
			{
			  @Override
			  public void onCreate(Bundle savedInstanceState)
			  {
			    super.onCreate(savedInstanceState);
			    setContentView(R.layout.main);
			  }
			}

> [AZURE.IMPORTANT] When using `EngagementListActivity` or `EngagementExpandableListActivity`, make sure any call to `requestWindowFeature(...);` is made before the call to `super.onCreate(...);`, otherwise a crash will occur.

We provide sub-classes of `FragmentActivity` and `MapActivity`, but to avoid problems with applications using **ProGuard**, we do not include them in `engagement.jar`.

You can find these classes in the `src` folder, and can copy them into your project. The classes are also in the **JavaDoc**.

### Alternate method: call `startActivity()` and `endActivity()` manually

If you cannot or do not want to overload your `Activity` classes, you can instead start and end your activities by calling `EngagementAgent`'s methods directly.

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

This example very similiar to the `EngagementActivity` class and its variants, whose source code is provided in the `src` folder.

##Test

Now please verify your integration by reading How to Test Engagement Integration on Android.

The next sections are optional.

##Location reporting

If you want locations to be reported, you need to add a few lines of configuration (between the `<application>` and `</application>` tags).

### Lazy area location reporting

Lazy area location reporting allows to report the country, region and locality associated to devices. This type of location reporting only uses network locations (based on Cell ID or WIFI). The device area is reported at most once per session. The GPS is never used, and thus this type of location report has very few (not to say no) impact on the battery.

Reported areas are used to compute geographic statistics about users, sessions, events and errors. They can also be used as criterion in Reach campaigns. The last known area reported for a device can be retrieved thanks to the [Device
API].

To enable lazy area location reporting, add:

			<meta-data android:name="engagement:locationReport:lazyArea" android:value="true"/>

You also need to add the following permission if missing:

			<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

### Real time location reporting

Real time location reporting allows to report the latitude and longitude associated to devices. By default, this type of location reporting only uses network locations (based on Cell ID or WIFI), and the reporting is only active when the application runs in foreground (i.e. during a session).

Real time locations are *NOT* used to compute statistics. Their only purpose is to allow the use of real time
geo-fencing \<Reach-Audience-geofencing\> criterion in Reach campaigns.

To enable real time location reporting, add:

			<meta-data android:name="engagement:locationReport:realTime" android:value="true" />

You also need to add the following permission if missing:

			<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

#### GPS based reporting

By default, real time location reporting only uses network based locations. To enable the use of GPS based locations (which are far more precise), add:

			<meta-data android:name="engagement:locationReport:realTime:fine" android:value="true" />

You also need to add the following permission if missing:

			<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

#### Background reporting

By default, real time location reporting is only active when the application runs in foreground (i.e. during a session). To enable the reporting also in background, add:

			<meta-data android:name="engagement:locationReport:realTime:background" android:value="true" />

> [AZURE.NOTE] When the application runs in background, only network based locations are reported, even if you enabled the GPS.

The background location report will be stopped if the user reboots its device, you can add this to make it automatically restart at boot time:

			<receiver android:name="com.microsoft.azure.engagement.EngagementLocationBootReceiver"
			   android:exported="false">
			   <intent-filter>
			      <action android:name="android.intent.action.BOOT_COMPLETED" />
			   </intent-filter>
			</receiver>

You also need to add the following permission if missing:

			<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

##Advanced reporting

Optionally, if you want to report application specific events, errors and jobs, you need to use the Engagement API through the methods of the `EngagementAgent` class. An object of this class can be retreived by calling the `EngagementAgent.getInstance()` static method.

The Engagement API allows to use all of Engagement's advanced capabilities and is detailed in the How to Use the
Engagement API on Android (as well as in the technical documentation of the `EngagementAgent` class).

##Advanced configuration (in AndroidManifest.xml)

If you want to be sure that statistics are sent in real time when using Wifi or when the screen is off, add the following optional permission:

			<uses-permission android:name="android.permission.WAKE_LOCK"/>

If you want to disable crash reports, add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:reportCrash" android:value="false"/>

By default, the Engagement service reports logs in real time. If your application reports logs very frequently, it is better to buffer the logs and to report them all at once on a regular time base (this is called the "burst mode"). To do so, add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:burstThreshold" android:value="<interval between too bursts (in milliseconds)>"/>

The burst mode slightly increase the battery life but has an impact on the Engagement Monitor: all sessions and jobs duration will be rounded to the burst threshold (thus, sessions and jobs shorter than the burst threshold may not be visible). It is recommended to use a burst threshold no longer than 30000 (30s).

By default, the Engagement service establishes the connection with our servers as soon as the network is available. If you want to postpone the connection, add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:connection:delay" android:value="<delay (in milliseconds)>"/>

By default, a session is ended 10s after the end of its last activity (which usually occurs by pressing the Home or Back key, by setting the phone idle or by jumping into another application). This is to avoid a session split each time the user exit and return to the application very quickly (which can happen when he pick up a image, check a notification, etc.). You may want to modify this parameter. To do so, add this (between the `<application>` and `</application>` tags):

			<meta-data android:name="engagement:sessionTimeout" android:value="<session timeout (in milliseconds)>"/>

##Disable log reporting

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

<!-- URLs. -->
[Device API]: http://go.microsoft.com/?linkid=9876094
