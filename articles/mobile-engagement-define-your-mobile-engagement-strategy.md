<properties 
	pageTitle="Define your Mobile Engagement Strategy" 
	description="Learn how to use onboard and optimize your Mobile Engagement with Analytics and Push Notifications." 
	services="mobile-engagement" 
	documentationCenter="Mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="02/10/2015" 
	ms.author="kapiteir" />

#Define your Mobile Engagement Strategy

You wrote your app for a reason: to have your users use it!

We believe you certainly put a great deal of effort in trying to make it a great app that users will love. You also probably invested a sizeable amount of marketing budget to acquire users. But after the initial exhiliarating peak of users, you might see them slowly stop using your app. **This is what Azure Mobile Engagement all about!**: getting them to stick around and allow you to incrementally improve your app through test and learn.

Our approach to improving retention and usage is based on engaging app users through Push Notifications and In-app messages, but in a very special way, with messages and communication tailored to them, each according to their behavior in your app. Our goal is to let you communicate with the right audience at the right time and the right location.

But for that, you'll have to start with **understanding your users**, then create groups based on what they did or their characteristics (we call it Segments) and then create relevant communications to each segment.

##Mobile Engagement serves your Objectives

*We talked about retention, usage, but for what?*

**Building your Mobile Engagement strategy requires looking first at your app's objectives and KPIs.**

Starting by defining those objectives/KPIs helps to define your engagement use-cases with the right prism. 

Your use-cases are a simple list of campaigns you'd like to make to communicate with your users, ranging from the simple welcome, to the very advanced utility notification triggered by your IT system. A well constructed use case must include at least the trio *what-who-when*:

1. A very short designation (eg "Welcome campaign")
2. **What**: A message example (eg "Glad to have you onboard! Remember to login to get your 1st month free!"). This message is by no means final, you'll be able to change it any time you like, but it usually helps to start thinking about what we want to say
3. **Who**: The segment that will receive this message (eg "All users who launched the app for the first time 3 days ago, have visited the login page but have not logged-in")
	- Yes, you can do that very easily with Azure Mobile Engagement :)
	- Again, this does not have to be final as you can define your segments at anytime, but it is important to define early on your segmentation criteria to ensure you collect the right data
4. **When**: The timing of your campaign. It may be on a given date, or after a specific action, based on a trigger. Mobile Engagement offers an important amount of possibilities to rightly time your communication

Once use-cases and segment are defined, it gives a guideline to define the data that must be collected within an application. This is the role of a *“Tag Plan”*. A Tag plan allows ensuring that the data collection is specified to the developers. Hence, developers are able to embed Mobile Engagement with the right setup for you to work your campaigns with the right data. It will also be very important to run tests to ensure the integration is correct and collects what you need.

Based on the integration, once applications are published, you as a Marketers will be able to see your analytics in real-time, segment your audience and then start to send smart targeted push notification to engage with end-users in or out of the app.

###Use-cases to get started
1. Welcome strategy: Create several push notification campaigns based on the end-user behavior at the launch of the application in order to re-engage at D+2/5/10/15 after the first session and increase first run retention.	
2. Promote a new content (feature, article/video, product, etc.) based on the behavior of end-user to send the information only to end-users that are more likely to engage.	
3. Rate the application: target less than 1% of your user base that is most likely to rate the app 5 stars on the store.	
4. Boost subscriptions: Promote valuable contents to end-users that have not seen them yet to increase subscription.
5. Tutorial: No more mandatory tutorial for everyone. Why not build great tutorials in-app and then triger them through in-app messages only if the user seems to not use or have difficulty using a feature?

##Why do you need Analytics to Engage?

As you might realize at this point, making a broadcast push notification only is not enough. The core concept of Mobile Engagement is to help Marketers and Developers engaging with the right end-user at the right time and at the right place. To know those three main concepts, it is essential to gather analytics from your application and then use it to segment your audience. This is also even more powerful when behavior segments complements data from your other database or CRM or from a cross channel. Mobile Engagement allows retrieving data from anywhere and uses it to target the right audience.

