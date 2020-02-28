---
title: Use the Video Indexer website to customize Brands models - Azure 
titleSuffix: Azure Media Services
description: This article shows how to customize a Brands model with the Video Indexer website.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: anzaman
---

# Customize a Brands model with the Video Indexer website

Video Indexer supports brand detection from speech and visual text during indexing and reindexing of video and audio content. The brand detection feature identifies mentions of products, services, and companies suggested by Bing's brands database. For example, if Microsoft is mentioned in a video or audio content or if it shows up in visual text in a video, Video Indexer detects it as a brand in the content. A custom Brands model allows you to select whether or not you Video Indexer will detect brands from the Bing brands database, exclude certain brands from being detected (essentially creating a black list of brands), and include brands that should be part of your model that might not be in Bing's brands database (essentially creating a white list of brands).

For a detailed overview, see [Overview](customize-brands-model-overview.md).

You can use the Video Indexer website to create, use, and edit custom Brands models detected in a video, as described in this topic. You can also use the API, as described in [Customize Brands model using APIs](customize-brands-model-with-api.md).

## Edit the settings of the Brands model  

You have the option to set whether or not you want brands from the Bing brands database to be detected. For this, you need to edit the settings of your Brands model.

1. Browse to the [Video Indexer](https://www.videoindexer.ai/) website and sign in.
2. To customize a model in your account, click on the **Content model customization** button on the top-right corner of the page.
 
   ![Customize content model](./media/content-model-customization/content-model-customization.png) 
3. To edit brands, select the **Brands** tab.

    ![Customize brands model](./media/customize-brand-model/customize-brand-model.png)
4. Check the **Show brands suggested by Bing** option, if you want for Video Indexer to include brands suggested by Bing. Leave the option unchecked if you do not want Video Indexer to detect brands suggested by Bing in your content. 

## Include brands in the model

The **Include brands** section represents custom brands that you want for Video Indexer to detect even if they are not suggested by Bing.  

### Add a brand

1. Click "+ Add brand".

    ![Customize brands model](./media/customize-brand-model/add-brand.png)

    Provide a name (required), category (optional), description (optional), and reference URL (optional).
    The category field is meant to help you tag your brands. This field shows up as the brand's *tags* when using the Video Indexer APIs. For example, the brand "Azure" can be tagged or categorized as "Cloud".

    The reference URL field can be any reference website for the brand such as a link to its Wikipedia page.
2. Click "Add brand" and you will see that the brand has been added to the **Include brands** list.

### Edit a brand

1. Click on the pencil icon next to the brand that you want to edit.

    You can update the category, description, or reference URL of a brand. You can't change the name of a brand because names of brands are unique. If you need to change the brand name, delete the entire brand (see next section) and create a new brand with the new name.
2. Click the **Update** button to update the brand with the new information.

### Delete a brand

1. Click on the trash icon next to the brand that you want to delete.
2. Click "Delete" and the brand will no longer appear in your *Include brands* list.

## Exclude brands from the model

The **Exclude brands** section represents the brands that you want for Video Indexer not to detect.

### Add a brand

1. Click "+ Add brand".

    Provide a name (required), category (optional).
2. Click "Add brand" and you will see that the brand has been added to the *Exclude brands* list.

### Edit a Brand

1. Click on the pencil icon next to the brand that you want to edit.

    You can only update the category of a brand. You can't change the name of a brand because names of brands are unique. If you need to change the brand name, delete the entire brand (see next section) and create a new brand with the new name.
2. Click the **Update** button to update the brand with the new information.

### Delete a Brand

1. Click on the trash icon next to the brand that you want to delete.
2. Click "Delete" and the brand will no longer appear in your *Exclude brands* list.

## Next steps

[Customize Brands model using APIs](customize-brands-model-with-api.md)
