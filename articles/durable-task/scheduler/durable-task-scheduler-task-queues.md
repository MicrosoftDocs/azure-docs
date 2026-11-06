---
ai-usage: ai-assisted
author: hhunter-ms
ms.author: hannahhunter
title: Use task queues in Durable Task Scheduler (preview)
titleSuffix: Durable Task
description: Learn how to create task queues, configure work-item throughput, and route orchestrations and activities with SDK tags in Durable Task Scheduler.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 10/27/2026
---

# Use task queues in Durable Task Scheduler (preview)

Task queues group orchestration and activity work within a [task hub](../common/durable-task-hubs.md) and you can control the rate at which the scheduler delivers that work to workers. Use task queues to pace a workload, such as a batch-processing workflow that calls a rate-limited downstream service, without creating a separate task hub.

To use a task queue, first create a queue resource under your task hub. Then set the `DTS_TaskQueue` tag when you schedule an orchestration or activity. The tag selects an existing queue; it doesn't create one.

> [!NOTE]
> Task queues require management API version `2026-07-01-preview` or later. The examples in this article use `2026-07-01-preview`. For the resource schema, see the [task queue ARM and Bicep reference](/azure/templates/microsoft.durabletask/2026-07-01-preview/schedulers/taskhubs/taskqueues).

## How task queues work

A task queue belongs to one task hub. Its optional `properties.throughput.actionsPerSecond` setting controls the sustained rate of **work-item handouts**: deliveries of work items from the scheduler to workers.

- Orchestration and activity work items in the same queue share the configured rate.
- Each orchestration turn delivered to a worker counts as one handout. An orchestration can require multiple turns before it completes.
- Each activity work item delivered to a worker counts as one handout. Redeliveries also count.
- Activities and sub-orchestrations inherit their parent's queue selection unless you explicitly override it with their own `DTS_TaskQueue` tag.
- Entity work items don't use task queues.

For example, `actionsPerSecond: 20` configures a sustained rate of 20 handouts per second, shared by orchestration and activity work in that queue. It doesn't mean 20 completed orchestrations, activity completions, or downstream API requests per second. Short bursts can exceed the sustained rate, and actual throughput can be lower because of work distribution, worker capacity, or scheduler capacity.

If you omit throughput when creating a queue, the queue has no queue-specific rate limit. Scheduler and worker capacity limits still apply. Task queues don't reserve compute, provide physical isolation, or set a priority between named queues. For strict downstream request limits, also apply rate limiting where your activity calls the downstream service.

## Prerequisites

