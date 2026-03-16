---
title: Redundancy support for SSD Azure file shares
description: SSD (premium) file storage is provided for Azure file shares through the FileStorage storage account kind. Determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for SSD file shares.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: reference
ms.date: 03/13/2026
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a cloud storage administrator, I want to identify Azure regions that support locally redundant storage (LRS) and zone redundant storage (ZRS) for SSD file shares, so that I can ensure optimal data redundancy and availability for my organization's storage needs."
---

# Azure Files redundancy support for SSD file shares

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider and using the SSD media tier

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider (preview)

Azure Files supports SSD file shares in a subset of all Azure regions. Use this article to determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for SSD file shares.

## LRS support for SSD Azure file shares

LRS copies your data synchronously three times within a single physical location in the primary region.

LRS for SSD file shares is supported in the following Azure regions:

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
- (Europe) Denmark East
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
- (North America) North Central US
- (North America) South Central US
- (North America) South Central US 2
- (North America) Southeast US
- (North America) Southeast US 3
- (North America) West US
- (North America) West US 2
- (North America) West US 3
- (North America) West Central US
- (South America) Brazil South
- (South America) Brazil Southeast
- (South America) Chile Central
- (US Government) US Gov Arizona
- (US Government) US Gov Texas
- (US Government) US Gov Virginia

## ZRS support for SSD Azure file shares

ZRS replicates your storage account synchronously across three Azure availability zones in the primary region.

ZRS for SSD file shares is supported in the following subset of Azure regions:

- (Africa) South Africa North
- (Asia Pacific) Australia East
- (Asia Pacific) Central India
- (Asia Pacific) China North 3
- (Asia Pacific) East Asia
- (Asia Pacific) Indonesia Central
- (Asia Pacific) Japan East
- (Asia Pacific) Japan West  
- (Asia Pacific) Korea Central
- (Asia Pacific) Malaysia West
- (Asia Pacific) New Zealand North
- (Asia Pacific) Southeast Asia
- (Canada) Canada Central
- (Europe) Austria East
- (Europe) Belgium Central
- (Europe) France Central
- (Europe) Germany West Central
- (Europe) Italy North
- (Europe) North Europe
- (Europe) Norway East
- (Europe) Poland Central
- (Europe) Spain Central
- (Europe) Sweden Central
- (Europe) Switzerland North
- (Europe) UK South
- (Europe) West Europe
- (Middle East) Israel Central
- (Middle East) Qatar Central
- (Middle East) UAE North
- (North America) Central US
- (North America) East US
- (North America) East US 2
- (North America) Mexico Central
- (North America) South Central US
- (North America) West US 2
- (North America) West US 3
- (South America) Brazil South
- (South America) Chile Central
- (US Government) US Gov Virginia
  
## See also

- [Azure Files redundancy](files-redundancy.md)
