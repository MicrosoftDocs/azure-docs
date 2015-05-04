<properties 
   pageTitle="Azure Mobile Engagement User Interface - Reach Criterion" 
   description="Learn how to use targeting criteria to send push campaigns to a select subset of your users using Azure Mobile Engagement" 
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


# How to use targeting criteria to send push campaigns to a select subset of your users

Targeting your audience by specific criteria with the "New Criteria" button is one of the most powerful concepts in Azure Mobile Engagement that helps you send relevant push notifications that the customers will respond to instead of Spamming everyone. You can limit your audience based on standard criteria and simulate pushes to determine how many people will receive the notification.

**See also:**

- [UI Documentation - Reach - New Push Campaign][Link 27]

## Audience criteria can include:
- **Technicals: ** You can target based on the same technical information you can see in the Analytics and Monitor sections. **See also:** [UI Documentation - Analytics][Link 15],  [UI Documentation - Monitor][Link 16]
- **Location:** Applications that use "Real time location reporting" with Geo-Fencing can use Geo-Location as a criteria to target an audience from the GPS location. "Lazy Area Location Reporting" call also be used to target an audience from the cell phone location ("Real time location reporting" and "Lazy Area Location Reporting" must be activated from the SDK). **See also:** [SDK Documentation - iOS -  Integration][Link 5], [SDK Documentation - Android -  Integration][Link 5]
- **Reach Feedback:** You can target your audience based on their feedback from previous reach notifications through reach feedback from Announcements, Polls, and Data Pushes. This enables you to better target your audience after two or three reach campaigns than you could the first time. It can also be used to filter out users who already received a notification with similar content, by setting a campaign to NOT be sent to users who already received a specific previous campaign. You can even exclude users who are included a specific campaign that is still active from receiving new Pushes. **See also:** [UI Documentation -  Reach - Push Content][Link 29]
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

## Criterion Options Apply to:
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
