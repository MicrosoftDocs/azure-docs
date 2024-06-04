---
title: Azure AI Studio architecture
titleSuffix: Azure AI Studio
description: Learn about the architecture of Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: larryfr
author: Blackmist
---

# Azure AI Studio architecture

[!INCLUDE [Feature preview](../includes/feature-preview.md)]
    
AI Studio provides a unified experience for AI developers and data scientists to build, evaluate, and deploy AI models through a web portal, SDK, or CLI. It's built on capabilities and services provided by other Azure services.

The top level AI Studio resources (hub and project) are based on Azure Machine Learning. Other resources, such as Azure OpenAI, Azure AI services, and Azure AI Search, are used by the hub and project.

- **AI Studio hub**: The hub is the top-level resource in AI Studio. The Azure resource provider for a hub is `Microsoft.MachineLearningServices/workspaces`, and the kind of resource is `Hub`. It provides the following features:
    - Data upload and artifact storage.
    - Hub-scoped connections to Azure services such as Azure OpenAI, Azure AI services, and Azure AI Search.
    - Base model endpoints for Azure OpenAI, Speech, and Vision.
    - Compute resources.
    - Security and governance.
- **AI Studio project**: A project is a child resource of the hub. The Azure resource provider for a project is `Microsoft.MachineLearningServices/workspaces`, and the kind of resource is `Project`. It inherits the hub's connections, and compute resources. When a new project is created from the hub, the security settings of the hub are applied to it. The project provides the following features:
    - Groups of components such as datasets, models, and indexes.
    - An isolated data container (within the storage inherited from the hub).
    - Project-scoped connections. For example, a project might need access to data stored in a separate Azure Storage account.
    - Open source model deployments from catalog and fine-tuned model endpoints.
 
A hub can have multiple child projects. Each project can have its own set of project-scoped connections.

:::image type="content" source="../media/concepts/resource-provider-connected-resources.svg" alt-text="Diagram of the relationship between AI Studio resources." :::

### Microsoft-hosted resources

While most of the resources used by Azure AI Studio live in your Azure subscription, some resources are in an Azure subscription managed by Microsoft. This subscription provides some of the services used by Azure AI Studio. The following resources are in the Microsoft-managed Azure subscription, and don't appear in your Azure subscription:

- **Managed compute resources**: Provided by Azure Batch resources in the Microsoft subscription.
- **Managed virtual network**: Provided by Azure Virtual Network resources in the Microsoft subscription. If FQDN rules are enabled, an Azure Firewall (standard) is added and charged to your subscription. For more information, see [Configure a managed virtual network for Azure AI Studio](../how-to/configure-managed-network.md).
- **Metadata storage**: Provided by Azure Cosmos DB, Azure AI Search, and Azure Storage Account in the Microsoft subscription. 

    > [!NOTE]
    > If you use customer-managed keys, the metadata storage resources are created in your subscription. For more information, see [Customer-managed keys](../../ai-services/encryption/cognitive-services-encryption-keys-portal.md?context=/azure/ai-studio/context/context).

Managed compute resources and managed virtual networks exist in the Microsoft subscription, but are managed by you. For example, you control which VM sizes are used for compute resources, and which outbound rules are configured for the managed virtual network.

Managed compute resources also require vulnerability management. This is a shared responsibility between you and Microsoft. For more information, see [vulnerability management](vulnerability-management.md).
 
## Azure resource providers

Since Azure AI Studio is built from other Azure services, the resource providers for these services must be registered in your Azure subscription. The following table lists the resource, provider, and resource provider kinds:

[!INCLUDE [Resource provider kinds](../includes/resource-provider-kinds.md)]

When you create a new hub, a set of dependent Azure resources are required to store data, manage security, and provide compute resources. The following table lists the dependent Azure resources and their resource providers:

> [!TIP]
> If you don't provide a dependent resource when creating a hub, and it's a required dependency, AI Studio creates the resource for you.

[!INCLUDE [Dependent Azure resources](../includes/dependent-resources.md)]

For information on registering resource providers, see [Register an Azure resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider).

## Role-based access control and control plane proxy

Azure AI services including Azure OpenAI provide control plane endpoints for operations such as listing model deployments. These endpoints are secured using a separate Azure role-based access control (RBAC) configuration than the one used for a hub. 

To reduce the complexity of Azure RBAC management, AI Studio provides a *control plane proxy* that allows you to perform operations on connected Azure AI services and Azure OpenAI resources. Performing operations on these resources through the control plane proxy only requires Azure RBAC permissions on the hub. The Azure AI Studio service then performs the call to the Azure AI services or Azure OpenAI control plane endpoint on your behalf.

