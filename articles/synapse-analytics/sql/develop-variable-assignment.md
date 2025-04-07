---
title: Assign variables with Synapse SQL
description: In this article, you'll find tips for assigning T-SQL variables with Synapse SQL.
author: azaricstefan 
ms.service: azure-synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 04/15/2020 
ms.author: stefanazaric 
---

# Assign variables with Synapse SQL

In this article, you'll find tips for assigning T-SQL variables with Synapse SQL.

## Set variables with DECLARE

Variables in Synapse SQL are set using the `DECLARE` statement or the `SET` statement. Initializing variables with DECLARE is one of the most flexible ways to set a variable value in Synapse SQL.

```sql
DECLARE @v  int = 0
;
```

You can also use DECLARE to set more than one variable at a time. You can't use SELECT or UPDATE to do the following:

```sql
DECLARE @v  INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Smith')
,       @v1 INT = (SELECT TOP 1 c_customer_sk FROM Customer where c_last_name = 'Jones')
;
```

You can't initialize and use a variable in the same DECLARE statement. To illustrate, the following example isn't allowed since *\@p1* is both initialized and used in the same DECLARE statement. The following example gives an error.

```sql
DECLARE @p1 int = 0
,       @p2 int = (SELECT COUNT (*) FROM sys.types where is_user_defined = @p1 )
;
```

## Set values with SET

SET is a common method for setting a single variable.

The following statements are all valid ways to set a variable with SET:

```sql
SET     @v = (Select max(database_id) from sys.databases);
SET     @v = 1;
SET     @v = @v+1;
SET     @v +=1;
```

You can only set one variable at a time with SET. However, compound operators are permissible.

## Limitations

You can't use UPDATE for variable assignment.

## Next steps

For more development tips, see the [Synapse SQL development overview](develop-overview.md) article.
