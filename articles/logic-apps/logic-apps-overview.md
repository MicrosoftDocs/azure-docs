---
title: Overview for Azure Logic Apps
description: The Logic Apps cloud platform helps you create and run automated workflows for enterprise integration scenarios using little to no code.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: overview
ms.custom: mvc
ms.date: 04/26/2021
---

# What is Azure Logic Apps

[Logic Apps](https://azure.microsoft.com/services/logic-apps) is a cloud-based platform that helps you create and run automated [workflows](#logic-app-concepts) for integrating apps, data, services, and systems. Using this platform, you can more easily and quickly build highly scalable integration solutions for enterprise and business-to-business (B2B) scenarios. As a member of [Azure Integration Services](https://azure.microsoft.com/product-categories/integration/), Logic Apps provides a simpler way for you to connect legacy, modern, and cutting-edge systems across cloud, on premises, and hybrid environments.

This list describes just a few example tasks, business processes, and workloads that you can automate with the Logic Apps service:

* Schedule and send email notifications using Office 365 when a specific event happens, for example, a new file is uploaded.
* Route and process customer orders across on-premises systems and cloud services.
* Move uploaded files from an SFTP or FTP server to Azure Storage.
* Monitor tweets, analyze the sentiment, and create alerts or tasks for items that need review.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Introducing-Azure-Logic-Apps/player]

