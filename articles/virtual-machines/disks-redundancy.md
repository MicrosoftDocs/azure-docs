---
title: Redundancy options for Azure managed disks
description: Learn about zone-redundant storage and locally-redundant storage for Azure managed disks.
author: roygara
ms.author: rogarana
ms.date: 05/26/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Redundancy options for managed disks

Azure managed disks offer two storage redundancy options, zone-redundant storage (ZRS) as a preview, and locally-redundant storage. ZRS provides higher availability for managed disks than locally-redundant storage (LRS) does. However, the write latency for LRS disks is better than ZRS disks because LRS disks synchronously write data to three copies in a single data center.

## Locally-redundant storage for managed disks

Locally-redundant storage (LRS) replicates your data three times within a single data center in the selected region. LRS protects your data against server rack and drive failures. 

There are a few ways you can protect your application using LRS disks from an entire zone failure that may occur due to natural disasters or hardware issues:
- Use an application like SQL Server AlwaysOn, that can synchronously write data to two zones, and automatically failover to another zone during a disaster.
- Take frequent backups of LRS disks with ZRS snapshots.
- Enable cross-zone disaster recovery for LRS disks via [Azure Site Recovery](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md). However, cross-zone disaster recovery doesn't provide zero Recovery Point Objective (RPO).

If your workflow doesn't support application-level synchronous writes across zones, or your application must meet zero RPO, then ZRS disks would ideal.

## Zone-redundant storage for managed disks (preview)

Zone-redundant storage (ZRS) replicates your Azure managed disk synchronously across three Azure availability zones in the selected region. Each availability zone is a separate physical location with independent power, cooling, and networking. 

