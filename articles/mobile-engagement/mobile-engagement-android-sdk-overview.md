<properties
	pageTitle="Azure Mobile Engagement Android SDK Integration"
	description="Latest updates and procedures for Android SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="dwrede"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="05/10/2016"
	ms.author="piyushjo" />


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

##4.2.1 (05/10/2016)

- Security: disable web view local file access.
- Security: remove `EngagementPreferenceActivity` class that extends obsolete and unsecure `PreferenceActivity` class. 
- Security: reach activities are now documented to use `exported="false"`, this flag can also be used in previous SDK versions.

##4.2.0 (03/11/2016)

- The SDK is now licensed under MIT.
- Allow specifying a custom device identifier at SDK initialization time.

##4.1.0 (08/25/2015)

- Handle new permission model for Android M.
- Can now configure location features at runtime instead of using  `AndroidManifest.xml`.
- Fix a permission bug: if you use `ACCESS_FINE_LOCATION`, then `ACCESS_COARSE_LOCATION` is not needed anymore.
- Stability improvements.

For all versions, please see the [complete release notes](mobile-engagement-android-release-notes.md).

##Upgrade procedures

If you already have integrated an older version of our SDK into your application please consult [Upgrade Procedures](mobile-engagement-android-upgrade-procedure.md).
