---
title: Configure Soft Delete 
description: Learn how to configure soft delete on your Elastic SAN volume groups. 
author: katherinelu
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 06/27/2025
ms.author: katherinelu
ms.custom: references_regions, devx-track-azurepowershell, devx-track-azurecli
---

# Soft delete for Elastic SAN (Public Preview) 

Elastic SAN soft delete protects your volumes and volume snapshots from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the recovery retention period, you can restore a soft-deleted resource to its state at the time it was deleted. After the retention period has expired, the resource is permanently deleted. 


## How deletions are handled when soft delete is enabled

Elastic SAN soft delete is enabled on a volume group level – allowing all volumes under that volume group to be soft deleted. Deleting a volume marks it as soft-deleted. No backup or clone is created as part of the deletion process. Once the configured retention period expires, the soft-deleted volume is permanently deleted.
If a volume has snapshots, the volume along with the associated snapshots will all be marked as soft-deleted. No additional copies or snapshots are created during this process.
Soft-deleted volumes are not visible through standard operations unless explicitly queried. For more information about managing and restoring soft-deleted Elastic SAN volumes, see Manage and restore soft-deleted Elastic SAN volumes.

## Enable Soft delete
You can enable or disable soft delete on your Elastic SAN at the Volume Group level at any time by using the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template. The retention period can be set from 1-7 days.

# [Portal](#tab/azure-portal)

Elastic SAN soft delete can be configured when you create a new or edit a Volume Group with the Azure portal. The setting to enable or disable soft delete is configured on the Basics setting tab under each Volume Group. 
To enable soft delete on an Elastic SAN Volume Group by using the Azure portal, follow these steps:

1. In the Azure portal, navigate to your Elastic SAN.
2. Select the target Volume Group.
3. Navigate to the Basics tab in the Volume Group settings.
4. Enable/Disable ‘Soft delete for volumes’.
5. Specify a retention period between 1 and 7 days.
6. Save your changes.


# [PowerShell](#tab/azure-powershell)

The following sample command creates an Elastic SAN volume group and enables soft delete in the Elastic SAN you created previously. 
> [!IMPORTANT]
> `-DeleteRetentionPolicyState` determines whether soft delete is enabled or not, you can set this to 'Enabled' or 'Disabled'. 


```azurepowershell
# Create the volume group with soft delete enabled & rentention period set to 7 days
New-AzElasticSanVolumeGroup -ResourceGroupName myresourcegroup -ElasticSanName myelasticsan -Name myvolumegroup -DeleteRetentionPolicyRetentionPeriodDay 7 -DeleteRetentionPolicyState Enabled
```

# [Azure CLI](#tab/azure-cli)

The following sample command creates an Elastic SAN volume group and enables soft delete in the Elastic SAN you created previously. 
> [!IMPORTANT]
> `--delete-retention-policy-state` determines whether soft delete is enabled or not, you can set this to 'Enabled' or 'Disabled'. 

```azurecli
# Create the volume group with soft delete enabled & retention period set to 7 days
elastic-san volume-group create -e san_name -n volume_group_name -g rg_name --encryption EncryptionAtRestWithPlatformKey --protocol-type Iscsi --network-acls '{virtual-network-rules:[{id:{subnet_id},action:Allow}]}' --delete-retention-policy-state Enabled --delete-retention-period-days 7
```



## View Soft Deleted Resources 

You can use the Azure portal to view your soft deleted volumes and their status. When volumes are soft-deleted, they are invisible in the Azure portal by default. To view soft-deleted volumes, navigate to the Overview page for volumes and toggle the Show Deleted Volumes setting. Soft-deleted volumes are displayed with a status of Deleted along with the remaining retention days. 

Next, you can select the deleted volume from the list of volumes to display its properties. Under the volume details, you can see that the volume’s status is set to Deleted. The portal also displays the number of days until the volume is permanently deleted.

## Restore Resources

You can restore any soft deleted volume (along with any associated snapshots) at anytime within the set retention days. 

# [Portal](#tab/azure-portal)

To restore a soft-deleted volume in the Azure portal, first display the volume’s properties, then select the Undelete button on the edit tab. The following image shows the Undelete button on a soft-deleted volume.

# [PowerShell](#tab/azure-powershell)

The following sample command will restore a soft deleted Elastic SAN volume.

```azurepowershell
# Restore a deleted volume
$deletevolume = Get-AzElasticSanVolume -ResourceGroupName myresourcegroup -ElasticSanName myelasticsan -VolumeGroupName myvolumegroup -AccessSoftDeletedResource true
Restore-AzElasticSanVolume -ResourceGroupName myresourcegroup -ElasticSanName myelasticsan -VolumeGroupName myvolumegroup -VolumeName $deletevolume[0].Name
```

# [Azure CLI](#tab/azure-cli)

The following sample command will restore a soft deleted Elastic SAN volume.

```azurecli
# Restore a deleted volume
elastic-san volume restore -g rg_name -e san_name -v volume_group_name -n deleted_volume_name
```

---
