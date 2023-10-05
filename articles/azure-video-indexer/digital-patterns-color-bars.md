---
title: Enable and view digital patterns with color bars
description: Learn about how to enable and view digital patterns with color bars.
ms.topic: article
ms.date: 09/20/2022
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Enable and view digital patterns with color bars

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

This article shows how to enable and view digital patterns with color bars (preview). 

You can view the names of the specific digital patterns. <!-- They are searchable by the color bar type (Color Bar/Test card) in the insights. -->The timeline includes the following types: 

- Color bars
- Test cards

This insight is most useful to customers involved in the movie post-production process.

## View post-production insights

In order to set the indexing process to include the slate metadata, select the **Video + audio indexing** -> **Advanced** presets.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/advanced-setting.png" alt-text="This image shows the advanced setting in order to view post-production clapperboards insights.":::

After the file has been uploaded and indexed, if you want to view the timeline of the insight, select the **Post-production** checkmark from the list of insights.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/post-production-checkmark.png" alt-text="This image shows the post-production checkmark needed to view clapperboards.":::

### View digital patterns insights

#### View the insight

To see the instances on the website, select **Insights** and scroll to **Labels**.
The insight shows under **Labels** in the **Insight** tab.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/insights-color-bars.png" alt-text="This image shows the color bars under labels.":::

#### View the timeline

If you checked the **Post-production** insight, you can find the color bars instance and timeline under the **Timeline** tab.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/timeline-color-bars.png" alt-text="This image shows the color bars under timeline.":::

#### View JSON

To display the JSON file: 

1. Select Download and then Insights (JSON).  
1. Copy the `framePatterns` element, under `insights`, and paste it into your Online JSON Viewer. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/color-bar-json.png" alt-text="This image shows the color bars json.":::

The following table describes fields found in json:

|Name|Description|
|---|---|
|`id`|The digital pattern ID.|
|`patternType`|The following types are supported: ColorBars, TestCards.|
|`confidence`|The confidence level for color bar accuracy.|
|`name`|The name of the element. For example, "SMPTE color bars".|
|`displayName`| The friendly/display name.
|`thumbnailId`|The ID of the thumbnail.|
|`instances`|A list of time ranges where this element appeared.|

## Limitations

- There can be a mismatch if the input video is of low quality (for example – old Analog recordings). 
- The digital patterns will be identified over the 10 min of the beginning and 10 min of the ending part of the video.  
<!-- -  What about the limited set of digital patterns that we compare to? It's not any digital pattern -->

## Next steps

* [Slate detection overview](slate-detection-insight.md)
* [How to enable and view clapper board with extracted metadata](clapperboard-metadata.md)
* [How to enable and view textless slate with matched scene](textless-slate-scene-matching.md)
