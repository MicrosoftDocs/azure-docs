---
title: Azure Data Factory Data Flow Join Transformation
description: Azure Data Factory Data Flow Join Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/07/2019
---

# Mapping Data Flow Join Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use Join to combine data from two tables in your Data Flow. Click on the transformation that will be the left relationship and add a Join transformation from the toolbox. Inside the Join transform, you will select another data stream from your data flow to be right relationship.

![Join Transformation](media/data-flow/join.png "Join")

## Join types

Selecting Join Type is required for the Join transformation.

### Inner Join

Inner join will pass through only rows that match the column conditions from both tables.

### Left Outer

All rows from the left stream not meeting the join condition are passed through, and output columns from the other table are set to NULL in addition to all rows returned by the inner join.

### Right Outer

All rows from the right stream not meeting the join condition are passed through, and output columns that correspond to the other table are set to NULL, in addition to all rows returned by the inner join.

### Full Outer

Full Outer produces all columns and rows from both sides with NULL values for columns that are not present in the other table.

### Cross Join

Specify the cross product of the two streams with an expression. You can use this to create custom join conditions.

## Specify Join Conditions

The Left Join condition is from the data stream connected to the left of your Join. The Right Join condition is the second data stream connected to your Join on the bottom, which will either be a direct connector to another stream or a reference to another stream.

You are required to enter at least 1 (1..n) join conditions. They can be fields that are either referenced directly, selected from the drop-down menu, or expressions.

## Join Performance Optimizations

Unlike Merge Join in tools like SSIS, Join in ADF Data Flow is not a mandatory merge join operation. Therefore, the join keys do not need to be sorted first. The Join operation will occur in Spark using Databricks based on the optimal join operation in Spark: Broadcast / Map-side join:

![Join Transformation optimize](media/data-flow/joinoptimize.png "Join Optimization")

If your dataset can fit into the Databricks worker node memory, we can optimize your Join performance. You can also specify partitioning of your data on the Join operation to create sets of data that can fit better into memory per worker.

## Self-Join

You can achieve self-join conditions in ADF Data Flow by using the Select transformation to alias an existing stream. First, create a "New Branch" from a stream, then add a Select to alias the entire original stream.

![Self-join](media/data-flow/selfjoin.png "Self-join")

In the above diagram, the Select transform is at the top. All it's doing is aliasing the original stream to "OrigSourceBatting". In the highlighted Join transform below it you can see that we use this Select alias stream as the right-hand join, allowing us to reference the same key in both the Left & Right side of the Inner Join.

## Composite and custom keys

You can build custom and composite keys on the fly inside the Join transformation. Add rows for additional join columns with the plus sign (+) next to each relationship row. Or compute a new key value in the Expression Builder for an on-the-fly join value.

## Next steps

After joining data, you can then [create new columns](data-flow-derived-column.md) and [sink your data to a destination data store](data-flow-sink.md).
