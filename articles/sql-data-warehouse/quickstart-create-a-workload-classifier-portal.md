---
title: 'Quickstart: Create a workload classifier'
description: Create a workload classifier with high importance
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: quickstart
ms.subservice: manage
ms.date: 02/07/2019
ms.author: rortloff
ms.reviewer: jrasnick
---

# Quickstart: Create a workload classifier

In this quickstart, you'll quickly create a workload classifier with high importance for the CEO of your organization. This workload classifier will allow CEO queries to take precedence over other queries with lower importance in the queue.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

> [!NOTE]
> Creating a SQL Data Warehouse may result in a new billable service.  For more information, see [SQL Data Warehouse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).
>
>

## Prerequisites

This quickstart assumes you already have a SQL data warehouse and that you have CONTROL DATABASE permissions. If you need to create one, use [Create and Connect - portal](create-data-warehouse-portal.md) to create a data warehouse called **mySampleDataWarehouse**.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create TheCEO user in mySampleDataWarehouse

   ```sql
   CREATE USER [TheCEO] WITH DEFAULT_SCHEMA=[dbo]
    ```

## Create a workload classifier for TheCEO with high importance.

   ```sql
   DROP WORKLOAD CLASSIFIER wgcTheCEO;
   CREATE WORKLOAD CLASSIFIER wgcTheCEO
   WITH (WORKLOAD_GROUP = 'xlargerc'
         ,MEMBERNAME = 'TheCEO'
         ,IMPORTANCE = HIGH);
   ```

## Clean up resources

   ```sql
   DROP USER [TheCEO]
   DROP WORKLOAD CLASSIFIER wgcTheCEO;
   ```

You're being charged for data warehouse units and data stored your data warehouse. These compute and storage resources are billed separately.

- If you want to keep the data in storage, you can pause compute when you aren't using the data warehouse. By pausing compute, you're only charged for data storage. When you're ready to work with the data, resume compute.
- If you want to remove future charges, you can delete the data warehouse.

Follow these steps to clean up resources.

1. Sign in to the [Azure portal](https://portal.azure.com), select on your data warehouse.

    ![Clean up resources](media/load-data-from-azure-blob-storage-using-polybase/clean-up-resources.png)

1. To pause compute, select the **Pause** button. When the data warehouse is paused, you see a **Start** button.  To resume compute, select **Start**.

2. To remove the data warehouse so you're not charged for compute or storage, select **Delete**.

3. To remove the SQL server you created, select **mynewserver-20180430.database.windows.net** in the previous image, and then select **Delete**.  Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

4. To remove the resource group, select **myResourceGroup**, and then select **Delete resource group**.

## Next steps

You've now created a workload classifier. Run a few queries to see how they perform. See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.
