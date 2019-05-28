---
title: Improve your knowledge base - QnA Maker
titleSuffix: Azure Cognitive Services
description: Active learning allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user submissions, to your question and answer pair. You review those suggestions, either adding them to existing questions or rejecting them.
author: diberry
manager: nitinme 
services: cognitive-services
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 05/13/2019
ms.author: diberry
---

# Use active learning to improve your knowledge base

QnA Maker features *active learning*. This capability allows you to improve the quality of your knowledge base by suggesting alternative questions, based on user submissions, to your question and answer pair. You review those suggestions, either adding them to existing questions or rejecting them. 

Your knowledge base doesn't change automatically. You must accept the suggestions for any change to take effect. These suggestions add questions, but don't change or remove existing questions.

## What is active learning?

QnA Maker learns new question variations with implicit and explicit feedback.
 
* **Implicit feedback.** When a user question has multiple answers with scores that are very close, the QnA Maker ranker considers this as feedback. 
* **Explicit feedback.** When the knowledge base returns multiple answers with little variation in scores, the client application asks the user which question is the correct question. The user's explicit feedback is sent to QnA Maker with the Train API. 

Either method provides the ranker with similar queries that are clustered.

## How active learning works

For any specified query, active learning is triggered based on the scores of top few answers returned by QnA Maker. If the score differences lie within a small range, then the query is considered a possible _suggestion_ for each of the possible answers. 

QnA Maker clusters all the suggestions together by similarity. It displays top suggestions for alternate questions, based on the frequency of the particular queries by end users. Active learning gives the best possible suggestions in cases where the endpoints are getting a reasonable quantity and variety of usage queries.

When 5 or more similar queries are clustered, every 30 minutes, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject. You need to review and accept or reject those suggestions. 

## Upgrade your version to use active learning

