---
title: Quickstart - Create a Synapse SQL pool 
description: Create a new Synapse SQL pool for an Azure Synapse Analytics Synapse Workspace by following the steps in this guide. 
services: synapse-analytics 
author: malvenko
ms.service: synapse-analytics
ms.topic: quickstart 
ms.subservice:
ms.date: 04/15/2020
ms.author: josels
ms.reviewer: jrasnick, carlrab
---

# Quickstart: Create a Synapse SQL pool

Azure Synapse Analytics offers various analytics engines to help you ingest, transform, model, analyze, and serve your data. A SQL pool offers T-SQL based compute and storage capabilities. After creating a SQL pool in your Synapse Workspace, data can be loaded, modeled, processed, and served to obtain insights.

In this quickstart, you learn to create a SQL pool in a Synapse Workspace by using the Azure portal.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

[Synapse Workspace](quickstart-create-workspace.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Create new SQL pool

1. In the Synapse workspace where you want to create the SQL pool, click **New SQL pool** command in the top bar.
![Overview of Synapse Workspace with a red box around the command to create a new SQL pool.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-01.png)
2. Enter the following details in the **Basics** tab:

    | Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **SQL pool name** | Any valid name | Name of the SQL pool. |
    | **Performance level** | DW100c | Set to the smallest size to reduce costs for this quickstart |
    ||||
  
    ![SQL pool create flow - basics tab.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-02.png)
    > [!IMPORTANT]
    > Note that there are specific limitations for the names that SQL pools can use. Names can't contain special characters, must be 15 or less characters, not contain reserved words, and be unique in the workspace.

3. Click **Next: Additional settings**.
4. Select **None** to provision the SQL pool without data. Leave the default collation selected.
![SQL pool create flow - additional settings tab.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-03.png)

5. Click **Review + create**.
6. Make sure that the details look correct based on what was previously entered, and click **Create**.
![SQL pool create flow - review settings tab.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-04.png)

7. At this point, the resource provisioning flow will start.
 ![SQL pool create flow - resource provisioning.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-06.png)

8. After the provisioning completes, navigating back to the workspace will show a new entry for the newly created SQL pool.
 ![SQL pool create flow - resource provisioning.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-07.png)

## Clean up resources

Follow the steps below to delete the SQL pool from the workspace.
> [!WARNING]
> Deleting a SQL pool will both remove the analytics engine and the data stored in the database of the deleted SQL pool from the workspace. It will no longer be possible to connect to the SQL pool, and all queries, pipelines, and notebooks that read or write to this SQL pool will no longer work.

If you want to delete the SQL pool, complete the following steps:

1. Navigate to the SQL pools blade in the workspace blade
1. Select the SQL pool to be deleted (in this case, **contosoedw**)
1. Select it and press **delete**.
1. Confirm the deletion, and press **Delete** button.
 ![SQL pool overview - highlighting delete confirmation.](media/quickstart-create-sql-pool/quickstart-create-sql-pool-11.png)
1. When the process completes successfully, the SQL pool will no longer be listed in the workspace resources.

After the SQL pool is created, it will be available in the workspace for loading data, processing streams, reading from the lake, etc.

## Next steps

- See [Quickstart: Create an Apache Spark pool in Synapse Studio using web tools](spark/apache-spark-notebook-create-spark-use-sql.md).
- See [Quickstart: Create an Apache Spark pool using the Azure portal](quickstart-create-apache-spark-pool.md).
