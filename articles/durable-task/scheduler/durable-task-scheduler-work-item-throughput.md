---
author: hhunter-ms
ms.author: hannahhunter
title: "Durable Task Scheduler Action Throughput Benchmarks"
titleSuffix: Durable Task
description: "Explore Durable Task Scheduler action throughput benchmarks compared to Azure Storage, MSSQL, and Netherite providers. See how it delivers up to 5x faster performance for your orchestrations."
ms.topic: concept-article
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 05/04/2026
---

# Durable Task Scheduler action throughput benchmarks

In internal benchmarks, Durable Task Scheduler processed work items roughly **five times faster** than the Azure Storage provider — the most commonly used backend for Durable Functions apps.

An *action* is any discrete operation processed by the scheduler, such as starting an orchestration, scheduling an activity, or handling a timer. For the full definition and billing details, see [What is an action?](./durable-task-scheduler-billing.md#what-is-an-action)

## Benchmark results

The Durable Task Scheduler was benchmarked against other storage providers, including the Azure Storage, MSSQL, and Netherite providers. The results show the Durable Task Scheduler provides better action throughput than the other options, which translates into more orchestrator, entity, and activity tasks being processed in a given time period.

The following chart shows work items processed per second for the Durable Task Scheduler vs. the Azure Storage provider across different worker counts. The Azure Storage provider was chosen as the comparison because it's the default and most commonly used backend for Durable Functions apps.

:::image type="content" source="media/durable-task-scheduler/performance.png" alt-text="Bar chart comparing work items per second between Durable Task Scheduler and Azure Storage provider across 1, 2, and 4 EP2 workers. Durable Task Scheduler reaches approximately 1,400, 2,750, and 3,750 work items per second respectively.":::

The following table summarizes the numeric throughput values from the benchmark:

| Configuration | Azure Storage (work items/sec) | Durable Task Scheduler (work items/sec) | Speedup |
| --- | --- | --- | --- |
| EP2, 1 worker | ~250 | ~1,400 | ~5.6x |
| EP2, 2 workers | ~430 | ~2,750 | ~6.4x |
| EP2, 4 workers | ~830 | ~3,750 | ~4.5x |

> [!NOTE]
> These results are from an internal benchmark and are meant to provide a rough comparison of relative performance. Your results will vary depending on workload characteristics.

## Benchmark methodology

To test the relative throughput of the backend providers, these benchmarks were run using a standard orchestrator function that calls five activity functions, one for each city, in a sequence. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work.

The intent of the benchmark is to measure the overhead of each backend without doing anything too complicated. This type of sequential orchestration was chosen due to its commonality in function apps that include Durable Functions.

## Test details

The test consists of the following criteria:  

- The function app used for this test runs on **one to four Elastic Premium EP2 instances**. 
- The orchestration code was written in C# using the **.NET Isolated worker model on .NET 8**. 
- The same app was used for all storage providers, and the only change was the backend storage provider configuration.
- The test is triggered using an HTTP trigger which starts **5,000 orchestrations concurrently**. 

After the test completes, the throughput is calculated by dividing the total number of completed orchestrations by the total execution time. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

## Factors that affect your results

Your results might vary depending on:

- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- The virtual machine size and SKU
- Network latency between your compute and the scheduler

> [!NOTE]
> These benchmarks were run internally by Microsoft and aren't available as a standalone test harness. They're intended to give you a general sense of relative performance when choosing a storage backend.

## Next steps

- [What is Durable Task Scheduler?](./durable-task-scheduler.md)
- [Understand billing and actions](./durable-task-scheduler-billing.md)
- [Create an app with the Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)
