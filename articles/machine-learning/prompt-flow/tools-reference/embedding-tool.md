---
title: Embedding tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: Prompt flow embedding tool uses OpenAI's embedding models to convert text into dense vector representations for various NLP tasks.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: wangchao1230
ms.author: CLWAN
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Embedding tool
OpenAI's embedding models convert text into dense vector representations for various NLP tasks. See the [OpenAI Embeddings API](https://platform.openai.com/docs/api-reference/embeddings) for more information.

## Prerequisites
Create OpenAI resources:

- **OpenAI**

    Sign up account [OpenAI website](https://openai.com/)
    Login and [Find personal API key](https://platform.openai.com/account/api-keys)

- **Azure OpenAI (AOAI)**

    Create Azure OpenAI resources with [instruction](../../../ai-services/openai/how-to/create-resource.md)

## **Connections**

Set up connections to provide resources in embedding tool.

| Type        | Name     | API KEY  | API Type | API Version |
|-------------|----------|----------|----------|-------------|
| OpenAI      | Required | Required | -        | -           |
| AzureOpenAI | Required | Required | Required | Required    |


## Inputs

|  Name                  | Type        | Description                                                           | Required |
|------------------------|-------------|-----------------------------------------------------------------------|----------|
| input                  | string      | the input text to embed                                               | Yes      |
| connection             | string      | the connection for the embedding tool use to provide resources         | Yes      |
| model/deployment_name  | string      | instance of the text-embedding engine to use. Fill in model name if you use OpenAI connection, or deployment name if use Azure OpenAI connection.    | Yes      |



## Outputs

| Return Type | Description                              |
|-------------|------------------------------------------|
| list        | The vector representations for inputs    |

There is an example response returned by the embedding tool:

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
