---
title: Single-tenant versus multi-tenant Azure Logic Apps
description: Learn the differences between single-tenant, multi-tenant, and integration service environment (ISE) for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 10/30/2023
ms.custom: ignite-fall-2021
---

# Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps

Azure Logic Apps is a cloud-based platform for creating and running automated *logic app workflows* that integrate your apps, data, services, and systems. With this platform, you can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios. When you create a logic app resource, you select either the **Consumption** workflow type or **Standard** workflow type. A Consumption logic app can have only one workflow that runs in *multi-tenant* Azure Logic Apps or an *integration service environment*. A Standard logic app can have one or multiple workflows that run in *single-tenant* Azure Logic Apps or an App Service Environment (ASE).

Before you choose which logic app resource to create, review the following guide to learn how the logic app workflow types and service environments compare with each other. You can then make a better choice about which logic app workflow and environment best suits your scenario, solution requirements, and the destination where you want to deploy and run your workflows.

If you're new to Azure Logic Apps, review [What is Azure Logic Apps?](logic-apps-overview.md) and [What is a *logic app workflow*?](logic-apps-overview.md#logic-app-concepts).

<a name="resource-environment-differences"></a>

## Logic app workflow types and environments

The following table summarizes the differences between a Consumption logic app workflow and Standard logic app workflow. You also learn how the *single-tenant* environment differs from the *multi-tenant* environment and *integration service environment (ISE)* for deploying, hosting, and running your workflows.

[!INCLUDE [Logic app workflow and environment differences](../../includes/logic-apps-resource-environment-differences-table.md)]

<a name="resource-type-introduction"></a>

## Standard logic app and workflow

The **Standard** logic app and workflow is powered by the redesigned single-tenant Azure Logic Apps runtime. This runtime uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This design provides portability, flexibility, and more performance for your logic app workflows plus other capabilities and benefits inherited from the Azure Functions platform and the Azure App Service ecosystem. For example, you can create, deploy, and run single-tenant based logic apps and their workflows in [Azure App Service Environment v3 (Windows plans only)](../app-service/environment/overview.md).

The Standard logic app introduces a resource structure that can host multiple workflows, similar to how an Azure function app can host multiple functions. With a 1-to-many mapping, workflows in the same logic app and tenant share compute and processing resources, providing better performance due to their proximity. This structure differs from the **Consumption** logic app resource where you have a 1-to-1 mapping between the logic app resource and a workflow.

To learn more about portability, flexibility, and performance improvements, continue reviewing the following sections. For more information about the single-tenant Azure Logic Apps runtime and Azure Functions extensibility, review the following documentation:

* [Azure Logic Apps Running Anywhere - Runtime Deep Dive](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-runtime-deep-dive/ba-p/1835564)
* [Introduction to Azure Functions](../azure-functions/functions-overview.md)
* [Azure Functions triggers and bindings](../azure-functions/functions-triggers-bindings.md)

<a name="portability"></a>
<a name="flexibility"></a>

### Portability and flexibility

When you create a **Standard** logic app and workflow, you can deploy and run your workflow in other environments, such as [Azure App Service Environment v3 (Windows plans only)](../app-service/environment/overview.md). If you use Visual Studio Code with the **Azure Logic Apps (Standard)** extension, you can *locally* develop, build, and run your workflow in your development environment without having to deploy to Azure. If your scenario requires containers, you can [create single tenant logic apps using Azure Arc-enabled Logic Apps](azure-arc-enabled-logic-apps-create-deploy-workflows.md). For more information, see [What is Azure Arc enabled Logic Apps?](azure-arc-enabled-logic-apps-overview.md)

These capabilities provide major improvements and substantial benefits compared to the multi-tenant model, which requires you to develop against an existing running resource in Azure. The multi-tenant model for automating **Consumption** logic app resource deployment is based on Azure Resource Manager templates (ARM templates), which combine and handle resource provisioning for both apps and infrastructure.

