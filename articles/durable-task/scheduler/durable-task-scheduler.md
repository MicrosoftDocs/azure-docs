---
author: hhunter-ms
ms.author: hannahhunter
title: Durable Task Scheduler
titleSuffix: Durable Task
description: "Discover how the Durable Task Scheduler provides durable execution in Azure with fault-tolerant orchestrations, automatic retries, and state persistence. Get started today."
ms.topic: concept-article
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 05/04/2026
---

# Durable Task Scheduler

The Durable Task Scheduler provides durable execution in Azure. Durable execution is a fault-tolerant approach to running code that handles failures and interruptions through automatic retries and state persistence. Durable execution helps with scenarios such as:
- Distributed transactions
- Multi-agent orchestration
- Data processing
- Infrastructure management

Durable Task Scheduler is the recommended storage provider for [Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md) and [the Durable Task SDKs](../sdks/durable-task-overview.md). 

## Supported SKUs

For Durable Functions, you can use the Durable Task Scheduler with [any of the Functions SKUs](../../azure-functions/functions-scale.md). 

For the Durable Task SDKs, you can use Durable Task Scheduler with any compute.

The scheduler itself offers two billing SKUs:
- The [Dedicated SKU](./durable-task-scheduler-billing.md#dedicated-sku-pricing-and-capacity)
- The [Consumption SKU](./durable-task-scheduler-billing.md#consumption-sku)

## Supported regions

Durable Task Scheduler is available in most Azure regions. Run the following command to get the current list of available regions:

```bash
az provider show --namespace Microsoft.DurableTask --query "resourceTypes[?resourceType=='schedulers'].locations | [0]" --out table
```

Consider using the same region for your Durable Functions app and the Durable Task Scheduler resources to optimize performance and certain network-related functionality.

## Orchestration frameworks

Durable Task Scheduler works with both [Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md) and [the Durable Task SDKs](../sdks/durable-task-overview.md). [Choose which framework works best for your project.](../common/choose-orchestration-framework.md)

## Architecture

For all Durable Task Scheduler orchestration frameworks, you can create scheduler instances of type [Microsoft.DurableTask/scheduler](/azure/templates/microsoft.durabletask/schedulers) using Azure Resource Manager. Each *scheduler* resource internally has its own dedicated compute and memory resources optimized for:

- Dispatching orchestrator, activity, and entity work items
- Storing and querying history at scale with minimal latency
- Providing a rich monitoring experience through [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)

Unlike [the BYO storage providers](../common/durable-task-storage-providers.md), the Durable Task Scheduler provider is a purpose-built backend-as-a-service optimized for the specific needs of the [Durable Task Framework](https://github.com/Azure/durabletask).

The following diagram shows the architecture of the Durable Task Scheduler backend and its interaction with connected apps.

:::image type="content" source="media/durable-task-scheduler/architecture.png" alt-text="Screenshot of the Durable Task Scheduler architecture showing the backend service connecting to apps via gRPC.":::

### Operational separation

The Durable Task Scheduler runs in Azure as a separate resource from your app. This isolation is important for several reasons:

- **Reduced resource consumption**  
    Offloading state management to a managed scheduler reduces CPU and memory consumption in your app compared to using a BYO storage provider. 

- **Fault isolation**  
    Separating the scheduler from the app reduces the risk of cascading failures and improves overall reliability in your connected apps. 

- **Independent scaling**  
    The scheduler resource can be scaled independently of the app for better infrastructure resource management and cost optimization. For example, multiple apps can share the same scheduler resource, which is helpful for organizations with multiple teams or projects.

- **Improved support experience**  
    The Durable Task Scheduler is a managed service, providing streamlined support and diagnostics for issues regarding the underlying infrastructure.

### App connectivity

Your apps connect to the scheduler resource via a gRPC connection, secured using TLS and authenticated by the app's identity. The endpoint address is in a format similar to `{scheduler-name}.{region}.durabletask.io`. For example, `myscheduler-123.westus2.durabletask.io`. 

For scenarios that require private connectivity, you can use [private endpoints](./durable-task-scheduler-private-endpoints.md) to route traffic to the scheduler over a private link within your virtual network instead of the public internet.

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

State is durably persisted in a *task hub*. A [task hub](../common/durable-task-hubs.md):
- Is a logical container for orchestration and entity instances.
- Provides a way to partition the state store. 

With one scheduler instance, you can create multiple task hubs that can be used by different apps. Each task hub gets its own [monitoring dashboard](./durable-task-scheduler-dashboard.md). To access a task hub, [the caller's identity *must* have the required role-based access control (RBAC) permissions](./durable-task-scheduler-identity.md). 

Creating multiple task hubs isolates different workloads that can be managed independently. For example, you can:
- Create a task hub for each environment (dev, test, prod).
- Create task hubs for different teams within your organization. 
- Share the same scheduler instance across multiple apps. 

Scheduler sharing is a great way to optimize cost when multiple teams have scenarios requiring orchestrations.

> [!NOTE]
> Although you can create multiple task hubs in one scheduler instance, they share the same resources. If one task hub is heavily loaded, it can affect the performance of other task hubs on the same scheduler.

### Emulator for local development

The Durable Task Scheduler emulator is a lightweight version of the scheduler backend that runs locally in a Docker container. With it, you can:
- Develop and test your app without deploying to Azure.
- Monitor and manage your orchestrations and entities just like you would in Azure.

For setup instructions, see [Run the Durable Task Scheduler emulator](./develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator).

> [!NOTE]
> The emulator internally stores orchestration and entity state in local memory, so it isn't suitable for production use.

### Autopurge retention policies

Stale orchestration data should be purged periodically to ensure efficient storage usage. The autopurge feature for Durable Task Scheduler provides a streamlined, configurable solution to manage orchestration instance clean-up automatically. [Learn more about setting autopurge retention policies for Durable Task Scheduler.](./durable-task-scheduler-auto-purge.md)

## Limitations and considerations

- **Scheduler quota:** 

    You're limited in how many schedulers you can create depending on your billing SKU.
     - [When using the Dedicated SKU,](./durable-task-scheduler-billing.md#dedicated-sku-pricing-and-capacity) schedulers are limited to **25** per region per subscription. 
     - [When using the Consumption SKU,](./durable-task-scheduler-billing.md#consumption-sku) schedulers are limited to **10** per region per subscription. 

- **Task hub quota:**

    You're limited in how many task hubs you can use depending on your billing SKU. 

     - [When using the Dedicated SKU,](./durable-task-scheduler-billing.md#dedicated-sku-pricing-and-capacity) task hubs are limited to **25** per region per subscription. 
     - [When using the Consumption SKU,](./durable-task-scheduler-billing.md#consumption-sku) task hubs are limited to **five** per region per subscription. 

    For more quota, [contact support](https://github.com/Azure/azure-functions-durable-extension/issues).

- **Max payload size:** 

    The Durable Task Scheduler has a maximum payload size restriction for the following JSON-serialized data types:
  
    | Data type | Max size |
    | --------- | -------- |
    | Orchestrator inputs and outputs | 1 MB |
    | Activity inputs and outputs | 1 MB |
    | External event data | 1 MB |
    | Orchestration custom status | 1 MB |
    | Entity state | 1 MB |

    If your data exceeds these limits, see [Large payload support](./durable-task-scheduler-large-payloads.md) for available workarounds.

- **Orchestration instance ID length:**
  
  Orchestration instance IDs are limited to a maximum length of 100 characters.

  * Allowed characters: Printable ASCII only (letters, numbers, symbols like -, _, ., etc. Characters 0x20 through 0x7E)
  * Minimum length: 1 character (cannot be empty)
  * Instance IDs starting with @ are reserved for entities

- **Feature parity:** 

    [Extended sessions](../../azure-functions/durable-functions/durable-functions-azure-storage-provider.md#extended-sessions) aren't supported by Durable Task Scheduler.

## Related content

- [Develop with Durable Task Scheduler](./develop-with-durable-task-scheduler.md)
- [Quickstart: Configure a Durable Functions app to use Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Quickstart: Create an app with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)
- [Durable Task Scheduler billing](./durable-task-scheduler-billing.md)
- [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)
- [Configure identity-based access](./durable-task-scheduler-identity.md)