---
title: Union transformation in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about the mapping data flow New Branch Transformation in Azure Data Factory and Synapse Analytics
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/17/2023
---

# Union transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Union will combine multiple data streams into one, with the SQL Union of those streams as the new output from the Union transformation. All of the schema from each input stream will be combined inside of your data flow, without needing to have a join key.

You can combine n-number of streams in the settings table by selecting the "+" icon next to each configured row, including both source data as well as streams from existing transformations in your data flow.

Here is a short video walk-through of the union transformation in the mapping data flow:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4vngz]

:::image type="content" source="media/data-flow/union.png" alt-text="Union transformation":::

In this case, you can combine disparate metadata from multiple sources (in this example, three different source files) and combine them into a single stream:

:::image type="content" source="media/data-flow/union111.png" alt-text="Union transformation overview":::

To achieve this, add additional rows in the Union Settings by including all source you wish to add. There is no need for a common lookup or join key:

:::image type="content" source="media/data-flow/unionsettings.png" alt-text="Union transformation settings":::

If you set a Select transformation after your Union, you will be able to rename overlapping fields or fields that were not named from headerless sources. Click on "Inspect" to see the combine metadata with 132 total columns in this example from three different sources:

:::image type="content" source="media/data-flow/union333.png" alt-text="Union transformation final":::

## Name and position

When you choose "union by name", each column value will drop into the corresponding column from each source, with a new concatenated metadata schema.

If you choose "union by position", each column value will drop into the original position from each corresponding source, resulting in a new combined stream of data where the data from each source is added to the same stream:

:::image type="content" source="media/data-flow/unionoutput.png" alt-text="Union output":::

## Next steps

Explore similar transformations including [Join](data-flow-join.md) and [Exists](data-flow-exists.md).
