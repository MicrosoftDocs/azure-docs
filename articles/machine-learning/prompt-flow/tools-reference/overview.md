---
title: Overview of tools in prompt flow
titleSuffix: Azure Machine Learning
description: This overview of the tools in prompt flow includes an index table for tools and the instructions for custom tool package creation and tool package usage.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: reference
author: ChenJieting
ms.author: chenjieting
ms.reviewer: lagayhar
ms.date: 10/24/2023
---

# Overview of tools in prompt flow

The following table provides an index of tools in prompt flow. If existing tools don't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html).

| Tool name | Description | Environment | Package name |
|------|-----------|-------------|--------------|
| [Python](./python-tool.md) | Runs Python code. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [LLM](./llm-tool.md) | Uses Open AI's large language model (LLM) for text completion or chat. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Crafts a prompt by using Jinja as the templating language. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Embedding](./embedding-tool.md) | Uses Open AI's embedding model to create an embedding vector that represents the input text. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Open Model LLM](./open-model-llm-tool.md) | Uses an open-source model from the Azure Model catalog, deployed to an Azure Machine Learning online endpoint for large language model Chat or Completion API calls. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Uses Serp API to obtain search results from a specific search engine. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Content Safety (Text)](./content-safety-text-tool.md) | Uses Azure Content Safety to detect harmful content. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Azure OpenAI GPT-4 Turbo with Vision (preview)](./aoai-gpt-4v-tool.md) | Use AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Faiss Index Lookup](./faiss-index-lookup-tool.md) | Searches a vector-based query from the Faiss index file. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector DB Lookup](./vector-db-lookup-tool.md) | Searches a vector-based query from existing vector database. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector Index Lookup](./vector-index-lookup-tool.md) | Searches text or a vector-based query from Azure Machine Learning vector index. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |

To discover more custom tools developed by the open-source community, see [More custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

For the tools to use in the custom environment, see [Custom tool package creation and usage](../how-to-custom-tool-package-creation-and-usage.md#prepare-runtime) to prepare the runtime. Then the tools can be displayed in the tool list.
