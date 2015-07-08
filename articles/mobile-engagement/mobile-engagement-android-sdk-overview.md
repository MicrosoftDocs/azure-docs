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
	ms.date="05/04/2015" 
	ms.author="kapiteir" />


#Android SDK for Azure Mobile Engagement

Start here to get all the details on how to integrate Azure Mobile Engagement in an Android App. If you'd like to give it a try first, make sure you do our [15 minutes tutorial](mobile-engagement-android-get-started.md).

Click to see the [SDK Content](mobile-engagement-android-sdk-content.md).

##Integration procedures
1. Start here: [How to integrate Mobile Engagement in your Android app](mobile-engagement-android-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your Android app](mobile-engagement-android-integrate-engagement-reach.md)
	1. Google Cloud Messaging (GCM): [How to Integrate GCM with Mobile Engagement](mobile-engagement-android-gcm-integrate.md)
	2. Amazon Device Messaging (ADM): [How to Integrate ADM with Mobile Engagement](mobile-engagement-android-adm-integrate.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your Android app](mobile-engagement-android-use-engagement-api.md)


##Release notes

###4.0.0 (07/06/2015)

-   Internal protocol changes to make analytics and push more reliable.
-   Native push (GCM/ADM) is now also used for in app notifications so you must configure the native push credentials for any type of push campaign.
-   Fix big picture notification: they were displayed only 10s after being pushed.
-   Fix clicking a link within a web announcement that has a default action URL.
-   Fix a rare crash related to local storage management.
-   Fix dynamic configuration string management.
-   Update EULA.

For earlier versions, please see the [complete release notes](mobile-engagement-android-release-notes.md).

##Upgrade procedures

If you already have integrated an older version of our SDK into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-android-upgrade-procedure.md). For example if you migrate from 1.4.0 to 1.6.0, you have to first follow the "from 1.4.0 to 1.5.0" procedure and then the "from 1.5.0 to 1.6.0" procedure.

Whatever the version you upgrade from, you have to replace the `mobile-engagement-VERSION.jar` with the new one.

###From 3.0.0 to 4.0.0

#### Native push

Native push (GCM/ADM) is now also used for in app notifications so you must configure the native push credentials for any type of push campaign.

If not already done please follow [this procedure](mobile-engagement-android-integrate-engagement-reach.md#native-push).

#### AndroidManifest.xml

Reach integration has been modified in ``AndroidManifest.xml``.

Replace this:

    <receiver
      android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver"
      android:exported="false">
      <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
        <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
      </intent-filter>
    </receiver>

By

    <receiver
      android:name="com.microsoft.azure.engagement.reach.EngagementReachReceiver"
      android:exported="false">
      <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.AGENT_CREATED"/>
        <action android:name="com.microsoft.azure.engagement.intent.action.MESSAGE"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.ACTION_NOTIFICATION"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.EXIT_NOTIFICATION"/>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.DOWNLOAD_TIMEOUT"/>
      </intent-filter>
    </receiver>
    <receiver android:name="com.microsoft.azure.engagement.reach.EngagementReachDownloadReceiver">
      <intent-filter>
        <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
      </intent-filter>
    </receiver>

There is possibly a loading screen now when you click on an announcement (with text/web content) or a poll.
You have to add this for those campaigns to work in 4.0.0:

    <activity
      android:name="com.microsoft.azure.engagement.reach.activity.EngagementLoadingActivity"
      android:theme="@android:style/Theme.Dialog">
      <intent-filter>
        <action android:name="com.microsoft.azure.engagement.reach.intent.action.LOADING"/>
        <category android:name="android.intent.category.DEFAULT"/>
      </intent-filter>
    </activity>

#### Resources

Embed the new `res/layout/engagement_loading.xml` file into your project.
