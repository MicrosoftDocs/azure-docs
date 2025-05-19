---
title: Azure Functions Durable Task Scheduler (preview)
description: Learn about the characteristics of the Azure Functions Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/28/2025
---

# Azure Functions Durable Task Scheduler (preview)

The Durable Task Scheduler provides durable execution in Azure. Durable execution is a fault-tolerant approach to running code that handles failures and interruptions through automatic retries and state persistence. Durable execution helps with scenarios such as:
- Distributed transactions
- Multi-agent orchestration
- Data processing
- Infrastructure management, and others. 

## Orchestration frameworks

Azure provides two developer-oriented orchestration frameworks you can use to build stateful apps that run on any compute environment, without the need to architect for fault tolerance. You can use the Durable Task Scheduler with the following orchestration frameworks:

- Durable Functions
- Durable Task SDKs

[Learn which orchestration works better for your project.](./choose-orchestration-framework.md)

## Architecture

For all Durable Task Scheduler orchestration frameworks, you can create scheduler instances of type [Microsoft.DurableTask/scheduler](/azure/templates/microsoft.durabletask/schedulers) using Azure Resource Manager. Each *scheduler* resource internally has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)

Unlike [the BYO storage providers](../durable-functions-storage-providers.md), the Durable Task Scheduler provider is a purpose-built backend-as-a-service optimized for the specific needs of the [Durable Task Framework](https://github.com/Azure/durabletask).

The following diagram shows the architecture of the Durable Task Scheduler backend and its interaction with connected apps.

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Diagram of the Durable Task Scheduler architecture.":::

### Operational separation

The Durable Task Scheduler runs in Azure as a separate resource from your app. This isolation is important for several reasons:

- **Reduced resource consumption**  
    Using a managed scheduler like Durable Task Scheduler (instead of a BYO storage provider) reduces CPU and memory resource consumption caused by the overhead of managing partitions and other complex state store interactions. 

- **Fault isolation**  
    Separating the scheduler from the app reduces the risk of cascading failures and improves overall reliability in your connected apps. 

- **Independent scaling**  
    The scheduler resource can be scaled independently of the app for better infrastructure resource management and cost optimization. For example, multiple apps can share the same scheduler resource, which is helpful for organizations with multiple teams or projects.

- **Improved support experience**  
    The Durable Task Scheduler is a managed service, providing streamlined support and diagnostics for issues regarding the underlying infrastructure.

### App connectivity

Your apps connect to the scheduler resource via a gRPC connection, secured using TLS and authenticated by the app's identity. The endpoint address is in a format similar to `{scheduler-name}.{region}.durabletask.io`. For example, `myscheduler-123.westus2.durabletask.io`. 

Work items are streamed from the scheduler to the app using a push model, improving end-to-end latency and removing the need for polling. Your apps can process multiple work items in parallel and send responses back to the scheduler when the corresponding orchestration, activity, or entity task is complete.

### State management

The Durable Task Scheduler manages the state of orchestrations and entities internally, without a separate storage account for state management. The internal state store is highly optimized for use with Durable Functions and the Durable Task SDKs, resulting in better durability and reliability and reduced latency.

The scheduler uses a combination of in-memory and persistent internal storage to manage state. 
- The in-memory store is used for short-lived state.
- The persistent store is used for recovery and for multi-instance query operations. 

## Feature highlights

When you implement one of the Durable Task Scheduler orchestration frameworks, you benefit from several key highlights.

### Durable Task Scheduler dashboard

When a scheduler resource is created, a corresponding dashboard is provided out-of-the-box. The dashboard provides an overview of all orchestrations and entity instances and allows you to:
- Quickly filter by different criteria. 
- Gather data about an orchestration instance, such as status, duration, input/output, etc. 
- Drill into an instance to get data about sub-orchestrations and activities.
- Perform management operations, such as pausing, terminating, or restarting an orchestration instance. 

Access to the dashboard is secured by [identity and role-based access controls](./durable-task-scheduler-identity.md). 

For more information, see [Debug and manage orchestrations using the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).

### Multiple task hubs

State is durably persisted in a *task hub*. A [task hub](../durable-functions-task-hubs.md):
- Is a logical container for orchestration and entity instances.
- Provides a way to partition the state store. 

With one scheduler instance, you can create multiple task hubs that can be used by different apps. Each task hub gets its own [monitoring dashboard](./durable-task-scheduler-dashboard.md). To access a task hub, [the caller's identity *must* have the required role-based access control (RBAC) permissions](./durable-task-scheduler-identity.md). 

Creating multiple task hubs isolates different workloads that can be managed independently. For example, you can:
- Create a task hub for each environment (dev, test, prod).
- Create task hubs for different teams within your organization. 
- Share the same scheduler instance across multiple apps. 

Scheduler sharing is a great way to optimize cost when multiple teams have scenarios requiring orchestrations. Although you can create unlimited task hubs in one scheduler instance, they share the same resources; if one task hub is heavily loaded, it might affect the performance of the other task hubs.

### Emulator for local development

The [Durable Task Scheduler emulator](./quickstart-durable-task-scheduler.md#set-up-the-durable-task-emulator) is a lightweight version of the scheduler backend that runs locally in a Docker container. With it, you can:
- Develop and test your Durable Function app without needing to deploy it to Azure. 
- Monitor and manage your orchestrations and entities just like you would in Azure.

By default, the emulator exposes a single task hub named `default`. To expose multiple task hubs, start the emulator and specify the `DTS_TASK_HUB_NAMES` environment variable with a comma-separated list of task hub names. For example, to enable two task hubs named `taskhub1` and `taskhub2`, you can run the following command:

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

Stale orchestration data should be purged periodically to ensure efficient storage usage. The autopurge feature for Durable Task Scheduler provides a streamlined, configurable solution to manage orchestration instance clean-up automatically. [Learn more about setting autopurge retention policies for Durable Task Scheduler.](./durable-task-scheduler-auto-purge.md)

## Limitations and considerations

- **Available regions:** 

    Durable Task Scheduler resources can be created in a subset of Azure regions today. You can run the following command to get a list of the supported regions:  

    ```bash
    az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table
    ```

    Consider using the same region for your Durable Functions app and the Durable Task Scheduler resources to optimize performance and certain network-related functionality.

- **Scheduler quota:** 

    You can currently create up to **five schedulers per region** per subscription.

- **Max payload size:** 

    The Durable Task Scheduler has a maximum payload size restriction for the following JSON-serialized data types:
  
    | Data type | Max size |
    | --------- | -------- |
    | Orchestrator inputs and outputs | 1 MB |
    | Activity inputs and outputs | 1 MB |
    | External event data | 1 MB |
    | Orchestration custom status | 1 MB |
    | Entity state | 1 MB |

- **Feature parity:** 

    Some features might not be available in the Durable Task Scheduler backend yet, such as:

    - [Orchestration rewind](../durable-functions-instance-management.md#rewind-instances-preview)
    - [Extended sessions](../durable-functions-azure-storage-provider.md#extended-sessions)

    > [!NOTE]
    > Feature availability is subject to change as the Durable Task Scheduler backend approaches general availability. To report problems or request new features, submit an issue in the [Durable Task Scheduler GitHub repository](https://github.com/azure/Durable-Task-Scheduler).

## Next steps

> [!div class="nextstepaction"]
> [Choose your orchestration framework](./choose-orchestration-framework.md)