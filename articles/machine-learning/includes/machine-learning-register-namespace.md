---
author: Blackmist
ms.service: azure-machine-learning
ms.topic: include
ms.date: 06/13/2024
ms.author: larryfr
---

- When you create a new workspace, you can either automatically create services needed by the workspace or use existing services. If you want to use existing services from a **different Azure subscription** than the workspace, you must register the Azure Machine Learning namespace in the subscription that contains those services. For example, if you create a workspace in subscription A that uses a storage account in subscription B, the Azure Machine Learning namespace must be registered in subscription B before the workspace can use the storage account.

  The resource provider for Azure Machine Learning is **Microsoft.MachineLearningServices**. For information on seeing whether it's registered or registering it, see [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types).

  > [!IMPORTANT]
  > This information applies only to resources provided during workspace creation: Azure Storage Accounts, Azure Container Registry, Azure Key Vault, and Application Insights.
