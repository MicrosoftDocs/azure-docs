---
title: How to add a new connection in Azure AI Studio
titleSuffix: Azure AI services
description: Learn how to add a new connection in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to add a new connection in Azure AI Studio

In this article, you learn how to add a new connection in Azure AI Studio.

Connections are a way to authenticate and consume both Microsoft and third-party resources within your Azure AI projects. For example, connections can be used for prompt flow, training data, and deployments. [Connections can be created](../how-to/connections-add.md) exclusively for one project or shared with all projects in the same Azure AI resource. 

## Create a new connection

1. Sign in to [Azure AI Studio](https://aka.ms/azureaistudio) and select your project via **Build** > **Projects**. If you don't have a project already, first create a project.
1. Select **Settings** from the collapsible left menu. 
1. Select **View all** from the **Connections** section.
1. Select **+ Connection** under **Resource connections**.
1. Select the service you want to connect to from the list of available external resources.
1. Fill out the required fields for the service connection type you selected, and then select **Create connection**.

## Service connection types

When you [create a new connection](#create-a-new-connection), you enter the following information for the service connection type you selected. You can create a connection that's only available for the current project or available for all projects associated with the Azure AI resource.

> [!NOTE]
> When you create a connection from the **Manage** page, the connection is always created at the Azure AI resource level and shared accross all associated projects. 

Here's a table of the available service connection types and descriptions of the connection types:

| Service connection type | Description |
| --- | --- |
| [Azure AI Search](?tabs=azure-ai-search#service-connection-types) | Azure AI Search is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes. |
| [Azure Blob Storage](?tabs=azure-blob-storage#service-connection-types) | Azure Blob Storage is a cloud storage solution for storing unstructured data like documents, images, videos, and application installers. |
| [Azure Data Lake Storage Gen 2](?tabs=azure-data-lake-storage-gen-2#service-connection-types) | Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob storage. |
| [Azure Content Safety](?tabs=azure-content-safety#service-connection-types) | Azure AI Content Safety is a service that detects potentially unsafe content in text, images, and videos. |
| [Azure OpenAI](?tabs=azure-openai#service-connection-types) | Azure OpenAI is a service that provides access to the OpenAI GPT-3 model. |
| [Microsoft OneLake](?tabs=microsoft-onelake#service-connection-types) | Microsoft OneLake provides open access to all of your Fabric items through Azure Data Lake Storage (ADLS) Gen2 APIs and SDKs. |
| [Git](?tabs=git#service-connection-types) | Git is a distributed version control system that allows you to track changes to files. |
| [API key](?tabs=api-key#service-connection-types) | API Key connections handle authentication to your specified target on an individual basis. This is the most common third-party connection type. |
| [Custom](?tabs=custom#service-connection-types) | Custom connections allow you to securely store and access keys while storing related properties, such as targets and versions. Custom connections are useful when you have many targets that or cases where you would not need a credential to access. LangChain scenarios are a good example where you would use custom service connections. Custom connections don't manage authentication, so you will have to manage authenticate on your own. |

# [Azure AI Search](#tab/azure-ai-search)


:::image type="content" source="../media/data-connections/connection-add-azure-ai-search.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-azure-ai-search.png":::


# [Azure Blob Storage](#tab/azure-blob-storage)


:::image type="content" source="../media/data-connections/connection-add-azure-blob-storage.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-azure-blob-storage.png":::


# [Azure Data Lake Storage Gen 2](#tab/azure-data-lake-storage-gen-2)


:::image type="content" source="../media/data-connections/connection-add-azure-data-lake-storage-gen-2.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-azure-data-lake-storage-gen-2.png":::

# [Azure Content Safety](#tab/azure-content-safety)


:::image type="content" source="../media/data-connections/connection-add-azure-ai-content-safety.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-azure-ai-content-safety.png":::

# [Azure OpenAI](#tab/azure-openai)


:::image type="content" source="../media/data-connections/connection-add-azure-openai.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-azure-openai.png":::

# [Microsoft OneLake](#tab/microsoft-onelake)

:::image type="content" source="../media/data-connections/connection-add-microsoft-onelake.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-microsoft-onelake.png":::

> [!TIP]
> Microsoft OneLake provides open access to all of your Fabric items through Azure Data Lake Storage (ADLS) Gen2 APIs and SDKs. In Azure AI Studio you can set up a connection to your OneLake data using a OneLake URI. You can find the information that Azure AI Studio requires to construct a **OneLake Artifact URL** (workspace and item GUIDs) in the URL on the Fabric portal. For information about the URI syntax, see [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api).


# [Git](#tab/git)


:::image type="content" source="../media/data-connections/connection-add-git.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-git.png":::

> [!TIP]
> Personal access tokens are an alternative to using passwords for authentication to GitHub when using the GitHub API or the command line. In Azure AI Studio you can set up a connection to your GitHub account using a personal access token. For more information, see [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).




# [API key](#tab/api-key)


:::image type="content" source="../media/data-connections/connection-add-api-key.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-api-key.png":::

> [!TIP]
> API Key connections handle authentication to your specified target on an individual basis. This is the most common third-party connection type. For example, you can use this connection with the SerpApi tool in prompt flow. 


# [Custom](#tab/custom)

:::image type="content" source="../media/data-connections/connection-add-custom.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-custom.png":::

> [!TIP]
> Custom connections allow you to securely store and access keys while storing related properties, such as targets and versions. Custom connections are useful when you have many targets that or cases where you would not need a credential to access. LangChain scenarios are a good example where you would use custom service connections. Custom connections don't manage authentication, so you will have to manage authenticate on your own.

---


## Next steps

- [Connections in Azure AI Studio](../concepts/connections.md)
- [How to create vector indexes](../how-to/index-add.md)

