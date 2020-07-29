---
title: ALTER EXTERNAL STREAM (Transact-SQL) - Azure SQL Edge (Preview)
description: Learn about the ALTER EXTERNAL STREAM statement in Azure SQL Edge (Preview)
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# ALTER EXTERNAL STREAM (Transact-SQL)

Modifies the definition of an External Stream. Modifying an External Stream that is used by a streaming job in a *Running* state is not allowed. 



## Syntax

```sql
  ALTER EXTERNAL STREAM external_stream_name 
  SET 
    [DATA_SOURCE] = <data_source_name> 
    , LOCATION = <location_name> 
    , EXTERNAL_FILE_FORMAT = <external_file_format_name> 
    , INPUT_OPTIONS = <input_options> 
    , OUTPUT_OPTIONS = <output_options> 
```

## Arguments

For details on the Alter External Stream command arguments, see [CREATE EXTERNAL STREAM (Transact-SQL)](create-external-stream-transact-sql.md).

## Return code values

ALTER EXTERNAL STREAM returns 0 if successful. A non-zero return value indicates failure.


## See also

- [CREATE EXTERNAL STREAM (Transact-SQL)](create-external-stream-transact-sql.md) 
- [DROP EXTERNAL STREAM (Transact-SQL)](drop-external-stream-transact-sql.md) 
