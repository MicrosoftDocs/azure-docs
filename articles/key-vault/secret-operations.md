---
ms.assetid: cef1870f-eaea-418e-a730-22ba444825ba
title: Azure Key Vault secret operations | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 06/14/2017
---
# Azure Key Vault secret operations

The Azure Key Vault REST API supports the following operations for secrets.

- [Set a secret](xref:keyvault.setsecret)
- [Get a secret](xref:keyvault.getsecret)
- [Get secrets in a key vault](xref:keyvault.getsecrets)
- [Get versions of a secret](xref:keyvault.getsecretversions)
- [Delete a secret](xref:keyvault.deletesecret)
- [Update a secret](xref:keyvault.updatesecret)
- [Backup a secret](xref:keyvault.backupsecret)
- [Restore a secret](xref:keyvault.restoresecret)

## Soft-delete operations

The soft-delete feature suppports these operations for deleted secrets

- [Get deleted secret](xref:keyvault.getdeletedsecret)
- [Get deleted secrets](xref:keyvault.getdeletedsecrets)
- [Purge deleted secret](xref:keyvault.purgedeletedsecret)
- [Recover deleted secret](xref:keyvault.recoverdeletedsecret)

For more information on Key Vault's soft-delete feature, see [Azure Key Vault soft-delete feature overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).

## See Also
[Common parameters and headers](common-parameters-and-headers.md)
[About keys, secrets, and certificates](about-keys--secrets-and-certificates.md)
