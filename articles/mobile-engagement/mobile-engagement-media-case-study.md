<properties 
	pageTitle="A media app case study for Azure Mobile Engagement"
	description="A case study for a media app that uses Azure Mobile Engagement" 
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-engagement"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="mobile-multiple"
	ms.workload="mobile" 
	ms.date="11/02/2015"
	ms.author="wesmc"/>

#A media app case study for Azure Mobile Engagement 

## Overview

John is a mobile project manager for a big media company. He recently launched a new app that has a very high download count. He has hit his goals for download but, still his Return On Investment(ROI) per user does not meet his requirements. 

John has already identified why his ROI is too low. Users frequently stop using his app after only 2 weeks and most of them never come back. He wants to increase the retention of his app.

After some initial testing, he has learned when he engages his users with push notifications, they tend to continue using his app. Also users that were inactive will often return to the app depending on notifications he sends them. John decides to invest in some kind of Engagement Program for his app which uses advanced targeting with push notifications.

John has recently read the [Azure Mobile Engagement - Getting Started Guide with Best practices](mobile-engagement-getting-started-best-practices.md) and has decided to implement the recommendations from the guide.

##Objectives and KPIs

Key stakeholders for John's app meet. All agree on one main objective: To increase sales from ads by 25%. They create Key Performance Indicators (KPIs) to drive this objective

* Number of ads clicked per user
* How many article pages visited (per user/ per session/ per week / per month…)
* What are favorite categories

John meets with all key stakeholders for his app to define his Business KPIs. He follows Part 1 of the [Azure Mobile Engagement - Getting Started Guide with Best practices](mobile-engagement-getting-started-best-practices.md). 

Based on purchasing patterns he has noted for his users, John is confident he will reach his objectives based on 2 main factors:

1. The number of visits per user
2. Consumed content per user. Business is generated as users consume his media. By increasing content consumed per user, John increases his revenues.

He creates the following Engagement KPIs to ensure that objectives are reached:

* Monitor retention across the following intervals: daily, weekly, bi-weekly and monthly.
* Origin sources of my users and performances by source (Wes: need clarification on this)
* Active users counts
* The app rating in the app stores

Following recommendations from the IT team, some technical KPIs were added to answer the following questions:

* What is my user path (which page is visited, how many time users spend on it)
* Number of crashes or bugs encountered per session?
* What OS versions are my users running?
* What is the average size of screen for my users?
* What kind of internet connections do my users have?

For each KPI, he classifies the data required and he records it in the proper location of his playbook.



## Engagement program and integration


Now that John has finished defining his KPIs, he starts his Engagement strategy phase by defining 4 engagement programs and their objectives:


| Program Name | Objective1 | Objective2 | Objective3 |
|:------------:|:----------:|:----------:|:----------:|
| Welcome Program | Introduce users to the app | Boost opt-in push | ??? |
| Weekly Program | Increase app visits | Develop??? | Develop usage??? |
| Discover Program | Implement what??? | Cross-sell | Increase number of something??? |
| Inactive Program | Determine technical issues | Introduce new features | Awake inactive users |



Then John goes deeper by detailing push notifications for each program. Push notification are defined by five elements:

1. Objective: what is the objective of the notification
2. How the objective will be reached
3. Target: who will receive the notification?
4. Content: What is the wording and the format of the notification (In App/Out of App)
5. When: what is the best moment to send this push notification



