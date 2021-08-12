---
title: Summarize text with the Text Analytics extractive summarization API
titleSuffix: Azure Cognitive Services
description: This article will show you how to summarize text with the Azure Cognitive Services Text Analytics extractive summarization API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 08/05/2021
ms.author: aahi
---

# How to: summarize text with Text Analytics (preview)

> [!IMPORTANT] 
> Text Analytics extractive summarization is a preview capability provided “AS IS” and “WITH ALL FAULTS.” As such, Text Analytics extractive summarization (preview) should not be implemented or deployed in any production use. The customer is solely responsible for any use of Text Analytics extractive summarization. 

In general, there are two approaches for automatic text summarization: extractive and abstractive. The Text analytics API provides extractive summarization starting in version `3.2-preview.1`

Extractive summarization is a feature in Azure Text Analytics that produces a summary by extracting sentences that collectively represent the most important or relevant information within the original content.

This feature is designed to shorten content that users consider too long to read. Extractive summarization condenses articles, papers, or documents to key sentences.

The AI models used by the API are provided by the service, you just have to send content for analysis.

## Extractive summarization and features

The extractive summarization feature in Text Analytics uses natural language processing techniques to locate key sentences in an unstructured text document. These sentences collectively convey the main idea of the document.

Extractive summarization returns a rank score as a part of the system response along with extracted sentences and their position in the original documents. A rank score is an indicator of how relevant a sentence is determined to be, to the main idea of a document. The model gives a score between 0 and 1 (inclusive) to each sentence and returns the highest scored sentences per request. For example, if you request a three-sentence summary, the service returns the three highest scored sentences.

There is another feature in Text Analytics, [key phrases extraction](./text-analytics-how-to-keyword-extraction.md), that can extract key information. When deciding between key phrase extraction and extractive summarization, consider the following:
* key phrase extraction returns phrases while extractive summarization returns sentences
* extractive summarization returns sentences together with a rank score. Top ranked sentences will be returned per request

## Sending a REST API request 

> [!TIP]
> You can also use the latest preview version of the client library to use extractive summarization. See the following samples on GitHub. 
> * [.NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample8_ExtractSummary.md)
> * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/AnalyzeExtractiveSummarization.java)
> * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_extract_summary.py)

### Preparation

Unlike other Text Analytics features, the extractive summarization feature is an asynchronous-only operation, and can be accessed through the /analyze endpoint. JSON request data should follow the format outlined in [Asynchronous requests to the /analyze endpoint](./text-analytics-how-to-call-api.md?tabs=asynchronous#api-request-formats).

Extractive summarization supports a wide range of languages for document input. For more information, see [Supported languages](../language-support.md).

Document size must be under 125,000 characters per document. For the maximum number of documents permitted in a collection, see the [data limits](../concepts/data-limits.md?tabs=version-3) article. The collection is submitted in the body of the request.

### Structure the request

Create a POST request. You can [use Postman](text-analytics-how-to-call-api.md) or the **API testing console** in the following reference link to quickly structure and send one. 

[Text summarization reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-preview-1/operations/Analyze)

### Request endpoints

Set the HTTPS endpoint for extractive summarization by using a Text Analytics resource on Azure. For example:

> [!NOTE]
> You can find your key and endpoint for your Text Analytics resource on the Azure portal. They will be located on the resource's **Key and endpoint** page. 

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/analyze`

Set a request header to include your Text Analytics API key. In the request body, provide the JSON documents collection you prepared for this analysis.

### Example request 

The following is an example of content you might submit for summarization, which is extracted using [a holistic representation toward integrative AI](https://www.microsoft.com/research/blog/a-holistic-representation-toward-integrative-ai/) for demonstration purpose. The extractive summarization API can accept much longer input text. See [Data limits](../Concepts/data-limits.md) for more information on Text Analytics API's data limits.

One request can include multiple documents. 

Each document has the following parameters
* `id` to identify a document, 
* `language` to indicate source language of the document, with `en` being the default
* `text` to attach the document text.

All documents in one request share the following parameters. These parameters can be specified in the `tasks` definition in the request.
* `model-version` to specify which version of the model to use, with `latest` being the default. For more information, see [Model version](../concepts/model-versioning.md) 
* `sentenceCount` to specify how many sentences will be returned, with `3` being the default. The range is from 1 to 20.
* `sortyby` to specify in what order the extracted sentences will be returned. The accepted values for `sortBy` are `Offset` and `Rank`, with `Offset` being the default. The value `Offset` is the start position of a sentence in the original document.    

```json
{
  "analysisInput": {
    "documents": [
      {
        "language": "en",
        "id": "1",
        "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI Cognitive Services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality. In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages. The goal is to have pretrained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multisensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks."
      }
    ]
  },
  "tasks": {
    "extractiveSummarizationTasks": [
      {
        "parameters": {
          "model-version": "latest",
          "sentenceCount": 3,
          "sortBy": "Offset"
        }
      }
    ]
  }
}
```

### Post the request

The extractive summarization API is performed upon receipt of the request. For information on the size and number of requests you can send per minute and second, see the [data limits](../overview.md#data-limits) section in the overview.

The Text Analytics extractive summarization API is an asynchronous API, thus there is no text in the response object. However, you need the value of the `operation-location` key in the response headers to make a GET request to check the status of the job and the output.  Below is an example of the value of the operation-location KEY in the response header of the POST request:

`https://<your-custom-subdomain>.cognitiveservices.azure.com/text/analytics/v3.2-preview.1/analyze/jobs/<jobID>`

To check the job status, make a GET request to the URL in the value of the operation-location KEY header of the POST response.  The following states are used to reflect the status of a job: `NotStarted`, `running`, `succeeded`, `failed`, or `rejected`.  

If the job succeeded, the output of the API will be returned in the body of the GET request. 


### View the results

The following is an example of the response of a GET request.  The output is available for retrieval until the `expirationDateTime` (24 hours from the time the job was created) has passed after which the output is purged. Due to multilingual and emoji support, the response may contain text offsets. See [how to process offsets](../concepts/text-offsets.md) for more information.

### Example response
  
The extractive summarization feature returns 

```json
{
    "jobId": "be437134-a76b-4e45-829e-9b37dcd209bf",
    "lastUpdateDateTime": "2021-06-11T05:43:37Z",
    "createdDateTime": "2021-06-11T05:42:32Z",
    "expirationDateTime": "2021-06-12T05:42:32Z",
    "status": "succeeded",
    "errors": [],
    "results": {
        "documents": [
            {
                "id": "1",
                "sentences": [
                    {
                        "text": "At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding.",
                        "rankScore": 0.7673416137695312,
                        "Offset": 0,
                        "length": 160
                    },
                    {
                        "text": "In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z).",
                        "rankScore": 0.7644073963165283,
                        "Offset": 324,
                        "length": 192
                    },
                    {
                        "text": "At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better.",
                        "rankScore": 0.7623870968818665,
                        "Offset": 517,
                        "length": 203
                    }    
                ],
                "warnings": []
            }
        ],
        "errors": [],
        "modelVersion": "2021-08-01"
    }
}
```

## Summary

In this article, you learned concepts and workflow for extractive summarization using the Text Analytics extractive summarization API. You might want to use extractive summarization to:

* Assist the processing of documents to improve efficiency.
* Distill critical information from lengthy documents, reports, and other text forms.
* Highlight key sentences in documents.
* Quickly skim documents in a library.
* Generate news feed content.

## See also

* [Text Analytics overview](../overview.md)
* [What's new](../whats-new.md)
* [Model versions](../concepts/model-versioning.md)