<properties 
   pageTitle="Azure Mobile Engagement User Interface - Reach" 
   description="User Interface Overview for the Reach section of Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="mobile" 
   authors="v-micada" 
   manager="mattgre" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="Java"
   ms.topic="article"
   ms.tgt_pltfrm="mobile"
   ms.workload="required" 
   ms.date="02/17/2015"
   ms.author="v-micada"/>

# Azure Mobile Engagement - User Interface

<div class="dev-center-tutorial-selector sublanding">
<a href="../mobile-engagement-user-interface" title="Introduction">Introduction</a>
<a href="../mobile-engagement-user-interface-navigation" title="Navigation">Navigation</a>
<a href="mobile-engagement-user-interface-home.md" title="Home">Home</a>
<a href="../mobile-engagement-user-interface-my-account" title="My Account">My Account</a>
<a href="../mobile-engagement-user-interface-analytics" title="Analytics">Analytics</a>
<a href="../mobile-engagement-user-interface-monitor" title="Monitor">Monitor</a>
<a href="../mobile-engagement-user-interface-reach" class="current" title="Reach">Reach</a>
<a href="../mobile-engagement-user-interface-segments" title="Segments">Segments</a>
<a href="../mobile-engagement-user-interface-dashboard" title="Dashboard">Dashboard</a>
<a href="../mobile-engagement-user-interface-settings" title="Settings">Settings</a>
</div>

# <a name="Reach">Reach</a>
 
The Reach section of the UI is the Push campaign management tool where you can create/edit/activate/finish/monitor and get statistics on Push notification campaigns and features that can also be accessed via the Reach API (and some elements of the low level Push API). Remember that whether you are using the APIs or the UI, you will need to integrate both Azure Mobile Engagement and Reach into your application for each platform with the SDK before you can use Reach campaigns.

**See also:** 

-  [API Documentation - Reach API][Link 4], [API Documentation - Push API][Link 4], [Troubleshooting Guide - Push/Reach][Link 2]
-  <a href="#ReachCampaign" title="Reach Campaign">Reach Campaign</a>, <a href="#ReachCriterion" title="Reach Criterion">Reach Criterion</a>, <a href="#ReachContent" title="Reach Content">Reach Content</a>
 
## Four types of Push notifications:
1.    Announcements - allow you to send advertising messages to users that redirect them to another location inside your app or to send them to a webpage or store outside of your app. 
2.    Polls - allow you to gather information from end users by asking them questions.
3.    Data Pushes - allow you to send a binary or base64 data file. The information contained in a data push is sent to your application to modify your users' current experience in your app. Your application needs to be able to process the data in a data push.
4.    Tiles (Windows Phone only) - allow you to use the Microsoft Push Notification Service (MPNS) to send Native Windows Push containing XML Data. (Supported since SDK version 0.9.0. The final payload for tiles cannot exceed 32 kilobytes.)

**See also:** 

-  [Concepts - Glossary][Link 6]

## Three categories of Real time statistics shown for each campaign: 
1.    Pushed - how many pushes were sent based on the criteria specified in the campaign. 
2.    Replied - how many users reacted to the notification by either opening it from outside of app or closing it in the app. 
3.    Actioned - how many users clicked on the link in the notification to be redirected to a new location in the app, to a store, or to a web browser. 

> Note: More verbose campaign statistics are available from the via Reach API Stats

**See also:** 

-  [Concepts - Glossary][Link 6], [API Documentation - Reach API - Stats][Link 4]


## Campaign Details:
You can edit, clone, delete, or activate campaigns that have not been activated yet by hovering over their names or you can click to open them. You can clone campaigns that have already been activated by hovering over their names or you can click to open them. However, you can't change a campaign once it has been activated.
 
![Reach1][18]

## Reach Feedback:
You can switch from the details to the statistics view of an open campaign that has already been activated and switch from the simple to advanced view of the statistics to view more detailed information (depending on your permissions). You can also use the reach feedback information from a previous campaign as targeting criteria in a new campaign. Reach Feedback statistics can also be gathered with “Stats” from the Reach API. You can also customize the audience of your Push campaigns based on previous campaigns.


**See also:** 

-  <a href="#ReachCampaign">UI Documentation - Reach - New Push Campaign</a>, [API Documentation - Reach API - Stats][Link 4]
![Reach2][19]

## <a name="ReachCampaign">Reach - New Push Campaign:</a>
 
