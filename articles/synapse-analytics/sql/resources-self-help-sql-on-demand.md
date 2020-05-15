---
title: SQL on-demand Preview) self-help
description: This section contains information that can help you troubleshoot problems with SQL on-demand (preview).
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice:
ms.date: 05/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Self-help for SQL on-demand (preview)

This article contains information about how to troubleshoot most frequent problems with SQL on-demand (preview) in Azure Synapse Analytics.

## SQL on-demand is grayed out in Synapse Studio

If Synapse Studio can't establish connection to SQL on-demand, you'll notice that SQL on-demand is grayed out or shows status "Offline". Usually, this problem occurs when one of the following cases happens:

1) Your network prevents communication to Azure Synapse backend. Most frequent case is that port 1443 is blocked. To get the SQL on-demand to work unblock this port. Other problems could prevent SQL on-demand to work as well, [visit full troubleshooting guide for more information](../troubleshoot/troubleshoot-synapse-studio.md).
2) You don't have permissions to log into SQL on-demand. To gain access, one of the Azure Synapse workspace administrators should add you to workspace administrator or SQL administrator role. [Visit full guide on access control for more information](access-control.md).

## Query fails because file cannot be opened

If your query fails with the error saying 'File cannot be opened because it does not exist or it is used by another process' and you're sure both file exist and it's not used by another process it means SQL on-demand can't access the file. This problem usually happens because your Azure Active Directory identity doesn't have rights to access the file. By default, SQL on-demand is trying to access the file using your Azure Active Directory identity. To resolve this issue, you need to have proper rights to access the file. Easiest way is to grant yourself 'Storage Blob Data Contributor' role on the storage account you're trying to query. [Visit full guide on Azure Active Directory access control for storage for more information](../../storage/common/storage-auth-aad-rbac-portal.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json). 

## Query fails because it cannot be executed due to current resource constraints 

If your query fails with the error message 'This query cannot be executed due to current resource constraints', it means that SQL on-demand is not able to execute it at this moment due to resource constraints: 

- Please make sure data types of reasonable sizes are used. Also, specify schema for Parquet files for string columns as they will be VARCHAR(8000) by default. 

- If your query targets CSV files, consider [creating statistics](develop-tables-statistics.md#statistics-in-sql-on-demand-preview). 

- Visit [performance best practices for SQL on-demand](best-practices-sql-on-demand.md) to optimize query.  

## CREATE 'STATEMENT' is not supported in master database

If your query fails with the error message:

> 'Failed to execute query. Error: CREATE EXTERNAL TABLE/DATA SOURCE/DATABASE SCOPED CREDENTIAL/FILE FORMAT is not supported in master database.' 

it means that master database in SQL on-demand does not support creation of:
  - External tables
  - External data sources
  - Database scoped credentials
  - External file formats

Solution:

  1. Create a user database:

```sql
CREATE DATABASE <DATABASE_NAME>
```

  2. Execute create statement in the context of <DATABASE_NAME> which failed earlier for master database. 
  
  Example for creation of External file format:
    
```sql
USE <DATABASE_NAME>
CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat] 
WITH ( FORMAT_TYPE = PARQUET)
```

## Next steps

Review the following articles to learn more about how to use SQL on-demand:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Create and using views](create-use-views.md)

- [Create and using external tables](create-use-external-tables.md)

- [Store query results to storage](create-external-table-as-select.md)
