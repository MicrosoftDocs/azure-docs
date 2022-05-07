---
title: Choose a model for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Learn about how to choose a model for Custom Speech. 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/06/2022
ms.author: eur
ms.custom: contperf-fy21q2, references_regions
---

# Choose a model for Custom Speech

With Custom Speech, you can evaluate and improve the Microsoft speech-to-text accuracy for your applications and products. 

Out of the box, speech to text utilizes a Universal Language Model as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. This base model is pre-trained with dialects and phonetics representing a variety of common domains. As a result, consuming the base model requires no additional configuration and works very well in most scenarios. When you make a speech recognition request, the current base model for each [supported language](language-support.md) is used by default.

The base model may not be sufficient if the audio contains ambient noise or includes a lot of industry and domain-specific jargon. In these cases, you can create and train custom speech models with acoustic, language, and pronunciation data. Custom speech models are private and can offer a competitive advantage. 

## Custom Speech models

Custom Speech models are created by adapting a chosen base model with data from your particular customer scenario. Once you create a custom model, the speech recognition accuracy and quality will remain consistent, even if the base model from which it was adapted gets updated.

Base models are updated periodically to improve accuracy and quality. We recommend that if you use base models, use the latest default base models. But with Custom Speech you can take a snapshot of a particular base model without training it. In this case, "custom" means that speech recognition is pinned to a base model from a particular point in time.

Whether you train a new model or use a snapshot of a base model, you can use the model for a limited time. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

## Choose your model

The best way to see if the base model will suffice is to analyze the transcription produced from the base model and compare it with a human-generated transcript for the same audio. You can use the Speech Studio, Speech CLI, or REST API to compare the transcripts and obtain a word error rate (WER) score. If there are multiple incorrect word substitutions when evaluating the results, then training a custom model to recognize those words is recommended.

Furthermore, depending on the size of the custom domain, it may also make sense to train multiple models and compartmentalize a model for an individual application. One model is typically sufficient if the utterances are closely related to one area or domain. On the other hand, multiple models are best if the vocabulary is quite different across the domain areas. Regardless, this situation still requires a decent variety of training data. For instance, Olympic commentators report on various events, each associated with its own vernacular. Because each Olympic event vocabulary differs significantly from others, building a custom model specific to an event increases accuracy by limiting the utterance data relative to that particular event. As a result, the model doesn’t need to sift through unrelated data to make a match. Include audio from various commentators who have different accents, gender, age, etc. 

In addition, it is essential to consider which languages and locales need to be supported; it may make sense to create these models by locale. 

There are three different approaches to implementing Azure speech-to-text:
1)	The base model applies when the audio is clear of ambient noise and the speech transcribed consists of commonly spoken language.
2)	A custom model augments the base model to include domain-specific vocabulary shared across all areas of the custom domain.
3)	Multiple custom models make sense when the custom domain has numerous areas, each a specific vocabulary.


## Prerequisites

> [!div class="checklist"]
> * Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Create a Speech resource</a> in the Azure portal. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
> * Get the resource key and region. After your Speech resource is deployed, select **Go to resource** to view and manage keys. For more information about Cognitive Services resources, see [Get the keys for your resource](~/articles/cognitive-services/cognitive-services-apis-create-account.md#get-the-keys-for-your-resource). 

If you will train a custom model with audio data, choose a Speech resource [region](regions.md#speech-to-text-text-to-speech-and-translation) with dedicated hardware available for training audio data. In regions with dedicated hardware for Custom Speech training, the Speech service will use up to 20 hours of your audio training data, and can process about 10 hours of data per day. In other regions, the Speech service uses up to 8 hours of your audio data, and can process about 1 hour of data per day. After the model is trained, you can copy the model to another region as needed with the [CopyModelToSubscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) REST API.

## Create a project

Custom Speech projects contain models, training and testing datasets, and deployment endpoints. Each project is specific to a country or language. For example, you might create a project for English in the United States.

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select the subscription and Speech resource to work with. 
1. Select **Custom speech** > **Create a new project**. 
1. Follow the instructions provided by the wizard to create your project. 

Select the new project by name or select **Go to project**. You will see these menu items in the left panel: **Speech datasets**, **Train custom models**, **Test models**, and **Deploy models**. 

If you want to use a base model right away, you can skip the training and testing steps. See [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md) to start using a base or custom model.

## Next steps

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Evaluate and improve model accuracy](how-to-custom-speech-evaluate-data.md)
* [Train and deploy a model](how-to-custom-speech-train-model.md)
