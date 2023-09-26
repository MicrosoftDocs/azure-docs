---
title: Use LUIS and question answering
description:  Learn how to use LUIS and question answering using orchestration.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 05/23/2022
---

# Combine LUIS and question answering capabilities

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Azure AI services provides two natural language processing services, [Language Understanding](../what-is-luis.md) (LUIS) and question answering, each with a different purpose. Understand when to use each service and how they complement each other.

Natural language processing (NLP) allows your client application, such as a chat bot, to work with your users' natural language.

## When to use each feature

LUIS and question answering solve different problems. LUIS determines the intent of a user's text (known as an utterance), while question answering determines the answer to a user's text (known as a query).

To pick the correct service, you need to understand the user text coming from your client application, and what information it needs to get from the Azure AI service features.

As an example, if your chat bot receives the text "How do I get to the Human Resources building on the Seattle north campus", use the table below to understand how each service works with the text.


| Service | Client application determines |
|---|---|
| LUIS | Determines user's intention of text - the service doesn't return the answer to the question. For example, this text would be classified as matching a "FindLocation" intent.|
| Question answering | Returns the answer to the question from a custom knowledge base. For example, this text would be determined as a question, with the static text answer being "Get on the #9 bus and get off at Franklin street". |

## Create an orchestration project

Orchestration helps you connect more than one project and service together. Each connection in the orchestration is represented by a type and relevant data. The intent needs to have a name, a project type (LUIS, question answering, or conversational language understanding, and a project you want to connect to by name.

You can use orchestration workflow to create new orchestration projects. See [orchestration workflow](../../language-service/orchestration-workflow/how-to/create-project.md) for more information.
## Set up orchestration between Azure AI services features

To use an orchestration project to connect LUIS, question answering, and conversational language understanding, you need:

* A language resource in [Language Studio](https://language.azure.com/) or the Azure portal.
* To change your LUIS authoring resource to the Language resource. You can also optionally export your application from LUIS, and then [import it into conversational language understanding](../../language-service/orchestration-workflow/how-to/create-project.md#import-an-orchestration-workflow-project).

>[!Note]
>LUIS can be used with Orchestration projects in West Europe only, and requires the authoring resource to be a Language resource. You can either import the application in the West Europe Language resource or change the authoring resource from the portal.

## Change a LUIS resource to a language resource:

You need to follow the following steps to change LUIS authoring resource to a Language resource

1. Log in to the [LUIS portal](https://www.luis.ai/) .
2. From the list of LUIS applications, select the application you want to change to a Language resource.
3. From the menu at the top of the screen, select **Manage**.
4. From the left Menu, select **Azure resource**
5. Select **Authoring resource** , then change your LUIS authoring resource to the Language resource.

:::image type="content" source="../media/orchestration/authoring-resource-change.png" alt-text="A screenshot showing how to change your authoring resource using the LUIS portal." lightbox="../media/orchestration/authoring-resource-change.png":::

## Next steps

* [Conversational language understanding documentation](../../language-service/conversational-language-understanding/how-to/create-project.md)
