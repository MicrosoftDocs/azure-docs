---
title: Data Factory metrics and alerts
description: This article shows you how to create monitoring alerts for metrics available for Azure Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 03/18/2024
---

# Data Factory metrics and alerts

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Azure Data Factory provides the following metrics and alerts to enable monitoring of the service.

## Data Factory metrics

With Azure Monitor, you can gain visibility into the performance and health of your Azure workloads. The most important type of Monitor data is the metric, which is also called the performance counter. Metrics are emitted by most Azure resources. Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

Here are some of the metrics emitted by Azure Data Factory version 2.

| **Metric**                           | **Metric display name**                  | **Unit** | **Aggregation type** | **Description**                |
|--------------------------------------|------------------------------------------|----------|----------------------|--------------------------------|
| ActivityCancelledRuns                 | Canceled activity runs metrics           | Count    | Total                | The total number of activity runs that were canceled within a minute window. |
| ActivityFailedRuns                   | Failed activity runs metrics             | Count    | Total                | The total number of activity runs that failed within a minute window. |
| ActivitySucceededRuns                | Succeeded activity runs metrics          | Count    | Total                | The total number of activity runs that succeeded within a minute window. |
| PipelineCancelledRuns                 | Canceled pipeline runs metrics           | Count    | Total                | The total number of pipeline runs that were canceled within a minute window. |
| PipelineFailedRuns                   | Failed pipeline runs metrics             | Count    | Total                | The total number of pipeline runs that failed within a minute window. |
| PipelineSucceededRuns                | Succeeded pipeline runs metrics          | Count    | Total                | The total number of pipeline runs that succeeded within a minute window. |
| TriggerCancelledRuns                  | Canceled trigger runs metrics            | Count    | Total                | The total number of trigger runs that were canceled within a minute window. |
| TriggerFailedRuns                    | Failed trigger runs metrics              | Count    | Total                | The total number of trigger runs that failed within a minute window. |
| TriggerSucceededRuns                 | Succeeded trigger runs metrics           | Count    | Total                | The total number of trigger runs that succeeded within a minute window. |
| SSISIntegrationRuntimeStartCancelled  | Canceled SSIS integration runtime start metrics           | Count    | Total                | The total number of SSIS integration runtime starts that were canceled within a minute window. |
| SSISIntegrationRuntimeStartFailed    | Failed SSIS integration runtime start metrics             | Count    | Total                | The total number of SSIS integration runtime starts that failed within a minute window. |
| SSISIntegrationRuntimeStartSucceeded | Succeeded SSIS integration runtime start metrics          | Count    | Total                | The total number of SSIS integration runtime starts that succeeded within a minute window. |
| SSISIntegrationRuntimeStopStuck      | Stuck SSIS integration runtime stop metrics               | Count    | Total                | The total number of SSIS integration runtime stops that were stuck within a minute window. |
| SSISIntegrationRuntimeStopSucceeded  | Succeeded SSIS integration runtime stop metrics           | Count    | Total                | The total number of SSIS integration runtime stops that succeeded within a minute window. |
| SSISPackageExecutionCancelled         | Canceled SSIS package execution metrics  | Count    | Total                | The total number of SSIS package executions that were canceled within a minute window. |
| SSISPackageExecutionFailed           | Failed SSIS package execution metrics    | Count    | Total                | The total number of SSIS package executions that failed within a minute window. |
| SSISPackageExecutionSucceeded        | Succeeded SSIS package execution metrics | Count    | Total                | The total number of SSIS package executions that succeeded within a minute window. |
| PipelineElapsedTimeRuns | Elapsed time pipeline runs metrics | Count | Total | Number of times, within a minute window, a pipeline runs longer than user-defined expected duration. [(See more.)](tutorial-operationalize-pipelines.md) |
| IntegrationRuntimeAvailableMemory       | Available memory for integration runtime | Byte    | Total                | The total number of bytes of available memory for the self-hosted integration runtime within a minute window. |
| IntegrationRuntimeAvailableNodeNumber       | Available nodes for integration runtime | Count    | Total                | The total number of nodes available for the self-hosted integration runtime within a minute window. |
| IntegrationRuntimeCpuPercentage       | CPU utilization for integration runtime | Percent    | Total                | The percentage of CPU utilization for the self-hosted integration runtime within a minute window. |
| IntegrationRuntimeAverageTaskPickupDelay      | Queue duration for integration runtime | Seconds    | Total                | The queue duration for the self-hosted integration runtime within a minute window. |
| IntegrationRuntimeQueueLength     | Queue length for integration runtime | Count    | Total                | The total queue length for the self-hosted integration runtime within a minute window. |
| Maximum allowed entities count | Maximum number of entities | Count | Total | The maximum number of entities in the Azure Data Factory instance. |
| Maximum allowed factory size (GB unit) | Maximum size of entities | Gigabyte | Total | The maximum size of entities in the Azure Data Factory instance. |
| Total entities count | Total number of entities | Count | Total | The total number of entities in the Azure Data Factory instance. |
| Total factory size (GB unit) | Total size of entities | Gigabyte | Total | The total size of entities in the Azure Data Factory instance. |