To be the most contextual possible when engaging your audience, it is crucial to have the knowledge of the end-users behavior, to know their status in real-time. Data collection allows marketers to focus really on what matters to play use cases and achieve their mobile engagement strategy objectives. Achieving the objectives set above is also the reason why the best practice in fact is not to gather anything and everything in the analytics but only those that allow your to focus on what your want to learn and use-cases. This is the good way to start, try, test and learn how to use the solution and address smart push notification and increase the retention of an application to bring it at a success story level.

>[AZURE.NOTE] Remember: too much data kills the data!

###Use-cases & Best practices

Below we'll discuss briefly about some key use-cases we've come accross from our customers to get you started.

####Media

Collect the type of content that is consumed by the end-user and then segment the audience based on this behavior to target specific type of content only to an audience that will be more likely to consume. It avoids spamming a whole user base and ensuring a better retention.

####M-commerce

Collect the product categories most visited within the application and target audience to promote a discount or new product in that  category that the end-user will be more likely to purchase. Aim to boost revenues. Again the objective is not to spam!

####Gaming

Collect the level of game of an end-user and the time spent in a given period to target the audience that could be stalled and would be more likely to jump to a next level with a bonus offer.

Communicate about specific events with an incentive to those users that have not played for some time to try and have them back

####Retail

Collect what products or brands an audience should be more likely to consume based on favorite or behavior and drive the audience to store to increase purchase revenues.

####Banking

Collect if end-users have created an account at the first launch of the application. Aim to deploy a welcome strategy with targeted push notification and increase the number of account subscription. 

###How to create a great tag plan?

A tag plan must be like a description of the user-path or a kind of workflow of the application, providing all the necessary tags (data) that must be collected to have enough analytics to understand user behavior and properly segment the user base. This is not a technical process. Hence, marketers are able to specify the data they want to collect based on their Mobile Engagement strategy.
 
The minimum is to tag at least all the Screens (called `Activities` in Mobile Engagement) of an application. This will allow understanding the user-path. 

An Activity can embed `Events` that collect action information like clicking on a button. This allows collecting interaction within the application. Therefore, Marketers are able to know what screen users are visiting and what are they doing. 

`Jobs` are actions with a duration. This is very useful for marketer to understand how long time it takes for a user to create an account or to login for instance. This also could be useful for developers to monitor how long it takes to call a web service. 

`Errors` can also be monitored to know if users are having issues in your app. For example getting often connection issues. 

All of this type of data can be augmented with Parameters (`extra-information` in Mobile Engagement) allowing gathering dynamic data from the application. This is important to allow fine grained segmentation. For instance marketers could segment user based on the type of content they have consume. The type of content will be this dynamic information of an `activity` or an `event`. 

`App-information` are data that allows to know in real-time what is the status of the application or of the user. This helps also to category an audience base and target it quickly. It can be for example a true/false status of whether the user is logging in or not, or his subscription expiration date.

####Example of Tags

*Use-case: Segment audience behavior to target the right end-user with the right content of push notification*

1.	Send Push notification to promote a category of product: Gather behavior data to segment audience based on the category of product they have visited x times in a given period or a specific item they have added in a cart. The data collected will allow to segment and then send push notification to the right audience.
2.	Rate the app: Collect data based on the content shared by the audience on social network. Aims to segment the audience by determining the “Ambassadors” of your app, which is the best audience of your app to ask rating your app 5 stars in the store with a push notification in-app.

	![][1]

*Use-case: Declarative data*
1.	Segment alert news: Collect declarative data to segment audience based on their preferences. It allows sending push notification of a specific topic that really interests a specific audience.
2.	Segment audience based on login status. Collect data to know if a user is connected or has created an account. Help targeting end-users that have not yet logged in and send push notification to engage end-user to convert.
	![][2]

### Next Steps
- Visit [Mobile Engagement Concepts] to learn more about Mobile Engagement basic concepts.
- Visit [Tutorials] to learn more about the implementation.

<!-- Images. -->
[1]: ./media/mobile-engagement-define-your-engagement-strategy/use-case1.png
[2]: ./media/mobile-engagement-define-your-engagement-strategy/use-case2.png

<!-- URLs. -->
[Mobile Engagement Concepts]: http://azure.microsoft.com/documentation/articles/mobile-engagement-concepts/
[Tutorials]: http://azure.microsoft.com/documentation/articles/mobile-engagement-ios-get-started/
