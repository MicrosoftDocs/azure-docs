---
title: Metadata with GenerateAnswer API - QnA Maker
titleSuffix: Azure Cognitive Services
description: QnA Maker lets you add metadata, in the form of key/value pairs, to your question/answer sets. This information can be used to filter results to user queries and to store additional information that can be used in follow-up conversations.
services: cognitive-services
author: tulasim88
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 04/16/2019
ms.author: tulasim
---

# Get a knowledge answer with the GenerateAnswer API and metadata

To get the predicted answer to a user's question, use the GenerateAnswer API. When you publish a knowledge base, this information to use this API is shown on the publish page. You can also configure the API to filter answers based on metadata tags and test the knowledge base from the endpoint with the test query string parameter.

QnA Maker lets you add metadata, in the form of key and value pairs, to your question/answer sets. This information can be used to filter results to user queries and to store additional information that can be used in follow-up conversations. For more information, see [Knowledge base](../Concepts/knowledge-base.md).

<a name="qna-entity"></a>

## Storing questions and answers with a QnA Entity

First it's important to understand how QnA Maker stores the question/answer data. The following illustration shows a QnA entity:

![QnA Entity](../media/qnamaker-how-to-metadata-usage/qna-entity.png)

Each QnA entity has a unique and persistent ID. The ID can be used to make updates to a particular QnA entity.

<a name="generateanswer-api"></a>

## Get answer predictions with the GenerateAnswer API

You use the GenerateAnswer API in your Bot or application to query your knowledge base with a user question to get the best match from the question/answer sets.

<a name="generateanswer-endpoint"></a>

## Publish to get GenerateAnswer endpoint 

Once you publish your knowledge base, either from the [QnA Maker portal](https://www.qnamaker.ai), or using the [API](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff), you can get the details of your GenerateAnswer endpoint.

To get your endpoint details:
1. Sign in to [https://www.qnamaker.ai](https://www.qnamaker.ai).
1. In **My knowledge bases**, click on **View Code** for your knowledge base.
    ![my knowledge bases](../media/qnamaker-how-to-metadata-usage/my-knowledge-bases.png)
1. Get your GenerateAnswer endpoint details.

    ![endpoint details](../media/qnamaker-how-to-metadata-usage/view-code.png)

You can also get your endpoint details from the **Settings** tab of your knowledge base.

<a name="generateanswer-request"></a>

## GenerateAnswer request configuration

You call GenerateAnswer with an HTTP POST request. For sample code that shows how to call GenerateAnswer, see the [quickstarts](../quickstarts/csharp.md).

The **request URL** has the following format: 

```
https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer
```

|HTTP request property|Name|Type|Purpose|
|--|--|--|--|
|URL route parameter|Knowledge base ID|string|The GUID for your knowledge base.|
|URL route parameter|QnAMaker endpoint host|string|The hostname of the endpoint deployed in your Azure subscription. This is available on the Settings page after you publish the knowledge base. |
|Header|Content-Type|string|The media type of the body sent to the API. Default value is: ``|
|Header|Authorization|string|Your endpoint key (EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).|
|Post Body|JSON object|JSON|The question with settings|


The JSON body has several settings:

|JSON body property|Required|Type|Purpose|
|--|--|--|--|
|`question`|required|string|A user question to be sent to your knowledge base.|
|`top`|optional|integer|The number of ranked results to include in the output. The default value is 1.|
|`userId`|optional|string|A unique ID to identify the user. This ID will be recorded in the chat logs.|
|`isTest`|optional|boolean|If set to true, returns results from `testkb` Search index instead of published index.|
|`strictFilters`|optional|string|If specified, tells QnA Maker to return only answers that have the specified metadata. Use `none` to indicate response should have no metadata filters. |

An example JSON body looks like:

```json
{
    "question": "qna maker and luis",
    "top": 6,
    "isTest": true,
    "strictFilters": [
    {
        "name": "category",
        "value": "api"
    }],
    "userId": "sd53lsY="
}
```

<a name="generateanswer-response"></a>

## GenerateAnswer response properties

A successful response returns a status of 200 and a JSON response. 

|Answers property (sorted by score)|Purpose|
|--|--|
|score|A ranking score between 0 and 100.|
|Id|A unique ID assigned to the answer.|
|questions|The questions provided by the user.|
|answer|The answer to the question.|
|source|The name of the source from which the answer was extracted or saved in the knowledge base.|
|metadata|The metadata associated with the answer.|
|metadata.name|Metadata name. (string, max Length: 100, required)|
|metadata.value: Metadata value. (string, max Length: 100, required)|


```json
{
    "answers": [
        {
            "score": 28.54820341616869,
            "Id": 20,
            "answer": "There is no direct integration of LUIS with QnA Maker. But, in your bot code, you can use LUIS and QnA Maker together. [View a sample bot](https://github.com/Microsoft/BotBuilder-CognitiveServices/tree/master/Node/samples/QnAMaker/QnAWithLUIS)",
            "source": "Custom Editorial",
            "questions": [
                "How can I integrate LUIS with QnA Maker?"
            ],
            "metadata": [
                {
                    "name": "category",
                    "value": "api"
                }
            ]
        }
    ]
}
```

<a name="metadata-example"></a>

## Using metadata allows you to filter answers by custom metadata tags

Adding metadata allows you to filter the answers by these metadata tags. Consider the below FAQ data. Add metadata to your knowledge base by clicking on the metadata icon.

![add metadata](../media/qnamaker-how-to-metadata-usage/add-metadata.png)

<a name="filter-results-with-strictfilters-for-metadata-tags"></a>

## Filter results with strictFilters for metadata tags

Consider the user question "When does this hotel close?" where the intent is implied for the restaurant "Paradise."

Since results are required only for the restaurant "Paradise", you can set a filter in the GenerateAnswer call on the metadata "Restaurant Name", as follows.

```json
{
    "question": "When does this hotel close?",
    "top": 1,
    "strictFilters": [
      {
        "name": "restaurant",
        "value": "paradise"
      }]
}
```

<name="keep-context"></a>

## Use question and answer results to keep conversation context

The response to the GenerateAnswer contains the corresponding metadata information of the matched question/answer set. This information can be used in your client application to store the context of the previous conversation for use in later conversations. 

```json
{
    "answers": [
        {
            "questions": [
                "What is the closing time?"
            ],
            "answer": "10.30 PM",
            "score": 100,
            "id": 1,
            "source": "Editorial",
            "metadata": [
                {
                    "name": "restaurant",
                    "value": "paradise"
                },
                {
                    "name": "location",
                    "value": "secunderabad"
                }
            ]
        }
    ]
}
```

## Next steps

The publish page also provides information to generate an answer with [Postman](../Quickstarts/get-answer-from-kb-using-postman.md) and [cURL](../Quickstarts/get-answer-from-kb-using-curl.md). 

> [!div class="nextstepaction"]
> [Create a knowledge base](./create-knowledge-base.md)
