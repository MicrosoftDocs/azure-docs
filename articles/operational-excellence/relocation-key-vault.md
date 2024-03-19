---
title:  Relocate Azure KeyVault to another region
description: This article offers guidance on moving a key vault to a different region.
services: key-vault
author: anaharris
ms.service: key-vault
ms.subservice: general
ms.topic: concept
ms.date: 02/29/2024
ms.author: mbaldwin
ms.custom:  subject-relocation

# Customer intent: As a key vault administrator, I want to move my vault to another region.
---

# Relocate Azure KeyVault to another region

Azure Key Vault does not allow you to move a key vault from one region to another. You can, however, create a key vault in the new region, manually backup/restore each individual key, secret, or certificate from your existing key vault to the new key vault, and then remove the original key vault.

## Prerequisites

It's critical to understand the implications of this workaround before you attempt to apply it in a production environment.

## Prepare

First, you must create a new key vault in the region to which you wish to move. You can do so through the [Azure portal](/azure/key-vault/general/quick-create-portal), the [Azure CLI](/azure/key-vault/general/quick-create-cli), or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).

Keep in mind the following concepts:

* Key vault names are globally unique. You can't reuse a vault name.
* You need to reconfigure your access policies and network configuration settings in the new key vault.
* You need to reconfigure soft-delete and purge protection in the new key vault.
* The backup and restore operation won't preserve your autorotation settings. You might need to reconfigure the settings.

## Move

Export your keys, secrets, or certificates from your old key vault, and then import them into your new vault. 

You can back up each individual secret, key, and certificate in your vault by using the backup command. Your secrets are downloaded as an encrypted blob.  For step by step guidance, see [Azure Key Vault backup and restore](/azure/key-vault/general/backup).

Alternatively, you can download certain secret types manually. For example, you can download certificates as a PFX file. This option eliminates the geographical restrictions for some secret types, such as certificates. You can upload the PFX files to any key vault in any region. The secrets are downloaded in a non-password protected format. You are responsible for securing your secrets during the move.

After you have downloaded your keys, secrets, or certificates, you can restore them to your new key vault. 

Using the backup and restore commands has two limitations:

* You can't back up a key vault in one geography and restore it into another geography. For more information, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

* The backup command backs up all versions of each secret. If you have a secret with a large number of previous versions (more than 10), the request size might exceed the allowed maximum and the operation might fail.

## Verify

Before deleting your old key vault, verify that the new vault contains all of the required keys, secrets, and certificates. 


## Next steps

- [Azure Key Vault backup and restore](/azure/key-vault/general/backup)
- [Moving an Azure Key Vault across resource groups](/azure/key-vault/general/move-resourcegroup)
- [Moving an Azure Key Vault to another subscription](/azure/key-vault/general/move-subscription)
