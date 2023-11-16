---
title: Embedding tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The prompt flow embedding tool uses OpenAI's embedding models to convert text into dense vector representations for various NLP tasks.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: reference
author: wangchao1230
ms.author: CLWAN
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Embedding tool

OpenAI's embedding models convert text into dense vector representations for various NLP tasks. For more information, see the [OpenAI Embeddings API](https://platform.openai.com/docs/api-reference/embeddings).

## Prerequisites

Create OpenAI resources:

- **OpenAI**:

    - Sign up your account on the [OpenAI website](https://openai.com/).
    - Sign in and [find your personal API key](https://platform.openai.com/account/api-keys).

- **Azure OpenAI**:

    Create Azure OpenAI resources with these [instructions](../../../ai-services/openai/how-to/create-resource.md).

## Connections

Set up connections to provide resources in the embedding tool.

| Type        | Name     | API key  | API type | API version |
|-------------|----------|----------|----------|-------------|
| OpenAI      | Required | Required | -        | -           |
| AzureOpenAI | Required | Required | Required | Required    |

## Inputs

|  Name                  | Type        | Description                                                           | Required |
|------------------------|-------------|-----------------------------------------------------------------------|----------|
| input                  | string      | Input text to embed.                                               | Yes      |
| connection             | string      | Connection for the embedding tool used to provide resources.         | Yes      |
| model/deployment_name  | string      | Instance of the text-embedding engine to use. Fill in the model name if you use an OpenAI connection. Insert the deployment name if you use an Azure OpenAI connection.    | Yes      |

## Outputs

| Return type | Description                              |
|-------------|------------------------------------------|
| list        | Vector representations for inputs    |

Here's an example response returned by the embedding tool:

<details>
  <summary>Output</summary>
  
```
[-0.005744616035372019,
-0.007096089422702789,
-0.00563855143263936,
-0.005272455979138613,
-0.02355326898396015,
0.03955197334289551,
-0.014260607771575451,
-0.011810848489403725,
-0.023170066997408867,
-0.014739611186087132,
...]
```
</details>
