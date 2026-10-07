---
title: What is Azure Logic Apps?
description: Learn how Azure Logic Apps automates enterprise business process workflows, integrates cloud and on-premises systems, and compares with other automation services.
services: azure-logic-apps
ms.suite: integration
author: ecfan
ms.reviewer: azla
ms.topic: overview
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.date: 09/11/2026
#Customer intent: As a developer who builds enterprise business process automation and integration solutions, I want learn about Azure Logic Apps capabilities so I can choose the right service platform for my workloads.
---

# What is Azure Logic Apps?

Azure Logic Apps is a cloud service and platform for automating enterprise business process workflows and integrating services, systems, apps, and data across cloud, on-premises, and hybrid environments with little or no code.

This platform supports the following primary scenarios:

- Orchestrate business process workflows across multiple systems.
- Connect legacy, modern, and cutting-edge platforms by using [1,400+ prebuilt connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).
- Build integration workflows visually with access to options for custom code.
- Create deterministically or dynamically run workflows that use AI agents and large language models.

To decide whether this service fits your workload, [compare automation services](#choose-the-appropriate-automation-service). To get started with building a workflow, [choose a getting-started guide](#get-started). To select a hosting model, [compare Consumption and Standard workflows](single-tenant-overview-compare.md).

For example, the following sample workflow shows how Azure Logic Apps can route an incoming order for manual review when the cost exceeds a specified threshold:

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer with an example order review workflow that uses condition and switch actions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

The workflow uses conditions and switches to determine the next action. For more information about the logic behind this workflow, see [How logic apps work](#how-logic-apps-work).

Other common example automation scenarios include:

- Send an Office 365 notification when a file is uploaded.
- Process customer orders across cloud and on-premises systems.
- Move files from an SFTP or FTP server to Azure Blob Storage.
- Analyze social media sentiment and create alerts for review.

This overview helps you explore the following concepts:

- [Benefits from using Azure Logic Apps](#why-use-azure-logic-apps)
- [Core concepts](#key-terms)
- [Capabilities and hosting options](#azure-logic-apps-capabilities)
- [How logic app workflows run](#how-logic-apps-work)
- [Automation service comparison](#choose-the-appropriate-automation-service)
- [Get started guides](#get-started)

## Why use Azure Logic Apps?

Azure Logic Apps helps you:

- **Integrate systems faster:** Choose from [1,400+ prebuilt Microsoft-managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for Azure services, Microsoft services, external apps, databases, and on-premises systems.

  Reduce or eliminate the work to access your resources. Focus on designing and developing your solutions' business logic and functionality to meet your business needs.

- **Build visually:** Create orchestration logic with a workflow designer rather than write all the integration code yourself.

- **Optimize performance:** Use [built-in connectors](../connectors/built-in.md) that run natively and directly on the Azure Logic Apps runtime.

  These connector operations communicate with service endpoints, run your own code, control your workflow structure, manipulate data, or connect to commonly used resources with increased speed, capacity, and throughput.

- **Access managed services:** Use [managed connectors](../connectors/managed.md) for prebuilt access to service and system APIs.

  These connector operations run in global, multitenant Azure. For example:

  - Office 365 services such as Outlook, Excel, and SharePoint
  - Enterprise systems such as SAP and IBM MQ

- **Extend workflows with code:** Run inline code, call Azure Functions, or create custom connectors when prebuilt operations don't meet your requirements.

- **Use managed scaling:** Let Azure host, monitor, and scale your workflows while you focus on business logic.

When you build workflows with Azure Logic Apps, you usually don't have to write any code. However, if you need to create and run your own code, Azure Logic Apps supports this capability. For example, in workflows that run in multitenant Azure Logic Apps, you can write and run JavaScript code snippets directly within your workflow. For more complex and structured code, you can create and call functions from your workflows when you use the Azure Functions platform. For workflows that run in single-tenant Azure Logic Apps, App Service Environment (ASE) v3, or partially connected environments, you can write and run JavaScript code snippets, .NET code, C# scripts, and PowerShell scripts directly within your workflow.

If your workflow needs to interact with events from other Azure services, custom apps, or other solutions, you can monitor, route, and publish events by using [Azure Event Grid](../event-grid/overview.md) or [Azure Event Hubs](../event-hubs/event-hubs-about.md).

For more information, see:

- [Add and run JavaScript code inline with workflows](add-run-javascript.md)
- [Azure Functions overview](../azure-functions/functions-overview.md) and [Call Azure Functions from workflows](call-azure-functions-from-workflows.md)
- [Create and run .NET code from Standard workflows](create-run-custom-code-functions.md)
- [Add and run C# scripts](add-run-csharp-scripts.md)
- [Add and run PowerShell scripts](add-run-powershell-scripts.md)

Microsoft Azure fully manages Azure Logic Apps, which frees you from worrying about hosting, scaling, managing, monitoring, and maintaining solutions built with these services. When you use these capabilities to create ["serverless" apps and solutions](logic-apps-serverless-overview.md), you can focus more on building the business logic and functionality. Serverless platforms automatically scale to meet your needs, make integrations work faster, and help you build robust cloud apps using little to no code.

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
| **Built-in connector** | This connector or operation type runs natively on the Azure Logic Apps runtime for faster performance, compared to Microsoft-managed connectors that are hosted and run in Azure. <br><br>Built-in connectors support workflow control, running your own code, data processing, endpoint communication, and other workflow tasks. For more information, see [Built-in connectors](../connectors/built-in.md). |
| **Managed connector** | This connector or operation type is a Microsoft-managed proxy for a service or system API. Most managed connectors require an authenticated connection. For more information, see [Managed connectors](../connectors/managed.md). |
| **Integration account** | This Azure resource lets you define and store B2B artifacts to use in your workflows. After you [create and link an integration account](logic-apps-enterprise-integration-create-integration-account.md) to your logic app, your workflows can use these B2B artifacts. Your workflows can also exchange messages that follow Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards. <br><br>For example, you can define trading partners, agreements, schemas, maps, and other B2B artifacts. You can create workflows that use these artifacts and exchange messages over protocols such as AS2, EDIFACT, X12, and RosettaNet. |

## Azure Logic Apps capabilities

You can start small with a workflow that connects your current systems and services, and then add capabilities as your integration requirements grow:

- [Build workflows visually](#visually-create-and-edit-workflows-with-easy-to-use-tools).
- [Connect cloud, on-premises, and hybrid systems](#connect-different-systems-across-various-environments).
- [Choose a hosting environment](#create-and-deploy-to-different-environments).
- [Build AI agentic workflows](#ai-agentic-capabilities).
- [Exchange enterprise and B2B messages](#enterprise-integration-and-b2b-scenarios).
- [Run custom code](#run-custom-code-when-no-connector-exists).
- [Access resources in Azure virtual networks](#direct-access-to-resources-in-azure-virtual-networks).

### Visually create and edit workflows with easy-to-use tools

Each workflow always starts with a trigger followed by any number of actions from the [connectors gallery](/connectors/connector-reference/connector-reference-logicapps-connectors).

To save time and simplify complex processes, create your workflows by using the graphical workflow designer in the Azure portal or Visual Studio Code. Each workflow also has an underlying definition that's defined in JavaScript Object Notation (JSON) format. If you prefer, you can edit workflows by changing this JSON definition. For some creation and management tasks, you can also use Azure PowerShell and Azure CLI commands. For automated deployment, Azure Logic Apps supports Azure Resource Manager templates.

### Connect different systems across various environments

Some patterns and processes are easy to describe but hard to implement in code. Azure Logic Apps helps you seamlessly connect disparate systems across cloud, on-premises, and hybrid environments. For example, you can connect a cloud marketing solution to an on-premises billing system, or centralize messaging across APIs and systems using Azure Service Bus. Azure Logic Apps provides a fast, reliable, and consistent way to deliver reusable and reconfigurable solutions for these scenarios.

<a name="resource-environment-differences"></a>

### Create and deploy to different environments

Based on your scenario, solution requirements, and desired capabilities, choose whether to create a Consumption or Standard logic app workflow. Based on this choice, the workflow can run in multitenant Azure Logic Apps, single-tenant Azure Logic Apps, an App Service Environment (v3), or a hybrid environment, which can be partially connected or your own infrastructure. With single-tenant Azure Logic Apps, your workflows can more easily access resources protected by Azure virtual networks. If you create single tenant-based workflows using the hybrid deployment hosting option, you can also run workflows on premises using infrastructure that you control. For more information, see [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md).

The following table briefly summarizes differences between a Consumption and Standard logic app workflow. You also learn the differences between the multitenant environment, single-tenant environment, App Service Environment v3 (ASEv3), and hybrid environment for deploying, hosting, and running your logic app workflows.

[!INCLUDE [Logic app resource type and environment differences](includes/logic-apps-resource-environment-differences-table.md)]

### AI agentic capabilities

Azure Logic Apps supports AI-powered automation through deterministic and probabilistic agentic workflows. These workflows combine large language models (LLMs), agent loops, agents, MCP servers, and tools built from connector actions to interpret natural-language instructions, make decisions, access data, and complete multistep tasks across Microsoft and non-Microsoft systems. You can also expose workflows and connector actions as reusable tools for agents in Microsoft Foundry, while Azure Logic Apps handles orchestration concerns such as long-running processes, retries, error handling, and integration with external systems.

For more information, see:

- [Agentic workflows in Azure Logic Apps](agent-workflows-concepts.md)
- [What is Azure Logic Apps Automation?](automation/dynamic-workflow-automation-introduction.md)
- [Compare automation platforms](automation/compare-automation-services.md)

### Enterprise integration and B2B scenarios

Businesses and organizations electronically communicate with each other by using different industry-standard message protocols and formats, such as EDIFACT, AS2, X12, and RosettaNet. You can automate workflows that exchange and transform B2B messages following these protocols, which Azure Logic Apps handles smoothly and securely by using encryption and digital signatures.

To define business-to-business (B2B) artifacts that you use in workflows, such as partners, agreements, schemas, maps, and others, create an [*integration account*](#logic-app-concepts) for these artifacts. After you link this account to your logic app resource, your workflow can use these artifacts and exchange messages that comply with Electronic Data Interchange (EDI) and Enterprise Application Integration (EAI) standards.

Learn more by choosing a task that matches your scenario:

- [Plan an enterprise integration solution](logic-apps-enterprise-integration-overview.md)

- [Create an integration account](logic-apps-enterprise-integration-create-integration-account.md) to define and store B2B artifacts, for example:

  - [Trading partners](logic-apps-enterprise-integration-partners.md)
  - [Agreements](logic-apps-enterprise-integration-agreements.md)
  - [Maps](logic-apps-enterprise-integration-maps.md)
  - [Schemas](logic-apps-enterprise-integration-schemas.md)

- [Choose an EDI protocol](logic-apps-enterprise-integration-overview.md) to exchange messages, for example:

  - [AS2](logic-apps-enterprise-integration-as2.md)
  - [EDIFACT](logic-apps-enterprise-integration-edifact.md)
  - [X12](logic-apps-enterprise-integration-x12.md)
  - [RosettaNet](logic-apps-enterprise-integration-rosettanet.md)

- Process [XML messages](logic-apps-enterprise-integration-xml.md) and [flat files](logic-apps-enterprise-integration-flatfile.md).

- [Integrate with BizTalk Server](/biztalk/core/logic-app-adapter)

  Your workflows can communicate with BizTalk Server by using the [BizTalk Server connector](../connectors/managed.md#on-premises-connectors). You can then run or extend BizTalk-like operations in your workflows by using [integration account connectors](../connectors/managed.md#integration-account-connectors). In the other direction, BizTalk Server can communicate with your workflows by using the [Microsoft BizTalk Server Adapter for Azure Logic Apps](https://www.microsoft.com/download/details.aspx?id=54287). Learn how to [set up and use the BizTalk Server Adapter](/biztalk/core/logic-app-adapter) in your BizTalk Server.

### Reuse workflows across environments with Azure Resource Manager templates

Create your logic app workflows as Azure Resource Manager templates so that you can [set up and automate deployments](logic-apps-azure-resource-manager-templates-overview.md) across multiple environments and regions.

### Run custom code when no connector exists

If no suitable connector is available to run the code you want, you have other options for your workflows:

- For Consumption and Standard workflows, you can use the following capabilities:

  - Include the **Inline Code** action that runs [JavaScript](add-run-javascript.md).
  - Create and run code with [Azure Functions](call-azure-functions-from-workflows.md).
  - Create and use custom connector operations. For Consumption workflows, see [Custom connectors for Consumption](custom-connector-overview.md#consumption-logic-apps). For Standard workflows, see [Create custom built-in connectors](create-custom-built-in-connector-standard.md).
  - Create and call [custom APIs](logic-apps-create-api-app.md).

- For Standard workflows, you can use the following extra capabilities:

  - Include **Inline Code** actions that run [C# scripts](add-run-csharp-scripts.md) or [PowerShell scripts](add-run-powershell-scripts.md).
  - Create [custom functions to run .NET code](create-run-custom-code-functions.md).

### Direct access to resources in Azure virtual networks

When you use [Azure Logic Apps (Standard)](single-tenant-overview-compare.md), your workflows can access secured resources such as virtual machines, other services, and systems in an [Azure virtual network](../virtual-network/virtual-networks-overview.md). Azure Logic Apps (Standard) is a single-tenant instance of Azure Logic Apps that uses dedicated resources and runs separately from global, multitenant Azure Logic Apps.

By hosting and running logic app workflows in your own dedicated instance, you reduce the impact that other Azure tenants might have on app performance or the ["noisy neighbors" effect](https://en.wikipedia.org/wiki/Cloud_computing_issues#Performance_interference_and_noisy_neighbors).

Azure Logic Apps (Standard) provides the following benefits:

- You get your own static IP addresses, which are separate from the static IP addresses that logic apps share in multitenant Azure Logic Apps. You can also set up a single public, static, and predictable outbound IP address to communicate with destination systems. By using this IP address, you don't have to set up extra firewall openings at those destination systems.

- You get increased limits on run duration, storage retention, throughput, HTTP request and response timeouts, message sizes, and custom connector requests. For more information, see [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md).

<a name="how-logic-apps-work"></a>

## How logic apps work

A logic app workflow always starts with a single [trigger](#logic-app-concepts). The trigger fires when a condition is met, for example, when a specific event happens or when data meets specific criteria. Many triggers include [scheduling capabilities](concepts-schedule-automated-recurring-tasks-workflows.md) that control how often your workflow runs. After the trigger fires, one or more [actions](#logic-app-concepts) run operations that process, handle, or convert data that travels through the workflow, or that advance the workflow to the next step.

In the earlier example order workflow, the following steps occur:

1. The trigger receives an order.
1. A condition compares the order cost with the review threshold.
1. Orders below the threshold continue processing.
1. Orders above the threshold require sending email for manual review.
1. A switch handles the reviewer's response:

   - **Approve:** Continue processing the order.
   - **Escalate:** Get more information and reevaluate the order.
   - **Requirements not met:** Send an email about the problem.

:::image type="content" source="./media/logic-apps-overview/example-enterprise-workflow.png" alt-text="Screenshot that shows the workflow designer with a sample enterprise workflow that uses condition and switch actions." lightbox="./media/logic-apps-overview/example-enterprise-workflow.png":::

### Guaranteed message delivery

Azure Logic Apps delivers a message "at least once". No messages are lost, and rarely does the service deliver a message more than once. However, if your business doesn't handle or can't handle duplicate messages, you need to implement *idempotence*. This approach accepts identical or duplicate messages, while preserving data integrity and system stability. After the first execution, duplicate operations don't change the result.

## Pricing models for Consumption and Standard logic apps

Each logic app hosting option (multitenant, single-tenant, App Service Environment (ASE) v3, or partially connected environment) has a different [pricing model](logic-apps-pricing.md). For example, multitenant Consumption logic app workflows follow the Consumption pricing model, while single-tenant Standard logic app workflows follow the Standard pricing model. For specific pricing details, see [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/).

## Choose the appropriate automation service

To decide whether Azure Logic Apps matches your workload, use the following comparisons:

| Choose | Scenarios |
|--------|-----------|
| Azure Logic Apps | Designer-first automated orchestration workflows for enterprise business processes across services, systems, applications, and data sources. Can call functions in Azure Functions. |
| Azure Functions | Code-first automated orchestrations using the Durable Functions extension. Can call workflows in Azure Logic Apps. |
| Microsoft Power Automate | Codeless automation workloads for business users, office workers, and citizen developers. |
| Azure Automation Runbooks | Infrastructure management and straightforward remediation tasks, such as restarting virtual machines. |

For detailed decision information, see:

- [Choose the right integration and automation services in Azure](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md)
- [Compare Azure automation platforms](automation/compare-automation-services.md)
- [Azure Automation Runbooks](/azure/automation/automation-runbook-types)

## Get started

- Before you try out Azure Logic Apps, you need an Azure account and subscription. If you don't have a subscription, [get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- When you're ready, choose a get-started guide based on your scenario:

| You want to create | Start here |
|---|---|
| Consumption-based, multitenant workflow | [Create Consumption logic app workflows](quickstart-create-example-consumption-workflow.md) |
| Isolated, single-tenant, ASE v3, or hybrid workflow | [Create Standard logic app workflows](create-single-tenant-workflows-azure-portal.md) |
| Autonomous agentic workflow | [Create autonomous agentic workflows](create-autonomous-agent-workflows.md) |
| Conversational agentic workflow | [Create conversational agentic workflows](create-conversational-agent-workflows.md) |
| Dynamically run agentic workflow | [Create dynamically-run agentic workflows](https://auto.azure.com/docs/getting-started/introduction) |

## Next steps

- [Compare Azure automation platforms](automation/compare-automation-services.md)