With the **Standard** logic app resource, deployment becomes easier because you can separate app deployment from infrastructure deployment. You can package the single-tenant Azure Logic Apps runtime and your workflows together as part of your logic app resource or project. You can use generic steps or tasks that build, assemble, and zip your logic app resources into ready-to-deploy artifacts. To deploy your infrastructure, you can still use ARM templates to separately provision those resources along with other processes and pipelines that you use for those purposes.

To deploy your app, copy the artifacts to the host environment and then start your apps to run your workflows. Or, integrate your artifacts into deployment pipelines using the tools and processes that you already know and use. That way, you can deploy using your own chosen tools, no matter the technology stack that you use for development.

By using standard build and deploy options, you can focus on app development separately from infrastructure deployment. As a result, you get a more generic project model where you can apply many similar or the same deployment options that you use for a generic app. You also benefit from a more consistent experience when you build deployment pipelines for your apps and when you run the required tests and validations before you publish to production.

<a name="performance"></a>

### Performance

With a **Standard** logic app, you can create and run multiple workflows in the same single logic app resource and tenant. With this 1-to-many mapping, these workflows share resources, such as compute, processing, storage, and network, providing better performance due to their proximity.

The **Standard** logic app resource and single-tenant Azure Logic Apps runtime provide another significant improvement by making the more popular managed connectors available as built-in connector operations. For example, you can use built-in connector operations for Azure Service Bus, Azure Event Hubs, SQL Server, and others. Meanwhile, the managed connector versions are still available and continue to work.

When you use the new built-in connector operations, you create connections called *built-in connections* or *service provider connections*. Their managed connection counterparts are called *API connections*, which are created and run separately as Azure resources that you also have to then deploy by using ARM templates. Built-in operations and their connections run locally in the same process that runs your workflows. Both are hosted on the single-tenant Azure Logic Apps runtime. As a result, built-in operations and their connections provide better performance due to proximity with your workflows. This design also works well with deployment pipelines because the service provider connections are packaged into the same build artifact.

<a name="data-residency"></a>

### Data residency

**Standard** logic app resources are hosted in single-tenant Azure Logic Apps, which [doesn't store, process, or replicate data outside the region where you deploy these logic app resources](https://azure.microsoft.com/global-infrastructure/data-residency), meaning that data in your workflows stay in the same region where you create and deploy their parent resources.

### Direct access to resources in Azure virtual networks

Workflows that run in either single-tenant Azure Logic Apps or in an *integration service environment* (ISE) can directly access secured resources such as virtual machines (VMs), other services, and systems that exist in an [Azure virtual network](../virtual-network/virtual-networks-overview.md).

Both single-tenant Azure Logic Apps and an ISE are dedicated instances of the Azure Logic Apps service, use dedicated resources, and run separately from multi-tenant Azure Logic Apps. Running workflows in a dedicated instance helps reduce the impact that other Azure tenants might have on app performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).

Single-tenant Azure Logic Apps and an ISE also provide the following benefits:

* Your own static IP addresses, which are separate from the static IP addresses that are shared by the logic apps in the multi-tenant Azure Logic Apps. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, review [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md).

## Create, build, and deploy options

To create a logic app resource based on the environment that you want, you have multiple options, for example:

