---
title: Overview for Azure Logic Apps Preview
description: Azure Logic Apps Preview is a cloud solution for building automated, single-tenant, stateful, and stateless workflows that integrate apps, data, services, and systems with minimal code for enterprise-level scenarios.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, az-logic-apps-dev
ms.topic: conceptual
ms.date: 03/24/2021
---

# Overview: Azure Logic Apps Preview

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and is not recommended for production 
> workloads. Certain features might not be supported or might have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With Azure Logic Apps Preview, you can build automation and integration solutions across apps, data, cloud services, and systems by creating and running single-tenant logic apps with the new **Logic App (Preview)** resource type. Using this single-tenant logic app type, can build multiple [*stateful* and *stateless* workflows](#stateful-stateless) that are powered by the redesigned Azure Logic Apps Preview runtime, which provides portability, better performance, and flexibility for deploying and running in various hosting environments, including not only Azure, but also Docker containers.

How is this possible? The redesigned runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This architecture means that you can run the single-tenant logic app type anywhere that Azure Functions runs. You can host the redesigned runtime on almost any network topology, and choose any available compute size to handle the necessary workload that's required by your workflows. For more information, see [Introduction to Azure Functions](../azure-functions/functions-overview.md) and [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md).

You can create the **Logic App (Preview)** resource either by [starting in the Azure portal](create-stateful-stateless-workflows-azure-portal.md) or by [creating a project in Visual Studio Code with the Azure Logic Apps (Preview) extension](create-stateful-stateless-workflows-visual-studio-code.md). Also, in Visual Studio Code, you can build *and locally run* your workflows in your development environment. Whether you use the portal or Visual Studio Code, you can deploy and run the single-tenant logic app type in the same kinds of hosting environments.

This overview covers the following areas:

* [Differences between Azure Logic Apps Preview, the Azure Logic Apps multi-tenant environment, and the integration service environment](#preview-differences).

* [Differences between stateful and stateless workflows](#stateful-stateless), including behavior differences between [nested stateful and stateless workflows](#nested-behavior).

* [Capabilities in this public preview](#public-preview-contents).

* [How the pricing model works](#pricing-model).

* [Changed, limited, unavailable, or unsupported capabilities](#limited-unavailable-unsupported).

* [Limits in Azure Logic Apps Preview](#limits).

For more information, review these other topics:

* [Azure Logic Apps Running Anywhere - Runtime Deep Dive](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564)

* [Logic Apps Public Preview Known Issues (GitHub)](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md)

<a name="preview-differences"></a>

## How does Azure Logic Apps Preview differ?

The Azure Logic Apps Preview runtime uses [Azure Functions](../azure-functions/functions-overview.md) extensibility and is hosted as an extension on the Azure Functions runtime. This architecture means you can run the single-tenant logic app type anywhere that Azure Functions runs. You can host the Azure Logic Apps Preview runtime on almost any network topology that you want, and choose any available compute size to handle the necessary workload that your workflow needs. For more information about Azure Functions extensibility, see [WebJobs SDK: Creating custom input and output bindings](https://github.com/Azure/azure-webjobs-sdk/wiki/Creating-custom-input-and-output-bindings).

With this new approach, the Azure Logic Apps Preview runtime and your workflows are both part of your app that you can package together. This capability lets you deploy and run your workflows by simply copying artifacts to the hosting environment and starting your app. This approach also provides a more standardized experience for building deployment pipelines around the workflow projects for running the required tests and validations before you deploy changes to production environments. For more information, see [Azure Logic Apps Running Anywhere - Runtime Deep Dive](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564).

The following table briefly summarizes the differences in the way that workflows share resources, based on the environment where they run. For differences in limits, see [Limits in Azure Logic Apps Preview](#limits).

| Environment | Resource sharing and consumption |
|-------------|----------------------------------|
| Azure Logic Apps (Multi-tenant) | Workflows *from customers across multiple tenants* share the same processing (compute), storage, network, and so on. |
| Azure Logic Apps (Preview, single-tenant) | Workflows *in the same logic app and a single tenant* share the same processing (compute), storage, network, and so on. |
| Integration service environment (unavailable in Preview) | Workflows in the *same environment* share the same processing (compute), storage, network, and so on. |
|||

Meanwhile, you can still create the multi-tenant logic app type in the Azure portal and in Visual Studio Code by using the multi-tenant Azure Logic Apps extension. Although the development experiences differ between the multi-tenant and single-tenant logic app types, your Azure subscription can include both types. You can view and access all the deployed logic apps in your Azure subscription, but the apps are organized in their own categories and sections.

<a name="stateful-stateless"></a>

## Stateful and stateless workflows

With the single-tenant logic app type, you can create these workflow types within the same logic app:

* *Stateful*

  Create stateful workflows when you need to keep, review, or reference data from previous events. These workflows save the inputs and outputs for each action and their states in external storage, which makes reviewing the run details and history possible after each run finishes. Stateful workflows provide high resiliency if outages happen. After services and systems are restored, you can reconstruct interrupted runs from the saved state and rerun the workflows to completion. Stateful workflows can continue running for up to a year.

* *Stateless*

  Create stateless workflows when you don't need to save, review, or reference data from previous events in external storage for later review. These workflows save the inputs and outputs for each action and their states *only in memory*, rather than transferring this data to external storage. As a result, stateless workflows have shorter runs that are typically no longer than 5 minutes, faster performance with quicker response times, higher throughput, and reduced running costs because the run details and history aren't kept in external storage. However, if outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. These workflows can only run synchronously.

  For easier debugging, you can enable run history for a stateless workflow, which has some impact on performance, and then disable the run history when you're done. For more information, see [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#enable-run-history-stateless) or [Create stateful and stateless workflows in the Azure portal](create-stateful-stateless-workflows-visual-studio-code.md#enable-run-history-stateless).

  > [!NOTE]
  > Stateless workflows currently support only *actions* for [managed connectors](../connectors/managed.md), 
  > which are deployed in Azure, and not triggers. To start your workflow, select either the 
  > [built-in Request, Event Hubs, or Service Bus trigger](../connectors/built-in.md). 
  > These triggers run natively in the Azure Logic Apps Preview runtime. For more information about limited, 
  > unavailable, or unsupported triggers, actions, and connectors, see 
  > [Changed, limited, unavailable, or unsupported capabilities](#limited-unavailable-unsupported).

<a name="nested-behavior"></a>

### Nested behavior differences between stateful and stateless workflows

You can [make a workflow callable](../logic-apps/logic-apps-http-endpoint.md) from other workflows that exist in the same **Logic App (Preview)** resource by using the [Request trigger](../connectors/connectors-native-reqres.md), [HTTP Webhook trigger](../connectors/connectors-native-webhook.md), or managed connector triggers that have the [ApiConnectionWebhook type](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

Here are the behavior patterns that nested workflows can follow after a parent workflow calls a child workflow:

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

<a name="public-preview-contents"></a>

## Capabilities

Azure Logic Apps Preview includes many current and additional capabilities, for example:

* Create logic apps and their workflows from [400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * Some managed connectors are now available as built-in versions, which run similarly to the built-in triggers and actions, such as the Request trigger and HTTP action, that run natively on the Azure Logic Apps Preview runtime. For example, these new built-in connectors include Azure Service Bus, Azure Event Hubs, SQL Server, and MQ.

    > [!NOTE]
    > For the built-in SQL Server connector , only the **Execute Query** action can directly connect to Azure 
    > virtual networks without requiring the [on-premises data gateway](logic-apps-gateway-connection.md).

  * Create your own built-in connectors for any service you need by using the [preview release's extensibility framework](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272). Similar to built-in connectors such as Azure Service Bus and SQL Server, but unlike [custom connectors](../connectors/apis-list.md#custom-apis-and-connectors) that aren't currently supported for preview, these connectors provide higher throughput, low latency, local connectivity, and run natively in the same process as the preview runtime.

    The authoring capability is currently available only in Visual Studio Code, but isn't enabled by default. To create these connectors, [switch your project from extension bundle-based (Node.js) to NuGet package-based (.NET)](create-stateful-stateless-workflows-visual-studio-code.md#enable-built-in-connector-authoring). For more information, see [Azure Logic Apps Running Anywhere - Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272).

  * You can use the B2B actions for Liquid Operations and XML Operations without an integration account. To use these actions, you need to have Liquid maps, XML maps, or XML schemas that you can upload through the respective actions in the Azure portal or add to your Visual Studio Code project's **Artifacts** folder using the respective **Maps** and **Schemas** folders.

  * Create and deploy logic apps that can run anywhere because the Azure Logic Apps service generates Shared Access Signature (SAS) connection strings that these logic apps can use for sending requests to the cloud connection runtime endpoint. The Logic Apps service saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy in Azure.

    > [!NOTE]
    > By default, a **Logic App (Preview)** resource has its [system-assigned managed identity](../logic-apps/create-managed-service-identity.md) 
    > automatically enabled to authenticate connections at runtime. This identity differs from the authentication 
    > credentials or connection string that you use when you create a connection. If you disable this identity, 
    > connections won't work at runtime. To view this setting, on your logic app's menu, under **Settings**, select **Identity**.

* Create logic apps with stateless workflows that run only in memory so that they finish more quickly, respond faster, have higher throughput, and cost less to run because the run histories and data between actions don't persist in external storage. Optionally, you can enable run history for easier debugging. For more information, see [Stateful versus stateless logic apps](#stateful-stateless).

* Locally run, test, and debug your logic apps and their workflows in the Visual Studio Code development environment.

  Before you run and test your logic app, you can make debugging easier by adding and using breakpoints inside the **workflow.json** file for a workflow. However, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#manage-breakpoints).

* Directly publish or deploy logic apps and their workflows from Visual Studio Code to various hosting environments such as Azure and [Docker containers](/dotnet/core/docker/introduction).

* Enable diagnostics logging and tracing capabilities for your logic app by using [Application Insights](../azure-monitor/app/app-insights-overview.md) when supported by your Azure subscription and logic app settings.

* Access networking capabilities, such as connect and integrate privately with Azure virtual networks, similar to Azure Functions when you create and deploy your logic apps using the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md). For more information, review these topics:

  * [Azure Functions networking options](../azure-functions/functions-networking-options.md)

  * [Azure Logic Apps Running Anywhere - Networking possibilities with Azure Logic Apps Preview](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

* Regenerate access keys for managed connections used by individual workflows in the single-tenant **Logic App (Preview)** resource. For this task, [follow the same steps for the multi-tenant **Logic Apps** resource but at the individual workflow level](logic-apps-securing-a-logic-app.md#regenerate-access-keys), not the logic app resource level.

* Add parallel branches in the single-tenant designer by following the same steps as the multi-tenant designer.

For more information, see [Changed, limited, unavailable, and unsupported capabilities](#limited-unavailable-unsupported) and the [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md).

<a name="pricing-model"></a>

## Pricing model

When you create the single-tenant logic app type in the Azure portal or deploy from Visual Studio Code, you must choose a hosting plan, either [App Service or Premium](../azure-functions/functions-scale.md), for your logic app to use. This plan determines the pricing model that applies to running your logic app. If you select the App Service plan, you must also choose a [pricing tier](../app-service/overview-hosting-plans.md).

*Stateful* workflows use [external storage](../azure-functions/storage-considerations.md#storage-account-requirements), so the [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/) applies to storage transactions that the Azure Logic Apps Preview runtime performs. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states.

> [!NOTE]
> During public preview, running logic apps on App Service doesn't incur *additional* charges on top of your selected plan.

For more information about the pricing models that apply to the single-tenant resource type, review these topics:

* [Azure Functions scale and hosting](../azure-functions/functions-scale.md)
* [Scale up an app in Azure App Service](../app-service/manage-scale-up.md)
* [Azure Functions pricing details](https://azure.microsoft.com/pricing/details/functions/)
* [App Service pricing details](https://azure.microsoft.com/pricing/details/app-service/)
* [Azure Storage pricing details](https://azure.microsoft.com/pricing/details/storage/)

<a name="limited-unavailable-unsupported"></a>

## Changed, limited, unavailable, or unsupported capabilities

In Azure Logic Apps Preview, these capabilities have changed, or they are currently limited, unavailable, or unsupported:

* **OS support**: Currently, the designer in Visual Studio Code doesn't work on Linux OS, but you can still deploy logic apps that use the Logic Apps Preview runtime to Linux-based virtual machines. For now, you can build your logic apps in Visual Studio Code on Windows or macOS and then deploy to a Linux-based virtual machine.

* **Triggers and actions**: Built-in triggers and actions run natively in the Azure Logic Apps Preview runtime, while managed connectors are deployed in Azure. Some built-in triggers are unavailable, such as Sliding Window and Batch.

  To start your workflow, use the [built-in Recurrence, Request, HTTP, HTTP Webhook, Event Hubs, or Service Bus trigger](../connectors/apis-list.md). In the designer, built-in triggers and actions appear under the **Built-in** tab, while managed connector triggers and actions appear under the **Azure** tab.

  > [!NOTE]
  > To run locally in Visual Studio Code, webhook-based triggers and actions require additional setup. For more information, see 
  > [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#webhook-setup).

  * For *stateless workflows*, the **Azure** tab doesn't appear when you select a trigger because you can select only [managed connector *actions*, not triggers](../connectors/managed.md). Although you can enable Azure-deployed managed connectors for stateless workflows, the designer doesn't show any managed connector triggers for you to add.

  * For *stateful workflows*, other than the triggers and actions that are listed as unavailable below, both [managed connector triggers and actions](../connectors/managed.md) are available for you to use.

  * These triggers and actions have either changed or are currently limited, unsupported, or unavailable:

    * [On-premises data gateway *triggers*](../connectors/managed.md#on-premises-connectors) are unavailable, but gateway actions *are* available.

    * The built-in action, [Azure Functions - Choose an Azure function](logic-apps-azure-functions.md) is now **Azure Function Operations - Call an Azure function**. This action currently works only for functions that are created from the **HTTP Trigger** template.

      In the Azure portal, you can select an HTTP trigger function where you have access by creating a connection through the user experience. If you inspect the function action's JSON definition in code view or the **workflow.json** file, the action refers to the function by using a `connectionName` reference. This version abstracts the function's information as a connection, which you can find in your project's **connections.json** file, which is available after you create a connection.

      > [!NOTE]
      > In the single-tenant version, the function action supports only query string authentication. 
      > Azure Logic Apps Preview gets the default key from the function when making the connection, 
      > stores that key in your app's settings, and uses the key for authentication when calling the function.
      >
      > As with the multi-tenant version, if you renew this key, for example, through the Azure Functions experience 
      > in the portal, the function action no longer works due to the invalid key. To fix this problem, you need 
      > to recreate the connection to the function that you want to call or update your app's settings with the new key.

    * The built-in action, [Inline Code - Execute JavaScript Code](logic-apps-add-run-inline-code.md) is now **Inline Code Operations - Run in-line JavaScript**.

      * Inline Code Operations actions no longer require an integration account.

      * For macOS and Linux, **Inline Code Operations** is now supported when you use the Azure Logic Apps (Preview) extension in Visual Studio Code.

      * You no longer have to restart your logic app if you make changes in an **Inline Code Operations** action.

      * **Inline Code Operations** actions have [updated limits](logic-apps-overview-preview.md#inline-code-limits).

    * Some [built-in B2B triggers and actions for integration accounts](../connectors/managed.md#integration-account-connectors) are unavailable, for example, the **Flat File** encoding and decoding actions.

    * The built-in action, [Azure Logic Apps - Choose a Logic App workflow](logic-apps-http-endpoint.md) is now **Workflow Operations - Invoke a workflow in this workflow app**.

* [Custom connectors](../connectors/apis-list.md#custom-apis-and-connectors) aren't currently supported for preview.

* **Hosting plan availability**: Whether you create the single-tenant **Logic App (Preview)** resource type in the Azure portal or deploy from Visual Studio Code, you can only use the Premium or App Service hosting plan in Azure. Consumption hosting plans are unavailable and unsupported for deploying this resource type. You can deploy from Visual Studio Code to a Docker container, but not to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md).

* **Breakpoint debugging in Visual Studio Code**: Although you can add and use breakpoints inside the **workflow.json** file for a workflow, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#manage-breakpoints).

* **Zoom control**: The zoom control is currently unavailable on the designer.

* **Trigger history and run history**: For the **Logic App (Preview)** resource type, trigger history and run history in the Azure portal appears at the workflow level, not the logic app level. To find this historical data, follow these steps:

   * To view the run history, open the workflow in your logic app. On the workflow menu, under **Developer**, select **Monitor**.

   * To review the trigger history, open the workflow in your logic app. On the workflow menu, under **Developer**, select **Trigger Histories**.

<a name="firewall-permissions"></a>

## Permit traffic in strict network and firewall scenarios

If your environment has strict network requirements or firewalls that limit traffic, you have to allow access for any trigger or action connections in your logic app workflows.

To find the fully qualified domain names (FQDNs) for these connections, review the corresponding sections in these topics:

* [Firewall permissions for single tenant logic apps - Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#firewall-setup)
* [Firewall permissions for single tenant logic apps - Azure portal](create-stateful-stateless-workflows-azure-portal.md#firewall-setup)

<a name="limits"></a>

## Updated limits

Although many limits for Azure Logic Apps Preview stay the same as the [limits for multi-tenant Azure Logic Apps](logic-apps-limits-and-config.md), these limits have changed for Azure Logic Apps Preview.

<a name="http-timeout-limits"></a>

### HTTP timeout limits

For a single inbound call or outbound call, the timeout limit is 230 seconds (3.9 minutes) for these triggers and actions:

* Outbound request: HTTP trigger, HTTP action
* Inbound request: Request trigger, HTTP Webhook trigger, HTTP Webhook action

In comparison, here are the timeout limits for these triggers and actions in other environments where logic apps and their workflows run:

* Multi-tenant Azure Logic Apps: 120 seconds (2 minutes)
* Integration service environment: 240 seconds (4 minutes)

For more information, see [HTTP limits](logic-apps-limits-and-config.md#http-limits).

<a name="managed-connector-limits"></a>

### Managed connectors

Managed connectors are limited to 50 requests per minute per connection. To work with connector throttling issues, see [Handle throttling problems (429 - "Too many requests" error) in Azure Logic Apps](handle-throttling-problems-429-errors.md#connector-throttling).

<a name="inline-code-limits"></a>

### Inline Code Operations (Execute JavaScript Code)

For a single logic app definition, the Inline Code Operations action, [**Execute JavaScript Code**](logic-apps-add-run-inline-code.md), has these updated limits:

* The maximum number of code characters increases from 1,024 characters to 100,000 characters.

* The maximum duration for running code increases from five seconds to 15 seconds.

For more information, see [Logic app definition limits](logic-apps-limits-and-config.md#definition-limits).

## Next steps

* [Create stateful and stateless workflows in the Azure portal](create-stateful-stateless-workflows-azure-portal.md)
* [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md)
* [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md)

Also, we'd like to hear from you about your experiences with Azure Logic Apps Preview!

* For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
* For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/lafeedback).
