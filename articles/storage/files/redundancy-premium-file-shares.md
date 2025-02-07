---
title: Azure Files zone-redundant storage (ZRS) support for premium file shares
description: ZRS is supported for premium Azure file shares through the FileStorage storage account kind. Use this reference to determine the Azure regions in which ZRS is supported.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: reference
ms.date: 01/07/2025
ms.author: kendownie
ms.custom: references_regions
---

# Azure Files zone-redundant storage for premium file shares

Zone-redundant storage (ZRS) replicates your storage account synchronously across three Azure availability zones in the primary region.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Premium file share accounts

ZRS is supported for premium Azure file shares through the `FileStorage` storage account kind.

ZRS for premium file shares is available for a subset of Azure regions:

- (Africa) South Africa North
- (Asia Pacific) Australia East
- (Asia Pacific) China North 3
- (Asia Pacific) Southeast Asia
- (Asia Pacific) Korea Central
- (Asia Pacific) East Asia
- (Asia Pacific) Japan East
- (Asia Pacific) Central India
- (Canada) Canada Central
- (Europe) France Central
- (Europe) Germany West Central
- (Europe) North Europe
- (Europe) West Europe
- (Europe) UK South
- (Europe) Poland Central
- (Europe) Norway East
- (Europe) Spain Central
- (Europe) Sweden Central
- (Europe) Switzerland North
- (Europe) Italy North
- (Middle East) Qatar Central
- (Middle East) Israel Central
- (Middle East) UAE North
- (North America) East US
- (North America) East US 2
- (North America) West US 2
- (North America) West US 3
- (North America) Central US
- (North America) South Central US
- (North America) Mexico Central
- (South America) Brazil South
- (US Government) US Gov Virginia

## See also

- [Azure Files redundancy](files-redundancy.md)
