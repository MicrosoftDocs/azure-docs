---
title: Monitor metrics for Durable Task Scheduler
description: Learn about the action and storage metrics emitted by the Durable Task Scheduler for monitoring utilization, billing, and workload breakdown.
ms.service: durable-task
ms.topic: conceptual
ms.date: 06/15/2026
ms.author: hannahhunter
author: hhunter-ms
---

# Monitor metrics for Durable Task Scheduler

The Durable Task Scheduler emits **action metrics** and **storage metrics** for every task hub. These metrics help you understand how active your scheduler is and how much data it's storing, regardless of which SKU you use:

- **Consumption SKU**: Actions directly determine your bill. Use action metrics to monitor costs and forecast spending.
- **Dedicated SKU**: Each capacity unit (CU) supports up to 2,000 actions per second and 50 GB of orchestration data storage. Use these metrics to understand how much of your provisioned capacity you're using and whether you need to scale up or down.

Action metrics let you break down your workload by type and identify which operations drive the most activity. Storage metrics let you track how much orchestration data your task hubs are retaining.

## What is an action?

An action is a message the Durable Task Scheduler dispatches to your application to trigger the execution of an orchestrator, activity, or entity function. For the Consumption SKU, the total number of actions is what you're billed on. For the Dedicated SKU, the actions-per-second rate tells you how much of your provisioned capacity you're utilizing.

For a full definition, examples, and billing details, see [What is an action?](../scheduler/durable-task-scheduler-billing.md#what-is-an-action) in the billing guide.

## View metrics in the Azure portal

You can view these metrics in the Azure portal:

1. Navigate to your Durable Task Scheduler resource in the [Azure portal](https://portal.azure.com).
1. In the left menu, select **Monitoring** > **Metrics**.
1. Select the task hub scope and the metric you want to view (for example, `TotalActions`).
1. Use the **Add filter** option to filter by `TaskHubName` if you have multiple task hubs.

You can also pin charts to your dashboard or configure diagnostic settings to route metrics to a Log Analytics workspace for custom queries.

## Action metrics

All action metrics are scoped to an individual task hub and emitted under the meter
`Microsoft.DurableTask.Scheduler.TaskHubs`. They're counters with the unit `actions`.

| Metric | Description |
| --- | --- |
| `TotalActions` | Total actions for the task hub. Equals the sum of `OrchestrationActions`, `ActivityActions`, `TimerActions`, and `EntityActions`. For the Consumption SKU, this value is what you're billed on. For the Dedicated SKU, use the rate of this metric (actions per second) to gauge capacity utilization. |
| `OrchestrationActions` | Messages processed by an orchestrator. For example, an orchestration start, an external event, or the result of an activity, timer, or suborchestration being handed back to the orchestrator. |
| `ActivityActions` | New activities scheduled by orchestrators. |
| `TimerActions` | New durable timers scheduled by orchestrators. |
| `EntityActions` | Entity operations executed. |

> `TotalActions = OrchestrationActions + ActivityActions + TimerActions + EntityActions`

## Storage metrics

Each Dedicated SKU capacity unit includes 50 GB of orchestration data storage. Storage metrics help you understand how much of that capacity your task hubs are consuming.

<!-- TODO: [Product team] Confirm the exact metric names and descriptions for storage metrics. Are these available today? If not, remove this section and add a note that storage metrics are planned. -->

| Metric | Description |
| --- | --- |
| `StorageUsageBytes` | Total orchestration data stored for the task hub, in bytes. |

> [!NOTE]
> Storage metrics are emitted under the same meter (`Microsoft.DurableTask.Scheduler.TaskHubs`) and share the same dimensions as action metrics.

## Dimensions

Each metric is reported with the following dimensions, applied as tags, so you can filter and aggregate
by scheduler and task hub:

| Tag | Description |
| --- | --- |
| `ResourceId` | The Azure resource ID of the scheduler. |
| `TaskHubName` | The name of the task hub. |

## How to use these metrics

- **Monitor action utilization (Dedicated SKU):** Each capacity unit supports up to 2,000
  actions per second. Monitor `TotalActions` per second to see how much of your
  provisioned capacity you're using. If you're consistently near the limit, consider
  adding more capacity units. If you're well under, you may be able to scale down.
- **Monitor storage utilization (Dedicated SKU):** Each capacity unit includes 50 GB
  of orchestration data storage. Monitor `StorageUsageBytes` to see how much storage
  your task hubs are consuming. If you're approaching the limit, consider purging
  completed orchestration history or adding capacity units.
- **Track billing (Consumption SKU):** Watch `TotalActions` over time to understand
  and forecast your action-based costs.
- **Understand workload breakdown:** Compare `OrchestrationActions`, `ActivityActions`,
  `TimerActions`, and `EntityActions` to see which workload type contributes most to
  your total. For example, a high `ActivityActions` value indicates activity-heavy
  orchestrations.
- **Plan capacity:** Convert actions per second into the capacity units (Dedicated SKU)
  or expected charges (Consumption SKU) you need. See the
  [billing guide](../scheduler/durable-task-scheduler-billing.md)
  for capacity-planning examples.

### Example: Calculate your current actions per second

Action metrics are emitted as cumulative counters. To calculate your current throughput,
compare the counter value across a time window:

1. In the Azure portal **Metrics** blade, select `TotalActions`.
1. Set the time range to **Last 1 hour** and the time granularity to **1 minute**.
1. Change the aggregation to **Count**.

The resulting chart shows actions per minute. Divide any peak by 60 to get
approximate actions per second. For the Dedicated SKU, compare this rate against
your provisioned capacity (2,000 actions/sec per CU) to gauge utilization.

## Set up alerts

Configure Azure Monitor alerts to get notified when your metrics approach capacity limits:

1. From the **Metrics** blade, select the metric you want to alert on (for example, `TotalActions`).
1. Select **New alert rule**.
1. Set the condition. For example, for a Dedicated SKU with 1 CU, alert when `TotalActions` exceeds 1,600 actions per second (80% of the 2,000 actions/sec limit).
1. Configure an action group to receive email, SMS, or webhook notifications.

For more information, see [Create or edit an alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).

## Metric retention

These metrics follow [Azure Monitor's standard retention policy](/azure/azure-monitor/essentials/data-platform-metrics#retention-of-metrics): platform metrics are retained for 93 days. This retention is independent of your task hub's orchestration data retention (up to 30 days for Consumption SKU, up to 90 days for Dedicated SKU).

## Next steps

> [!div class="nextstepaction"]
> [Durable Task Scheduler billing](../scheduler/durable-task-scheduler-billing.md)

- [Monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [Create or edit an Azure Monitor alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule)
- [OpenTelemetry and distributed tracing](../sdks/durable-task-scheduler-opentelemetry-tracing.md)
- [Troubleshoot Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md)
