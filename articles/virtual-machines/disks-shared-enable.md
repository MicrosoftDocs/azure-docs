---
title: Enable shared disks for Azure managed disks
description: Configure an Azure managed disk with shared disks so that you can share it across multiple VMs
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 04/11/2023
ms.author: rogarana
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Enable shared disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article covers how to enable the shared disks feature for Azure managed disks. Azure shared disks is a new feature for Azure managed disks that enables you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure. 

If you are looking for conceptual information on managed disks that have shared disks enabled, see [Azure shared disks](disks-shared.md).

## Prerequisites

The scripts and commands in this article require either:

- Version 6.0.0 or newer of the Azure PowerShell module.

Or
- The latest version of the Azure CLI.

## Limitations

[!INCLUDE [virtual-machines-disks-shared-limitations](../../includes/virtual-machines-disks-shared-limitations.md)]

## Supported operating systems

Shared disks support several operating systems. See the [Windows](./disks-shared.md#windows) and [Linux](./disks-shared.md#linux) sections of the conceptual article for the supported operating systems.

## Disk sizes

[!INCLUDE [virtual-machines-disks-shared-sizes](../../includes/virtual-machines-disks-shared-sizes.md)]

## Deploy shared disks

### Deploy a premium SSD as a shared disk

To deploy a managed disk with the shared disk feature enabled, use the new property `maxShares` and define a value greater than 1. This makes the disk shareable across multiple VMs.

> [!IMPORTANT]
> Host caching isn't supported for shared disks.
> 
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal. 
1. Search for and Select **Disks**.
1. Select **+ Create** to create a new managed disk.
1. Fill in the details and select an appropriate region, then select **Change size**.

    :::image type="content" source="media/disks-shared-enable/create-shared-disk-basics-pane.png" alt-text="Screenshot of the create a managed disk pane, change size highlighted.." lightbox="media/disks-shared-enable/create-shared-disk-basics-pane.png":::

1. Select the premium SSD size and SKU that you want and select **OK**.

    :::image type="content" source="media/disks-shared-enable/select-premium-shared-disk.png" alt-text="Screenshot of the disk SKU, premium LRS and ZRS SSD SKUs highlighted." lightbox="media/disks-shared-enable/select-premium-shared-disk.png":::

1. Proceed through the deployment until you get to the **Advanced** pane.
1. Select **Yes** for **Enable shared disk** and select the amount of **Max shares** you want.

    :::image type="content" source="media/disks-shared-enable/enable-premium-shared-disk.png" alt-text="Screenshot of the Advanced pane, Enable shared disk highlighted and set to yes." lightbox="media/disks-shared-enable/enable-premium-shared-disk.png":::

1. Select **Review + Create**.


# [Azure CLI](#tab/azure-cli)

```azurecli
az disk create -g myResourceGroup -n mySharedDisk --size-gb 1024 -l westcentralus --sku Premium_LRS --max-shares 2
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$dataDiskConfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType Premium_LRS -CreateOption Empty -MaxSharesCount 2

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $dataDiskConfig
```

# [Resource Manager Template](#tab/azure-resource-manager)

Before using the following template, replace `[parameters('dataDiskName')]`, `[resourceGroup().location]`, `[parameters('dataDiskSizeGB')]`, and `[parameters('maxShares')]` with your own values.

[Premium SSD shared disk template](https://aka.ms/SharedPremiumDiskARMtemplate)

---

### Deploy a standard SSD as a shared disk

To deploy a managed disk with the shared disk feature enabled, use the new property `maxShares` and define a value greater than 1. This makes the disk shareable across multiple VMs.

> [!IMPORTANT]
> Host caching isn't supported for shared disks.
> 
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal. 
1. Search for and Select **Disks**.
1. Select **+ Create** to create a new managed disk.
1. Fill in the details and select an appropriate region, then select **Change size**.

    :::image type="content" source="media/disks-shared-enable/create-shared-disk-basics-pane.png" alt-text="Screenshot of the create a managed disk pane, change size highlighted.." lightbox="media/disks-shared-enable/create-shared-disk-basics-pane.png":::

1. Select the standard SSD size and SKU that you want and select **OK**.

    :::image type="content" source="media/disks-shared-enable/select-standard-ssd-shared-disk.png" alt-text="Screenshot of the disk SKU, standard SSD LRS and ZRS SKUs highlighted." lightbox="media/disks-shared-enable/select-premium-shared-disk.png":::

1. Proceed through the deployment until you get to the **Advanced** pane.
1. Select **Yes** for **Enable shared disk** and select the amount of **Max shares** you want.

    :::image type="content" source="media/disks-shared-enable/enable-premium-shared-disk.png" alt-text="Screenshot of the Advanced pane, Enable shared disk highlighted and set to yes." lightbox="media/disks-shared-enable/enable-premium-shared-disk.png":::

1. Select **Review + Create**.

# [Azure CLI](#tab/azure-cli)

```azurecli
az disk create -g myResourceGroup -n mySharedDisk --size-gb 1024 -l westcentralus --sku StandardSSD_LRS --max-shares 2
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$dataDiskConfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType StandardSSD_LRS -CreateOption Empty -MaxSharesCount 2

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $dataDiskConfig
```

# [Resource Manager Template](#tab/azure-resource-manager)

Replace the values in this Azure Resource Manager template with your own, before using it:

```rest
{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "dataDiskName": {
      "type": "string",
      "defaultValue": "mySharedDisk"
    },
    "dataDiskSizeGB": {
      "type": "int",
      "defaultValue": 1024
    },
    "maxShares": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/disks",
      "name": "[parameters('dataDiskName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-07-01",
      "sku": {
        "name": "StandardSSD_LRS"
      },
      "properties": {
        "creationData": {
          "createOption": "Empty"
        },
        "diskSizeGB": "[parameters('dataDiskSizeGB')]",
        "maxShares": "[parameters('maxShares')]"
      }
    }
  ] 
}
```

---

### Deploy an ultra disk as a shared disk

To deploy a managed disk with the shared disk feature enabled, change the `maxShares` parameter to a value greater than 1. This makes the disk shareable across multiple VMs.

> [!IMPORTANT]
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal. 
1. Search for and Select **Disks**.
1. Select **+ Create** to create a new managed disk.
1. Fill in the details, then select **Change size**.
1. Select ultra disk for the **Disk SKU**.

    :::image type="content" source="media/disks-shared-enable/select-ultra-shared-disk.png" alt-text="Screenshot of the disk SKU, ultra disk highlighted.." lightbox="media/disks-shared-enable/select-ultra-shared-disk.png":::

1. Select the disk size that you want and select **OK**.
1. Proceed through the deployment until you get to the **Advanced** pane.
1. Select **Yes** for **Enable shared disk** and select the amount of **Max shares** you want.
1. Select **Review + Create**.

    :::image type="content" source="media/disks-shared-enable/enable-ultra-shared-disk.png" alt-text="Screenshot of the Advanced pane, Enable shared disk highlighted." lightbox="media/disks-shared-enable/enable-ultra-shared-disk.png":::

# [Azure CLI](#tab/azure-cli)

##### Regional disk example

```azurecli
#Creating an Ultra shared Disk 
az disk create -g rg1 -n clidisk --size-gb 1024 -l westus --sku UltraSSD_LRS --max-shares 5 --disk-iops-read-write 2000 --disk-mbps-read-write 200 --disk-iops-read-only 100 --disk-mbps-read-only 1

#Updating an Ultra shared Disk 
az disk update -g rg1 -n clidisk --disk-iops-read-write 3000 --disk-mbps-read-write 300 --set diskIopsReadOnly=100 --set diskMbpsReadOnly=1

#Show shared disk properties:
az disk show -g rg1 -n clidisk
```

##### Zonal disk example

This example is almost the same as the previous, except it creates a disk in availability zone 1.

```azurecli
#Creating an Ultra shared Disk 
az disk create -g rg1 -n clidisk --size-gb 1024 -l westus --sku UltraSSD_LRS --max-shares 5 --disk-iops-read-write 2000 --disk-mbps-read-write 200 --disk-iops-read-only 100 --disk-mbps-read-only 1 --zone 1

#Updating an Ultra shared Disk 
az disk update -g rg1 -n clidisk --disk-iops-read-write 3000 --disk-mbps-read-write 300 --set diskIopsReadOnly=100 --set diskMbpsReadOnly=1

#Show shared disk properties:
az disk show -g rg1 -n clidisk
```

# [PowerShell](#tab/azure-powershell)

##### Regional disk example

```azurepowershell-interactive
$datadiskconfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType UltraSSD_LRS -CreateOption Empty -DiskIOPSReadWrite 2000 -DiskMBpsReadWrite 200 -DiskIOPSReadOnly 100 -DiskMBpsReadOnly 1 -MaxSharesCount 5

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $datadiskconfig
```

##### Zonal disk example

This example is almost the same as the previous, except it creates a disk in availability zone 1.

```azurepowershell-interactive
$datadiskconfig = New-AzDiskConfig -Location 'WestCentralUS' -DiskSizeGB 1024 -AccountType UltraSSD_LRS -CreateOption Empty -DiskIOPSReadWrite 2000 -DiskMBpsReadWrite 200 -DiskIOPSReadOnly 100 -DiskMBpsReadOnly 1 -MaxSharesCount 5 -Zone 1

New-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $datadiskconfig
```

# [Resource Manager Template](#tab/azure-resource-manager)

##### Regional disk example

Before using the following template, replace `[parameters('dataDiskName')]`, `[resourceGroup().location]`, `[parameters('dataDiskSizeGB')]`, `[parameters('maxShares')]`, `[parameters('diskIOPSReadWrite')]`, `[parameters('diskMBpsReadWrite')]`, `[parameters('diskIOPSReadOnly')]`, and `[parameters('diskMBpsReadOnly')]` with your own values.

[Regional shared ultra disks template](https://aka.ms/SharedUltraDiskARMtemplateRegional)

##### Zonal disk example

Before using the following template, replace `[parameters('dataDiskName')]`, `[resourceGroup().location]`, `[parameters('dataDiskSizeGB')]`, `[parameters('maxShares')]`, `[parameters('diskIOPSReadWrite')]`, `[parameters('diskMBpsReadWrite')]`, `[parameters('diskIOPSReadOnly')]`, and `[parameters('diskMBpsReadOnly')]` with your own values.

[Zonal shared ultra disks template](https://aka.ms/SharedUltraDiskARMtemplateZonal)

---

## Share an existing disk

To share an existing disk, or update how many VMs it can mount to, set the `maxShares` parameter with either the Azure PowerShell module or Azure CLI. You can also set `maxShares` to 1, if you want to disable sharing.

> [!IMPORTANT]
> Host caching isn't supported for shared disks.
> 
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.
> Before detaching a disk, record the LUN ID for when you re-attach it.

### PowerShell

```azurepowershell
$datadiskconfig = Get-AzDisk -DiskName "mySharedDisk"
$datadiskconfig.maxShares = 3

Update-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'mySharedDisk' -Disk $datadiskconfig
```

### CLI

```azurecli
#Modifying a disk to enable or modify sharing configuration

az disk update --name mySharedDisk --max-shares 5 --resource-group myResourceGroup
```

## Using Azure shared disks with your VMs

Once you've deployed a shared disk with `maxShares>1`, you can mount the disk to one or more of your VMs.

> [!NOTE]
> Host caching isn't supported for shared disks.
> 
> If you are deploying an ultra disk, make sure it matches the necessary requirements. See [Using Azure ultra disks](disks-enable-ultra-ssd.md) for details.

```azurepowershell-interactive

$resourceGroup = "myResourceGroup"
$location = "WestCentralUS"

$vm = New-AzVm -ResourceGroupName $resourceGroup -Name "myVM" -Location $location -VirtualNetworkName "myVnet" -SubnetName "mySubnet" -SecurityGroupName "myNetworkSecurityGroup" -PublicIpAddressName "myPublicIpAddress"

$dataDisk = Get-AzDisk -ResourceGroupName $resourceGroup -DiskName "mySharedDisk"

$vm = Add-AzVMDataDisk -VM $vm -Name "mySharedDisk" -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0

update-AzVm -VM $vm -ResourceGroupName $resourceGroup
```

## Supported SCSI PR commands

Once you've mounted the shared disk to your VMs in your cluster, you can establish quorum and read/write to the disk using SCSI PR. The following PR commands are available when using Azure shared disks:

To interact with the disk, start with the persistent-reservation-action list:

```
PR_REGISTER_KEY 

PR_REGISTER_AND_IGNORE 

PR_GET_CONFIGURATION 

PR_RESERVE 

PR_PREEMPT_RESERVATION 

PR_CLEAR_RESERVATION 

PR_RELEASE_RESERVATION 
```

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or  PR_RELEASE_RESERVATION, provide one of the following persistent-reservation-type:

```
PR_NONE 

PR_WRITE_EXCLUSIVE 

PR_EXCLUSIVE_ACCESS 

PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY 

PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY 

PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS 

PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS 
```

You also need to provide a persistent-reservation-key when using PR_RESERVE, PR_REGISTER_AND_IGNORE, PR_REGISTER_KEY, PR_PREEMPT_RESERVATION, PR_CLEAR_RESERVATION, or PR_RELEASE-RESERVATION.


## Next steps

If you prefer to use Azure Resource Manager templates to deploy your disk, the following sample templates are available:
- [Premium SSD](https://aka.ms/SharedPremiumDiskARMtemplate)
- [Regional ultra disks](https://aka.ms/SharedUltraDiskARMtemplateRegional)
- [Zonal ultra disks](https://aka.ms/SharedUltraDiskARMtemplateZonal)

If you've additional questions, see the [shared disks](faq-for-disks.yml#azure-shared-disks) section of the FAQ.