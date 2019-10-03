---
title: Azure Data Factory Mapping Data Flow Sort Transformation
description: Azure Data Factory Mapping Data Sort Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/08/2018
---

# Azure Data Factory Data Flow Sort Transformations

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

![Sort settings](media/data-flow/sort.png "Sort")

The Sort transformation allows you to sort the incoming rows on the current data stream. The outgoing rows from the Sort Transformation will subsequently follow the ordering rules that you set. You can choose individual columns and sort them ASC or DEC, using the arrow indicator next to each field. If you need to modify the column before applying the sort, click on "Computed Columns" to launch the expression editor. This will provide with an opportunity to build an expression for the sort operation instead of simply applying a column for the sort.

## Case insensitive
You can turn on "Case insensitive" if you wish to ignore case when sorting string or text fields.

"Sort Only Within Partitions" leverages Spark data partitioning. By sorting incoming data only within each partition, Data Flows can sort partitioned data instead of sorting entire data stream.

Each of the sort conditions in the Sort Transformation can be rearranged. So if you need to move a column higher in the sort precedence, grab that row with your mouse and move it higher or lower in the sorting list.

Partitioning effects on Sort

ADF Data Flow is executed on big data Spark clusters with data distributed across multiple nodes and partitions. It is important to keep this in mind when architecting your data flow if you are depending on the Sort transform to keep data in that same order. If you choose to repartition your data in a subsequent transformation, you may lose your sorting due to that reshuffling of data.

## Next steps

After sorting, you may want to use the [Aggregate Transformation](data-flow-aggregate.md)
