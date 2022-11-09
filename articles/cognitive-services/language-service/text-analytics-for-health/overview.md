---
title: What is the Text Analytics for health in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of Text Analytics for health in Azure Cognitive Services, which helps you extract medical information from unstructured text, like clinical documents.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 06/15/2022
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# What is Text Analytics for health?

[!INCLUDE [service notice](includes/service-notice.md)]

Text Analytics for health is one of the prebuilt features offered by [Azure Cognitive Service for Language](../overview.md). It is a cloud-based API service that applies machine-learning intelligence to extract and label relevant medical information from a variety of unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records. 

This documentation contains the following types of articles:
* The [**quickstart article**](quickstart.md) provides a short tutorial that guides you with making your first request to the service.
* The [**how-to guides**](how-to/call-api.md) contain detailed instructions on how to make calls to the service using the hosted API or using the on-premise Docker container.
* The [**conceptual articles**](concepts/health-entity-categories.md) provide in-depth information on each of the service's features, named entity recognition, relation extraction, entity linking, and assertion detection.

## Text Analytics for health features

Text Analytics for health performs four key functions which are named entity recognition, relation extraction, entity linking, and assertion detection, all with a single API call.

[!INCLUDE [Text Analytics for health](includes/features.md)]

Text Analytics for health can receive unstructured text in English as part of its generally available offering. Additional languages such as German, French, Italian, Spanish, Portuguese, and Hebrew are currently supported in preview.

Additionally, Text Analytics for health can return the processed output using the Fast Healthcare Interoperability Resources (FHIR) structure which enables the service's integration with other electronic health systems.  



> [!VIDEO https://learn.microsoft.com/Shows/AI-Show/Introducing-Text-Analytics-for-Health/player]



## Example use cases

Text Analytics for health can be used in multiple scenarios across a variety of industries.
Some common customer motivations for using Text Analytics for health include:
* Assisting and automating the processing of medical documents by proper medical coding to ensure accurate care and billing.
* Increasing the efficiency of analyzing healthcare data to help drive the success of value-based care models similar to Medicare.
* Minimizing healthcare provider effort by automating the aggregation of key patient data for trend and pattern monitoring.
* Facilitating and supporting the adoption of HL7 standards for improved exchange, integration, sharing, retrieval, and delivery of electronic health information in all healthcare services.    

 
|Use case|Description|
|--|--|
|Extract insights and statistics|Identify medical entities such as symptoms, medications, diagnosis from clinical and research documents in order to extract insights and statistics for different patient cohorts.|
|Develop predictive models using historic data|Power solutions for planning, decision support, risk analysis and more, based on prediction models created from historic data.|
|Annotate and curate medical information|Support solutions for clinical data annotation and curation such as automating clinical coding and digitizing manually created data.|
|Review and report medical information|Support solutions for reporting and flagging possible errors in medical information resulting from reviewal processes such as quality assurance.|
|Assist with decision support|Enable solutions that provide humans with assistive information relating to patients’ medical information for faster and more reliable decisions.|



## Get started with Text analytics for health

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are three ways to use Text Analytics for health:


|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try Text Analytics for health without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/healthAnalysis) <br> • [Quickstart: Use Language Studio](../language-studio.md) |
| REST API or Client library (Azure SDK)     | Integrate Text Analytics for health into your applications using the REST API, or the client library available in a variety of development languages. | • [Quickstart: Use Text Analytics for health](quickstart.md)  |
| Docker container | Use the available Docker container to deploy this feature on-premises, letting you bring the service closer to your data for compliance, security, or other operational reasons. | • [How to deploy on-premises](how-to/use-containers.md) |

## Input requirements and service limits

* Text Analytics for health takes raw unstructured text for analysis. See [Data and service limits](../concepts/data-limits.md) for more information.
* Text Analytics for health works with a variety of written languages. See [language support](language-support.md) for more information.

[!INCLUDE [Developer reference](../includes/reference-samples-text-analytics.md)] 


## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for Text Analytics for health](/legal/cognitive-services/language-service/transparency-note-health?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]
