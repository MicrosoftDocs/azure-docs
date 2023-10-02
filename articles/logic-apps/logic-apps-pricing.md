---
title: Usage metering, billing, and pricing
description: Learn how usage metering, billing, and pricing work in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 04/18/2023
# As a logic apps developer, I want to learn and understand how usage metering, billing, and pricing work in Azure Logic Apps.
---

# Usage metering, billing, and pricing for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) helps you create and run automated integration workflows that can scale in the cloud. This article describes how metering, billing, and pricing models work for Azure Logic Apps and related resources. For information such as specific pricing rates, cost planning, or different hosting environments, review the following content:

* [Pricing rates for Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps)
* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)
* [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md)

<a name="consumption-pricing"></a>

## Consumption (multi-tenant)

In multi-tenant Azure Logic Apps, a logic app and its workflow follow the [**Consumption** plan](https://azure.microsoft.com/pricing/details/logic-apps) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Consumption)** resource type, use the **Azure Logic Apps (Consumption)** extension in Visual Studio Code, or when you create [automation tasks](create-automation-tasks-azure-resources.md).

The following table summarizes how the Consumption model handles metering and billing for the following components when used with a logic app and a workflow in multi-tenant Azure Logic Apps:

| Component | Metering and billing |
| ----------|----------------------|
| Trigger and action operations | The Consumption model includes an *initial number* of free built-in operations, per Azure subscription, that a workflow can run. Above this number, metering applies to *each execution*, and billing follows the [*Actions* pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For other operation types, such as managed connectors, billing follows the [*Standard* or *Enterprise* connector pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For more information, review [Trigger and action operations in the Consumption model](#consumption-operations). |
| Storage operations | Metering applies *only to data retention-related storage consumption* such as saving inputs and outputs from your workflow's run history. Billing follows the [data retention pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps/). For more information, review [Storage operations](#storage-operations). |
| Integration accounts | Metering applies based on the integration account type that you create and use with your logic app. Billing follows [*Integration Account* pricing](https://azure.microsoft.com/pricing/details/logic-apps/) unless your logic app is deployed and hosted in an [integration service environment (ISE)](#ise-pricing). For more information, review [Integration accounts](#integration-accounts). |

<a name="consumption-operations"></a>

### Trigger and action operations in the Consumption model

Except for the initial number of free built-in operation executions, per Azure subscription, that a workflow can run, the Consumption model meters and bills an operation based on *each execution*, whether or not the overall workflow successfully runs, finishes, or is even instantiated. An operation usually makes a single execution [unless the operation has retry attempts enabled](#other-operation-behavior). In turn, an execution usually makes a single call [unless the operation supports and enables chunking or pagination to get large amounts of data](logic-apps-handle-large-messages.md). If chunking or pagination is enabled, an operation execution might have to make multiple calls.

The Consumption model meters and bills an operation *per execution, not per call*. For example, suppose a workflow starts with a polling trigger that gets records by regularly making outbound calls to an endpoint. The outbound call is metered and billed as a single execution, whether or not the trigger fires or is skipped, such as when a trigger checks an endpoint but doesn't find any data or events. The trigger state controls whether or not the workflow instance is created and run. Now, suppose the operation also supports and has enabled chunking or pagination. If the operation has to make 10 calls to finish getting all the data, the operation is still metered and billed as a *single execution*, despite making multiple calls.

> [!NOTE]
>
> By default, triggers that return an array have a **Split On** setting that's already enabled. 
> This setting results in a trigger event, which you can review in the trigger history, and a 
> workflow instance *for each* array item. All the workflow instances run in parallel so that 
> the array items are processed at the same time. Billing applies to all trigger events whether 
> the trigger state is **Succeeded** or **Skipped**. Triggers are still billable even in scenarios 
> where the triggers don't instantiate and start the workflow, but the trigger state is **Succeeded**, 
> **Failed**, or **Skipped**.

The following table summarizes how the Consumption model handles metering and billing for these operation types when used with a logic app and workflow in multi-tenant Azure Logic Apps:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime. In the designer, you can find these operations under the **Built-in** label. <p>For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The Consumption model includes an *initial number of free built-in operations*, per Azure subscription, that a workflow can run. Above this number, built-in operation executions follow the [*Actions* pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Some managed connector operations are *also* available as built-in operations, which are included in the initial free operations. Above the initially free operations, billing follows the [*Actions* pricing](https://azure.microsoft.com/pricing/details/logic-apps/), not the [*Standard* or *Enterprise* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Managed connector*](../connectors/managed.md) | These operations run separately in Azure. In the designer, you can find these operations under the **Standard** or **Enterprise** label. | These operation executions follow the [*Standard* or *Enterprise* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Note**: Preview Enterprise connector operation executions follow the [Consumption *Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Custom connector*](../connectors/introduction.md#custom-connectors-and-apis) | These operations run separately in Azure. In the designer, you can find these operations under the **Custom** label. For limits number of connectors, throughput, and timeout, review [Custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). | These operation executions follow the [*Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |

For more information about how the Consumption model works with operations that run inside other operations such as loops, process multiple items such as arrays, and retry policies, review [Other operation behavior](#other-operation-behavior).

<a name="consumption-cost-estimation-tips"></a>

### Cost estimation tips for the Consumption model

To help you estimate more accurate consumption costs, review these tips:

* Consider the possible number of messages or events that might arrive on any given day, rather than base your calculations on only the polling interval.

* When an event or message meets the trigger criteria, many triggers immediately try to read any other waiting events or messages that meet the criteria. This behavior means that even when you select a longer polling interval, the trigger fires based on the number of waiting events or messages that qualify for starting workflows. Triggers that follow this behavior include Azure Service Bus and Azure Event Hubs.

  For example, suppose you set up trigger that checks an endpoint every day. When the trigger checks the endpoint and finds 15 events that meet the criteria, the trigger fires and runs the corresponding workflow 15 times. The Logic Apps service meters all the actions that those 15 workflows perform, including the trigger requests.

<a name="standard-pricing"></a>

## Standard (single-tenant)

In single-tenant Azure Logic Apps, a logic app and its workflows follow the [**Standard** plan](https://azure.microsoft.com/pricing/details/logic-apps/) for pricing and billing. You create such logic apps in various ways, for example, when you choose the **Logic App (Standard)** resource type or use the **Azure Logic Apps (Standard)** extension in Visual Studio Code. This pricing model requires that logic apps use a hosting plan and a pricing tier, which differs from the Consumption plan in that you're billed for reserved capacity and dedicated resources whether or not you use them.

When you create or deploy logic apps with the **Logic App (Standard)** resource type, and you select any Azure region for deployment, you'll also select a Workflow Standard hosting plan. However, if you select an existing **App Service Environment v3** resource for your deployment location, you must then select an [App Service Plan](../app-service/overview-hosting-plans.md).

> [!IMPORTANT]
> The following plans and resources are no longer available or supported with the public release of the **Logic App (Standard)** resource type in Azure regions: 
> Functions Premium plan, App Service Environment v1, and App Service Environment v2. Except with ASEv3, the App Service Plan is unavailable and unsupported.

The following table summarizes how the Standard model handles metering and billing for the following components when used with a logic app and a workflow in single-tenant Azure Logic Apps:

| Component | Metering and billing |
|-----------|----------------------|
| Virtual CPU (vCPU) and memory | The Standard model *requires* that your logic app uses the **Workflow Standard** hosting plan and a pricing tier, which determines the resource levels and pricing rates that apply to compute and memory capacity. For more information, review [Pricing tiers in the Standard model](#standard-pricing-tiers). |
| Trigger and action operations | The Standard model includes an *unlimited number* of free built-in operations that your workflow can run. <p>If your workflow uses any managed connector operations, metering applies to *each call*, while billing follows the [same *Standard* or *Enterprise* connector pricing as the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). For more information, review [Trigger and action operations in the Standard model](#standard-operations). |
| Storage operations | Metering applies to any storage operations run by Azure Logic Apps. For example, storage operations run when the service saves inputs and outputs from your workflow's run history. Billing follows your chosen [pricing tier](#standard-pricing-tiers). For more information, review [Storage operations](#storage-operations). |
| Integration accounts | If you create an integration account for your logic app to use, metering is based on the integration account type that you create. Billing follows the [*Integration Account* pricing](https://azure.microsoft.com/pricing/details/logic-apps/). For more information, review [Integration accounts](#integration-accounts). |

<a name="standard-pricing-tiers"></a>

### Pricing tiers in the Standard model

The pricing tier that you choose for metering and billing for your **Logic App (Standard)** resource includes specific amounts of compute in virtual CPU (vCPU) and memory resources. If you select an App Service Environment v3 as the deployment location and an App Service Plan, specifically an Isolated V2 Service Plan pricing tier, you're charged for the instances used by the App Service Plan and for running your logic app workflows. No other charges apply. For more information, see [App Service Plan - Isolated V2 Service Plan pricing tiers](https://azure.microsoft.com/pricing/details/app-service/windows/#pricing).

If you select a **Workflow Standard** hosting plan, you can choose from the following tiers:

| Pricing tier | Virtual CPU (vCPU) | Memory (GB) |
|--------------|--------------------|-------------|
| **WS1** | 1 | 3.5 |
| **WS2** | 2 | 7 |
| **WS3** | 4 | 14 |

> [!IMPORTANT]
>
> The following example is for illustration only and provides sample estimates to generally show how a pricing tier works. 
> For specific vCPU and memory pricing based on specific regions where Azure Logic Apps is available, review the 
> [Standard plan for a selected region on the Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/).
>
> Suppose that in an example region, the following resources have these hourly rates:
>
> | Resource | Hourly rate (example region) |
> |----------|-----------------------------|
> | **vCPU** | $0.192 per vCPU |
> | **Memory** | $0.0137 per GB |
>
> The following calculation provides an estimated monthly rate:
>
> <*monthly-rate*> = 730 hours (per month) * [(<*number-vCPU*> * <*hourly-rate-vCPU*>) + (<*number-GB-memory*> * <*hourly-rate-GB-memory*>)]
>
> Based on the preceding information, the following table shows the estimated monthly rates for each pricing tier and the resources in that pricing tier:
>
> | Pricing tier | Virtual CPU (vCPU) | Memory (GB) | Monthly rate (example region) |
> |--------------|--------------------|-------------|------------------------------|
> | **WS1** | 1 | 3.5 | $175.16 |
> | **WS2** | 2 | 7 | $350.33 |
> | **WS3** | 4 | 14 | $700.65 |

<a name="standard-operations"></a>

### Trigger and action operations in the Standard model

Except for the unlimited free built-in operations that a workflow can run, the Standard model meters and bills an operation based on *each call*, whether or not the overall workflow successfully runs, finishes, or is even instantiated. An operation usually makes a single execution [unless the operation has retry attempts enabled](#other-operation-behavior). In turn, an execution usually makes a single call [unless the operation supports and enables chunking or pagination to get large amounts of data](logic-apps-handle-large-messages.md). If chunking or pagination is enabled, an operation execution might have to make multiple calls. The Standard model meters and bills an operation *per call, not per execution*.

For example, suppose a workflow starts with a polling trigger that gets records by regularly making outbound calls to an endpoint. The outbound call is metered and billed, whether or not the trigger fires or is skipped. The trigger state controls whether or not the workflow instance is created and run. Now, suppose the operation also supports and has enabled chunking or pagination. If the operation has to make 10 calls to finish getting all the data, the operation is metered and billed *per call*.

The following table summarizes how the Standard model handles metering and billing for operation types when used with a logic app and workflow in single-tenant Azure Logic Apps:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime. In the designer, you can find these operations in the connector gallery under **Runtime** > **In-App**.  <p>For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The Standard model includes unlimited free built-in operations. <p><p>**Note**: Some managed connector operations are *also* available as built-in operations. While built-in operations are free, the Standard model still meters and bills managed connector operations using the [same *Standard* or *Enterprise* connector pricing as the Consumption model](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Managed connector*](../connectors/managed.md) | These operations run separately in shared global Azure. In the designer, you can find these operations in the connector gallery under **Runtime** > **Shared**. | The Standard model meters and bills managed connector operations based on the [same *Standard* and *Enterprise* connector pricing as the Consumption model](https://azure.microsoft.com/pricing/details/logic-apps/). <br><br>**Note**: Preview Enterprise connector operations follow the [Consumption *Standard* connector pricing](https://azure.microsoft.com/pricing/details/logic-apps/). |
| [*Custom connector*](../connectors/introduction.md#custom-connectors-and-apis) | Currently, you can create and use only [custom built-in connector operations](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272) in single-tenant based logic app workflows. | The Standard model includes unlimited free built-in operations. For limits on throughput and timeout, review [Custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). |

For more information about how the Standard model works with operations that run inside other operations such as loops, process multiple items such as arrays, and retry policies, review [Other operation behavior](#other-operation-behavior).

<a name="ise-pricing"></a>

## Integration service environment (ISE)

When you create a logic app using the **Logic App (Consumption)** resource type, and you deploy to a dedicated [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), the logic app and its workflow follow the [Integration Service Environment plan](https://azure.microsoft.com/pricing/details/logic-apps) for pricing and billing. This pricing model depends on your [ISE level or *SKU*](connect-virtual-network-vnet-isolated-environment-overview.md#ise-level) and differs from the Consumption plan in that you're billed for reserved capacity and dedicated resources whether or not you use them.

The following table summarizes how the ISE model handles metering and billing for capacity and other dedicated resources based on your ISE level or SKU:

| ISE SKU | Metering and billing |
|---------|----------------------|
| **Premium** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Premium SKU](https://azure.microsoft.com/pricing/details/logic-apps). If you need more throughput, you can [add more scale units](../logic-apps/ise-manage-integration-service-environment.md#add-capacity) when you create your ISE or afterwards. Each scale unit is billed at an [hourly rate that's roughly half the base unit rate](https://azure.microsoft.com/pricing/details/logic-apps). <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| **Developer** | The base unit has [fixed capacity](logic-apps-limits-and-config.md#integration-service-environment-ise) and is [billed at an hourly rate for the Developer SKU](https://azure.microsoft.com/pricing/details/logic-apps). However, this SKU has no service-level agreement (SLA), scale up capability, or redundancy during recycling, which means that you might experience delays or downtime. Backend updates might intermittently interrupt service. <p><p>**Important**: Make sure that you use this SKU only for exploration, experiments, development, and testing - not for production or performance testing. <p><p>For capacity and limits information, see [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |

The following table summarizes how the ISE model handles the following components when used with a logic app and a workflow in an ISE:

| Component | Description |
|-----------|-------------|
| Trigger and action operations | The ISE model includes free built-in, managed connector, and custom connector operations that your workflow can run, but subject to the [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise) and [custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). For more information, review [Trigger and action operations in the ISE model](#integration-service-environment-operations). |
| Storage operations | The ISE model includes free storage consumption, such as data retention. For more information, review [Storage operations](#storage-operations). |
| Integration accounts | The ISE model includes a single free integration account tier, based on your selected ISE SKU. For an [extra cost](https://azure.microsoft.com/pricing/details/logic-apps/), you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). For more information, review [Integration accounts](#integration-accounts). |

<a name="integration-service-environment-operations"></a>

### Trigger and action operations in the ISE model

The following table summarizes how the ISE model handles the following operation types when used with a logic app and workflow in an ISE:

| Operation type | Description | Metering and billing |
|----------------|-------------|----------------------|
| [*Built-in*](../connectors/built-in.md) | These operations run directly and natively with the Azure Logic Apps runtime and in the same ISE as your logic app workflow. In the designer, you can find these operations under the **Built-in** label, but each operation also displays the **CORE** label. <p>For example, the HTTP trigger and Request trigger are built-in triggers. The HTTP action and Response action are built-in actions. Other built-in operations include workflow control actions such as loops and conditions, data operations, batch operations, and others. | The ISE model includes these operations *for free*, but are subject to the [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| [*Managed connector*](../connectors/managed.md) | Whether *Standard* or *Enterprise*, managed connector operations run in either your ISE or multi-tenant Azure, based on whether the connector or operation displays the **ISE** label. <p><p>- **ISE** label: These operations run in the same ISE as your logic app and work without requiring the [on-premises data gateway](#data-gateway). <p><p>- No **ISE** label: These operations run in multi-tenant Azure. | The ISE model includes both **ISE** and no **ISE** labeled operations *for free*, but are subject to the [ISE limits in Azure Logic Apps](logic-apps-limits-and-config.md#integration-service-environment-ise). |
| [*Custom connector*](../connectors/introduction.md#custom-connectors-and-apis) | In the designer, you can find these operations under the **Custom** label. | The ISE model includes these operations *for free*, but are subject to [custom connector limits in Azure Logic Apps](logic-apps-limits-and-config.md#custom-connector-limits). |

For more information about how the ISE model works with operations that run inside other operations such as loops, process multiple items such as arrays, and retry policies, review [Other operation behavior](#other-operation-behavior).

<a name="other-operation-behavior"></a>

## Other operation behavior

The following table summarizes how the Consumption, Standard, and ISE models handle operations that run inside other operations such as loops, process multiple items such as arrays, and retry policies:

| Operation | Description | Consumption | Standard | ISE |
|-----------|-------------|-------------|----------|-----|
| [Loop actions](logic-apps-control-flow-loops.md) | A loop action, such as the **For each** or **Until** loop, can include other actions that run during each loop cycle. | Except for the initial number of included built-in operations, the loop action and each action in the loop are metered each time the loop cycle runs. If an action processes any items in a collection, such as a list or array, the number of items is also used in the metering calculation. <p><p>For example, suppose you have a **For each** loop with actions that process a list. The service multiplies the number of list items against the number of actions in the loop, and adds the action that starts the loop. So, the calculation for a 10-item list is (10 * 1) + 1, which results in 11 action executions. <p><p>Pricing is based on whether the operation types are built-in, Standard, or Enterprise. | Except for the included built-in operations, same as the Consumption model. | Not metered or billed. |
| [Retry policies](logic-apps-exception-handling.md#retry-policies) | On supported operations, you can implement basic exception and error handling by setting up a [retry policy](logic-apps-exception-handling.md#retry-policies). | Except for the initial number of built-in operations, the original execution plus each retried execution are metered. For example, an action that executes with 5 retries is metered and billed as 6 executions. <p><p>Pricing is based on whether the operation types are built-in, Standard, or Enterprise. | Except for the built-in included operations, same as the Consumption model. | Not metered or billed. |

<a name="storage-operations"></a>

## Storage operations

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any required storage transactions, such as using queues for scheduling trigger operations or using tables and blobs for storing workflow states. Based on the operations in your workflow, storage costs vary because different triggers, actions, and payloads result in different storage operations and needs. The service also saves and stores inputs and outputs from your workflow's run history, based on the logic app resource's [run history retention limit](logic-apps-limits-and-config.md#run-duration-retention-limits). You can manage this retention limit at the logic app resource level, not the workflow level.

The following table summarizes how the Consumption, Standard, and ISE models handle metering and billing for storage operations:

| Model | Description | Metering and billing |
|-------|-------------|----------------------|
| Consumption (multi-tenant) | Storage resources and usage are attached to the logic app resource. | Metering and billing *apply only to data retention-related storage consumption* and follow the [data retention pricing for the Consumption plan](https://azure.microsoft.com/pricing/details/logic-apps). |
| Standard (single-tenant) | You can use your own Azure [storage account](../azure-functions/storage-considerations.md#storage-account-requirements), which gives you more control and flexibility over your workflow's data. |  Metering and billing follow the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs appear separately on your Azure billing invoice. <p><p>**Tip**: To help you better understand the number of storage operations that a workflow might run and their cost, try using the [Logic Apps Storage calculator](https://logicapps.azure.com/calculator). Select either a sample workflow or use an existing workflow definition. The first calculation estimates the number of storage operations in your workflow. You can then use these numbers to estimate possible costs using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). For more information, review [Estimate storage needs and costs for workflows in single-tenant Azure Logic Apps](estimate-storage-costs.md). |
| Integration service environment (ISE) | Storage resources and usage are attached to the logic app resource. | Not metered or billed. |

For more information, review the following documentation:

* [View metrics for executions and storage usage](plan-manage-costs.md#monitor-billing-metrics)
* [Limits in Azure Logic Apps](logic-apps-limits-and-config.md)

<a name="data-gateway"></a>

## On-premises data gateway

The [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) is a separate Azure resource that you create so that your logic app workflows can access on-premises data by using specific gateway-supported connectors. The gateway resource itself doesn't incur charges, but operations that run through the gateway incur charges, based on the pricing and billing model used by your logic app.

<a name="integration-accounts"></a>

## Integration accounts

An [integration account](logic-apps-enterprise-integration-create-integration-account.md) is a separate Azure resource that you create as a container to define and store business-to-business (B2B) artifacts such as trading partners, agreements, schemas, maps, and so on. After you create this account and define these artifacts, link this account to your logic app so that you can use these artifacts and various B2B operations in workflows to explore, build, and test integration solutions that use [EDI](logic-apps-enterprise-integration-b2b.md) and [XML processing](logic-apps-enterprise-integration-xml.md) capabilities.

The following table summarizes how the Consumption, Standard, and ISE models handle metering and billing for integration accounts:

| Model | Metering and billing |
|-------|----------------------|
| Consumption (multi-tenant) | Metering and billing use the [integration account pricing](https://azure.microsoft.com/pricing/details/logic-apps/), based on the account tier that you use. |
| Standard (single-tenant) | Metering and billing use the [integration account pricing](https://azure.microsoft.com/pricing/details/logic-apps/), based on the account tier that you use. |
| ISE | This model includes a single integration account, based on your ISE SKU. For an [extra cost](https://azure.microsoft.com/pricing/details/logic-apps/), you can create more integration accounts for your ISE to use up to the [total ISE limit](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits). |

For more information, review the following documentation:

* [Create and manage integration accounts](logic-apps-enterprise-integration-create-integration-account.md)
* [Integration account limits in Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits)

## Other items not metered or billed

Across all pricing models, the following items aren't metered or billed:

* Actions that didn't run because the workflow stopped before completion
* Disabled logic apps or workflows because they can't create new instances while they're inactive.

## Next steps

* [Plan and manage costs for Azure Logic Apps](plan-manage-costs.md)
