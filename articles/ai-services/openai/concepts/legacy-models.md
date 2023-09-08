---
title: Azure OpenAI Service legacy models
titleSuffix: Azure OpenAI
description: Learn about the legacy models in Azure OpenAI. 
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual 
ms.date: 07/06/2023
ms.custom: event-tier1-build-2022, references_regions, build-2023, build-2023-dataai
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# Azure OpenAI Service legacy models

Azure OpenAI Service offers a variety of models for different use cases. The following models are not available for new deployments beginning July 6, 2023. Deployments created prior to July 6, 2023 remain available to customers until July 5, 2024. We recommend customers migrate to the replacement models prior to the July 5, 2024 retirement.

## GPT-3.5

The impacted GPT-3.5 models are the following. The replacement for the GPT-3.5 models is GPT-3.5 Turbo Instruct when that model becomes available.

- `text-davinci-002`
- `text-davinci-003`
- `code-davinci-002`

## GPT-3 

The impacted GPT-3 models are the following. The replacement for the GPT-3 models is GPT-3.5 Turbo Instruct when that model becomes available.

- `text-ada-001`
- `text-babbage-001`
- `text-curie-001`
- `text-davinci-001`
- `code-cushman-001`

## Embedding models

The embedding models below will be retired effective July 5, 2024. Customers should migrate to `text-embedding-ada-002` (version 2).

- [Similarity](#similarity-embedding)
- [Text search](#text-search-embedding)
- [Code search](#code-search-embedding)

Each family includes models across a range of capability. The following list indicates the length of the numerical vector returned by the service, based on model capability:

|  Base Model  |  Model(s)  |  Dimensions  |
|---|---|---|
| Ada | | 1024 |
| Babbage |  | 2048 |
| Curie |  | 4096 |
| Davinci |  | 12288 |


### Similarity embedding

These models are good at capturing semantic similarity between two or more pieces of text.

| Use cases | Models |
|---|---|
| Clustering, regression, anomaly detection, visualization | `text-similarity-ada-001` <br> `text-similarity-babbage-001` <br> `text-similarity-curie-001` <br> `text-similarity-davinci-001` <br>|

### Text search embedding

These models help measure whether long documents are relevant to a short search query. There are two input types supported by this family: `doc`, for embedding the documents to be retrieved, and `query`, for embedding the search query.

| Use cases | Models |
|---|---|
| Search, context relevance, information retrieval | `text-search-ada-doc-001` <br> `text-search-ada-query-001` <br> `text-search-babbage-doc-001` <br> `text-search-babbage-query-001` <br> `text-search-curie-doc-001` <br> `text-search-curie-query-001` <br> `text-search-davinci-doc-001` <br> `text-search-davinci-query-001` <br> |

### Code search embedding

Similar to text search embedding models, there are two input types supported by this family: `code`, for embedding code snippets to be retrieved, and `text`, for embedding natural language search queries.

| Use cases | Models |
|---|---|
| Code search and relevance | `code-search-ada-code-001` <br> `code-search-ada-text-001` <br> `code-search-babbage-code-001` <br> `code-search-babbage-text-001` |

## Model summary table and region availability

Region availability is for customers with deployments of the models prior to July 6, 2023.

### GPT-3.5 models

|  Model ID  |   Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --------- |  --------------------- | ------------------- | -------------------- | ---------------------- |
| text-davinci-002 | East US, South Central US, West Europe | N/A | 4,097 | Jun 2021 |
| text-davinci-003 | East US, West Europe | N/A | 4,097 | Jun 2021 |
| code-davinci-002 | East US,  West Europe |  N/A | 8,001 | Jun 2021 |

### GPT-3 models


|  Model ID  |   Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --------- |  --------------------- | ------------------- | -------------------- | ---------------------- |
| ada        |	N/A	                  | N/A | 2,049 | Oct 2019|
| text-ada-001 | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019|
| babbage | N/A | N/A | 2,049 | Oct 2019 |
| text-babbage-001 | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019 |
| curie | N/A | N/A | 2,049 | Oct 2019 |
| text-curie-001  | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019 |
| davinci | N/A | N/A | 2,049 | Oct 2019|
| text-davinci-001 | South Central US, West Europe | N/A |  |  |


### Codex models

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| code-cushman-001 | South Central US, West Europe | N/A | 2,048 | |

### Embedding models

|  Model ID  |  Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- | --- | --- | --- | --- |
| text-similarity-ada-001| East US, South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-similarity-babbage-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-similarity-curie-001 | East US, South Central US, West Europe | N/A |  2046 | Aug 2020 |
| text-similarity-davinci-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-ada-doc-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-ada-query-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-babbage-doc-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-babbage-query-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-curie-doc-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-curie-query-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-davinci-doc-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-davinci-query-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-ada-code-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-ada-text-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-babbage-code-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-babbage-text-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
