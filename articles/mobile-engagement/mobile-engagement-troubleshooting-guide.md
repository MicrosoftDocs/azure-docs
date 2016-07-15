<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guides" 
   description="Troubleshooting Guide for Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="" 
   authors="piyushjo" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="mobile" 
   ms.date="02/26/2016"
   ms.author="piyushjo"/>

# Azure Mobile Engagement - Troubleshooting Guide

## Introduction
The following troubleshooting guide will help you understand root causes of some commonly seen issues and will enable you to troubleshoot on your own. 

## General

In general, you should always ensure the following:

1. Ensure that you have gone through all the steps required for integration as described in our [Getting Started tutorials](mobile-engagement-windows-store-dotnet-get-started.md)
2. You are using the latest version of the platform SDKs. 
3. Test on both an actual device and an emulator because some issues are specific to emulator only. 
4. You are not hitting any limits/throttles from Mobile Engagement which are documented [here](../azure-subscription-service-limits.md)
5. If you are not able to connect to the Mobile Engagement service backend or seeing data not being loaded continuously then ensure that there are no ongoing service incidents by checking [here](https://azure.microsoft.com/status/)

## 'Monitor' issues

### I am not seeing my device showing up on the Monitor tab
Monitor tab shows the devices connected to your Mobile Engagement platform in real-time. If you are debugging on an emulator and device, then you should see at least one session here. If the app has been distributed, then you will see the Active Sessions gauge reflect the devices which are connected to the platform in real-time. 

If you are not seeing your device on the Monitor tab then it is likely an SDK integration issue. Some common steps to take to troubleshoot are as follows:

1. Ensure that you are using the correct connection string in the mobile app and it is from the SDK keys section and not the API keys section. The connection string connects your mobile app to the instance of the Mobile Engagement app in which you will see your device on the Monitor tab. 
2. For Windows platform - if your page overrides the `OnNavigatedTo` method, make sure to call `base.OnNavigatedTo(e)`.
3. If you are integrating Mobile Engagement into an existing mobile app then you can also ensure that you are not missing any steps by looking at the advanced integration steps [here](mobile-engagement-windows-store-integrate-engagement.md)
4. Ensure you are sending at least one screen/activity by overriding the page with EngagementActivity depending on the platform you are working as described in the [Getting Started tutorials](mobile-engagement-windows-store-dotnet-get-started.md).

### I am seeing the Monitor tab showing a session even when I have disconnected or closed my app/ emulator. 
If you are the only one connected to the platform at this point and you are using an emulator to open the app then this is likely due to emulator quirks. In general, you need to ensure that you come back to the Home screen on the emulator for the app session to disconnect successfully. Additionally, on Windows platform, while debugging with Visual Studio, you may need to ensure that in Visual Studio, you go to the **Lifecycle Events** menu bar and click on **Suspend** to really close the session. See [Windows tutorial](mobile-engagement-windows-store-dotnet-get-started.md) for details. 

## 'Analytics' issues

### I am not seeing any data/ refreshed data on Analytics tab 
Analytics data is recalculated on a regular basis and it could take upto 24 hours for this refresh. This data isn't realtime and you will see it refreshed within this 24 hour time period.
Please do ensure however that you are sending atleast one screen or Activity to the platform backend by either overriding atleast one page with `EngagementActivity` or calling `SendActivity` explcitly. 

### I am seeing incorrectly captured date/time for a device on the Analytics tab
The time period for Analytics is based on the date from the users' device settings. So ensure that the device has the date correctly set. 

## 'Segment' issues

### I created a segment and it is showing up as greyed out or not showing any data
Segment creation isn't real-time at the moment. It is calculated at the same time as the analytics data is aggregated and so it could take upto 24 hours. You should check back later but meanwhile you should also ensure that your mobile apps are indeed sending the data on the basis of which you are forming the segments. E.g. if an event say 'foo' isn't being sent by any mobile device then there wouldn't be any segment data for a segment created with EventName = foo as the criterion. You should also check your SDK integration to ensure your mobile app is sending the data correctly. 

## 'Reach' or Push Notifications issues

### My push messages are not being delivered 

1. Try sending notifications to a test device first to ensure that all the components - mobile app, SDK and the service are connected correctly and able to deliver push notifications. 
2. Always send the simplest 'out-of-app notification' first via a campaign which is not scheduled and nor it has any audience criterion specified. This is again to prove that notification connectivity is working correctly. 
3. If you are having problems in delivering in-app notifications then also it is a good first step to try sending an out-of-app notification first. 
4. Ensure that the 'Native Push' is correctly configured for your mobile app. Depending on the platform it will either involve keys (Android, Windows) or certificates (iOS). See [User Interface - Settings](mobile-engagement-user-interface-settings.md)
5. Out of app notifications could also be blocked by the user via the mobile OS so ensure this is not the case. 
6. Ensure that you are not setting the *Ignore Audience, push will be sent to users via the API* option in the **Campaign** section of a Reach campaign because this will ensure that push notifications could only be sent via APIs. 
7. Ensure that you are testing your push campaign with both a device connected via WIFI and phone operator network to eliminate the network connection as a possible source of problems.
8. Ensure that the system date/time on your device/emulator is correct because any out of sync device will also interfere with the Push Notification Service's ability to deliver notifications. 

More platform specific troubleshooting instructions below:

1. **iOS** 

	- Ensure that the certificates are valid and unexpired for iOS Push Notifications. 
	- Ensure that you are correctly configuring a *Production* certificate in your Mobile Engagement app. 
	- Ensure that you are testing on a *real, physical device.* The iOS simulator cannot process push messages.
	- Ensure that the Bundle Identifier is correctly configured in the mobile app. See the instructions [here](https://developer.apple.com/library/prerelease/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)
	- When testing, use "Ad Hoc" distribution in your mobile provisioning profile. You will not be able to receive notification if your app is compiled using "Debug"

2. **Android**

	- Ensure that you have specified the correct Project number in your mobile app's AndroidManifest.xml file which is followed by \n character. 
	
	    	<meta-data android:name="engagement:gcm:sender" android:value="************\n" />
	    
	- Ensure that you are not missing or mis-configured any permissions in the Android Manifest file 
	- Ensure that the Project number you are adding to your client app is from the same account where you got the GCM Server Key. Any mismatch between the two will prevent your pushes from going out. 
	- If you are receiving system notifications but not in-app then review the [Specify an icon for notifications section](mobile-engagement-android-get-started.md) as likely you are not specifying the correct icon in the Android Manifest file. 
	- If you are sending a BigPicture notification, then ensure that if you have external image servers then they need to be able to support HTTP "GET" and "HEAD".

3. **Windows**
	
	- Ensure that you have associated the app with a valid Windows Store app. In Visual Studio - you will have to right click the project and select "Associate App with Store" option and select the app you created in the Windows Store. This Windows Store app should be the same one from where you got the native push credentials to configure in the Mobile Engagement portal.
	- If you are receiving out-of-app push notifications but not in-app notifications with `EngagementOverlay` integration then ensure there is a root grid element in your page. EngagementOverlay uses the first “Grid” element it finds in your xaml file to add two web views on your page. If you want to locate where web views will be set, you can define a grid named “EngagementGrid” like this however you will have to ensure there is sufficient height and width for the two subsequent web views which will show the notification and the following announcement as in-app notification:
		
			<Grid x:Name="EngagementGrid"></Grid>

### I created a push notification/announcement/ campaign and even after it sent me the notification, it is showing as 'Active'. What does it mean? 
The **campaign** that you created in Mobile Engagement is called so because it is a long running push notification meaning as new devices connect to your mobile engagement platform, they will be automatically sent the notification you configure here, as long as they satisfy the criterion you set in the campaign. This is not a one shot single notification setup. You will have to manually click on the **Finish** button to terminate the campaign so that it doesn't send further notifications. 

### I created a push campaign and I am receiving notifications successfully however whenever I open up the app, I get the same notification even when I had actioned it before? 
This is likely to happen during testing and if you are using emulators or some test framework like TestFlight. What is happening here is that at every app run instance, it is acquiring a new DeviceID and sending it to our backend which is causing the Mobile Engagement platform to treat it as a new device and sending the notification. 

## Getting Support

If you are unable to resolve the issue yourself then you can:

1. Search for your issue in the existing threads on StackOverflow forum and [MSDN forum](https://social.msdn.microsoft.com/Forums/windows/en-US/home?forum=azuremobileengagement) and if not then ask a question there. 
2. If you find a feature missing then add/vote for the request on our [UserVoice forum](https://feedback.azure.com/forums/285737-mobile-engagement/)
3. If you have Microsoft Support Open a support incident by providing the following details: 
	- Azure Subscription ID
	- Platform (e.g. iOS, Android etc)
	- App ID
	- Campaign ID (For push notification issues)
	- Device ID
	- Mobile Engagement SDK version (e.g. Android SDK v2.1.0)
	- Error details with exact error message and scenario