You can use the Reach section of the UI to create a new Push campaign with a complex formula by providing all the information you need to send a push notification. The options of a Push campaign vary slightly depending on the four campaign types: Announcements, Polls, Data Pushes, and Tiles (Windows Phone only).

**Option Applies to:**

- Languages:    All (Announcements, Polls, Data Pushes, Tiles)
- Campaign:    All (Announcements, Polls, Data Pushes, Tiles)
- Notification:     Announcements, Polls
- Content:    Unique for each campaign type
- Audience:     All (Announcements, Polls, Data Pushes, Tiles)
- Time frame:     Announcements, Polls, Tiles
- Test:    All (Announcements, Polls, Data Pushes, Tiles)
 
![Reach-Campaign1][20]

## Languages:
You can use the Languages drop-down menu to send a different version of your Push to devices that are set to use different languages. By default, all devices will receive the same Push regardless of what language they are set to use. Users with their device set to a different language will receive the Default Language version of the Push. Many of the push campaign options allow you to specify alternate content for each of the additional languages you select. 
 
![Reach-Campaign2][21]

**Language differences apply to:**

- Languages:    Unique languages may be selected in addition to the default language
- Campaign:    Same for all languages
- Notification:    Unique for each language in addition to the default language
- Content:    Unique for each language in addition to the default language
- Audience:     May be filtered by a separate language criterion
- Time frame:     Same for all languages
- Test:    May be sent to each language at a time
 
**Supported Languages:**

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
 
## Campaign:
You can use the Campaign section to set the name and category of your campaign as well as if you plan to ignore the audience section of a Push campaign and send this campaign via the Reach API (and some elements with the low level Push API) instead. Categories can be used with a custom notification template to control in-app notifications based on predefined settings. You can get a list of your existing “Categories” via the Reach API.

> Warning: If you use the "Ignore Audience, push will be sent to users via the API" option in the "Campaign" section of a Reach campaign, the campaign will NOT automatically send, you will need to send it manually via the Reach API.
 
![Reach-Campaign3][22]
 
**Option Applies to:**

- Name:    All
- Category:    Announcements, Polls
- Ignore Audience, push will be sent to users via the API:    All
 
## Notification:
You can use the Notification section to set basic settings for your push including: The title of the Push, the message, an in-app image, or if it is dismissible. Many notification settings are specific to the platform of your device. You can select whether your push will be sent "in app" or "out of app" or both. (Remember that users can "opt-in" or "opt-out" of "out of app" Pushes at the Operating System level on their devices, and Azure Mobile Engagement will not be able to override this setting. Also remember that the Reach API handles "in app" and "out of app" Pushes. The Push API can be used to handle "out of app" pushes too.) Pushes can be customized with pictures or HTML content, including deep links for linking outside of your App or to another location in your App (Android SDK 2.1.0 or later intent categories required). You can change the icon or iOS badge, and send either text or web content (a popup with html content, URL link to another location either inside or outside of the app). You can also make Android devices ring or vibrate with the Push. (Remember that you will need the correct SDK permissions in your Android manifest file to ring or vibrate a device.) There is currently no industry standard for Android "Big Picture" sizes, since screen sizes are different on every device, but 400x100 pictures work on almost any screen size.

## Delivery Types:
-    Out of app only: the notification will be delivered when the user does not use the application.
- The out of app only notification requires a certificate from Apple or Google (APNS or GCM certificate).
- In-app only: The notification appears only when the application is running.
- The notification uses the Capptain delivery system to reach the user. You can fully customize the visual layout/display of your push.
- Anytime: This option ensures that you send a notification either the application is running or not.

 
![Reach-Campaign4][23]

**Option Applies to:**

- Notification:     Announcements, Polls
 
## Content:
You can use the Content section to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The Content setting of Push campaigns is specific to the type of campaign. 

**See also:**

- <a href="#ReachContent">UI Documentation - Reach - Push Content</a>
 
![Reach-Campaign5][24]

## Audience:
You can use the Audience section to define a standard list of items to limit your campaign or limits your campaign based on customized criteria. The standard set of options to Limit your Audience allows you to push to either new or old users or native push users only. You can also set a quota to limit the number of users who receive the push. You can manually Edit the expression for how your campaign is filtered to include one or more criterion to target users. You can manually type an audience expression. Such an expression must explicitly define the relation between criteria. A criterion is described by an identifier that must start with a capital letter and cannot contain spaces. The relation between the criteria can be described using 'and', 'or', 'not' operators as well as '(', ')'. Example: "Criterion1 or (Criterion1 and not Criterion2)".

