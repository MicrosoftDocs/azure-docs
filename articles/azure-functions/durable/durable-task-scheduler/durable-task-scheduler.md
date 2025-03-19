---
title: Azure Functions durable task scheduler backend for durable functions (preview)
description: Learn about the characteristics of the Azure Functions durable task scheduler backend.
ms.topic: conceptual
ms.date: 03/19/2025
ms.author: azfuncdf
author: hhunter-ms
ms.subservice: durable
---

# Azure Functions durable task scheduler backend for durable functions (preview)

The Azure Functions durable task scheduler is a fully managed backend for durable function apps. It provides several key benefits not available in the "bring your own (BYO)" backend options for durable functions today. This document discusses different aspects of the managed backend including architecture, concepts, and key features.

For an in-depth comparison between the supported storage providers for durable function apps, see the [storage providers](../durable-functions-storage-providers.md) documentation.

## Architecture

Instances of the durable task scheduler can be created using Azure Resource Manager and are of type [Microsoft.DurableTask/scheduler](/azure/templates/microsoft.durabletask/schedulers). Each *scheduler* resource internally has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through the durable task scheduler dashboard.

Unlike the BYO storage providers, the durable task scheduler provider is a purpose-built backend-as-a-service optimized for the specific needs of the Durable Task Framework.

The following diagram shows the architecture of the durable task scheduler backend and its interaction with connected apps.

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the durable task scheduler architecture.":::

### Separation of concerns

The durable task scheduler runs in Azure as a separate resource from the app. This separation allows the scheduler to scale independently of the app and provides better isolation between the two components. This isolation is important for several reasons:

- **Reduced resource consumption:** BYO storage providers can consume a significant amount of CPU and memory resources. This resource consumption is due to the overhead of managing partitions and other complex state store interactions. Using a managed scheduler instead of a BYO storage provider allows your app instances to run more efficiently and with less resource contention.

- **Fault isolation:** Stability or availability issues in the durable task scheduler won't affect the stability or availability of your connected apps. With BYO storage providers, instability in the backend provider (which is a complex component) can create instability in the app logic. By separating the scheduler from the app, you can reduce the risk of cascading failures and improve overall reliability.

- **Independent scaling:** The scheduler resource can be scaled independently of the app, allowing for better infrastructure resource management and cost optimization. For example, multiple apps can share the same scheduler resource, improving overall resource utilization. This capability is especially useful for organizations with multiple teams or projects that require durable functions.

- **Improved support experience:** The durable task scheduler is a managed service, which means that Azure can provide better support and diagnostics for issues related to the scheduler. When using a BYO storage provider, you might need to troubleshoot issues related to the backend provider, which can be complex and time-consuming. A managed service allows Azure to take care of the underlying infrastructure and provide a more streamlined support experience.

### App connectivity

Your durable function apps connect to the scheduler resource via a gRPC connection. The endpoint address is in the form `{scheduler-name}.{region}.durabletask.io`. For example, `myscheduler-123.westus2.durabletask.io`. The connection is secured using TLS and the app's identity is used to authenticate the connection.

Work items are streamed from the scheduler to the app using a push model, removing the need for polling and improving end-to-end latency. Your apps can process multiple work items in parallel and send responses back to the scheduler when the corresponding orchestration, activity, or entity task is complete.

### State management

The scheduler manages the state of orchestrations and entities internally. It doesn't require you to provide a separate storage account for state management. The internal state store is highly optimized for use with durable functions, allowing for better performance and reduced latency compared to BYO storage providers.

