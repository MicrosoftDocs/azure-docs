---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 03/08/2022
ms.author: larryfr
---

Customer-managed keys are used with the following services that Azure Machine Learning relies on:

| Service | What it’s used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure Cognitive Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage Account | Stores workspace metadata for Azure Machine Learning | 
| Azure Container Instance | Hosting trained models as inference endpoints |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

> [!TIP]
> * Azure Cosmos DB, Cognitive Search, and Storage Account are secured using the same key. You can use a different key for Azure Kubernetes Service and Container Instance.
> * To use a customer-managed key with Azure Cosmos DB, Cognitive Search, and Storage Account, the key is provided when you create your workspace. The key(s) used with Azure Container Instance and Kubernetes Service are provided when configuring those resources.