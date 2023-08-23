---
title: Cached lookup functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about cached lookup functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/13/2023
---

# Cached lookup functions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The following articles provide details about cached lookup functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Cached lookup function list

The following functions are only available when using a cached lookup when you've included a cached sink.

| Cached lookup function | Task |
|----|----|
| [lookup](data-flow-expressions-usage.md#lookup) | Looks up the first row from the cached sink using the specified keys that match the keys from the cached sink.|
| [mlookup](data-flow-expressions-usage.md#mlookup) | Looks up the all matching rows from the cached sink using the specified keys that match the keys from the cached sink.|
| [output](data-flow-expressions-usage.md#output) | Returns the first row of the results of the cache sink|
| [outputs](data-flow-expressions-usage.md#outputs) | Returns the entire output row set of the results of the cache sink|
|||

## Next steps

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md).
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).