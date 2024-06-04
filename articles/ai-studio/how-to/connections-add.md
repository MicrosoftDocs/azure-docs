---
title: How to add a new connection in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to add a new connection in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: larryfr
ms.author: larryfr
author: Blackmist
---

# How to add a new connection in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to add a new connection in Azure AI Studio.

Connections are a way to authenticate and consume both Microsoft and other resources within your Azure AI Studio projects. For example, connections can be used for prompt flow, training data, and deployments. [Connections can be created](../how-to/connections-add.md) exclusively for one project or shared with all projects in the same Azure AI Studio hub. 

## Connection types

Here's a table of some of the available connection types in Azure AI Studio. The __Preview__ column indicates connection types that are currently in preview.

| Service connection type | Preview | Description |
| --- |:---:| --- |
| Azure AI Search | ✓ |  Azure AI Search is an Azure resource that supports information retrieval over your vector and textual data stored in search indexes. |
| Azure Blob Storage | ✓ | Azure Blob Storage is a cloud storage solution for storing unstructured data like documents, images, videos, and application installers. |
| Azure Data Lake Storage Gen 2 | ✓ | Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on Azure Blob storage. |
| Azure Content Safety | ✓ | Azure AI Content Safety is a service that detects potentially unsafe content in text, images, and videos. |
| Azure OpenAI || Azure OpenAI is a service that provides access to the OpenAI GPT-3 model. |
| Serverless Model | ✓ | Serverless Model connections allow you to [serverless API deployment](deploy-models-serverless.md). |
| Microsoft OneLake | ✓ | Microsoft OneLake provides open access to all of your Fabric items through Azure Data Lake Storage (ADLS) Gen2 APIs and SDKs.<br/><br/>In Azure AI Studio you can set up a connection to your OneLake data using a OneLake URI. You can find the information that Azure AI Studio requires to construct a **OneLake Artifact URL** (workspace and item GUIDs) in the URL on the Fabric portal. For information about the URI syntax, see [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api). |
| API key || API Key connections handle authentication to your specified target on an individual basis. For example, you can use this connection with the SerpApi tool in prompt flow.  |
| Custom || Custom connections allow you to securely store and access keys while storing related properties, such as targets and versions. Custom connections are useful when you have many targets that or cases where you wouldn't need a credential to access. LangChain scenarios are a good example where you would use custom service connections. Custom connections don't manage authentication, so you have to manage authentication on your own. |

## Create a new connection

Follow these steps to create a new connection that's only available for the current project.

1. Go to your project in Azure AI Studio. If you don't have a project, [create a new project](./create-projects.md).
1. Select **Settings** from the collapsible left menu. 
1. Select **+ New connection** from the **Connected resources** section.

    :::image type="content" source="../media/data-connections/connection-add.png" alt-text="Screenshot of the button to add a new connection." lightbox="../media/data-connections/connection-add.png":::

1. Select the service you want to connect to from the list of available external resources. For example, select **Azure AI Search**.

    :::image type="content" source="../media/data-connections/connection-add-browse-azure-ai-search.png" alt-text="Screenshot of the page to select Azure AI Search from a list of other resources." lightbox="../media/data-connections/connection-add-browse-azure-ai-search.png":::

1. Browse for and select your Azure AI Search service from the list of available services. Select **Add connection**.

    :::image type="content" source="../media/data-connections/connection-add-azure-ai-search-connect.png" alt-text="Screenshot of the page to select the Azure AI Search service that you want to connect to." lightbox="../media/data-connections/connection-add-azure-ai-search-connect.png":::

1. After the service is connected, select **Close** to return to the **Settings** page.
1. Select **Connected resources** > **View all** to view the new connection. You might need to refresh the page to see the new connection.

    :::image type="content" source="../media/data-connections/connections-all-refreshed.png" alt-text="Screenshot of all connections after you add the Azure AI Search connection." lightbox="../media/data-connections/connections-all-refreshed.png":::

## Network isolation

If your hub is configured for [network isolation](configure-managed-network.md), you might need to create an outbound private endpoint rule to connect to **Azure Blob Storage**, **Azure Data Lake Storage Gen2**, or **Microsoft OneLake**. A private endpoint rule is needed if one or both of the following are true:

- The managed network for the hub is configured to [allow only approved outbound traffic](configure-managed-network.md#configure-a-managed-virtual-network-to-allow-only-approved-outbound). In this configuration, you must explicitly create outbound rules to allow traffic to other Azure resources.
- The data source is configured to disallow public access. In this configuration, the data source can only be reached through secure methods, such as a private endpoint.

To create an outbound private endpoint rule to the data source, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure AI Studio hub.
1. Select **Networking**, then **Workspace managed outbound access**.
1. To add an outbound rule, select **Add user-defined outbound rules**. From the **Workspace outbound rules** sidebar, provide the following information:
    
    - **Rule name**: A name for the rule. The name must be unique for the AI Studio hub.
    - **Destination type**: Private Endpoint.
    - **Subscription**: The subscription that contains the Azure resource you want to connect to.
    - **Resource type**: `Microsoft.Storage/storageAccounts`. This resource provider is used for Azure Storage, Azure Data Lake Storage Gen2, and Microsoft OneLake.
    - **Resource name**: The name of the Azure resource (storage account).
    - **Sub Resource**: The sub-resource of the Azure resource. Select `blob` in the case of Azure Blob storage. Select `dfs` for Azure Data Lake Storage Gen2 and Microsoft OneLake. 
  
1. Select **Save** to create the rule.

1. Select **Save** at the top of the page to save the changes to the managed network configuration.

## Next steps

- [Connections in Azure AI Studio](../concepts/connections.md)
- [How to create vector indexes](../how-to/index-add.md)
- [How to configure a managed network](configure-managed-network.md)
