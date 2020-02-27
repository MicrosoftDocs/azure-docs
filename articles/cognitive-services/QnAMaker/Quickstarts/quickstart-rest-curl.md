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

Reference documentation - [Authoring](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker) & [Runtime](https://docs.microsoft.com/rest/api/cognitiveservices/qnamakerruntime/runtime/)| cURL [sample scripts](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/curl/QnAMaker)

[!INCLUDE [Custom subdomains notice](../../../../includes/cognitive-services-custom-subdomains-note.md)]

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/).
* You must have a [QnA Maker resource](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key and resource name, select **Quickstart** for your resource in the Azure portal. The resource name is the first part of the endpoint URL: `https://REPLACE-WITH-YOUR-RESOURCE-NAME.cognitiveservices.azure.com/qnamaker/v4.0`


## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
