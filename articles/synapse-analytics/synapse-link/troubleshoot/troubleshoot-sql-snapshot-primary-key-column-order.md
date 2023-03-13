---
title: Troubleshooting guide for Azure Synapse Link initial snapshot issues due to primary key column order for Azure SQL Database and SQL Server 
description: Learn how to troubleshoot Azure Synapse Link for SQL initial snapshot issues due to error 22724, primary key column order
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala, prpasunu
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 01/27/2023
---

# Troubleshoot: Azure Synapse Link for SQL initial snapshot fails on source table with primary key not listed as the first column in sequence

This article is a guide to troubleshoot issues using Azure Synapse Link for SQL where a source table enabled for data replication fails during the initial snapshot phase when the primary key column is not listed as first column based in the order of sequence. This article provides recommended steps to work around this issue and applies only to databases in Azure SQL Database and SQL Server 2022, using SQL Server Management Studio (SSMS) and the Azure Synapse Analytics workspace.

## Symptoms

### Symptom 1

During Azure Synapse Link's data replication phase, user may experience one or more table(s) data from the source SQL database is not being successfully replicated and stuck with a status indicating "WaitingforSnapshot" or "Failed".

To view the error message, query the system dynamic management view (DMV) [sys.dm_change_feed_errors](/sql/relational-databases/system-dynamic-management-views/sys-dm-change-feed-errors) to get the error message for error number 22724. See sample query below: 
 
```sql
SELECT session_id, error_number, error_message, source_task, entry_time 
FROM  sys.dm_change_feed_errors 
WHERE error_number = 22724;
```

In the query results, you will see an error message stating `Error occurred while exporting initial snapshot to landing zone.` The following screenshot shows a sample of this error message.

:::image type="content" source="media/troubleshoot-sql-snapshot-primary-key-column-order/error-22724-dm-change-feed-errors.png" alt-text="A screenshot from SSMS of the result set of sys.dm_change_feed_errors showing a sample error 22724." lightbox="media/troubleshoot-sql-snapshot-primary-key-column-order/error-22724-dm-change-feed-errors.png":::

### Symptom 2

In the Synapse Analytics workspace, under the **Monitor** menu tab, the **Status** of the table will show **WaitingForSnapshot** or **Failed**. The following screenshot shows a sample of this status.

:::image type="content" source="media/troubleshoot-sql-snapshot-primary-key-column-order/table-status-waitingforsnapshot.png" alt-text="A screenshot from the Azure Synapse Analytics workspace showing the status of the table dbo.TableWithLastColPK is WaitingForSnapshot." lightbox="media/troubleshoot-sql-snapshot-primary-key-column-order/table-status-waitingforsnapshot.png":::

### Symptom 3

Verify the cause of this issue with the following query on SQL Server system metadata.

1. In SSMS, open a **New Query** window.
1. Connect the SQL Server instance that is the source of the table. 
1. Copy the T-SQL query:

    ```sql
    DECLARE @PKColNames TABLE (VALUE NVARCHAR(50))
    
    INSERT INTO @PKColNames
    VALUES ('primarykey_column1') --edit column name(s) here
        ,('primarykey_column2');
    
    DECLARE @COUNTER INT = 0;
    DECLARE @MAX INT = (SELECT COUNT(*) FROM @PKColNames )
    DECLARE @VALUE VARCHAR(50);
    DECLARE @PK_COL_ID int;
    DECLARE @COL_CNT int WHILE @COUNTER < @MAX BEGIN SET @VALUE = (
            SELECT VALUE
            FROM      (SELECT (
                        ROW_NUMBER() OVER (
                            ORDER BY (
                                    SELECT NULL
                                    )
                            )
                        ) [index], VALUE FROM @PKColNames) R        
            ORDER BY R.[index] OFFSET @COUNTER ROWS FETCH NEXT 1 ROWS ONLY
            );
    
    SELECT @PK_COL_ID = column_id
    FROM sys.columns
    WHERE object_id = object_id('dbo.TableName')
        AND name = @VALUE
    
    SELECT @COL_CNT = count(*)
    FROM sys.columns
    WHERE object_id = object_id('dbo.TableName')
        AND column_id <= (@PK_COL_ID)  
    
    IF (@COL_CNT < @PK_COL_ID)         
        PRINT 'Column before primary key ' + @VALUE + ' was deleted'; 
    ELSE                  
        PRINT 'No column before this primary key ' + @VALUE + ' was deleted';
    
    SET @COUNTER = @COUNTER + 1;
    END
    ```
