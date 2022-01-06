---
title: Use LUIS and question answering
description:  Learn how to use LUIS and question answering using orchestration.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/06/2022
---

# Combine LUIS and question answering capabilities

Cognitive Services provides two natural language processing services, [Language Understanding](/azure/cognitive-services/luis/what-is-luis) (LUIS) and question answering, each with a different purpose. Understand when to use each service and how they compliment each other.

Natural language processing (NLP) allows your client application, such as a chat bot, to work with your users' natural language.

## Cognitive Services with NLP

LUIS and question answering provide NLP. The client application submits natural language text. The service takes the text, processes it, and returns a result. Even if a user's input has poor grammar, spelling, or punctuation, these Cognitive Services features can still interpret the text, and deliver helpful responses.

## When to use each feature

LUIS and question answering solve different problems. LUIS determines the intent of a user's text (known as an utterance), while question answering determines the answer to a user's text (known as a query).

To pick the correct service, you need to understand the user text coming from your client application, and what information it needs to get from the Cognitive Service features.

As an example, if your chat bot receives the text "How do I get to the Human Resources building on the Seattle north campus", use the table below to understand how each service works with the text.


| Service | Client application determines |
|---|---|
| LUIS | Determines user's intention of text - the service doesn't return the answer to the question. For example, this text would be classified as matching a "FindLocation" intent.|
| Question answering | Returns the answer to the question from a custom knowledge base. For example, this text would be determined as a question, with the static text answer being "Get on the #9 bus and get off at Franklin street". |

## How to use LUIS and question answering using orchestration

Orchestration helps you connect more than one project and service together. Each connection in the orchestration is represented by a type and relevant data. The intent needs to have a name, a project type (LUIS, question answering, or conversational language understanding, and a project you want to connect to by name.

## Create an orchestration project

You can use conversational language understanding to create a new orchestration project, See the [conversational language understanding documentation](../../language-service/conversational-language-understanding/how-to/create-project.md#create-an-orchestration-workflow-project).

## Set up orchestration between Cognitive Services features

To use an orchestration project to connect LUIS, question answering, and conversational language understanding, you need:

1. A language resource in [Language Studio](https://language.azure.com/) or the Azure portal.
2. To change your LUIS authoring resource to the Language resource. You can also optionally export your application from LUIS, and then [import it into conversational language understanding](../../language-service/conversational-language-understanding/how-to/create-project.md#import-a-project).

## Change a LUIS resource to a language resource:

You need to follow the following steps to change LUIS authoring resource to a Language resource

1. Log in to the [LUIS portal](https://www.luis.ai/) .
2. From the list of LUIS applications, select the application you want to change to a Language resource.
3. From the menu at the top of the screen, select **Manage**.
4. From the left Menu, select **Azure resource**
5. Select **Authoring resource** , then change your LUIS authoring resource to the Language resource.

:::image type="content" source="../media/orchestration/authoring-resource-change.png" alt-text="A screenshot showing how to change your authoring resource using the LUIS portal." lightbox="../media/orchestration/authoring-resource-change.png":::

## Next steps

[Conversational language understanding documentation](../../language-service/conversational-language-understanding/how-to/create-project.md#create-an-orchestration-workflow-project).