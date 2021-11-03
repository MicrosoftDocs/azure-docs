---
title: Data Factory metrics and alerts
description: Learn about metrics available for monitoring Azure Data Factory.
author: minhe-msft
ms.author: hemin
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 09/02/2021
---

# Data Factory metrics and alerts

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Azure Data Factory provides the following metrics and alerts to enable monitoring of the service.

## Data Factory metrics

With Monitor, you can gain visibility into the performance and health of your Azure workloads. The most important type of Monitor data is the metric, which is also called the performance counter. Metrics are emitted by most Azure resources. Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

Here are some of the metrics emitted by Azure Data Factory version 2:

| **Metric**                           | **Metric display name**                  | **Unit** | **Aggregation type** | **Description**                |
|--------------------------------------|------------------------------------------|----------|----------------------|--------------------------------|
| ActivityCancelledRuns                 | Cancelled activity runs metrics           | Count    | Total                | The total number of activity runs that were cancelled within a minute window. |
| ActivityFailedRuns                   | Failed activity runs metrics             | Count    | Total                | The total number of activity runs that failed within a minute window. |
| ActivitySucceededRuns                | Succeeded activity runs metrics          | Count    | Total                | The total number of activity runs that succeeded within a minute window. |
| PipelineCancelledRuns                 | Cancelled pipeline runs metrics           | Count    | Total                | The total number of pipeline runs that were cancelled within a minute window. |
| PipelineFailedRuns                   | Failed pipeline runs metrics             | Count    | Total                | The total number of pipeline runs that failed within a minute window. |
| PipelineSucceededRuns                | Succeeded pipeline runs metrics          | Count    | Total                | The total number of pipeline runs that succeeded within a minute window. |
| TriggerCancelledRuns                  | Cancelled trigger runs metrics            | Count    | Total                | The total number of trigger runs that were cancelled within a minute window. |
| TriggerFailedRuns                    | Failed trigger runs metrics              | Count    | Total                | The total number of trigger runs that failed within a minute window. |
| TriggerSucceededRuns                 | Succeeded trigger runs metrics           | Count    | Total                | The total number of trigger runs that succeeded within a minute window. |
| SSISIntegrationRuntimeStartCancelled  | Cancelled SSIS integration runtime start metrics           | Count    | Total                | The total number of SSIS integration runtime starts that were cancelled within a minute window. |
| SSISIntegrationRuntimeStartFailed    | Failed SSIS integration runtime start metrics             | Count    | Total                | The total number of SSIS integration runtime starts that failed within a minute window. |
| SSISIntegrationRuntimeStartSucceeded | Succeeded SSIS integration runtime start metrics          | Count    | Total                | The total number of SSIS integration runtime starts that succeeded within a minute window. |
| SSISIntegrationRuntimeStopStuck      | Stuck SSIS integration runtime stop metrics               | Count    | Total                | The total number of SSIS integration runtime stops that were stuck within a minute window. |
| SSISIntegrationRuntimeStopSucceeded  | Succeeded SSIS integration runtime stop metrics           | Count    | Total                | The total number of SSIS integration runtime stops that succeeded within a minute window. |
| SSISPackageExecutionCancelled         | Cancelled SSIS package execution metrics  | Count    | Total                | The total number of SSIS package executions that were cancelled within a minute window. |
| SSISPackageExecutionFailed           | Failed SSIS package execution metrics    | Count    | Total                | The total number of SSIS package executions that failed within a minute window. |
| SSISPackageExecutionSucceeded        | Succeeded SSIS package execution metrics | Count    | Total                | The total number of SSIS package executions that succeeded within a minute window. |
| PipelineElapsedTimeRuns | Elapsed time pipeline runs metrics | Count | Total | Number of times, within a minute window, a pipelines runs longer than user-defined expected duration. [(See more)](tutorial-operationalize-pipelines.md) |

To access the metrics, complete the instructions in [Azure Monitor data platform](../azure-monitor/data-platform.md).

> [!NOTE]
> With the exception of _PipelineElapsedTimeRuns_, only events from completed, triggered activity and pipeline runs are emitted. In progress and debug runs are **not** emitted. On the other hand, events from **all** SSIS package executions are emitted, including those that are completed and in progress, regardless of their invocation methods. For example, you can invoke package executions on Azure-enabled SQL Server Data Tools (SSDT), via T-SQL on SSMS, SQL Server Agent, or other designated tools, and as triggered or debug runs of Execute SSIS Package activities in ADF pipelines.

## Data Factory Alerts

Sign in to the Azure portal and select **Monitor** > **Alerts** to create alerts.

:::image type="content" source="media/monitor-using-azure-monitor/alerts_image3.png" alt-text="Alerts in the portal menu":::

### Create Alerts

1. Select **+ New Alert rule** to create a new alert.

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image4.png" alt-text="New alert rule":::

1. Define the alert condition.

    > [!NOTE]
    > Make sure to select **All** in the **Filter by resource type** drop-down list.

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image5.png" alt-text="&quot;Define alert condition&quot; > &quot;Select target&quot;, which opens the &quot;Select a resource&quot; pane ":::

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image6.png" alt-text="&quot;Define alert condition&quot; > &quot;Add criteria&quot;, which opens the &quot;Configure signal logic&quot; pane":::

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image7.png" alt-text="&quot;Configure signal type&quot; pane":::

1. Define the alert details.

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image8.png" alt-text="Alert details":::

1. Define the action group.

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image9.png" alt-text="Create a rule, with &quot;New Action group&quot; highlighted":::

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image10.png" alt-text="Create a new action group":::

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image11.png" alt-text="Configure email, SMS, push, and voice":::

    :::image type="content" source="media/monitor-using-azure-monitor/alerts_image12.png" alt-text="Define an action group":::

## Next Steps

[Configure diagnostics settings and workspace](monitor-configure-diagnostics.md)
