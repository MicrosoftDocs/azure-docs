---
title: 'Use your image data with Azure OpenAI Service'
titleSuffix: Azure AI Studio
description: Use this article to learn about using your image data for image generation in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: pafarley
author: PatrickFarley
---

# Azure OpenAI enterprise chat with images using GPT-4 Turbo with Vision

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Use this article to learn how to provide your own image data for GPT-4 Turbo with Vision, Azure OpenAI's vision model. GPT-4 Turbo with Vision enterprise chat allows the model to generate more customized and targeted answers using retrieval augmented generation based on your own images and image metadata.

> [!TIP]
> This article is for using your image data on the GPT-4 Turbo with Vision model. See [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md) for a tutorial on how to deploy a chat web app using your text data.

## Prerequisites 

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with the GPT-4 Turbo with Vision model deployed. For more information about model deployment, see the [resource deployment guide](../../ai-services/openai/how-to/create-resource.md).
- Be sure that you're assigned at least the [Cognitive Services Contributor role](../../ai-services/openai/how-to/role-based-access-control.md#cognitive-services-contributor) for the Azure OpenAI resource. 
- An Azure AI Search resource. See [create an Azure AI Search service in the portal](/azure/search/search-create-service-portal). If you don't have an Azure AI Search resource, you're prompted to create one when you add your data source later in this guide.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md) with your Azure OpenAI resource and Azure AI Search resource added as connections. 


## Deploy a GPT-4 Turbo with Vision model

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select the hub you'd like to work in.
1. On the left nav menu, select **AI Services**. Select the **Try out GPT-4 Turbo** panel.
1. On the gpt-4 page, select **Deploy**. In the window that appears, select your Azure OpenAI resource. Select `vision-preview` as the model version.
1. Select **Deploy**.
1. Next, go to your new model's page and select **Open in playground**. In the chat playground, the GPT-4 deployment you created should be selected in the **Deployment** dropdown.
    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png" alt-text="Screenshot of the chat playground with mode and deployment highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png":::
    
## Select your image data source

1. On the left pane, select the **Add your data** tab and select **Add a data source**.
1. In the window that appears, select a data source option. Each option uses an Azure AI Search index that's trained on your images and can be used for retrieval augmented generation in the chat playground.
   * **Azure AI Search**: If you have an existing [Azure AI Search](/azure/search/search-what-is-azure-search) index, you can use it as a data source.
   * **Azure Blob Storage**: The Azure Blob storage option is especially useful if you have a large number of image files and don't want to manually upload each one. Azure AI Studio will generate an image search index for you. 
   * **Upload image files and metadata**: You can upload image files and metadata using the playground. This option is useful if you have a small number of image files. Azure AI Studio will generate an image search index for you. 

## Add your image data

# [Azure AI Search](#tab/azure-ai-search)

