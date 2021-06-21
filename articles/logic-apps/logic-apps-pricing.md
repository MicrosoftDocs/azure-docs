---
title: Billing & pricing models
description: Overview about how pricing and billing models work in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/21/2021
---

# Pricing and billing models for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how billing and pricing models work for Azure Logic Apps and related resources. For specific pricing rates, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps). To learn how you can plan, manage, and monitor costs, see [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md).

<a name="consumption-pricing"></a>

## Consumption pricing (multi-tenant)

In multi-tenant Azure Logic Apps, logic app workflows follow the "pay-for-use" **Consumption** pricing and billing model. For example, you create such logic apps when you choose the **Logic App (Consumption)** resource type, use the **Azure Logic Apps (Consumption)** extension in Visual Studio Code, or when you create [automation tasks](create-automation-tasks-azure-resources.md). For more information about creating multi-tenant based logic apps, review [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md).

<a name="consumption-built-in-managed-connector-billing"></a>

### Consumption billing for built-in operations and managed connectors

Metering and billing for triggers and actions in your logic app's workflow are based on *executions*, whether your workflow runs successfully or is even instantiated. For example, suppose your workflow starts with a polling trigger that regularly makes outbound calls to an endpoint. The outbound call is metered and billed as an execution, regardless whether the trigger fires or is skipped, which affects whether a workflow instance is created.

The following list describes billing model-related differences between **Consumption** in the multi-tenant environment and **Standard** in the single-tenant environment:

* In multi-tenant, the designer uses the **Standard** and **Enterprise** labels to identify managed connector operations, while in single-tenant, the designer uses only the combined **Azure** label. However, in both environments, metering and billing use the same **Standard** and **Enterprise** connector prices as described by the Consumption plan.

* In multi--tenant, when an operation uses chunking or pagination and has to make multiple calls per execution, the operation is metered and charged only *per execution*, and *not per call*. In single-tenant, the same operation is metered and charged *per call*, and *not per execution*. This behavior means that such an execution might cost you more when running in single-tenant versus multi-tenant.

  For example, suppose you have an operation that has chunking or pagination enabled. During one execution, the operation has to make 10 calls before getting all the necessary data. In multi-tenant, the operation is metered and charged only for the single execution. In single-tenant, the same execution is metered and charged for each call, so this execution can cost 10 times more.

The following table provides more information about operation types and their billing models:

