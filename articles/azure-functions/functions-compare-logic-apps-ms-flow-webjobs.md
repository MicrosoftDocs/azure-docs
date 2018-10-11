---
title: Compare Flow, Logic Apps, Functions, and WebJobs - Azure
description: "Compare Microsoft cloud services that are optimized for integration tasks:  Flow, Logic Apps, Functions, and WebJobs."
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
---

# Compare Flow, Logic Apps, Functions, and WebJobs

This article compares the following Microsoft cloud services:

* [Microsoft Flow](https://flow.microsoft.com/)
* [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Azure App Service WebJobs](../app-service/web-sites-create-web-jobs.md)

All of these services can solve integration problems and automate business processes. They can all define input, actions, conditions, and output. You can run each of them on a schedule or trigger. But each service has unique advantages, and this article explains the differences.

## Compare Microsoft Flow and Azure Logic Apps

Flow and Logic Apps are both *designer-first* integration services that can create workflows. Both services integrate with various SaaS and enterprise applications. 

Flow is built on top of Logic Apps. They share the same workflow designer and the same [Connectors](../connectors/apis-list.md). 

Flow empowers any office worker to perform simple integrations (for example, an approval process on a SharePoint Document Library) without going through developers or IT. On the other hand, Logic Apps can enable advanced integrations (for example, B2B processes) where enterprise-level DevOps and security practices are required. It's typical for a business workflow to grow in complexity over time. Accordingly, you can start with a flow at first, then convert it to a logic app as needed.

The following table helps you determine whether Flow or Logic Apps is best for a given integration.

|  | Flow | Logic Apps |
| --- | --- | --- |
| Users |Office workers, business users, SharePoint administrators |Pro integrators and developers, IT pros |
| Scenarios |Self-service |Advanced integrations |
| Design Tool |In-browser and mobile app, UI only |In-browser and [Visual Studio](../logic-apps/logic-apps-deploy-from-vs.md), [Code view](../logic-apps/logic-apps-author-definitions.md) available |
| Application Lifecycle Management (ALM) |Design and test in non-production environments, promote to production when ready. |DevOps: source control, testing, support, automation, and manageability in [Azure Resource Management](../logic-apps/logic-apps-create-deploy-azure-resource-manager-templates.md) |
| Admin Experience |Manage Flow Environments and Data Loss Prevention (DLP) policies, track licensing [https://admin.flow.microsoft.com](https://admin.flow.microsoft.com) |Manage Resource Groups, Connections, Access Management, and Logging [https://portal.azure.com](https://portal.azure.com) |
| Security |Office 365 Security and Compliance audit logs, Data Loss Prevention (DLP), [encryption at rest](https://wikipedia.org/wiki/Data_at_rest#Encryption) for sensitive data, etc. |Security assurance of Azure: [Azure Security](https://www.microsoft.com/en-us/trustcenter/Security/AzureSecurity), [Security Center](https://azure.microsoft.com/services/security-center/), [audit logs](https://azure.microsoft.com/blog/azure-audit-logs-ux-refresh/), and more. |

## Compare Azure Functions and Azure Logic Apps

Functions and Logic Apps are Azure services that enable serverless workloads. Azure Functions is a serverless compute service, while Azure Logic Apps provides serverless workflows. Complex *orchestrations* can be created by both. An orchestration is a collection of functions or steps, called *actions* in Logic Apps, that are executed to accomplish a complex task. For example, to process a batch of orders you might execute many instances of a function in parallel, wait for all instances to finish, and then execute a function that computes a result on the aggregate.

For Azure Functions, you develop orchestrations by writing code and using the [Durable Functions extension](durable-functions-overview.md). For Logic Apps, you create orchestrations by using a GUI or editing configuration files.

You can mix and match services when you build an orchestration, calling functions from logic apps and calling logic apps from functions. Choose how to build each orchestration based on the services' capabilities or your personal preference. The following table lists some of the key differences between these services:
 
|  | Durable Functions | Logic Apps |
| --- | --- | --- |
| Development | Code-first (imperative) | Designer-first (declarative) |
| Connectivity | [About a dozen built-in binding types](functions-triggers-bindings.md#supported-bindings), write code for custom bindings | [Large collection of connectors](../connectors/apis-list.md), [Enterprise Integration Pack for B2B scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), [build custom connectors](../logic-apps/custom-connector-overview.md) |
| Actions | Each activity is an Azure function; write code for activity functions |[Large collection of ready-made actions](../logic-apps/logic-apps-workflow-actions-triggers.md)|
| Monitoring | [Azure Application Insights](../application-insights/app-insights-overview.md) | [Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md), [Log Analytics](../logic-apps/logic-apps-monitor-your-logic-apps.md)|
| Management | [REST API](durable-functions-http-api.md), [Visual Studio](https://docs.microsoft.com/azure/vs-azure-tools-resources-managing-with-cloud-explorer) | [Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md), [REST API](https://docs.microsoft.com/rest/api/logic/), [PowerShell](https://docs.microsoft.com/powershell/module/azurerm.logicapp/?view=azurermps-5.6.0), [Visual Studio](https://docs.microsoft.com/azure/logic-apps/manage-logic-apps-with-visual-studio) |
| Execution context | Can run [locally](functions-runtime-overview.md) or in the cloud. | Runs only in the cloud.|

<a name="function"></a>

## Compare Functions and WebJobs

Like Azure Functions, Azure App Service WebJobs with the WebJobs SDK is a *code-first* integration service that is designed for developers. Both are built on [Azure App Service](../app-service/app-service-web-overview.md) and support features such as [source control integration](../app-service/app-service-continuous-deployment.md), [authentication](../app-service/app-service-authentication-overview.md), and [monitoring with Application Insights integration](functions-monitoring.md).

### WebJobs and the WebJobs SDK

The *WebJobs* feature of App Service enables you to run a script or code in the context of an App Service web app. The *WebJobs SDK* is a framework designed for WebJobs that simplifies the code you write to respond to events in Azure services. For example, you could respond to the creation of an image blob in Azure Storage by creating a thumbnail image. The WebJobs SDK runs as a .NET console application, which you can deploy to a WebJob. 

WebJobs and the WebJobs SDK work best together, but you can use WebJobs without the WebJobs SDK and vice versa. A WebJob can run any program or script that runs in the App Service sandbox. A WebJobs SDK console application can run anywhere console applications run, such as on-premises servers.

### Comparison table

Azure Functions is built on the WebJobs SDK, so it shares many of the same event triggers and connections to other Azure services. Here are some factors to consider when choosing between Azure Functions and WebJobs with the WebJobs SDK:

|  | Functions | WebJobs with WebJobs SDK |
| --- | --- | --- |
|[Serverless app model](https://azure.microsoft.com/solutions/serverless/) with [automatic scaling](functions-scale.md#how-the-consumption-plan-works)|✔||
|[Develop and test in browser](functions-create-first-azure-function.md) |✔||
|[Pay-per-use pricing](functions-scale.md#consumption-plan)|✔||
|[Integration with Logic Apps](functions-twitter-email.md)|✔||
| Trigger events |[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[HTTP/WebHook (GitHub, Slack)](functions-bindings-http-webhook.md)<br>[Azure Event Grid](functions-bindings-event-grid.md)|[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[File system](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Files/FileTriggerAttribute.cs)|
| Supported languages  |C#<br>F#<br>JavaScript<br>Java (preview) |C#<sup>1</sup>|
|Package managers|NPM and NuGet|NuGet<sup>2</sup>|

<sup>1</sup> WebJobs (without WebJobs SDK) supports C#, JavaScript, Bash, .cmd, .bat, PowerShell, PHP, TypeScript, Python, and more. This is not a comprehensive list; a WebJob can run any program or script that can run in the App Service sandbox.

<sup>2</sup> WebJobs (without WebJobs SDK) supports NPM and NuGet.

### Summary

Azure Functions offers greater developer productivity, more programming language options, more development environment options, more Azure service integration options, and more pricing options. For most scenarios, it's the best choice.

Here are two scenarios for which WebJobs may be the best choice:

* You need more control over the code that listens for events, the `JobHost` object. Functions offers a limited number of ways to customize `JobHost` behavior in the [host.json](functions-host-json.md) file. Sometimes you need to do things that can't be specified by a string in a JSON file. For example, only the WebJobs SDK lets you configure a custom retry policy for Azure Storage.
* You have an App Service app for which you want to run code snippets, and you want to manage them together in the same DevOps environment.

For other scenarios where you want to run code snippets for integrating Azure or third-party services, choose Azure Functions over WebJobs with the WebJobs SDK.

<a name="together"></a>

## Flow, Logic Apps, Functions, and WebJobs together

You don't have to choose just one of these services; they integrate with each other as well as they do with external services.

A flow can call a logic app. A logic app can call a function, and a function can call a logic app. See, for example, [Create a function that integrates with Azure Logic Apps](functions-twitter-email.md).

The integration between Flow, Logic Apps, and Functions continues to improve over time. You can build something in one service and use it in the other services.

## Next steps

Get started by creating your first flow, logic app, or function app. Click any of the following links:

* [Get started with Microsoft Flow](https://flow.microsoft.com/en-us/documentation/getting-started/)
* [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Create your first Azure Function](functions-create-first-azure-function.md)

Or, get more information on these integration services with the following links:

* [Leveraging Azure Functions & Azure App Service for integration scenarios by Christopher Anderson](http://www.biztalk360.com/integrate-2016-resources/leveraging-azure-functions-azure-app-service-integration-scenarios/)
* [Integrations Made Simple by Charles Lamanna](http://www.biztalk360.com/integrate-2016-resources/integrations-made-simple/)
* [Logic Apps Live Webcast](http://aka.ms/logicappslive)
* [Microsoft Flow Frequently asked questions](https://flow.microsoft.com/documentation/frequently-asked-questions/)
