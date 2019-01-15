---
title: Improve knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: 
author: diberry
manager: cgronlun
displayName: active learning, suggestion, dialog prompt, train api, feedback loop, autolearn, auto-learn, user setting, service setting, services setting
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 01/18/2019
ms.author: diberry
---

# Improve your knowledge base with Active Learning

Active learning allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user-submissions, to your question and answer pair. You review those suggestions, either adding them to existing questions or rejecting them. 

Your knowledge base doesn't change automatically. You must accept the suggestions in order for any change to take effect. These suggestions add questions but don't change or remove existing questions.

## Active Learning

QnA Maker learns new question variations in two possible ways.
 
* Auto learning – The ranker understands when a user question has multiple answers with scores which are very close and considers that as feedback. 
* Train API – When multiple answers with little variation in scores are returned from the knowledge base, the client application can ask the user which question is the correct question. When the user selects the correct question, the user feedback is sent to QnA Maker with the Train API. 

Either method provides the ranker with similar queries that are clustered.

When similar queries are clustered, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject.

## Best practices

For best practices when using active learning, see [Best practices](../Concepts/best-practices.md#active-learning).

## Score proximity between knowledge base questions

When a question's score is highly confident, such as 80%, the range of scores that are considered for active learning are wide, approximately within 10%. As the confidence score decreases, such as 40%, the range of scores descreases as well, approximately within 4%. 

The algorithm to determine proximity is not a simple calculation. The ranges in the preceding examples are not meant to be fixed but should be used as a guide to understand the impact of the algorithm only.

## Turn on active learning

1. To turn active learning on, go to your **Service Settings** in the QnA Maker portal, in the top-right corner.  

    ![On the service settings page, toggle on Active Learning](../media/improve-knowledge-base/Endpoint-Keys.png)


1. Find the QnA Maker service then toggle **Active Learning**. 

    [![On the service settings page, toggle on Active Learning](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png)](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png#lightbox)

    Once **Active Learning** is enabled, the knowledge suggests new questions at regular intervals based on user-submitted questions. You can disable **Active Learning** by toggling the setting again.

## Add active learning suggestion to knowledge base

1. On the **Edit** knowledge base page, select **Filter by Suggestions** to see the suggested questions.
    

1.	Each question section with suggestions shows the new questions with a check mark to accept the question or an x mark to reject the suggestions. Select the check mark to add the question. 

    [![On the service settings page, toggle on Active Learning](../media/improve-knowledge-base/accept-active-learning-suggestions.png)](../media/improve-knowledge-base/accept-active-learning-suggestions.png#lightbox)

    You can add or delete _all suggestions_ by selecting **Add all** or **Reject all**.

1. Select **Save and Train** to save the changes to the knowledge base.

<!--
## Determine best choice when several questions have similar scores

When a question is too close in score to other questions, the client-application developer can choose to ask for clarification.

### Use the top property in the GenerateAnswer request

When submitting a question to QnA Maker for an answer, part of the JSON body allows for returning more than one top answer:

```json
{"question":"Use speed dial","top":3}
```

When the client application (such as a chat bot) receives the response, the top 3 questions are returned:

```json
{
    "answers": [
        {
            "questions": [
                "Make a Call with Speed Dial"
            ],
            "answer": "**Make a Call with Speed Dial**\\n\\nYou can make a call using Speed dial.  \\n\\n1.  From a Home screen, tap Phone .Tap Keypad if the keypad is not displayed. •\\n2.  Touch and hold the Speed dial number. •  \\n\\nIf the Speed dial number is more than one digit long, enter the first digits, and then hold the last digit.",
            "score": 65.18,
            "id": 94,
            "source": "f530c768-2b21-4be9-a43b-8ed148b35fe5-KB.tsv",
            "metadata": []
        },
        {
            "questions": [
                "Create a Speed Dial"
            ],
            "answer": "**Create a Speed Dial**\\n\\nYou can assign 999 speed dial numbers.  \\n\\n1.  From a Home screen, tap Phone .Tap Keypad if the keypad is not displayed.\\n2.  Tap More options • > Speed dial . The Speed dial screen displays the numbers already in use.\\n3.  Tap an unassigned number.\\n\\n    *   Tap Menu to select a different Speed dial number than the next one in sequence.\\n    *   Number1 is reserved for Voicemail.\\n4.  Type in a name or number, or tap Add from Contacts to assign a contact to the number.",
            "score": 53.26,
            "id": 93,
            "source": "f530c768-2b21-4be9-a43b-8ed148b35fe5-KB.tsv",
            "metadata": []
        },
        {
            "questions": [
                "Speed Dial - Calling"
            ],
            "answer": "**Speed Dial**\\n\\nYou can assign a shortcut number to a contact for speed dialing their default number.",
            "score": 45.53,
            "id": 92,
            "source": "f530c768-2b21-4be9-a43b-8ed148b35fe5-KB.tsv",
            "metadata": []
        }
    ]
}
```

### Client application followup when questions have similar scores

The client application developer chooses how far apart the question scores need to be to present a follow-up question. The follow-up question presents all the questions with an option for the user to select the question that most represents their intention. 

The user selects one of the existing questions. The selected question should be sent to the Train API to continue the active learning feedback loop. 

```http
POST https://<QnA-Maker-resource-name>.azurewebsites.net/qnamaker/knowledgebases/<knowledge-base-ID>/train
Authorization: EndpointKey <endpoint-key>
Content-Type: application/json
{"feedbackRecords": [{"userId": "1","userQuestion": "<question-text>","qnaId": 1}]}
```
-->
## Next Steps
 
> [!div class="nextstepaction"]
> [Use QnAMaker API](./upgrade-qnamaker-service.md)
