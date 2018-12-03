---
title: Using labels to instrument queries in SQL Data Warehouse | Microsoft Docs
description: Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: rortloff
ms.reviewer: igorstan
---

# Using labels to instrument queries in Azure SQL Data Warehouse
Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions.


## What are labels?
SQL Data Warehouse supports a concept called query labels. Before going into any depth, let's look at an example:

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
For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).


