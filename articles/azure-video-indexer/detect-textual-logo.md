---
title: Detect textual logo with Azure Video Indexer
description: This article gives an overview of Azure Video Indexer textual logo detection.
ms.topic: how-to
ms.date: 01/22/2023
ms.author: juliako
---

# How to detect textual logo (preview)

> [!NOTE]
> Textual logo detection (preview) creation process is currently available through API. The result can be viewed through the Azure Video Indexer [website](https://www.videoindexer.ai/). 

The **textual logo detection** insight is an OCR-based textual detection, which matches a specific predefined text. For example, if a user created a textual logo: "Microsoft", different appearances of the word *Microsoft* will be detected as the "Microsoft" logo. A logo can have different variations, these variations can be associated with the main logo name. For example, user might have under the "Microsoft" logo the following variations: "MS" or "MSFT". 

When using the OCR, text can be detect. For example, in the following screen "Microsoft" is detected.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/textual-logo-detection/microsoft-example.png" alt-text="Diagram of logo detection.":::

## How to use 

### Prerequisite

The Azure Video Index account must have (at the very least) the `contributor` role assigned to the resource.
 
### Start using 

In order to use textual logo detection, follow these steps, described in this article: 

1. Create a logo instance using with the [Create logo](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo) API (with variations).  

    * Save the logo ID. 
1. Create a logo group using the [Create Logo Group](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Logo-Group) API. 

    * Associate the logo instance with the group when creating the new group (by pasting the ID in the logos array). 
1. Upload a video using: **Advanced video** or **Advance video + audio** preset, use the `logoGroupId` parameter to specify the logo group you would like to index the video with. 
 
## Next steps

- [overview](video-indexer-overview.md)
- [What's new](release-notes.md)
