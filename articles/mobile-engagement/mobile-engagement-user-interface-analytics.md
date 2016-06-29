<properties
   pageTitle="Azure Mobile Engagement User Interface - Analytics"
   description="Learn how to analyze historical data about your application using Azure Mobile Engagement"
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
   ms.date="11/29/2015"
   ms.author="piyushjo"/>

# How to analyze historical data about your application

This article describes the **ANALYTICS** tab of the **Mobile Engagement** portal. You use the **Mobile Engagement** portal to monitor and manage your mobile apps. Note that to start using the portal you first need to create an **Azure Mobile Engagement** account.


The Analytics section of the UI provides aggregated information about your application based on historic data that is updated every 24 hours. The information is displayed on different dashboards composed of line/bar/pie charts, grids, and maps. The data can also be downloaded as .csv files. Most of this same information is available in real time in the Monitor section of the UI, and it can also be accessed from the Analytics API.

>[AZURE.NOTE] Many sections of the **Mobile Engagement** portal UI contain the **SHOW HELP** button. Press this button to get more contextual information about a section.

## Standard and Custom Analytics

Azure Mobile Engagement provides a set of basic, standard analytic information about your applications that can be graphed as soon as you integrate your app with the SDK. Azure Mobile Engagement also provides the ability to gather additional custom analytics information that you want about your end-users' behavior. You can do this by creating a tag plan of custom "Tags (app info)", created from **Settings** so that Azure Mobile Engagement can collect this additional data for you.



## Analytics
- Dashboard: Shows general information about your new and actives users and their trends.
- Users: Users are identified by their device identifier: this identifier is unique for each device (one new user is actually one new device). A user is considered as new on a given time interval if he has performed his first session during this time interval. A user is considered as retained if he has performed at least one session during the last 7 days. Active Users are users that made at least one session during a given period. You can sort by, monthly, weekly, daily, or hourly time periods. All of the charts look similar but allow you to filter by different features, such as the version of your application, and then to sort by a period of time. The standard information gathered by integrating the SDK includes the following: Active users, new user, number of sessions, length of each session, technical information about the country, locals, location, language carrier, devices, firmware, network (WIFI), versions of the app and SDK, used by customers. This information can be viewed in real time from the monitor section.

> Note: The time period is based on the date from the users' device settings, so a user whose phone has the date incorrectly set could show up in the wrong time period.

- Retention: A user is considered as retained on a given time interval if he has performed his first session during this time interval. You can change the time intervals during which retained users (and new users) are counted to hours, days, weeks, or months. The user retention analytics is built on top of cohorts. A cohort is the set of all the new users detected for a given period (i.e., the set of users performing their first session during this period). We use cohorts of 1-day, 2-day, 4-day, 7-day, or 1-month. Given a cohort, every 1-day, 2-day, 4-day, 7-day, or 1-month, Azure Mobile Engagement computes the set of all users who belong to the cohort and are still active (i.e., the set of users who performed at least one session during the period). This set of users is called a cohort version. (Azure Mobile Engagement can show you how many of your users are still using your app, but only the platform specific store can tell you how many of your users uninstalled your app - for example, GooglePlay, iTunes, Windows Store, etc.).
- Sessions: One use of the application by a user. Sessions are generated from the sequence of activities performed by users (an activity is usually associated to the usage of one screen of the application, but this can vary depending on the way the SDK has been integrated in the application). A user can only perform one activity at a time: a session starts as soon as the user starts his first activity and stops when he finishes his last activity. If a user stays more than a few seconds without performing any activity, then his sequence of activities is split into two distinct sessions.
- Activities: The names of each screen in your application and the length of time users spend on each screen. Activities are a custom analytic option that will correspond to the "app info" tags you have set up for your own app:
- User Path:  Shows how your users navigate through your application's activities (screens). You can move the slider to adjust the level of details. Blue nodes represent your application's activities. Their size is proportional to the time users spent in it. White nodes represent session start and stop. Red nodes represent crashes. Links represent transitions between your application's activities (or between activities and crashes). Click on a node or a link to display a tooltip with more information about your data: the time spent in a particular screen, the count of transitions, and the percentage of transitions from the source activity to the destination activity. (A ---60% ---> B means that users being on activity A goes to activity B 60% of the time.) You can reorganize the graph as you want to clarify it; its position is saved every time you make a change. You can show or hide the crashes to lighten the graph.
- Events: Specific actions taken by a user in the application. The distribution of events is shown as the count of events per user per session. An event represents an instant action, for example, a click on a button or the reception of a notification. (The meaning of events depends on how the SDK has been integrated in the application.) An event can occur during a session or a job or can be stand alone.
- Jobs: Similar to events except they focus on the length of the action. For example, Jobs could tell you technical information about how long it takes content to load or a call to web service. It could also show how long it takes a user to fill out a form, create an account, or make a purchase. A job represents the duration of a task, for example, the duration of a download task or the time a banner is displayed on the screen. (The meaning of Jobs depends on how the SDK has been integrated in the application.) Jobs are usually associated with background tasks that are performed outside of the scope of a session (i.e., without any user activity).
- Technicals: Technical information about the devices of the users of your app that you can track, such as the Locale, Carrier, Network, Device, Firmware, and Screen size of the users' devices, and the Version of your App and the SDK version used in your app.
- Errors: Information about technical errors inside the application that do not cause the application to crash. An error represents an instant issue, for example, a network failure or a bad manipulation. (The meaning of events depends on how the SDK has been integrated in the application.) An error can occur during a session or a job or can be stand alone.
- Crashes: Information about errors that cause your application to crash. A crash is an unexpected condition where the application stops performing its expected functions and must be stopped. A crash is usually due to a bug in the application.

![Analytics2][11]

## Accessing the Retention Overview
![Analytics3][12]

The retention overview is broken down in the middle into several cards, each showing the overview for a certain retention period. The 2-day retention period is seen in the example. The other cards show the 4-day and 7-day retention periods.

## Understanding the Retention Overview cards
![Analytics4][13]

### Each card is composed of 3 main parts:
1. 1: The cohort and the period considered
2. 2-4: The retention for the current period
3. 5: A Sparkline of the history

### Here is detailed information about each element:
1.    Cohort and period: This headline gives the type of cohort. Here "2-day period" means that we will look at the behavior of users over 2 days, Users that arrived over a period of 2 days, and whether they connect in the following blocks of 2 days. The example above considers the activity of users between the 21st and 22nd of November.
2.    This gives the retention rate over the 21 and 22 of November for the users arriving in 19 and 20 of November. Here we had 1 active user between the 21st and 22nd, over the 3 that were new users between the 19th and 20th.
3.    This visual indicator gives the same information as above represented graphically. (The third of the circle is from the 33% number.) The color gives additional information: Green indicates this number is growing from the previous calculation. Yellow means stable, and red means decreasing.
4.    This indicates the values used for the calculation.
5.    This is a Sparkline of the history of the retention values. It allows you to see the values in the past to have a broad view of how it evolved.


## See also

- [Concepts][Link 6]
- [Troubleshooting Guide Service][Link 24]

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
[Link 27]: ../mobile-engagement-how-tos-first-push.md
[Link 28]: ../mobile-engagement-how-tos-test-campaign.md
[Link 29]: ../mobile-engagement-how-tos-personalize-push.md
[Link 30]: ../mobile-engagement-how-tos-differentiate-push.md
[Link 31]: ../mobile-engagement-how-tos-schedule-campaign.md
[Link 32]: ../mobile-engagement-how-tos-text-view.md
[Link 33]: ../mobile-engagement-how-tos-web-view.md
