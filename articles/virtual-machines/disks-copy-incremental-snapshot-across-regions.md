---
title: Copy a snapshot to a new region
description: Learn how to copy an incremental snapshot of a managed disk to a different region.
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 04/10/2023
ms.author: rogarana
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Copy an incremental snapshot to a new region

There are two options for copying an incremental snapshot across regions. The first option, a managed process (recommended), that will perform the copy for you. This process is handled by Azure and removes the maintenance overhead of managing the copy process by staging a storage account in the target region. Azure ensures that only changes since the last snapshot in the target region are copied to the target region to reduce the data footprint, reducing the recovery point objective. You can check the process of a copy so you know when a target snapshot is ready to restore disks. For this managed process, you're only billed for the bandwidth cost of the data transfer across the region, and the read transactions on the source snapshot. Don't delete your source snapshot while the target snapshot is being copied.

The second option is a [manual copy](#manual-copy), where you get the changes between two incremental snapshots, down to the block level, and manually copy it from one region to another. Most users should use the managed process but, if you're interested in improving the copy speed, the second option allows you to use your compute resources to make the copy faster.

This article covers copying an incremental snapshot from one region to another. See [Create an incremental snapshot for managed disks](disks-incremental-snapshots.md) for conceptual details on incremental snapshots.

:::image type="content" source="media/disks-incremental-snapshots/cross-region-snapshot.png" alt-text="Diagram of Azure orchestrated cross-region copy of incremental snapshots via the clone option." lightbox="media/disks-incremental-snapshots/cross-region-snapshot.png":::

## Restrictions

- You can copy 100 incremental snapshots in parallel at the same time per subscription per region.
- If you use the REST API, you must use version 2020-12-01 or newer of the Azure Compute REST API.
- You can only copy one incremental snapshot of a particular disk at a time.
- Snapshots must be copied in the order they were created.

## Managed copy

# [Azure CLI](#tab/azure-cli)

You can use the Azure CLI to copy an incremental snapshot. You need the latest version of the Azure CLI. See the following articles to learn how to either [install](/cli/azure/install-azure-cli) or [update](/cli/azure/update-azure-cli) the Azure CLI.

The following script copies an incremental snapshot from one region to another:

```azurecli
subscriptionId=<yourSubscriptionID>
resourceGroupName=<yourResourceGroupName>
targetSnapshotName=<name>
sourceSnapshotResourceId=<sourceSnapshotResourceId>
targetRegion=<validRegion>

sourceSnapshotId=$(az snapshot show -n $sourceSnapshotName -g $resourceGroupName --query [id] -o tsv)

az snapshot create -g $resourceGroupName -n $targetSnapshotName -l $targetRegion --source $sourceSnapshotId --incremental --copy-start
```

### Check copy status

You can check the status of an individual snapshot by checking the `CompletionPercent` property. Replace `$sourceSnapshotName` with the name of your snapshot then run the following command. The value of the property must be 100 before you can use the snapshot for restoring disk or generate a SAS URI for downloading the underlying data.

```azurecli
az snapshot show -n $sourceSnapshotName -g $resourceGroupName --query [completionPercent] -o tsv
```

# [Azure PowerShell](#tab/azure-powershell)

You can use the Azure PowerShell module to copy an incremental snapshot. You'll need the latest version of the Azure PowerShell module. The following command will either install it or update your existing installation to latest:

```PowerShell
Install-Module -Name Az -AllowClobber -Scope CurrentUser
```

Once that is installed, sign in to your PowerShell session with `Connect-AzAccount`.

The following script will copy an incremental snapshot from one region to another.

```azurepowershell
$subscriptionId="yourSubscriptionIdHere"
$resourceGroupName="yourResourceGroupNameHere"
$sourceSnapshotName="yourSourceSnapshotNameHere"
$targetSnapshotName="yourTargetSnapshotNameHere"
$targetRegion="desiredRegion"

Set-AzContext -Subscription $subscriptionId

$sourceSnapshot=Get-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $sourceSnapshotName

$snapshotconfig = New-AzSnapshotConfig -Location $targetRegion -CreateOption CopyStart -Incremental -SourceResourceId $sourceSnapshot.Id

New-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $targetSnapshotName -Snapshot $snapshotconfig
```

### Check copy status

You can check the `CompletionPercent` property of an individual snapshot to get its status. Replace `yourResourceGroupNameHere` and `yourSnapshotName` then run the script. The value of the property must be 100 before you can use the snapshot for restoring disk or generate a SAS URI for downloading the underlying data.

```azurepowershell
$resourceGroupName = "yourResourceGroupNameHere"
$snapshotName = "yourSnapshotName"

$targetSnapshot=Get-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName

$targetSnapshot.CompletionPercent
```


# [Portal](#tab/azure-portal)

You can also copy an incremental snapshot across regions in the Azure portal. However, you must use this specific link to access the portal, for now: https://aka.ms/incrementalsnapshot 

1. Sign in to the [Azure portal](https://aka.ms/incrementalsnapshot) and navigate to the incremental snapshot you'd like to migrate.
1. Select **Copy snapshot**.

    :::image type="content" source="media/disks-incremental-snapshots/disks-copy-snapshot.png" alt-text="Screenshot of snapshot overview, copy snapshot highlighted." lightbox="media/disks-incremental-snapshots/disks-copy-snapshot.png":::

1. For **Snapshot type** under **Instance details** select **Incremental**.
1. Change the **Region** to the region you'd like to copy the snapshot to.

    :::image type="content" source="media/disks-incremental-snapshots/disks-copy-snapshot-region-select.png" alt-text="Screenshot of copy snapshot experience, new region selected, incremental selected." lightbox="media/disks-incremental-snapshots/disks-copy-snapshot-region-select.png":::

1. Select **Review + Create** and then **Create**.

# [Resource Manager Template](#tab/azure-resource-manager)

You can also use Azure Resource Manager templates to copy an incremental snapshot. You must use version **2020-12-01** or newer of the Azure Compute REST API. The following snippet is an example of how to copy an incremental snapshot across regions with Resource Manager templates:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "defaultValue": "isnapshot1",
            "type": "String"
        },
        "sourceSnapshotResourceId": {
            "defaultValue": "<your_incremental_snapshot_resource_ID>",
            "type": "String"
        },
        "skuName": {
            "defaultValue": "Standard_LRS",
            "type": "String"
        },
        "targetRegion": {
            "defaultValue": "desired_region",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Compute/snapshots",
            "sku": {
                "name": "[parameters('skuName')]",
                "tier": "Standard"
            },
            "name": "[parameters('name')]",
            "apiVersion": "2020-12-01",
            "location": "[parameters('targetRegion')]",
            "scale": null,
            "properties": {
                "creationData": {
                    "createOption": "CopyStart",
                    "sourceResourceId": "[parameters('sourceSnapshotResourceId')]"
                },
                "incremental": true
            },
            "dependsOn": []
        }
    ]
}

```
---

## Manual copy

Incremental snapshots offer a differential capability. They enable you to get the changes between two incremental snapshots of the same managed disk, down to the block level. You can use this to reduce your data footprint when copying snapshots across regions.  For example, you can download the first incremental snapshot as a base blob in another region. For the subsequent incremental snapshots, you can copy only the changes since the last snapshot to the base blob. After copying the changes, you can take snapshots on the base blob that represent your point in time backup of the disk in another region. You can restore your disk either from the base blob or from a snapshot on the base blob in another region.

:::image type="content" source="media/disks-copy-incremental-snapshot-across-regions/incremental-snapshot-diagram.png" alt-text="Diagram depicting incremental snapshots copied across regions. Snapshots make various API calls until eventually forming page blobs per each snapshot.":::

## Next steps

If you'd like to see sample code demonstrating the differential capability of incremental snapshots, using .NET, see [Copy Azure Managed Disks backups to another region with differential capability of incremental snapshots](https://github.com/Azure-Samples/managed-disks-dotnet-backup-with-incremental-snapshots).

If you have additional questions on snapshots, see the [snapshots](faq-for-disks.yml#snapshots) section of the FAQ.