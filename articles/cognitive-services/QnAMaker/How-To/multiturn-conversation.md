---
title: Multi-turn conversations
titleSuffix: Azure Cognitive Services
description: Use prompts and context to manage the multiple turns, known as multi-turn, for your bot from one question to another. Multi-turn is the ability to have a back and forth conversation where the previous question's context influences the next question and answer.
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

# Use follow-up prompts to create multiple turns of a conversation

Use follow-up prompts and context to manage the multiple turns, known as _multi-turn_, for your bot from one question to another.

Learn from the [demonstration video](https://aka.ms/multiturnexample).

## What is a multi-turn conversation?

Some types of conversation can't be completed in a single turn. When you design your client application (chat bot) conversations, a user may ask a question that needs to be filtered or refined in order to determine the correct answer. This flow through the questions is possible by presenting the user with **follow-up prompts**.

When the user asks the question, QnA Maker returns the answer _and_ any follow-up prompts. This allows you to present the follow-up questions as choices. 

## Example multi-turn conversation with chat bot

A chat bot manages the conversation, question by question, with the user to determine the final answer.

![Within the conversational flow, manage conversation state in a multi-turn dialog system by providing prompts within the answers presented as options to continue the conversation.](../media/conversational-context/conversation-in-bot.png)

In the preceding image, the user's question needs to be refined before returning the answer. In the knowledge base, the question (#1), has four follow-up prompts, presented in the chat bot as four choices (#2). 

When the user selects a choice (#3), then the next list of refining choices (#4) is presented. This can continue (#5) until the correct and final answer (#6) is determined.

You need to change your client application to manage the contextual conversation.

## Create a multi-turn conversation from document's structure

If you import a document, the multi-turn conversation can be implied from the structure. If that structure exists, QnA Maker creates the follow-up prompt QnA pairs for you. 

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

1. In the **Answer** column for this question, select **Add follow-up prompt**. 
1. The **Follow-up prompt** pop-up dialog allows you to search for an existing question or enter a new question. In this procedure, enter the text `Feedback on an QnA Maker service`, for the **Display text**. 
1. Check **Context-only**. The **Context-only** option indicates that this user text will be understood _only_ if given in response to the previous question. For this scenario, the prompt text doesn't make any sense as a stand-alone question, it only makes sense from the context of the previous question.
1. In the **Link to answer** text box, enter the answer, `How would you rate QnA Maker?`.
1. Select **Create new** then select **Save**. 

    ![Create new prompt QnA](../media/conversational-context/create-child-prompt-from-parent.png)

    This created a new question-and-answer pair and linked the selected question as a follow-up prompt. The **Context** column, for both questions, indicate a follow-up prompt relationship. 

    ![![The Context column, for both questions, indicates a follow-up prompt relationship.](../media/conversational-context/child-prompt-created.png)](../media/conversational-context/child-prompt-created.png#lightbox)

1. Select **Add follow-up prompt** for the `Give feedback` question to add another follow-up prompt. 
1. Create a new question by entering  `Feedback on an existing feature`, with the answer `Which feature would you like to give feedback on?`.  

1.  Check **Context-only**. The **Context-only** option indicates that this user text will be understood _only_ if given in response to the previous question. For this scenario, the prompt text doesn't make any sense as a stand-alone question, it only makes sense from the context of the previous question.
1.  Select **Save**. 

    This created a new question and linked the question as a follow-up prompt question to the `Give feedback` question.
    
    At this point, the top question has two follow-up prompts liked to the previous question, `Give feedback`.

    ![![At this point, the top question has two follow-up prompts liked to the previous question, `Give feedback`.](../media/conversational-context/all-child-prompts-created.png)](../media/conversational-context/all-child-prompts-created.png#lightbox)

1. Select **Save and Train** to train the knowledge base with the new questions. 

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

## JSON request to return initial answer and follow-up prompts

Use the empty `context` object to request the answer to the user's question and include follow-up prompts. 

```JSON
{
  "question": "accounts and signing in",
  "top": 30,
  "userId": "Default",
  "isTest": false,
  "context": {}
}
```

## JSON response to return initial answer and follow-up prompts

The previous section requested an answer and any follow-up prompts to `Accounts and signing in`. The response includes the prompt information, located at `answers[0].context`, include the text to display to the user. 

```JSON
{
    "answers": [
        {
            "questions": [
                "Accounts and signing in"
            ],
            "answer": "**Accounts and signing in**\n\nWhen you set up your Surface, an account is set up for you. You can create additional accounts later for family and friends, so each person using your Surface can set it up just the way he or she likes. For more info, see All about accounts on Surface.com. \n\nThere are several ways to sign in to your Surface Pro 4: ",
            "score": 86.96,
            "id": 37,
            "source": "surface-pro-4-user-guide-EN .pdf",
            "metadata": [],
            "context": {
                "isContextOnly": true,
                "prompts": [
                    {
                        "displayOrder": 0,
                        "qnaId": 38,
                        "qna": null,
                        "displayText": "Use the sign-in screen"
                    },
                    {
                        "displayOrder": 1,
                        "qnaId": 39,
                        "qna": null,
                        "displayText": "Use Windows Hello to sign in"
                    },
                    {
                        "displayOrder": 2,
                        "qnaId": 40,
                        "qna": null,
                        "displayText": "Sign out"
                    }
                ]
            }
        },
        {
            "questions": [
                "Use the sign-in screen"
            ],
            "answer": "**Use the sign-in screen**\n\n1.  \n\nTurn on or wake your Surface by pressing the power button. \n\n2.  \n\nSwipe up on the screen or tap a key on the keyboard. \n\n3.  \n\nIf you see your account name and account picture, enter your password and select the right arrow or press Enter on your keyboard. \n\n4.  \n\nIf you see a different account name, select your own account from the list at the left. Then enter your password and select the right arrow or press Enter on your keyboard. ",
            "score": 32.27,
            "id": 38,
            "source": "surface-pro-4-user-guide-EN .pdf",
            "metadata": [],
            "context": {
                "isContextOnly": true,
                "prompts": []
            }
        },
        {
            "questions": [
                "Sign out"
            ],
            "answer": "**Sign out**\n\nHere's how to sign out: \n\n Go to Start , and right-click your name. Then select Sign out. ",
            "score": 27.0,
            "id": 40,
            "source": "surface-pro-4-user-guide-EN .pdf",
            "metadata": [],
            "context": {
                "isContextOnly": true,
                "prompts": []
            }
        }
    ],
    "debugInfo": null
}
```

The `prompts` array provides text in the `displayText` property and the `qnaId` value so you can show these answers as the next displayed choices in the conversation flow. 

## JSON request to return non-initial answer and follow-up prompts

Fill the `context` object to include previous context.

In the following JSON request, the current question is `Use Windows Hello to sign in` and the previous question was `Accounts and signing in`. 

```JSON
{
  "question": "Use Windows Hello to sign in",
  "top": 30,
  "userId": "Default",
  "isTest": false,
  "qnaId": 39,
  "context": {
    "previousQnAId": 37,
    "previousUserQuery": "accounts and signing in"
  }
}
``` 

##  JSON response to return non-initial answer and follow-up prompts

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
                "isContextOnly": true,
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

## Prompt order supported in API

The prompt order, returned in the JSON response, is supported for editing by the API only. 

## Next steps

Learn more about contextual conversations from the [Dialog sample](https://aka.ms/qnamakermultiturnsample) or learn more [conceptual bot design for multi-turn conversations](https://docs.microsoft.com/azure/bot-service/bot-builder-conversations?view=azure-bot-service-4.0).

> [!div class="nextstepaction"]
> [Migrate a knowledge base](../Tutorials/migrate-knowledge-base.md)