The scheduler internally uses a combination of in-memory and persistent storage to manage state. The in-memory store is used for short-lived state, while the persistent store is used for recovery and for multi-instance query operations. This bespoke design, heavily inspired by the [Netherite storage architecture](https://www.vldb.org/pvldb/vol15/p1591-burckhardt.pdf), allows the scheduler to provide low-latency access to state while still ensuring durability and reliability.

## Feature highlights

### Durable task scheduler dashboard

When a scheduler resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations and entity instances and allows you to quickly filter by different criteria. You can easily gather data about an orchestration instance, such as status, duration, input/output, etc. You can also drill into an instance to get data about sub-orchestrations and activities.

Aside from monitoring, you can also perform management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance. For more information about the dashboard, see [Debug and manage orchestrations using the durable task scheduler dashboard](./durable-task-scheduler-dashboard.md).

[Access to the dashboard](./develop-with-durable-task-scheduler.md#accessing-durable-task-scheduler-dashboard) is secured by identity and role-based access controls. 

### Multiple task hubs

Durable function state is durably persisted in a *task hub*. A [task hub](../durable-functions-task-hubs.md) is a logical container for orchestration and entity instances and provides a way to partition the state store. One scheduler instance allows for the creation of multiple task hubs, each of which can be used by different apps. Access to a task hub requires that the caller's identity has the required role-based access control (RBAC) permissions.

Creating multiple task hubs allows you to isolate different workloads and manage them independently. For example, you can create a task hub for each environment (dev, test, prod) or for different teams within your organization. Creating multiple task hubs in a single scheduler instance is also a way to reduce costs, as you can share the same scheduler resources across multiple task hubs. However, task hubs under the same scheduler instance share the same resources, so if one task hub is heavily loaded, it might affect the performance of the other task hubs.

### Emulator for local development

The [durable task scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-durable-task-scheduler-emulator) is a lightweight version of the scheduler backend that runs locally in a Docker container. It allows you to develop and test your durable function app without needing to deploy it to Azure. The emulator provides a local version of the management dashboard, so you can monitor and manage your orchestrations and entities just like you would in Azure.

By default, the emulator exposes a single task hub named `default`. You can expose multiple task hubs by specifying the `DTS_TASK_HUB_NAMES` environment variable with a comma-separated list of task hub names when starting the emulator. For example, to enable two task hubs named `taskhub1` and `taskhub2`, you can run the following command:

```bash
docker run -d -p 8080:8080 -e DTS_TASK_HUB_NAMES=taskhub1,taskhub2 mcr.microsoft.com/dts/dts-emulator:latest
```

> [!NOTE]
> The emulator internally stores orchestration and entity state in local memory, so it isn't suitable for production use.

## Work item throughput

The durable task scheduler was benchmarked against other storage providers, including the Azure Storage, MSSQL, and Netherite providers. The results show the durable task scheduler provides better work item throughput than the other options, which translates into more orchestrator, entity, and activity tasks being processed in a given time period.

The following table shows the results of a series of benchmarks ran to compare the relative throughput of the durable task scheduler provider vs. the default Azure Storage provider. The Azure Storage provider was chosen as the comparison because it's currently the default and most commonly used backend option for durable function apps.

:::image type="content" source="media/durable-task-scheduler/performance.png" alt-text="Bar chart comparing throughput of durable task scheduler vs Azure Storage providers.":::

> [!NOTE]
> The results shown in the chart are for an early preview version of the durable task scheduler feature, configured with the lowest available scale settings. The results are expected to improve as the backend provider matures and gets closer to general availability.

To test the relative throughput of the backend providers, these benchmarks were run using a standard orchestrator function that calls five activity functions, one for each city, in a sequence. Each activity simply returns a "Hello, {cityName}!" string value and doesn't do any other work.

The intent of the benchmark is to measure the overhead of each backend without doing anything too complicated. This type of sequential orchestration was chosen due to its commonality in function apps that include durable functions.

### Test details

The test consists of the following criteria:  

- The function app used for this test runs on **one to four Elastic Premium EP2 instances**. 
- The orchestration code was written in C# using the **.NET Isolated worker model on NET 8**. 
- The same app was used for all storage providers, and the only change was the backend storage provider configuration.
- The test is triggered using an HTTP trigger which starts **5,000 orchestrations concurrently**. 

After the test completes, the throughput is calculated by dividing the total number of completed orchestrations by the total execution time. The test was run multiple times for each storage provider configuration to ensure the results were consistent.

This benchmark showed that the durable task scheduler is roughly **five times faster** than the Azure Storage provider. Your results might vary depending on:

- The complexity of your orchestrations and activities
- The number of orchestrations running concurrently
- The size of the data payloads being passed between orchestrations and activities
- Other factors such as the virtual machine size. 

> [!NOTE]
> These results are meant to provide a rough comparison of the relative performance of the storage provider backends at the time the test was run. These results shouldn't be taken as definitive.

## Limitations and considerations

- **Supported hosting plans**: The durable task scheduler currently only supports durable functions running on *Functions Premium* and *App Service* plans. For apps running on the Functions Premium plan, you must [enable the *Runtime Scale Monitoring* setting](./develop-with-durable-task-scheduler.md#auto-scaling-in-functions-premium-plan) to get auto scaling of the app.

  The *Consumption*, *Flex Consumption*, and *Azure Container App* hosting plans aren't yet supported when using the durable task scheduler.

- **Available regions:** Durable task scheduler resources can be created in a subset of Azure regions today. You can run the following command to get a list of the supported regions:  

    ```bash
    az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table
    ```

    Consider using the same region for your durable functions app and the durable task scheduler resources. Having these resources in different regions might impact performance and limit certain network-related functionality.

- **Scheduler quota:** You can currently create up to **five schedulers per region** per subscription.

- **Max payload size:** The durable task scheduler has a maximum payload size restriction for the following JSON-serialized data types:
  
    | Data type | Max size |
    | --------- | -------- |
    | Orchestrator inputs and outputs | 1 MB |
    | Activity inputs and outputs | 1 MB |
    | External event data | 1 MB |
    | Orchestration custom status | 1 MB |
    | Entity state | 1 MB |

- **Feature parity:** Some features might not be available in the durable task scheduler backend yet. For example, at the time of writing, the durable task scheduler doesn't support the following features:

    - [Orchestration rewind](../durable-functions-instance-management.md#rewind-instances-preview)
    - [Extended sessions](../durable-functions-azure-storage-provider.md#extended-sessions)
    - [Management operations using the Azure Functions Core Tools](../durable-functions-instance-management.md#azure-functions-core-tools)

    > [!NOTE]
    > Feature availability is subject to change as the durable task scheduler backend approaches general availability. To report problems or request new features, submit an issue in the [durable task scheduler samples GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler/).

## Next steps

Try out the [durable functions quickstart sample](quickstart-durable-task-scheduler.md).