---
title: "Quickstart: Get started with Language Studio"
titleSuffix: Azure AI services
description: Use this article to learn about Language Studio, and testing features of Azure AI Language
author: aahill
ms.author: aahi
manager: nitinme
ms.service: azure-ai-language
ms.date: 12/19/2023
ms.topic: quickstart
ms.custom: ignite-fall-2021
---

# Quickstart: Get started with Language Studio

[Language Studio](https://aka.ms/languageStudio) is a set of UI-based tools that lets you explore, build, and integrate features from Azure AI Language into your applications.

Language Studio provides you with a platform to try several service features, and see what they return in a visual manner. It also provides you with an easy-to-use experience to create custom projects and models to work on your data. Using the Studio, you can get started without needing to write code, and then use the available client libraries and REST APIs in your application.

## Try Language Studio before signing up

Language Studio lets you try available features without needing to create an Azure account or an Azure resource. From the main page of the studio, select one of the listed categories to see [available features](overview.md#available-features) you can try.

:::image type="content" source="./media/language-studio-main-screen.png" alt-text="A screenshot showing the main screen in Language Studio." lightbox="./media/language-studio-main-screen.png":::

Once you choose a feature, you'll be able to send several text examples to the service, and see example output.  

:::image type="content" source="./media/language-studio-sample-input.png" alt-text="A screenshot showing sample input for a feature in Language Studio." lightbox="./media/language-studio-sample-input.png":::

## Use Language Studio with your own text

When you're ready to use Language Studio features on your own text data, you will need an Azure AI Language resource for authentication and [billing](https://aka.ms/unifiedLanguagePricing). You can also use this resource to call the REST APIs and client libraries programmatically. Follow these steps to get started. 

> [!IMPORTANT] 
> The setup process and requirements for custom features are different. If you're using one of the following custom features, we recommend using the quickstart articles linked below to get started more easily.  
> * [Conversational Language Understanding](./conversational-language-understanding/quickstart.md)
> * [Custom Text Classification](./custom-text-classification/quickstart.md)
> * [Custom Named Entity Recognition (NER)](./custom-named-entity-recognition/quickstart.md) 
> * [Orchestration workflow](./orchestration-workflow/quickstart.md)

1. Create an Azure Subscription. You can [create one for free](https://azure.microsoft.com/free/ai/). 

2. [Log into Language Studio](https://aka.ms/languageStudio). If it's your first time logging in, you'll see a window appear that lets you choose a language resource. 

   :::image type="content" source="./media/language-resource-small.png" alt-text="A screenshot showing the resource selection screen in Language Studio." lightbox="./media/language-resource.png":::

3. Select **Create a new language resource**. Then enter information for your new resource, such as a name, location and resource group.

    
    > [!TIP]
    > * When selecting a location for your Azure resource, choose one that's closest to you for lower latency.
    > * We recommend turning the **Managed Identity** option **on**, to authenticate your requests across Azure.
    > * If you use the free pricing tier, you can keep using the Language service even after your Azure free trial or service credit expires. 

    :::image type="content" source="./media/create-new-resource-small.png" alt-text="A screenshot showing the resource creation screen in Language Studio." lightbox="./media/create-new-resource.png":::

4. Select **Done**. Your resource will be created, and you will be able to use the different features offered by the Language service with your own text.


### Valid text formats for conversation features

> [!NOTE]
> This section applies to the following features:
> * [PII detection for conversation](./personally-identifiable-information/overview.md)
> * [Conversation summarization](./summarization/overview.md?tabs=conversation-summarization)

If you're sending conversational text to supported features in Language Studio, be aware of the following input requirements: 
* The text you send must be a conversational dialog between two or more participants.
* Except issue/resolution summarization, each line must start with the name of the participant, followed by a `:`, and followed by what they say.
* To use issue and resolution aspects in conversation summarization, each line must start with the role of the participant between "Customer" and "Agent" spelled in English, followed by a ':' before what they say in any supported languages. Names of participants, followed by the role, are optional. 
* Each participant must be on a new line. If multiple participants' utterances are on the same line, it will be processed as one line of the conversation.

See the following example for how you should structure conversational text you want to send.

*Agent: Hello, you're chatting with Rene. How may I help you?*

*Customer: Hi, I tried to set up wifi connection for Smart Brew 300 espresso machine, but it didn't work.*

*Agent: I’m sorry to hear that. Let’s see what we can do to fix this issue.*

Note that the names of the two participants in the conversation (*Agent* and *Customer*) begin each line, and that there is only one participant per line of dialog. 

:::image type="content" source="./media/language-studio-conversation-example.png" alt-text="A screenshot showing an example conversation input in Language Studio." lightbox="./media/language-studio-conversation-example.png":::

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../multi-service-resource.md?pivots=azcli#clean-up-resources)

> [!TIP]
> In Language Studio, you can find your resource's details (such as its name and pricing tier) as well as switch resources by:
> 1. Selecting the **Settings** icon in the rop-right corner of the Language Studio screen). 
> 2. Select **Resources**
>
> You can't delete your resource from Language Studio. 

## Next steps

* Go to the [Language Studio](https://aka.ms/languageStudio) to begin using features offered by the service.
* For more information and documentation on the features offered, see the [Azure AI Language overview](overview.md). 
