---
title: sys.external_job_streams (Transact-SQL) - Azure SQL Edge
description: Learn about using sys.external_job_streams in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: reference
keywords:
  - sys.external_job_streams
  - SQL Edge
---
# sys.external_job_streams (Transact-SQL)

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Returns a row each for the input or output external stream object mapped to an external streaming job.

| Column name | Data type | Description |
| --- | --- | --- |
| **job_id** | **int** | Object identification number for the streaming job object. This column maps to the object_id column of `sys.external_streaming_jobs`. |
| **stream_id** | **int** | Object identification number for the stream object. This column maps to the object_id column of `sys.external_streams`. |
| **is_input** | **bit** | `1` if the stream object is used an input for the streaming job, otherwise `0`. |
| **is_output** | **bit** | `1` if the stream object is used an output for the streaming job, otherwise `0`. |

## Examples

This catalog view is used together with `sys.external_streams` and `sys.external_streaming_jobs` catalog views. A sample query is shown as follows:

```sql
SELECT sj.Name AS Job_Name,
    sj.Create_date AS Job_Create_Date,
    sj.modify_date AS Job_Modify_Date,
    sj.statement AS Stream_Job_Query,
    Input_Stream_Name = CASE js.is_input
        WHEN 1 THEN s.Name
        ELSE NULL
        END,
    output_Stream_Name = CASE js.is_output
        WHEN 1 THEN s.Name
        ELSE NULL
        END,
    s.location AS Stream_Location
FROM sys.external_job_streams js
INNER JOIN sys.external_streams s
    ON s.object_id = js.stream_id
INNER JOIN sys.external_streaming_jobs sj
    ON sj.object_id = js.job_id;
```

## Permissions

The visibility of the metadata in catalog views is limited to securables that a user either owns or on which the user has been granted some permission. For more information, see [Metadata Visibility Configuration](/sql/relational-databases/security/metadata-visibility-configuration/).

## See also

- [Catalog Views (Transact-SQL)](/sql/relational-databases/system-catalog-views/catalog-views-transact-sql/)
- [System Views (Transact-SQL)](/sql/t-sql/language-reference/)