| Items | Description | Billing model |
|-------|-------------|---------------|
| [Built-in](../connectors/built-in.md) triggers and actions | These operations run natively as part of the Azure Logic Apps runtime and are labeled as **Built-in** in the workflow designer. For example, the HTTP trigger and Request trigger are built-in triggers, while the HTTP action and Response action are built-in actions. Data operations, batch operations, variable operations, and [workflow control actions](../connectors/built-in.md), such as loops, conditions, switch, parallel branches, and so on are also built-in actions. | The Consumption plan *includes a monthly number of built-in executions at no extra charge*. Beyond this number, executions are metered using the [**Actions** price](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Some managed connectors are *also* available as built-in operations. The built-in versions follow the same pricing as other built-in operations, while the managed connector versions follow their respective managed connector pricing. |
| [Standard connector](../connectors/managed.md) triggers and actions <p><p>[Custom connector](../connectors/apis-list.md#custom-apis-and-connectors) triggers and actions | These operations are deployed, hosted, and run separately in Azure and are labeled as **Standard** in the workflow designer. | Executions are metered using the [**Standard** connector price](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [Enterprise connector](../connectors/managed.md) triggers and actions | These operations are deployed, hosted, and run separately in Azure and are labeled as **Enterprise** in the workflow designer. | Executions are metered using the [**Enterprise** connector price](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: If an Enterprise connector is in preview, executions are metered using the [**Standard** connector price](https://azure.microsoft.com/pricing/details/logic-apps/). |
| Actions inside [loops](logic-apps-control-flow-loops.md) | Loops such as **For each** and **Until** include actions that run during each loop cycle. | Each action execution inside the loop is metered every time that the loop cycle runs. If an action processes any items in a collection, such as a list or array, the number of collection items is also used in calculating the cost. <p><p>For example, suppose that you have a **For each** loop that includes actions that process a list. Azure Logic Apps meters each action that runs in that loop by multiplying the number of list items with the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| Retry attempts | To handle the most basic exceptions and errors, you can set up a [retry policy](logic-apps-exception-handling.md#retry-policies) on triggers and actions where supported. These retries along with the original request are charged at rates based on whether the trigger or action has built-in, Standard, or Enterprise type. For example, an action that executes with 2 retries is charged for 3 action executions. |
| [Data retention and storage usage](#data-retention) | These operations are metered using the [data retention price on the Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/), under the **Pricing details** table. |
||||

For more information, review the following documentation:

* [View metrics for executions and storage usage](plan-manage-costs.md#monitor-billing-metrics)
* [Limits in Azure Logic Apps](logic-apps-limits-and-config.md)

### Not metered

* The monthly number of built-in operation executions that are included with the [Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps/)
* Triggers that are skipped due to unmet conditions
* Actions that didn't run because the workflow stopped before completion
* [Disabled logic apps](#disabled-apps)

### Other related resources

Logic apps work with other related resources, such as integration accounts, on-premises data gateways, and integration service environments (ISEs). To learn about pricing for those resources, review these sections later in this topic:

* [On-premises data gateway](#data-gateway)
* [Integration account pricing model](#integration-accounts)
* [ISE pricing model](#fixed-pricing)

### Tips for estimating consumption costs

To help you estimate more accurate consumption costs, review these tips:

* Consider the possible number of messages or events that might arrive on any given day, rather than base your calculations on only the polling interval.

* When an event or message meets the trigger criteria, many triggers immediately try to read any other waiting events or messages that meet the criteria. This behavior means that even when you select a longer polling interval, the trigger fires based on the number of waiting events or messages that qualify for starting workflows. Triggers that follow this behavior include Azure Service Bus and Azure Event Hub.

  For example, suppose you set up trigger that checks an endpoint every day. When the trigger checks the endpoint and finds 15 events that meet the criteria, the trigger fires and runs the corresponding workflow 15 times. The Logic Apps service meters all the actions that those 15 workflows perform, including the trigger requests.

<a name="standard-pricing"></a>

## Standard pricing (single-tenant)

In single-tenant Azure Logic Apps, logic app workflows follow the **Standard** pricing and billing model. For example, you create such logic apps when you use the **Logic App (Standard)** resource type, use the **Azure Logic Apps (Standard)** extension in Visual Studio Code. This model requires that logic apps use a hosting plan and a pricing tier, which determine the pricing to follow for metering and billing.

> [!NOTE]
> For new **Logic App (Standard)** resources, you must currently use the **Workflow Standard** hosting plan. 
> The App Service Plan and App Service Environment aren't available for new logic apps.

For more information about creating single-tenant based logic apps, review [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md).

<a name="standard-pricing-tiers"></a>

### Standard pricing tiers and billing rates

Each pricing tier includes a specific amount of compute, memory, and storage resources. For hourly rates per resource and per region, review the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/). To learn more about how pricing works, this example provides sample estimates for the *East US 2 region*.

* On the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/), select the **East US 2** region to view the hourly rates, or review the following table:

  | Resource | Hourly US$ (East US 2) |
  |----------|------------------------|
  | **Virtual CPU (vCPU)** | $0.192 |
  | **Memory** | $0.0137 per GB |
  |||

* Based on the preceding information, this table shows the estimated monthly rate for each pricing tier and the resources included in that pricing tier:

  | Pricing tier | Monthly US$ (East US 2) | Virtual CPU (vCPU) | Memory (GB) | Storage (GB) |
  |--------------|-------------------------|--------------------|-------------|--------------|
  | **WS1** | $175.20 | 1 | 3.5 | 250 |
  | **WS2** | $350.40 | 2 | 7 | 250 |
  | **WS3** | $700.80 | 4 | 14 | 250 |
  ||||||

* Based on the preceding information, this table lists each resource and the estimated monthly rate if you choose the **WS1** pricing tier:

  | Resource | Amount | Monthly US$ (East US 2) |
  |----------|--------|-------------------------|
  | **Virtual CPU (vCPU)** | 1 | $140.16 |
  | **Memory** | 3.5 GB | $35.04 |
  ||||

<a name="standard-built-in-managed-connector-billing"></a>

### Standard billing for built-in operations and managed connectors

Metering and billing for triggers and actions in your logic app's workflow are based on *executions*, whether your workflow runs successfully or is even instantiated. For example, suppose your workflow starts with a polling trigger that regularly makes outbound calls to an endpoint. The outbound call is metered and billed as an execution, regardless whether the trigger fires or is skipped, which affects whether a workflow instance is created.

The following list describes billing model-related differences between **Standard** in the single-tenant environment and **Consumption** in the multi-tenant environment:

* In single-tenant, the designer uses the **Azure** label to identify managed connector operations, while in multi-tenant, the designer uses the **Standard** and **Enterprise** labels. However, in both environments, metering and billing use the same **Standard** and **Enterprise** connector prices as described by the Consumption pricing plan.

* In single-tenant, when an operation uses chunking or pagination and has to make multiple calls per execution, the operation is metered and charged *per call*, and *not per execution*. In multi-tenant, the same operation is metered and charged *per execution*, and *not per call*. This behavior means that such an execution might cost you more when running in single-tenant versus multi-tenant.

  For example, suppose you have an operation that has chunking or pagination enabled. If the operation has to make 10 calls before getting all the necessary data, that operation is metered and charged only for the single execution. However, in single-tenant, the same execution is metered and charged for each call, so this execution can cost 10 times more.

  For example, suppose you have an operation that has chunking or pagination enabled. During one execution, the operation has to make 10 calls before getting all the necessary data. In multi-tenant, the operation is metered and charged only for the single execution. In single-tenant, the same execution is metered and charged for each call, so this execution can cost 10 times more.

The following table provides more information about operation types and their billing models:

| Items | Description | Billing model |
|-------|-------------|---------------|
| [Built-in](../connectors/built-in.md) triggers and actions | These operations run natively as part of the Azure Logic Apps runtime and are labeled as **Built-in** in the workflow designer. <p><p>For example, the HTTP trigger and Request trigger are built-in triggers, while the HTTP action and Response action are built-in actions. Data operations, batch operations, variable operations, and [workflow control actions](../connectors/built-in.md), such as loops, conditions, switch, parallel branches, and so on are also built-in actions. | The Standard plan *includes built-in executions at no extra charge*. <p><p>**Note**: Some managed connectors are *also* available as built-in operations. The built-in versions don't incur charges, but the managed connector versions still incur charges. |
| [Standard connector](../connectors/managed.md) triggers and actions | These operations are deployed, hosted, and run separately in Azure, but they are labeled only as **Azure** in the workflow designer. | Executions are metered using the same price as the [Standard connector price in the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [Enterprise connector](../connectors/managed.md) triggers and actions | These operations are deployed, hosted, and run separately in Azure, but they are labeled only as **Azure** in the workflow designer. | Executions are metered using the same price as the [Enterprise connector price in the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: If in preview, Enterprise connectors use the [*Standard* connector rate](https://azure.microsoft.com/pricing/details/logic-apps/). |
| Actions inside [loops](logic-apps-control-flow-loops.md) | Loops such as **For each** and **Until** include actions that run during each loop cycle. | Each action execution inside the loop is metered every time that the loop cycle runs. If an action processes any items in a collection, such as a list or array, the number of collection items is also used in calculating the cost. <p><p>For example, suppose that you have a **For each** loop that includes actions that process a list. Azure Logic Apps meters each action that runs in that loop by multiplying the number of list items with the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| Retry attempts | To handle the most basic exceptions and errors, you can set up a [retry policy](logic-apps-exception-handling.md#retry-policies) on triggers and actions where supported. | Metering and billing apply to the number of retries along with the original request based on whether the trigger or action has built-in, Standard, or Enterprise type. For example, an action that executes with 2 retries is charged for 3 action executions. |
| [Data retention and storage usage](#standard-storage-transactions-billing) | For these operations, review [Standard billing for storage transactions](#standard-storage-transactions-billing). |
||||

<a name="standard-storage-transactions-billing"></a>

### Standard billing for storage transactions

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. With multi-tenant Azure Logic Apps, any storage usage and costs are attached to the logic app. With single-tenant Azure Logic Apps, you can use your own Azure [storage account](../azure-functions/storage-considerations.md#storage-account-requirements). This capability gives you more control and flexibility with your Logic Apps data.

When *stateful* workflows run their operations, the Azure Logic Apps runtime makes storage transactions. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states. Storage costs change based on your workflow's content. Different triggers, actions, and payloads result in different storage operations and needs. Storage transactions follow the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are listed separately in your Azure billing invoice.

### Tips for estimating storage needs and costs

To help you get some idea about the number of storage operations that a workflow might run and their cost, try using the [Logic Apps Storage calculator](https://logicapps.azure.com/calculator). You can either select a sample workflow or use an existing workflow definition. The first calculation estimates the number of storage operations in your workflow. You can then use these numbers to estimate possible costs using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

For more information, review the following documentation:

* [Estimate storage needs and costs for workflows in single-tenant Azure Logic Apps](estimate-storage-costs.md)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

<a name="fixed-pricing"></a>

## ISE pricing (dedicated)

A fixed pricing model applies to logic apps that run in the dedicated [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is billed using the [Integration Service Environment price](https://azure.microsoft.com/pricing/details/logic-apps), which depends on the [ISE level or *SKU*](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level) that you create. This pricing differs from multi-tenant pricing as you're paying for reserved capacity and dedicated resources whether or not you use them.

| ISE SKU | Description |
|---------|-------------|
| **Premium** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Premium SKU](https://azure.microsoft.com/pricing/details/logic-apps). If you need more throughput, you can [add more scale units](../logic-apps/ise-manage-integration-service-environment.md#add-capacity) when you create your ISE or afterwards. Each scale unit is billed at an [hourly rate that's roughly half the base unit rate](https://azure.microsoft.com/pricing/details/logic-apps). <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| **Developer** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Developer SKU](https://azure.microsoft.com/pricing/details/logic-apps). However, this SKU has no service-level agreement (SLA), scale up capability, or redundancy during recycling, which means that you might experience delays or downtime. Backend updates might intermittently interrupt service. <p><p>**Important**: Make sure that you use this SKU only for exploration, experiments, development, and testing - not for production or performance testing. <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
|||

### Included at no extra cost

| Items | Description |
|-------|-------------|
| [Built-in](../connectors/built-in.md) triggers and actions | Display the **Core** label and run in the same ISE as your logic apps. |
| [Standard connectors](../connectors/managed.md) <p><p>[Enterprise connectors](../connectors/managed.md#enterprise-connectors) | - Managed connectors that display the **ISE** label are specially designed to work without the on-premises data gateway and run in the same ISE as your logic apps. ISE pricing includes as many Enterprise connections as you want. <p><p>- Connectors that don't display the ISE label run in the single-tenant Azure Logic Apps service. However, ISE pricing includes these executions for logic apps that run in an ISE. |
| Actions inside [loops](logic-apps-control-flow-loops.md) | ISE pricing includes each action that runs in a loop for each loop cycle that runs. <p><p>For example, suppose that you have a "for each" loop that includes actions that process a list. To get the total number of action executions, multiply the number of list items with the number of actions in the loop, and add the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| Retry attempts | To handle the most basic exceptions and errors, you can set up a [retry policy](logic-apps-exception-handling.md#retry-policies) on triggers and actions where supported. ISE pricing includes retries along with the original request. |
| [Data retention and storage usage](#data-retention) | Logic apps in an ISE don't incur charges for data retention and storage usage. |
| [Integration accounts](#integration-accounts) | Includes usage for a single integration account tier, based on ISE SKU, at no extra cost. |
|||

For limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise).

<a name="integration-accounts"></a>

## Integration accounts

An [integration account](../logic-apps/logic-apps-pricing.md#integration-accounts) is a separate resource, which you link create link to a logic app so that you can explore, build, and test B2B integration solutions that use [EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) capabilities.

Azure Logic Apps offers these integration account levels or tiers that [vary in pricing](https://azure.microsoft.com/pricing/details/logic-apps/) and [billing model](logic-apps-pricing.md#integration-accounts), based on whether your logic app runs in Azure Logic Apps (multi-tenant or single-tenant) or an ISE.

| Tier | Description |
|------|-------------|
| **Basic** | For scenarios where you want only message handling or to act as a small business partner that has a trading partner relationship with a larger business entity. <p><p>Supported by the Logic Apps SLA. |
| **Standard** | For scenarios where you have more complex B2B relationships and increased numbers of entities that you must manage. <p><p>Supported by the Logic Apps SLA. |
| **Free** | For exploratory scenarios, not production scenarios. This tier has limits on region availability, throughput, and usage. For example, the Free tier is available only for public regions in Azure, for example, West US or Southeast Asia, but not for [Azure China 21Vianet](/azure/china/overview-operations) or [Azure Government](../azure-government/documentation-government-welcome.md). <p><p>**Note**: Not supported by the Logic Apps SLA. |
|||

For information about integration account limits, see [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits), such as:

* [Limits on integration accounts per Azure subscription](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits)

* [Limits on various artifacts per integration account](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits). Artifacts include trading partners, agreements, maps, schemas, assemblies, certificates, batch configurations, and so on.

### Multi-tenant or single-tenant based logic apps

Integration accounts are billed using a fixed [integration account price](https://azure.microsoft.com/pricing/details/logic-apps/) that is based on the account tier that you use.

### ISE-based logic apps

At no extra cost, your ISE includes a single integration account, based on your ISE SKU. For an extra cost, you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). Learn more about the [ISE pricing model](#fixed-pricing) earlier in this topic.

| ISE SKU | Included integration account | Extra cost |
|---------|------------------------------|-----------------|
| **Premium** | A single [Standard](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts. No Free or Basic accounts are permitted. |
| **Developer** | A single [Free](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts if you already have a Free account, or 20 total Standard accounts if you don't have a Free account. No Basic accounts are permitted. |
||||

<a name="data-retention"></a>

## Data retention and storage usage

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. The inputs and outputs from your workflow's run history are stored and metered, based on your logic app's [run history retention limit](logic-apps-limits-and-config.md#run-duration-retention-limits). To monitor storage usage, see [View metrics for executions and storage usage](plan-manage-costs.md#monitor-billing-metrics).

| Environment | Notes |
|-------------|-------|
| **Multi-tenant** | Storage usage and retention are billed using a fixed rate, which you can find on the [Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps), under the **Pricing details** table. |
| **Single-tenant** | Storage usage and retention are billed using the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are listed separately in your Azure billing invoice. For more information, review [Storage transactions (single-tenant)](#standard-storage-transactions-billing). |
| **ISE** | Storage usage and retention don't incur charges. |
|||

<a name="data-gateway"></a>

## On-premises data gateway

An [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) is a separate resource that you create so that your logic app workflows can access on-premises data by using specific gateway-supported connectors. Connectors operations that run through the gateway incur charges, but the gateway itself doesn't incur charges.

<a name="disabled-apps"></a>

## Disabled logic apps or workflows

Disabled logic apps (multi-tenant) or workflows (single-tenant) don't incur charges because they can't create new instances while they're disabled.

## Next steps

* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)