---
title: Overview
description: Create automated workflows that integrate cloud services, on-premises systems, apps, and data with little or no code. Run workflows in multitenant or single-tenant Azure Logic Apps, App Service Environment (ASE), or a partially connected environment.
services: azure-logic-apps
ms.suite: integration
author: ecfan
ms.reviewer: azla
ms.topic: overview
ms.collection: ce-skilling-ai-copilot
ms.date: 01/29/2025
---

# What is Azure Logic Apps?

Azure Logic Apps is a cloud platform where you can create and run automated workflows in, across, and outside the software ecosystems in your enterprise or organization. This platform greatly reduces or removes the need to write code when your workflows must connect and work with resources from different components, such as services, systems, apps, and data sources.

Azure Logic Apps includes low-code-no-code tools for you to work with legacy, modern, and cutting-edge systems that exist in the cloud, on premises, or in hybrid environments. For example, you use a visual designer along with prebuilt operations to make building workflows as easy as possible. These prebuilt operations act as the building blocks in your workflows by giving you access to various resources and completing common tasks, such as getting data, sending data, and managing data. With Azure Logic Apps, you can build integration solutions that scale and support the business scenarios for your enterprise or organization's needs.

The following examples describe only a sample of tasks, business processes, and workloads that you can automate with Azure Logic Apps:

* Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.
* Route and process customer orders across on-premises systems and cloud services.
* Move uploaded files from an SFTP or FTP server to Azure Blob Storage.
* Monitor social media activity, analyze the sentiment, and create alerts or tasks for items that need review.

The following example workflow uses conditions and switches to determine the next action. Suppose you have an order system, and your workflow processes incoming orders. You want to manually review orders above a certain cost. Your workflow already has steps that determine the cost from an incoming order. So, you add a condition that compares each order to your cost threshold, for example:

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

