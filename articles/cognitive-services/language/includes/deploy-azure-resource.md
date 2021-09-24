---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 09/08/2021
ms.author: aahi
---

To use Language Studio, you will need an Azure resource for language for authentication. You can also use this resource to call the feature REST APIs and client libraries. Follow these steps to get started. 

> [!IMPORTANT] 
> The setup process and requirements for the custom features are different. If you're using one of the custom features, we recommend following one of the quickstart articles linked below to get started more easily.  
> * [Conversational Language Understanding](../custom-language-understanding/quickstart.md)
> * [Custom Text Classification](../custom-classification/quickstart.md)
> * [Custom Named Entity Recognition (NER)](../custom-named-entity-recognition/quickstart.md) 

1. Create an Azure Subscription. You can [create one for free](https://azure.microsoft.com/free/ai/). 

2. [Log into Language Studio](https://language.azure.com/). If it's your first time logging in, you'll see a window appear that lets you choose a language resource. 

   :::image type="content" source="../media/language-resource-small.png" alt-text="A screenshot showing the resource selection screen in Language Studio." lightbox="../media/language-resource.png":::

3. Select **Create a new language resource**. Then enter information for your new resource, such as a name, location and resource group.

    :::image type="content" source="../media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../media/create-new-resource.png":::

4. Select **Done**. Your resource will be created, and you will be able to try the different features offered by the Language Service. 

    > [!TIP]
    > * When selecting a location for your Azure resource, choose one that's closest to you for lower latency.
    > * We recommend turning the **Managed Identity** option **on**, to authenticate your requests across Azure.
    > * If you use the free pricing tier, you can keep using the Language service even after your Azure free trial or service credit expires. 


You can switch between language resources by clicking the **Settings** icon in the top-right corner of Language Studio. You can delete and manage your resource [using the Azure portal](/azure/azure-resource-manager/management/manage-resources-portal).