---
title: Metadata with GenerateAnswer API - QnA Maker
titleSuffix: Azure Cognitive Services
description: QnA Maker lets you add metadata, in the form of key/value pairs, to your question/answer sets. You can filter results to user queries, and store additional information that can be used in follow-up conversations.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 06/17/2019
ms.author: diberry
---

# Get an answer with the GenerateAnswer API and metadata

To get the predicted answer to a user's question, use the GenerateAnswer API. When you publish a knowledge base, you can see information about how to use this API on the **Publish** page. You can also configure the API to filter answers based on metadata tags, and test the knowledge base from the endpoint with the test query string parameter.

QnA Maker lets you add metadata, in the form of key and value pairs, to your sets of questions and answers. You can then use this information to filter results to user queries, and to store additional information that can be used in follow-up conversations. For more information, see [Knowledge base](../Concepts/knowledge-base.md).

<a name="qna-entity"></a>

## Store questions and answers with a QnA entity

It's important to understand how QnA Maker stores the question and answer data. The following illustration shows a QnA entity:

![Illustration of a QnA entity](../media/qnamaker-how-to-metadata-usage/qna-entity.png)

Each QnA entity has a unique and persistent ID. You can use the ID to make updates to a particular QnA entity.

<a name="generateanswer-api"></a>

## Get answer predictions with the GenerateAnswer API

You use the GenerateAnswer API in your bot or application to query your knowledge base with a user question, to get the best match from the question and answer sets.

<a name="generateanswer-endpoint"></a>

## Publish to get GenerateAnswer endpoint 

After you publish your knowledge base, either from the [QnA Maker portal](https://www.qnamaker.ai), or by using the [API](https://go.microsoft.com/fwlink/?linkid=2092179), you can get the details of your GenerateAnswer endpoint.

To get your endpoint details:
1. Sign in to [https://www.qnamaker.ai](https://www.qnamaker.ai).
1. In **My knowledge bases**, select **View Code** for your knowledge base.
    ![Screenshot of My knowledge bases](../media/qnamaker-how-to-metadata-usage/my-knowledge-bases.png)
1. Get your GenerateAnswer endpoint details.

    ![Screenshot of endpoint details](../media/qnamaker-how-to-metadata-usage/view-code.png)

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
|URL route parameter|QnAMaker endpoint host|string|The hostname of the endpoint deployed in your Azure subscription. This is available on the **Settings** page after you publish the knowledge base. |
|Header|Content-Type|string|The media type of the body sent to the API. Default value is: ``|
|Header|Authorization|string|Your endpoint key (EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).|
|Post Body|JSON object|JSON|The question with settings.|


The JSON body has several settings:

|JSON body property|Required|Type|Purpose|
|--|--|--|--|
|`question`|required|string|A user question to be sent to your knowledge base.|
|`top`|optional|integer|The number of ranked results to include in the output. The default value is 1.|
|`userId`|optional|string|A unique ID to identify the user. This ID will be recorded in the chat logs.|
|`scoreThreshold`|optional|integer|Only answers with confidence score above this threshold will be returned. The default value is 0.|
|`isTest`|optional|Boolean|If set to true, returns results from `testkb` Search index instead of published index.|
|`strictFilters`|optional|string|If specified, tells QnA Maker to return only answers that have the specified metadata. Use `none` to indicate response should have no metadata filters. |
|`RankerType`|optional|string|If specified as `QuestionOnly`, tells QnA Maker to search questions only. If not specified, QnA Maker searches questions and answers.

An example JSON body looks like:

```json
{
    "question": "qna maker and luis",
    "top": 6,
    "isTest": true,
    "scoreThreshold": 20,
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
|metadata.value|Metadata value. (string, max Length: 100, required)|


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

## Use QnA Maker with a bot in C#

The bot framework provides access to the QnA Maker's properties:

```csharp
using Microsoft.Bot.Builder.AI.QnA;
var metadata = new Microsoft.Bot.Builder.AI.QnA.Metadata();
var qnaOptions = new QnAMakerOptions();

qnaOptions.Top = Constants.DefaultTop;
qnaOptions.ScoreThreshold = 0.3F;
var response = await _services.QnAServices[QnAMakerKey].GetAnswersAsync(turnContext, qnaOptions);
```

The Support bot has [an example](https://github.com/microsoft/BotBuilder-Samples/blob/master/experimental/qnamaker-support/csharp_dotnetcore/Service/SupportBotService.cs#L418) with this code.

## Use QnA Maker with a bot in Node.js

The bot framework provides access to the QnA Maker's properties:

```javascript
const { QnAMaker } = require('botbuilder-ai');
this.qnaMaker = new QnAMaker(endpoint);

// Default QnAMakerOptions
var qnaMakerOptions = {
    ScoreThreshold: 0.03,
    Top: 3
};
var qnaResults = await this.qnaMaker.getAnswers(stepContext.context, qnaMakerOptions);
```

The Support bot has [an example](https://github.com/microsoft/BotBuilder-Samples/blob/master/experimental/qnamaker-activelearning/javascript_nodejs/Helpers/dialogHelper.js#L36) with this code.

<a name="metadata-example"></a>

## Use metadata to filter answers by custom metadata tags

Adding metadata allows you to filter the answers by these metadata tags. Add the metadata column from the **View Options** menu. Add metadata to your knowledge base by selecting the metadata **+** icon to add a metadata pair. This pair consists of one key and one value.

![Screenshot of adding metadata](../media/qnamaker-how-to-metadata-usage/add-metadata.png)

<a name="filter-results-with-strictfilters-for-metadata-tags"></a>

## Filter results with strictFilters for metadata tags

Consider the user question "When does this hotel close?", where the intent is implied for the restaurant "Paradise."

Because results are required only for the restaurant "Paradise", you can set a filter in the GenerateAnswer call on the metadata "Restaurant Name". The following example shows this:

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

<a name="keep-context"></a>

## Use question and answer results to keep conversation context

The response to the GenerateAnswer contains the corresponding metadata information of the matched question and answer set. You can use this information in your client application to store the context of the previous conversation for use in later conversations. 

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

## Match questions only, by text

By default, QnA Maker searches through questions and answers. If you want to search through questions only, to generate an answer, use the `RankerType=QuestionOnly` in the POST body of the GenerateAnswer request.

You can search through the published kb, using `isTest=false`, or in the test kb using `isTest=true`.

```json
{
  "question": "Hi",
  "top": 30,
  "isTest": true,
  "RankerType":"QuestionOnly"
}
```

## Next steps

The **Publish** page also provides information to generate an answer with [Postman](../Quickstarts/get-answer-from-kb-using-postman.md) and [cURL](../Quickstarts/get-answer-from-kb-using-curl.md). 

> [!div class="nextstepaction"]
> [Create a knowledge base](./create-knowledge-base.md)
