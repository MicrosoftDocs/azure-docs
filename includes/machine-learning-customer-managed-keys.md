---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 10/26/2020
ms.author: larryfr
---

> [!IMPORTANT]
> The Cosmos DB instance is created in a Microsoft-managed resource group in __your subscription__, along with any resources it needs. This means that you are charged for this Cosmos DB instance. The managed resource group is named in the format `<AML Workspace Resource Group Name><GUID>`. If your Azure Machine Learning workspace uses a private endpoint, a virtual network is also created for the Cosmos DB instance. This VNet is used to secure communication between Cosmos DB and Azure Machine Learning.
> 
> * __Do not delete the resource group__ that contains this Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group, Cosmos DB instance, etc., you must delete the Azure Machine Learning workspace that uses it. The resource group, Cosmos DB instance, and other automatically created resources are deleted when the associated workspace is deleted.
> * The default [__Request Units__](../articles/cosmos-db/request-units.md) for this Cosmos DB account is set at __8000__.
> * You __cannot provide your own VNet for use with the Cosmos DB instance__ that is created. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.