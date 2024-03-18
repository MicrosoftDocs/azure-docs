---
title: Overview of prompt flow tools in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about prompt flow tools that are available in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 2/6/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Overview of prompt flow tools in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The following table provides an index of tools in prompt flow. 

| Tool (set) name | Description | Environment | Package name |
|------|-----------|-------------|--------------|
| [LLM](./llm-tool.md) | Use Azure OpenAI large language models (LLM) for tasks such as text completion or chat. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Craft a prompt by using Jinja as the templating language. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Python](./python-tool.md) | Run Python code. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Azure OpenAI GPT-4 Turbo with Vision](./azure-open-ai-gpt-4v-tool.md) | Use AzureOpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Content Safety (Text)](./content-safety-tool.md) | Use Azure AI Content Safety to detect harmful content. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Index Lookup*](./index-lookup-tool.md) | Search an Azure Machine Learning Vector Index for relevant results using one or more text queries. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector Index Lookup*](./vector-index-lookup-tool.md) | Search text or a vector-based query from a vector index. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Faiss Index Lookup*](./faiss-index-lookup-tool.md) | Search a vector-based query from the Faiss index file. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Vector DB Lookup*](./vector-db-lookup-tool.md) | Search a vector-based query from an existing vector database. | Default | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |
| [Embedding](./embedding-tool.md) | Use Azure OpenAI embedding models to create an embedding vector that represents the input text. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Use Serp API to obtain search results from a specific search engine. | Default | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Azure AI Language tools*](https://microsoft.github.io/promptflow/integrations/tools/azure-ai-language-tool.html) | This collection of tools is a wrapper for various Azure AI Language APIs, which can help effectively understand and analyze documents and conversations. The capabilities currently supported include: Abstractive Summarization, Extractive Summarization, Conversation Summarization, Entity Recognition, Key Phrase Extraction, Language Detection, PII Entity Recognition, Conversational PII, Sentiment Analysis, Conversational Language Understanding, Translator. You can learn how to use them by the [Sample flows](https://github.com/microsoft/promptflow/tree/e4542f6ff5d223d9800a3687a7cfd62531a9607c/examples/flows/integrations/azure-ai-language). Support contact: taincidents@microsoft.com | Custom | [promptflow-azure-ai-language](https://pypi.org/project/promptflow-azure-ai-language/) |

_*The asterisk marks indicate custom tools, which are created by the community that extend prompt flow's capabilities for specific use cases. They aren't officially maintained or endorsed by prompt flow team. When you encounter questions or issues for these tools, please prioritize using the support contact if it is provided in the description._

To discover more custom tools developed by the open-source community, see [More custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

## Remarks
- If existing tools don't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html).
- To install the custom tools, if you're using the automatic runtime, you can readily install the publicly released package by adding the custom tool package name into the `requirements.txt` file in the flow folder. Then select the **Save and install** button to start installation. After completion, you can see the custom tools displayed in the tool list. In addition, if you want to use local or private feed package, please build an image first, then set up the runtime based on your image. To learn more, see [How to create and manage a runtime](../create-manage-runtime.md).
:::image type="content" source="../../media/prompt-flow/install-package-on-automatic-runtime.png" alt-text="Screenshot of how to install packages on automatic runtime."lightbox = "../../media/prompt-flow/install-package-on-automatic-runtime.png":::

## Next steps

- [Create a flow](../flow-develop.md)
- [Build your own copilot using prompt flow](../../tutorials/deploy-copilot-ai-studio.md)
