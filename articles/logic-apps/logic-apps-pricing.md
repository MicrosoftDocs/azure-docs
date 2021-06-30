---
title: Billing & pricing models
description: Overview about how pricing and billing models work in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 06/29/2021
---

# Pricing and billing models for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how billing and pricing models work for Azure Logic Apps and related resources. For information such as specific pricing rates or cost planning, review the following content:

* [Specific Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps)
* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)

<a name="consumption-pricing"></a>

## Consumption model (multi-tenant)

In multi-tenant Azure Logic Apps, a logic app and its workflow follow the [**Consumption** plan](https://azure.microsoft.com/pricing/details/logic-apps) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Consumption)** resource type, use the **Azure Logic Apps (Consumption)** extension in Visual Studio Code, or when you create [automation tasks](create-automation-tasks-azure-resources.md).

The following describes how the Consumption model works with components when used with a multi-tenant based logic app and workflow:

* [Trigger and action operations](#consumption-operations)
* [Storage operations](#storage-operations)
* [Integration accounts](#integration-accounts)

| Component | Metering and billing |
| ----------|----------------------|
| Trigger and action operations | Metering and billing apply to each operation *execution* and follows [Consumption pricing](https://azure.microsoft.com/pricing/details/logic-apps), based on the operation type. For more information, review [Trigger and action operations in the Consumption model](#consumption-operations). |
| Storage operations | Metering and billing apply to any storage operations. <p><p>For example, storage operations run when saving inputs and outputs from your workflow's run history. Storage usage and data retention are managed at the logic app level, not the workflow level. Metering and billing follow [Consumption data retention pricing](https://azure.microsoft.com/pricing/details/logic-apps/), which appears under the execution pricing table. For more information, review [Storage operations](#storage-operations). |
| Integration accounts | Metering and billing apply based on the integration account type and follow the [general integration account pricing](https://azure.microsoft.com/pricing/details/logic-apps/) unless your logic apps are hosted in an [integration service environment (ISE)](#integration-service-environment-pricing). For more information, review [Integration accounts](#integration-accounts). |
|||

<a name="consumption-operations"></a>

### Trigger and action operations in the Consumption model

Metering and billing apply to each operation execution, whether or not the workflow successfully runs, finishes, or is even instantiated. An operation execution usually makes the same number of calls as the number of executions. This number is just one execution [unless the operation makes retry attempts](#other-operation-behavior). If an operation supports and enables chunking or pagination, the operation execution might have to make multiple calls. In the Consumption model, *only the single execution is metered and billed*.

For example, suppose a workflow starts with a polling trigger that gets records by regularly making outbound calls to an endpoint. The outbound call is metered and billed as a single execution, whether or not the trigger fires or is skipped. The trigger state controls whether or not the workflow instance is created and run. On an operation that supports and uses chunking or pagination, suppose that the operation has to make 10 calls before getting all the data. Despite the multiple calls, the operation is metered and billed as a *single execution*.

The following table briefly describes the various operation types in multi-tenant Azure Logic Apps and their billing model behavior:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations directly and natively run in Azure Logic Apps. You can find them using the **Built-in** label in the designer. <p><p>For example, the HTTP trigger and Request trigger are built-in triggers, while the HTTP action and Response action are built-in actions. Data operations, batch operations, variable operations, and workflow control actions, such as loops, conditions, switch, parallel branches, and so on are also built-in actions. | The Consumption model includes a *free monthly number of built-in operation executions* that your workflow can run. Above this number, built-in operation executions follow the [Consumption actions pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Some managed connector operations are *also* available as built-in operations. These built-in operation executions follow the [Consumption actions pricing](https://azure.microsoft.com/pricing/details/logic-apps/), not the [Consumption Standard or Enterprise connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Managed connector*](../connectors/managed.md) | These operations run separately in Azure. You can find them using either the **Standard** or **Enterprise** label in the designer. | These operation executions follow the [Consumption **Standard** or **Enterprise** connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Preview Enterprise connector operation executions follow the [Consumption **Standard** connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Custom connector*](../connectors/apis-list.md#custom-apis-and-connectors) | These operations run separately in Azure. You can find them using the **Custom** label in the designer. | These operation executions follow the [Consumption **Standard** connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
||||

<a name="consumption-cost-estimation-tips"></a>

### Cost estimation tips for the Consumption model

To help you estimate more accurate consumption costs, review these tips:

* Consider the possible number of messages or events that might arrive on any given day, rather than base your calculations on only the polling interval.

* When an event or message meets the trigger criteria, many triggers immediately try to read any other waiting events or messages that meet the criteria. This behavior means that even when you select a longer polling interval, the trigger fires based on the number of waiting events or messages that qualify for starting workflows. Triggers that follow this behavior include Azure Service Bus and Azure Event Hub.

  For example, suppose you set up trigger that checks an endpoint every day. When the trigger checks the endpoint and finds 15 events that meet the criteria, the trigger fires and runs the corresponding workflow 15 times. The Logic Apps service meters all the actions that those 15 workflows perform, including the trigger requests.

<a name="standard-pricing"></a>

## Standard model (single-tenant)

In single-tenant Azure Logic Apps, a logic app and its workflows follow the [**Standard** plan](https://azure.microsoft.com/pricing/details/logic-apps/) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Standard)** resource type or use the **Azure Logic Apps (Standard)** extension in Visual Studio Code. This pricing model requires that logic apps use a hosting plan and a pricing tier. The pricing tier that you select determines the resource level and rates that apply to compute, memory, and storage usage. For more information, review [Standard model pricing tiers and rates](#standard-pricing-tiers).

> [!NOTE]
> For new logic apps based on the **Logic App (Standard)** resource type, you must use the **Workflow Standard** hosting plan. 
> Although preview version logic apps supported the App Service and Premium Functions plans, the current official release doesn't 
> support these plans nor App Service Environment for new logic apps. Instead, you must use the **Workflow Standard** plan.

If your workflows also use Azure managed connector operations or integration accounts, separate billing and pricing apply to these components:

* [Standard billing for managed connector operations](#standard-managed-connector-billing)

  > [!NOTE]
  > [*Built-in*](../connectors/built-in.md) triggers and actions are operations that run natively in Azure Logic Apps and are 
  > labeled as **Built-in** in the workflow designer. The Standard plan *includes built-in operation executions at no extra charge*. 
  > Some managed connector operations are *also* available as built-in versions, which don't incur charges However, the managed 
  > connector versions still incur charges.

* [Standard billing for other related resources](#standard-related-resources-billing)

For more information about logic apps that are single-tenant based versus multi-tenant or integration service environment, review [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md).

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

<a name="standard-managed-connector-billing"></a>

### Standard billing for managed connector operations

For managed connector triggers and actions in a logic app workflow, metering and billing are based on *calls* and apply whether your workflow runs successfully or is even instantiated. For example, suppose your workflow starts with a polling trigger that regularly makes outbound calls to an endpoint. The outbound call is metered and billed, regardless whether the trigger fires or is skipped, which affects whether a workflow instance is created.

The following list describes billing model differences between **Standard** in the single-tenant environment and **Consumption** in the multi-tenant environment:

* In single-tenant, the designer uses the **Azure** label to identify managed connector operations. In multi-tenant, the designer uses the **Standard** and **Enterprise** labels. However, in both environments, metering and billing use the same **Standard** and **Enterprise** connector prices as described by the Consumption pricing plan.

* When an operation executes, the number of calls is usually the same as the number of executions. For example, a Salesforce operation execution that gets records is a single call unless the operation makes retry attempts. However, when an operation has chunking or pagination enabled, that operation might have to make multiple calls per execution.

  In single-tenant, *each call is metered and charged*. In multi-tenant, *only the single execution is metered and charged*. This behavior means that such an execution might cost you more when running in single-tenant versus multi-tenant.

  For example, suppose you have an operation that uses chunking or pagination. During one execution, the operation has to make 10 calls before getting all the necessary data. In multi-tenant, the operation is metered and charged as a single execution. In single-tenant, the same execution is metered and charged for each call, so this execution can cost 10 times more.

| Items | Description | Billing model |
|-------|-------------|---------------|
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

#### Tips for estimating storage needs and costs

To help you get some idea about the number of storage operations that a workflow might run and their cost, try using the [Logic Apps Storage calculator](https://logicapps.azure.com/calculator). You can either select a sample workflow or use an existing workflow definition. The first calculation estimates the number of storage operations in your workflow. You can then use these numbers to estimate possible costs using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

For more information, review the following documentation:

* [Estimate storage needs and costs for workflows in single-tenant Azure Logic Apps](estimate-storage-costs.md)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

<a name="standard-related-resources-billing"></a>

### Standard plan - Other related resources

Single-tenant based logic app workflows can use other related resources, such as on-premises data gateways and integration accounts. For plan-specific information about these resources, review these sections later in this topic:

* [On-premises data gateways](#data-gateway)
* [Integration accounts](#integration-accounts)

<a name="standard-not-metered"></a>

### Standard plan - Not metered or billed

* All built-in operation executions
* Triggers that are skipped due to unmet conditions
* Actions that didn't run because the workflow stopped before completion
* [Disabled logic apps](#disabled-apps)

<a name="consumption-standard-differences"></a>

## Differences summary between Consumption and Standard models

The following list describes billing model differences between **Consumption** in the multi-tenant environment and **Standard** in the single-tenant environment:

* In multi-tenant, the designer uses the **Standard** and **Enterprise** labels to identify managed connector operations. In single-tenant, the designer uses only the combined **Azure** label. However, in both environments, metering and billing use the same **Standard** and **Enterprise** connector prices as described by the Consumption plan.

* When an operation executes, the number of calls is usually the same as the number of executions. For example, a Salesforce operation execution that gets records is a single call unless the operation makes retry attempts. However, when an operation has chunking or pagination enabled, that operation might have to make multiple calls per execution.

  In multi-tenant, *only the single execution is metered and charged*. In single-tenant, *each call is metered and charged*. This behavior means that such an execution might cost you more when running in single-tenant versus multi-tenant.

  For example, suppose you have an operation that uses chunking or pagination. During one execution, the operation has to make 10 calls before getting all the necessary data. In multi-tenant, the operation is metered and charged as a single execution. In single-tenant, the same execution is metered and charged for each call, so this execution can cost 10 times more.

<a name="integration-service-environment-pricing"></a>

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

<a name="other-operation-behavior"></a>

## Other operation behavior

| Operation | Description | Metering and billing |
|-----------|-------------|----------------------|
| [Loop actions](logic-apps-control-flow-loops.md) | A loop action, such as the **For each** or **Until** loop, can include other actions that run during each loop cycle. The loop structure applies special metering and billing behavior. | Except when free built-in operation executions applies, the loop execution and each action execution in the loop are metered each time the loop cycle runs. If an action processes any items in a collection, such as a list or array, the number of collection items is also used in the billing calculation. <p><p>For example, suppose you have a **For each** loop with actions that process a list. The service multiplies the number of list items against the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. |
| [Retry attempts](logic-apps-exception-handling.md#retry-policies) | On supported operations, you can implement basic exception and error handling by setting up a [retry policy](logic-apps-exception-handling.md#retry-policies). | The original execution plus each retried execution are metered and billed, based on whether the operation type is built-in, Standard, or Enterprise. <p><p>For example, an action that executes with 5 retries is metered and billed as 6 executions. |
||||

<a name="data-gateway"></a>

## On-premises data gateway

The [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) is a separate Azure resource that you create so that your logic app workflows can access on-premises data by using specific gateway-supported connectors. The gateway resource itself doesn't incur charges, but operations that run through the gateway incur charges, based on the pricing and billing model used by your logic app.

<a name="integration-accounts"></a>

## Integration accounts

An [integration account](logic-apps-enterprise-integration-create-integration-account.md) is a separate Azure resource that you create as a container to store business-to-business (B2B) artifacts that you create, for example, trading partners, agreements, schemas, maps, and so on. You can then use these artifacts and various B2B operations in workflows to explore, build, and test integration solutions that use [EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) capabilities.

> [!NOTE]
> Before you can use an integration account and related artifacts in your workflow, you have to link the integration account to your logic app. 
> For more information, review [Create and manage integration accounts](logic-apps-enterprise-integration-create-integration-account.md).

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

### Integration accounts for multi-tenant or single-tenant based logic apps

For multi-tenant and single-tenant hosted logic apps, metering and billing for integration accounts use a fixed [integration account price](https://azure.microsoft.com/pricing/details/logic-apps/), based on the account tier that you use.

### Integration accounts for ISE based logic apps

For ISE hosted logic apps, usage includes a single integration account, based on your ISE SKU. For an extra cost, you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). Learn more about the [ISE pricing model](#fixed-pricing) earlier in this topic.

| ISE SKU | Included integration account | Extra cost |
|---------|------------------------------|-----------------|
| **Premium** | A single [Standard](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts. No Free or Basic accounts are permitted. |
| **Developer** | A single [Free](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts if you already have a Free account, or 20 total Standard accounts if you don't have a Free account. No Basic accounts are permitted. |
||||

<a name="data-retention"></a>

## Data retention and storage usage

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. The inputs and outputs from your workflow's run history are stored and metered, based on your logic app's [run history retention limit](logic-apps-limits-and-config.md#run-duration-retention-limits).

For more information, review the following documentation:

* [View metrics for executions and storage usage](plan-manage-costs.md#monitor-billing-metrics)
* [Limits in Azure Logic Apps](logic-apps-limits-and-config.md)


| Environment | Notes |
|-------------|-------|
| **Multi-tenant** | Storage usage and retention are billed using a fixed rate, which you can find on the [Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps), under the **Pricing details** table. |
| **Single-tenant** | Storage usage and retention are billed using the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are listed separately in your Azure billing invoice. For more information, review [Storage transactions (single-tenant)](#standard-storage-transactions-billing). |
| **ISE** | Storage usage and retention don't incur charges. |
|||

## Not metered or billed
These items are not metered or billed:

* The monthly included number of built-in operation executions, specified by [Consumption plan pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
* Triggers that are skipped due to unmet conditions
* Actions that didn't run because the workflow stopped before completion
* [Disabled logic apps](#disabled-apps)


<a name="disabled-apps"></a>

## Disabled logic apps or workflows

Disabled logic apps (multi-tenant) and workflows (single-tenant) don't incur charges because they can't create new instances while they're disabled.

## Next steps

* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)