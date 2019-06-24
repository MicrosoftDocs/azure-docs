---
title: Pricing & billing - Azure Logic Apps | Microsoft Docs
description: Learn how pricing and billing works for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: logic-apps
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
ms.assetid: f8f528f5-51c5-4006-b571-54ef74532f32
ms.topic: article
ms.date: 05/22/2019
---

# Pricing model for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create 
and run automated integration workflows that can scale in the cloud. 
This article describes how billing and pricing work for Azure Logic Apps. 
For specific pricing information, see [Azure Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="consumption-pricing"></a>

## Consumption pricing model

For new logic apps that run in the public or "global" 
Azure Logic Apps service, you pay only for what you use. 
These logic apps use a consumption-based plan and pricing model. 
In your logic app definition, each step is an action. For example, actions include:

* Triggers, which are special actions. 
All logic apps require a trigger as the first step.
* "Built-in" or native actions such as HTTP, 
calls to Azure Functions and API Management, and so on
* Calls to connectors such as Outlook 365, Dropbox, and so on
* Control flow steps, such as loops, conditional statements, and so on

Azure Logic Apps meters all the actions that run in your logic app. 
Learn more about how billing works for [triggers](#triggers) and [actions](#actions).

<a name="fixed-pricing"></a>

## Fixed pricing model

An [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) provides a private, isolated, and dedicated way for you to create and run logic apps that can access resources in an Azure virtual network. For new logic apps that run inside an ISE, you pay a [fixed monthly price](https://azure.microsoft.com/pricing/details/logic-apps) for built-in actions and triggers and also for Standard connectors.

Your ISE also includes one free Enterprise connector, which includes as many *connections* as you want. Usage for additional Enterprise connectors is charged based on the [Enterprise consumption price](https://azure.microsoft.com/pricing/details/logic-apps). Only generally available Enterprise connectors are charged at the Enterprise consumption price. Public preview Enterprise connectors are charged at the [Standard connector rate](https://azure.microsoft.com/pricing/details/logic-apps).

> [!NOTE]
> Within an ISE, built-in triggers and actions display the 
> **Core** label and run in the same ISE as your logic apps. 
> Standard and Enterprise connectors that display the **ISE** 
> label run in the same ISE as your logic apps. Connectors 
> that don't display the ISE label run in the global Logic Apps service.

Your ISE base unit has fixed capacity, so if you need more throughput, 
you can [add more scale units](../logic-apps/connect-virtual-network-vnet-isolated-environment.md#add-capacity), 
either during creation or afterwards. Logic apps that run in an ISE 
don't incur data retention costs.

For specific pricing information, see 
[Azure Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="connectors"></a>

## Connectors

Azure Logic Apps connectors help your logic app access apps, services, and systems in the cloud or on premises by providing 
[triggers](#triggers), [actions](#actions), or both. Connectors are classified as either Standard or Enterprise. For an overview about these connectors, see [Connectors for Azure Logic Apps](../connectors/apis-list.md). If no prebuilt connectors are available for the REST APIs that you want to use in your logic apps, you can create [custom connectors](https://docs.microsoft.com/connectors/custom-connectors), which are just wrappers around those REST APIs. Custom connectors are billed as Standard connectors. The following sections provide more information about how billing for triggers and actions work.

<a name="triggers"></a>

## Triggers

Triggers are special actions that create a logic app instance 
when a specific event happens. Triggers act in different ways, 
which affect how the logic app is metered. Here are the various 
kinds of triggers that exist in Azure Logic Apps:

* **Polling trigger**: This trigger continually checks an endpoint 
for messages that satisfy the criteria for creating a logic app 
instance and starting the workflow. Even when no logic app instance 
gets created, Logic Apps meters each polling request as an execution. 
To specify the polling interval, set up the trigger through the Logic App Designer.

  [!INCLUDE [logic-apps-polling-trigger-non-standard-metering](../../includes/logic-apps-polling-trigger-non-standard-metering.md)]

* **Webhook trigger**: This trigger waits for a client to send a request to a 
specific endpoint. Each request sent to the webhook endpoint counts as an action 
execution. For example, the Request and HTTP Webhook trigger are both webhook triggers.

* **Recurrence trigger**: This trigger creates a logic app instance based 
on the recurrence interval that you set up in the trigger. For example, 
you can set up a Recurrence trigger that runs every three days or on a more complex schedule.

<a name="actions"></a>

## Actions

Azure Logic Apps meters "built-in" actions, such as HTTP, as native actions. 
For example, built-in actions include HTTP calls, calls from Azure Functions 
or API Management, and control flow steps such as conditions, loops, and 
switch statements. Each action has their own action type. For example, 
actions that call [connectors](https://docs.microsoft.com/connectors) 
have the "ApiConnection" type. These connectors are classified as 
Standard or Enterprise connectors, which are metered based on their 
respective [pricing](https://azure.microsoft.com/pricing/details/logic-apps). 
Enterprise connectors in *Preview* are charged as Standard connectors.

Azure Logic Apps meters all successful and unsuccessful actions as executions. 
However, Logic Apps doesn't meter these actions:

* Actions that get skipped due to unmet conditions
* Actions that don't run because the logic app stopped before finishing

For actions that run inside loops, Azure Logic Apps counts each action 
for each cycle in the loop. For example, suppose you have a "for each" 
loop that processes a list. Logic Apps meters an action in that loop by 
multiplying the number of list items with the number of actions in the loop, 
and adds the action that starts the loop. So, the calculation for a 10-item 
list is (10 * 1) + 1, which results in 11 action executions.

## Disabled logic apps

Disabled logic apps aren't charged because they 
can't create new instances while they're disabled.
After you disable a logic app, any currently running 
instances might take some time before they completely stop.

## Integration accounts

The fixed pricing model applies to [integration accounts](logic-apps-enterprise-integration-create-integration-account.md) 
where you can explore, develop, and test the 
[B2B and EDI](logic-apps-enterprise-integration-b2b.md) 
and [XML processing](logic-apps-enterprise-integration-xml.md) 
features in Azure Logic Apps at no additional cost.
You can have one integration account in each Azure region. 
Each integration account can store up to specific 
[numbers of artifacts](../logic-apps/logic-apps-limits-and-config.md), 
which include trading partners, agreements, maps, schemas, 
assemblies, certificates, batch configurations, and so on.

Azure Logic Apps offers Free, Basic, and Standard integration accounts. The Basic and Standard tiers are supported by the Logic Apps service-level agreement (SLA), while the Free tier is not supported by an SLA and has limits on throughput and usage.

To choose between a Free, Basic, or Standard integration account:

* **Free**: For when you want to try exploratory scenarios, not production scenarios.

* **Basic**: For when you want only message handling or to act as a small business partner that has a trading partner relationship with a larger business entity.

* **Standard**: For when you have more complex B2B relationships and increased numbers of entities that you must manage.

For specific pricing information, see 
[Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="data-retention"></a>

## Data retention

Except for logic apps that run in an integration service environment (ISE), all inputs and outputs that are stored in your logic app's run history get billed based on a logic app's [run retention period](logic-apps-limits-and-config.md#run-duration-retention-limits). Logic apps that run in an ISE don't incur data retention costs. For specific pricing information, see [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps).

To help you monitor your logic app's storage consumption, you can:

* View the number of storage units in GB that your logic app uses monthly.
* View the sizes for a specific action's inputs and outputs in your logic app's run history.

<a name="storage-consumption"></a>

### View logic app storage consumption

1. In the Azure portal, find and open your logic app.

1. From your logic app's menu, under **Monitoring**, select **Metrics**.

1. In the right-hand pane, under **Chart Title**, 
from the **Metric** list, select 
**Billing Usage for Storage Consumption Executions**.

   This metric gives you the number of storage consumption 
   units in GB per month that are getting billed.

<a name="input-output-sizes"></a>

### View action input and output sizes

1. In the Azure portal, find and open your logic app.

1. On your logic app's menu, select **Overview**.

1. In the right-hand pane, under **Runs history**, 
select the run that has the inputs and outputs you want to check.

1. Under **Logic app run**, choose **Run Details**.

1. In the **Logic app run details** pane, in the actions 
table, which lists each action's status and duration, 
select the action you want to view.

1. In the **Logic app action** pane, find the sizes for 
that action's inputs and outputs appear respectively 
under **Inputs link** and **Outputs link**.

## Next steps

* [Learn more about Azure Logic Apps](logic-apps-overview.md)
* [Create your first logic app](quickstart-create-first-logic-app-workflow.md)
