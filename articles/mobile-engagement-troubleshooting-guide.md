<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guide" 
   description="Troubleshooting Guide for Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="mobile" 
   authors="v-micada" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="Java"
   ms.topic="article"
   ms.tgt_pltfrm="mobile"
   ms.workload="mobile" 
   ms.date="02/17/2015"
   ms.author="v-micada"/>

# Azure Mobile Engagement - Troubleshooting Guides

## Introduction

The following troubleshooting guides cover the most common issues with Azure Mobile Engagement, with the exception of [billing][Link 11] questions and assistance signing up for the [preview][Link 7]. If you aren't able to resolve your issue with these troubleshooting guides you can either open an Azure service request - if you have an [Azure Support Agreement](http://azure.microsoft.com/support/options/) - or you can request assistance on the [MSDN Forum][Link 8]. Please be sure to include all of the troubleshooting information from <a href="#SR" title="SR">SR Info</a> when you open a service request to help technical support to investigate your issue.

## <a name="#ANALYTICS">Analytics, Monitoring, Segmentation, and Dashboards</a>

Issues with how Azure Mobile Engagement gathers information about your applications, devices, and users.

**Symptom List:**

1. <a href="#ANALYTICS1">Missing/Delayed Information</a> 
2. <a href="#ANALYTICS2">Can't locate items in UI</a>
3. <a href="#ANALYTICS3">Crash troubleshooting</a>
 
<a name="#ANALYTICS1">**Symptom:**
1.    Missing/Delayed Information:</a>

- Information is delayed in appearing in Analytics, Segmentation, or Dashboard.
- Information is missing from Monitoring.
- Information is missing from Analytics, Segmentation, or Dashboard.
- Hitting segmentation limits.

**Causes:**

- You can use the Analytics API, Monitor API, and Segments API to see if any data you are missing from the UI is visible through the APIs.
- If the Azure Mobile Engagement SDK is not correctly integrated into your app then you won't be able to see information in the Analytics, Segmentation, Monitoring, or Dashboards.
- Segments can't be changed once they are created, segments can only be "cloned" (copied) or "destroyed" (deleted).
Segments can only contain 10 criteria.
- The best way to test Information missing from monitoring (Setup a test device, uninstall and/or reinstall the app on the test device).
- Information is refreshed every 24 hours for Analytics, Segmentation, or Dashboards.
- Information in new segments may not be displayed until 24 hours after they are created (even if the segment is based on previous information).
- Filtering your analytics data in the UI will show all examples of this type regardless of the version of your app (e.g. "Crashes" filtered by name will show from version 1 and version 2 of your app).
- The time period for Analytics is based on the date from the users' device settings, so a user whose phone has the date incorrectly set could show up in the wrong time period.
- No server side data is logged when you use the button to "test" pushes, data is only logged for real push campaigns.

**See also:** 

- [Troubleshooting Guide - SDK][Link 2], [API Documentation][Link 4], [UI Documentation - Segments][Link 1]

<a name="#ANALYTICS2">**Symptom:**
2. Can't locate items in UI:</a>

- Can't create segments based on certain built in or custom app info tag criteria.
- Can't find certain built in or custom app info tag criteria in Analytics, Monitoring, or Dashboards.
- Can't interpret the data in Analytics, Monitoring, Segmentation, or Dashboards.

**Causes:**

- Some built in items and app info tags are only available as push criteria but may not be added to a segment or visible from Analytics, Monitoring, or Dashboard. 
- For built in items and app info tags that can't be added to a segment, you will need to setup list of targeting criteria in each campaign to perform the same function as targeting based on a segment.
- See the context menus in the Analytics, Monitoring, Segmentation, and Dashboards sections of the Azure Mobile Engagement UI for more help and how to information.

**See Also:**

- [UI Documentation - Reach New Push Criterion for targeting Audience][Link 1]
 
<a name="#ANALYTICS3">**Symptom:**
3. Crash troubleshooting:</a>

- Application Crashes appearing in Analytics, Monitoring, or Dashboard.

