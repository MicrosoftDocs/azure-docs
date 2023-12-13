---
title: Use query labels in Synapse SQL
description: Included in this article are essential tips for using query labels in Synapse SQL.
author: filippopovic
ms.author: fipopovi
ms.reviewer: sngun
ms.date: 04/15/2020
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: conceptual
---

# Use query labels in Synapse SQL

Included in this article are essential tips for using query labels in Synapse SQL.

> [!NOTE]
> Serverless SQL pool doesn't support labelling queries.

## What are query labels

Dedicated SQL pool supports a concept called query labels. Before going into any depth, let's look at an example:

```sql
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query Label')
;
```

The last line tags the string 'My Query Label' to the query. This tag is helpful since the label is query-able through the DMVs. Querying for labels provides a mechanism for locating problem queries and helps to identify progress through an ELT run.

Good naming conventions are most helpful. For example, starting the label with PROJECT, PROCEDURE, STATEMENT, or COMMENT uniquely identifies the query among all the code in source control.

The following query uses a dynamic management view to search by label:

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
For more development tips, see [development overview](develop-overview.md).


