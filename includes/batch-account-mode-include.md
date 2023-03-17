---
 title: include file
 description: include file
 services: batch
 ms.service: batch
 ms.topic: include
 ms.date: 03/14/2023
 ms.custom: include file
---

> [!NOTE]
> When creating a Batch account, you can choose between two *pool allocation* modes: **user subscription** and **Batch service**.
> For most cases, you should use the default Batch service pool allocation mode, in which compute and VM-related resources for pools
> are allocated on Batch service managed Azure subscriptions. In user subscription pool allocation mode, compute and VM-related
> resources for pools are created directly in your Batch account subscription when a pool is created. In scenarios where you create a
> [Batch pool in a virtual network that you specify](../articles/batch/batch-virtual-network.md), certain networking related resources
> are created in the subscription of the virtual network.
>
> To create a Batch account in user subscription pool allocation mode, you must also register your subscription with Azure Batch,
> and associate the account with an Azure Key Vault. See the
> [additional configuration](../articles/batch/batch-account-create-portal.md#additional-configuration-for-user-subscription-mode)
> required for user subscription pool allocation mode.
