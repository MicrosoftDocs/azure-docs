---
title: Azure Files zone-redundant storage (ZRS) support for premium file shares
description: ZRS is supported for premium Azure file shares through the FileStorage storage account kind. Use this reference to determine the Azure regions in which ZRS is supported.
author: khdownie
services: storage
ms.service: storage
ms.topic: reference
ms.date: 03/29/2023
ms.author: kendownie
ms.subservice: files
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

[!INCLUDE [storage-files-redundancy-premium-zrs](../../../includes/storage-files-redundancy-premium-zrs.md)]

## See also

- [Azure Storage redundancy](../common/storage-redundancy.md)
