---
title: 'Quickstart: Create a workload classifier - T-SQL | Microsoft Docs'
description: Use T-SQL to create a workload classifier with high importance.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: quickstart
ms.subservice: workload-management
ms.date: 05/01/2019
ms.author: rortloff
ms.reviewer: jrasnick
---

# Quickstart: Create a workload classifier using T-SQL

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

## Create login for TheCEO

Create a SQL Server authentication login in the `master` database using [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql) for 'TheCEO'.

```sql
IF NOT EXISTS (SELECT * FROM sys.sql_logins WHERE name = 'TheCEO')
BEGIN
CREATE LOGIN [TheCEO] WITH PASSWORD='<strongpassword>'
END
;
```

## Create user

[Create user](/sql/t-sql/statements/create-user-transact-sql?view=azure-sqldw-latest), "TheCEO", in mySampleDataWarehouse

```sql
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'THECEO')
BEGIN
CREATE USER [TheCEO] FOR LOGIN [TheCEO]
END
;
```

## Create a workload classifier

Create a [workload classifier](/sql/t-sql/statements/create-workload-classifier-transact-sql?view=azure-sqldw-latest) for "TheCEO" with high importance.

```sql
DROP WORKLOAD CLASSIFIER [wgcTheCEO];
CREATE WORKLOAD CLASSIFIER [wgcTheCEO]
WITH (WORKLOAD_GROUP = 'xlargerc'
      ,MEMBERNAME = 'TheCEO'
      ,IMPORTANCE = HIGH);
```

## View existing classifiers

```sql
SELECT * FROM sys.workload_management_workload_classifiers
```

## Clean up resources

```sql
DROP WORKLOAD CLASSIFIER [wgcTheCEO]
DROP USER [TheCEO]
;
```

You're being charged for data warehouse units and data stored in your data warehouse. These compute and storage resources are billed separately.

- If you want to keep the data in storage, you can pause compute when you aren't using the data warehouse. By pausing compute, you're only charged for data storage. When you're ready to work with the data, resume compute.
- If you want to remove future charges, you can delete the data warehouse.

Follow these steps to clean up resources.

1. Sign in to the [Azure portal](https://portal.azure.com), select on your data warehouse.

    ![Clean up resources](media/load-data-from-azure-blob-storage-using-polybase/clean-up-resources.png)

2. To pause compute, select the **Pause** button. When the data warehouse is paused, you see a **Start** button.  To resume compute, select **Start**.

3. To remove the data warehouse so you're not charged for compute or storage, select **Delete**.

4. To remove the SQL server you created, select **mynewserver-20180430.database.windows.net** in the previous image, and then select **Delete**.  Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

5. To remove the resource group, select **myResourceGroup**, and then select **Delete resource group**.

## Next steps

- You've now created a workload classifier. Run a few queries as TheCEO to see how they perform. See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.
- For more information about Azure SQL Data Warehouse workload management, see [Workload Importance](sql-data-warehouse-workload-importance.md) and [Workload Classification](sql-data-warehouse-workload-classification.md).
- See the how-to articles to [Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md) and how to [Manage and monitor Workload Management](sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).
