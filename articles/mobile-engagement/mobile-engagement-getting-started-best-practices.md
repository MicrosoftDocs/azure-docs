<properties 
	pageTitle="Azure Mobile Engagement Getting Started Guide with Best Practices"
	description="Getting Started guide for Azure Mobile Engagement and Best practices for onboarding" 
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="wesmc7777"
	manager="erikre"
	editor=""/>

<tags
	ms.service="mobile-engagement"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="mobile-multiple"
	ms.workload="mobile" 
	ms.date="07/07/2016"
	ms.author="wesmc;ricksal"/>

# Azure Mobile Engagement - Getting Started Guide with Best practices

## Overview

**The mobile screen is a very crowded space:** In 2013, a study found the average mobile device had 27 applications installed. Users typically spent 30 hours per month on their apps. Most of this time was spent on social networking and gaming (around 20 hours). By 2014, the Android market had around 1.5 million applications for users to choose from. The Apple store contained around 1.2 million apps. Mobile app use is still increasing as developers compete in this growing market. 

The average mobile user will install and uninstall apps with high frequency depending on changing interests and in-app experiences. In order to determine the success of an app it becomes vital to know more than just how many users install your app. It's important to know how useful your app is and if that usage trend is changing. The following questions become important:

- Are your users beginning to find your app uninteresting or obsolete? 
- How many users have stopped using your app at all? 
- Are in-app purchases trending upward or downward?
- Are users failing to complete work flows because of issues with the app or lack of interest? 
- Could you keep your app useful and relevant by pushing fresh content to your user base? 
- Would this fresh content be the same for all users or focused on user segments based on behavior in your app? 
 
Answers to questions similar to these could help extend the life and revenue from your app. They can also help you define and retain your user base. 

Media related apps tend to have some of the highest retention among users. One reason for this is they are constantly providing fresh content to users. Early adoption of useful push notifications directed to a user segment tends to have a high impact on app retention. 

The Azure Mobile Engagement program is designed to help you extend the life and retention of your app by providing a method to gather and analyze detailed information on the use of your app. It will help you classify your user base according to behavior, and create focused campaigns for delivering push notifications and in-app messages to identified user segments. Key performance indicators (KPI) measure how active your users are with different aspects of your app. Azure Mobile Engagement provides the methods you need to determine these KPIs. It helps increase the return on your investment (ROI) by providing the infrastructure you need to increase engagement with your mobile app. 

In order to get the most out of Azure Mobile Engagement, you need to start with a well designed engagement plan. Your plan will help you identify the granular data you will need to be able to segment your user base. This can be based on behavior and in-app experiences. In order for your plan to be successful, it is a best practice to clearly define the KPI that will measure the objectives of your app. With clear performance indicators defined, you can easily embed the necessary logic in your app to collect fine grained data which you will use to analyze and evaluate your KPIs. This topic is a best practice guide for defining the KPIs that you will use with your engagement plan. 


## Step 1: Define your KPIs to fit the BET model


Correctly defining KPIs can be a difficult task to complete. Apps designed for different industries have their own specifics and objectives. This may tend to confuse your approach. To help avoid this, objectives and KPIs should be classified into three main categories: **Business**, **Engagement**, and **Technical**. This is what we call the **BET model**.

A good plan will generally have objectives with the KPIs that measure the successes in each of the following categories of the BET model.


#### Business KPIs

Business KPIs should be the easiest part to build. You probably already defined these in some form when you planned your mobile app. These KPIs generally help measure revenue and ROI for you app. The following list provides some example Business KPIs that may help guide you while defining your performance indicators:

- Media Business KPIs
	- Number of Ads clicked
	- Number of page visits per user
	- Number of current subscriptions
- Gaming Business KPIs
	- Number of in-app purchases
	- Average revenue per user (ARPU)
	- Time spent per session
	- Days played and current in game level
- E-Commerce Business KPIs
	- Days app used
	- Average revenue per user (ARPU)
	- Average amount in cart during checkout
	- Product category for most views and purchases