**Causes:**

- To troubleshoot Application Crashes seen in Analytics, Monitoring, or Dashboard make sure to check the release notes for known issues with previous versions of the SDK.
- To further troubleshoot application crashes perform an event from a test device with your application installed and look up your device ID in the “Monitor – Events” section of the Azure Mobile Engagement UI. Then perform the even that is causing your application to crash and look up additional information in the “Monitor – Crash” section of the Azure Mobile Engagement UI. 

**See Also:**

- [Concepts - FAQ][Link 6], [Concepts - Glossary][Link 6], [UI Documentation][Link 1], [SDK Documentation - Release Notes][Link 5], [SDK Documentation - Upgrade Guides][Link 5], [How Tos - Device ID Registration][Link 3]

## <a name="#APIS">APIs</a>

Issues with how administrators interact with Azure Mobile Engagement via the APIs.

**Symptom List:**

1. <a href="#APIS1">Syntax issues</a>
2. <a href="#APIS2">Unable to use the API to perform the same action available in the Azure Mobile Engagement UI</a>
3. <a href="#APIS3">Error Messages</a>
4. <a href="#APIS4">Silent failures</a>
 
<a name="#APIS1">**Symptom:**
1. Syntax issues:</a>

- Syntax Errors using the API (or unexpected behavior).

**Causes:**

- Syntax issues:
    - Make sure to check the Syntax of the specific API you are using to confirm that the option is available.
    - A common issue with API usage is to confuse the Reach API and the Push API (most tasks should be performed with the Reach API instead of the Push API). 
    - Another common issue with SDK integration and API usage is to confuse the SDK Key and the API Key.
    - Scripts that connect to the APIs need to send data at least every 10 minutes or the connection will time out (especially common in Monitor API scripts listening for data). To prevent timeouts, have your script send an XMPP ping every 10 minutes to keep the session alive with the server.

**See also:**
 
