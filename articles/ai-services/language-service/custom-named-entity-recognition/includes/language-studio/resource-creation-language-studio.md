---
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/06/2022
ms.author: aahi
---


### Create a new Language resource from Language Studio

If it's your first time logging in, you'll see a window in [Language Studio](https://aka.ms/languageStudio) that will let you choose an existing Language resource or create a new one. You can also create a resource by clicking the settings icon in the top-right corner, selecting **Resources**, then clicking **Create a new resource**.

Create a Language resource with following details.

|Instance detail  |Required value  |
|---------|---------|
|Azure subscription| **Your Azure subscription**|
|Azure resource group| **Your Azure resource group**|
|Azure resource name| **Your Azure resource name**|
|Location | The [region](../../service-limits.md#regional-availability) of your Language resource.      |
|Pricing tier     | The [pricing tier](../../service-limits.md#language-resource-limits) of your Language resource.        |

> [!IMPORTANT]
> * Make sure to enable **Managed Identity** when you create a Language resource. 
> * Read and confirm Responsible AI notice

To use custom named entity recognition, you'll need to [create an Azure storage account](../../../../../storage/common/storage-account-create.md) if you don't have one already. 
