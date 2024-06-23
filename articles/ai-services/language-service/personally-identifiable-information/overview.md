---
title: What is the Personally Identifying Information (PII) detection feature in Azure AI Language?
titleSuffix: Azure AI services
description: An overview of the PII detection feature in Azure AI services, which helps you extract entities and sensitive information (PII) in text.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: overview
ms.date: 01/31/2024
ms.author: jboback
ms.custom: language-service-pii, build-2024
---

# What is Personally Identifiable Information (PII) detection in Azure AI Language?

As of June 2024, we now provide General Availability support for the Conversational PII service (English-language only).
Customers can now redact transcripts, chats, and other text written in a conversational style (i.e. text with “um”s, “ah”s, multiple speakers, and the spelling out of words for more clarity) with better confidence in AI quality, Azure SLA support and production environment support, and enterprise-grade security in mind.

PII detection is one of the features offered by [Azure AI Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. The PII detection feature can **identify, categorize, and redact** sensitive information in unstructured text. For example: phone numbers, email addresses, and forms of identification. Azure AI Language supports general text PII redaction, as well as [Conversational PII](how-to-call-for-conversations.md), a specialized model for handling speech transcriptions and the more informal, conversational tone of meeting and call transcripts. The service also supports [Native Document PII redaction](#native-document-support), where the input and output are structured document files.

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to-call.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/entity-categories.md) provide in-depth explanations of the service's functionality and features.

[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Native document support

A native document refers to the file format used to create the original document such as Microsoft Word (docx) or a portable document file (pdf). Native document support eliminates the need for text preprocessing prior to using Azure AI Language resource capabilities.  Currently, native document support is available for the [**PiiEntityRecognition**](../personally-identifiable-information/concepts/entity-categories.md) capability.

 Currently **PII** supports the following native document formats:

|File type|File extension|Description|
|---------|--------------|-----------|
|Text| `.txt`|An unformatted text document.|
|Adobe PDF| `.pdf`       |A portable document file formatted document.|
|Microsoft Word|`.docx`|A Microsoft Word document file.|

For more information, *see* [**Use native documents for language processing**](../native-document-support/use-native-documents.md)

## Get started with PII detection

[!INCLUDE [development options](./includes/development-options.md)]

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)]

## Responsible AI

An AI system includes not only the technology, but also the people who use it, the people affected by it, and the deployment environment. Read the [transparency note for PII](/legal/cognitive-services/language-service/transparency-note-personally-identifiable-information?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. For more information, see the following articles:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Example scenarios

* **Apply sensitivity labels** - For example, based on the results from the PII service, a public sensitivity label might be applied to documents where no PII entities are detected. For documents where US addresses and phone numbers are recognized, a confidential label might be applied. A highly confidential label might be used for documents where bank routing numbers are recognized.
* **Redact some categories of personal information from documents that get wider circulation** - For example, if customer contact records are accessible to frontline support representatives, the company can redact the customer's personal information besides their name from the version of the customer history to preserve the customer's privacy.
* **Redact personal information in order to reduce unconscious bias** - For example, during a company's resume review process, they can block name, address and phone number to help reduce unconscious gender or other biases.
* **Replace personal information in source data for machine learning to reduce unfairness** – For example, if you want to remove names that might reveal gender when training a machine learning model, you could use the service to identify them and you could replace them with generic placeholders for model training.
* **Remove personal information from call center transcription** – For example, if you want to remove names or other PII data that happen between the agent and the customer in a call center scenario. You could use the service to identify and remove them.
* **Data cleaning for data science** - PII can be used to make the data ready for data scientists and engineers to be able to use these data to train their machine learning models. Redacting the data to make sure that customer data isn't exposed.



## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Language service features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.
