---
title: Overview for Azure Logic Apps (Preview)
description: Overview about building stateless or stateful automation workflows with Azure Logic Apps (Preview) that help you integrate apps, data, cloud services, and on-premises systems
services: logic-apps
ms.suite: integration
ms.reviewer: deli, sopai, jonfan, logicappspm
ms.topic: conceptual
ms.date: 11/10/2020
---

# Overview for Azure Logic Apps Preview

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and 
> is not recommended for production workloads. Certain features might not be supported or might 
> have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To create logic app workflows that integrate across apps, data, cloud services, and systems, you can build and run [*stateful* and *stateless* logic app workflows](#stateful-stateless)either in the Azure portal or in Visual Studio Code with the new Azure Logic Apps (Preview) extension. When you use Visual Studio Code, you can locally build and run these workflows in your development environment. The logic apps that you create with the new **Logic App (Preview)** resource type, which is powered by [Azure Functions](../azure-functions/functions-overview.md). This new resource type can include multiple workflows and is similar in some ways to the **Function App** resource type, which can include multiple functions.

<a name="stateful-stateless"></a>

## Stateful versus stateless

* *Stateful*

  Create stateful logic apps when you need to keep, review, or reference data from previous events. These logic apps keep the input and output for each action and their workflow states in external storage, which makes reviewing the run details and history possible after each run finishes. Stateful logic apps provide high resiliency if or when outages happen. After services and systems are restored, you can reconstruct interrupted logic app runs from the saved state and rerun the logic apps to completion. Stateful workflows can continue running for up to a year.

* *Stateless*

  Create stateless logic apps when you don't need to save, review, or reference data from previous events in external storage for later review. These logic apps keep the input and output for each action and their workflow states only in memory, rather than transfer this information to external storage. As a result, stateless logic apps have shorter runs that are usually no longer than 5 minutes, faster performance with quicker response times, higher throughput, and reduced running costs because the run details and history aren't kept in external storage. However, if or when outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. These logic apps can only run synchronously and for easier debugging, you can [enable run history](#run-history), which has some impact on performance.

  Stateless workflows currently support only *actions* for [managed connectors](../connectors/apis-list.md#managed-api-connectors), which are deployed in Azure, and not triggers. To start your workflow, select the [built-in Request, Event Hubs, or Service Bus trigger](../connectors/apis-list.md#built-ins), which run natively with the Logic Apps runtime. For more information about unsupported triggers, actions, and connectors, see [Unsupported or unavailable capabilities](#unsupported).

For information about how nested logic apps behave differently between stateful and stateless logic apps, see [Nested behavior differences between stateful and stateless logic apps](#nested-behavior).

<a name="whats-new"></a>

## What's in this public preview?

Azure Logic Apps (Preview) brings many current and additional Logic Apps capabilities, for example:

* Build logic apps for integration and automation workflows from [390+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * Some managed connectors such as Azure Service Bus, Azure Event Hubs, and SQL Server run similarly to built-in native triggers and actions such as the HTTP action.

  * Create and deploy logic apps that can run anywhere because the Azure Logic Apps service generates Shared Access Signature (SAS) connection strings that these logic apps can use for sending requests to the cloud connection runtime endpoint. The Logic Apps service saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy in Azure.

    > [!NOTE]
    > By default, a **Logic App (Preview)** resource has its [system-assigned managed identity](../logic-apps/create-managed-service-identity.md) 
    > automatically enabled to authenticate connections at runtime. This identity differs from the authentication credentials or connection string 
    > that you use when you create a connection. If you disable this identity, connections won't work at runtime.

* Create stateless logic apps that run only in memory so that they finish more quickly, respond faster, have higher throughput, and cost less to run because the run histories and data between actions don't persist in external storage. Optionally, you can enable run history for easier debugging. For more information, see [Stateful versus stateless logic apps](#stateful-stateless).

* Publish and deploy your logic apps to various hosting environments, such as [Azure App Service](../app-service/environment/intro.md) and [Docker containers](/dotnet/core/docker/introduction).

> [!NOTE]
> For information about current known issues, review the preview extension's 
> [Known Issues GitHub page](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md).

<a name="pricing-model"></a>

## Pricing model

Whether you create the new **Logic App (Preview)** resource type in the Azure portal or deploy the new resource type from Visual Studio Code, you're prompted to select a hosting plan, specifically the [App Service plan or Premium plan](../azure-functions/functions-scale.md) to use as the pricing model. If you select the App Service plan, you're also prompted to select a [pricing tier](../app-service/overview-hosting-plans.md). During public preview, running logic apps on App Service doesn't incur *additional* charges on top of the selected plan.

Stateful logic apps use [external storage](../azure-functions/functions-scale.md#storage-account-requirements), so the Azure Storage pricing model applies to storage transactions that the Azure Logic Apps runtime performs. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states.

For more information about the pricing models that apply to this new resource type, review these topics:

* [Azure Functions scale and hosting](../azure-functions/functions-scale.md)
* [Scale up an in Azure App Service](../app-service/manage-scale-up.md)
* [Azure Functions pricing details](https://azure.microsoft.com/pricing/details/functions/)
* [App Service pricing details](https://azure.microsoft.com/pricing/details/app-service/windows/)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

<a name="unsupported"></a>

## Unavailable or unsupported capabilities

For this public preview, these capabilities are not available or not supported:

* Support for creating the new **Logic App (Preview)** resource is currently unavailable on macOS.

* Not all Azure regions are supported yet. For currently available regions, check the [regions list](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md#available-regions).

* To start your workflow, use the [built-in Request, HTTP, Event Hubs, or Service Bus trigger](../connectors/apis-list.md), which run natively with the Logic Apps runtime. Currently, [enterprise connectors](../connectors/apis-list.md#enterprise-connectors), [on-premises data gateway triggers](../connectors/apis-list.md#on-premises-connectors), webhook-based triggers, Sliding Window trigger, [custom connectors](../connectors/apis-list.md#custom-apis-and-connectors), integration accounts, their artifacts, and [their connectors](../connectors/apis-list.md#integration-account-connectors) aren't supported in this preview. The "call an Azure function" capability is unavailable, so for now, use the HTTP *action* to call the request URL for the Azure function.

  Except for the previously specified triggers, *stateful* workflows can use both triggers and actions for [managed connectors](../connectors/apis-list.md#managed-api-connectors), which are deployed in Azure versus built-in triggers and actions that run natively with the Logic Apps runtime. However, *stateless* workflows currently support only *actions* for managed connectors, not triggers. Although you can enable connectors in Azure for your stateless workflow, the designer doesn't show any managed connector triggers for you to select.

* Whether you create a new **Logic App (Preview)** resource type in the Azure portal or deploy from Visual Studio Code, you can only use the [Premium or App Service hosting plan in Azure](#publish-azure). **Consumption** hosting plans aren't supported nor available for deploying this resource type. You can deploy from Visual Studio Code to a [Docker container](#deploy-docker), but not [integration service environments (ISEs)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md).

<a name="nested-behavior"></a>

## Nested behavior differences between stateful and stateless logic apps

You can [make a logic app workflow callable](../logic-apps/logic-apps-http-endpoint.md) from other logic app workflows that exist in the same **Logic App (Preview)** resource by using the [Request](../connectors/connectors-native-reqres.md) trigger, [HTTP Webhook](../connectors/connectors-native-webhook.md) trigger, or managed connector triggers that have the [ApiConnectionWehook type](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

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

## Limits

Although many [existing limits for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md) are the same for this resource type, here are the differences in this public preview extension:

* Managed connectors: 50 requests per minute per connection

* For the [Inline Code action for JavaScript](../logic-apps/logic-apps-add-run-inline-code.md) action, these limits have changed:

  * The limit on code characters increases from 1,024 characters to 100,000 characters.

  * The limit on time to run the code increases from five seconds to 15 seconds.
