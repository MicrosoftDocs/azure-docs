---
title: Azure Data Factory Mapping Data Flow Aggregate Transformation
description: Azure Data Factory Data Flow Aggregate Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/01/2019
---

# Aggregate Transformation in Mapping Data Flow 

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

The Aggregate transformation is where you'll define aggregations of columns in your data streams. In the Expression Builder, you can define different types of aggregations (i.e. SUM, MIN, MAX, COUNT, etc.) and create a new field in your output that includes these aggregations with optional group by fields.

## Group By
Use either an existing column or create a new computed column to use as a group by clause for your aggregation. To use an existing column, select the desired column from the dropdown. To create a new computed column, hover over the clause and click 'Computed column'. This will open up the [Data Flow Expression Builder](concepts-data-flow-expression-builder). Once you create your computed column, enter the output column name under the 'Name as' field. If you wish to add an additional group by clause, hover over an existing clause and click '+'.

![Aggregate transformation group by settings](media/data-flow/agg.png "Aggregate transformation group by settings")

> [!NOTE]
> A group by clause is optional in an Aggregate transformation 

## Aggregate Column 
Choose the 'Aggregates' tab to build aggregation expressions. You can either choose an existing column and overwrite the value with the aggregation, or create a new field with a new name. The aggregation expression is entered in the right-hand box next to the column name selector. To edit the expression, click on the text box to open up the Expression Builder. To add an additional aggregation, hover over an existing expression and click '+' to create a new aggregation column or [column pattern](concepts-data-flow-column-pattern).

![Aggregate transformation aggregate settings](media/data-flow/agg2.png "Aggregate transformation aggregate settings")

> [!NOTE]
> Each aggregation expression must contain at least one aggregate function

> [!NOTE]
> In Debug mode, the expression builder cannot produce data previews with aggregate functions. To view data previews for aggregate transformations, close the expression builder and view the data via the 'Data Preview' tab.
