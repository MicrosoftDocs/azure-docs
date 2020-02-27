---
title: "Quickstart: Use cURL & REST to manage knowledge base - QnA Maker"
description: This quickstart shows you how to create, publish, and query your knowledge base using the REST APIs.
ms.topic: quickstart
ms.date: 12/16/2019
---

# Quickstart: Use cURL and REST to manage knowledge base

This quickstart walks you through creating, publishing, and querying your knowledge base. QnA Maker automatically extracts questions and answers from semi-structured content, like FAQs, from [data sources](../Concepts/knowledge-base.md). The model for the knowledge base is defined in the JSON sent in the body of the API request.

This quickstart calls the QnA Maker REST APIs:
* [Create KB](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create)
* [Get Operation Details](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/operations/getdetails)
* [Publish knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish)
* [Get published knowledge base endpoint key](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/endpointkeys/getkeys)
* [Get answer from published knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/generateanswer)
* [Delete knowledge base](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/delete)

[Authoring Reference documentation](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker) | [Runtime Reference documentation](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/) | cURL [sample scripts](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/curl/QnAMaker)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* You must have a [QnA Maker resource](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key and resource name, select **Quickstart** for your resource in the Azure portal. The resource name is the first part of the endpoint URL:

    `https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0`

## Create a knowledge base

To create a knowledge base with the REST APIs and cURL, you need to have the following information:

|Information|cURL configuration|Purpose|
|--|--|--|
|QnA Maker resource name|URL|used to construct URL|
|QnA Maker resource key|`-h` param for `Ocp-Apim-Subscription-Key` header|Authenticate to QnA Maker service|
|JSON describing knowledge base|`-d` param|[Examples](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/create#examples) of JSON|
|Size of the JSON in bytes|`-h` param for `Content-Size` header||

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values.

```bash
curl https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0/knowledgebases/create \
-X POST \
-H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" \
-H "Content-Type:application/json" \
-H "Content-Size:107" \
-d '{ name: "QnA Maker FAQ",urls: [ "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs"]}'
```


## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
