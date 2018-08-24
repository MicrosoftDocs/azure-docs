---
title: Connect to RSS feeds from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor and manage RSS feeds by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.suite: integration
ms.topic: article
ms.assetid: a10a6277-ed29-4e68-a881-ccdad6fd0ad8
tags: connectors
ms.date: 08/24/2018
---

# Manage RSS feeds by using Azure Logic Apps

With Azure Logic Apps and the RSS connector, 
you can create automated tasks and workflows for any RSS feed, 
for example:

* Monitor when RSS feed items are published.
* List all RSS feed items.

RSS (Rich Site Summary), also called Really Simple Syndication, 
is a popular format for web syndication and is used for publishing 
frequently updated content, such as blog posts and news headlines. 
Many content publishers provide an RSS feed so users can subscribe to that content. 

You can use an RSS trigger that gets responses from an RSS feed 
and makes the output available to other actions. You can use an 
RSS action in your logic apps to perform a task with the RSS feed. 
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* The URL for an RSS feed

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access an RSS feed. 
To start with an RSS trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use an RSS action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to an RSS feed

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

   * For blank logic apps, in the search box, 
   enter "rss" as your filter. Under the triggers list, 
   select the trigger you want. 

     -or-

   * For existing logic apps, under the step where you want 
   to add an action, choose **New step**. In the search box, 
   enter "rss" as your filter. Under the actions list, 
   select the action you want.

1. Provide the necessary details for your selected trigger or 
action and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/rss/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)