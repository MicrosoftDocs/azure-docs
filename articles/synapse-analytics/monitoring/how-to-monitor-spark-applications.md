---
title: Monitor Apache Spark applications
description: Use the Azure Synapse Studio to monitor your Apache Spark applications.
services: synapse-analytics 
author: matt1883
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice:
ms.date: 04/15/2020
ms.author: mahi
ms.reviewer: mahi
---

# Use the Azure Synapse Studio (preview) to monitor your Apache Spark applications

With Azure Synapse Analytics, you can use Spark to run notebooks, jobs, and other kinds of applications on your Spark pools in your workspace.

This article explains how to monitor your Spark applications, allowing you to keep an eye on the latest status, issues, and progress.

## Accessing the list of Spark applications

To see the list of Spark applications in your workspace, first [open the Azure Synapse Studio](https://web.azuresynapse.net/) and select your workspace.

  > [!div class="mx-imgBorder"]
  > ![Log in to workspace](./media/common/login-workspace.png)

Once you've opened your workspace, select the **Monitor** section on the left.

  > [!div class="mx-imgBorder"]
  > ![Select Monitor hub](./media/common/left-nav.png)

Select **Spark applications** to view the list of Spark applications.

  > [!div class="mx-imgBorder"]
  > ![Select Spark applications](./media/how-to-monitor-spark-applications/monitor-hub-nav-sparkapplications.png)

## Filtering your Spark applications

You can filter the list of Spark applications to the ones you're interested in. The filters at the top of the screen allow you to specify a field on which you'd like to filter.

For example, you can filter the view to see only the Spark applications that contain the name "sales":

  > [!div class="mx-imgBorder"]
  > ![Filter button](./media/common/filter-button.png)

  > [!div class="mx-imgBorder"]
  > ![Sample filter](./media/how-to-monitor-spark-applications/filter-example.png)

## Viewing details about a specific Spark application

To view the details about one of your Spark applications, select the Spark application and view the details. If the Spark application is still running, you can monitor the progress.

## Next steps

For more information on monitoring pipeline runs, see the [Monitor pipeline runs Azure Synapse Studio](how-to-monitor-pipeline-runs.md) article.  
