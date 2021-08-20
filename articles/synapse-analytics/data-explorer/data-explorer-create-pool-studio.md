---
title: 'Create a Data Explorer pool using Synapse Studio'
description: Create a Data Explorer pool using Synapse Studio by following the steps in this guide.
ms.topic: quickstart
ms.date: 08/20/2021
author: shsagir
ms.author: shsagir
ms.reviewer: shsagir
services: synapse-analytics
ms.service: synapse-analytics
ms.subservice: data-explorer
---

# Quickstart: Create a Data Explorer pool using Synapse Studio

Azure Synapse Analytics Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Data Explorer, you first create a Data Explorer pool.

This article describes the steps to create a Data Explorer pool in a Synapse workspace by using Synapse Studio.

> [!IMPORTANT]
> Billing for Data Explorer instances is prorated per minute, whether you are using them or not. Be sure to shutdown your Data Explorer instance after you have finished using it, or set a short timeout. For more information, see the **Clean up resources** section of this article.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Synapse workspace](../quickstart-create-workspace.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Navigate to the Synapse workspace

1. Navigate to the Synapse workspace where the Data Explorer pool will be created by typing the service name (or resource name directly) into the search bar.

    ![Azure portal search bar with Synapse workspaces typed in.](../media/quickstart-create-sql-pool/create-sql-pool-00a.png)
1. From the list of workspaces, type the name (or part of the name) of the workspace to open. For this example, we'll use a workspace named **contosoanalytics**.

    ![Listing of Synapse workspaces filtered to show those containing the name Contoso.](../media/quickstart-create-sql-pool/create-sql-pool-00b.png)

## Launch Synapse Studio

From the workspace overview, select the **Workspace web URL** to open Synapse Studio.

![Azure portal Synapse workspace overview with Launch Synapse Studio highlighted.](./media/create-data-explorer-pool-studio.png)

## Create a new Data Explorer pool

1. On the Synapse Studio home page, navigate to the **Management Hub** in the left navigation by selecting the **Manage** icon.

    ![Synapse Studio home page with Management Hub section highlighted.](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

1. Once in the Management Hub, navigate to the **Data Explorer pools** section to see the current list of Data Explorer pools that are available in the workspace.

    ![Synapse Studio management hub with Data Explorer pools navigation selected](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

1. Select **+ New**. The new Data Explorer pool create wizard appears.

1. Enter the following details in the **Basics** tab:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Data Explorer pool name | contosodataexplorer | This is the name that the Data Explorer pool will have. |
    | Node size | Small (4 vCPU / 32 GB) | Set this to the smallest size to reduce costs for this quickstart |
    | Autoscale | Disabled | We won't need autoscale in this quickstart |
    | Number of nodes | 8 | Use a small size to limit costs in this quickstart |

    ![Basics for Synapse Studio new Data Explorer pool](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

    > [!IMPORTANT]
    > Note that there are specific limitations for the names that Data Explorer pools can use. Names must contain letters or numbers only, must be 15 or less characters, must start with a letter, not contain reserved words, and be unique in the workspace.

1. In the next tab (**Additional settings**), leave all settings as defaults.

1. We won't add any tags for now, so select **Review + create**.

1. In the **Review + create** tab, make sure that the details look correct based on what was previously entered, and press **Create**.

    ![Create Synapse Studio new Data Explorer pool](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

1. The Data Explorer pool will start the provisioning process.

1. Once the provisioning is complete, the new Data Explorer pool will appear in the list.

    ![Synapse Studio new Data Explorer pool list](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

## Clean up Data Explorer pool resources using Synapse Studio

Follow the steps below to delete the Data Explorer pool from the workspace using Synapse Studio.
> [!WARNING]
> Deleting a data-explorer pool will remove the analytics engine from the workspace. It will no longer be possible to connect to the pool, and all queries, pipelines, and notebooks that use this data-explorer pool will no longer work.

If you want to delete the Data Explorer pool, do the following:

1. Navigate to the Data Explorer pools in the Management Hub in Synapse Studio.
1. Select the ellipsis next to the Apache pool to be deleted (in this case, **contosodataexplorer**) to show the commands for the Data Explorer pool.

    ![Listing of Data Explorer pools, with the recently created pool selected.](media/create-data-explorer-pool-studio.png)

    **TODO: REPLACE IMAGE**

1. Press **delete**.
1. Confirm the deletion, and press **Delete** button.
1. When the process completes successfully, the Data Explorer pool will no longer be listed in the workspace resources.

## Next steps
