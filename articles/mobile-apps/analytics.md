---
title: Understand mobile application usage and user behavior with Visual Studio App Center and Azure services
description: Learn about the services like App Center that help you make smart business decisions by understanding how users use your mobile application.
author: codemillmatt
ms.assetid: 34a8a070-9b3c-4faf-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
ms.author: masoucou
---

# Analyze and understand mobile application use
How well do you understand how your users use your applications? How many active users does your application have, and how is usage changing over time? What features are they using, and which ones are used the most? Where are these users based? How many users are using the latest version of the application? All these questions are important to understand to turn your app into a successful business. To answer those kinds of usage analytics questions, you need to collect usage data from your apps.

The more you look down into the data, the more you might find ways to improve your application and keep your users happy. It's important to use data to find actionable insights and keep users satisfied.

## Importance of analytics
- Understand your users, how they interact with your application, and what brings them back to fine-tune your application and provide great experiences to grow your business.
- Track your usage metrics to make informed decisions on how to market your application and better serve your customers.
- Measure your application performance.
- Learn which parts of your application drive value and performance.
- Gain data-driven insights into issues that concern churn and retention.

Use the following services to enable mobile application analytics.

## Visual Studio App Center
[App Center Analytics](/appcenter/analytics/) lets you grow your audience by focusing on what's important. It offers deep reporting and insights about user sessions, top devices, OS versions, and behavioral analytics. Easily create custom events to track anything with extensive application analytics.

   **Key features**
   - Track usage patterns, user adoption, and other engagement metrics for free.
   - Identify trends, user behavior, and engagement through custom events.
   - Obtain out-of-the-box metrics and detailed insights on application usage (daily, weekly, monthly), sessions, device properties, and user demographics in a single dashboard.
   - Continuously export all your App Center Analytics data into Azure for unlimited retention. App Center Analytics supports export to Azure Blob storage and Azure Application Insights.
   - Integrate with Azure Application Insights for even deeper insights, such as retention, funnel analysis, and cohorts.
   - Use one-line SDK integration to get started within minutes.
   - Gain platform support for iOS, Android, macOS, tvOS, Xamarin, React Native, Unity, and Cordova.

   **References**
   - [Sign up with App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
   - [Get started with App Center Analytics](/appcenter/analytics/)

## Azure Monitor
Azure Monitor includes [Application Insights](/azure/azure-monitor/app/app-insights-overview), which provides tools to collect and analyze telemetry to maximize performance and monitor your mobile application. You can take advantage of Application Insights by using App Center Analytics to set up export to Application Insights. Application Insights can query, segment, filter, and analyze the custom event telemetry from your applications, beyond the analytics tools that App Center provides.

**Key features**
   - Query your custom event telemetry.
   - Filter event telemetry with powerful segmentation capabilities.
   - Analyze conversion, retention, and navigation patterns in your application. You can use:
     - Funnels to analyze and monitor conversion rates.
     - Retention to analyze how well your application retains users over time.
     - Workbooks to combine visualizations and text into a shareable report.
     - Cohorts to name and save specific groups of users or events so they can be easily referenced from other analytics tools.

**References**
- [Azure portal](https://portal.azure.com/)
- [Analyze your mobile application with App Center and Application Insights](/azure/azure-monitor/learn/mobile-center-quickstart)
- [Use App Center Analytics with Application Insights](/azure/azure-monitor/app/usage-overview)

## Azure PlayFab
[Azure PlayFab](https://playfab.com/) offers a complete back-end platform with game services, real-time analytics, and LiveOps that you need to create world-class cloud-connected games. These services reduce the barriers to launch for game developers. They offer both large and small studios cost-effective development solutions that scale with their games. The services can help studios engage, retain, and monetize players. With PlayFab, developers can use the intelligent cloud to build and operate games, analyze gaming data, and improve overall gaming experiences.

**Key features**
   - Monitor real-time dashboards.
   - Evaluate your game's performance through top metrics.
   - Review summaries of your game's daily and monthly performance through autogenerated reports. You can view the reports in Game Manager and have them downloaded or delivered to your inbox daily.
   - Use A/B testing to run experiments and determine the optimal setting for a particular variable.
   - Use segmentation for players to define automated groupings of players.
    
**References**
- [PlayFab portal](https://developer.playfab.com/en-US/sign-up)
- [Analytics](/gaming/playfab/#pivot=documentation&panel=analytics)
- [Quickstarts](/gaming/playfab/#pivot=documentation&panel=quickstarts) 
