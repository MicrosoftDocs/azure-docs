---
title: Integrate with other applications - QnA Maker
description: QnA Maker integrates into client applications such as chat bots as well as with other natural language processing services such as Language Understanding (LUIS).
ms.topic: conceptual
ms.date: 01/27/2020
---

# Design knowledge base for client applications

QnA Maker integrates into client applications such as chat bots as well as with other natural language processing services such as Language Understanding (LUIS).

## Integration with a conversational client

QnA Maker integrates with conversational client applications such as [Microsoft Bot Framework](https://dev.botframework.com/). The text sent to QnA Maker doesn't need to be cleaned or transformed. QnA Maker accepts natural languages and returns the best answer.

## Create a bot without writing any code

After you publish your knowledge base, create a bot from the **Publish** page, by selecting the **Create bot** button. Use the [bot tutorial](../Quickstarts/create-publish-knowledge-base.md) to learn what happens after you select the button.

## Providing multi-turn conversations

A bot client provides the best selected answer from your knowledge base, and can provide follow-up prompts if the answer is part of a multi-turn QnA pair. Learn [how to](../how-to/multiturn-conversation.md) add multi-turn conversation question and answer sets to your knowledge base.

## Natural language processing

While QnA Maker processes questions that use natural language processing, it can also be used a part of a larger system that answers questions from multiple knowledge bases. You can combine QnA Maker with another Cognitive Service, Language Understanding (LUIS), to provide natural language processing before getting to a specific knowledge base. Learn more about when and how to use [LUIS and QnA Maker](../../luis/choose-natural-language-processing-service.md?toc=/azure/cognitive-services/qnamaker/toc.json) together.

## Next steps

Learn development cycle [concepts](development-lifecycle-knowledge-base.md) for QnA Maker.