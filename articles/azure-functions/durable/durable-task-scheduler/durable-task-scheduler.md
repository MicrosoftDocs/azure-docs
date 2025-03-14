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

The durable task scheduler is a fully managed backend for Durable Functions. It is built from scratch and provides several key benefits not available in the "bring your own (BYO)" backend options today. This document discusses different aspects of DTS including architecture, concepts, and key features.

For an in-depth comparision between the supported storage providers for Durable Functions, see the [Durable Functions storage providers](../durable-functions-storage-providers.md) documentation.

## Architecture 

The Durable Task Scheduler (DTS) is designed from the ground up to be the fastest and most efficient backend for Durable Functions. DTS has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through the DTS dashboard

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the Durable Task Scheduler architecture.":::

Unlike other generic storage providers, DTS is a purpose-built backend-as-a-service optimized for the specific needs of the Durable Task Framework. DTS does the heavy lifting of work item dispatching, partition management, and other tasks typically handled internally by the BYO backends running in the app process (like the Azure Functions host). As a result, durable apps using DTS run with less overhead.

## Feature highlight

> [!NOTE]
> The following features are available at the current stage of public preview with more under way. To report problems or request new features, submit an issue in the [Durable Task Scheduler repository](https://aka.ms/dts-preview). 

### Managed by Azure 

Unlike other [existing storage providers]((../durable-functions-storage-providers.md)) for durable functions, the durable task scheduler offers dedicated resources that are fully managed by Azure. You no longer need to bring your own storage account for storing orchestration and entity state, as it is built in.

Since Azure has direct access to your app's backend, it also becomes easier to diagnose and resolve problems related to DTS so users can expect a better support experience. 

### Durable Task Scheduler dashboard

When a DTS resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations instances and allows you to quickly filter by different criteria. You can easily gather data about an orchestration instance, such as status, duration, input/output, etc. You can also drill into an instance to get data about sub-orchestrations and activities. The dashboard displays data related to Durable Entities as well. 

Aside from monitoring purposes, you can also perform ad hoc management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance. See [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md) for more details. 

[Access to the dashboard](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard) is secured by identity and role-based access. 

### Supports the highest throughput

The durable task scheduler was benchmarked against other storage providers, including the Azure Storage, MSSQL, and Netherite providers. The results show the durable task scheduler provides better throughput than the other options.

The following table shows the results of a series of benchmarks ran to compare the relative throughput of the durable task scheduler provider vs. the default Azure Storage provider. The Azure Storage provider was chosen as the comparison because it's by far the most commonly used backend option for durable function apps.

:::image type="content" source="media/durable-task-scheduler/performance.png" alt-text="Bar chart comparing throughput of DTS vs Azure Storage providers.":::

> [!NOTE]
> The results shown in the chart are for an early preview version of the durable task scheduler feature, configured with the lowest available scale settings. The results are expected to improve as the backend provider matures and gets closer to general availability.

To test the relative throughput of the backend providers, these benchmarks were run using a standard orchestrator function that calls five activity functions, one for each city, in a sequence. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work.

The intent of the benchmark is to measure the overhead of each backend without doing anything too complicated. This type of sequential orchestration was chosen due to its commonality in function apps that include durable functions.

#### Test details

The test consists of the following criteria:  

- The function app used for this test runs on **one to four Elastic Premium EP2 instances**. 
- The orchestration code was written in C# using the **.NET Isolated worker model on NET 8**. 
- The same app was used for all storage providers, and the only change was the backend storage provider configuration.
- The test is triggered using an HTTP trigger which starts **5,000 orchestrations concurrently**. 

After the test is triggered, the throughput is calculated by dividing the total number of orchestrations completed by the total time taken to complete them. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

This benchmark showed that the durable task scheduler is roughly **five times faster** than the Azure Storage provider. Your results might vary depending on:

- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- Other factors such as the virtual machine size. 

> [!NOTE]
> These results are meant to provide a rough comparison of the relative performance of the storage provider backends at the time the test was run. These results shouldn't be taken as definitive.

### Supports multiple task hubs

Durable Functions application states are durably persisted in a task hub. A task hub is a logical container for orchestrations and entities and provides a way to partition the state store. One DTS instance allows for the creation of multiple task hubs, each of which can be used by a different application. Just like the dashboard, access to a task hub require that an identity has the required RBAC (role-based access control) permission. This allows for multiple applications to securely share one DTS instance through different task hubs, thus reducing management overhead. 

### Other features

- **DTS emulator**: DTS offers an [emulator for local development](./quickstart-durable-task-scheduler.md#set-up-dts-emulator) through a Docker image. The DTS dashboard is also available when using the emulator. 

- **Durable Entities**: Users of Durable Entities can use DTS as the backend without any code changes just like orchestrations. Entities related data will surface on the dashboard as well. 

## Considerations  

- **Scaling**: If your durable functions app is not reaching the maximum throughout of the durable task scheduler, consider scaling out your app to more instances as the bottleneck might lie in the number of workers available to run orchestrations. If scaling out also doesn't achieve the throughput you need, then consider *scaling up* your compute resources. In the future, you'll also be able to scale out the resources allocated to a durable task scheduler by purchasing more [capacity units](./dts-dedicated-sku.md#dedicated-sku-concepts). 
- **Supported hosting plans**: DTS currently only supports Durable Functions running on *Functions Premium* and *App Service* plans. 
- **Available regions**: Durable task scheduler is only available in certain Azure regions today. Run this command to get the latest supported regions:  `az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table`.  
- **Scheduler quota**: You can create up to **five schedulers per region** per subscription today. 

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).