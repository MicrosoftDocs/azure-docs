---
 title: include file
 description: include file
 services: batch
 ms.service: batch
 ms.topic: include
 ms.date: 04/03/2023
 ms.custom: include file
---

When you create a Batch account, you can choose between *user subscription* and *Batch service* pool allocation modes. For most cases, you should use the default Batch service pool allocation mode. In Batch service mode, compute and virtual machine (VM)-related resources for pools are allocated on Batch service managed Azure subscriptions.

In user subscription pool allocation mode, compute and VM-related resources for pools are created directly in the Batch account subscription when a pool is created. In scenarios where you [create a Batch pool in a virtual network](../articles/batch/batch-virtual-network.md) that you specify, certain networking related resources are created in the subscription of the virtual network.

To create a Batch account in user subscription pool allocation mode, you must also register your subscription with Azure Batch, and associate the account with Azure Key Vault. For more information about requirements for user subscription pool allocation mode, see [Configure user subscription mode](../articles/batch/batch-account-create-portal.md#additional-configuration-for-user-subscription-mode).

