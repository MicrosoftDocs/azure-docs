---
title: How to build with prompt flow
titleSuffix: Azure AI services
description: This article provides instructions on how to build with prompt flow.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to build with prompt flow

Prompt flow is a development framework designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). As the momentum for LLM-based AI applications continues to grow across the globe, prompt flow provides a comprehensive solution that simplifies the process of prototyping, experimenting, iterating, and deploying your AI applications.

With prompt flow, you'll be able to:

- Orchestrate executable flows with LLMs, prompts, and Python tools through a visualized graph.
- Debug, share, and iterate your flows with ease through team collaboration.
- Create prompt variants and compare their performance.

In this article, you'll learn how to create and develop your first prompt flow in your Azure AI Studio project.

## Prompt flow tools

Tools are the fundamental building blocks of prompt flow in Azure AI Studio. Each tool is a simple, executable unit with a specific function. By combining different tools, you can create a flow that accomplishes a wide range of goals.

Prompt flow tools has seamless integration with third-party APIs and Python open source packages. Tools improve the functionality of large language models and makes the development process more efficient.

Prompt flow provides different kinds of tools:

- LLM tool: The LLM tool allows you to write custom prompts and leverage large language models to achieve specific goals, such as summarizing articles, generating customer support responses, and more.
- Python tool: The Python tool enables you to write custom Python functions to perform various tasks, such as fetching web pages, processing intermediate data, calling third-party APIs, and more.
- Prompt tool: The Prompt tool allows you to prepare a prompt as a string for more complex use cases or for use in conjunction with other prompt tools or python tools.


## Runtime: Select existing runtime or create a new one

Before you start authoring, you should first select a runtime. Runtime serves as the compute resource required to run the prompt flow, which includes a Docker image that contains all necessary dependency packages. It's a must-have for flow execution. 

You can select an existing runtime from the dropdown or click on the **Add runtime** button. This will open up a Runtime creation wizard. Select an existing compute instance from the dropdown or create a new one. After this, you will have to select an environment to create the runtime. We recommend using default environment to get started quickly. 


## Create and develop your Prompt flow

On your **Project** page, select **Flows** tab in the left navigation bar. Once you are in the **Flows**, select **Create** to create your first Prompt flow. You can create a flow by either cloning the samples available in the gallery or creating a flow from scratch. 

### Authoring the flow

At the left, it's the flatten view, the main working area where you can author the flow, for example add tools in your flow, edit the prompt, set the flow input data, run your flow, view the output, etc. 


At the right, it's the graph view for visualization only. It shows the flow structure you're developing. You can zoom in, zoom out, auto layout, etc.

> [!NOTE]
> You cannot edit the graph view. To edit one node, you can double-click the node to locate to the corresponding node card in the flatten view, then do the inline editing.


### Flow input and output

Flow input is the data passed into the flow as a whole. Define the input schema by specifying the name and type.  Set the input value of each input to test the flow. You can reference the flow input later in the flow nodes using `${input.[input name]}` syntax. 

Flow output is the data produced by the flow as a whole, which summarizes the results of the flow execution. You can view and export the output table after the flow run or batch run is completed.  Define flow output value by referencing the flow single node output using syntax `${[node name].output}` or `${[node name].output.[field name]}`.

### Develop the flow using different tools

In a flow, you can consume different kinds of tools, for example, LLM, Python, Serp API, Content Safety, Vector Search and etc.

By selecting a tool, you'll add a new node to flow. You should specify the node name, and set necessary configurations for the node. For example, for LLM node, you need to select a connection, select a deployment, set the prompt, etc. For Python node, you need to set the Python script, set the input value, etc. 

LLM and Prompt tool supports you to use **Jinja** as templating language to dynamically generate the prompt. For example, you can use `{{}}` to enclose your input name, instead of fixed text, so it can be replaced on the fly.

To use Python tool, you should define a Python function with inputs and outputs.

After you set the prompt or Python script, you can click **Validate and parse input** so the system will automatically parse the node input for you based on the prompt template and python function input.The node input value can be set in following ways:
* Set the value directly in the input box
* Reference the flow input using `${input.[input name]}` syntax
* Reference the node output using `${[node name].output}` or `${[node name].output.[field name]}` syntax

### Test the flow
You can test the flow in two ways: run single node or run the whole flow. 

To run a single node, select the **Run** icon on node in flatten view. Once running is completed, check output in node output section.

To run the whole flow, select the **Run** button at the right top. Then you can check the run status and output of each node, as well as the results of flow outputs defined in the flow. You can always change the flow input value and run the flow again.

![View flow output](./media/flow-output.png)


## Develop your prompt flow locally with code experience

Prompt flow allows you to develop your flow locally with code experience. You can use the prompt flow SDK and CLI to create, edit, run your flow locally, and visualize the results.

To use the prompt flow SDK, you should first install the SDK package. You can install the SDK package from PyPI using `pip install promptflow promptflow-tools`.

To get the code examples, you should:

Clone the repository from [GitHub - microsoft/promptflow](https://github.com/microsoft/promptflow/tree/main/docs).
```sh
git clone https://github.com/microsoft/promptflow.git
```
For more instructions, please refer to [prompt flow local development guides](https://github.com/microsoft/promptflow/tree/main/docs/how-to-guides).

## Resources

- [Prompt flow concepts](../concepts/prompt-flow.md)
- [Prompt flow Github repository for local development](https://github.com/microsoft/promptflow/tree/main/docs)
- [Prompt flow SDK examples](https://github.com/microsoft/promptflow/tree/main/examples)



