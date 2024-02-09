---
title: Architecture
titleSuffix: Azure AI Studio
description: Learn about the architecture of Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 02/06/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# Azure AI Studio architecture 
    
[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

AI Studio provides a unified experience for AI developers and data scientists to build, evaluate, and deploy AI models through a web portal, SDK, or CLI. It's built on capabilities and services provided by other Azure services.

The top level AI Studio resources (AI hub and AI projects) are based on Azure Machine Learning. Other resources, such as Azure OpenAI, Azure AI Services, and Azure AI Search, are used by the AI hub and AI project.

- **AI hub**: The AI hub is the top-level resource in AI Studio. The Azure resource provider for an AI hub is `Microsoft.MachineLearningServices/workspaces`, and the kind of resource is `Hub`. It provides the following features:
    - Data upload and artifact storage.
    - Hub-scoped connections to Azure services such as Azure OpenAI, Azure AI Services, and Azure AI Search.
    - Base model endpoints.
    - Compute resources.
    - Security and governance.
- **AI project**: An AI project is a child resource of the AI hub. The Azure resource provider for an AI project is `Microsoft.MachineLearningServices/workspaces`, and the kind of resource is `Project`. It inherits the AI hub's connections, and compute resources. When a new AI project is created from the AI hub, the security settings of the AI hub are applied to it. The AI project provides the following features:
    - Groups of components such as datasets, models, and indexes.
    - An isolated data container (within the storage inherited from the AI hub).
    - Project-scoped connections. For example, a project may need access to data stored in a separate Azure Storage account.
    - Fine tuned model endpoints.
 
An AI hub can have multiple child AI projects. Each AI project can have its own set of project-scoped connections.

:::image type="content" source="../media/concepts/azureai-hub-project-resource-providers.png" alt-text="Diagram of the relationship between AI Studio resources.":::

## Azure resource providers

Since Azure AI Studio is built from other Azure services, the resource providers for these services must be registered in your Azure subscription. The following table lists the resource , provider and resource provider kinds:

[!INCLUDE [Resource provider kinds](../includes/resource-provider-kinds.md)]

When you create a new Azure AI hub resource, a set of dependent Azure resources are required to store data, manage security, and provide compute resources. The following table lists the dependent Azure resources and their resource providers:

> [!TIP]
> If you don't provide a dependent resource when creating an AI hub, and it's a required dependency, AI Studio creates the resource for you.

[!INCLUDE [Dependent Azure resources](../includes/dependent-resources.md)]


## Control plane proxy

Azure AI Services and Azure OpenAI provide control plane endpoints for operations such as listing model deployments. These endpoints are secured using a separate Azure RBAC configuration that the one used for Azure AI hub. To reduce the complexity of Azure RBAC management, AI Studio provides a *control plane proxy* that allows you to perform operations on connected Azure AI Services and Azure OpenAI resources. Performing operations on these resources through the control plane proxy only requires Azure RBAC permissions on the AI hub. The Azure AI Studio service then performs the call to the Azure AI Services or Azure OpenAI control plane endpoint on the user's behalf.

For more information on Azure RBAC permissions, see [Role-based access control in Azure AI Studio](rback-ai-studio.md).

## Virtual network

Azure AI hub can be configured to use a *managed* virtual network. The managed virtual network secures communications between the AI hub, AI projects, and managed resources such as computes. If your dependency services (Azure Storage, Key Vault, and Container Registry) have public access disabled, a private endpoint for each dependency service is created to secure communication between the AI hub/project and the dependency service.

> [!NOTE]
> If you want to secure communications between your clients and the AI hub or AI project through a virtual network, you must use an Azure Virtual Network that you create and manage. For example, an Azure Virtual Network that uses a VPN or ExpressRoute connection to your on-premises network.

For more information on how to configure a managed virtual network, see [Configure a managed virtual network for Azure AI Studio](../how-to/configure-managed-network.md).

## Next steps

Create an AI hub using one of the following methods:

- [Azure AI Studio](../how-to/create-azure-ai-resource.md#create-an-azure-ai-hub-resource-in-ai-studio): Create an AI hub for getting started.
- [Azure portal](../how-to/create-azure-ai-resource.md#create-an-azure-ai-hub-resource-in-the-azure-portal): Create an AI hub with your own networking, encryption, identity and access management, dependent resources, and resource tag settings.
