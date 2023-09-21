---
title: Streaming catalog views (Transact-SQL) - Azure SQL Edge
description: Learn about the available streaming catalog views and dynamic management views in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: reference
keywords:
  - sys.external_streams
  - SQL Edge
---
# Streaming catalog views (Transact-SQL)

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

This section contains the available catalog views and functions that are related to Transact-SQL streaming.

## In this section

| View | Description |
| :--- | :--- |
| [sys.external_streams](sys-external-streams.md) | Returns a row for each external stream object created within the scope of the database. |
| [sys.external_streaming_jobs](sys-external-streaming-jobs.md) | Returns a row for each external streaming job created within the scope of the database. |
| [sys.external_job_streams](sys-external-job-streams.md) | Returns a row each for the input or output external stream object mapped to an external streaming job. |

## See also

- [Catalog views (Transact-SQL)](/sql/relational-databases/system-catalog-views/catalog-views-transact-sql/)
- [System views (Transact-SQL)](/sql/t-sql/language-reference/)
