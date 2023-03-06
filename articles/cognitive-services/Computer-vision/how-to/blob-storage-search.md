---
title: Configure your blob storage for image retrieval and video search in Vision Studio
titleSuffix: Azure Cognitive Services
description: To get started with the **Search photos with natural language** or with **Video summary and frame locator** in Vision Studio, you will need to select or create a new storage account.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 03/06/2023
ms.author: pafarley

---

# Configure your blob storage for image retrieval and video search in Vision Studio

To get started with the **Search photos with natural language** or **Video summary and frame locator** scenario in Vision Studio, you need to select or create a new Azure storage account. Your storage account can be in any region, but creating it in the same region as your Azure Computer Vision resource is more efficient and reduces cost. 

> [!IMPORTANT]
> You need to create your storage account on the same Azure subscription as the Computer Vision resource you're using in the **Search photos with natural language** or **Video summary and frame locator** scenarios as shown below.

![Show the resource](../media/storage-instructions/subscription.png)

## Create a new storage account

To get started, [create a new storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount).

![Blob storage creation](../media/storage-instructions/create-storage.png)

Fill in the required parameters to configure your storage account, then select `Review` and `Create`. 

Once your storage account has been deployed, select `Go to resource` to open the storage account overview. 

![Go to resource](../media/storage-instructions/go-to-resource.png)

## Configure CORS rule on the storage account 

In your storage account overview, find the **Settings** section in the left hand navigation and select `Resource sharing (CORS)`, shown below.

![Find resource sharing](../media/storage-instructions/go-to-cors.png)

Create a CORS rule by setting the **Allowed Origins** field to `https://<your resource>.azurewebsites.net`.

In the Allowed Methods field, select the `GET` checkbox to allow an authenticated request from a different domain. In the **Max age** field, enter the value `9999`, and click `Save`. 

[Learn more about CORS support for Azure Storage](/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services).

![Show completed CORS](../media/storage-instructions/cors-rule.png)

This will allow Vision Studio to access images and videos in your blob storage container to extract insights on your data.

## Upload images and videos in Vision Studio

In the **Try with your own video** or **Try with your own image** section in Vision Studio, select the storage account that you configured with the CORS rule. Select the container in which your images or videos are stored. If you don't have a container, you can create one and upload the images or videos from your local device. If you have updated the CORS rules on the storage account, refresh the Blob container or Video files on container sections.

![Show upload in VS](../media/storage-instructions/video-selection.png)






