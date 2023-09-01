---
title: Customize a Brands model in Azure AI Video Indexer - Azure  
description: This article gives an overview of what is a Brands model in Azure AI Video Indexer and how to customize it. 

ms.topic: conceptual
ms.date: 12/15/2019
ms.author: juliako
---

# Customize a Brands model in Azure AI Video Indexer

Azure AI Video Indexer supports brand detection from speech and visual text during indexing and reindexing of video and audio content. The brand detection feature identifies mentions of products, services, and companies suggested by Bing's brands database. For example, if Microsoft is mentioned in a video or audio content or if it shows up in visual text in a video, Azure AI Video Indexer detects it as a brand in the content. Brands are disambiguated from other terms using context.

Brand detection is useful in a wide variety of business scenarios such as contents archive and discovery, contextual advertising, social media analysis, retail compete analysis, and many more. Azure AI Video Indexer brand detection enables you to index brand mentions in speech and visual text, using Bing's brands database as well as with customization by building a custom Brands model for each Azure AI Video Indexer account. The custom Brands model feature allows you to select whether or not Azure AI Video Indexer will detect brands from the Bing brands database, exclude certain brands from being detected (essentially creating a list of unapproved brands), and include brands that should be part of your model that might not be in Bing's brands database (essentially creating a list of approved brands). The custom Brands model that you create will only be available in the account in which you created the model.

## Out of the box detection example

In the "Microsoft Build 2017 Day 2" presentation, the brand "Microsoft Windows" appears multiple times. Sometimes in the transcript, sometimes as visual text and never as verbatim. Azure AI Video Indexer detects with high precision that a term is indeed brand based on the context, covering over 90k brands out of the box, and constantly updating. At 02:25, Azure AI Video Indexer detects the brand from speech and then again at 02:40 from visual text, which is part of the Windows logo.

![Brands overview](./media/content-model-customization/brands-overview.png)

Talking about Windows in the context of construction will not detect the word "Windows" as a brand, and same for Box, Apple, Fox, etc., based on advanced Machine Learning algorithms that know how to disambiguate from context. Brand Detection works for all our supported languages.

## Next steps

To bring your own brands, check out these topics:

[Customize Brands model using APIs](customize-brands-model-with-api.md)

[Customize Brands model using the website](customize-brands-model-with-website.md)
