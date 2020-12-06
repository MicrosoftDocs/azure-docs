---
title: Overview for Azure Logic Apps (Preview)
description: Learn about building stateless and stateful automated workflows by using Azure Logic Apps (Preview) for integration and automation scenarios
services: logic-apps
ms.suite: integration
ms.reviewer: deli, sopai, logicappspm
ms.topic: conceptual
ms.date: 12/07/2020
---

# Overview for Azure Logic Apps Preview

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and 
> is not recommended for production workloads. Certain features might not be supported or might 
> have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create logic apps that integrate across apps, data, cloud services, and systems, you can build and run [*stateful* and *stateless* workflows](#stateful-stateless) by using the new **Logic App (Preview)** resource type, which is powered by [Azure Functions](../azure-functions/functions-overview.md). This new logic app type can include multiple workflows and run anywhere that Azure Functions runs. In some ways, the **Logic App (Preview)** resource type is similar to the **Function App** resource type, which can include multiple functions.

You can create logic apps from this resource type either by using the Azure portal or by using Visual Studio Code with the Azure Logic Apps (Preview) extension. When you use Visual Studio Code, you can locally build and run these workflows in your development environment. Whether you use the portal or Visual Studio Code, you can deploy your app to various hosting environments such as Azure and Docker containers.

This article provides an overview about how [stateful and stateless](#stateful-stateless) workflows differ from each other, [what's new in this public preview](#whats-new), how the [pricing model](#pricing-model) works, and various other aspects about the **Logic App (Preview)** resource type.

For more information, see these topics:

* [Create stateful or stateless workflows in the Azure portal](create-stateful-stateless-workflows-azure-portal.md)
* [Create stateful or stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md)
* [Integrations on Azure blog: "Azure Logic Apps Running Anywhere - Runtime Deep Dive"](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564)
* [Logic Apps Public Preview Known Issues (GitHub)](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md)

<a name="stateful-stateless"></a>

## Stateful versus stateless workflows

* *Stateful*

  Create stateful workflows when you need to keep, review, or reference data from previous events. These workflows save the inputs and outputs for each action and their states in external storage, which makes reviewing the run details and history possible after each run finishes. Stateful workflows provide high resiliency if outages happen. After services and systems are restored, you can reconstruct interrupted runs from the saved state and rerun the workflows to completion. Stateful workflows can continue running for up to a year.

* *Stateless*

  Create stateless workflows when you don't need to save, review, or reference data from previous events in external storage for later review. These workflows save the inputs and outputs for each action and their states *only in memory*, rather than transferring this data to external storage. As a result, stateless workflows have shorter runs that are typically no longer than 5 minutes, faster performance with quicker response times, higher throughput, and reduced running costs because the run details and history aren't kept in external storage. However, if outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. These workflows can only run synchronously.

  For easier debugging, you can enable run history for a stateless workflow, which has some impact on performance, and then disable the run history when you're done. For more information, see [Create stateful or stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#enable-run-history-stateless) or [Create stateful or stateless workflows in the Azure portal](create-stateful-stateless-workflows-visual-studio-code.md#enable-run-history-stateless).

  > [!NOTE]
  > Stateless workflows currently support only *actions* for 
  > [managed connectors](../connectors/apis-list.md#managed-api-connectors), 
  > which are deployed in Azure, and not triggers. To start your workflow, 
  > select either the [built-in Request, Event Hubs, or Service Bus trigger](../connectors/apis-list.md#built-ins). 
  > These triggers run natively in the Logic Apps runtime. For more information about unsupported triggers, actions, 
  > and connectors, see [Limited, unsupported, or unavailable capabilities](#unsupported-unavailable).

For information about how nested logic apps behave differently between stateful and stateless logic apps, see [Nested behavior differences between stateful and stateless logic apps](#nested-behavior).

<a name="whats-new"></a>

## What's in this public preview?

Azure Logic Apps (Preview) includes many current and additional capabilities, for example:

* Create logic apps and build workflows from [390+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * Some managed connectors such as Azure Service Bus, Azure Event Hubs, and SQL Server run similarly to built-in triggers and actions, which are native to the Logic Apps runtime, for example, the Request trigger and HTTP action. For more information, see [Azure Logic Apps Running Anywhere - Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272).

  * You can use the B2B actions for Liquid Operations and XML Operations without an integration account. To use these actions, you need to have Liquid maps, XML maps, or XML schemas that you can upload through the respective actions in the Azure portal or add to your Visual Studio Code project's **Artifacts** folder using the respective **Maps** and **Schemas** folders.

  * Create and deploy logic apps that can run anywhere because the Azure Logic Apps service generates Shared Access Signature (SAS) connection strings that these logic apps can use for sending requests to the cloud connection runtime endpoint. The Logic Apps service saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy in Azure.

    > [!NOTE]
    > By default, a **Logic App (Preview)** resource has its [system-assigned managed identity](../logic-apps/create-managed-service-identity.md) 
    > automatically enabled to authenticate connections at runtime. This identity differs from the authentication 
    > credentials or connection string that you use when you create a connection. If you disable this identity, 
    > connections won't work at runtime. To view this setting, on your logic app's menu, under **Settings**, select **Identity**.

* Create stateless logic apps that run only in memory so that they finish more quickly, respond faster, have higher throughput, and cost less to run because the run histories and data between actions don't persist in external storage. Optionally, you can enable run history for easier debugging. For more information, see [Stateful versus stateless logic apps](#stateful-stateless).

* Locally run, test, and debug your logic apps in the Visual Studio Code development environment.

* Directly publish or deploy logic apps from Visual Studio Code to various hosting environments such as Azure and [Docker containers](/dotnet/core/docker/introduction).

* Enable diagnostics logging and tracing capabilities for your logic app by using [Application Insights](../azure-monitor/app/app-insights-overview.md) when supported by your Azure subscription and logic app settings.

> [!NOTE]
> For information about current known issues, review the [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md).

<a name="pricing-model"></a>

## Pricing model

Whether you create the new **Logic App (Preview)** resource type in the Azure portal or deploy the new resource type from Visual Studio Code, you select a hosting plan to use for pricing, specifically the [App Service plan or Premium plan](../azure-functions/functions-scale.md). If you select the App Service plan, you're also prompted to select a [pricing tier](../app-service/overview-hosting-plans.md). During public preview, running logic apps on App Service doesn't incur *additional* charges on top of the selected plan.

Stateful logic apps use [external storage](../azure-functions/functions-scale.md#storage-account-requirements), so the Azure Storage pricing model applies to storage transactions that the Azure Logic Apps runtime performs. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states.

For more information about the pricing models that apply to this new resource type, review these topics:

* [Azure Functions scale and hosting](../azure-functions/functions-scale.md)
* [Scale up an app in Azure App Service](../app-service/manage-scale-up.md)
* [Azure Functions pricing details](https://azure.microsoft.com/pricing/details/functions/)
* [App Service pricing details](https://azure.microsoft.com/pricing/details/app-service/)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

<a name="unsupported-unavailable"></a>

## Limited, unavailable, or unsupported capabilities

In this public preview, these capabilities are currently limited, unsupported, or unavailable:

* **Triggers and actions**: Some built-in triggers are unavailable, such as Sliding Window and Batch. To start your workflow, use the [built-in Recurrence, Request, HTTP, HTTP Webhook, Event Hubs, or Service Bus trigger](../connectors/apis-list.md). Built-in triggers and actions run natively in the Logic Apps runtime, while managed connectors are deployed in Azure. In the designer, built-in triggers and actions appear under the **Built-in** tab, while managed connector triggers and actions appear under the **Azure** tab.

  > [!NOTE]
  > To run locally in Visual Studio Code, webhook-based triggers and actions require additional setup. For more information, see 
  > [Create stateful or stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#webhook-setup).

  * For *stateless workflows*, the **Azure** tab doesn't appear when you select a trigger because you can select only [managed connector *actions*, not triggers](../connectors/apis-list.md#managed-api-connectors). Although you can enable Azure-deployed managed connectors for stateless workflows, the designer doesn't show any managed connector triggers for you to add.

  * For *stateful workflows*, other than the triggers and actions listed below, both [managed connector triggers and actions](../connectors/apis-list.md#managed-api-connectors) are available for you to use.

  * These triggers and actions are currently limited, unsupported, or unavailable:

    * [On-premises data gateway *triggers*](../connectors/apis-list.md#on-premises-connectors) are unavailable, but gateway actions *are* available.

    * [Custom connectors](../connectors/apis-list.md#custom-apis-and-connectors) are unavailable.

    * The Azure Functions action, **Choose an Azure function**, works only for functions that are created from the **HTTP Trigger** template.

    * If you use Visual Studio Code with the preview extension on macOS, the Inline Code action, **Execute JavaScript Code**, is unavailable.

    * Some built-in [B2B triggers and actions for integration accounts](../connectors/apis-list.md#integration-account-connectors) are unavailable, such as the Flat File Encoding and Decoding actions.

* **Hosting plan availability**: Whether you create a new **Logic App (Preview)** resource type in the Azure portal or deploy from Visual Studio Code, you can only use the Premium or App Service hosting plan in Azure. **Consumption** hosting plans aren't supported nor available for deploying this resource type. You can deploy from Visual Studio Code to a Docker container, but not to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md).

* **Parallel branches**: Currently, you can't add parallel branches through the new designer experience. However, you can still add these branches through the original designer experience and have them appear in the new designer.

  1. At the bottom of the designer, disable the new experience by selecting the **New Canvas** control.

  1. Add the parallel branches to your workflow.

  1. Enable the new experience by selecting the **New Canvas** control again.

* **Zoom control**: The zoom control is currently unavailable on the designer.

<a name="nested-behavior"></a>

## Nested behavior differences between stateful and stateless logic apps

You can [make a logic app workflow callable](../logic-apps/logic-apps-http-endpoint.md) from other logic app workflows that exist in the same **Logic App (Preview)** resource by using the [Request trigger](../connectors/connectors-native-reqres.md), [HTTP Webhook trigger](../connectors/connectors-native-webhook.md), or managed connector triggers that have the [ApiConnectionWebhook type](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

Here are the behavior patterns that nested logic app workflows can follow after a parent workflow calls a child workflow:

* Asynchronous polling pattern

  The parent doesn't wait for a response to their initial call, but continually checks the child's run history until the child finishes running. By default, stateful workflows follow this pattern, which is ideal for long-running child workflows that might exceed [request timeout limits](../logic-apps/logic-apps-limits-and-config.md).

* Synchronous pattern ("fire and forget")

  The child acknowledges the call by immediately returning a `202 ACCEPTED` response, and the parent continues to the next action without waiting for the results from the child. Instead, the parent receives the results when the child finishes running. Child stateful workflows that don't include a Response action always follow the synchronous pattern. For child stateful workflows, the run history is available for you to review.

  To enable this behavior, in the workflow's JSON definition, set the `operationOptions` property to `DisableAsyncPattern`. For more information, see [Trigger and action types - Operation options](../logic-apps/logic-apps-workflow-actions-triggers.md#operation-options).

* Trigger and wait

  For a child stateless workflow, the parent waits for a response that returns the results from the child. This pattern works similar to using the built-in [HTTP trigger or action](../connectors/connectors-native-http.md) to call a child workflow. Child stateless workflows that don't include a Response action immediately return a `202 ACCEPTED` response, but the parent waits for the child to finish before continuing to the next action. These behaviors apply only to child stateless workflows.

This table specifies the child workflow's behavior based on whether the parent and child are stateful, stateless, or are mixed workflow types:

| Parent workflow | Child workflow | Child behavior |
|-----------------|----------------|----------------|
| Stateful | Stateful | Asynchronous or synchronous with `"operationOptions": "DisableAsyncPattern"` setting |
| Stateful | Stateless | Trigger and wait |
| Stateless | Stateful | Synchronous |
| Stateless | Stateless | Trigger and wait |
||||

<a name="limits"></a>

## Limits

Although many [existing limits for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md) are the same for this resource type, here are the differences in this public preview extension:

* Managed connectors: 50 requests per minute per connection

* For the [Inline Code action for JavaScript](../logic-apps/logic-apps-add-run-inline-code.md) action, these limits have changed:

  * The limit on code characters increases from 1,024 characters to 100,000 characters.

  * The limit on time to run the code increases from five seconds to 15 seconds.

## Next steps

* [Create stateful or stateless workflows in the Azure portal](create-stateful-stateless-workflows-azure-portal.md)
* [Create stateful or stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md)
* [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md)