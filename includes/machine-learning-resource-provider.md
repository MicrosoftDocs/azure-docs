---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/11/2022
ms.author: larryfr
---

When creating an Azure Machine Learning workspace, or a resource used by the workspace, you may receive an error similar to the following messages:

* `No registered resource provider found for location {location}`
* `The subscription is not registered to use namespace {resource-provider-namespace}`

Most resource providers are automatically registered, but not all. If you receive this message, you need to register the provider mentioned.

The following is a list of the resource providers required by Azure Machine Learning:

| Resource provider | What it is used for |
| ----- | ----- |
| __Microsoft.MachineLearningServices__ | Creating the Azure Machine Learning workspace. |
| __Microsoft.Storage__ | Azure Storage Account is used as the default storage for the workspace. |
| __Microsoft.ContainerRegistry__ | Azure Container Registry is used by the workspace to build Docker images. |
| __Microsoft.KeyVault__ | Azure Key Vault is used by the workspace to store secrets. |
| __Microsoft.Notebooks/NotebookProxies__ | Azure Machine Learning compute instance integrated notebooks. |
| __Microsoft.ContainerService__ | If you plan on deploying trained models to Azure Kubernetes Services. |

If you plan on using a customer-managed key with Azure Machine Learning, then the following service providers must be registered:

| Resource provider | What it is used for |
| ----- | ----- |
| __Microsoft.DocumentDB/databaseAccounts__ | Azure CosmosDB instance that logs metadata for the workspace. |
| __Microsoft.Search/searchServices__ | Azure Search provides indexing capabilities for the workspace. |

For information on registering resource providers, see [Resolve errors for resource provider registration](../articles/azure-resource-manager/templates/error-register-resource-provider.md).