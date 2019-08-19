---
title: Derived Column transformation in Mapping Data Flow - Azure Data Factory | Microsoft Docs
description: Learn how to transform data at scale in Azure Data Factory with the Mapping Data Flow Derived Column transformation.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/08/2018
---

# Derived Column transformation in Mapping Data Flow

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use the Derived Column transformation to generate new columns in your data flow or to modify existing fields.

## Derived Column settings

To override an existing column, select it via the column dropdown. Otherwise, use the column selection field as a textbox and type in the new column's name. To build the derived column's expression, click on the 'Enter expression' box to open up the [Data Flow Expression Builder](concepts-data-flow-expression-builder.md).

![Derived column settings](media/data-flow/dc1.png "Derived column settings")

To add additional derived columns, hover over an existing derived column and click '+'. Then, choose either 'Add column' or 'Add column pattern'. Column patterns may come in handy if your column names are variable from your sources. For more information, see [Column Patterns](concepts-data-flow-column-pattern.md).

![New derived column selection](media/data-flow/columnpattern.png "New derived column selection")

## Next steps

- Learn more about the [Mapping Data Flow expression language](data-flow-expression-functions.md).
