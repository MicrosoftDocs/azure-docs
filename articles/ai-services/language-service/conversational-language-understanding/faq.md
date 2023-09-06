---
title: Frequently Asked Questions
titleSuffix: Azure AI services
description: Use this article to quickly get the answers to FAQ about conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: faq
ms.date: 09/29/2022
ms.author: aahi
ms.custom: ignite-fall-2021, mode-other
---

# Frequently asked questions for conversational language understanding

Use this article to quickly get the answers to common questions about conversational language understanding

## How do I create a project?

See the [quickstart](./quickstart.md) to quickly create your first project, or the [how-to article](./how-to/create-project.md) for more details. 


## Can I use more than one conversational language understanding project together?

Yes, using orchestration workflow. See the [orchestration workflow documentation](../orchestration-workflow/overview.md) for more information.

## What is the difference between LUIS and conversational language understanding?

Conversational language understanding is the next generation of LUIS.

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

Yes, you can [import any LUIS application](./how-to/migrate-from-luis.md) JSON file from the latest version in the service.

## Can I import a LUIS `.LU` file into conversational language understanding?

No, the service only supports JSON format. You can go to LUIS, import the `.LU` file and export it as a JSON file. 

## Can I use conversational language understanding with custom question answering?

Yes, you can use [orchestration workflow](../orchestration-workflow/overview.md) to orchestrate between different conversational language understanding and [question answering](../question-answering/overview.md) projects. Start by creating orchestration workflow projects, then  connect your conversational language understanding and custom question answering projects. To perform this action, make sure that your projects are under the same Language resource.

## How do I handle out of scope or domain utterances that aren't relevant to my intents?

Add any out of scope utterances to the [none intent](./concepts/none-intent.md).

## How do I control the none intent?

You can control the none intent threshold from UI through the project settings, by changing the none intent threshold value. The values can be between 0.0 and 1.0. Also, you can change this threshold from the APIs by changing the *confidenceThreshold* in settings object. Learn more about [none intent](./concepts/none-intent.md#none-score-threshold)

## Is there any SDK support?

Yes, only for predictions, and samples are available for [Python](https://aka.ms/sdk-samples-conversation-python) and [C#](https://aka.ms/sdk-sample-conversation-dot-net). There is currently no authoring support for the SDK.

## What are the training modes?


|Training mode  | Description | Language availability  | Pricing  |
|---------|---------|---------|---------|
|Standard training     | Faster training times for quicker model iteration.        | Can only train projects in English.        | Included in your [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).        |
|Advanced training     | Slower training times using fine-tuned neural network transformer models.        | Can train [multilingual projects](language-support.md#multi-lingual-option).         | May incur [additional charges](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).

See [training modes](how-to/train-model.md#training-modes) for more information.

## Are there APIs for this feature?

Yes, all the APIs are available.
* [Authoring APIs](https://aka.ms/clu-authoring-apis)
* [Prediction API](/rest/api/language/2023-04-01/conversation-analysis-runtime/analyze-conversation)

## Next steps

[Conversational language understanding overview](overview.md)
