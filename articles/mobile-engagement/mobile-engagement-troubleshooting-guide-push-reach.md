<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guide - Push/Reach" 
   description="Troubleshooting user interaction and notification issues in Azure Mobile Engagement" 
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

# Troubleshooting guide for Push and Reach issues

The following are possible issues you may encounter with how Azure Mobile Engagement sends information to your users.
 
## Push failures

### Issue
- Pushes don't work (in app, out of app, or both).

### Causes
- Many times a push failure is an indication that Azure Mobile Engagement, Reach, or another advanced feature of Azure Mobile Engagement is not correctly integrated or that an upgrade is required in the SDK to fix a known issue with a new OS or Device platform.
- Test just an In App push and just an Out of App push to determine if something is an In App or Out of App issue.
- Test from both the UI and the API as a troubleshooting step to see what additional error information is available both places.
- Out of App pushes won't work unless both Azure Mobile Engagement and Reach are integrated in the SDK.
- Pushes won't work if certificates aren't valid, or are using PROD vs. DEV correctly (iOS only). (**Note:** "Out of app" push notifications may not be delivered to iOS, if you have both the development (DEV) and production (PROD) versions of your application installed on the same device since the security token associated with your certificate may be invalidated by Apple. To resolve this issue, uninstall both the DEV and PROD versions of your application and re-install only the one version on your device.)
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

## Push testing

### Issue
- Pushes can be sent to a specific device based on a Device ID.

### Causes

- Test devices are setup differently for each platform, but causing an event in your app on a test device and looking for your Device ID in the portal should work to find your device ID for all platforms.
- Test devices work differently with IDFA vs. IDFV (iOS only).


## Push customization

### Issue
- Advanced push content item won't work (badge, ring, vibrate, picture, etc.).
- Links from pushes don't work (out of app, in app, to a website, to a location in app).
- Push statistics show that a push was not sent to as many people as expected (too many or not enough).
- Push duplicated and received twice.
- Can't register test device for Azure Mobile Engagement Pushes (with your own Prod or DEV app).

### Causes

- To link to a specific location in app requires “categories” (Android only).
- Deep linking schemes to redirect users to an alternate location after clicking a push notification need to be created in and managed by your application and the device OS not by Mobile Engagement directly. (**Note:** Out of app notifications can't link directly to in app locations with iOS as they can with Android.)
- External image servers need to be able to use HTTP "GET" and "HEAD" for big picture pushes to work (Android only).
- In your code, you can disable the Azure Mobile Engagement agent when the keyboard is opened, and have your code re-activate the Azure Mobile Engagement agent once the keyboard is closed so that the keyboard won't affect the appearance of your notification (iOS only).
- Some items don't work in test simulations, but only real campaigns (badge, ring, vibrate, picture, etc.).
- No server side data is logged when you use the button to "test" pushes. Data is only logged for real push campaigns.
- To help isolate your issue, troubleshoot with: test, simulate, and a real campaign since they each work slightly differently.
- The length of time your "in app" and "any time" campaigns are scheduled to run can effect delivery numbers since a campaign will only be delivered to users who are "in app" while the campaign runs (and users who have their device settings set to receive notifications "out of app").
- The differences between how Android and iOS handle out of app notifications makes it difficult to directly compare push statistics between the Android and iOS version of your application. Android provides more OS level notification information than iOS does. Android reports when a native notification is received, clicked, or deleted in the notification center, but iOS does not report this information unless 
the notification is clicked. 
- The main reason that "pushed" numbers are different than different than "delivered" numbers for reach campaigns is that "in app" and "out of app" notifications are counted differently. "In app" notifications are handled by Mobile Engagement, but "Out of app" notifications are handled by the notification center in the OS of your device.

## Push targeting

### Issue
- Built in targeting doesn't work as expected.
- App Info Tag targeting doesn't work as expected.
- Geo-Location targeting doesn't work as expected.
- Language options don't work as expected.

### Causes

- Make sure that you have uploaded app info tags via the Azure Mobile Engagement UI or API.
- Throttling the push speed or push quota at the application level, or limiting the audience at the campaign level can prevent a person from receiving a specific push even if they meet your other targeting criteria. 
- Setting a “Language” is different than targeting based on country or locale, which is also different than targeting based on Geo-location based on a phone location or GPS location.
- The message in the “default language” is sent to any customer who doesn't have their device set to one of the alternate languages you specify.


## Push scheduling

### Issue
- Push scheduling doesn't work as expected (sent too early or delayed).

### Causes

- Time zones can issues with scheduling, especially when using the end users' time zone.
- Advanced push features can delay pushes.
- Targeting based on phone settings (instead of App Info Tags) can delay pushes since Azure Mobile Engagement may have to request data from the phone real time before sending a push.
- Campaigns created without an end date store the push locally on the device and show it the next time the app is opened even if the campaign is manually ended.
- Starting more than one campaign at the same time can take a longer time to scan your user base (try to only start one campaign at a time with a maximum of four, also target only to your active users so that old users don't have to be scanned).
- If you use the "Ignore Audience, push will be sent to users via the API" option in the "Campaign" section of a Reach campaign, the campaign will NOT automatically send, you will need to send it manually via the Reach API.
- If you use a custom category in Reach to display in-app notifications, you need to follow the correct life-cycle of a notification, or else the notification may not be cleared when the user dismiss it.

 