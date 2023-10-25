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

Prompt flow is a development framework designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). Prompt flow provides a comprehensive solution that simplifies the process of prototyping, experimenting, iterating, and deploying your AI applications.

With prompt flow, you can:

- Orchestrate executable flows with LLMs, prompts, and Python tools through a visualized graph.
- Debug, share, and iterate your flows with ease through team collaboration.
- Create prompt variants and compare their performance.

In this article, you learn how to create and develop your first prompt flow in your Azure AI Studio project. For more information about prompt flow, see [Prompt flow concepts](../concepts/prompt-flow.md).

## Prerequisites

- Create an Azure AI Studio project
- Create a compute instance
- Create a runtime. Runtime serves as the compute resource required to run the prompt flow, which includes a Docker image that contains all necessary dependency packages. 

## Build your flow

On your **Project** page, select **Flows** tab in the left navigation bar. Once you are in the **Flows**, select **Create** to create your first Prompt flow. You can create a flow by either cloning the samples available in the gallery or creating a flow from scratch. 

### Authoring the flow

At the left, it's the flatten view, the main working area where you can author the flow, for example add tools in your flow, edit the prompt, set the flow input data, run your flow, view the output, etc. 


At the right, it's the graph view for visualization only. It shows the flow structure you're developing. You can zoom in, zoom out, auto layout, etc.

> [!NOTE]
> You cannot edit the graph view. To edit one node, you can double-click the node to locate to the corresponding node card in the flatten view, then do the inline editing.


### Flow input and output

Flow input is the data passed into the flow as a whole. Define the input schema by specifying the name and type.  Set the input value of each input to test the flow. You can reference the flow input later in the flow nodes using `${input.[input name]}` syntax. 

Flow output is the data produced by the flow as a whole, which summarizes the results of the flow execution. You can view and export the output table after the flow run or batch run is completed.  Define flow output value by referencing the flow single node output using syntax `${[node name].output}` or `${[node name].output.[field name]}`.


### Test the flow
You can test the flow in two ways: run single node or run the whole flow. 

To run a single node, select the **Run** icon on node in flatten view. Once running is completed, check output in node output section.

To run the whole flow, select the **Run** button at the right top. Then you can check the run status and output of each node, and the results of flow outputs defined in the flow. You can always change the flow input value and run the flow again.

## Develop your prompt flow locally with code experience

Prompt flow allows you to develop your flow locally with code experience. You can use the prompt flow SDK and CLI to create, edit, run your flow locally, and visualize the results.

To use the prompt flow SDK, you should first install the SDK package. You can install the SDK package from PyPI using `pip install promptflow promptflow-tools`.

To get the code examples, you should:

Clone the repository from [GitHub - microsoft/promptflow](https://github.com/microsoft/promptflow/tree/main/docs).
```sh
git clone https://github.com/microsoft/promptflow.git
```
For more instructions, please refer to [prompt flow local development guides](https://github.com/microsoft/promptflow/tree/main/docs/how-to-guides).

## Next steps

- [Prompt flow concepts](../concepts/prompt-flow.md)
- [Prompt flow GitHub repository for local development](https://github.com/microsoft/promptflow/tree/main/docs)
- [Prompt flow SDK examples](https://github.com/microsoft/promptflow/tree/main/examples)



