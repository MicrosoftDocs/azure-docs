---
title: Metrics for Durable Task Scheduler
description: Learn about the Azure Monitor metrics that Durable Task Scheduler emits, including action, work item, backlog, latency, and request metrics, and how to use them to troubleshoot a lack of progress.
ms.service: durable-task
ms.topic: concept-article
ms.date: 11/20/2026
ms.author: kaibocai
author: kaibocai
ms.reviewer: hhunter-ms
---

# Metrics

Durable Task Scheduler publishes platform metrics to Azure Monitor for each scheduler. Use them to track billable actions, see how work is assigned to and completed by your workers, watch backlogs, measure activity latency, and monitor requests to the scheduler. Most metrics can be filtered or split by task hub.

The Consumption SKU charges based on the number of *actions*, so the action metrics show exactly what drives your bill and let you break it down by work type.

> [!NOTE]
> Only the [Consumption SKU](../scheduler/durable-task-scheduler-billing.md#consumption-sku) charges based on the total number of actions. The Dedicated SKU charges based on capacity units.

## Actions vs. work items

In Durable Task Scheduler metrics and SDK settings, you might also see the term *work item*. Actions and work items aren't the same thing:

- An *action* is the unit of work used for billing and throughput. It counts each logical step saved by the scheduler: orchestration messages processed, activities scheduled, timers created, and entity operations executed.
- A *work item* is a package of work sent to a worker to run. It's used for worker concurrency, scaling, and routing. Examples include `MaxConcurrentOrchestrationWorkItems`, work item filters, and the pending item metrics that show queue backlog.

Because one work item can carry multiple messages, the number of actions and the number of work items often don't match:

- Batching: If five events arrive for the same orchestration at once, the scheduler can send them to a worker in one work item. When the orchestration finishes that turn, it counts as five actions.
- Retries: If a worker crashes or times out, the scheduler sends the same work item again. You aren't billed for the retry until the work is saved.
- Timers: Creating a durable timer counts as an action, even though no separate timer work item is sent to a worker.

| Concept | What it measures | Where you see it |
| --- | --- | --- |
| Action | Logical work saved by the scheduler | Billing (Consumption SKU), capacity unit (CU) capacity, the `TotalActions` metric and the other action metrics |
| Work item | A batch of work sent to a worker | Worker concurrency settings, autoscaling, the `DispatchedWorkItems`, `CompletedWorkItems`, `OrchestratorPendingItems`, `ActivityPendingItems`, and `EntityPendingItems` metrics |

> [!NOTE]
> To estimate or check your Consumption SKU bill, always use action metrics (`TotalActions`), not work item metrics.

## View metrics in the Azure portal

1. In the [Azure portal](https://portal.azure.com), open your Durable Task Scheduler resource and select **Monitoring** > **Metrics**. You can also open **Monitor** > **Metrics** and select your scheduler.
1. Scope the chart to the scheduler resource (`Microsoft.DurableTask/schedulers`) and select its metric namespace. Don't select the task hub child resource as the scope.
1. Select **Add filter** and filter on **Task Hub** for the hub you want to inspect. The dimension name in the API is `TaskHubName`.
1. Choose a time range. Start with one-minute granularity.
1. Add one chart per metric. Split the four work item metrics by **Work Item Type**. For **Activity Completion Latency**, start by splitting on **Outcome**.

You can also pin charts to a dashboard, create metric alerts, or configure diagnostic settings to route metrics to a Log Analytics workspace for custom queries.

## Supported metrics

All Durable Task Scheduler metrics are emitted for the `Microsoft.DurableTask/schedulers` resource type, have a time grain of one minute (`PT1M`), and can be exported through diagnostic settings. For the generated reference, see [Supported metrics for Microsoft.DurableTask/schedulers](/azure/azure-monitor/reference/supported-metrics/microsoft-durabletask-schedulers-metrics).

### Action metrics

Action metrics count the logical work that the scheduler saves. Use them to track and forecast Consumption SKU costs. For a full definition of an action, examples, and billing details, see [What is an action?](../scheduler/durable-task-scheduler-billing.md#what-is-an-action) in the billing guide.

| Metric | Name in REST API | Unit | Default aggregation | Supported aggregations | Dimensions | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Total Actions | `TotalActions` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Total billable actions for the task hub. Equals the sum of `OrchestrationActions`, `ActivityActions`, `TimerActions`, and `EntityActions`. This value is what you're billed on for the Consumption SKU. |
| Orchestration Actions | `OrchestrationActions` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Messages processed by an orchestrator. For example, an orchestration start, an external event, or the result of an activity, timer, or suborchestration being handed back to the orchestrator. |
| Activity Actions | `ActivityActions` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | New activities scheduled by orchestrators. |
| Timer Actions | `TimerActions` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | New durable timers scheduled by orchestrators. |
| Entity Actions | `EntityActions` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Entity operations executed. |

`TotalActions` = `OrchestrationActions` + `ActivityActions` + `TimerActions` + `EntityActions`

Use the action metrics in these ways:

- Track billing: Watch `TotalActions` over time to understand and forecast action-based costs for the Consumption SKU.
- Understand cost drivers: Compare `OrchestrationActions`, `ActivityActions`, `TimerActions`, and `EntityActions` to see which workload type contributes most to your total. For example, a high `ActivityActions` value indicates activity-heavy orchestrations.

### Work item and latency metrics

A *work item* is a unit of activity, orchestration, or entity work. One orchestration can generate many work items, so a work item count isn't the number of orchestration instances. These metrics show how work is assigned to workers, the workers' assignment capacity, how many work items are dispatched and completed, and how long an activity takes from scheduling until its result is accepted. Use them with the [backlog and worker metrics](#backlog-and-worker-metrics) when you investigate a backlog.

| Metric | Name in REST API | Unit | Default aggregation | Supported aggregations | Dimensions | Description |
| --- | --- | --- | --- | --- | --- | --- |
| In-Flight Work Items | `InflightWorkItems` | Count | Average | Average, Maximum, Minimum | `TaskHubName`, `WorkItemType` | Number of work items assigned to workers connected to the task hub that remain unreleased. Includes assigned work that might still be waiting to run. |
| Work Items Capacity | `WorkItemsCapacity` | Count | Average | Average, Maximum, Minimum | `TaskHubName`, `WorkItemType` | Current maximum assignment capacity of the workers connected to the task hub. Draining or disconnecting workers contribute zero. Capacity is an assignment limit, not a count of free slots. |
| Dispatched Work Items | `DispatchedWorkItems` | Count | Total (Sum) | Total (Sum) | `TaskHubName`, `WorkItemType` | Number of work items successfully dispatched to a worker. A dispatch doesn't mean the work completed. |
| Completed Work Items | `CompletedWorkItems` | Count | Total (Sum) | Total (Sum) | `TaskHubName`, `WorkItemType` | Number of work items whose first completion result is accepted. Failed results are included. The metric doesn't increment once for every extended session round. |
| Activity Completion Latency | `ActivityCompletionLatencyMs` | Milliseconds | Average | Count, Total (Sum), Average, Maximum, Minimum | `TaskHubName`, `ActivityName`, `ActivityVersion`, `OrchestrationName`, `OrchestrationVersion`, `Outcome` | Time from the original activity scheduling timestamp until the scheduler accepts the activity result. Includes time waiting in a queue, execution, and the return and acceptance of the result, for both successful and failed activity executions. |

### Backlog and worker metrics

These metrics show how much work is waiting, how much is being processed, and how many workers are connected.

| Metric | Name in REST API | Unit | Default aggregation | Supported aggregations | Dimensions | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Orchestrator Pending Items | `OrchestratorPendingItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of orchestrator work items ready to be processed. |
| Activity Pending Items | `ActivityPendingItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of activity work items ready to be processed. |
| Entity Pending Items | `EntityPendingItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of entity work items ready to be processed. |
| Orchestrator Active Items | `OrchestratorActiveItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of orchestrator work items being actively processed. |
| Activity Active Items | `ActivityActiveItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of activity work items being actively processed. |
| Entity Active Items | `EntityActiveItems` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of entity work items being actively processed. |
| Connected Workers | `ConnectedWorkers` | Count | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of workers connected to a task hub. |

### Request metrics

These metrics count requests that the scheduler processes and how they finish.

| Metric | Name in REST API | Unit | Default aggregation | Supported aggregations | Dimensions | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Requests | `Requests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Total number of requests processed by the scheduler. |
| Successful Requests | `SuccessfulRequests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of requests that complete successfully. |
| Client Fault Requests | `ClientFaultRequests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of requests that fail because of a client error. |
| Server Fault Requests | `ServerFaultRequests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of requests that fail because of a server error. |
| Unauthenticated Requests | `UnauthenticatedRequests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of requests that fail because of missing or invalid authentication. |
| Permission Denied Requests | `PermissionDeniedRequests` | Count | Total (Sum) | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Number of requests that fail because of insufficient permissions. |
| Request Duration | `RequestDurationMs` | Milliseconds | Average | Total (Sum), Average, Maximum, Minimum | `TaskHubName` | Duration of requests, in milliseconds. |

### Storage metrics

| Metric | Name in REST API | Unit | Default aggregation | Supported aggregations | Dimensions | Description |
| --- | --- | --- | --- | --- | --- | --- |
| Data Used In Bytes | `DataUsedInBytes` | Bytes | Average | Total (Sum), Average, Maximum, Minimum | None | Size of the payloads table, in bytes. |

### Dimensions

Use dimensions to filter or split a metric chart. Not every metric supports every dimension. See the **Dimensions** column in the metric tables.

| Dimension name in REST API | Name in the Azure portal | Description |
| --- | --- | --- |
| `TaskHubName` | Task Hub | The name of the task hub. |
| `WorkItemType` | Work Item Type | The type of work item. Values can include `Activity`, `Orchestration`, and `Entity`. |
| `ActivityName` | Activity Name | The name of the activity. |
| `ActivityVersion` | Activity Version | The version of the activity. |
| `OrchestrationName` | Orchestration Name | The name of the orchestration that scheduled the activity. |
| `OrchestrationVersion` | Orchestration Version | The version of the orchestration that scheduled the activity. |
| `Outcome` | Outcome | The outcome of the activity execution. Use it to separate successful and failed activity executions. |

## Troubleshoot a lack of progress

When orchestrations, activities, or entities stop making progress, use the metrics to find which stage stopped: worker connection, dispatch, or completion.

In Azure Monitor, compare metrics for the same scheduler, task hub, and time window. Choose the pending item metric that matches the work type (for example, **Activity Pending Items**), and filter by **Work Item Type** where it's available. Use the **Sum** aggregation for **Dispatched Work Items** and **Completed Work Items**.

### Set alerts for the stage that stops progressing

Create metric alerts for each stage. Set backlog and throughput thresholds that fit your workload.

| Alert | When to investigate | Next step |
| --- | --- | --- |
| Workers unavailable | **Connected Workers** stays at zero past the expected worker startup or restart window. | [No workers are connected](#no-workers-are-connected) |
| Low dispatch | Pending work stays high, workers are connected, and **Dispatched Work Items** is below your threshold for the window. | [Dispatch is low](#dispatch-is-low) |
| Low completion | Workers are connected, **In-Flight Work Items** stays above zero, and **Completed Work Items** stays below your threshold for longer than normal processing or session duration. A pending backlog isn't required. | [Completions are low](#completions-are-low) |

> [!NOTE]
> A growing backlog with normal dispatch and completion doesn't, by itself, indicate a stall.

### No workers are connected

Symptom: Work isn't being processed, and no workers are connected to the task hub.

Metrics to check:

| Metric | What the value means |
| --- | --- |
| Connected Workers | A value that stays at zero past the expected worker startup or restart window means no worker is connected to the task hub, so the scheduler can't dispatch work. |

Next step: Check for stopped deployments, scale-to-zero, restarts, or startup errors. Then verify the scheduler endpoint, the task hub, the worker identity's permissions, and network access. For details, see [Check connection string and access to Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md#check-connection-string-and-access-to-durable-task-scheduler).

### Dispatch is low

Symptom: Pending work stays high while workers are connected, but the scheduler dispatches few work items.

Metrics to check:

| Metric | What the value means |
| --- | --- |
| Orchestrator Pending Items, Activity Pending Items, or Entity Pending Items | A value that stays high means work is ready but the scheduler isn't sending it to workers. |
| Connected Workers | A value above zero means workers are connected, so the problem isn't worker availability. |
| Dispatched Work Items (Sum) | A value below your threshold for the window confirms that dispatch is low. |
| Work Items Capacity | A value of zero means workers are draining, or no connected worker can accept that work type. |
| In-Flight Work Items | A value that stays near **Work Items Capacity** while completions are low means workers are at their assignment limit and work isn't finishing. |

Next step: Confirm that workers can accept the work:

- Verify that workers are polling the right task hub.
- Check registered task names, versions, and worker filters.
- If you use [task queues](../scheduler/durable-task-scheduler-task-queues.md), defined task queues require unfiltered worker connections. Also check the queue's dispatch rate limit.
- If **Work Items Capacity** is zero, check whether workers are draining or whether none can accept that work type.
- If in-flight work stays near capacity and completions are low, continue to [Completions are low](#completions-are-low).

### Completions are low

Symptom: Workers are connected and have work in progress, but few work items complete. This situation can occur without a pending backlog.

Metrics to check:

| Metric | What the value means |
| --- | --- |
| Connected Workers | A value above zero means workers are connected. |
| In-Flight Work Items | A value that stays above zero means work is assigned to workers and remains unreleased. |
| Completed Work Items (Sum) | A value below your threshold for longer than normal processing or session duration means assigned work isn't finishing. Completions include failures, so a normal count can still hide retries. |
| Activity Completion Latency | Split by **Outcome** to compare successful and failed activity executions and see how long activities take from scheduling until their result is accepted. |

Next step: Find where the work stops. Compare an affected instance's history with your worker logs, and rule out expected waits on timers or external events. Because completions include failures, check for retries even if the completion count looks normal. Then use the worker logs to narrow down the stage:

| What the worker logs show | What to check |
| --- | --- |
| No matching receipt | Check SDK receive errors and connection interruptions. A dispatch count doesn't prove that the worker received the work item. |
| Received, not started | Check the worker queue, concurrency limits, and CPU or memory pressure. |
| Started, not finished | Check application code and downstream dependencies for blocking or timeouts. |
| Finished, result not accepted | Inspect submission errors for identity, network, or payload issues. If Durable Task Scheduler service errors repeat, contact Azure support. |

## Next steps

> [!div class="nextstepaction"]
> [Durable Task Scheduler billing](../scheduler/durable-task-scheduler-billing.md)

- [Monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [OpenTelemetry and distributed tracing](../sdks/durable-task-scheduler-opentelemetry-tracing.md)
- [Troubleshoot Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md)
- [Supported metrics for Microsoft.DurableTask/schedulers](/azure/azure-monitor/reference/supported-metrics/microsoft-durabletask-schedulers-metrics)
