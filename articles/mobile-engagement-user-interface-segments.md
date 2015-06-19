<properties 
   pageTitle="Azure Mobile Engagement User Interface - Segments" 
   description="Learn how to create and manage segments of users to identify usage patterns using Azure Mobile Engagement" 
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

# How to create and manage segments of users to identify usage patterns
The Segments section of the UI allows you to work on segmenting your users based on the different behavior and analytics that you can get from the application and can also access through the Segments API. Segments are first computed 24 hours after they are created, and they are recomputed every 24 hours based on the latest analytics information. Once a segment is calculated, it displays a "Day to day history" chart each day.

### See also
- [API Documentation - Segments API][Link 4], [Troubleshooting Guide - Analytics][Link 21]

## Create Segments
You can create a segment based on up to 10 criteria on a specific period up to 60 days in the past from the analytics section. 
For example, you can create a segment based on the people who have viewed certain pages or searched for specific content within your app within the last 10 days. This information is available in the analytics section. So, you can use it to create a segment, and then set up a push notification to target this subset of users to get them to come back to the application. 
 
> Note: Once a segment has been calculated, it cannot be edited; it can only be cloned (copied) or destroyed (deleted). A segment can be cloned within the same application (with the same AppID), and it can also be cloned into other applications (with a different AppID). 
 
 ![segments1][35] 

## Examples Segments
 ![segments2][36]

Segments allow you to segment the end-users of your application.
Segmenting your users is an important marketing strategy. Azure Mobile Engagement allows you to get historic data and create custom segments. This powerful tool enables you to learn about your customers’ experience in your application. You can easily analyze your segments and use your segments as push targets.
A common use-case is that you want to send a push a notification to encourage your end-users to rate your application in the store. Rather than sending a notification to all your end-users, you can create a segment that would specify only users that have used your application every day for the last month and have had a great user experience. When you send fewer, highly targeted push notifications, you get a better ROI.
 
 ![segments3][37]

### Segments you can create based on the major Azure Mobile Engagement elements:
- Event: create a segment that targets one specific event of the application that happened more than twice a week. 
- Session: create a segment of users that have used the application more than 5 times last week.
- Activity: create a segment of users that have used one page or content more or less than 10 time last month.
- Job: create a segment of users that have completed a job more than twice a day.
- Crash: create a segment of all the users that have had a crash more than 10 times last week. (You could push this segment with an apology or even a coupon!)
- Error: create a segment of all the users that have had an error more than 100 times last 3 days.
- App Info: create a segment that targets a custom App Info that happened during the last 25 days.
 
 ![segments4][38]

To use Segment in an optimal way, you must have done a customized integration of the SDK in your application with a tagging plan of "App Info" tags.
Then, go to the home page of the interface, select the application you want and click on the "Segments" section.

1. Select the "Segments" section.
2. Click on the "New segment" button to create a new segment.

## Real Life Example: Create a simple segment based on "Session" information
Create a segment of all the end-users that have used your app at least 50 times in the last week. From there, find only the end-users that have spent at least 30 seconds in your app per session. This will show all the end-users who have a positive experience in your app. Then, the segment created could be used to push a notification to these end-users to ask them to rate your app in the store.
 
 ![segments5][39]

1. Give your segment a name in order to find it quickly in the "Segment" list.
2. Click on the "Create" button.
 
 ![segments6][40]

Select Session.
 
 ![segments7][41]

1. Select the period of "Last week".
2. Click next.
 
 ![segments8][42]

1. Select the Operator that is relevant among the list: =; ≥, ≤.
2. Enter the Count you want.
3. Select the Occurrence you want. 
4. Click next.
This example is set so that over the last week, match users that have made at least 50 sessions.
 
 ![segments9][43]

For the Session segmentation, you can choose the length per session as a criteria.

1. Select the Operator from the list.
2. Provide the Length per session.
3. Click Next.
In this example, it says that over all the sessions that have been segmented on the occurrence section, select only the users that have spent more than 30 seconds per session.
 
 ![segments10][44]

Name your criterion in order to retrieve it in the complete funnel, and click Finish.
 
 ![segments11][45]

When you have finished setting up your criterion, it will appear in the segment funnel.
Because a segment is based on analytics data, segments are computed once per day.
In this example, 47,7% of the total end-users matched the criterion. They should be the users who have had a good experience and will be likely to provide a higher rating if you push them a notification asking them to rate the app in the store.

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
