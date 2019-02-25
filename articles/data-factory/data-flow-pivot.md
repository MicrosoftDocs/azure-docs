---
title: Azure Data Factory Mapping Data Flow Pivot Transformation
description: Azure Data Factory Mapping Data Flow Pivot Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 01/30/2019
---

# Azure Data Factory Mapping Data Flow Pivot Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use Pivot in ADF Data Flow as an aggregation where one or more grouping columns has its distinct row values transformed into individual columns. Essentially, you can Pivot row values into new columns (turn data into metadata).

![Pivot options](media/data-flow/pivot1.png "pivot 1")

## Group By

![Pivot options](media/data-flow/pivot2.png "pivot 2")

First, set the columns that you wish to group by for your pivot aggregation. You can set more than 1 column here with the + sign next to the column list.

## Pivot Key

![Pivot options](media/data-flow/pivot3.png "pivot 3")

The Pivot Key is the column that ADF will pivot from row to column. By default, each unique value in the dataset for this field will pivot to a column. However, you can optionally enter the values from the dataset that you wish to pivot to column values.

## Pivoted Columns

![Pivot options](media/data-flow/pivot4.png "pivot 4")

Lastly, you will choose the aggregation that you wish to use for the pivoted values and how you would like the columns to be displayed in the new output projection from the transformation.

(Optional) You can set a naming pattern with a prefix, middle, and suffix to be added to each new column name from the row values.

For instance, pivoting "Sales" by "Region" would result in new column values from each sales value, i.e. "25", "50", "1000", etc. However, if you set a prefix value of "Sales " 

![Pivot options](media/data-flow/pivot5.png "pivot 5")

Setting the Column Arrangement to "Normal" will group together all of the pivoted columns with their aggregated values. Setting the columns arrangement to "Lateral" will alternate between column and value.

### Aggregation

To set the aggregation you wish to use for the pivot values, click on the field at the bottom of the Pivoted Columns pane. You will enter into the ADF Data Flow expression builder where you can build an aggregation expression and provide a descriptive alias name for your new aggregated values.

Use the ADF Data Flow Expression Language to describe the pivoted column transformations in the Expression Builder: https://aka.ms/dataflowexpressions.

### How to rejoin original fields
> [!NOTE]
> The Pivot transformation will only project the columns used in the aggregation, grouping, and pivot action. If you wish to include the other columns from the previous step in your flow, use a New Branch from the previous step and use the self-join pattern to connect the flow with the original metadata
