---
title: Pricing & billing - Azure Logic Apps | Microsoft Docs
description: Learn how pricing and billing works for Azure Logic Apps.
author: kevinlam1
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''
ms.assetid: f8f528f5-51c5-4006-b571-54ef74532f32
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: LADocs; klam
---
# Logic Apps pricing model
You can create and run automated scalable integration workflows in the cloud with Azure Logic Apps.  Here are the details about how billing and pricing work for Logic Apps.
## Consumption pricing model
With newly created logic apps, you pay only for what you use. New logic apps use a consumption plan and pricing model, which means that all executions performed by a logic app instance are metered.
### What are action executions?
Every step in a logic app definition is an action, which includes triggers, control flow steps, calls to built-in actions, and calls to connectors.
### Triggers
Triggers are special actions that create a logic app instance when a specific event happens.  Triggers have several different behaviors, which affect how the logic app is metered.
* **Polling trigger** – This trigger continually checks an endpoint until it gets a message that satisfies the criteria for creating a logic app instance to start the workflow.  You can set up the polling interval in the trigger through the Logic App Designer.  Each polling request counts as an execution, even when no logic app instance is created.
* **Webhook trigger** – This trigger waits for a client to send a request to a specific endpoint.  Each request sent to the webhook endpoint counts as an action execution. For example, the Request and HTTP Webhook trigger are both webhook triggers.
* **Recurrence trigger** – This trigger creates a logic app instance based on the recurrence interval that you set up in the trigger.  For example, you can set up a recurrence trigger that runs every three days or on a more complex schedule.

You can find trigger executions in your Logic Apps Overview pane under the Trigger History section.

### Actions
Built-in actions, for example, actions that call HTTP, Azure Functions, or API Management, as well as control flow steps, are metered as native actions and have their respective types. Actions that call [connectors](https://docs.microsoft.com/connectors) have the "ApiConnection" type.  Connectors are classified as either standard or enterprise connectors, and are metered at their respective [pricing].
All successfully and unsuccessfully run actions are counted and metered as action executions.  However, actions that are skipped, due to unmet conditions, or actions that don’t run, because the logic app terminated before completion, don't count as action executions. Disabled logic apps can't instantiate new instances, so they are't charged while they are disabled. 
> [!NOTE]
> After you disable a logic app, its currently running instances might take a little time before they completely stopped.

Actions that run inside loops are counted per each cycle in the loop.  For example, a single action in a "for each" loop that processes a 10-item list is counted by multiplying the number of list items (10) by the number of actions in the loop (1) plus one for starting the loop. So, for this example, the calculation is (10 * 1) + 1, which results in 11 action executions.

### Integration Account Usage
Consumption-based usage includes an [integration account](logic-apps-enterprise-integration-create-integration-account.md) where you can explore, develop, and test the [B2B/EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) features of Logic Apps at no additional cost. You can have one of these integration accounts per region and store up to 10 Agreements and 25 maps. You can have and upload unlimited partners, schemas, and certificates.

Logic Apps also offers basic and standard integration accounts with supported Logic Apps SLA. You can use basic integration accounts when you either, want to use only message handling, or act as a small business partner that has a trading partner relationship with a larger business entity. Standard integration accounts support more complex B2B relationships and increase the number of entities that you can manage. For more information, see [Azure pricing](https://azure.microsoft.com/pricing/details/logic-apps).

## Pricing
For more information, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

## Next steps
* [An overview of Logic Apps][whatis]
* [Create your first logic app][create]

[pricing]: https://azure.microsoft.com/pricing/details/logic-apps/
[whatis]: logic-apps-what-are-logic-apps.md
[create]: logic-apps-create-a-logic-app.md

