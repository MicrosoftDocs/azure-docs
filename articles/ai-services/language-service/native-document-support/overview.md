---
title: What is the native document support feature in Azure AI Language (preview)?
titleSuffix: Azure AI services
description: An overview of the native document support preview feature for Azure AI Languages Personally Identifiable Information and Summarization capabilities.
author: laujan
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 01/16/2024
ms.author: lajanuar
---

# What is native document support in Azure AI Language (preview)?

> [!IMPORTANT]
>
> * Azure AI Language public preview releases provide early access to features that are in active development.
> * Features, approaches, and processes may change, prior to General Availability (GA), based on user feedback.

Azure AI Language is a cloud-based service that applies Natural Language Processing (NLP) features to text-based data. Native document support eliminates the need for text preprocessing prior to using Azure AI Language resource capabilities.  Currently, native document support is available for the following capabilities:

* [Personally Identifiable Information (PII)](../personally-identifiable-information/overview.md). The PII detection feature can identify, categorize, and redact sensitive information in unstructured text

* [Document Summarization](../summarization/overview.md). Document summarization uses natural language processing to generate extractive (salient sentence extraction) or abstractive (contextual word extraction) summaries for documents.

## Development options

Native document support can be integrated into your applications using the [Azure AI Language REST API](/rest/api/language/). The REST API is a language agnostic interface that enables you to create HTTP requests for text-based data analysis.

|Service|Description|API Reference (Latest GA version)|API Reference (Latest Preview version)|
|--|--|--|--|
| Text analysis - runtime | Includes runtime prediction calls to **Personally Identifiable Information (PII)**|[`2023-04-01`](/rest/api/language/2023-04-01/text-analysis-runtime)|[`2023-04-15-preview`](/rest/api/language/2023-04-15-preview/text-analysis-runtime)|
| Summarization for documents - runtime|Runtime prediction calls to **query summarization for documents models**.|[`2023-04-01`](/rest/api/language/2023-04-01/text-analysis-runtime/submit-job)|[`2023-04-15-preview`](/rest/api/language/2023-04-15-preview/text-analysis-runtime)|

## Supported document formats

A native document refers to the file format used to create the original document such as Microsoft Word (.docx) or a portable document file (.pdf).  Applications employ native file formats to create, save, or open native documents.  Currently Azure AI Language service supports the following native document formats:

|File type|File extension|Description|
|---------|--------------|-----------|
|Text| `.txt`|An unformatted text document.|
|Adobe PDF| `.pdf`       |A portable document file formatted document.|
|Microsoft Word| `.doc` `.docx`|A text document file.|

## Input guidelines

|Input type|support and limitations|
|---|---|
|**PDFs**| Fully digital and fully scanned PDFs are supported.|
|**Text within images**| Digital PDFs with imbedded text and text within images are not supported.|
|**Digital tables**| Tables in digital documents are supported, however scanned table quality isn't guaranteed.|
|**PII content**| Custom redaction for native documents is supported in the latest 2023-04-14-preview|

## Responsible AI

An AI system includes not only technology, but human users and the deployment environment. Read the [transparency note for summarization](/legal/cognitive-services/language-service/transparency-note-extractive-summarization?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. For more information, review the following articles:

* [Transparency note for Azure AI Language](/legal/cognitive-services/language-service/transparency-note?context=/azure/ai-services/language-service/context/context)
* [Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use-summarization?context=/azure/ai-services/language-service/context/context)
* [Characteristics and limitations of summarization](/legal/cognitive-services/language-service/characteristics-and-limitations-summarization?context=/azure/ai-services/language-service/context/context)
* [Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=/azure/ai-services/language-service/context/context)

## Get started

You can get started with our quickstart. You need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Start here](quickstart.md "Learn how to process and analyze native documents.")

## Next steps

> [!div class="nextstepaction"]
> [**Try the Language Studio**](https://language.cognitive.azure.com/)