- Bank and insurance Business KPIs
	- Number of accounts
	- Features activated
	- Offer pages visited
	- Alerts clicked or activated	   



#### Engagement KPIs

An Engagement KPI is a performance indicator to measure the engagement of your users. Trends in this area help determine the retention of your app. Here are a few example performance indicators for this type of KPI:

- Active users in the last 7 days
- Inactive user count for the last 7 days
- Count of users who have not used the app in 30 days  

Some obvious external factors may influence indicators in this area. For example, you may consider a mobile device to be with a user at all times. This may or may not be true. A gaming app might tend to have higher usage around holidays when a gamer may play more while off work or out of school.   

Well defined KPIs in this category should help you measure the relationship between your app and your customers.



#### Technical KPIs

Performance indicators in this category help you determine if your app is behaving correctly, hanging, or crashing. These indicators can measure the health of your app and determine usability issues that may prevent users from using the app. Information collected for this category could also contain performance information that would be relevant to marketing teams. The data could also be useful for troubleshooting by IT and support teams to help identify unreported bugs. 
 
Here are some examples of Technical KPIs:

- Unhandled or handled exception information and count 
- Timestamp for last crash
- Last button clicked or last page visited
- Memory usage of the app
- App frame rate
- OS version that the app is running on
- App version

Define these KPIs to help measure app performance and pinpoint potential bugs. This indicators should help reduce the time you need to deliver a fix for your customers. They could also help you define a user segment who have encountered a particular issues. You can use that user segmentation to create campaigns to deliver notifications regarding available fixes and potential promotions to help recover customer satisfaction. 


#### Playbook Exercise 1: Create your KPI dashboard

When defining your marketing strategy, your KPIs should present a view for each of your main objectives. They should be clearly defined data points that will allow you to collect vital information to monitor your app and the behavior of the end-user.

Build a KPI dashboard which contains the below information

1.	What are the KPIs for the app?
2.	What data points will I use to represent each KPI?
3.	Where is this data located for my application (i.e. screen, settings, system…)?
4.	Can I play an Engagement sequence for this KPI?

You can use the **KPI Builder** worksheet in our [Media Playbook Template][Media Playbook link] for examples and guidance.



## Step 2: Your Engagement Program


A great mobile engagement program should be considered a key component of your app. This should absolutely include a great welcome program that executes for a user during the first days of app usage. This tends to have a very positive effect on engagement and retention of your app. Studies have shown that the majority of users stop using an app the first few days after installation. You want to strive to meet or exceed customer expectation driving interest early while the user is still focused on your app. Make sure you present the key value and benefits of your app to your customers. 


![](./media/mobile-engagement-getting-started-best-practices/unsegmented-push-notifications.png)

Push notifications are the best approach to early engagements with mobile device users. However, great care should be taken when segmenting users for push notifications. Because once a user feels like they are receiving spam or uninteresting notifications, it can have serious affect. In few clicks, a user may delete your application never to return. The user should be receiving highly personalized in-app value instead of generic spam.

Once users are actively engaged, then your engagement program can help drive other aspects of the app.

For instance, you could setup a campaign that requests your active users to rate your app. Since this user segment is the most active and has the most experience with you app, you would expect them to give the most accurate rating. Once you have a high app rating, it can help drive up the organic download of your app as well reducing your new customer acquisition costs.



#### Engagement Sequence


A global Engagement Program includes different engagement sequences. Each sequence aims to reach several objectives.


###### Life push sequence


The objectives for a Life push sequence are different depending on the lifecycle of the user’s engagement with the app. A particular user may be new, inactive, or very active. At different stages of an engagement lifecycle, users may benefit from your fresh content in the form of tips or links to documentation. 

For example a new user may need help getting oriented to an app or benefit from a new user incentive similar to the following the first time they launch the app...

*"Glad to have you onboard! Remember to login to get your 1st month free!"*


