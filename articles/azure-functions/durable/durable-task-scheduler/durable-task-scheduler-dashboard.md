---
title: Debug and manage orchestrations using the Durable Task Scheduler dashboard (preview)
description: Learn how to debug and manage your orchestrations using the Durable Task Scheduler.
ms.topic: conceptual
ms.date: 01/24/2025
---

# Debug and manage orchestrations using the Durable Task Scheduler dashboard (preview)

The Durable Task Scheduler dashboard is a tool that offers a variety of features designed to help observe, manage, and debug orchestrations effectively. This article highlights some key features of the dashboard. 

## Monitoring Orchestration Progress and Execution History

The dashboard allows you to monitor orchestration progress and review execution history. You can also filter by orchestration metadata, such as state and timestamps.

:::image type="content" source="media/durable-task-scheduler-dashboard/track-orchestration-progress.png" alt-text="Screenshot of the dashboard listing orchestration history and status.":::

View orchestration inputs and outputs:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-input-outputs.png" alt-text="Screenshot of the dashboard listing orchestration history and status inputs and outputs.":::

## Detailed View of Orchestration Execution

You can drill into orchestration instances to view execution details and activity progress, which can help in diagnosing problems or gaining visibility into the status of an orchestration.

For example, the following shows the *Timeline* view of an orchestration execution. In this "ProcessDocument" orchestration, the "WriteDoc" activity retried three times (unsuccessfully) with five seconds in between retry.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-timeline.png" alt-text="Screenshot of the dashboard showing the orchestration execution timeline.":::

You can also view inputs and outputs of activities in an orchestration:

:::image type="content" source="media/durable-task-scheduler-dashboard/activity-input-output.png" alt-text="Screenshot of the dashboard showing activity inputs and outputs.":::

### Other views of orchestration execution sequence

The *History* view shows detailed event sequence, timestamps, and payload:

:::image type="content" source="media/durable-task-scheduler-dashboard/instance-details.png" alt-text="Screenshot of the dashboard showing orchestration instance details.":::

The *Sequence* view gives another way of visualizing event sequence:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-sequence.png" alt-text="Screenshot of the dashboard showing orchestration sequence view.":::

## Orchestration Management 

The dashboard includes features for managing orchestrations on demand, such as starting, pausing, resuming, and terminating.

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration.png" alt-text="Screenshot of the dashboard showing the buttons you use to manage the orchestration.":::

## Security 

Dashboard access is secured through [integration with Azure Role-Based Access Control (RBAC)](./develop-with-durable-task-scheduler.md#accessing-dts-dashboard).

## Related links

[Try out the quickstart to see the Durable Task Scheduler dashboard in action](./quickstart-durable-task-scheduler.md)
