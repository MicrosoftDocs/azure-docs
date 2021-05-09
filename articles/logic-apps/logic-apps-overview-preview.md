---
title: Azure Logic Apps - Compare single-tenant (preview), multi-tenant, and integration service environments
description: Learn the differences between logic app workflows that run in the single-tenant (preview), multi-tenant, and integration service environment (ISE).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, ladolan, azla
ms.topic: conceptual
ms.date: 05/05/2021
---

# Compare between single-tenant (preview), multi-tenant, and integration service environments for Azure Logic Apps

> [!IMPORTANT]
> The new Logic Apps single-tenant environment and app resource type are in preview and subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Logic Apps is a cloud-based platform for creating and running automated logic app *workflows* that integrate your apps, data, services, and systems. Using this platform, you can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios. To use the Azure Logic Apps platform, you create a logic app resource by using either the original **Logic App (Consumption)** resource type or the new **Logic App (Preview)** resource type.

Before you choose which resource type to use, review this article to learn the differences between these resource types. You can then decide which type to use based on your scenario's needs, solution requirements, and the environment where you want to deploy, host, and run your workflows.

If you're new to Azure Logic Apps, start by reviewing the following documentation:

* [What is Azure Logic Apps?](logic-apps-overview.md)
* [What is a logic app *workflow*?](logic-apps-overview.md#logic-app-concepts)

<a name="differences"></a>

## Resource types and environment differences

The following table provides more information about how the new **Logic App (Preview)** resource type compares with original **Logic App (Consumption)** resource type. You'll also learn the differences between the *multi-tenant*, *single-tenant* (preview), and *integration service environment (ISE)* where you can deploy, host, and run your logic app workflows.

| Resource type | Host environment | Resource sharing and usage | [Pricing and billing model](logic-apps-pricing.md) | [Limits](logic-apps-limits-and-config.md) |
|---------------|------------------|----------------------------|----------------------------------------------------|-------------------------------------------|
| **Logic App (Consumption)** | Multi-tenant | A single logic app can have *only one* workflow. <p><p>Logic apps created by customers *across multiple tenants* share the same processing (compute), storage, network, and so on. | Consumption (pay-per-use) | Azure Logic Apps manages the default values for these limits, but you can change some of these values, if that option exists for a specific limit. |
| **Logic App (Consumption)** | Integration service environment <br>(ISE) | A single logic app can have *only one* workflow. <p><p>Logic apps *in the same environment* share the same processing (compute), storage, network, and so on. | ISE (fixed) | Azure Logic Apps manages the default values for these limits, but you can change some of these values, if that option exists for a specific limit. |
| **Logic App (Preview)** | Single-tenant <br>(Preview) | A single logic app can have multiple [*stateful* and *stateless*](#stateful-stateless) workflows. <p><p>Workflows *in a single logic app and tenant* share the same processing (compute), storage, network, and so on. | Preview, which is either the [Premium hosting plan](../azure-functions/functions-scale.md), or [App Service hosting plan](../azure-functions/functions-scale.md) with a specific [pricing tier](../app-service/overview-hosting-plans.md). <p><p>If you have *stateful* workflows, which use [external storage](../azure-functions/storage-considerations.md#storage-account-requirements), the Azure Logic Apps runtime makes storage transactions that follow [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). | You can change the default values for many limits, based on your scenario's needs. <p><p>**Important**: Some limits have hard upper maximums. In Visual Studio Code, the changes you make to the default limit values in your logic app project configuration files won't appear in the designer experience. <p><p>For more information, see [Create workflows for single-tenant Azure Logic Apps using Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md). |
||||||

<a name="preview-resource-type-introduction"></a>

## Logic App (Preview) resource type

The **Logic App (Preview)** resource type is powered by the redesigned Azure Logic Apps (Preview) runtime, which uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This architecture provides portability, flexibility, and better performance for your logic app workflows plus other capabilities and benefits inherited from the Azure Functions platform and Azure App Service ecosystem.

For example, the **Logic App (Preview)** resource type introduces a resource structure similar to Azure Functions where your logic app can include multiple workflows. This structure differs from the **Logic App (Consumption)** version where you have a 1:1 mapping between a logic app resource and workflow. With this 1-to-many relationship, workflows in the same logic app can share and reuse other resources, resulting in improved performance due to shared tenancy and proximity to each other.

For more information about the new **Logic App (Preview)** resource type, Azure Functions, and Azure Functions extensibility, review the following documentation:

* [Azure Logic Apps Running Anywhere - Runtime Deep Dive](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564)
* [Introduction to Azure Functions](../azure-functions/functions-overview.md)
* [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md)
* [Azure Functions extensibility - WebJobs SDK: Creating custom input and output bindings](https://github.com/Azure/azure-webjobs-sdk/wiki/Creating-custom-input-and-output-bindings)

<a name="portability"></a>
<a name="flexibility"></a>

### Portability and flexibility

When you create logic apps using the **Logic App (Preview)** resource type, you can run your logic app workflows anywhere that you can run functions created using the Azure Functions platform, not just in the single-tenant Azure Logic Apps environment. 

For example, when you use Visual Studio Code with the Azure Logic Apps (Preview) extension, you can *locally* develop, build, and run your workflows in your development environment without having to deploy to Azure. If your scenario requires containers, you can containerize your logic apps to deploy into Docker containers. These capabilities in the single-tenant model provide major improvements and substantial benefits compared to the multi-tenant model, which requires you to develop against an existing running resource in Azure. With multi-tenant, deployments are also completely based on Azure Resource Manager (ARM) templates, which handle resource provisioning for both apps and infrastructure.

With the new resource type, the redesigned runtime and your workflows are both part of your logic app that you can now package together. This design lets you simply deploy by copying artifacts to the host environment and run your workflows by starting your app. You can also use the standard build and deploy options so that you can focus on your app or solution requirements. 

This approach also provides a more standardized experience for building deployment pipelines around your workflow projects so that you can run the required tests and validations before you deploy to production environments. For example, you can integrate your logic app deployments into existing pipelines by using the build tools and processes that you already know and use. To provision and set up your infrastructure resources, such as virtual networks and connectivity, you can use ARM templates and deploy your infrastructure along with other processes and pipelines that you use for these purposes.

By separating the concerns between deploying your app and your infrastructure, you get a more generic project model where you can apply many of the same deployment options that you use for a generic app. You can reuse generic build steps that build, assemble, and zip your logic apps into ready-to-deploy artifacts. No matter which technology stack you use, you can deploy your logic apps with the *tools that you choose*.

<a name="performance"></a>

### Performance

The **Logic App (Preview)** resource type and redesigned Azure Logic Apps (Preview) runtime provider another significant improvement where the more commonly-used managed connectors are now available as built-in operations. For example, you can use built-in operations for Azure Service Bus, Azure Event Hubs, SQL, and others. You can still use the managed connector versions, which continue to work. 

When you use these new built-in operations, you create connections called *built-in connections* or *service provider connections*. Their managed connection counterparts are called *API connections*, which are created and run separately as Azure resources that you also have to then deploy by using ARM templates. Built-in operations and their connections run locally in the same process that runs your workflows, and both are hosted on the Logic Apps runtime. As a result, built-in operations and their connections provide better performance due to proximity to your workflows. This design also works well with deployment pipelines because the service provider connections are packaged into the same build artifact.

### Create, build, and deploy

To create a logic app based on the environment where you to deploy and run, you have multiple options:

**Single-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Preview)** resource type | [Create integration workflows for single-tenant Logic Apps - Azure portal](create-stateful-stateless-workflows-azure-portal.md) |
| Visual Studio Code | [**Azure Logic Apps (Preview)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | [Create integration workflows for single-tenant Logic Apps - Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md) <p><p>If you choose this option, you can *locally* develop, build, and run your workflows in your development environment. |
| Azure CLI | Logic Apps Azure CLI extension | Not yet available |
||||

**Multi-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Consumption)** resource type | [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-first-logic-app-workflow.md) |
| Visual Studio Code | [**Azure Logic Apps (Consumption)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) | [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
| Azure CLI | [**Logic Apps Azure CLI** extension](https://github.com/Azure/azure-cli-extensions/tree/master/src/logic) | - [Quickstart: Create and manage integration workflows in multi-tenant Azure Logic Apps - Azure CLI](quickstart-logic-apps-azure-cli.md) <p><p>- [az logic](/cli/azure/logic) |
| Azure Resource Manager (ARM) | [**Create a logic app** ARM template](https://azure.microsoft.com/resources/templates/101-logic-app-create/) | [Quickstart: Create and deploy integration workflows in multi-tenant Azure Logic Apps - ARM template](quickstart-create-deploy-azure-resource-manager-template.md) |
| Azure PowerShell | [Az.LogicApp module](/powershell/module/az.logicapp) | [Get started with Azure PowerShell](/powershell/azure/get-started-azureps) |
| Azure REST API | [Azure Logic Apps REST API](/rest/api/logic) | [Get started with Azure REST API reference](/rest/api/azure) |
||||

**Integration service environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Consumption)** resource type with an existing ISE resource | Same as [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-first-logic-app-workflow.md), but select an ISE, not a multi-tenant region. |
||||

Although your development experiences differ based on whether you create **Consumption** or **Preview** logic app resources, you can find and access all your deployed logic apps under your Azure subscription. For example, in the Azure portal, the **Logic apps** page shows both **Consumption** and **Preview** logic app resource types. In Visual Studio Code, all your deployed logic apps appear under your Azure subscription. However, in the Azure extensions pane, deployed logic apps are organized separately into their categories based on whether they are and sections and appear separately under the **Consumption** and **Preview** extensions.

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

* Create logic apps with stateless workflows that run only in memory so that they finish more quickly, respond faster, have higher throughput, and cost less to run because the run histories and data between actions don't persist in external storage. Optionally, you can enable run history for easier debugging. For more information, see [Stateful versus stateless workflows](#stateful-stateless).

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

## Next steps

* [Create stateful and stateless workflows in the Azure portal](create-stateful-stateless-workflows-azure-portal.md)
* [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md)
* [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md)

We'd also like to hear from your about your experiences with the new Logic Apps (Preview) resource type and single-tenant Azure Logic Apps (Preview)!

* For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
* For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/lafeedback).
