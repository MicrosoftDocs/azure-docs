---
title: Use Azure Video Indexer to customize Brands model
titleSuffix: Azure Media Services
description: This article demonstrates how to use Azure Video Indexer to customize Brands model.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 01/14/2020
ms.author: anzaman
---

# Customize a Brands model with the Video Indexer API

Video Indexer supports brand detection from speech and visual text during indexing and reindexing of video and audio content. The brand detection feature identifies mentions of products, services, and companies suggested by Bing's brands database. For example, if Microsoft is mentioned in a video or audio content or if it shows up in visual text in a video, Video Indexer detects it as a brand in the content. A custom Brands model allows you to exclude certain brands from being detected and include brands that should be part of your model that might not be in Bing's brands database.

For a detailed overview, see [Overview](customize-brands-model-overview.md).

You can use the Video Indexer APIs to create, use, and edit custom Brands models detected in a video, as described in this topic. You can also use the Video Indexer website, as described in [Customize Brands model using the Video Indexer website](customize-brands-model-with-api.md).

## Create a Brand

The [create a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Create-Brand) API creates a new custom brand and adds it to the custom Brands model for the specified account. 

> [!NOTE]
> Setting **enabled** (in the body) to true puts the brand in the *Include* list for Video Indexer to detect. Setting **enabled** to false puts the brand in the *Exclude* list, so Video Indexer will not detect it.

Some other parameters that you can set in the body:

* The **referenceUrl** value can be any reference websites for the brand such as a link to its Wikipedia page.
* The **tags** value is a list of tags for the brand. This shows up in the brand's *Category* field in the Video Indexer website. For example, the brand "Azure" can be tagged or categorized as "Cloud".

## Delete a Brand

The [delete a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Brand?) API removes a brand from the custom Brands model for the specified account. The account is specified in the **accountId** parameter. Once called successfully, the brand will no longer be in the *Include* or *Exclude* brands lists.

There is no returned content when the brand is deleted successfully.

## Get a specific Brand

The [get a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brand?) API lets you search for the details of a brand in the custom Brands model for the specified account using the brand id.

If the **enabled** flag is **true**, the brand is included in the *Include* list for Video Indexer to detect. If **enabled** is false, the brand is in the *Exclude* list, so Video Indexer cannot detect it.

## Update a specific brand

The [update a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Brand?) API lets you search for the details of a brand in the custom Brands model for the specified account using the brand ID.

If the **enabled** flag is set to **true**, the brand is included in the *Include* list for Video Indexer to detect. If **enabled** is false, the brand is in the *Exclude* list, so Video Indexer cannot detect it.

## Get all of the Brands

The [get all brands](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brands?) API returns all of the brands in the custom Brands model for the specified account regardless of whether the brand is meant to be in the *Include* or *Exclude* brands list.

## Get Brands model settings

The [get brands settings](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brands) API returns the Brands model settings in the specified account. The Brands model settings represent whether detection from the Bing brands database is enabled or not. If Bing brands are not enabled, Video Indexer will only detect brands from the custom Brands model of the specified account.

> [!NOTE]
> The **useBuiltIn** flag set to true represents that Bing brands are enabled. If *useBuiltin* is false, Bing brands are disabled.  

## Update Brands model settings

The [update brands](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Brands-Model-Settings?) updates the Brands model settings in the specified account. The Brands model settings represent whether detection from the Bing brands database is enabled or not. If Bing brands are not enabled, Video Indexer will only detect brands from the custom Brands model of the specified account.

The **useBuiltIn** flag set to true represents that Bing brands are enabled. If *useBuiltin* is false, Bing brands are disabled.

## Next steps

[Customize Brands model using website](customize-brands-model-with-website.md)
