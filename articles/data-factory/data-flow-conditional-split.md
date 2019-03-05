---
title: Azure Data Factory Mapping Data Flow Conditional Split Transformation
description: Azure Data Factory Data Flow Conditional Split Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/03/2019
---

# Azure Data Factory Mapping Data Flow Conditional Split Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

The Conditional Split transformation can route data rows to different streams depending on the content of the data. The implementation of the Conditional Split transformation is similar to a CASE decision structure in a programming language. The transformation evaluates expressions, and based on the results, directs the data row to the specified stream. This transformation also provides a default output, so that if a row matches no expression it is directed to the default output.

![conditional split](media/data-flow/cd1.png "conditional split")

To add additional conditions, select "Add Stream" in the bottom configuration pane and click in the Expression Builder text box to build your expression.
