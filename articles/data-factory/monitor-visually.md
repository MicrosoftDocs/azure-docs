---
title: Visually monitor Azure data factories | Microsoft Docs
description: Learn how to visually monitor Azure data factories
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/19/2018
---

# Visually monitor Azure data factories
Azure Data Factory is a cloud-based data integration service. You can use it to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. By using Azure Data Factory, you can:

- Create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores.
- Process/transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.
- Publish output data to data stores such as Azure SQL Data Warehouse for business intelligence (BI) applications to consume.

In this quickstart, you learn how to visually monitor Data Factory pipelines without writing a single line of code.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Monitor Data Factory pipelines

Monitor pipeline and activity runs with a simple list-view interface. All the runs are displayed in the browser's local time zone. If you change the time zone, all the date/time fields snap to the one that you selected.  

1. Start Microsoft Edge or Google Chrome. Currently, the Data Factory UI is supported only in those two web browsers.
2. Sign in to the  [Azure portal](https://portal.azure.com/).
3. Go to the blade for the created data factory in the Azure portal. Select the **Monitor & Manage** tile to start the Data Factory visual monitoring experience.

## Monitor pipeline runs
The list view shows each pipeline run for your Data Factory pipelines. It includes these columns:

| **Column name** | **Description** |
| --- | --- |
| Pipeline Name | Name of the pipeline |
| Actions | Single action available to view activity runs |
| Run Start | Start date and time for the pipeline run (MM/DD/YYYY, HH:MM:SS AM/PM) |
| Duration | Run duration (HH:MM:SS) |
| Triggered By | Manual trigger or scheduled trigger |
| Status | **Failed**, **Succeeded**, or **In Progress** |
| Parameters | Parameters for the pipeline run (name/value pairs) |
| Error | Pipeline run error (if any) |
| Run ID | ID of the pipeline run |

![List view for monitoring pipeline runs](media/monitor-visually/pipeline-runs.png)

## Monitor activity runs
The list view shows activity runs that correspond to each pipeline run. To view activity runs for each pipeline run, select the **Activity Runs** icon under the **Actions** column. The list view includes these columns:

| **Column name** | **Description** |
| --- | --- |
| Activity Name | Name of the activity inside the pipeline |
| Activity Type | Type of the activity, such as **Copy**, **HDInsightSpark**, or **HDInsightHive** |
| Run Start | Start date and time for the activity run (MM/DD/YYYY, HH:MM:SS AM/PM) |
| Duration | Run duration (HH:MM:SS) |
| Status | **Failed**, **Succeeded**, or **In Progress** |
| Input | JSON array that describes the activity inputs |
| Output | JSON array that describes the activity outputs |
| Error | Activity run error (if any) |

![List view for monitoring activity runs](media/monitor-visually/activity-runs.png)

> [!IMPORTANT]
> You need to select the **Refresh** button at the top to refresh the list of pipeline and activity runs. Auto-refresh is currently not supported.

![Refresh button](media/monitor-visually/refresh.png)

## Select a data factory to monitor
Hover over the **Data Factory** icon on the upper left. Select the arrow icon to see a list of azure subscriptions and data factories that you can monitor.

![Select the data factory](media/monitor-visually/select-datafactory.png)

## Configure the list view

### Apply rich ordering and filtering

Order pipeline runs in DESC/ASC according to the run start time. Filter pipeline runs by using the following columns:

| **Column name** | **Description** |
| --- | --- |
| Pipeline Name | Name of the pipeline. Options include quick filters for **Last 24 hours**, **Last week**, and **Last 30 days**. Or select a custom date and time. |
| Run Start | Start date and time for the pipeline run. |
| Run Status | Filter runs by status: **Succeeded**, **Failed**, or **In Progress**. |

![Options for filtering](media/monitor-visually/filter.png)

### Add or remove columns
Right-click the list view header and choose columns that you want to appear in the list view.

![Options for columns](media/monitor-visually/columns.png)

### Adjust column widths
Increase and decrease the column widths in the list view by hovering over the column header.

## Promote user properties to monitor

You can promote any pipeline activity property as a user property so that it becomes an entity that you can monitor. For example, you can promote the **Source** and **Destination** properties of the copy activity in your pipeline as user properties. You can also select **Auto Generate** to generate the **Source** and **Destination** user properties for a copy activity.

![Create user properties](media/monitor-visually/monitor-user-properties-image1.png)

> [!NOTE]
> You can only promote up to five pipeline activity properties as user properties.

After you create the user properties, you can monitor them in the monitoring list views. If the source for the copy activity is a table name, you can monitor the source table name as a column in the list view for activity runs.

![Activity runs list without user properties](media/monitor-visually/monitor-user-properties-image2.png)

![Add columns for user properties to the activity runs list](media/monitor-visually/monitor-user-properties-image3.png)

![Activity runs list with columns for user properties](media/monitor-visually/monitor-user-properties-image4.png)

## Rerun activities inside a pipeline

You can now rerun activities inside a pipeline. Select **View activity runs**, and then select the activity in your pipeline from which point you want to rerun your pipeline.

![View activity runs](media/monitor-visually/rerun-activities-image1.png)

![Select an activity run](media/monitor-visually/rerun-activities-image2.png)

### View rerun history

You can view the rerun history for all the pipeline runs in the list view.

![View history](media/monitor-visually/rerun-history-image1.png)

You can also view rerun history for a particular pipeline run.

![View history for a pipeline run](media/monitor-visually/rerun-history-image2.png)

## Gantt views

Use Gantt views to quickly visualize your pipelines and activity runs. You can look at the Gantt view per pipeline or group by annotations/tags that you have created on your pipelines.

![Example of a Gantt chart](media/monitor-visually/gantt1.png)

![Gantt chart annotations](media/monitor-visually/gantt2.png)

The length of the bar informs the duration of the pipeline. You can also select the bar to see more details.

![Gantt chart duration](media/monitor-visually/gantt3.png)

## Guided tours
Select the **Information** icon on the lower left. Then select **Guided Tours** to get step-by-step instructions on how to monitor your pipeline and activity runs.

![Guided tours](media/monitor-visually/guided-tours.png)

## Feedback
Select the **Feedback** icon to give us feedback on various features or any issues that you might be facing.

![Feedback](media/monitor-visually/feedback.png)

## Alerts

You can raise alerts on supported metrics in Data Factory. Select **Monitor** > **Alerts & Metrics** on the Data Factory monitoring page to get started.

![Data factory Monitor page](media/monitor-visually/alerts01.png)

For a seven-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/shows/azure-friday/Monitor-your-Azure-Data-Factory-pipelines-proactively-with-alerts/player]

### Create alerts

1.  Select **New Alert Rule** to create a new alert.

    ![New Alert Rule button](media/monitor-visually/alerts02.png)

1.  Specify the rule name and select the alert severity.

    ![Boxes for rule name and severity](media/monitor-visually/alerts03.png)

1.  Select the alert criteria.

    ![Box for target criteria](media/monitor-visually/alerts04.png)

    ![List of criteria](media/monitor-visually/alerts05.png)

1.  Configure the alert logic. You can create an alert for the selected metric for all pipelines and corresponding activities. You can also select a particular activity type, activity name, pipeline name, or failure type.

    ![Options for configuring alert logic](media/monitor-visually/alerts06.png)

1.  Configure email, SMS, push, and voice notifications for the alert. Create an action group, or choose an existing one, for the alert notifications.

    ![Options for configuring notifications](media/monitor-visually/alerts07.png)

    ![Options for adding a notification](media/monitor-visually/alerts08.png)

1.  Create the alert rule.

    ![Options for creating an alert rule](media/monitor-visually/alerts09.png)

## Next steps

To learn about monitoring and managing pipelines, see the [Monitor and manage pipelines programmatically](https://docs.microsoft.com/azure/data-factory/monitor-programmatically) article.
