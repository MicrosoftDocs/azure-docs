---
title: Azure Key Vault moving a vault to a different region | Microsoft Docs
description: Guidance on moving a key vault to a different region.
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

# Moving an Azure Key Vault across regions

## Overview

Key Vault does not support a resource move operation that permits moving a key vault to another region. This article will cover  workarounds if you have a business need to move a key vault to another region. Each option has limitations and it is critical to understand the implications of these workarounds before attempting them in a production environment.

If you need to move a key vault to another region, the solution is to create a new key vault in the desired region and manually copy over each individual secret from your existing key vault to the new key vault. This can be done in either of the following ways listed below.

## Design Considerations

* Key Vault names are globally unique. You will not be able to reuse the same vault name.

* You will need to reconfigure access policies and network configuration settings in the new key vault.

* You will need to reconfigure soft-delete and purge protection in the new key vault.

* The backup / restore operation will not preserve auto-rotation settings you may need to reconfigure these settings.

## Option 1 - Use the key vault backup and restore commands

You can backup each individual secret, key, and certificate in your vault using the backup command. This will download your secrets as an encrypted blob. You can then restore the blob into your new key vault. The commands are documented in the link below.

[Azure Key Vault Commands](https://docs.microsoft.com/powershell/module/azurerm.keyvault/?view=azurermps-6.13.0#key_vault)

### Limitations

* You cannot backup a key vault in one geography and restore it into another geography. Learn more about Azure geographies. [Link](https://azure.microsoft.com/global-infrastructure/geographies/)

* The backup command backs up all versions of each secret. If you have a secret with a large number of previous versions (greater than 10) there is a chance the request will exceed the maximum allowed request size and the operation may fail.

## Option 2 - Manually download and re-upload secrets

Certain secret types can be manually downloaded. For example, you can download certificates as a .pfx file. This eliminates the geographical restrictions. You can re-upload the .pfx files to any key vault in any region. Your secret will be downloaded in a non-password protected format.You will be responsible for securing your secrets once they leave Key Vault while the move is performed.
