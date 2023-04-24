---
title: Visualize training results in studio (preview)
titleSuffix: Azure Machine Learning 
description: Learn how to visualize your machine learning experiment jobs with the Azure Machine Learning studio. 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: amipatel
author: amibp
ms.reviewer: sgilley
ms.date: 04/22/2023
ms.topic: how-to
ms.custom: devx-track-python, event-tier1-build-2022
---

# Visualize training results in studio (preview)

A combination of different tiles – chart visualizations, comparison table, markdown, and more come together into a dashboard view that is dynamic, flexible, and customizable for you to explore your experimentation results.  

This will help you save time, keep your results organized, and make informed decisions such as whether to re-train or deploy your model. 

This article will show you how to utilize your dashboard with the following tasks: 

* Explore the dashboard view.
* Change job colors. 
* Visualize training jobs. 
* Add charts.
* Edit charts. 
* Compare training jobs using Compare tile.
* Monitor your resources across jobs.
* Add markdown tile.
* Create and save custom views. 

> [!TIP]
> * If you're looking for information on using the Azure Machine Learning SDK v1 or CLI v1, see [How to track, monitor, and analyze jobs (v1)](./v1/how-to-track-monitor-analyze-runs.md).
> * If you're looking for information on monitoring training jobs from the CLI or SDK v2, see [Track experiments with MLflow and CLI v2](how-to-use-mlflow-cli-runs.md).
> * If you're looking for information on monitoring the Azure Machine Learning service and associated Azure services, see [How to monitor Azure Machine Learning](monitor-azure-machine-learning.md).
>
> If you're looking for information on monitoring models deployed to online endpoints, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

You'll need the following items:

* To use Azure Machine Learning, you must have an Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* You must have an Azure Machine Learning workspace. A workspace is created in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

To get started, we will need to enable the feature via the preview panel.

## Explore the dashboard view
Next, let's view your jobs in the studio:

- Navigate to the Jobs tab.
- Select either All experiments to view all the jobs in an experiment or select All jobs to view all the jobs submitted in the Workspace.

If you select All jobs, you will land on the List view where you can narrow down your jobs list to a group of jobs that you want to evaluate and compare using the filter capabilities. After doing so you can select Dashboard view in the top right to switch view

You are now on the default dashboard view where you will find your job list consolidated into the left side bar and dashboard content on the right.

If you select a specific experiment, then you will automatically land into the Dashboard view.

### Jobs list view

The left side bar is a collapsed view of your jobs list. You can filter, add columns, and pin columns by clicking the respective icon next to the search bar. 

By pinning columns, you can simplify your list view to only show columns you pinned. You can also change the width on the jobs list to either view more or less.

:::image type="content" source="media/how-to-visualize-jobs/jobs-list-in-dashboard-view.gif" alt-text="Screenshot of how to filter, add and pin columns, and edit the jobs list in dashboard view.":::

For sweep and automl jobs, you can easily identify the best trial and best model with the **Best** label positioned next to the appropriate job display name. This will simplify comparisons across these

### Sections
The dashboard is made up of sections that can be used to organize different tiles and information. 

By default, you can find all of your logged training metrics in Custom metrics section and resource usage in Resource metrics section. 

You can update the section name by clicking on the pencil icon when hovering on the section name. 

You can also move sections up and down as well as remove sections that you no longer need.

Hide/Show Tiles and Order Tiles in Section 

:::image type="content" source="media/how-to-visualize-jobs/sections-in-dashboard-view.gif" alt-text="Screenshot of how to organize sections in dashboard view.":::

### Tiles
Tiles are various forms of content such as line chart, bar chart, scatter plot, and markdown that can be added to a section to build a dashboard. 

By default, the Custom metrics and Resource metrics section will generate chart tiles for each of the metrics. 

To easily find the tile with the metric you care most about, you can use the search bar to search for specific tiles based on metric names you logged.

Search Tiles 

:::image type="content" source="media/how-to-visualize-jobs/tiles-in-dashboard-view.gif" alt-text="Screenshot of how to search and add tiles in dashboard view.":::


