---
title: Using labels to instrument queries
description: Tips for using labels to instrument queries in SQL Analytics for developing solutions.
services: synapse-analytics
author: filippopovic
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 01/06/2020
ms.author: fipopovi
ms.reviewer: jrasnick
ms.custom: 
---

# Using labels to instrument queries in SQL Analytics
Tips for using labels to instrument queries in SQL Analytics for developing solutions.

> [!NOTE]
> SQL Analytics on-demand currently does not support labelling queries.


## What are labels?
SQL pool supports a concept called query labels. Before going into any depth, let's look at an example:

```sql
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query Label')
;
```

The last line tags the string 'My Query Label' to the query. This tag is particularly helpful since the label is query-able through the DMVs. Querying for labels provides a mechanism for locating problem queries and helping to identify progress through an ELT run.

A good naming convention really helps. For example, starting the label with PROJECT, PROCEDURE, STATEMENT, or COMMENT helps to uniquely identify the query among all the code in source control.

The following query uses a dynamic management view to search by label.

```sql
SELECT  *
FROM    sys.dm_pdw_exec_requests r
WHERE   r.[label] = 'My Query Label'
;
```

> [!NOTE]
> It is essential to put square brackets or double quotes around the word label when querying. Label is a reserved word and causes an error when it is not delimited. 
> 
> 

## Next steps
For more development tips, see [development overview](development-overview.md).


