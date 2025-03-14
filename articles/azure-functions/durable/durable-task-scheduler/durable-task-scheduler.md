---
title: Azure Functions durable task scheduler backend for durable functions (preview)
description: Learn about the characteristics of the Azure Functions durable task scheduler backend.
ms.topic: conceptual
ms.date: 03/05/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable
---

# Azure Functions durable task scheduler backend for durable functions (preview)

The Azure Functions durable task scheduler is a fully managed backend for durable function apps. It's built from scratch and provides several key benefits not available in the "bring your own (BYO)" backend options today. This document discusses different aspects of the managed backend including architecture, concepts, and key features.

For an in-depth comparison between the supported storage providers for durable function apps, see the [storage providers](../durable-functions-storage-providers.md) documentation.

## Architecture

The durable task scheduler is designed from the ground up to be the fastest and most efficient backend for durable functions. The scheduler resource has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through the durable task scheduler dashboard

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the durable task scheduler architecture.":::

Unlike other generic storage providers, durable task scheduler is a purpose-built backend-as-a-service optimized for the specific needs of the Durable Task Framework. Durable task scheduler does the heavy lifting of work item dispatching, partition management, and other tasks typically handled internally by the BYO backends running in the app process (like the Azure Functions host). As a result, durable apps using durable task scheduler run with less overhead.

## Feature highlight

> [!NOTE]
> The following features are available at the current stage of public preview with more under way. To report problems or request new features, submit an issue in the [durable task scheduler repository](https://aka.ms/dts-preview). 

### Managed by Azure 

Unlike other [existing storage providers](../durable-functions-storage-providers.md) for durable functions, the durable task scheduler offers dedicated resources that are fully managed by Azure. You no longer need to bring your own storage account for storing orchestration and entity state, as it is built in.

Since Azure has direct access to your app's backend, it also becomes easier to diagnose and resolve problems related to durable task scheduler so users can expect a better support experience. 

### Durable task scheduler dashboard

When a scheduler resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations instances and allows you to quickly filter by different criteria. You can easily gather data about an orchestration instance, such as status, duration, input/output, etc. You can also drill into an instance to get data about sub-orchestrations and activities. The dashboard displays data related to Durable Entities as well. 

Aside from monitoring purposes, you can also perform ad hoc management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance. See [Debug and manage orchestrations using the durable task scheduler dashboard](./durable-task-scheduler-dashboard.md) for more details. 

[Access to the dashboard](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard) is secured by identity and role-based access. 

### Supports the highest throughput

The durable task scheduler was benchmarked against other storage providers, including the Azure Storage, MSSQL, and Netherite providers. The results show the durable task scheduler provides better throughput than the other options.

The following table shows the results of a series of benchmarks ran to compare the relative throughput of the durable task scheduler provider vs. the default Azure Storage provider. The Azure Storage provider was chosen as the comparison because it's by far the most commonly used backend option for durable function apps.

:::image type="content" source="media/durable-task-scheduler/performance.png" alt-text="Bar chart comparing throughput of durable task scheduler vs Azure Storage providers.":::

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

Durable function state is durably persisted in a *task hub*. A [task hub](../durable-functions-task-hubs.md) is a logical container for orchestration and entity instances and provides a way to partition the state store. One scheduler instance allows for the creation of multiple task hubs, each of which can be used by different apps. Access to a task hub requires that the caller's identity has the required RBAC (role-based access control) permissions.

Creating multiple task hubs allows you to isolate different workloads and manage them independently. For example, you can create a task hub for each environment (dev, test, prod) or for different teams within your organization. Creating multiple task hubs in a single scheduler instance is also a way to reduce costs, as you can share the same scheduler resources across multiple task hubs. However, task hubs under the same scheduler instance share the same resources, so if one task hub is heavily loaded, it may affect the performance of the other task hubs.

### Emulator for local development

The [durable task scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-dts-emulator) is a lightweight version of the scheduler backend that runs locally in a Docker container. It allows you to develop and test your durable function app without needing to deploy it to Azure. The emulator provides a local version of the management dashboard, so you can monitor and manage your orchestrations and entities just like you would in Azure.

Without any additional configuration, the emulator exposes a task hub named `default`. You can enable additional task hubs by specifying the `DTS_TASK_HUB_NAMES` environment variable with a comma-separated list of task hub names when starting the emulator. For example, to enable two task hubs named `taskhub1` and `taskhub2`, you can run the following command:

```bash
docker run -d -p 8080:8080 -e DTS_TASK_HUB_NAMES=taskhub1,taskhub2 mcr.microsoft.com/dts/dts-emulator:latest
```

> [!NOTE]
> The emulator internally stores orchestration and entity state in local memory, so it isn't suitable for production use.

## Considerations  

- **Scaling**: If your durable functions app is not reaching the maximum throughout of the durable task scheduler, consider *scaling out* your app to more instances as the bottleneck might lie in the number of workers available to run orchestrations. If scaling out also doesn't achieve the throughput you need, then consider *scaling up* your compute resources. In the future, you'll also be able to scale out the resources allocated to a durable task scheduler by purchasing more [capacity units](./dts-dedicated-sku.md#dedicated-sku-concepts). 
- **Supported hosting plans**: The durable task scheduler currently only supports durable functions running on *Functions Premium* and *App Service* plans. For apps running on the Functions Premium plan, [enable the *Runtime Scale Monitoring* setting](./develop-with-durable-task-scheduler.md#auto-scaling-in-functions-premium-plan) to get auto scaling of the app.
- **Available regions**: Durable task scheduler is only available in certain Azure regions today. Run this command to get the latest supported regions:  

    `az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table`. 
    
    Consider picking the same region for your durable functions app and the durable task scheduler as having these resources in different regions may impact performance and limit certain network-related functionality.
- **Scheduler quota**: You can create up to **five schedulers per region** per subscription today. 

## Next steps

Try out the [durable functions quickstart sample](quickstart-durable-task-scheduler.md).