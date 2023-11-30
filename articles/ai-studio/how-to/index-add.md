---
title: How to create vector indexes
titleSuffix: Azure AI Studio
description: Learn how to create and use a vector index for performing Retrieval Augmented Generation (RAG).
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to create a vector index

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this article, you learn how to create and use a vector index for performing [Retrieval Augmented Generation (RAG)](../concepts/retrieval-augmented-generation.md).

## Prerequisites

You must have:
- An Azure AI project
- An Azure AI Search resource

## Create an index

1. Sign in to Azure AI Studio and open the Azure AI project in which you want to create the index.
1. From the collapsible menu on the left, select **Indexes** under **Components**.

    :::image type="content" source="../media/index-retrieve/project-left-menu.png" alt-text="Screenshot of Project Left Menu." lightbox="../media/index-retrieve/project-left-menu.png":::

1. Select **+ New index**
1. Choose your **Source data**. You can choose source data from a list of your recent data sources, a storage URL on the cloud or even upload files and folders from the local machine. You can also add a connection to another data source such as Azure Blob Storage.

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
    1. The search type defaults to **Hybrid + Semantic**, which is a combination of keyword search, vector search and semantic search to give the best possible search results.
    1. For the hybrid option to work, you need an embedding model. Choose the Azure OpenAI resource, which has the embedding model
    1. Select the acknowledgment to deploy an embedding model if it doesn't already exist in your resource
    
    :::image type="content" source="../media/index-retrieve/search-settings.png" alt-text="Screenshot of configure search settings." lightbox="../media/index-retrieve/search-settings.png":::

1. Use the prefilled name or type your own name for New Vector index name
1. Select **Next** after configuring search settings
1. In the **Index settings**
    1. Enter a name for your index or use the autopopulated name
    1. Choose the compute where you want to run the jobs to create the index. You can
        - Auto select to allow Azure AI to choose an appropriate VM size that is available
        - Choose a VM size from a list of recommended options
        - Choose a VM size from a list of all possible options
        
    :::image type="content" source="../media/index-retrieve/index-settings.png" alt-text="Screenshot of configure index settings." lightbox="../media/index-retrieve/index-settings.png":::

1. Select **Next** after configuring index settings
1. Review the details you entered and select **Create**
    
    > [!NOTE]
    > If you see a **DeploymentNotFound** error, you need to assign more permissions. See [mitigate DeploymentNotFound error](#mitigate-deploymentnotfound-error) for more details.

1. You're taken to the index details page where you can see the status of your index creation.


### Mitigate DeploymentNotFound error

When you try to create a vector index, you might see the following error at the **Review + Finish** step:

**Failed to create vector index. DeploymentNotFound: A valid deployment for the model=text-embedding-ada-002 was not found in the workspace connection=Default_AzureOpenAI provided.**

This can happen if you are trying to create an index using an **Owner**, **Contributor**, or **Azure AI Developer** role at the project level. To mitigate this error, you might need to assign more permissions using either of the following methods. 

> [!NOTE]
> You need to be assigned the **Owner** role of the resource group or higher scope (like Subscription) to perform the operation in the next steps. This is because only the Owner role can assign roles to others. See details [here](/azure/role-based-access-control/built-in-roles).

#### Method 1: Assign more permissions to the user on the Azure AI resource

If the Azure AI resource the project uses was created through Azure AI Studio:
1. Sign in to [Azure AI Studio](https://aka.ms/azureaistudio) and select your project via **Build** > **Projects**. 
1. Select **Settings** from the collapsible left menu.
1. From the **Resource Configuration** section, select the link for your resource group name that takes you to the Azure portal.
1. In the Azure portal under **Overview** > **Resources** select the Azure AI service type. It's named similar to "YourAzureAIResourceName-aiservices."

    :::image type="content" source="../media/roles-access/resource-group-azure-ai-service.png" alt-text="Screenshot of Azure AI service in a resource group." lightbox="../media/roles-access/resource-group-azure-ai-service.png":::

1. Select **Access control (IAM)** > **+ Add** to add a role assignment.
1. Add the **Cognitive Services OpenAI User** role to the user who wants to make an index. `Cognitive Services OpenAI Contributor` and `Cognitive Services Contributor` also work, but they assign more permissions than needed for creating an index in Azure AI Studio.

> [!NOTE]
> You can also opt to assign more permissions [on the resource group](#method-2-assign-more-permissions-on-the-resource-group). However, that method assigns more permissions than needed to mitigate the **DeploymentNotFound** error.

#### Method 2: Assign more permissions on the resource group

If the Azure AI resource the project uses was created through Azure portal:
1. Sign in to [Azure AI Studio](https://aka.ms/azureaistudio) and select your project via **Build** > **Projects**. 
1. Select **Settings** from the collapsible left menu.
1. From the **Resource Configuration** section, select the link for your resource group name that takes you to the Azure portal.
1. Select **Access control (IAM)** > **+ Add** to add a role assignment.
1. Add the **Cognitive Services OpenAI User** role to the user who wants to make an index. `Cognitive Services OpenAI Contributor` and `Cognitive Services Contributor` also work, but they assign more permissions than needed for creating an index in Azure AI Studio.


## Use an index in prompt flow

1. Open your AI Studio project
1. In Flows, create a new Flow or open an existing flow 
1. On the top menu of the flow designer, select More tools, and then select Vector Index Lookup

    :::image type="content" source="../media/index-retrieve/vector-index-lookup.png" alt-text="Screenshot of Vector index Lookup from More Tools." lightbox="../media/index-retrieve/vector-index-lookup.png":::

1. Provide a name for your step and select **Add**.
1. The Vector Index Lookup tool is added to the canvas. If you don't see the tool immediately, scroll to the bottom of the canvas
1. Enter the path to your vector index, along with the query that you want to perform against the index.

    :::image type="content" source="../media/index-retrieve/configure-index-lookup.png" alt-text="Screenshot of Configure Vector index Lookup." lightbox="../media/index-retrieve/configure-index-lookup.png":::

## Next steps

- [Learn more about RAG](../concepts/retrieval-augmented-generation.md)
