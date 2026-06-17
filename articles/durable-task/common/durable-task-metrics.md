---
title: Monitor action metrics for Durable Task Scheduler
description: Learn about the action metrics emitted by the Durable Task Scheduler for monitoring billing and workload breakdown.
ms.service: durable-task
ms.topic: conceptual
ms.date: 06/03/2026
ms.author: hannahhunter
author: hhunter-ms
---

# Monitor action metrics for Durable Task Scheduler

The Durable Task Scheduler emits a set of **action metrics** for every task hub. Because the Consumption SKU for the Durable Task Scheduler is billed by the number of **actions** dispatched to your application, these metrics let you monitor exactly what drives your bill and break it down by work type.

> [!NOTE]
> Only the [Consumption SKU](../scheduler/durable-task-scheduler-billing.md#consumption-sku) is billed on the total number of actions. The Dedicated SKU is billed on capacity units. 

## What is an action?

An action is a message the Durable Task Scheduler dispatches to your application to run
an orchestrator, activity, or entity function. Common actions include:
- Starting an orchestration or activity
- Completing a timer
- Raising an external event
- Running an entity operation
- Processing any of the previous results

The **total number of actions is what you are billed on**.

For background on what an action is and how billing works, see
[Durable Task Scheduler billing](../scheduler/durable-task-scheduler-billing.md#what-is-an-action).

## Available metrics

All metrics are scoped to an individual task hub and emitted under the meter
`Microsoft.DurableTask.Scheduler.TaskHubs`. They're counters with the unit `actions`.

| Metric | Description |
| --- | --- |
| `TotalActions` | Total billable actions for the task hub. Equals the sum of `OrchestrationActions`, `ActivityActions`, `TimerActions`, and `EntityActions`. This value is what you're billed on. |
| `OrchestrationActions` | Messages processed by an orchestrator. For example, an orchestration start, an external event, or the result of an activity, timer, or suborchestration being handed back to the orchestrator. |
| `ActivityActions` | New activities scheduled by orchestrators. |
| `TimerActions` | New durable timers scheduled by orchestrators. |
| `EntityActions` | Entity operations executed. |

> `TotalActions = OrchestrationActions + ActivityActions + TimerActions + EntityActions`

## Dimensions

Each metric is reported with the following dimensions, applied as tags, so you can filter and aggregate
by scheduler and task hub:

| Tag | Description |
| --- | --- |
| `ResourceId` | The Azure resource ID of the scheduler. |
| `TaskHubName` | The name of the task hub. |

## How to use these metrics

- **Track billing:** Watch `TotalActions` over time to understand and forecast your
  action-based costs.
- **Understand cost drivers:** Compare `OrchestrationActions`, `ActivityActions`,
  `TimerActions`, and `EntityActions` to see which workload type contributes most to
  your total. For example, a high `ActivityActions` value indicates activity-heavy
  orchestrations.
- **Plan capacity:** Convert actions per second into the capacity units (Dedicated SKU)
  or expected charges (Consumption SKU) you need. See the
  [billing guide](../scheduler/durable-task-scheduler-billing.md)
  for capacity-planning examples.

## Next steps

> [!div class="nextstepaction"]
> [Durable Task Scheduler billing](../scheduler/durable-task-scheduler-billing.md)

- [Monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [OpenTelemetry and distributed tracing](../sdks/durable-task-scheduler-opentelemetry-tracing.md)
- [Troubleshoot Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md)
