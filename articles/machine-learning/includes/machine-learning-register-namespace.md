---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 12/01/2020
ms.author: larryfr
---

* When creating a new workspace, you can either automatically create services needed by the workspace or use existing services. If you want to use __existing services from a different Azure subscription__ than the workspace, you must register the Azure Machine Learning namespace in the subscription that contains those services. For example, creating a workspace in subscription A that uses a storage account from subscription B, the Azure Machine Learning namespace must be registered in subscription B before you can use the storage account with the workspace.

    The resource provider for Azure Machine Learning is __Microsoft.MachineLearningServices__. For information on how to see if it is registered and how to register it, see the [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)  article.

    > [!IMPORTANT]
    > This only applies to resources provided during workspace creation; Azure Storage Accounts, Azure Container Register, Azure Key Vault, and Application Insights.