1. Replace `dbo.TableName` with the source table name (including the schema) which is in status 'WaitingForSnapshot'. 
1. Provide the primary key column name(s) in the INSERT statement into the @PKColNames table variable, replacing "primarykey_column" values. Add one row for each column in the primary key as necessary.
    1. To retrieve the primary key column names, use the following query replacing the `dbo.TableName` with the source table name, and execute the query.
        ```sql
        SELECT c.name
        FROM sys.objects o
        INNER JOIN sys.columns c ON o.object_id = c.object_id
        INNER JOIN sys.index_columns ic ON o.object_id = ic.object_id
            AND ic.column_id = c.column_id
        INNER JOIN sys.indexes i ON o.object_id = i.object_id
            AND i.index_id = ic.index_id
        WHERE i.is_primary_key = 1
            AND o.object_id = object_id('dbo.TableName');
        ```
1. Execute the query and view the text output. If the query run result shows `Column before primary key was deleted.`, it can be confirmed that Snapshot is stuck because of primary key column order error. Proceed with the below resolution steps. 

## Potential causes

The SQL Server source database publisher is having issues with identifying the primary key columns during schema export due to the column count changes. This can occur when the primary key column(s) are not defined as the first column(s) in a table, and column(s) to the left of the primary key column(s) are dropped, before enabling change feed. The columns could have been dropped any time in the past. In this scenario, the SQL publisher uses an incorrect `column_id` to query the primary key column(s).

## Resolution

### Step 1:

In the Synapse Analytics workspace, remove the source table from the **Integrate** tab by selecting the delete icon, as in the following screenshot. This removes the destination table from Azure Synapse.

:::image type="content" source="media/troubleshoot-sql-snapshot-primary-key-column-order/remove-table-from-integrate-tab.png" alt-text="A screenshot from the Synapse Analytics workspace showing tables in the Synapse Link for SQL. A red box is around the delete icon for the row of the table dbo.TableWithLastColPK." lightbox="media/troubleshoot-sql-snapshot-primary-key-column-order/remove-table-from-integrate-tab.png":::

### Step 2:

A column change is likely the reason why the table cannot successfully snapshot, so another table column order change is necessary. 

1. Re-order the table columns. Move any of the primary key column(s) to be the first column(s) in the table.

> [!CAUTION] 
> If the table has many rows, there may be an impact on heavy workload on system resources for the table being altered. The table being altered could be assigned a table level lock, blocking concurrent access to the table by other applications. 
> 
> This step will require recreation of this table, also removing individually-assigned permissions to the table. Script out any permissions for the table and reapply them after the columns are re-ordered.

To change the order of columns in a table, refer to [Change Column Order in a Table](/sql/relational-databases/tables/change-column-order-in-a-table). It may be necessary to change the configuration of SSMS, to disable the default safety setting **Prevent saving changes that require table re-creation.**

### Step 3: 

1. In the Synapse Analytics workspace, under the **Integrate** tab menu, select **+New Table**. 
1. In the **Add new tables** page, add the altered table.
1. Publish the changes.

The table should now start replicating.

:::image type="content" source="media/troubleshoot-sql-snapshot-primary-key-column-order/table-status-replicating.png" alt-text="A screenshot from the Azure Synapse Analytics workspace showing the status of the table dbo.TableWithLastColPK is Replicating." lightbox="media/troubleshoot-sql-snapshot-primary-key-column-order/table-status-replicating.png":::

## Next steps

 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
 - [Get started with Azure Synapse Link for SQL Server 2022](../connect-synapse-link-sql-server-2022.md)
 - [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md)
 - [Troubleshoot: Azure Synapse Link for SQL initial snapshot issues](troubleshoot-sql-snapshot-issues.md)
