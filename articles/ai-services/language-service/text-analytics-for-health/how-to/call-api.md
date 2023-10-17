---
title: How to call Text Analytics for health
titleSuffix: Azure AI services
description: Learn how to extract and label medical information from unstructured clinical text with Text Analytics for health.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 01/04/2023
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# How to use Text Analytics for health

[!INCLUDE [service notice](../includes/service-notice.md)]

Text Analytics for health can be used to extract and label relevant medical information from unstructured texts such as doctors' notes, discharge summaries, clinical documents, and electronic health records. The service performs [named entity recognition](../concepts/health-entity-categories.md), [relation extraction](../concepts/relation-extraction.md), [entity linking](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html), and [assertion detection](../concepts/assertion-detection.md) to uncover insights from the input text. For information  on the returned confidence scores, see the [transparency note](/legal/cognitive-services/text-analytics/transparency-note#general-guidelines-to-understand-and-improve-performance?context=/azure/ai-services/text-analytics/context/context).

> [!TIP]
> If you want to test out the feature without writing any code, use the [Language Studio](../../language-studio.md).

There are two ways to call the service: 

* A [Docker container](use-containers.md) (synchronous)
* Using the web-based API and client libraries (asynchronous) 

## Development options

[!INCLUDE [Development options](../includes/development-options.md)] 



## Specify the Text Analytics for health model

By default, Text Analytics for health will use the ("2022-03-01") model version on your text. You can also configure your API requests to use a specific model version. The model you specify will be used to perform operations provided by the Text Analytics for health. Extraction of social determinants of health entities along with their assertions and relationships (**only in English**) is supported with the latest preview model version "2023-04-15-preview".

| Supported Versions | Status |
|--|--|
| `2023-04-15-preview` | Preview   |
| `2023-04-01` | Generally available   |
| `2023-01-01-preview` | Preview   |
| `2022-08-15-preview` | Preview   |
| `2022-03-01` | Generally available   |

## Specify the Text Analytics for health API version

When making a Text Analytics for health API call, you must specify an API version. The latest generally available API version is "2023-04-01" which supports relationship confidence scores in the results. The latest preview API version is "2023-04-15-preview", offering the latest feature which is support for [temporal assertions](../concepts/assertion-detection.md).

| Supported Versions | Status |
|--|--|
| `2023-04-15-preview`| Preview  |
| `2023-04-01`| Generally available  |
| `2022-10-01-preview` | Preview   |
| `2022-05-01` | Generally available  |


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

To send an API request, you will need your Language resource endpoint and key.

> [!NOTE]
> You can find the key and endpoint for your Language resource on the Azure portal. They will be located on the resource's **Key and endpoint** page, under **resource management**. 

Analysis is performed upon receipt of the request. If you send a request using the REST API or client library, the results will be returned asynchronously. If you're using the Docker container, they will be returned synchronously.  

[!INCLUDE [asynchronous-result-availability](../../includes/async-result-availability.md)]


## Submitting a Fast Healthcare Interoperability Resources (FHIR) request

Fast Healthcare Interoperability Resources (FHIR) is the health industry communication standard developed by the Health Level Seven International (HL7) organization.  The standard defines the data formats (resources) and API structure for exchanging electronic healthcare data. To receive your result using the **FHIR** structure, you must send the FHIR version in the API request body. 

| Parameter Name  | Type |  Value |
|--|--|--|
| fhirVersion |  string  | `4.0.1` |



## Getting results from the feature

Depending on your API request, and the data you submit to the Text Analytics for health, you will get:

[!INCLUDE [Text Analytics for health features](../includes/features.md)]


## Service and data limits

[!INCLUDE [service limits article](../../includes/service-limits-link.md)]

## See also

* [Text Analytics for health overview](../overview.md)
* [Text Analytics for health entity categories](../concepts/health-entity-categories.md)
