---
title: Connect to Yammer from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor, post, and manage messages, feeds, and more in Yammer by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: b5ae0827-fbb3-45ec-8f45-ad1cc2e7eccc
ms.topic: article
tags: connectors
ms.date: 08/25/2018
---

# Monitor and manage your Yammer account by using Azure Logic Apps

With Azure Logic Apps and the Yammer connector, 
you can create automated tasks and workflows that 
monitor and manage messages, feeds, and more 
in your Yammer account, along with other actions, for example:

* Monitor when new messages appear in followed feeds and groups.
* Get messages, groups, networks, users' details, and more.
* Post and like messages.

You can use triggers that get responses from your Yammer account and 
make the output available to other actions. You can use actions that 
perform tasks with your Yammer account. You can also have other actions 
use the output from Yammer actions. For example, when new messages appear 
in feeds or groups, you can share those messages with the Slack connector. 
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your Yammer account and user credentials

   Your credentials authorize your logic app to create 
   a connection and access your Yammer account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Yammer account. 
To start with a Yammer trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use a Yammer action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to Yammer

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

   * For blank logic apps, in the search box, 
   enter "yammer" as your filter. 
   Under the triggers list, select the trigger you want. 

     -or-

   * For existing logic apps: 
   
     * Under the last step where you want to add an action, 
     choose **New step**. 

       -or-

     * Between the steps where you want to add an action, 
     move your pointer over the arrow between steps. 
     Choose the plus sign (**+**) that appears, 
     and then select **Add an action**.
     
       In the search box, enter "yammer" as your filter. 
       Under the actions list, select the action you want.

1. If you're prompted to sign in to Yammer, sign in now 
sign in now so you can allow access.

1. Provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/yammer/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)