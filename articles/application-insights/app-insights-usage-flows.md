---
title: Analyze user navigation patterns with Flows in Azure Application Insights | Microsoft docs
description: Analyze how users navigate between the pages and features of your web app.
services: application-insights
documentationcenter: ''
author: numberbycolors
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 08/02/2017
ms.author: cfreeman
---

# Analyze user navigation patterns with Flows in Application Insights

The Flows tool visualizes how users navigate between the pages and features of your site. Given an initial page view or custom event, Flows shows how many times users followed that 

> [!NOTE]
> Your Application Insights resource must contain page views or custom events to use the Flows tool. [Learn how to set up your app to collect page views automatically with the Application Insights JavaScript SDK](app-insights-javascript.md).
> 
> 

## How do users navigate from a page on your site?

Scenario TBD:
1. Choose the page view for the page you're interested in
2. See where they go! Specifically, look for the page views in the first few columns

## What do users click on a page on your site?

Scenario TBD:
1. Choose the page view for the page you're interested in
2. See where they go! Specifically, look for the custom events in the first column

## Where are the places that users churn most from your site?

Scenario TBD:
1. Choose a page view or event from which you want to look for big dropoffs of users
2. Watch for big "Session Ended" 

## Are there places where users repeat the same action over and over?

Scenario TBD:
1. Choose a page view or event
2. Watch for the same event to occur in subsequent columns, especially if they're thickly connected

## TBD Flows Gotchas

Stuff:
* When steps appear disconnected (need to increase the Detail level)
* "Sampling"
* ABAB thing (first time in session, versus anytime in session)
* Hiding events

## Next steps

* [Usage overview](app-insights-usage-overview.md)
* [Users, Sessions, and Events](app-insights-usage-segmentation.md)
* [Retention](app-insights-usage-retention.md)
* [Adding custom events to your app](app-insights-api-custom-events-metrics.md)