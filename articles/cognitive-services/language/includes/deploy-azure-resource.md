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


Before you can use Language Studio, you need to have an Azure account. You can [create one for free](https://azure.microsoft.com/free/ai/). Once you have an Azure account, you can deploy an Azure resource for language to use Language Studio and individual service features. 

> [!IMPORTANT] 
> If you want to use one of the custom features, we recommend following the associated quickstart article.The setup process and requirements for these features are different, and the articles linked above will help you get started more easily.  
> * [Conversational Language Understanding](../custom-language-understanding/quickstart.md)
> * [Custom Text Classification](../custom-classification/quickstart/using-language-studio.md)
> * [Custom Named Entity Recognition (NER)](../custom-named-entity-recognition/quickstart.md) 

1. [Log into Language Studio](https://language.azure.com/). If it's your first time logging in, you'll see a window appear that lets you choose a language resource. 

   :::image type="content" source="../media/language-resource.png" alt-text="Create Speech resource in Azure portal.":::

2. Select **Create a new language resource**. Then enter information for your new resource, such as a name, location and resource group.

    > [!TIP]
    > * When selecting a location for your Azure resource, choose one that's closest to you for better latency.
    > * The **Managed Identity** option is used for the custom features. If you aren't using a custom feature, you can turn this setting off. 
    > * If you use the free pricing tier, you can keep using the Language service even after your Azure free trial or service credit expires. 


3. Select **Done**. Your resource will be created, and you will be able to try the different features offered by the Language Service. 

You can switch between language resources by clicking the **Settings** icon in the top-right corner of Language Studio. You can delete and manage your resource [using the Azure portal](/azure/azure-resource-manager/management/manage-resources-portal).