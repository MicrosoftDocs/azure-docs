---
title: Frequently Asked Questions
titleSuffix: Azure Cognitive Services
description: Use this article to quickly get the answers to FAQ about conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: quickstart
ms.date: 05/23/2022
ms.author: aahi
ms.custom: ignite-fall-2021, mode-other
---

# Frequently asked questions for conversational language understanding

Use this article to quickly get the answers to common questions about conversational language understanding

## How do I create a project?

See the [quickstart](./quickstart.md) to quickly create your first project, or the [how-to article](./how-to/create-project.md) for more details. 

## Can I use more than one CLU project together?

Yes, using orhcestration workflow, see the [orchestration workflow documentation](../orchestration-workflow/overview.md) for more information.

## What is the difference between LUIS and CLU?

CLU is the next generation of LUIS. 

## Training is taking a long time, is this expected?

For conversation projects, long training times are expected. Based on the number of examples you have your training times may vary from 5 minutes to 1 hour or more. 

## How do I use entity components?

See the [entity components](./concepts/entity-components.md) article.

## Which languages are supported in this feature?

See the [language support](./language-support.md) article.

## How do I get more accurate results for my project?

Take a look at the [recommended guidelines](./how-to/build-schema.md#guidelines-and-recommendations) for information on improving accuracy.

## How do I get predictions in different languages?

When you train and deploy a conversation project in any language, you can immediately try querying it in [multiple languages](./concepts/multiple-languages.md). You may get varied results for different languages. To improve the accuracy of any language, add utterances to your project in that language to introduce the trained model to more syntax of that language.

## How many intents, entities, utterances can I add to a project?

See the [service limits](./service-limits.md) article. 

## Can I label the same word as 2 different entities?

Unlike LUIS, you cannot label the same text as 2 different entities. Learned components across different entities are mutually exclusive, and only one learned span is predicted for each set of characters.

## Can I import a LUIS JSON file into conversational language understanding?

Yes, you can [import any LUIS application](./concepts/backwards-compatibility.md) JSON file from the latest version in the service.

## Can I import a LUIS `.LU` file into conversational language understanding?

No, the service only supports JSON format. You can go to LUIS, import the `.LU` file and export it as a JSON file. 

## Can I use CLU with custom Question answering?

Yes, you can use orchestration workflow to orchestrate between different CLU and [custom Question answering](../question-answering/overview.md) projects. Start by creating orchestration workflow projects and connect your CLU and custom question answering projects. All you need is to make sure that these projects are under the same Language resource.

## How do I handle out of scope or domain utterances that aren't relevant to my intents?

Add any out of scope utterances to the [none intent](./concepts/none-intent.md).

## How do I control the none intent?

You can control the none intent threshhold from UI through the project settings, by changing the none inten threshold value. The values can be between 0.0 and 1.0. Also, you can change this threshold from the APIs by changing the *confidenceThreshold* in settings object. Learn more about [none intent](../concepts/none-intent#none-score-threshold)

## Is there any SDK support?

Yes, only for predictions, and samples are available for [python](https://aka.ms/sdk-samples-conversation-python) and [C#](https://aka.ms/sdk-sample-conversation-dot-net). There is currently no authoring support for the SDK.

## What are the training modes?

There are two training modes. **Standard training** is faster training times for quicker iterations. Only available in English. Free of charge. While **advanced training** trains using fine-tuned neural network transformer models. Can train multilingual projects. Learn more about [training modes](how-to/train-model#training-modes)

## Are there APIs for this feature?

Yes, all the APIs are available.
* [Authoring APIs](https://aka.ms/clu-authoring-apis)
* [Prediction API](https://aka.ms/clu-runtime-api)

## Next steps

[Conversational language understanding overview](overview.md)
