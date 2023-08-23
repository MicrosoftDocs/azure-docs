---
title: View Azure AI Video Indexer insights
description: This article demonstrates how to view Azure AI Video Indexer insights.
author: Juliako
manager: femila
ms.topic: article
ms.date: 04/12/2023
ms.author: juliako
---

# View Azure AI Video Indexer insights

This article shows you how to view the Azure AI Video Indexer insights of a video.

1. Browse to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. Find a video from which you want to create your Azure AI Video Indexer insights. For more information, see [Find exact moments within videos](video-indexer-search.md).
3. Press **Play**.

	The page shows the video's insights. 

	![Insights](./media/video-indexer-view-edit/video-indexer-summarized-insights.png)
4. Select which insights you want to view. For example, faces, keywords, sentiments. You can see the faces of people and the time ranges each face appears in and the % of the time it's shown.

	The **Timeline** tab shows transcripts with timelines and other information that you can choose from the **View** drop-down.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/video-indexer-view-edit/timeline.png" alt-text="Screenshot that shows how to select the Insights." lightbox="./media/video-indexer-view-edit/timeline.png":::

	The player and the insights are synchronized. For example, if you click a keyword or the transcript line, the player brings you to that moment in the video. You can achieve the player/insights view and synchronization in your application. For more information, see [Embed Azure Indexer widgets into your application](video-indexer-embed-widgets.md). 

	For more information, see [Insights output](video-indexer-output-json-v2.md).

## Considerations

- [!INCLUDE [insights](./includes/insights.md)]
- If you plan to download artifact files, beware of the following: 
	
	[!INCLUDE [artifacts](./includes/artifacts.md)]
	
## Next steps

[Use your videos' deep insights](use-editor-create-project.md)

## See also

[Azure AI Video Indexer overview](video-indexer-overview.md)

