<properties 
	pageTitle="Azure Mobile Engagement implementation for Media App"
	description="Media app scenario to implement Azure Mobile Engagement" 
	services="mobile-engagement" 
	documentationCenter="mobile" 
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

#Implement Mobile Engagement with Media App

## Overview

John is a mobile project manager for a big media company. He recently launched a new app that has a very high download count. He has hit his goals for download but, still his Return On Investment(ROI) per user does not meet his requirements. 

John has already identified why his ROI is too low. Users frequently stop using his app after only 2 weeks and most of them never come back. He wants to increase the retention of his app.

After some initial testing, he has learned when he engages his users with push notifications, they tend to continue using his app. Also users that were inactive will often return to the app depending on notifications he sends them. John decides to invest in some kind of Engagement Program for his app which uses advanced targeting with push notifications.

John has recently read the [Azure Mobile Engagement - Getting Started Guide with Best practices](mobile-engagement-getting-started-best-practices.md) and has decided to implement the recommendations from the guide.

##Objectives and KPIs

Key stakeholders for John's app meet. Business is generated from ads as users consume his media. By increasing content consumed per user, John increases his revenues. All agree on one main objective: To increase sales from ads by 25%. They create Business Key Performance Indicators (KPIs) to measure and drive this objective

* Number of ads clicked per user
* How many article pages visited (per user/ per session/ per week / per month…)
* What are favorite categories

Based on John's meeting with key stakeholders he has defined his Business KPIs. He follows Part 1 of the [Azure Mobile Engagement - Getting Started Guide with Best practices](mobile-engagement-getting-started-best-practices.md). 

Next, he creates the following Engagement KPIs to ensure that objectives are reached:

* Monitor retention across the following intervals: daily, weekly, bi-weekly and monthly.
* Active users counts
* The app rating in the app stores

Based on recommendations from the IT team, the following Technical KPIs were added to answer the following questions:

* What is my user path (which page is visited, how many time users spend on it)
* Number of crashes or bugs encountered per session?
* What OS versions are my users running?
* What is the average size of screen for my users?
* What kind of internet connections do my users have?

For each KPI, he classifies the data required and he records it in the proper location of his playbook.

## Engagement program and integration

Now that John has finished defining his KPIs, he starts his Engagement strategy phase by defining 4 engagement programs and their objectives:
	![][1]

Then John goes deeper by detailing push notifications for each program. Push notification are defined by five elements:

1. Objective: what is the objective of the notification
2. How the objective will be reached
3. Target: who will receive the notification?
4. Content: What is the wording and the format of the notification (In App/Out of App)
5. When: what is the best moment to send this push notification

	![][2]

For more information refer to the [Playbooks](https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks).

According to the part 2 of the white paper John uses target section to define what data he has to collect and writes his Tag Plan jointly with IT team to implement the solution. After 1 week of implementation and user acceptance testing, John can finally launch his programs.

##Program Results

4 months later, John reviews performances of programs. The Welcome Program and the Weekly Program are meeting his goals. The number of user with only one session decreases, more features of the app are being used and the number of connections per week has doubled.

The **Inactive Program** is helping John understand user tendencies. It appears that 15% of the inactive users come back to the app. However most of them don’t stay active more than 1 month. John foresees a potential optimization of this sequence with additional notifications and expanding his content choices.

The **Discover Program** doesn’t work well. It increases cross selling but not enough to reach his objectives. John identifies that he doesn’t have enough data to make relevant targeting and propose appropriate content. He stops this program and focuses on sending “editorial push notifications” with Azure Mobile Engagement. His journalists already have a CMS solution to send push notifications and they don’t want to change.

John decides to use the Reach API which is an HTTP REST API that allows managing Reach campaigns without having to use AZME Web interface. With this approach John can collect the data he needs and allow his writers to keep using the CMS solution.

To ensure that feature works correctly, John asks IT team to be vigilant on the following points:

1. **Operation Systems** : They all have their own rules to administrate push notifications, so John decides to list all cases and checks if the APIs handle it.
E.g : Android push system allows big picture which is not the case with iOS.

2. **Time frame**: John wants an API, which set the time frame and set an end to campaigns. He wants to preserve users from any disruptive notification bombing.

3. **Categories**: Marketing team prepares template for each type of alerting. John asks IT team to set categories inside the API.

After some tests John is satisfied. Thanks to this API, journalists can still send push notifications with their CMS and Azure Mobile Engagement collects all behavioral data for them

After these 4 first months, results reflect a good overall performance and gives confidence for John and his board, ROI per user increases per 15% and mobile sales represent 17.5 % of total sales, an increase of 7.5% in only four months.

<!--Image references-->
[1]: ./media/mobile-engagement-media-scenario/engagement-strategy.png
[2]: ./media/mobile-engagement-media-scenario/push-scenarios.png

<!--Link references-->
[Media Playbook link]: https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks
