---
title: HEART Metrics and their Implementation
description: Overview of Happiness, Engagement, Adoption, Retention, & Task Success metrics and how to instrument them
ms.topic: conceptual
ms.date: 11/11/2021

---

# HEART Overview
A product analytics framework, introduced by Google, that enables holistic measurement of a user experience by focusing on 5 dimensions captured through telemetry.

The 5 dimensions of HEART enable measurement of **H**appiness, **E**ngagement, **A**doption, **R**etention & **T**ask Success.

Adoption, Engagement, and Retention form a user activity funnel: Adoption -> Engagement -> Retention. Some users will load the application (**Adoption**). A subset of those users will then choose to click on a component within the app, such as a button (**Engagement**). Some of the users active in the application will choose to return (**Retention**). Completing **tasks successfully** drives users down this funnel: users will choose to come back to the application if they are productive in the application. Finally, **Happiness** is the outcome of the other 4 dimensions. A product owner can measure how effectively the product converts adopted users to retained users with Happiness: users who progress down the Adoption -> Engagement -> Retention funnel and complete tasks successfully will show higher satisfaction.


The HEART Framework uses the [Click Analytics plugin for Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript-click-analytics-plugin). To calculate HEART Metrics, **the Click Analytics plugin must be implemented in the application.** Visit the **Development Requirements** tab to learn more about telemetry implementation.
