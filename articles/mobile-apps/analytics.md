---
title: Understand app usage and user behaviour with Analytics 
description: Learn how to make smart business decisions by understanding how users use your app
author: elamalani

ms.assetid: 34a8a070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 08/15/2019
ms.author: emalani
---

# Analyze and understand usage of your mobile application 
How well do you understand how your users use your apps? How many active users does your app have and how is usage changing over time? What features are they using and which ones are used the most? Where are these users based? How many users are using the latest version of the application? Well, all these questions are important to turn your app into a successful business and to answer those kinds of usage analytics questions, you need to collect usage data from your apps.

The more you drill down into the data, the more you could find ways to improve your app and keep your users happy and it's important to use data to find actionable insights. This way you will do the right thing for users and your app.

## Importance of levereaging Analytics for mobile apps
- **Understand** your users, how they interact with your app, and what brings them back to fine tune your application and provide great experience to grow your business.
- **Track** your usage metrics and make informed decision on how to market your app and better serve your customers.
- **Measure** your app performance and things that matter the most to your business.
- **Learn** which parts of your app drivers value or app performance and things that matter the most to your business.
- **Data-driven insights** into issues concerning churn and retention.

## Azure Services

1. ### **Visual Studio App Center**
   [App Center Analytics](https://docs.microsoft.com/en-us/appcenter/analytics/) service lets you grow your audience by focusing on what’s important, with deep reporting and insights about user sessions, top devices, OS versions, behavioral analytics, and event trackers. Easily create custom events to track anything with extensive app analytics.

    **Key Features**
    - **Track** usage patterns, user adoption and other engagement metrics for free.
    - **Identify** trends, user behavior, and engagement through custom events.​
    - **Out of the box metrics** and **detailed insights** on app usage (daily, weekly, monthly), sessions, device properties and user demographics in a **single dashboard**.
    - **Continuously export all your Analytics data into Azure** for unlimited retention. Supports Export to Azure Blob Storage and Azure Application Insights.
    - **Integrate with Azure Application Insights** for even deeper insights such as retention, funnel analysis, cohorts and more.​
    - **Single, one liner SDK integration** to get started within minutes.
    - **Platform Support** - iOS, Android, macOS, tvOS, Xamarin, React Native, Unity, Cordova.

    **References**
    - [App Center Portal](https://appcenter.ms) 
    - [Get started with App Center Analytics](https://docs.microsoft.com/en-us/appcenter/analytics/)

2. ### **Azure Monitor**
   Azure Monitor includes [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) that provides tools for collecting and analyzing telemetry to maximize performace and monitor your mobile application. It doesn't explicitely monitor mobile apps, but you can leverage this service by using App Center Analytics and set up export to Application Insights. Application Insights can query, segment, filter, and analyze the custom event telemetry from your apps, beyond the analytics tools App Center provides.

    **Key Features**
    - **Query** your custom event telemetry.
    - **Powerful segmentation** capabilities to filter event telemetry.
    - **Analyze** conversion, retention, and navigation patterns in your app.
        - **Funnels** for analyzing and monitoring conversion rates.
        - **Retention** for analyzing how well your app retains users over time.
        - **Workbooks** for combining visualizations and text into a shareable report.
        - **Cohorts** for naming and saving specific groups of users or events so they can be easily referenced from other analytics tools.
    
    **References**
    - [Azure Portal](https://portal.azure.com/) to create Application Insights resource.
    - [Analyze your mobile app with App Center and Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/learn/mobile-center-quickstart)
    - [Usage Analytics with Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/usage-overview)


3. ### **Azure PlayFab**
   [Azure PlayFab](https://playfab.com/) offers a complete backend platform with game services, real-time analytics, and LiveOps that you need to create world class cloud-connected games. These services reduce the barriers to launch for game developers, offering both large and small studios cost-effective development solutions that scale with their games and help them engage, retain and monetize players. PlayFab enables developers to use the intelligent cloud to build and operate games, analyze gaming data and improve overall gaming experiences.

    **Key Features**
    - **Monitor** real-time dashboards.
    - **Metrics** to evaluate your game's performance through top metrics.
    - **Report** to review summaries of your game’s daily and monthly performance through auto-generated reports that can be viewed in Game Manager and downloaded or delivered to your inbox daily.
    - **A/B testing** to run experiments and determine the optimal setting for a particular variable.
    - **Segmentation** for players allows you to define automated groupings of players.
        
    **References**
    - [PlayFab Portal](https://developer.playfab.com/en-us/login)
    - [Analytics](https://docs.microsoft.com/en-us/gaming/playfab/#pivot=documentation&panel=analytics)
    - [Quickstarts](https://docs.microsoft.com/en-us/gaming/playfab/#pivot=documentation&panel=quickstarts)    