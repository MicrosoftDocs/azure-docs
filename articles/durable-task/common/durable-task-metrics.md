---
title: Monitor action metrics for Durable Task Scheduler
description: Learn about the action metrics emitted by the Durable Task Scheduler for monitoring billing and workload breakdown.
ms.service: durable-task
ms.topic: conceptual
ms.date: 06/03/2026
ms.author: kaibocai
author: kaibocai
ms.reviewer: hhunter-ms
---

# Monitor action metrics for Durable Task Scheduler

The Durable Task Scheduler emits a set of **action metrics** for every task hub. Because the Consumption SKU for the Durable Task Scheduler is billed by the number of **actions** dispatched to your application, these metrics let you monitor exactly what drives your bill and break it down by work type.

> [!NOTE]
> Only the [Consumption SKU](../scheduler/durable-task-scheduler-billing.md#consumption-sku) is billed on the total number of actions. The Dedicated SKU is billed on capacity units. 

## What is an action?

An *action* is a message the Durable Task Scheduler dispatches to your application to trigger the execution of an orchestrator, activity, or entity function. The total number of actions is what you're billed on for the Consumption SKU. For a full definition, examples, and billing details, see [What is an action?](../scheduler/durable-task-scheduler-billing.md#what-is-an-action) in the billing guide.

## View metrics in the Azure portal

You can view these metrics in the Azure portal:

1. Navigate to your Durable Task Scheduler resource in the [Azure portal](https://portal.azure.com).
1. In the left menu, select **Monitoring** > **Metrics**.
1. Select the task hub scope and the metric you want to view (for example, `TotalActions`).
1. Use the **Add filter** option to filter by `TaskHubName` if you have multiple task hubs.

You can also pin charts to your dashboard or configure diagnostic settings to route metrics to a Log Analytics workspace for custom queries.

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
  action-based costs for the Consumption SKU.
- **Understand cost drivers:** Compare `OrchestrationActions`, `ActivityActions`,
  `TimerActions`, and `EntityActions` to see which workload type contributes most to
  your total. For example, a high `ActivityActions` value indicates activity-heavy
  orchestrations.

## Next steps

> [!div class="nextstepaction"]
> [Durable Task Scheduler billing](../scheduler/durable-task-scheduler-billing.md)

- [Monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [OpenTelemetry and distributed tracing](../sdks/durable-task-scheduler-opentelemetry-tracing.md)
- [Troubleshoot Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md)
