---
title: Azure Data Factory Mapping Data Flow Surrogate Key Transformation
description: How to use Azure Data Factory's Mapping Data Flow Surrogate Key Transformation to generate sequential key values
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/12/2019
---

# Mapping Data Flow Surrogate Key Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use the Surrogate Key Transformation to add an incrementing non-business arbitrary key value to your data flow rowset. This is useful when designing dimension tables in a star schema analytical data model where each member in your dimension tables needs to have a unique key that is a non-business key, part of the Kimball DW methodology.

![Surrogate Key Transform](media/data-flow/surrogate.png "Surrogate Key Transformation")

"Key Column" is the name that you will give to your new surrogate key column.

"Start Value" is the beginning point of the incremental value.

## Increment keys from existing sources

If you'd like to start your sequence from a value that exists in a Source, you can use a Derived Column transformation immediately following your Surrogate Key transformation and add the two values together:

![SK add Max](media/data-flow/sk006.png "Surrogate Key Transformation Add Max")

To seed the key value with the previous max, there are two techniques that you can use:

### Database sources

Use the "Query" option to select MAX() from your source using the Source transformation:

![Surrogate Key Query](media/data-flow/sk002.png "Surrogate Key Transformation Query")

### File sources

If your previous max value is in a file, you can use your Source transformation together with an Aggregate transformation and use the MAX() expression function to get the previous max value:

![Surrogate Key File](media/data-flow/sk008.png "Surrogate Key File")

In both cases, you must Join your incoming new data together with your source that contains the previous max value:

![Surrogate Key Join](media/data-flow/sk004.png "Surrogate Key Join")

## Next steps

These examples use the [Join](data-flow-join.md) and [Derived Column](data-flow-derived-column.md) transformations.
