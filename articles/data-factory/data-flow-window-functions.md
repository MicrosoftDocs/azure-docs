---
title: Window Functions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about window functions in mapping data flows.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 05/15/2024
---

# Window functions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about window functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Window function list

The following functions are available only in window transformations.

| Window function | Task |
|----|----|
| [cumeDist](data-flow-expressions-usage.md#cumeDist) | Computes the position of a value relative to all values in the partition. The result is the number of rows preceding or equal to the current row in the ordering of the partition divided by the total number of rows in the window partition. Any tie values in the ordering evaluate to the same position.  |
| [denseRank](data-flow-expressions-usage.md#denseRank) | Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values don't produce gaps in the sequence. The `denseRank` function works even when data isn't sorted and looks for change in values.  |
| [lag](data-flow-expressions-usage.md#lag) | Gets the value of the first parameter evaluated `n` rows before the current row. The second parameter is the number of rows to look back, and the default value is `1`. If there aren't as many rows, a value of `null` is returned unless a default value is specified.  |
| [lead](data-flow-expressions-usage.md#lead) | Gets the value of the first parameter evaluated `n` rows after the current row. The second parameter is the number of rows to look forward, and the default value is `1`. If there aren't as many rows, a value of `null` is returned unless a default value is specified.  |
| [nTile](data-flow-expressions-usage.md#nTile) | Divides the rows for each window partition into `n` buckets ranging from `1` to at most `n`. Bucket values differ by at most `1`. If the number of rows in the partition doesn't divide evenly into the number of buckets, the remainder values are distributed one per bucket, starting with the first bucket. The ```NTile``` function is useful for the calculation of ```tertiles```, quartiles, deciles, and other common summary statistics.<br><br> The function calculates two variables during initialization. The size of a regular bucket has one extra row added to it. Both variables are based on the size of the current partition. During the calculation process, the function keeps track of the current row number, the current bucket number, and the row number at which the bucket changes (`bucketThreshold`). When the current row number reaches bucket threshold, the bucket value increases by one. The threshold increases by the bucket size (plus one extra if the current bucket is padded).  |
| [rank](data-flow-expressions-usage.md#rank) | Computes the rank of a value in a group of values specified in a window's order by clause. The result is one plus the number of rows preceding or equal to the current row in the ordering of the partition. The values produce gaps in the sequence. The `rank` function works even when data isn't sorted and looks for change in values.  |
| [rowNumber](data-flow-expressions-usage.md#rowNumber) | Assigns a sequential row numbering for rows in a window starting with `1`.  |
|||

## Related content

- List of all [aggregate functions](data-flow-aggregate-functions.md).
- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- Usage details of all [data transformation expressions](data-flow-expressions-usage.md).
- Learn how to use [Expression Builder](concepts-data-flow-expression-builder.md).