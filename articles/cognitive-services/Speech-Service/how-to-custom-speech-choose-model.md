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
ms.date: 05/08/2022
ms.author: eur
ms.custom: contperf-fy21q2, references_regions
---

# Choose a model for Custom Speech

Custom Speech models are created by customizing a base model with data from your particular customer scenario. Once you create a custom model, the speech recognition accuracy and quality will remain consistent, even when a new base model is released. 

Base models are updated periodically to improve accuracy and quality. We recommend that if you use base models, use the latest default base models. But with Custom Speech you can take a snapshot of a particular base model without training it. In this case, "custom" means that speech recognition is pinned to a base model from a particular point in time.

New base models are released periodically to improve accuracy and quality. We recommend that you chose the latest base model when creating your custom model. If a required customization capability is only available with an older model, then you can choose an older base model. 

> [!NOTE]
> The name of the base model corresponds to the date when it was released in YYYYMMDD format. The customization capabilities of the base model are listed in parenthesis after the model name in Speech Studio

A model deployed to an endpoint using Custom Speech is fixed until you decide to update it. You can also choose to deploy a base model without training, which means that base model is fixed. This allows you to lock in the behavior of a specific model until you decide to use a newer model.

Whether you train your own model or use a snapshot of a base model, you can use the model for a limited time. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

## Choose your model

There are a few approaches to using speech-to-text models:
- The base model provides accurate speech recognition out of the box for a range of [scenarios](overview.md#speech-scenarios).
- A custom model augments the base model to include domain-specific vocabulary shared across all areas of the custom domain.
- Multiple custom models can be used when the custom domain has multiple areas, each with a specific vocabulary.

One recommended way to see if the base model will suffice is to analyze the transcription produced from the base model and compare it with a human-generated transcript for the same audio. You can use the Speech Studio, Speech CLI, or REST API to compare the transcripts and obtain a [word error rate (WER)](how-to-custom-speech-evaluate-data.md#evaluate-word-error-rate) score. If there are multiple incorrect word substitutions when evaluating the results, then training a custom model to recognize those words is recommended.

Multiple models are recommended if the vocabulary varies across the domain areas. For instance, Olympic commentators report on various events, each associated with its own vernacular. Because each Olympic event vocabulary differs significantly from others, building a custom model specific to an event increases accuracy by limiting the utterance data relative to that particular event. As a result, the model doesn’t need to sift through unrelated data to make a match. Regardless, training still requires a decent variety of training data. Include audio from various commentators who have different accents, gender, age, etcetera. 

## Create a Custom Speech project

Custom Speech projects contain models, training and testing datasets, and deployment endpoints. Each project is specific to a country or language. For example, you might create a project for English in the United States.

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select the subscription and Speech resource to work with. 
1. Select **Custom speech** > **Create a new project**. 
1. Follow the instructions provided by the wizard to create your project. 

Select the new project by name or select **Go to project**. You will see these menu items in the left panel: **Speech datasets**, **Train custom models**, **Test models**, and **Deploy models**. 

If you want to use a base model right away, you can skip the training and testing steps. See [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md) to start using a base or custom model.

## Next steps

* [Training and testing datasets](./how-to-custom-speech-test-and-train.md)
* [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
* [Train a model](how-to-custom-speech-train-model.md)
