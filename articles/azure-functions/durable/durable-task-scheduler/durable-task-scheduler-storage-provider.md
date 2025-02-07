---
title: Durable Task Scheduler storage provider for Durable Functions (preview)
description: Learn about the characteristics of the Durable Functions Durable Task Scheduler storage provider.
ms.topic: conceptual
ms.date: 02/05/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable
---

# Durable Task Scheduler storage provider for Durable Functions (preview)

Todo

> [!NOTE]
> For more information on the supported storage providers for Durable Functions and how they compare, see the [Durable Functions storage providers](../durable-functions-storage-providers.md) documentation.

## Pricing model

The Durable Task Scheduler is a managed backend for Durable Functions, providing high performance, reliability, and an easy monitoring experience for stateful orchestration. The Durable Task Scheduler operates as a single tenant with dedicated resources measured as Capacity Units (CUs) and providing up to 2,000 work items dispatched per second. In this context:

- **A Capacity Unit (CU)** is a measure of the resources allocated to your Durable Task Scheduler. Each CU represents a preallocated amount of CPU, memory, and storage resources. A single CU guarantees the dispatch of a number of work items and provides a defined amount of storage. If extra performance and storage are needed, more CUs can be purchased.

- **Work item** is a message dispatched by the Durable Task Scheduler to a customer's application, triggering the execution of orchestrator, activity, or entity functions. The number of work items that can be dispatched per second is determined by the CUs allocated to the Durable Task Scheduler.

| Number of CUs | Price per CU | Features |
| ------------- | ------------ | -------- |
| One CU        | $500/month   | - Single tenant with dedicated resources​</br>- Up to 2,000 work items dispatched per second​</br>- 50 GB of orchestration data storage​</br>- Dashboard for monitoring and managing orchestrations​</br>- Authentication and role-based access control with Managed Identity |

The following table outlines the supported regions and their current rates for Durable Task Scheduler.

| Availability region | Regional uplift | Current rate per month |
| ------------------- | --------------- | ---------------------- |
| AU East             | 45%             | $725                   |
| EU North            | 20%             | $600                   |
| SE Central          | 30%             | $650                   |
| UK South            | 25%             | $625                   |
| US North Central    | 20%             | $600                   |
| US West 2           | 0%              | $500                   |

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

## Performance

The Durable Task Scheduler (DTS) is designed from the ground up to be the fastest and most efficient backend for [Azure Durable Functions](../durable-functions-overview.md) and the [Durable Task Framework](https://github.com/Azure/durabletask). Unlike the other existing "bring your own storage" (BYOS) providers, like [Netherite](../durable-functions-storage-providers.md#netherite) and [MSSQL](../durable-functions-storage-providers.md#mssql), Durable Task Scheduler has its own dedicated compute and memory resources, optimized for:
- Dispatching orchestrator and activity work items
- Storing history at scale with minimal latency.

### How...


### Throughput benchmarks

To test the relative throughput of the Durable Task Scheduler, a series of benchmarks were run using a standard orchestration function that calls five activity functions, one for each city, in a list. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work. 

The intent is to measure the overhead of each storage provider backend without doing anything too complicated. This type of orchestration was chosen due to its commonality in Azure today. 

#### Test details

The test consists of the following specifics. 

- The function app used for this test runs on **a single P2v3 App Service VM instance with 16 GB of memory and four cores**. 
- A Consumption plan was intentionally avoided in order to keep the machine resources constant across all tests. 
- The orchestration code was written in C# using the **.NET Isolated worker model on NET 8**. 
- The same app was used for all storage providers, and the only change was the storage provider configuration.
- The test is triggered using an HTTP trigger which starts **1,000 orchestrations concurrently**. 

Once the test is triggered, the throughput is calculated by dividing the total number of orchestrations completed by the total time taken to complete them. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

The following table shows the results of the throughput benchmarks for each storage provider backend:

| Storage provider | Throughput (orchestrations/sec) |
|------------------|---------------------------------|
| Azure Storage | 26.8 |
| Azure SQL (MSSQL, 4 vCPUs) | 40.5 |
| Netherite | 151.3 |
| DTS | **196.9** |

For this particular test, the results show that Durable Task Scheduler is **30% faster** than the next fastest storage provider backend, Netherite, and **7.3x faster** than the default Azure Storage provider. Your mileage may vary depending on:
- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- Other factors such as the VM size. 

These results are meant to provide a rough comparison of the relative performance of each storage provider backend, but should not be taken as definitive.

## Next steps
