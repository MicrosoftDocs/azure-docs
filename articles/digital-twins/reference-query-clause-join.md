---
# Mandatory fields.
title: Azure Digital Twins query language reference - JOIN clause
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language JOIN clause
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

# Azure Digital Twins query language reference: JOIN clause

This document contains reference information on the *JOIN clause* for the [Azure Digital Twins query language](concepts-query-language.md).

The `JOIN` clause is used in the Azure Digital Twins query language as part of the [FROM clause](reference-query-clause-from.md) when you want to query to traverse the Azure Digital Twins graph.

This clause is optional while querying.

## Core syntax: JOIN ... RELATED 
Because relationships in Azure Digital Twins are part of digital twins, not independent entities, the `RELATED` keyword is used in `JOIN` queries to reference the set of relationships of a certain type from the twin collection (the type is specified using the relationship's `name` field from its [DTDL definition](concepts-models.md#basic-relationship-example)). The set of relationships can be assigned a collection name within the query.

The query must then use the `WHERE` clause to specify which specific twin or twins are being used to support the relationship query, which is done by filtering on either the source or target twin's `$dtId` value.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="JoinSyntax":::

### Example

The following query selects all digital twins that are related to the twin with an ID of `ABC` through a `contains` relationship.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="JoinExample":::

## Multiple JOINs

Up to five `JOIN`s are supported in a single query, which allows for the traversal of multiple levels of relationships at once.

### Syntax

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="MultiJoinSyntax":::

### Example

The following query is based on Rooms that contain LightPanels, and each LightPanel contains several LightBulbs. The query gets all the LightBulbs contained in the LightPanels of rooms 1 and 2.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="MultiJoinExample":::

## Limitations

The following limits apply to queries using `JOIN`.
* [Depth limit of five](#depth-limit-of-five)
* [No OUTER JOIN semantics](#no-outer-join-semantics)
* [Source twin required](#twins-required)

For more information, see the following sections.

### Depth limit of five

Graph traversal depth is restricted to five `JOIN` levels per query.

#### Example

The following query illustrates the maximum number of `JOIN` clauses that are possible in an Azure Digital Twins query. It gets all the LightBulbs in Building1.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="MaxJoinExample":::

### No OUTER JOIN semantics

`OUTER JOIN` semantics aren't supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.

#### Example

Consider the following query illustrating a building traversal.

:::code language="sql" source="~/digital-twins-docs-samples/queries/reference.sql" id="NoOuterJoinExample":::

If Building1 contains no floors, then this query will return an empty result set (instead of returning one row with a value for Building and `undefined` for Floor).

### Twins required

Relationships in Azure Digital Twins can't be queried as independent entities; you also need to provide information about the source twin that the relationship comes from. This functionality is included as part of the default `JOIN` usage in Azure Digital Twins through the `RELATED` keyword. 

Queries with a `JOIN` clause must also filter by any twin's `$dtId` property in the `WHERE` clause, to clarify which twin(s) are being used to support the relationship query.