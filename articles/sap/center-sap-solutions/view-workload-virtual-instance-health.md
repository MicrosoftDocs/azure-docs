---
title: Workload virtual instance health - Azure Workload Center for SAP
description: View the health of your workload virtual instance in Azure Monitor and learn how to track components, resources, and signals affecting its state.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# View health of a workload virtual instance

Select the relevant WVI (workload virtual instance) to see its health state in the **Essentials** section on the **Overview** page and a breakdown of health by components and resources in the properties section.

:::image type="content" source="media/workload-health/overview-health-state-essentials.png" alt-text="Screenshot of WVI Overview page showing Unhealthy health state and Workload health panel with component details." lightbox="media/workload-health/overview-health-state-essentials.png":::

## View health details

- To view the details of the workload health, select the health state in the overview section or select **Workload health** in the Table of Contents.

:::image type="content" source="media/workload-health/workload-health-timeline-view.png" alt-text="Screenshot of Workload health page showing Copilot summary and timeline of health states for CALDOVA_CHA components." lightbox="media/workload-health/workload-health-timeline-view.png":::

- **Summarize with Copilot** provides an overview of the WVI’s current health, including its components and resources, the signals influencing their health states, and other health events from the past 24 hours.

- The **Workload health** view shows the timeline of the Azure Monitor health model representing the WVI. This timeline helps you track changes in health state and see details of what components and resources led to health state changes for your workload.

- By default, the root entity of the model (representing the WVI) is visible, but you can expand it to see the different workload components and their resources.

- The default time range for the timeline view is last 24 hours but you can customize that range by using the **Timespan** filter.

- Select **View health model graph** to view the health model in graph view. This view shows the latest snapshot of the health model representing your workload including all the components and resources with the option to select a specific time in the past. You can also open the graph view in full screen by selecting **Manage Health model**.

:::image type="content" source="media/workload-health/workload-health-model-graph-view.png" alt-text="Screenshot of Azure health model graph view showing CALDOVA_CHA workload components with health status indicators." lightbox="media/workload-health/workload-health-model-graph-view.png":::

- Select any entity from the timeline or graph view to open the entity details pane. The entity details pane shows the current health state of the entity, its signals, its health history over time, and insights like alerts, resource health, and change analysis. The insights that are shown depend on the type of entity and what is configured. For more information about entity details, see [Health Models Entity Details](/azure/azure-monitor/health-models/analyze-health#entity-details).
