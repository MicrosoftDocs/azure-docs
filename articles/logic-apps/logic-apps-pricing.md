---
title: Pricing & billing - Azure Logic Apps | Microsoft Docs
description: Learn how pricing and billing works for Azure Logic Apps
services: logic-apps
author: kevinlam1
manager: jeconnoc
editor: 
documentationcenter: 

ms.assetid: f8f528f5-51c5-4006-b571-54ef74532f32
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 05/11/2018
ms.author: klam
---

# Logic Apps pricing model

You can create and run automated scalable integration workflows in the cloud with Azure Logic Apps. 
Here are the details about how billing and pricing work for Logic Apps. 

## Consumption pricing model

With newly created logic apps, you pay only for what you use. 
New logic apps use a consumption plan and pricing model, 
which means that all the action executions performed by a logic app instance are metered. 
Every step in a logic app definition is an action, which includes triggers, 
control flow steps, calls to built-in actions, and calls to connectors. 
For more information, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="triggers"></a>

## Triggers

Triggers are special actions that create a logic app instance when a specific event happens. 
Triggers act in different ways, which affect how the logic app is metered.

* **Polling trigger** – This trigger continually checks an endpoint for messages 
that satisfy the criteria for creating a logic app instance and starting the workflow. 
Each polling request counts as an execution and is metered, even when no logic app instance is created. 
To specify the polling interval, set up the trigger through the Logic App Designer.

  [!INCLUDE [logic-apps-polling-trigger-non-standard-metering](../../includes/logic-apps-polling-trigger-non-standard-metering.md)]

* **Webhook trigger** – This trigger waits for a client to send a request to a specific endpoint. 
Each request sent to the webhook endpoint counts as an action execution. 
For example, the Request and HTTP Webhook trigger are both webhook triggers.

* **Recurrence trigger** – This trigger creates a logic app instance based 
on the recurrence interval that you set up in the trigger. 
For example, you can set up a recurrence trigger that runs every three days or on a more complex schedule.

You can find trigger executions in your logic app's Overview pane 
under the Trigger History section.

## Actions

Built-in actions, such as actions that call HTTP, Azure Functions, or API Management, 
and also control flow steps are metered as native actions, which have their respective types. 
Actions that call [connectors](https://docs.microsoft.com/connectors) have the "ApiConnection" type. 
These connectors are classified as standard or enterprise connectors, 
which are metered based on their respective [pricing][pricing]. 

All successfully and unsuccessfully run actions are counted and metered as action executions. 
However, actions that are skipped, due to unmet conditions, or actions that don't run, 
because the logic app terminated before completion, don't count as action executions. 
Disabled logic apps can't instantiate new instances, so they aren't charged while they are disabled.

> [!NOTE]
> After you disable a logic app, any currently running instances 
> might take some time before they completely stop.

Actions that run inside loops are counted per each cycle in the loop. 
For example, a single action in a "for each" loop that processes a 
10-item list is counted by multiplying the number of list items (10) 
by the number of actions in the loop (1) plus one for starting the loop. 
So, for this example, the calculation is (10 * 1) + 1, which results in 11 action executions.

## Integration Account usage

Consumption-based usage includes an 
[integration account](logic-apps-enterprise-integration-create-integration-account.md) 
where you can explore, develop, and test the 
[B2B/EDI](logic-apps-enterprise-integration-b2b.md) and 
[XML processing](logic-apps-enterprise-integration-xml.md) 
features in Logic Apps at no additional cost. You can have one 
integration account per region and store up to specific 
[numbers of artifacts](../logic-apps/logic-apps-limits-and-config.md), 
such as EDI trading partners and agreements, maps, schemas, assemblies, 
certificates, and batch configurations.

Logic Apps also offers basic and standard integration accounts with supported Logic Apps SLA. 
You can use basic integration accounts when you either want to use only message handling, 
or act as a small business partner that has a trading partner relationship with a larger business entity. 
Standard integration accounts support more complex B2B relationships and increase the number 
of entities that you can manage. For more information, see 
[Azure pricing](https://azure.microsoft.com/pricing/details/logic-apps).

## Next steps

* [Learn more about Logic Apps][whatis]
* [Create your first logic app][create]

[pricing]: https://azure.microsoft.com/pricing/details/logic-apps/
[whatis]: logic-apps-overview.md
[create]: quickstart-create-first-logic-app-workflow.md

