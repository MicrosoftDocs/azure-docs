---
title: Metafunctions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about metafunctions in mapping data flows.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 05/15/2024
---

# Metafunctions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about metafunctions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Metafunction list

Metafunctions primarily function on metadata in your data flow.

| Metafunction  | Task |
|----|----|
| [byItem](data-flow-expressions-usage.md#byItem) | Finds a subitem within a structure or an array of a structure. If there are multiple matches, the first match is returned. If there are no matches, a `NULL` value is returned. The returned value must be type converted by one of the type conversion actions (such as `? date` and `? string`). Address column names known at design time only by their names. Computed inputs aren't supported, but you can use parameter substitutions  |
| [byOrigin](data-flow-expressions-usage.md#byOrigin) | Selects a column value by name in the origin stream. The second argument is the origin stream name. If there are multiple matches, the first match is returned. If there are no matches, a `NULL` value is returned. The returned value must be type converted by one of the type conversion functions (such as `TO_DATE` and `TO_STRING`). Address column names known at design time only by their names. Computed inputs aren't supported, but you can use parameter substitutions.  |
| [byOrigins](data-flow-expressions-usage.md#byOrigins) | Selects an array of columns by name in the stream. The second argument is the stream where it originated from. If there are multiple matches, the first match is returned. If there are no matches, a `NULL` value is returned. The returned value must be type converted by one of the type conversion functions (such as `TO_DATE` and `TO_STRING`). Address column names known at design time only by their names. Computed inputs aren't supported, but you can use parameter substitutions.|
| [byName](data-flow-expressions-usage.md#byName) | Selects a column value by name in the stream. You can pass an optional stream name as the second argument. If there are multiple matches, the first match is returned. If there are no matches, a `NULL` value is returned. The returned value must be type converted by one of the type conversion functions (such as `TO_DATE` and `TO_STRING`). Address column names known at design time only by their names. Computed inputs aren't supported, but you can use parameter substitutions.  |
| [byNames](data-flow-expressions-usage.md#byNames) | Selects an array of columns by name in the stream. You can pass an optional stream name as the second argument. If there are multiple matches, the first match is returned. If there are no matches for a column, the entire output is a `NULL` value. The returned value requires a type conversion function (such as `toDate` and `toString`). Address column names known at design time only by their names. Computed inputs aren't supported, but you can use parameter substitutions.|
| [byPath](data-flow-expressions-usage.md#byPath) | Finds a hierarchical path by name in the stream. You can pass an optional stream name as the second argument. If no such path is found, it returns a `NULL` value. Address column names/paths known at design time only by their names or dot notation paths. Computed inputs aren't supported, but you can use parameter substitutions.  |
| [byPosition](data-flow-expressions-usage.md#byPosition) | Selects a column value by its relative position (1 based) in the stream. If the position is out of bounds, it returns a `NULL` value. The returned value must be type converted by one of the type conversion functions (such as `TO_DATE` and `TO_STRING`). Computed inputs aren't supported, but you can use parameter substitutions.  |
| [hasPath](data-flow-expressions-usage.md#hasPath) | Checks if a certain hierarchical path exists by name in the stream. You can pass an optional stream name as the second argument. Address column names/paths known at design time only by their names or dot notation paths. Computed inputs aren't supported, but you can use parameter substitutions.  |
| [originColumns](data-flow-expressions-usage.md#originColumns) | Gets all output columns for an origin stream where columns were created. Must be enclosed in another function.|
| [hex](data-flow-expressions-usage.md#hex) | Returns a hex string representation of a binary value.|
| [unhex](data-flow-expressions-usage.md#unhex) | Unhexes a binary value from its string representation. You can use it with `sha2` and `md5` to convert from string to binary representation.|
|||

## Related content

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [window functions](data-flow-window-functions.md).
- Usage details of all [data transformation expressions](data-flow-expressions-usage.md).
- Learn how to use [Expression Builder](concepts-data-flow-expression-builder.md).
