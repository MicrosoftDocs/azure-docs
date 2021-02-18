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

Azure managed disks offer two storage redundancy options, zone-redundant storage (ZRS) as a preview, and locally-redundant storage. ZRS provides higher durability and availability for managed disks than locally-redundant storage (LRS) does. However, the write latency for LRS disks is better than ZRS disks because LRS disks synchronously write data to three copies in a single data center.

## Locally-redundant storage for managed disks

Locally-redundant storage (LRS) replicates your data three times within a single data center in the selected region. LRS is the lowest-cost redundancy option and offers the least durability compared to ZRS. LRS protects your data against server rack and drive failures. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a disk using LRS may be lost or unrecoverable. LRS is recommended for workloads that value write latency over durability and availability.

You can get better availability for VMs using LRS disks by using applications like SQL Server AlwaysOn, that can synchronously write data to two zones, and automatically failover to another zone during a disaster. If your workflow doesn't support application-level synchronous writes across zones, you can use a ZRS disk for better availability.

## Zone-redundant storage for managed disks (preview)

Zone-redundant storage (ZRS) replicates your Azure managed disk synchronously across three Azure availability zones in the selected region. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS is recommended for workloads that value durability and availability over write latency.

ZRS disks allow you to recover from failures in availability zones. If an entire zone went down, a ZRS disk can be attached to a VM in a different zone.  A shared ZRS disk can be attached to a standby VM in a secondary zone in a deallocated state. You can also attach a shared ZRS disk to a standby VM in a secondary zone in a deallocated state. If there is a failure in the primary zone, you can quickly start the standby VM and make it active using SCSI persistent reservation.  

You can attach a shared ZRS disk to VMs spread on multiple zones to help you take advantage of both ZRS disks and Availability Zones for VMs for higher availability.

### Limitations

During the preview, ZRS for managed disks has the following restrictions:

- Only supported with premium solid-state drives (SSD) and standard SSDs.
- Currently available only in the EastUS2EUAP region.
- ZRS disks can only be created with Azure Resource Manager templates using the `2020-12-01` API.

### Billing implications

Premium SSD and standard SSD ZRS disks are priced 1.5X than corresponding LRS disks. For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

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