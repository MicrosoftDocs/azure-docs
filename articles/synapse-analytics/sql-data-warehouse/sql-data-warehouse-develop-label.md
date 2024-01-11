---
title: Using labels to instrument queries
description: Tips for using labels to instrument queries for dedicated SQL pools in Azure Synapse Analytics.
author: MSTehrani
ms.author: emtehran
ms.reviewer: wiassaf
ms.date: 04/17/2018
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - azure-synapse
---

# Using labels to instrument queries for dedicated SQL pools in Azure Synapse Analytics

Included in this article are tips for developing solutions using labels to instrument queries in dedicated SQL pools.

## What are labels?

Dedicated SQL pool supports a concept called query labels. Before going into any depth, let's look at an example:

```sql
SELECT *
FROM sys.tables
OPTION (LABEL = 'My Query Label')
;
```

The last line tags the string 'My Query Label' to the query. This tag is helpful because the label is query-able through the DMVs.

Querying for labels provides a mechanism for locating problem queries and helping to identify progress through an ELT run.

A good naming convention really helps. For example, starting the label with PROJECT, PROCEDURE, STATEMENT, or COMMENT uniquely identifies the query among all the code in source control.

The following query uses a dynamic management view to search by label:

```sql
SELECT  *
FROM    sys.dm_pdw_exec_requests r
WHERE   r.[label] = 'My Query Label'
;
```

> [!NOTE]
> It is essential to put square brackets or double quotes around the word label when querying. Label is a reserved word and causes an error when it is not delimited.

## Next steps

For more development tips, see [development overview](sql-data-warehouse-overview-develop.md).
