---
title: Troubleshooting Guide for Azure Synapse Link Initial Snapshot Issues for Azure SQL Database and SQL Server
description: Learn how to troubleshoot Azure Synapse Link initial snapshot issues for Azure SQL Database and SQL Server
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala, prpasunu
ms.date: 12/02/2024
ms.service: azure-synapse-analytics
ms.subservice: synapse-link
ms.topic: how-to
---

# Troubleshoot: Azure Synapse Link for SQL initial snapshot issues

This article is a guide to troubleshooting issues with initial snapshot on Azure Synapse Link for Azure SQL Database and SQL Server.

Start by reviewing your configuration. For more information, see [Configure your source Azure SQL database](../connect-synapse-link-sql-database.md#configure-your-source-azure-sql-database).

## Symptom

The users can follow these resolution steps to investigate: 

- Determine if a link connection snapshot state is stuck.
- Determine if snapshot related errors are observed after starting the link connection.
- Understand the progress of the initial snapshot for individual tables.

## Resolution

### Step 1: Query to get the current snapshot state for the tables included in the link connection

Connect to the source database enabled for Azure Synapse Link using [SQL Server Management Studio](https://aka.ms/ssms) or [Azure Data Studio](https://aka.ms/azuredatastudio).

Run the following T-SQL command in the source database to list all the tables enabled for change feed and their snapshot-related columns from [changefeed.change_feed_tables](/sql/relational-databases/system-tables/changefeed-change-feed-tables-transact-sql). In the results from the query, check the `snapshot_phase` column. 

```sql
SELECT table_group_id, table_id, state, version, snapshot_phase, 
 snapshot_current_phase_time, snapshot_retry_count, snapshot_start_time,
 snapshot_end_time, snapshot_row_count 
FROM changefeed.change_feed_tables;
```

Example output:

:::image type="content" source="media/troubleshoot-sql-snapshot-issues/change-feed-tables-results-management-studio.png" alt-text="Screenshot from SQL Server Management Studio of the sample result set of the tables and columns from the changefeed.change_feed_tables system table." lightbox="media/troubleshoot-sql-snapshot-issues/change-feed-tables-results-management-studio.png":::

 - If the `snapshot_phase` column value for the desired table is 6 (`EMIT_SNAPSHOT_ENDENTRY`), it means snapshot has already completed on the table and needs no further investigation. 
 - Steps of the snapshot can take longer to complete than others. Phase 5 (`EXPORT_DATA_FILE`) can be a time-consuming step. When the table size is large, the `EXPORT_DATA_FILE` phase is expected to take longer to finish. For more information on the snapshot phases, see [changefeed.change_feed_tables](/sql/relational-databases/system-tables/changefeed-change-feed-tables-transact-sql).

When a snapshot has not completed for a given table, there are two possible cases to consider based on the output of [changefeed.change_feed_tables](/sql/relational-databases/system-tables/changefeed-change-feed-tables-transact-sql):

- When `Snapshot_phase` < 6 and `snapshot_retry_count` = 0, the snapshot operation is ongoing, without error. No action is needed in this case, wait for snapshot completion.
- When `Snapshot_phase` < 6 and `snapshot_retry_count` > 0, the snapshot operation has been failing and is being retried. Proceed to [Step 2](#step-2-snapshot-retry). For example, as in the following image:

:::image type="content" source="media/troubleshoot-sql-snapshot-issues/change-feed-tables-results-retries.png" alt-text="Screenshot from SQL Server Management Studio of the sample result set of the tables and columns from the changefeed.change_feed_tables system table, indicating retries." lightbox="media/troubleshoot-sql-snapshot-issues/change-feed-tables-results-retries.png":::

### Step 2: Snapshot retry

If errors have forced the snapshot to retry, find more information in the [sys.dm_change_feed_errors](/sql/relational-databases/system-dynamic-management-views/sys-dm-change-feed-errors) dynamic management view. Run the following T-SQL command in the source database:

```sql
SELECT * FROM sys.dm_change_feed_errors;
```

For example:

:::image type="content" source="media/troubleshoot-sql-snapshot-issues/change-feed-errors-results-management-studio.png" alt-text="Screenshot of the results of the sys.dm_change_feed_errors dynamic management view including possible snapshot errors to investigate." lightbox="media/troubleshoot-sql-snapshot-issues/change-feed-errors-results-management-studio.png":::

1. If any errors are observed from the snapshot component when `source_task` = 5, refer to error specific mitigation details in the [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md).
1. If the error is not found in the known limitations article, [submit an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) following the below instructions:
    1. For **Issue type**, select **Technical**.
    1. Provide the desired subscription of the source database. Select **Next**.
    1. For **Service type**, select **SQL Database**.
    1. For **Resource**, select the source database where the initial snapshot is failing.
    1. For **Summary**, provide the error numbers from `changefeed.change_feed_errors`.
    1. For **Problem type**, select **Data Sync, Replication, CDC and Change Tracking**.
    1. For **Problem subtype**, select **Transactional Replication**.
    
   :::image type="content" source="media/troubleshoot-sql-snapshot-issues/sql-snapshot-issues-support-request.png" alt-text="Screenshot of the Azure portal where a New support request has been prepared.":::

## Related content

- [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
- [Get started with Azure Synapse Link for SQL Server 2022](../connect-synapse-link-sql-server-2022.md)
- [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md)
