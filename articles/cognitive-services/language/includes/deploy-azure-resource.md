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


## Deploy an Azure resource and get started

Before you can use Language Studio, you need to have an Azure account. You can [create one for free](https://azure.microsoft.com/free/ai/). Once you have an Azure account, you can deploy an Azure resource for language to use Language Studio and individual service features. 

> [!IMPORTANT] 
> If you want to use one of the custom features, we recommend following the associated quickstart article.The setup process and requirements for these features are different, and the articles linked above will help you get started more easily.  
> * [Conversational Language Understanding](../custom-language-understanding/quickstart.md)
> * [Custom Content Classification](../custom-classification/quickstart.md)
> * [Custom Named Entity Recognition (NER)](../custom-named-entity-recognition/quickstart.md) 
> * [Custom Question Answering](../custom-question-answering/quickstart.md)
> * [Custom Translator](../custom-translator/quickstart.md)

1. [Log into Language Studio](https://language.azure.com/). If it's your first time logging in, you'll see a window appear that lets you choose a language resource. 

   :::image type="content" source="../media/language-resource.png" alt-text="Create Speech resource in Azure portal.":::

2. Select **Create a new language resource**. Then enter information for your new resource:

        
    |Value  |Description  |
    |---------|---------|
    |Azure subscription | The name of your Azure subscription.        |
    |Azure resource group     | The name of your Azure resource group, which will contain your resource.        |
    |Azure resource name | A name for your new resource.       |
    |Location     | The location where your service requests will be sent. Choose a location near you for lower latency.        |
    |Pricing tier     | The [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/) for your resource. You can select the free (F0) tier if you're trying the service.       |
    |Managed Identity     | Enables Azure to authenticate to other cloud services. You typically would select this setting when using a custom feature of the service.        |

    > [!TIP]
    > * You can only have one resource using the free pricing tier at a time, per subscription.
    > * If you use the free pricing tier, you can keep using the Language service even after your Azure free trial or service credit expires. 


3. Select **Done**. Your resource will be created, and you will be able to try the different features offered by the Language Service. 

You can switch between language resources by clicking the **Settings** icon in the top-right corner of Language Studio. You can delete and manage your resource [using the Azure portal](/azure/azure-resource-manager/management/manage-resources-portal).

