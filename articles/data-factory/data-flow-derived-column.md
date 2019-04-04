---
title: Azure Data Factory Data Flow Derived Column Transformation
description: Azure Data Factory Data Flow Derived Column Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/08/2018
---

# Azure Data Factory Data Flow Derived Column Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use the Derived Column transformation to generate new columns in your data flow or to modify existing fields.

![derive column](media/data-flow/dc1.png "Derived Column")

You can perform multiple Derived Column actions in a single Derived Column transformation. Click "Add Column" to transform more than 1 column in the single transformation step.

In the Column field, either select an existing column to overwrite with a new derived value, or click "Create New Column" to generate a new column with the newly derived value.

The Expression text box will open the Expression Builder where you can build the expression for the derived columns using expression functions.