###### Behavioral push sequence

The behavioral push sequence aims to increase usage based on user behavior collected for the app.  

For example, a very active user of a fantasy football app might benefit from being engaged with the following push notification...

*"John you are a serious football fan! Log in to our NFL section and win free access to the SuperBowl!"*


###### Alerting push sequence

Users will appreciate relevant news focused on their interests. An alert push sequence enhances engagement by sending alerts based on interests a user has clearly shown. This could be explicit when a user selects their own interests in the app. It could also be determined implicitly based on data collected during user interaction with the app.

For example, the user of an E-Commerce app may regularly buy a specific brand of coffee which you have captured with a business KPI. The following alert can enhance this user's engagement with the app.
 
*"Hi Wes, One of your favorite brands of coffee will be on sale 25% off the first week of September 2015. We appreciate you as a customer and wanted to make sure you were aware."*

###### Rentention push sequence

This sequence aims to retain users using a repetitive push notification campaigns to help drive a regular habit of engaging with the app. This can help increase app retention if the user enjoys the interactions. 

For example, the user of a sports related app might receive the following push notification weekly based on the user's favorite teams:

*"For a chance to win 200 points, go vote whether the New York Yankees will win their game this week against Toronto Blue Jays!"*


#### The 3W approach

Mastering the different push sequences will help you engage with end-users. However, you still need to use the 3W approach for personalizing your notifications. The 3W approach should address Who, What and When for each notification. If you clearly satisfy these three questions you notifications should be properly focused for engagement.

![](./media/mobile-engagement-getting-started-best-practices/who-what-when.png)



###### Who: The user segment that will receive messages

Pushing notifications to your users should be considered a very sensitive communication channel. Make sure the notifications you aim to send to a user segment are well scoped to the interests of that user segment. An incorrectly routed notification is very likely to have a negative affect on a user. They may consider it spam leading to your app being uninstalled. 

Use a combination of specific technical and behavioral criteria when defining user segments that will receive notifications. A simple example defining a user segment could be similar to the following statement:

"All users who launched the a mobile application for the first time 3 days ago, and have visited the login page twice without actually completing a login".
 
That statement helps identify the data you would need to collect to support a specific scenario.


###### What: The message that you will send

**Tone**

In your engagements use a tone that is appropriate for your for your segmented users. This is definitely a good way to connect with your end-users and promote a user's interest in your app. 

**Redirection**

A push notification can be used for more than opening up the application. If the notification message provides a context such as broadcast news or a product promotion, this notification may deep link directly to the right content within the application. To support this, you must create a URL scheme to let the application manage the redirection. When working on your engagement sequences, this is an important step that must not be forgotten.

Redirection can also be managed for other systems. For instance, with an Action URL it is possible to redirect end-users to many other systems including the following:

- A website
- A mailbox with email already set up
- An SMS box
- A dial service
- Directly to the application store for rating the application. 

This provides many opportunities to engage end-users and create automatic rules to improve performances.


**Format/Content**

Different types and Push notification formats:

1. **Announcements** : enables you to send advertising messages to users at different moments (out of app, in app or anytime).
2. **Polls** : enabled you to gather information from end-users by asking them questions. Those answers are then available when creating criteria  to target end-users.
3. **Data Pushes** : enables you to send a binary or base64 data file to update the app. The information contained in a data push is sent to your application to personalize the users' experience in your app. Your application needs to be designed to support the data in a data push.
4. **Tiles (Windows Phone only)** : enabled you to use the Microsoft Push Notification Service (MPNS) to send Native Push Notification containing XML Data (Supported since SDK version 0.9.0. The final payload for tiles cannot exceed 32 kilobytes.). The message appears directly on your board’s tile.
5. **Webview** : A web view is a pop-up containing web content. This pop-up appears when the end-user has clicked on the push notification. A web view allows you to have more interaction with the end-user.
 
>[AZURE.NOTE] Make sure that the content you are sending as push notifications complies with the respective platform (iOS, Android, Windows) guidelines for developing apps and sending push notifications.

 


