---
title: Contextual conversation
titleSuffix: Azure Cognitive Services
description: Use question & answer prompts to manage the conversation state. This is the ability to manage a question within the context of questions asked before and after that question. When you design your chat bot flow, a user asks a question that needs to be refined in order to determine the correct answer.
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

# Create contextual conversations using follow-up prompts

Use prompts and context to manage the conversational flow for your bot from one question to another.

## What is a contextual conversation?

Contextual conversation is the ability to have a back and forth conversation where the previous question's context influences the next question and answer. 

When you design your client application (chat bot) conversations, a user may ask a question that needs to be filtered or refined in order to determine the correct answer. This flow through the questions is possible by presenting the user with follow-up prompts.

When the user asks the question, QnA Maker returns the answer _and_ any follow-up prompts. This allows you to present the follow-up questions as choices. 

## Example contextual conversation with chat bot

A chat bot manages the conversation, question by question, with the user to determine the final answer.

![Within the conversational flow, manage conversation state in a multi-turn dialog system by providing prompts within the answers presented as options to continue the conversation.](../media/conversational-context/conversation-in-bot.png)

In the preceding image, the user's question needs to be refined before returning the answer. In the knowledge base, the question (#1), has four follow-up prompts, presented in the chat bot as four choices (#2). 

When the user selects a choice (#3), then the next list of refining choices (#4) is presented. This can continue (#5) until the correct and final answer (#6) is determined.

You need to change your client application to manage the contextual conversation.

## Create contextual conversation from document's structure

If you import a document, contextual conversation can be implied from the structure. If that structure exists, QnA Maker creates the follow-up prompt QnA pairs for you. 

The following image of a Microsoft Surface [PDF file](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/data-source-formats/product-manual.pdf) is meant to be used as a manual. 

![![If you import a document, contextual conversation can be implied from the structure. If that structure exists, QnA Maker creates the follow-up prompt QnA pairs for you, as part of the document import.](../media/conversational-context/import-file-with-conversational-structure.png)](../media/conversational-context/import-file-with-conversational-structure.png#lightbox)

When importing the PDF document, QnA Maker determines follow-up prompts from the structure to create conversational flow. 

![![When importing the PDF document, QnA Maker determines follow-up prompts from the structure to create conversational flow. ](../media/conversational-context/surface-manual-pdf-follow-up-prompt.png)](../media/conversational-context/surface-manual-pdf-follow-up-prompt.png#lightbox)



## Filter questions and answers by context

1. Reduce the question and answer pairs displayed to just those with contextual conversations. Select **View options**, then select **Show context (PREVIEW)**. The list will be empty until you add the first question and answer pair with a follow-up prompt. 

    ![Filter question and answer pairs by contextual conversations](../media/conversational-context/filter-question-and-answers-by-context.png)

## Add new QnA pair as follow-up prompt

1. Select **Add QnA pair**. 
1. Enter the new question text, `Give feedback.` with an answer of `What kind of feedback do you have?`.

    ![![Enter the new conversational state follow-up prompt question text, `Give feedback.`](../media/conversational-context/add-parent-question-for-conversation-flow.png)](../media/conversational-context/add-parent-question-for-conversation-flow.png#lightbox)

1. In the **Answer** column for this question, select **Add follow-up prompt**. 
1. The **Follow-up prompt** pop-up dialog allows you to search for an existing question or enter a new question. In this procedure, enter the text `Feedback on an QnA Maker service`, as a new question. 
1. Check **Context-only**. The **Context-only** option indicates that this user text will be understood only if given in response to the previous question. For this scenario, the prompt text doesn't make any sense as a stand-alone question, it only makes sense from the context of the previous question.
1. Select **Create new prompt QnA** then select **Save**. This created a new question-and-answer pair and linked the selected question as a follow-up prompt.

    ![Create new prompt QnA](../media/conversational-context/create-child-prompt-from-parent.png)

1. The first follow-up prompt question text is available to edit. 

    ![![The follow-up prompt question is available to edit.](../media/conversational-context/child-prompt-created.png)](../media/conversational-context/child-prompt-created.png#lightbox)

1. In the **Answer** column for this follow-up question, enter the answer `How would you rate QnA Maker?`. 
    ![![In the Answer column for this question, enter the answer `How would you rate QnA Maker?`. ](../media/conversational-context/add-level-2-answer.png)](../media/conversational-context/add-level-2-answer.png)

1. Select **Add follow-up prompt** for the `Give feedback` question to add another follow-up prompt. 
1. Create a new question by entering the text `Feedback on an existing feature`. Select **Create new prompt QnA** and check **Context-only**, then select **Save**. This created a new question and linked the question as a follow-up prompt question to the `Give feedback` question. 
1. Add the answer for this new question `Which feature would you like to give feedback on?`.
    
    At this point, the top question has two follow-up prompts liked to the previous question, `Give feedback`.

1. Select **Save and Train** to train the knowledge base. 

## Add existing QnA pair as follow-up prompt

1. If you want to link an existing QnA pair as a follow-up prompt, select the row for the question and answer pair.
1. Select **Add follow-up prompt** in that row.
1. In the pop-up dialog, enter the question text in the search box. All matches are returned. Select the question you want as the follow-up, and check **Context-only**, then select **Save**. 

    Once ou have added the follow-up prompt, remember to select **Save and train**.
  
## Add metadata to follow-up prompts 

In the knowledge base, when a question-and-answer pair is linked to follow-up prompts, the metadata filters are applied first, then the follow-ups are returned.

1. For the two follow-up QnA pairs, add metadata to each one:

    |Question|Add metadata|
    |--|--|
    |`Feedback on an QnA Maker service`|"Feature":"all"|
    |`Feedback on an existing feature`|"Feature":"one"|
    
    ![Add metadata to follow-up prompt so it can be filtered in conversation response from service](../media/conversational-context/add-metadata-feature-to-follow-up-prompt.png) 

1. Save and train. 

    When you send the question `Give feedback` with the metadata filter `Feature` with a value of `all`, only the QnA pair with that metadata will be returned. Both QnA pairs are not returned because they both do not match the filter. 

## Test the QnA set to get all the follow-up prompts

When testing the question with follow-up prompts in the **Test** pane, the response includes the follow-up prompts.

![When testing the question in the Test pane, the response includes the follow-up prompts.](../media/conversational-context/test-pane-with-question-having-follow-up-prompts.png)

## JSON response for prompts

The QnA Maker _GenerateAnswer_ JSON response includes the follow-up prompts in the `context` property of the first item in the `answers` object:

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

The `prompts` array provides text in the `displayText` property and the `qnaId` value so you can show these answers as the next displayed choices in the conversation flow. 

## Prompt order supported in API

The prompt order, returned in the [JSON](#json-response-for-prompts) response, is supported for editing by the API only. 

## Next steps

Learn more about contextual conversations from the [Dialog sample](https://aka.ms/qnamakermultiturnsample).

> [!div class="nextstepaction"]
> [Migrate a knowledge base](../Tutorials/migrate-knowledge-base.md)
