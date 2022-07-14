---
title: Deploy a Premium SSD v2 (preview) managed disk
description: Learn how to deploy a Premium SSD v2 (preview).
author: roygara
ms.author: rogarana
ms.date: 07/13/2022
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---

# Deploy a Premium SSD v2 (preview)

Azure Premium SSD v2 (preview) is designed for IO-Intensive enterprise production workloads that require sub-millisecond disk latencies and high IOPS and throughput at a low cost. You can take advantage of Premium SSD v2 for a broad range of production workloads such as SQL server, Oracle, MariaDB, SAP, Cassandra, Mongo DB, big data/analytics, gaming, on virtual machines or stateful containers. For conceptual information on Premium SSD v2, see [Premium SSD v2 (preview)](disks-types.md#Premium-ssd-v2-preview).

## Limitations

[!INCLUDE [disks-prem-v2-limitations](../../includes/disks-prem-v2-limitations.md)]

### Regional availability

[!INCLUDE [disks-premv2-regions](../../includes/disks-premv2-regions.md)]

## Prerequisites

- [Sign-up](https://aka.ms/PremiumSSDv2PreviewForm) for the public preview.
- Install either the latest [Azure CLI](/cli/azure/install-azure-cli) or the latest [Azure PowerShell module](/powershell/azure/install-az-ps?view=azps-8.1.0). 

## Determine region availability

### VMs using availability zones

To use a Premium SSD v2, you need to determine the regions and zones where it's supported. Not every region and zones support Premium SSD v2. To determine if your region, and zone support premium SSD v2, run the following command:

# [Azure CLI](#tab/azure-cli)

```azurecli
az login

subscriptionId="<yourSubscriptionId>"

az account set --subscription $subscriptionId

az vm list-skus --resource-type disks --query "[?name=='PremiumV2_LRS'].{Region:locationInfo[0].location, Zones:locationInfo[0].zones}" 
```

# [PowerShell](#tab/azure-powershell)

```powershell
Connect-AzAccount

$subscriptionId="yourSubscriptionId"

Set-AzContext -Subscription $subscriptionId

Get-AzComputeResourceSku | where {$_.ResourceType -eq 'disks' -and $_.Name -eq 'Premiumv2_LRS'} 
```

---

The response will be similar to the form below, where X is the zone to use for deploying in your chosen region. X could be either 1, 2, or 3.

Preserve the **Zones** value, it represents your availability zone and you'll need it in order to deploy a Premium SSD v2.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |Premiumv2_LRS         |eastus         | X       |         |         |         |

> [!NOTE]
> If there was no response from the command, then the selected VM size is not supported with Premium SSD v2 in the selected region.

Now that you know the region and zone to deploy to, follow the deployment steps in this article to either deploy a VM with a premium SSD v2 attached or attach a premium SSD v2 to an existing VM.

## Create a Premium SSD v2


# [Azure CLI](#tab/azure-cli)

You must create a VM using a VM size that support Premium Storage, to attach a Premium SSD v2 disk.


```azurecli-interactive
diskName="yourDiskName"
resourceGroupName="yourResourceGroupName"
region="yourRegionName"
vmName="yourVMName"
vmImage="Win2016Datacenter"
adminPassword="yourAdminPassword"
adminUserName="yourAdminUserName"
vmSize="Standard_D4s_v3"
zone="yourZoneNumber"
logicalSectorSize=4096

az disk create -n $diskName -g $resourceGroupName \
--size-gb 100 \
--disk-iops-read-write 5000 \
--disk-mbps-read-write 150 \
--location $region \
--zone $zone \
--sku PremiumV2_LRS \
--logical-sector-size $logicalSectorSize

az vm create -n $vmName -g $resourceGroupName \
--image $vmImage \
--zone $zone \
--authentication-type password --admin-password $adminPassword --admin-username $adminUserName \
--size $vmSize \
--location $region \
--attach-data-disks $diskName
```

# [PowerShell](#tab/azure-powershell)

You must create a VM using a VM size that support Premium Storage, to attach a Premium SSD v2 disk.

```powershell
# Create a VM using a VM size that supports Premium Storage
$resourceGroupName = "PremiumV2Testing"
$vmName = "myVmWithPV2D2"
$region = "swedencentral"
$vmImage = "Win2016Datacenter"
$vmSize = "Standard_D4s_v3"
$zone = "1"
$vmAdminUser = "cptadmin"
$vmAdminPassword = ConvertTo-SecureString "" -AsPlainText -Force

$credential = New-Object System.Management.Automation.PSCredential ($vmAdminUser, $vmAdminPassword);

New-AzVm `
    -ResourceGroupName $resourceGroupName `
    -Name $vmName `
    -Location $region `
    -Zone $zone `
    -Image $vmImage `
    -Size $vmSize `
    -Credential $credential

# Create a Premium SSD v2 disk
$diskName = "myPremiumv2Disk2"
$diskSizeInGiB = 100
$diskIOPS = 5000
$diskThroughputInMBPS = 150
$logicalSectorSize=4096
$lun = 1

$diskconfig = New-AzDiskConfig `
-Location $region `
-Zone $zone `
-DiskSizeGB $diskSizeInGiB `
-DiskIOPSReadWrite $diskIOPS `
-DiskMBpsReadWrite $diskThroughputInMBPS `
-AccountType PremiumV2_LRS `
-LogicalSectorSize $logicalSectorSize `
-CreateOption Empty

New-AzDisk `
-ResourceGroupName $resourceGroupName `
-DiskName $diskName `
-Disk $diskconfig

# Attach the disk to the VM
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $resourceGroupName
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