---
title: 'Quickstart: Get started - create a Synapse workspace' 
description: In this tutorial, you'll learn how to create a Synapse workspace, a dedicated SQL pool, and a serverless Apache Spark pool.
services: synapse-analytics
author: saveenr
ms.author: saveenr
manager: julieMSFT
ms.reviewer: jrasnick
ms.service: synapse-analytics
ms.subservice: workspace
ms.topic: tutorial
ms.date: 11/21/2020 
---

# Creating a Synapse workspace

In this tutorial, you'll learn how to create a Synapse workspace, a dedicated SQL pool, and a serverless Apache Spark pool. 

## Prerequisites

To complete this tutorial's steps, you need to have access to a resource group for which you are assigned the **Owner** role. Create the Synapse workspace in this resource group.

## Create a Synapse workspace in the Azure portal

1. Open the [Azure portal](https://portal.azure.com), and at the top search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics**.
1. Select **Add** to create a workspace.
1. In **Basics**, enter your preferred **Subscription**, **Resource group**, **Region**, and then choose a workspace name. In this tutorial, we'll use **myworkspace**.
1. Navigate to **Select Data Lake Storage Gen 2**. 
1. Click **Create New** and name it **contosolake**.
1. Click **File System** and name it **users**. This will create a container called **users**
1. The workspace will use this storage account as the "primary" storage account to Spark tables and Spark application logs.
1. Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

> [!NOTE]
> To enable workspace features from an existing dedicated SQL pool (formerly SQL DW) refer to [How to enable a workspace for your dedicated SQL pool (formerly SQL DW)](./sql-data-warehouse/workspace-connected-create.md).


## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Open Synapse Studio**.
* Go to the `https://web.azuresynapse.net` and sign in to your workspace.

## Create a dedicated SQL pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **SQL pools**.
1. Select **New**
1. For **SQL pool name** select **SQLPOOL1**
1. For **Performance level** choose **DW100C**
1. Select **Review + create** > **Create**. Your dedicated SQL pool will be ready in a few minutes. Your dedicated SQL pool is associated with a dedicated SQL pool database that's also called **SQLPOOL1**.

A dedicated SQL pool consumes billable resources as long as it's active. You can pause the pool later to reduce costs.

> [!NOTE] 
> When creating a new dedicated SQL pool (formerly SQL DW) in your workspace, the dedicated SQL pool provisioning page will open. Provisioning will take place on the logical SQL server.

## Create a serverless Apache Spark pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **Apache Spark pools**.
1. Select **New** 
1. For **Apache Spark pool name** enter **Spark1**.
1. For **Node size** enter **Small**.
1. For **Number of nodes** Set the minimum to 3 and the maximum to 3
1. Select **Review + create** > **Create**. Your Apache Spark pool will be ready in a few seconds.

The Spark pool tells Azure Synapse how many Spark resources to use. You only pay for the resources that you use. When you actively stop using the pool, the resources automatically time out and are recycled.

## The Built-in serverless SQL pool

Every workspace comes with a pre-built serverless SQL pool called **Built-in**. This pool can't be deleted. Serverless SQL pools let you use SQL without having to reserve capacity with dedicated SQL pools. Unlike the dedicated SQL pools, billing for a serverless SQL pool is based on the amount of data scanned to run the query, not the number of capacity allocated to the pool.

## Next steps

> [!div class="nextstepaction"]
> [Analyze using a dedicated SQL pool](get-started-analyze-sql-pool.md)
