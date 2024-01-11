---
title: View the latest snapshot of a health model
description: Learn how to view the latest snapshot of a health model in its full structural representation.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# View the current status of a health model in Azure Monitor
There are multiple views in Azure Monitor to analyze the current health of your model. 

## Graph view
The graph view shows the latest snapshot of a health model in its full structural representation. The time the snapshot was taken and the current refresh rate for the model is show in the top right.


:::image type="content" source="./media/health-model-snapshot-graph/health-model-resource-graph-view-pane.png" lightbox="./media/health-model-snapshot-graph/health-model-resource-graph-view-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Graph pane selected.":::

Click on an entity see more detail such as its health state history and the current state of each signal.

:::image type="content" source="./media/health-model-snapshot-graph/graph-tab-entity-detail.png" lightbox="./media/health-model-snapshot-graph/graph-tab-entity-detail.png" alt-text="Screenshot of the Entity detail dialog for a health model resource in the Azure portal.":::

## Table view

The table view shows the health state of one or more layers of the health model over time. When you open the view, the root entity is displayed, and you can gradually expand the different layers of your health model.

When you change the date window, the displayed time grain gets automatically chosen.

:::image type="content" source="./media/health-model-health-state/health-model-resource-table-view-pane.png" lightbox="./media/health-model-health-state/health-model-resource-table-view-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Table view pane selected.":::

You can click on a particular time slice to get more information and also to zoom in on that date range.

:::image type="content" source="./media/health-model-health-state/table-view-pane-time-slice-more-details.png" lightbox="./media/health-model-health-state/table-view-pane-time-slice-more-details.png" alt-text="Screenshot of more details for a time slice in the Table view pane.":::

## Service level
The service level view shows the attained service level of your workload visualized in your health model including the healthy, unknown, degraded and unhealthy states. Only unhealthy states are considered not attained.

:::image type="content" source="./media/health-model-service-level/health-model-resource-service-level-view-pane.png" lightbox="./media/health-model-service-level/health-model-resource-service-level-view-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Service level view pane selected.":::

The table in the upper right corner shows the configured **Service Level Objective**, the **Attained Service Level** and the **Remaining Error Budget**, which represents the difference between the attained and the configured Service Level.

:::image type="content" source="./media/health-model-service-level/health-model-service-level-details.png" lightbox="./media/health-model-service-level/health-model-service-level-details.png" alt-text="Screenshot of the health model service level details within the Service level view pane.":::

The target Service Level Objective is configured in the [Design view](./designer-view.md) on the root entity of your health model.

:::image type="content" source="./media/health-model-service-level/slo-target.png" lightbox="./media/health-model-service-level/slo-target.png" alt-text="Screenshot of configuring an SLO target on a health model root entity.":::

The command bar in the **Service level view** lets you define the time span the Service level is calculated for:

:::image type="content" source="./media/health-model-service-level/service-level-view-pane-command-bar-timespan.png" lightbox="./media/health-model-service-level/service-level-view-pane-command-bar-timespan.png" alt-text="Screenshot of the command bar within the Service level view pane with the Timespan dropdown selected.":::

It also tells you when there isn't enough data available:

:::image type="content" source="./media/health-model-service-level/service-level-view-pane-command-bar-not-enough-data.png" lightbox="./media/health-model-service-level/service-level-view-pane-command-bar-not-enough-data.png" alt-text="Screenshot that shows the command bar within the Service level view pane and the Not enough data message displayed.":::