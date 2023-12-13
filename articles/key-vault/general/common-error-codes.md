---
title: Common error codes for Azure Key Vault | Microsoft Docs
description: Common error codes for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: reference
ms.date: 01/12/2023
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# Common error codes for Azure Key Vault

The error codes listed in the following table may be returned by an operation on Azure Key Vault.

| Error code | User message |
|--|--|
| VaultAlreadyExists |  Your attempt to create a new key vault with the specified name has failed since the name is already in use. If you recently deleted a key vault with this name, it may still be in the soft deleted state. You can verify if it exists in soft-deleted state [here](./key-vault-recovery.md?tabs=azure-portal#list-recover-or-purge-a-soft-deleted-key-vault) |
| VaultNameNotValid |  The vault name should be string of 3 to 24 characters and can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-) |
| AccessDenied |  You may be missing permissions in access policy to do that operation. |
| ForbiddenByFirewall |  Client address isn't authorized and caller isn't a trusted service. |
| ConflictError |  You're requesting multiple operations on the same item, for example, Key Vault, secret, key, certificate, or common components within a Key Vault like VNET. It's recommended to sequence operations or to implement retry logic. |
| RegionNotSupported |  Specified Azure region isn't supported for this resource. |
| SkuNotSupported |  Specified SKU type isn't supported for this resource. |
| ResourceNotFound |  Specified Azure resource isn't found. |
| ResourceGroupNotFound | Specified Azure resource group isn't found. |
| CertificateExpired |  Check the expiration date and validity period of the certificate. |


## Next steps

- See the [Azure Key Vault developers guide](developers-guide.md)
- Read more about [Authenticating to Key vault](authentication.md)
