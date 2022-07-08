---
title: 'Tutorial: Get started with Azure Synapse Analytics - monitor your Synapse workspace'
description: In this tutorial, you'll learn how to monitor activities in your Synapse workspace.
author: saveenr
ms.author: saveenr
ms.reviewer: sngun
ms.service: synapse-analytics
ms.subservice: monitoring
ms.topic: tutorial
ms.date: 08/25/2021
ms.custom: ignite-fall-2021
---

# Monitor your Synapse Workspace

In this tutorial, you'll learn how to monitor activities in your Synapse workspace. You can monitor current and historical activities for SQL, Apache Spark, and Pipelines. 

## Introduction to the Monitor Hub

Open Synapse Studio and navigate to the **Monitor** hub. Here, you can see a history of all the activities taking place in the workspace and which ones are active now. 

* Under **Integration**, you can monitor pipelines, triggers, and integration runtimes.
* Under **Activities**, you can monitor Spark and SQL activities. 

## Integration

1. Navigate to **Integration > Pipeline runs**. In this view, you can see every time a pipeline has run in your workspace. 
1. Find the pipeline that you ran in the previous step and click on its **Pipeline name** to view the details.
1. Click **Breadcrumb bar** near the top of Synapse Studio, click **All pipeline runs** to return to the previous view.

## Data Explorer activities

1. Navigate to **Activities > KQL requests**.
1. In this view you can see KQL requests.
1. Select a **Pool** to monitor from the **Pool** filter. Now you can see all KQL requests that are running or have run in your workspace in that pool.
1. Find a specific KQL request and click on the **More** link to see the full text of the KQL request.

## Apache Spark activities

1. Navigate to **Activities > Apache Spark applications**. Now you can see all the Spark applications that are running or have run in your workspace.
1. Find an application that is no longer running and click on its **Application name**. Now you can see the details of the spark application.
1. If you are familiar with Apache Spark, you can find the standard Apache Spark history server UI by clicking on **Spark history server**.

## SQL activities

1. Navigate to **Activities > SQL requests**.
1. In this view you can see SQL requests.
1. Select a **Pool** to monitor from the **Pool** filter. Now you can see all SQL requests that are running or have run in your workspace in that pool.
1. Find a specific SQL request and click on the **More** link to see the full text of the SQL request.

    > [!NOTE] 
    > SQL requests submitted via the Synapse Studio in a workspace enabled dedicated SQL pool (formerly SQL DW) can be viewed in the Monitor hub. For all other monitoring activities, you can go to Azure portal dedicated SQL pool (formerly SQL DW) monitoring.

## Next steps

> [!div class="nextstepaction"]
> [Explore the Knowledge center](get-started-knowledge-center.md)
