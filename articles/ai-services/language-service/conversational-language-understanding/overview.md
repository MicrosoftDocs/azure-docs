---
title: Conversational Language Understanding - Azure AI services
titleSuffix: Azure AI services
description: Customize an AI model to predict the intentions of utterances, and extract important information from them.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 10/26/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# What is conversational language understanding?

Conversational language understanding is one of the custom features offered by [Azure AI Language](../overview.md). It is a cloud-based API service that applies machine-learning intelligence to enable you to build natural language understanding component to be used in an end-to-end conversational application. 

Conversational language understanding (CLU) enables users to build custom natural language understanding models to predict the overall intention of an incoming utterance and extract important information from it. CLU only provides the intelligence to understand the input text for the client application and doesn't perform any actions. By creating a CLU project, developers can iteratively label utterances, train and evaluate model performance before making it available for consumption. The quality of the labeled data greatly impacts model performance. To simplify building and customizing your model, the service offers a custom web portal that can be accessed through the [Language studio](https://aka.ms/languageStudio). You can easily get started with the service by following the steps in this [quickstart](quickstart.md). 

This documentation contains the following article types:

* [Quickstarts](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [Concepts](concepts/evaluation-metrics.md) provide explanations of the service functionality and features.
* [How-to guides](how-to/create-project.md) contain instructions for using the service in more specific or customized ways.


## Example usage scenarios

CLU can be used in multiple scenarios across a variety of industries. Some examples are:

### End-to-end conversational bot

Use CLU to build and train a custom natural language understanding model based on a specific domain and the expected users' utterances. Integrate it with any end-to-end conversational bot so that it can process and analyze incoming text in real time to identify the intention of the text and extract important information from it. Have the bot perform the desired action based on the intention and extracted information. An example would be a customized retail bot for online shopping or food ordering.

### Human assistant bots

One example of a human assistant bot is to help staff improve customer engagements by triaging customer queries and assigning them to the appropriate support engineer. Another example would be a human resources bot in an enterprise that allows employees to communicate in natural language and receive guidance based on the query.

### Command and control application

When you integrate a client application with a speech to text component, users can speak a command in natural language for CLU to process, identify intent, and extract information from the text for the client application to perform an action. This use case has many applications, such as to stop, play, forward, and rewind a song or turn lights on or off.

### Enterprise chat bot

In a large corporation, an enterprise chat bot may handle a variety of employee affairs. It might handle frequently asked questions served by a custom question answering knowledge base, a calendar specific skill served by conversational language understanding, and an interview feedback skill served by LUIS. Use Orchestration workflow to connect all these skills together and appropriately route the incoming requests to the correct service.


## Project development lifecycle

Creating a CLU project typically involves several different steps. 

:::image type="content" source="media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

Follow these steps to get the most out of your model:

1. **Define your schema**: Know your data and define the actions and relevant information that needs to be recognized from user's input utterances. In this step you create the [intents](glossary.md#intent) that you want to assign to user's utterances, and the relevant [entities](glossary.md#entity) you want extracted.

2. **Label your data**: The quality of data labeling is a key factor in determining model performance. 

3. **Train the model**: Your model starts learning from your labeled data.

4. **View the model's performance**: View the evaluation details for your model to determine how well it performs when introduced to new data.

6. **Improve the model**: After reviewing the model's performance, you can then learn how you can improve the model.

7. **Deploy the model**: Deploying a model makes it available for use via the [Runtime API](https://aka.ms/clu-apis).

8. **Predict intents and entities**: Use your custom model to predict intents and entities from user's utterances.

## Reference documentation and code samples

As you use CLU, see the following reference documentation and samples for Azure AI Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST APIs (Authoring)   | [REST API documentation](https://aka.ms/clu-authoring-apis)        |         |
|REST APIs (Runtime)    | [REST API documentation](https://aka.ms/clu-apis)        |         |
|C# (Runtime)    | [C# documentation](/dotnet/api/overview/azure/ai.language.conversations-readme)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.Conversations/samples)        |
|Python (Runtime)| [Python documentation](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-conversations/samples) |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it's deployed. Read the transparency note for CLU to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Next steps

* Use the [quickstart article](quickstart.md) to start using conversational language understanding.  

* As you go through the project development lifecycle, review the [glossary](glossary.md) to learn more about the terms used throughout the documentation for this feature. 

* Remember to view the [service limits](service-limits.md) for information such as [regional availability](service-limits.md#regional-availability).

