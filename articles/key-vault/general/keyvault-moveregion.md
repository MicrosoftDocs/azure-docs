---
title: Move a key vault to a different region - Azure Key Vault | Microsoft Docs
description: This article offers guidance on moving a key vault to a different region.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 04/24/2020
ms.author: sudbalas
Customer intent: As a key vault administrator, I want to move my vault to another region.
---

# Move an Azure key vault across regions

Azure Key Vault doesn't support a resource move operation that permits moving a key vault from one region to another. This article covers workarounds for organizations that have a business need to move a key vault to another region. Each workaround option has limitations. It's critical to understand the implications of these workarounds before you attempt to apply them in a production environment.

To move a key vault to another region, you create a key vault in that other region and then manually copy each individual secret from your existing key vault to the new key vault. You can do this by using either of the following two options.

## Design considerations

Before you begin, keep in mind the following concepts:

* Key vault names are globally unique. You can't reuse a vault name.
* You need to reconfigure your access policies and network configuration settings in the new key vault.
* You need to reconfigure soft-delete and purge protection in the new key vault.
* The backup and restore operation won't preserve your autorotation settings. You might need to reconfigure the settings.

## Option 1: Use the key vault backup and restore commands

You can back up each individual secret, key, and certificate in your vault by using the backup command. Your secrets are downloaded as an encrypted blob. You can then restore the blob into your new key vault. For a list of commands, see [Azure Key Vault commands](https://docs.microsoft.com/powershell/module/azurerm.keyvault/?view=azurermps-6.13.0#key_vault).

Using the backup and restore commands has two limitations:

* You can't back up a key vault in one geography and restore it into another geography. For more information, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

* The backup command backs up all versions of each secret. If you have a secret with a large number of previous versions (more than 10), the request size might exceed the allowed maximum and the operation might fail.

## Option 2: Manually download and upload the key vault secrets

You can download certain secret types manually. For example, you can download certificates as a PFX file. This option eliminates the geographical restrictions for some secret types, such as certificates. You can upload the PFX files to any key vault in any region. The secrets are downloaded in a non-password protected format. You are responsible for securing your secrets during the move.