For more information about the logic behind this workflow, see [How logic apps work](#how-logic-apps-work).

> [!TIP]
>
> To learn more, you can ask Azure Copilot these questions:
>
> - *What problems can I solve with Azure Logic Apps?*
> - *What benefits does Azure Logic Apps provide?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

To try creating your first workflow, see [Get started](#get-started). To continue learning more, watch this video:

> [!VIDEO https://learn-video.azurefd.net/vod/player?show=azure-friday&ep=integrate-your-mainframes-and-midranges-with-azure-logic-apps]

For more information, visit [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps) and other [Azure Integration Services](https://azure.microsoft.com/product-categories/integration/) on the Microsoft Azure website.

## Why use Azure Logic Apps

The Azure Logic Apps platform provides [1,400+ prebuilt connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that connects and integrates your workflows with various services, systems, apps, and data. This constantly expanding connector ecosystem helps you reduce or eliminate the work required to access your resources. Instead, you can focus more on designing and developing the business logic and functionality required for your solutions to meet your business needs.

To communicate with any service endpoint, run your own code, control your workflow structure, manipulate data, or connect to commonly used resources with increased speed, capacity, and throughput, you can use [built-in connector operations](#logic-app-concepts). These operations natively run on the Azure Logic Apps runtime, rather than in Azure, for better performance.

To access and work with resources created and managed using services such as Azure, Microsoft, external web apps and services, or on-premises systems, you can use [managed connector operations](#logic-app-concepts). These operations are hosted and run in global, multitenant Azure. You can choose from [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors), for example:

* Azure services such as Blob Storage and Service Bus
* Office 365 services such as Outlook, Excel, and SharePoint
* Database servers such as SQL and Oracle
* Enterprise systems such as SAP and IBM MQ
* File shares such as FTP and SFTP

For more information, see the following articles:

* [What are connectors in Azure Logic Apps](../connectors/introduction.md)
* [Built-in connectors](../connectors/built-in.md)
* [Managed connectors](../connectors/managed.md)

When you build workflows with Azure Logic Apps, you usually don't have to write any code. However, if you have to create and run your own code, Azure Logic Apps supports this capability. For example, in workflows that run in multitenant Azure Logic Apps, you can write and run JavaScript code snippets directly within your workflow. For more complex and structured code, you can create and call functions from your workflows when you use the Azure Functions platform. For workflows that run in single-tenant Azure Logic Apps, App Service Environment (ASE) v3, or partially connected environments, you can write and run JavaScript code snippets, .NET code, C# scripts, and PowerShell scripts directly within your workflow.

If your workflow needs to interact with events from other Azure services, custom apps, or other solutions, you can monitor, route, and publish events by using [Azure Event Grid](../event-grid/overview.md) or [Azure Event Hubs](../event-hubs/event-hubs-about.md).

For more information, see the following articles:

- [Add and run JavaScript code inline with workflows](add-run-javascript.md)
- [Azure Functions overview](../azure-functions/functions-overview.md) and [Call Azure Functions from workflows](call-azure-functions-from-workflows.md)
- [Create and run .NET code from Standard workflows](create-run-custom-code-functions.md)
- [Add and run C# scripts](add-run-csharp-scripts.md)
- [Add and run PowerShell scripts](add-run-powershell-scripts.md)

Azure Logic Apps is fully managed by Microsoft Azure, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create ["serverless" apps and solutions](logic-apps-serverless-overview.md), you can focus more on the building the business logic and functionality. Serverless platforms automatically scale to meet your needs, make integrations work faster, and help you build robust cloud apps using little to no code.

To learn how other companies improved their agility and increased focus on their core businesses when they combined Azure Logic Apps with other Azure services and Microsoft products, [check out these customer stories](https://aka.ms/logic-apps-customer-stories).

<a name="logic-app-concepts"></a>

## Key terms

The following table briefly defines core terminology and concepts in Azure Logic Apps.

| Term | Description |
|------|-------------|
| **Logic app** | The Azure resource that you create when you want to build a workflow. Basically, you can create the following types of logic app resources: <br><br>- A **Consumption** logic app resource that supports a single workflow, which is hosted and run in multitenant Azure Logic Apps <br><br>- A **Standard** logic app resource that supports multiple workflows, which are hosted and run in single-tenant Azure Logic Apps, App Service Environment (ASE) v3 - Windows plans only, or a partially connected environment <br><br>Learn more about [logic app resource types along with their respective computing resource and billing models](#resource-environment-differences). |
| **Workflow** | A series of operations that define a task, business process, or workload. Each workflow always starts with a single trigger operation, after which you must add one or more action operations. |
| **Trigger** | The first operation in any workflow that specifies the criteria to meet before running any subsequent operations in that workflow. For example, a trigger event might be getting an email in your inbox or detecting a new file in a storage account. |
| **Action** | Each subsequent operation that follows the trigger in the workflow. |
| **Built-in connector** | This connector or operation type is "built in" to the Azure Logic Apps runtime so that operations run natively and directly along with the runtime for faster performance, compared to Microsoft-managed connectors that are hosted and run in Azure. <br><br>Built-in operations provide ways for you to control your workflow's schedule or structure, run your own code, manage and manipulate data, send or receive requests to an endpoint, and complete other tasks in your workflow. <br><br>For example, you can start almost any workflow on a schedule when you use the **Recurrence** trigger. Or, you can have your workflow wait until called when you use the **Request** trigger. These operations don't usually require that you create a connection from your workflow. <br><br>While most built-in operations aren't associated with any service or system, some built-in operations are available for specific services, such as Azure Functions, Azure Blob Storage, Azure App Service, and more. The availability for these built-in operations depends on whether you're working on a Consumption or Standard logic app workflow. For more information and examples, see [Built-in connectors for Azure Logic Apps](../connectors/built-in.md). |
| **Managed connector** | This connector or operation type is Microsoft-published, managed, hosted, and run in Azure and is a prebuilt proxy or wrapper for a service or system's REST API, which you can use to access a specific app, data, service, or system. Before you can use most managed connectors, you must first create a connection from your workflow and authenticate your identity. <br><br>For example, you can start your workflow with a trigger or run an action that works with a service such as Office 365, Salesforce, or file servers. For more information, see [Managed connectors for Azure Logic Apps](../connectors/managed.md). |
| **Integration account** | Create this Azure resource when you want to define and store B2B artifacts for use in your workflows. After you [create and link an integration account](logic-apps-enterprise-integration-create-integration-account.md) to your logic app, your workflows can use these B2B artifacts. Your workflows can also exchange messages that follow Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards. <br><br>For example, you can define trading partners, agreements, schemas, maps, and other B2B artifacts. You can create workflows that use these artifacts and exchange messages over protocols such as AS2, EDIFACT, X12, and RosettaNet. |

## How fast can I ramp up with Azure Logic Apps?

You can start small with your current systems and services, and then grow incrementally at your own pace. When you're ready, Azure Logic Apps helps you implement and scale up to more mature integration scenarios by providing the following capabilities and benefits.

### Visually create and edit workflows with easy-to-use tools

Save time and simplify complex processes by using the visual design tools in Azure Logic Apps. Create your workflows from start to finish by using the Azure Logic Apps workflow designer in the Azure portal or Visual Studio Code. Just start your workflow with a trigger, and add any number of actions from the [connectors gallery](/connectors/connector-reference/connector-reference-logicapps-connectors).

### Connect different systems across various environments

Some patterns and processes are easy to describe but hard to implement in code. Azure Logic Apps helps you seamlessly connect disparate systems across cloud, on-premises, and hybrid environments. For example, you can connect a cloud marketing solution to an on-premises billing system, or centralize messaging across APIs and systems using Azure Service Bus. Azure Logic Apps provides a fast, reliable, and consistent way to deliver reusable and reconfigurable solutions for these scenarios.

<a name="resource-environment-differences"></a>

### Create and deploy to different environments

Based on your scenario, solution requirements, and desired capabilities, choose whether to create a Consumption or Standard logic app workflow. Based on this choice, the workflow runs in either multitenant Azure Logic Apps, single-tenant Azure Logic Apps, or an App Service Environment (v3). With single-tenant Azure Logic Apps, your workflows can more easily access resources protected by Azure virtual networks. If you create single tenant-based workflows using Azure Arc enabled Logic Apps, you can also run workflows in containers. For more information, see [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md) and [What is Arc enabled Logic Apps](azure-arc-enabled-logic-apps-overview.md)?

The following table briefly summarizes differences between a Consumption and Standard logic app workflow. You'll also learn the differences between the multitenant environment, single-tenant environment, and App Service Environment v3 (ASEv3) for deploying, hosting, and running your logic app workflows.

[!INCLUDE [Logic app resource type and environment differences](../../includes/logic-apps-resource-environment-differences-table.md)]

### First-class support for enterprise integration and B2B scenarios

Businesses and organizations electronically communicate with each other by using industry-standard but different message protocols and formats, such as EDIFACT, AS2, X12, and RosettaNet. By using the [enterprise integration capabilities](logic-apps-enterprise-integration-overview.md) supported by Azure Logic Apps, you can create workflows that transform message formats used by trading partners into formats that your organization's systems can interpret and process. Azure Logic Apps handles these exchanges smoothly and securely with encryption and digital signatures. For B2B integration scenarios, Azure Logic Apps includes capabilities from [BizTalk Server](/biztalk/core/introducing-biztalk-server). To define business-to-business (B2B) artifacts, you create an [*integration account*](#logic-app-concepts) where you store these artifacts. After you link this account to your logic app resource, your workflow can use these B2B artifacts and exchange messages that comply with Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards.

For more information, see the following documentation:

* Integrate and build off [Microsoft BizTalk Server](/biztalk/core/introducing-biztalk-server), [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md), [Azure Functions](../azure-functions/functions-overview.md), [Azure API Management](../api-management/api-management-key-concepts.md), and more.

* Exchange messages using [EDIFACT](logic-apps-enterprise-integration-edifact.md), [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) protocols.

* Process [XML messages](logic-apps-enterprise-integration-xml.md) and [flat files](logic-apps-enterprise-integration-flatfile.md).

* Create an [integration account](./logic-apps-enterprise-integration-create-integration-account.md) to store and manage B2B artifacts, such as [trading partners](logic-apps-enterprise-integration-partners.md), [agreements](logic-apps-enterprise-integration-agreements.md), [maps](logic-apps-enterprise-integration-maps.md), [schemas](logic-apps-enterprise-integration-schemas.md), and more.

For example, if you use Microsoft BizTalk Server, your workflows can communicate with your BizTalk Server using the [BizTalk Server connector](../connectors/managed.md#on-premises-connectors). You can then run or extend BizTalk-like operations in your workflows by using [integration account connectors](../connectors/managed.md#integration-account-connectors). In the other direction, BizTalk Server can communicate with your workflows by using the [Microsoft BizTalk Server Adapter for Azure Logic Apps](https://www.microsoft.com/download/details.aspx?id=54287). Learn how to [set up and use the BizTalk Server Adapter](/biztalk/core/logic-app-adapter) in your BizTalk Server.

### Write once, reuse often

Create your logic app workflows as Azure Resource Manager templates so that you can [set up and automate deployments](logic-apps-azure-resource-manager-templates-overview.md) across multiple environments and regions.

### Built-in extensibility

If no suitable connector is available to run the code you want, you can create and run code snippets from your workflow by using the **Inline Code** action for [JavaScript](add-run-javascript.md) or [C# scripts](add-run-csharp-scripts.md), you can use [Azure Functions](../azure-functions/functions-overview.md). You can also create [APIs](logic-apps-create-api-app.md) and [custom connectors](custom-connector-overview.md) that you can call from your workflows.

### Direct access to resources in Azure virtual networks

Logic app workflows can access secured resources such as virtual machines, other services, and systems that are inside an [Azure virtual network](../virtual-network/virtual-networks-overview.md) when you use [Azure Logic Apps (Standard)](single-tenant-overview-compare.md). Azure Logic Apps (Standard) is a single-tenant instance Azure Logic Apps that uses dedicated resources and runs separately from global, multitenant Azure Logic Apps.

Hosting and running logic app workflows in your own dedicated instance helps reduce the impact that other Azure tenants might have on app performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).

Azure Logic Apps (Standard) provides the following benefits:

* Your own static IP addresses, which are separate from the static IP addresses that logic apps share in multitenant Azure Logic Apps. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, review [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md).

<a name="how-logic-apps-work"></a>

## How logic apps work

A logic app workflow always starts with a single [trigger](#logic-app-concepts). The trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. After the trigger fires, one or more [actions](#logic-app-concepts) run operations that process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step.

Based on the earlier example, the following section explains the logic behind the example workflow, which processes incoming orders for an order system. As a reminder, your goal is to manually review orders above a certain cost. The workflow already has steps that determine the cost from an incoming order. So, you add a condition that compares each order to your cost threshold, for example:

* If the order is below a certain amount, the condition is false. So, the workflow processes the order.
* If the condition is true, the workflow sends an email for manual review. A switch determines the next step.

  * If the reviewer approves, the workflow continues to process the order.
  * If the reviewer escalates, the workflow sends an escalation email to get more information about the order.

    * If the escalation requirements are met, the response condition is true. So, the order is processed.
    * If the response condition is false, an email is sent regarding the problem.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot shows the workflow designer and a sample enterprise workflow that uses switches and conditions.":::

Azure Logic Apps uses the "at-least-once" message delivery semantic. Rarely does the service deliver a message more than one time, but no messages are lost. If your business doesn't handle or can't handle duplicate messages, you need to implement *idempotence*, which is the capability to accept identical or duplicate messages, while preserving data integrity and system stability. That way, repeats of the same operation don't change the result after the first execution.

You can visually create workflows using the Azure Logic Apps workflow designer in the Azure portal or Visual Studio Code. Each workflow also has an underlying definition that uses JavaScript Object Notation (JSON) format. If you prefer, you can edit workflows by changing this JSON definition. For some creation and management tasks, Azure Logic Apps provides Azure PowerShell and Azure CLI command support. For automated deployment, Azure Logic Apps supports Azure Resource Manager templates.

## Pricing options

Each logic app hosting option (multitenant, single-tenant, App Service Environment (ASE) v3, or partially connected environment) has a different [pricing model](logic-apps-pricing.md). For example, multitenant Consumption logic app workflows follow the Consumption pricing model, while single-tenant Standard logic app workflows follow the Standard pricing model. For specific pricing details, see [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/).

## How does Azure Logic Apps differ from Functions, WebJobs, and Power Automate?

All these services help you connect and bring together disparate systems. Each service has their advantages and benefits, so combining their capabilities is the best way to quickly build a scalable, full-featured integration system. For more information, see [Choose between Azure Logic Apps, Azure Functions, Azure WebJobs, and Microsoft Power Automate](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## How does Azure Logic Apps differ from Azure Automation Runbooks?

[Azure Automation Runbooks](/azure/automation/automation-runbook-types) provide a lightweight and cost-effective solution for straightforward remediations, such as restarting virtual machines. In contrast, the Azure Logic Apps platform is ideal for automated workflows or orchestrations that involve multiple services, systems, apps, and data. These scenarios also include workloads that run custom code or that require complex logic that uses control structures such as loops, branching, conditions, and more.

## Get started

Before you can start trying out Azure Logic Apps, you need an Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

When you're ready, get started with one or more of the following how-to guides for Azure Logic Apps:

* [Create a multitenant Consumption logic app workflow with the Azure portal](quickstart-create-example-consumption-workflow.md)
* [Create a multitenant Consumption logic app workflow with Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)
* [Create a single-tenant Standard logic app workflow with the Azure portal](create-single-tenant-workflows-azure-portal.md)
* [Create a single-tenant Standard logic app workflow with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)

## Next steps

* [Quickstart: Create an example Consumption logic app workflow in multitenant Azure Logic Apps in the Azure portal](quickstart-create-example-consumption-workflow.md)