| Push Sequence        | Objective | How | Target | Content | When |
|:--------------------:|:---------:|:---:|:------:|:-------:|:----:|
| **Welcome Program**  |
| Push 1 | Help user learn the app<br>and introduce features | Make a tutorial to<br>introduce the app | First time users of the app | Welcome on board! Thank you for installing the app.<br>If this is your first experience with the app,<br>click OK to launch a short tutorial. | 1st session, immediately<br>after the splashscreen |
| Push 2 | Encourage users to<br>configure the app and<br>respond to notifications | Explain the benefits of allowing notifications | All users who have not configured notifications | Did you know we can send you<br>instant updates and discount offers? | 3rd session |
| **Weekly Program**   |
| Push Sequence | Objective | How | Target | Content | When |
|:-------------:|:---------:|:---:|:------:|:-------:|:----:|
| Push 1 | Drive retention | Correctly targeted push notifications | All users | Receive instant updates and<br>stay informed | Monday at 10AM |  
| Push 2 | Drive retention | Correctly targeted push notifications | All users | Question of the week:<br>Who will win the World Series?<br>1. The Royals<br>2. The Mets | During World Series |
| Push 3 | Drive retention | Correctly targeted push notifications | All users | Daily traffic report | 3PM each week day  |
| **Discover Program** |
| Push Sequence | Objective | How | Target | Content | When |
|:-------------:|:---------:|:---:|:------:|:-------:|:----:|
| Push 1 | Increase cross selling<br>and page views | Introduce new categories | User who have been active<br>for 20-70 days | This month we bring you<br>the latest movie reviews. | Out of app |
| Push 2 | Increase cross selling<br>and page views | Users who have consumed movie reviews<br>three times after receiving Push 1 | How do you like our latest movie reviews?<br>Use this discount code for<br>movie tickets to a theater near you | Out of app |  
| **Inactive Program** |
| Push Sequence | Objective | How | Target | Content | When |
|:-------------:|:---------:|:---:|:------:|:-------:|:----:|
| Push 1 | Get feedback for technical issues | Poll for performance feedback | User who have not created a session<br>in the last 2 weeks | The latest reports are now available.<br>Are you having any technical difficulties?<br>1. I'm having problems accessing my account.<br>2. The app is not running well for me.<br>3. The app does not contain content I'm interested in. | Anytime |



For more information refer to the [Playbooks](https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks).

According to the part 2 of the white paper John uses target section to define what data he has to collect and writes his Tag Plan jointly with IT team to implement the solution. After 1 week of implementation and user acceptance testing, John can finally launch his programs.



##Program Results


4 months later, John reviews performances of programs.  (Really?  users are going inactive after two weeks and he waits 4 months to review the performance of his engagement programs?? I think should be more like after a month he should review them)

The Welcome Program and the Weekly Program are meeting his goals. The number of user with only one session decreases, more features of the app are being used and the number of connections per week has doubled.

The Inactive Program is helping John understand user tendencies. It appears that 15% of the inactive users come back to the app. However most of them don’t stay active more than 1 month. John foresees a potential optimization of this sequence with additional notifications and expanding his content choices.

The Discover Program doesn’t work well. It increases cross selling but not enough to reach his objectives. John identifies that he doesn’t have enough data to make relevant targeting and propose appropriate content. He stops this program and focuses on sending “editorial push notifications” with Azure Mobile Engagement. His journalists already have a CMS solution to send push notifications and they don’t want to change.

John decides to use the Reach API which is an HTTP REST API that allows managing Reach campaigns without having to use AZME Web interface. With this approach John can collect the dat he needs and allow his writers to keep using the CMS solution.

To ensure that feature works correctly, John asks IT team to be vigilant on the following points:

OS : They all have their own rules to administrate push notifications, so John decides to list all cases and checks if the APIs handle it.

E.i : Android push system allows big picture which is not the case with iOS.

Time frame: John wants an API, which set the time frame and set an end to campaigns. He wants to preserve users from any disruptive notification bombing.

Categories: Marketing team prepares template for each type of alerting. John asks IT team to set categories inside the API.

After some tests John is satisfied. Thanks to this API, journalists can still send push notifications with their CMS and Azure Mobile Engagement collects all behavioral data for them

After, these 4 first months, results reflect a good overall performance and gives confidence for John and his board, ROI per user increases per 15 % and mobile sales represent 17,5 % of total sales, an increase of 7,5% in only four months.

  

<!--Image references-->


<!--Link references-->
[Media Playbook link]: https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks
