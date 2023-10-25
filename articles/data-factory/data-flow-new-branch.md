---
title: Multiple branches in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Replicating data streams in mapping data flow with multiple branches
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/17/2023
---

# Creating a new branch in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Add a new branch to do multiple sets of operations and transformations against the same data stream. Adding a new branch is useful when you want to use the same source to for multiple sinks or for self-joining data together.

A new branch can be added from the transformation list similar to other transformations. **New Branch** will only be available as an action when there's an existing transformation following the transformation you're attempting to branch.

:::image type="content" source="media/data-flow/new-branch2.png" alt-text="Screenshot shows the New branch option in the Multiple inputs / outputs menu.":::

In the below example, the data flow is reading taxi trip data. Output aggregated by both day and vendor is required. Instead of creating two separate data flows that read from the same source, a new branch can be added. This way both aggregations can be executed as part of the same data flow. 

:::image type="content" source="media/data-flow/new-branch.png" alt-text="Screenshot shows the data flow with two branches from the source.":::

> [!NOTE]
> When clicking the plus (+) to add transformations to your graph, you will only see the New Branch option when there are subsequent transformation blocks. This is because New Branch creates a reference to the existing stream and requires further upstream processing to operate on. If you do not see the New Branch option, add a Derived Column or other transformation first, then return to the previous block and you will see New Branch as an option.

## Next steps

After branching, you may want to use the [data flow transformations](data-flow-transformation-overview.md)
