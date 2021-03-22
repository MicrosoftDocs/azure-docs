---
# Mandatory fields.
title: Azure Digital Twins query language reference - Limitations
titleSuffix: Azure Digital Twins
description: Reference documentation for the Azure Digital Twins query language limitations
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/22/2021
ms.topic: article
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language reference: Limitations

This document contains reference information on **limitations** for the [Azure Digital Twins query language](concepts-query-language.md).

## FROM limitations

The following limits apply to queries using `FROM`.
* [No subqueries](#no-subqueries)

See the section below for more details.

### No subqueries

No subqueries are supported within the `FROM` statement.

#### Example

The following example...

```sql
<example>
```

## JOIN limitations

The following limits apply to queries using `JOIN`.
* [Depth limit of five](#depth-limit-of-five)
* [No OUTER JOIN semantics](#no-outer-join-semantics)
* [Source twin required](#source-twin-required)

See the sections below for more details.

### Depth limit of five

Graph traversal depth is restricted to five `JOIN` levels per query.

#### Example

The following example...

```sql
<example>
```

### No OUTER JOIN semantics

`OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.

#### Example

The following example...

```sql
<example>
```

### Source twin required

Relationships in Azure Digital Twins can't be queried as independent entities; you also need to provide information about the source twin that the relationship comes from. This means that there are some restrictions on the `JOIN` operation, which is used to query relationships, to make sure that the query declares the twin(s) where the query begins. For examples of this, see [*Query by relationship*](how-to-query-graph.md#query-by-relationship) in the *How-to: Query the twin graph* article.

#### Example

The following example...

```sql
<example>
```

## Timing limitations

The following limits apply to timing.
* [Delay of up to 10 seconds](#delay-of-up-to-10-seconds)

See the section below for more details.

### Delay of up to 10 seconds

There may be a delay of up to 10 seconds before changes in your instance are reflected in queries. For example, if you complete an operation like creating or deleting twins with the DigitalTwins API, the result may not be immediately reflected in Query API requests. Waiting for a short period should be sufficient to resolve.