If you have an existing [Azure AI Search](/azure/search/search-what-is-azure-search) index, you can use it as a data source. If you don't already have a search index but you'd like to create one on your own, follow the [AI Search vector search repository on GitHub](https://github.com/Azure/cognitive-search-vector-pr), which provides scripts to create an index with your image files.

1. In the playground's **Select or add data source** window, choose **Azure AI Search** and enter your index's details. Select the boxes to acknowledge that deployments and connections incur usage on your account.
1. Optionally enable the **Use custom field mapping** option. This lets you control the mapping between the custom fields in your search index and the standard fields that Azure OpenAI chat models use during retrieval augmented generation. 
1. Select **Next** and review your settings on the next page. Then select **Save and close**.
1. In the chat playground, you can see that your data has been added.

# [Azure Blob storage](#tab/azure-blob-storage)

If you have an existing [Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction) container with images, you can use it to create an image search index. If you want to create a new blob storage account, see the [Azure Blob storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation.

Your Azure Blob storage account must contain both image files and a JSON file with the image file paths and metadata.

Your metadata JSON file must:
- Have a file name that starts with the word `metadata` (all in lowercase without a space). 
- List no more than 10,000 image files. If you have more files in your container, you can have multiple JSON files each with up to this maximum.

The JSON metadata file should be formatted like this:

```json
[
    {
        "image_blob_path": "image1.jpg",
        "description": "description of image1"
    },
    {
        "image_blob_path": "image2.jpg",
        "description": "description of image2"
    },
    ...
    {
        "image_blob_path": "image50.jpg",
        "description": "description of image50"
    }
]
```

After you have a blob storage container populated with image files and at least one metadata JSON file, you're ready to add the blob storage as a data source.

1. In the playground's **Select or add data source** window, choose **Azure Blob Storage** and enter your data source details. Also choose a name for the Azure AI Search index that will be created.

    > [!NOTE]
    > Azure OpenAI needs both a storage account resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 
    >
    > When adding data to the selected storage account for the first time in Azure AI Studio, you might be prompted to turn on [cross-origin resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). Azure AI Studio and Azure OpenAI need access your Azure Blob storage account.

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-data-blob.png" alt-text="A screenshot showing the Azure storage account and Azure AI Search index selection." lightbox="../media/data-add/use-your-image-data/add-image-data-blob.png":::

1. Select the boxes to acknowledge that deployments and connections incur usage on your account. Then select **Next**.

1. Review the details you entered, and select **Save and close**. 

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-blob-review-finish.png" alt-text="Screenshot of the review and finish page for adding data via Azure blob storage." lightbox="../media/data-add/use-your-image-data/add-your-data-blob-review-finish.png":::

1. Now in the chat playground, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

# [Upload image files and metadata](#tab/upload-image-files-and-metadata)

1. In the **Select or add data source** page, select **Upload files** from the **Select data source** dropdown. 

1. Enter your data source details. Also choose a name for the Azure AI Search index that will be created.

    > [!NOTE]
    > Azure OpenAI needs both a storage account resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 
    >
    > When adding data to the selected storage account for the first time in Azure AI Studio, you might be prompted to turn on [cross-origin resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). Azure AI Studio and Azure OpenAI need access your Azure Blob storage account.  
    
    :::image type="content" source="../media/data-add/use-your-image-data/add-image-data-upload.png" alt-text="A screenshot showing the storage account and index selection for image file upload." lightbox="../media/data-add/use-your-image-data/add-image-data-upload.png":::

1. Select the boxes to acknowledge that deployments and connections incur usage on your account. Then select **Next**.
1. On the **Upload files** page, select **Browse for a file** and select the files you want to upload. If you want to upload more than one file, do so now. You won't be able to add more files later in the same playground session.

    The following file types are supported for your image files, up to 16 MB in size:
    * .jpg
    * .png
    * .gif
    * .bmp
    * .tiff
    
1. Select **Upload** to upload the files to your Azure Blob storage account. Then select **Next**.

   :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-uploaded.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/data-add/use-your-image-data/add-your-data-uploaded.png":::

1. On the **Add metadata** page, enter a text description for each image in the corresponding text fields. Then select **Next**.

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-metadata.png" alt-text="A screenshot showing the metadata entry field." lightbox="../media/data-add/use-your-image-data/add-image-metadata.png":::
    
1. Review the details you entered. You can see the names of the storage container and search index that will be created for you. Select **Save and close**. 

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-review-finish.png" alt-text="Screenshot of the review and finish page for adding data." lightbox="../media/data-add/use-your-image-data/add-your-data-review-finish.png":::

1. Now in the chat playground, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

---


## Use your data with your GPT-4 Turbo with Vision model 

After you add your image data, you can try out a chat conversation that's grounded on your image data.

1. Use the attachment button in the chat window to upload a new image. Ask a question about its relationship to the other images in your data set.

   <!--:::image type="content" source="../media/data-add/use-your-image-data/select-image-for-chat.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/data-add/use-your-image-data/select-image-for-chat.png":::-->

2. The model will respond with an answer that's grounded on your image data.
    
    <!--:::image type="content" source="../media/data-add/use-your-image-data/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/data-add/use-your-image-data/chat-with-data.png":::-->

## Add and remove data sources

Azure OpenAI only allows one data source to be used per a chat session. If you want to add a new data source, you must remove the existing data source first. Do this by selecting **Remove data source** under your data source information.

When you remove a data source, you'll see a warning message. Removing a data source clears the chat session and resets all playground settings.

## Next steps

- Learn how to [create a project in Azure AI Studio](./create-projects.md).
- [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md)
