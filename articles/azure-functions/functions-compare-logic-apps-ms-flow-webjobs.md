---
title: Integration and automation platform options in Azure
description: "Compare Microsoft cloud services that are optimized for integration tasks: Power Automate, Logic Apps, Functions, and WebJobs."
ms.topic: overview
ms.date: 06/09/2023
ms.custom: mvc
#Customer intent: As a developer, I want to understand the choices that Azure offers for hosting and executing my business logic so that I can choose the right set of Azure services.
---
# Choose the right integration and automation services in Azure

This article compares the following Microsoft cloud services:

* [Microsoft Power Automate](https://make.powerautomate.com/) (was Microsoft Flow)
* [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Azure App Service WebJobs](../app-service/webjobs-create.md)

All of these services can solve integration problems and automate business processes. They can all define input, actions, conditions, and output. You can run each of them on a schedule or trigger. Each service has unique advantages, and this article explains the differences. 

>[!NOTE]  
>If you're looking for a more general comparison between Azure Functions and other Azure compute options:
>+ [Criteria for choosing an Azure compute service](/azure/architecture/guide/technology-choices/compute-comparison) 
>+ [Choosing an Azure compute option for microservices](/azure/architecture/microservices/design/compute-options)
>
>For a summary and comparison of automation service options in Azure:
>+ [Choose the Automation services in Azure](../automation/automation-services.md)

## Compare Microsoft Power Automate and Azure Logic Apps

Power Automate and Azure Logic Apps are both *designer-first* integration services that can create workflows. Both services integrate with various SaaS and enterprise applications.

Power Automate is built on the Azure Logic Apps platform. Both provide similar workflow designers and [connectors](/connectors/connector-reference/).

Power Automate empowers any office worker to perform simple integrations (for example, an approval process on a SharePoint Document Library) without going through developers or IT. Logic Apps can also enable advanced integrations (for example, B2B processes) where enterprise-level Azure DevOps and security practices are required. It's typical for a business workflow to grow in complexity over time.

The following table helps you determine whether Power Automate or Logic Apps is best for a particular integration:

|  | Power Automate | Logic Apps |
| --- | --- | --- |
| **Users** |Office workers, business users, SharePoint administrators |Pro integrators and developers, IT pros |
| **Scenarios** |Self-service |Advanced integrations |
| **Design tool** |In-browser and mobile app, UI only |In-browser, [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md), and [Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) with code view available |
| **Application lifecycle management (ALM)** |Power Platform [provides tools](/power-platform/alm/tools-apps-used-alm) that integrate with DevOps and [GitHub Actions](/power-platform/alm/devops-github-actions) to let you build automated pipelines in the ALM cycle.  |Azure DevOps: source control, testing, support, automation, and manageability in [Azure Resource Manager](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md) |
| **Admin experience** |Manage Power Automate environments and data loss prevention (DLP) policies, track licensing: [Admin center](https://admin.powerplatform.microsoft.com) |Manage resource groups, connections, access management, and logging: [Azure portal](https://portal.azure.com) |
| **Security** |Microsoft 365 security audit logs, DLP, [encryption at rest](https://wikipedia.org/wiki/Data_at_rest#Encryption) for sensitive data |Security assurance of Azure: [Azure security](https://www.microsoft.com/en-us/trustcenter/Security/AzureSecurity), [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/), [audit logs](https://azure.microsoft.com/blog/azure-audit-logs-ux-refresh/) |

## Compare Azure Functions and Azure Logic Apps

Functions and Logic Apps are Azure services that enable serverless workloads. Azure Functions is a serverless compute service, whereas Azure Logic Apps is a serverless workflow integration platform. Both can create complex *orchestrations*. An orchestration is a collection of functions, or *actions* in Azure Logic Apps, that you can run to complete a complex task. For example, to process a batch of orders, you might execute many instances of a function in parallel, wait for all instances to finish, and then execute a function that computes a result on the aggregate.

For Azure Functions, you develop orchestrations by writing code and using the [Durable Functions extension](durable/durable-functions-overview.md). For Azure Logic Apps, you create orchestrations by using a GUI or editing configuration files.

You can mix and match services when you build an orchestration, such as calling functions from logic app workflows and calling logic app workflows from functions. Choose how to build each orchestration based on the services' capabilities or your personal preference. The following table lists some key differences between these services:

|  | Durable Functions | Azure Logic Apps |
| --- | --- | --- |
| **Development** | Code-first (imperative) | Designer-first (declarative) |
| **Connectivity** | [About a dozen built-in binding types](functions-triggers-bindings.md#supported-bindings), write code for custom bindings | [Large collection of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors), [Enterprise Integration Pack for B2B scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), [build custom connectors](/connectors/custom-connectors/) |
| **Actions** | Each activity is an Azure function; write code for activity functions |[Large collection of ready-made actions](/connectors/connector-reference/connector-reference-logicapps-connectors)|
| **Monitoring** | [Azure Application Insights](../azure-monitor/app/app-insights-overview.md) | [Azure portal](../logic-apps/quickstart-create-example-consumption-workflow.md), [Azure Monitor Logs](../logic-apps/monitor-workflows-collect-diagnostic-data.md), [Microsoft Defender for Cloud](../logic-apps/healthy-unhealthy-resource.md) |
| **Management** | [REST API](durable/durable-functions-http-api.md), [Visual Studio](/visualstudio/azure/vs-azure-tools-resources-managing-with-cloud-explorer) | [Azure portal](../logic-apps/quickstart-create-example-consumption-workflow.md), [REST API](/rest/api/logic/), [PowerShell](/powershell/module/az.logicapp), [Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md) |
| **Execution context** | Can run [locally](./functions-kubernetes-keda.md) or in the cloud | Runs in Azure, locally, or on premises. For more information, see [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md#resource-environment-differences). |

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
|**[Serverless app model](https://azure.microsoft.com/solutions/serverless/) with [automatic scaling](event-driven-scaling.md)**|✔||
|**[Develop and test in browser](./functions-get-started.md)** |✔||
|**[Pay-per-use pricing](consumption-plan.md)**|✔||
|**[Integration with Logic Apps](functions-twitter-email.md)**|✔||
| **Trigger events** |[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[HTTP/WebHook (GitHub, Slack)](functions-bindings-http-webhook.md)<br>[Azure Event Grid](functions-bindings-event-grid.md)|[Timer](functions-bindings-timer.md)<br>[Azure Storage queues and blobs](functions-bindings-storage-blob.md)<br>[Azure Service Bus queues and topics](functions-bindings-service-bus.md)<br>[Azure Cosmos DB](functions-bindings-cosmosdb.md)<br>[Azure Event Hubs](functions-bindings-event-hubs.md)<br>[File system](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions/Extensions/Files/FileTriggerAttribute.cs)|
| **Supported languages**  |C#<br>F#<br>JavaScript<br>Java<br>Python<br>PowerShell |C#<sup>1</sup>|
|**Package managers**|npm and NuGet|NuGet<sup>2</sup>|

<sup>1</sup> WebJobs (without the WebJobs SDK) supports languages such as C#, Java, JavaScript, Bash, .cmd, .bat, PowerShell, PHP, TypeScript, Python, and more. A WebJob can run any program or script that can run in the App Service sandbox.

<sup>2</sup> WebJobs (without the WebJobs SDK) supports npm and NuGet.

### Summary

Azure Functions offers more developer productivity than Azure App Service WebJobs does. It also offers more options for programming languages, development environments, Azure service integration, and pricing. For most scenarios, it's the best choice.

Here are two scenarios for which WebJobs may be the best choice:

* You need more control over the code that listens for events, the `JobHost` object. Functions offers a limited number of ways to customize `JobHost` behavior in the [host.json](functions-host-json.md) file. Sometimes you need to do things that can't be specified by a string in a JSON file. For example, only the WebJobs SDK lets you configure a custom retry policy for Azure Storage.
* You have an App Service app for which you want to run code snippets, and you want to manage them together in the same Azure DevOps environment.

For other scenarios where you want to run code snippets for integrating Azure or third-party services, choose Azure Functions over WebJobs with the WebJobs SDK.

<a name="together"></a>

## Power Automate, Logic Apps, Functions, and WebJobs together

You don't have to choose just one of these services. They integrate with each other and with external services.

A Power Automate flow can call an Azure Logic Apps workflow. An Azure Logic Apps workflow can call a function in Azure Functions, and vice versa. For example, see [Create a function that integrates with Azure Logic Apps](functions-twitter-email.md).

Between Power Automate, Logic Apps, and Functions, the integration experience between these services continues to improve over time. You can build a component in one service and use that component in the other services.

You can get more information on integration services by using the following links:

* [Leveraging Azure Functions & Azure App Service for integration scenarios by Christopher Anderson](https://www.biztalk360.com/integrate-2016-resources/leveraging-azure-functions-azure-app-service-integration-scenarios/)
* [Integrations Made Simple by Charles Lamanna](https://www.biztalk360.com/integrate-2016-resources/integrations-made-simple/)
* [Logic Apps Live webcast](https://aka.ms/logicappslive)
* [Power Automate frequently asked questions](/power-automate/frequently-asked-questions)

## Next steps

Get started by creating your first flow, logic app workflow, or function app. Select any of the following links:

* [Get started with Power Automate](/power-automate/getting-started)
* [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)
* [Create your first Azure function](./functions-get-started.md)
