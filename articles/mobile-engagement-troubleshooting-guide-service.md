<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guide - Service" 
   description="Troubleshooting Guides for Azure Mobile Engagement" 
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


# Troubleshooting guide for Service issues

The following are possible issues you may encounter with how Azure Mobile Engagement runs.

## Service Outages

### Issue
- Issues that appear to be caused by Azure Mobile Engagement Service Outages.

### Causes
- Issues that appear to be caused by Azure Mobile Engagement Service Outages can be caused by several different issues:
    - Isolated issues that originally appear systemic to all of Azure Mobile Engagement
    - Known issues caused by server outages (not always shows in server status):
	- Scheduling delays, Targeting errors, Badge update issues, Statistics stop collecting, Push stops working, API's stop working, New apps or users can't be created, DNS errors, and Timeout errors in the UI, API, or Apps on a device.
    - Cloud Dependency Outages
[Azure Service Status](http://status.azure.com/), [Amazon Web Services (AWS) Status](http://status.aws.amazon.com/) 
    - Push Notification Services (PNS) Dependency Outages
[Google - Service](http://www.google.com/appsstatus#hl=en&v=status), [Apple - Service](http://www.apple.com/support/systemstatus/), [Android - Google GCM](http://developer.android.com/google/gcm/index.html), [Android - Amazon ADM](https://developer.amazon.com/appsandservices/apis/engage/device-messaging), [Apple - APNS](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html), [Windows Phone - WNS](http://msdn.microsoft.com/library/windows/apps/hh465407.aspx), [Windows Phone - MPNS][LinkMPNS], [Windows - WNS](https://developer.windows.com/)
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
 
## Connectivity and Incorrect Information Issues

### Issue
- Problems logging into the Azure Mobile Engagement UI.
- Connection errors with the Azure Mobile Engagement API's.
- Problems uploading App Info Tags via the Device API.
- Problems downloading logs or exported data from Azure Mobile Engagement.
- Incorrect information shown in the Azure Mobile Engagement UI.
- Incorrect information shown in Azure Mobile Engagement logs.

### Causes
- For connectivity issues with Azure Mobile Engagement:
    - Confirm your user account has sufficient permissions to perform the task.
    - Confirm that the problem is not isolated to one computer or your local network.
    - Confirm that that the Azure Mobile Engagement service has no reported outages.
    - Confirm that your App Info Tag files follow all of these rules:
        - Use only the UTF8 character set (the ANSI character set is not supported).
        - Use a comma "," as the separator character (you can open a service request to request to change the .csv separator character from a comma "," to another character such as a semi-colon ";").
        - Use all lower case for Boolean values "true" and "false".
        - Use a file that is smaller than the maximum file size of 35MB.

### See also

[API Documentation][Link 4], [UI Documentation - Home][Link 1]
 
## Feature Requests

### Issue
- The feature you want to use doesn't appear to exist in Azure Mobile Engagement yet.

### Causes

To suggest a new feature for Azure Mobile Engagement that doesn't exist yet:
    - Open an Azure Mobile Engagement service request with as many details as possible about what new feature you would like to see in Azure Mobile Engagement.

### See also

[Mobile Engagement Feedback/Feature Requests](http://feedback.azure.com/forums/285737-mobile-engagement)

<!--Link references-->
[Link 1]: mobile-engagement-user-interface.md
[Link 2]: mobile-engagement-troubleshooting-guide.md
[Link 3]: mobile-engagement-how-tos.md
[Link 4]: http://go.microsoft.com/fwlink/?LinkID=525553
[Link 5]: http://go.microsoft.com/fwlink/?LinkID=525554
[Link 6]: http://go.microsoft.com/fwlink/?LinkId=525555
[Link 7]: https://account.windowsazure.com/PreviewFeatures
[Link 8]: https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azuremobileengagement
[Link 9]: http://azure.microsoft.com/en-us/services/mobile-engagement/
[Link 10]: http://azure.microsoft.com/en-us/documentation/services/mobile-engagement/
[Link 11]: http://azure.microsoft.com/en-us/pricing/details/mobile-engagement/
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
[Link 27]: mobile-engagement-user-interface-reach-campaign.md
[Link 28]: mobile-engagement-user-interface-reach-criterion.md
[Link 29]: mobile-engagement-user-interface-reach-content.md
[LinkMPNS]: http://msdn.microsoft.com/library/windows/apps/ff402558(v=vs.105).aspx
