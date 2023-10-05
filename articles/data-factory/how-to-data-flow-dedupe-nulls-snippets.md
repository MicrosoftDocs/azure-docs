---
title: Dedupe rows and find nulls by using data flow snippets
description: Learn how to easily dedupe rows and find nulls by using code snippets in data flows
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.date: 07/17/2023
---

# Dedupe rows and find nulls by using data flow snippets

[!INCLUDE [appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

By using code snippets in mapping data flows, you can easily perform common tasks such as data deduplication and null filtering. This article explains how to easily add those functions to your pipelines by using data flow script snippets.
<br>
> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4GnhH]

## Create a pipeline

1. Select **New Pipeline**.

1. Add a data flow activity.

1. Select the **Source settings** tab, add a source transformation, and then connect it to one of your datasets.

    :::image type="content" source="media/data-flow/snippet-adf-2.png" alt-text="Screenshot of the &quot;Source settings&quot; pane for adding a source type.":::

    The dedupe and null check snippets use generic patterns that take advantage of data flow schema drift. The snippets work with any schema from your dataset, or with datasets that have no pre-defined schema.

1. In the "Distinct row using all columns" section of [Data flow script (DFS)](./data-flow-script.md#distinct-row-using-all-columns), copy the code snippet for DistinctRows.

1. [Go to the Data Flow Script documentation page and copy the code snippet for Distinct Rows.](./data-flow-script.md#distinct-row-using-all-columns)

    :::image type="content" source="media/data-flow/snippet-adf-3.png" alt-text="Screenshot of a source snippet.":::

1. In your script, after the definition for `source1`, hit Enter, and then paste the code snippet.

1. Do either of the following:

   * Connect this pasted code snippet to the source transformation that you created earlier in the graph by typing **source1** in front of the pasted code.

   * Alternatively, you can connect the new transformation in the designer by selecting the incoming stream from the new transformation node in the graph.

     :::image type="content" source="media/data-flow/snippet-adf-4.png" alt-text="Screenshot of the &quot;Conditional split settings&quot; pane.":::

   Now your data flow will remove duplicate rows from your source by using the aggregate transformation, which groups by all rows by using a general hash across all column values.
    
1. Add a code snippet for splitting your data into one stream that contains rows with nulls and another stream without nulls. To do so:

1. [Go back to the Snippet library and this time copy the code for the NULL checks.](./data-flow-script.md#check-for-nulls-in-all-columns)

   b. In your data flow designer, select **Script** again, and then paste this new transformation code at the bottom. This action connects the script to your previous transformation by placing the name of that transformation in front of the pasted snippet.

   Your data flow graph should now look similar to this:

    :::image type="content" source="media/data-flow/snippet-adf-1.png" alt-text="Screenshot of the data flow graph.":::

  You have now created a working data flow with generic deduping and null checks by taking existing code snippets from the Data Flow Script library and adding them into your existing design.

## Next steps

* Build the rest of your data flow logic by using mapping data flows [transformations](concepts-data-flow-overview.md).
