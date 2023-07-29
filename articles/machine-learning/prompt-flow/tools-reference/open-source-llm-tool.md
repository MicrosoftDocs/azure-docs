---
title: Open Source LLM tool in Azure Machine Learning Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: The Open Source LLM tool enables you to leverage widely used OSS language models from the AzureML Model Catalog. Currently, the tool supports GPT2, LLaMa2, Dolly-v2, and text generation Hugging Face Models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.date: 07/28/23
---

# Open Source LLM tool (preview)

The Open Source LLM tool enables you to leverage widely used OSS language models from the AzureML Model Catalog. Currently, the tool supports GPT2, LLaMa2, Dolly-v2, and text generation Hugging Face Models.

The Open Source LLM tool supports two model types:

- **Completion**: Completion models such as GPT2 and LLaMa2 generate text based on provided prompts
- **Chat**: Chat models such as Dolly-v2 and LLaMa2-chat facilitate interactive conversations with text-based inputs and responses

## Prerequisite

Deploy a Foundation Model:

- Deploy an [open source](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-foundation-models?view=azureml-api-2&source=recommendations) or [Hugging Face](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-deploy-models-from-huggingface?view=azureml-api-2&source=recommendations#deploy-huggingface-hub-models-using-studio) foundation model in AzureML

## Connections

Set up a custom connection to the provisioned resources in Prompt flow with the following key-value pairs.

| Key              | Value                     | Description                                                                        |
| ---------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| endpoint_api_key | Key/Token                 | The API Key/Token provided by the endpoint                                         |
| endpoint_url     | REST endpont URL          | The REST endpoint URL provided by the endpoint                                     |
| model_family     | LLAMA, GP2, DOLLY, FALCON | Family name of model being used. Allowed values are LLAMA, GPT2, DOLLY, and FALCON |

## Inputs

| Name         | Type             | Description                                               | Required |
| ------------ | ---------------- | --------------------------------------------------------- | -------- |
| api          | string           | Either completion model or chat model API                 | Yes      |
| connection   | CustomConnection | The Custom Connection setup for the provisioned resources | Yes      |
| prompt       | string           | Text prompt that the language model will complete         | Yes      |
| model_kwargs | string           | JSON object with model parameters                         | Yes      |

## Outputs

| API        | Return Type | Description                              |
| ---------- | ----------- | ---------------------------------------- |
| Completion | string      | The text of one predicted completion     |
| Chat       | string      | The text of one response of conversation |

## How to use LLM Tool?

1. Setup and select the connections for the Foundation Models
2. Configure LLM model API and its parameters
3. Prepare the prompt with [guidance](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/tools-reference/prompt-tool?view=azureml-api-2#how-to-write-prompt)

## Sample Flows

Below is a sample chat RAG flow and a single-turn RAG flow that uses the Open Source LLM tool.

[Single-turn RAG flow](https://ml.azure.com/prompts/flow/f17bfacf-5c56-4da4-b8cd-86630b4f03ae/47e76f12-7c70-454f-8b56-fdd1027cb75b/details?wsid=/subscriptions/ba7979f7-d040-49c9-af1a-7414402bf622/resourceGroups/baker-eastus/providers/Microsoft.MachineLearningServices/workspaces/baker-eastus&flight=PFPackageTools&tid=72f988bf-86f1-41af-91ab-2d7cd011db47)

[Chat RAG flow](https://ml.azure.com/prompts/flow/f17bfacf-5c56-4da4-b8cd-86630b4f03ae/b4342a2c-d84f-47ec-ade1-151d5e8cbef2/details?wsid=/subscriptions/ba7979f7-d040-49c9-af1a-7414402bf622/resourceGroups/baker-eastus/providers/Microsoft.MachineLearningServices/workspaces/baker-eastus&flight=PFPackageTools&tid=72f988bf-86f1-41af-91ab-2d7cd011db47)
