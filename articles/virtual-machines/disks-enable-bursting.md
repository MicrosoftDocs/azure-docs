---
title: Enable on-demand disk bursting
description: Enable on-demand disk bursting on your managed disk.
author: roygara
ms.author: rogarana
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: azure-disk-storage
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Enable on-demand bursting

Premium solid-state drives (SSD) have two available bursting models; credit-based bursting and on-demand bursting. This article covers how to switch to on-demand bursting. Disks that use the on-demand model can burst beyond their original provisioned targets. On-demand bursting occurs as often as needed by the workload, up to the maximum burst target. On-demand bursting incurs additional charges.

For details on disk bursting, see [Managed disk bursting](disk-bursting.md). 

For the max burst targets on each supported disk, see [Scalability and performance targets for VM disks](disks-scalability-targets.md#premium-ssd-managed-disks-per-disk-limits).

> [!IMPORTANT]
> You don't need to follow the steps in this article to use credit-based bursting. By default, credit-based bursting is enabled on all eligible disks.

Before you enable on-demand bursting, understand the following:

[!INCLUDE [managed-disk-bursting-regions-limitations](../../includes/managed-disk-bursting-regions-limitations.md)]

### Regional availability

[!INCLUDE [managed-disk-bursting-availability](../../includes/managed-disk-bursting-availability.md)]

## Get started

On-demand bursting can be enabled with either the Azure portal, the Azure PowerShell module, the Azure CLI, or Azure Resource Manager templates. The following examples cover how to create a new disk with on-demand bursting enabled and enabling on-demand bursting on existing disks.

# [Portal](#tab/azure-portal)

A managed disk must be larger than 512 GiB to enable on-demand bursting.

To enable on-demand bursting for an existing disk:

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your disk.
1. Select **Configuration** and select **Enable on-demand bursting**.
1. Select **Save**.

# [PowerShell](#tab/azure-powershell)

On-demand bursting cmdlets are available in version 5.5.0 and newer of the Az module. Alternatively, you may use the [Azure Cloud Shell](https://shell.azure.com/).
### Create an empty data disk with on-demand bursting

A managed disk must be larger than 512 GiB to enable on-demand bursting. Replace the `<myResourceGroupDisk>` and `<myDataDisk>` parameters then run the following script to create a premium SSD with on-demand bursting:

```azurepowershell
Set-AzContext -SubscriptionName <yourSubscriptionName>

$diskConfig = New-AzDiskConfig -Location 'WestCentralUS' -CreateOption Empty -DiskSizeGB 1024 -SkuName Premium_LRS -BurstingEnabled $true

$dataDisk = New-AzDisk -ResourceGroupName <myResourceGroupDisk> -DiskName <myDataDisk> -Disk $diskConfig
```

### Enable on-demand bursting on an existing disk

A managed disk must be larger than 512 GiB to enable on-demand bursting. Replace the `<myResourceGroupDisk>`, `<myDataDisk>` parameters and run this command to enable on-demand bursting on an existing disk:

```azurepowershell
New-AzDiskUpdateConfig -BurstingEnabled $true | Update-AzDisk -ResourceGroupName <myResourceGroupDisk> -DiskName <myDataDisk> //Set the flag to $false to disable on-demand bursting
```

# [Azure CLI](#tab/azure-cli)

On-demand bursting cmdlets are available in version 2.19.0 and newer of the [Azure CLI module](/cli/azure/install-azure-cli). Alternatively, you may use the [Azure Cloud Shell](https://shell.azure.com/).

### Create and attach a on-demand bursting data disk

A managed disk must be larger than 512 GiB to enable on-demand bursting. Replace the `<yourDiskName>`, `<yourResourceGroup>`, and `<yourVMName>` parameters, then run the following commands to create a premium SSD with on-demand bursting:

```azurecli
az disk create -g <yourResourceGroup> -n <yourDiskName> --size-gb 1024 --sku Premium_LRS -l westcentralus --enable-bursting true

az vm disk attach --vm-name <yourVMName> --name <yourDiskName> --resource-group <yourResourceGroup>
```

### Enable on-demand bursting on an existing disk - CLI

A managed disk must be larger than 512 GiB to enable on-demand bursting. Replace the `<myResourceGroupDisk>` and `<yourDiskName>` parameters and run this command to enable on-demand bursting on an existing disk:

```azurecli
az disk update --name <yourDiskName> --resource-group <yourResourceGroup> --enable-bursting true //Set the flag to false to disable on-demand bursting
```

# [Azure Resource Manager](#tab/azure-resource-manager)

With the `2020-09-30` disk API, you can enable on-demand bursting on newly-created or existing premium SSDs larger than 512 GiB. The `2020-09-30` API introduced a new property, `burstingEnabled`. By default, this property is set to false. The following sample template creates a 1TiB premium SSD in West Central US, with disk bursting enabled:

```
{
  "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "diskSkuName": {
        "type": "string",
        "defaultValue": "Premium_LRS" //Supported on premium SSDs only
},
    "dataDiskSizeInGb": {
      "type": "string",
      "defaultValue": "1024" //Supported on disk size > 512 GiB
},
    "location": {
      "type": "string",
      "defaultValue": "westcentralus" //Preview regions: West Central US
},
"diskApiVersion": {
      "type": "string",
      "defaultValue": "2020-09-30" //Preview supported version: 2020-09-30 or above
    }
  },
  "resources": [
    {
      "apiVersion": "[parameters('diskApiVersion')]",
      "type": "Microsoft.Compute/disks",
      "name": "[parameters('diskName')]",
      "location": "[parameters(location)]",
      "properties": {
        "creationData": {
          "createOption": "Empty"
        },
        "diskSizeGB": "[parameters('dataDiskSizeInGb')]",
        "burstingEnabled": "true" //Feature flag to enable disk bursting on disks > 512 GiB
      },
      "sku": {
        "name": "[parameters('diskSkuName')]"
      }
    ]
}
```
---
 
## Next steps

To learn how to gain insight into your bursting resources, see [Disk bursting metrics](disks-metrics.md).
