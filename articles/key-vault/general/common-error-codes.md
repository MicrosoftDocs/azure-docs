---
title: Common error codes for Azure Key Vault | Microsoft Docs
description: Common error codes for Azure Key Vault
services: key-vault
author: sebansal
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: reference
ms.date: 09/29/2020
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# Common error codes for Azure Key Vault

The error codes listed in the following table may be returned by an operation on Azure key vault

| Error code | User message |
|--|--|
| VaultAlreadyExists |  The specified key vault already exists (in soft-deleted state or in another subscription). |
| VaultNameNotValid |  The vault name should be 24 char, alphanumeric and start with an alphabet |
| AccessDenied |  You may be missing permissions in access policy to do that operation. |
| ForbiddenByFirewall |  Client address is not authorized and caller is not a trusted service. |
| ConflictError |  You're requesting multiple operations on same item.  |
| RegionNotSupported |  Specified azure region is not supported for this resource. |
| SkuNotSupported |  Specified SKU type is not supported for this resource. |
| ResourceNotFound |  Specified azure resource is not found. |
| CertificateExpired |  Check the expiration date and validity period of the certificate. |


## Next steps

- See the [Azure Key Vault developers guide](developers-guide.md)
- Read more about [Authenticating to Key vault](authentication.md)
