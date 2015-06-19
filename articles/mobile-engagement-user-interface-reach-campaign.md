<properties 
   pageTitle="Azure Mobile Engagement User Interface - Reach Campaign" 
   description="Laern how to create and manage push notification campaigns using Azure Mobile Engagement" 
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


# How to create and manage push notification campaigns
You can use the Reach section of the UI to create a new Push campaign with a complex formula by providing all the information you need to send a push notification. The options of a Push campaign vary slightly depending on the four campaign types: Announcements, Polls, Data Pushes, and Tiles (Windows Phone only).

### Option Applies to:
- Languages:    All (Announcements, Polls, Data Pushes, Tiles)
- Campaign:    All (Announcements, Polls, Data Pushes, Tiles)
- Notification:     Announcements, Polls
- Content:    Unique for each campaign type
- Audience:     All (Announcements, Polls, Data Pushes, Tiles)
- Time frame:     Announcements, Polls, Tiles
- Test:    All (Announcements, Polls, Data Pushes, Tiles)
 
![Reach-Campaign1][20]

## Languages
You can use the Languages drop-down menu to send a different version of your Push to devices that are set to use different languages. By default, all devices will receive the same Push regardless of what language they are set to use. Users with their device set to a different language will receive the Default Language version of the Push. Many of the push campaign options allow you to specify alternate content for each of the additional languages you select. 
 
![Reach-Campaign2][21]

### Language differences apply to:
- Languages:    Unique languages may be selected in addition to the default language
- Campaign:    Same for all languages
- Notification:    Unique for each language in addition to the default language
- Content:    Unique for each language in addition to the default language
- Audience:     May be filtered by a separate language criterion
- Time frame:     Same for all languages
- Test:    May be sent to each language at a time
 
### Supported Languages:
- Arabic (ar) 
- Bulgarian (bg) 
- Catalan (ca) 
- Chinese (zh) 
- Croatian (hr) 
- Czech (cs) 
- Danish (da) 
- Dutch (nl) 
- English (en) 
- Finnish (fi) 
- French (fr) 
- German (de) 
- Greek (el) 
- Hebrew (he) 
- Hindi (hi) 
- Hungarian (hu) 
- Indonesian (id) 
- Italian (it) 
- Japanese (ja) 
- Korean (ko) 
- Latvian (lv) 
- Lithuanian (lt) 
- Malay (macrolanguage) (ms) 
- Norwegian Bokmål (nb) 
- Polish (pl) 
- Portuguese (pt) 
- Romanian (ro) 
- Russian (ru) 
- Serbian (sr) 
- Slovak (sk) 
- Slovenian (sl) 
- Spanish (es) 
- Swedish (sv) 
- Tagalog (tl) 
- Thai (th) 
- Turkish (tr) 
- Ukrainian (uk) 
- Vietnamese (vi) 
 
## Campaign
You can use the Campaign section to set the name and category of your campaign as well as if you plan to ignore the audience section of a Push campaign and send this campaign via the Reach API (and some elements with the low level Push API) instead. Categories can be used with a custom notification template to control in-app notifications based on predefined settings. You can get a list of your existing “Categories” via the Reach API.

> Warning: If you use the "Ignore Audience, push will be sent to users via the API" option in the "Campaign" section of a Reach campaign, the campaign will NOT automatically send, you will need to send it manually via the Reach API.
 
![Reach-Campaign3][22]
 
### Option Applies to:
- Name:    All
- Category:    Announcements, Polls
- Ignore Audience, push will be sent to users via the API:    All
 
## Notification
You can use the Notification section to set basic settings for your push including: The title of the Push, the message, an in-app image, or if it is dismissible. Many notification settings are specific to the platform of your device. You can select whether your push will be sent "in app" or "out of app" or both. (Remember that users can "opt-in" or "opt-out" of "out of app" Pushes at the Operating System level on their devices, and Azure Mobile Engagement will not be able to override this setting. Also remember that the Reach API handles "in app" and "out of app" Pushes. The Push API can be used to handle "out of app" pushes too.) Pushes can be customized with pictures or HTML content, including deep links for linking outside of your App or to another location in your App (Android SDK 2.1.0 or later intent categories required). You can change the icon or iOS badge, and send either text or web content (a popup with html content, URL link to another location either inside or outside of the app). You can also make Android devices ring or vibrate with the Push. (Remember that you will need the correct SDK permissions in your Android manifest file to ring or vibrate a device.) There is currently no industry standard for Android "Big Picture" sizes, since screen sizes are different on every device, but 400x100 pictures work on almost any screen size.

