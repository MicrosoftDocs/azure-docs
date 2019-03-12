---
title: Improve knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: 
author: diberry
manager: nitinme 
services: cognitive-services
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 03/05/2019
ms.author: diberry
---

# Use active learning to improve knowledge base

Active learning allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user-submissions, to your question and answer pair. You review those suggestions, either adding them to existing questions or rejecting them. 

Your knowledge base doesn't change automatically. You must accept the suggestions in order for any change to take effect. These suggestions add questions but don't change or remove existing questions.

## Active learning

QnA Maker learns new question variations with implicit and explicit feedback.
 
* Implicit feedback – The ranker understands when a user question has multiple answers with scores that are very close and considers this as feedback. 
* Explicit feedback – When multiple answers with little variation in scores are returned from the knowledge base, the client application asks the user which question is the correct question. The user's explicit feedback is sent to QnA Maker with the Train API. 

Either method provides the ranker with similar queries that are clustered.

## How active learning works

Active learning is triggered based on the scores of top few answers returned by QnA Maker for any given query. If the score differences lie within a small range, then the query is considered a possible _suggestion_ for each of the possible answers. 

All the suggestions are clustered together by similarity and top suggestions for alternate questions are displayed based on the frequency of the particular queries by end users. Active learning gives the best possible suggestions in cases where the endpoints are getting a reasonable quantity and variety of usage queries.

When 5 or more similar queries are clustered, every 30 minutes, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject.

Once questions are suggested in the QnA Maker portal, you need to review and accept or reject those suggestions. 

## Upgrade version to use active learning

