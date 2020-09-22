---
title: Visually monitor Azure Data Factory 
description: Learn how to visually monitor Azure data factories
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 06/30/2020
---

# Visually monitor Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Once you've created and published a pipeline in Azure Data Factory, you can associate it with a trigger or manually kick off an ad hoc run. You can monitor all of your pipeline runs natively in the Azure Data Factory user experience. To open the monitoring experience, select the **Monitor & Manage** tile in the data factory blade of the [Azure portal](https://portal.azure.com/). If you're already in the ADF UX, click on the **Monitor** icon on the left sidebar.

All data factory runs are displayed in the browser's local time zone. If you change the time zone, all the date/time fields snap to the one that you selected.

## Monitor pipeline runs

The default monitoring view is list of pipeline runs in the selected time period. The following columns are displayed:

| **Column name** | **Description** |
| --- | --- |
| Pipeline Name | Name of the pipeline |
| Actions | Icons that allow you to view activity details, cancel, or rerun the pipeline |
| Run Start | Start date and time for the pipeline run (MM/DD/YYYY, HH:MM:SS AM/PM) |
| Duration | Run duration (HH:MM:SS) |
| Triggered By | The name of the trigger that started the pipeline |
| Status | **Failed**, **Succeeded**, **In Progress**, **Canceled**, or **Queued** |
| Annotations | Filterable tags associated with a pipeline  |
| Parameters | Parameters for the pipeline run (name/value pairs) |
| Error | If the pipeline failed, the run error |
| Run ID | ID of the pipeline run |

![List view for monitoring pipeline runs](media/monitor-visually/pipeline-runs.png)

You need to manually select the **Refresh** button to refresh the list of pipeline and activity runs. Autorefresh is currently not supported.

![Refresh button](media/monitor-visually/refresh.png)

## Monitor activity runs

To view activity runs for each pipeline run, select the **View activity runs** icon under the **Actions** column. The list view shows activity runs that correspond to each pipeline run.

| **Column name** | **Description** |
| --- | --- |
| Activity Name | Name of the activity inside the pipeline |
| Activity Type | Type of the activity, such as **Copy**, **ExecuteDataFlow**, or **AzureMLExecutePipeline** |
| Actions | Icons that allow you to see JSON input information, JSON output information, or detailed activity-specific monitoring experiences | 
| Run Start | Start date and time for the activity run (MM/DD/YYYY, HH:MM:SS AM/PM) |
| Duration | Run duration (HH:MM:SS) |
| Status | **Failed**, **Succeeded**, **In Progress**, or **Canceled** |
| Integration Runtime | Which Integration Runtime the activity was run on |
| User Properties | User-defined properties of the activity |
| Error | If the activity failed, the run error |
| Run ID | ID of the activity run |

![List view for monitoring activity runs](media/monitor-visually/activity-runs.png)

### Promote user properties to monitor

Promote any pipeline activity property as a user property so that it becomes an entity that you monitor. For example, you can promote the **Source** and **Destination** properties of the copy activity in your pipeline as user properties. Select **Auto Generate** to generate the **Source** and **Destination** user properties for a copy activity.

![Create user properties](media/monitor-visually/monitor-user-properties-image1.png)

> [!NOTE]
> You can only promote up to five pipeline activity properties as user properties.

After you create the user properties, you can monitor them in the monitoring list views. If the source for the copy activity is a table name, you can monitor the source table name as a column in the list view for activity runs.

![Activity runs list without user properties](media/monitor-visually/monitor-user-properties-image2.png)

![Add columns for user properties to the activity runs list](media/monitor-visually/monitor-user-properties-image3.png)

![Activity runs list with columns for user properties](media/monitor-visually/monitor-user-properties-image4.png)

## Configure the list view

### Order and filter

Toggle whether pipeline runs will be in descending or ascending according to the run start time. Filter pipeline runs by using the following columns:

| **Column name** | **Description** |
| --- | --- |
| Pipeline Name | Filter by the name of the pipeline. |
| Run Start |  Determine the time range of the pipeline runs displayed. Options include quick filters for **Last 24 hours**, **Last week**, and **Last 30 days** or to select a custom date and time. |
| Run Status | Filter runs by status: **Succeeded**, **Failed**, **Queued**, **Canceled**, or **In Progress**. |
| Annotations | Filter by tags applied to each pipeline |
| Runs | Filter whether you want to see reran pipelines |