ZRS disks allow you to recover from failures in availability zones. If an entire zone went down, a ZRS disk can be attached to a VM in a different zone. You can also use ZRS disks as a shared disk to provide improved availability for clustered or distributed applications like SQL FCI, SAP ASCS/SCS, or GFS2. You can attach a shared ZRS disk to primary and secondary VMs in different zones to take advantage of both ZRS and [Availability Zones](../availability-zones/az-overview.md). If your primary zone fails, you can quickly fail over to the secondary VM using [SCSI persistent reservation](disks-shared-enable.md#supported-scsi-pr-commands).

### Billing implications

For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Comparison with other disk types

Except for more write latency, disks using ZRS are identical to disks using LRS. They have the same performance targets. We recommend you to conduct [disk-benchmarking](disks-benchmarks.md) to simulate the workload of your application for comparing the latency between the LRS and ZRS disks. 

### Limitations

During the preview, ZRS for managed disks has the following restrictions:

- Only supported with premium solid-state drives (SSD) and standard SSDs.
- Currently available only in the West US 2, West Europe, North Europe, and France Central regions.
- ZRS disks can only be created with one of the following methods:
    -  Azure Resource Manager templates using the `2020-12-01` API in the public preview.
    - The latest Azure CLI


### Create ZRS managed disks

# [Azure CLI](#tab/azure-cli)

#### Prerequisites

You must enable the feature for your subscription. Use the following steps to enable the feature for your subscription:

1.	Execute the following command to register the feature for your subscription

    ```azurecli
    az feature register --namespace Microsoft.Compute --name SsdZrsManagedDisks
    ```
 
2.	Confirm that the registration state is **Registered** (it may take a few minutes) using the following command before trying out the feature.

    ```azurecli
    az feature show --namespace Microsoft.Compute --name SsdZrsManagedDisks
    ```

#### Create a VM with ZRS disks

```azurecli
rgName=yourRGName
vmName=yourVMName
location=westus2
vmSize=Standard_DS2_v2
image=UbuntuLTS 
osDiskSku=StandardSSD_ZRS
dataDiskSku=Premium_ZRS


az vm create -g $rgName \
-n $vmName \
-l $location \
--image $image \
--size $vmSize \
--generate-ssh-keys \
--data-disk-sizes-gb 128 \
--storage-sku os=$osDiskSku 0=$dataDiskSku
```
#### Create VMs with a shared ZRS disk attached to the VMs in different zones
```azurecli

location=westus2
rgName=yourRGName
vmNamePrefix=yourVMNamePrefix
vmSize=Standard_DS2_v2
image=UbuntuLTS
osDiskSku=StandardSSD_LRS
sharedDiskName=yourSharedDiskName
sharedDataDiskSku=Premium_ZRS


az disk create -g $rgName \
-n $sharedDiskName \
-l $location \
--size-gb 1024 \
--sku $sharedDataDiskSku \
--max-shares 2


sharedDiskId=$(az disk show -g $rgName -n $sharedDiskName --query 'id' -o tsv)

az vm create -g $rgName \
-n $vmNamePrefix"01" \
-l $location \
--image $image \
--size $vmSize \
--generate-ssh-keys \
--zone 1 \
--attach-data-disks $sharedDiskId \
--storage-sku os=$osDiskSku \
--vnet-name $vmNamePrefix"_vnet" \
--subnet $vmNamePrefix"_subnet"

az vm create -g $rgName \
-n $vmNamePrefix"02" \
-l $location \
--image $image \
--size $vmSize \
--generate-ssh-keys \
--zone 2 \
--attach-data-disks $sharedDiskId \
--storage-sku os=$osDiskSku \
--vnet-name $vmNamePrefix"_vnet" \
--subnet $vmNamePrefix"_subnet"

```
#### Create a virtual machine scale set with ZRS Disks
```azurecli
location=westus2
rgName=yourRGName
vmssName=yourVMSSName
vmSize=Standard_DS3_V2
image=UbuntuLTS 
osDiskSku=StandardSSD_ZRS
dataDiskSku=Premium_ZRS

az vmss create -g $rgName \
-n $vmssName \
--encryption-at-host \
--image UbuntuLTS \
--upgrade-policy automatic \
--generate-ssh-keys \
--data-disk-sizes-gb 128 \
--storage-sku os=$osDiskSku 0=$dataDiskSku
```

# [Resource Manager Template](#tab/azure-resource-manager)

Use the `2020-12-01` API with your Azure Resource Manager template to create a ZRS disk.

#### Prerequisites

You must enable the feature for your subscription. Use the following steps to enable the feature for your subscription:

1.	Execute the following command to register the feature for your subscription

    ```powershell
     Register-AzProviderFeature -FeatureName "SsdZrsManagedDisks" -ProviderNamespace "Microsoft.Compute" 
    ```

2.	Confirm that the registration state is **Registered** (it may take a few minutes) using the following command before trying out the feature.

    ```powershell
     Get-AzProviderFeature -FeatureName "SsdZrsManagedDisks" -ProviderNamespace "Microsoft.Compute"  
    ```
    
#### Create a VM with ZRS disks

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
-TemplateUri "https://raw.githubusercontent.com/Azure-Samples/managed-disks-powershell-getting-started/master/ZRSDisks/CreateVMWithZRSDataDisks.json" `
-resourceName $vmName `
-adminUsername $adminUsername `
-adminPassword $adminPassword `
-region $region `
-osDiskType $osDiskType `
-dataDiskType $dataDiskType
```

#### Create VMs with a shared ZRS disk attached to the VMs in different zones

```
$vmNamePrefix = "yourVMNamePrefix"
$adminUsername = "yourAdminUserName"
$adminPassword = ConvertTo-SecureString "yourAdminPassword" -AsPlainText -Force
$osDiskType = "StandardSSD_LRS"
$sharedDataDiskType = "Premium_ZRS"
$region = "eastus2euap"
$resourceGroupName = "zrstesting1"

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
-TemplateUri "https://raw.githubusercontent.com/Azure-Samples/managed-disks-powershell-getting-started/master/ZRSDisks/CreateVMsWithASharedDisk.json" `
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
-TemplateUri "https://raw.githubusercontent.com/Azure-Samples/managed-disks-powershell-getting-started/master/ZRSDisks/CreateVMSSWithZRSDisks.json" `
-vmssName "yourVMSSName" `
-adminUsername "yourAdminName" `
-adminPassword $password `
-region "eastus2euap" `
-osDiskType "StandardSSD_LRS" `
-dataDiskType "Premium_ZRS" `
```
---

## Next steps

- Check out more [Azure Resource Manager templates to create a VM with ZRS disks](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/ZRSDisks).