###### When: The timing of your campaign

When is the best time to activate a campaign triggering push notifications? Should it be manual or automatic? Should it be recurring? Determining the right time or frequency is essential to engage users with the best results. For each engagement sequence and scenario, you must specify when will be the best time to send push notifications. Here are some possible examples:

![](./media/mobile-engagement-getting-started-best-practices/campaign-timing-examples.png)

If you are sending many notifications daily, you must take serious consideration that your users may perceive your communications as spam. 

Azure Mobile Engagement provides two ways to help avoid your communications being perceived as spam. First, use fine grain segmentation to ensure you do not target the same users. Additionally, Azure Mobile Engagement provides a “quota” feature. This feature can limit notifications sent for a campaign. For example, setting a default quota to 5 per week will ensure that a user included as part of the campaign user segment receives no more than 5 notifications for that week.





#### Playbook Exercise 2: Create your engagement program

Spend some time summarizing your objectives and defining the campaigns you expect to play using specific sequences. Make sure you apply the 3W approach to the notifications in your campaigns. 

Use the **Engagement Program** worksheet in the [Media Playbook Template][Media Playbook link] for examples and guidance.


## Step 3: App Integration


#### Create a tag plan

To integrate Azure Mobile Engagement into your app you will need to create a tag plan. The tag plan is the cornerstone of the project. It defines the relationship between marketing specifications, the work flow of the application, and the real tag data collected in the app to measure KPIs. It indicates what analytics you will be able to see in the portal. It also helps you define user segments, and send focused push notifications to engage your end-users. Once you have the tag plan defined, adding the code to integrate it into your app is simple using the Azure Mobile Engagement SDK.

A tag plan should not tag everything in an application. It should only include tag data that is part of your mobile engagement strategy. This will likely be diverse between applications. The [Media Playbook Template][Media Playbook link] provided by Azure Mobile Engagement helps you build a tag plan with a given method. Use the **Tag Plan** worksheet as a guide to building your tag plan.

When defining a tag section in the worksheet, be very specific. This is very important to avoid confusion. Detail each expected scenario in which each tag will be sent. Include the name of the activity where each tag is embedded. This should all be included in the **Informative** part of the worksheet. The tag plan worksheet should be the main reference for test verification. 

In the **Data to collect** section, your development team should find the types, names, values and extra-info key/value pairs required for each tag that will be embedded in the application.

We recommend reviewing the Tag plan with all teams associated with the project. Make necessary corrections and confirm everything is clear for marketing and development teams.

The **Statement of work** worksheet can be used to help guide everyone involved in the project.


#### Data Types

These are common types of data support by Azure Mobile Engagement.

###### Devices and users

Azure Mobile Engagement identifies users by generating a unique identifier for each device. This identifier is called the device identifier (or deviceid). It is generated in such a way that all applications running on that same device share the same device identifier.

###### Sessions and activities

A session is one instance of the app being run by a user. The session spans from the time the user starts the app, until it stops.

An activity is a logical grouping of a set of things the app may do during a session. It is usually a particular screen in the app, but it can be anything defined by the logic of the application. At a minimum you should tag each screen or Activity for your app. This will allow you to understand the user-path.


###### Events

Events are used to report user interaction with the app. They can be instant actions, like sharing content or launching a video. Tagging events will provide you with data collections that show how users interact with the app. 

###### Jobs

Jobs are used to report actions that have a duration. Some examples would include:

- Execution of API calls
- Display time of ads
- Background tasks duration 
- Purchase process duration
- Viewing a video


###### Errors

Errors are used to report issues detected by the app. For example, incorrect user actions, or API call failures.

###### Application information

Application information (App-Info) is used to tag data related to a user's experience with an application. It is generated by a user's interaction with the application. 

For a given app-info key, Azure Mobile Engagement only keeps track of the latest value (no history). App-info reveals the status of your app or your end-users. For example the log-in status, or a user's favorite product group.

