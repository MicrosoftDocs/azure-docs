---
# Mandatory fields.
title: Azure Digital Twins query language reference - SELECT clauses
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language SELECT clause
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

# Azure Digital Twins query language reference: SELECT clause

This document contains reference information on the **SELECT clause** for the [Azure Digital Twins query language](concepts-query-language.md).

The SELECT clause is the first part of a query. It specifies the list of columns that the query will return.

This clause is required for all queries.

## SELECT *

Use the `*` character in a select statement to select all digital twins that meet the query requirements.

### Syntax

```sql
SELECT *
--FROM ...
```

### Returns

A collection of twins.

### Example

The following query returns all digital twins in the instance. 

```sql
SELECT *
FROM DIGITALTWINS
```

## SELECT columns with projections

You can use projections in the SELECT clause to choose which columns a query will return. You can specify named collections of twins and relationships, or properties of twins and relationships.

At this time, complex properties are not supported. To make sure that projection properties are valid, combine the projections with an `IS_PRIMITIVE` check.

### Syntax

To project a collection:
```sql
SELECT <twin-or-relationship-collection>
```

To project a property:
```sql
SELECT <twin-or-relationship-collection>.<property-name>
```

### Returns

A collection of twins, properties, or relationships.

### Examples

Here is an example that projects a collection. The following query returns all digital twins in the instance, by naming the entire twin collection `T` and projecting `T` as the collection to return. 

```sql
SELECT T
FROM DIGITALTWINS T
```

This is commonly used to return a collection specified in a `JOIN`. The following query uses projection to return the Consumer, Factory and Edge from a scenario where the a Factory called ABC has a Factory.consumer relationship with a Consumer, and that relationship is presented as Edge. For more about the `JOIN` syntax used in the example, see [Azure Digital Twins query language reference: JOIN clause](reference-query-clause-join.md).

```sql
SELECT Consumer, Factory, Edge
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
```

Here is an example that projects a property. The following query uses projection to return the `name` property of a Consumer-type twin, and the `prop2` property of the Edge relationship. Note that the query uses `IS_PRIMITIVE` to verify that the property names are of primitive types, since complex properties are not currently supported by projection.

```sql
SELECT Consumer.name, Edge.prop2
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Consumer.name) AND IS_PRIMITIVE(Edge.prop2)
```

## SELECT COUNT

Use this method to count the number of items in the result set and return that number.

### Syntax

```sql
SELECT COUNT()
```

### Arguments

None.

### Returns

An `int` value.

### Example

The following query returns the count of all digital twins in the instance.

```sql
SELECT COUNT()
FROM DIGITALTWINS
```

## SELECT TOP

Use this method to return only a certain number of top items that meet the query requirements.

### Syntax

```sql
SELECT TOP(<number-of-return-items>)
```

### Arguments

An `int` value specifying the number of top items to select.

### Returns

A collection of twins.

### Example

The following query returns only the first five digital twins in the instance.

```sql
SELECT TOP(5)
FROM DIGITALTWINS
```