For service limits and quotas, see [quotas and limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-data-factory-limits).
To access the metrics, complete the instructions in [Azure Monitor data platform](../azure-monitor/data-platform.md).

> [!NOTE]
> Except for _PipelineElapsedTimeRuns_, only events from completed, triggered activity and pipeline runs are emitted. In-progress and debug runs are *not* emitted. On the other hand, events from *all* SSIS package executions are emitted, including those that are completed and in progress, regardless of their invocation methods. For example, you can invoke package executions on Azure-enabled SQL Server Data Tools, via T-SQL on SQL Server Management Studio, SQL Server Agent, or other designated tools, and as triggered or debug runs of Execute SSIS Package activities in Data Factory pipelines.

## Data Factory alerts

Sign in to the Azure portal, and use the main menu at the top left of the screen to select **Monitor**, and then **Alerts** to create alerts.

:::image type="content" source="media/monitor-using-azure-monitor/monitor.png" alt-text="Screenshot that shows the Monitoring tab in the Azure portal menu.":::

:::image type="content" source="media/monitor-using-azure-monitor/alerts.png" alt-text="Screenshot showing the Alerts section in the Monitor page for Azure.":::

### Create alerts

1. Select **+ Create** and **Alert rule** to create a new alert.

    :::image type="content" source="media/monitor-using-azure-monitor/create-alert-rule.png" alt-text="Screenshot that shows where to create a new alert rule.":::

1. Select the **Scope** and browse to find the data factory instance you want to create the alert for.

   :::image type="content" source="media/monitor-using-azure-monitor/select-scope.png" alt-text="Screenshot showing where to select the scope for a new alert rule.":::

1. Next, select the **Condition** tab and define the alert condition, then select **Next: Actions**.

   :::image type="content" source="media/monitor-using-azure-monitor/select-condition.png" alt-text="Screenshot that shows the definition of the alert condition.":::

1. On the **Basics** tab, select an existing action group or create a new one.

   > [!NOTE]
   > The action group must be created within the same resource group as the data factory instance in order to be available for use from the data factory.

   :::image type="content" source="media/monitor-using-azure-monitor/create-actions.png" alt-text="Screenshot that shows where to select or create an action group for the alert.":::

   :::image type="content" source="media/monitor-using-azure-monitor/create-action-group.png" alt-text="Screenshot showing where the Create action group screen.":::

1. You can define email or SMS notifications if you need, on the **Notfications** tab, but this step is optional. To define actions within the action group, select the **Actions** tab and configure any of the **Action type** options you need. This step is also optional. Once you're done configuring notifications or actions for the action group, select **Review + create**.

   :::image type="content" source="media/monitor-using-azure-monitor/define-actions.png" alt-text="Screenshot showing where to define actions for your action group.":::

1. On the **Review + create** tab, review your action group definition and select **Create** to finish.

   :::image type="content" source="media/monitor-using-azure-monitor/review-create-action-group.png" alt-text="Screenshot showing the Review + create tab for the newly created action group.":::

## Related content

[Configure diagnostics settings and workspace](monitor-configure-diagnostics.md)
