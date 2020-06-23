---
title: sys.external_job_streams (Transact-SQL) - Azure SQL Edge (Preview)
description: Learn about using sys.external_job_streams in Azure SQL Edge (Preview)
keywords: sys.external_job_streams, SQL Edge
services: sql-edge
ms.service: sql-edge
ms.topic: reference
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2019
---

# sys.external_job_streams (Transact-SQL)

Returns a row each for the input or output external stream object mapped to an external streaming job.

|Column name|Data type|Description|  
|-----------------|---------------|-----------------|
|**job_id**|**int**| Object identification number for the streaming job object. This column maps to the object_id column of sys.external_streaming_jobs.|
|**stream_id**|**int**| Object identification number for the stream object. This column maps to the object_id column of sys.external_streams. |
|**is_input**|**bit**| 1 if the stream object is used an input for the streaming job, otherwise 0.|
|**is_output**|**bit**| 1 if the stream object is used an output for the streaming job, otherwise 0.|

## Example

This catalog view is used together with `sys.external_streams` and `sys.external_streaming_jobs` catalog views. A sample query is shown below

```sql
Select
    sj.Name as Job_Name,
    sj.Create_date as Job_Create_date,
    sj.modify_date as Job_Modify_date,
    sj.statement as Stream_Job_Query,
    Input_Stream_Name =
        Case js.is_input
            when 1 then s.Name
            else null
        END,
    output_Stream_Name =
        case js.is_output
            when 1 then s.Name
            else null
        END,
    s.location as Stream_Location
from sys.external_job_streams js
inner join sys.external_streams s on s.object_id = js.stream_id
inner join sys.external_streaming_jobs sj on sj.object_id = js.job_id
```

## Permissions

The visibility of the metadata in catalog views is limited to securables that a user either owns or on which the user has been granted some permission. For more information, see [Metadata Visibility Configuration](/sql/relational-databases/security/metadata-visibility-configuration/).

## See also

- [Catalog Views (Transact-SQL)](/sql/relational-databases/system-catalog-views/catalog-views-transact-sql/)
- [System Views (Transact-SQL)](/sql/t-sql/language-reference/)
