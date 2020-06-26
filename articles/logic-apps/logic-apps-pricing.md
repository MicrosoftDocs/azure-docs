---
title: Pricing & billing model
description: Overview about how the pricing and billing model works for Azure Logic Apps
services: logic-apps
ms.suite: integration
author: jonfancey
ms.author: jonfan
ms.reviewer: estfan, logicappspm
ms.topic: conceptual
ms.date: 06/25/2020
---

# Pricing model for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how billing and pricing work for Azure Logic Apps. For pricing rates, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps).

<a name="consumption-pricing"></a>

## Consumption pricing model

For new logic apps that run in the public, "global", multi-tenant Azure Logic Apps service, you pay only for what you use. These logic apps use a consumption-based plan and pricing model. In your logic app, each step is an action, and Azure Logic Apps meters all the actions that run in your logic app.

For example, actions include:

* [Triggers](#triggers), which are special actions. All logic apps require a trigger as the first step.

* ["Built-in" or native actions](../connectors/apis-list.md#built-in) such as HTTP, calls to Azure Functions and API Management, and so on

* Calls to [managed connectors](../connectors/apis-list.md#managed-connectors) such as Outlook 365, Dropbox, and so on

* [Control workflow actions](../connectors/apis-list.md#control-workflow) such as loops, conditional statements, and so on

[Standard connectors](../connectors/apis-list.md#managed-connectors) are charged at the [Standard connector price](https://azure.microsoft.com/pricing/details/logic-apps). Generally available [Enterprise connectors](../connectors/apis-list.md#managed-connectors) are charged at the [Enterprise connector price](https://azure.microsoft.com/pricing/details/logic-apps), while public preview Enterprise connectors are charged at the [Standard connector price](https://azure.microsoft.com/pricing/details/logic-apps).

Learn more about how billing works at the [triggers](#triggers) and [actions](#actions) levels. Or, for information about limits, see [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md).

<a name="fixed-pricing"></a>

## Fixed pricing model

An [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) provides an isolated way for you to create and run logic apps that can access resources in an Azure virtual network. Logic apps that run in an ISE don't incur data retention costs. When you create an ISE, and only during creation, you can choose an [ISE level or "SKU"](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level), which have different [pricing rates](https://azure.microsoft.com/pricing/details/logic-apps):

* **Premium** ISE: This SKU's base unit has fixed capacity, but if you need more throughput, you can [add more scale units](../logic-apps/ise-manage-integration-service-environment.md#add-capacity) during ISE creation or afterwards. For ISE limits, see [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise).

* **Developer** ISE: This SKU has no capability for scaling up, no service-level agreement (SLA), and no published limits. Use this SKU only for experimenting, development, and testing, not production or performance testing.

For logic apps that you create and run in an ISE, you pay a [fixed monthly price](https://azure.microsoft.com/pricing/details/logic-apps) for these capabilities:

* [Built-in](../connectors/apis-list.md#built-in) triggers and actions

  Within an ISE, built-in triggers and actions display the **Core** label and run in the same ISE as your logic apps.

* [Standard](../connectors/apis-list.md#managed-connectors) connectors and [Enterprise](../connectors/apis-list.md#enterprise-connectors) connectors, which let you have as many Enterprise connections as you want

   Standard and Enterprise connectors that display the **ISE** label run in the same ISE as your logic apps. Connectors that don't display the ISE label run in the public, "global", multi-tenant Logic Apps service. Fixed monthly pricing also applies to connectors that run in the multi-tenant service when you use them with logic apps that run in an ISE.

* [Integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) usage at no additional cost, based on your [ISE SKU](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level):

  * **Premium** ISE SKU: A single [Standard tier](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account

  * **Developer** ISE SKU: A single [Free tier](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account

  Each ISE SKU is limited to 5 total integration accounts. For an additional cost, you can have more integration accounts, based on your ISE SKU:

  * **Premium** ISE SKU: Up to four more Standard accounts. No Free or Basic accounts.

  * **Developer** ISE SKU: Either up to 4 more Standard accounts, or up to 5 total Standard accounts. No Basic accounts.

  For more information about integration account limits, see [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). You can learn more about [integration account tiers and their pricing model](#integration-accounts) later in this topic.

<a name="connectors"></a>

## Connectors

Azure Logic Apps connectors help your logic app access apps, services, and systems in the cloud or on premises by providing [triggers](#triggers), [actions](#actions), or both. Connectors are classified as either Standard or Enterprise. For an overview about these connectors, see [Connectors for Azure Logic Apps](../connectors/apis-list.md). If no prebuilt connectors are available for the REST APIs that you want to use in your logic apps, you can create [custom connectors](https://docs.microsoft.com/connectors/custom-connectors), which are just wrappers around those REST APIs. Custom connectors are billed as Standard connectors. The following sections provide more information about how billing for triggers and actions work.

<a name="triggers"></a>

## Triggers

Triggers are special actions that create a logic app instance when a specific event happens. Triggers act in different ways, which affect how the logic app is metered. Here are the various kinds of triggers that exist in Azure Logic Apps:

* **Polling trigger**: This trigger continually checks an endpoint for messages that satisfy the criteria for creating a logic app instance and starting the workflow. Even when no logic app instance gets created, Logic Apps meters each polling request as an execution. To specify the polling interval, set up the trigger through the Logic App Designer.

  [!INCLUDE [logic-apps-polling-trigger-non-standard-metering](../../includes/logic-apps-polling-trigger-non-standard-metering.md)]

* **Webhook trigger**: This trigger waits for a client to send a request to a specific endpoint. Each request sent to the webhook endpoint counts as an action execution. For example, the Request and HTTP Webhook trigger are both webhook triggers.

* **Recurrence trigger**: This trigger creates a logic app instance based on the recurrence interval that you set up in the trigger. For example, you can set up a Recurrence trigger that runs every three days or on a more complex schedule.

<a name="actions"></a>

## Actions

Azure Logic Apps meters "built-in" actions, such as HTTP, as native actions. For example, built-in actions include HTTP calls, calls from Azure Functions or API Management, and control flow steps such as conditions, loops, and switch statements. Each action has their own action type. For example, actions that call [connectors](https://docs.microsoft.com/connectors) have the "ApiConnection" type. These connectors are classified as Standard or Enterprise connectors, which are metered based on their respective [pricing](https://azure.microsoft.com/pricing/details/logic-apps). Enterprise connectors in *Preview* are charged as Standard connectors.

Azure Logic Apps meters all successful and unsuccessful actions as executions. However, Logic Apps doesn't meter these actions:

* Actions that get skipped due to unmet conditions
* Actions that don't run because the logic app stopped before finishing

For actions that run inside loops, Azure Logic Apps counts each action for each cycle in the loop. For example, suppose you have a "for each" loop that processes a list. Logic Apps meters an action in that loop by multiplying the number of list items with the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions.

## Disabled logic apps

Disabled logic apps aren't charged because they can't create new instances while they're disabled. After you disable a logic app, any currently running instances might take some time before they completely stop.

<a name="integration-accounts"></a>

## Integration accounts

A [fixed pricing model](https://azure.microsoft.com/pricing/details/logic-apps) applies to [integration accounts](logic-apps-enterprise-integration-create-integration-account.md) where you can explore, develop, and test the [B2B and EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) features in Azure Logic Apps at no additional cost. Each Azure subscription can have up to a [specific limit of integration accounts](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). Each integration account can store up to specific [limit of artifacts](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits), which include trading partners, agreements, maps, schemas, assemblies, certificates, batch configurations, and so on.

Azure Logic Apps offers Free, Basic, and Standard integration accounts. The Basic and Standard tiers are supported by the Logic Apps service-level agreement (SLA), while the Free tier is not supported by an SLA and has limits on region availability, throughput, and usage. Except for Free tier integration accounts, you can have more than one integration account in each Azure region. For pricing rates, see [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/).

If you have an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), either [Premium or Developer](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level), your ISE can have 5 total integration accounts. To learn how the fixed pricing model works for an ISE, see the previous [Fixed pricing model](#fixed-pricing) section in this topic. For pricing rates, see [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps).

To choose between a Free, Basic, or Standard integration account, review these use case descriptions:

* **Free**: For when you want to try exploratory scenarios, not production scenarios. This tier is available only for public regions in Azure, for example, West US or Southeast Asia, but not for [Azure China 21Vianet](https://docs.microsoft.com/azure/china/overview-operations) or [Azure Government](../azure-government/documentation-government-welcome.md).

* **Basic**: For when you want only message handling or to act as a small business partner that has a trading partner relationship with a larger business entity

* **Standard**: For when you have more complex B2B relationships and increased numbers of entities that you must manage

<a name="data-retention"></a>

## Data retention

Except for logic apps that run in an integration service environment (ISE), all the inputs and outputs that are stored in your logic app's run history get billed based on a logic app's [run retention period](logic-apps-limits-and-config.md#run-duration-retention-limits). Logic apps that run in an ISE don't incur data retention costs. For pricing rates, see [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps).

To help you monitor your logic app's storage consumption, you can:

* View the number of storage units in GB that your logic app uses monthly.
* View the sizes for a specific action's inputs and outputs in your logic app's run history.

<a name="storage-consumption"></a>

### View logic app storage consumption

1. In the Azure portal, find and open your logic app.

1. From your logic app's menu, under **Monitoring**, select **Metrics**.

1. In the right-hand pane, under **Chart Title**, from the **Metric** list, select **Billing Usage for Storage Consumption Executions**.

   This metric gives you the number of storage consumption units in GB per month that are getting billed.

<a name="input-output-sizes"></a>

### View action input and output sizes

1. In the Azure portal, find and open your logic app.

1. On your logic app's menu, select **Overview**.

1. In the right-hand pane, under **Runs history**, select the run that has the inputs and outputs you want to check.

1. Under **Logic app run**, choose **Run Details**.

1. In the **Logic app run details** pane, in the actions table, which lists each action's status and duration, select the action you want to view.

1. In the **Logic app action** pane, find the sizes for that action's inputs and outputs appear respectively under **Inputs link** and **Outputs link**.

## Next steps

* [Learn more about Azure Logic Apps](logic-apps-overview.md)
* [Create your first logic app](quickstart-create-first-logic-app-workflow.md)
