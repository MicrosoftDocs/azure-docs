---
titleSuffix: Azure AI services
description: Learn about the steps for using Azure resources with custom NER.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

You can use an existing Language resource to get started with custom NER as long as this resource meets the below requirements:

|Requirement  |Description  |
|---------|---------|
|Regions     | Make sure your existing resource is provisioned in one of the supported regions. If not, you will need to create a new resource in one of these regions.        |
|Pricing tier     | The [pricing tier](../reference/service-limits.md#language-resource-limits) for your resource.       |
|Managed identity     | Make sure that the resource's managed identity setting is enabled. Otherwise, read the next section. |

To use custom text analytics for health, you'll need to [create an Azure storage account](../../../../storage/common/storage-account-create.md) if you don't have one already. 

## Enable identity management for your resource

# [Azure portal](#tab/portal)

Your Language resource must have identity management. To enable it using the [Azure portal](https://portal.azure.com):

1. Go to your Language resource
2. From left hand menu, under **Resource Management** section, select **Identity**
3. From **System assigned** tab, make sure to set **Status** to **On**

# [Language Studio](#tab/studio)

Your Language resource must have identity management, to enable it using [Language Studio](https://aka.ms/languageStudio):

1. Select the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select the check box **Managed Identity** for your Azure AI Language resource.

---

### Enable custom text analytics for health

Make sure to enable **Custom text classification / Custom Named Entity Recognition / Custom text analytics for health** feature from Azure portal.

1. Go to your Language resource in the [Azure portal](https://portal.azure.com).
2. From the left side menu, under **Resource Management** section, select **Features**
3. Enable the **Custom text classification / Custom Named Entity Recognition / Custom text analytics** feature
4. Connect your storage account
5. Select **Apply**

>[!Important]
> * Make sure that your **Language resource** has **storage blob data contributor** role assigned on the storage account you are connecting.

### Add required roles

[!INCLUDE [required roles](../../includes/custom/roles-for-resource-and-storage.md)]

### Enable CORS for your storage account

Make sure to allow (**GET, PUT, DELETE**) methods when enabling Cross-Origin Resource Sharing (CORS). 
Set allowed origins field to `https://language.cognitive.azure.com`. Allow all header by adding `*` to the allowed header values, and set the maximum age to `500`.

:::image type="content" source="../media/resource-sharing.png" alt-text="A screenshot showing how to use CORS for storage accounts." lightbox="../media/resource-sharing.png":::