> Note: With a large audience included in campaigns, the server side targeting scan can be slow, especially if you attempt to start multiple campaigns at the same time.

- If possible, only start one campaign at a time.
- At the most, only start four campaigns at a time.
- Push only to your active users (checkbox "Engage only users who can be reached using Native Push" and "Engage only active users") so that only your users who still have the app installed and use it will need to be scanned.
Once your audience is defined, you can use the simulate button to find out how many users will receive this Push. This will compute the number of known users potentially targeted by this audience (this is an estimate based on a random sample of users). Be aware that users who have uninstalled the application are also part of this audience, but cannot be reached.

**See also:**

- <a href="#ReachCriterion">UI Documentation - Reach - New Push Criterion</a>

![Reach-Campaign6][25]

## Edit expression
 
![Reach-Campaign7][26]
 
**Limit your audience option applies to:**

- Engage only a subset of users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only old users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only new users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only idle users:    Announcements, Polls, Tiles
- Engage only active users:    All (Announcements, Polls, Data Pushes, Tiles)
- Engage only users who can be reached using Native Push:     Announcements, Polls
 
## Time Frame:
You can use the Time Frame section to set when the push will be sent or you can leave the time frame blank to start the campaign immediately. Remember that using the end-users' time zone may start the campaign a day earlier than you expect for your end-users in Asia and send small batches of pushes at a time until all time zones in the world match the time frame set for your campaign. Using the end users' time zone can also cause delays in campaigns since it has to request the time from the phone before starting the push.

> Note: Campaigns without an end date can cache pushes locally and still display them after you manually complete campaigns. To avoid this behavior, specific an end time for campaigns.

**See also:**

- [How Tos – Scheduling][Link 3] 
 
![Reach-Campaign8][27]

**Settings Apply to:**

- Time frame:     Announcements, Polls, Tiles
 
## Test:
You can use the Test section to send this push to your own test device before saving the campaign. If you have configured any custom languages for this campaign, you can test the push in each language. You can setup a test device from “My Account”.
> Note: No server side data is logged when you use the button to "test" pushes, data is only logged for real push campaigns.

**See also:**

- [UI Documentation - My Account][Link 14]
 
![Reach-Campaign9][28]

## <a name="ReachCriterion">Reach - New Push Criterion (for targeting Audience)</a>

Targeting your audience by specific criteria with the "New Criteria" button is one of the most powerful concepts in Azure Mobile Engagement that helps you send relevant push notifications that the customers will respond to instead of Spamming everyone. You can limit your audience based on standard criteria and simulate pushes to determine how many people will receive the notification.

**See also:**

- <a href="#ReachCampaign">UI Documentation - Reach - New Push Campaign</a>

## The audience criteria can include:

- **Technicals: ** You can target based on the same technical information you can see in the Analytics and Monitor sections. **See also:** [UI Documentation - Analytics][Link 15],  [UI Documentation - Monitor][Link 16]
- **Location:** Applications that use "Real time location reporting" with Geo-Fencing can use Geo-Location as a criteria to target an audience from the GPS location. "Lazy Area Location Reporting" call also be used to target an audience from the cell phone location ("Real time location reporting" and "Lazy Area Location Reporting" must be activated from the SDK). **See also:** [SDK Documentation - iOS -  Integration][Link 5], [SDK Documentation - Android -  Integration][Link 5]
- **Reach Feedback:** You can target your audience based on their feedback from previous reach notifications through reach feedback from Announcements, Polls, and Data Pushes. This enables you to better target your audience after two or three reach campaigns than you could the first time. It can also be used to filter out users who already received a notification with similar content, by setting a campaign to NOT be sent to users who already received a specific previous campaign. You can even exclude users who are included a specific campaign that is still active from receiving new Pushes. **See also:** <a href="#ReachContent">UI Documentation -  Reach - Push Content</a>
- **Install Tracking:** You can track information based on where your users installed your App. **See also:** [UI Documentation -  Settings][Link 20]
- **User Profile:** You can target based on standard user information and you can target based on the custom app info that you have created. This includes users who are currently logged in and users that have answered specific questions you have asked them to set in the app itself instead of just how they have responded to previous campaigns. All of your App Info's defined for your app show up on this list.
- Segments: You can also target based on segments that you have created based on specific user behavior containing multiple criteria. All of your segments defined for your app show up on this list. **See also:** [UI Documentation -  Segments][Link 18]
- **App Info:** Custom App Info Tags can be created from “Settings” to track user behavior. **See also:** [UI Documentation -  Settings][Link 20]
## Example: 
If you want to push an announcements only to the sub-set of your users that have performed an in-app purchase action.

