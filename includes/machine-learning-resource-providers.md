---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 01/10/2022
ms.author: larryfr
---

Before creating an Azure Machine Learning workspace, you may need to register the following resource providers for your Azure subscription:

| Resource provider | What it is used for |
| ----- | ----- |
| __Microsoft.MachineLearningServices__ | Creating the Azure Machine Learning workspace. |
| __Microsoft.Storage__ | Azure Storage Account is used as the default storage for the workspace. |
| __Microsoft.ContainerRegistry__ | Azure Container Registry is used by the workspace to build Docker images. |
| __Microsoft.KeyVault__ | Azure Key Vault is used by the workspace to store secrets. |
| __Microsoft.Notebooks__ | Azure Machine Learning compute instance integrated notebooks. |
| __Microsoft.ContainerService__ | If you plan on deploying trained models to Azure Kubernetes Services. |

If you plan on using a customer-managed key with Azure Machine Learning, then the following service providers must be registered:

| Resource provider | What it is used for |
| ----- | ----- |
| __Microsoft.DocumentDB__ | Azure CosmosDB instance that logs metadata for the workspace. |
| __Microsoft.Search__ | Azure Search provides indexing capabilities for the workspace. |

For information on how to register these providers, see [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types).