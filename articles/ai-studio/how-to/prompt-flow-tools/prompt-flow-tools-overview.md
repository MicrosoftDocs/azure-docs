---
title: Overview of prompt flow tools in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about prompt flow tools that are available in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 12/6/2023
ms.author: eur
---

# Overview of prompt flow tools in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The following table provides an index of tools in prompt flow. If existing tools don't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html).

| Tool name | Description | Environment | Package name |
|------|-----------|-------------|--------------|
| [LLM](./llm-tool.md) | Use Azure Open AI large language models (LLM) for tasks such as text completion or chat. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Craft a prompt by using Jinja as the templating language. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Python](./python-tool.md) | Run Python code. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Vector Index Lookup](./vector-index-lookup-tool.md) | Search text or a vector-based query from a vector index. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Content Safety (Text)](./content-safety-tool.md) | Use Azure AI Content Safety to detect harmful content. | Default | [promptflow-tools](https://pypi.org/project/promptflow-contentsafety/) |
| [Faiss Index Lookup](./faiss-index-lookup-tool.md) | Search a vector-based query from the Faiss index file. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector DB Lookup](./vector-db-lookup-tool.md) | Search a vector-based query from an existing vector database. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Embedding](./embedding-tool.md) | Use Azure Open AI embedding models to create an embedding vector that represents the input text. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Use Serp API to obtain search results from a specific search engine. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |

To discover more custom tools developed by the open-source community, see [More custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

## Next steps

- [Create a flow](../flow-develop.md)
- [Build your own copilot using prompt flow](../../tutorials/deploy-copilot-ai-studio.md)
