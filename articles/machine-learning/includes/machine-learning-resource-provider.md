---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 10/23/2023
ms.author: larryfr
---

When creating an Azure Machine Learning workspace, or a resource used by the workspace, you may receive an error similar to the following messages:

* `No registered resource provider found for location {location}`
* `The subscription is not registered to use namespace {resource-provider-namespace}`

Most resource providers are automatically registered, but not all. If you receive this message, you need to register the provider mentioned.

The following table contains a list of the resource providers required by Azure Machine Learning:

| Resource provider | Why it's needed |
| ----- | ----- |
| __Microsoft.MachineLearningServices__ | Creating the Azure Machine Learning workspace. |
| __Microsoft.Storage__ | Azure Storage Account is used as the default storage for the workspace. |
| __Microsoft.ContainerRegistry__ | Azure Container Registry is used by the workspace to build Docker images. |
| __Microsoft.KeyVault__ | Azure Key Vault is used by the workspace to store secrets. |
| __Microsoft.Notebooks__ | Integrated notebooks on Azure Machine Learning compute instance. |
| __Microsoft.ContainerService__ | If you plan on deploying trained models to Azure Kubernetes Services. |

If you plan on using a customer-managed key with Azure Machine Learning, then the following service providers must be registered:

| Resource provider | Why it's needed |
| ----- | ----- |
| __Microsoft.DocumentDB__ | Azure CosmosDB instance that logs metadata for the workspace. |
| __Microsoft.Search__ | Azure Search provides indexing capabilities for the workspace. |

If you plan on using a managed virtual network with Azure Machine Learning, then the __Microsoft.Network__ resource provider must be registered. This resource provider is used by the workspace when creating private endpoints for the managed virtual network.

For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).
