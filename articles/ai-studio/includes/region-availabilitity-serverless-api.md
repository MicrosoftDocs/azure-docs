---
title: include file
description: include file
ms.service: azure-ai-studio
ms.topic: include
ms.date: 05/21/2024
ms.author: mopeakande
author: msakande
ms.reviewer: fasantia
reviewer: santiagxf
ms.custom: include file

# Also used in Azure Machine Learning documentation
---

Availability of serverless API endpoints for select models are listed in the following tables:

<!-- | Model             | East US     | East US 2   | North Central US | South Central US | West US     | West US 3   | France Central | Sweden Central |
|:-----------------:|:-----------:|:-----------:|:----------------:|:----------------:|:-----------:|:-----------:|:--------------:|:--------------:|
| Mistral-Small     |             | **&check;** |                  |                  |             |             |                | **&check;**    |
| Mistral-Large     |             | **&check;** |                  |                  |             |             | **&check;**    | **&check;**    |
| Cohere Command R  |             | **&check;** |                  |                  |             |             |                | **&check;**    |
| Cohere Command R+ |             | **&check;** |                  |                  |             |             |                | **&check;**    |
| Cohere Embed v3   |             | **&check;** |                  |                  |             |             |                | **&check;**    |
| Meta Llama 2      |             | **&check;** |                  |                  |             | **&check;** |                |                |
| Meta Llama 3      |             | **&check;** |                  |                  |             |             |                |                |
| Phi-3             |             | **&check;** |                  |                  |             |             |                | **&check;**    |
| Nixtla TimeGEN-1  | **&check;** | **&check;** | **&check;**      | **&check;**      | **&check;** | **&check;** |                | **&check;**    | -->


#### Cohere models

| Region           | Cohere Command R | Cohere Command R+ | Cohere Embed v3 |
|----------------|:----------------:|:-----------------:|:---------------:|
| East US 2        | **&check;**      | **&check;**       | **&check;**     |
| Sweden Central   | **&check;**      | **&check;**       | **&check;**     |

#### Mistral models

|   Region         | Mistral-Small | Mistral-Large |
|----------------|:-------------:|:-------------:|
| East US 2        | **&check;**   | **&check;**   |
| France Central   | unavailable   | **&check;**   |
| Sweden Central   | **&check;**   | **&check;**   |

#### Meta Llama models

| Region    | Llama-2     | Llama-3     |
|-----------|:-----------:|:-----------:|
| East US 2 | **&check;** | **&check;** |
| West US 3 | **&check;** | unavailable |

#### Nixtla TimeGEN-1 model

| Region           | Nixtla TimeGEN-1 |
|------------------|:----------------:|
| East US          | **&check;**      |
| East US 2        | **&check;**      |
| North Central US | **&check;**      |
| South Central US | **&check;**      |
| West US          | **&check;**      |
| West US 3        | **&check;**      |
| Sweden Central   | **&check;**      |

#### Phi 3 models

| Region         | Phi-3-mini       | Phi-3-medium     |
|----------------|:----------------:|:----------------:|
| East US 2      | **&check;**      | **&check;**      |
| Sweden Central | **&check;**      | **&check;**      |