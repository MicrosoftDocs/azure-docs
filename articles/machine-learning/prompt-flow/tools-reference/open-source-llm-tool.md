---
title: Open source LLM tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: The Python Tool empowers users to offer customized code snippets as self-contained executable nodes in Prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: devx-track-python
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 10/16/2023
---

# Open Source LLM

## Introduction

The Prompt flow Open Source LLM tool enables you to utilize a variety of Open Source and Foundational Models, such as [Falcon](https://aka.ms/AAlc25c) or [Llama 2](https://aka.ms/AAlc258) for natural language processing, in PromptFlow.

Here's how it looks in action on the Visual Studio Code Prompt flow extension. In this example, the tool is being used to call a LlaMa-2 chat endpoint and asking "What is CI?".

![Screenshot of the Open Source Llm On vsCode PromptFlow extension](../media/tool-reference/open_source_llm_on_vscode_promptflow.png)

This Prompt flow supports two different LLM API types:

- **Chat**: Shown in the example above. The chat API type facilitates interactive conversations with text-based inputs and responses.
- **Completion**: The Completion API type is used to generate single response text completions based on provided prompt input.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Quick Overview: How do I use Open Source LLM Tool?

1. Choose a Model from the AzureML Model Catalog and deploy.
2. Setup and select the connections to the model deployment.
3. Configure the tool with the model settings.
4. Prepare the Prompt with [guidance](./prompt-tool.md#how-to-write-prompt).
5. Run the flow.

## Prerequisites: Model Deployment

1. Pick the model which matched your scenario from the [Azure Machine Learning model catalog](https://ml.azure.com/model/catalog).
2. Use the "Deploy" button to deploy the model to a AzureML Online Inference endpoint.

More detailed instructions can be found here [Deploying foundation models to endpoints for inferencing.](../../how-to-use-foundation-models.md#deploying-foundation-models-to-endpoints-for-inferencing)

## Prerequisites: Prompt flow Connections

In order for Prompt flow to use your deployed model, you will need to setup a Connection. Explicitly, the Open Source LLM tool uses the CustomConnection.

1. Instructions to create a Custom Connection [can be found here.](https://microsoft.github.io/promptflow/how-to-guides/manage-connections.html#create-a-connection)

    The keys to set are:

    1. **endpoint_url**
        - This value can be found at the previously created Inferencing endpoint.
    2. **endpoint_api_key**
        - Ensure to set this as a secret value.
        - This value can be found at the previously created Inferencing endpoint.
    3. **model_family**
        - Supported values: LLAMA, DOLLY, GPT2, or FALCON
        - This value is dependent on the type of deployment you are targetting.

## Running the Tool: Inputs

The Open Source LLM tool has a number of parameters, some of which are required. Please see the below table for details, you can match these to the screen shot above for visual clarity.

| Name | Type | Description | Required |
|------|------|-------------|----------|
| api | string | This is the API mode and will depend on the model used and the scenario selected. *Supported values: (Completion \| Chat)* | Yes |
| connection | CustomConnection | This is the name of the connection which points to the Online Inferencing endpoint. | Yes |
| model_kwargs | dictionary | This input is used to provide configuration specific to the model used. For example, the Llama-02 model may use {\"temperature\":0.4}. *Default: {}* | No |
| deployment_name | string | The name of the deployment to target on the Online Inferencing endpoint. If no value is passed, the Inferencing load balancer traffic settings will be used. | No |
| prompt | string | The text prompt that the language model will use to generate it's response. | Yes |

## Outputs

| API        | Return Type | Description                              |
|------------|-------------|------------------------------------------|
| Completion | string      | The text of one predicted completion     |
| Chat       | string      | The text of one response int the conversation |