---
title: Monitor pipeline runs using Synapse Studio
description: Use the Synapse Studio to monitor your workspace pipeline runs.
services: synapse-analytics 
author: matt1883
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: monitoring
ms.date: 09/26/2022
ms.author: mahi
ms.reviewer: mahi
---

# Use Synapse Studio to monitor your workspace pipeline runs

With Azure Synapse Analytics, you can create complex pipelines that can automate and integrate your data movement, data transformation, and compute activities within your solution. You can author and monitor these pipelines using Synapse Studio.

This article explains how to monitor your pipeline runs, which allows you to keep an eye on the latest status, issues, and progress of your pipelines.

## Access pipeline runs list

To see the list of pipeline runs in your workspace, first [open the Synapse Studio](https://web.azuresynapse.net/) and select your workspace.

![Log in to workspace](./media/common/login-workspace.png)

Once you've opened your workspace, select the **Monitor** section on the left.

![Select Monitor hub](./media/common/left-nav.png)

Select **Pipeline runs** to view the list of pipeline runs.

![Select pipeline runs](./media/how-to-monitor-pipeline-runs/monitor-hub-nav-pipelineruns.png)

## Filter your pipeline runs

You can filter the list of pipeline runs to the ones you're interested in. The filters at the top of the screen allow you to specify a field on which you'd like to filter. You can view pipeline run data for the last 45 days. If you want to store pipeline run data for more than 45 days, set up your own diagnostic logging with [Azure monitor](../../data-factory/monitor-using-azure-monitor.md).

For example, you can filter the view to see only the pipeline runs for the pipeline named "holiday":

![Sample filter](./media/how-to-monitor-pipeline-runs/filter-example.png)

## View details about a specific pipeline run

To view details about your pipeline run, select the pipeline run. Then view the activity runs associated with the pipeline run. If the pipeline is still running, you can monitor the progress. 
  
## Next steps

To learn more about monitoring applications, see the [Monitor Apache Spark applications](how-to-monitor-spark-applications.md) article. 
