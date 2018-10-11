---
title: Differences and considerations for Managed Disks in Azure Stack | Microsoft Docs
description: Learn about differences and considerations when working with Managed Disks in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2018
ms.author: sethm
ms.reviewer: jiahan

---

# Azure Stack Managed Disks: Differences and considerations
This article summarizes the known differences between Azure Stack Managed Disks and Managed Disks for Azure. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) article.

Managed Disks simplifies disk management for IaaS VMs by managing the [storage accounts](/azure/azure-stack/azure-stack-manage-storage-accounts) associated with the VM disks.
  

## Cheat sheet: Managed disk differences

| Feature | Azure (global) | Azure Stack |
| --- | --- | --- |
|Encryption for Data at Rest |Azure Storage Service Encryption (SSE), Azure Disk Encryption (ADE)     |BitLocker 128-bit AES encryption      |
|Image          | Support managed custom image |Not yet supported|
|Backup options |Support Azure Backup Service |Not yet supported |
|Disaster recovery options |Support Azure Site Recovery |Not yet supported|
|Disk types     |Premium SSD, Standard SSD (Preview), and Standard HDD |Premium SSD, Standard HDD |
|Premium disks  |Fully supported |Can be provisioned, but no performance limit or guarantee  |
|Premium disks IOPs  |Depends on disk size  |2300 IOPs per disk |
|Premium disks throughput |Depends on disk size |145 MB/second per disk |
|Disk max size  |4 TB       |1 TB       |
|Disks performance analytic |Aggregate metrics and per disk metrics supported |Not yet supported |
|Migration      |Provide tool to migrate from existing unmanaged Azure Resource Manager VMs without the need to recreate the VM  |Not yet supported |


## Metrics
There are also differences with storage metrics:
- With Azure Stack, the transaction data in storage metrics doesn't differentiate internal or external network bandwidth.
- Azure Stack transaction data in storage metrics doesn't include virtual machine access to the mounted disks.


## API versions
Azure Stack Managed Disks supports the following API versions:
- 2017-03-30


## Next steps
[Learn about Azure Stack virtual machines](azure-stack-compute-overview.md)
