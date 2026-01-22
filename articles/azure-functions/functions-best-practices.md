---
title: Azure Functions best practices
description: Learn best practices for designing, deploying, and maintaining efficient function code running in Azure.
ms.assetid: 9058fb2f-8a93-4036-a921-97a0772f503c
ms.topic: conceptual
ms.date: 01/20/2026
ms.devlang: csharp
ms.custom:
  - build-2024
  - ignite-2024
# ms.devlang: csharp, java, javascript, powershell, python
# Customer intent: As a developer, I want to understand how to correctly design, deploy, and maintain my functions so I can run them in the most safe and efficient way possible.
---
# Best practices for reliable Azure Functions

Azure Functions is an event-driven, compute-on-demand service that extends the existing Azure App Service application platform. It adds capabilities to implement code triggered by events occurring in Azure, in a partner service, and in on-premises systems. By using Functions, you can build solutions that connect to data sources or messaging solutions, which makes it easier to process and react to events. Functions runs in Azure data centers, which are complex with many integrated components. In a hosted cloud environment, it's expected that VMs can occasionally restart or move, and systems upgrades occur. Your functions apps also likely depend on external APIs, Azure Services, and other databases, which are also prone to periodic unreliability.

This article details some best practices for designing and deploying efficient function apps that remain healthy and perform well in a cloud-based environment.

## Choose the correct hosting plan

When you create a function app in Azure, you must choose a hosting plan for your app. The plan you choose affects performance, reliability, and cost. Azure Functions provides the following hosting plans:

- [Flex Consumption plan](./flex-consumption-plan.md)
- [Premium plan](functions-premium-plan.md)
- [Dedicated (App Service) plan](dedicated-plan.md)
- [Consumption plan](consumption-plan.md)

When possible, use the [Flex Consumption plan](./flex-consumption-plan.md) to host your dynamic scale apps.  

In the context of the App Service platform, the *Premium* plan that dynamically hosts your functions is the Elastic Premium plan (EP). Other Dedicated (App Service) plans are called Premium. For more information, see [Azure Functions Premium plan](functions-premium-plan.md).

The hosting plan you choose determines the following behaviors:

- How your function app scales based on demand and how instance allocation is managed.
- The resources available to each function app instance.
- Support for advanced functionality, such as Azure Virtual Network connectivity.

For more information about choosing the correct hosting plan and a detailed comparison between the plans, see [Azure Functions hosting options](functions-scale.md).

