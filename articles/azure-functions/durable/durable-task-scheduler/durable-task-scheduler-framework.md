---
title: Azure Functions Durable Task Scheduler frameworks (preview)
description: Learn about the orchestration frameworks available to you in Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/11/2025
---

# Choose your Azure Functions Durable Task Scheduler framework (preview)

The Durable Task Scheduler supports three orchestration frameworks:

- [Durable Functions](#durable-task-scheduler-for-durable-functions)
- [Durable Task SDKs, or "portable" SDKs](#durable-task-sdks)
- [Durable Task Framework](#durable-task-framework) 

The following table provides some considerations when choosing a framework.

|Consideration | Durable Task SDKs | Durable Functions | Durable Task Framework|
|--------------| --------------| ------------------| --------------------- | 
|Hosting option| Azure Container Apps, Azure Kubernetes Service, Azure App Service, VMs | Azure Functions | Azure Container Apps, Azure Kubernetes Service, Azure App Service, VMs |
|Language support | [.NET](https://github.com/microsoft/durabletask-dotnet/), [Python](https://github.com/microsoft/durabletask-python), [Java (coming soon)](https://github.com/microsoft/durabletask-java), [JavaScript (coming soon)](https://github.com/microsoft/durabletask-js) | [.NET](https://github.com/Azure/azure-functions-durable-extension), [Python](https://github.com/Azure/azure-functions-durable-python), [Java](https://github.com/microsoft/durabletask-java), [JavaScript](https://github.com/Azure/azure-functions-durable-js), [PowerShell](https://github.com/Azure/azure-functions-powershell-worker/tree/dev/examples/durable) | [.NET](https://github.com/Azure/durabletask) |
|Official support| No | Yes | No |
|Durable task scheduler emulator| Available | Available |Available |
|Monitoring dashboard| Available | Available <sup>1</sup> | Available <sup>1</sup>|
|[Durable Entities](/azure/azure-functions/durable/durable-functions-entities)| Not supported | Supported | Not supported|
|Other supported feature(s)| Scheduler| <li>Azure Functions triggers and bindings</li> <li> Supports all backend providers </li> |Supports all backend providers|

*<sup>1</sup> The out-of-the-box monitoring dashboard is available only when using the Durable Task Scheduler as the backend provider.*

> [!NOTE]
> For all **new apps**, we recommend the [portable SDKs](#durable-task-sdks) over the [Durable Task Framework](#durable-task-framework), as the SDKs follow more modern .NET conventions.

## Durable Task Scheduler for Durable Functions

When used with Durable Functions, a feature of Azure Functions, the Durable Task Scheduler works as a fully managed backend provider, persisting state data as your app runs. While [other backend providers are supported](../durable-functions-storage-providers.md), the Durable Task Scheduler offers a fully managed experience, which removes operational overhead. The scheduler offers exceptional performance, reliability, and the ease of monitoring orchestrations.

The Durable Task Scheduler plays a similar role in the Durable Task Framework as in Durable Functions.

[Learn how to configure the Durable Task Scheduler for your Durable Function app.](./quickstart-durable-task-scheduler.md)

## Durable Task SDKs

The [Durable Task SDKs][todo] provide a lightweight client library for the Durable Task Scheduler. When running orchestrations, apps using these SDKs connect to the scheduler's orchestration engine in Azure. You can host apps leveraging these "portable" SDKs in various compute environments, such as:
- Azure Container Apps
- Azure Kubernetes Service
- Azure App Service
- Virtual machines

[Learn how to configure the Durable Task Scheduler using the portable SDKs.](./quickstart-portable-durable-task-sdks.md)

## Durable Task Framework

The [Durable Task Framework (DTFx)](https://github.com/Azure/durabletask) powers the serverless Durable Functions extension of Azure Functions. With the DTFx library, you can write long-running, persistent workflows (or *orchestrations*) in C# using simple async/await coding constructs. DTFx reliably orchestrates provisioning, monitoring, and management operations. The orchestrations scale out linearly by simply adding more worker machines. 

[Try out the DTFx library via its GitHub repo.](https://github.com/Azure/durabletask/tree/main/samples)

## Next steps

> [!div class="nextstepaction"]
> [Learn about the Dedicated SKU hosting plan](./durable-task-scheduler-dedicated-sku.md)