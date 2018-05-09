---
ms.assetid: 45dc6cfc-8ce9-4728-b2a2-66c9cbda3a3d
title: Azure Key Vault key operations | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 06/14/2017
---
# Azure Key Vault key operations

The Azure Key Vault REST API supports the following operations for key objects.

- [Create a key](xref:keyvault.createkey)
- [Update a key](xref:keyvault.updatekey)
- [Delete a key](xref:keyvault.deletekey)
- [Get information about a key](xref:keyvault.getkey)
- [Get the keys in a vault](xref:keyvault.getkeys)
- [Get the versions of a key](xref:keyvault.getkeyversions)
- [Import a key into a vault](xref:keyvault.importkey)
- [Backup a key](xref:keyvault.backupkey)
- [Restore a key](xref:keyvault.restorekey)

## Cryptographic operations

- [Encrypt with a key](xref:keyvault.encrypt)
- [Decrypt with a key](xref:keyvault.decrypt)
- [Sign with a key](xref:keyvault.sign)
- [Verify with a key](xref:keyvault.verify)
- [Wrap a key](xref:keyvault.wrapkey)
- [Unwrap a key](xref:keyvault.unwrapkey)

## Soft-delete operations

The soft-delete feature suppports these operations for deleted keys

- [Get deleted key](xref:keyvault.getdeletedkey)
- [Get deleted keys](xref:keyvault.getdeletedkeys)
- [Purge deleted key](xref:keyvault.purgedeletedkey)
- [Recover deleted key](xref:keyvault.recoverdeletedkey)

For more information on Key Vault's soft-delete feature, see [Azure Key Vault soft-delete feature overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).

## See Also

- [Common parameters and headers](common-parameters-and-headers.md)
- [About keys, secrets, and certificates](about-keys--secrets-and-certificates.md)
