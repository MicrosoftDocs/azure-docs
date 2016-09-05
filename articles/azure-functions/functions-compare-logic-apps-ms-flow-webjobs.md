<properties
	pageTitle="Choose between Flow, Logic Apps, Functions, and WebJobs | Microsoft Azure"
	description="Compare and contrast the for cloud integration services from Microsoft and decide which service(s) you should use."
	services="functions,app-service\logic"
	documentationCenter="na"
	authors="cephalin"
	manager="wpickett"
	tags=""
	keywords="microsoft flow, flow, logic apps, app service logic apps, azure functions, functions, azure webjobs, webjobs, event processing, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="09/05/2016"
	ms.author="chrande; glenga"/>

# Choose between Flow, Logic Apps, Functions, and WebJobs

This article compares and contrasts the following services in the Microsoft cloud, which can all solve integration 
problems and automation of business processes:

- [Microsoft Flow](https://flow.microsoft.com/)
- [Azure App Service Logic Apps](https://azure.microsoft.com/services/logic-apps/)
- [Azure Functions](https://azure.microsoft.com/services/functions/)
- [Azure App Service WebJobs](../app-service-web/web-sites-create-web-jobs.md)

All of these services are useful when "gluing" together disparate systems. They can all define input, actions, 
conditions, and output. You can run each of them on a schedule or trigger. However, each service adds a unique set of 
value, and comparing them is not a question of "Which service is the best?" but one of "Which service is best suited 
for this situation?" In many cases, you will find that a combination of these services is your best option.

<a name="flow"></a>
## Flow vs. Logic Apps

We can Microsoft Flow and Azure App Service Logic Apps discuss together because they are both *configuration-first* 
integration services, which makes it easy to build processes and workflows and integrate with various SaaS and enterprise applications. 

- Flow is built on top of Logic Apps
- They share the same workflow designer
- Connectors that work in one can also work in the other
- Flows can be converted into Logic Apps anytime

Flows empowers any office worker to perform simple integrations (e.g. get SMS for important emails) without going through 
developers or IT. On the other hand, Logic Apps can enable advanced or mission-critical integrations (e.g. B2B processes) 
where enterprise-level DevOps and security practices are required. It is typical for a business workflow to grow in 
complexity overtime. Similarly, you can start with a Flow at first, then convert it to a Logic App as needed.

The following table helps you determine if Flow or Logic Apps is best for a given integration.

|               | Flow                                                                             | Logic Apps                                                                                          |
|---------------|----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Audience      | office workers, business users                                                   | IT pros                                                                                             |
| Complexity    | Simple                                                                           | Complex                                                                                             |
| Scenarios     | Self-service                                                                     | Mission-critical                                                                                    |
| Design Tool   | UI only                                                                          | Code view available                                                                                 |
| DevOps        | Ad-hoc, develop in production                                                    | source control, testing, support, operations                                                        |
| Security      | Standard practices: data sovereignty, encryption of sensitive data at rest, etc. | Security assurance of Azure: Azure Cloud Policy, Azure Security Center, Azure Audit Logs, and more. |

<a name="function"></a>
## Functions vs. WebJobs

We can discuss Azure Functions and Azure App Service WebJobs together because they are both *code-first* integration services
and designed for developers. This makes it possible to run a script or a piece of code in response to a variety of events such 
as new Storage Blobs or a WebHook request. Here are their similarities: 

- Both are built on Azure App Service and enjoy features such as source control, authentication, and monitoring
- Both are developer-focused services
- Both support standard scripting and programming languages
- Both have NuGet and NPM support

Functions is a natural evolution of WebJobs in that it takes the best things about WebJobs and improves upon them. The improvements
include: 

- streamlined dev, test, and run of code, directly in the browser
- built-in integration with more Azure services and 3rd-party services like GitHub WebHooks
- pay-per-use, no need to pay for an App Service plan
- automatic, dynamic scaling 
- for existing customers of App Service, running on App Service plan still possible (to take advantage of under-utilized resources) 
- integration with Logic Apps

The following table summarizes the differences between Functions and WebJobs:

|                        | Functions                                                                                                                                                                | WebJobs                            |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| Scaling                | Configurationless   scaling                                                                                                                                              | scale   with App Service plan      |
| Pricing                | Pay-per-use or part of App Service plan                                                                                                                                  | Part   of App Service plan         |
| Run-type               | triggered,   scheduled (by timer trigger)                                                                                                                                | triggered,   continuous, scheduled |
| Trigger events         | timer,   Azure DocumentDB, Azure Event Hubs, HTTP, WebHook (GitHub, Slack), Azure App   Service Mobile Apps, Azure Notification Hubs, Azure Service Bus, Azure   Storage | Azure Storage, Azure Service Bus   |
| In-browser development | x                                                                                                                                                                        |                                    |
| Window scripting       | experimental                                                                                                                                                             | x                                  |
| PowerShell             | experimental                                                                                                                                                             | x                                  |
| C#                     | x                                                                                                                                                                        | x                                  |
| F#                     | x                                                                                                                                                                        |                                    |
| Bash                   | experimental                                                                                                                                                             | x                                  |
| PHP                    | experimental                                                                                                                                                             | x                                  |
| Python                 | experimental                                                                                                                                                             | x                                  |
| JavaScript             | x                                                                                                                                                                        | x                                  |
| Java                   | experimental                                                                                                                                                             | x                                  |

Whether to use Functions or WebJobs ultimately depends on what you're already doing with App Service. If you have an App Service 
app for which you want to run code snippets, and you want to manage them together in the same DevOps environment, you 
should use WebJobs. If you want to run code snippets for other Azure services or even 3rd-party apps, or if you want to 
manage your integration code snippets separately from your App Service apps, or if you want to call your code snippets from a 
Logic app, you should take advantage of all the improvements in Functions.  

<a name="together"></a>
## Flow, Logic Apps, and Functions together

As previously mentioned, which service is best suited to you depends on your situation. 

- For simple business optimization, use Flow.
- If your integration scenario is too advanced for Flow, or you need enterprise-class enterprise-class DevOps and operational 
support, use Logic Apps.
- If some a step in your integration scenario requires highly custom transformation or specialized code, write a 
Functions app, then trigger a function as an action in your Logic app.

You can integrate your Logic app into Flow, and you can integrate your flow into Logic Apps. You can also integrate your Functions 
app into Logic apps. The integration between Flow, Logic Apps, and Functions will continue to improve overtime. This means that 
any investment you make in these three technologies is worthwhile.
