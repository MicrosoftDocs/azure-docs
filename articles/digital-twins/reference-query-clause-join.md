---
# Mandatory fields.
title: Azure Digital Twins query language reference - JOIN clauses
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language JOIN clause
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

# Azure Digital Twins query language reference: JOIN clause

This document contains reference information on the **JOIN clause** for the [Azure Digital Twins query language](concepts-query-language.md).

The `JOIN` clause is used in the Azure Digital Twins query language as part of the [FROM clause](reference-query-clause-from.md) when you want to query from a relationship collection.

This clause is optional while querying.

## Core syntax: JOIN ... RELATED 
Because relationships in Azure Digital Twins are part of digital twins, not independent entities, the `RELATED` keyword is used in `JOIN` queries to reference the set of relationships from a twin, which is then assigned a collection name.

### Syntax

```sql
--SELECT ...
FROM DIGITALTWINS <twin-collection-name>
JOIN <relationship-collection-name> RELATED <twin-collection-name>.<relationship-type>
```

### Example

The following query selects all digital twins that are related to the twin with an ID of *ABC* through a *contains* relationship.

```sql
SELECT T, CT
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
WHERE T.$dtId = 'ABC'
```

## Multiple JOINs

Up to five `JOIN`s are supported in a single query, which allows for the traversal of multiple levels of relationships at once.

### Syntax

```sql
--SELECT ...
FROM DIGITALTWINS <twin-collection-name>
JOIN <relationship-collection-name-1> RELATED <twin-collection-name>.<relationship-type-1>
JOIN <relationship-collection-name-2> RELATED <twin-or-relationship-collection-name>.<relationship-type-2>
```

### Example

The following query is based on Rooms that contain LightPanels, and each LightPanel contains several LightBulbs. The query gets all the LightBulbs contained in the LightPanels of rooms 1 and 2.

```sql
SELECT LightBulb
FROM DIGITALTWINS Room
JOIN LightPanel RELATED Room.contains
JOIN LightBulb RELATED LightPanel.contains
WHERE Room.$dtId IN ['room1', 'room2']
```

## JOIN with variable-hop

### Example

The following example...

```sql
<example>
```

## Limitations

The following limits apply to queries using `JOIN`.
* [Depth limit of five](#depth-limit-of-five)
* [No OUTER JOIN semantics](#no-outer-join-semantics)
* [Source twin required](#source-twin-required)

See the sections below for more details.

### Depth limit of five

Graph traversal depth is restricted to five `JOIN` levels per query.

#### Example

The following query illustrates the maximum number of `JOINs` that are possible in an Azure Digital Twins query. It gets all the LightBulbs in Buliding1.

```sql
SELECT LightBulb
FROM DIGITALTWINS Building
JOIN Floor RELATED Building.contains
JOIN Room RELATED Floor.contains
JOIN LightPanel RELATED Room.contains
JOIN LightBulbRow RELATED LightPanel.contains
JOIN LightBulb RELATED LightBulbRow.contains
WHERE Buliding.$dtId = 'Building1'
```

### No OUTER JOIN semantics

`OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.

#### Example (negative)

The following query shows an example of what **cannot** be done as per this limitation.

```sql
<example>
```

### Source twin required

Relationships in Azure Digital Twins can't be queried as independent entities; you also need to provide information about the source twin that the relationship comes from. This means that there are some restrictions on the `JOIN` operation, which is used to query relationships, to make sure that the query declares the twin(s) where the query begins.

The requirements of this limitation are considered part of the default `JOIN` usage in Azure Digital Twins.