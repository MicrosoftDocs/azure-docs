---
title: Connect to Trello from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor and manage lists, boards, and cards in your Trello projects by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: fe7a4377-5c24-4f72-ab1a-6d9d23e8d895
ms.topic: article
tags: connectors
ms.date: 08/25/2018
---


# Monitor and manage Trello with Azure Logic Apps

With Azure Logic Apps and the Trello connector, 
you can create automated tasks and workflows that monitor 
and manage your Trello lists, cards, boards, team members, 
and so on, for example:

* Monitor when new cards are added to boards and lists. 
* Create, get, and manage boards, cards, and lists.
* Add comments and members to cards.
* List boards, board labels, cards on boards, card comments, 
card members, team members, and teams where you're a member. 
* Get teams.

You can use triggers that get responses from your Trello account 
and make the output available to other actions. You can use actions 
that perform tasks with your Trello account. You can also have 
other actions use the output from Trello actions. For example, 
when a new card is added to board or list, you can send 
messages with the Slack connector. If you're new to logic apps, 
review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* Your Trello account and user credentials

  Your credentials authorize your logic app to create 
  a connection and access your Trello account.

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Trello account. 
To start with a Trello trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use a Trello action, start your logic app with a trigger, 
for example, the **Recurrence** trigger.

## Connect to Trello

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, in the search box, 
enter "trello" as your filter. Under the triggers list, 
select the trigger you want. 

   -or-

   For existing logic apps, under the last step where 
   you want to add an action, choose **New step**. 
   In the search box, enter "trello" as your filter. 
   Under the actions list, select the action you want.

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. If you're prompted to sign in to Trello, 
authorize access for your logic app and sign in.

1. Provide the necessary details for your selected trigger 
or action and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/trello/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)