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

This article will show you how to customize your dashboard view with the following tasks: 

* Create and save custom views. 
* Add charts.
* Edit charts. 
* Change colors. 
* Visualize training jobs. 
* Compare training jobs. 
* Add markdown. 

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

## Default Dashboard View 
This dashboard view will by default generate all your resource utilization, evaluation, and logged metrics visually for the selected jobs. 
Default sections 

 Sweep Job / Best Trial metrics 

AutoML  Job/ Best Model Metrics 

Pipeline Job  / showchildMetricAtRoot 

 

## Job colors 

You can either stick to the colors assigned or take advantage of the color picker to easily change between the colors of the jobs displayed in the charts.  

[note about system color palette was designed to...]  

## Visualize jobs 

Click on the eye icon to show or hide jobs in the dashboard view and narrow down on results that matter most to you. This provides more flexibility for you to maintain your job list and explore different groups of jobs to visualize. 

Visualize None /Show Only Visualize  



## Filter Job /Select-Pin Columns on Left 

 

## Search Tiles 

 

## Global Dashboard Settings 

Set Legend 

Set X-Axis 

Exclude outliers 

Smoothing 

## Organize Tiles in Sections 

Update section name 

Move Section Up/Down 

Delete Sections 

Auto Generate Sections using Metrics Name (i.e a/b/c/d) 

Hide/Show Tiles and Order Tiles in Section 

## Add charts 

You can create a custom chart to add to your dashboard view if you’re looking to plot a set of metrics or specific style. Azure Machine Learning Studio supports line, bar, scatter, and parallel coordinates charts for you to add to your view. 

## Edit charts 

You can add data smoothing, ignore outliers, and change the x-axis for all the charts in your dashboard view through the global chart editor.  

[gif of using global chart editor] 

You can perform these actions for an individual chart as well by clicking on the pencil icon to customize specific charts to your desired preference. You can also edit the style of the line type and marker for line and scatter charts respectively. 

 ## Compare your training jobs using Compare Tile 

You can compare the logged metrics, parameters, and tags between your visualized jobs side-by-side in this comparison table. By default, there will be baseline set by the system to easily view the delta between metric values across jobs.  

You can change the baseline by hovering over the display name and clicking on the “baseline” icon. Show differences only will reduce the rows in the table to only surface rows that have different values so you can easily spot what factors contributed to the results.  

### Resource Metrics 

Navigate to your job in the studio and select the Monitoring tab. This view provides insights on your job's resources on a 30 day rolling basis. 

:::image type="content" source="media/how-to-track-monitor-analyze-runs/monitoring-tab.png" alt-text="Screenshot of Monitoring tab showing resources the selected job has used.":::

>[!NOTE] 
>This view supports only compute that is managed by Azure Machine Learning.
>Jobs with a runtime of less than 5 minutes will not have enough data to populate this view.
 

## Add markdown 

You can add markdown tiles to your dashboard view to summarize insights, add comments, take notes, and more. This is a great way for you to provide additional context and references for yourself and your team if you share this view. 


## Next steps

* To learn how to organize and track your training jobs, see [Organize & track training jobs](how-to-track-monitor-organize-jobs.md).
* To learn how to log metrics for your experiments, see [Log metrics during training jobs](how-to-log-view-metrics.md).
* To learn how to monitor resources and logs from Azure Machine Learning, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).