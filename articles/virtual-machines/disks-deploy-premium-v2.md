---
title: Deploy a premium SSD v2 (preview) managed disk
description: Learn how to deploy a premium SSD v2 (preview).
author: roygara
ms.author: rogarana
ms.date: 06/17/2022
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
---

# Premium SSD v2 (preview)

Azure premium SSD v2 (preview) is designed for performance-sensitive workloads that consistently require less than 1 ms average read and write latency, high IOPS, and throughput. The IOPS and throughput of a premium SSD v2 A few example workloads that premium SSD v2 is suitable for are SQL server, Oracle, Cassandra, and Mongo DB.

## Limitations

Premium SSD v2 can't be used as OS disks, they can only be created as empty data disks. Premium SSD v2 also can't be used with some features and functionality, including disk snapshots, disk export, changing disk type, VM images, availability sets, Azure Dedicated Hosts, or Azure disk encryption. Azure Backup and Azure Site Recovery don't support premium SSD v2. In addition, only uncached reads and uncached writes are supported.

The only infrastructure redundancy options currently available to premium SSD v2 are availability zones. VMs using any other redundancy options can't attach a premium SSD v2.

Premium SSD v2 supports a 4k physical sector size by default. A 512E sector size is available as a generally available offering with no sign-up required. While most applications are compatible with 4k sector sizes, some require 512-byte sector sizes. Oracle Database, for example, requires release 12.2 or later in order to support 4k native disks. For older versions of Oracle DB, 512-byte sector size is required.

## Prerequisites

Sign up for the preview.

## Determine VM size and region availability

### VMs using availability zones

To use premium SSD v2, you need to determine which availability zone you are in. Not every region supports every VM size with premium SSD v2. To determine if your region, zone, and VM size support premium SSD v2, run either of the following commands, make sure to replace the **region**, **vmSize**, and **subscription** values first:

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

## Deploy a premium SSD v2

Portal, PowerShell, CLI, ARM, steps here.

# [Azure CLI](#tab/azure-cli)

You must create a VM that is capable of using premium SSD v2, to attach one.

Replace or set the **$vmname**, **$rgname**, **$diskname**, **$location**, **$password**, **$user** variables with your own values. Set **$zone**  to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following CLI command:

```azurecli-interactive
az disk create --subscription $subscription -n $diskname -g $rgname --size-gb 1024 --location $location --sku Premium_SKU_NAME --disk-iops-read-write 8192 --disk-mbps-read-write 400
az vm create --subscription $subscription -n $vmname -g $rgname --image Win2016Datacenter --zone $zone --authentication-type password --admin-password $password --admin-username $user --size Standard_D4s_v3 --location $location --attach-data-disks $diskname
```

# [PowerShell](#tab/azure-powershell)

To use a premium SSD v2, you must create a VM that is capable of using it. Replace or set the **$resourcegroup** and **$vmName** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following [New-AzVm](/powershell/module/az.compute/new-azvm) command:

```powershell
New-AzVm `
    -ResourceGroupName $resourcegroup `
    -Name $vmName `
    -Location "eastus2" `
    -Image "Win2016Datacenter" `
    -size "Standard_D4s_v3" `
    -zone $zone
```
---