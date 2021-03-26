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
ms.date: 03/17/2021 
---

# Creating a Synapse workspace

In this tutorial, you'll learn how to create a Synapse workspace, a dedicated SQL pool, and a serverless Apache Spark pool. 

## Prerequisites

To complete this tutorial's steps, you need to have access to a resource group for which you are assigned the **Owner** role. Create the Synapse workspace in this resource group.

## Create a Synapse workspace in the Azure portal

### Start the process
1. Open the [Azure portal](https://portal.azure.com), in the search bar enter **Synapse** without hitting enter.
1. In the search results, under **Services**, select **Azure Synapse Analytics**.
1. Select **Add** to create a workspace.

## Basics tab > Project Details
Fill in the following fields:
    1. **Subscription** - Pick any subscription.
    1. **Resource group** - Use any resource group.
    1. **Resource group** - Leave this blank.


## Basics tab > Workspace details
Fill in the following fields:
      1. **Workspace name** - Pick any globally unique name. In this tutorial, we'll use **myworkspace**.
      1. **Region** - Pick any region.
      1. **Select Data Lake Storage Gen 2**
        1. Click the button for **From subscription**.
        1. By **Account name**, click **Create New** and name the new storage account **contosolake** or similar as this name must be unique.
        1. By **File system name**, click **Create New** and name it **users**. This will create a storage container called **users**. The workspace will use this storage account as the "primary" storage account to Spark tables and Spark application logs.
        1. Check the "Assign myself the Storage Blob Data Contributor role on the Data Lake Storage Gen2 account" box. 

## Completing the process
Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

> [!NOTE]
> To enable workspace features from an existing dedicated SQL pool (formerly SQL DW) refer to [How to enable a workspace for your dedicated SQL pool (formerly SQL DW)](./sql-data-warehouse/workspace-connected-create.md).


## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com), in the **Overview** section of the Synapse workspace, select **Open** in the Open Synapse Studio box.
* Go to the `https://web.azuresynapse.net` and sign in to your workspace.











## Next steps

> [!div class="nextstepaction"]
> [Analyze using a serverless SQL pool](get-started-analyze-sql-on-demand.md)
