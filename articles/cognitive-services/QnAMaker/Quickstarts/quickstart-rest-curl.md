---
title: "Quickstart: Use cURL & REST to manage knowledge base - QnA Maker"
description: This quickstart shows you how to create, publish, and query your knowledge base using the REST APIs.
ms.date: 04/13/2020
ROBOTS: NOINDEX,NOFOLLOW
ms.custom: RESTCURL2020FEB27
ms.topic: quickstart
---

# Quickstart: Use cURL and REST to manage knowledge base

This quickstart walks you through creating, publishing, and querying your knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/knowledge-base.md). The model for the knowledge base is defined in the JSON sent in the body of the API request.

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/). Several command-line switches are used in the quickstarts, which are noted in the [cURL documentation](https://curl.haxx.se/docs/manpage.html).
* You must have a [QnA Maker resource](../How-To/set-up-qnamaker-service-azure.md), to use the key and resource name. You entered the resource **Name** during resource creation, then the key was created for you. The resource name is used as the subdomain for your endpoint. To retrieve your key and resource name, select **Quickstart** for your resource in the Azure portal. The resource name is the first subdomain of the endpoint URL:

    `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0`

> [!CAUTION]
> The following BASH examples use the `\` line continuation character. If you console or terminal uses a different line continuation character, use this character.

## Create a knowledge base

To create a knowledge base with the REST APIs and cURL, you need to have the following information:

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|
|JSON describing knowledge base|`-d` param|[Examples](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create#examples) of JSON|
|Size of the JSON in bytes|`-h` param for `Content-Size` header||

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/knowledgebases/create \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-H "Content-Size:107" \
-d '{ name: "QnA Maker FAQ",urls: [ "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs"]}'
```

The cURL response from QnA Maker includes the `operationId` , which is required to [get status of the operation](#get-status-of-operation).

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
|QnA Maker resource name|URL|used to construct URL|
|Operation Id|URL route|`/operations/REPLACE-WITH-YOUR-OPERATION-ID`|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and operation ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/operations/REPLACE-WITH-YOUR-OPERATION-ID \
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

Before you query the knowledge base, you need to:
* Publish knowledge base
* Get the runtime endpoint key

This task publishes the knowledge base. Getting the runtime endpoint key is a [separate task](#get-published-knowledge-bases-runtime-endpoint-key).

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID \
-v \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
--data-raw ''
```

The response status is 204 with no results. Use the `-v` command-line parameter to see verbose output for the cURL command. This will include the HTTP status.

## Get published knowledge base's runtime endpoint key

Before you query the knowledge base, you need to:
* Publish knowledge base
* Get the runtime endpoint key

This task getS the runtime endpoint key. Publishing the knowledge base is a [separate task](#publish-knowledge-base).

The runtime endpoint key is the same key for all knowledge bases using the QnA Maker resource.

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/endpointkeys \
-X GET \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY"
```


The cURL response includes the runtime endpoint keys. Use just one of the keys when querying to get an answer from the knowledge base.

```json
{
  "primaryEndpointKey": "93e88a14-694a-44d5-883b-184a68aa8530",
  "secondaryEndpointKey": "92c98c16-ca31-4294-8626-6c57454a5063",
  "installedVersion": "4.0.5",
  "lastStableVersion": "4.0.6"
}
```

## Query for answer from published knowledge base

Getting an answer from the knowledge is done from a separate runtime than managing the knowledge base. Because it is a separate runtime, you need to authenticate with a runtime key.

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker runtime key|`-h` param for `Authorization` header|The key is part of a string that includes the word `Endpointkey `. Authenticate to QnA Maker service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|
|JSON describing query|`-d` param|[Request body parameters](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer#request-body) and [examples](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer#examples) of JSON|
|Size of the JSON in bytes|`-h` param for `Content-Size` header||

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.azurewebsites.net/qnamaker/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID/generateAnswer \
-X POST \
-H "Authorization: EndpointKey REPLACE-WITH-YOUR-RUNTIME-KEY" \
-H "Content-Type:application/json" \
-H "Content-Size:159" \
-d '{"question": "How are QnA Maker and LUIS used together?","top": 6,"isTest": true,  "scoreThreshold": 20, "strictFilters": [], "userId": "sd53lsY="}'
```

A successful response includes the top answer along with other information a client application, such as a chat bot, needs to display an answer to the user.

## Delete knowledge base

When you are done with the knowledge base, delete it.

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|
|Knowledge base Id|URL route|`/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID`|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and knowledge base ID.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/knowledgebases/REPLACE-WITH-YOUR-KNOWLEDGE-BASE-ID \
-X DELETE \
-v \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY"
```

The response status is 204 with no results. Use the `-v` command-line parameter to see verbose output for the cURL command. This will include the HTTP status.

## Additional resources

* [Authoring](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase) Reference documentation
* [Runtime](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/) Reference documentation
* [Sample BASH scripts using cURL](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/curl/QnAMaker)

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
