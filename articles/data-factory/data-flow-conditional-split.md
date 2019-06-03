---
title: Azure Data Factory Mapping Data Flow Conditional Split Transformation
description: Azure Data Factory Data Flow Conditional Split Transformation
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/03/2019
---

# Mapping data flow conditional split transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

![conditional split toolbox](media/data-flow/conditionalsplit2.png "conditional split toolbox")

The Conditional Split transformation can route data rows to different streams depending on the content of the data. The implementation of the Conditional Split transformation is similar to a CASE decision structure in a programming language. The transformation evaluates expressions, and based on the results, directs the data row to the specified stream. This transformation also provides a default output, so that if a row matches no expression it is directed to the default output.

![conditional split](media/data-flow/conditionalsplit1.png "conditional split options")

## Multiple paths

To add additional conditions, select "Add Stream" in the bottom configuration pane and click in the Expression Builder text box to build your expression.

![conditional split multi](media/data-flow/conditionalsplit3.png "conditional split multi")

## Next steps

Common data flow transformations used with conditional split: [Join transformation](data-flow-join.md), [Loopup transformation](data-flow-lookup.md), [Select transformation](data-flow-select.md)
