---
title: Single-tenant versus multi-tenant Azure Logic Apps
description: Learn the differences between single-tenant, multi-tenant, and integration service environment (ISE) for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 08/13/2021
---

# Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps

Azure Logic Apps is a cloud-based platform for creating and running automated *logic app workflows* that integrate your apps, data, services, and systems. With this platform, you can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios. To create a logic app, you use either the **Logic App (Consumption)** resource type or the **Logic App (Standard)** resource type. The Consumption resource type runs in the *multi-tenant* Azure Logic Apps or *integration service environment*, while the Standard resource type runs in *single-tenant* Azure Logic Apps environment.

Before you choose which resource type to use, review this article to learn how the resources types and service environments compare to each other. You can then decide which type is best to use, based on your scenario's needs, solution requirements, and the environment where you want to deploy, host, and run your workflows.

If you're new to Azure Logic Apps, review the following documentation:

* [What is Azure Logic Apps?](logic-apps-overview.md)
* [What is a *logic app workflow*?](logic-apps-overview.md#logic-app-concepts)

<a name="resource-environment-differences"></a>

## Resource types and environments

To create logic app workflows, you choose the **Logic App** resource type based on your scenario, solution requirements, the capabilities that you want, and the environment where you want to run your workflows.

The following table briefly summarizes differences between the **Logic App (Standard)** resource type and the **Logic App (Consumption)** resource type. You'll also learn how the *single-tenant* environment compares to the *multi-tenant* and *integration service environment (ISE)* for deploying, hosting, and running your logic app workflows.

[!INCLUDE [Logic app resource type and environment differences](../../includes/logic-apps-resource-environment-differences-table.md)]

<a name="resource-type-introduction"></a>

## Logic App (Standard) resource

The **Logic App (Standard)** resource type is powered by the redesigned single-tenant Azure Logic Apps runtime. This containerized runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This design provides portability, flexibility, and more performance for your logic app workflows plus other capabilities and benefits inherited from the Azure Functions platform and Azure App Service ecosystem.

For example, you can run single-tenant based logic apps and their workflows anywhere that Azure function apps and their functions can run. The Standard resource type introduces a resource structure that can host multiple workflows, similar to how an Azure function app can host multiple functions. With a 1-to-many mapping, workflows in the same logic app and tenant share compute and processing resources, providing better performance due to their proximity. This structure differs from the **Logic App (Consumption)** resource where you have a 1-to-1 mapping between a logic app resource and a workflow.

To learn more about portability, flexibility, and performance improvements, continue with the following sections. Or, for more information about the single-tenant Azure Logic Apps runtime and Azure Functions extensibility, review the following documentation:

* [Azure Logic Apps Running Anywhere - Runtime Deep Dive](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564)
* [Introduction to Azure Functions](../azure-functions/functions-overview.md)
* [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md)

<a name="portability"></a>
<a name="flexibility"></a>

### Portability and flexibility

When you create logic apps using the **Logic App (Standard)** resource type, you can run your workflows anywhere that you can run Azure function apps and their functions, not just in the single-tenant service environment.

For example, when you use Visual Studio Code with the **Azure Logic Apps (Standard)** extension, you can *locally* develop, build, and run your workflows in your development environment without having to deploy to Azure. If your scenario requires containers, you can containerize and deploy logic apps as containers.

These capabilities provide major improvements and substantial benefits compared to the multi-tenant model, which requires you to develop against an existing running resource in Azure. Also, the multi-tenant model for automating **Logic App (Consumption)** resource deployment is completely based on Azure Resource Manager templates (ARM templates), which combine and handle resource provisioning for both apps and infrastructure.

With the **Logic App (Standard)** resource type, deployment becomes easier because you can separate app deployment from infrastructure deployment. You can package the single-tenant Azure Logic Apps runtime and workflows together as part of your logic app. You can use generic steps or tasks that build, assemble, and zip your logic app resources into ready-to-deploy artifacts. To deploy your infrastructure, you can still use ARM templates to separately provision those resources along with other processes and pipelines that you use for those purposes.

To deploy your app, copy the artifacts to the host environment and then start your apps to run your workflows. Or, integrate your artifacts into deployment pipelines using the tools and processes that you already know and use. That way, you can deploy using your own chosen tools, no matter the technology stack that you use for development.

By using standard build and deploy options, you can focus on app development separately from infrastructure deployment. As a result, you get a more generic project model where you can apply many similar or the same deployment options that you use for a generic app. You also benefit from a more consistent experience for building deployment pipelines around your app projects and for running the required tests and validations before publishing to production.

<a name="performance"></a>

### Performance

Using the **Logic App (Standard)** resource type, you can create and run multiple workflows in the same single logic app and tenant. With this 1-to-many mapping, these workflows share resources, such as compute, processing, storage, and network, providing better performance due to their proximity.

The **Logic App (Standard)** resource type and single-tenant Azure Logic Apps runtime provide another significant improvement by making the more popular managed connectors available as built-in operations. For example, you can use built-in operations for Azure Service Bus, Azure Event Hubs, SQL, and others. Meanwhile, the managed connector versions are still available and continue to work.

When you use the new built-in operations, you create connections called *built-in connections* or *service provider connections*. Their managed connection counterparts are called *API connections*, which are created and run separately as Azure resources that you also have to then deploy by using ARM templates. Built-in operations and their connections run locally in the same process that runs your workflows. Both are hosted on the single-tenant Azure Logic Apps runtime. As a result, built-in operations and their connections provide better performance due to proximity with your workflows. This design also works well with deployment pipelines because the service provider connections are packaged into the same build artifact.

## Create, build, and deploy options

To create a logic app based on the environment that you want, you have multiple options, for example:

**Single-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Standard)** resource type | [Create integration workflows for single-tenant Logic Apps - Azure portal](create-single-tenant-workflows-azure-portal.md) |
| Visual Studio Code | [**Azure Logic Apps (Standard)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | [Create integration workflows for single-tenant Logic Apps - Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md) |
| Azure CLI | Logic Apps Azure CLI extension | Not yet available |
||||

**Multi-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Consumption)** resource type | [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-first-logic-app-workflow.md) |
| Visual Studio Code | [**Azure Logic Apps (Consumption)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) | [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
| Azure CLI | [**Logic Apps Azure CLI** extension](https://github.com/Azure/azure-cli-extensions/tree/master/src/logic) | - [Quickstart: Create and manage integration workflows in multi-tenant Azure Logic Apps - Azure CLI](quickstart-logic-apps-azure-cli.md) <p><p>- [az logic](/cli/azure/logic) |
| Azure Resource Manager | [**Create a logic app** ARM template](https://azure.microsoft.com/resources/templates/logic-app-create/) | [Quickstart: Create and deploy integration workflows in multi-tenant Azure Logic Apps - ARM template](quickstart-create-deploy-azure-resource-manager-template.md) |
| Azure PowerShell | [Az.LogicApp module](/powershell/module/az.logicapp) | [Get started with Azure PowerShell](/powershell/azure/get-started-azureps) |
| Azure REST API | [Azure Logic Apps REST API](/rest/api/logic) | [Get started with Azure REST API reference](/rest/api/azure) |
||||

**Integration service environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Logic App (Consumption)** resource type with an existing ISE resource | Same as [Quickstart: Create integration workflows in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-first-logic-app-workflow.md), but select an ISE, not a multi-tenant region. |
||||

Although your development experiences differ based on whether you create **Consumption** or **Standard** logic app resources, you can find and access all your deployed logic apps under your Azure subscription.

For example, in the Azure portal, the **Logic apps** page shows both **Consumption** and **Standard** logic app resource types. In Visual Studio Code, deployed logic apps appear under your Azure subscription, but they are grouped by the extension that you used, namely **Azure: Logic Apps (Consumption)** and **Azure: Logic Apps (Standard)**.

<a name="stateful-stateless"></a>

## Stateful and stateless workflows

With the **Logic App (Standard)** resource type, you can create these workflow types within the same logic app:

* *Stateful*

  Create a stateful workflow when you need to keep, review, or reference data from previous events. These workflows save and transfer all the inputs and outputs for each action and their states to external storage, which makes reviewing the run details and history possible after each run finishes. Stateful workflows provide high resiliency if outages happen. After services and systems are restored, you can reconstruct interrupted runs from the saved state and rerun the workflows to completion. Stateful workflows can continue running for much longer than stateless workflows.

* *Stateless*

  Create a stateless workflow when you don't need to keep, review, or reference data from previous events in external storage after each run finishes for later review. These workflows save all the inputs and outputs for each action and their states *in memory only*, not in external storage. As a result, stateless workflows have shorter runs that are typically less than 5 minutes, faster performance with quicker response times, higher throughput, and reduced running costs because the run details and history aren't saved in external storage. However, if outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs. These workflows can only run synchronously.

  > [!IMPORTANT]
  > A stateless workflow provides the best performance when handling data or content, such as a file, that doesn't exceed 64 KB in *total* size. 
  > Larger content sizes, such as multiple large attachments, might significantly slow your workflow's performance or even cause your workflow to 
  > crash due to out-of-memory exceptions. If your workflow might have to handle larger content sizes, use a stateful workflow instead.

  For easier debugging, you can enable run history for a stateless workflow, which has some impact on performance, and then disable the run history when you're done. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#enable-run-history-stateless) or [Create single-tenant based workflows in the Azure portal](create-single-tenant-workflows-visual-studio-code.md#enable-run-history-stateless).

  > [!NOTE]
  > Stateless workflows currently support only *actions* for [managed connectors](../connectors/managed.md), 
  > which are deployed in Azure, and not triggers. To start your workflow, select either the 
  > [built-in Request, Event Hubs, or Service Bus trigger](../connectors/built-in.md). 
  > These triggers run natively in the Azure Logic Apps runtime. For more information about limited, 
  > unavailable, or unsupported triggers, actions, and connectors, see 
  > [Changed, limited, unavailable, or unsupported capabilities](#limited-unavailable-unsupported).

<a name="nested-behavior"></a>

### Nested behavior differences between stateful and stateless workflows

You can [make a workflow callable](../logic-apps/logic-apps-http-endpoint.md) from other workflows that exist in the same **Logic App (Standard)** resource by using the [Request trigger](../connectors/connectors-native-reqres.md), [HTTP Webhook trigger](../connectors/connectors-native-webhook.md), or managed connector triggers that have the [ApiConnectionWebhook type](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

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

<a name="other-capabilities"></a>

## Other single-tenant model capabilities

The single-tenant model and **Logic App (Standard)** resource type include many current and new capabilities, for example:

* Create logic apps and their workflows from [400+ managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * More managed connectors are now available as built-in operations and run similarly to other built-in operations, such as Azure Functions. Built-in operations run natively on the single-tenant Azure Logic Apps runtime. For example, new built-in operations include Azure Service Bus, Azure Event Hubs, SQL Server, and MQ.

    > [!NOTE]
    > For the built-in SQL Server version, only the **Execute Query** action can directly connect to Azure 
    > virtual networks without using the [on-premises data gateway](logic-apps-gateway-connection.md).

  * You can create your own built-in connectors for any service that you need by using the [single-tenant Azure Logic Apps extensibility framework](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272). Similarly to built-in operations such as Azure Service Bus and SQL Server but unlike [custom managed connectors](../connectors/apis-list.md#custom-apis-and-connectors), which aren't currently supported, custom built-in connectors provide higher throughput, low latency, and local connectivity because they run in the same process as the single-tenant runtime.

    The authoring capability is currently available only in Visual Studio Code, but isn't enabled by default. To create these connectors, [switch your project from extension bundle-based (Node.js) to NuGet package-based (.NET)](create-single-tenant-workflows-visual-studio-code.md#enable-built-in-connector-authoring). For more information, see [Azure Logic Apps Running Anywhere - Built-in connector extensibility](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-built-in-connector/ba-p/1921272).

  * You can use the following actions for Liquid Operations and XML Operations without an integration account. These operations include the following actions:

    * XML: **Transform XML** and **XML Validation**

    * Liquid: **Transform JSON To JSON**, **Transform JSON To TEXT**, **Transform XML To JSON**, and **Transform XML To Text**

    > [!NOTE]
    > To use these actions, you need to have Liquid maps, XML maps, or XML schemas that you can upload through the respective actions in the 
    > Azure portal or add to your Visual Studio Code project's **Artifacts** folder using the respective **Maps** and **Schemas** folders.

  * **Logic app (Standard)** resources can run anywhere because Azure Logic Apps generates Shared Access Signature (SAS) connection strings that these logic apps can use for sending requests to the cloud connection runtime endpoint. Azure Logic Apps service saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy in Azure.

    > [!NOTE]
    > By default, a **Logic App (Standard)** resource has the [system-assigned managed identity](../logic-apps/create-managed-service-identity.md) 
    > automatically enabled to authenticate connections at run time. This identity differs from the authentication 
    > credentials or connection string that you use when you create a connection. If you disable this identity, 
    > connections won't work at run time. To view this setting, on your logic app's menu, under **Settings**, select **Identity**.

* You can locally run, test, and debug your logic apps and their workflows in the Visual Studio Code development environment.

  Before you run and test your logic app, you can make debugging easier by adding and using breakpoints inside the **workflow.json** file for a workflow. However, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#manage-breakpoints).

* Directly publish or deploy logic apps and their workflows from Visual Studio Code to various hosting environments such as Azure and containers.

* Enable diagnostics logging and tracing capabilities for your logic app by using [Application Insights](../azure-monitor/app/app-insights-overview.md) when supported by your Azure subscription and logic app settings.

* Access networking capabilities, such as connect and integrate privately with Azure virtual networks, similar to Azure Functions when you create and deploy your logic apps using the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md). For more information, review the following documentation:

  * [Azure Functions networking options](../azure-functions/functions-networking-options.md)

  * [Azure Logic Apps Running Anywhere - Networking possibilities with Azure Logic Apps](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

* Regenerate access keys for managed connections used by individual workflows in a **Logic App (Standard)** resource. For this task, [follow the same steps for the **Logic Apps (Consumption)** resource but at the individual workflow level](logic-apps-securing-a-logic-app.md#regenerate-access-keys), not the logic app resource level.

<a name="limited-unavailable-unsupported"></a>

## Changed, limited, unavailable, or unsupported capabilities

For the **Logic App (Standard)** resource, these capabilities have changed, or they are currently limited, unavailable, or unsupported:

* **Triggers and actions**: Built-in triggers and actions run natively in the single-tenant Azure Logic Apps runtime, while managed connectors are hosted and run in Azure. Some built-in triggers are unavailable, such as Sliding Window and Batch. To start a stateful or stateless workflow, use the [built-in Recurrence, Request, HTTP, HTTP Webhook, Event Hubs, or Service Bus trigger](../connectors/apis-list.md). In the designer, built-in triggers and actions appear under the **Built-in** tab.

  For *stateful* workflows, [managed connector triggers and actions](../connectors/managed.md) appear under the **Azure** tab, except for the unavailable operations listed below. For *stateless* workflows, the **Azure** tab doesn't appear when you want to select a trigger. You can select only [managed connector *actions*, not triggers](../connectors/managed.md). Although you can enable Azure-hosted managed connectors for stateless workflows, the designer doesn't show any managed connector triggers for you to add.

  > [!NOTE]
  > To run locally in Visual Studio Code, webhook-based triggers and actions require additional setup. For more information, see 
  > [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#webhook-setup).

  * These triggers and actions have either changed or are currently limited, unsupported, or unavailable:

    * [On-premises data gateway *triggers*](../connectors/managed.md#on-premises-connectors) are unavailable, but gateway actions *are* available.

    * The built-in action, [Azure Functions - Choose an Azure function](logic-apps-azure-functions.md) is now **Azure Function Operations - Call an Azure function**. This action currently works only for functions that are created from the **HTTP Trigger** template.

      In the Azure portal, you can select an HTTP trigger function that you can access by creating a connection through the user experience. If you inspect the function action's JSON definition in code view or the **workflow.json** file using Visual Studio Code, the action refers to the function by using a `connectionName` reference. This version abstracts the function's information as a connection, which you can find in your logic app project's **connections.json** file, which is available after you create a connection in Visual Studio Code.

      > [!NOTE]
      > In the single-tenant model, the function action supports only query string authentication. 
      > Azure Logic Apps gets the default key from the function when making the connection, 
      > stores that key in your app's settings, and uses the key for authentication when calling the function.
      >
      > As in the multi-tenant model, if you renew this key, for example, through the Azure Functions experience 
      > in the portal, the function action no longer works due to the invalid key. To fix this problem, you need 
      > to recreate the connection to the function that you want to call or update your app's settings with the new key.

    * The built-in action, [Inline Code](logic-apps-add-run-inline-code.md), is renamed **Inline Code Operations**, no longer requires an integration account, and has [updated limits](logic-apps-limits-and-config.md).

    * The built-in action, [Azure Logic Apps - Choose a Logic App workflow](logic-apps-http-endpoint.md) is now **Workflow Operations - Invoke a workflow in this workflow app**.

    * Some [built-in triggers and actions for integration accounts](../connectors/managed.md#integration-account-connectors) are unavailable, for example, the **Flat File** encoding and decoding actions.

    * [Custom managed connectors](../connectors/apis-list.md#custom-apis-and-connectors) currently aren't currently supported. However, you can create *custom built-in operations* when you use Visual Studio Code. For more information, review [Create single-tenant based workflows using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#enable-built-in-connector-authoring).

* **Breakpoint debugging in Visual Studio Code**: Although you can add and use breakpoints inside the **workflow.json** file for a workflow, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#manage-breakpoints).

* **Trigger history and run history**: For the **Logic App (Standard)** resource type, trigger history and run history in the Azure portal appears at the workflow level, not the logic app level. For more information, review [Create single-tenant based workflows using the Azure portal](create-single-tenant-workflows-azure-portal.md).

* **Zoom control**: The zoom control is currently unavailable on the designer.

* **Deployment targets**: You can't deploy the **Logic App (Standard)** resource type to an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) nor to Azure deployment slots.

* **Azure API Management**: You currently can't import the **Logic App (Standard)** resource type into Azure API Management. However, you can import the **Logic App (Consumption)** resource type.

<a name="firewall-permissions"></a>

## Strict network and firewall traffic permissions

If your environment has strict network requirements or firewalls that limit traffic, you have to allow access for any trigger or action connections in your logic app workflows. To find the fully qualified domain names (FQDNs) for these connections, review the corresponding sections in these topics:

* [Firewall permissions for single tenant logic apps - Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#firewall-setup)
* [Firewall permissions for single tenant logic apps - Azure portal](create-single-tenant-workflows-azure-portal.md#firewall-setup)

## Next steps

* [Create single-tenant based workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md)
* [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

We'd also like to hear about your experiences with single-tenant Azure Logic Apps!

* For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
* For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/lafeedback).
