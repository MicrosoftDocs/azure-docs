---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 10/27/2023
ms.author: larryfr
monikerRange: 'azureml-api-2 || azureml-api-1'
---

Customer-managed keys are used with the following services that Azure Machine Learning relies on:

:::moniker range="azureml-api-2"
| Service | What it's used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure AI Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage Account | Stores workspace metadata for Azure Machine Learning |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

> [!TIP]
> * Azure Cosmos DB, Azure AI Search, and Storage Account are secured using the same key. You can use a different key for Azure Kubernetes Service.
> * To use a customer-managed key with Azure Cosmos DB, Azure AI Search, and Storage Account, the key is provided when you create your workspace. The key used with Kubernetes Service is provided when configuring that resource.
:::moniker-end
:::moniker range="azureml-api-1"
| Service | What it's used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure AI Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage Account | Stores workspace metadata for Azure Machine Learning |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |
| Azure Container Instance | Hosting trained models as inference endpoints |

> [!TIP]
> * Azure Cosmos DB, Azure AI Search, and Storage Account are secured using the same key. You can use a different key for Azure Kubernetes Service and Container Instance.
> * To use a customer-managed key with Azure Cosmos DB, Azure AI Search, and Storage Account, the key is provided when you create your workspace. The key(s) used with Azure Container Instance and Kubernetes Service are provided when configuring those resources.
:::moniker-end