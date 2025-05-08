---
title: Debug and manage orchestrations using the Azure Functions durable task scheduler dashboard (preview)
description: Learn how to debug and manage your orchestrations using the Azure Functions durable task scheduler.
ms.topic: conceptual
ms.date: 03/17/2025
---

# Debug and manage orchestrations using the Azure Functions durable task scheduler dashboard (preview)

Observe, manage, and debug your task hub or scheduler's orchestrations effectively using the durable task scheduler dashboard. The dashboard is available when you run the [durable task scheduler emulator](./durable-task-scheduler.md#emulator-for-local-development) locally or create a scheduler resource on Azure. 
- **Running locally** doesn't require authentication. 
- **Creating a scheduler resource on Azure** requires that you [assign the *Durable Task Data Contributor* role to your identity](./develop-with-durable-task-scheduler.md#accessing-durable-task-scheduler-dashboard). You can then access the dashboard via either:
  - The task hub's dashboard endpoint URL in the Azure portal
  - Navigate to `https://dashboard.durabletask.io/` combined with your task hub endpoint.  

## Monitor orchestration progress and execution history

The dashboard allows you to monitor orchestration progress and review execution history. You can also filter by orchestration metadata, such as state and timestamps.

:::image type="content" source="media/durable-task-scheduler-dashboard/track-orchestration-progress.png" alt-text="Screenshot of the dashboard listing orchestration history and status.":::

View orchestration inputs and outputs:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-input-outputs.png" alt-text="Screenshot of the dashboard listing orchestration history and status inputs and outputs.":::

## Detailed view of orchestration execution

You can drill into orchestration instances to view execution details and activity progress. This view helps you diagnose problems or gain visibility into the status of an orchestration.

In the following image, the *Timeline* view of an orchestration execution. In this "ProcessDocument" orchestration, the "WriteDoc" activity retried three times (unsuccessfully) with five seconds in between retry.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-timeline.png" alt-text="Screenshot of the dashboard showing the orchestration execution timeline.":::

You can also view inputs and outputs of activities in an orchestration:

:::image type="content" source="media/durable-task-scheduler-dashboard/activity-input-output.png" alt-text="Screenshot of the dashboard showing activity inputs and outputs.":::

### Other views of orchestration execution sequence

The *History* view shows detailed event sequence, timestamps, and payload:

:::image type="content" source="media/durable-task-scheduler-dashboard/instance-details.png" alt-text="Screenshot of the dashboard showing orchestration instance details.":::

The *Sequence* view gives another way of visualizing event sequence:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-sequence.png" alt-text="Screenshot of the dashboard showing orchestration sequence view.":::

## Orchestration management 

The dashboard includes features for managing orchestrations on demand, such as starting, pausing, resuming, and terminating.

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration.png" alt-text="Screenshot of the dashboard showing the buttons you use to manage the orchestration.":::

## Security 

Dashboard access is secured through [integration with Azure Role-Based Access Control (RBAC)](./develop-with-durable-task-scheduler.md#accessing-durable-task-scheduler-dashboard).

## Next steps

[Try out the quickstart to see the durable task scheduler dashboard in action](./quickstart-durable-task-scheduler.md)