![Options for filtering](media/monitor-visually/filter.png)

### Add or remove columns
Right-click the list view header and choose columns that you want to appear in the list view.

![Options for columns](media/monitor-visually/columns.png)

### Adjust column widths
Increase and decrease the column widths in the list view by hovering over the column header.

## Rerun activities inside a pipeline

You can rerun activities inside a pipeline. Select **View activity runs**, and then select the activity in your pipeline from which point you want to rerun your pipeline.

![View activity runs](media/monitor-visually/rerun-activities-image1.png)

![Select an activity run](media/monitor-visually/rerun-activities-image2.png)

### Rerun from failed activity

If an activity fails, times out, or is canceled, you can rerun the pipeline from that failed activity by selecting **Rerun from failed activity**.

![Rerun failed activity](media/monitor-visually/rerun-failed-activity.png)

### View rerun history

You can view the rerun history for all the pipeline runs in the list view.

![View history](media/monitor-visually/rerun-history-image1.png)

You can also view rerun history for a particular pipeline run.

![View history for a pipeline run](media/monitor-visually/rerun-history-image2.png)

## Monitor consumption

You can see the resources consumed by a pipeline run by clicking the consumption icon next to the run. 

![Monitor consumption](media/monitor-visually/monitor-consumption-1.png)

Clicking the icon opens a consumption report of resources used by that pipeline run. 

![Monitor consumption](media/monitor-visually/monitor-consumption-2.png)

You can plug these values into the [Azure pricing calculator](https://azure.microsoft.com/pricing/details/data-factory/) to estimate the cost of the pipeline run. For more information on Azure Data Factory pricing, see [Understanding pricing](pricing-concepts.md).

> [!NOTE]
> These values returned by the pricing calculator is an estimate. It doesn't reflect the exact amount you will be billed by Azure Data Factory 

## Gantt views

Use Gantt views to quickly visualize your pipelines and activity runs.

![Example of a Gantt chart](media/monitor-visually/gantt1.png)

You can look at the Gantt view per pipeline or group by annotations/tags that you've created on your pipelines.

![Gantt chart annotations](media/monitor-visually/gantt2.png)

The length of the bar informs the duration of the pipeline. You can also select the bar to see more details.

![Gantt chart duration](media/monitor-visually/gantt3.png)

## Guided tours
Select the **Information** icon on the lower left. Then select **Guided Tours** to get step-by-step instructions on how to monitor your pipeline and activity runs.

![Guided tours](media/monitor-visually/guided-tours.png)

## Alerts

You can raise alerts on supported metrics in Data Factory. Select **Monitor** > **Alerts & metrics** on the Data Factory monitoring page to get started.

![Data factory Monitor page](media/monitor-visually/start-page.png)

For a seven-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/shows/azure-friday/Monitor-your-Azure-Data-Factory-pipelines-proactively-with-alerts/player]

### Create alerts

1.  Select **New alert rule** to create a new alert.

    ![New Alert Rule button](media/monitor-visually/new-alerts.png)

1.  Specify the rule name and select the alert severity.

    ![Boxes for rule name and severity](media/monitor-visually/name-and-severity.png)

1.  Select the alert criteria.

    ![Box for target criteria](media/monitor-visually/add-criteria-1.png)

    ![List of criteria](media/monitor-visually/add-criteria-2.png)

    ![List of criteria](media/monitor-visually/add-criteria-3.png)

    You can create alerts on various metrics, including those for ADF entity count/size, activity/pipeline/trigger runs, Integration Runtime (IR) CPU utilization/memory/node count/queue, as well as for SSIS package executions and SSIS IR start/stop operations.

1.  Configure the alert logic. You can create an alert for the selected metric for all pipelines and corresponding activities. You can also select a particular activity type, activity name, pipeline name, or failure type.

    ![Options for configuring alert logic](media/monitor-visually/alert-logic.png)

1.  Configure email, SMS, push, and voice notifications for the alert. Create an action group, or choose an existing one, for the alert notifications.

    ![Options for configuring notifications](media/monitor-visually/configure-notification-1.png)

    ![Options for adding a notification](media/monitor-visually/configure-notification-2.png)

1.  Create the alert rule.

    ![Options for creating an alert rule](media/monitor-visually/create-alert-rule.png)

## Next steps

To learn about monitoring and managing pipelines, see the [Monitor and manage pipelines programmatically](https://docs.microsoft.com/azure/data-factory/monitor-programmatically) article.
