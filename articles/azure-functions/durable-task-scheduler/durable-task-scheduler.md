---
title: Azure Functions Durable Task Scheduler (preview)
description: Learn about the characteristics of the Azure Functions Durable Task Scheduler backend.
ms.topic: conceptual
ms.date: 04/11/2025
---

# Azure Functions Durable Task Scheduler (preview)

The Durable Task Scheduler provides durable execution in Azure. Durable execution is a fault-tolerant approach to running code that handles failures and interruptions through automatic retries and state persistence. Scenarios where durable execution is required:
- Distributed transactions
- Multi-agent orchestration
- Data processing
- Infrastructure management, and others. 

The Durable Task Scheduler, coupled with a developer orchestration framework like [Durable Functions](../durable/durable-functions-overview.md) or the [Durable Task SDKs][todo], enables you to author stateful apps that run on any compute environment without the need to architect for fault tolerance.

## Orchestration frameworks

You can use the Durable Task Scheduler with the following orchestration frameworks:

- Durable Functions
- Durable Task SDKs, or "portable SDKs"
- Durable Task Framework

[Learn which orchestration works better for your project.](./durable-task-scheduler-framework.md)

## Architecture

For all Durable Task Scheduler orchestration frameworks, you can create instances of the Durable Task Scheduler of type [Microsoft.DurableTask/scheduler](/azure/templates/microsoft.durabletask/schedulers) using Azure Resource Manager. Each *scheduler* resource internally has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)

