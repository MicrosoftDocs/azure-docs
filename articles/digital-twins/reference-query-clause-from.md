---
# Mandatory fields.
title: Azure Digital Twins query language reference - FROM clause
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language FROM clause
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/25/2022
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: FROM clause

This document contains reference information on the *FROM clause* for the [Azure Digital Twins query language](concepts-query-language.md).

The FROM clause is the second part of a query. It specifies the collection and any joins that the query will act on.

This clause is required for all queries.

## SELECT ... FROM DIGITALTWINS

Use `FROM DIGITALTWINS` (not case sensitive) to refer to the entire collection of digital twins in an instance.

You can optionally add a name to the collection of digital twins by adding the name to the end of the statement.

### Syntax

Basic:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromDigitalTwinsSyntax":::

To name the collection:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromDigitalTwinsNamedSyntax":::

### Examples

Here's a basic query. The following query returns all digital twins in the instance. 

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromDigitalTwinsExample":::

Here's a query with a named collection. The following query assigns a name `T` to the collection, and still returns all digital twins in the instance.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromDigitalTwinsNamedExample":::

## SELECT ... FROM RELATIONSHIPS

Use `FROM RELATIONSHIPS` (not case sensitive) to refer to the entire collection of relationships in an instance.

You can optionally add a name to the collection of relationships by adding the name to the end of the statement.

>[!NOTE]
> This feature cannot be combined with `JOIN`.

### Syntax

Basic:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromRelationshipsSyntax":::

To name the collection:

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromRelationshipsNamedSyntax":::

### Examples

Here's a query that returns all relationships in the instance. 

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromRelationshipsExample":::

Here's a query that returns all relationships coming from twins `A`, `B`, `C`, or `D`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromRelationshipsFilteredExample":::

## Using FROM and JOIN together

The `FROM` clause can be combined with the `JOIN` clause to express cross-entity traversals in the Azure Digital Twins graph.

For more information on the `JOIN` clause and crafting graph traversal queries, see [Azure Digital Twins query language reference: JOIN clause](reference-query-clause-join.md).

## Limitations

The following limits apply to queries using `FROM`.
* [No subqueries](#no-subqueries)
* [Choose FROM RELATIONSHIPS or JOIN](#choose-from-relationships-or-join)

For more information, see the following sections.

### No subqueries

No subqueries are supported within the `FROM` statement.

#### Example (negative)

The following query shows an example of what can't be done as per this limitation.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="FromNegativeExample":::

### Choose FROM RELATIONSHIPS or JOIN

The `FROM RELATIONSHIPS` feature cannot be combined with `JOIN`. You'll have to select which of these options works best for the information you'd like to select.


