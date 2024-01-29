---
title: Overview of prompt flow tools in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about prompt flow tools that are available in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 12/6/2023
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Overview of prompt flow tools in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The following table provides an index of tools in prompt flow. 

| Tool name | Description | Environment | Package name |
|------|-----------|-------------|--------------|
| [LLM](./llm-tool.md) | Use Azure Open AI large language models (LLM) for tasks such as text completion or chat. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Craft a prompt by using Jinja as the templating language. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Python](./python-tool.md) | Run Python code. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Azure OpenAI GPT-4 Turbo with Vision](./azure-open-ai-gpt-4v-tool.md) | Use AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Vector Index Lookup](./vector-index-lookup-tool.md) | Search text or a vector-based query from a vector index. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Content Safety (Text)](./content-safety-tool.md) | Use Azure AI Content Safety to detect harmful content. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Faiss Index Lookup](./faiss-index-lookup-tool.md) | Search a vector-based query from the Faiss index file. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector DB Lookup](./vector-db-lookup-tool.md) | Search a vector-based query from an existing vector database. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Embedding](./embedding-tool.md) | Use Azure Open AI embedding models to create an embedding vector that represents the input text. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Use Serp API to obtain search results from a specific search engine. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |

To discover more custom tools developed by the open-source community, see [More custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

## Remarks
- If existing tools don't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html).
- To install the custom tools, if you are using the automatic runtime, you can readily install the package by adding the custom tool package name into the `requirements.txt` file in the flow folder. Then select the **Save and install** button to start installation. After completion, you can see the custom tools displayed in the tool list. To learn more, see [How to create and manage a runtime](../create-manage-runtime.md).
:::image type="content" source="./media/prompt-flow-tools-overview/install-package-on-automatic-runtime.png" alt-text="Screenshot of how to install packages on automatic runtime."lightbox = "./media/prompt-flow-tools-overview/install-package-on-automatic-runtime.png":::

## Next steps

- [Create a flow](../flow-develop.md)
- [Build your own copilot using prompt flow](../../tutorials/deploy-copilot-ai-studio.md)
