---
title: Durable Task Scheduler backend for Durable Functions (preview)
description: Learn about the characteristics of the Durable Functions Durable Task Scheduler backend.
ms.topic: conceptual
ms.date: 03/05/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable
---

# Durable Task Scheduler backend for Durable Functions (preview)

The Durable Task Scheduler (DTS) is a backend for Durable Functions. DTS is built from scratch and provides several key benefits not available in the "bring your own (BYO)" backend options today. This document discusses different aspects of DTS including architecture, concepts, and key features.

For an in-depth comparision between the supported storage providers for Durable Functions, see the [Durable Functions storage providers](../durable-functions-storage-providers.md) documentation.

> [!NOTE]
> DTS currently only supports Durable Functions running on **Functions Premium** and **App Service** plans. 
>
> The following regions are supported today:
>   - Australia East
>   - North Europe
>   - Sweden Central
>   - UK South
>   - North Central US
>   - West US 2
>
> You can create up to **five schedulers per region** per subscription. 


## Architecture 

The Durable Task Scheduler (DTS) is designed from the ground up to be the fastest and most efficient backend for Durable Functions. DTS has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through the DTS dashboard

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the Durable Task Scheduler architecture.":::

Unlike other storage providers, DTS is not a generic storage system. Rather, it's a purpose-built backend-as-a-service that is optimized for the specific needs of the Durable Task Framework. This allows DTS to do the heavy lifting of work item dispatching, partition management, and other tasks that are typically handled internally by the "bring your own storage" backends running in the app process (e.g., the Azure Functions host). As a result, durable apps using DTS run with significantly less overhead.

## Feature highlight

> [!NOTE]
> The following features are available at the current stage of public preview with more under way. To report problems or request new features, submit an issue in the [Durable Task Scheduler repository](https://aka.ms/dts-preview). 

### Managed by Azure 

Unlike [other BYO backend options](../durable-functions-storage-providers.md), DTS is fully managed by Azure. This reduces management burdens, such as cleaning up completed orchestration history data, handling failover in the case of disaster recovery, etc. Managing the state store is now a task of Azure, so you can focus on business logic. 

Since Azure has direct access to your app's backend, it also becomes easier to diagnose and resolve problems related to DTS so users can expect a better support experience. 

### Durable Task Scheduler dashboard

When a DTS resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations instances and allows you to quickly filter by different criteria. You can easily gather data about an orchestration instance, such as status, duration, input/output, etc. You can also drill into an instance to get data about sub-orchestrations and activities. The dashboard displays data related to Durable Entities as well. 

Aside from monitoring purposes, you can also perform ad hoc management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance. See [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md) for more details. 

[Access to the dashboard](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard) is secured by identity and role-based access. 

### Supports the highest throughput

[TODO - @cgillum  and @sebastianburckhardt to provide more updated data, if available.]

The following table shows the results of a series of benchmarks ran to compare the relative throughput of each storage backend provider supported by Durable Functions:

| Backend provider | Throughput (orchestrations/sec) |
|------------------|---------------------------------|
| Azure Storage | 26.8 |
| Azure SQL (MSSQL, 4 vCPUs) | 40.5 |
| Netherite | 151.3 |
| DTS | **196.9** |

To test the relative throughput of the backend providers, a series of benchmarks were run using a standard orchestration function that calls five activity functions, one for each city, in a list. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work. 

The intent is to measure the overhead of each backend without doing anything too complicated. This type of orchestration was chosen due to its commonality amongst Durable Functions users. 

#### Test details

The test consists of the following:  

- The function app used for this test runs on **a single P2v3 App Service VM instance with 16 GB of memory and four cores**. 
- A Consumption plan was intentionally avoided in order to keep the machine resources constant across all tests. 
- The orchestration code was written in C# using the **.NET Isolated worker model on NET 8**. 
- The same app was used for all storage providers, and the only change was the storage provider configuration.
- The test is triggered using an HTTP trigger which starts **1,000 orchestrations concurrently**. 

Once the test is triggered, the throughput is calculated by dividing the total number of orchestrations completed by the total time taken to complete them. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

For this particular test, the results show that Durable Task Scheduler is **30% faster** than the next fastest storage provider backend, Netherite, and **7.3x faster** than the default Azure Storage provider. Your mileage may vary depending on:
- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- Other factors such as the VM size. 

> [!NOTE]
> These results are meant to provide a rough comparison of the relative performance of each storage provider backend, but should not be taken as definitive.

### Supports multiple task hubs

A Durable Functions application states are durably persisted in a task hub. One DTS instance allows for the creation of multiple task hubs, each of which can be used by a different application. Just like the dashboard, access to task hubs requires identity-based authentication. This allows for multiple applications to securely share one DTS instance through different task hubs, thus reducing management overhead. 

### Other features

- **DTS emulator**: DTS offers an [emulator for local development](./quickstart-durable-task-scheduler.md#set-up-dts-emulator) through a Docker image. The DTS dashboard is also available when using the emulator. 

- **Durable Entities**: Users of Durable Entities can use DTS as the backend without any code changes just like orchestrations. Entities related data will surface on the dashboard as well. 

## DTS Concepts 
[TODO @cgillum @torosent - example: scaling, task hub]


## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).