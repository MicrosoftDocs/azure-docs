---
title: How to create custom projects
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/06/2022
ms.author: aahi
---

|Requirement  |Description  |
|---------|---------|
|Regions     |  If you don't have a resource, you will need to create a new one in a supported region.        |
|Pricing tier     | pricing tier for your resource.       |
|Managed identity     | Make sure that the resource's managed identity setting is enabled. Otherwise, read the next section. |

To use this service, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

## Enable identity management for your resource

# [Azure portal](#tab/azure-portal)

Your Language resource must have identity management, to enable it using [Azure portal](https://portal.azure.com/):

1. Go to your Language resource
2. From left hand menu, under **Resource Management** section, select **Identity**
3. From **System assigned** tab, make sure to set **Status** to **On**

# [Language Studio](#tab/language-studio)

Your Language resource must have identity management, to enable it using [Language Studio](https://aka.ms/languageStudio):

1. Select the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select the check box **Managed Identity** for your Azure AI Language resource.

---

### Enable the custom feature for your resource

Make sure to enable this service's custom feature from Azure portal.

1. Go to your Language resource in [Azure portal](https://portal.azure.com/)
2. From the left side menu, under **Resource Management** section, select **Features**
3. Enable this service's custom feature
4. Connect your storage account
5. Select **Apply**

> [!IMPORTANT]
> Make sure that your **Language resource** has **storage blob data contributor** role assigned on the storage account you are connecting.

### Set roles for your Azure AI Language resource and storage account

[!INCLUDE [roles-for-resource-and-storage](roles-for-resource-and-storage.md)]

### Enable CORS for your storage account

Make sure to allow (**GET, PUT, DELETE**) methods when enabling Cross-Origin Resource Sharing (CORS). 
Set allowed origins field to `https://language.cognitive.azure.com`. Allow all header by adding `*` to the allowed header values, and set the maximum age to `500`.

:::image type="content" source="../../custom-named-entity-recognition/media/cors.png" alt-text="A screenshot showing how to use CORS for storage accounts." lightbox="../../custom-named-entity-recognition/media/cors.png":::
