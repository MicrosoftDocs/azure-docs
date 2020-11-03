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
ms.date: 10/07/2020 
---

# Creating a Synapse workspace

In this tutorial, you'll learn how to create a Synapse workspace, a dedicated SQL pool, and a serverless Apache Spark pool. 

## Prerequisites

To complete this all of this tutorial's steps, you need to have access to a resource group for which you are assigned the **Owner** role. Create the Synapse workspace in this resource group.

## Create a Synapse workspace in the Azure portal

1. Open the [Azure portal](https://portal.azure.com), and at the top search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics (workspaces preview)**.
1. Select **Add** to create a workspace.
1. In **Basics**, enter your preferred **Subscription**, **Resource group**, **Region**, and then choose a workspace name. In this tutorial, we'll use **myworkspace**.
1. You need an ADLSGEN2 account and a container in that account to create a workspace. The simplest choice it to create a new one. If you want to re-use an existing one you'll need to perform some additional configuration. 
    1. The Synapse workspace will use this container as the default location to store Spark logs and and data for Spark tables.
    1. Navigate to **Select Data Lake Storage Gen 2**. 
    1. Click **Create New** and name it **contosolake**.
    1. Click **File System** and name it **users**. This will create a container called **users**
1. Your Azure Synapse workspace will use this storage account as the "primary" storage account and the container to store workspace data. The workspace stores data in Apache Spark tables. It stores Spark application logs under a folder called **/synapse/workspacename**.
1. Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Launch Synapse Studio**.
* Go to the `https://web.azuresynapse.net` and sign in to your workspace.

## Create a dedicated SQL pool

1. In Synapse Studio, on the left-side pane, select **Manage** > **SQL pools**.
1. Select **New** and enter these settings:

    |Setting | Suggested value | 
    |---|---|---|
    |**SQL pool name**| **SQLDB1**|
    |**Performance level**|**DW100C**|
    |||

1. Select **Review + create** > **Create**. Your dedicated SQL pool will be ready in a few minutes. Your dedicated SQL pool is associated with a dedicated SQL pool database that's also called **SQLDB1**.

A dedicated SQL pool consumes billable resources as long as it's active. You can pause the pool later to reduce costs.

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

## The serverless SQL pool

Every workspace comes with a pre-built pool called **Built-in**. This pool can't be deleted. The serverless SQL pool allows you to work with SQL without having to create or think about managing a serverless SQL pool in Azure Synapse.


Unlike the other kinds of pools, billing for serverless SQL pool is based on the amount of data scanned to run the query, not the number of resources used to execute the query.

* Serverless SQL pool has its own databases that exist independently from other serverless SQL pools.
* A workspace always has exactly one serverless SQL pool named **Built-in**.

## Preparing a ADLSGEN2 storage account

### Perform the following steps BEFORE you create your workspace

1. Open the [Azure portal](https://portal.azure.com).
1. Navigate to your existing storage account
1. Select **Access control (IAM)** on the left pane. 
1. Assign the following roles or make sure they're already assigned:
    * Assign yourself to the **Owner** role.
    * Assign yourself to the **Storage Blob Data Owner** role.
1. On the left pane, select **Containers** and create a container.
1. You can give the container a name. In this document, we use the name  **users**.
1. Accept the default setting **Public access level**, and then select **Create**.

### Perform the following steps AFTER you create your workspace

Configure access to the storage account from your workspace. Managed identities for your Azure Synapse workspace might already have access to the storage account. Follow these steps to make sure:

1. Open the [Azure portal](https://portal.azure.com) and the primary storage account chosen for your workspace.
1. Select **Access control (IAM)** from the left pane.
1. Assign the following roles or make sure they're already assigned. We use the same name for the workspace identity and the workspace name.
    * For the **Storage Blob Data Contributor** role on the storage account, assign **myworkspace** as the workspace identity.
    * Assign **myworkspace** as the workspace name.
1. Select **Save**.


## Next steps

> [!div class="nextstepaction"]
> [Analyze using a dedicated SQL pool](get-started-analyze-sql-pool.md)