1. Go to your application settings page, select the "App info" menu and select "New app ino"
2. Register a new Boolean app info called "inAppPurchase"
3. Make your application set this app info to "true" when the user successfully perform an in-app purchase (by using the sendAppInfo("inAppPurchase", ...) function)
4. If you don't want to do this from your application, you can do it from your backend by using the device API)
5. Then, you just need to create your announcement, with a criterion limiting your audience to users having "inAppPurchase" set to "true")
 
> Note: Targeting based on criteria other than app info tags requires Azure Mobile Engagement to gather information from your users' devices before the push is sent and so can cause a delay. Complex push configuration options (like updating badges) can also delay pushes. Using a "one shot" campaign from the Push API is the absolute fastest push method in Azure Mobile Engagement. Using only app info tags as push criteria for a Reach campaign (either from the Reach API or the UI) is the next fastest method since app info tags are stored on the server side. Using other targeting criteria for a push campaign is the most flexible but slowest push method since Azure Mobile Engagement has to query the devices in order to send the campaign.
 
![Reach-Criterion1][29] 

**Criterion Options Apply to:**

- **Technicals**     
- Firmware name:    Firmware name
- Firmware version:    Firmware version
- Device model:    Device model
- Device manufacturer:    Device manufacturer
- Application version:    Application version
- Carrier name:    Carrier name, undefined
- Carrier country:    Carrier country, undefined
- Network type:    Network type
- Locale:    Locale
- Screen size:    Screen size
- **Location**      
- Last known area:    Country, Region, Locality
- Real time geo-fencing:    List of POIs (Name, Actions), Circular POI (Name, Latitude, Longitude, Radius in meters)
- **Reach feedback**     
- Announcement feedback:    Announcement, feedback
- Poll feedback:    Poll, feedback
- Poll answer feedback:    Poll answer feedback, question, choice
- Data Push feedback:    Data Push, feedback
- **Install Tracking**     
- Store:    Store, Undefined
- Source:    Source, Undefined
- **User profile**     
- Gender:    male or female, undefined
- Birth date:    operator, date, undefined
- Opt-in:    true or false, undefined
- **App Info**      
- String:    String, undefined
- Date:    operator, date, undefined
- Integer:    operator, number, undefined
- Boolean:    true or false, undefined
- **Segment**    
- Name of Segments (from dropdown list), Exclusion (target users that are not a part of this segment).

## <a name="ReachContent">Reach - Push Content (for each campaign type)</a>
 
You can use the Content section of a new reach campaign to modify the content of your Announcements, Polls, Data Pushes, and Tiles (Windows Phone only). The content setting of Push campaigns is specific to the type of campaign. 
 
## Content types
- Announcements
- Polls
- Data pushes
- Tiles (Windows Phone Only)
 
## Content of Announcements
 
 ![Reach-Content1][30] 

## Choose the type of your announcement:
-    Notification only: It is a simple standard notification. Meaning that if a user clicks on it, no additional view will appear, but only the action associated to it will occur.
-    Text announcement: It is a notification that engages the user to have a look at a text view.
-    Web announcement: It is a notification that engages the user to have a look at a web view.

**See also:**

- [How Tos - Announcements][Link 3] 

**About Web View Announcements:**

Occurrences of the pattern "{deviceid}" in the HTML code or JavaScript code you provide here will be automatically replaced by the identifier of the device displaying the announcement. This is an easy way to retrieve Azure Mobile Engagement device identifiers in an external web service hosted on your back office.
If you want to create a full screen web view (without the default Action and Exit buttons we provide) you can use the following functions from your web view announcement's JavaScript code: 

-    perform the announcement action: ReachContent.actionContent()
-    exit from the announcement: ReachContent.exitContent()
 
## Choose your Action:

**About Action URLs:**

Any URL that can be interpreted by a targeted device's operating system can be used as an action URL.
Any dedicated URL that your application might support (e.g. to make users jump to a particular screen) can also be used as an action URL.
Each occurrence of the {deviceid} pattern is automatically replaced by the identifier of the device performing the action. This can be used to easily retrieve Azure Mobile Engagement device identifiers via an external web service hosted on your back office.

