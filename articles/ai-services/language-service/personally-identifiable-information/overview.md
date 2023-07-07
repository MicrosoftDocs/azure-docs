---
title: What is the Personally Identifying Information (PII) detection feature in Azure AI Language?
titleSuffix: Azure AI services
description: An overview of the PII detection feature in Azure AI services, which helps you extract entities and sensitive information (PII) in text.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 01/10/2023
ms.author: jboback
ms.custom: language-service-pii, ignite-fall-2021
---

# What is Personally Identifiable Information (PII) detection in Azure AI Language?

PII detection is one of the features offered by [Azure AI Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. The PII detection feature can **identify, categorize, and redact** sensitive information in unstructured text. For example: phone numbers, email addresses, and forms of identification. The method for utilizing PII in conversations is different than other use cases, and articles for this use have been separated.

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to-call.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/entity-categories.md) provide in-depth explanations of the service's functionality and features.

PII comes into two shapes:
* [PII](how-to-call.md) - works on unstructured text.
* [Conversation PII (preview)](how-to-call-for-conversations.md) - tailored model to work on conversation transcription.


[!INCLUDE [Typical workflow for pre-configured language features](../includes/overview-typical-workflow.md)]

## Get started with PII detection

[!INCLUDE [development options](./includes/development-options.md)]

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 



## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it's deployed. Read the [transparency note for PII](/legal/cognitive-services/language-service/transparency-note-personally-identifiable-information?context=/azure/ai-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]

## Example scenarios

* **Apply sensitivity labels** - For example, based on the results from the PII service, a public sensitivity label might be applied to documents where no PII entities are detected. For documents where US addresses and phone numbers are recognized, a confidential label might be applied. A highly confidential label might be used for documents where bank routing numbers are recognized.
* **Redact some categories of personal information from documents that get wider circulation** - For example, if customer contact records are accessible to first line support representatives, the company may want to redact the customer's personal information besides their name from the version of the customer history to preserve the customer's privacy.
* **Redact personal information in order to reduce unconscious bias** - For example, during a company's resume review process, they may want to block name, address and phone number to help reduce unconscious gender or other biases.
* **Replace personal information in source data for machine learning to reduce unfairness** – For example, if you want to remove names that might reveal gender when training a machine learning model, you could use the service to identify them and you could replace them with generic placeholders for model training.
* **Remove personal information from call center transcription** – For example, if you want to remove names or other PII data that happen between the agent and the customer in a call center scenario. You could use the service to identify and remove them.
* **Data cleaning for data science** - PII can be used to make the data ready for data scientists and engineers to be able to use these data to train their machine learning models. Redacting the data to make sure that customer data isn't exposed.



## Next steps

There are two ways to get started using the entity linking feature:
* [Language Studio](../language-studio.md), which is a web-based platform that enables you to try several Language service features without needing to write code.
* The [quickstart article](quickstart.md) for instructions on making requests to the service using the REST API and client library SDK.  
