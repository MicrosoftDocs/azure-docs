---
title: Summarize text with the Text Analytics API
titleSuffix: Azure Cognitive Services
description: This article will show you how to summarize text with the Azure Cognitive Services Text Analytics API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/16/2021
ms.author: aahi
---

# How to: Text Summarization

The Text Analytics API's text summarization feature provides ...

The AI models used by the API are provided by the service, you just have to send content for analysis.

## Text summarization and features

TBD (how the feature works, what it does, etc.)

## Sending a REST API request 

### Preparation

TBD (any important steps/notes for preparing the text to send to the API )

You must have JSON documents in this format: ID, text, and language. Sentiment Analysis supports a wide range of languages, with more in preview. For more information, see [Supported languages](../language-support.md).

Document size must be under 5,120 characters per document. For the maximum number of documents permitted in a collection, see the [data limits](../concepts/data-limits.md?tabs=version-3) article. The collection is submitted in the body of the request.

## Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following reference links to quickly structure and send one. 

[Text summarization reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1-preview-5/operations/Sentiment)

### Request endpoints

Set the HTTPS endpoint for Text Summarization by using a Text Analytics resource on Azure. For example:

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the Azure portal. They will be located on the resource's **Key and endpoint** page. 

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/TBD`

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example request 

The following is an example of content you might submit for summarization.
    
```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "TBD"
    }
  ]
}
```

### Post the request

Summarization is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../overview.md#data-limits) section in the overview.

The Text Analytics API is stateless. No data is stored in your account, and results are returned immediately in the response.


### View the results

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system. Then, import the output into an application that you can use to sort, search, and manipulate the data. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/text-offsets.md) for more information.

### Example response
  
The Text Summarization feature returns ...

```json
{
  TBD
}
```

## Summary

In this article, you learned concepts and workflow for Text Summarization using the Text Analytics API. In summary:

+ Text summarization is available for select languages.

## See also

* [Text Analytics overview](../overview.md)
* [What's new](../whats-new.md)
* [Model versions](../concepts/model-versioning.md)