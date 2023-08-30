---
title: Overview
description: Create and run automated workflows so that you can integrate apps, data, services, and systems using little to no code. In Azure, your workflows can run in a multi-tenant, single-tenant, or dedicated environment.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: overview
ms.custom: mvc, contperf-fy21q4, engagement-fy23
ms.date: 05/24/2023
---

# What is Azure Logic Apps?

Azure Logic Apps is a cloud platform where you can create and run automated workflows with little to no code. By using the visual designer and selecting from prebuilt operations, you can quickly build a workflow that integrates and manages your apps, data, services, and systems.

Azure Logic Apps simplifies the way that you connect legacy, modern, and cutting-edge systems across cloud, on premises, and hybrid environments and provides low-code-no-code tools for you to develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios.

This list describes just a few example tasks, business processes, and workloads that you can automate using Azure Logic Apps:

* Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.

* Route and process customer orders across on-premises systems and cloud services.

* Move uploaded files from an SFTP or FTP server to Azure Storage.

* Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

If you're ready to try creating your first logic app workflow, see [Get started](#get-started).

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Go-serverless-Enterprise-integration-with-Azure-Logic-Apps/player]

For more information, see [Azure Logic Apps on the Azure website](https://azure.microsoft.com/services/logic-apps) and other [Azure Integration Services](https://azure.microsoft.com/product-categories/integration/).

<a name="logic-app-concepts"></a>

## Key terms

The following table briefly defines core terminology and concepts in Azure Logic Apps.

| Term | Description |
|------|-------------|
| **Logic app** | The Azure resource you create when you want to build a workflow. There are [multiple logic app resource types that run in different environments](#resource-environment-differences). |
| **Workflow** | A series of steps that defines a task, business process, or workload. Each workflow starts with a single trigger, after which you must add one or more actions. |
| **Trigger** | Always the first step in any workflow and specifies the condition for running any further steps in that workflow. For example, a trigger event might be getting an email in your inbox or detecting a new file in a storage account. |
| **Action** | Each subsequent step in a workflow that follows after the trigger. Every action runs some operation in a workflow. |
| **Built-in connector** | This connector type provides operations that run natively in Azure Logic Apps. For example, built-in operations provide ways for you to control your workflow's schedule or structure, run your own code, manage and manipulate data, send or receive requests to an endpoint, and complete other tasks in your workflow. <br><br>For example, you can start almost any workflow on a schedule when you use the Recurrence trigger. Or, you can have your workflow wait until called when you use the Request trigger. Such operations don't usually require that you create a connection from your workflow. <br><br>While most built-in operations aren't associated with any service or system, some built-in operations are available for specific services, such as Azure Functions or Azure App Service. For more information and examples, review [Built-in connectors for Azure Logic Apps](../connectors/built-in.md). |
| **Managed connector** | This connector type is a prebuilt proxy or wrapper for a REST API that you can use to access a specific app, data, service, or system. Before you can use most managed connectors, you must first create a connection from your workflow and authenticate your identity. Managed connectors are published, hosted, and maintained by Microsoft. <br><br>For example, you can start your workflow with a trigger or run an action that works with a service such as Office 365, Salesforce, or file servers. For more information, review [Managed connectors for Azure Logic Apps](../connectors/managed.md). |
| **Integration account** | Create this Azure resource when you want to define and store B2B artifacts for use in your workflows. After you [create and link an integration account](logic-apps-enterprise-integration-create-integration-account.md) to your logic app, your workflows can use these B2B artifacts. Your workflows can also exchange messages that follow Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards. <br><br>For example, you can define trading partners, agreements, schemas, maps, and other B2B artifacts. You can create workflows that use these artifacts and exchange messages over protocols such as AS2, EDIFACT, X12, and RosettaNet. |

## Why use Azure Logic Apps

The Azure Logic Apps integration platform provides hundreds of prebuilt connectors so you can connect and integrate apps, data, services, and systems more easily and quickly. You can focus more on designing and implementing your solution's business logic and functionality, not on figuring out how to access your resources.

To communicate with any service endpoint, run your own code, control your workflow structure, manipulate data, or connect to commonly used services with better performance, you can use [built-in connector operations](#logic-app-concepts). These operations run natively on the Azure Logic Apps runtime.

To access and run operations on resources in services such as Azure, Microsoft, other external web apps and services, or on-premises systems, you can use [Microsoft-managed (Azure-hosted) connector operations](#logic-app-concepts). Choose from [hundreds of connectors in a growing Azure ecosystem](/connectors/connector-reference/connector-reference-logicapps-connectors), for example:

* Azure services such as Blob Storage and Service Bus

* Office 365 services such as Outlook, Excel, and SharePoint

* Database servers such as SQL and Oracle

* Enterprise systems such as SAP and IBM MQ

* File shares such as FTP and SFTP

For more information, review the following documentation:

* [About connectors in Azure Logic Apps](../connectors/introduction.md)

* [Managed connectors](../connectors/managed.md)

* [Built-in connectors](../connectors/built-in.md)

You usually won't have to write any code. However, if you do need to write code, you can create code snippets using [Azure Functions](../azure-functions/functions-overview.md) and run that code from your workflow. You can also create code snippets that run in your workflow by using the [**Inline Code** action](logic-apps-add-run-inline-code.md). If your workflow needs to interact with events from Azure services, custom apps, or other solutions, you can monitor, route, and publish events using [Azure Event Grid](../event-grid/overview.md).

Azure Logic Apps is fully managed by Microsoft Azure, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create ["serverless" apps and solutions](logic-apps-serverless-overview.md), you can just focus on the business logic and functionality. These services automatically scale to meet your needs, make integrations faster, and help you build robust cloud apps using little to no code.

To learn how other companies improved their agility and increased focus on their core businesses when they combined Azure Logic Apps with other Azure services and Microsoft products, check out these [customer stories](https://aka.ms/logic-apps-customer-stories).

## How does Azure Logic Apps differ from Functions, WebJobs, and Power Automate?

All these services help you connect and bring together disparate systems. Each service has their advantages and benefits, so combining their capabilities is the best way to quickly build a scalable, full-featured integration system. For more information, review [Choose between Logic Apps, Functions, WebJobs, and Power Automate](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## More about Azure Logic Apps

The following sections provide more information about the capabilities and benefits in Azure Logic Apps:

### Visually create and edit workflows with easy-to-use tools

Save time and simplify complex processes by using the visual design tools in Azure Logic Apps. Create your workflows from start to finish by using the Azure Logic Apps workflow designer in the Azure portal, Visual Studio Code, or Visual Studio. Just start your workflow with a trigger, and add any number of actions from the [connectors gallery](/connectors/connector-reference/connector-reference-logicapps-connectors).

If you're creating a multi-tenant based logic app, get started faster when you [create a workflow from the templates gallery](logic-apps-create-logic-apps-from-templates.md). These templates are available for common workflow patterns, which range from simple connectivity for Software-as-a-Service (SaaS) apps to advanced B2B solutions plus "just for fun" templates.

### Connect different systems across various environments

Some patterns and processes are easy to describe but hard to implement in code. The Azure Logic Apps platform helps you seamlessly connect disparate systems across cloud, on-premises, and hybrid environments. For example, you can connect a cloud marketing solution to an on-premises billing system, or centralize messaging across APIs and systems using Azure Service Bus. Azure Logic Apps provides a fast, reliable, and consistent way to deliver reusable and reconfigurable solutions for these scenarios.

<a name="resource-environment-differences"></a>

### Create and deploy to different environments

Based on your scenario, solution requirements, and desired capabilities, you'll choose to create either a Consumption or Standard logic app workflow. Based on this choice, the workflow runs in either multi-tenant Azure Logic Apps, single-tenant Azure Logic Apps, an App Service Environment (v3), or a dedicated integration service environment. With the last three environments, your workflows can more easily access resources protected by Azure virtual networks. If you create single tenant-based workflows using Azure Arc enabled Logic Apps, you can also run workflows in containers. For more information, see [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md) and [What is Arc enabled Logic Apps](azure-arc-enabled-logic-apps-overview.md)?

The following table briefly summarizes differences between a Consumption and Standard logic app workflow. You'll also learn the differences between the *multi-tenant environment*, *integration service environment* (ISE), *single-tenant environment*, and *App Service Environment v3 (ASEv3)* for deploying, hosting, and running your logic app workflows.

[!INCLUDE [Logic app resource type and environment differences](../../includes/logic-apps-resource-environment-differences-table.md)]

### First-class support for enterprise integration and B2B scenarios

Businesses and organizations electronically communicate with each other by using industry-standard but different message protocols and formats, such as EDIFACT, AS2, X12, and RosettaNet. By using the [enterprise integration capabilities](logic-apps-enterprise-integration-overview.md) supported by Azure Logic Apps, you can create workflows that transform message formats used by trading partners into formats that your organization's systems can interpret and process. Azure Logic Apps handles these exchanges smoothly and securely with encryption and digital signatures. For B2B integration scenarios, Azure Logic Apps includes capabilities from [BizTalk Server](/biztalk/core/introducing-biztalk-server). To define business-to-business (B2B) artifacts, you create an [*integration account*](#logic-app-concepts) where you store these artifacts. After you link this account to your logic app, your workflows can use these B2B artifacts and exchange messages that comply with Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards. For more information, review the following documentation:

You can start small with your current systems and services, and then grow incrementally at your own pace. When you're ready, the Azure Logic Apps platform helps you implement and scale up to more mature integration scenarios by providing these capabilities and more:

* Integrate and build off [Microsoft BizTalk Server](/biztalk/core/introducing-biztalk-server), [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md), [Azure Functions](../azure-functions/functions-overview.md), [Azure API Management](../api-management/api-management-key-concepts.md), and more.

* Exchange messages using [EDIFACT](logic-apps-enterprise-integration-edifact.md), [AS2](logic-apps-enterprise-integration-as2.md), [X12](logic-apps-enterprise-integration-x12.md), and [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) protocols.

* Process [XML messages](logic-apps-enterprise-integration-xml.md) and [flat files](logic-apps-enterprise-integration-flatfile.md).

* Create an [integration account](./logic-apps-enterprise-integration-create-integration-account.md) to store and manage B2B artifacts, such as [trading partners](logic-apps-enterprise-integration-partners.md), [agreements](logic-apps-enterprise-integration-agreements.md), [maps](logic-apps-enterprise-integration-maps.md), [schemas](logic-apps-enterprise-integration-schemas.md), and more.

For example, if you use Microsoft BizTalk Server, your workflows can communicate with your BizTalk Server using the [BizTalk Server connector](../connectors/managed.md#on-premises-connectors). You can then run or extend BizTalk-like operations in your workflows by using [integration account connectors](../connectors/managed.md#integration-account-connectors). In the other direction, BizTalk Server can communicate with your workflows by using the [Microsoft BizTalk Server Adapter for Azure Logic Apps](https://www.microsoft.com/download/details.aspx?id=54287). Learn how to [set up and use the BizTalk Server Adapter](/biztalk/core/logic-app-adapter) in your BizTalk Server.

### Write once, reuse often

Create your logic apps as Azure Resource Manager templates so that you can [set up and automate deployments](logic-apps-azure-resource-manager-templates-overview.md) across multiple environments and regions.

### Built-in extensibility

If no suitable connector is available to run the code you want, you can create and call your own code snippets from your workflow by using [Azure Functions](../azure-functions/functions-overview.md). Or, create your own [APIs](logic-apps-create-api-app.md) and [custom connectors](custom-connector-overview.md) that you can call from your workflows.

### Direct access to resources in Azure virtual networks

Logic app workflows can access secured resources such as virtual machines (VMs), other services, and systems that are inside an [Azure virtual network](../virtual-network/virtual-networks-overview.md) when you use either [Azure Logic Apps (Standard)](single-tenant-overview-compare.md) or an [*integration service environment* (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md). Both Azure Logic Apps (Standard) and an ISE are dedicated instances of the Azure Logic Apps service that use dedicated resources and run separately from the global multi-tenant Azure Logic Apps service.

Running logic apps in your own dedicated instance helps reduce the impact that other Azure tenants might have on app performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).

Azure Logic Apps (Standard) and an ISE also provide the following benefits:

* Your own static IP addresses, which are separate from the static IP addresses that are shared by the logic apps in the multi-tenant service. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, review [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md).

When you create an ISE, Azure *injects* or deploys that ISE into your Azure virtual network. You can then use this ISE as the location for the logic apps and integration accounts that need access. For more information about creating an ISE, review [Connect to Azure virtual networks from Azure Logic Apps](connect-virtual-network-vnet-isolated-environment.md).

<a name="how-do-logic-apps-work"></a>

## How logic apps work

In a logic app, each workflow always starts with a single [trigger](#logic-app-concepts). A trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. After the trigger fires, one or more [actions](#logic-app-concepts) run operations that process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step. Azure Logic Apps implements and uses the "at-least-once" message delivery semantic. Rarely does the service deliver a message more than one time, but no messages are lost. If your business doesn't or can't handle duplicate messages, you need to implement idempotence, so that repeating the same exact operation doesn't change the result after the first execution.

The following screenshot shows part of an example enterprise workflow. This workflow uses conditions and switches to determine the next action. Let's say you have an order system, and your workflow processes incoming orders. You want to review orders above a certain cost manually. Your workflow already has previous steps that determine how much an incoming order costs. So, you create an initial condition based on that cost value. For example:

* If the order is below a certain amount, the condition is false. So, the workflow processes the order.

* If the condition is true, the workflow sends an email for manual review. A switch determines the next step.

  * If the reviewer approves, the workflow continues to process the order.

  * If the reviewer escalates, the workflow sends an escalation email to get more information about the order.

    * If the escalation requirements are met, the response condition is true. So, the order is processed.

    * If the response condition is false, an email is sent regarding the problem.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

You can visually create workflows using the Azure Logic Apps workflow designer in the Azure portal, Visual Studio Code, or Visual Studio. Each workflow also has an underlying definition that's described using JavaScript Object Notation (JSON). If you prefer, you can edit workflows by changing this JSON definition. For some creation and management tasks, Azure Logic Apps provides Azure PowerShell and Azure CLI command support. For automated deployment, Azure Logic Apps supports Azure Resource Manager templates.

## Pricing options

Each logic app resource type, which differs by capabilities and where they run (multi-tenant, single-tenant, integration service environment), has a different [pricing model](logic-apps-pricing.md). For example, multi-tenant based logic apps use consumption pricing, while logic apps in an integration service environment use fixed pricing. Learn more about [pricing and metering](logic-apps-pricing.md) for Azure Logic Apps.

## Get started

Before you can start with Azure Logic Apps, you need an Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

When you're ready, try one or more of the following quickstart guides for Azure Logic Apps. Learn how to create a basic workflow that monitors an RSS feed and sends an email for new content.

* [Create a multi-tenant based logic app workflow in the Azure portal](quickstart-create-example-consumption-workflow.md)

* [Create a multi-tenant based logic app workflow in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md)

* [Create a multi-tenant based logic app workflow in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

You might also want to explore other quickstart guides for Azure Logic Apps:

* [Create a multi-tenant based logic app workflow using an ARM template](quickstart-create-deploy-azure-resource-manager-template.md)

* [Create a multi-tenant based logic app workflow using the Azure CLI](quickstart-logic-apps-azure-cli.md)

## Other resources

Learn more about the Azure Logic Apps platform with these introductory videos:

> [!VIDEO https://learn.microsoft.com/Shows/Azure-Friday/Connect-and-extend-your-mainframe-to-the-cloud-with-Logic-Apps/player]

## Next steps

* [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md)