For more information, see [Role-based access control in Azure AI Studio](rbac-ai-studio.md).

## Attribute-based access control

Each hub you create has a default storage account. Each child project of the hub inherits the storage account of the hub. The storage account is used to store data and artifacts.

To secure the shared storage account, Azure AI Studio uses both Azure RBAC and Azure attribute-based access control (Azure ABAC). Azure ABAC is a security model that defines access control based on attributes associated with the user, resource, and environment. Each project has:

- A service principal that is assigned the Storage Blob Data Contributor role on the storage account.
- A unique ID (workspace ID).
- A set of containers in the storage account. Each container has a prefix that corresponds to the workspace ID value for the project.

The role assignment for each project's service principal has a condition that only allows the service principal access to containers with the matching prefix value. This condition ensures that each project can only access its own containers.

> [!NOTE]
> For data encryption in the storage account, the scope is the entire storage and not per-container. So all containers are encrypted using the same key (provided either by Microsoft or by the customer).

For more information on Azure access-based control, see [What is Azure attribute-based access control](/azure/role-based-access-control/conditions-overview).

## Containers in the storage account

The default storage account for a hub has the following containers. These containers are created for each project, and the `{workspace-id}` prefix matches the unique ID for the project. The container is accessed by the project using a [connection](connections.md).

> [!TIP]
> To find the ID for your project, go to the project in the [Azure portal](https://portal.azure.com/). Expand **Settings** and then select **Properties**. The **Workspace ID** is displayed.

| Container name | Connection name | Description |
| --- | --- | --- |
| {workspace-ID}-azureml | workspaceartifactstore | Storage for assets such as metrics, models, and components. |
| {workspace-ID}-blobstore| workspaceblobstore | Storage for data upload, job code snapshots, and pipeline data cache. |
| {workspace-ID}-code | NA | Storage for notebooks, compute instances, and prompt flow. |
| {workspace-ID}-file | NA | Alternative container for data upload. |

## Encryption

Azure AI Studio uses encryption to protect data at rest and in transit. By default, Microsoft-managed keys are used for encryption. However you can use your own encryption keys. For more information, see [Customer-managed keys](../../ai-services/encryption/cognitive-services-encryption-keys-portal.md?context=/azure/ai-studio/context/context).

## Virtual network

A hub can be configured to use a *managed* virtual network. The managed virtual network secures communications between the hub, projects, and managed resources such as computes. If your dependency services (Azure Storage, Key Vault, and Container Registry) have public access disabled, a private endpoint for each dependency service is created to secure communication between the hub and project and the dependency service.

> [!NOTE]
> If you want to use a virtual network to secure communications between your clients and the hub or project, you must use an Azure Virtual Network that you create and manage. For example, an Azure Virtual Network that uses a VPN or ExpressRoute connection to your on-premises network.

For more information on how to configure a managed virtual network, see [Configure a managed virtual network for Azure AI Studio](../how-to/configure-managed-network.md).

## Azure Monitor

Azure monitor and Azure Log Analytics provide monitoring and logging for the underlying resources used by Azure AI Studio. Since Azure AI Studio is built on Azure Machine Learning, Azure OpenAI, Azure AI services, and Azure AI Search, use the following articles to learn how to monitor the services:

| Resource | Monitoring and logging |
| --- | --- |
| Azure AI Studio hub and project | [Monitor Azure Machine Learning](/azure/machine-learning/monitor-azure-machine-learning) |
| Azure OpenAI | [Monitor Azure OpenAI](/azure/ai-services/openai/how-to/monitoring) |
| Azure AI services | [Monitor Azure AI (training)](/training/modules/monitor-ai-services/) |
| Azure AI Search | [Monitor Azure AI Search](/azure/search/monitor-azure-cognitive-search) |

## Price and quota

For more information on price and quota, use the following articles:

- [Plan and manage costs](../how-to/costs-plan-manage.md)
- [Commitment tier pricing](../how-to/commitment-tier.md)
- [Quota management](../how-to/quota.md)

## Next steps

Create a hub using one of the following methods:

- [Azure AI Studio](../how-to/create-azure-ai-resource.md#create-a-hub-in-ai-studio): Create a hub for getting started.
- [Azure portal](../how-to/create-secure-ai-hub.md): Create a hub with your own networking.
- [Bicep template](../how-to/create-azure-ai-hub-template.md).
