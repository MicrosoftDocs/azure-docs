---
title: Organize & track training jobs (preview)
titleSuffix: Azure Machine Learning 
description: Learn how to organize and track your machine learning experiment jobs with the Azure Machine Learning studio. 
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

## Job display name 

The job display name is an optional and customizable name that you can provide for your job. You can edit this directly in your jobs list view by clicking on the pencil icon. 

    :::image type="content" source="media/how-to-track-monitor-analyze-runs/display-name.gif" alt-text="Screenshot of how to edit the display name.":::

This will help you organize and label your training jobs easily. 


## Select and pin columns 

You can add, remove, reorder, and pin columns to customize your jobs list by selecting Columns to open the column options pane. 

Configure your columns in your job list by selecting Columns. 

    :::image type="content" source="media/how-to-track-monitor-analyze-runs/select-pin-columns.gif" alt-text="Screenshot of how to select and pin columns.":::

In column options, you can select columns to add or remove from the table. Drag columns to reorder how they appear in the table and pin any column to the left of the table, so you can continue viewing your important column information (i.e. display name, metric value) while scrolling horizontally.  

## Sort jobs 

You can now sort your jobs list by your metric values (i.e. accuracy, loss, f-1 score) to identify the best performing job that meets your criteria. 

To sort by multiple columns, hold the shift key and click column headers that you want to sort. This will help you rank your training results according to your criteria. 
 
At any point you can manage your sorting preferences for your table in column options under Columns to add or remove columns and change sorting order. 


    :::image type="content" source="media/how-to-track-monitor-analyze-runs/sorting-jobs.gif" alt-text="Screenshot of how to sort jobs.":::


## Filter jobs 

You can filter your jobs list by selecting Filters where you can leverage quick filters for Status and Created by as well as add specific filters to any column including metrics. 

Simply, select Add filter to search or select a column of your preference. 

Upon choosing your column, you can choose what type of filter you want and the value. Apply changes and see the jobs list page update accordingly. 


You can remove the filter you just applied from the job list or if you’re interested in editing your filters, simply navigate back to Filters to do so.  


## Perform batch actions on jobs / Bulk actions (cancel, delete, etc.) 

You can now select multiple jobs in your jobs list and perform an action, such as cancel or delete, on them together.  

## Tag jobs 

You can now tag your experiments with custom labels that will help you group and filter them later. You can add tags to multiple jobs by selecting them and clicking on the "Add tags" button at the top of the table. 


## Custom View 
    
To view your jobs in the studio: 
    
1. Navigate to the **Jobs** tab.
    
1. Select either **All experiments** to view all the jobs in an experiment or select **All jobs** to view all the jobs submitted in the Workspace.
    
In the **All jobs'** page, you can filter the jobs list by tags, experiments, compute target and more to better organize and scope your work.  
    
1. Make customizations to the page by selecting jobs to compare, adding charts or applying filters. These changes can be saved as a **Custom View** so you can easily return to your work. Users with workspace permissions can edit, or view the custom view. Also, share the custom view with team members for enhanced collaboration by selecting **Share view**.

1. To view the job logs, select a specific job and in the **Outputs + logs** tab, you can find diagnostic and error logs for your job.

    :::image type="content" source="media/how-to-track-monitor-analyze-runs/custom-views-2.gif" alt-text="Screenshot of how to create a custom view.":::   




## Job description 

A job description can be added to a job to provide more context and information to the job. You can also search on these descriptions from the jobs list and add the job description as a column in the jobs list. 

Navigate to the **Job Details** page for your job and select the edit or pencil icon to add, edit, or delete descriptions for your job. To persist the changes to the jobs list, save the changes to your existing Custom View or a new Custom View. Markdown format is supported for job descriptions, which allows images to be embedded and deep linking as shown below.

:::image type="content" source="media/how-to-track-monitor-analyze-runs/run-description-2.gif" alt-text="Screenshot of how to create a job description."::: 


## Tag and find jobs

In Azure Machine Learning, you can use properties and tags to help organize and query your jobs for important information.

* Edit tags

    You can add, edit, or delete job tags from the studio. Navigate to the **Job Details** page for your job and select the edit, or pencil icon to add, edit, or delete tags for your jobs. You can also search and filter on these tags from the jobs list page.
    
    :::image type="content" source="media/how-to-track-monitor-analyze-runs/run-tags.gif" alt-text="Screenshot of how to add, edit, or delete job tags.":::
    

* Query properties and tags

    You can query jobs within an experiment to return a list of jobs that match specific properties and tags.
    
    To search for specific jobs, navigate to the  **All jobs** list. From there you have two options:
    
    1. Use the **Add filter** button and select filter on tags to filter your jobs by tag that was assigned to the job(s). <br><br>
    OR
    
    1. Use the search bar to quickly find jobs by searching on the job metadata like the job status, descriptions, experiment names, and submitter name. 

## Cancel or fail jobs

If you notice a mistake or if your job is taking too long to finish, you can cancel the job.

To cancel a job in the studio, using the following steps:

1. Go to the running pipeline in either the **Jobs** or **Pipelines** section. 

1. Select the pipeline job number you want to cancel.

1. In the toolbar, select **Cancel**.


## Next steps

* To learn how to visualize and analyze your experimentation results, see [visualize training results](how-to-visualize-jobs.md).
* To learn how to log metrics for your experiments, see [Log metrics during training jobs](how-to-log-view-metrics.md).
* To learn how to monitor resources and logs from Azure Machine Learning, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).