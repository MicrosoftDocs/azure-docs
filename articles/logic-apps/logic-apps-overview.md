---
title: Overview for Azure Logic Apps
description: Logic Apps is a cloud platform for building automated workflows that integrate apps, data, services, and systems for enterprise scenarios using minimal code.
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: overview
ms.custom: mvc
ms.date: 04/26/2021
---

# What is Azure Logic Apps

[Logic Apps](https://azure.microsoft.com/services/logic-apps) is a cloud-based platform that helps you quickly and easily integrate apps, data, systems, and services by building and running automated [workflows](#logic-app-concepts). Part of [Azure Integration Services](https://azure.microsoft.com/product-categories/integration/), Logic Apps provides a simpler way to create, host, and manage highly scalable integration solutions for enterprise and business-to-business (B2B) scenarios across cloud, on premises, and hybrid environments.

This list describes just a few example tasks, business processes, and workloads that you can automate with the Logic Apps service:

* Route and process customer orders across on-premises systems and cloud services.
* Schedule and send email notifications using Office 365 when a specific event happens.
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

For B2B integration scenarios, Logic Apps includes capabilities from [BizTalk Server](/biztalk/core/introducing-biztalk-server). You can create an [integration account](logic-apps-enterprise-integration-create-integration-account.md) where you define trading partners, agreements, schemas, maps, and other B2B artifacts. When you link this account to a logic app, you can build workflows that work with these artifacts and exchange messages using protocols such as AS2, EDIFACT, and X12.

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

* **Managed connector**: A Microsoft-managed connector that provides access to a specific app, data, service, or system. Before you can use them, most managed connectors require that you first create a connection from your workflow and authenticate your identity.

  For example, you can start a workflow with a trigger or include an action that works with Azure Blob Storage, Office 365, Salesforce, or SFTP servers. For more information, review [Managed connectors for Azure Logic Apps](../connectors/managed.md).

* **Built-in trigger or action**: A natively running Logic Apps operation that provides a way to control your workflow's schedule or structure, run your own code, manage or manipulate data, or complete other tasks in your workflow. Most built-in operations aren't associated with any service or system. Many also don't require that you first create a connection from your workflow and authenticate your identity. Built-in operations are also available for a few services, systems, and protocols, such as Azure Functions, Azure API Management, Azure App Services, and more.

  For example, you can start almost any workflow on a schedule when you use the Recurrence trigger. Or, you can have your workflow wait until called when you use the Request trigger. For more information, review [Built-in triggers and actions for Azure Logic Apps](../connectors/built-in.md).

<a name="how-do-logic-apps-work"></a>

## How logic apps work

In a logic app, each workflow always starts with a single [trigger](#logic-app-concepts). A trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. Following the trigger, one or more [actions](#logic-app-concepts) run operations that, for example, process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step.

For example, the following workflow starts with a Dynamics trigger that has a built-in condition named **When a record is updated**. The actions include transforming XML, calling a web app that updates data, evaluating a condition that controls which actions to take, and sending an email notification with the results. When the trigger detects an event that meets the condition, the trigger fires, and the actions in the workflow start to run. Each time the trigger fires, the Logic Apps service creates a workflow instance that runs the actions.

![Logic Apps Designer - example workflow](./media/logic-apps-overview/azure-logic-apps-designer.png)

You can visually create workflows using the Logic Apps designer in the Azure portal, Visual Studio, or Visual Studio Code. Each workflow also has an underlying definition that's described using JavaScript Object Notation (JSON). If you prefer, you can build and customize workflows by using the code view editor in the Azure portal, Visual Studio, or Visual Studio Code. For some creation and management tasks, Logic Apps provides Azure PowerShell and Azure CLI command support. For automated deployment, Logic Apps supports Azure Resource Manager templates.

## Why use logic apps

With businesses moving toward digitization, the Logic Apps platform helps you connect legacy, modern, and cutting-edge systems more easily and quickly by providing prebuilt APIs as Microsoft-managed connectors. That way, you can focus on your apps' business logic and functionality. You don't have to worry about building, hosting, scaling, managing, maintaining, and monitoring your apps. Logic Apps handles these concerns for you. Plus, you pay only for what you use based on a consumption [pricing model](../logic-apps/logic-apps-pricing.md).

Usually, you won't have to write any code. But if you must write some code, you can create code snippets with [Azure Functions](../azure-functions/functions-overview.md) and run that code on-demand from workflows. Also, if your workflows need to interact with events from Azure services, custom apps, or other solutions, you can use [Azure Event Grid](../event-grid/overview.md) with your workflows for event monitoring, routing, and publishing.

Logic Apps, Functions, and Event Grid are fully managed by Microsoft Azure, which frees you from worries about building, hosting, scaling, managing, monitoring, and maintaining your solutions. With the capability to create ["serverless" apps and solutions](../logic-apps/logic-apps-serverless-overview.md), you can just focus on the business logic. These services automatically scale to meet your needs, make integrations faster, and help you build robust cloud apps with minimal code.

To learn how companies improved their agility and increased focus on their core businesses when they combined Logic Apps with other Azure services and Microsoft products, check out these [customer stories](https://aka.ms/logic-apps-customer-stories).

Here are more details about the capabilities and benefits that you get with Logic Apps:

### Visually build workflows with easy-to-use tools

Save time and simplify complex processes with visual design tools. Build workflows from start-to-finish by using the Logic Apps Designer through your browser in the Azure portal or in Visual Studio. Start your workflow with a trigger, and add any number of actions from the [connectors gallery](../connectors/apis-list.md).

### Get started faster with Logic Apps templates

Create commonly used solutions more quickly when you choose predefined workflows from the [template gallery](../logic-apps/logic-apps-create-logic-apps-from-templates.md). Templates range from simple connectivity for software-as-a-service (SaaS) apps to advanced B2B solutions plus "just for fun" templates. Learn how to [create logic apps from prebuilt templates](../logic-apps/logic-apps-create-logic-apps-from-templates.md).

### Connect disparate systems across different environments

Some patterns and processes are easy to describe but hard to implement in code. Logic Apps workflows help you seamlessly connect disparate systems across on-premises and cloud environments. For example, you can connect a cloud marketing solution to an on-premises billing system, or centralize messaging across APIs and systems with an Enterprise Service Bus. The Logic Apps platform provides a fast, reliable, and consistent way to deliver reusable and reconfigurable solutions for these scenarios.

### First-class support for enterprise integration and B2B scenarios

Businesses and organizations electronically communicate with each other by using industry-standard but different message protocols and formats, such as EDIFACT, AS2, and X12. With the features in the [Enterprise Integration Pack (EIP)](../logic-apps/logic-apps-enterprise-integration-overview.md), you can build workflows that transform message formats used by your partners into formats that your organization's systems can interpret and process. Logic Apps handles these exchanges smoothly and also securely with encryption and digital signatures.

Start small with your current systems and services, and grow incrementally at your own pace. When you're ready, Logic Apps and the EIP help you implement and scale up to more mature integration scenarios by providing these capabilities and more:

* Build off these products and services:

  * [Microsoft BizTalk Server](/biztalk/core/introducing-biztalk-server)
  * [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md)
  * [Azure Functions](../azure-functions/functions-overview.md)
  * [Azure API Management](../api-management/api-management-key-concepts.md)

* Process [XML messages](../logic-apps/logic-apps-enterprise-integration-xml.md)

* Process [flat files](../logic-apps/logic-apps-enterprise-integration-flatfile.md)

* Exchange messages with [EDIFACT](../logic-apps/logic-apps-enterprise-integration-edifact.md), [AS2](../logic-apps/logic-apps-enterprise-integration-as2.md), and [X12](../logic-apps/logic-apps-enterprise-integration-x12.md) protocols

* Store and manage these B2B artifacts and more in one place with [integration accounts](./logic-apps-enterprise-integration-create-integration-account.md):

  * [Partners](../logic-apps/logic-apps-enterprise-integration-partners.md)
  * [Agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md) 
  * [XML transform maps](../logic-apps/logic-apps-enterprise-integration-maps.md)
  * [XML validation schemas](../logic-apps/logic-apps-enterprise-integration-schemas.md)

For example, if you're using Microsoft BizTalk Server, logic apps can communicate with your BizTalk Server by using the [BizTalk Server connector](../connectors/managed.md#on-premises-connectors). You can then extend or run BizTalk-like operations in your workflows by including [integration account connectors](../connectors/managed.md#integration-account-connectors), which are available with the Enterprise Integration Pack.

Going in the other direction, BizTalk Server can connect to and communicate with logic apps by using the [Microsoft BizTalk Server Adapter for Logic Apps](https://www.microsoft.com/download/details.aspx?id=54287). Learn how to [set up and use the BizTalk Server Adapter](/biztalk/core/logic-app-adapter) in your BizTalk Server.

### Write once, reuse often

Create your logic apps as Azure Resource Manager templates so that you can [automate logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md) across multiple environments and regions.

### Access resources inside Azure virtual networks

Logic apps can access secured resources, such as virtual machines (VMs) and other systems or services, that are inside an [Azure virtual network](../virtual-network/virtual-networks-overview.md) when you create an [*integration service environment* (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is a dedicated instance of the Logic Apps service that uses dedicated resources and runs separately from the "global" multi-tenant Logic Apps service.

Running logic apps in your own separate dedicated instance helps reduce the impact that other Azure tenants might have on your apps' performance, also known as the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors). An ISE also provides these benefits:

* Your own static IP addresses, which are separate from the static IP addresses that are shared by the logic apps in the multi-tenant service. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

* Increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, see [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md).

When you create an ISE, Azure *injects* or deploys that ISE into your Azure virtual network. You can then use this ISE as the location for the logic apps and integration accounts that need access. For more information about creating an ISE, see [Connect to Azure virtual networks from Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

### Built-in extensibility

If you don't find the connector that you want to run custom code, you can extend logic apps by creating and calling your own code snippets on-demand through [Azure Functions](../azure-functions/functions-overview.md). Create your own [APIs](../logic-apps/logic-apps-create-api-app.md) and [custom connectors](../logic-apps/custom-connector-overview.md) that you can call from logic apps.

### Pay only for what you use
  
Logic Apps uses consumption-based [pricing and metering](../logic-apps/logic-apps-pricing.md) unless you have logic apps previously created with App Service plans.

Learn more about Logic Apps with these introductory videos:

* [Integration with Logic Apps - Go from zero to hero](https://channel9.msdn.com/Events/Build/2017/C9R17)
* [Enterprise integration with Microsoft Azure Logic Apps](https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/BRK2188)
* [Building advanced business processes with Logic Apps](https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/BRK3179)

## How does Logic Apps differ from Functions, WebJobs, and Power Automate?

All these services help you "glue" and connect disparate systems together. Each service has their advantages and benefits, so combining their capabilities is the best way to quickly build a scalable, full-featured integration system. For more information, see [Choose between Logic Apps, Functions, WebJobs, and Power Automate](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## Get started

Logic Apps is one of the many services hosted on Microsoft Azure. So before you start, you need an Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

If you have an Azure subscription, try this [quickstart to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md), which monitors new content on a website through an RSS feed and sends email when new content appears.

## Next steps

* [Check traffic with a schedule-based logic app](../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
* Learn more about [serverless solutions with Azure](../logic-apps/logic-apps-serverless-overview.md)
* Learn more about [B2B integration with the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
