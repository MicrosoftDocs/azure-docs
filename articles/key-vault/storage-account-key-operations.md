---
title: Azure Key Vault storage account operations | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 06/20/2017
---
# Azure Key Vault storage account operations

The Azure Key Vault REST API supports the following operations for storage accounts.

- [Get a storage account](xref:keyvault.getstorageaccount)
- [Get a storage accounts](xref:keyvault.getstorageaccounts)
- [Delete a storage account](xref:keyvault.deletestorageaccount)
- [Regenerate a storage account key](xref:keyvault.regeneratestorageaccountkey)
- [Set a storage account](xref:keyvault.setstorageaccount)
- [Update a storage account](xref:keyvault.updatestorageaccount)

## Shared access signatures management

Azure Key Vault's implementation of storage account keys also removes the need for your direct contact with an Azure Storage Account key by offering shared access signatures (SAS) as a method.

- [Set a SAS definition](xref:keyvault.setsasdefinition)
- [Update a SAS definition](xref:keyvault.updatesasdefinition)
- [Get a SAS definition](xref:keyvault.getsasdefinition)
- [Set a SAS definition](xref:keyvault.setsasdefinition)
- [Delete a SAS definition](xref:keyvault.deletesasdefinition)

For more information on Key Vault's storage account keys, see [Azure Key Vault storage account keys overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys).

## See Also
[Common parameters and headers](common-parameters-and-headers.md)
[About keys, secrets, and certificates](about-keys--secrets-and-certificates.md)
