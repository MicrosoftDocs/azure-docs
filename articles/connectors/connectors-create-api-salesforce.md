---
title: Connect to Salesforce from Azure Logic Apps | Microsoft Docs
description: Automate tasks and workflows that monitor, create, and manage Salesforce records and jobs by using Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.assetid: 54fe5af8-7d2a-4da8-94e7-15d029e029bf
ms.topic: article
tags: connectors
ms.date: 08/24/2018
---

# Monitor, create, and manage Salesforce resources by using Azure Logic Apps

With Azure Logic Apps and the Salesforce connector, 
you can create automated tasks and workflows for your 
Salesforce resources, such as records, jobs, and objects, 
for example:

* Monitor when records are created or changed. 
* Create, get, and manage jobs and records, 
including insert, update, and delete actions.

You can use Salesforce triggers that get responses from Salesforce 
and make the output available to other actions. You can use actions 
in your logic apps to perform tasks with Salesforce resources. 
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* A [Salesforce account](https://salesforce.com/)

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Salesforce account. 
To start with a Salesforce trigger, [create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
To use a Salesforce action, start your logic app with another trigger, 
for example, the **Recurrence** trigger.

## Connect to Salesforce

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

   * For blank logic apps, in the search box, 
   enter "salesforce" as your filter. 
   Under the triggers list, select the trigger you want. 

     -or-

   * For existing logic apps, under the step where you want 
   to add an action, choose **New step**. In the search box, 
   enter "salesforce" as your filter. Under the actions list, 
   select the action you want.

1. If you're prompted to sign in to Salesforce, sign in now 
and allow access.

   Your credentials authorize your logic app to create 
   a connection to Salesforce and access your data.

1. Provide the necessary details for your selected trigger or 
action and continue building your logic app's workflow.

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/salesforce/).

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)