- [Concepts - Glossary][Link 6], [API Documentation][Link 4], [XMPP Protocol Info]( http://xmpp.org/extensions/xep-0199.html)
 
<a name="#APIS2">**Symptom:**
2. Unable to use the API to perform the same action available in the Azure Mobile Engagement UI:</a>

- An action that works from the Azure Mobile Engagement UI doesn't work from the related Azure Mobile Engagement API.

**Causes:**

- Confirming that you can perform the same action from the Azure Mobile Engagement UI shows that you have correctly integrated this feature of Azure Mobile Engagement with the SDK.

**See also:**
 
- [UI Documentation][Link 1]
 
<a name="#APIS3">**Symptom:**
3. Error Messages:</a>

- Error codes using the API displayed at runtime or in logs.

**Causes:**

- Here is a composite list of common API status codes numbers for reference and preliminary troubleshooting:

        200        Success.
        200        Account updated: device registered, associated, updated, or removed from the current account.
        200        Returns a list of projects as a JSON object or an authentication token generated and returned in the response’s body.
        201        Account created.
        400        Invalid parameter or validation exception (check payload for details). The parameters provided to the API or service are invalid. In this case, the HTTP response will embed more details. Make sure to test for the MIME type of the response as the payload can either be plain text or a JSON object.
        401        Authentication error. No user is currently authenticated or connected (check the AppID and SDK key).
        402        Billing lock. The application is either off its quotas or is currently in a bad billing state.
        403        The application is not enabled or the specific API is disabled for this application.
        403        Unauthorized access to the project or application, invalid access key (the key must match the one provided when created).
        403        Campaign specific errors: campaign must be finished (or has already been activated), the suspend action can only be performed on an scheduled campaign, cannot finish a campaign that is not currently “in progress”, campaign must be “in progress” and the campaign’s property named, manual Push must be set to true.
        403        The email address is already associated to another account (a super user for instance). No authentication token will be generated.
        404        Application, device, campaign, or project identifier not found.
        404        Query parameter is invalid JSON or has a field with an unexpected value.
        404        The email address is not associated with an account. Please create or update the account first.
        405        Invalid HTTP method (GET, POST, etc.) or trying to edit a read only segment (i.e. add or update or delete a criterion). A segment becomes read only after it has been computed for the first time.
        409        Name already associated to a different device ID or campaign.
        413        Too many device identifiers (current limit is 1,000), POST URL encoded entity is over 2MB, or the period is too large to be displayed (the server didn’t retrieve the analytics because the user request is for a period that is too large).
        503        Analytics not available yet (the requested information is not computed yet for an application).
        504         The server was not able to handle your request in a reasonable time (if you make multiple calls to an API very quickly, try to make one call at a time and spread the calls out over time).

**See also:**

- [API Documentation - for detailed errors on each specific API][Link 4]
 
<a name="#APIS4">**Symptom:**
4. Silent failures:</a>

- API action fails with no error message displayed at runtime or in logs.

**Causes:**

- Many items will be disabled in the Azure Mobile Engagement UI if they aren't integrated correctly, but will fail silently from the API, so remember to test the same functionality from the UI to see if it works.
- Azure Mobile Engagement, and many advanced features of Azure Mobile Engagement you are attempting to use, need to be individually integrated into your app with the SDK as separate steps before you can use them.

**See also:**

- [Troubleshooting Guide - SDK][Link 2], [SDK Documentation][Link 5]
 
## <a name="#PUSH">Push/Reach</a>

Issues with how Azure Mobile Engagement sends information to your users.
 
**Symptom List:**

1. <a href="#PUSH1">Push Failures</a>
2. <a href="#PUSH2">Push Testing Issues</a>
3. <a href="#PUSH3">Push Customization Issues</a>
4. <a href="#PUSH4">Push Targeting Issues</a>
5. <a href="#PUSH5">Push Scheduling</a>
 
<a name="#PUSH1">**Symptom:**
1. Push Failures:</a>

- Pushes don't work (in app, out of app, or both).

**Causes:**

- Push Failures:
    - Many times a push failure is an indication that Azure Mobile Engagement, Reach, or another advanced feature of Azure Mobile Engagement is not correctly integrated or that an upgrade is required in the SDK to fix a known issue with a new OS or Device platform.
    - Test just an In App push and just an Out of App push to determine if something is an In App or Out of App issue.
    - Test from both the UI and the API as a troubleshooting step to see what additional error information is available both places.
    - Out of App pushes won't work unless both Azure Mobile Engagement and Reach are integrated in the SDK.
    - Out of App pushes won't work if certificates aren't valid, or are using PROD vs. DEV correctly (iOS only).
    - Out of App push counts are handled differently in different platforms (iOS shows less information than Android if native pushes are disabled on a device, the API can provide more information than the UI on push stats).
    - Out of App pushes can be blocked by customers at OS level (iOS and Android).
    - Out of App pushes will be shown as disabled in the Azure Mobile Engagement UI if they aren't integrated correctly, but may fail silently from the API.
    - In App pushes won't work unless both Azure Mobile Engagement and Reach are integrated in the SDK.
    - GCM and ADM pushes won't work unless Azure Mobile Engagement and the specific server are integrated in the SDK (Android only).
    - In App and Out of App pushes should be tested separately to determine if it is a Push or Reach issue.
    - In App pushes require that the app be open to be received.
    - In App pushes are often setup to be filtered by an opt-in or opt-out app info tag.
    - If you use a custom category in Reach to display in-app notifications, you need to follow the correct life-cycle of the notification, or else the notification may not be cleared when the user dismiss it.
    - If you start a campaign with no end date and a device receives the in app notification but does not display it yet, the user will still receive the notification the next time they log into the app, even if you manually end the campaign.
    - For issues with the Push API, confirm that you really do want to use the Push API instead of the Reach API (since the Reach API is used more often) and that you are not confusing the "payload" and "notifier" parameters.
    - Test your push campaign with both a device connected via WIFI and 3G to eliminate the network connection as a possible source of problems.

**See also:**

- [Troubleshooting Guide - SDK][Link 2], [Troubleshooting Guide - Push][Link 2], [SDK Documentation - iOS - How to Prepare your Application for Apple Push notifications][Link 5]
 
<a name="#PUSH2">**Symptom:**
2. Push Testing Issues:</a>

- Pushes can be sent to a specific device based on a Device ID.

**Causes:**

- Test devices are setup differently for each platform, but causing an event in your app on a test device and looking for your Device ID in the portal should work to find your device ID for all platforms.
- Test devices work differently with IDFA vs. IDFV (iOS only).

**See also:**

- [UI Documentation - Reach][Link 1]
 
<a name="#PUSH3">**Symptom:**
3. Push Customization Issues:</a>

- Advanced push content item won't work (badge, ring, vibrate, picture, etc.).
- Links from pushes don't work (out of app, in app, to a website, to a location in app).
- Push statistics show that a push was not sent to as many people as expected (too many or not enough).
- Push duplicated and received twice.
- Can't register test device for Azure Mobile Engagement Pushes (with your own Prod or DEV app).

**Causes:**

- To link to a specific location in app requires “categories” (Android only).
- External image servers need to be able to use HTTP "GET" and "HEAD" for big picture pushes to work (Android only).
- In your code, you can disable the Azure Mobile Engagement agent when the keyboard is opened, and have your code re-activate the Azure Mobile Engagement agent once the keyboard is closed so that the keyboard won't affect the appearance of your notification (iOS only).
- Some items don't work in test simulations, but only real campaigns (badge, ring, vibrate, picture, etc.).
- No server side data is logged when you use the button to "test" pushes. Data is only logged for real push campaigns.
- To help isolate your issue, troubleshoot with: test, simulate, and a real campaign since they each work slightly differently.

**See also:**

- [How Tos - Push][Link 3], [Troubleshooting Guide - Push][Link 2], [HTTP Protocol Info]( http://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html)
 
<a name="#PUSH4">**Symptom:**
4. Push Targeting Issues:</a>

- Built in targeting doesn't work as expected.
- App Info Tag targeting doesn't work as expected.
- Geo-Location targeting doesn't work as expected.
- Language options don't work as expected.

**Causes:**

- Push Targeting:
    - Make sure that you have uploaded app info tags via the Azure Mobile Engagement UI or API.
    - Throttling the push speed or push quota at the application level, or limiting the audience at the campaign level can prevent a person from receiving a specific push even if they meet your other targeting criteria. 
    - Setting a “Language” is different than targeting based on country or locale, which is also different than targeting based on Geo-location based on a phone location or GPS location.
    - The message in the “default language” is sent to any customer who doesn't have their device set to one of the alternate languages you specify.

**See also:**

- [UI Documentation - Reach][Link 1], [UI Documentation - Settings][Link 1], [API Documentation - Reach][Link 4], [API Documentation - Push][Link 4], [API Documentation - Device][Link 4]
 
<a name="#PUSH5">**Symptom:**
5. Push Scheduling:</a>

- Push scheduling doesn't work as expected (sent too early or delayed).

**Causes:**

- Time zones can issues with scheduling, especially when using the end users' time zone.
- Advanced push features can delay pushes.
- Targeting based on phone settings (instead of App Info Tags) can delay pushes since Azure Mobile Engagement may have to request data from the phone real time before sending a push.
- Campaigns created without an end date store the push locally on the device and show it the next time the app is opened even if the campaign is manually ended.
- Starting more than one campaign at the same time can take a longer time to scan your user base (try to only start one campaign at a time with a maximum of four, also target only to your active users so that old users don't have to be scanned).
- If you use the "Ignore Audience, push will be sent to users via the API" option in the "Campaign" section of a Reach campaign, the campaign will NOT automatically send, you will need to send it manually via the Reach API.
- If you use a custom category in Reach to display in-app notifications, you need to follow the correct life-cycle of a notification, or else the notification may not be cleared when the user dismiss it.

**See also:**

- [How Tos - Scheduling][Link 3], [UI Documentation - Reach New Push Campaign][Link 1]
 
## <a name="#SERVICE">Service</a>

Issues with how Azure Mobile Engagement runs.

**Symptom List:**

1. <a href="#SERVICE1">Service Outages</a>
2. <a href="#SERVICE2">Connectivity and Incorrect Information Issues</a>
3. <a href="#SERVICE3">Feature Requests</a>
 
<a name="#SERVICE1">**Symptom:**
1. Service Outages:</a>

**Causes:**

- Issues that appear to be caused by Azure Mobile Engagement Service Outages can be caused by several different issues:
    - Isolated issues that originally appear systemic to all of Azure Mobile Engagement
    - Known issues caused by server outages (not always shows in server status):
o    Scheduling delays, Targeting errors, Badge update issues, Statistics stop collecting, Push stops working, API's stop working, New apps or users can't be created, DNS errors, and Timeout errors in the UI, API, or Apps on a device.
1.    Cloud Dependency Outages
<Azure Service Status><Amazon Web Services (AWS) Status>
2.    Push Notification Services (PNS) Dependency Outages
<Google - Service><Apple - Service><Android - Google GCM><Android - Amazon ADM><Apple - APNS><Windows Phone - WNS><Windows Phone - MPNS><Windows - WNS>
3.    App Store Outages
<GooglePlay><iTunes><Windows Phone Store><Windows Store>

    - Cloud Dependency Outages
[Azure Service Status]( http://azure.microsoft.com/status/), [Amazon Web Services (AWS) Status]( http://status.aws.amazon.com/) 
    - Push Notification Services (PNS) Dependency Outages
[Google - Service](http://www.google.com/appsstatus#hl=en&v=status), [Apple - Service]( http://www.apple.com/support/systemstatus/), [Android - Google GCM]( http://developer.android.com/google/gcm/index.html), [Android - Amazon ADM]( https://developer.amazon.com/appsandservices/apis/engage/device-messaging), [Apple - APNS]( https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html), [Windows Phone - WNS](http://msdn.microsoft.com/library/windows/apps/hh465407.aspx), [Windows Phone - MPNS](http://msdn.microsoft.com/library/windows/apps/ff402558(v=vs.105).aspx), [Windows - WNS](https://developer.windows.com/)
    - App Store Outages
[GooglePlay](https://play.google.com/), [iTunes](http://www.apple.com/itunes/charts/), [Windows Phone Store](http://www.windowsphone.com/), [Windows Store](http://windows.microsoft.com/)

*To test to see if the problem is systemic you can test the same function from a different:*

    - Azure Mobile Engagement integrated application
    - Test device
    - Test device OS version
    - Campaign
    - Administrator user account
    - Browser (IE, Firefox, Chrome, etc.)
    - Computer
*To test if the problem only affects the UI or the API's:*

    - Test the same function from both the Azure Mobile Engagement UI and the Azure Mobile Engagement API's.

[API Documentation][Link 4], [UI Documentation][Link 1]

*To test if the problem is with your Cellular Phone Network:*

    - Test while connected to the Internet via WIFI and while connected via your 3G cellular phone network.
    - Confirm that your firewall is not blocking any of the Azure Mobile Engagement IP Addresses or Ports.

*To test if the problem is with your Device:*

    - Test if your Device is able to connect to Azure Mobile Engagement with another Azure Mobile Engagement integrated app.
    - Test that you can generate Events, Jobs, and Crashes from your phone that can be seen in the Azure Mobile Engagement UI. 
    - Test if you can send push notifications from the Azure Mobile Engagement UI to your device based on its Device ID. 
[UI Documentation - Settings][Link 1]

*To test if the problem is with your App:*

    - Install and test your application from an emulator instead of from a physical device:
        - Download and use Android SDK (includes an Android Emulator)
        - Download and use Apple Xcode (includes an iOS Simulator)
        - Download and use Windows Phone SDK (includes a Windows Phone 7, 8 and 8.1 Emulators)

To test if the problem is with OS upgrades to end user Devices, which require an SDK upgrade to resolve:

    - Test your application on different devices with different versions of the OS.
    - Confirm that you are using the most recent version of the SDK.
[Troubleshooting Guide - SDK][Link 2]
 
<a name="#SERVICE2">**Symptom:**
2. Connectivity and Incorrect Information Issues:</a>

- Problems logging into the Azure Mobile Engagement UI.
- Connection errors with the Azure Mobile Engagement API's.
- Problems uploading App Info Tags via the Device API.
- Problems downloading logs or exported data from Azure Mobile Engagement.
- Incorrect information shown in the Azure Mobile Engagement UI.
- Incorrect information shown in Azure Mobile Engagement logs.

**Causes:**

- For connectivity issues with Azure Mobile Engagement:
    - Confirm your user account has sufficient permissions to perform the task.
    - Confirm that the problem is not isolated to one computer or your local network.
    - Confirm that that the Azure Mobile Engagement service has no reported outages.
    - Confirm that your App Info Tag files follow all of these rules:
        - Use only the UTF8 character set (the ANSI character set is not supported).
        - Use a comma "," as the separator character (you can open a service request to request to change the .csv separator character from a comma "," to another character such as a semi-colon ";").
        - Use all capitals for Boolean values "TRUE" and "FALSE".
        - Use a file that is smaller than the maximum file size of 35MB.

**See also:**

[API Documentation][Link 4], [UI Documentation - Home][Link 1]
 
<a name="#SERVICE3">**Symptom:**
3. Feature Requests:</a>

- The feature you want to use doesn't appear to exist in Azure Mobile Engagement yet.

**Causes:**

To suggest a new feature for Azure Mobile Engagement that doesn't exist yet:
    - Open an Azure Mobile Engagement service request with as many details as possible about what new feature you would like to see in Azure Mobile Engagement.
 
## <a name="#SDK">SDK</a>

Issues with how Azure Mobile Engagement integrates into your application.

**Symptom List:**

1. <a href="#SDK1">Issues with the Azure Mobile Engagement SDK discovered by a failure in another area of your application</a>
2. <a href="#SDK2">Advanced Coding Issues</a>
3. <a href="#SDK3">Application Crash Issues</a>
4. <a href="#SDK4">App Store Upload Failures</a>
 
<a name="#SDK1">**Symptom:**
1. Issues with the Azure Mobile Engagement SDK discovered by a failure in another area of your application:</a>

- UI data collection failure (in Analytics, Monitoring, Segmentation, or Dashboards).
- Push Failures (Pushes don't work in app, out of app, or both).
- Advanced Feature Failures (Tracking, Geolocation, or platform specific Pushes don’t work).
- API Failures (APIs fail often silently without error messages).
- Service Failures (none of Azure Mobile Engagement works for your application).

**Causes:**

- Most issues that need to be resolved with the Azure Mobile Engagement SDK will be discovered by a failure in your application (such as a UI data collection failure, push failure, advanced feature failure, API failure, Application crashes, or apparent service outage).  
- If a particular feature of Azure Mobile Engagement has never worked in your app before, you will need to complete the integration. 
- If a particular feature of Azure Mobile Engagement was working and stopped, you may need to upgrade to the last version with the Azure Mobile Engagement SDK. Remember that there is a different version of the Azure Mobile Engagement SDK for each platform supported by Azure Mobile Engagement (Android, iOS, Web, Windows, and Windows Phone).

*SDK Integration:* 

- Azure Mobile Engagement not correctly integrated in SDK (Analytics).
- Reach not correctly integrated in SDK (In App and Out of App Pushes).
- Certificate expired or incorrect PROD vs. DEV (iOS only).
- GCM or ADM not correctly integrated in SDK (Android only - Service Specific Pushes).
- Tracking not correctly integrated in SDK (Install store tracking).
- Lazy Location or GPS Location not correctly integrated in SDK (Targeting by geo-location).
[SDK Documentation - Integration Guides][Link 5], [Troubleshooting Guide - Push][Link 2]

*SDK Upgrade:*

- Need to upgrade SDK to resolve issues with older versions of the SDK (often related to newer versions of the device OS).
- Uninstall all previous versions of your app from your device and reinstall the newest version of your app, the re-register your Device ID from the Azure Mobile Engagement UI to confirm that your device is using the newest version of your app.
[SDK Documentation - Release Notes](http://go.microsoft.com/fwlink/?LinkId= 525554), [SDK Documentation - Upgrade Guides](http://go.microsoft.com/fwlink/?LinkId= 525554), [UI Documentation - Settings][Link 1]

*SDK Other:*

- Errors in sections of code related to Azure Mobile Engagement can cause Azure Mobile Engagement not to work.
- Errors in Application Manifest "AndroidManifest.xml" can cause Azure Mobile Engagement not to work (Android only).
- A common issue with SDK integration and 
- API usage is to confuse the SDK Key and the API Key.
[Concepts - Glossary][Link 6]
 
<a name="#SDK2">**Symptom:**
2. Advanced Coding Issues:</a>

-  Platform specific code not directly related to Azure Mobile Engagement can cause issues on iOS, Android, and Windows Phone.

**Causes:**

- Many advanced coding issues with Azure Mobile Engagement are caused by improperly written platform specific code not directly related to Azure Mobile Engagement. You will need to consult documentation specific to the platform you are developing for in addition to Azure Mobile Engagement documentation (Android, iOS, Web, Windows, and Windows Phone).
- Not correctly configuring "categories", prevents linking from a notification to another location either inside or outside of the app (Android only). 
- Not setting "UIKit.framework" to "optional" in your iOS code, shows a "Symbol not found error" and/or crashes on older iOS devices (iOS only).
- Expired certificates or not correctly using the DEV or Prod version of the cert, causes push issues (iOS only).
- There are some limitations inherent to a platform that Azure Mobile Engagement can't control (like how the system center works for out of app pushes in Android and iOS).
- Azure Mobile Engagement publishes a full list of the internal packages used by Azure Mobile Engagement for iOS and Android for reference. Keep in mind that some features of Azure Mobile Engagement are specific to the platform (Android, iOS, Web, Windows, and Windows Phone).
- The SDKs for each platform are written in the following programming languages:
    -     Android SDK written in Java
    -     iOS SDK written in objective C
    -     Web SDK written in JavaScript
    -     Windows SDK written in C# and JavaScript
    -     Windows Phone SDK written in C# and JavaScript

**See also:**

 - [Troubleshooting Guide - Push][Link 2], [SDK Documentation - Release Notes][Link 5], [SDK Documentation - Upgrade Guides][Link 5], [SDK Documentation - Android - Azure Mobile Engagement technical documentation overview][Link 5], [SDK Documentation - iOS - Azure Mobile Engagement technical documentation overview][Link 5], [SDK Documentation - iOS - How to Prepare your Application for Apple Push notifications][Link 5], [Android Developer](https://developer.android.com/), [iOS Developer](https://developer.apple.com/), [Windows Developer](https://developer.windows.com/) 
 
<a name="#SDK3">**Symptom:**
3.    Application Crash Issues</a>

- Your application crashes on the end users' device.

**Causes:**

- Crash information can be viewed in the Analytics UI or the Analytics API.
- You can find the Device ID of your test device and take the same action that caused your application to crash for an end user to help identify the cause of your crash.
- Known issues with the Azure Mobile Engagement SDK that cause applications to crash are sometimes resolved by upgrading to the latest version of the SDK, so make sure to check the release notes about your platform when investigating crashes.

**See also:**

- [Concepts - FAQ][Link 6], [Concepts - Glossary][Link 6], [API Documentation - Analytics API - Crashes][Link 4], [UI Documentation - Analytics - Crashes][Link 1], [UI Documentation - Settings][Link 1], [SDK Documentation - Release Notes][Link 5], [SDK Documentation - Upgrade Guides][Link 5]

<a name="#SDK4">**Symptom:**
4. App Store Upload Failures</a>

- Errors related to uploading the latest version of your app to iTunes, GooglePlay, the Windows or Windows Phone store.

**Causes:**

- App stores sometimes block apps with certain features enabled (The iTunes store prevents the use of IDFV in apps in the store and the GooglePlay store prevents the sharing of application information between apps). 
- Make sure that you check the release notes about your platform and current version of the SDK if you have difficulty uploading an app to the store.

**See also:**

- [SDK Documentation - Release Notes][Link 5], [SDK Documentation - Upgrade Guides][Link 5] 

## <a name="#SR">SR Troubleshooting Info</a>

Please provide the following information when you open any Azure Mobile Engagement service request:
 
**IDs: Please provide any applicable identifiers related to your issue:**

    - App ID
    - Campaign ID
    - Device ID
    - User ID
    - Username
    - App Info Tag
 
**Errors: Please provide any applicable error information related to your issue:**

    - The name of the API or UI section where the issue occurs
    - The text of any error message you receive
    - The results of any tests you have performed from the troubleshooting guides
 
-    [Troubleshooting Guides](http://go.microsoft.com/fwlink/?LinkId=524382)


**Code: Please provide any applicable coding information related to your issue:**

    - The SDK version and platform of your app (Android SDK 2.4.1, iOS 1.16.2, etc.)
    - The download location of your production app (or the APK/TGZ files of your development app)
    - The "AndroidManifest.xml" and/or any code snippet from your app related to Azure Mobile Engagement (for advanced troubleshooting)

<!--Link references-->
[Link 1]: mobile-engagement-user-interface.md
[Link 2]: mobile-engagement-troubleshooting-guide.md
[Link 3]: mobile-engagement-how-tos.md
[Link 4]: http://go.microsoft.com/fwlink/?LinkID=525553
[Link 5]: http://go.microsoft.com/fwlink/?LinkID=525554
[Link 6]: http://go.microsoft.com/fwlink/?LinkId=525555
[Link 7]: https://account.windowsazure.com/PreviewFeatures
[Link 8]: https://social.msdn.microsoft.com/Forums/azure/home?forum=azuremobileengagement
[Link 9]: http://azure.microsoft.com/services/mobile-engagement/
[Link 10]: http://azure.microsoft.com/documentation/services/mobile-engagement/
[Link 11]: http://azure.microsoft.com/pricing/details/mobile-engagement/
[Link 12]: mobile-engagement-user-interface-navigation.md
[Link 13]: mobile-engagement-user-interface-home.md
[Link 14]: mobile-engagement-user-interface-my-account.md
[Link 15]: mobile-engagement-user-interface-analytics.md
[Link 16]: mobile-engagement-user-interface-monitor.md
[Link 17]: mobile-engagement-user-interface-reach.md
[Link 18]: mobile-engagement-user-interface-segments.md
[Link 19]: mobile-engagement-user-interface-dashboard.md
[Link 20]: mobile-engagement-user-interface-settings.md
[Link 21]: mobile-engagement-troubleshooting-guide-analytics.md
[Link 22]: mobile-engagement-troubleshooting-guide-apis.md
[Link 23]: mobile-engagement-troubleshooting-guide-push-reach.md
[Link 24]: mobile-engagement-troubleshooting-guide-service.md
[Link 25]: mobile-engagement-troubleshooting-guide-sdk.md
[Link 26]: mobile-engagement-troubleshooting-guide-sr-info.md
[Link 27]: mobile-engagement-how-tos-first-push.md
[Link 28]: mobile-engagement-how-tos-test-campaign.md
[Link 29]: mobile-engagement-how-tos-personalize-push.md
[Link 30]: mobile-engagement-how-tos-differentiate-push.md
[Link 31]: mobile-engagement-how-tos-schedule-campaign.md
[Link 32]: mobile-engagement-how-tos-text-view.md
[Link 33]: mobile-engagement-how-tos-web-view.md
