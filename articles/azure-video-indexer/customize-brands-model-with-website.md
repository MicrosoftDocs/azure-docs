---
title: Customize a Brands model with the Azure AI Video Indexer website
description: Learn how to customize a Brands model with the Azure AI Video Indexer website.
author: anikaz
manager: johndeu
ms.topic: article
ms.date: 12/15/2019
ms.author: kumud
---

# Customize a Brands model with the Azure AI Video Indexer website

Azure AI Video Indexer supports brand detection from speech and visual text during indexing and reindexing of video and audio content. The brand detection feature identifies mentions of products, services, and companies suggested by Bing's brands database. For example, if Microsoft is mentioned in video or audio content or if it shows up in visual text in a video, Azure AI Video Indexer detects it as a brand in the content.

A custom Brands model allows you to:

- select if you want Azure AI Video Indexer to detect brands from the Bing brands database.
- select if you want Azure AI Video Indexer to exclude certain brands from being detected (essentially creating a blocklist of brands).
- select if you want Azure AI Video Indexer to include brands that should be part of your model that might not be in Bing's brands database (essentially creating an accept list of brands).

For a detailed overview, see this [Overview](customize-brands-model-overview.md).

You can use the Azure AI Video Indexer website to create, use, and edit custom Brands models detected in a video, as described in this article. You can also use the API, as described in [Customize Brands model using APIs](customize-brands-model-with-api.md).

> [!NOTE]
> If your video was indexed prior to adding a brand, you need to reindex it. You will find **Re-index** item in the drop-down menu associated with the video. Select **Advanced options** -> **Brand categories** and check **All brands**.

## Edit Brands model settings

You have the option to set whether or not you want brands from the Bing brands database to be detected. To set this option, you need to edit the settings of your Brands model. Follow these steps:

1. Go to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website and sign in.
1. To customize a model in your account, select the **Content model customization** button on the left of the page.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/content-model-customization/content-model-customization.png" alt-text="Customize content model in Azure AI Video Indexer ":::
1. To edit brands, select the **Brands** tab.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/customize-brand-model/customize-brand-model.png" alt-text="Screenshot shows the Brands tab of the Content model customization dialog box":::
1. Check the **Show brands suggested by Bing** option if you want Azure AI Video Indexer to detect brands suggested by Bing—leave the option unchecked if you don't.

## Include brands in the model

The **Include brands** section represents custom brands that you want Azure AI Video Indexer to detect, even if they aren't suggested by Bing.  

### Add a brand to include list

1. Select **+ Create new brand**.

    Provide a name (required), category (optional), description (optional), and reference URL (optional).
    The category field is meant to help you tag your brands. This field shows up as the brand's *tags* when using the Azure AI Video Indexer APIs. For example, the brand "Azure" can be tagged or categorized as "Cloud".

    The reference URL field can be any reference website for the brand (like a link to its Wikipedia page).

2. Select **Save** and you'll see that the brand has been added to the **Include brands** list.

### Edit a brand on the include list

1. Select the pencil icon next to the brand that you want to edit.

    You can update the category, description, or reference URL of a brand. You can't change the name of a brand because names of brands are unique. If you need to change the brand name, delete the entire brand (see next section) and create a new brand with the new name.

2. Select the **Update** button to update the brand with the new information.

### Delete a brand on the include list

1. Select the trash icon next to the brand that you want to delete.
2. Select **Delete** and the brand will no longer appear in your *Include brands* list.

## Exclude brands from the model

The **Exclude brands** section represents the brands that you don't want Azure AI Video Indexer to detect.

### Add a brand to exclude list

1. Select **+ Create new brand.**

    Provide a name (required), category (optional).

2. Select **Save** and you'll see that the brand has been added to the *Exclude brands* list.

### Edit a brand on the exclude list

1. Select the pencil icon next to the brand that you want to edit.

    You can only update the category of a brand. You can't change the name of a brand because names of brands are unique. If you need to change the brand name, delete the entire brand (see next section) and create a new brand with the new name.

2. Select the **Update** button to update the brand with the new information.

### Delete a brand on the exclude list

1. Select the trash icon next to the brand that you want to delete.
2. Select **Delete** and the brand will no longer appear in your *Exclude brands* list.

## Next steps

[Customize Brands model using APIs](customize-brands-model-with-api.md)
