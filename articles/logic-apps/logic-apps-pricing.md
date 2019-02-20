---
title: Pricing & billing - Azure Logic Apps | Microsoft Docs
description: Learn how pricing and billing works for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: logic-apps
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
manager: carmonm
ms.assetid: f8f528f5-51c5-4006-b571-54ef74532f32
ms.topic: article
ms.date: 10/16/2018
---

# Pricing model for Azure Logic Apps

You can create and run automated integration workflows that 
can scale in the cloud when you use Azure Logic Apps. 
Here are the details about how billing and pricing work for Logic Apps. 

<a name="consumption-pricing"></a>

## Consumption pricing model

For new logic apps that run in the public or "global" Logic 
Apps service, you pay only for what you use. These logic apps 
use a consumption-based plan and pricing model. In your logic app 
definition, each step is an action. Actions include the trigger, 
any control flow steps, built-in actions, and connector calls. 
Logic Apps meters all actions that run in your logic app.  
For more information, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="fixed-pricing"></a>

## Fixed pricing model

For new logic apps that run inside an 
[*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), 
you pay a fixed monthly price for built-in actions and 
standard ISE-labeled connectors. An ISE provides a way 
for you to create and run isolated logic apps that can 
access resources in an Azure virtual network.  

Your ISE includes one free Enterprise connector, which includes 
as many connections as you want. Usage for additional Enterprise 
connectors are charged based on the Enterprise consumption price. 

> [!NOTE]
> The integration service environment is in *private preview*. 
> To request access, [create your request to join here](https://aka.ms/iseprivatepreview). 
> For more information, see 
> [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="triggers"></a>

## Triggers

Triggers are special actions that create a logic app instance when a specific event happens. 
Triggers act in different ways, which affect how the logic app is metered.

* **Polling trigger** – This trigger continually checks an endpoint for messages 
that satisfy the criteria for creating a logic app instance and starting the workflow. 
Even when no logic app instance gets created, Logic Apps meters each polling request as an execution. 
To specify the polling interval, set up the trigger through the Logic App Designer.

  [!INCLUDE [logic-apps-polling-trigger-non-standard-metering](../../includes/logic-apps-polling-trigger-non-standard-metering.md)]

* **Webhook trigger** – This trigger waits for a client to send a request to a specific endpoint. 
Each request sent to the webhook endpoint counts as an action execution. 
For example, the Request and HTTP Webhook trigger are both webhook triggers.

* **Recurrence trigger** – This trigger creates a logic app instance based 
on the recurrence interval that you set up in the trigger. 
For example, you can set up a recurrence trigger that runs every three days or on a more complex schedule.

## Actions

Logic Apps meters built-in actions as native actions. For example, 
built-in actions include calls over HTTP, calls from Azure Functions 
or API Management, and control flow steps such as loops and conditions 
- each with their own action type. Actions that call 
[connectors](https://docs.microsoft.com/connectors) have the "ApiConnection" type. 
These connectors are classified as standard or enterprise connectors, 
which are metered based on their respective [pricing][pricing]. 
Enterprise connectors in *Preview* are charged as standard connectors.

Logic Apps meters all successfully and unsuccessfully run actions as action executions. 
Logic Apps doesn't meter these actions: 

* Actions that get skipped due to unmet conditions
* Actions that don't run because the logic app stopped before finishing

Disabled logic apps aren't charged while disabled 
because they can't create new instances.

> [!NOTE]
> After you disable a logic app, any currently running instances 
> might take some time before they completely stop.

For actions that run inside loops, Logic Apps counts each action per cycle in the loop. 
For example, suppose you have a "for each" loop that processes a list. 
Logic Apps meters an action in that loop by multiplying the number of list items 
with the number of actions in the loop, and adds the action that starts the loop. 
The calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions.

## Integration Account usage

Consumption-based usage applies to 
[integration accounts](logic-apps-enterprise-integration-create-integration-account.md) 
where you can explore, develop, and test the 
[B2B/EDI](logic-apps-enterprise-integration-b2b.md) and 
[XML processing](logic-apps-enterprise-integration-xml.md) 
features in Logic Apps at no additional cost. You can have 
one integration account per region. Each integration account 
can store up to specific [numbers of artifacts](../logic-apps/logic-apps-limits-and-config.md), 
which include trading partners, agreements, maps, schemas, 
assemblies, certificates, batch configurations, and so on.

Logic Apps also offers basic and standard integration accounts with supported Logic Apps SLA. 
You can use basic integration accounts when you just want message handling or act as a small 
business partner that has a trading partner relationship with a larger business entity. 
Standard integration accounts support more complex B2B relationships and increase the 
number of entities you can manage. For more information, see 
[Azure pricing](https://azure.microsoft.com/pricing/details/logic-apps).

## Next steps

* [Learn more about Logic Apps][whatis]
* [Create your first logic app][create]

[pricing]: https://azure.microsoft.com/pricing/details/logic-apps/
[whatis]: logic-apps-overview.md
[create]: quickstart-create-first-logic-app-workflow.md

