---
title: Explore Azure AI capabilities in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces Azure AI capabilities in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Explore Azure AI capabilities in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In Azure AI Studio, you can quickly try out Azure AI capabilities such as Speech and Vision. Go to the **Explore** page from the top navigation menu.

## Azure AI foundation models

Azure AI foundation models have been pre-trained on vast amounts of data, and that can be fine-tuned for specific tasks with a relatively small amount of domain-specific data. These models serve as a starting point for custom models and accelerate the model-building process for a variety of tasks, including natural language processing, computer vision, speech, and generative AI tasks. 

In this article, explore where Azure AI Studio lets you try out and integrate these capabilities into your applications.

On the **Explore** page, select a capability from the left menu to learn more and try it out.


# [Speech](#tab/speech)

[Azure AI Speech](/azure/ai-services/speech-service/) provides speech to text and text to speech capabilities using a Speech resource. You can transcribe speech to text with high accuracy, produce natural-sounding text to speech voices, translate spoken audio, and use speaker recognition during conversations.

You can try the following capabilities of Azure AI Speech in AI Studio:
- Real-time speech to text: Quickly test live transcription capabilities on your own audio without writing any code.
- Custom voice: Use your own audio recordings to create a distinct, one-of-a-kind voice for your text to speech apps.

:::image type="content" source="../media/explore/explore-speech.png" alt-text="Screenshot of speech capability cards in the Azure AI Studio explore tab." lightbox="../media/explore/explore-speech.png":::

Explore more Speech capabilities in the [Speech Studio](https://aka.ms/speechstudio/) and the [Azure AI Speech documentation](/azure/ai-services/speech-service/).

# [Vision](#tab/vision)

[Azure AI Vision](/azure/ai-services/computer-vision/) gives your apps the ability to read text, analyze images, and detect faces with technology like optical character recognition (OCR) and machine learning. 

:::image type="content" source="../media/explore/explore-vision.png" alt-text="Screenshot of vision capability cards in the Azure AI Studio explore tab." lightbox="../media/explore/explore-vision.png":::

Explore more vision capabilities in the [Vision Studio](https://portal.vision.cognitive.azure.com/) and the [Azure AI Vision documentation](/azure/ai-services/computer-vision/).


# [Language](#tab/language)

[Azure AI Language](/azure/ai-services/language-service/) can interpret natural language, classify documents, get real-time translations, or integrate language into your bot experiences.

Use Natural Language Processing (NLP) features to analyze your textual data using state-of-the-art pre-configured AI models or customize your own models to fit your scenario.

:::image type="content" source="../media/explore/explore-language.png" alt-text="Screenshot of language capability cards in the Azure AI Studio explore tab." lightbox="../media/explore/explore-language.png":::

Explore more Language capabilities in the [Language Studio](https://language.cognitive.azure.com/), [Custom Translator Studio](https://portal.customtranslator.azure.ai/), and the [Azure AI Language documentation](/azure/ai-services/language-service/).

---

### Try more Azure AI services

Azure AI Studio provides a quick way to try out Azure AI capabilities. However, some Azure AI services are not currently available in AI Studio.

To try more Azure AI services, go to the following studio links:

- [Azure OpenAI](https://oai.azure.com/)
- [Speech](https://speech.microsoft.com/)
- [Language](https://language.cognitive.azure.com/)
- [Vision](https://portal.vision.cognitive.azure.com/)
- [Custom Vision](https://www.customvision.ai/)
- [Document Intelligence](https://formrecognizer.appliedai.azure.com/)
- [Content Safety](https://contentsafety.cognitive.azure.com/)
- [Custom Translator](https://portal.customtranslator.azure.ai/)

You can conveniently access these links from a menu at the top-right corner of AI Studio.


## Prompt samples

Prompt engineering is an important aspect of working with generative AI models as it allows users to have greater control, customization, and influence over the outputs. By skillfully designing prompts, users can harness the capabilities of generative AI models to generate desired content, address specific requirements, and cater to various application domains.   

The prompt samples are designed to assist AI studio users in finding and utilizing prompts for common use-cases and quickly get started. Users can explore the catalog, view available prompts, and easily open them in a playground for further customization and fine-tuning. 

> [!NOTE]
> These prompts serve as starting points to help users get started and we recommend users to tune and evaluate before using in production. 

On the **Explore** page, select **Samples** > **Prompts** from the left menu to learn more and try it out.

### Filter by Modalities, Industries or Tasks 

You can filter the prompt samples by modalities, industries, or task to find the prompt that best suits your use-case. 

- **Modalities**: You can filter the prompt samples by modalities to find prompts for modalities like Completion, Chat, Image and Video.  
- **Industries**: You can filter the prompt samples by industries to find prompts from specific domains.  
- **Tasks**: The task filter allows you to filter prompts by the task they are best suited for, such as translation, question answering, or classification. 


## Next steps

- [Explore the model catalog in Azure AI Studio](model-catalog.md)
