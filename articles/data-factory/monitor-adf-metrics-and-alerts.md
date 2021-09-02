---
title: Data Factory metrics 
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

To access the metrics, complete the instructions in [Azure Monitor data platform](../azure-monitor/data-platform.md).

> [!NOTE]
> Only events from completed, triggered activity and pipeline runs are emitted. In progress and debug runs are **not** emitted. On the other hand, events from **all** SSIS package executions are emitted, including those that are completed and in progress, regardless of their invocation methods. For example, you can invoke package executions on Azure-enabled SQL Server Data Tools (SSDT), via T-SQL on SSMS, SQL Server Agent, or other designated tools, and as triggered or debug runs of Execute SSIS Package activities in ADF pipelines.

## Data Factory Alerts

Sign in to the Azure portal and select **Monitor** > **Alerts** to create alerts.

![Alerts in the portal menu](media/monitor-using-azure-monitor/alerts_image3.png)

### Create Alerts

1. Select **+ New Alert rule** to create a new alert.

    ![New alert rule](media/monitor-using-azure-monitor/alerts_image4.png)

1. Define the alert condition.

    > [!NOTE]
    > Make sure to select **All** in the **Filter by resource type** drop-down list.

    !["Define alert condition" > "Select target", which opens the "Select a resource" pane ](media/monitor-using-azure-monitor/alerts_image5.png)

    !["Define alert condition" >" Add criteria", which opens the "Configure signal logic" pane](media/monitor-using-azure-monitor/alerts_image6.png)

    !["Configure signal type" pane](media/monitor-using-azure-monitor/alerts_image7.png)

1. Define the alert details.

    ![Alert details](media/monitor-using-azure-monitor/alerts_image8.png)

1. Define the action group.

    ![Create a rule, with "New Action group" highlighted](media/monitor-using-azure-monitor/alerts_image9.png)

    ![Create a new action group](media/monitor-using-azure-monitor/alerts_image10.png)

    ![Configure email, SMS, push, and voice](media/monitor-using-azure-monitor/alerts_image11.png)

    ![Define an action group](media/monitor-using-azure-monitor/alerts_image12.png)

## Next Steps
[Setup diagnostic logs via the Azure Monitor REST API](monitor-adf-logs-with-rest.md)