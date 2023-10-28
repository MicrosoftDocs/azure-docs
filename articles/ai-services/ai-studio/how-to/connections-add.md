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

Connections are a way to authenticate and consume both Microsoft and third-party resources within your Azure AI projects. 





## Create a new connection

1. Sign in to [Azure AI Studio](https://aka.ms/azureaistudio) and select your project via **Build** > **Projects**. If you do not have a project already, first create a project.
1. Select **Settings** from the collapsible left menu. 
1. Select **View all** from the **Connections** section.
1. Select **+ Connection** under **Resource connections**.
1. Select the service you want to connect to from the list of available external resources.
1. Fill out the required fields for the service connection type you selected, and then select **Create connection**.

## Service connection types

When you [create a new connection](#create-a-new-connection), you enter the following information for the service connection type you selected. You can create a connection that's only available for the current project or available for all projects associated with the Azure AI resource.

> [!NOTE]
> When you create a connection from the **Manage** page, the connection is always created at the Azure AI resource level and shared accross all associated projects. 

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

# [Git](#tab/git)


:::image type="content" source="../media/data-connections/connection-add-git.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-git.png":::

# [API key](#tab/api-key)


:::image type="content" source="../media/data-connections/connection-add-api-key.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-api-key.png":::

# [Custom](#tab/custom)

:::image type="content" source="../media/data-connections/connection-add-custom.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="../media/data-connections/connection-add-custom.png":::

---




## Next steps

- [Connections in Azure AI Studio](../concepts/connections.md)
- [How to create vector indexes](../how-to/index-add.md)

