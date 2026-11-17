---
title: View health of a WVI
titleSuffix: Azure Workload Center for Oracle
description: Learn how to view the health of an Oracle workload, its components, and its resources.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# View health of a WVI

Open the *Workload Virtual Instance (WVI)*. The **Overview** page shows the health state in the **Essentials** section, and the health of the components and resources under **Workload health**. If the health state shows, workload health is enabled.

## View health details

1.  Select the health state on the **Overview** page, or select **Workload health** in the menu.

2.  Under **Summarize with Copilot**, select **Generate**. The summary describes the current health of the WVI, its components, and its resources. It also lists the signals that affect their health and the health events of the last 24 hours.

:::image type="content" source="media/view-workload-health/workload-health-page.png" alt-text="Screenshot that shows the Workload health page of a WVI with Summarize with Copilot, Manage Health model, and View health model graph." lightbox="media/view-workload-health/workload-health-page.png":::

3.  Review the timeline. It shows the health of the WVI over time, so you can see when the health changed and which component or resource caused it. The default range is the last 24 hours. To change it, use the **Timespan** filter.

4.  Expand the root entity to see each component and its resources. For an Exadata system, the CDBs and PDBs show under the Database Services component.

:::image type="content" source="media/view-workload-health/health-summary-timeline.png" alt-text="Screenshot that shows a Copilot health summary and the health timeline with the Database Services component expanded." lightbox="media/view-workload-health/health-summary-timeline.png":::

## View the health graph

Select **View health model graph**. The graph shows the latest state of each entity and how health rolls up to the WVI. You can select a time in the past. To open the graph in full screen, select **Manage Health model** and use the health model resource.

## View entity details

Select an entity in the timeline or the graph. The details pane shows the current health state of the entity, its health history, its signals, and insights such as alerts, resource health, and changes. The insights depend on the entity type and what is configured. For more information, see [Entity details](/azure/azure-monitor/health-models/analyze-health#entity-details).

:::image type="content" source="media/view-workload-health/entity-details.png" alt-text="Screenshot that shows the details pane of an entity with its health state, impact, dependencies configuration, and history." lightbox="media/view-workload-health/entity-details.png":::

For example, an Exadata VM cluster has signals for metrics such as CPU and storage utilization. Each signal shows its Degraded and Unhealthy thresholds and its current result.

:::image type="content" source="media/view-workload-health/entity-signals.png" alt-text="Screenshot that shows the signals of an Exadata VM cluster entity with their thresholds and current results." lightbox="media/view-workload-health/entity-signals.png":::
