---
title: Open Source LLM tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The prompt flow Open Source LLM tool enables you to utilize various open-source and foundational models.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom: ignite-2023
ms.topic: reference
author: gjwoods
ms.author: GEWOODS
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Open Source LLM

The prompt flow Open Source LLM tool enables you to utilize various open-source and foundational models, such as [Falcon](https://aka.ms/AAlc25c) or [Llama 2](https://aka.ms/AAlc258), for natural language processing in prompt flow.

Here's how it looks in action on the Visual Studio Code prompt flow extension. In this example, the tool is being used to call a LlaMa-2 chat endpoint and ask, "What is CI?".

:::image type="content" source="./media/open-source-llm-tool/open-source-llm-on-vscode-prompt-flow.png" alt-text="Screenshot that shows the Open Source LLM on Visual Studio Code prompt flow extension." lightbox = "./media/open-source-llm-tool/open-source-llm-on-vscode-prompt-flow.png":::

This prompt flow supports two different LLM API types:

- **Chat**: Shown in the preceding example. The Chat API type facilitates interactive conversations with text-based inputs and responses.
- **Completion**: The Completion API type is used to generate single response text completions based on a provided prompt input.

## Quick overview: How do I use the Open Source LLM tool?

1. Choose a model from the Azure Machine Learning model catalog and deploy.
1. Set up and select the connections to the model deployment.
1. Configure the tool with the model settings.
1. [Prepare the prompt](./prompt-tool.md#how-to-write-prompt).
1. Run the flow.

## Prerequisites: Model deployment

1. Pick the model that matched your scenario from the [Azure Machine Learning model catalog](https://ml.azure.com/model/catalog).
1. Use the **Deploy** button to deploy the model to an Azure Machine Learning online inference endpoint.

To learn more, see [Deploy foundation models to endpoints for inferencing.](../../how-to-use-foundation-models.md#deploying-foundation-models-to-endpoints-for-inferencing).

## Prerequisites: Prompt flow connections

For prompt flow to use your deployed model, you need to set up a connection. Explicitly, the Open Source LLM tool uses `CustomConnection`.

1. To learn how to create a custom connection, see [Create a connection](https://microsoft.github.io/promptflow/how-to-guides/manage-connections.html#create-a-connection).

    The keys to set are:

    1. **endpoint_url**
        - This value is found at the previously created inferencing endpoint.
    1. **endpoint_api_key**
        - Make sure to set this key as a secret value.
        - This value is found at the previously created inferencing endpoint.
    1. **model_family**
        - Supported values: LLAMA, DOLLY, GPT2, or FALCON
        - This value is dependent on the type of deployment you're targeting.

## Run the tool: Inputs

The Open Source LLM tool has many parameters, some of which are required. See the following table for details. You can match these parameters to the preceding screenshot for visual clarity.

| Name | Type | Description | Required |
|------|------|-------------|----------|
| api | string | This parameter is the API mode and depends on the model used and the scenario selected. *Supported values: (Completion \| Chat)* | Yes |
| connection | CustomConnection | This parameter is the name of the connection, which points to the online inferencing endpoint. | Yes |
| model_kwargs | dictionary | This input is used to provide configuration specific to the model used. For example, the Llama-02 model uses {\"temperature\":0.4}. *Default: {}* | No |
| deployment_name | string | The name of the deployment to target on the online inferencing endpoint. If no value is passed, the inferencing load balancer traffic settings are used. | No |
| prompt | string | The text prompt that the language model uses to generate its response. | Yes |

## Outputs

| API        | Return type | Description                              |
|------------|-------------|------------------------------------------|
| Completion | string      | The text of one predicted completion     |
| Chat       | string      | The text of one response in the conversation |
