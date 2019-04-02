---
title: Azure Data Factory Mapping Data Flow Surrogate Key Transformation
description: Azure Data Factory Mapping Data Flow Surrogate Key Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/12/2019
---

# Azure Data Factory Mapping Data Flow Surrogate Key Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use the Surrogate Key Transformation to add an incrementing non-business arbitrary key value to your data flow rowset. This is useful when designing dimension tables in a star schema analytical data model where each member in your dimension tables needs to have a unique key that is a non-business key, part of the Kimball DW methodology.

![Surrogate Key Transform](media/data-flow/surrogate.png "Surrogate Key Transformation")

"Key Column" is the name that you will give to your new surrogate key column.

"Start Value" is the beginning point of the incremental value.
