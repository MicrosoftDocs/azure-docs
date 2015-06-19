<properties 
   pageTitle="Azure Mobile Engagement User Interface - Settings" 
   description="Learn how to manage the global settings of your application using Azure Mobile Engagement" 
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
   ms.date="02/17/2015"
   ms.author="piyushjo"/>

# How to manage the global settings of your application
The Settings menu options available for an application vary, depending on the platform of the application and the permissions you have been granted for the application. Settings include the following: Details, Projects, Native Push, Push Speed, SDK, Tracking, App Info, Commercial Pressure, and Permissions. Only the App Info menu option of the Settings section of the UI contains elements that can be managed with the “Tag” feature of the Device API. The “Glossary” in “Concepts” includes the definitions of terms and abbreviations, such as the following: APNS, GCM, IDFA, API, SDK, API Key, SDK Key, Application ID (App ID), AppStore ID, Tag Plan, User ID, Device ID, App Delegate, Stack Trace, and Deep linking.

### See also
- [API Documentation - Device API][Link 4], [Concepts - Glossary][Link 6], [Troubleshooting Guide - Service][Link 24]

  ![settings1][46]

## Details
Allows you to change the name and Description of your application 
View the owner of your application and your role Permissions. 
Analytics configuration: Allows you to view or change the day Weeks start on, the Retention time in day(s)
 
  ![settings2][47]
 
## Projects
Allows you to select all projects you want your application to appear in. 
You can also search for a project and view the name, description, owner and your role permissions of any project your application is part of.

### See also
-    [UI Documentation – Home][Link 13]
 
  ![settings3][48]

## Native Push
Allows you to register a new certificate or delete and existing certificate for use with native push. 
Native Push enables Azure Mobile Engagement to push to your application at any time, even when it is not running. 
After providing credentials or certificates for at least one Native Push service, you can select "Any time" when creating Reach Campaigns, and also use the "notifier" parameter in the PUSH API.

### See also
- [API documentation - Reach API] [Link 4],[API documentation - Push API] [Link 4], [UI Documentation - Reach - New Push Campaign][Link 27]

### Apple Push Notification Service (APNS)
To enable Native Push using the Apple Push Notification Service you will need to register your certificate. You will need to specify the type of certificate as either development (DEV) or production (PROD). Then you will need upload your certificate and the password.

### See also
- [SDK Documentation - iOS - How to Prepare your Application for Apple Push notifications][Link 5]
 
![settings4][49]
 
### Windows Push Notification Service (WPNS)
To enable Native Push using Windows Notification Service, you must provide your application's credentials. 
You will need your Package security identifier (SID) and your Secret key.
 
![settings5][50]
 
### Google Cloud Messaging for Android (GCM)
To enable Native Push using GCM, you need to follow the instructions from Google. Then you must paste a server simple API key, configured without IP restrictions. 
Requires integration with the SDK for Android v1.12.0+.

