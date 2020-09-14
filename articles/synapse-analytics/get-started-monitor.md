---
title: 'Tutorial: Get started with Azure Synapse Analytics - monitor your Synapse workspace' 
description: In this tutorial, you'll learn how to monitor activities in your Synapse workspace. 
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.topic: tutorial
ms.date: 07/27/2020 
---

# Monitor your Synapse Workspace

In this tutorial, you'll learn how to monitor activities in your Synapse workspace. You can monitor current and historical activities for SQL, Apache Spark. and Pipelines. 

## Introduction to the Monitor Hub

Open Synapse Studio and navigate to the **Monitor** hub. Here, you can see a history of all the activities taking place in the workspace and which ones are active now. 

* Under **Orchestration**, You can monitor pipelines, triggers, and Integration runtimes
* Under **Activities**, You can monitor Spark and SQL activities. 

## Orchestration

1. Navigate to **Orchestration > Pipeline**. In this view, you can see every time a pipeline has run in your workspace. 
1. Find the pipeline that you ran in the previous step and click on its **Pipeline name**.
1. Now you can see how individual activities inside that pipeline run.
1. Click **Breadcrumb bar** near the top of Synapse Studio, click **All pipeline runs** to return to the previous view.

## Apache Spark Activities

1. Navigate to **Orchestration > Activities > Apache Spark applications**. Now you can see all the Spark applications that are running or have run in your workspace.
1. Find an application that is no longer running and click on its **Application name**. Now you can see the details of the spark application.
1. If you are familiar with Apache Spark, you can find the standard Apache Spark history server UI by clicking on **Spark history server**.

## SQL Activities

1. Navigate to **Orchestration > Activities > SQL requests**.
1. In this view you can see SQL requests.
1. Select a **Pool** to monitor. Now you can see all SQL requests that are running or have run in your workspace in that pool.
1. Find a specific SQL request and hover the mouse on that item. Once you hover, you will see a SQL script icon appear.
1. Click on the SQL script icon to see the full text of the SQL request.

## Next steps

> [!div class="nextstepaction"]
> [Azure Synapse Analytics (workspaces preview)](overview-what-is.md)

