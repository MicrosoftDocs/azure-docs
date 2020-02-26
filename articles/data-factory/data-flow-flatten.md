---
title: Mapping data flow flatten transformation
description: Azure data factory mapping data flow flatten transformation
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/25/2020
---

# Azure Data Factory Flatten Transformation

![Flatten transformation 1](media/data-flow/flatten1.png "Flatten transformation 1")

The flatten transformation can be used to pivot array values inside of a hierarchical structure into new rows, essentially denormalizing your data.

![Flatten transformation 2](media/data-flow/flatten2.png "Flatten transformation 2")

## Unroll by

First, choose the array column that you wish to unroll and pivot.

## Unroll root

By default ADF will flatten the structure at the unroll array that you chose above. Or, you can choose a different part of the hierarchy to unroll to.

## Input columns

Lastly, choose the projection of your new structure based upon the incoming fields as well as the normalized column that you unrolled.

## Next steps

* Use the [Pivot transformation](data-flow-pivot.md) to pivot rows to columns.
* Use the [Unpivot transformation](data-flow-unpivot.md) to pivot columns to rows.
