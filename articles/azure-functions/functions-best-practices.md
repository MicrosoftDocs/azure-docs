---
title: Azure Functions best practices 
description: Learn how to best improve the performance and reliability of running your functions in Azure.
ms.assetid: 9058fb2f-8a93-4036-a921-97a0772f503c
ms.topic: conceptual
ms.date: 08/25/2021

---
# Best practices for reliable Azure Functions

Azure Functions is an event driven, compute-on-demand experience that extends the existing Azure application platform with capabilities to implement code triggered by events occurring in Azure or third-party service as well as on-premises systems. Azure Functions allows developers to build solutions by connecting to data sources or messaging solutions thus making it easy to process and react to events. Azure Functions runs on the Azure data centers. Modern-day data centers are extremely complex and have many moving parts. VMs can restart or move, systems are upgraded. These events are to be expected in a cloud environment. In addition, your Azure Functions app may depend on external API's, Azure Services, and other databases. 

This document outlines nine recommendations that you can follow to ensure that your Azure Function App remains healthy and that any events in the data center will have negligible effects on your application availability and performance.

## Choose the correct hosting plan 

When you create a function app in Azure, you must choose a hosting plan for your app. There are three basic hosting plans available for Functions: 

+ [Consumption plan](consumption-plan.md)
+ [Premium plan](functions-premium-plan.md)
+ [Dedicated (App Service) plan](dedicated-plan.md).

All hosting plans are generally available (GA) when running either Linux or Windows.

Be aware that the Premium plan used to dynamically host your functions is the Elastic Premium plan (EP). There are other Dedicated (App Service) plans called Premium. To learn more, see the [Premium plan](functions-premium-plan.md) article.

The hosting plan you choose determines the following behaviors:

+   How your function app is scaled in relation to demand and how instances allocation is managed.
+   The resources available to each function app instance.
+   Support for advanced functionality, such as Azure Virtual Network connectivity.

To learn more about choosing the correct hosting plan and for a detailed comparison between the plans, see [Azure Functions hosting options](functions-scale.md).

It's important that you choose the correct plan when you create your function app. Functions provides a limited ability to switch your hosting plan, primarily between Consumption and Elastic Premium plans. To learn more, see [Plan migration](functions-how-to-use-azure-function-app-settings.md?tabs=portal#plan-migration). 

## Configure storage correctly

Functions requires a storage account be associated with your function app. The storage account connection is used by the Functions host for operations such as managing triggers and logging function executions. It's also used when dynamically scaling function apps. To learn more, see [Storage considerations for Azure Functions](storage-considerations.md).

A misconfigured file system or storage account in your function app can affect the performance and availability of your functions. For help troubleshooting an incorrectly configured storage account, see the [storage troubleshooting](functions-recover-storage-account.md) article. 

Function apps that scale dynamically can run either from an Azure Files endpoint in your storage account or from the file servers associated with your scaled-out instances. This behavior is controlled by the following application settings:

