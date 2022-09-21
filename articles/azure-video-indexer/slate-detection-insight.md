---
title: Slate detection insights
description: Learn about slate detection insights.
author: Juliako
manager: femila
ms.topic: article
ms.date: 09/20/2022
ms.author: juliako
---

# The slate detection insights (preview)

The following slate detection insights (listed below) are automatically identified when indexing a video using the advanced indexing option. These insights are most useful to customers involved in the movie post-production process.

* [Clapperboard](https://en.wikipedia.org/wiki/Clapperboard) detection with metadata extraction. This insight is used to detect clapperboard instances and information written on each (for example, *production*, *roll*, *scene*, *take*, etc. 
* Digital patterns detection, including color bars.
* Textless slate detection, including scene matching. 

## View post-production insights

In order to set the index process to include the slate metadata, the user should chose one of the **Advanced** presets under **Video + audio indexing** menu as can be seen below.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/advanced-setting.png" alt-text="This image shows the advanced setting in order to view post-production insights.":::

After the file has been uploaded and indexed, select the "Post-production" checkmark from the list of insights.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/slate-detection-process/post-production-checkmark.png" alt-text="This image shows the post-production checkmark.":::

For details about viewing each slate insight, see:

- [How to enable and view clapper board with extracted metadata](clapper-board-metadata.md).
- [How to enable and view digital patterns with color bars](digital-patterns-color-bars.md)
- [How to enable and view textless slate with scene matching](textless-slate-scene-matching.md).

## Limitations

This section lists limitations of each insight.

### Clapperboard limitations

See [clapperboard limitation](clapperboard-metadata.md#clapperboard-limitations).

### Digital patterns limitations 

- There can be a mismatch if the input video is of low quality (for example – old Analog recordings). 
- The digital patterns will be identified over the initial/ending part of the video (limited to 10 minutes each).  
- Yonit: What about the limited set of digital patterns that we compare to? It's not any digital pattern 

### Textless slate limitations


## Next steps

[Overview](video-indexer-overview.md)