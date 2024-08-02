---
title: 'Use your image data with Azure OpenAI Service in Azure OpenAI Studio'
titleSuffix: Azure OpenAI Service
description: Use this article to learn about using your image data for image generation in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 05/09/2024
recommendations: false
---

# Use your image data for Azure OpenAI by using GPT-4 Turbo with Vision (preview) in Azure OpenAI Studio

Use this article to learn how to provide your own image data for GPT-4 Turbo with Vision, the vision model in Azure OpenAI Service. GPT-4 Turbo with Vision on your data allows the model to generate more customized and targeted answers by using Retrieval Augmented Generation (RAG), based on your own images and image metadata.

> [!IMPORTANT]
> After the GPT4-Turbo with Vision preview model is deprecated, you'll no longer be able to use Azure OpenAI on your image data. To implement a RAG solution with image data, see the [sample on GitHub](https://github.com/Azure-Samples/azure-search-openai-demo/).

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- An Azure OpenAI resource with the GPT-4 Turbo with Vision model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).
* At least the [Cognitive Services Contributor role](../how-to/role-based-access-control.md#cognitive-services-contributor) assigned to you for the Azure OpenAI resource.

## Add your data source

Go to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

:::image type="content" source="../media/use-your-image-data/chat-playground.png" alt-text="Screenshot that shows the chat playground in Azure OpenAI Studio." lightbox="../media/use-your-image-data/chat-playground.png":::

On the **Assistant setup** tile, select **Add your data (preview)** > **+ Add a data source**.

:::image type="content" source="../media/use-your-image-data/chatgpt-playground-add-your-data.png" alt-text="Screenshot that shows the button for adding data in Azure OpenAI Studio." lightbox="../media/use-your-image-data/chatgpt-playground-add-your-data.png":::

In the pane that appears after you select **Add a data source**, you have three options for selecting a data source:

* [Azure AI Search](#add-your-data-by-using-azure-ai-search)
* [Azure Blob Storage](#add-your-data-by-using-azure-blob-storage)
* [Your own image files and image metadata](#add-your-data-by-uploading-files)  

:::image type="content" source="../media/use-your-image-data/select-add-data-source.png" alt-text="Screenshot that shows selection of a data source." lightbox="../media/use-your-image-data/select-add-data-source.png":::

All three options use an Azure AI Search index to do an image-to-image search and retrieve the top search results for your input prompt image. For the **Azure Blob Storage** and **Upload files** options, Azure OpenAI generates an image search index for you. For **Azure AI Search**, you need to have an image search index. The following sections contain details on how to create the search index.

### Turn on CORS

When you're adding a data source for the first time, you might see a red notice that asks you to turn on cross-origin resource sharing (CORS). To stop the warning, select **Turn on CORS** so that Azure OpenAI can access the data source.

:::image type="content" source="../media/use-your-image-data/cross-origin-resource-sharing-requirement.png" alt-text="Screenshot that shows an error stating that CORS is not turned on." lightbox="../media/use-your-image-data/cross-origin-resource-sharing-requirement.png":::

## Add your data by uploading files

You can manually upload your image files and enter metadata for them manually by using Azure OpenAI. This capability is especially useful if you're experimenting with a small set of images and want to build your data source.

1. Go to and select the **Add a data source** button in Azure OpenAI as [described earlier](#add-your-data-source). Then select **Upload files**.

1. Select your subscription. Select a Blob Storage account where you want to store your uploaded image files. Select an Azure AI Search resource that will contain your newly created image search index. Enter the image search index name of your choice.

    After you fill in all the values, select the two checkboxes at the bottom to acknowledge incurring usage, and then select **Next**.

    :::image type="content" source="../media/use-your-image-data/completed-data-source-file-upload.png" alt-text="Screenshot that shows the completed boxes for selecting an Azure Blob Storage subscription." lightbox="../media/use-your-image-data/completed-data-source-file-upload.png":::

    The following file types are supported for your image files:
    * .jpg
    * .png
    * .gif
    * .bmp
    * .tiff

1. Select **Browse for a file** to select image files that you want to use from your local directory.

1. After you select your image files, they appear in the table. Select **Upload files**. After you upload the files, confirm that the status for each is **Uploaded**. Then select **Next**.

    :::image type="content" source="../media/use-your-image-data/uploaded-files.png" alt-text="Screenshot that shows uploaded files." lightbox="../media/use-your-image-data/uploaded-files.png":::

1. For each image file, enter the metadata in the provided description boxes. Then select **Next**.

    :::image type="content" source="../media/use-your-image-data/add-metadata.png" alt-text="Screenshot that shows boxes for metadata entry." lightbox="../media/use-your-image-data/add-metadata.png":::

1. Review all the information to make sure that it's correct. Then select **Save and close**.

## Add your data by using Azure AI Search

If you have an existing [Azure AI Search](/azure/search/search-what-is-azure-search) index, you can use it as a data source. If you don't already have a search index created for your images, you can create one by using the [AI Search vector search repository on GitHub](https://github.com/Azure/cognitive-search-vector-pr). This repo provides you with scripts to create an index with your image files.

This option is also useful if you want to create your data source by using your own files like the previous option, and then come back to the playground experience to select the data source that you created but haven't added yet.

1. Go to and select the **Add a data source** button in Azure OpenAI as [described earlier](#add-your-data-source). Then select **Azure AI Search**.

    > [!TIP]
    > You can select an image search index that you created by using the **Azure Blob Storage** or **Upload files** option.  

1. Select your subscription and the Azure AI Search service that you used to create the image search index.

1. Select the Azure AI Search index that you created with your images.

1. After you fill in all the values, select the two checkboxes at the bottom to acknowledge the charges incurred from using GPT-4 Turbo with Vision vector embeddings and Azure AI Search. Then select **Next**.

    :::image type="content" source="../media/use-your-image-data/completed-data-source-cognitive-search.png" alt-text="Screenshot that shows the completed boxes for using an Azure AI Search index." lightbox="../media/use-your-image-data/completed-data-source-cognitive-search.png":::

1. Review the details, and then select **Save and close**.

## Add your data by using Azure Blob Storage

If you have an existing [Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction) container, you can use it to create an image search index. If you want to create a new container, see the [Blob Storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation.

The option of using a Blob Storage container is especially useful if you have a large number of image files and you don't want to manually upload each one.

If you don't already have a Blob Storage container populated with these files, and you want to upload your files one by one, you can upload the files by using Azure OpenAI Studio instead.

Before you start adding your Blob Storage container as your data source, make sure that it contains all the images that you want to ingest. Also make sure that it contains a JSON file that includes the image file paths and metadata.

> [!IMPORTANT]
> Your metadata JSON file must:
>
> * Have a file name that starts with the word *metadata*, all in lowercase without a space.
> * Have a maximum of 10,000 image files. If you have more than this number of files in your container, you can have multiple JSON files each with up to this maximum.

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

After you have a Blob Storage container that's populated with image files and at least one metadata JSON file, you're ready to add the container as a data source:

1. Go to and select the **Add a data source** button in Azure OpenAI as [described earlier](#add-your-data-source). Then select **Azure Blob Storage**.

1. Select your subscription, Azure Blob Storage, and a storage container. You also need to select an Azure AI Search resource, because a new image search index will be created in this resource group. If you don't have an Azure AI Search resource, you can create a new one by using the link below the dropdown list.

1. In the **Index name** box, enter a name for the search index.

    > [!NOTE]
    > The name of the index is suffixed with `–v`, to indicate that this index has image vectors extracted from the provided images. The description filed in *metadata.json* will be added as text metadata in the index.

1. After you fill in all values, select the two checkboxes at the bottom to acknowledge the charges incurred from using GPT-4 Turbo with Vision vector embeddings and Azure AI Search. Then select **Next**.

    :::image type="content" source="../media/use-your-image-data/data-source-fields-blob-storage.png" alt-text="Screenshot that shows the data source selection boxes for Blob Storage." lightbox="../media/use-your-image-data/data-source-fields-blob-storage.png":::

1. Review the details, and then select **Save and close**.

## Use your ingested data with your GPT-4 Turbo with Vision model

After you connect your data source by using any of the three methods listed earlier, the data ingestion process takes some time to finish. An icon and a **Ingestion in progress** message appear as the process progresses.

After the ingestion finishes, confirm that a data source is created. The details of your data source appear, along with the name of your image search index.

:::image type="content" source="../media/use-your-image-data/completed-data-source.png" alt-text="Screenshot that shows a completed data source ingestion." lightbox="../media/use-your-image-data/completed-data-source.png":::

Now this ingested data is ready to be used as the grounding data for your deployed GPT-4 Turbo with Vision model. Your model will use the top retrieval data from your image search index and generate a response specifically adhered to your ingested data.

:::image type="content" source="../media/use-your-image-data/tent-chat-example.png" alt-text="Screenshot that shows a chat example with a tent image." lightbox="../media/use-your-image-data/tent-chat-example.png":::

## Additional tips

### Add and remove data sources

Azure OpenAI currently allows only one data source to be used for each chat session. If you want to add a new data source, you must remove the existing data source first. Remove it by selecting **Remove data source** under your data source information.

When you remove a data source, a warning message appears. Removing a data source clears the chat session and resets all playground settings.

:::image type="content" source="../media/use-your-image-data/remove-data-source-warning.png" alt-text="Screenshot that shows a warning about removal of a data source." lightbox="../media/use-your-image-data/remove-data-source-warning.png":::

> [!IMPORTANT]
> If you switch to a model deployment that doesn't use the GPT-4 Turbo with Vision model, a warning message appears for removing a data source. Removing a data source clears the chat session and resets all playground settings.

## Related content

* [Azure OpenAI On Your Data](./use-your-data.md)
* [Quickstart: Use images in your AI chats](../gpt-v-quickstart.md)
* [GPT-4 Turbo with Vision frequently asked questions](../faq.yml#gpt-4-turbo-with-vision)
* [GPT-4 Turbo with Vision API reference](https://aka.ms/gpt-v-api-ref)
