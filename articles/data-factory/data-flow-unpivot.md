---
title: Unpivot transformation in mapping data flow
description: Azure Data Factory mapping data flow Unpivot Transformation
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 07/14/2020
---

# Unpivot transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use Unpivot in ADF mapping data flow as a way to turn an unnormalized dataset into a more normalized version by expanding values from multiple columns in a single record into multiple records with the same values in a single column.

![Screenshot shows Unpivot selected from the menu.](media/data-flow/unpivot1.png "Unpivot options 1")

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4B1RR]

## Ungroup By

![Screenshot shows the Unpivot Settings with the Ungroup by tab selected.](media/data-flow/unpivot5.png "Unpivot options 2")

First, set the columns that you wish to ungroup by for your unpivot aggregation. Set one or more columns for ungrouping with the + sign next to the column list.

## Unpivot Key

![Screenshot shows the Unpivot Settings with the Unpivot key tab selected.](media/data-flow/unpivot6.png "Unpivot options 3")

The Unpivot Key is the column that ADF will pivot from column to row. By default, each unique value in the dataset for this field will pivot to a row. However, you can optionally enter the values from the dataset that you wish to pivot to row values.

## Unpivoted Columns

![Screenshot shows the Unpivot Settings with the Data Preview tab selected.](media/data-flow//unpivot7.png "Unpivot options 4")

Lastly, choose the column name for storing the values for unpivoted columns that are transformed into rows.

(Optional) You can drop rows with Null values.

For instance, SumCost is the column name that is chosen in the example shared above.

![Image showing the PO, Vendor, and Fruit columns before and after a unipivot transformation using the Fruit column as the unipivot key.](media/data-flow/unpivot3.png)

Setting the Column Arrangement to "Normal" will group together all of the new unpivoted columns from a single value. Setting the columns arrangement to "Lateral" will group together new unpivoted columns generated from an existing column.

![Screenshot shows the result of the transformation.](media/data-flow//unpivot7.png "Unpivot options 5")

The final unpivoted data result set shows the column totals now unpivoted into separate row values.

## Next steps

Use the [Pivot transformation](data-flow-pivot.md) to pivot rows to columns.