Active Learning is supported in runtime version 4.4.0 and above. If your knowledge base was created on an earlier version, [upgrade your runtime](troubleshooting-runtime.md#how-to-get-latest-qnamaker-runtime-updates) to use this feature. 

## Best practices

For best practices when using active learning, see [Best practices](../Concepts/best-practices.md#active-learning).

## Score proximity between knowledge base questions

When a question's score is highly confident, such as 80%, the range of scores that are considered for active learning are wide, approximately within 10%. As the confidence score decreases, such as 40%, the range of scores decreases as well, approximately within 4%. 

The algorithm to determine proximity is not a simple calculation. The ranges in the preceding examples are not meant to be fixed but should be used as a guide to understand the impact of the algorithm only.

## Turn on active learning

Active learning is off by default. Turn it on to see suggested questions. 

1. Select **Publish** to publish the knowledge base. Active learning queries are collected from the GenerateAnswer API prediction endpoint only. The queries to the Test pane in the Qna Maker portal do not impact active learning.

1. To turn active learning on, Click on your **Name**, go to [**Service Settings**](https://www.qnamaker.ai/UserSettings) in the QnA Maker portal, in the top-right corner.  

    ![On the service settings page, toggle on Active learning](../media/improve-knowledge-base/Endpoint-Keys.png)


1. Find the QnA Maker service then toggle **Active Learning**. 

    [![On the service settings page, toggle on Active Learning](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png)](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png#lightbox)

    Once **Active Learning** is enabled, the knowledge suggests new questions at regular intervals based on user-submitted questions. You can disable **Active Learning** by toggling the setting again.

## Add active learning suggestion to knowledge base

1. In order to see the suggested questions, on the **Edit** knowledge base page, select **Show Suggestions**. 

    [![On the service settings page, toggle the Show Suggestions button](../media/improve-knowledge-base/show-suggestions-button.png)](../media/improve-knowledge-base/show-suggestions-button.png#lightbox)

1. Filter the knowledge base with question and answer pairs to show only suggestions by selecting **Filter by Suggestions**.

    [![On the service settings page, filter by suggestions to see just those question/answer pairs](../media/improve-knowledge-base/filter-by-suggestions.png)](../media/improve-knowledge-base/filter-by-suggestions.png#lightbox)

1.	Each question section with suggestions shows the new questions with a check mark, `✔` , to accept the question or an `x` to reject the suggestions. Select the check mark to add the question. 

    [![On the service settings page, toggle on Active Learning](../media/improve-knowledge-base/accept-active-learning-suggestions.png)](../media/improve-knowledge-base/accept-active-learning-suggestions.png#lightbox)

    You can add or delete _all suggestions_ by selecting **Add all** or **Reject all**.

1. Select **Save and Train** to save the changes to the knowledge base.

1. Select **Publish** to allow the changes to be available from the GenerateAnswer API.

    When 5 or more similar queries are clustered, every 30 minutes, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject.

## Determine best choice when several questions have similar scores

When a question is too close in score to other questions, the client-application developer can choose to ask for clarification.

### Use the top property in the GenerateAnswer request

When submitting a question to QnA Maker for an answer, part of the JSON body allows for returning more than one top answer:

```json
{
    "question": "wi-fi",
    "isTest": false,
    "top": 3
}
```

When the client application (such as a chat bot) receives the response, the top 3 questions are returned:

```json
{
    "answers": [
        {
            "questions": [
                "Wi-Fi Direct Status Indicator"
            ],
            "answer": "**Wi-Fi Direct Status Indicator**\n\nStatus bar icons indicate your current Wi-Fi Direct connection status:  \n\nWhen your device is connected to another device using Wi-Fi Direct, '$  \n\n+ •+ ' Wi-Fi Direct is displayed in the Status bar.",
            "score": 74.21,
            "id": 607,
            "source": "Bugbash KB.pdf",
            "metadata": []
        },
        {
            "questions": [
                "Wi-Fi - Connections"
            ],
            "answer": "**Wi-Fi**\n\nWi-Fi is a term used for certain types of Wireless Local Area Networks (WLAN). Wi-Fi communication requires access to a wireless Access Point (AP).",
            "score": 74.15,
            "id": 599,
            "source": "Bugbash KB.pdf",
            "metadata": []
        },
        {
            "questions": [
                "Turn Wi-Fi On or Off"
            ],
            "answer": "**Turn Wi-Fi On or Off**\n\nTurning Wi-Fi on makes your device able to discover and connect to compatible in-range wireless APs.  \n\n1.  From a Home screen, tap ::: Apps > e Settings .\n2.  Tap Connections > Wi-Fi , and then tap On/Off to turn Wi-Fi on or off.",
            "score": 69.99,
            "id": 600,
            "source": "Bugbash KB.pdf",
            "metadata": []
        }
    ]
}
```

### Client application follow-up when questions have similar scores

The client application displays all the questions with an option for the user to select the question that most represents their intention. 

Once user selects one of the existing questions. The user feedback is sent to QnA Maker's [Train](https://www.aka.ms/activelearningsamplebot) API to continue the active learning feedback loop. 

```http
POST https://<QnA-Maker-resource-name>.azurewebsites.net/qnamaker/knowledgebases/<knowledge-base-ID>/train
Authorization: EndpointKey <endpoint-key>
Content-Type: application/json
{"feedbackRecords": [{"userId": "1","userQuestion": "<question-text>","qnaId": 1}]}
```

Learn more about how to use active learning with an [Azure Bot C# example](https://github.com/Microsoft/BotBuilder-Samples/tree/master/experimental/csharp_dotnetcore/qnamaker-activelearning-bot)

## Active learning is saved in the exported app's tsv file

When your app has active learning enabled, and you export the app, the `SuggestedQuestions` column in the tsv file retains the active learning data. 

The `SuggestedQuestions` column is a JSON object of information of implicit (`autosuggested`) and explicit (`usersuggested`) [feedback](#active-learning). An example of this JSON object for a single user-submitted question of `help` is:

```JSON
[
    {
        "clusterHead": "help",
        "totalAutoSuggestedCount": 1,
        "totalUserSuggestedCount": 0,
        "alternateQuestionList": [
            {
                "question": "help",
                "autoSuggestedCount": 1,
                "userSuggestedCount": 0
            }
        ]
    }
]
```

When you reimport this app, the active learning continues to collect information and recommend suggestions for your knowledge base. 

## Next steps
 
> [!div class="nextstepaction"]
> [Use QnA Maker API](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
