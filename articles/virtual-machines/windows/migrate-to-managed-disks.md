---
title: Migrate Azure VMs to Managed Disks | Microsoft Docs
description: Migrate Azure virtual machines created using unmanaged disks in storage accounts to use Managed Disks.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/03/2018
ms.author: cynthn
ms.subservice: disks

---

# Migrate Azure VMs to Managed Disks in Azure

Azure Managed Disks simplifies your storage management by removing the need to separately manage storage accounts.  You can also migrate your existing Azure VMs to Managed Disks to benefit from better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set is sufficiently isolated from each other to avoid single point of failures. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.
Based on your needs, you can choose from four types of storage options. To learn about the available disk types, see our article [Select a disk type](disks-types.md)

## Migrate scenarios

You can migrate to Managed Disks in following scenarios:

| **Migrate...**                                            | **Documentation link**                                                                                                                                                                                                                                                                  |
|----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Convert stand alone VMs and VMs in an availability set to managed disks   | [Convert VMs to use managed disks](convert-unmanaged-to-managed-disks.md) |
| A single VM from classic to Resource Manager on managed disks     | [Create a VM from a classic VHD](create-vm-specialized-portal.md)  | 
| All the VMs in a vNet from classic to Resource Manager on managed disks     | [Migrate IaaS resources from classic to Resource Manager](migration-classic-resource-manager-ps.md) and then [Convert a VM from unmanaged disks to managed disks](convert-unmanaged-to-managed-disks.md) | 


## Next steps

- Learn more about [Managed Disks](managed-disks-overview.md)
- Review the [pricing for Managed Disks](https://azure.microsoft.com/pricing/details/managed-disks/).
