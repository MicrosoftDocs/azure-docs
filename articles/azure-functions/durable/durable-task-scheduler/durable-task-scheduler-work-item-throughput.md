---
title: Azure Functions Durable Task Scheduler work item throughput for Durable Functions (preview)
description: Learn about how the Azure Functions Durable Task Scheduler provides high work item throughput for use with Durable Functions.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Azure Functions Durable Task Scheduler work item throughput (preview)

The Durable Task Scheduler was benchmarked against other storage providers, including the Azure Storage, MSSQL, and Netherite providers. The results show the Durable Task Scheduler provides better work item throughput than the other options, which translates into more orchestrator, entity, and activity tasks being processed in a given time period.

The following table shows the results of a series of benchmarks ran to compare the relative throughput of the Durable Task Scheduler provider vs. the default Azure Storage provider. The Azure Storage provider was chosen as the comparison because it's currently the default and most commonly used backend option for Durable Function apps.

:::image type="content" source="media/durable-task-scheduler/performance.png" alt-text="Bar chart comparing throughput of Durable Task Scheduler vs Azure Storage providers.":::

> [!NOTE]
> The results shown in the chart are for an early preview version of the Durable Task Scheduler feature, configured with the lowest available scale settings. The results are expected to improve as the backend provider matures and gets closer to general availability.

To test the relative throughput of the backend providers, these benchmarks were run using a standard orchestrator function that calls five activity functions, one for each city, in a sequence. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work.

The intent of the benchmark is to measure the overhead of each backend without doing anything too complicated. This type of sequential orchestration was chosen due to its commonality in function apps that include Durable Functions.

### Test details

The test consists of the following criteria:  

- The function app used for this test runs on **one to four Elastic Premium EP2 instances**. 
- The orchestration code was written in C# using the **.NET Isolated worker model on NET 8**. 
- The same app was used for all storage providers, and the only change was the backend storage provider configuration.
- The test is triggered using an HTTP trigger which starts **5,000 orchestrations concurrently**. 

After the test completes, the throughput is calculated by dividing the total number of completed orchestrations by the total execution time. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

This benchmark showed that the Durable Task Scheduler is roughly **five times faster** than the Azure Storage provider. Your results might vary depending on:

- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- Other factors such as the virtual machine size. 

> [!NOTE]
> These results are meant to provide a rough comparison of the relative performance of the storage provider backends at the time the test was run. These results shouldn't be taken as definitive.
