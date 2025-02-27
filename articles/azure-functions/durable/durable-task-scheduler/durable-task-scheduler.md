---
title: Durable Task Scheduler storage provider for Durable Functions (preview)
description: Learn about the characteristics of the Durable Functions Durable Task Scheduler storage provider.
ms.topic: conceptual
ms.date: 02/27/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable
---

# Durable Task Scheduler storage provider for Durable Functions (preview)

The Durable Task Scheduler (DTS) is a backend for Durable Functions. DTS is built from scratch and provides several key benefits not available in the "bring your own (BYO)" backend options today. This document discusses different aspects of DTS including architecture, key features, and pricing.

For an in-depth comparision between the supported storage providers for Durable Functions, see the [Durable Functions storage providers](../durable-functions-storage-providers.md) documentation.

> [!NOTE]
> DTS currently only supports Durable Functions running on **Functions Premium** and **App Service** plans. 

## Architecture 

The Durable Task Scheduler (DTS) is designed from the ground up to be the fastest and most efficient backend for Durable Functions. DTS has its own dedicated compute and memory resources optimized for:
- Dispatching orchestrator and activity work items
- Storing history at scale with minimal latency

[TODO - a brief discussion of DTS architecture and why it's fast]

## Supported regions

DTS is currently supported in the following regions.
- Australia East
- North Europe
- Sweden Central
- UK South
- North Central US
- West US 2

You can create up to five schedulers per region per subscription. To increase this limit, [submit a request in the Durable Task Scheduler repository]()[TODO]. 

## Feature highlight

The following features are available at the current stage of public preview. More features are under development. See [the DTS roadmap and how to request new features]()[TODO]. 

### Managed by Azure 

Unlike [other BYO backend options](../durable-functions-storage-providers.md), DTS is fully managed by Azure. This reduces management burdens, such as cleaning up the completed orchestration history or handling failover in the case of disaster recovery. Managing the storage is now a task of Azure, so you can focus on business logic. 

From a support perspective, since Azure has direct access to the orchestration data and storage resource, it's much easier to debug and resolve problems for customers using DTS. 

### Durable Task Scheduler dashboard

When a DTS resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations instances and allows you to quickly filter by different criteria. You can easily gather data about an orchestration instance, such as status, duration, input/output, etc. You can also drill into an instance to get data about sub-orchestrations and activities. 

Aside from monitoring purposes, you can also perform ad hoc management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance (provided you have the permission to do so). 

See [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md) for more details about the dashboard. 

### Supports the highest throughput

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

The concept of a task hub in DTS is similar to that of other backend providers like Azure Storage. An application's states are durably persisted in a task hub. One DTS resource instance allows for the creation of multiple task hubs, each of which can be used by a different application. This allows for multiple applications to share one DTS instance through different task hubs.

Since all task hubs in a DTS resource share the same storage and compute resources, adding more applications will limit the resources that each one gets. In this case, more resources for the DTS instance can be added by purchasing extra capacity units. See [pricing](#pricing).

### Other features

- **DTS emulator**: DTS offers an [emulator for local development](./quickstart-durable-task-scheduler.md#set-up-dts-emulator) through a Docker image. 
- **Managed identity support**: DTS and DTS dashboard support [identity-based authentication](./quickstart-durable-task-scheduler.md).

## Pricing 

### Dedicated SKU

You're billed based on the number of "Capacity Units (CUs)" purchased. In the Durable Task Scheduler context:

- **A Capacity Unit (CU)** is a measure of the resources allocated to your Durable Task Scheduler. Each CU represents a preallocated amount of CPU, memory, and storage resources. A single CU guarantees the dispatch of a number of *work items* and provides a defined amount of storage. If extra performance and/or storage is needed, more CUs can be purchased.
- **Work item** is a message dispatched by the Durable Task Scheduler to an application, triggering the execution of orchestrator, activity, or entity functions. The number of work items that can be dispatched per second is determined by the CUs allocated to the Durable Task Scheduler.

The following table explains the minimum cost and features provided with each CU.

| Number of CUs | Features |
| ------------- | -------- |
| One CU        | - Single tenant with dedicated resources​</br>- Up to 2,000 work items dispatched per second​</br>- 50 GB of orchestration data storage​</br>- Dashboard for monitoring and managing orchestrations​</br>- Authentication and role-based access control with Managed Identity |

### Determining the number of Capacity Units needed

To determine how many Capacity Units (CUs) you require, follow these steps:

1. **Understand how to identify the number of work items per orchestration**
   - Starting an orchestration consumes a single work item.
   - Each schedule of an activity run consumes another work item.
   - Each response sent back to the Durable Task Scheduler consumes another work item.
     
1. **Estimate monthly orchestrations**  
    Calculate the total number of orchestrations you need to run per month. 

1. **Calculate total work items per second**  
    Multiply the number of orchestrations by the number of work items each orchestration consumes.

1. **Convert to work items per second**  
    Divide the total work items per month by the number of seconds in a month (approximately 2,628,000 seconds).

1. **Determine required CUs**  
    If one CU allows for up to 2,000 work items per second, divide the required work items per second by the capacity of one CU to determine the number of CUs needed.

For example, if you run 100 million orchestrations per month and each orchestration consumes seven work items, you need 700 million work items per month. Dividing this by 2,628,000 results in approximately 266 work items per second. If one CU supports 2,000 work items per second, you need one CU to handle this workload.

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).