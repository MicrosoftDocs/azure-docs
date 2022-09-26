---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 07/21/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

To use Language Studio, you will need an Azure Language resource for authentication. You can also use this resource to call the feature REST APIs and client libraries. Follow these steps to get started. 

> [!IMPORTANT] 
> The setup process and requirements for custom features are different. If you're using one of the following custom features, we recommend using the quickstart articles linked below to get started more easily.  
> * [Conversational Language Understanding](../conversational-language-understanding/quickstart.md)
> * [Custom Text Classification](../custom-classification/quickstart.md)
> * [Custom Named Entity Recognition (NER)](../custom-named-entity-recognition/quickstart.md) 
> * [Orchestration workflow](../orchestration-workflow/quickstart.md)

1. Create an Azure Subscription. You can [create one for free](https://azure.microsoft.com/free/ai/). 

2. [Log into Language Studio](https://aka.ms/languageStudio). If it's your first time logging in, you'll see a window appear that lets you choose a language resource. 

   :::image type="content" source="../media/language-resource-small.png" alt-text="A screenshot showing the resource selection screen in Language Studio." lightbox="../media/language-resource.png":::

3. Select **Create a new language resource**. Then enter information for your new resource, such as a name, location and resource group.

    
    > [!TIP]
    > * When selecting a location for your Azure resource, choose one that's closest to you for lower latency.
    > * We recommend turning the **Managed Identity** option **on**, to authenticate your requests across Azure.
    > * If you use the free pricing tier, you can keep using the Language service even after your Azure free trial or service credit expires. 

    :::image type="content" source="../media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="../media/create-new-resource.png":::

4. Select **Done**. Your resource will be created, and you will be able to try the different features offered by the Language service. For example, select **Find linked entities**.

    :::image type="content" source="../media/language-studio-main-screen.png" alt-text="A screenshot showing the main screen in Language Studio." lightbox="../media/language-studio-main-screen.png":::


5. This feature has a section for entering text, uploading a file, or choosing a text sample to demonstrate how the feature works. To try the demo, you will need to choose a resource and acknowledge it will incur usage according to your [pricing tier](https://aka.ms/unifiedLanguagePricing).

    :::image type="content" source="../media/language-studio-feature.png" alt-text="A screenshot showing a feature in Language Studio" lightbox="../media/language-studio-feature.png":::

6. After sending text, you'll be able to see a visualization, along with the JSON response. At the bottom of the page, you'll see next steps and the cURL command for the API request you just sent.

    :::image type="content" source="../media/language-studio-feature-result.png" alt-text="A screenshot showing the result of a feature in Language Studio" lightbox="../media/language-studio-feature-result.png":::
