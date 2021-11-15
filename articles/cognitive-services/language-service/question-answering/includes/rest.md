---
title: "Quickstart: Use cURL & REST to manage knowledge base - custom question answering"
description: This quickstart shows you how to create, publish, and query your knowledge base using the REST APIs.
ms.date: 11/02/2021
ms.topic: include
ms.custom: ignite-fall-2021
---
## Prerequisites

* The current version of [cURL](https://curl.haxx.se/). Several command-line switches are used in the quickstarts, which are noted in the [cURL documentation](https://curl.haxx.se/docs/manpage.html).
* Custom question and answering requires a [language resource](../../../qnamaker/how-to/set-up-qnamaker-service-azure.md?tabs=v2#create-a-new-qna-maker-service) with the custom question answering feature enabled to generate an API key and endpoint. The **Name** you chose when creating your resource is used as the subdomain for your endpoint. To retrieve the key and your resource name, select **Quickstart** for your resource in the Azure portal. The resource name is the first subdomain of the endpoint URL: <!--TODO: Change link-->

    `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2`

> [!CAUTION]
> The following BASH examples use the `\` line continuation character. If you console or terminal uses a different line continuation character, use this character.

## Create a knowledge base

To create a knowledge base with the REST APIs and cURL, you need to have the following information:

|Information|cURL configuration|Purpose|
|--|--|--|
|Language resource name (Custom question answering feature enabled)|URL|used to construct URL|
|Language resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to language service|
|JSON describing knowledge base|`-d` param|[Examples](/rest/api/cognitiveservices/qnamaker/knowledgebase/create#examples) of JSON|
|Size of the JSON in bytes|`-h` param for `Content-Size` header||

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/create \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-H "Content-Size:107" \
-d '{ name: "QnA Maker FAQ",urls: [ "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs"]}'
```

The cURL response from custom question answering includes the `operationId` , which is required to [get status of the operation](#get-status-of-operation).

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2020-02-27T04:11:22Z",
  "lastActionTimestamp": "2020-02-27T04:11:22Z",
  "userId": "9596077b3e0441eb93d5080d6a15c64b",
  "operationId": "95a4f700-9899-4c98-bda8-5449af9faef8"
}
```

## Get status of operation

When you create a knowledge base, because the operation is async, the response includes information to determine the status.

|Information|cURL configuration|Purpose|
|--|--|--|
|Language resource name (Custom question answering feature enabled)|URL|used to construct URL|
|Operation Id|URL route|`/operations/REPLACE-WITH-YOUR-OPERATION-ID`|
|Language resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to Language service|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and operation ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/operations/REPLACE-WITH-YOUR-OPERATION-ID \
-X GET \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY"
```

The cURL response includes the status. If the operation state is succeeded, then the `resourceLocation` includes the knowledge base ID.

```json
{
   "operationState": "Succeeded",
   "createdTimestamp": "2020-02-27T04:54:07Z",
   "lastActionTimestamp": "2020-02-27T04:54:19Z",
   "resourceLocation": "/knowledgebases/fe3971b7-cfaa-41fa-8d9f-6ceb673eb865",
   "userId": "f596077b3e0441eb93d5080d6a15c64b",
   "operationId": "f293f218-d080-48f0-a766-47993e9b26a8"
}
```

## Publish knowledge base

Before you query the knowledge base, you need to Publish the knowledge base.

|Information|cURL configuration|Purpose|
|--|--|--|
|Language resource name (Custom question answering feature enabled)|URL|used to construct URL|
|Language resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to language service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID \
-v \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
--data-raw ''
```

The response status is 204 with no results. Use the `-v` command-line parameter to see verbose output for the cURL command. This will include the HTTP status.

## Query for answer from published knowledge base

|Information|cURL configuration|Purpose|
|--|--|--|
|Language resource name (Custom question answering feature enabled)|URL|used to construct URL|
|Language resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to language service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|
|JSON describing query|`-d` param|[Request body parameters](/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer#request-body) and [examples](/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer#examples) of JSON|
|Size of the JSON in bytes|`-h` param for `Content-Size` header||

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID/generateAnswer \
-X POST \
-H "Content-Type:application/json" \
-H "Content-Size:159" \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY"
-d '{"question": "How are QnA Maker and LUIS used together?","top": 6,"isTest": true,  "scoreThreshold": 20, "strictFilters": [], "userId": "sd53lsY="}'
```

A successful response includes the top answer along with other information a client application, such as a chat bot, needs to display an answer to the user.

## Delete knowledge base

When you are done with the knowledge base, delete it.

|Information|cURL configuration|Purpose|
|--|--|--|
|Language resource name (Custom question answering feature enabled)|URL|used to construct URL|
|Language resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to language service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID \
-X DELETE \
-v \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY"
```

The response status is 204 with no results. Use the `-v` command-line parameter to see verbose output for the cURL command. This will include the HTTP status.

## Additional resources

* [Authoring](/rest/api/cognitiveservices/qnamaker4.0/knowledgebase) Reference documentation
* [Runtime](/rest/api/cognitiveservices/qnamaker4.0/runtime) Reference documentation
* [Sample BASH scripts using cURL](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/curl/QnAMaker)