Choose the correct plan when you create your function app. Functions provides a limited ability to switch your hosting plan, primarily between Consumption and Elastic Premium plans. For more information, see [Plan migration](functions-how-to-use-azure-function-app-settings.md?tabs=portal#plan-migration).

## Configure storage correctly

Functions requires a storage account be associated with your function app. The Functions host uses the storage account connection for operations such as managing triggers and logging function executions. It's also used when dynamically scaling function apps. For more information, see [Storage considerations for Azure Functions](storage-considerations.md).

A misconfigured file system or storage account in your function app can affect the performance and availability of your functions. For help with troubleshooting an incorrectly configured storage account, see the [storage troubleshooting](functions-recover-storage-account.md) article.

### Storage connection settings

Function apps that scale dynamically can run either from an Azure Files endpoint in your storage account or from the file servers associated with your scaled-out instances. This behavior is controlled by the following application settings:

- [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](functions-app-settings.md#website_contentazurefileconnectionstring)
- [WEBSITE_CONTENTSHARE](functions-app-settings.md#website_contentshare)

The Premium plan and the Consumption plan on Windows support these settings. The Flex Consumption plan doesn't require these settings and uses a Blob storage container to host deployment packages instead of an Azure Files share.

When you create your function app in the Azure portal or by using Azure CLI or Azure PowerShell, you create these settings for your function app when needed. When you create your resources from an Azure Resource Manager template (ARM template), you need to also include `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` in the template.

On your first deployment using an ARM template, don't include `WEBSITE_CONTENTSHARE`, which is generated for you.

You can use the following ARM template examples to help correctly configure these settings:

- [Consumption plan](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/)
- [Dedicated plan](https://azure.microsoft.com/resources/templates/function-app-create-dedicated/)
- [Premium plan with VNET integration](https://azure.microsoft.com/resources/templates/function-premium-vnet-integration/)
- [Consumption plan with a deployment slot](https://azure.microsoft.com/resources/templates/function-app-create-dynamic-slot/)

> [!IMPORTANT]
> The Azure Files service doesn't currently support identity-based connections. The Flex Consumption plan fully supports managed identities. For more information, see [Create an app without Azure Files](storage-considerations.md#create-an-app-without-azure-files).

### Storage account configuration

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Functions relies on Azure Storage for operations such as managing triggers and logging function executions. The storage account connection string for your function app is found in the `AzureWebJobsStorage` and `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application settings.

Keep in mind the following considerations when creating this storage account:

- To reduce latency, create the storage account in the same region as the function app.

- To improve performance in production, use a separate storage account for each function app. This aspect is especially true with Durable Functions and Event Hubs triggered functions.

- For Event Hubs triggered functions, don't use an account with [Data Lake Storage enabled](https://github.com/Azure/azure-functions-eventhubs-extension/issues/81).

### Handling large data sets

When running on Linux, you can add extra storage by mounting a file share. Mounting a share is a convenient way for a function to process a large existing data set. For more information, see [Mount file shares](storage-considerations.md#mount-file-shares).

## Organize your functions

As part of your solution, you likely develop and publish multiple functions. These functions are often combined into a single function
app, but they can also run in separate function apps. In Premium and Dedicated (App Service) hosting plans, multiple function apps can also share the same resources by running in the same plan. How you group your functions and function apps can affect the performance, scaling, configuration, deployment, and security of your overall solution.

For Consumption and Premium plan, all functions in a function app are dynamically scaled together.

For more information on how to organize your functions, see [Function organization best practices](performance-reliability.md#function-organization-best-practices).

## Optimize deployments

When you deploy a function app, remember that the unit of deployment for functions in Azure is the function app. You deploy all functions in a function app at the same time, usually from the same deployment package.  

Consider these options for a successful deployment:

- Have your functions run from the deployment package. This [run from package approach](run-functions-from-deployment-package.md) provides the following benefits:

  - Reduces the risk of file copy locking problems.
  - Can be deployed directly to a production app and doesn't trigger a restart.
  - All files in the package are available to your app.
  - Improves the performance of ARM template deployments.
  - Might reduce cold-start times, particularly for JavaScript functions with large npm package trees.

- Consider using [continuous deployment](functions-continuous-deployment.md) to connect deployments to your source control solution. Continuous deployments also let you run from the deployment package.

- For [Premium plan hosting](functions-premium-plan.md), consider adding a warmup trigger to reduce latency when new instances are added. For more information, see [Azure Functions warm-up trigger](functions-bindings-warmup.md).

- To minimize deployment downtime, use deployment slots for Consumption, Premium, and Dedicated plans. Or, configure rolling updates for zero-downtime deployments in the Flex Consumption plan. For more information, see [Azure Functions deployment slots](functions-deployment-slots.md) and [site update strategies in Flex Consumption](flex-consumption-site-updates.md).

## Write robust functions

Follow design principles that help with the general performance and availability of your functions. These principles include:

- [Avoid long running functions](performance-reliability.md#avoid-long-running-functions)
- [Plan cross-function communication](performance-reliability.md#cross-function-communication)
- [Write functions to be stateless](performance-reliability.md#write-functions-to-be-stateless)
- [Write defensive functions](performance-reliability.md#write-defensive-functions)

Transient failures are common in cloud computing, so use a [retry pattern](/azure/architecture/patterns/retry) when accessing cloud-based resources. Many triggers and bindings already implement retry.

Prioritize integration testing by continuously testing your functions in the context of the full application and in your build automation pipelines.

## Design for security

Consider security during the planning phase, not after your functions are ready. For more information, see [Securing Azure Functions](security-concepts.md).  

## Consider concurrency

As demand builds on your function app because of incoming events, Consumption and Premium plans scale out the function apps. It's important to understand how your function app responds to load and how the triggers can be configured to handle incoming events. For a general overview, see [Event-driven scaling in Azure Functions](event-driven-scaling.md).

Dedicated (App Service) plans require you to provide scaling for your function apps.

### Worker process count

In some cases, it's more efficient to handle the load by creating multiple processes, called language worker processes, in the instance before scale-out. The [FUNCTIONS_WORKER_PROCESS_COUNT](functions-app-settings.md#functions_worker_process_count) setting controls the maximum number of language worker processes allowed. The default for this setting is `1`, which means that multiple processes aren't used. After the maximum number of processes are reached, the function app scales out to more instances to handle the load. This setting doesn't apply for [C# class library functions](functions-dotnet-class-library.md), which run in the host process.

When you use `FUNCTIONS_WORKER_PROCESS_COUNT` on a Premium plan or Dedicated (App Service) plan, consider the number of cores provided by your plan. For example, the Premium plan `EP2` provides two cores, so you should start with a value of `2` and increase by two as needed, up to the maximum.

### Trigger configuration

When you plan for throughput and scaling, understand how the different types of triggers process events. Some triggers give you control over batching behaviors and concurrency. Adjusting these values can help each instance scale appropriately for the demands of the invoked functions. You apply these configuration options to all triggers in a function app, and maintain them in the host.json file for the app. For settings details, see the Configuration section of the specific trigger reference.

To learn more about how Functions processes message streams, see [Azure Functions reliable event processing](functions-reliable-event-processing.md).

### Plan for connections

Connection limits apply to function apps running in [Consumption plan](consumption-plan.md). These limits apply to each instance. Because of these limits and as a general best practice, optimize your outbound connections from your function code. For more information, see [Manage connections in Azure Functions](manage-connections.md).

### Language-specific considerations

For your language of choice, keep in mind the following considerations:

# [C#](#tab/csharp)

- [Use async code but avoid blocking calls](performance-reliability.md#use-async-code-but-avoid-blocking-calls).

- [Use cancellation tokens](functions-dotnet-class-library.md?#cancellation-tokens) (in-process only).

# [Java](#tab/java)

- For applications that are a mix of CPU-bound and IO-bound operations, consider using [more worker processes](functions-app-settings.md#functions_worker_process_count).

# [JavaScript](#tab/javascript)

- [Use `async` and `await`](functions-reference-node.md#use-async-and-await).

- [Use multiple worker processes for CPU bound applications](functions-reference-node.md?tabs=v2#scaling-and-concurrency).

# [PowerShell](#tab/powershell)

- [Review the concurrency considerations](functions-reference-powershell.md#concurrency).

# [Python](#tab/python)

- [Improve throughput performance of Python apps in Azure Functions](python-scale-performance-reference.md)

---

## Maximize availability

Cold start is a key consideration for serverless architectures. For more information, see [Cold starts](event-driven-scaling.md#cold-start). If cold start is a concern for your scenario, see [Understanding serverless cold start](https://azure.microsoft.com/blog/understanding-serverless-cold-start/).

Both Flex Consumption and Premium plans are recommended for reducing cold starts while maintaining dynamic scale. Use the following guidance to reduce cold starts and improve availability in all hosting plans.

| Plan | Guidance |
|:--- |: --- |
| **Flex Consumption plan** | • [Use always ready instances to keep instances running](flex-consumption-plan.md#always-ready-instances)<br/>• [Set always ready instance counts](flex-consumption-how-to.md#set-always-ready-instance-counts) |
| **Premium plan** | • [Implement a Warmup trigger in your function app](functions-bindings-warmup.md)<br/>• [Set the values for Always-Ready instances and Max Burst limit](functions-premium-plan.md#plan-and-sku-settings)<br/>• [Use virtual network trigger support when using non-HTTP triggers on a virtual network](functions-networking-options.md#elastic-premium-plan-with-virtual-network-triggers)|
| **Dedicated plans** | • [Run on at least two instances with Azure App Service Health Check enabled](../app-service/monitor-instances-health-check.md)<br/>• [Implement autoscaling](/azure/architecture/best-practices/auto-scaling)|
| **Consumption plan** | • Review your use of Singleton patterns and the concurrency settings for bindings and triggers to avoid artificially placing limits on how your function app scales.<br/>• [Review the `functionAppScaleLimit` setting, which can limit scale-out](event-driven-scaling.md#limit-scale-out)<br/>• Check for a Daily Usage Quota (GB-Sec) limit set during development and testing. Consider removing this limit in production environments. |

## Monitor effectively

Azure Functions offers built-in integration with Azure Application Insights to monitor your function execution and traces written from your code. For more information, see [Monitor executions in Azure Functions](functions-monitoring.md). Azure Monitor also provides facilities for monitoring the health of the function app itself. For more information, see [Monitor Azure Functions](monitor-functions.md).

Be aware of the following considerations when using Application Insights integration to monitor your functions:

- Remove the [AzureWebJobsDashboard](functions-app-settings.md#azurewebjobsdashboard) application setting. This setting was supported in older versions of Functions. Removing `AzureWebJobsDashboard` improves the performance of your functions.

- Review the [Application Insights logs](analyze-telemetry-data.md). If data you expect to find is missing, consider adjusting the sampling settings to better capture your monitoring scenario. Use the `excludedTypes` setting to exclude certain types from sampling, such as `Request` or `Exception`. For more information, see [Configure sampling](configure-monitoring.md?tabs=v2#configure-sampling).

Azure Functions also allows you to [send system-generated and user-generated logs to Azure Monitor Logs](functions-monitor-log-analytics.md). Integration with Azure Monitor Logs is currently in preview.

## Build in redundancy

Your business needs might require that your functions always be available, even during a data center outage. To learn how to use a multiregional approach to keep your critical functions always running, see [Reliability in Azure Functions](/azure/reliability/reliability-functions).

## Next steps

[Manage your function app](functions-how-to-use-azure-function-app-settings.md)