+ [WEBSITE_CONTENTAZUREFILECONNECTIONSTRING](functions-app-settings.md#website_contentazurefileconnectionstring)
+ [WEBSITE_CONTENTSHARE](functions-app-settings.md#website_contentshare)

These settings are only supported when you are running in a Premium plan or in a Consumption plan on Windows.

When you create your function app either in the Azure portal or by using Azure CLI or Azure PowerShell, these settings are created for your function app as needed. When you create your resources from an Azure Resource Manager template (ARM template), you need to also include these settings in the template. When deploying to a specific slot, don't include `WEBSITE_CONTENTSHARE`.  

You can use the following ARM templates to help configure the file server settings correctly:

+ [Consumption plan](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/)
+ [Dedicated plan](https://azure.microsoft.com/resources/templates/function-app-create-dedicated/)
+ [Premium plan with VNET integration](https://azure.microsoft.com/resources/templates/function-premium-vnet-integration/)
+ [Consumption plan with a deployment slot](https://azure.microsoft.com/resources/templates/function-app-create-dynamic-slot/)

When running on Linux, you can add additional storage by mounting a file share. To learn more, see [Mount file shares](storage-considerations.md#mount-file-shares).

## Organize your functions 

As part of your solution, you may develop and publish multiple functions. These functions are often combined into a single function
app, but they can also run-in separate function apps. In Premium and dedicated (App Service) hosting plans, multiple function apps can also share the same resources by running in the same plan. How you group your functions and function apps can impact the performance, scaling, configuration, deployment, and security of your overall solution. 

For more information on how to organize your functions, see [Organizing your Azure Functions applications](functions-best-practices.md#organizing-your-azure-functions-applications).

## Configuring the underlying Storage Account

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. This is because Functions relies on Azure Storage for operations such as managing triggers and logging function executions.  There are several considerations to consider when creating this storage account. 

-   The Storage account should be in the same region as the function app.

-   In production use a separate Storage account for each function app, especially for one of the following scenarios:

    -   Durable Functions

    -   Event Hub triggered Functions.

        -   For Event Hub Triggered Functions please do not use a Storage Account with Data Lake Storage enabled.
            (<https://github.com/Azure/azure-functions-eventhubs-extension/issues/81>)

## How best to configure deployment settings

When deploying a function app, you may want to consider this fundamental principle.

"The unit of deployment for functions in Azure is the function app. All functions in a function app are deployed at the same time".

To help with this there are a few approaches that will help.

-   Deploy your Azure Function Application using the Run From Package approach (<https://docs.microsoft.com/en-us/azure/azure-functions/run-functions-from-deployment-package>     ) to avail of these benefits 
-   Reduces the risk of file copy locking issues. 
-   Can be deployed to a production app (with restart). 
-   You can be certain of the files that are running in your app. 
-   Improves the performance of Azure Resource Manager deployments. 
-   May reduce cold-start times, particularly for JavaScript functions with large npm package trees.
-   Consider using Continuous deployment for Azure Functions (<https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment>) which supports Run From Package Deployment.
-   For the Azure Functions Premium Plan consider adding a warmup trigger to help when new instances are added. <https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-warmup?tabs=csharp>

## Write robust functions

There are a number of design principles when coding your Azure Function that will help with general performance and availability of your Azure Function app.\ \ These are covered in detail at <https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices> and will be summarized in the bullet points below. 
-   Avoid long running functions. 
-   Plan cross function communication. 
-   Write Functions to be stateless. 
-   Write defensive functions.

In addition, we would always recommend that customers consider implementing the retry pattern from Cloud Design patterns. 
[Retry pattern - Cloud Design Patterns \| Microsoft
Docs](https://docs.microsoft.com/en-us/azure/architecture/patterns/retry)

## Manage concurrency

The host.json file in the function app allows for configuration of host runtime and trigger behaviors. In addition to batching behaviors, you can manage concurrency for several triggers. Often adjusting the values in these options can help each instance scale appropriately for the demands of the invoked functions.\ \ 

You can also manage your outbound connections to ensure you make the most of the resources available to each worker instance hosting your Azure Function app.

[Manage connections in Azure Functions \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/azure-functions/manage-connections) 

For each of the supported language types for Azure Functions there are several best practices that we can recommend. 

# [C#](#tab/csharp)

+ Use Async Code but avoid blocking calls.         (<https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices#use-async-code-but-avoid-blocking-calls>)
+ Use Cancellation Tokens [Develop C# class library functions using Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library?tabs=v2%2Ccmd#cancellation-tokens)

# [Java](#tab/java)

For applications that are a mix of CPU-bound and IO-bound consider using additional worker processes.  q (<https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings#functions_worker_process_count>)

# [JavaScript](#tab/javascript)

+ Use Async and Await(<https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#use-async-and-await>)

+ Consider using multiple worker processes for CPU bound applications (<https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#scaling-and-concurrency>)

# [PowerShell](#tab/powershell)

Review the Concurrency considerations at <functions-reference-powershell.md#concurrency>

Note: If you are setting the FUNCTIONS_WORKER_PROCESS_COUNT then please consider the number of cores on either the dedicated or Elastic Premium plans. E.G For EP2 you would have two cores so starting with a value of 2 would be recommended.

# [Python](#tab/python)

Implement the recommendations at <https://docs.microsoft.com/en-us/azure/azure-functions/python-scale-performance-reference>

---


## Recommendations for Availability

Cold start is an Important discussion point for Serverless architectures and there is some great guidance on this already at [Understanding serverless cold start \| Azure blog and updates \| Microsoft Azure](https://azure.microsoft.com/en-gb/blog/understanding-serverless-cold-start/) . If cold start is a concern for you then please read this document.

For the each of the hosting plans there are a couple of recommendations to help with ensuring that your application remains available and running invocations. 

1.  Elastic Premium

    a.  Implement the Warmup Trigger as discussed at         <https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-warmup?tabs=csharp>

    b.  Set the values for Always-Ready instances and Max Burst limit as         discussed at         <https://docs.microsoft.com/en-us/azure/azure-functions/functions-premium-plan?tabs=portal#plan-and-sku-settings>

    c.  If using VIrtual Networks and non-HTTP Triggers you will enable         the Virtual Network Triggers support to ensure that the event         sources are monitored.         <https://docs.microsoft.com/en-us/azure/azure-functions/functions-networking-options#premium-plan-with-virtual-network-triggers>

2.  Dedicated Plans

    a.  Consider enabling the Azure App Service Health Check and running         on at least two instances.         <https://docs.microsoft.com/en-us/azure/app-service/monitor-instances-health-check>

    b.  Review the Guidance for Auto-Scaling on your resources
        <https://docs.microsoft.com/en-us/azure/architecture/best-practices/auto-scaling>

3.  Consumption Plan

    a.  Review your use of Singleton patterns and the concurrency         settings for bindings and triggers to avoid artificially placing         limits on how your Function can scale.

    b.  The use of the functionAppScaleLimit setting should also be         reviewed as it will limit how many instances you can scale to. 
    c.  Check if the Daily Usage Quota (GB-Sec) limit has been set         during development, testing, and consider removing this for         production.

## Recommendations for Azure Functions Monitoring

Azure Functions offers built-in integration with Azure Application Insights to monitor functions. 
Microsoft recommends that you use this integration to help monitor your Azure Functions performance. 
If you do use the Application Insights integration there are a few items
to consider.

-   Ensure that the AzureWebJobsDashboard application setting is
    removed. This will offer better performance.

    -   <https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings#azurewebjobsdashboard>

-   Review the Application Insights logs. If you appear to be missing
    data, you might need to adjust the sampling settings to fit your
    monitoring scenario.

    -   <https://docs.microsoft.com/en-us/azure/azure-functions/configure-monitoring?tabs=v2#configure-sampling>

    -   Note that you can use excludedTypes to exclude certain types
        like Request or Exception from sampling.

Azure Functions also allows you to send system-generated and user-generated logs to Azure Monitor Logs.

This setting is currently in preview and you can follow these steps to set this up.

[Monitoring Azure Functions with Azure Monitor Logs](functions-monitor-log-analytics.md?tabs=csharp)

## Enable geo-disaster recovery

Your business needs may require that your functions be available at all times, even during a data center outage. To learn how to use a multi-regional approach to keep your critical functions running at all times, see [Azure Functions geo-disaster recovery and high-availability](functions-geo-disaster-recovery.md).

## Next steps

