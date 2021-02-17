---
title: ZRS for managed disks
description: Learn about ZRS for managed disks
author: roygara
ms.author: rogarana
ms.date: 02/12/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
---

# Zone-redundant storage for managed disks (preview)

Zone-redundant storage (ZRS) replicates your Azure Disk Storage data synchronously across three Azure availability zones in the selected region. Each availability zone is a separate physical location with independent power, cooling, and networking. ZRS provides higher durability and availability for managed disks than locally-redundant storage (LRS) does. However, the write latency for disks that use LRS is better than disks that use ZRS because LRS disks synchronously write data to three copies in a single data center. Because of this, ZRS is recommended for disks that have workloads that depend more on durability and availability, rather than write latency.

You can achieve better availability for VMs using LRS disks by using applications like SQL Server AlwaysOn to synchronously write data to two zones and automatically failover to another zone during a disaster. However, suppose you are using industry-specific proprietary software, legacy applications such as an old version of SQL, Cassandra, etc., that don't support application-level synchronous writes across zones. In that case, you can use ZRS disks for better availability. In the event of an entire zone going down due to hardware failures or natural disasters, when your virtual machines become unavailable in the zone, you can attach ZRS disks to a VM in another zone. You can also attach a shared ZRS disk to a standby VM in a secondary zone in deallocated state. In the event of a failure in the primary zone, you can quickly start the standby VM and make it active using SCSI persistent reservation.  

You can also use ZRS disks for shared disks attached to failover clusters where disks are shared with multiple VMs such as SQL failover cluster instance (FCI), SAP ASCS. We allow you to attach a shared ZRS disk to VMs spread on multiple zones to help you take advantage of both ZRS disks and Availability Zones for VMs for higher availability.

## Limitations

During the preview, ZRS for managed disks has the following restrictions:

- Only supported with premium solid-state drives (SSD) and standard SSDs.
- Currently available only in the EastUS2EUAP region.
- ZRS disks can only be created with Azure Resource Manager templates using the `2020-12-01` API.

## Billing implications

Premium SSD and Standard SSD ZRS disks are priced 1.5X than the corresponding LRS disks. For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

## Comparison with other disk types

Except for additional write latency, disks using ZRS are identical to disks using LRS. They have the same performance targets. ZRS is ideal when write latency is less critical than durability and availability achieved by data redundancy in multiple zones.

## Create ZRS managed disks

You must use the `2020-12-01` API with your Azure Resource Manager template to create a managed disk with ZRS enabled.

### Create VMs with ZRS data disks with Read caching enabled  

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

### Create VMs with a shared ZRS disk attached to the VMs

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

### Create a virtual machine scale set with ZRS Disks

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
