---
title: Configure your blob storage container for image retrieval
titleSuffix: Azure AI services
description: Configure your Azure storage account to get started with the **Search photos image retrieval** experience in Vision Studio.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 01/19/2024
ms.author: pafarley

---

# Configure your blob storage for image retrieval in Vision Studio

To get started with the **Search photos with image retrieval** scenario in Vision Studio, you need to select or create a new Azure storage account. Your storage account can be in any region, but creating it in the same region as your Vision resource is more efficient and reduces cost. 

> [!IMPORTANT]
> You need to create your storage account on the same Azure subscription as the Vision resource you're using in the **Search photos with image retrieval** scenario.
>
> :::image type="content" source="../media/storage-instructions/subscription.png" alt-text="Screenshot of resource selection.":::


## Create a new storage account

To get started, <a href="https://ms.portal.azure.com/#create/Microsoft.StorageAccount"  title="create a new storage account"  target="_blank">create a new storage account</a>.

:::image type="content" source="../media/storage-instructions/create-storage.png" alt-text="Screenshot of Blob storage creation.":::

Fill in the required parameters to configure your storage account, then select **Review** and **Create**.

> [!IMPORTANT]
> Your storage account must be publicly accessible to be used with Vision Studio. Configure this in the **Networking** tab of the resource creation page.
>
> :::image type="content" source="../media/storage-instructions/public-access.png" alt-text="Screenshot of network setting.":::

Once your storage account has been deployed, select **Go to resource** to open the storage account overview. 

:::image type="content" source="../media/storage-instructions/go-to-resource.png" alt-text="Screenshot of Go to resource button.":::


## Configure CORS rule on the storage account 

In your storage account overview, find the **Settings** section in the left hand navigation and select **Resource sharing (CORS)**, shown below.

:::image type="content" source="../media/storage-instructions/go-to-cors.png" alt-text="Screenshot of resource sharing screen.":::


Create a CORS rule by setting the **Allowed Origins** field to `https://portal.vision.cognitive.azure.com`.

In the Allowed Methods field, select the `GET` checkbox to allow an authenticated request from a different domain. In the **Max age** field, enter the value `9999`, and click **Save**. 

[Learn more about CORS support for Azure Storage](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).


:::image type="content" source="../media/storage-instructions/cors-rule.png" alt-text="Screenshot of completed CORS screen.":::


This allows Vision Studio to access images in your blob storage container to extract insights on your data.

## Upload images in Vision Studio

In the **Search photos with image retrieval** section in Vision Studio, select the storage account that you configured with the CORS rule. Select the container in which your images are stored. If you don't have a container, you can create one and upload the images from your local device. If you have updated the CORS rules on the storage account, refresh the Blob container or Video files on container sections.

