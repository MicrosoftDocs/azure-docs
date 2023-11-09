---
title: Create a vector index in an Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to create a vector index in Azure Machine Learning and use it in a prompt flow.
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: how-to
ms.custom: prompt-flow
---

# Create a vector index in an Azure Machine Learning prompt flow (preview)

You can use Azure Machine Learning to create a vector index from files or folders on your machine, a location in cloud storage, an Azure Machine Learning data asset, a Git repository, or a SQL database. Azure Machine Learning can currently process .txt, .md, .pdf, .xls, and .docx files. You can also reuse an existing Azure AI Search (formerly Cognitive Search) index instead of creating a new index.

When you create a vector index, Azure Machine Learning chunks the data, creates embeddings, and stores the embeddings in a Faiss index or Azure AI Search index. In addition, Azure Machine Learning creates:

* Test data for your data source.

* A sample prompt flow, which uses the vector index that you created. Features of the sample prompt flow include:

  * Automatically generated prompt variants.
  * Evaluation of each prompt variant by using the [generated test data](https://aka.ms/prompt_flow_blog).
  * Metrics against each prompt variant to help you choose the best variant to run.

  You can use this sample to continue developing your prompt.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Access to Azure OpenAI Service.

* Prompt flows enabled in your Azure Machine Learning workspace. You can enable prompt flows by turning on **Build AI solutions with Prompt flow** on the **Manage preview features** panel.

## Create a vector index by using Machine Learning studio

1. Select **Prompt flow** on the left menu.

    :::image type="content" source="media/how-to-create-vector-index/prompt.png" alt-text="Screenshot that shows the location of prompt flow on the left menu.":::

1. Select the **Vector Index** tab.

    :::image type="content" source="./media/how-to-create-vector-index/vector-index.png" alt-text="Screenshot that shows the tab for vector index.":::

1. Select **Create**.

1. When the form for creating a vector index opens, provide a name for your vector index.

    :::image type="content" source="media/how-to-create-vector-index/new-vector-creation.png" alt-text="Screenshot that shows basic settings for creating a vector index.":::

1. Select your data source type.

1. Based on the chosen type, provide the location details of your source. Then, select **Next**.

1. Review the details of your vector index, and then select the **Create** button.

1. On the overview page that appears, you can track and view the status of creating your vector index. The process might take a while, depending on the size of your data.

## Add a vector index to a prompt flow

After you create a vector index, you can add it to a prompt flow from the prompt flow canvas.

1. Open an existing prompt flow.

1. On the top menu of the prompt flow designer, select **More tools**, and then select **Vector Index Lookup**.

    :::image type="content" source="media/how-to-create-vector-index/vector-lookup.png" alt-text="Screenshot that shows the list of available tools.":::

   The Vector Index Lookup tool is added to the canvas. If you don't see the tool immediately, scroll to the bottom of the canvas.

    :::image type="content" source="media/how-to-create-vector-index/vector-index-lookup-tool.png" alt-text="Screenshot that shows the Vector Index Lookup tool.":::

1. Enter the path to your vector index, along with the query that you want to perform against the index. The 'path' is the location for the MLIndex created in the create a vector index section of this tutorial. To know this location select the desired Vector Index, select 'Details', and select 'Index Data'. Then on the 'Index data' page, copy the 'Datasource URI' in the Data sources section.

1. Enter a query that you want to perform against the index. A query is a question either as plain string or an embedding from the input cell of the previous step. If you choose to enter an embedding, be sure your query is defined in the input section of your prompt flow like the example here:

   :::image type="content" source="media/how-to-create-vector-index/query-example.png" alt-text="Screenshot that shows the Vector Index Lookup tool query.":::
   
   An example of a plain string you can input in this case would be: `How to use SDK V2?'. Here is an example of an embedding as an input: `${embed_the_question.output}`. Passing a plain string will only work when the Vector Index is getting used on the workspace which created it.

## Supported File Types

Supported file types for creating a vector index job: `.txt`, `.md`, `.html`, `.htm`, `.py`, `.pdf`, `.ppt`, `.pptx`, `.doc`, `.docx`, `.xls`, `.xlsx`. Any other file types will be ignored during creation.

## Next steps

[Get started with RAG by using a prompt flow sample (preview)](how-to-use-pipelines-prompt-flow.md)

[Use vector stores with Azure Machine Learning (preview)](concept-vector-stores.md)
