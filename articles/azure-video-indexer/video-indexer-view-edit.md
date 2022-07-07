---
title: View and edit Azure Video Indexer insights
description: This article demonstrates how to view and edit Azure Video Indexer insights.
author: Juliako
manager: femila
ms.topic: article
ms.date: 06/07/2022
ms.author: juliako
---

# View and edit Azure Video Indexer insights

This topic shows you how to view and edit the Azure Video Indexer insights of a video.

1. Browse to the [Azure Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. Find a video from which you want to create your Azure Video Indexer insights. For more information, see [Find exact moments within videos](video-indexer-search.md).
3. Press **Play**.

	The page shows the video's insights. 

	![Insights](./media/video-indexer-view-edit/video-indexer-summarized-insights.png)
4. View the insights of the video. 

	Summarized insights show an aggregated view of the data: faces, keywords, sentiments. For example, you can see the faces of people and the time ranges each face appears in and the % of the time it is shown.

	[!INCLUDE [insights](./includes/insights.md)]

	Select the **Timeline** tab to see transcripts with timelines and other information that you can choose from the **View** drop-down.

	The player and the insights are synchronized. For example, if you click a keyword or the transcript line, the player brings you to that moment in the video. You can achieve the player/insights view and synchronization in your application. For more information, see [Embed Azure Indexer widgets into your application](video-indexer-embed-widgets.md). 

	If you want to download artifact files, beware of the following: 
	
	[!INCLUDE [artifacts](./includes/artifacts.md)]
	
	For more information, see [Insights output](video-indexer-output-json-v2.md).
	
## Next steps

[Use your videos' deep insights](use-editor-create-project.md)

## See also

[Azure Video Indexer overview](video-indexer-overview.md)

