---
title: Use labels to instrument queries in SQL Data Warehouse | Microsoft Docs
description: Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.assetid: 44988de8-04c1-4fed-92be-e1935661a4e8
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: queries
ms.date: 10/31/2016
ms.author: jrj;barbkess

---
# Use labels to instrument queries in SQL Data Warehouse
SQL Data Warehouse supports a concept called query labels. Before going into any depth let's look at an example of one:

```sql
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query Label')
;
```

This last line tags the string 'My Query Label' to the query. This is particularly helpful as the label is query-able through the DMVs. This provides us with a mechanism to track down problem queries and also to help identify progress through an ETL run.

A good naming convention really helps here. For example something like ' PROJECT : PROCEDURE : STATEMENT : COMMENT' would help to uniquely identify the query in amongst all the code in source control.

To search by label you can use the following query that uses the dynamic management views:

```sql
SELECT  *
FROM    sys.dm_pdw_exec_requests r
WHERE   r.[label] = 'My Query Label'
;
```

> [!NOTE]
> It is essential that you wrap square brackets or double quotes around the word label when querying. Label is a reserved word and will caused an error if it has not been delimited.
> 
> 

## Next steps
For more development tips, see [development overview][development overview].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
