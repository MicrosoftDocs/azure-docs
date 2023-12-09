---
title: 'Using your image data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to learn about using your image data for image generation in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 11/02/2023
recommendations: false
---

# Azure OpenAI on your data with images using GPT-4 Turbo with Vision (preview)

Use this article to learn how to provide your own image data for GPT-4 Turbo with Vision, Azure OpenAI’s vision model. GPT-4 Turbo with Vision on your data allows the model to generate more customized and targeted answers using Retrieval Augmented Generation based on your own images and image metadata. 

> [!IMPORTANT]
> This article is for using your data on the GPT-4 Turbo with Vision model. If you are interested in using your data for text-based models, see [Use your text data](./use-your-data.md).  

## Prerequisites 

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with the GPT-4 Turbo with Vision model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).
- Be sure that you're assigned at least the [Cognitive Services Contributor role](../how-to/role-based-access-control.md#cognitive-services-contributor) for the Azure OpenAI resource. 

## Add your data source

Navigate to [Azure OpenAI Studio](https://oai.azure.com/) and sign-in with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource. 

:::image type="content" source="../media/use-your-image-data/chat-playground.png" alt-text="A screenshot showing the chat playground in Azure OpenAI studio." lightbox="../media/use-your-image-data/chat-playground.png":::

On the **Assistant setup** tile, select **Add your data (preview)** > **+ Add a data source**.

:::image type="content" source="../media/quickstarts/chatgpt-playground-add-your-data.png" alt-text="A screenshot showing the button for adding your data in Azure OpenAI Studio." lightbox="../media/quickstarts/chatgpt-playground-add-your-data.png":::

In the pane that appears after you select **Add a data source**, you'll see multiple options to select a data source.

:::image type="content" source="../media/use-your-image-data/select-add-data-source.png" alt-text="A screenshot showing the data source selection." lightbox="../media/use-your-image-data/select-add-data-source.png":::

You have three different options to add your data for GPT-4 Turbo with Vision’s data source: 

* Using [your own image files and image metadata](#add-your-data-by-uploading-files)
* Using [Azure AI Search](#add-your-data-using-azure-ai-search) 
* Using [Azure Blob Storage](#add-your-data-using-azure-blob-storage)  

All three options use Azure AI Search index to do image-to-image search and retrieve the top search results for your input prompt image. For Azure Blob Storage and Upload files options, Azure OpenAI will generate an image search index for you. For Azure AI Search, you need to have an image search index. The following sections contain details on how to create the search index.  

When using these options for the first time, you might see this red notice asking you to turn on Cross-origin resource sharing (CORS). This is a notice asking you to enable CORS, so that Azure OpenAI can access your blob storage account. To fix the warning, select **Turn on CORS**. 


## Add your data by uploading files

You can manually upload your image files and enter metadata of them manually, using Azure OpenAI. This is especially useful if you are experimenting with a small set of images and would like to build your data source.

1. Navigate to the **Select a data source** button in Azure OpenAI as [described above](#add-your-data-source). Select **Upload files**.

1. Select your subscription. Select an Azure Blob storage to which your uploaded image files will be stored to. Select an Azure AI Search resource in which your new image search index will be created. Enter the image search index name of your choice.

    Once you have filled out all the fields, check the two boxes at the bottom acknowledging the incurring usage, and select **Next**.

    :::image type="content" source="../media/use-your-image-data/completed-data-source-file-upload.png" alt-text="A screenshot showing the completed fields for Azure Blob storage." lightbox="../media/use-your-image-data/completed-data-source-file-upload.png":::

    The following file types are supported for your image files:
    * .jpg
    * .png
    * .gif
    * .bmp
    * .tiff

1. Select **Browse for a file** to select image files you would like to use from your local directory.

1. Once you select your image files, you'll see the image files selected in the right table. Select **Upload files**. Once you have uploaded the files, you'll see the status for each is **Uploaded**. Select **Next**.

    :::image type="content" source="../media/use-your-image-data/uploaded-files.png" alt-text="A screenshot showing uploaded files." lightbox="../media/use-your-image-data/uploaded-files.png":::

1. For each image file, enter the metadata in the provided description fields. Once you have descriptions for each image, select **Next**.

    :::image type="content" source="../media/use-your-image-data/add-metadata.png" alt-text="A screenshot showing the metadata entry field." lightbox="../media/use-your-image-data/add-metadata.png":::

1. Review that all the information is correct. Select **Save and close**.

## Add your data using Azure AI Search

If you have an existing [Azure AI search](/azure/search/search-what-is-azure-search) index, you can use it as a data source. If you don't already have a search index created for your images, you can create one using the [AI Search vector search repository on GitHub](https://github.com/Azure/cognitive-search-vector-pr), which provides you with scripts to create an index with your image files. This option is also great if you would like to create your data source using your own files like the option above, and then come back to the playground experience to select that data source you already have created but have not added yet.

1. Navigate to the **Select a data source** button in Azure OpenAI as [described above](#add-your-data-source). Select **Azure AI Search**. 

    > [!TIP]
    > You can select an image search index that you have created with the Azure Blob Storage or Upload files options.  
 
1. Select your subscription, and the Azure AI Search service you used to create the image search index.

1. Select your Azure AI Search index you have created with your images.

1. After you have filled in all fields, select the two checkboxes at the bottom asking you to acknowledge the charges incurred from using GPT-4 Turbo with Vision vector embeddings and Azure AI Search. Select **Next**. If [CORS](#turn-on-cors) isn't already turned on for the AI Search resource, you will see a warning. To fix the warning, select **Turn on CORS**. 


    :::image type="content" source="../media/use-your-image-data/completed-data-source-cognitive-search.png" alt-text="A screenshot showing the completed fields for using an Azure AI Search index." lightbox="../media/use-your-image-data/completed-data-source-cognitive-search.png":::

1. Review the details, then select **Save and close**.

## Add your data using Azure Blob Storage

If you have an existing [Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction) container, you can use it to create an image search index. If you want to create a new blob storage, see the [Azure Blob storage quickstart](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation.

Your blob storage should contain image files and a JSON file with the image file paths and metadata. This option is especially useful if you have a large number of image files and don't want to manually upload each one. 

If you don't already have a blob storage populated with these files, and would like to upload files one by one, you can upload your files using Azure OpenAI studio instead.

Before you start adding your Azure Blob Storage container as your data source, make sure your blob storage contains all the images that you would like to ingest, and a JSON file that contains the image file paths and metadata. 


> [!IMPORTANT]
> Your metadata JSON file must:
> * Have a file name that starts with the word “metadata”, all in lowercase without a space. 
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

After you have a blob storage populated with image files and at least one metadata JSON file, you are ready to add the blob storage as a data source. 

1. Navigate to the **Select a data source** button in Azure OpenAI as [described above](#add-your-data-source). Select **Azure Blob Storage**.

1. Select your subscription, Azure Blob storage, and storage container. You'll also need to select an Azure AI Search resource, as a new image search index will be created in this resource group. If you don't have an Azure AI Search resource, you can create a new one using the link below the dropdown. If [CORS](#turn-on-cors) isn't already turned on for the Azure Blob storage resource, you will see a warning. To fix the warning, select **Turn on CORS**. 

1. Once you've selected an Azure AI search resource, enter a name for the search index in the **Index name** field.   

    > [!NOTE]
    > The name of the index will be suffixed with `–v`, to indicate that this is an index with image vectors extracted from the images provided. The description filed in the metadata.json will be added as text metadata in the index.

1. After you've filled in all fields, select the two checkboxes at the bottom asking you to acknowledge the charges incurred from using GPT-4 Turbo with Vision vector embeddings and Azure AI Search. Select **Next**.

    :::image type="content" source="../media/use-your-image-data/data-source-fields-blob-storage.png" alt-text="A screenshot showing the data source selection fields for blob storage." lightbox="../media/use-your-image-data/data-source-fields-blob-storage.png":::

1. Review the details, then select **Save and close**.



## Using your ingested data with your GPT-4 Turbo with Vision model 

After you connect your data source using any of the three methods listed above, It will take some time for the data ingestion process to finish. You will see an icon and a **Ingestion in progress** message as the process progresses. Once the ingestion has been completed, you'll see that a data source has been created.

:::image type="content" source="../media/use-your-image-data/completed-data-source.png" alt-text="A screenshot showing the completed data source ingestion." lightbox="../media/use-your-image-data/completed-data-source.png":::

Once the data source has finished being ingested, you will see your data source details as well as the image search index name. Now this ingested data is ready to be used as the grounding data for your deployed GPT-4 Turbo with Vision model. Your model will use the top retrieval data from your image search index and generate a response specifically adhered to your ingested data.

:::image type="content" source="../media/use-your-image-data/tent-chat-example.png" alt-text="A screenshot showing a chat example with tent image." lightbox="../media/use-your-image-data/dtent-chat-example.png":::


## Additional Tips

### Adding and Removing Data Sources 
Azure OpenAI currently allows only one data source to be used per a chat session. If you would like to add a new data source, you must remove the existing data source first. This can be done by selecting **Remove data source** under your data source information.

When you remove a data source, you'll see a warning message. Removing a data source clears the chat session and resets all playground settings.

:::image type="content" source="../media/use-your-image-data/remove-data-source-warning.png" alt-text="A screenshot showing the data source removal warning." lightbox="../media/use-your-image-data/remove-data-source-warning.png":::

> [!IMPORTANT] 
> If you switch to a model deployment which is not using the GPT-4 Turbo with Vision model, you will see a warning message for removing a data source. Please note that removing a data source will clear the chat session and reset all playground settings.

## Next steps

You can also chat on Azure OpenAI text models. See [Use your text data](./use-your-data.md) for more information. 
