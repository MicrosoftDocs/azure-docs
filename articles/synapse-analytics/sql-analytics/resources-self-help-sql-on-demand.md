---
title: SQL On-demand self-help
description: This section contains information that can help you troubleshoot problems with SQL On-demand
services: synapse analytics
author: vvasic-msft
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice:
ms.date: 2/28/2020
ms.author: vvasic
ms.reviewer: jrasnick
---

# Self-help for SQL On-demand

This article contains information about how to troubleshoot most frequent problems with SQL On-demand in Synapse

## SQL On-demand is grayed out in Synapse Studio

If Synapse Studio can't establish connection to SQL On-demand, you will notice that SQL On-demand is grayed out or shows status "Offline". Usually, this problem occurs when one of the following is correct:
1) Your network prevents communication to Synapse backend. Most frequent case is that port 1443 is blocked. To get the SQL On-demand to work please unblock this port. Other problems could prevent SQL On-demand to work as well, [click here to read full troubleshooting guide](../troubleshoot/troubleshoot-synapse-studio.md)
2) You don't have permissions to log into SQL On-demand. To gain access, one of the Synapse workspace administrators should add you to workspace administrator or SQL administrator role. [Click here to read full guide on access control](access-control.md).

## Failed to execute a query: File cannot be opened because it does not exist or it is used by another process.

If your query fails when with the error saying that 'File cannot be opened because it does not exist or it is used by another process' and you are sure that both file exist and it's not used by another process it means that SQL On-demand can't access the file. This usually happens because your AAD identity doesn't have rights to access the file and SQL On-demand is trying to access the file using your AAD identity. To resolve this issue you need to have proper rights to access the file. Easiest way is to grant yourself 'Storage Blob Data Contributor' role on the storage account you are trying to query. [Click here to read full guide on AAD access control for storage](../../storage/common/storage-auth-aad-rbac-portal.md)

## Next steps

Take a look at these articles to learn more about how to use SQL On-demand:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Create and using views](create-use-views.md)

- [Create and using external tables](create-use-external-tables.md)

- [Store query results to storage](create-external-table-as-select.md)
