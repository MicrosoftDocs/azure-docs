---
title: Conversational context
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 05/07/2019
ms.author: diberry
#
---

# Use conversational context to determine the next question

## What is conversational context?

Conversational context is the ability to manage a question within the context of questions asked before and after that question. 

When you design your client application (chat bot) conversations, a user may ask a question that needs to be filtered or refined in order to determine the correct answer. This flow through the questions is possible by selecting child questions.

When the user asks the question, QnA Maker returns the answer _and_ any child questions. This allows you to present the child questions as choices. 

## Example conversational context with chat bot

A chat bot manages the conversation, question by question, with the user to determine the final answer.

![Conversation from parent question to possible child questions in bot](../media/conversational-context/conversation-in-bot.png)

In the preceding image, the user's question needs to be refined before returning the answer. In the knowledge base, the question (#1), has four child questions, presented in the chat bot as four choices (#2). 

When the user selects a choice (#3), then the next list of refining choices (#4) is presented. This can continue (#5) until the correct and final answer (#6) is determined.

You need to change your client application to manage the conversational context.

## Metadata filters are applied first, then context is determined

In the knowledge base, a question can link to contextual child questions and have metadata. When a question has both, the metadata filters are applied first, then the child answers are returned. 

## Add question as child prompt to parent question

In the QnA Maker portal, add a child prompt to a question. 

1. In the [QnA Maker](https://http://qnamaker.ai) portal, open your knowledge base. In the **Edit** section, select **Add QnA pair**. 
1. Enter the new question text, `Give feedback.` with an answer of `What kind of feedback do you have?`.

    ![![Enter the new question text, `Give feedback.`](../media/conversational-context/add-parent-question-for-conversation-flow.png)](../media/conversational-context/add-parent-question-for-conversation-flow.png#lightbox)

1. In the **Answer** column for this question, select **Add follow-up prompt**. 
1. The **Follow-up prompt** pop-up dialog allows you to search for an existing question or enter a new question. In this procedure, enter the text `Feedback on an QnA Maker service`, as a new question. 
1. Check **Context-only**. The **Context-only** option indicates that the child prompt will only be returned if given from the context of the parent. For this scenario, the child prompt doesn't make any sense as a stand-alone question, it only makes sense from the context of the parent question.
1. Select **Create new prompt QnA** then select **Save**. This created a new question and linked the question as a child question to the parent question.

    ![Create new prompt QnA](../media/conversational-context/create-child-prompt-from-parent.png)

1. The first child question is available to edit. 

    ![![The child question is available to edit.](../media/conversational-context/child-prompt-created.png)](../media/conversational-context/child-prompt-created.png#lightbox)

1. In the **Answer** column for this question, enter the answer `How would you rate QnA Maker?`. 
    ![![In the Answer column for this question, enter the answer `How would you rate QnA Maker?`. ](../media/conversational-context/add-level-2-answer.png)](../media/conversational-context/add-level-2-answer.png)

1. Select **Add follow-up prompt** for the parent question to add another child prompt to the parent question `Give feedback.` 
1. Create a new question by entering the text `Feedback on an existing feature`. Select **Create new prompt QnA** and check **Context-only**, then select **Save**. This created a new question and linked the question as a child question to the parent question. 
1. Add the answer for this new question `Which feature would you like to give feedback on?`.
    
    At this point, the top question has two prompts (linked child questions).

1. Select **Save and Train** to train the knowledge base. 
1. Select the **Test** pane and enter the question, `Give feedback`. The test result includes the two child questions. 

    ![![Select Test pane and enter the question, `Give feedback`. The test result includes the two child questions.](../media/conversational-context/add-level-2-answer.png)](../media/conversational-context/test-pane-parent-question-prompts-to-child-questions.png#lightbox)

## JSON response for prompts

The QnA Maker _GenerateAnswer_ JSON response includes the child prompts in the `context` property of the first item in the `answers` object. :

```JSON
{
    "answers": [
        {
            "questions": [
                "Give feedback"
            ],
            "answer": "What kind of feedback do you have?",
            "score": 100.0,
            "id": 288,
            "source": "Editorial",
            "metadata": [],
            "context": {
                "isContextOnly": false,
                "prompts": [
                    {
                        "displayOrder": 0,
                        "qnaId": 291,
                        "qna": null,
                        "displayText": "Feedback on an QnA Maker service"
                    },
                    {
                        "displayOrder": 0,
                        "qnaId": 292,
                        "qna": null,
                        "displayText": "Feedback on an existing feature"
                    }
                ]
            }
        }
    ]
}
```

The response gives you enough information to present the prompts with text as the next series of questions in the conversation flow. 

## Prompt order supported in API

The prompt order, returned in the [JSON](#json-response-for-prompts), is supported for editing by the API only. 

## Next steps

> [!div class="nextstepaction"]
> [Migrate a knowledge base](../Tutorials/migrate-knowledge-base.md)