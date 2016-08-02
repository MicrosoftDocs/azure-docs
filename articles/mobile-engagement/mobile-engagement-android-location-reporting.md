<properties
	pageTitle="Location Reporting for Azure Mobile Engagement Android SDK"
	description="Describes how to configure location reporting for Azure Mobile Engagement Android SDK"
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
	ms.date="05/12/2016"
	ms.author="piyushjo;ricksal" />

# Location Reporting for Azure Mobile Engagement Android SDK

> [AZURE.SELECTOR]
- [Android](mobile-engagement-android-integrate-engagement.md)

This topic describes how to do location reporting for your Android application.

## Prerequisites

[AZURE.INCLUDE [Prereqs](../../includes/mobile-engagement-android-prereqs.md)]

## Location reporting

If you want locations to be reported, you need to add a few lines of configuration (between the `<application>` and `</application>` tags).

### Lazy area location reporting

Lazy area location reporting allows to report the country, region and locality associated to devices. This type of location reporting only uses network locations (based on Cell ID or WIFI). The device area is reported at most once per session. The GPS is never used, and thus this type of location report has very few (not to say no) impact on the battery.

Reported areas are used to compute geographic statistics about users, sessions, events and errors. They can also be used as criterion in Reach campaigns.

To enable lazy area location reporting, you can do it by using the configuration previously mentioned in this procedure :

    EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
    engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
    engagementConfiguration.setLazyAreaLocationReport(true);
    EngagementAgent.getInstance(this).init(engagementConfiguration);

You also need to add the following permission if missing:

	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

Or you can keep using ``ACCESS_FINE_LOCATION`` if you already use it in your application.

### Real time location reporting

Real time location reporting allows to report the latitude and longitude associated to devices. By default, this type of location reporting only uses network locations (based on Cell ID or WIFI), and the reporting is only active when the application runs in foreground (i.e. during a session).

Real time locations are *NOT* used to compute statistics. Their only purpose is to allow the use of real time
geo-fencing \<Reach-Audience-geofencing\> criterion in Reach campaigns.

To enable real time location reporting, add a line of code to where you set the Engagement connection string in the launcher activity. The result will look like this:

    EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
    engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
    engagementConfiguration.setRealtimeLocationReport(true);
    EngagementAgent.getInstance(this).init(engagementConfiguration);

You also need to add the following permission if missing:

	<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

Or you can keep using ``ACCESS_FINE_LOCATION`` if you already use it in your application.

#### GPS based reporting

By default, real time location reporting only uses network based locations. To enable the use of GPS based locations (which are far more precise), use the configuration object:

    EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
    engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
    engagementConfiguration.setRealtimeLocationReport(true);
    engagementConfiguration.setFineRealtimeLocationReport(true);
    EngagementAgent.getInstance(this).init(engagementConfiguration);

You also need to add the following permission if missing:

	<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

#### Background reporting

By default, real time location reporting is only active when the application runs in foreground (i.e. during a session). To enable the reporting also in background, use this configuration object:

    EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
    engagementConfiguration.setConnectionString("Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}");
    engagementConfiguration.setRealtimeLocationReport(true);
    engagementConfiguration.setBackgroundRealtimeLocationReport(true);
    EngagementAgent.getInstance(this).init(engagementConfiguration);

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

## Android M permissions

Starting with Android M, some permissions are managed at runtime and needs user approval.

The runtime permissions will be turned off by default for new app installations if you target Android API level 23. Otherwise it will be turned on by default.

The user can enable/disable those permissions from the device settings menu. Turning off permissions from the system menu kills the background processes of the application, this is a system behavior and has no impact on ability to receive push in background.

In the context of Mobile Engagement location reporting, the permissions that require approval at runtime are:

- `ACCESS_COARSE_LOCATION`
- `ACCESS_FINE_LOCATION`

You should request permissions from the user using a standard system dialog. If the user approves, you need to tell ``EngagementAgent`` to take that change into account in real time (otherwise the change will be processed the next time the user launches the application).

Here is a code sample to use in an activity of your application to request permissions and forward the result if positive to ``EngagementAgent``:

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
      /* Other code... */

      /* Request permissions */
      requestPermissions();
    }

    @TargetApi(Build.VERSION_CODES.M)
    private void requestPermissions()
    {
      /* Avoid crashing if not on Android M */
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
      {
        /*
         * Request location permission, but this won't explain why it is needed to the user.
         * The standard Android documentation explains with more details how to display a rationale activity to explain the user why the permission is needed in your application.
         * Putting COARSE vs FINE has no impact here, they are part of the same group for runtime permission management.
         */
        if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED)
          requestPermissions(new String[] { android.Manifest.permission.ACCESS_FINE_LOCATION }, 0);

      }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
      /* Only a positive location permission update requires engagement agent refresh, hence the request code matching from above function */
      if (requestCode == 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
        getEngagementAgent().refreshPermissions();
    }
