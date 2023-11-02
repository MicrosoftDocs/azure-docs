---
title: Prompt flow in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces prompt flow in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Prompt flow in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Prompt flow is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). Prompt flow provides a comprehensive solution that simplifies the process of prototyping, experimenting, iterating, and deploying your AI applications.

Prompt flow is available independently as an open-source project on [GitHub](https://github.com/microsoft/promptflow), with it's own SDK and [VS Code extension](https://marketplace.visualstudio.com/items?itemName=prompt-flow.prompt-flow). Prompt flow is also available and recommended to use as a feature within both [Azure AI Studio](https://aka.ms/AzureAIStudio) and [Azure Machine Learning studio](https://aka.ms/AzureAIStudio). This set of documentation focuses on prompt flow in Azure AI Studio.

Definitions:
- *Prompt flow* is a feature that can be used to generate, customize, or run a flow.
- A *flow* is an executable instruction set that can implement the AI logic.​​ Flows can be created or run via multiple tools, like a prebuilt canvas, LangChain, etcetera. Iterations of a flow can be saved as assets; once deployed a flow becomes an API. Not all flows are prompt flows; rather, prompt flow is one way to create a flow. 
- A *prompt* is a package of input sent to a model, consisting of the user input, system message, and any examples. User input is text submitted in the chat window. System message is a set of instructions to the model scoping its behaviors and functionality.
- A *sample flow* is a simple, prebuilt orchestration flow that shows how flows work, and can be customized. 
- A *sample prompt* is a defined prompt for a specific scenario that can be copied from a library and used as-is or modified in prompt design. 


## Benefits of prompt flow
With prompt flow in Azure AI Studio, you can:

- Orchestrate executable flows with LLMs, prompts, and Python tools through a visualized graph.
- Debug, share, and iterate your flows with ease through team collaboration.
- Create prompt variants and compare their performance.

### Prompt engineering agility

- Interactive authoring experience: Prompt flow provides a visual representation of the flow's structure, allowing you to easily understand and navigate projects. 
- Variants for prompt tuning: You can create and compare multiple prompt variants, facilitating an iterative refinement process.
- Evaluation: Built-in evaluation flows enable you to assess the quality and effectiveness of their prompts and flows.
- Comprehensive resources: Prompt flow includes a library of built-in tools, samples, and templates that serve as a starting point for development, inspiring creativity and accelerating the process.

### Enterprise readiness

- Collaboration: Prompt flow supports team collaboration, allowing multiple users to work together on prompt engineering projects, share knowledge, and maintain version control.
- All-in-one platform: Prompt flow streamlines the entire prompt engineering process, from development and evaluation to deployment and monitoring. You can effortlessly deploy their flows as Azure AI endpoints and monitor their performance in real-time, ensuring optimal operation and continuous improvement.
- Enterprise Readiness Solutions: Prompt flow applies robust Azure AI enterprise readiness solutions, providing a secure, scalable, and reliable foundation for the development, experimentation, and deployment of flows.

With prompt flow in Azure AI Studio, you can unleash prompt engineering agility, collaborate effectively, and apply enterprise-grade solutions for successful LLM-based application development and deployment.


## Flow development lifecycle

Prompt flow offers a well-defined process that facilitates the seamless development of AI applications. By using it, you can effectively progress through the stages of developing, testing, tuning, and deploying flows, ultimately resulting in the creation of fully fledged AI applications.

The lifecycle consists of the following stages:

- Initialization: Identify the business use case, collect sample data, learn to build a basic prompt, and develop a flow that extends its capabilities.
- Experimentation: Run the flow against sample data, evaluate the prompt's performance, and iterate on the flow if necessary. Continuously experiment until satisfied with the results.
- Evaluation and refinement: Assess the flow's performance by running it against a larger dataset, evaluate the prompt's effectiveness, and refine as needed. Proceed to the next stage if the results meet the desired criteria.
- Production: Optimize the flow for efficiency and effectiveness, deploy it, monitor performance in a production environment, and gather usage data and feedback. Use this information to improve the flow and contribute to earlier stages for further iterations.

By following this structured and methodical approach, prompt flow empowers you to develop, rigorously test, fine-tune, and deploy flows with confidence, resulting in the creation of robust and sophisticated AI applications.

## Flow types

In Azure AI Studio, you can start a new flow by selecting a flow type or a template from the gallery. 

:::image type="content" source="../media/prompt-flow/init-type-or-gallery.png" alt-text="Screenshot of example flow types and templates from the gallery" lightbox="../media/prompt-flow/init-type-or-gallery.png":::

Here are some examples of flow types:

- **Standard flow**: Designed for general application development, the standard flow allows you to create a flow using a wide range of built-in tools for developing LLM-based applications. It provides flexibility and versatility for developing applications across different domains.
- **Chat flow**: Tailored for conversational application development, the Chat flow builds upon the capabilities of the standard flow and provides enhanced support for chat inputs/outputs and chat history management. With native conversation mode and built-in features, you can seamlessly develop and debug their applications within a conversational context.
- **Evaluation flow**: Designed for evaluation scenarios, the evaluation flow enables you to create a flow that takes the outputs of previous flow runs as inputs. This flow type allows you to evaluate the performance of previous run results and output relevant metrics, facilitating the assessment and improvement of their models or applications.


## Flows

A flow in Prompt flow serves as an executable workflow that streamlines the development of your LLM-based AI application. It provides a comprehensive framework for managing data flow and processing within your application.

Within a flow, nodes take center stage, representing specific tools with unique capabilities. These nodes handle data processing, task execution, and algorithmic operations, with inputs and outputs. By connecting nodes, you establish a seamless chain of operations that guides the flow of data through your application.

To facilitate node configuration and fine-tuning, a visual representation of the workflow structure is provided through a DAG (Directed Acyclic Graph) graph. This graph showcases the connectivity and dependencies between nodes, providing a clear overview of the entire workflow.

:::image type="content" source="../media/prompt-flow/dag-graph-example.png" alt-text="Screenshot of an example directed acyclic graph in prompt flow editor" lightbox="../media/prompt-flow/dag-graph-example.png":::

With the flow feature in Prompt flow, you have the power to design, customize, and optimize the logic of your AI application. The cohesive arrangement of nodes ensures efficient data processing and effective flow management, empowering you to create robust and advanced applications.

## Prompt flow tools

Tools are the fundamental building blocks of a flow.

In Azure AI Studio, tool options include the [LLM tool](../how-to/prompt-flow-tools/llm-tool.md), [Prompt tool](../how-to/prompt-flow-tools/prompt-tool.md), [Python tool](../how-to/prompt-flow-tools/python-tool.md), and more.

:::image type="content" source="../media/prompt-flow/tool-options.png" alt-text="Screenshot of tool options in prompt flow editor" lightbox="../media/prompt-flow/tool-options.png":::

Each tool is a simple, executable unit with a specific function. By combining different tools, you can create a flow that accomplishes a wide range of goals. For example, you can use the LLM tool to generate text or summarize an article and the Python tool to process the text to inform the next flow component or result.

One of the key benefit of Prompt flow tools is their seamless integration with third-party APIs and python open source packages. This not only improves the functionality of large language models but also makes the development process more efficient for developers.

If the prompt flow tools in Azure AI Studio don't meet your requirements, you can follow [this guide](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html) to develop your own custom tool and make it a tool package. To discover more custom tools developed by the open source community, visit [this page](https://microsoft.github.io/promptflow/integrations/tools/index.html).


## Next steps

- [Build with prompt flow in Azure AI Studio](flow-develop.md)
- [Get started with prompt flow in VS Code](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html)
