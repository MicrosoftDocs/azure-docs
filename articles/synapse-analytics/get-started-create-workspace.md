---
title: 'Tutorial: Get started create a Synapse workspace' 
description: In this tutorial, you'll learn how to create a Synapse workspace, a SQL pool, and an Apache Spark pool.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: workspace
ms.topic: tutorial
ms.date: 11/02/2020 
---

# Creating a Synapse workspace

In this tutorial, you'll learn how to create a Synapse workspace, a SQL pool, and an Apache Spark pool. 

## Prerequisites

To complete this all of this tutorial's steps, you need to have access to a resource group for which you are assigned the **Owner** role. Create the Synapse workspace in this resource group.

## Create a Synapse workspace in the Azure Portal

1. Open the [Azure portal](https://portal.azure.com), and at the top search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics (workspaces preview)**.
1. Select **Add** to create a workspace.
1. In **Basics**, enter your preferred **Subscription**, **Resource group**, **Region**, and then choose a workspace name. In this tutorial, we'll use **myworkspace**.
1. To keep the steps simple, you will create a new ADLSGEN2 account. The Synapse workspace will use this container as the default location to store Spark logs and and data for Spark tables.
    1. Navigate to **Select Data Lake Storage Gen 2**. 
    1. Click **Create New** and name it **contosolake**.
    1. Click **File System** and name it **users**. This will create a container called **users**
1. Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Launch Synapse Studio**.
* Go to the `https://web.azuresynapse.net` and sign in to your workspace.

## Create a SQL pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **SQL pools**.
1. Select **New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**SQL pool name**| **SQLDB1**|
    |**Performance level**|**DW100C**|
    |||

1. Select **Review + create** > **Create**. Your SQL pool will be ready in a few minutes. Your SQL pool is associated with a SQL pool database that's also called **SQLDB1**.

A SQL pool consumes billable resources as long as it's active. You can pause the pool later to reduce costs.

## Create a serverless Apache Spark pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **Apache Spark pools**.
1. Select **New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**Apache Spark pool name**|**Spark1**
    |**Node size**| **Small**|
    |**Number of nodes**| Set the minimum to 3 and the maximum to 3|

1. Select **Review + create** > **Create**. Your Apache Spark pool will be ready in a few seconds.

When you perform Spark activity in Azure Synapse, you specify a Spark pool to use. The pool tells Azure Synapse how many Spark resources to use. You only pay for the resources that you use. When you actively stop using the pool, the resources automatically time out and are recycled.

> [!NOTE]
> Spark databases are independently created from Spark pools. A workspace always has a Spark database called **default**. You can create additional Spark databases.

## The SQL on-demand pool

Every workspace comes with a pre-built pool called **SQL on-demand**. This pool can't be deleted. The SQL on-demand pool allows you to work with SQL without having to create or think about managing a SQL pool in Azure Synapse.

Unlike dedicated SQL pools, billing for SQL on-demand is based on the amount of data scanned to run the query, not the number of resources used to execute the query.

## Next steps

> [!div class="nextstepaction"]
> [Analyze using a SQL pool](get-started-analyze-sql-pool.md)
