---
 title: include file
 description: include file
 services: storage
 author: tamram
 ms.service: storage
 ms.topic: include
 ms.date: 04/16/2019
 ms.author: tamram
 ms.custom: include
---

Azure Storage supports encryption at rest with either Microsoft-managed keys or customer-managed keys. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.

Use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../articles/key-vault/key-vault-overview.md)
