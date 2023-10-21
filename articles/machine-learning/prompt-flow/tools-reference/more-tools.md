---
title: More tools in Prompt flow
titleSuffix: Azure Machine Learning
description: More tools in Prompt flow are displayed in the table, along with instructions for custom tool package creation and tool package usage.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: ChenJieting
ms.author: chenjieting
ms.reviewer: lagayhar
ms.date: 10/24/2023
---

# More tools in Prompt flow (preview)
This table provides an index of more tools. If existing tools can't meet your requirements, you can follow [this guidance](https://microsoft.github.io/promptflow/how-to-guides/develop-a-tool/create-and-use-tool-package.html) to develop your own custom tool and make it a tool package. 

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

<table>
    <tr>
        <th width="10%">Type</th>
        <th width="25%">Tool name</th>
        <th width="35%">Description</th>
        <th width="30%">Package Name</th>
    </tr>
    <tr>
        <td rowspan="10">Curated</td>
        <td><a href="./python-tool.md">Python</a></td>
        <td>Run Python code.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./llm-tool.md">LLM</a></td>
        <td>Use Open AI's Large Language Model for text completion or chat.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./prompt-tool.md">Prompt</a></td>
        <td>Craft prompt using Jinja as the templating language.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./embedding-tool.md">Embedding</a></td>
        <td>Use Open AI's embedding model to create an embedding vector representing the input text.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./open-source-llm-tool.md">Open Source LLM</a></td>
        <td>Use an Open Source model from the Azure Model catalog, deployed to an Azure Machine Learning Online Endpoint for LLM Chat or Completion API calls.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./serp-api-tool.md">Serp API</a></td>
        <td>Use Serp API to obtain search results from a specific search engine.</td>
        <td>--</td>
    </tr>
    <tr>
        <td><a href="./content-safety-text-tool.md">Content Safety (Text)</a></td>
        <td>Use Azure Content Safety to detect harmful content.</td>
        <td>promptflow-contentsafety</td>
    </tr>
    <tr>
        <td><a href="./faiss-index-lookup-tool.md">Faiss Index Lookup</a></td>
        <td>Search vector based query from the FAISS index file.</td>
        <td rowspan="3">promptflow-vectordb</td>
    </tr>
    <tr>
        <td><a href="./vector-db-lookup-tool.md">Vector DB Lookup</a></td>
        <td>Search vector based query from existing Vector Database.</td>
    </tr>
    <tr>
        <td><a href="./vector-index-lookup-tool.md">Vector Index Lookup</a></td>
        <td>Search text or vector based query from Azure Machine Learning Vector Index.</td>
    </tr>
</table>

You can also visit [this page](https://microsoft.github.io/promptflow/integrations/tools/index.html) to discover more custom tools that developed by the open source community.

For curated tools, no extra actions are required to utilize them in your environments. But for custom tools, you need to install them first with the guidance [How to install the custom tool package](../how-to-custom-tool-package-creation-and-usage.md#prepare-runtime).