Unlike [the BYO storage providers](../durable/durable-functions-storage-providers.md), the Durable Task Scheduler provider is a purpose-built backend-as-a-service optimized for the specific needs of the [Durable Task Framework](https://github.com/Azure/durabletask).

The following diagram shows the architecture of the Durable Task Scheduler backend and its interaction with connected apps.

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the Durable Task Scheduler architecture.":::

### Operational separation

The Durable Task Scheduler runs in Azure as a separate resource from your app. This isolation is important for several reasons:

- **Reduced resource consumption**  
    Using a managed scheduler like Durable Task Scheduler reduces CPU and memory resource consumption caused by the overhead of managing partitions and other complex state store interactions. Using a managed scheduler (instead of a BYO storage provider, for example) allows your app instances to run more efficiently with less resource contention.

- **Fault isolation**  
    When Durable Task Scheduler experiences stability or availability issues, it won't affect the stability or availability of your connected apps. By separating the scheduler from the app, you can reduce the risk of cascading failures and improve overall reliability.

- **Independent scaling**  
    The scheduler resource can be scaled independently of the app, allowing for better infrastructure resource management and cost optimization. For example, multiple apps can share the same scheduler resource, improving overall resource utilization. This capability is especially useful for organizations with multiple teams or projects.

- **Improved support experience**  
    The Durable Task Scheduler is a managed service, providing a more streamlined support and diagnostics for issues regarding the underlying infrastructure.

### App connectivity

Your apps connect to the scheduler resource via a gRPC connection, secured using TLS and authenticated by the app's identity. The endpoint address is in a format similar to `{scheduler-name}.{region}.durabletask.io`. For example, `myscheduler-123.westus2.durabletask.io`. 

Work items are streamed from the scheduler to the app using a push model, improving end-to-end latency and removing the need for polling. Your apps can process multiple work items in parallel and send responses back to the scheduler when the corresponding orchestration, activity, or entity task is complete.

### State management

The Durable Task Scheduler manages the state of orchestrations and entities internally, without a separate storage account for state management. The internal state store is highly optimized for use with Durable Functions and the portable SDKs, resulting in better durability and reliability and reduced latency.

The scheduler uses a combination of in-memory and persistent internal storage to manage state. 
- The in-memory store is used for short-lived state.
- The persistent store is used for recovery and for multi-instance query operations. 

## Feature highlights

When you implement any of the Durable Task Scheduler orchestration frameworks, you benefit from several key highlights.

### Durable task scheduler dashboard

When a scheduler resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations and entity instances and allows you to:
- Quickly filter by different criteria. 
- Gather data about an orchestration instance, such as status, duration, input/output, etc. 
- Drill into an instance to get data about sub-orchestrations and activities.

Aside from monitoring, you can also perform management operations on the dashboard, such as pausing, terminating, or restarting an orchestration instance. For more information about the dashboard, see [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).

Access to the dashboard is secured by identity and role-based access controls. 

### Multiple task hubs

State is durably persisted in a *task hub*. A [task hub](../durable/durable-functions-task-hubs.md) is a logical container for orchestration and entity instances and provides a way to partition the state store. With one scheduler instance, you can create multiple task hubs that can be used by different apps. To access a task hub, the caller's identity *must* have the required role-based access control (RBAC) permissions.

Creating multiple task hubs isolates different workloads that can be managed independently. For example, you can create a task hub for each environment (dev, test, prod) or for different teams within your organization. 

Create these task hubs in a single scheduler instance as a way to reduce costs by sharing the same scheduler resources across multiple task hubs. Be aware that task hubs under the same scheduler instance share the same resources, so if one task hub is heavily loaded, it might affect the performance of the other task hubs.

### Emulator for local development

The [Durable Task Scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-durable-task-scheduler-emulator) is a lightweight version of the scheduler backend that runs locally in a Docker container. With it, you can:
- Develop and test your Durable Function app without needing to deploy it to Azure. 
- Monitor and manage your orchestrations and entities just like you would in Azure.

By default, the emulator exposes a single task hub named `default`. To expose multiple task hubs, specify the `DTS_TASK_HUB_NAMES` environment variable with a comma-separated list of task hub names when starting the emulator. For example, to enable two task hubs named `taskhub1` and `taskhub2`, you can run the following command:

```bash
docker run -d -p 8080:8080 -e DTS_TASK_HUB_NAMES=taskhub1,taskhub2 mcr.microsoft.com/dts/dts-emulator:latest
```

> [!NOTE]
> The emulator internally stores orchestration and entity state in local memory, so it isn't suitable for production use.

You can see all of the emulator versions available by running the following command:

```bash
curl -s https://mcr.microsoft.com/v2/dts/dts-emulator/tags/list
```

### Autopurge retention policies

Large volumes of completed orchestration instance data can lead to storage bloat, incur higher storage costs, and degrade performance. The autopurge feature for Durable Task Scheduler provides a streamlined, configurable solution to manage orchestration instance clean-up automatically. [Learn more about setting autopurge retention policies for Azure Functions Durable Task Scheduler.](./durable-task-scheduler-auto-purge.md)

## Limitations and considerations

- **Available regions:** Durable task scheduler resources can be created in a subset of Azure regions today. You can run the following command to get a list of the supported regions:  

    ```bash
    az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table
    ```

    Consider using the same region for your Durable Functions app and the Durable Task Scheduler resources. Having these resources in different regions might impact performance and limit certain network-related functionality.

- **Scheduler quota:** You can currently create up to **five schedulers per region** per subscription.

- **Max payload size:** The Durable Task Scheduler has a maximum payload size restriction for the following JSON-serialized data types:
  
    | Data type | Max size |
    | --------- | -------- |
    | Orchestrator inputs and outputs | 1 MB |
    | Activity inputs and outputs | 1 MB |
    | External event data | 1 MB |
    | Orchestration custom status | 1 MB |
    | Entity state | 1 MB |

- **Feature parity:** Some features might not be available in the Durable Task Scheduler backend yet. For example, at the time of writing, the Durable Task Scheduler doesn't support the following features:

    - [Orchestration rewind](../durable/durable-functions-instance-management.md#rewind-instances-preview)
    - [Extended sessions](../durable/durable-functions-azure-storage-provider.md#extended-sessions)
    - [Management operations using the Azure Functions Core Tools](../durable/durable-functions-instance-management.md#azure-functions-core-tools)

    > [!NOTE]
    > Feature availability is subject to change as the Durable Task Scheduler backend approaches general availability. To report problems or request new features, submit an issue in the [Durable Task Scheduler samples GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler/).

### Specific to Durable Task Scheduler for Durable Functions

- **Supported hosting plans**: The Durable Task Scheduler currently only supports Durable Functions running on *Functions Premium* and *App Service* plans. For apps running on the Functions Premium plan, you must [enable the *Runtime Scale Monitoring* setting](./develop-with-durable-task-scheduler.md#auto-scaling-in-functions-premium-plan) to get auto scaling of the app.

  The *Consumption*, *Flex Consumption*, and *Azure Container App* hosting plans aren't yet supported when using the Durable Task Scheduler.

## Next steps

> [!div class="nextstepaction"]
> [Choose your orchestration framework](./durable-task-scheduler-framework.md)