**Single-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Standard** logic app | [Create an example Standard logic app workflow in single-tenant Azure Logic Apps - Azure portal](create-single-tenant-workflows-azure-portal.md) |
| Visual Studio Code | [**Azure Logic Apps (Standard)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | [Create an example Standard logic app workflow in single-tenant Azure Logic Apps - Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md) |
| Azure CLI | Logic Apps Azure CLI extension | [az logicapp](/cli/azure/logicapp) |
| Azure Resource Manager | - [Local](https://github.com/Azure/logicapps/tree/master/azure-devops-sample#local) <br>- [DevOps](https://github.com/Azure/logicapps/tree/master/azure-devops-sample#devops) | [Single-tenant Azure Logic Apps](https://github.com/Azure/logicapps/tree/master/azure-devops-sample) |
| Azure Arc-enabled Logic Apps | [Azure Arc-enabled Logic Apps sample](https://github.com/Azure/logicapps/tree/master/arc-enabled-logic-app-sample) | - [What is Azure Arc-enabled Logic Apps?](azure-arc-enabled-logic-apps-overview.md) <br><br>- [Create and deploy single-tenant based logic app workflows with Azure Arc-enabled Logic Apps](azure-arc-enabled-logic-apps-create-deploy-workflows.md) | 
| Azure REST API | [Azure App Service REST API](/rest/api/appservice/workflows)* <br><br>**Note**: The Standard logic app REST API is included with the Azure App Service REST API. | [Get started with Azure REST API reference](/rest/api/azure) |

**Multi-tenant environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Consumption** logic app | [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-example-consumption-workflow.md) |
| Visual Studio Code | [**Azure Logic Apps (Consumption)** extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) | [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps - Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
| Azure CLI | [**Logic Apps Azure CLI** extension](https://github.com/Azure/azure-cli-extensions/tree/master/src/logic) | - [Quickstart: Create and manage Consumption logic app workflows in multi-tenant Azure Logic Apps - Azure CLI](quickstart-logic-apps-azure-cli.md) <br><br>- [az logic](/cli/azure/logic) |
| Azure Resource Manager | [**Create a logic app** ARM template](https://azure.microsoft.com/resources/templates/logic-app-create/) | [Quickstart: Create and deploy Consumption logic app workflows in multi-tenant Azure Logic Apps - ARM template](quickstart-create-deploy-azure-resource-manager-template.md) |
| Azure PowerShell | [Az.LogicApp module](/powershell/module/az.logicapp) | [Get started with Azure PowerShell](/powershell/azure/get-started-azureps) |
| Azure REST API | [Azure Logic Apps REST API](/rest/api/logic) | [Get started with Azure REST API reference](/rest/api/azure) |

**Integration service environment**

| Option | Resources and tools | More information |
|--------|---------------------|------------------|
| Azure portal | **Consumption** logic app deployed to an existing ISE resource | Same as [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps - Azure portal](quickstart-create-example-consumption-workflow.md), but select an ISE, not a multi-tenant region. |

Although your development experiences differ based on whether you create **Consumption** or **Standard** logic app resources, you can find and access all your deployed logic apps under your Azure subscription.

For example, in the Azure portal, the **Logic apps** page shows both **Consumption** and **Standard** logic app resources. In Visual Studio Code, deployed logic apps appear under your Azure subscription, but **Consumption** logic apps appear in the **Azure** window under the **Azure Logic Apps (Consumption)** extension, while **Standard** logic apps appear under the **Resources** section.

<a name="stateful-stateless"></a>

## Stateful and stateless workflows

Within a **Standard** logic app, you can create the following workflow types:

* *Stateful*

  Create a stateful workflow when you need to keep, review, or reference data from previous events. These workflows save all the operations' inputs, outputs, and states to external storage. This information makes reviewing the workflow run details and history possible after each run finishes. Stateful workflows provide high resiliency if outages happen. After services and systems are restored, you can reconstruct interrupted runs from the saved state and rerun the workflows to completion. Stateful workflows can continue running for much longer than stateless workflows.

  By default, stateful workflows in both multi-tenant and single-tenant Azure Logic Apps run asynchronously. All HTTP-based actions follow the standard [asynchronous operation pattern](/azure/architecture/patterns/async-request-reply). After an HTTP action calls or sends a request to an endpoint, service, system, or API, the request receiver immediately returns a ["202 ACCEPTED"](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3) response. This code confirms that the receiver accepted the request but hasn't finished processing. The response can include a `location` header that specifies the URI and a refresh ID that the caller can use to poll or check the status for the asynchronous request until the receiver stops processing and returns a ["200 OK"](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.1) success response or other non-202 response. However, the caller doesn't have to wait for the request to finish processing and can continue to run the next action. For more information, see [Asynchronous microservice integration enforces microservice autonomy](/azure/architecture/microservices/design/interservice-communication#synchronous-versus-asynchronous-messaging).

* *Stateless*

  Create a stateless workflow when you don't need to keep, review, or reference data from previous events in external storage after each run finishes for later review. These workflows save all the inputs and outputs for each action and their states *in memory only*, not in external storage. As a result, stateless workflows have shorter runs that usually finish in 5 minutes or less, faster performance with quicker response times, higher throughput, and reduced running costs because external storage doesn't save the workflow run details and history. However, if outages happen, interrupted runs aren't automatically restored, so the caller needs to manually resubmit interrupted runs.

  A stateless workflow provides the best performance when handling data or content that doesn't exceed 64 KB in *total* size, such as a file. Larger content sizes, such as multiple large attachments, might significantly slow your workflow's performance or even cause your workflow to crash due to out-of-memory exceptions. If your workflow might have to handle larger content sizes, use a stateful workflow instead.

  In stateless workflows, [*managed connector actions*](../connectors/managed.md) are available, but *managed connector triggers* are unavailable. So, to start your workflow, select a [built-in trigger](../connectors/built-in.md) instead, such as the Request, Event Hubs, or Service Bus trigger. These triggers run natively on the Azure Logic Apps runtime. The Recurrence trigger is unavailable for stateless workflows and is available only for stateful workflows. For more information about limited, unavailable, or unsupported triggers, actions, and connectors, see [Changed, limited, unavailable, or unsupported capabilities](#limited-unavailable-unsupported).

  Stateless workflows run only synchronously, so they don't use the standard [asynchronous operation pattern](/azure/architecture/patterns/async-request-reply) used by stateful workflows. Instead, all HTTP-based actions that return a ["202 ACCEPTED"](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3) response continue to the next step in the workflow execution. If the response includes a `location` header, a stateless workflow won't poll the specified URI to check the status. To follow the standard asynchronous operation pattern, use a stateful workflow instead.

  For easier debugging, you can enable run history for a stateless workflow, which has some impact on performance, and then disable the run history when you're done. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#enable-run-history-stateless) or [Create single-tenant based workflows in the Azure portal](create-single-tenant-workflows-visual-studio-code.md#enable-run-history-stateless).

> [!IMPORTANT]
> You have to decide on the workflow type, either stateful or stateless, to implement at creation time. 
> Changes to the workflow type after creation results in runtime errors.

### Summary differences between stateful and stateless workflows

<center>

| Stateful                                                     | Stateless                                                   |
|--------------------------------------------------------------|-------------------------------------------------------------|
| Stores run history, inputs, and outputs                      | Doesn't store run history, inputs, or outputs by default    |
| Managed connector triggers are available and allowed         | Managed connector triggers are unavailable or not allowed   |
| Supports chunking                                            | No support for chunking                                     |
| Supports asynchronous operations                             | No support for asynchronous operations                      |
| Edit default max run duration in host configuration          | Best for workflows with max duration under 5 minutes        |
| Handles large messages                                       | Best for handling small message sizes (under 64 KB)         |

</center>

<a name="nested-behavior"></a>

### Nested behavior differences between stateful and stateless workflows

You can [make a workflow callable](logic-apps-http-endpoint.md) from other workflows that exist in the same **Standard** logic app by using the [Request trigger](../connectors/connectors-native-reqres.md), [HTTP Webhook trigger](../connectors/connectors-native-webhook.md), or managed connector triggers that have the [ApiConnectionWebhook type](logic-apps-workflow-actions-triggers.md#apiconnectionwebhook-trigger) and can receive HTTPS requests.

The following list describes the behavior patterns that nested workflows can follow after a parent workflow calls a child workflow:

* Asynchronous polling pattern

  The parent workflow doesn't wait for the child workflow to respond to their initial call. However, the parent continually checks the child's run history until the child finishes running. By default, stateful workflows follow this pattern, which is ideal for long-running child workflows that might exceed [request timeout limits](logic-apps-limits-and-config.md).

* Synchronous pattern ("fire and forget")

  The child workflow acknowledges the parent workflow's call by immediately returning a `202 ACCEPTED` response. However, the parent doesn't wait for the child to return results. Instead, the parent continues on to the next action in the workflow and receives the results when the child finishes running. Child stateful workflows that don't include a Response action always follow the synchronous pattern and provide a run history for you to review.

  To enable this behavior, in the workflow's JSON definition, set the `operationOptions` property to `DisableAsyncPattern`. For more information, see [Trigger and action types - Operation options](logic-apps-workflow-actions-triggers.md#operation-options).

* Trigger and wait

  Stateless workflows run in memory. So when a parent workflow calls a child stateless workflow, the parent waits for a response that returns the results from the child. This pattern works similarly to using the built-in [HTTP trigger or action](../connectors/connectors-native-http.md) to call a child workflow. Child stateless workflows that don't include a Response action immediately return a `202 ACCEPTED` response, but the parent waits for the child to finish before continuing to the next action. These behaviors apply only to child stateless workflows.

The following table identifies the child workflow's behavior based on whether the parent and child are stateful, stateless, or are mixed workflow types. The list after the table 

| Parent workflow | Child workflow | Child behavior |
|-----------------|----------------|----------------|
| Stateful | Stateful | Asynchronous or synchronous with `"operationOptions": "DisableAsyncPattern"` setting |
| Stateful | Stateless | Trigger and wait |
| Stateless | Stateful | Synchronous |
| Stateless | Stateless | Trigger and wait |

<a name="other-capabilities"></a>

## Other single-tenant model capabilities

The single-tenant model and **Standard** logic app include many current and new capabilities, for example:

* Create logic apps and their workflows from [hundreds of managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Software-as-a-Service (SaaS) and Platform-as-a-Service (PaaS) apps and services plus connectors for on-premises systems.

  * More managed connectors are now available as built-in connectors in Standard workflows. The built-in versions run natively on the single-tenant Azure Logic Apps runtime. Some built-in connectors are also informally known as [*service provider* connectors](../connectors/built-in.md#service-provider-interface-implementation). For a list, review [Built-in connectors in Consumption and Standard](../connectors/built-in.md#built-in-connectors).

  * You can create your own custom built-in connectors for any service that you need by using the single-tenant Azure Logic Apps extensibility framework. Similar to built-in connectors such as Azure Service Bus and SQL Server, custom built-in connectors provide higher throughput, low latency, and local connectivity because they run in the same process as the single-tenant runtime. However, custom built-in connectors aren't similar to [custom managed connectors](../connectors/introduction.md#custom-connectors-and-apis), which aren't currently supported. For more information, review [Custom connector overview](custom-connector-overview.md#custom-connector-standard) and [Create custom built-in connectors for Standard logic apps in single-tenant Azure Logic Apps](create-custom-built-in-connector-standard.md).

  * You can use the following actions for Liquid Operations and XML Operations without an integration account. These operations include the following actions:

    * XML: **Transform XML** and **XML Validation**

    * Liquid: **Transform JSON To JSON**, **Transform JSON To TEXT**, **Transform XML To JSON**, and **Transform XML To Text**

    > [!NOTE]
    > To use these actions in Standard workflows, you need to have Liquid maps, XML maps, or XML schemas. 
    > You can upload these artifacts in the Azure portal from your logic app's resource menu, under **Artifacts**, 
    > which includes the **Schemas** and **Maps** sections. Or, you can add these artifacts to your Visual Studio Code 
    > project's **Artifacts** folder using the respective **Maps** and **Schemas** folders. You can then use these 
    > artifacts across multiple workflows within the *same* logic app.

  * **Standard** logic app workflows can run anywhere because Azure Logic Apps generates Shared Access Signature (SAS) connection strings that these logic apps can use for sending requests to the cloud connection runtime endpoint. Azure Logic Apps saves these connection strings with other application settings so that you can easily store these values in Azure Key Vault when you deploy in Azure.

  * **Standard** logic app workflows support enabling both the [system-assigned managed identity *and* multiple user-assigned managed identities](create-managed-service-identity.md) at the same time, although you can select only one identity to use at a time. While [built-in, service provider-based connectors](/azure/logic-apps/connectors/built-in/reference/) support using the system-assigned identity, most currently don't support selecting user-assigned managed identities for authentication, except for SQL Server and the HTTP connectors.

    > [!NOTE]
    > By default, the system-assigned identity is already enabled to authenticate connections at run time. 
    > This identity differs from the authentication credentials or connection string that you use when you 
    > create a connection. If you disable this identity, connections won't work at run time. To view 
    > this setting, on your logic app's menu, under **Settings**, select **Identity**.

* You can locally run, test, and debug your logic apps and their workflows in the Visual Studio Code development environment.

  Before you run and test your logic app, you can make debugging easier by adding and using breakpoints inside the **workflow.json** file for a workflow. However, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#manage-breakpoints).

* Directly publish or deploy logic apps and their workflows from Visual Studio Code to various hosting environments such as Azure and Azure Arc enabled Logic Apps.

* Enable diagnostics logging and tracing capabilities for your logic app by using [Application Insights](../azure-monitor/app/app-insights-overview.md) when supported by your Azure subscription and logic app settings.

* Access networking capabilities, such as connect and integrate privately with Azure virtual networks, similar to Azure Functions when you create and deploy your logic apps using the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md). For more information, review the following documentation:

  * [Azure Functions networking options](../azure-functions/functions-networking-options.md)

  * [Azure Logic Apps Running Anywhere - Networking possibilities with Azure Logic Apps](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047)

* Regenerate access keys for managed connections used by individual workflows in a **Standard** logic app. For this task, [follow the same steps for a **Consumption** logic app but at the workflow level](logic-apps-securing-a-logic-app.md#regenerate-access-keys), not the logic app resource level.

<a name="built-connectors-standard"></a>

## Built-in connectors for Standard

A **Standard** workflow can use many of the same built-in connectors as a Consumption workflow, but not all. Vice versa, a Standard workflow has many built-in connectors that aren't available in a Consumption workflow.

For example, a Standard workflow has both managed connectors and built-in connectors for Azure Blob, Azure Cosmos DB, Azure Event Hubs, Azure Service Bus, DB2, FTP, MQ, SFTP, SQL Server, and others. Although a Consumption workflow doesn't have these same built-in connector versions, other built-in connectors such as Azure API Management, Azure App Services, and Batch, are available.

In single-tenant Azure Logic Apps, [built-in connectors with specific attributes are informally known as *service providers*](../connectors/built-in.md#service-provider-interface-implementation). Some built-in connectors support only a single way to authenticate a connection to the underlying service. Other built-in connectors can offer a choice, such as using a connection string, Microsoft Entra ID, or a managed identity. All built-in connectors run in the same process as the redesigned Azure Logic Apps runtime. For more information, review the [built-in connector list for Standard logic app workflows](../connectors/built-in.md#built-in-connectors).

<a name="limited-unavailable-unsupported"></a>

## Changed, limited, unavailable, or unsupported capabilities

For the **Standard** logic app workflow, these capabilities have changed, or they're currently limited, unavailable, or unsupported:

* **Triggers and actions**: [Built-in triggers and actions](../connectors/built-in.md) run natively in Azure Logic Apps, while managed connectors are hosted and run using shared resources in Azure. For Standard workflows, some built-in triggers and actions are currently unavailable, such as Sliding Window, Batch, Azure App Service, and Azure API Management. To start a stateful or stateless workflow, use a built-in trigger such as the Request, Event Hubs, or Service Bus trigger. The Recurrence trigger is available for stateful workflows, but not stateless workflows. In the designer, built-in triggers and actions appear with the **In-App** label, while [managed connector triggers and actions](../connectors/managed.md) appear with the **Shared** label.

  For *stateless* workflows, *managed connector actions* are available, but *managed connector triggers* are unavailable. Although you can enable managed connectors for stateless workflows, the designer doesn't show any managed connector triggers for you to add.

  > [!NOTE]
  > To run locally in Visual Studio Code, webhook-based triggers and actions require additional setup. For more information, see 
  > [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#webhook-setup).

  * The following triggers and actions have either changed or are currently limited, unsupported, or unavailable:

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

    * The Gmail connector currently isn't supported.
  
    * [Custom managed connectors](../connectors/introduction.md#custom-connectors-and-apis) currently aren't currently supported. However, you can create *custom built-in operations* when you use Visual Studio Code. For more information, review [Create single-tenant based workflows using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#enable-built-in-connector-authoring).

    * A Standard logic app workflow can have only one trigger and doesn't support multiple triggers.

* **Authentication**: The following authentication types are currently unavailable for **Standard** workflows:

  * Microsoft Entra ID Open Authentication (Microsoft Entra ID OAuth) for inbound calls to request-based triggers, such as the Request trigger and HTTP Webhook trigger.

  * Managed identity authentication: Both system-assigned and user-assigned managed identity support is available. By default, the system-assigned managed identity is automatically enabled. However, most [built-in, service provider-based connectors](/azure/logic-apps/connectors/built-in/reference/) don't currently support selecting user-assigned managed identities for authentication.

* **XML transformation**: Support for referencing assemblies from maps is currently unavailable. Also, only XSLT 1.0 is currently supported.

* **Breakpoint debugging in Visual Studio Code**: Although you can add and use breakpoints inside the **workflow.json** file for a workflow, breakpoints are supported only for actions at this time, not triggers. For more information, see [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#manage-breakpoints).

* **Trigger history and run history**: For a **Standard** logic app, trigger history and run history in the Azure portal appears at the workflow level, not the logic app resource level. For more information, review [Create single-tenant based workflows using the Azure portal](create-single-tenant-workflows-azure-portal.md).

* **Back up and restore for workflow run history**: **Standard** logic apps currently don't support back up and restore for workflow run history.

* **Zoom control**: The zoom control is currently unavailable on the designer.

* **Deployment targets**: You can't deploy a **Standard** logic app resource to an [integration service environment (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md) nor to Azure deployment slots.

* **Azure API Management**: You currently can't import a **Standard** logic app resource into Azure API Management. However, you can import a **Consumption** logic app resource.

<a name="firewall-permissions"></a>

## Strict network and firewall traffic permissions

If your environment has strict network requirements or firewalls that limit traffic, you have to allow access for any trigger or action connections in your workflows. You can optionally allow traffic from [service tags](../virtual-network/service-tags-overview.md) and use the same level of restrictions or policies as Azure App Service. You also need to find and use the fully qualified domain names (FQDNs) for your connections. For more information, review the corresponding sections in the following documentation:

* [Firewall permissions for single tenant logic apps - Azure portal](create-single-tenant-workflows-azure-portal.md#firewall-setup)
* [Firewall permissions for single tenant logic apps - Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#firewall-setup)

## Next steps

* [Create single-tenant based workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md)
* [Create single-tenant based workflows in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

We'd also like to hear about your experiences with single-tenant Azure Logic Apps!

* For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
* For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/lafeedback).
