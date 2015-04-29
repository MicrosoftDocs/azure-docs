<properties 
   pageTitle="Azure Mobile Engagement User Interface - Reach Content" 
   description="Learn how to manage the unique content of the different types of push notification campaigns in Azure Mobile Engagement" 
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

# How to manage the unique content of the different types of push notification campaigns
 
You can use the Content section of a new reach campaign to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The content setting of Push campaigns is specific to the type of campaign. 
 
### Content types:
- Announcements
- Polls
- Data pushes
- Tiles (Windows Phone Only)
 
## Content of Announcements
 ![Reach-Content1][30] 

### Choose the type of your announcement:
-    Notification only: It is a simple standard notification. Meaning that if a user clicks on it, no additional view will appear, but only the action associated to it will occur.
-    Text announcement: It is a notification that engages the user to have a look at a text view.
-    Web announcement: It is a notification that engages the user to have a look at a web view.

### See also
- [Reach - How Tos - Announcements][Link 3] 

### About Web View Announcements:
Occurrences of the pattern "{deviceid}" in the HTML code or JavaScript code you provide here will be automatically replaced by the identifier of the device displaying the announcement. This is an easy way to retrieve Azure Mobile Engagement device identifiers in an external web service hosted on your back office.
If you want to create a full screen web view (without the default Action and Exit buttons we provide) you can use the following functions from your web view announcement's JavaScript code: 

-    perform the announcement action: ReachContent.actionContent()
-    exit from the announcement: ReachContent.exitContent()
 
### Choose your Action:

### About Action URLs:
Any URL that can be interpreted by a targeted device's operating system can be used as an action URL.
Any dedicated URL that your application might support (e.g. to make users jump to a particular screen) can also be used as an action URL.
Each occurrence of the {deviceid} pattern is automatically replaced by the identifier of the device performing the action. This can be used to easily retrieve Azure Mobile Engagement device identifiers via an external web service hosted on your back office.

- **Android + iOS actions**
    - Open a web page
    - http://\[web-site-domain\] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:\[e-mail-recipient\]?subject=\[subject\]&body=\[message\] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS
    - sms:\[phone-number\] 
    - Example:sms:2125551212
    - Dial a phone number
    - tel:\[phone-number\] 
    - Example:tel:2125551212
- **Android only actions**
    - Download an application on the Play Store
    - market://details?id=\[app package\] 
    - Example:market://details?id=com.microsoft.office.word
    - Start a geo-localized search
    - geo:0,0?q=\[search query\] 
    - Example:geo:0,0?q=starbucks,paris
- **iOS only actions**
    - Download an application on the App Store
    - http://itunes.apple.com/[country]/app/[app name]/id[app id]?mt=8 
    - Example:http://itunes.apple.com/fr/app/briquet-virtuel/id430154748?mt=8
    - Windows Actions
    - Open a web page
    - http://\[web-site-domain\] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:\[e-mail-recipient\]?subject=\[subject\]&body=\[message\] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS (Skype Store App required)
    - sms:\[phone-number\] 
    - Example:sms:2125551212
    - Dial a phone number (Skype Store App required)
    - tel:\[phone-number\] 
    - Example:tel:2125551212
    - Download an application on the Play Store
    - ms-windows-store:PDP?PFN=\[app package ID\] 
    - Example:ms-windows-store:PDP?PFN=4d91298a-07cb-40fb-aecc-4cb5615d53c1
    - Start a bingmaps search
    - bingmaps:?q=\[search query\] 
    - Example:bingmaps:?q=starbucks,paris
    - Use a custom scheme
    - \[custom scheme\]://\[custom scheme params\] 
    - Example:myCustomProtocol://myCustomParams
    - Use a package data (Store App for extension read required)
    - \[folder\]\[data\].\[extension\] 
    - Example:myfolderdata.txt
 
### Build a Tracking URL:
-    See the “Settings” section of the <UI Documentation> for instruction on building a tracking URL that will allow users to download one of your other applications.
 
### Define the texts of your announcement
Fill in the title, content, and button texts of your announcement. 
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on the feedback of whether this campaign was just pushed, replied, actioned, or exited.

### See also
- [UI Documentation - Reach - New Push Criterion][Link 28]

## Content of Polls
![Reach-Content2][31] 
Fill in the title, description, and button texts of your announcement. 
Then, add questions and choices for the answers to your questions.
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited. Audience targeting can also be based on Poll answer feedback, where the question and answer choice are used as criteria.

### See also
- [UI Documentation - Reach - New Push Criterion][Link 28]
 
## Content of Data Pushes
![Reach-Content3][32] 

### Choose the type of your data:
- Text
- Binary data
- Base64 data

### Define the content of your data
- If you selected to push text data, copy and paste the text into the "content" box.
- If you selected to push either binary or base64 data, use the "upload your file" button to upload your file.
- You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited.

### See also
- [UI Documentation - Reach - New Push Criterion][Link 28]

## Content of Tiles (Windows Phone only)
![Reach-Content4][33]

### Define the content of your tile
The tile payload is the text to be displayed in the tile of your app on Windows Phone devices.
A tile push is the Microsoft Push Notification Service (MPNS) version of a native push for Windows Phone. The tile push type is the only push type that does not have a response and so the audience of future campaigns can't be built on the results of a tile push campaign. 

### See also
- [API Documentation - Reach API - Native Push][Link 4]

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
