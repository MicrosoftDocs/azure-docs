---
title: Share results with your team using Workbooks that combine live data and text in Azure Application Insights | Microsoft docs
description: Demographic analysis of users of your web app.
services: application-insights
documentationcenter: ''
author: numberbycolors
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 06/12/2017
ms.author: cfreeman
---

# Share results with your team using Workbooks that combine live data and text in Application Insights

Workbooks combine [Azure Application Insights](app-insights-overview.md) data visualizations, [Analytics queries](app-insights-analytics.md), and text into interactive documents. Workbooks are editable by other team members with access to the same Azure resource. This means the queries and controls used to create a workbook are available to other people reading the workbook, making them easy to explore, extend, and check for mistakes.

Workbooks are helpful for scenarios like:

* Exploring the usage of your app when you don't know the metrics of interest in advance: numbers of users, retention rates, converstion rates, etc. Unlike other usage analytics tools in Application Insights, Workbooks let you combine multiple kinds of visualizations and analyses, making them great for this kind of free-form exploration.
* Explaining to your team how a newly released feature is performing, by showing user counts for key interactions and other metrics.
* Sharing the results of an A/B experiment in your app with other members of your team by explaining the goals for the experiment with text, then showing each usage metric and Analytics query used to evaluate the experiment, along with clear call-outs for whether each metric was above- or below-target.
* Reporting the impact of an outage on the usage of your app, combining data, text explanation, and a discussion of next steps to prevent outages in the future.

## Getting Started

TBD

TBD - link to [learn how to get started with the usage tools](app-insights-usage-overview.md).

TBD - provided you have [instrumented it](app-insights-javascript.md). 

    A custom event represents one occurrence of something happening in your app, often a user interaction like a button click or the completion of some task. You insert code in your app to [generate custom events](app-insights-api-custom-events-metrics.md#trackevent).

## Editing, Rearranging, Cloning, and Deleting Workbook Sections

To edit the contents of a workbook section, click the **Edit** button below and to the right of the workbook section.

TBD - numbered screenshot here

1. When you're done editing a section, click **Done Editing** in the bottom left corner of the section.

2. To create a duplicate of a section, click the **Clone this section** icon. Creating duplicate sections is a great to way to iterate on a query without losing previous iterations.

3. To move a section up in a workbook, click the **Move up** or **Move down** icon.

4. To remove a section permanently, click the **Remove** icon.

## Adding Usage Data Visualization Sections

TBD - link to the docs for each of the other visualizations

## Adding Application Insights Analytics Sections

TBD - link to the reference for the Analytics query language

## Adding Text and Markdown Sections

TBD - link to explaining Markdown

## Saving and Sharing Workbooks with Your Team

TBD. 

TBD - mention Pin to Dashbaord

![TBD - photo](./media/app-insights-usage-workbooks/tbd.png)

## Next steps

* [Usage overview](app-insights-usage-overview.md)
* [Users, Sessions, and Events](app-insights-usage-segmentation.md)
* [Retention](app-insights-usage-retention.md)
* [Coding custom events](app-insights-api-custom-events-metrics.md)

