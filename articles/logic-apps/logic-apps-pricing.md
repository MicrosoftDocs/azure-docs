---
title: Billing & pricing models
description: Overview about how pricing and billing models work in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, azla
ms.topic: conceptual
ms.date: 03/24/2021
---

# Pricing and billing models for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how billing and pricing models work for the Logic Apps service and related resources. For specific pricing rates, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps). To learn how you can plan, manage, and monitor costs, see [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md).

<a name="consumption-pricing"></a>

## Multi-tenant pricing

A pay-for-use consumption pricing model applies to logic apps that run in the public, "global", multi-tenant Logic Apps service. All successful and unsuccessful runs are metered and billed.

For example, a request that a polling trigger makes is still metered as an execution even if that trigger is skipped, and no logic app workflow instance is created.

| Items | Description |
|-------|-------------|
| [Built-in](../connectors/built-in.md) triggers and actions | Run natively in the Logic Apps service and are metered using the [**Actions** price](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>For example, the HTTP trigger and Request trigger are built-in triggers, while the HTTP action and Response action are built-in actions. Data operations, batch operations, variable operations, and [workflow control actions](../connectors/built-in.md), such as loops, conditions, switch, parallel branches, and so on, are also built-in actions. |
| [Standard connector](../connectors/managed.md) triggers and actions <p><p>[Custom connector](../connectors/apis-list.md#custom-apis-and-connectors) triggers and actions | Metered using the [Standard connector price](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [Enterprise connector](../connectors/managed.md) triggers and actions | Metered using the [Enterprise connector price](https://azure.microsoft.com/pricing/details/logic-apps/). However, during public preview, Enterprise connectors are metered using the [*Standard* connector price](https://azure.microsoft.com/pricing/details/logic-apps/). |
| Actions inside [loops](logic-apps-control-flow-loops.md) | Each action that runs in a loop is metered for each loop cycle that runs. <p><p>For example, suppose that you have a "for each" loop that includes actions that process a list. The Logic Apps service meters each action that runs in that loop by multiplying the number of list items with the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| Retry attempts | To handle the most basic exceptions and errors, you can set up a [retry policy](logic-apps-exception-handling.md#retry-policies) on triggers and actions where supported. These retries along with the original request are charged at rates based on whether the trigger or action has built-in, Standard, or Enterprise type. For example, an action that executes with 2 retries is charged for 3 action executions. |
| [Data retention and storage consumption](#data-retention) | Metered using the data retention price, which you can find on the [Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/), under the **Pricing details** table. |
|||

For more information, see the following:

* [View metrics for executions and storage consumption](plan-manage-costs.md#monitor-billing-metrics)
* [Limits in Azure Logic Apps](logic-apps-limits-and-config.md)

### Not metered

* Triggers that are skipped due to unmet conditions
* Actions that didn't run because the logic app stopped before finishing
* [Disabled logic apps](#disabled-apps)

### Other related resources

Logic apps work with other related resources, such as integration accounts, on-premises data gateways, and integration service environments (ISEs). To learn about pricing for those resources, review these sections later in this topic:

* [On-premises data gateway](#data-gateway)
* [Integration account pricing model](#integration-accounts)
* [ISE pricing model](#fixed-pricing)

### Tips for estimating consumption costs

To help you estimate more accurate consumption costs, review these tips:

* Consider the possible number of messages or events that might arrive on any given day, rather than base your calculations on only the polling interval.

* When an event or message meets the trigger criteria, many triggers immediately try to read any and all other waiting events or messages that meet the criteria. This behavior means that even when you select a longer polling interval, the trigger fires based on the number of waiting events or messages that qualify for starting workflows. Triggers that follow this behavior include Azure Service Bus and Azure Event Hub.

  For example, suppose you set up trigger that checks an endpoint every day. When the trigger checks the endpoint and finds 15 events that meet the criteria, the trigger fires and runs the corresponding workflow 15 times. The Logic Apps service meters all the actions that those 15 workflows perform, including the trigger requests.

<a name="fixed-pricing"></a>

## ISE pricing

A fixed pricing model applies to logic apps that run in an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is billed using the [Integration Service Environment price](https://azure.microsoft.com/pricing/details/logic-apps), which depends on the [ISE level or *SKU*](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level) that you create. This pricing differs from multi-tenant pricing as you're paying for reserved capacity and dedicated resources whether or not you use them.

| ISE SKU | Description |
|---------|-------------|
| **Premium** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Premium SKU](https://azure.microsoft.com/pricing/details/logic-apps). If you need more throughput, you can [add more scale units](../logic-apps/ise-manage-integration-service-environment.md#add-capacity) when you create your ISE or afterwards. Each scale unit is billed at an [hourly rate that's roughly half the base unit rate](https://azure.microsoft.com/pricing/details/logic-apps). <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| **Developer** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Developer SKU](https://azure.microsoft.com/pricing/details/logic-apps). However, this SKU has no service-level agreement (SLA), scale up capability, or redundancy during recycling, which means that you might experience delays or downtime. Backend updates might intermittently interrupt service. <p><p>**Important**: Make sure that you use this SKU only for exploration, experiments, development, and testing - not for production or performance testing. <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
|||

### Included at no extra cost

| Items | Description |
|-------|-------------|
| [Built-in](../connectors/built-in.md) triggers and actions | Display the **Core** label and run in the same ISE as your logic apps. |
| [Standard connectors](../connectors/managed.md) <p><p>[Enterprise connectors](../connectors/managed.md#enterprise-connectors) | - Managed connectors that display the **ISE** label are specially designed to work without the on-premises data gateway and run in the same ISE as your logic apps. ISE pricing includes as many Enterprise connections as you want. <p><p>- Connectors that don't display the ISE label run in the multi-tenant Logic Apps service. However, ISE pricing includes these executions for logic apps that run in an ISE. |
| Actions inside [loops](logic-apps-control-flow-loops.md) | ISE pricing includes each action that runs in a loop for each loop cycle that runs. <p><p>For example, suppose that you have a "for each" loop that includes actions that process a list. To get the total number of action executions, multiply the number of list items with the number of actions in the loop, and add the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| Retry attempts | To handle the most basic exceptions and errors, you can set up a [retry policy](logic-apps-exception-handling.md#retry-policies) on triggers and actions where supported. ISE pricing includes retries along with the original request. |
| [Data retention and storage consumption](#data-retention) | Logic apps in an ISE don't incur retention and storage costs. |
| [Integration accounts](#integration-accounts) | Includes usage for a single integration account tier, based on ISE SKU, at no extra cost. |
|||

For limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise).

<a name="integration-accounts"></a>

## Integration accounts

An [integration account](../logic-apps/logic-apps-pricing.md#integration-accounts) is a separate resource that you create and link to logic apps so that you can explore, build, and test B2B integration solutions that use [EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) capabilities.

Azure Logic Apps offers these integration account levels or tiers that [vary in pricing](https://azure.microsoft.com/pricing/details/logic-apps/) and [billing model](logic-apps-pricing.md#integration-accounts), based on whether your logic apps are consumption-based or ISE-based:

| Tier | Description |
|------|-------------|
| **Basic** | For scenarios where you want only message handling or to act as a small business partner that has a trading partner relationship with a larger business entity. <p><p>Supported by the Logic Apps SLA. |
| **Standard** | For scenarios where you have more complex B2B relationships and increased numbers of entities that you must manage. <p><p>Supported by the Logic Apps SLA. |
| **Free** | For exploratory scenarios, not production scenarios. This tier has limits on region availability, throughput, and usage. For example, the Free tier is available only for public regions in Azure, for example, West US or Southeast Asia, but not for [Azure China 21Vianet](/azure/china/overview-operations) or [Azure Government](../azure-government/documentation-government-welcome.md). <p><p>**Note**: Not supported by the Logic Apps SLA. |
|||

For information about integration account limits, see [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits), such as:

* [Limits on integration accounts per Azure subscription](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits)

* [Limits on various artifacts per integration account](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits). Artifacts include trading partners, agreements, maps, schemas, assemblies, certificates, batch configurations, and so on.

### Integration accounts for consumption-based logic apps

Integration accounts are billed using a fixed [integration account price](https://azure.microsoft.com/pricing/details/logic-apps/) that is based on the account tier that you use.

### ISE-based logic apps

At no extra cost, your ISE includes a single integration account, based on your ISE SKU. For an extra cost, you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). Learn more about the [ISE pricing model](#fixed-pricing) earlier in this topic.

| ISE SKU | Included integration account | Additional cost |
|---------|------------------------------|-----------------|
| **Premium** | A single [Standard](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts. No Free or Basic accounts are permitted. |
| **Developer** | A single [Free](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts if you already have a Free account, or 20 total Standard accounts if you don't have a Free account. No Basic accounts are permitted. |
||||

<a name="data-retention"></a>

## Data retention and storage consumption

All the inputs and outputs in your logic app's run history are stored and metered based on that app's [run duration and history retention period](logic-apps-limits-and-config.md#run-duration-retention-limits).

* For logic apps in the multi-tenant Logic Apps service, storage consumption is billed at a fixed price, which you can find on the [Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps), under the **Pricing details** table.

* For logic apps in ISEs, storage consumption doesn't incur data retention costs.

To monitor storage consumption usage, see [View metrics for executions and storage consumption](plan-manage-costs.md#monitor-billing-metrics).

<a name="data-gateway"></a>

## On-premises data gateway

An [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) is a separate resource that you create so that your logic apps can access on-premises data by using specific gateway-supported connectors. Connectors operations that run through the gateway incur charges, but the gateway itself doesn't incur charges.

<a name="disabled-apps"></a>

## Disabled logic apps

Disabled logic apps aren't charged because they can't create new instances while they're disabled. After you disable a logic app, any currently running instances might take some time before they completely stop.

## Next steps

* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)
