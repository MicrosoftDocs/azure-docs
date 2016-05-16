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
   ms.date="02/29/2016"
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
- Segments can't be changed once they are created, segments can only be "cloned" (copied) or "destroyed" (deleted). Segments can only contain 10 criteria.
- The best way to test missing information from monitoring is to setup a test device, uninstall and/or reinstall the app on the test device.
- Information is refreshed every 24 hours for Analytics, Segmentation, or Dashboards.
- Information in new segments may not be displayed until 24 hours after they are created even if the segment is based on previous information.
- Filtering your analytics data in the UI will show all examples of this type regardless of the version of your app (e.g. "Crashes" filtered by name will show from version 1 and version 2 of your app).
- The time period for Analytics is based on the date from the users' device settings, so a user whose phone has the date incorrectly set could show up in the wrong time period.
- No server side data is logged when you use the button to "test" pushes, data is only logged for real push campaigns.

## Can't locate items in UI

### Issue
- Can't create segments based on certain built in or custom app info tag criteria.
- Can't find certain built in or custom app info tag criteria in Analytics, Monitoring, or Dashboards.
- Can't interpret the data in Analytics, Monitoring, Segmentation, or Dashboards.

### Causes

- Some built in items and app info tags are only available as push criteria but may not be added to a segment or visible from Analytics, Monitoring, or Dashboard. 
- For built in items and app info tags that can't be added to a segment, you will need to setup list of targeting criteria in each campaign to perform the same function as targeting based on a segment.
- See the context menus in the Analytics, Monitoring, Segmentation, and Dashboards sections of the Azure Mobile Engagement UI for more help and how to information.

## Crash troubleshooting

### Issue
- Application Crashes appearing in Analytics, Monitoring, or Dashboard.

### Causes

- To troubleshoot Application Crashes seen in Analytics, Monitoring, or Dashboard make sure to check the release notes for known issues with previous versions of the SDK.
- To further troubleshoot application crashes perform an event from a test device with your application installed and look up your device ID in the “Monitor – Events” section of the Azure Mobile Engagement UI. Then perform the event that is causing your application to crash and look up additional information in the “Monitor – Crash” section of the Azure Mobile Engagement UI. 

 