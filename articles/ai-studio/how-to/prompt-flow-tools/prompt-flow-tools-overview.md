---
title: Overview of prompt flow tools in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn about prompt flow tools that are available in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: overview
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Overview of prompt flow tools in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

The following table provides an index of tools in prompt flow.

| Tool name | Description | Package name |
|------|-----------|-------------|--------------|
| [LLM](./llm-tool.md) | Use large language models (LLM) with the Azure OpenAI Service for tasks such as text completion or chat. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Prompt](./prompt-tool.md) | Craft a prompt by using Jinja as the templating language. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Python](./python-tool.md) | Run Python code. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Azure OpenAI GPT-4 Turbo with Vision](./azure-open-ai-gpt-4v-tool.md) | Use an Azure OpenAI GPT-4 Turbo with Vision model deployment to analyze images and provide textual responses to questions about them. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Content Safety (Text)](./content-safety-tool.md) | Use Azure AI Content Safety to detect harmful content. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Embedding](./embedding-tool.md) | Use Azure OpenAI embedding models to create an embedding vector that represents the input text. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Serp API](./serp-api-tool.md) | Use Serp API to obtain search results from a specific search engine. | [promptflow-tools](https://pypi.org/project/promptflow-tools/) |
| [Index Lookup](./index-lookup-tool.md) | Search a vector-based query for relevant results using one or more text queries. | [promptflow-vectordb](https://pypi.org/project/promptflow-vectordb/) |

<sup>1</sup> The Index Lookup tool replaces the three deprecated legacy index tools: Vector Index Lookup, Vector DB Lookup, and Faiss Index Lookup. If you have a flow that contains one of those tools, follow the [migration steps](./index-lookup-tool.md#migrate-from-legacy-tools-to-the-index-lookup-tool) to upgrade your flow.

## Custom tools

To discover more custom tools developed by the open-source community such as [Azure AI Language tools](https://pypi.org/project/promptflow-azure-ai-language/), see [More custom tools](https://microsoft.github.io/promptflow/integrations/tools/index.html).

- If existing tools don't meet your requirements, you can [develop your own custom tool and make a tool package](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html).
- To install the custom tools, if you're using the automatic compute session, you can readily install the publicly released package by adding the custom tool package name in the `requirements.txt` file in the flow folder. Then select **Save and install** to start installation. After completion, the custom tools appear in the tool list. If you want to use a local or private feed package, build an image first, and then set up the compute session based on your image. To learn more, see [How to create and manage a compute session](../create-manage-compute-session.md).

   :::image type="content" source="../../media/prompt-flow/install-package-on-automatic-compute-session.png" alt-text="Screenshot that shows how to install packages on automatic compute session."lightbox = "../../media/prompt-flow/install-package-on-automatic-compute-session.png":::

## Next steps

- [Create a flow](../flow-develop.md)
- [Build your own copilot using prompt flow](../../tutorials/deploy-copilot-ai-studio.md)
