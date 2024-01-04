---
title: How to create custom text classification projects
titleSuffix: Azure AI services
description: Learn about the steps for using Azure resources with custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

|Requirement  |Description  |
|---------|---------|
|Regions     | Make sure your existing resource is provisioned in one of the [supported regions](../service-limits.md#regional-availability). If you don't have a resource, you will need to create a new one in a supported region.        |
|Pricing tier     | The [pricing tier](../service-limits.md#language-resource-limits) for your resource.       |
|Managed identity     | Make sure that the resource's managed identity setting is enabled. Otherwise, read the next section. |

To use custom text classification, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

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

### Enable custom text classification feature

Make sure to enable **Custom text classification / Custom Named Entity Recognition** feature from Azure portal.

1. Go to your Language resource in [Azure portal](https://portal.azure.com/)
2. From the left side menu, under **Resource Management** section, select **Features**
3. Enable **Custom text classification / Custom Named Entity Recognition** feature
4. Connect your storage account
5. Select **Apply**

>[!Important]
> * Make sure that your **Language resource** has **storage blob data contributor** role assigned on the storage account you are connecting.

### Set roles for your Azure AI Language resource and storage account

[!INCLUDE [roles-for-resource-and-storage](roles-for-resource-and-storage.md)]

### Enable CORS for your storage account

Make sure to allow (**GET, PUT, DELETE**) methods when enabling Cross-Origin Resource Sharing (CORS). 
Set allowed origins field to `https://language.cognitive.azure.com`. Allow all header by adding `*` to the allowed header values, and set the maximum age to `500`.

:::image type="content" source="../media/cors.png" alt-text="A screenshot showing how to use CORS for storage accounts." lightbox="../media/cors.png":::
