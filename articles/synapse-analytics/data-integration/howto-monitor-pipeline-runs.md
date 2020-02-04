---
title: Monitor pipeline runs
description: Use the Synapse Studio to monitor your workspace's pipeline runs.
services: sql-data-warehouse 
author: matt1883 
ms.service: sql-data-warehouse 
ms.topic: howto
ms.subservice: design
ms.date: 01/01/2020
ms.author: mahi 
ms.reviewer: mahi
---

# Use the Synapse Studio to monitor your workspace's pipeline runs

With Azure Synapse Analytics, you can create complex pipelines that can automate and orchestrate your data movement, data transformation, and compute activities within your solution. You can author and monitor these pipelines using Azure Synapse Studio.

This article explains how to monitor your pipeline runs, which allows you to keep an eye on the latest status, issues, and progress of your pipelines.

## Accessing the list of pipeline runs

To see the list of pipeline runs in your workspace, first [open the Azure Synapse Studio](https://web.azuresynapse.net/) and select your workspace.

  ![Log in to workspace](../media/howto-monitor-pipeline-runs/login-workspace.png)

Once you’ve opened your workspace, select the **Monitor** section on the left.

  ![Select Monitor hub](../media/howto-monitor-pipeline-runs/leftnav.png)

Select **Pipeline runs** to view the list of pipeline runs.

  ![Select pipeline runs](../media/howto-monitor-pipeline-runs/monitorhub-nav-pipelineruns.png)

## Filtering your pipeline runs

You can filter the list of pipeline runs to just those you’re interested in. The filters at the top of the screen allow you to specify a field on which you’d like to filter.

For example, you can filter the view to see only the pipeline runs for the pipeline named “holiday”:

  ![Filter button](../media/howto-monitor-pipeline-runs/filter-button.png)

  ![Sample filter](../media/howto-monitor-pipeline-runs/filter-example.png)

## Viewing details about a specific pipeline run

To view the details about one of your pipeline runs, select the pipeline run and view the activity runs associated with the pipeline run. You can also monitor the progress of the pipeline run, if it is still running.

  ![Log in to workspace](../media/howto-monitor-pipeline-runs/login-workspace.png)
  
## Next steps

This article showed you how to monitor pipeline runs in your Azure Synapse workspace. You learned how to:

> [!div class="checklist"]
> * View the list of pipeline runs in your workspace
> * Filter the list of pipeline runs to find the pipeline you'd like to monitor
> * Monitor your selected pipeline run in detail.