###### Crash data

Crash data automatically collected by the Mobile Engagement SDK reports application failures not handled by the application. For example an unhandled exception that occurs.


###### Extra data

Events, errors, activities and jobs can be enhanced with parameters. This is extra-information a developer may provide as specific data from the application. This is important for defining fine-grained segmentation. 

For example, the value of an “article” tag will allow you to segment end-users based on who viewed that particular article. However, that may not be enough. It may be better if that same "article" tag also included extra-info such as “news_category” within an activity. This would be useful to determine dynamically the favorite categories for the user. 

Extra-info is reported as a key/value pair. In the example for this media application, the extra-info for “news_category” would be the value for that category. For example, “sports", "economy", or "politics".





#### Tag and SDK integration 

For step by step instructions for integrating the Azure Mobile Engagement SDK into your app, follow the  [Engagement SDK Integration](mobile-engagement-windows-store-integrate-engagement.md) documentation on Azure website. Choose your target platform from the links at the top of that page.

We recommend creating projects for two apps built on top of Azure Mobile Engagement. One for development and test staging and the other for production staging. Your IT team can then promote from test staging to production when the user acceptance testing is successful.



#### User acceptance testing (UAT)

User acceptance testing (UAT) involves making sure that everything works as designed. Work flows can be completed and gather all required data based on your tag plan:
 
- Information tagging should be in place according to documented AZME concepts
- All information you need is collected (including Extra info value, App info value)
- Nomenclature matches according to yout Tag Plan
- There is no duplicate tags sent

Thoroughly test all the types of notification behavior you have embedded in your app

- Announcements, Polls, Data pushes out of app and in-app
- Text/Web views
- Badge update, Categories



#### Setup

Setting up Azure Mobile Engagement is very simple. All the documentation related to the user interface is available on the Azure Mobile Engagement website, [How to navigate the user interface](mobile-engagement-user-interface.md).

It is recommended that you start by setting up the right roles and role memberships for the users of your project. This helps you manage proper access to the platform for all users. Your roles may include:

- Administrators
- Developers
- Viewers 

Afterwards:
- Register your deviceID to test on your own device.
- Go to the settings of your account and set up the time zone to have charts and notification delivery time set for your time zone.
- Go to the settings of your application and register the “App-info” you need to target end-user within Reach.

For more information on how to run your first push notification campaign, review [How to get started using and managing pushes to reach out to your end users](mobile-engagement-how-tos.md).



## Conclusion


Engagement Programs are iterative and you should continuously improve yours as you experiment with what works best for your app. 

Initially, while developing experience with engagement strategies don't try to build an entire global engagement strategy. Take a step by step approach identifying your KPIs and how to leverage them. Engagement strategy will be unique for each app.

After you have developed some experience you might consider adding the following to your engagement programs:

- Tracking:  You acquire users and you probably define data-collection sources. Azure mobile Engagement can be linked to data-collection sources. It allows you to monitor performances of each source. This information will be interesting to maximize your acquisition investment. 

- A/B testing: This is an essential part of Engagement program. Each app has its own specifics. With A/B testing, you can improve your engagement program.

- Geo-location: This is a big opportunity for brands. Thanks to this feature you can reach at the right place and time. We recommend verifying you have gathered enough end-user behavior data before starting to use geo-location.

- Data push: Data push is an invisible push. Data push allows customizing your application based on end-user behavior. For example, if a user segment often consults high-tech products, the app owner can send a data push which will personalize her home page with high-tech content.



## Next Steps

- [Create an Azure Mobile Engagement account](mobile-engagement-create.md).
- Visit [Define your Mobile Engagement strategy](mobile-engagement-define-your-mobile-engagement-strategy.md) to learn more about defining your Mobile Engagement strategy.



  

<!--Image references-->


<!--Link references-->
[Media Playbook link]: https://github.com/Azure/azure-mobile-engagement-samples/tree/master/Playbooks
