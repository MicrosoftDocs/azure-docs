<properties 
	pageTitle="Azure Mobile Engagement Gaming Scenario"
	description="A scenario for a gaming app that uses Azure Mobile Engagement" 
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

#Azure Mobile Engagement gaming scenario 

## Overview

A gaming start-up has launched a new role-play/strategy game app. The game has been up and running for 6 months. This game is a huge success, they have millions of downloads and the retention is very high compared to other start-up game apps. At the quarterly review meeting, stakeholders agree they need to increase average revenue per user. Premium in-game packages are available as special offers. These game packs allow users to upgrade the appearance and performance of their weapons and armor in the game. However, package sales are very low. So they decide first to analyze the customer experience with an analytics tool, and then to develop an engagement program to increase sales using advanced segmentation.

Based on the [Azure Mobile Engagement - Getting Started Guide with Best practices](mobile-engagement-getting-started-best-practices.md) they build an engagement strategy.

##Objectives and KPIs

Key stakeholders for the game meet. All agree on one main objective: To increase premium package sales by 15%. They create Business Key Performance Indicators (KPIs) to measure and drive this objective

* On which level are packages purchased?
* What is the revenue for per user, per session, per week, and per month?
* What are the favorite purchase types?

Part 1 of the [Getting Started Guide](mobile-engagement-getting-started-best-practices.md) explains how to define the objectives and KPIs. 

With the Business KPIs now defined, the Mobile Product Manager creates Engagement KPIs to determine new user trends and retention.

* Monitor retention and use across the following timespans: daily, every 2 days, weekly, monthly and every 3 months
* Performance of origin sources of my users (Wes: Whats an origin source?)
* Active user counts
* The app rating in the store

Based on recommendations from the IT team, the following technical KPIs were added to answer the following questions:

* What is my user path (which page is visited, how many time users spend on it)
* Number of crashes or bugs encountered per session?
* What OS versions are my users running?
* What is the average size of screen for my users?
* What kind of internet connections do my users have?

For each KPI the Mobile Product Manager specifies the data he needs and where it is located in his playbook.


## Engagement program and integration

Before building an advanced engagement program, The Mobile Project Director in charge of the project should have a deep understanding of how and when products are consumed by the users.

After 3 months the Mobile Project Director has collected enough data to enhance his in-app push notification sales. He learns that:

* The first purchase generally happens at the level 14. For 90% of those cases, the purchase is new legendary weapons for $3.
* In 80 % of those cases, users who have made a purchase, continue with the product and make more purchases.
* Users who have passed the level 20, start to spend more than $10/week.
* Users tend to buy premium packages at level 16, 24 and 32.

Thanks to this analysis the Mobile Project Director decides to create specific push notification sequences to increase in app sales. He creates three push sequences which he calls: Welcome program, Sales Program, and Inactive Program. For more information refer to the [Playbooks](https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks)


| Push Sequence       | Objective | How | Target | Content | When |
|:-------------------:|:---------:|:---:|:------:|:-------:|:----:|
| **Welcome Program** |
| Push 1 | Help user learn the app<br>and introduce features | Make a tutorial to<br>introduce the app | First time users of the app | Welcome on board! Thank you for installing the app.<br>If this is your first experience with the app,<br>click OK to launch a short tutorial. | 1st session, immediately after the splashscreen |
| Push 2 | Encourage users to<br>create an account | Explain the benefits of the account | Users running the app the second time | Welcome back, we recommend you create an account. Slide to see the benefits of having an account | 2nd session |
| **Sales Program** |
| Push 1 | Encourage users to make<br>their first purchase | Send a special offer when<br>the user reaches level 7 | Users at level 7 who have<br>not yet made a purchase | Congratulations on reaching level 7!<br>With this special armor offer,<br>you will look like an elite warrior | In app after reaching level 7 |  
| Push 2 | Encourage users to purchase | Send a special offer when<br>the user reaches level 14 | Users at level 14 | Congratulations on reaching level 14!<br>Purchase these new level 14 legendary weapons for $5<br>to help you bring down the harder bosses<br>through level 32 | In app when the user opens the weapons page after reaching level 14<br>and does not possess level 14 legendary weapons pack |
| Push 3 | Increase game packs sales at levels 16, 24, 32 | Webview with a special offer | Users who reach the target level | Take advantage of these special game packs to help you quickly<br>excel at your level | Users reach the target level |
| **Inactive Program**
| Push 1 | Get feedback for technical issues | Poll for performance feedback | User who have not created a session<br>in the last 2 months | Your friends are missing you in game.<br>Are you having any technical difficulties?<br>1. I've just been too busy to play.<br>2. I just don't enjoy the game anymore.<br>3. I'm having problems accessing my account.<br>4. The game is not running well for me. | Anytime |
| Push 2 | Introduce new features and updates | Users who respond to Inactive Push 1 | We've added updates based on in game user feedback, take a look at what we've added. | Anytime |  


  

<!--Image references-->


<!--Link references-->
