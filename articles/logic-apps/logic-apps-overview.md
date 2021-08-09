---
title: Overview for Azure Logic Apps
description: Azure Logic Apps is a cloud platform for automating workflows that integrate apps, data, services, and systems using little to no code. Workflows can run in a multi-tenant, single-tenant, or dedicated environment.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: overview
ms.custom: mvc, contperf-fy21q4
ms.date: 06/22/2021
---

# What is Azure Logic Apps?

[Azure Logic Apps](https://azure.microsoft.com/services/logic-apps) is a cloud-based platform for creating and running automated [*workflows*](#workflow) that integrate your apps, data, services, and systems. With this platform, you can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios. As a member of [Azure Integration Services](https://azure.microsoft.com/product-categories/integration/), Logic Apps simplifies the way that you connect legacy, modern, and cutting-edge systems across cloud, on premises, and hybrid environments.

The following list describes just a few example tasks, business processes, and workloads that you can automate using the Logic Apps service:

* Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.
* Route and process customer orders across on-premises systems and cloud services.
* Move uploaded files from an SFTP or FTP server to Azure Storage.
* Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Introducing-Azure-Logic-Apps/player]

Based on the logic app resource type that you choose and create, your logic apps run in either a multi-tenant, single-tenant, or dedicated integration service environment. For example, when you containerize single-tenant based logic apps, you can deploy your apps as containers and run them anywhere that Azure Functions can run. For more information, review [Resource type and host environment differences for logic apps](#resource-environment-differences).

To securely access and run operations in real time on various data sources, you can choose [*managed connectors*](#managed-connector) from a [400+ and growing Azure connectors ecosystem](/connectors/connector-reference/connector-reference-logicapps-connectors) to use in your workflows, for example:

* Azure services such as Blob Storage and Service Bus
* Office 365 services such as Outlook, Excel, and SharePoint
* Database servers such as SQL and Oracle
* Enterprise systems such as SAP and IBM MQ
* File shares such as FTP and SFTP

To communicate with any service endpoint, run your own code, organize your workflow, or manipulate data, you can use [*built-in*](#built-in-operations) triggers and actions, which run natively within the Logic Apps service. For example, built-in triggers include Request, HTTP, and Recurrence. Built-in actions include Condition, For each, Execute JavaScript code, and operations that call Azure functions, web apps or API apps hosted in Azure, and other Logic Apps workflows.

For B2B integration scenarios, Logic Apps includes capabilities from [BizTalk Server](/biztalk/core/introducing-biztalk-server). To define business-to-business (B2B) artifacts, you create [*integration account*](#integration-account) where you store these artifacts. After you link this account to your logic app, your workflows can use these B2B artifacts and exchange messages that comply with Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards.

For more information about the ways workflows can access and work with apps, data, services, and systems, review the following documentation:

* [Connectors for Azure Logic Apps](../connectors/apis-list.md)
* [Managed connectors for Azure Logic Apps](../connectors/built-in.md)
* [Built-in triggers and actions for Azure Logic Apps](../connectors/managed.md)
* [B2B enterprise integration solutions with Azure Logic Apps](logic-apps-enterprise-integration-overview.md)

<a name="logic-app-concepts"></a>

## Key terms

The following terms are important concepts in the Logic Apps service.

### Logic app

A *logic app* is the Azure resource you create when you want to develop a workflow. There are [multiple logic app resource types that run in different environments](#resource-environment-differences).

### Workflow

A *workflow* is a series of steps that defines a task or process. Each workflow starts with a single trigger, after which you must add one or more actions.

### Trigger 

A *trigger* is always the first step in any workflow and specifies the condition for running any further steps in that workflow. For example, a trigger event might be getting an email in your inbox or detecting a new file in a storage account.

### Action

An *action* is each step in a workflow after the trigger. Every action runs some operation in a workflow.

### Built-in operations

A *built-in* trigger or action is an operation that runs natively in Azure Logic Apps. For example, built-in operations provide ways for you to control your workflow's schedule or structure, run your own code, manage and manipulate data, send or receive requests to an endpoint, and complete other tasks in your workflow.

Most built-in operations aren't associated with any service or system, but some built-in operations are available for specific services, such as Azure Functions or Azure App Service. Many also don't require that you first create a connection from your workflow and authenticate your identity. For more information and examples, review [Built-in operations for Azure Logic Apps](../connectors/built-in.md).

For example, you can start almost any workflow on a schedule when you use the Recurrence trigger. Or, you can have your workflow wait until called when you use the Request trigger. 
 

### Managed connector

A *managed connector* is a prebuilt proxy or wrapper for a REST API that you can use to access a specific app, data, service, or system. Before you can use most managed connectors, you must first create a connection from your workflow and authenticate your identity. Managed connectors are published, hosted, and maintained by Microsoft. For more information, review [Managed connectors for Azure Logic Apps](../connectors/managed.md).

For example, you can start your workflow with a trigger or run an action that works with a service such as Office 365, Salesforce, or file servers.

### Integration account

An *integration account* is the Azure resource you create when you want to define and store B2B artifacts for use in your workflows. After you [create and link an integration account](logic-apps-enterprise-integration-create-integration-account.md) to your logic app, your workflows can use these B2B artifacts. Your workflows can also exchange messages that follow Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards.

For example, you can define trading partners, agreements, schemas, maps, and other B2B artifacts. You can create workflows that use these artifacts and exchange messages over protocols such as AS2, EDIFACT, X12, and RosettaNet.

<a name="how-do-logic-apps-work"></a>

## How logic apps work

In a logic app, each workflow always starts with a single [trigger](#trigger). A trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. Following the trigger, one or more [actions](#action) run operations that, for example, process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step.

The following screenshot shows part of an example enterprise workflow. This workflow uses conditions and switches to determine the next action. Let's say you have an order system, and your workflow processes incoming orders. You want to review orders above a certain cost manually. Your workflow already has previous steps that determine how much an incoming order costs. So, you create an initial condition based on that cost value. For example:

- If the order is below a certain amount, the condition is false. So, the workflow processes the order.
- If the condition is true, the workflow sends an email for manual review. A switch determines the next step. 
  - If the reviewer approves, the workflow continues to process the order.
  - If the reviewer escalates, the workflow sends an escalation email to get more information about the order. 
      - If the escalation requirements are met, the response condition is true. So, the order is processed. 
      - If the response condition is false, an email is sent regarding the problem.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer and a sample enterprise workflow that uses switches and conditions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

You can visually create workflows using the Logic Apps designer in the Azure portal, Visual Studio Code, or Visual Studio. Each workflow also has an underlying definition that's described using JavaScript Object Notation (JSON). If you prefer, you can edit workflows by changing this JSON definition. For some creation and management tasks, Logic Apps provides Azure PowerShell and Azure CLI command support. For automated deployment, Logic Apps supports Azure Resource Manager templates.

<a name="resource-environment-differences"></a>

## Resource type and host environment differences

To create logic app workflows, you choose the **Logic App** resource type based on your scenario, solution requirements, the capabilities that you want, and the environment where you want to run your workflows.

The following table briefly summarizes differences between the original **Logic App (Consumption)** resource type and the **Logic App (Standard)** resource type. You'll also learn how the *single-tenant* model compares to the *multi-tenant* and *integration service environment (ISE)* models for deploying, hosting, and running your logic app workflows.

[!INCLUDE [Logic app resource type and environment differences](../../includes/logic-apps-resource-environment-differences-table.md)]

## Why use Logic Apps

The Logic Apps integration platform provides prebuilt Microsoft-managed API connectors and built-in operations so you can connect and integrate apps, data, services, and systems more easily and quickly. You can focus more on designing and implementing your solution's business logic and functionality, not on figuring out how to access your resources.

You usually won't have to write any code. However, if you do need to write code, you can create code snippets using [Azure Functions](../azure-functions/functions-overview.md) and run that code from your workflow. You can also create code snippets that run in your workflow by using the [**Inline Code** action](logic-apps-add-run-inline-code.md). If your workflow needs to interact with events from Azure services, custom apps, or other solutions, you can monitor, route, and publish events using [Azure Event Grid](../event-grid/overview.md).

Logic Apps is fully managed by Microsoft Azure, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create ["serverless" apps and solutions](../logic-apps/logic-apps-serverless-overview.md), you can just focus on the business logic and functionality. These services automatically scale to meet your needs, make integrations faster, and help you build robust cloud apps using little to no code.

To learn how other companies improved their agility and increased focus on their core businesses when they combined Logic Apps with other Azure services and Microsoft products, check out these [customer stories](https://aka.ms/logic-apps-customer-stories).

The following sections provide more information about the capabilities and benefits in Logic Apps:

#### Visually create and edit workflows with easy-to-use tools

Save time and simplify complex processes by using the visual design tools in Logic Apps. Create your workflows from start to finish by using the Logic Apps Designer in the Azure portal, Visual Studio Code, or Visual Studio. Just start your workflow with a trigger, and add any number of actions from the [connectors gallery](/connectors/connector-reference/connector-reference-logicapps-connectors).

If you're creating a multi-tenant based logic app, get started faster when you [create a workflow from the templates gallery](../logic-apps/logic-apps-create-logic-apps-from-templates.md). These templates are available for common workflow patterns, which range from simple connectivity for Software-as-a-Service (SaaS) apps to advanced B2B solutions plus "just for fun" templates.

#### Connect different systems across various environments

Some patterns and processes are easy to describe but hard to implement in code. The Logic Apps platform helps you seamlessly connect disparate systems across cloud, on-premises, and hybrid environments. For example, you can connect a cloud marketing solution to an on-premises billing system, or centralize messaging across APIs and systems using Azure Service Bus. Logic Apps provides a fast, reliable, and consistent way to deliver reusable and reconfigurable solutions for these scenarios.

#### Write once, reuse often

Create your logic apps as Azure Resource Manager templates so that you can [set up and automate deployments](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md) across multiple environments and regions.

#### First-class support for enterprise integration and B2B scenarios

Businesses and organizations electronically communicate with each other by using industry-standard but different message protocols and formats, such as EDIFACT, AS2, X12, and RosettaNet. By using the [enterprise integration capabilities](../logic-apps/logic-apps-enterprise-integration-overview.md) supported by Logic Apps, you can create workflows that transform message formats used by trading partners into formats that your organization's systems can interpret and process. Logic Apps handles these exchanges smoothly and securely with encryption and digital signatures.

You can start small with your current systems and services, and then grow incrementally at your own pace. When you're ready, the Logic Apps platform helps you implement and scale up to more mature integration scenarios by providing these capabilities and more:

* Integrate and build off [Microsoft BizTalk Server](/biztalk/core/introducing-biztalk-server), [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md), [Azure Functions](../azure-functions/functions-overview.md), [Azure API Management](../api-management/api-management-key-concepts.md), and more.
* Exchange messages using [EDIFACT](../logic-apps/logic-apps-enterprise-integration-edifact.md), [AS2](../logic-apps/logic-apps-enterprise-integration-as2.md), [X12](../logic-apps/logic-apps-enterprise-integration-x12.md), and [RosettaNet](logic-apps-enterprise-integration-rosettanet.md) protocols.
* Process [XML messages](../logic-apps/logic-apps-enterprise-integration-xml.md) and [flat files](../logic-apps/logic-apps-enterprise-integration-flatfile.md).
* Create an [integration account](./logic-apps-enterprise-integration-create-integration-account.md) to store and manage B2B artifacts, such as [trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md), [agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md), [transform maps](../logic-apps/logic-apps-enterprise-integration-maps.md), [validation schemas](../logic-apps/logic-apps-enterprise-integration-schemas.md), and more.

For example, if you use Microsoft BizTalk Server, your workflows can communicate with your BizTalk Server using the [BizTalk Server connector](../connectors/managed.md#on-premises-connectors). You can then run or extend BizTalk-like operations in your workflows by using [integration account connectors](../connectors/managed.md#integration-account-connectors). Going in the other direction, BizTalk Server can communicate with your workflows by using the [Microsoft BizTalk Server Adapter for Logic Apps](https://www.microsoft.com/download/details.aspx?id=54287). Learn how to [set up and use the BizTalk Server Adapter](/biztalk/core/logic-app-adapter) in your BizTalk Server.

#### Built-in extensibility

If no suitable connector is available to run the code you want, you can create and call your own code snippets from your workflow by using [Azure Functions](../azure-functions/functions-overview.md). Or, create your own [APIs](../logic-apps/logic-apps-create-api-app.md) and [custom connectors](../logic-apps/custom-connector-overview.md) that you can call from your workflows.

#### Access resources inside Azure virtual networks

Logic app workflows can access secured resources, such as virtual machines (VMs) and other systems or services, that are inside an [Azure virtual network](../virtual-network/virtual-networks-overview.md) when you create an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is a dedicated instance of the Azure Logic Apps service that uses dedicated resources and runs separately from the global multi-tenant Azure Logic Apps service.

Running logic apps in your own dedicated instance helps reduce the impact that other Azure tenants might have on app performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors). An ISE also provides these benefits:

* Your own static IP addresses, which are separate from the static IP addresses that are shared by the logic apps in the multi-tenant service. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, review [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md).

When you create an ISE, Azure *injects* or deploys that ISE into your Azure virtual network. You can then use this ISE as the location for the logic apps and integration accounts that need access. For more information about creating an ISE, review [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

#### Pricing options

Each logic app type, which differs by capabilities and where they run (multi-tenant, single-tenant, integration service environment), has a different [pricing model](../logic-apps/logic-apps-pricing.md). For example, multi-tenant based logic apps use consumption pricing, while logic apps in an integration service environment use fixed pricing. Learn more about [pricing and metering](../logic-apps/logic-apps-pricing.md) for Logic Apps.

## How does Logic Apps differ from Functions, WebJobs, and Power Automate?

All these services help you connect and bring together disparate systems. Each service has their advantages and benefits, so combining their capabilities is the best way to quickly build a scalable, full-featured integration system. For more information, review [Choose between Logic Apps, Functions, WebJobs, and Power Automate](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## Get started

Before you can start with Azure Logic Apps, you need an Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). 

When you're ready, try one or more of the following quickstart guides for Logic Apps. Learn how to create a basic workflow that monitors an RSS feed and sends an email for new content.

* [Create a multi-tenant based logic app in the Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Create a multi-tenant based logic app in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md)
* [Create a multi-tenant based logic app in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md)

You might also want to explore other quickstart guides for Logic Apps:

* [Create a multi-tenant based logic app using an ARM template](quickstart-create-deploy-azure-resource-manager-template.md)
* [Create a multi-tenant based logic app using the Azure CLI](quickstart-create-deploy-azure-resource-manager-template.md)


## Other resources

Learn more about the Logic Apps platform with these introductory videos:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Go-serverless-Enterprise-integration-with-Azure-Logic-Apps/player]
>
> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Connect-and-extend-your-mainframe-to-the-cloud-with-Logic-Apps/player]

## Next steps

* [Quickstart: Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md)
