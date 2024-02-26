---
author: Blackmist
ms.service: machine-learning
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 10/27/2023
ms.author: larryfr
monikerRange: 'azureml-api-2 || azureml-api-1'
---

Azure Machine Learning relies on the following services that use customer-managed keys:

:::moniker range="azureml-api-2"
| Service | What it's used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure AI Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage | Stores workspace metadata for Azure Machine Learning |
| Azure Kubernetes Service | Hosts trained models as inference endpoints |

You use the same key to help secure Azure Cosmos DB, Azure AI Search, and Azure Storage. You can use a different key for Azure Kubernetes Service.

When you use a customer-managed key with Azure Cosmos DB, Azure AI Search, and Azure Storage, the key is provided when you create your workspace. The key that you use with Azure Kubernetes Service is provided when you configure that resource.
:::moniker-end
:::moniker range="azureml-api-1"
| Service | What it's used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure AI Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage | Stores workspace metadata for Azure Machine Learning |
| Azure Kubernetes Service | Hosts trained models as inference endpoints |
| Azure Container Instances | Hosts trained models as inference endpoints |

You use the same key to help secure Azure Cosmos DB, Azure AI Search, and Azure Storage. You can use a different key for Azure Kubernetes Service and Azure Container Instances.

When you use a customer-managed key with Azure Cosmos DB, Azure AI Search, and Azure Storage, the key is provided when you create your workspace. The keys that you use with Azure Container Instances and Azure Kubernetes Service are provided when you configure those resources.
:::moniker-end
