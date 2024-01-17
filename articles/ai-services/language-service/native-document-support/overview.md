---
title: What is the native document support feature in Azure AI Language?
titleSuffix: Azure AI services
description: An overview of the native document support feature for Azure AI Languages Personally Identifiable Information and Summarization capabilities.
author: laujan
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 01/16/2024
ms.author: lajanuar
---

# What is native document support in Azure AI Language?

Azure AI Language is a cloud-based service that applies Natural Language Processing (NLP) features to analyze your text-based data. Native document support eliminates the need for text extraction preprocessing prior to using the [Personally Identifiable Information (PII)](../personally-identifiable-information/overview.md) and [Document Summarization](../summarization/overview.md) capabilities.

## Development options

Native document support can be integrated into your applications using the [Azure AI Language REST API](/rest/api/language/). The REST API is a language agnostic interface that enables you to create HTTP requests for test analysis.

|Service|Description|API Reference (Latest GA version)|API Reference (Latest Preview version)|
|--|--|--|--|
| Text analysis - runtime | Includes runtime prediction calls to **Personally Identifiable Information (PII)**|[`2023-04-01`](/rest/api/language/2023-04-01/text-analysis-runtime)|[`2023-04-15-preview`](/rest/api/language/2023-04-15-preview/text-analysis-runtime)|
| Summarization for documents - runtime|Runtime prediction calls to **query summarization for documents models**.|[`2023-04-01`](/rest/api/language/2023-04-01/text-analysis-runtime/submit-job)|[`2023-04-15-preview`](/rest/api/language/2023-04-15-preview/text-analysis-runtime)|

## Supported document formats

A native document refers to the file format used to create the original document such as Microsoft Word (.docx) or a portable document file (.pdf). To create, save, or open a native document, applications employ the native file format.  Currently the following formats are supported:

|File type|File extension|Description|
|---------|--------------|-----------|
|Text| `.txt`|An unformatted text document.|
|Adobe PDF| `.pdf`       |A portable document file formatted document.|
|Microsoft Word| `.doc` `.docx`|A text document file.|

## Input limits

* Custom redaction: As supported in the latest 2023-04-14-preview
* Text within images isn't supported
* Digital tables in digital documents are supported but scanned table quality isn't guaranteed.

## Get started

You can get started with our quickstart. You need an active [Azure account](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [create a free account](https://azure.microsoft.com/free).

> [!div class="nextstepaction"]
> [Start here](quickstart.md "Learn how to process native documents with HTTP REST")


## Next steps
