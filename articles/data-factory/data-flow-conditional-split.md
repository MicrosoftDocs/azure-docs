---
title: Conditional split transformation in mapping data flow 
titleSuffix: Azure Data Factory & Azure Synapse
description: Split data into different streams using the conditional split transformation in a mapping data flow in Azure Data Factory or Synapse Analytics
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2023
---

# Conditional split transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The conditional split transformation routes data rows to different streams based on matching conditions. The conditional split transformation is similar to a CASE decision structure in a programming language. The transformation evaluates expressions, and based on the results, directs the data row to the specified stream.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4wKCX]

## Configuration

The **Split on** setting determines whether the row of data flows to the first matching stream or every stream it matches to.

Use the data flow expression builder to enter an expression for the split condition. To add a new condition, click on the plus icon in an existing row. A default stream can be added as well for rows that don't match any condition.

:::image type="content" source="media/data-flow/conditionalsplit1.png" alt-text="Shows the Conditional Split UI with selections as described above.":::

## Data flow script

### Syntax

```
<incomingStream>
    split(
        <conditionalExpression1>
        <conditionalExpression2>
        ...
        disjoint: {true | false}
    ) ~> <splitTx>@(stream1, stream2, ..., <defaultStream>)
```

### Example

The below example is a conditional split transformation named `SplitByYear` that takes in incoming stream `CleanData`. This transformation has two split conditions `year < 1960` and `year > 1980`. `disjoint` is false because the data goes to the first matching condition rather than all matching conditions. Every row matching the first condition goes to output stream `moviesBefore1960`. All remaining rows matching the second condition go to output stream `moviesAFter1980`. All other rows flow through the default stream `AllOtherMovies`.

In the service UI, this transformation looks like the below image:

:::image type="content" source="media/data-flow/conditionalsplit1.png" alt-text="Shows the Conditional Split UI with selections as described above.":::

The data flow script for this transformation is in the snippet below:

```
CleanData
    split(
        year < 1960,
	    year > 1980,
	    disjoint: false
    ) ~> SplitByYear@(moviesBefore1960, moviesAfter1980, AllOtherMovies)
```

## Next steps

Common data flow transformations used with conditional split are the [join transformation](data-flow-join.md), [lookup transformation](data-flow-lookup.md), and the [select transformation](data-flow-select.md)