To securely access and run operations in real time on various data sources, choose from a [constantly growing gallery](/connectors/connector-reference/connector-reference-logicapps-connectors) of [Microsoft-managed connectors](#logic-app-concepts), for example:

* Azure services such as Blob Storage and Service Bus
* Office services such as Outlook, Excel, and SharePoint
* Database servers such as SQL and Oracle
* Enterprise systems such as SAP and IBM MQ
* File shares such as FTP and SFTP

To communicate with any service endpoint, run your own code, organize your workflow, or manipulate data, you can use [built-in triggers and actions](#logic-app-concepts), which run natively within the Logic Apps service. For example, built-in triggers include Request, HTTP, and Recurrence. Built-in actions include Condition, For each, Execute JavaScript code, and operations that call Azure functions, web apps or API apps hosted in Azure, and other Logic Apps workflows.

For B2B integration scenarios, Logic Apps includes capabilities from [BizTalk Server](/biztalk/core/introducing-biztalk-server). You can create an [integration account](logic-apps-enterprise-integration-create-integration-account.md) where you define trading partners, agreements, schemas, maps, and other B2B artifacts. When you link this account to a logic app, you can build workflows that work with these artifacts and exchange messages using protocols such as AS2, EDIFACT, X12, and RosettaNet.

For more information about the ways workflows can access and work with apps, data, services, and systems, review the following documentation:

* [Connectors for Azure Logic Apps](../connectors/apis-list.md)
* [Managed connectors for Azure Logic Apps](../connectors/built-in.md)
* [Built-in triggers and actions for Azure Logic Apps](../connectors/managed.md)
* [B2B enterprise integration solutions with Azure Logic Apps](logic-apps-enterprise-integration-overview.md)

<a name="logic-app-concepts"></a>

## Key terms

* **Workflow**: A series of steps that defines a task or process, starting with a single trigger and followed by one or multiple actions

* **Trigger**: The first step that starts every workflow and specifies the condition to meet before running any actions in the workflow. For example, a trigger event might be getting an email in your inbox or detecting a new file in a storage account.

* **Action**: Each subsequent step that follows after the trigger and runs some operation in a workflow

* **Managed connector**: A Microsoft-managed REST API that provides access to a specific app, data, service, or system. Before you can use them, most managed connectors require that you first create a connection from your workflow and authenticate your identity.

  For example, you can start a workflow with a trigger or include an action that works with Azure Blob Storage, Office 365, Salesforce, or SFTP servers. For more information, review [Managed connectors for Azure Logic Apps](../connectors/managed.md).

* **Built-in trigger or action**: A natively running Logic Apps operation that provides a way to control your workflow's schedule or structure, run your own code, manage or manipulate data, or complete other tasks in your workflow. Most built-in operations aren't associated with any service or system. Many also don't require that you first create a connection from your workflow and authenticate your identity. Built-in operations are also available for a few services, systems, and protocols, such as Azure Functions, Azure API Management, Azure App Service, and more.

  For example, you can start almost any workflow on a schedule when you use the Recurrence trigger. Or, you can have your workflow wait until called when you use the Request trigger. For more information, review [Built-in triggers and actions for Azure Logic Apps](../connectors/built-in.md).

* **Logic app**: The Azure resource to create for building a workflow. Based on your scenario's needs and solution's requirements, you can create logic apps that run in either the multi-tenant or single-tenant Logic Apps service environment or that run in an integration service environment. For more information, review [Host environments for logic apps](#host-environments).

<a name="how-do-logic-apps-work"></a>

## How logic apps work

In a logic app, each workflow always starts with a single [trigger](#logic-app-concepts). A trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. Following the trigger, one or more [actions](#logic-app-concepts) run operations that, for example, process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step.

For example, the following workflow starts with a Dynamics trigger that has a built-in condition named **When a record is updated**. The actions include transforming XML, calling a web app that updates data, evaluating a condition that controls which actions to take, and sending an email notification with the results. When the trigger detects an event that meets the condition, the trigger fires, and the actions in the workflow start to run. Each time the trigger fires, the Logic Apps service creates a workflow instance that runs the actions.

![Logic Apps Designer - example workflow](./media/logic-apps-overview/azure-logic-apps-designer.png)

You can visually create workflows using the Logic Apps designer in the Azure portal, Visual Studio Code, or Visual Studio. Each workflow also has an underlying definition that's described using JavaScript Object Notation (JSON). If you prefer, you can edit workflows by changing this JSON definition. For some creation and management tasks, Logic Apps provides Azure PowerShell and Azure CLI command support. For automated deployment, Logic Apps supports Azure Resource Manager templates.

<a name="host-environments"></a>

## Host environments

Based on your scenario and solution requirements, you can create logic apps that differ in the Logic Apps service environment where they run and how workflows use resources. The following table briefly summarizes these differences.

| Environment | [Pricing model](logic-apps-pricing.md) | Description |
|-------------|----------------------------------------|-------------|
| Azure Logic Apps (multi-tenant) | Consumption | A logic app can have only one workflow. <p><p>Workflows from different logic apps across *multiple tenants* share the same processing (compute), storage, network, and so on. |
| Azure Logic Apps ([single-tenant (Preview)](logic-apps-overview-preview.md)) | [Preview](logic-apps-overview-preview.md#pricing-model) | A logic app can have multiple workflows. <p><p>Workflows from the *same logic app in a single tenant* share the same processing (compute), storage, network, and so on. |
| [Integration service environment (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md) | Fixed | A logic app can have only one workflow. <p><p>Workflows from different logic apps in the *same environment* share the same processing (compute), storage, network, and so on. |
||||

Logic apps hosted in Logic Apps service environments also have different limits. For more information, review [Limits in Logic Apps](logic-apps-limits-and-config.md) and [Limits in Logic Apps (Preview)](logic-apps-overview-preview.md#limits).

## Why use Logic Apps

The Logic Apps integration platform provides prebuilt Microsoft-managed API connectors and built-in operations so you can connect and integrate apps, data, services, and systems more easily and quickly. You can focus more on designing and implementing your solution's business logic and functionality, not on figuring out how to access your resources.

You usually won't have to write any code. However, if you do need to write code, you can create code snippets using [Azure Functions](../azure-functions/functions-overview.md) and run that code from your workflow. You can also create code snippets that run in your workflow by using the [**Inline Code** action](logic-apps-add-run-inline-code.md). If your workflow needs to interact with events from Azure services, custom apps, or other solutions, you can monitor, route, and publish events using [Azure Event Grid](../event-grid/overview.md).

Logic Apps is fully managed by Microsoft Azure, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create ["serverless" apps and solutions](../logic-apps/logic-apps-serverless-overview.md), you can just focus on the business logic and functionality. These services automatically scale to meet your needs, make integrations faster, and help you build robust cloud apps using little to no code.

To learn how other companies improved their agility and increased focus on their core businesses when they combined Logic Apps with other Azure services and Microsoft products, check out these [customer stories](https://aka.ms/logic-apps-customer-stories).

The following sections provide more information about the capabilities and benefits in Logic Apps:

#### Visually create and edit workflows with easy-to-use tools

Save time and simplify complex processes by using the visual design tools in Logic Apps. Create your workflows from start to finish by using the Logic Apps Designer in the Azure portal, Visual Studio Code, or Visual Studio. Just start your workflow with a trigger, and add any number of actions from the [connectors gallery](/connectors/connector-reference/connector-reference-logicapps-connectors).

If you're creating a multi-tenant logic app, get started faster when you [create a workflow from the templates gallery](../logic-apps/logic-apps-create-logic-apps-from-templates.md). These templates are available for common workflow patterns, which range from simple connectivity for Software-as-a-Service (SaaS) apps to advanced B2B solutions plus "just for fun" templates.

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

Logic app workflows can access secured resources, such as virtual machines (VMs) and other systems or services, that are inside an [Azure virtual network](../virtual-network/virtual-networks-overview.md) when you create an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is a dedicated instance of the Logic Apps service that uses dedicated resources and runs separately from the global multi-tenant Logic Apps service.

Running logic apps in your own dedicated instance helps reduce the impact that other Azure tenants might have on app performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors). An ISE also provides these benefits:

* Your own static IP addresses, which are separate from the static IP addresses that are shared by the logic apps in the multi-tenant service. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, review [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md).

When you create an ISE, Azure *injects* or deploys that ISE into your Azure virtual network. You can then use this ISE as the location for the logic apps and integration accounts that need access. For more information about creating an ISE, review [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

#### Pricing options

Each logic app type, which differs by capabilities and where they run (multi-tenant, single-tenant, integration service environment), has a different [pricing model](../logic-apps/logic-apps-pricing.md). For example, multi-tenant logic apps use consumption-based pricing, while logic apps in an integration service environment use fixed pricing. Learn more about [pricing and metering](../logic-apps/logic-apps-pricing.md) for Logic Apps.

## How does Logic Apps differ from Functions, WebJobs, and Power Automate?

All these services help you connect and bring together disparate systems. Each service has their advantages and benefits, so combining their capabilities is the best way to quickly build a scalable, full-featured integration system. For more information, review [Choose between Logic Apps, Functions, WebJobs, and Power Automate](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## Get started

Before you can start with Azure Logic Apps, you need an Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). Otherwise, try this [quickstart to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md), which monitors new content on a website through an RSS feed and sends email when new content appears.

## Other resources

Learn more about the Logic Apps platform with these introductory videos:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Go-serverless-Enterprise-integration-with-Azure-Logic-Apps/player]
>
> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Connect-and-extend-your-mainframe-to-the-cloud-with-Logic-Apps/player]

## Next steps

* [Quickstart: Create your first logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* Learn about [serverless solutions with Azure](../logic-apps/logic-apps-serverless-overview.md)
* Learn about [B2B integration with the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