- An Azure subscription with an existing [scheduler and task hub](./develop-with-durable-task-scheduler.md). For scheduler locations, see [supported regions](./durable-task-scheduler.md#supported-regions).
- Permission to manage task queue resources under the task hub, such as the [Contributor role](/azure/role-based-access-control/built-in-roles/privileged#contributor) inherited from the scheduler or resource group. Data-plane roles alone don't grant resource-management permissions.
- [Azure CLI](/cli/azure/install-azure-cli) for the `az rest` examples, or an authenticated Azure Resource Manager REST client. The CLI examples use Bash syntax and don't require a dedicated task queue CLI extension.
- An application configured to use Durable Task Scheduler, with [identity-based access](./durable-task-scheduler-identity.md) and an SDK that supports tags. See [SDK support](#sdk-support).
- Workers that connect **without work item filters**. See [Configure eligible workers](#configure-eligible-workers).

## Configure eligible workers

Only worker connections without [work item filters](./work-item-filtering.md) can receive work from defined task queues. A worker connection with any filters, including wildcard filters, isn't eligible. Ensure the unfiltered workers register all orchestrations and activities that you route to the queues.

The .NET Durable Task SDK automatically generates filters from its task registry. Explicitly opt out of filtering when configuring a worker for task queues:

```csharp
builder.Services.AddDurableTaskWorker()
    .AddTasks(registry =>
    {
        registry.AddAllGeneratedTasks();
    })
    .UseDurableTaskScheduler(connectionString)
    .UseWorkItemFilters(null);
```

In the Java, Python, and Go SDKs, don't opt in to work item filtering for these workers. If your application already configures filters, remove that configuration. For SDK-specific filtering options, see [Enable work item filtering](./work-item-filtering.md#enable-work-item-filtering).

> [!IMPORTANT]
> Work in a defined queue waits until an eligible worker connects. It doesn't fall back to a filtered worker. Conversely, if the named queue doesn't exist or was deleted, work uses ordinary task hub routing and the requested queue's rate limit isn't enforced. Create the queue and wait for provisioning to succeed before you schedule tagged work.

## Set up Azure CLI

Sign in and select the subscription that contains your scheduler:

```azurecli
az login
az account set --subscription SUBSCRIPTION_ID
```

Set the following Bash variables. Replace the resource group, scheduler, and task hub names with your existing resources. The examples create a queue named `orders`.

```bash
subscriptionId=$(az account show --query id --output tsv)
resourceGroup="RESOURCE_GROUP"
schedulerName="SCHEDULER_NAME"
taskHubName="TASK_HUB_NAME"
queueName="orders"
apiVersion="2026-07-01-preview"

taskHubResourceId="/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.DurableTask/schedulers/$schedulerName/taskHubs/$taskHubName"
queueResourceId="$taskHubResourceId/taskQueues/$queueName"
queueUrl="https://management.azure.com$queueResourceId?api-version=$apiVersion"
```

## Create a task queue

The queue name must contain 3 to 64 letters, numbers, or hyphens, matching `^[a-zA-Z0-9-]{3,64}$`. A queue is a child resource of a task hub; it doesn't have its own `location` or Azure resource `tags` properties.

The following examples create the `orders` queue with a sustained rate of 20 work-item handouts per second. Set `actionsPerSecond` to a positive integer, or omit `throughput` to create a queue without a queue-specific rate limit.

# [Azure CLI](#tab/cli)

Use `az rest` to call the Azure Resource Manager API:

```azurecli
az rest --method put \
  --url "$queueUrl" \
  --body '{"properties":{"throughput":{"actionsPerSecond":20}}}'
```

# [Azure Resource Manager REST](#tab/rest)

Replace the placeholders in the resource ID. Send the request with an [Azure Resource Manager access token](/rest/api/azure/#acquire-an-access-token).

```http
PUT https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/taskHubs/TASK_HUB_NAME/taskQueues/orders?api-version=2026-07-01-preview
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "properties": {
    "throughput": {
      "actionsPerSecond": 20
    }
  }
}
```

# [Bicep](#tab/bicep)

Save the following template as `task-queue.bicep`. It references an existing scheduler and task hub and creates only the task queue.

> [!NOTE]
> Some Bicep versions might report `BCP081` because type definitions for the preview task queue resource aren't available. This warning doesn't prevent compilation or deployment. Use the [resource reference](/azure/templates/microsoft.durabletask/2026-07-01-preview/schedulers/taskhubs/taskqueues) to check the properties.

```bicep
param schedulerName string
param taskHubName string

@minLength(3)
@maxLength(64)
param queueName string = 'orders'

@minValue(1)
param actionsPerSecond int = 20

resource scheduler 'Microsoft.DurableTask/schedulers@2026-02-01' existing = {
  name: schedulerName
}

resource taskHub 'Microsoft.DurableTask/schedulers/taskHubs@2026-02-01' existing = {
  parent: scheduler
  name: taskHubName
}

resource taskQueue 'Microsoft.DurableTask/schedulers/taskHubs/taskQueues@2026-07-01-preview' = {
  parent: taskHub
  name: queueName
  properties: {
    throughput: {
      actionsPerSecond: actionsPerSecond
    }
  }
}
```

Deploy to the resource group that contains the scheduler:

```azurecli
az deployment group create \
  --resource-group "$resourceGroup" \
  --template-file task-queue.bicep \
  --parameters schedulerName="$schedulerName" taskHubName="$taskHubName" \
    queueName="$queueName" actionsPerSecond=20
```

---

### Wait for provisioning

Resource management operations are asynchronous. After creating or updating a queue, retrieve it and check `properties.provisioningState`:

```azurecli
az rest --method get --url "$queueUrl" \
  --query properties.provisioningState --output tsv
```

Repeat the query until the state is `Succeeded` before sending tagged work. Stop if the state is `Failed`, an error occurs, or your polling timeout expires. Resolve the resource management error before using the queue. An accepted management request alone doesn't mean the queue is ready. For polling intervals and operation tracking, see [Track asynchronous Azure operations](/azure/azure-resource-manager/management/async-operations).

## SDK support

Queue selection uses [orchestration and activity tags](./durable-task-scheduler-tags.md), not Azure resource tags. The following table shows where you can explicitly set `DTS_TaskQueue`.

| SDK or extension | Start an orchestration | Schedule an activity | Schedule a sub-orchestration |
| --- | --- | --- | --- |
| Durable Task .NET SDK | Yes | Yes | Yes |
| Durable Task JavaScript/TypeScript SDK | Yes | Yes | Yes |
| Durable Task Python SDK | Yes | Yes | No |
| Durable Task Java SDK (v1.6.0+) | Yes | No | No |
| Durable Task Go SDK (beta) | Yes | Yes | Yes |
| Durable Functions: .NET isolated | Yes | Yes | Yes |
| Durable Functions: Java | Yes | No | No |

Durable Functions .NET in-process, JavaScript, and Python bindings don't expose these explicit tag options. Don't assume that a language's standalone Durable Task SDK support also applies to its Durable Functions binding. In every case, the worker connection must also meet the [unfiltered-worker requirement](#configure-eligible-workers).

## Route an orchestration to a queue

Set the literal tag key `DTS_TaskQueue` to the name of a queue in the same task hub. The following snippets assume you already configured a client and registered your orchestration. Use the `orders` queue created earlier.

# [.NET (C#)](#tab/csharp)

```csharp
var options = new StartOrchestrationOptions
{
    Tags = new Dictionary<string, string>
    {
        { "DTS_TaskQueue", "orders" },
    },
};

string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    "ProcessOrderOrchestration", input: order, options: options);
```

# [JavaScript/TypeScript](#tab/javascript)

```javascript
const instanceId = await client.scheduleNewOrchestration(
    "ProcessOrderOrchestration",
    order,
    {
        tags: {
            DTS_TaskQueue: "orders",
        },
    }
);
```

# [Python](#tab/python)

```python
instance_id = client.schedule_new_orchestration(
    "process_order_orchestration",
    input=order,
    tags={"DTS_TaskQueue": "orders"},
)
```

# [Java](#tab/java)

```java
NewOrchestrationInstanceOptions options = new NewOrchestrationInstanceOptions()
    .setTags(Map.of("DTS_TaskQueue", "orders"));

String instanceId = client.scheduleNewOrchestrationInstance(
    "ProcessOrderOrchestration", order, options);
```

# [Go (beta)](#tab/go)

Use `api` from `github.com/microsoft/durabletask-go/api`. This snippet runs in a function that returns an error.

```go
instanceID, err := client.ScheduleNewOrchestration(
	ctx,
	"ProcessOrderOrchestration",
	api.WithTags(map[string]string{"DTS_TaskQueue": "orders"}),
)
if err != nil {
	return err
}
```

Use `instanceID` to track the orchestration. For client and worker setup, see the [Go SDK guide](../sdks/durable-task-go.md).

---

The orchestration's activities and sub-orchestrations inherit its queue selection. You don't need to repeat the tag on every call. Set the queue tag when scheduling work; updating a queue's rate doesn't require changing the tag.

## Override the queue for an activity or sub-orchestration

To pace a subset of a workflow independently, create another queue, such as `partner-api`, and set `DTS_TaskQueue` explicitly on the activity or sub-orchestration call. Wait for that queue's provisioning to succeed first.

For example, you can leave orchestration coordination in `orders` and route calls to a downstream service through `partner-api`. The activity override selects the activity's queue; it doesn't move the parent orchestration.

# [.NET (C#)](#tab/csharp)

```csharp
var activityOptions = new TaskOptions(tags: new Dictionary<string, string>
{
    { "DTS_TaskQueue", "partner-api" },
});

await context.CallActivityAsync(
    "CallPartnerApi", input: order, options: activityOptions);

var childOptions = new SubOrchestrationOptions
{
    Tags = new Dictionary<string, string>
    {
        { "DTS_TaskQueue", "partner-api" },
    },
};

await context.CallSubOrchestratorAsync(
    "ValidateOrderOrchestration", input: order, options: childOptions);
```

# [JavaScript/TypeScript](#tab/javascript)

```javascript
const result = yield ctx.callActivity(callPartnerApi, order, {
    tags: { DTS_TaskQueue: "partner-api" },
});

const childResult = yield ctx.callSubOrchestrator(validateOrderOrchestration, order, {
    tags: { DTS_TaskQueue: "partner-api" },
});
```

# [Python](#tab/python)

```python
result = yield ctx.call_activity(
    "call_partner_api",
    input=order,
    tags={"DTS_TaskQueue": "partner-api"},
)
```

The Python SDK doesn't support explicit sub-orchestration tags. A sub-orchestration inherits its parent's queue selection.

# [Java](#tab/java)

The Java SDK doesn't support explicit activity or sub-orchestration tags. Activities and sub-orchestrations inherit the parent orchestration's queue selection.

# [Go (beta)](#tab/go)

Pass `task.WithActivityTags(map[string]string{"DTS_TaskQueue": "partner-api"})` when calling an activity, or `task.WithSubOrchestrationTags(map[string]string{"DTS_TaskQueue": "partner-api"})` when calling a sub-orchestration. Use `task` from `github.com/microsoft/durabletask-go/task`.

For a runnable activity-tagging example, see the [Go SDK observability sample](https://github.com/microsoft/durabletask-go/tree/main/samples/observability).

---

## View and update queues

The following management examples use the Bash variables from [Set up Azure CLI](#set-up-azure-cli).

Retrieve a queue's configuration:

```azurecli
az rest --method get --url "$queueUrl"
```

List the queues in a task hub:

```azurecli
az rest --method get \
  --url "https://management.azure.com$taskHubResourceId/taskQueues?api-version=$apiVersion"
```

Update the queue's rate to 10 handouts per second:

```azurecli
az rest --method patch \
  --url "$queueUrl" \
  --body '{"properties":{"throughput":{"actionsPerSecond":10}}}'
```

To remove the queue-specific rate limit while keeping the queue, explicitly set `throughput` to `null`:

```azurecli
az rest --method patch \
  --url "$queueUrl" \
  --body '{"properties":{"throughput":null}}'
```

Omitting throughput from a PATCH request leaves the existing rate unchanged. A PUT request replaces the configuration; omitting throughput from PUT removes the queue-specific rate limit. After updating, [wait for provisioning](#wait-for-provisioning) to succeed and verify the returned configuration.

## Delete a task queue

> [!WARNING]
> Deleting a queue removes its rate limit. Work tagged with the deleted queue name uses ordinary task hub routing instead. Don't use queue deletion to pause a workload.

Delete the queue resource:

```azurecli
az rest --method delete --url "$queueUrl"
```

Deletion is asynchronous. Follow the [Azure Resource Manager asynchronous operation](/azure/azure-resource-manager/management/async-operations) to completion, or poll GET with a timeout until the queue returns `404 Not Found`. Don't treat authorization errors or other request failures as confirmation of deletion. Deleting a queue doesn't terminate the orchestrations that used it.

## Troubleshoot queue routing

If queued work isn't progressing, verify that the queue exists and provisioning succeeded, the tag identifies the intended queue in the same task hub, and a healthy worker connects without filters. A defined queue with no eligible workers retains its work rather than delivering it to a filtered worker.

If work runs without the expected rate limit, check for a missing or deleted queue. In that case, the scheduler uses ordinary task hub routing. Also account for short bursts and the difference between handouts and completed workflows. Use the [scheduler dashboard](./durable-task-scheduler-dashboard.md) to inspect orchestration status and tags.

## Related content

- [Add tags to orchestrations and activities](./durable-task-scheduler-tags.md)
- [Work item filtering](./work-item-filtering.md)
- [Configure identity-based access](./durable-task-scheduler-identity.md)
- [Task queue ARM and Bicep reference](/azure/templates/microsoft.durabletask/2026-07-01-preview/schedulers/taskhubs/taskqueues)
