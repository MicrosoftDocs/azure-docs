---
title: How to create vector index in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Explaining retrieval augmented generation and using Prompt Flow models for business use cases
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

# Create a Vector Index 

Azure Machine Learning enables you to create a vector index from files/folders on your machine, a location in a cloud storage, an Azure Machine Learning data asset, a Git repository, or an SQL database. Azure Machine Learning can currently crack and process text files, md files, pdf, excel files, word documents. You can also reuse an existing Azure Cognitive Search Index instead of creating a new Index.

When a Vector Index is created, Azure Machine Learning will chunk the data, create embeddings, and store the embeddings in a FAISS Index or Azure Cognitive Search Index. In addition, Azure Machine Learning will create:

Test data for your data source.
A sample prompt flow, which uses the Vector Index you created. The sample prompt flow, which gets created has several key features like: a. Automatically generated prompt variants. b. Evaluation of each of these variations using the test data generated<TBD - link to eval blog>. c. Metrics against each of the variants to help you choose the best variant to run. You can use this sample to continue developing your prompt. 

## Create a new Vector Index using studio

1.  Select **Prompt flow** on the left menu

     :::image type="content" source="/media/how-to-create-vector-index/prompt-flow.png" alt-text="Screenshot showing the Prompt flow location on the left menu.":::

1.  Select **Vector Index** on the top menu

    :::image type="content" source="/media/how-to-create-vector-index/vector-index.png" alt-text="Screenshot showing the Vector Index location on the top menu.":::

1.  Select **Create**

1.  After the create new vector index form opens, provide a name for your vector index.

1.  Next choose your data source type

    :::image type="content" source="/media/how-to-create-vector-index/new-vector-creation.png" alt-text="Screenshot showing the create new Vector Index form.":::

1.  Based on the chosen type, provide the location details of your
    source. Then, select **Next**.

1.  Choose the Azure OpenAI connection, which is required to access the
    embedding and generation models.

1.  Review the details of your vector index, then select the **Create** button to create the vector index.

1. This will take you to an overview page from where you can track
    / view the status of your Vector Index creation. Note: Vector
    Index creation may take a while depending on the size of data.

    ![](./media/how-to-create-vector-index
    /UI-6-10.png)

## Add a Vector Index to a prompt flow

Once you have created a Vector Index, you can add it to a prompt flow from the prompt flow canvas. The prompt flow designer has a Vector Index lookup tool. Add this tool to the canvas and enter the path to your Vector Index and the query you want to perform against the index. You can find the steps to do this here.


1. Open an existing prompt flow

1. On the top menu select **More Tools** and select Vector Index Lookup

:::image type="content" source="/media/how-to-create-vector-index/new-vector-creation.png" alt-text="Screenshot showing the location of the More Tools button.":::

1. The Vector Index lookup tool gets added to the canvas. If you do not see the tool immediately, scroll to the bottom of the canvas.

media/how-to-create-vector-index/vector-index-lookup-tool.png

:::image type="content" source="/media/how-to-create-vector-index/vector-index-lookup-tool.png" alt-text="Screenshot showing the vector index lookup tool.":::

1. Enter the path to your Vector Index and enter the question