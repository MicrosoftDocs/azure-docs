---
title: View state of Azure Monitor health model (preview)
description: Desdcribes the different views available to view the health state of your Azure Monitor health models and their included entities.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# View state of Azure Monitor health model (preview)

## Graph view
The graph view shows the latest snapshot of a health model with its full structure displayed and the current state of each node. The **Generated** timestamp on the top right specifies when the snapshot was taken and the current refresh interval for the model.

:::image type="content" source="./media/views/health-model-resource-graph-view-pane.png" lightbox="./media/views/health-model-resource-graph-view-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Graph pane selected.":::

## Entity details

Hover over an entity view its type and current health state. Click on an entity to view its detail. 
When you click on an entity, you can see more detail like its health state history.

:::image type="content" source="./media/views/graph-tab-entity-detail.png" lightbox="./media/health-model-snapshot-graph/views.png" alt-text="Screenshot of the Entity detail dialog for a health model resource in the Azure portal.":::

| Section | Description |
|:---|:---|
| Entity health history | Graphical history of the health of this entity over time. Click the time range to specify another time range. The time grain is set automatically based on the length of the time range. |
| Metric signals | List of any metric signals for the entity and their last result and health state. Click on a metric to open it in metrics explorer for further analysis.<br>Only displayed for entities with metric signals.|
| Log signals | List of any log signals for the entity and their last result and health state. <br>Only displayed for entities with log signals.|
| Triggered alerts | Displays any active alerts for the entity from the last 24 hours. Azure resource will have a tab for **Health model** and **Azure resource** alerts. Aggregation entities will have a tab only for **Health model** alerts.|
| Azure resource health | Current [Azure Resource health](../../service-health/overview.md) status of the entity. |
| Azure resource health events | List of any [Azure Resource health](../../service-health/overview.md) events for the entity.


### Snapshot history

Click **History** at the top of the graph view to see a history of snapshots for the health model. The history shows the time of the snapshot and the number of entities in the model at that time. Select a snapshot and click **Open snapshot** to view it in the graph view.


## Timeline view


## Next steps

