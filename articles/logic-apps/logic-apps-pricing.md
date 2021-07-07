---
title: Billing & pricing models
description: Overview about how pricing and billing models work in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 07/10/2021
---

# Pricing and billing models for Azure Logic Apps

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how billing and pricing models work for Azure Logic Apps and related resources. For information such as specific pricing rates, cost planning, or different hosting environments, review the following content:

* [Specific Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps)
* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)
* [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md)

<a name="consumption-pricing"></a>

## Consumption (multi-tenant)

In multi-tenant Azure Logic Apps, a logic app and its workflow follow the [**Consumption** plan](https://azure.microsoft.com/pricing/details/logic-apps) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Consumption)** resource type, use the **Azure Logic Apps (Consumption)** extension in Visual Studio Code, or when you create [automation tasks](create-automation-tasks-azure-resources.md).

The following table summarizes how the Consumption model handles metering and billing for the following components when used with a logic app and a workflow in multi-tenant Azure Logic Apps:

| Component | Metering and billing |
| ----------|----------------------|
| Trigger and action operations | The Consumption model includes an *initial number* of built-in operations that a workflow can run *for free*. Above this number, metering applies to *each execution*, and billing follows the [*Actions* pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For other operation types, such as managed connectors, billing follows the [*Standard* or *Enterprise* connector pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For more information, review [Trigger and action operations in the Consumption model](#consumption-operations). |
| Storage operations | Metering applies to any storage operations run by Azure Logic Apps. Billing follows the [data retention pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps/). For example, storage operations run when the service saves inputs and outputs from your workflow's run history. For more information, review [Storage operations](#storage-operations). |
| Integration accounts | Metering applies based on the integration account type that you create and use with your logic app. Billing follows [*Integration Account* pricing](https://azure.microsoft.com/pricing/details/logic-apps/) unless your logic app is deployed and hosted in an [integration service environment (ISE)](#ise-pricing). For more information, review [Integration accounts](#integration-accounts). |
|||

<a name="consumption-operations"></a>

### Trigger and action operations in the Consumption model

Except for initial number of free built-in operation executions that a workflow can run, the Consumption model meters and bills an operation based on *each execution*, whether or not the overall workflow successfully runs, finishes, or is even instantiated. An operation usually makes a single execution [unless the operation has retry attempts enabled](#other-operation-behavior). In turn, an execution usually makes a single call [unless the operation supports and enables chunking or pagination to get large amounts of data](logic-apps-handle-large-messages.md). If chunking or pagination is enabled, an operation execution might have to make multiple calls. The Consumption model meters and bills an operation *per execution, not per call*.

For example, suppose a workflow starts with a polling trigger that gets records by regularly making outbound calls to an endpoint. The outbound call is metered and billed as a single execution, whether or not the trigger fires or is skipped. The trigger state controls whether or not the workflow instance is created and run. Now, suppose the operation also supports and has enabled chunking or pagination. If the operation has to make 10 calls to finish getting all the data, the operation is still metered and billed as a *single execution*, despite making multiple calls.

The following table summarizes how the Consumption model handles metering and billing for these operation types when used with a logic app and workflow in multi-tenant Azure Logic Apps:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime. In the designer, you can find these operations under the **Built-in** label. <p><p>For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The Consumption model includes an *initial number of free built-in operations* that a workflow can run. Above this number, built-in operation executions follow the [*Actions* pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Some managed connector operations are *also* available as built-in operations, which are included in the initial free operations. Above the initially free operations, billing follows the [*Actions* pricing](https://azure.microsoft.com/pricing/details/logic-apps/), not the [*Standard* or *Enterprise* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Managed connector*](../connectors/managed.md) | These operations run separately in Azure. In the designer, you can find these operations under the **Standard** or **Enterprise** label. | These operation executions follow the [*Standard* or *Enterprise* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Preview Enterprise connector operation executions follow the [Consumption *Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Custom connector*](../connectors/apis-list.md#custom-apis-and-connectors) | These operations run separately in Azure. In the designer, you can find these operations under the **Custom** label. For limits number of connectors, throughput, and timeout, review [Custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). | These operation executions follow the [*Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
||||

For more information about how the Consumption model works with operations that run inside other operations such as loops or process multiple items such as arrays, review [Other operation behavior](#other-operation-behavior).

<a name="consumption-cost-estimation-tips"></a>

### Cost estimation tips for the Consumption model

To help you estimate more accurate consumption costs, review these tips:

* Consider the possible number of messages or events that might arrive on any given day, rather than base your calculations on only the polling interval.

* When an event or message meets the trigger criteria, many triggers immediately try to read any other waiting events or messages that meet the criteria. This behavior means that even when you select a longer polling interval, the trigger fires based on the number of waiting events or messages that qualify for starting workflows. Triggers that follow this behavior include Azure Service Bus and Azure Event Hub.

  For example, suppose you set up trigger that checks an endpoint every day. When the trigger checks the endpoint and finds 15 events that meet the criteria, the trigger fires and runs the corresponding workflow 15 times. The Logic Apps service meters all the actions that those 15 workflows perform, including the trigger requests.

<a name="standard-pricing"></a>

## Standard (single-tenant)

In single-tenant Azure Logic Apps, a logic app and its workflows follow the [**Standard** plan](https://azure.microsoft.com/pricing/details/logic-apps/) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Standard)** resource type or use the **Azure Logic Apps (Standard)** extension in Visual Studio Code. This pricing model requires that a logic app use a hosting plan and a pricing tier, which differs from the Consumption plan in that you're billed for reserved capacity and dedicated resources whether or not you use them. The pricing tier that you choose determines the resource level and pricing rates that apply to compute, memory, and storage usage.

> [!IMPORTANT]
> When you create or deploy new logic apps based on the **Logic App (Standard)** resource type, you must use the 
> **Workflow Standard** hosting plan. Although preview versions let you use the App Service plan, Functions Premium plan, 
> and App Service Environment, these options aren't available for the **Logic App (Standard)** resource type.

The following table summarizes how the Standard model handles metering and billing for the following components when used with a logic app and a workflow in single-tenant Azure Logic Apps:

| Component | Metering and billing |
| ----------|----------------------|
| Trigger and action operations | The Standard model includes an *unlimited number* of built-in operations that your workflow can run *for free*. <p><p>For other operation types, such as managed connectors, metering applies to *each call*, while billing follows the [same *Standard* or *Enterprise* connector pricing as the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For more information, review [Trigger and action operations in the Standard model](#standard-operations). |
| Storage operations | Metering applies to any storage operations run by Azure Logic Apps. Billing follows your chosen [pricing tier](#standard-pricing-tiers). For example, storage operations run when the service saves inputs and outputs from your workflow's run history. For more information, review [Storage operations](#storage-operations). |
| Integration accounts | Metering is based on the integration account type that you create and use with your logic app. Billing follows the [*Integration Account* pricing](https://azure.microsoft.com/pricing/details/logic-apps/). For more information, review [Integration accounts](#integration-accounts). |
|||

<a name="standard-operations"></a>

### Trigger and action operations in the Standard model

Except for the unlimited built-in operations that a workflow can run *for free*, the Standard model meters and bills an operation based on *each call*, whether or not the overall workflow successfully runs, finishes, or is even instantiated. An operation usually makes a single execution [unless the operation has retry attempts enabled](#other-operation-behavior). In turn, an execution usually makes a single call [unless the operation supports and enables chunking or pagination to get large amounts of data](logic-apps-handle-large-messages.md). If chunking or pagination is enabled, an operation execution might have to make multiple calls. The Standard model meters and bills an operation *per call, not per execution*.

For example, suppose a workflow starts with a polling trigger that gets records by regularly making outbound calls to an endpoint. The outbound call is metered and billed, whether or not the trigger fires or is skipped. The trigger state controls whether or not the workflow instance is created and run. Now, suppose the operation also supports and has enabled chunking or pagination. If the operation has to make 10 calls to finish getting all the data, the operation is metered and billed *per call*.

The following table summarizes how the Standard model handles metering and billing for operation types when used with a logic app and workflow in single-tenant Azure Logic Apps:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime. In the designer, you can find these operations under the **Built-in** label. For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The Standard model includes unlimited built-in operations *for free*. <p><p>**Note**: Some managed connector operations are *also* available as built-in operations. While built-in operations are free, the Standard model still meters and bills managed connector operations using the [same *Standard* or *Enterprise* connector pricing as the Consumption model](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Managed connector*](../connectors/managed.md) | These operations run separately in Azure. In the designer, you can find these operations under the combined **Azure** label. | The Standard model meters and bills managed connector operations based on the [same *Standard* and *Enterprise* connector pricing as the Consumption model](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Preview Enterprise connector operations follow the [Consumption *Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Custom connector*](../connectors/apis-list.md#custom-apis-and-connectors) | Currently, you can create and use only [custom built-in connector operations](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272) in single-tenant based logic app workflows. | The Standard model includes built-in operations *for free*. For limits on throughput and timeout, review [Custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). |
||||

For more information about how the Standard model works with operations that run inside other operations such as loops or process multiple items such as arrays, review [Other operation behavior](#other-operation-behavior).

<a name="standard-pricing-tiers"></a>

### Pricing tiers in the Standard model

The pricing tier that you choose for metering and billing your logic app includes a specific amount of compute, memory, and storage resources. For pricing information that's *specific to your region*, review the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/).

This example tries to show how pricing tiers work by providing sample estimates for the *East US 2 region*.

* On the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/), select the **East US 2** region to view the hourly rates, or review the following table:

  | Resource | Hourly US$ (East US 2) |
  |----------|------------------------|
  | **Virtual CPU (vCPU)** | $0.192 |
  | **Memory** | $0.0137 per GB |
  |||

* Based on the preceding information, the following table shows the estimated monthly rate for each pricing tier and the resources included in that pricing tier:

  | Pricing tier | Monthly US$ (East US 2) | Virtual CPU (vCPU) | Memory (GB) | Storage (GB) |
  |--------------|-------------------------|--------------------|-------------|--------------|
  | **WS1** | $175.20 | 1 | 3.5 | 250 |
  | **WS2** | $350.40 | 2 | 7 | 250 |
  | **WS3** | $700.80 | 4 | 14 | 250 |
  ||||||

* Based on the preceding information, the following table lists each resource and the estimated monthly rate if you choose the **WS1** pricing tier:

  | Resource | Amount | Monthly US$ (East US 2) |
  |----------|--------|-------------------------|
  | **Virtual CPU (vCPU)** | 1 | $140.16 |
  | **Memory** | 3.5 GB | $35.04 |
  ||||

<a name="ise-pricing"></a>
<a name="fixed-pricing"></a>

## Integration service environment (ISE)

When you create a logic app using the **Logic App (Consumption)** resource type, and you deploy to a dedicated [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), the logic app and its workflow follow the fixed [Integration Service Environment plan](https://azure.microsoft.com/pricing/details/logic-apps) for pricing and billing. This pricing model depends on your [ISE level or *SKU*](connect-virtual-network-vnet-isolated-environment-overview.md#ise-level) and differs from the Consumption plan in that you're billed for reserved capacity and dedicated resources whether or not you use them.

The following table summarizes how the ISE model handles metering and billing for capacity and other dedicated resources based on your ISE level or SKU:

| ISE SKU | Metering and billing |
|---------|----------------------|
| **Premium** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Premium SKU](https://azure.microsoft.com/pricing/details/logic-apps). If you need more throughput, you can [add more scale units](../logic-apps/ise-manage-integration-service-environment.md#add-capacity) when you create your ISE or afterwards. Each scale unit is billed at an [hourly rate that's roughly half the base unit rate](https://azure.microsoft.com/pricing/details/logic-apps). <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| **Developer** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Developer SKU](https://azure.microsoft.com/pricing/details/logic-apps). However, this SKU has no service-level agreement (SLA), scale up capability, or redundancy during recycling, which means that you might experience delays or downtime. Backend updates might intermittently interrupt service. <p><p>**Important**: Make sure that you use this SKU only for exploration, experiments, development, and testing - not for production or performance testing. <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
|||

The following table summarizes how the ISE model handles the following components when used with a logic app and a workflow in an ISE:

| Component | Description |
|-----------|-------------|
| Trigger and action operations | The ISE model includes built-in, managed connector, and custom connector operations that your workflow can run *for free*, but subject to the [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise) and [custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md##custom-connector-limits). For more information, review [Trigger and action operations in the ISE model](#integration-service-environment-operations). |
| Storage operations | The ISE model includes storage operations and usage for data retention *for free*. For more information, review [Storage operations](#storage-operations). |
| Integration accounts | The ISE model includes a single integration account tier *for free*, depending on your ISE SKU. For more information, review [Integration accounts](#integration-accounts). |
|||

<a name="integration-service-environment-operations"></a>

### Trigger and action operations in the ISE model

The following table summarizes how the ISE model handles the following operation types when used with a logic app and workflow in an ISE:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime and in the same ISE as your logic app workflow. In the designer, you can find these operations under the **Built-in** label, but each operation also displays the **CORE** label. <p><p>For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The ISE model includes built-in operations *for free*. |
| [*Managed connector*](../connectors/managed.md) | Based on whether a managed connector displays the **ISE** label, *Standard* and *Enterprise* connector operations run in either your ISE or multi-tenant Azure. <p><p>- **ISE** label: These operations run in the same ISE as your logic app and work without requiring the [on-premises data gateway](#data-gateway). <p><p>- No **ISE** label: These operations run in multi-tenant Azure. | - **ISE** label: The ISE model includes these operations *for free*. <p><p>- No **ISE** label: The ISE model includes these operations *for free*. |
| [*Custom connector*](../connectors/apis-list.md#custom-apis-and-connectors) | In the designer, you can find these operations under the **Custom** label. | The ISE model includes these operations *for free*, but are subject to [custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). |
||||

For more information about how the ISE model works with operations that run inside other operations such as loops or process multiple items such as arrays, review [Other operation behavior](#other-operation-behavior).

<a name="other-operation-behavior"></a>

## Other operation behavior

The following table summarizes how the Consumption, Standard, and ISE models handle operations that run inside other operations such as loops, process multiple items such as arrays, and retry attempts:

| Operation | Description | Consumption | Standard | ISE |
|-----------|-------------|-------------|----------|-----|
| [Loop actions](logic-apps-control-flow-loops.md) | A loop action, such as the **For each** or **Until** loop, can include other actions that run during each loop cycle. | Except for the initial number of included built-in operations, the loop action and each action in the loop are metered each time the loop cycle runs. If an action processes any items in a collection, such as a list or array, the number of items is also used in the metering calculation. <p><p>For example, suppose you have a **For each** loop with actions that process a list. The service multiplies the number of list items against the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. <p><p>Pricing is based on whether the operation types are built-in, Standard, or Enterprise. | Except for the included built-in operations, same as the Consumption model. | Not metered or billed. |
| [Retry attempts](logic-apps-exception-handling.md#retry-policies) | On supported operations, you can implement basic exception and error handling by setting up a [retry policy](logic-apps-exception-handling.md#retry-policies). | Except for the initial number of built-in operations, the original execution plus each retried execution are metered. For example, an action that executes with 5 retries is metered and billed as 6 executions. <p><p>Pricing is based on whether the operation types are built-in, Standard, or Enterprise. | Except for the built-in included operations, same as the Consumption model. | Not metered or billed. |
||||||

<a name="data-gateway"></a>

## On-premises data gateway

The [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) is a separate Azure resource that you create so that your logic app workflows can access on-premises data by using specific gateway-supported connectors. The gateway resource itself doesn't incur charges, but operations that run through the gateway incur charges, based on the pricing and billing model used by your logic app.

<a name="integration-accounts"></a>

## Integration accounts

An [integration account](logic-apps-enterprise-integration-create-integration-account.md) is a separate Azure resource that you create as a container to store business-to-business (B2B) artifacts that you create, for example, trading partners, agreements, schemas, maps, and so on. You can then use these artifacts and various B2B operations in workflows to explore, build, and test integration solutions that use [EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) capabilities.

### Integration accounts for multi-tenant or single-tenant based logic apps

| | | Multi-tenant

For multi-tenant and single-tenant hosted logic apps, metering and billing for integration accounts use a fixed [integration account price](https://azure.microsoft.com/pricing/details/logic-apps/), based on the account tier that you use.

### Integration accounts for ISE based logic apps

For ISE hosted logic apps, usage includes a single integration account, based on your ISE SKU. For an extra cost, you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). Learn more about the [ISE pricing model](#ise-pricing) earlier in this topic.

| ISE SKU | Included integration account | Extra cost |
|---------|------------------------------|-----------------|
| **Premium** | A single [Standard](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts. No Free or Basic accounts are permitted. |
| **Developer** | A single [Free](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits) integration account | Up to 19 more Standard accounts if you already have a Free account, or 20 total Standard accounts if you don't have a Free account. No Basic accounts are permitted. |
||||


, based on whether logic apps are hosted in multi-tenant, single-tenant, or Azure Logic Apps (multi-tenant or single-tenant) or an ISE.

Azure Logic Apps offers the following integration account levels or tiers, which [vary in pricing](https://azure.microsoft.com/pricing/details/logic-apps/):

| Tier | Description |
|------|-------------|
| **Basic** | For scenarios where you want only message handling or to act as a small business partner that has a trading partner relationship with a larger business entity. <p><p>Supported by the Logic Apps SLA. |
| **Standard** | For scenarios where you have more complex B2B relationships and increased numbers of entities that you must manage. <p><p>Supported by the Logic Apps SLA. |
| **Free** | For exploratory scenarios, not production scenarios. This tier has limits on region availability, throughput, and usage. For example, the Free tier is available only for public regions in Azure, for example, West US or Southeast Asia, but not for [Azure China 21Vianet](/azure/china/overview-operations) or [Azure Government](../azure-government/documentation-government-welcome.md). <p><p>**Note**: Not supported by the Logic Apps SLA. |
|||

For information about integration account limits, review [Integration account limits in Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits), such as:

> [!NOTE]
> Before you can use an integration account and related artifacts in your workflow, you have to link the integration account to your logic app. 
> For more information, review [Create and manage integration accounts](logic-apps-enterprise-integration-create-integration-account.md).


<a name="storage-operations"></a>

## Storage operations

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. The inputs and outputs from your workflow's run history are stored and metered, based on your logic app's [run history retention limit](logic-apps-limits-and-config.md#run-duration-retention-limits).
You manage storage usage and data retention at the logic app level, not the workflow level. 

For more information, review the following documentation:

* [View metrics for executions and storage usage](plan-manage-costs.md#monitor-billing-metrics)
* [Limits in Azure Logic Apps](logic-apps-limits-and-config.md)

<a name="standard-storage-transactions-billing"></a>

### Storage operations in the Standard model

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. With multi-tenant Azure Logic Apps, any storage usage and costs are attached to the logic app. With single-tenant Azure Logic Apps, you can use your own Azure [storage account](../azure-functions/storage-considerations.md#storage-account-requirements). This capability gives you more control and flexibility with your Logic Apps data.

When *stateful* workflows run their operations, the Azure Logic Apps runtime makes storage transactions. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states. Storage costs change based on your workflow's content. Different triggers, actions, and payloads result in different storage operations and needs. Storage transactions follow the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are listed separately in your Azure billing invoice.

#### Tips for estimating storage needs and costs

To help you get some idea about the number of storage operations that a workflow might run and their cost, try using the [Logic Apps Storage calculator](https://logicapps.azure.com/calculator). You can either select a sample workflow or use an existing workflow definition. The first calculation estimates the number of storage operations in your workflow. You can then use these numbers to estimate possible costs using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

For more information, review the following documentation:

* [Estimate storage needs and costs for workflows in single-tenant Azure Logic Apps](estimate-storage-costs.md)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

| Environment | Notes |
|-------------|-------|
| **Multi-tenant** | Storage usage and retention are billed using a fixed rate, which you can find on the [Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps), under the **Pricing details** table. |
| **Single-tenant** | Storage usage and retention are billed using the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are listed separately in your Azure billing invoice. For more information, review [Storage transactions (single-tenant)](#standard-storage-transactions-billing). |
| **ISE** | Storage operations and usage aren't metered or billed. |
|||

## Not metered or billed

Across all pricing models, the following components that aren't metered or billed:

* Triggers that are skipped due to unmet conditions
* Actions that didn't run because the workflow stopped before completion
* Disabled logic apps or workflows because they can't create new instances while they're inactive.

## Next steps

* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)