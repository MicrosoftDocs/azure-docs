---
title: Redundancy support for premium Azure file shares
description: Premium file storage (SSD) is provided for Azure file shares through the FileStorage storage account kind. Determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for premium file shares.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: reference
ms.date: 03/25/2025
ms.author: kendownie
ms.custom: references_regions
---

# Azure Files redundancy support for premium file shares

Premium file storage using solid-state drives (SSD) is provided for Azure file shares through the `FileStorage` storage account kind. Use this article to determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for premium file shares.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## LRS support for premium Azure file shares

LRS copies your data synchronously three times within a single physical location in the primary region.

LRS for premium file shares is supported in the following Azure regions:

- (Africa) South Africa North
- (Africa) South Africa West
- (Asia Pacific) Australia Central
- (Asia Pacific) Australia Central 2
- (Asia Pacific) Australia East
- (Asia Pacific) Australia Southeast
- (Asia Pacific) Central India
- (Asia Pacific) China North 2
- (Asia Pacific) China East 2
- (Asia Pacific) China East 3
- (Asia Pacific) China North 3
- (Asia Pacific) East Asia
- (Asia Pacific) Indonesia Central
- (Asia Pacific) Japan East
- (Asia Pacific) Japan West
- (Asia Pacific) Jio India Central
- (Asia Pacific) Jio India West
- (Asia Pacific) Korea Central
- (Asia Pacific) Korea South
- (Asia Pacific) Malaysia West
- (Asia Pacific) New Zealand North
- (Asia Pacific) South India
- (Asia Pacific) Southeast Asia
- (Asia Pacific) Taiwan North
- (Asia Pacific) Taiwan Northwest
- (Asia Pacific) West India
- (Europe) Austria East
- (Europe) Belgium Central
- (Europe) France Central
- (Europe) France South
- (Europe) Germany North
- (Europe) Germany West Central
- (Europe) Italy North
- (Europe) North Europe
- (Europe) Norway East
- (Europe) Norway West
- (Europe) Poland Central
- (Europe) Spain Central
- (Europe) Sweden Central
- (Europe) Switzerland West
- (Europe) Switzerland North
- (Europe) UK South
- (Europe) UK West
- (Europe) West Europe
- (Middle East) Israel Central
- (Middle East) Qatar Central
- (Middle East) UAE Central
- (Middle East) UAE North
- (North America) Canada East
- (North America) Canada Central
- (North America) Central US
- (North America) East US
- (North America) East US 2
- (North America) Mexico Central
- (North America) North US
- (North America) South US
- (North America) South US 2
- (North America) Southeast US
- (North America) Southeast US 3
- (North America) West US
- (North America) West US 2
- (North America) West US 3
- (North America) West US Central
- (South America) Brazil South
- (South America) Brazil Southeast
- (South America) Chile Central
- (US Government) US Gov East
- (US Government) US Gov Southwest
- (US Government) US Gov South Central

## ZRS support for premium Azure file shares

ZRS replicates your storage account synchronously across three Azure availability zones in the primary region.

ZRS for premium file shares is supported in the following subset of Azure regions:

- (Africa) South Africa North
- (Asia Pacific) Australia East
- (Asia Pacific) New Zealand North
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
