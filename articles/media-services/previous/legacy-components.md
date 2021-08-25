---
title: Azure Media Services legacy components | Microsoft Docs
description: This topic discusses Azure Media Services legacy components.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2021
ms.author: inhenkel
---
# Azure Media Services legacy components

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]

Over time, we enhance Media Service components and retire legacy components. This article helps you migrate your application from a legacy component to a current component.
 
## Retirement plans of legacy components and migration guidance

The *Windows Azure Media Encoder* (WAME) and *Azure Media Encoder* (AME) media processors are deprecated.

* [Migrate from Windows Azure Media Encoder to Media Encoder Standard](migrate-windows-azure-media-encoder.md)
* [Migrate from Azure Media Encoder to Media Encoder Standard](migrate-azure-media-encoder.md)

The following Media Analytics media processors are either deprecated or soon to be deprecated:

 
| **Media processor name** | **Retirement date** | **Additional notes** |
| --- | --- | ---|
| Azure Media Indexer 2 | January 1st, 2020 | This media processor will be replaced by the [Media Services v3 AudioAnalyzerPreset Basic mode](../latest/analyze-video-audio-files-concept.md). For more information, see [Migrate from Azure Media Indexer 2 to Azure Video Analyzer for Media (formerly Video Indexer)](migrate-indexer-v1-v2.md). |
| Azure Media Indexer | March 1, 2023 | This media processor will be replaced by the [Media Services v3 AudioAnalyzerPreset Basic mode](../latest/analyze-video-audio-files-concept.md). For more information, see [Migrate from Azure Media Indexer 2 to Azure Video Analyzer for Media](migrate-indexer-v1-v2.md). |
| Motion Detection | June 1st, 2020|No replacement plans at this time. |
| Video Summarization |June 1st, 2020|No replacement plans at this time.|
| Video Optical Character Recognition | June 1st, 2020 |This media processor was replaced by Azure Video Analyzer for Media. Also, consider using [Azure Media Services v3 API](../latest/analyze-video-audio-files-concept.md). <br/>See [Compare Azure Media Services v3 presets and Video Analyzer for Media](../../azure-video-analyzer/video-analyzer-for-media-docs/compare-video-indexer-with-media-services-presets.md). |
| Face Detector | June 1st, 2020 | This media processor was replaced by Azure Video Analyzer for Media. Also, consider using [Azure Media Services v3 API](../latest/analyze-video-audio-files-concept.md). <br/>See [Compare Azure Media Services v3 presets and Video Analyzer for Media](../../azure-video-analyzer/video-analyzer-for-media-docs/compare-video-indexer-with-media-services-presets.md). |
| Content Moderator | June 1st, 2020 |This media processor was replaced by Azure Video Analyzer for Media. Also, consider using [Azure Media Services v3 API](../latest/analyze-video-audio-files-concept.md). <br/>See [Compare Azure Media Services v3 presets and Video Analyzer for Media](../../azure-video-analyzer/video-analyzer-for-media-docs/compare-video-indexer-with-media-services-presets.md). |

## Next steps

[Migration guidance for moving from Media Services v2 to v3](../latest/migrate-v-2-v-3-migration-introduction.md)
