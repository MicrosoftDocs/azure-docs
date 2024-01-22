---
title: Migrate Azure VMs to Managed Disks 
description: Migrate Azure virtual machines created using unmanaged disks in storage accounts to use Managed Disks.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 05/30/2019
ms.author: rogarana
---

# Migrate Azure VMs to Managed Disks in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs 

Azure Managed Disks simplifies your storage management by removing the need to separately manage storage accounts.  You can also migrate your existing Azure VMs to Managed Disks to benefit from better reliability of VMs in an Availability Set. It ensures that the disks of different VMs in an Availability Set are sufficiently isolated from each other to avoid single point of failures. It automatically places disks of different VMs in an Availability Set in different Storage scale units (stamps) which limits the impact of single Storage scale unit failures caused due to hardware and software failures.
Based on your needs, you can choose from four types of storage options. To learn about the available disk types, see our article [Select a disk type](../disks-types.md)

## Migration scenarios

You can migrate to Managed Disks in following scenarios:

|Scenario  |Article  |
|---------|---------|
|Convert stand alone VMs and VMs in an availability set to managed disks     |[Convert VMs to use managed disks](convert-unmanaged-to-managed-disks.md)         |
|Convert a single VM from classic to Resource Manager on managed disks     |[Create a VM from a classic VHD](create-vm-specialized-portal.md)         |
|Convert all the VMs in a vNet from classic to Resource Manager on managed disks     |[Migrate IaaS resources from classic to Resource Manager](../migration-classic-resource-manager-ps.md) and then [Convert a VM from unmanaged disks to managed disks](convert-unmanaged-to-managed-disks.md)         |
|Upgrade VMs with standard unmanaged disks to VMs with managed premium disks     | First, [Convert a Windows virtual machine from unmanaged disks to managed disks](convert-unmanaged-to-managed-disks.md). Then [Update the storage type of a managed disk](../disks-convert-types.md).         |

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

## Next steps

- Learn more about [Managed Disks](../managed-disks-overview.md)
- Review the [pricing for Managed Disks](https://azure.microsoft.com/pricing/details/managed-disks/).