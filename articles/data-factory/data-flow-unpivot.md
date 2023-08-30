---
title: Unpivot transformation in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about the mapping data flow Unpivot Transformation in Azure Data Factory and Synapse Analytics.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/17/2023
---

# Unpivot transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Use Unpivot in a mapping data flow as a way to turn an unnormalized dataset into a more normalized version by expanding values from multiple columns in a single record into multiple records with the same values in a single column.

:::image type="content" source="media/data-flow/unpivot1.png" alt-text="Screenshot shows Unpivot selected from the menu.":::

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B1RR]

## Ungroup By

:::image type="content" source="media/data-flow/unpivot5.png" alt-text="Screenshot shows the Unpivot Settings with the Ungroup by tab selected.":::

First, set the columns that you wish to ungroup by for your unpivot aggregation. Set one or more columns for ungrouping with the + sign next to the column list.

## Unpivot Key

:::image type="content" source="media/data-flow/unpivot6.png" alt-text="Screenshot shows the Unpivot Settings with the Unpivot key tab selected.":::

The Unpivot Key is the column that the service will pivot from column to row. By default, each unique value in the dataset for this field will pivot to a row. However, you can optionally enter the values from the dataset that you wish to pivot to row values.

## Unpivoted Columns

:::image type="content" source="media/data-flow//unpivot7.png" alt-text="Screenshot shows the Unpivot Settings with the Data Preview tab selected.":::

Lastly, choose the column name for storing the values for unpivoted columns that are transformed into rows.

(Optional) You can drop rows with Null values.

For instance, SumCost is the column name that is chosen in the example shared above.

:::image type="content" source="media/data-flow/unpivot3.png" alt-text="Image showing the PO, Vendor, and Fruit columns before and after a unipivot transformation using the Fruit column as the unipivot key.":::

Setting the Column Arrangement to "Normal" will group together all of the new unpivoted columns from a single value. Setting the columns arrangement to "Lateral" will group together new unpivoted columns generated from an existing column.

:::image type="content" source="media/data-flow//unpivot7.png" alt-text="Screenshot shows the result of the transformation.":::

The final unpivoted data result set shows the column totals now unpivoted into separate row values.

## Next steps

Use the [Pivot transformation](data-flow-pivot.md) to pivot rows to columns.
