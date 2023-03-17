---
title: "Quickstart: Create a dedicated SQL pool using Synapse Studio"
description: Create a dedicated SQL pool using Synapse Studio by following the steps in this guide.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 02/21/2023
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: quickstart
ms.custom: mode-ui
---

# Quickstart: Create a dedicated SQL pool using Synapse Studio

Azure Synapse Analytics offers various analytics engines to help you ingest, transform, model, and analyze your data. A dedicated SQL pool offers T-SQL based compute and storage capabilities. After creating a dedicated SQL pool in your Synapse workspace, data can be loaded, modeled, processed, and delivered for faster analytic insight.

This quickstart describes the steps to create a dedicated SQL pool in a Synapse workspace using Synapse Studio.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- You'll need an Azure subscription. If needed, [create a free Azure account](https://azure.microsoft.com/free/)
- [Azure Synapse workspace](quickstart-create-workspace.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Navigate to the Synapse workspace

1. Navigate to the Synapse workspace where the dedicated SQL pool will be created by typing the service name (or resource name directly) into the search bar.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-00a.png" alt-text="A screenshot of the Azure portal search bar with Synapse workspaces typed in.":::
1. From the list of workspaces, type the name (or part of the name) of the workspace to open. For this example, we'll use a workspace named **contosoanalytics**.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-00b.png" alt-text="A screenshot of the Synapse workspaces filtered to show those containing the name Contoso.":::

## Launch Synapse Studio

1. From the workspace overview, select the **Workspace web URL** to launch Synapse Studio.

    :::image type="content" source="media/quickstart-create-apache-spark-pool/create-spark-pool-studio-20.png" alt-text="A screenshot of the Azure portal Synapse workspace overview with Workspace web URL highlighted.":::

## Create a dedicated SQL pool in Synapse Studio

1. On the Synapse Studio home page, navigate to the **Management Hub** in the left navigation by selecting the **Manage** icon.

    :::image type="content" source="media/quickstart-create-apache-spark-pool/create-spark-pool-studio-21.png" alt-text="A screenshot of the Synapse Studio home page with Management Hub section highlighted.":::

1. Once in the Management Hub, navigate to the **SQL pools** section to see the current list of SQL pools that are available in the workspace.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-22.png" alt-text="A screenshot of the Synapse Studio management hub with SQL pools navigation selected.":::

1. Select **+ New** command and the new SQL pool create wizard will appear.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-23.png" alt-text="A screenshot of the Synapse Studio Management Hub listing of SQL pools.":::

1. Enter the following details in the **Basics** tab:

    | Setting | Suggested value | Description  |
    | :--- | :--- | :--- |
    | **SQL pool name** | `contosoedw` | This is the name that the dedicated SQL pool will have. |
    | **Performance level** | DW100c | Set this to the smallest size to reduce costs for this quickstart |

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-24.png" alt-text="A screenshot of the SQL pools create flow - basics tab.":::

    > [!IMPORTANT]  
    > Note that there are specific limitations for the names that dedicated SQL pools can use. Names can't contain special characters, must be 60 or less characters, not contain reserved words, and be unique in the workspace.

1. In the next tab, **Additional settings**, select **none** to create the dedicated SQL pool without data. Leave the default collation as selected.

    If you want to restore your dedicated SQL pool from a restore point, select **Restore point**. For more information on how to perform a restore, see [How-to: Restore an existing dedicated SQL pool](backuprestore/restore-sql-pool.md)

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-25.png" alt-text="A screenshot of the SQL pool create flow - additional settings tab.":::

1. We won't add any tags for now, so next select **Review + create**.

1. In the **Review + create** tab, make sure that the details look correct based on what was previously entered, and press **Create**.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-26.png" alt-text="A screenshot of the SQL pool create flow - review settings tab.":::

1. At this point, the resource provisioning flow will start.

1. After the provisioning completes, navigating back to the workspace will show a new entry for the newly created SQL pool.

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-27.png" alt-text="A screenshot of the SQL pool create flow - resource provisioning.":::

1. Once the dedicated SQL pool is created, it will be available in the workspace for loading data, processing streams, reading from the lake, etc.

## Clean up dedicated SQL pool using Synapse Studio

Follow the steps below to delete the dedicated SQL pool from the workspace using Synapse Studio.

> [!WARNING]  
> Deleting a dedicated SQL pool will remove the analytics engine from the workspace. It will no longer be possible to connect to the pool, and all queries, pipelines, scripts that use this dedicated SQL pool will no longer work.

If you want to delete the dedicated SQL pool, do the following:

1. Navigate to the SQL pools in the Management Hub in Synapse Studio.
1. Select the ellipsis in the dedicated SQL pool to be deleted (in this case, **contosoedw**) to show the commands for the dedicated SQL pool:

    :::image type="content" source="media/quickstart-create-sql-pool/create-sql-pool-studio-28.png" alt-text="A screenshot of all SQL pools, with the recently created pool selected.":::
1. Press **Delete**.
1. Confirm the deletion, and press **Delete** button.
1. When the process completes successfully, the dedicated SQL pool will no longer be listed in the workspace resources.

## Next steps

- See [Quickstart: Create an Apache Spark notebook](quickstart-apache-spark-notebook.md).
- See [Quickstart: Create a dedicated SQL pool using the Azure portal](quickstart-create-sql-pool-portal.md).
- See [Quickstart: Scale compute for dedicated SQL pools in Azure Synapse Workspaces with Azure PowerShell](sql-data-warehouse/quickstart-scale-compute-workspace-powershell.md)
