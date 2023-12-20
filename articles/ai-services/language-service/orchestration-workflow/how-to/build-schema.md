---
title: How to build an orchestration project schema
description: Learn how to define intents for your orchestration workflow project.
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-orchestration
---

# How to build your project schema for orchestration workflow
 
In orchestration workflow projects, the *schema* is defined as the combination of intents within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents that should be included in your project.

## Guidelines and recommendations

Consider the following guidelines and recommendations for your project:

*	Build orchestration projects when you need to manage the NLU for a multi-faceted virtual assistant or chatbot, where the intents, entities, and utterances would begin to be far more difficult to maintain over time in one project.
*	Orchestrate between different domains. A domain is a collection of intents and entities that serve the same purpose, such as Email commands vs. Restaurant commands.
*	If there is an overlap of similar intents between domains, create the common intents in a separate domain and removing them from the others for the best accuracy.
*	For intents that are general across domains, such as “Greeting”, “Confirm”, “Reject”, you can either add them in a separate domain or as direct intents in the Orchestration project. 
*	Orchestrate to Custom question answering knowledge base when a domain has FAQ type questions with static answers. Ensure that the vocabulary and language used to ask questions is distinctive from the one used in the other Conversational Language Understanding projects and LUIS applications.
*	If an utterance is being misclassified and routed to an incorrect intent, then add similar utterances to the intent to influence its results. If the intent is connected to a project, then add utterances to the connected project itself. After you retrain your orchestration project, the new utterances in the connected project will influence predictions.
*	Add test data to your orchestration projects to validate there isn’t confusion between linked projects and other intents.


## Add intents

To build a project schema within [Language Studio](https://aka.ms/languageStudio):

1. Select **Schema definition** from the left side menu.

2. To create an intent, select **Add** from the top menu. You will be prompted to type in a name for the intent.

3. To connect your intent to other existing projects, select **Yes, I want to connect it to an existing project** option. You can alternatively create a non-connected intent by selecting the **No, I don't want to connect to a project** option. 

4. If you choose to create a connected intent, choose from **Connected service** the service you are connecting to, then choose the **project name**. You can connect your intent to only one project from the following services: [CLU](../../conversational-language-understanding/overview.md) , [LUIS](../../../luis/what-is-luis.md) or [Question answering](../../question-answering/overview.md).
  
   :::image type="content" source="../media/build-schema-page.png" alt-text="A screenshot showing the schema creation page in Language Studio." lightbox="../media/build-schema-page.png":::
   
> [!TIP]
> Use connected intents to connect to other projects (conversational language understanding, LUIS, and question answering)
   
5. Select **Add intent** to add your intent.
 
## Next steps

* [Add utterances](tag-utterances.md)

