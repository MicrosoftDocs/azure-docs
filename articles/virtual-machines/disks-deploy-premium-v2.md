---
title: Deploy a Premium SSD v2 managed disk
description: Learn how to deploy a Premium SSD v2.
author: roygara
ms.author: rogarana
ms.date: 10/12/2022
ms.topic: how-to
ms.service: storage
ms.subservice: disks
ms.custom: references_regions, ignite-2022
---

# Deploy a Premium SSD v2

Azure Premium SSD v2 is designed for IO-intense enterprise workloads that require sub-millisecond disk latencies and high IOPS and throughput at a low cost. Premium SSD v2 is suited for a broad range of workloads such as SQL server, Oracle, MariaDB, SAP, Cassandra, Mongo DB, big data/analytics, gaming, on virtual machines or stateful containers. For conceptual information on Premium SSD v2, see [Premium SSD v2](disks-types.md#premium-ssd-v2).

## Limitations

[!INCLUDE [disks-prem-v2-limitations](../../includes/disks-prem-v2-limitations.md)]

### Regional availability

[!INCLUDE [disks-premv2-regions](../../includes/disks-premv2-regions.md)]

## Prerequisites

- [Sign up](https://aka.ms/PremiumSSDv2AccessRequest) for access to Premium SSD v2.
- Install either the latest [Azure CLI](/cli/azure/install-azure-cli) or the latest [Azure PowerShell module](/powershell/azure/install-az-ps). 

## Determine region availability programmatically

To use a Premium SSD v2, you need to determine the regions and zones where it's supported. Not every region and zones support Premium SSD v2. To determine regions, and zones support premium SSD v2, replace `yourSubscriptionId` then run the following command:

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

# [Azure portal](#tab/portal)

To programmatically determine the regions and zones you can deploy to, use either the Azure CLI or Azure PowerShell Module.

---

Now that you know the region and zone to deploy to, follow the deployment steps in this article to create a Premium SSD v2 disk and attach it to a VM.

## Use a Premium SSD v2

# [Azure CLI](#tab/azure-cli)

Create a Premium SSD v2 disk in an availability zone. Then create a VM in the same region and availability zone that supports Premium Storage and attach the disk to it. Replace the values of all the variables with your own, then run the following script:

```azurecli-interactive
## Initialize variables
diskName="yourDiskName"
resourceGroupName="yourResourceGroupName"
region="yourRegionName"
zone="yourZoneNumber"
logicalSectorSize=4096
vmName="yourVMName"
vmImage="Win2016Datacenter"
adminPassword="yourAdminPassword"
adminUserName="yourAdminUserName"
vmSize="Standard_D4s_v3"

## Create a Premium SSD v2 disk
az disk create -n $diskName -g $resourceGroupName \
--size-gb 100 \
--disk-iops-read-write 5000 \
--disk-mbps-read-write 150 \
--location $region \
--zone $zone \
--sku PremiumV2_LRS \
--logical-sector-size $logicalSectorSize

## Create the VM
az vm create -n $vmName -g $resourceGroupName \
--image $vmImage \
--zone $zone \
--authentication-type password --admin-password $adminPassword --admin-username $adminUserName \
--size $vmSize \
--location $region \
--attach-data-disks $diskName
```

# [PowerShell](#tab/azure-powershell)

Create a Premium SSD v2 disk in an availability zone. Then create a VM in the same region and availability zone that supports Premium Storage and attach the disk to it. Replace the values of all the variables with your own, then run the following script:

```powershell
# Initialize variables
$resourceGroupName = "yourResourceGroupName"
$region = "useast"
$zone = "yourZoneNumber"
$diskName = "yourDiskName"
$diskSizeInGiB = 100
$diskIOPS = 5000
$diskThroughputInMBPS = 150
$logicalSectorSize=4096
$lun = 1
$vmName = "yourVMName"
$vmImage = "Win2016Datacenter"
$vmSize = "Standard_D4s_v3"
$vmAdminUser = "yourAdminUserName"
$vmAdminPassword = ConvertTo-SecureString "yourAdminUserPassword" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($vmAdminUser, $vmAdminPassword);

# Create a Premium SSD v2
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

# Create the VM
New-AzVm `
    -ResourceGroupName $resourceGroupName `
    -Name $vmName `
    -Location $region `
    -Zone $zone `
    -Image $vmImage `
    -Size $vmSize `
    -Credential $credential

# Attach the disk to the VM
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $resourceGroupName
```

# [Azure portal](#tab/portal)

> [!IMPORTANT]
> Premium SSD v2 managed disks can only be deployed and managed in the Azure portal from the following link: [https://portal.azure.com/?feature.premiumv2=true#home](https://portal.azure.com/?feature.premiumv2=true#home).

1. Sign in to the Azure portal with the following link: [https://portal.azure.com/?feature.premiumv2=true#home](https://portal.azure.com/?feature.premiumv2=true#home).
1. Navigate to **Virtual machines** and follow the normal VM creation process.
1. On the **Basics** page, select a [supported region](#regional-availability) and set **Availability options** to **Availability zone**.
1. Select one of the zones.
1. Fill in the rest of the values on the page as you like.

    :::image type="content" source="media/disks-deploy-premium-v2/premv2-portal-deploy.png" alt-text="Screenshot of the basics page, region and availability options and zones highlighted." lightbox="media/disks-deploy-premium-v2/premv2-portal-deploy.png":::

1. Proceed to the **Disks** page.
1. Under **Data disks** select **Create and attach a new disk**.

    :::image type="content" source="media/disks-deploy-premium-v2/premv2-create-data-disk.png" alt-text="Screenshot highlighting create and attach a new disk on the disk page." lightbox="media/disks-deploy-premium-v2/premv2-create-data-disk.png":::

1. Select the **Disk SKU** and select **Premium SSD v2 (Preview)**.

    :::image type="content" source="media/disks-deploy-premium-v2/premv2-select.png" alt-text="Screenshot selecting Premium SSD v2 SKU." lightbox="media/disks-deploy-premium-v2/premv2-select.png":::

1. Proceed through the rest of the VM deployment, making any choices that you desire.

You've now deployed a VM with a premium SSD v2.

---

## Adjust disk performance

Unlike other managed disks, the performance of a Premium SSD v2 can be configured independently of its size. For conceptual information on this, see [Premium SSD v2 performance](disks-types.md#premium-ssd-v2-performance).

# [Azure CLI](#tab/azure-cli)

The following command changes the performance of your disk, update the values as you like, then run the command:

```azurecli
az disk update --subscription $subscription --resource-group $rgname --name $diskName --disk-iops-read-write=5000 --disk-mbps-read-write=200
```

# [PowerShell](#tab/azure-powershell)

The following command changes the performance of your disk, update the values as you like, then run the command:

```azurepowershell
$diskupdateconfig = New-AzDiskUpdateConfig -DiskMBpsReadWrite 2000
Update-AzDisk -ResourceGroupName $resourceGroup -DiskName $diskName -DiskUpdate $diskupdateconfig
```

# [Azure portal](#tab/portal)

Currently, adjusting disk performance is only supported with Azure CLI or the Azure PowerShell module.

---

## Next steps
