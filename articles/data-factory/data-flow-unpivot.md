---
title: Mapping data flow Unpivot Transformation
description: Azure Data Factory mapping data flow Unpivot Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 01/30/2019
---

# Azure Data Factory Unpivot Transformation

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use Unpivot in ADF mapping data flow as a way to turn an unnormalized dataset into a more normalized version by expanding values from multiple columns in a single record into multiple records with the same values in a single column.

![Unpivot Transformation](media/data-flow/unpivot1.png "Unpivot options 1")

## Ungroup By

![Unpivot Transformation](media/data-flow/unpivot5.png "Unpivot options 2")

First, set the columns that you wish to group by for your pivot aggregation. Set one or more columns for ungrouping with the + sign next to the column list.

## Unpivot Key

![Unpivot Transformation](media/data-flow/unpivot6.png "Unpivot options 3")

The Pivot Key is the column that ADF will pivot from row to column. By default, each unique value in the dataset for this field will pivot to a column. However, you can optionally enter the values from the dataset that you wish to pivot to column values.

## Unpivoted Columns

![Unpivot Transformation](media/data-flow//unpivot7.png "Unpivot options 4")

Lastly, choose the aggregation that you wish to use for the pivoted values and how you would like the columns to be displayed in the new output projection from the transformation.

(Optional) You can set a naming pattern with a prefix, middle, and suffix to be added to each new column name from the row values.

For instance, pivoting "Sales" by "Region" would simply give you new column values from each sales value. For example: "25", "50", "1000", ... However, if you set a prefix value of "Sales", then "Sales" will be prefixed to the values.

<img src="media/data-flow/unpivot3.png" width="400">

Setting the Column Arrangement to "Normal" will group together all of the pivoted columns with their aggregated values. Setting the columns arrangement to "Lateral" will alternate between column and value.

![Unpivot Transformation](media/data-flow//unpivot7.png "Unpivot options 5")

The final unpivoted data result set shows the column totals now unpivoted into separate row values.

## Next steps

Use the [Pivot transformation](data-flow-pivot.md) to pivot rows to columns.
