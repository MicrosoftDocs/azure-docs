---
title: Azure Data Factory Mapping Data Flow Derived Column Transformation
description: How to transform data at scale with Azure Data Factory Mapping Data Flow Derived Column Transformation
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/08/2018
---

# Mapping data flow derived column transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use the Derived Column transformation to generate new columns in your data flow or to modify existing fields.

![derive column](media/data-flow/dc1.png "Derived Column")

You can perform multiple Derived Column actions in a single Derived Column transformation. Click "Add Column" to transform more than 1 column in the single transformation step.

In the Column field, either select an existing column to overwrite with a new derived value, or click "Create New Column" to generate a new column with the newly derived value.

The Expression text box will open the Expression Builder where you can build the expression for the derived columns using expression functions.

## Column patterns

If your column names are variable from your sources, you may wish to build transformations inside of the Derived Column using Column Patterns instead of using named columns. See the [Schema Drift](concepts-data-flow-schema-drift.md) article for more details.

![column pattern](media/data-flow/columnpattern.png "Column Patterns")

## Next steps

Learn more about the [Data Factory expression language for transformations](http://aka.ms/dataflowexpressions) and the [Expression Builder](concepts-data-flow-expression-builder.md)
