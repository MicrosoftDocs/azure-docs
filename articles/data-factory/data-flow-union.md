---
title: Union transformation in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about the mapping data flow New Branch Transformation in Azure Data Factory and Synapse Analytics
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.topic: concept-article
ms.custom: synapse
ms.date: 04/27/2026
---

# Union transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

> [!TIP]
>  For the equivalent transformation (**Append queries**) in Dataflow Gen2, see [A guide to Dataflow Gen2 for mapping data flow users](/fabric/data-factory/guide-to-dataflows-for-mapping-data-flow-users).

Union combines multiple data streams into one, with the SQL Union of those streams as the new output from the Union transformation. All of the schema from each input stream will be combined inside of your data flow, without needing to have a join key.

You can combine n-number of streams in the settings table by selecting the "+" icon next to each configured row, including both source data and streams from existing transformations in your data flow.

Here's a short video walk through of the union transformation in the mapping data flow:

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=b2efaa0d-096d-44e5-9ce0-71d6b68f3924]

:::image type="content" source="media/data-flow/union.png" alt-text="Union transformation":::

In this case, you can combine disparate metadata from multiple sources (in this example, three different source files) and combine them into a single stream:

:::image type="content" source="media/data-flow/union111.png" alt-text="Union transformation overview":::

To achieve this, add more rows in the Union Settings by including all source you wish to add. There's no need for a common lookup or join key:

:::image type="content" source="media/data-flow/unionsettings.png" alt-text="Union transformation settings":::

If you set a Select transformation after your Union, you'll be able to rename overlapping fields or fields that weren't named from headerless sources. Select "Inspect" to see the combined metadata with 132 total columns in this example from three different sources:

:::image type="content" source="media/data-flow/union333.png" alt-text="Union transformation final":::

## Name and position

When you choose "union by name", each column value drops into the corresponding column from each source, with a new concatenated metadata schema.

If you choose "union by position", each column value drops into the original position from each corresponding source, resulting in a new combined stream of data where the data from each source is added to the same stream:

:::image type="content" source="media/data-flow/unionoutput.png" alt-text="Union output":::

## Related content

Explore similar transformations including [Join](data-flow-join.md) and [Exists](data-flow-exists.md).
