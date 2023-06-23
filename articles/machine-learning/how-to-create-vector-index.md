---
title: How to creaete vector index in Azure Machine Learning prompt flow (preview)
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

AzureML enables you to create a vector index from files/folders on your machine, a location in a cloud storage, an Azure ML data asset, a Git repository, or a SQL database. AzureML can currently crack and process text files, md files, pdf, excel files, word documents. You can also reuse an existing Azure Cognitive Search Index instead of creating a new Index.

When a Vector Index is created, AzureML will chunk the data, create embeddings, and store the embeddings in a FAISS Index or Azure Cognitive Search Index. Apart from this AzureML will also create:

Test data for your data source.
A sample prompt flow which uses the Vector Index you created. The sample prompt flow which gets created has several key features like: a. Automatically generated prompt variants. b. Evaluation of each of these variations using the test data generated<TBD - link to eval blog>. c. Metrics against each of the variants to help you choose the best variant to run. You can use this sample to continue developing your prompt. 

## Create a new Vector Index using studio

1.  Click prompt flow on the left menu

    ![](./media/how-to-create-vector-index
    /UI-6a.png)

2.  Choose Vector Index on the top menu

    ![](./media/how-to-create-vector-index
    /UI-6-2.png)

3.  Click Create

4.  In the wizard which opens up, provide a name for your vector index.
    Choose Create new index

    ![](./media/how-to-create-vector-index
    /UI-6-4.png)

5.  Next choose your data source type

    ![](./media/how-to-create-vector-index
    /UI-6-5.png)

6.  Based on the chosen type, provide the location details of your
    source.

7.  Choose the Azure OpenAI connection which is required to access the
    embedding and generation models.

    ![](./media/how-to-create-vector-index
    /UI-6-7.png)

8.  Enter details of the model for embedding and for chat completion.

9.  Click Create.

    ![](./media/how-to-create-vector-index
    /UI-6-9.png)

10. This will now take you to an overview page from where you can track
    / view the status of your Vector Index creation. Note that Vector
    Index creation may take a while depending on the size of data.

    ![](./media/how-to-create-vector-index
    /UI-6-10.png)

## Add a Vector Index to a prompt flow

Once you have created a Vector Index, you can add it to a prompt flow from the prompt flow canvas. The prompt flow designer has a Vector Index lookup tool. Add this tool to the canvas and enter the path to your Vector Index and the query you want to perform against the index. You can find the steps to do this here.


1. Open an existing prompt flow

1. On the top menu click on More Tools and select Vector Index Lookup



1. The Vector Index lookup tool gets added to the canvas

1. Enter the path to your Vector Index and enter the question