---
title: How to build and consume vector indexes in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to create and use a vector index for performing Retrieval Augmented Generation (RAG).
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: ssalgado
author: ssalgadodev
---

# How to build and consume vector indexes in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to create and use a vector index for performing [Retrieval Augmented Generation (RAG)](../concepts/retrieval-augmented-generation.md).

## Prerequisites

You must have:
- An Azure AI Studio project
- An Azure AI Search resource

## Create an index from the Indexes tab

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Go to your project or [create a new project](../how-to/create-projects.md) in Azure AI Studio.
1. From the collapsible menu on the left, select **Indexes** under **Components**.

    :::image type="content" source="../media/index-retrieve/project-left-menu.png" alt-text="Screenshot of Project Left Menu." lightbox="../media/index-retrieve/project-left-menu.png":::

1. Select **+ New index**
1. Choose your **Source data**. You can choose source data from a list of your recent data sources, a storage URL on the cloud, or upload files and folders from the local machine. You can also add a connection to another data source such as Azure Blob Storage.

    :::image type="content" source="../media/index-retrieve/select-source-data.png" alt-text="Screenshot of select source data." lightbox="../media/index-retrieve/select-source-data.png":::

1. Select **Next** after choosing source data
1. Choose the **Index Storage** - the location where you want your index to be stored
1. If you already have a connection created for an Azure AI Search service, you can choose that from the dropdown.

    :::image type="content" source="../media/index-retrieve/index-storage.png" alt-text="Screenshot of select index store." lightbox="../media/index-retrieve/index-storage.png":::

    1. If you don't have an existing connection, choose **Connect other Azure AI Search service**
    1. Select the subscription and the service you wish to use.
    
    :::image type="content" source="../media/index-retrieve/index-store-details.png" alt-text="Screenshot of Select index store details." lightbox="../media/index-retrieve/index-store-details.png":::

1. Select **Next** after choosing index storage
1. Configure your **Search Settings**
    1. The ***Vector settings*** defaults to true for Add vector search to this search resource. As noted, this enables Hybrid and Hybrid + Semantic search options. Disabling this limits vector search options to Keyword and Semantic.
    1. For the hybrid option to work, you need an embedding model. Choose an embedding model from the dropdown.
    1. Select the acknowledgment to deploy an embedding model if it doesn't already exist in your resource

    :::image type="content" source="../media/index-retrieve/search-settings.png" alt-text="Screenshot of configure search settings." lightbox="../media/index-retrieve/search-settings.png":::
    
    If a non-Azure OpenAI model isn't appearing in the dropdown follow these steps:
    1. Navigate to the Project settings in [Azure AI Studio](https://ai.azure.com).
    1. Navigate to connections section in the settings tab and select New connection.
    1. Select **Serverless Model**.
    1. Type in the name of your embedding model deployment and select Add connection. If the model doesn't appear in the dropdown, select the **Enter manually** option.
    1. Enter the deployment API endpoint, model name, and API key in the corresponding fields. Then add connection.
    1. The embedding model should now appear in the dropdown.
    
    :::image type="content" source="../media/index-retrieve/serverless-connection.png" alt-text="Screenshot of connect a serverless model." lightbox="../media/index-retrieve/serverless-connection.png":::

1. Select **Next** after configuring search settings
1. In the **Index settings**
    1. Enter a name for your index or use the autopopulated name
    1. Schedule updates. You can choose to update the index hourly or daily.
    1. Choose the compute where you want to run the jobs to create the index. You can
        - Auto select to allow Azure AI to choose an appropriate VM size that is available
        - Choose a VM size from a list of recommended options
        - Choose a VM size from a list of all possible options
        
    :::image type="content" source="../media/index-retrieve/index-settings.png" alt-text="Screenshot of configure index settings." lightbox="../media/index-retrieve/index-settings.png":::

1. Select **Next** after configuring index settings
1. Review the details you entered and select **Create**
1. You're taken to the index details page where you can see the status of your index creation.

## Create an index from the Playground
1. Open your AI Studio project.
1. Navigate to the Playground tab.
1. The Select available project index is displayed for existing indexes in the project. If an existing index isn't being used, continue to the next steps.
1. Select the Add your data dropdown.
    
    :::image type="content" source="../media/index-retrieve/add-data-dropdown.png" alt-text="Screenshot of the playground add your data dropdown." lightbox="../media/index-retrieve/add-data-dropdown.png":::

1. If a new index is being created, select the ***Add your data*** option. Then follow the steps from ***Create an index from the Indexes tab*** to navigate through the wizard to create an index.
    1. If there's an external index that is being used, select the ***Connect external index*** option.
    1. In the **Index Source**
        1. Select your data source
        1. Select your AI Search Service
        1. Select the index to be used.

        :::image type="content" source="../media/index-retrieve/connect-external-index.png" alt-text="Screenshot of the page where you select an index." lightbox="../media/index-retrieve/connect-external-index.png":::
        
    1. Select **Next** after configuring search settings.
    1. In the **Index settings**
        1. Enter a name for your index or use the autopopulated name
        1. Schedule updates. You can choose to update the index hourly or daily.
        1. Choose the compute where you want to run the jobs to create the index. You can
            - Auto select to allow Azure AI to choose an appropriate VM size that is available
            - Choose a VM size from a list of recommended options
            - Choose a VM size from a list of all possible options
    1. Review the details you entered and select **Create.**
    1. The index is now ready to be used in the Playground.


## Use an index in prompt flow

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project. 
1. From the collapsible left menu, select **Prompt flow**.
1. Open an existing prompt flow or select **+ Create** to create a new flow.
1. On the top menu of the flow designer, select **More tools**, and then select ***Index Lookup***.

    :::image type="content" source="../media/index-retrieve/index-lookup-tool.png" alt-text="Screenshot of Vector index Lookup from More Tools." lightbox="../media/index-retrieve/index-lookup-tool.png":::

1. Provide a name for your Index Lookup Tool and select **Add**.
1. Select the **mlindex_content** value box, and select your index. After completing this step, enter the queries and **query_types** to be performed against the index.

    :::image type="content" source="../media/index-retrieve/configure-index-lookup-tool.png" alt-text="Screenshot of the prompt flow node to configure index lookup." lightbox="../media/index-retrieve/configure-index-lookup-tool.png":::


## Related content

- [Learn more about RAG](../concepts/retrieval-augmented-generation.md)
- [Build and consume an index using code](./develop/index-build-consume-sdk.md)
