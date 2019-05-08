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

# Azure Data Factory Mapping Data Flow Aggregate Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

The Aggregate transformation is where you'll define aggregations of columns in your data streams. In the Expression Builder, you can define different types of aggregations (i.e. SUM, MIN, MAX, COUNT, etc.) and create a new field in your output that includes these aggregations with optional group-by fields.

![Aggregate Transformation options](media/data-flow/agg.png "aggregate 1")

## Group By
(Optional) Choose a Group-by clause for your aggregation and use either the name of an existing column or a new name. Use "Add Column" add more group-by clauses and click on the text box next to the column name to launch the Expression Builder to either select just an existing column, combination of columns or expressions for your grouping.

## The Aggregate Column tab 
(Required) Choose the Aggregate Column tab to build the aggregation expressions. You can either choose an existing column to overwrite the value with the aggregation, or create a new field with the new name for the aggregation. The expression that you wish to use for the aggregation will be entered in the right-hand box next to the column name selector. Clicking on that text box will open up the Expression Builder.

![Aggregate Transformation options](media/data-flow/agg2.png "aggregator")

## Data Preview in Expression Builder

In Debug mode, the expression builder cannot produce data previews with Aggregate functions. To view data previews for aggregate transformations, close the expression builder and view the data profile from the data flow designer.
