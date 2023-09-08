---
title: Window transformation in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to use the mapping data flow Window Transformation in Azure Data Factory and Synapse Analytics pipelines.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/17/2023
---

# Window transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The Window transformation is where you will define window-based aggregations of columns in your data streams. In the Expression Builder, you can define different types of aggregations that are based on data or time windows (SQL OVER clause) such as LEAD, LAG, NTILE, CUMEDIST, RANK, etc.). A new field will be generated in your output that includes these aggregations. You can also include optional group-by fields.

:::image type="content" source="media/data-flow/windows1.png" alt-text="Screenshot shows Windowing selected from the menu.":::

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4IAVu]

## Over
Set the partitioning of column data for your window transformation. The SQL equivalent is the ```Partition By``` in the Over clause in SQL. If you wish to create a calculation or create an expression to use for the partitioning, you can do that by hovering over the column name and select "computed column".

:::image type="content" source="media/data-flow/windows-4.png" alt-text="Screenshot shows Windowing Settings with the Over tab selected.":::

## Sort
Another part of the Over clause is setting the ```Order By```. This will set the data sort ordering. You can also create an expression for a calculate value in this column field for sorting.

:::image type="content" source="media/data-flow/windows-5.png" alt-text="Screenshot shows Windowing Settings with the Sort tab selected.":::

## Range By
Next, set the window frame as Unbounded or Bounded. To set an unbounded window frame, set the slider to Unbounded on both ends. If you choose a setting between Unbounded and Current Row, then you must set the Offset start and end values. Both values will be positive integers. You can use either relative numbers or values from your data.

The window slider has two values to set: the values before the current row and the values after the current row. The Start and End offset matches the two selectors on the slider.

:::image type="content" source="media/data-flow/windows6.png" alt-text="Screenshot shows Windowing Settings with the Range by tab selected.":::

## Window columns
Lastly, use the Expression Builder to define the aggregations you wish to use with the data windows such as RANK, COUNT, MIN, MAX, DENSE RANK, LEAD, LAG, etc.

:::image type="content" source="media/data-flow/windows7.png" alt-text="Screenshot shows the result of the windowing action.":::

The full list of aggregation and analytical functions available for you to use in the Data Flow Expression Language via the Expression Builder are listed in [Data transformation expressions in mapping data flow](data-transformation-functions.md).

## Next steps

If you are looking for a simple group-by aggregation, use the [Aggregate transformation](data-flow-aggregate.md)
