---
title: Redundancy options for Azure managed disks
description: Learn about zone-redundant storage and locally-redundant storage for Azure managed disks.
author: roygara
ms.author: rogarana
ms.date: 03/02/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Redundancy options for managed disks

Azure managed disks offer two storage redundancy options, zone-redundant storage (ZRS) as a preview, and locally-redundant storage. ZRS provides higher availability for managed disks than locally-redundant storage (LRS) does. However, the write latency for LRS disks is better than ZRS disks because LRS disks synchronously write data to three copies in a single data center.

## Locally-redundant storage for managed disks

Locally-redundant storage (LRS) replicates your data three times within a single data center in the selected region. LRS protects your data against server rack and drive failures. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a disk using LRS may be lost or unrecoverable. LRS is recommended for workloads that value write latency over availability.

You can get better availability for VMs using LRS disks by using applications like SQL Server AlwaysOn, that can synchronously write data to two zones, and automatically failover to another zone during a disaster. If your workflow doesn't support application-level synchronous writes across zones, you can use a ZRS disk for better availability. You may also achieve better availability by taking frequent backups of your disks using ZRS snapshots. You can also enable cross-zone disaster recovery for LRS disks via [Azure Site Recovery](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md). However, these options do not provide zero Recovery Point Objective (RPO). If your application must meet zero RPO, then ZRS disks would be ideal.

## Zone-redundant storage for managed disks (preview)

Zone-redundant storage (ZRS) replicates your Azure managed disk synchronously across three Azure availability zones in the selected region. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS is recommended for workloads that value availability over write latency.

ZRS disks allow you to recover from failures in availability zones. If an entire zone went down, a ZRS disk can be attached to a VM in a different zone. You can also use ZRS disks in combination with shared disks to provide improved availability for clustered or distributed applications like SQL FCI, SAP ASCS/SCS, or GFS2. You can attach a shared ZRS disk to primary and secondary VMs allocated on different zones to take advantage of both ZRS disks and [Availability Zones](../availability-zones/az-overview.md) for VMs for higher availability. In the event of a primary zone failure, you can quickly fail over to the secondary VM using [SCSI persistent reservation](disks-shared-enable.md#supported-scsi-pr-commands).

### Limitations

During the preview, ZRS for managed disks has the following restrictions:

- Only supported with premium solid-state drives (SSD) and standard SSDs.
- Currently available only in the EastUS2EUAP region.
- ZRS disks can only be created with Azure Resource Manager templates using the `2020-12-01` API.

Sign up for the preview [here](https://aka.ms/ZRSDisksPreviewSignUp).

### Billing implications

For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Comparison with other disk types

Except for more write latency, disks using ZRS are identical to disks using LRS. They have the same performance targets.

### Create ZRS managed disks

You need to use the `2020-12-01` API with your Azure Resource Manager template to create a ZRS disk.

#### Create VMs with ZRS data disks with Read caching enabled  

```
$vmName = "yourVMName" 
$adminUsername = "yourAdminUsername"
$adminPassword = ConvertTo-SecureString "yourAdminPassword" -AsPlainText -Force
$osDiskType = "StandardSSD_ZRS"
$dataDiskType = "Premium_ZRS"
$region = "eastus2euap"
$resourceGroupName = "yourResourceGroupName"

New-AzResourceGroup -Name $resourceGroupName -Location $region
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
-TemplateUri "https://raw.githubusercontent.com/ramankumarlive/zrsdisks/main/ARMTemplates/CreateVMWithZRSDataDisks.json" `
-resourceName $vmName `
-adminUsername $adminUsername `
-adminPassword $adminPassword `
-region $region `
-osDiskType $osDiskType `
-dataDiskType $dataDiskType
```

#### Create VMs with a shared ZRS disk attached to the VMs

```
$vmNamePrefix = "yourVMNamePrefix"
$adminUsername = "yourAdminUserName"
$adminPassword = ConvertTo-SecureString "yourAdminPassword" -AsPlainText -Force
$osDiskType = "StandardSSD_LRS"
$sharedDataDiskType = "Premium_ZRS"
$region = "eastus2euap"
$resourceGroupName = "zrstesting1"

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
-TemplateUri "https://raw.githubusercontent.com/ramankumarlive/zrsdisks/main/ARMTemplates/CreateVMsWithASharedDisk.json" `
-vmNamePrefix $vmNamePrefix `
-adminUsername $adminUsername `
-adminPassword $adminPassword `
-region $region `
-osDiskType $osDiskType `
-dataDiskType $sharedDataDiskType
```

#### Create a virtual machine scale set with ZRS Disks

```
$vmssName="yourVMSSName"
$adminUsername="yourAdminName"
$adminPassword=ConvertTo-SecureString "yourAdminPassword" -AsPlainText -Force
$region="eastus2euap"
$osDiskType="StandardSSD_LRS"
$dataDiskType="Premium_ZRS"

New-AzResourceGroupDeployment -ResourceGroupName zrstesting `
-TemplateUri "https://raw.githubusercontent.com/ramankumarlive/zrsdisks/main/ARMTemplates/CreateVMSSWithZRSDisks.json" `
-vmssName "yourVMSSName" `
-adminUsername "yourAdminName" `
-adminPassword $password `
-region "eastus2euap" `
-osDiskType "StandardSSD_LRS" `
-dataDiskType "Premium_ZRS" `
```