---
# Mandatory fields.
title: Azure Digital Twins query language reference - FROM clauses
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language FROM clause
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/31/2021
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: FROM clause

This document contains reference information on the **FROM clause** for the [Azure Digital Twins query language](concepts-query-language.md).

The FROM clause is the second part of a query. It specifies the connection and any joins that the query will act on.

This clause is required for all queries.

## Core syntax: FROM DIGITALTWINS

Use `FROM DIGITALTWINS` (not case sensitive) to refer to the entire collection of digital twins in an instance. This is currently the only `FROM` collection that the query language supports.

You can also add a name to the collection of digital twins by adding the name to the end of the statement.

### Syntax

Basic:

```sql
--SELECT ...
FROM DIGITALTWINS
```

To name the collection:

```sql
--SELECT ...
FROM DIGITALTWINS <collection-name>
```

### Examples

Here is a basic query. The following query returns all digital twins in the instance. 

```sql
SELECT *
FROM DIGITALTWINS
```

Here is a query with a named collection. The following query assigns a name `T` to the collection, and still returns all digital twins in the instance.

```sql
SELECT *
FROM DIGITALTWINS T
```

## Using FROM and JOIN together

The `FROM` clause can be combined with the `JOIN` clause to express cross-entity traversals in the Azure Digital Twins graph.

For more information on the `JOIN` clause and crafting graph traversal queries, see [Azure Digital Twins query language reference: JOIN clause](reference-query-clause-join.md).

## Limitations

The following limits apply to queries using `FROM`.
* [No subqueries](#no-subqueries)

See the section below for more details.

### No subqueries

No subqueries are supported within the `FROM` statement.

#### Example (negative)

The following query shows an example of what **cannot** be done as per this limitation.

```sql
SELECT * 
FROM (SELECT * FROM DIGITALTWINS T WHERE ...)
```