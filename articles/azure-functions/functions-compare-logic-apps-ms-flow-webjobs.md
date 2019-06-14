---
title: What are Microsoft Flow, Logic Apps, Functions, and WebJobs? - Azure
description: "Compare Microsoft cloud services that are optimized for integration tasks: Microsoft Flow, Logic Apps, Functions, and WebJobs."
services: functions, logic-apps
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: microsoft flow, flow, logic apps, azure functions, functions, azure webjobs, webjobs, event processing, dynamic compute, serverless architecture
ms.service: azure-functions
ms.devlang: multiple
ms.topic: overview
ms.date: 04/09/2018
ms.author: glenga
ms.custom: mvc
#Customer intent: As a developer, I want to understand the choices that Azure offers for hosting and executing my business logic so that I can choose the right set of Azure services.
---

# What are Microsoft Flow, Logic Apps, Functions, and WebJobs?

This article compares the following Microsoft cloud services:

* [Microsoft Flow](https://flow.microsoft.com/)
* [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Azure App Service WebJobs](../app-service/webjobs-create.md)

All of these services can solve integration problems and automate business processes. They can all define input, actions, conditions, and output. You can run each of them on a schedule or trigger. Each service has unique advantages, and this article explains the differences.

## Compare Microsoft Flow and Azure Logic Apps

Microsoft Flow and Logic Apps are both *designer-first* integration services that can create workflows. Both services integrate with various SaaS and enterprise applications. 

Microsoft Flow is built on top of Logic Apps. They share the same workflow designer and the same [connectors](../connectors/apis-list.md). 

Microsoft Flow empowers any office worker to perform simple integrations (for example, an approval process on a SharePoint Document Library) without going through developers or IT. Logic Apps can also enable advanced integrations (for example, B2B processes) where enterprise-level Azure DevOps and security practices are required. It's typical for a business workflow to grow in complexity over time. Accordingly, you can start with a flow at first, and then convert it to a logic app as needed.

The following table helps you determine whether Microsoft Flow or Logic Apps is best for a particular integration:

|  | Microsoft Flow | Logic Apps |
| --- | --- | --- |
| Users |Office workers, business users, SharePoint administrators |Pro integrators and developers, IT pros |
| Scenarios |Self-service |Advanced integrations |
| Design tool |In-browser and mobile app, UI only |In-browser and [Visual Studio](../logic-apps/logic-apps-deploy-from-vs.md), [Code view](../logic-apps/logic-apps-author-definitions.md) available |
| Application lifecycle management (ALM) |Design and test in non-production environments, promote to production when ready |Azure DevOps: source control, testing, support, automation, and manageability in [Azure Resource Manager](../logic-apps/logic-apps-create-deploy-azure-resource-manager-templates.md) |
| Admin experience |Manage Microsoft Flow environments and data loss prevention (DLP) policies, track licensing: [Microsoft Flow Admin Center](https://admin.flow.microsoft.com) |Manage resource groups, connections, access management, and logging: [Azure portal](https://portal.azure.com) |
| Security |Office 365 Security and Compliance audit logs, DLP, [encryption at rest](https://wikipedia.org/wiki/Data_at_rest#Encryption) for sensitive data |Security assurance of Azure: [Azure security](https://www.microsoft.com/en-us/trustcenter/Security/AzureSecurity), [Azure Security Center](https://azure.microsoft.com/services/security-center/), [audit logs](https://azure.microsoft.com/blog/azure-audit-logs-ux-refresh/) |

## Compare Azure Functions and Azure Logic Apps

Functions and Logic Apps are Azure services that enable serverless workloads. Azure Functions is a serverless compute service, whereas Azure Logic Apps provides serverless workflows. Both can create complex *orchestrations*. An orchestration is a collection of functions or steps, called *actions* in Logic Apps, that are executed to accomplish a complex task. For example, to process a batch of orders, you might execute many instances of a function in parallel, wait for all instances to finish, and then execute a function that computes a result on the aggregate.

For Azure Functions, you develop orchestrations by writing code and using the [Durable Functions extension](durable/durable-functions-concepts.md). For Logic Apps, you create orchestrations by using a GUI or editing configuration files.

You can mix and match services when you build an orchestration, calling functions from logic apps and calling logic apps from functions. Choose how to build each orchestration based on the services' capabilities or your personal preference. The following table lists some of the key differences between these services:
 
|  | Durable Functions | Logic Apps |
| --- | --- | --- |
| Development | Code-first (imperative) | Designer-first (declarative) |
| Connectivity | [About a dozen built-in binding types](functions-triggers-bindings.md#supported-bindings), write code for custom bindings | [Large collection of connectors](../connectors/apis-list.md), [Enterprise Integration Pack for B2B scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), [build custom connectors](../logic-apps/custom-connector-overview.md) |
| Actions | Each activity is an Azure function; write code for activity functions |[Large collection of ready-made actions](../logic-apps/logic-apps-workflow-actions-triggers.md)|
| Monitoring | [Azure Application Insights](../azure-monitor/app/app-insights-overview.md) | [Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md), [Azure Monitor logs](../logic-apps/logic-apps-monitor-your-logic-apps.md)|
| Management | [REST API](durable/durable-functions-http-api.md), [Visual Studio](https://docs.microsoft.com/azure/vs-azure-tools-resources-managing-with-cloud-explorer) | [Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md), [REST API](https://docs.microsoft.com/rest/api/logic/), [PowerShell](https://docs.microsoft.com/powershell/module/az.logicapp), [Visual Studio](https://docs.microsoft.com/azure/logic-apps/manage-logic-apps-with-visual-studio) |
| Execution context | Can run [locally](functions-runtime-overview.md) or in the cloud | Runs only in the cloud|

<a name="function"></a>

## Compare Functions and WebJobs

Like Azure Functions, Azure App Service WebJobs with the WebJobs SDK is a *code-first* integration service that is designed for developers. Both are built on [Azure App Service](../app-service/overview.md) and support features such as [source control integration](../app-service/deploy-continuous-deployment.md), [authentication](../app-service/overview-authentication-authorization.md), and [monitoring with Application Insights integration](functions-monitoring.md).

### WebJobs and the WebJobs SDK

You can use the *WebJobs* feature of App Service to run a script or code in the context of an App Service web app. The *WebJobs SDK* is a framework designed for WebJobs that simplifies the code you write to respond to events in Azure services. For example, you might respond to the creation of an image blob in Azure Storage by creating a thumbnail image. The WebJobs SDK runs as a .NET console application, which you can deploy to a WebJob. 

WebJobs and the WebJobs SDK work best together, but you can use WebJobs without the WebJobs SDK and vice versa. A WebJob can run any program or script that runs in the App Service sandbox. A WebJobs SDK console application can run anywhere console applications run, such as on-premises servers.

### Comparison table

Azure Functions is built on the WebJobs SDK, so it shares many of the same event triggers and connections to other Azure services. Here are some factors to consider when you're choosing between Azure Functions and WebJobs with the WebJobs SDK:

|  | Functions | WebJobs with WebJobs SDK |
| --- | --- | --- |
|[Serverless app model](https://azure.microsoft.com/solutions/serverless/) with [automatic scaling](functions-scale.md#how-the-consumption-and-premium-plans-work)|✔||
|[Develop and test in browser](functions-create-first-azure-function.md) |✔||
|[Pay-per-use pricing](functions-scale.md#consumption-plan)|✔||
|[Integration with Logic Apps](functions-twitter-email.md)|✔||
| Trigger events |[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[HTTP/WebHook (GitHub, Slack)](functions-bindings-http-webhook.md)<br>[Azure Event Grid](functions-bindings-event-grid.md)|[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[File system](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Files/FileTriggerAttribute.cs)|
| Supported languages  |C#<br>F#<br>JavaScript<br>Java (preview) |C#<sup>1</sup>|
|Package managers|NPM and NuGet|NuGet<sup>2</sup>|

<sup>1</sup> WebJobs (without the WebJobs SDK) supports C#, JavaScript, Bash, .cmd, .bat, PowerShell, PHP, TypeScript, Python, and more. This is not a comprehensive list. A WebJob can run any program or script that can run in the App Service sandbox.

<sup>2</sup> WebJobs (without the WebJobs SDK) supports NPM and NuGet.

### Summary

Azure Functions offers more developer productivity than Azure App Service WebJobs does. It also offers more options for programming languages, development environments, Azure service integration, and pricing. For most scenarios, it's the best choice.

Here are two scenarios for which WebJobs may be the best choice:

* You need more control over the code that listens for events, the `JobHost` object. Functions offers a limited number of ways to customize `JobHost` behavior in the [host.json](functions-host-json.md) file. Sometimes you need to do things that can't be specified by a string in a JSON file. For example, only the WebJobs SDK lets you configure a custom retry policy for Azure Storage.
* You have an App Service app for which you want to run code snippets, and you want to manage them together in the same Azure DevOps environment.

For other scenarios where you want to run code snippets for integrating Azure or third-party services, choose Azure Functions over WebJobs with the WebJobs SDK.

<a name="together"></a>

## Microsoft Flow, Logic Apps, Functions, and WebJobs together

You don't have to choose just one of these services. They integrate with each other as well as they do with external services.

A flow can call a logic app. A logic app can call a function, and a function can call a logic app. See, for example, [Create a function that integrates with Azure Logic Apps](functions-twitter-email.md).

The integration between Microsoft Flow, Logic Apps, and Functions continues to improve over time. You can build something in one service and use it in the other services.

You can get more information on integration services by using the following links:

* [Leveraging Azure Functions & Azure App Service for integration scenarios by Christopher Anderson](https://www.biztalk360.com/integrate-2016-resources/leveraging-azure-functions-azure-app-service-integration-scenarios/)
* [Integrations Made Simple by Charles Lamanna](https://www.biztalk360.com/integrate-2016-resources/integrations-made-simple/)
* [Logic Apps Live webcast](https://aka.ms/logicappslive)
* [Microsoft Flow frequently asked questions](https://flow.microsoft.com/documentation/frequently-asked-questions/)

## Next steps

Get started by creating your first flow, logic app, or function app. Select any of the following links:

* [Get started with Microsoft Flow](https://flow.microsoft.com/en-us/documentation/getting-started/)
* [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Create your first Azure function](functions-create-first-azure-function.md)