- **Android + iOS actions**
    - Open a web page
    - http://[web-site-domain] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:[e-mail-recipient]?subject=[subject]&body=[message] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS
    - sms:[phone-number] 
    - Example:sms:2125551212
    - Dial a phone number
    - tel:[phone-number] 
    - Example:tel:2125551212
- **Android only actions**
    - Download an application on the Play Store
    - market://details?id=[app package] 
    - Example:market://details?id=com.microsoft.office.word
    - Start a geo-localized search
    - geo:0,0?q=[search query] 
    - Example:geo:0,0?q=starbucks,paris
- **iOS only actions**
    - Download an application on the App Store
    - http://itunes.apple.com/[country]/app/[app name]/id[app id]?mt=8 
    - Example:http://itunes.apple.com/fr/app/briquet-virtuel/id430154748?mt=8
    - Windows Actions
    - Open a web page
    - http://[web-site-domain] 
    - Example:http://www.azure.com
    - Send an e-mail
    - mailto:[e-mail-recipient]?subject=[subject]&body=[message] 
    - Example:mailto:foo@example.com?subject=Greetings%20from%20Azure%20Mobile%20Engagement!&body=Good%20stuff!
    - Send a SMS (Skype Store App required)
    - sms:[phone-number] 
    - Example:sms:2125551212
    - Dial a phone number (Skype Store App required)
    - tel:[phone-number] 
    - Example:tel:2125551212
    - Download an application on the Play Store
    - ms-windows-store:PDP?PFN=[app package ID] 
    - Example:ms-windows-store:PDP?PFN=4d91298a-07cb-40fb-aecc-4cb5615d53c1
    - Start a bingmaps search
    - bingmaps:?q=[search query] 
    - Example:bingmaps:?q=starbucks,paris
    - Use a custom scheme
    - [custom scheme]://[custom scheme params] 
    - Example:myCustomProtocol://myCustomParams
    - Use a package data (Store App for extension read required)
    - [folder][data].[extension] 
    - Example:myfolderdata.txt
 
## Build a Tracking URL:
-    See the “Settings” section of the <UI Documentation> for instruction on building a tracking URL that will allow users to download one of your other applications.
 
## Define the texts of your announcement
Fill in the title, content, and button texts of your announcement. 
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on the feedback of whether this campaign was just pushed, replied, actioned, or exited.

**See also:**
- <a href="#ReachCriterion">UI Documentation - Reach - New Push Criterion</a>

## Content of Polls
 
![Reach-Content2][31] 
Fill in the title, description, and button texts of your announcement. 
Then, add questions and choices for the answers to your questions.
You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited. Audience targeting can also be based on Poll answer feedback, where the question and answer choice are used as criteria.

**See also:**

- <a href="#ReachCriterion">UI Documentation - Reach - New Push Criterion</a>
 
## Content of Data Pushes
 
![Reach-Content3][32] 

## Choose the type of your data
- Text
- Binary data
- Base64 data

## Define the content of your data
- If you selected to push text data, copy and paste the text into the "content" box.
- If you selected to push either binary or base64 data, use the "upload your file" button to upload your file.
- You can target an audience of a future campaign based on the reach feedback of how users responded to this campaign. Audience targeting can be based on whether this campaign was just pushed, replied, actioned, or exited.

**See also:**

- <a href="#ReachCriterion">UI Documentation - Reach - New Push Criterion</a>

## Content of Tiles (Windows Phone only)

![Reach-Content4][33]

## Define the content of your tile
The tile payload is the text to be displayed in the tile of your app on Windows Phone devices.
A tile push is the Microsoft Push Notification Service (MPNS) version of a native push for Windows Phone. The tile push type is the only push type that does not have a response and so the audience of future campaigns can't be built on the results of a tile push campaign. 

**See also:**

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
[20]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign1.png
[21]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign2.png
[22]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign3.png
[23]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign4.png
[24]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign5.png
[25]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign6.png
[26]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign7.png
[27]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign8.png
[28]: ./media/mobile-engagement-user-interface-reach/Reach-Campaign9.png
[29]: ./media/mobile-engagement-user-interface-reach/Reach-Criterion1.png
[30]: ./media/mobile-engagement-user-interface-reach/Reach-Content1.png
[31]: ./media/mobile-engagement-user-interface-reach/Reach-Content2.png
[32]: ./media/mobile-engagement-user-interface-reach/Reach-Content3.png
[33]: ./media/mobile-engagement-user-interface-reach/Reach-Content4.png
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
[Link 13]: ../mobile-engagement-user-interface-home/
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
