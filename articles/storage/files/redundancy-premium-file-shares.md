---
title: Redundancy support for SSD Azure file shares
description: SSD (premium) file storage is provided for Azure file shares through the FileStorage storage account kind. Determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for SSD file shares.
author: khdownie
services: storage
ms.service: azure-file-storage
ms.topic: reference
ms.date: 06/23/2026
ms.author: kendownie
ms.custom: references_regions
# Customer intent: "As a cloud storage administrator, I want to identify Azure regions that support locally redundant storage (LRS) and zone redundant storage (ZRS) for SSD file shares, so that I can ensure optimal data redundancy and availability for my organization's storage needs."
---

# Azure Files redundancy support for SSD file shares

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider and using the SSD media tier

:heavy_check_mark: **Applies to:** File shares created with the Microsoft.FileShares resource provider

Azure Files supports SSD file shares in a subset of all Azure regions. Use this article to determine the Azure regions in which locally redundant storage (LRS) and zone redundant storage (ZRS) are supported for SSD file shares.

## LRS support for SSD classic file shares

LRS copies your data synchronously three times within a single physical location in the primary region.

LRS for SSD file shares using Microsoft.Storage resource provider is supported in the following Azure regions:

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

## ZRS support for SSD classic file shares

ZRS replicates your storage account synchronously across three Azure availability zones in the primary region.

ZRS for SSD file shares using Microsoft.Storage resource provider is supported in the following subset of Azure regions:

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
  
## LRS support for SSD file shares
LRS copies your data synchronously three times within a single physical location in the primary region.

LRS for SSD file shares using Microsoft.FileShares resource provider is supported in the following Azure regions:

- Australia Central
- Australia East
- Australia Southeast
- Brazil South
- Brazil Southeast
- Canada Central
- Canada East
- Central India
- East Asia
- East US
- France Central
- France South
- Germany North
- Germany West Central
- Israel Central
- Italy North
- Japan East
- Japan West
- JIO India Central
- JIO India West
- Korea Central
- Korea South
- North Central US
- North Europe
- Norway East
- Norway West
- Poland Central
- South Africa North
- South Africa West
- South Central US
- South India
- Southeast Asia
- Sweden Central
- UAE Central
- UAE North
- UK South
- UK West
- West Europe
- West US

## ZRS support for SSD file shares
ZRS replicates your storage account synchronously across three Azure availability zones in the primary region.

ZRS for SSD file shares using Microsoft.FileShares resource provider is supported in the following subset of Azure regions:

- West US
- Australia East
- Brazil South
- Canada Central
- Central India
- East US
- East Asia
- France Central
- Germany West Central
- Israel Central
- Italy North
- Japan East
- Japan West
- Korea Central
- North Europe
- Norway East
- Poland Central
- South Africa North
- South Central US
- Southeast Asia
- Sweden Central
- UAE North
- UK South
- West Europe

## See also

- [Azure Files redundancy](files-redundancy.md)