### See also
- [SDK Documentation - Android - How to Integrate GCM][Link 5], [Google Developer - GCM Guide](http://developer.android.com/guide/google/gcm/gs.html), [Google Developer - GCM Documentation](http://developer.android.com/google/gcm/index.html)
 
### Amazon Device Messaging for Android (ADM)
To enable Native Push using ADM, you must provide Amazon <OAuth credentials> consisting of a Client ID and Client Secret (Requires integration with SDK for Android v2.1.0+).

### See also
- [SDK Documentation - Android - How to Integrate ADM][Link 5], [Amazon Developer - ADM Documentation](https://developer.amazon.com/sdk/adm/credentials.html#Getting)

![settings6][51]

## Push Speed
Shows the current push speed of your application and allows you to define the push speed of your application. The push speed defines the maximum number of pushes per second that the Reach module will perform. This can be helpful in situation where your own servers are overloaded by too many requests per second(/s) after a campaign activation.
 
  ![settings7][52]

## Tracking
The tracking feature allows you to track the origins of the installations of your iOS and Android applications. It lets you know where your users downloaded your application (i.e. from which application store) and which source brought them here (i.e. ad campaign, blog, web site, e-mail, SMS, etc.). The Tracking feature of Azure Mobile Engagement must be integrated into your application from the SDK as a separate step. 

### See also
- [SDK Documentation - Android - How to Integrate][Link 5], [SDK Documentation - iOS - How to Integrate][Link 5]
 
### Stores
Allow you to register all stores from which your application can be downloaded based on their names and their associated download URLs. Doing this allows you to create locations to host tracking URLs. Stores can be created or deleted from this page. Using the icon to create a new tracking URL takes you to the tracking URLs page covered below. There are several ways of tracking where yours users download your app:

-    Use a third party Ad Server (Azure Mobile Engagement currently supports [SmartAd](http://smartadserver.fr/) and [Surikate](http://www.surikate.com/).
-    Use a third party attribution service (Azure Mobile Engagement currently supports [Mobile App Tracking]( http://www.mobileapptracking.com/) and [Trademob](http://www.trademob.com/) may also be supported in the near future.)
-    Use a third party install referrer (Azure Mobile Engagement currently supports [Google Play Install Referrer](https://developers.google.com/app-conversion-tracking/docs/third-party-trackers/) - Android Only).
-    Use manual reporting.
 
  ![settings8][53]
 
### Ad Campaigns
Allow you to create New Ad Campaigns consisting of an Ad server name, a Campaign ID, and the Source where your application can be downloaded. 
 
  ![settings9][54]
 
### Tracking URLs
Allows you to build tracking URLs to use as target URLs in your sources (ad campaign, blog, web site, e-mail, SMS, etc.) which can redirect users to the stores where they can download your application. Also allows you to display all the tracking URLs you have already created. A tracking URL can be used as the action URL of an ad campaign or a Reach announcement to invite your users to download one of your apps from another app. A tracking URL redirects to the download URL associated with the selected store, while allowing our tracking system to record the store from which the application is downloaded at installation time. If a source is provided, our tracking system also records it, allowing you to distinguish between the various ad campaigns you create for your application.

Creating a New tracking URL requires you to specify a store and the source of either none, customer, or add server. 

-    A source of None creates a default tracking URL.
-    A source of Custom allows you to specify a URL on an external server to download your application.
-    A source of Ad server creates a default tracking URL in a default named Ad server.
 
### See also
- [UI Documentation - Reach - New Push Campaign][Link 27] 
 
### Build a tracking URL
You can also build a tracking URL allowing users to download one of your applications from inside the content section of a new reach campaign.

### See also
- [UI Documentation - Reach - Push Content][Link 29]

![settings10][55]

## App Info
Allows you to register additional information associated to your application's users. This information can be injected by your application (using the SDK) or by your backend (using the Device API). 

### See also
- [API Documentation - Device API][Link 4]

Registering application information tags allows you to segment your Reach campaigns by creating specific Reach audience criteria based on it. You can view the name and type of existing app info tags or add a new app info based on the name and type of String, Date, Integer, or Boolean.

### See also
- [UI Documentation - Reach - New Push Campaign][Link 27]
 
![settings11][56]
 
## Commercial Pressure
Push Quotas allow you to define the maximum number of times a device can be pushed to over a period. Push quotas are used only by Reach campaigns that have the "Apply push quotas" option enabled. Push quotas can be managed either by segment or by default. Quotas can be set to only send a maximum number of pushes over a sliding period of the last hour, day, week, or month.

### See also
- [UI Documentation - Reach - New Push Campaign][Link 27],  [UI Documentation - Segments][Link 18]

### Quotas:
- Quota by default: This quota is applied to users that are not matched by any segment in the 'Quota by segment' section below. By default, no quota is set.
- Quota by segment: As a quota must apply to a group of users, you need to create a segment to identify the users to apply a quota to. It could be a 'heavy users' segment defined by the number of sessions they make, or anything you deem interesting to define the user group. If a device matches several segments with a defined quota, only the quota having the highest maximum number of pushes per hour is applied.

![settings12][57]
 
## Permissions
Allows you to search and view the Email, Name, Organization, and Permission level of users of your application. The permissions concept is an addition to project role. It allows you to associate one set of permissions to a specific user who has access to your application.

### The permissions levels current available are:
-    "Reach Campaign Creator" (a user that can create Reach campaigns) 
-    "Reach Campaign Manager" (a user that can create Reach campaigns and activate, suspend, finish, destroy them)

> Note: When a user has both a project role and a set of permissions for a given application, the more permissive concept is used. Hence, we suggest that when using permissions, you set the project role of your users to "Viewer" (the least permissive role) and add more permissive permissions at the application level.

### See also
- [UI Documentation - Home][Link 13]  
 
![settings13][58]

<!--Image references-->
[1]: ./media/mobile-engagement-user-interface-navigation/navigation1.png
[2]: ./media/mobile-engagement-user-interface-home/home1.png
[3]: ./media/mobile-engagement-user-interface-home/home2.png
[4]: ./media/mobile-engagement-user-interface-home/home3.png
[5]: ./media/mobile-engagement-user-interface-home/home4.png
[6]: ./media/mobile-engagement-user-interface-home/home5.png
[7]: ./media/mobile-engagement-user-interface-my-account/myaccount1.png
[8]: ./media/mobile-engagement-user-interface-my-account/myaccount2.png
[9]: ./media/mobile-engagement-user-interface-my-account/myaccount3.png
[10]: ./media/mobile-engagement-user-interface-analytics/analytics1.png
[11]: ./media/mobile-engagement-user-interface-analytics/analytics2.png
[12]: ./media/mobile-engagement-user-interface-analytics/analytics3.png
[13]: ./media/mobile-engagement-user-interface-analytics/analytics4.png
[14]: ./media/mobile-engagement-user-interface-monitor/monitor1.png
[15]: ./media/mobile-engagement-user-interface-monitor/monitor2.png
[16]: ./media/mobile-engagement-user-interface-monitor/monitor3.png
[17]: ./media/mobile-engagement-user-interface-monitor/monitor4.png
[18]: ./media/mobile-engagement-user-interface-reach/reach1.png
[19]: ./media/mobile-engagement-user-interface-reach/reach2.png
[20]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign1.png
[21]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign2.png
[22]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign3.png
[23]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign4.png
[24]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign5.png
[25]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign6.png
[26]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign7.png
[27]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign8.png
[28]: ./media/mobile-engagement-user-interface-reach-campaign/Reach-Campaign9.png
[29]: ./media/mobile-engagement-user-interface-reach-criterion/Reach-Criterion1.png
[30]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content1.png
[31]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content2.png
[32]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content3.png
[33]: ./media/mobile-engagement-user-interface-reach-content/Reach-Content4.png
[34]: ./media/mobile-engagement-user-interface-dashboard/dashboard1.png
[35]: ./media/mobile-engagement-user-interface-segments/segments1.png
[36]: ./media/mobile-engagement-user-interface-segments/segments2.png
[37]: ./media/mobile-engagement-user-interface-segments/segments3.png
[38]: ./media/mobile-engagement-user-interface-segments/segments4.png
[39]: ./media/mobile-engagement-user-interface-segments/segments5.png
[40]: ./media/mobile-engagement-user-interface-segments/segments6.png
[41]: ./media/mobile-engagement-user-interface-segments/segments7.png
[42]: ./media/mobile-engagement-user-interface-segments/segments8.png
[43]: ./media/mobile-engagement-user-interface-segments/segments9.png
[44]: ./media/mobile-engagement-user-interface-segments/segments10.png
[45]: ./media/mobile-engagement-user-interface-segments/segments11.png
[46]: ./media/mobile-engagement-user-interface-settings/settings1.png
[47]: ./media/mobile-engagement-user-interface-settings/settings2.png
[48]: ./media/mobile-engagement-user-interface-settings/settings3.png
[49]: ./media/mobile-engagement-user-interface-settings/settings4.png
[50]: ./media/mobile-engagement-user-interface-settings/settings5.png
[51]: ./media/mobile-engagement-user-interface-settings/settings6.png
[52]: ./media/mobile-engagement-user-interface-settings/settings7.png
[53]: ./media/mobile-engagement-user-interface-settings/settings8.png
[54]: ./media/mobile-engagement-user-interface-settings/settings9.png
[55]: ./media/mobile-engagement-user-interface-settings/settings10.png
[56]: ./media/mobile-engagement-user-interface-settings/settings11.png
[57]: ./media/mobile-engagement-user-interface-settings/settings12.png
[58]: ./media/mobile-engagement-user-interface-settings/settings13.png

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
