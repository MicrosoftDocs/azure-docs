---
title: Enable and view a clapper board with extracted metadata
description: Learn about how to enable and view a clapper board with extracted metadata.
ms.topic: article
ms.date: 09/20/2022
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Enable and view a clapper board with extracted metadata (preview)

A clapper board insight is used to detect clapper board instances and information written on each. For example, *head* or *tail* (the board is upside-down), *production*, *roll*, *scene*, *take*, *date*, etc. The [clapper board](https://en.wikipedia.org/wiki/Clapperboard)'s extracted metadata is most useful to customers involved in the movie post-production process. 

When the movie is being edited, a clapper board is removed from the scene; however, the information that was written on the clapper board is important. Azure AI Video Indexer extracts the data from clapper boards, preserves, and presents the metadata. 

This article shows how to enable the post-production insight and view clapper board instances with extracted metadata.

## View the insight

### View post-production insights

In order to set the indexing process to include the slate metadata, select the **Video + audio indexing** -> **Advanced** presets.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/advanced-setting.png" alt-text="This image shows the advanced setting in order to view post-production clapperboards insights.":::

After the file has been uploaded and indexed, if you want to view the timeline of the insight, select the **Post-production** checkmark from the list of insights.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/post-production-checkmark.png" alt-text="This image shows the post-production checkmark needed to view clapperboards.":::

### Clapper boards

Clapper boards contain fields with titles (for example, *production*, *roll*, *scene*, *take*) and values (content) associated with each title. 

For example, take this clapper board:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/clapperboard.png" alt-text="This image shows a clapperboard.":::

In the following example, the board contains the following fields:

|title|content|
|---|---|
|camera|COD|
|date|FILTER (in this case the board contains no date)|
|director|John|
|production|Prod name|
|scene|1|
|take|99|

#### View the insight

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

To see the instances on the website, select **Insights** and scroll to **Clapper boards**. You can hover over each clapper board, or unfold **Show/Hide clapper board info** and see the metadata:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/clapperboard-metadata.png" alt-text="This image shows the clapperboard metadata.":::

#### View the timeline

If you checked the **Post-production** insight, You can also find the clapper board instance and its timeline (includes time, fields' values) on the **Timeline** tab.

#### View JSON

To display the JSON file: 

1. Select Download and then Insights (JSON).  
1. Copy the `clapperboard` element, under `insights`, and paste it into your Online JSON Viewer. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/clapperboard-json.png" alt-text="This image shows the clapperboard metadata in json.":::

The following table describes fields found in json:

|Name|Description|
|---|---|
|`id`|The clapper board ID.|
|`thumbnailId`|The ID of the thumbnail.|
|`isHeadSlate`|The value stands for head or tail (the board is upside-down) of the clapper board: `true` or `false`.|
|`fields`|The fields found in the clapper board; also each field's name and value.|
|`instances`|A list of time ranges where this element appeared.|

## Clapper board limitations

The values may not always be correctly identified by the detection algorithm. Here are some limitations:

- The titles of the fields appearing on the clapper board are optimized to identify the most popular fields appearing on top of clapper boards.  
- Handwritten text or digital digits may not be correctly identified by the fields detection algorithm.
- The algorithm is optimized to identify fields' categories that appear horizontally.  
- The clapper board may not be detected if the frame is blurred or that the text written on it can't be identified by the human eye.  
- Empty fields’ values may lead to wrong fields categories.  
<!-- If a part of a clapper board is hidden a value with the highest confidence is shown.  -->

## Next steps

* [Slate detection overview](slate-detection-insight.md)
* [How to enable and view digital patterns with color bars](digital-patterns-color-bars.md).
* [How to enable and view textless slate with matched scene](textless-slate-scene-matching.md).
