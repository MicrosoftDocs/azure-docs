---
title: Azure Functions best practices 
description: Learn best practices for designing, deploying, and maintaining efficient function code running in Azure.
ms.assetid: 9058fb2f-8a93-4036-a921-97a0772f503c
ms.topic: conceptual
ms.date: 08/30/2021
ms.devlang: csharp, java, javascript, powershell, python
# Customer intent: As a developer, I want to understand how to correctly design, deploy, and maintain my functions so I can run them in the most safe and efficient way possible.
---
# Best practices for reliable Azure Functions

Azure Functions is an event-driven, compute-on-demand experience that extends the existing Azure App Service application platform with capabilities to implement code triggered by events occurring in Azure, in third-party service, and in on-premises systems. Functions lets you build solutions by connecting to data sources or messaging solutions, which makes it easier to process and react to events. Functions runs on Azure data centers, which are complex with many integrated components. In a hosted cloud environment, it's expected that VMs can occasionally restart or move, and systems upgrades will occur. Your functions apps also likely depend on external APIs, Azure Services, and other databases, which are also prone to periodic unreliability. 

This article details some best practices for designing and deploying efficient function apps that remain healthy and perform well in a cloud-based environment.

## Choose the correct hosting plan 

When you create a function app in Azure, you must choose a hosting plan for your app. The plan you choose has an effect on performance, reliability, and cost. There are three basic hosting plans available for Functions: 

+ [Consumption plan](consumption-plan.md)
+ [Premium plan](functions-premium-plan.md)
+ [Dedicated (App Service) plan](dedicated-plan.md)

All hosting plans are generally available (GA) when running either Linux or Windows.

In the context of the App Service platform, the Premium plan used to dynamically host your functions is the Elastic Premium plan (EP). There are other Dedicated (App Service) plans called Premium. To learn more, see the [Premium plan](functions-premium-plan.md) article.

The hosting plan you choose determines the following behaviors:

+   How your function app is scaled based on demand and how instances allocation is managed.
+   The resources available to each function app instance.
+   Support for advanced functionality, such as Azure Virtual Network connectivity.

To learn more about choosing the correct hosting plan and for a detailed comparison between the plans, see [Azure Functions hosting options](functions-scale.md).

It's important that you choose the correct plan when you create your function app. Functions provides a limited ability to switch your hosting plan, primarily between Consumption and Elastic Premium plans. To learn more, see [Plan migration](functions-how-to-use-azure-function-app-settings.md?tabs=portal#plan-migration). 

## Configure storage correctly

Functions requires a storage account be associated with your function app. The storage account connection is used by the Functions host for operations such as managing triggers and logging function executions. It's also used when dynamically scaling function apps. To learn more, see [Storage considerations for Azure Functions](storage-considerations.md).

A misconfigured file system or storage account in your function app can affect the performance and availability of your functions. For help with troubleshooting an incorrectly configured storage account, see the [storage troubleshooting](functions-recover-storage-account.md) article. 

### Storage connection settings

Function apps that scale dynamically can run either from an Azure Files endpoint in your storage account or from the file servers associated with your scaled-out instances. This behavior is controlled by the following application settings:

