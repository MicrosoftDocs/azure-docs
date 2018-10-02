---
 title: include file
 description: include file
 services: batch
 author: dlepow
 ms.service: batch
 ms.topic: include
 ms.date: 05/04/2018
 ms.author: danlep
 ms.custom: include file
---

> [!NOTE]
> When creating a Batch account, you can choose between two *pool allocation* modes: **user subscription** and **Batch service**. For most cases, you should use the default Batch service mode, in which pools are allocated behind the scenes in Azure-managed subscriptions. In the alternative user subscription mode, Batch VMs and other resources are created directly in your subscription when a pool is created. User subscription mode is required if you want to create Batch pools using [Azure Reserved VM Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/). To create a Batch account in user subscription mode, you must also register your subscription with Azure Batch, and associate the account with an Azure Key Vault.