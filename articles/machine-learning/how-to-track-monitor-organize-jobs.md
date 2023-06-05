---
title: Organize & track training jobs (preview)
titleSuffix: Azure Machine Learning 
description: Learn how to organize and track your machine learning experiment jobs with the Azure Machine Learning studio. 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.custom: build-2023
ms.author: amipatel
author: amibp
ms.reviewer: sgilley
ms.date: 04/22/2023
ms.topic: how-to
---

# Organize & track training jobs (preview)

You can use the jobs list view in [Azure Machine Learning studio](https://ml.azure.com) to organize and track your jobs. By selecting a job, you can view and analyze its details, such as metrics, parameters, logs, and outputs. This way, you can keep track of your ML job history and ensure a transparent and reproducible ML development process.

This article shows how to do the following tasks:

* Edit job display name.
* Select and pin columns.
* Sort jobs
* Filter jobs
* Perform batch actions on jobs
* Tag jobs.

> [!TIP]
> * If you're looking for information on using the Azure Machine Learning SDK v1 or CLI v1, see [How to track, monitor, and analyze jobs (v1)](./v1/how-to-track-monitor-analyze-runs.md).
> * If you're looking for information on monitoring training jobs from the CLI or SDK v2, see [Track experiments with MLflow and CLI v2](how-to-use-mlflow-cli-runs.md).
> * If you're looking for information on monitoring the Azure Machine Learning service and associated Azure services, see [How to monitor Azure Machine Learning](monitor-azure-machine-learning.md).
> * If you're looking for information on monitoring models deployed to online endpoints, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

You'll need the following items:

* [!INCLUDE [prereq-workspace](includes/prereq-workspace.md)]

* Run one or more jobs in your workspace to have results available in the dashboard. Complete [Tutorial: Train a model in Azure Machine Learning](tutorial-train-model.md) if you don't have any jobs yet.

* Enable this preview feature via the preview panel.

    :::image type="content" source="media/how-to-visualize-jobs/enable-preview.png" alt-text="Screenshot shows enabling the preview feature.":::

## View jobs list

* Select **Jobs** on the left side navigation panel.
* Select either **All experiments** to view all the jobs in an experiment or select **All jobs** to view all the jobs submitted in the workspace.
* Select **List view** at the top to switch into **List view**.

## Job display name

The job display name is an optional and customizable name that you can provide for your job. You can edit this directly in your jobs list view by selecting the pencil icon when you move your mouse over a job name.

Customizing the name may help you organize and label your training jobs easily.

## Select and pin columns

Add, remove, reorder, and pin columns to customize your jobs list.  Select **Columns** to open the column options pane.

In column options, select columns to add or remove from the table. Drag columns to reorder how they appear in the table and pin any column to the left of the table, so you can view your important column information (i.e. display name, metric value) while scrolling horizontally.  

## Sort jobs

Sort your jobs list by your metric values (i.e. accuracy, loss, f-1 score) to identify the best performing job that meets your criteria.

To sort by multiple columns, hold the shift key and click column headers that you want to sort. Multiple sorts will help you rank your training results according to your criteria. 
 
At any point, manage your sorting preferences for your table in column options under **Columns** to add or remove columns and change sorting order. 

## Filter jobs

Filter your jobs list by selecting **Filters**. Use quick filters for **Status** and **Created** by as well as add specific filters to any column including metrics. 

Select **Add filter** to search or select a column of your preference.

Upon choosing your column, select what type of filter you want and the value. Apply changes and see the jobs list page update accordingly.

You can remove the filter you just applied from the job list if you no longer want it.  To edit your filters, simply navigate back to **Filters** to do so.  

## Perform actions on multiple jobs

Select multiple jobs in your jobs list and perform an action, such as cancel or delete, on them together.  

## Tag jobs

Tag your experiments with custom labels that will help you group and filter them later. To add tags to multiple jobs, select the jobs and then select the "Add tags" button at the top of the table.

## Custom View

To view your jobs in the studio:

1. Navigate to the **Jobs** tab.

1. Select either **All experiments** to view all the jobs in an experiment or select **All jobs** to view all the jobs submitted in the Workspace.

    In the **All jobs'** page, you can filter the jobs list by tags, experiments, compute target and more to better organize and scope your work.  

1. Make customizations to the page by selecting jobs to compare, adding charts or applying filters. These changes can be saved as a **Custom View** so you can easily return to your work. Users with workspace permissions can edit, or view the custom view. Also, share the custom view with team members for enhanced collaboration by selecting **Share view**.

## Next steps

* To learn how to visualize and analyze your experimentation results, see [visualize training results](how-to-visualize-jobs.md).
* To learn how to log metrics for your experiments, see [Log metrics during training jobs](how-to-log-view-metrics.md).
* To learn how to monitor resources and logs from Azure Machine Learning, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).
