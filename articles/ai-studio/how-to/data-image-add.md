---
title: 'Use your image data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to learn about using your image data for image generation in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 12/11/2023
ms.author: eur
---

# Azure OpenAI on your data with images using GPT-4 Turbo with Vision (preview)

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Use this article to learn how to provide your own image data for GPT-4 Turbo with Vision, Azure OpenAI's vision model. GPT-4 Turbo with Vision on your data allows the model to generate more customized and targeted answers using retrieval augmented generation based on your own images and image metadata. 

> [!TIP]
> This article is for using your data on the GPT-4 Turbo with Vision model. See [Deploy a web app for chat on your data](../tutorials/deploy-chat-web-app.md) for a tutorial on how to deploy a chat web app using your text data.

## Prerequisites 

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with the GPT-4 Turbo with Vision model deployed. For more information about model deployment, see the [resource deployment guide](../../ai-services/openai/how-to/create-resource.md).
- Be sure that you're assigned at least the [Cognitive Services Contributor role](../../ai-services/openai/how-to/role-based-access-control.md#cognitive-services-contributor) for the Azure OpenAI resource. 
- An [Azure AI Search](https://portal.azure.com/#create/Microsoft.Search) resource. See [create an Azure AI Search service in the portal](/azure/search/search-create-service-portal). If you don't have an Azure AI Search resource, you are prompted to create one when you add your data source later in this guide.

## Start a playground session

This guide is scoped to the Azure AI Studio playground, but you can also add image data via your project's **Data** page. See [Add data to your project](../how-to/data-add.md) for more information.

1. If you aren't already in the playground, select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. In the playground, make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT-4 Turbo with Vision model from the **Deployment** dropdown.

    :::image type="content" source="../media/data-add/use-your-image-data/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/data-add/use-your-image-data/playground-chat.png":::

1. On the **Assistant setup** page, select **Add your data** > **+ Add a data source**.

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data.png" alt-text="Screenshot of the chat playground with the option to add a data source visible." lightbox="../media/data-add/use-your-image-data/add-your-data.png":::

1. In the **Select or add data source** page, select a data source from the **Select data source** dropdown. See the [next section in this guide](#add-your-image-data-source) for more information about each option.

## Add your image data source

From the Azure AI Studio playground, you can choose how to add your image data for GPT-4 Turbo with Vision:

* [Upload image files and metadata](?tabs=upload-image-files-and-metadata): You can upload image files and metadata in the playground. This option is useful if you have a small number of image files.
* [Azure AI Search](?tabs=azure-ai-search): If you have an existing [Azure AI search](/azure/search/search-what-is-azure-search) index, you can use it as a data source. 
* [Azure Blob Storage](?tabs=azure-blob-storage): The Azure Blob storage option is especially useful if you have a large number of image files and don't want to manually upload each one. 

Each option uses an Azure AI Search index to do image-to-image search and retrieve the top search results for your input prompt image. 
- When you upload files in the playground or when you use Azure Blob storage, Azure AI Studio will generate an image search index for you. 
- For Azure AI Search, you need to have an image search index. 


# [Upload image files and metadata](#tab/upload-image-files-and-metadata)

1. Start a playground session and select **Add your data** > **+ Add a data source**, as described in the [previous section](#start-a-playground-session).

1. In the **Select or add data source** page, select **Upload files** from the **Select data source** dropdown. 

1. Enter your data source details:

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-data-upload.png" alt-text="A screenshot showing the storage account and index selection for image file upload." lightbox="../media/data-add/use-your-image-data/add-image-data-upload.png":::

    > [!NOTE]
    > Azure OpenAI needs both a storage account resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 
    >
    > When adding data to the selected storage account for the first time in Azure AI Studio, you might be prompted to turn on [cross-origin resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). Azure AI Studio and Azure OpenAI need access your Azure Blob storage account.  

    - **Subscription**: Select the Azure subscription that contains the Azure OpenAI resource you want to use.
    - **Storage resource**: Select the Azure Blob storage resource where you want to upload your files. 
    - **Azure AI Search resource**: Select the Azure AI Search resource where your images will be indexed. 
    - **Index name**: Enter the index name that will be used to reference this data source. A new image search index with the provided name (and `-v` suffix) is generated after data ingestion is complete. 

1. Select the boxes to acknowledge that deployments and connections incur usage on your account. Then select **Next**.
1. On the **Upload files** page, select **Browse for a file** and select the files you want to upload. If you want to upload more than one file, do so now. You won't be able to add more files later in the same playground session.

    The following file types are supported for your image files up to 16 MB in size:
    * .jpg
    * .png
    * .gif
    * .bmp
    * .tiff

1. Select **Upload** to upload the files to your Azure Blob storage account. Then select **Next**.

   :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-uploaded.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/data-add/use-your-image-data/add-your-data-uploaded.png":::

1. On the **Add metadata** page, for each image file enter the metadata in the provided description fields. Then select **Next**.

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-metadata.png" alt-text="A screenshot showing the metadata entry field." lightbox="../media/data-add/use-your-image-data/add-image-metadata.png":::
    
1. Review the details you entered. You can see the names of the storage container and search index that will be created for you. 

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-review-finish.png" alt-text="Screenshot of the review and finish page for adding data." lightbox="../media/data-add/use-your-image-data/add-your-data-review-finish.png":::

1. Select **Save and close**. 

1. Now on the **Assistant setup** page, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

   :::image type="content" source="../media/data-add/use-your-image-data/select-image-for-chat.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/data-add/use-your-image-data/select-image-for-chat.png":::

1. You can now chat with the model asking questions such as "What tent resembles this picture?".

   :::image type="content" source="../media/data-add/use-your-image-data/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/data-add/use-your-image-data/chat-with-data.png":::


# [Azure AI Search](#tab/azure-ai-search)

If you have an existing [Azure AI search](/azure/search/search-what-is-azure-search) index, you can use it as a data source. 

If you don't already have a search index created for your images:
- You can create one using the [AI Search vector search repository on GitHub](https://github.com/Azure/cognitive-search-vector-pr), which provides you with scripts to create an index with your image files. 
- You can upload image files in the playground and then select the corresponding image search index that was created for you.

1. Start a playground session and select **Add your data** > **+ Add a data source**, as described in the [previous section](#start-a-playground-session).
1. In the **Select or add data source** page, select **Azure AI Search** from the **Select data source** dropdown. 

1. Enter your data source details:

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-data-ai-search.png" alt-text="A screenshot showing the azure ai search index selection." lightbox="../media/data-add/use-your-image-data/add-image-data-ai-search.png":::

    - **Subscription**: Select the Azure subscription that contains the Azure OpenAI resource you want to use.
    - **Azure AI Search service**: Select your Azure AI Search service resource that has an image search index.
    - **Azure AI Search index**: Select the image search index to be used for data grounding. 

1. Select the boxes to acknowledge that deployments and connections incur usage on your account. Then select **Next**.

1. Review the details you entered. 

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-ai-search-review-finish.png" alt-text="Screenshot of the review and finish page for adding data via azure ai search." lightbox="../media/data-add/use-your-image-data/add-your-data-ai-search-review-finish.png":::

1. Select **Save and close**.

# [Azure Blob storage](#tab/azure-blob-storage)

If you have an existing [Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction) container, you can use it to create an image search index. If you want to create a new blob storage account, see the [Azure Blob storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation.

Before proceeding with this guide, your Azure Blob storage account must contain image files and a JSON file with the image file paths and metadata. 

Your metadata JSON file must:
- Have a file name that starts with the word `metadata`, all in lowercase without a space. 
- Have a maximum of 10,000 image files. If you have more than this number of files in your container, you can have multiple JSON files each with up to this maximum.

Here's an example of a metadata JSON file:

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

After you have a blob storage populated with image files and at least one metadata JSON file, you are ready to add the blob storage as a data source. 

1. Start a playground session and select **Add your data** > **+ Add a data source**, as described in the [previous section](#start-a-playground-session).
1. In the **Select or add data source** page, select **Azure Blob Storage** from the **Select data source** dropdown. 

1. Enter your data source details:

    > [!NOTE]
    > Azure OpenAI needs both a storage account resource and a search resource to access and index your data. Your data is stored securely in your Azure subscription. 
    >
    > When adding data to the selected storage account for the first time in Azure AI Studio, you might be prompted to turn on [cross-origin resource sharing (CORS)](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). Azure AI Studio and Azure OpenAI need access your Azure Blob storage account.  

    :::image type="content" source="../media/data-add/use-your-image-data/add-image-data-blob.png" alt-text="A screenshot showing the azure storage account and azure ai search index selection." lightbox="../media/data-add/use-your-image-data/add-image-data-blob.png":::

    - **Subscription**: Select the Azure subscription that contains the Azure OpenAI resource you want to use.
    - **Storage resource** and **Storage container**: Select the Azure Blob storage resource where the image files and metadata are already stored. 
    - **Azure AI Search resource**: Select the Azure AI Search resource where your image and JSON files in the selected Blob storage container will be indexed. 
    - **Index name**: A new image search index with the provided name (and `-v` suffix) is generated after data ingestion is complete. 

1. Select the boxes to acknowledge that deployments and connections incur usage on your account. Then select **Next**.

1. Review the details you entered. 

    :::image type="content" source="../media/data-add/use-your-image-data/add-your-data-blob-review-finish.png" alt-text="Screenshot of the review and finish page for adding data via azure blob storage." lightbox="../media/data-add/use-your-image-data/add-your-data-blob-review-finish.png":::

1. Select **Save and close**. 

1. Now on the **Assistant setup** page, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

---


## Using your ingested data with your GPT-4 Turbo with Vision model 

After you add your image data as described in the [previous section](#add-your-image-data-source), you can chat with the model that's grounded on your image data.

1. Upload an image and ask a question such as "What tent resembles this picture?".

   :::image type="content" source="../media/data-add/use-your-image-data/select-image-for-chat.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/data-add/use-your-image-data/select-image-for-chat.png":::

2. The model will respond with an answer that's grounded on your image data.
    
    :::image type="content" source="../media/data-add/use-your-image-data/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/data-add/use-your-image-data/chat-with-data.png":::

## Additional Tips

### Adding and Removing Data Sources 
Azure OpenAI currently allows only one data source to be used per a chat session. If you would like to add a new data source, you must remove the existing data source first. This can be done by selecting **Remove data source** under your data source information.

When you remove a data source, you'll see a warning message. Removing a data source clears the chat session and resets all playground settings.

## Next steps

- Learn how to [create a project in Azure AI Studio](./create-projects.md).
- [Deploy a web app for chat on your data](../tutorials/deploy-chat-web-app.md)