QnA Maker supports active learning in runtime version 4.4.0 and later. If your knowledge base was created on an earlier version, [upgrade your runtime](troubleshooting-runtime.md#how-to-get-latest-qnamaker-runtime-updates) to use this feature. 

## Score proximity between knowledge base questions

When a question's score is highly confident, such as 80 percent, the range of scores that are considered for active learning are wide, approximately within 10 percent. As the confidence score decreases, such as 40 percent, the range of scores decreases as well, approximately within 4 percent. 

The algorithm to determine proximity is not a simple calculation. The ranges in the preceding examples are not meant to be fixed, but you can use them as a guide to understand the impact of the algorithm.

## Turn on active learning

Active learning is off by default. Turn it on to see suggested questions. 

1. Select **Publish** to publish the knowledge base. Active learning queries are collected from the GenerateAnswer API prediction endpoint only. The queries to the Test pane in the QnA Maker portal don't impact active learning.

1. To turn active learning on, select your **Name**, and go to [**Service Settings**](https://www.qnamaker.ai/UserSettings) in the QnA Maker portal, in the top right corner.  

    ![Screenshot of QnA Maker portal Service Settings](../media/improve-knowledge-base/Endpoint-Keys.png)


1. Find the QnA Maker service, and then toggle to **Active Learning**. 

    [![Screenshot of QnA Maker portal Service Settings](../media/improve-knowledge-base/turn-active-learning-on-at-service-setting.png#lightbox)

    When active learning is enabled, the knowledge base suggests new questions at regular intervals based on user-submitted questions. You can disable active learning by toggling the setting again.

## Add an active learning suggestion to the knowledge base

1. To see the suggested questions, on the **Edit** knowledge base page, select **View Options**. Then select **Show active learning suggestions**. 

    [![Screenshot of Edit section of the portal](../media/improve-knowledge-base/show-suggestions-button.png)](../media/improve-knowledge-base/show-suggestions-button.png#lightbox)

1. Filter the knowledge base with question and answer pairs to show only suggestions, by selecting **Filter by Suggestions**.

    [![Screenshot of Filter by suggestions toggle](../media/improve-knowledge-base/filter-by-suggestions.png)](../media/improve-knowledge-base/filter-by-suggestions.png#lightbox)

1.	Each question section with suggestions shows the new questions with either a check mark, `✔` , to accept the question, or an `x` to reject the suggestions. Select the check mark to add the question. 

    [![Screenshot of selecting or rejecting active learning's suggested question alternatives](../media/improve-knowledge-base/accept-active-learning-suggestions.png)](../media/improve-knowledge-base/accept-active-learning-suggestions.png#lightbox)

    You can add or delete all suggestions by selecting **Add all** or **Reject all**.

1. Select **Save and Train** to save the changes to the knowledge base.

1. Select **Publish** to allow the changes to be available from the GenerateAnswer API.

    When 5 or more similar queries are clustered, every 30 minutes, QnA Maker suggests the user-based questions to the knowledge base designer to accept or reject.

## Ask for clarification

When a question is too close in score to other questions, you can ask QnA Maker for clarification.

### Use the top property in the GenerateAnswer request

When submitting a question to QnA Maker for an answer, you can use the top property of the JSON body, to return more than one top answer:

```json
{
    "question": "wi-fi",
    "isTest": false,
    "top": 3
}
```

In the preceding example, the client application (such as a chat bot) receives a response that includes the top 3 questions:

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

The client application displays all the questions, with an option for the user to select the question that most represents their intention. 

When the user selects one of the existing questions, the client application sends the user's choice as feedback by using QnA Maker's Train API. This feedback completes the active learning feedback loop. 

Use the [Azure Bot sample](https://aka.ms/activelearningsamplebot) to see active learning in an end-to-end scenario.

## Train API

The Train API POST request sends active learning feedback to QnA Maker. The API signature is:

```http
POST https://<QnA-Maker-resource-name>.azurewebsites.net/qnamaker/knowledgebases/<knowledge-base-ID>/train
Authorization: EndpointKey <endpoint-key>
Content-Type: application/json
{"feedbackRecords": [{"userId": "1","userQuestion": "<question-text>","qnaId": 1}]}
```

|HTTP request property|Name|Type|Purpose|
|--|--|--|--|
|URL route parameter|Knowledge base ID|string|The GUID for your knowledge base.|
|Host subdomain|QnAMaker resource name|string|The hostname for your QnA Maker in your Azure subscription. This is available on the **Settings** page after you publish the knowledge base. |
|Header|Content-Type|string|The media type of the body sent to the API. The default value is: `application/json`.|
|Header|Authorization|string|Your endpoint key (EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).|
|Post body|JSON object|JSON|The training feedback.|

The JSON body has several settings:

|JSON body property|Type|Purpose|
|--|--|--|--|
|`feedbackRecords`|array|List of feedback.|
|`userId`|string|The user ID of the person accepting the suggested questions. The user ID format is up to you. For example, an email address can be a valid user ID in your architecture. This property is optional.|
|`userQuestion`|string|Exact text of the question. This property is required.|
|`qnaID`|number|The ID of the question, found in the [GenerateAnswer response](metadata-generateanswer-usage.md#generateanswer-response-properties). |

An example JSON body looks like:

```json
{
    "feedbackRecords": [
        {
            "userId": "1",
            "userQuestion": "<question-text>",
            "qnaId": 1
        }
    ]
}
```

A successful response returns a status of 204, and no JSON response body. 

<a name="active-learning-is-saved-in-the-exported-apps-tsv-file"></a>

## Active learning is saved in the exported knowledge base

When your app has active learning enabled, and you export the app, the `SuggestedQuestions` column in the .tsv file retains the active learning data. 

The `SuggestedQuestions` column is a JSON object of information of implicit, `autosuggested`, and explicit, `usersuggested` feedback. An example of this JSON object for a single user-submitted question of `help` is:

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

For best practices when using active learning, see [Best practices](../Concepts/best-practices.md#active-learning).

> [!div class="nextstepaction"]
> [Use metadata with GenerateAnswer API](metadata-generateanswer-usage.md)
