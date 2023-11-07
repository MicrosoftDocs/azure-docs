---
title: Integrate with LangChain in prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to integrate with LangChain in prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Integrate with LangChain

Prompt Flow can also be used together with the [LangChain](https://python.langchain.com) python library, which is the framework for developing applications powered by LLMs, agents and dependency tools. In this document, we'll show you how to supercharge your LangChain development on our prompt Flow.

:::image type="content" source="./media/how-to-integrate-with-langchain/flow.png" alt-text="Screenshot of flows with the LangChain python library. " lightbox = "./media/how-to-integrate-with-langchain/flow.png":::

We introduce the following sections:
* [Benefits of LangChain integration](#benefits-of-langchain-integration)
* [How to convert LangChain code into flow](#how-to-convert-langchain-code-into-flow)
    * [Prerequisites for environment and runtime](#prerequisites-for-environment-and-runtime)
    * [Convert credentials to prompt flow connection](#convert-credentials-to-prompt-flow-connection)
    * [LangChain code conversion to a runnable flow](#langchain-code-conversion-to-a-runnable-flow)

## Benefits of LangChain integration

We consider the integration of LangChain and prompt flow as a powerful combination that can help you to build and test your custom language models with ease, especially in the case where you may want to use LangChain modules to initially build your flow and then use our prompt Flow to easily scale the experiments for bulk testing, evaluating then eventually deploying.

- For larger scale experiments - **Convert existed LangChain development in seconds.**
    If you have already developed demo prompt flow based on LangChain code locally, with the streamlined integration in prompt Flow, you can easily convert it into a flow for further experimentation, for example you can conduct larger scale experiments based on larger data sets.
- For more familiar flow engineering - **Build prompt flow with ease based on your familiar Python SDK**.
    If you're already familiar with the LangChain SDK and prefer to use its classes and functions directly, the intuitive flow building python node enables you to easily build flows based on your custom python code.

## How to convert LangChain code into flow

Assume that you already have your own LangChain code available locally, which is properly tested and ready for deployment. To convert it to a runnable flow on our platform, you need to follow the steps below.

### Prerequisites for environment and runtime

> [!NOTE]
> Our base image has langchain v0.0.149 installed. To use another specific version, you need to create a customized environment.

#### Create a customized environment

For more libraries import, you need to customize environment based on our base image, which should contain all the dependency packages you need for your LangChain code. You can follow this guidance to use **docker context** to build your image, and [create the custom environment](how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime) based on it in Azure Machine Learning workspace.

Then you can create a [prompt flow runtime](./how-to-create-manage-runtime.md) based on this custom environment.

:::image type="content" source="./media/how-to-integrate-with-langchain/runtime-custom-env.png" alt-text="Screenshot of flows on the runtime tab with the add compute instance runtime popup. " lightbox = "./media/how-to-integrate-with-langchain/runtime-custom-env.png":::

### Convert credentials to prompt flow connection

When developing your LangChain code, you might have [defined environment variables to store your credentials, such as the AzureOpenAI API KEY](https://python.langchain.com/docs/integrations/llms/azure_openai_example), which is necessary for invoking the AzureOpenAI model.

:::image type="content" source="./media/how-to-integrate-with-langchain/langchain-env-variables.png" alt-text="Screenshot of Azure OpenAI example in LangChain. " lightbox = "./media/how-to-integrate-with-langchain/langchain-env-variables.png":::

Instead of directly coding the credentials in your code and exposing them as environment variables when running LangChain code in the cloud, it is recommended to convert the credentials from environment variables into a connection in prompt flow. This allows you to securely store and manage the credentials separately from your code.

#### Create a connection

Create a connection that securely stores your credentials, such as your LLM API KEY or other required credentials.

1. Go to prompt flow in your workspace, then go to **connections** tab.
2. Select **Create** and select a connection type to store your credentials. (Take custom connection as an example)
    :::image type="content" source="./media/how-to-integrate-with-langchain/custom-connection-1.png" alt-text="Screenshot of flows on the connections tab highlighting the custom button in the create drop-down menu. " lightbox = "./media/how-to-integrate-with-langchain/custom-connection-1.png":::
3. In the right panel, you can define your connection name, and you can add multiple *Key-value pairs* to store your credentials and keys by selecting **Add key-value pairs**.
    :::image type="content" source="./media/how-to-integrate-with-langchain/custom-connection-2.png" alt-text="Screenshot of add custom connection point to the add key-value pairs button. " lightbox = "./media/how-to-integrate-with-langchain/custom-connection-2.png":::

> [!NOTE]
> - You can set one Key-Value pair as secret by **is secret** checked, which will be encrypted and stored in your key value.
> - Make sure at least one key-value pair is set as secret, otherwise the connection will not be created successfully.

Then this custom connection is used to replace the key and credential you explicitly defined in LangChain code, if you already have a LangChain integration Prompt flow, you can jump to​​​​​​​ [Configure connection, input and output](#configure-connection-input-and-output).


### LangChain code conversion to a runnable flow

All LangChain code can directly run in the Python tools in your flow as long as your runtime environment contains the dependency packages, you can easily convert your LangChain code into a flow by following the steps below.

#### Convert LangChain code to flow structure

> [!NOTE]
> There are two ways to convert your LangChain code into a flow.

- To simplify the conversion process, you can directly initialize the LLM model for invocation in a Python node by utilizing the LangChain integrated LLM library.
- Another approach is converting your LLM consuming from LangChain code to our LLM tools in the flow, for better further experimental management.

For quick conversion of LangChain code into a flow, we recommend two types of flow structures, based on the use case:

|| Types | Desc | Case |
|-------| -------- | -------- | -------- |
|**Type A**| A flow that includes both **prompt nodes** and **python nodes**| You can extract your prompt template from your code into a prompt node, then combine the remaining code in a single Python node or multiple Python tools. | This structure is ideal for who want to easily **tune the prompt** by running flow variants and then choose the optimal one based on evaluation results.|
|**Type B**| A flow that includes **python nodes** only| You can create a new flow with python nodes only, all code including prompt definition will run in python nodes.| This structure is suitable for who don't need to explicit tune the prompt in workspace, but require faster batch testing based on larger scale datasets. |

For example the type A flow from the chart is like:

:::image type="content" source="./media/how-to-integrate-with-langchain/flow-node-a-1.png" alt-text="Screenshot of flows highlighting the prompt button and system template. " lightbox = "./media/how-to-integrate-with-langchain/flow-node-a-1.png":::

:::image type="content" source="./media/how-to-integrate-with-langchain/flow-node-a-2.png" alt-text="Screenshot of system template showing variant one and zero with the finish tuning button highlighted. " lightbox = "./media/how-to-integrate-with-langchain/flow-node-a-2.png":::

While the type B flow would look like:

:::image type="content" source="./media/how-to-integrate-with-langchain/flow-node-b.png" alt-text="Screenshot of flows showing the LangChain code node and graph. " lightbox = "./media/how-to-integrate-with-langchain/flow-node-b.png":::


To create a flow in Azure Machine Learning, you can go to your workspace, then select **Prompt flow** in the left navigation, then select **Create** to create a new flow. More detailed guidance on how to create a flow is introduced in [Create a Flow](how-to-develop-a-standard-flow.md).

#### Configure connection, input and output

After you have a properly structured flow and are done moving the code to specific tool nodes, you need to replace the original environment variables with the corresponding key in the connection, and configure the input and output of the flow.

**Configure connection**

To utilize a connection that replaces the environment variables you originally defined in LangChain code, you need to import promptflow connection library `promptflow.connections` in the python node. 

For example:

If you have a LangChain code that consumes the AzureOpenAI model, you can replace the environment variables with the corresponding key in the Azure OpenAI connection:

Import library `from promptflow.connections import AzureOpenAIConnection`

:::image type="content" source="./media/how-to-integrate-with-langchain/code-consume-aoai.png" alt-text="Screenshot of LangChain code in prompt flow. " lightbox = "./media/how-to-integrate-with-langchain/code-consume-aoai.png":::


For custom connection, you need to follow the steps:

1. Import library `from promptflow.connections import CustomConnection`, and define an input parameter of type `CustomConnection` in the tool function.
    :::image type="content" source="./media/how-to-integrate-with-langchain/custom-connection-python-node-1.png" alt-text="Screenshot of doc search chain node highlighting the custom connection. " lightbox = "./media/how-to-integrate-with-langchain/custom-connection-python-node-1.png":::
1. Parse the input to the input section, then select your target custom connection in the value dropdown.
    :::image type="content" source="./media/how-to-integrate-with-langchain/custom-connection-python-node-2.png" alt-text="Screenshot of the chain node highlighting the connection. " lightbox = "./media/how-to-integrate-with-langchain/custom-connection-python-node-2.png":::
1. Replace the environment variables that originally defined the key and credential with the corresponding key added in the connection.
1. Save and return to authoring page, and configure the connection parameter in the node input.

**Configure input and output**

Before running the flow, configure the **node input and output**, as well as the overall **flow input and output**. This step is crucial to ensure that all the required data is properly passed through the flow and that the desired results are obtained.

## Next steps

- [Langchain](https://langchain.com)
- [Create a Custom Environment](./how-to-customize-environment-runtime.md#customize-environment-with-docker-context-for-runtime)
- [Create a Runtime](./how-to-create-manage-runtime.md)
