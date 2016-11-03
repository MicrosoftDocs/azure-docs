---
title: Comparing Azure Mobile Engagement with other similar Azure services
description: Comparing Azure Mobile Engagement with other similar Azure services - HockeyApp, AppInsights, Notification Hubs
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: 1f114775-3a9a-4dd4-8d59-b10d1da9a68b
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/19/2016
ms.author: piyushjo

---
# Comparing Azure Mobile Engagement with other similar Azure services
The list of services offered by Microsoft Azure is ever expanding and at times you may wonder how is Azure Mobile Engagement different than this other service that you just read or hear about. This article attempts to clear the confusion and directs you to choose Azure Mobile Engagement when it is most appropriate for your usage. 

Azure Mobile Engagement is a service targeted specifically **for digital marketers/CMOs** but could be used by any **mobile app owner or publisher** who wants to increase the usage, retention and monetization of their mobile apps. 

*It is a software-as-a-service (SaaS) user-engagement platform that provides data-driven insights into app usage, real-time user segmentation, and enables contextually-aware push notifications and in-app messaging.* 

Breaking down this definition, we have the following key characteristics which also highlights its unique value proposition:

1. **Contextually-aware push notifications and in-app messaging**
   
   This is the core focus of the product - perform targeted and personalized push notifications. And for this to happen, we collect rich behavioral analytics data. 
2. **Data-driven insights into app usage**
   
   We provide cross platform SDKs to collect the behavioral analytics about the app users. Note the term behavioral analytics (as against performance analytics) because we focus on how the app users are using the app. We do collect basic performance analytics data about errors, crashes etc but that is not the core focus of the product. 
3. **Real-time user segmentation**
   
   Once you have collected app users' behavioral analytics data, we allow you to segment your audience based on various parameters and collected data to enable you to run targeted push campaigns. 
4. **Software-as-a-service (SaaS):**
   
   We have a portal separate from the Azure management portal which is optimized to interact and view rich behavioral analytics about the app users and run marketing push campaigns. The product is geared to get you going in no time!   

With this set of differentiation in hand, here is how we compare against other seemingly similar Azure offerings - note that the article doesn’t do a feature level comparison but takes a more scenario based approach to define which product works best:

1. [HockeyApp](https://azure.microsoft.com/services/hockeyapp/) 
   is the Microsoft's mobile DevOps solution. With it, you can distribute builds to beta testers, collect crash data, and get user feedback. It also integrates with Visual Studio Team Services enabling easy build deployments and work item integration. 
   
   The focus here is on DevOps and collecting performance analytics data about the mobile apps. You may end up with integrating both HockeyApps and Mobile Engagement in your app and that will not be unusual because even though there is some overlap in the collected data, the core focus of the products is different and they help in achieving different objectives for you.  
2. [Application Insights](../application-insights/app-insights-overview.md)
   If your mobile app has a server side, then you will use Application Insights to monitor the web server side of your app but for the client side mobile apps, you should use HockeyApp. 
3. [Notification Hubs](https://azure.microsoft.com/services/notification-hubs/)
   provides a lightweight service in the sense that you don’t need an SDK integrated in the mobile app and you can have full control of your mobile app and it allows sending push notifications with basic tagging capabilities. This is great for any app owner who cares less about targeting and more about sending/communicating information instantly to their app users (broadcast to a large population). 
   
   Note the focus here on sending blazing fast notifications with basic segmentation capability. 

Let’s take some scenarios:

1. Tim is part of the digital marketing team at Adventure Works store which publishes mobile apps for users. Tim's goal is to ensure that the users who download their mobile apps continue to use it and frequently. This not just increases a brand attach with the app users but also increases monetization when the app users make purchases using the mobile app. For this Tim will need to send targeted notifications to the app users, which they find useful, to encourage them to open the app and come back to it often. This is where Tim will find Mobile Engagement useful. 
2. Joann is part of the development team of the mobile apps at Adventure Works and is looking for a product to log details about crashes, exceptions, and get performance telemetry from an app. This is where Joann will find HockeyApp useful. Joann could integrate both HockeyApp for her developer focused scenarios and Azure Mobile Engagement for Tim in the same app to get the best of both. 
3. Robin is part of the development team of the mobile apps at Contoso News network and all she wants is to send out breaking news alerts to all users without much segmentation as soon as the news alert is triggered. This is where Robin will find Notification Hubs useful. 
   In this scenario, it is possible however that as the mobile app matures, there is a requirement to do much richer segmentation and get details about the app user’s behavior. At this time, Robin will have to evaluate Azure Mobile Engagement. 

To recap, the purpose of Mobile Engagement is not just to collect analytics - it is not "yet another Analytics product from Microsoft". It is about sending targeted push notifications and for this targeting, we collect behavioral analytics data but the focus remains on sending push notifications which make the most sense to the app users so that it does not come across as spam. 

For more details - take a look at this [quick video](mobile-engagement-overview.md) about Mobile Engagement in a nutshell. 

