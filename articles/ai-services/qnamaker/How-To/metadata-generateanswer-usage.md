---
title: Metadata with GenerateAnswer API - QnA Maker
titleSuffix: Azure AI services
description: QnA Maker lets you add metadata, in the form of key/value pairs, to your question/answer pairs. You can filter results to user queries, and store additional information that can be used in follow-up conversations.
#services: cognitive-services
manager: nitinme
ms.author: jboback
author: jboback
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: devx-track-js, devx-track-csharp, ignite-fall-2021
---

# Get an answer with the GenerateAnswer API

To get the predicted answer to a user's question, use the GenerateAnswer API. When you publish a knowledge base, you can see information about how to use this API on the **Publish** page. You can also configure the API to filter answers based on metadata tags, and test the knowledge base from the endpoint with the test query string parameter.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

<a name="generateanswer-api"></a>

## Get answer predictions with the GenerateAnswer API

You use the [GenerateAnswer API](/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer) in your bot or application to query your knowledge base with a user question, to get the best match from the question and answer pairs.

> [!NOTE]
> This documentation does not apply to the latest release. To learn about using the latest question answering APIs consult the [question answering quickstart guide](../../language-service/question-answering/quickstart/sdk.md).

<a name="generateanswer-endpoint"></a>

## Publish to get GenerateAnswer endpoint

After you publish your knowledge base, either from the [QnA Maker portal](https://www.qnamaker.ai), or by using the [API](/rest/api/cognitiveservices/qnamaker/knowledgebase/publish), you can get the details of your GenerateAnswer endpoint.

To get your endpoint details:
1. Sign in to [https://www.qnamaker.ai](https://www.qnamaker.ai).
1. In **My knowledge bases**, select **View Code** for your knowledge base.
    ![Screenshot of My knowledge bases](../media/qnamaker-how-to-metadata-usage/my-knowledge-bases.png)
1. Get your GenerateAnswer endpoint details.

    ![Screenshot of endpoint details](../media/qnamaker-how-to-metadata-usage/view-code.png)

You can also get your endpoint details from the **Settings** tab of your knowledge base.

<a name="generateanswer-request"></a>

## GenerateAnswer request configuration

You call GenerateAnswer with an HTTP POST request. For sample code that shows how to call GenerateAnswer, see the [quickstarts](../quickstarts/quickstart-sdk.md#generate-an-answer-from-the-knowledge-base).

The POST request uses:

* Required [URI parameters](/rest/api/cognitiveservices/qnamakerruntime/runtime/train#uri-parameters)
* Required header property, `Authorization`, for security
* Required [body properties](/rest/api/cognitiveservices/qnamakerruntime/runtime/train#feedbackrecorddto).

The GenerateAnswer URL has the following format:

```
https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer
```

Remember to set the HTTP header property of `Authorization` with a value of the string `EndpointKey` with a trailing space then the endpoint key found on the **Settings** page.

An example JSON body looks like:

```json
{
    "question": "qna maker and luis",
    "top": 6,
    "isTest": true,
    "scoreThreshold": 30,
    "rankerType": "" // values: QuestionOnly
    "strictFilters": [
    {
        "name": "category",
        "value": "api"
    }],
    "userId": "sd53lsY="
}
```

Learn more about [rankerType](../concepts/best-practices.md#choosing-ranker-type).

The previous JSON requested only answers that are at 30% or above the threshold score.

<a name="generateanswer-response"></a>

## GenerateAnswer response properties

The [response](/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer#successful-query) is a JSON object including all the information you need to display the answer and the next turn in the conversation, if available.

```json
{
    "answers": [
        {
            "score": 38.54820341616869,
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

The previous JSON responded with an answer with a score of 38.5%.

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
## Use QnA Maker with a bot in C#

The bot framework provides access to the QnA Maker's properties with the [getAnswer API](/dotnet/api/microsoft.bot.builder.ai.qna.qnamaker.getanswersasync#Microsoft_Bot_Builder_AI_QnA_QnAMaker_GetAnswersAsync_Microsoft_Bot_Builder_ITurnContext_Microsoft_Bot_Builder_AI_QnA_QnAMakerOptions_System_Collections_Generic_Dictionary_System_String_System_String__System_Collections_Generic_Dictionary_System_String_System_Double__):

```csharp
using Microsoft.Bot.Builder.AI.QnA;
var metadata = new Microsoft.Bot.Builder.AI.QnA.Metadata();
var qnaOptions = new QnAMakerOptions();

metadata.Name = Constants.MetadataName.Intent;
metadata.Value = topIntent;
qnaOptions.StrictFilters = new Microsoft.Bot.Builder.AI.QnA.Metadata[] { metadata };
qnaOptions.Top = Constants.DefaultTop;
qnaOptions.ScoreThreshold = 0.3F;
var response = await _services.QnAServices[QnAMakerKey].GetAnswersAsync(turnContext, qnaOptions);
```

The previous JSON requested only answers that are at 30% or above the threshold score.

## Use QnA Maker with a bot in Node.js

The bot framework provides access to the QnA Maker's properties with the [getAnswer API](/javascript/api/botbuilder-ai/qnamaker?preserve-view=true&view=botbuilder-ts-latest#generateanswer-string---undefined--number--number-):

```javascript
const { QnAMaker } = require('botbuilder-ai');
this.qnaMaker = new QnAMaker(endpoint);

// Default QnAMakerOptions
var qnaMakerOptions = {
    ScoreThreshold: 0.30,
    Top: 3
};
var qnaResults = await this.qnaMaker.getAnswers(stepContext.context, qnaMakerOptions);
```

The previous JSON requested only answers that are at 30% or above the threshold score.

## Get precise answers with GenerateAnswer API

We offer precise answer feature only with the QnA Maker managed version.

## Common HTTP errors

|Code|Explanation|
|:--|--|
|2xx|Success|
|400|Request's parameters are incorrect meaning the required parameters are missing, malformed, or too large|
|400|Request's body is incorrect meaning the JSON is missing, malformed, or too large|
|401|Invalid key|
|403|Forbidden - you do not have correct permissions|
|404|KB doesn't exist|
|410|This API is deprecated and is no longer available|

## Next steps

The **Publish** page also provides information to [generate an answer](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md) with Postman or cURL.

> [!div class="nextstepaction"]
> [Get analytics on your knowledge base](../how-to/get-analytics-knowledge-base.md)
> [!div class="nextstepaction"]
> [Confidence score](../concepts/confidence-score.md)