+ [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [WEBSITE_CONTENTSHARE](functions-app-settings.md#website_contentshare)

These settings are only supported when you are running in a Premium plan or in a Consumption plan on Windows.

When you create your function app either in the Azure portal or by using Azure CLI or Azure PowerShell, these settings are created for your function app when needed. When you create your resources from an Azure Resource Manager template (ARM template), you need to also include `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` in the template. 

On your first deployment using an ARM template, don't include `WEBSITE_CONTENTSHARE`, which is generated for you.   

You can use the following ARM template examples to help correctly configure these settings:

+ [Consumption plan](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/)
+ [Dedicated plan](https://azure.microsoft.com/resources/templates/function-app-create-dedicated/)
+ [Premium plan with VNET integration](https://azure.microsoft.com/resources/templates/function-premium-vnet-integration/)
+ [Consumption plan with a deployment slot](https://azure.microsoft.com/resources/templates/function-app-create-dynamic-slot/)

### Storage account configuration

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Functions relies on Azure Storage for operations such as managing triggers and logging function executions. The storage account connection string for your function app is found in the `AzureWebJobsStorage` and `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` application settings.

Keep in mind the following considerations when creating this storage account: 

+ To reduce latency, create the storage account in the same region as the function app.

+ To improve performance in production, use a separate storage account for each function app. This is especially true with Durable Functions and Event Hub triggered functions. 

+ For Event Hub triggered functions, don't use an account with [Data Lake Storage enabled](https://github.com/Azure/azure-functions-eventhubs-extension/issues/81).

### Handling large data sets

When running on Linux, you can add extra storage by mounting a file share. Mounting a share is a convenient way for a function to process a large existing data set. To learn more, see [Mount file shares](storage-considerations.md#mount-file-shares).

## Organize your functions 

As part of your solution, you likely develop and publish multiple functions. These functions are often combined into a single function
app, but they can also run in separate function apps. In Premium and Dedicated (App Service) hosting plans, multiple function apps can also share the same resources by running in the same plan. How you group your functions and function apps can impact the performance, scaling, configuration, deployment, and security of your overall solution. 

For Consumption and Premium plan, all functions in a function app are dynamically scaled together.

For more information on how to organize your functions, see [Function organization best practices](performance-reliability.md#function-organization-best-practices).

## Optimize deployments

When deploying a function app, it's important to keep in mind that the unit of deployment for functions in Azure is the function app. All functions in a function app are deployed at the same time, usually from the same deployment package.  

Consider these options for a successful deployment:

+  Have your functions run from the deployment package. This [run from package approach](run-functions-from-deployment-package.md) provides the following benefits:

    + Reduces the risk of file copy locking issues. 
    + Can be deployed directly to a production app, which does trigger a restart. 
    + Know that all files in the package are available to your app. 
    + Improves the performance of ARM template deployments.
    + May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

+ Consider using [continuous deployment](functions-continuous-deployment.md) to connect deployments to your source control solution. Continuous deployments also let you run from the deployment package.

+ For [Premium plan hosting](functions-premium-plan.md), consider adding a warmup trigger to reduce latency when new instances are added. To learn more, see [Azure Functions warm-up trigger](functions-bindings-warmup.md). 

+ To minimize deployment downtime and to be able to roll back deployments, consider using deployment slots. To learn more, see [Azure Functions deployment slots](functions-deployment-slots.md).

## Write robust functions

There are several design principles you can following when writing your function code that help with general performance and availability of your functions. These principles include:
 
+ [Avoid long running functions.](performance-reliability.md#avoid-long-running-functions) 
+ [Plan cross-function communication.](performance-reliability.md#cross-function-communication) 
+ [Write functions to be stateless.](performance-reliability.md#write-functions-to-be-stateless)
+ [Write defensive functions.](performance-reliability.md#write-defensive-functions)

Because transient failures are common in cloud computing, you should use a [retry pattern](/azure/architecture/patterns/retry) when accessing cloud-based resources. Many triggers and bindings already implement retry. 

## Design for security

Security is best considered during the planning phase and not after your functions are ready to go. To Learn how to securely develop and deploy functions, see [Securing Azure Functions](security-concepts.md).  

## Consider concurrency

As demand builds on your function app as a result of incoming events, function apps running in Consumption and Premium plans are scaled out. It's important to understand how your function app responds to load and how the triggers can be configured to handle incoming events. For a general overview, see [Event-driven scaling in Azure Functions](event-driven-scaling.md).

Dedicated (App Service) plans require you to provide for scaling out your function apps. 

### Worker process count

In some cases, it's more efficient to handle the load by creating multiple processes, called language worker processes, in the instance before scale-out. The maximum number of language worker processes allowed is controlled by the [FUNCTIONS_WORKER_PROCESS_COUNT](functions-app-settings.md#functions_worker_process_count) setting. The default for this setting is `1`, which means that multiple processes aren't used. After the maximum number of processes are reached, the function app is scaled out to more instances to handle the load. This setting doesn't apply for [C# class library functions](functions-dotnet-class-library.md), which run in the host process.

When using `FUNCTIONS_WORKER_PROCESS_COUNT` on a Premium plan or Dedicated (App Service) plan, keep in mind the number of cores provided by your plan. For example, the Premium plan `EP2` provides two cores, so you should start with a value of `2` and increase by two as needed, up to the maximum.

### Trigger configuration

When planning for throughput and scaling, it's important to understand how the different types of triggers process events. Some triggers allow you to control the batching behaviors and manage concurrency. Often adjusting the values in these options can help each instance scale appropriately for the demands of the invoked functions. These configuration options are applied to all triggers in a function app, and are maintained in the host.json file for the app. See the Configuration section of the specific trigger reference for settings details.

To learn more about how Functions processes message streams, see [Azure Functions reliable event processing](functions-reliable-event-processing.md).

### Plan for connections

Function apps running in [Consumption plan](consumption-plan.md) are subject to connection limits. These limits are enforced on a per-instance basis. Because of these limits and as a general best practice, you should optimize your outbound connections from your function code. To learn more, see [Manage connections in Azure Functions](manage-connections.md). 

### Language-specific considerations

For your language of choice, keep in mind the following considerations:

# [C#](#tab/csharp)

+ [Use async code but avoid blocking calls](performance-reliability.md#use-async-code-but-avoid-blocking-calls).

+ [Use cancellation tokens](functions-dotnet-class-library.md?#cancellation-tokens) (in-process only).

# [Java](#tab/java)

+ For applications that are a mix of CPU-bound and IO-bound operations, consider using [more worker processes](functions-app-settings.md#functions_worker_process_count).

# [JavaScript](#tab/javascript)

+ [Use `async` and `await`](functions-reference-node.md#use-async-and-await).

+ [Use multiple worker processes for CPU bound applications](functions-reference-node.md?tabs=v2#scaling-and-concurrency).

# [PowerShell](#tab/powershell)

+ [Review the concurrency considerations](functions-reference-powershell.md#concurrency).

# [Python](#tab/python)

+ [Improve throughput performance of Python apps in Azure Functions](python-scale-performance-reference.md)

---

## Maximize availability

Cold start is a key consideration for serverless architectures. To learn more, see [Cold starts](event-driven-scaling.md#cold-start). If cold start is a concern for your scenario, you can find a deeper dive in the post [Understanding serverless cold start](https://azure.microsoft.com/blog/understanding-serverless-cold-start/) . 

Premium plan is the recommended plan for reducing colds starts while maintaining dynamic scale. You can use the following guidance to reduce cold starts and improve availability in all three hosting plans. 

| Plan | Guidance |
| --- | --- | 
| **Premium plan** | • [Implement a Warmup trigger in your function app](functions-bindings-warmup.md)<br/>• [Set the values for Always-Ready instances and Max Burst limit](functions-premium-plan.md#plan-and-sku-settings)<br/>• [Use virtual network trigger support when using non-HTTP triggers on a virtual network](functions-networking-options.md#premium-plan-with-virtual-network-triggers)|
| **Dedicated plans** | • [Run on at least two instances with Azure App Service Health Check enabled](../app-service/monitor-instances-health-check.md)<br/>• [Implement autoscaling](/azure/architecture/best-practices/auto-scaling)|
| **Consumption plan** | • Review your use of Singleton patterns and the concurrency settings for bindings and triggers to avoid artificially placing limits on how your function app scales.<br/>• [Review the `functionAppScaleLimit` setting, which can limit scale-out](event-driven-scaling.md#limit-scale-out)<br/>• Check for a Daily Usage Quota (GB-Sec) limit set during development and testing. Consider removing this limit in production environments. |

## Monitor effectively

Azure Functions offers built-in integration with Azure Application Insights to monitor your function execution and traces written from your code. To learn more, see [Monitor Azure Functions](functions-monitoring.md). Azure Monitor also provides facilities for monitoring the health of the function app itself. To learn more, see [Monitoring with Azure Monitor](monitor-functions.md).

You should be aware of the following considerations when using Application Insights integration to monitor your functions:

+ Make sure that the [AzureWebJobsDashboard](functions-app-settings.md#azurewebjobsdashboard) application setting is removed. This setting was supported in older version of Functions. If it exists, removing `AzureWebJobsDashboard` improves performance of your functions. 

+  Review the [Application Insights logs](analyze-telemetry-data.md). If data you expect to find is missing, consider adjusting the sampling settings to better capture your monitoring scenario. You can use the `excludedTypes` setting to exclude certain types from sampling, such as `Request` or `Exception`. To learn more, see [Configure sampling](configure-monitoring.md?tabs=v2#configure-sampling).

Azure Functions also allows you to [send system-generated and user-generated logs to Azure Monitor Logs](functions-monitor-log-analytics.md). Integration with Azure Monitor Logs is currently in preview. 

## Build in redundancy

Your business needs might require that your functions always be available, even during a data center outage. To learn how to use a multi-regional approach to keep your critical functions always running, see [Azure Functions geo-disaster recovery and high-availability](functions-geo-disaster-recovery.md).

## Next steps

[Manage your function app](functions-how-to-use-azure-function-app-settings.md)