## Change job colors

Each job that is visualized in your dashboard is assigned a color by default from the system color palette.

You can either stick to the colors assigned or take advantage of the color picker to easily change between the colors of the jobs displayed in the charts.  

To open the color picker, simply select the colored dot next to the job and change color via the palette, RGB, or hex code. 

:::image type="content" source="media/how-to-visualize-jobs/change-job-color.gif" alt-text="Screenshot of how to change job color."::: 

## Visualize jobs 

Click on the eye icon to show or hide jobs in the dashboard view and narrow down on results that matter most to you. This provides more flexibility for you to maintain your job list and explore different groups of jobs to visualize. 

To reduce the list to show only jobs that are visualized in the dashboard, click on the eye at the top to **Show only visualize**. 

To reset and start choosing a new set of jobs to visualize, you can click on the eye at the top to **Visualize None** to remove all jobs from surfacing in the dashboard and then go ahead and select the new set of jobs.

 :::image type="content" source="media/how-to-visualize-jobs/visualize-jobs.gif" alt-text="Screenshot of how to visualize jobs in dashboard view.":::


## Add charts 

You can create a custom chart to add to your dashboard view if you’re looking to plot a set of metrics or specific style. Azure Machine Learning Studio supports line, bar, scatter, and parallel coordinates charts for you to add to your view. 

:::image type="content" source="media/how-to-visualize-jobs/add-bar-chart-to-dashboard.gif" alt-text="Screenshot of how to add a bar chart to your dashboard view.":::

## Edit charts 

You can add data smoothing, ignore outliers, and change the x-axis for all the charts in your dashboard view through the global chart editor.  

You can perform these actions for an individual chart as well by clicking on the pencil icon to customize specific charts to your desired preference. You can also edit the style of the line type and marker for line and scatter charts respectively.

:::image type="content" source="media/how-to-visualize-jobs/edit-line-chart-style.gif" alt-text="Screenshot of how to change line chart styles.":::

 ## Compare your training jobs using Compare Tile 

You can compare the logged metrics, parameters, and tags between your visualized jobs side-by-side in this comparison table. By default, there will be baseline set by the system to easily view the delta between metric values across jobs.  

You can change the baseline by hovering over the display name and clicking on the “baseline” icon. Show differences only will reduce the rows in the table to only surface rows that have different values so you can easily spot what factors contributed to the results.  

:::image type="content" source="media/how-to-visualize-jobs/preview-panel.gif" alt-text="Screenshot of how to enable feature in preview panel.":::

## Monitor your resources across jobs 

Navigate to the Resource metrics section to view your resource usage across jobs. This view provides insights on your job's resources on a 30 day rolling basis. 

>[!NOTE] 
>This view supports only compute that is managed by Azure Machine Learning.
>Jobs with a runtime of less than 5 minutes will not have enough data to populate this view.
 

## Add markdown tile

You can add markdown tiles to your dashboard view to summarize insights, add comments, take notes, and more. This is a great way for you to provide additional context and references for yourself and your team if you share this view. 

:::image type="content" source="media/how-to-visualize-jobs/add-markdown-tile.gif" alt-text="Screenshot of how to add a markdown tile to dashboard view.":::

## Create and save custom views

After applying changes to your jobs list and dashboard, you can save all these customizations as a Custom View so you can easily return to work. Users with workspace permissions can edit or view the custom view. Also, share the custom view with team members for enhanced collaboration by selecting Share view.

Please note that you cannot save changes to the Default view, but you can save them into your own Custom view. You can now manage all your views from a single menu to create new, edit existing, rename, or delete them.

:::image type="content" source="media/how-to-visualize-jobs/create-save-custom-views.gif" alt-text="Screenshot of how to save and manage custom views.":::


## Next steps

* To learn how to organize and track your training jobs, see [Organize & track training jobs](how-to-track-monitor-organize-jobs.md).
* To learn how to log metrics for your experiments, see [Log metrics during training jobs](how-to-log-view-metrics.md).
* To learn how to monitor resources and logs from Azure Machine Learning, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).