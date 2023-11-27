---
title: The overview of tools in prompt flow
titleSuffix: Azure Machine Learning
description: The overview of tools in prompt flow displays an index table for tools and the instructions for custom tool package creation and tool package usage.
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

# The overview of tools in prompt flow
This table provides an index of tools in prompt flow. If existing tools can't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html). 


| Tool name | Description | Environment | Package Name |
|------|-----------|-------------|--------------|
| [Python](./python-tool.md) | Run Python code. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [LLM](./llm-tool.md) | Use Open AI's Large Language Model for text completion or chat. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Craft prompt using Jinja as the templating language. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Embedding](./embedding-tool.md) | Use Open AI's embedding model to create an embedding vector representing the input text. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Open Source LLM](./open-source-llm-tool.md) | Use an Open Source model from the Azure Model catalog, deployed to an Azure Machine Learning Online Endpoint for LLM Chat or Completion API calls. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Use Serp API to obtain search results from a specific search engine. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Content Safety (Text)](./content-safety-text-tool.md) | Use Azure Content Safety to detect harmful content. | Default | [promptflow-contentsafety](https://pypi.org/project/promptflow-contentsafety/) |
| [Faiss Index Lookup](./faiss-index-lookup-tool.md) | Search vector based query from the FAISS index file. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector DB Lookup](./vector-db-lookup-tool.md) | Search vector based query from existing Vector Database. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector Index Lookup](./vector-index-lookup-tool.md) | Search text or vector based query from Azure Machine Learning Vector Index. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |

To discover more custom tools that developed by the open source community, see [more custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

For the tools that should be utilized in the custom environment, see [Custom tool package creation and usage](../how-to-custom-tool-package-creation-and-usage.md#prepare-runtime) to prepare the runtime. Then the tools can be displayed in the tool list.