### Delivery Types:
-    Out of app only: the notification will be delivered when the user does not use the application.
- The out of app only notification requires a certificate from Apple or Google (APNS or GCM certificate).
- In-app only: The notification appears only when the application is running.
- The notification uses the Capptain delivery system to reach the user. You can fully customize the visual layout/display of your push.
- Anytime: This option ensures that you send a notification either the application is running or not.

 
![Reach-Campaign4][23]

### Option Applies to:
- Notification:     Announcements, Polls
 
## Content
You can use the Content section to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The Content setting of Push campaigns is specific to the type of campaign. 

### See also
- [UI Documentation - Reach - Push Content][Link 29]
 
![Reach-Campaign5][24]

## Audience
You can use the Audience section to define a standard list of items to limit your campaign or limits your campaign based on customized criteria. The standard set of options to Limit your Audience allows you to push to either new or old users or native push users only. You can also set a quota to limit the number of users who receive the push. You can manually Edit the expression for how your campaign is filtered to include one or more criterion to target users. You can manually type an audience expression. Such an expression must explicitly define the relation between criteria. A criterion is described by an identifier that must start with a capital letter and cannot contain spaces. The relation between the criteria can be described using 'and', 'or', 'not' operators as well as '(', ')'. Example: "Criterion1 or (Criterion1 and not Criterion2)".

> Note: With a large audience included in campaigns, the server side targeting scan can be slow, especially if you attempt to start multiple campaigns at the same time.

- If possible, only start one campaign at a time.
- At the most, only start four campaigns at a time.
- Push only to your active users (checkbox "Engage only users who can be reached using Native Push" and "Engage only active users") so that only your users who still have the app installed and use it will need to be scanned.
Once your audience is defined, you can use the simulate button to find out how many users will receive this Push. This will compute the number of known users potentially targeted by this audience (this is an estimate based on a random sample of users). Be aware that users who have uninstalled the application are also part of this audience, but cannot be reached.

### See also
- [UI Documentation - Reach - New Push Criterion][Link 28]

![Reach-Campaign6][25]

### Edit expression
![Reach-Campaign7][26]
 
### Limit your audience option applies to:
- Engage only a subset of users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only old users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only new users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only idle users:    Announcements, Polls, Tiles
- Engage only active users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only users who can be reached using Native Push:     Announcements, Polls
 
## Time Frame
You can use the Time Frame section to set when the push will be sent or you can leave the time frame blank to start the campaign immediately. Remember that using the end-users' time zone may start the campaign a day earlier than you expect for your end-users in Asia and send small batches of pushes at a time until all time zones in the world match the time frame set for your campaign. Using the end users' time zone can also cause delays in campaigns since it has to request the time from the phone before starting the push.

> Note: Campaigns without an end date can cache pushes locally and still display them after you manually complete campaigns. To avoid this behavior, specific an end time for campaigns.

### See also
- [Reach - How Tos – Scheduling][Link 3] 
 
![Reach-Campaign8][27]

### Settings Apply to:
- Time frame:     Announcements, Polls, Tiles
 
## Test
You can use the Test section to send this push to your own test device before saving the campaign. If you have configured any custom languages for this campaign, you can test the push in each language. You can setup a test device from “My Account”.
> Note: No server side data is logged when you use the button to "test" pushes, data is only logged for real push campaigns.

### See also
- [UI Documentation - My Account][Link 14]
 
![Reach-Campaign9][28]

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
[Link 27]: mobile-engagement-user-interface-reach-campaign.md
[Link 28]: mobile-engagement-user-interface-reach-criterion.md
[Link 29]: mobile-engagement-user-interface-reach-content.md
