---
title: Deploy a premium SSD v2 (preview) managed disk
description: Learn how to deploy a premium SSD v2 (preview).
author: roygara
ms.author: rogarana
ms.date: 07/08/2022
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Deploy a Premium SSD v2 (preview)

Azure premium SSD v2 (preview) is designed for a broad range of IO-Intensive enterprise production workloads that require sub-millisecond disk latencies as well as high IOPS and throughput at a low cost. General purpose transaction-sensitive workloads such as SQL server, Oracle, Cassandra, and Mongo DB and high-throughput Big-Data applications like Cloudera/Hadoop can advantage of Premium SSD v2. For conceptual information on Premium SSD v2, see [Premium SSD v2 (preview)](disks-types.md#premium-ssd-v2-preview).

## Limitations

Premium SSD v2 can't be used as OS disks, they can only be created as empty data disks. Premium SSD v2 also can't be used with some features and functionality, including disk snapshots, disk export, changing disk type, VM images, availability sets, or Azure disk encryption. Azure Backup and Azure Site Recovery don't support premium SSD v2 yet. In addition, only uncached reads and uncached writes are supported.

The only infrastructure redundancy options currently available to premium SSD v2 are availability zones. VMs using any other redundancy options can't attach a premium SSD v2.

Premium SSD v2 supports a 4k physical sector size by default. A 512E sector size is also available as another option. While most applications are compatible with 4k sector sizes, some require 512-byte sector sizes. Oracle Database, for example, requires release 12.2 or later in order to support 4k native disks. For older versions of Oracle DB, 512-byte sector size is required.

### Regional availability

[!INCLUDE [disks-premv2-regions](../../includes/disks-premv2-regions.md)]

## Prerequisites

Sign up for the preview.

## Determine VM size and region availability

### VMs using availability zones

To use a premium SSD v2, you need to determine which availability zone you are in. Not every region supports every VM size with premium SSD v2. To determine if your region, zone, and VM size support premium SSD v2, run either of the following commands, make sure to replace the **region**, **vmSize**, and **subscription** values first:

#### CLI

```azurecli
subscription="<yourSubID>"
# example value is southeastasia
region="<yourLocation>"
# example value is Standard_E64s_v3
vmSize="<yourVMSize>"

az vm list-skus --resource-type virtualMachines  --location $region --query "[?name=='$vmSize'].locationInfo[0].zoneDetails[0].Name" --subscription $subscription
```

#### PowerShell

```powershell
$region = "southeastasia"
$vmSize = "Standard_E64s_v3"
$sku = (Get-AzComputeResourceSku | where {$_.Locations.Contains($region) -and ($_.Name -eq $vmSize) -and $_.LocationInfo[0].ZoneDetails.Count -gt 0})
if($sku){$sku[0].LocationInfo[0].ZoneDetails} Else {Write-host "$vmSize is not supported with premium SSD v2 in $region region"}
```

The response will be similar to the form below, where X is the zone to use for deploying in your chosen region. X could be either 1, 2, or 3.

Preserve the **Zones** value, it represents your availability zone and you'll need it in order to deploy a premium SSD v2.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |premium_SKU_Name         |eastus2         |X         |         |         |         |

> [!NOTE]
> If there was no response from the command, then the selected VM size is not supported with premium SSD v2 in the selected region.

Now that you know which zone to deploy to, follow the deployment steps in this article to either deploy a VM with a premium SSD v2 attached or attach a premium SSD v2 to an existing VM.

## Create a premium SSD v2

Portal, PowerShell, CLI, ARM, steps here.

# [Azure CLI](#tab/azure-cli)

You must create a VM that is capable of using premium SSD v2, to attach one.

Replace or set the **$vmname**, **$rgname**, **$diskname**, **$location**, **$password**, **$user** variables with your own values. Set **$zone**  to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following CLI command:

```azurecli-interactive
az disk create --subscription $subscription -n $diskname -g $rgname --size-gb 1024 --location $location --sku Premium_SKU_NAME --disk-iops-read-write 400 --disk-mbps-read-write 400
az vm create --subscription $subscription -n $vmname -g $rgname --image Win2016Datacenter --zone $zone --authentication-type password --admin-password $password --admin-username $user --size Standard_D4s_v3 --location $location --attach-data-disks $diskname
```

# [PowerShell](#tab/azure-powershell)

To use a premium SSD v2, you must create a VM that is capable of using it. Set values for **$resourcegroup** and **$vmName**, then set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following [New-AzVm](/powershell/module/az.compute/new-azvm) command:

```powershell
# Set parameters and select subscription
$subscription = "<yourSubscriptionID>"
$resourceGroup = "<yourResourceGroup>"
$vmName = "<yourVMName>"
$diskName = "<yourDiskName>"
$lun = 1

Connect-AzAccount -SubscriptionId $subscription

New-AzVm `
    -ResourceGroupName $resourcegroup `
    -Name $vmName `
    -Location "eastus2" `
    -Image "Win2016Datacenter" `
    -size "Standard_D4s_v3" `
    -zone $zone

# Create the disk
$diskconfig = New-AzDiskConfig `
-Location 'EastUS2' `
-DiskSizeGB 8 `
-DiskIOPSReadWrite 400 `
-DiskMBpsReadWrite 100 `
-AccountType PremiumV2SKU `
-CreateOption Empty `
-zone $zone;

New-AzDisk `
-ResourceGroupName $resourceGroup `
-DiskName $diskName `
-Disk $diskconfig;

# add disk to VM
$vm = Get-AzVM -ResourceGroupName $resourceGroup -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $resourceGroup -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
```

---

### Create a premium SSD - 512 byte sector size

# [Azure CLI](#tab/azure-cli)

```azurecli
#Define variables
location="eastus2"
subscription="xxx"
rgName="<yourResourceGroupName>"
diskName="<yourDiskName>"
vmName="<yourVMName>"
zone=123
subscriptionId="<yourSubscriptionID>"

#Create an ultra disk
az disk create `
--subscription $subscription `
-n $diskname `
-g $rgname `
--size-gb 100 `
--location $location `
--zone $zone `
--sku PremiumV2SKU `
--disk-iops-read-write 400 `
--disk-mbps-read-write 50

#Attach the disk
az vm disk attach -g $rgName --vm-name $vmName --disk $diskName --subscription $subscriptionId
```

# [PowerShell](#tab/azure-powershell)

Optionally, you can deploy a premium SSD v2 that has a 512 byte sector size.

```azurepowershell
#create a premium SSD v2 with 512 sector size
az disk create --subscription $subscription -n $diskname -g $rgname --size-gb 100 --location $location --sku premiumV2SKU --disk-iops-read-write 400 --disk-mbps-read-write 400 --logical-sector-size 512
```
---

## Adjust disk performance

# [Azure CLI](#tab/azure-cli)

```azurecli
az disk update `
--subscription $subscription `
--resource-group $rgname `
--name $diskName `
--set diskIopsReadWrite=5000 `
--set diskMbpsReadWrite=200
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$diskupdateconfig = New-AzDiskUpdateConfig -DiskMBpsReadWrite 2000
Update-AzDisk -ResourceGroupName $resourceGroup -DiskName $diskName -DiskUpdate $diskupdateconfig
```
---

## Next steps