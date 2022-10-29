---
title: How to call Text Analytics for health
titleSuffix: Azure Cognitive Services
description: Learn how to extract and label medical information from unstructured clinical text with Text Analytics for health.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 09/05/2022
ms.author: aahi
ms.custom: language-service-health, ignite-fall-2021
---

# How to use Text Analytics for health

[!INCLUDE [service notice](../includes/service-notice.md)]

Text Analytics for health can be used to extract and label relevant medical information from unstructured texts, such as: doctor's notes, discharge summaries, clinical documents, and electronic health records.  There are two ways to utilize this service: 

* The web-based API and client libraries (asynchronous)
* A [Docker container](use-containers.md) (synchronous)

## Features

Text Analytics for health performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking on English-language text to uncover insights in unstructured clinical and biomedical text. 
See the [entity categories](../concepts/health-entity-categories.md) returned by Text Analytics for health for a full list of supported entities. For information on confidence scores, see the [transparency note](/legal/cognitive-services/text-analytics/transparency-note#general-guidelines-to-understand-and-improve-performance?context=/azure/cognitive-services/text-analytics/context/context). 

> [!TIP]
> If you want to start using this feature, you can follow the [quickstart article](../quickstart.md) to get started. You can also make example requests using [Language Studio](../../language-studio.md) without needing to write code.

## Determine how to process the data (optional)

### Specify the Text Analytics for health model

By default, Text Analytics for health will use the latest available AI model on your text. You can also configure your API requests to use a specific model version. The model you specify will be used to perform operations provided by the Text Analytics for health.

| Supported Versions | latest version |
|--|--|
| `2022-08-15-preview` | `2022-08-15-preview`   |
| `2022-03-01` | `2022-03-01`   |
| `2021-05-15` | `2021-05-15`   |


### Text Analytics for health container

The [Text Analytics for health container](use-containers.md) uses separate model versioning than the REST API and client libraries. Only one model version is available per container image.

| Endpoint                        | Container Image Tag                     | Model version |
|---------------------------------|-----------------------------------------|---------------|
| `/entities/health`              | `3.0.59413252-onprem-amd64` (latest)            | `2022-03-01`  |
| `/entities/health`              | `3.0.59413252-latin-onprem-amd64` (latin)            | `2022-08-15-preview`  |
| `/entities/health`              | `3.0.59413252-semitic-onprem-amd64` (semitic)            | `2022-08-15-preview`  |
| `/entities/health`              | `3.0.016230002-onprem-amd64`            | `2021-05-15`  |
| `/entities/health`              | `3.0.015370001-onprem-amd64`            | `2021-03-01`  |
| `/entities/health`              | `1.1.013530001-amd64-preview`           | `2020-09-03`  |
| `/entities/health`              | `1.1.013150001-amd64-preview`           | `2020-07-24`  |
| `/domains/health`               | `1.1.012640001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012420001-amd64-preview`           | `2020-05-08`  |
| `/domains/health`               | `1.1.012070001-amd64-preview`           | `2020-04-16`  |

### Input languages

The Text Analytics for health supports English in addition to multiple languages that are currently in preview. You can use the hosted API or deploy the API in a container, as detailed [under Text Analytics for health languages support](../language-support.md).

## Submitting data

To send an API request, You will need your Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. If you send a request using the REST API or client library, the results will be returned asynchronously. If you're using the Docker container, they will be returned synchronously.  

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]


## Submitting a Fast Healthcare Interoperability Resources (FHIR) request

To receive your result using the **FHIR** structure, you must send the FHIR version in the API request body. You can also send the **document type** as a parameter to the FHIR API request body. If the request does not specify a document type, the value is set to none.

| Parameter Name  | Type |  Value |
|--|--|--|
| fhirVersion |  string  | `4.0.1` |
| documentType | string | `ClinicalTrial`, `Consult`, `DischargeSummary`,  `HistoryAndPhysical`, `Imaging`, `None`, `Pathology`, `ProcedureNote`, `ProgressNote`|



## Getting results from the feature

Depending on your API request, and the data you submit to the Text Analytics for health, you will get:

[!INCLUDE [Text Analytics for health features](../includes/features.md)]


## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Text Analytics for health overview](../overview.md)
* [Text Analytics for health entity categories](../concepts/health-entity-categories.md)
