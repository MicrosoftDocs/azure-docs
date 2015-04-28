<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guide - Analytics" 
   description="Troubleshooting Analytics, Monitoring, Segmentation, and Dashboard issues in Azure Mobile Engagement" 
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

# Troubleshooting guide for Analytics, Monitoring, Segmentation, and Dashboard issues

The following are possible issues you may encounter with how Azure Mobile Engagement gathers information about your applications, devices, and users.

## Missing/Delayed information

### Issue
- Information is delayed in appearing in Analytics, Segmentation, or Dashboard.
- Information is missing from Monitoring.
- Information is missing from Analytics, Segmentation, or Dashboard.
- Hitting segmentation limits.

### Causes

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

### See also

- [Troubleshooting Guide - SDK][Link 25], [API Documentation][Link 4], [UI Documentation - Segments][Link 18]

## Can't locate items in UI

### Issue
- Can't create segments based on certain built in or custom app info tag criteria.
- Can't find certain built in or custom app info tag criteria in Analytics, Monitoring, or Dashboards.
- Can't interpret the data in Analytics, Monitoring, Segmentation, or Dashboards.

### Causes

- Some built in items and app info tags are only available as push criteria but may not be added to a segment or visible from Analytics, Monitoring, or Dashboard. 
- For built in items and app info tags that can't be added to a segment, you will need to setup list of targeting criteria in each campaign to perform the same function as targeting based on a segment.
- See the context menus in the Analytics, Monitoring, Segmentation, and Dashboards sections of the Azure Mobile Engagement UI for more help and how to information.

### See also

- [UI Documentation - Reach New Push Criterion for targeting Audience][Link 28]
 
## Crash troubleshooting

### Issue
- Application Crashes appearing in Analytics, Monitoring, or Dashboard.

### Causes

- To troubleshoot Application Crashes seen in Analytics, Monitoring, or Dashboard make sure to check the release notes for known issues with previous versions of the SDK.
- To further troubleshoot application crashes perform an event from a test device with your application installed and look up your device ID in the “Monitor – Events” section of the Azure Mobile Engagement UI. Then perform the even that is causing your application to crash and look up additional information in the “Monitor – Crash” section of the Azure Mobile Engagement UI. 

### See also

- [Concepts - FAQ][Link 6], [Concepts - Glossary][Link 6], [UI Documentation][Link 1], [SDK Documentation - Release Notes][Link 5], [SDK Documentation - Upgrade Guides][Link 5]

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
