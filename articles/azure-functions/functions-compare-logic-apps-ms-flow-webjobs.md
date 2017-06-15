---
title: Choose between Flow, Logic Apps, Functions, and WebJobs | Microsoft Docs
description: Compare and contrast the for cloud integration services from Microsoft and decide which service(s) you should use.
services: functions,app-service\logic
documentationcenter: na
author: cephalin
manager: wpickett
tags: ''
keywords: microsoft flow, flow, logic apps, azure functions, functions, azure webjobs, webjobs, event processing, dynamic compute, serverless architecture

ms.assetid: e9ccf7ad-efc4-41af-b9d3-584957b1515d
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/08/2016
ms.author: chrande; glenga
ms.custom: mvc
---
# Choose between Flow, Logic Apps, Functions, and WebJobs
This article compares and contrasts the following services in the Microsoft cloud, which can all solve integration 
problems and automation of business processes:

* [Microsoft Flow](https://flow.microsoft.com/)
* [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Azure App Service WebJobs](../app-service-web/web-sites-create-web-jobs.md)

All these services are useful when "gluing" together disparate systems. They can all define input, actions, 
conditions, and output. You can run each of them on a schedule or trigger. However, each service adds a unique set of 
value, and comparing them is not a question of "Which service is the best?" but one of "Which service is best suited 
for this situation?" Often, a combination of these services is the best way to rapidly build a scalable, full featured 
integration solution.

<a name="flow"></a>

## Flow vs. Logic Apps
We can discuss Microsoft Flow and Azure Logic Apps together because they are both *configuration-first* 
integration services, which makes it easy to build processes and workflows and integrate with various SaaS and enterprise applications. 

* Flow is built on top of Logic Apps
* They have the same workflow designer
* [Connectors](../connectors/apis-list.md) that work in one can also work in the other

Flows empowers any office worker to perform simple integrations (e.g. get SMS for important emails) without going through 
developers or IT. On the other hand, Logic Apps can enable advanced or mission-critical integrations (e.g. B2B processes) 
where enterprise-level DevOps and security practices are required. It is typical for a business workflow to grow in 
complexity overtime. Accordingly, you can start with a flow at first, then convert it to a logic app as needed.

The following table helps you determine whether Flow or Logic Apps is best for a given integration.

|  | Flow | Logic Apps |
| --- | --- | --- |
| Audience |office workers, business users |IT pros, developers |
| Scenarios |Self-service |Mission-critical |
| Design Tool |In-browser, UI only |In-browser and [Visual Studio](../logic-apps/logic-apps-deploy-from-vs.md), [Code view](../logic-apps/logic-apps-author-definitions.md) available |
| DevOps |Ad-hoc, develop in production |source control, testing, support, and automation and manageability in [Azure Resource Management](../logic-apps/logic-apps-arm-provision.md) |
| Admin Experience |[https://flow.microsoft.com](https://flow.microsoft.com) |[https://portal.azure.com](https://portal.azure.com) |
| Security |Standard practices: [data sovereignty](https://wikipedia.org/wiki/Technological_Sovereignty), [encryption at rest](https://wikipedia.org/wiki/Data_at_rest#Encryption) for sensitive data, etc. |Security assurance of Azure: [Azure Security](https://www.microsoft.com/trustcenter/Security/AzureSecurity), [Security Center](https://azure.microsoft.com/services/security-center/), [audit logs](https://azure.microsoft.com/blog/azure-audit-logs-ux-refresh/), and more. |

<a name="function"></a>

## Functions vs. WebJobs
We can discuss Azure Functions and Azure App Service WebJobs together because they are both *code-first* integration services
and designed for developers. They enable you to run a script or a piece of code in response to various events, such 
as [new Storage Blobs](functions-bindings-storage.md) or [a WebHook request](functions-bindings-http-webhook.md). Here are 
their similarities: 

* Both are built on [Azure App Service](../app-service/app-service-value-prop-what-is.md) and enjoy features such as 
  [source control](../app-service-web/app-service-continuous-deployment.md), 
  [authentication](../app-service/app-service-authentication-overview.md), and [monitoring](../app-service-web/web-sites-monitor.md).
* Both are developer-focused services.
* Both support standard scripting and programming languages.
* Both have NuGet and NPM support.

Functions is the natural evolution of WebJobs in that it takes the best things about WebJobs and improves upon them. The improvements
include: 

* Streamlined dev, test, and run of code, directly in the browser.
* Built-in integration with more Azure services and 3rd-party services like [GitHub WebHooks](https://developer.github.com/webhooks/creating/).
* Pay-per-use, no need to pay for an [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).
* Automatic, [dynamic scaling](functions-scale.md).
* For existing customers of App Service, running on App Service plan still possible (to take advantage of under-utilized resources).
* Integration with Logic Apps.

The following table summarizes the differences between Functions and WebJobs:

|  | Functions | WebJobs |
| --- | --- | --- |
| Scaling |Configurationless scaling |scale with App Service plan |
| Pricing |Pay-per-use or part of App Service plan |Part of App Service plan |
| Run-type |triggered, scheduled (by timer trigger) |triggered, continuous, scheduled |
| Trigger events |[timer](functions-bindings-timer.md), [Azure Cosmos DB](functions-bindings-documentdb.md), [Azure Event Hubs](functions-bindings-event-hubs.md), [HTTP/WebHook (GitHub, Slack)](functions-bindings-http-webhook.md), [Azure App Service Mobile Apps](functions-bindings-mobile-apps.md), [Azure Notification Hubs](functions-bindings-notification-hubs.md), [Azure Service Bus](functions-bindings-service-bus.md), [Azure Storage](functions-bindings-storage.md) |[Azure Storage](../app-service-web/websites-dotnet-webjobs-sdk-storage-blobs-how-to.md), [Azure Service Bus](../app-service-web/websites-dotnet-webjobs-sdk-service-bus.md) |
| In-browser development |x | |
| Window scripting |experimental |x |
| PowerShell |experimental |x |
| C# |x |x |
| F# |x | |
| Bash |experimental |x |
| PHP |experimental |x |
| Python |experimental |x |
| JavaScript |x |x |

Whether to use Functions or WebJobs ultimately depends on what you're already doing with App Service. If you have an App Service 
app for which you want to run code snippets, and you want to manage them together in the same DevOps environment, you 
should use WebJobs. If you want to run code snippets for other Azure services or even 3rd-party apps, or if you want to 
manage your integration code snippets separately from your App Service apps, or if you want to call your code snippets from a 
Logic app, you should take advantage of all the improvements in Functions.  

<a name="together"></a>

## Flow, Logic Apps, and Functions together
As previously mentioned, which service is best suited to you depends on your situation. 

* For simple business optimization, then use Flow.
* If your integration scenario is too advanced for Flow, or you need DevOps capabilities and security compliances, then use Logic Apps.
* If a step in your integration scenario requires highly custom transformation or specialized code, then write a 
  function app, and then trigger a function as an action in your logic app.

You can call a logic app in a flow. You can also call a function in a logic app, and a logic app in a function. 
The integration between Flow, Logic Apps, and Functions continue to improve overtime. You can 
build something in one service and use it in the other services. Therefore, any investment you make in these three 
technologies is worthwhile.

## Next Steps
Get started with each of the services by creating your first flow, logic app, function app, or WebJob. Click any of the following links:

* [Get started with Microsoft Flow](https://flow.microsoft.com/en-us/documentation/getting-started/)
* [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md)
* [Create your first Azure Function](functions-create-first-azure-function.md)
* [Deploy WebJobs using Visual Studio](../app-service-web/websites-dotnet-deploy-webjobs.md)

Or, get more information on these integration services with the following links:

* [Leveraging Azure Functions & Azure App Service for integration scenarios by Christopher Anderson](http://www.biztalk360.com/integrate-2016-resources/leveraging-azure-functions-azure-app-service-integration-scenarios/)
* [Integrations Made Simple by Charles Lamanna](http://www.biztalk360.com/integrate-2016-resources/integrations-made-simple/)
* [Logic Apps Live Webcast](http://aka.ms/logicappslive)
* [Microsoft Flow Frequently asked questions](https://flow.microsoft.com/documentation/frequently-asked-questions/)
* [Azure WebJobs documentation resources](../app-service-web/websites-webjobs-resources.md)

