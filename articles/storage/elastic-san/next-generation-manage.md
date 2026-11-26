---
title: Manage your Azure Elastic SAN Next Generation and its resources
description: Learn how to resize Azure Elastic SAN Next Generation, manage performance and autoscaling, expand volumes, and delete volumes, volume groups, or a SAN.
author: normesta
ms.service: azure-elastic-san
ms.topic: how-to
ms.date: 11/06/2026
ms.author: normesta
ms.custom: devx-track-azurecli, devx-track-azurepowershell
# Customer intent: "As a storage administrator, I want to manage capacity and performance and safely delete Elastic SAN Next Generation resources that I no longer need."
---

# Manage your Azure Elastic SAN Next Generation and its resources

This article explains how to change the capacity and performance of Azure Elastic SAN Next Generation, configure autoscaling, expand a volume, and delete resources that you no longer need. Use the Azure portal, Azure PowerShell, or Azure CLI.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An existing Elastic SAN Next Generation resource and permission to read, update, or delete the resources you intend to manage.
- Completed preview registration and compatible tools, as described in [Deploy Elastic SAN Next Generation](next-generation-create.md#prerequisites).
- For PowerShell, the preview-compatible `Az.ElasticSan` module. For Azure CLI, the latest compatible `elastic-san` extension. The SAN update commands must expose the total-capacity, IOPS, and throughput parameters shown in this article.
- A backup and an appropriate maintenance plan before reducing capacity, detaching a volume, or deleting resources.

Check the [Next Generation scale targets](next-generation-scale-targets.md) before choosing new values. Available limits depend on your region and subscription.

## Select the resources to manage

The examples use the same subscription, resource group, SAN, volume-group, and volume variables throughout the article. Replace the placeholders with your resource names. Read the existing configuration before running an update or delete command.

The following screenshots show an example 20-TiB SAN with 40,000 IOPS, 1,280 MB/s, and a 1-GiB General purpose Direct attach volume. These values aren't requirements for every deployment. Run only the procedures you need; the deletion sections aren't part of the resize procedure.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), open your Elastic SAN resource.
1. On **Overview**, confirm that **Elastic SAN Type** is **Elastic SAN Next Generation (Preview)**.
1. Verify the subscription and resource before proceeding. Use **SAN Management** to open **Volume groups** or **Volumes** when you need to manage a child resource.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount

$subscriptionId = "<subscription-id>"
$resourceGroupName = "<resource-group>"
$sanName = "<san-name>"
$volumeGroupName = "<volume-group-name>"
$volumeName = "<volume-name>"

Set-AzContext -Subscription $subscriptionId

Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName
```

Confirm that the returned resource is the intended Next Generation SAN. To inspect an existing group or volume:

```azurepowershell
Get-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $volumeGroupName

Get-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

The Azure CLI examples use Bash syntax.

```azurecli
az login

subscriptionId="<subscription-id>"
resourceGroupName="<resource-group>"
sanName="<san-name>"
volumeGroupName="<volume-group-name>"
volumeName="<volume-name>"

az elastic-san show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"
```

Confirm that the returned resource is the intended Next Generation SAN. To inspect an existing group or volume:

```azurecli
az elastic-san volume-group show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$volumeGroupName"

az elastic-san volume show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName"
```

---

## Resize your SAN and change its performance

SAN capacity is provisioned in 1-TiB increments. Each provisioned TiB includes a baseline of 2,000 IOPS and 64 MB/s. General purpose workloads can use the capacity-included baseline at no additional performance charge. You can provision additional IOPS and throughput independently of capacity.

When you increase capacity, provision enough IOPS and throughput to meet the baseline for the new size. For example, 21 TiB requires at least 42,000 IOPS and 1,344 MB/s. The following command examples increase a 20-TiB SAN to 21 TiB and set its performance to 50,000 IOPS and 1,600 MB/s.

Before updating the SAN:

- Ensure that the autoscale maximum is at least the new total capacity. Update the [autoscaling policy](#configure-autoscaling) first if necessary.
- Keep all requested values within the applicable scale targets.
- If Business critical groups reserve performance, ensure that total reserved IOPS and total reserved throughput each remain within 80% of the corresponding SAN-level provisioned value.
- Review the cost impact of the capacity and performance you choose.

# [Portal](#tab/azure-portal)

1. On your SAN, select **Settings** > **Configuration**.
1. Under **Size and performance**, enter the required **Size (TiB)**, **IOPS**, and **Bandwidth (MBps)**. To change performance without changing capacity, leave **Size (TiB)** unchanged.

    :::image type="content" source="media/next-generation-manage/san-configuration.png" alt-text="Screenshot of Configuration navigation and the Size, IOPS, and Bandwidth fields showing the existing example values." lightbox="media/next-generation-manage/san-configuration.png":::

1. Review the values, and select **Apply**. Wait for the update to complete.
1. Refresh **Configuration** and verify the resulting capacity and performance.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$newSizeTiB = 21
$newIops = 50000
$newMBps = 1600

Update-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName `
    -TotalSizeTiB $newSizeTiB -TotalIops $newIops -TotalMBps $newMBps

Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName
```

To update only performance, omit `-TotalSizeTiB`:

```azurepowershell
Update-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName `
    -TotalIops 55000 -TotalMBps 1800
```

# [Azure CLI](#tab/azure-cli)

```azurecli
newSizeTiB=21
newIops=50000
newMBps=1600

az elastic-san update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName" \
  --total-size-tib "$newSizeTiB" --total-iops "$newIops" --total-mbps "$newMBps"

az elastic-san show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"
```

To update only performance, omit `--total-size-tib`:

```azurecli
az elastic-san update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName" \
  --total-iops 55000 --total-mbps 1800
```

---

### Reduce SAN capacity

You can reduce SAN capacity when the new size satisfies the service limits and your existing resource commitments. This action doesn't reduce the provisioned sizes of individual volumes.

Before reducing capacity, ensure that:

- The combined provisioned size of your volumes fits within five times the proposed SAN capacity.
- The new SAN capacity can accommodate the current used capacity and the configured unused-capacity threshold. Compare these values in consistent units.
- The autoscale maximum is at least the new SAN capacity.
- SAN performance still meets the capacity-included baseline, and existing Business critical reservations fit within the SAN's performance budget.

Keep autoscaling enabled. Unlike the Classic procedure, you can't disable autoscaling on a Next Generation SAN. Capacity can increase again if later usage triggers the configured policy.

# [Portal](#tab/azure-portal)

1. Select **Settings** > **Configuration**.
1. Under **Size and performance**, enter the new **Size (TiB)**. Review the performance and autoscaling values against the constraints in the preceding list.
1. Select **Apply**, wait for completion, and verify the resulting configuration.

# [PowerShell](#tab/azure-powershell)

The following example reduces the SAN from 21 TiB to 20 TiB without changing its explicitly provisioned IOPS or throughput:

```azurepowershell
Update-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName `
    -TotalSizeTiB 20

Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName
```

# [Azure CLI](#tab/azure-cli)

The following example reduces the SAN from 21 TiB to 20 TiB without changing its explicitly provisioned IOPS or throughput:

```azurecli
az elastic-san update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName" \
  --total-size-tib 20

az elastic-san show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"
```

---

## Configure autoscaling

Next-generation SANs require autoscaling and you can't disable it. Autoscaling increases capacity; it doesn't automatically reduce capacity.

Configure these three settings:

| Setting | Purpose |
| --- | --- |
| Unused size | The unused-capacity threshold, in TiB, that triggers a capacity increase. |
| Increase capacity unit | The number of TiB to add when autoscaling is triggered. |
| Max scale up | The maximum total SAN capacity, in TiB, that the policy can provision. |

Choose a positive capacity increase and an appropriate threshold for your workload. The threshold must fit within the SAN's current unused capacity. The maximum must be at least the current SAN capacity and must not exceed the applicable regional limit. Plan sufficient headroom for the volume capacity you expect to use.

The following example uses a 1-TiB threshold, a 1-TiB increase, and a 100-TiB maximum. These values are example settings, not a statement of the regional maximum.

# [Portal](#tab/azure-portal)

1. Select **Settings** > **Configuration** and scroll to **Autoscaling**.
1. Review **Unused size**, **Increase capacity unit**, and **Max scale up**.

    :::image type="content" source="media/next-generation-manage/san-autoscale.png" alt-text="Screenshot of Autoscaling with Enable scaling up selected and example values of 1, 1, and 100." lightbox="media/next-generation-manage/san-autoscale.png":::

1. Change the values as needed and select **Apply**.
1. After the update completes, refresh the page and verify the policy.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$unusedSizeTiB = 1
$increaseCapacityUnitByTiB = 1
$capacityUnitScaleUpLimitTiB = 100

Update-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName `
    -AutoScalePolicyEnforcement Enabled `
    -UnusedSizeTiB $unusedSizeTiB `
    -IncreaseCapacityUnitByTiB $increaseCapacityUnitByTiB `
    -CapacityUnitScaleUpLimitTiB $capacityUnitScaleUpLimitTiB

Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
unusedSizeTiB=1
increaseCapacityUnitByTiB=1
capacityUnitScaleUpLimitTiB=100

az elastic-san update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName" \
  --auto-scale-policy-enforcement Enabled \
  --unused-size-tib "$unusedSizeTiB" \
  --increase-capacity-unit-by-tib "$increaseCapacityUnitByTiB" \
  --capacity-unit-scale-up-limit-tib "$capacityUnitScaleUpLimitTiB"

az elastic-san show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"
```

---

## Change Business critical performance reservations

Use the following PowerShell or Azure CLI examples to change reservations on an existing Business critical volume group. This change doesn't affect a group's QoS tier. Don't apply these examples to a General purpose group.

PowerShell and Azure CLI identify the Business critical tier as `PerformanceCritical`. Each group's reserved performance is available only to its own volumes. Across all Business critical groups, total reserved IOPS and total reserved throughput must each fit within 80% of the corresponding SAN-level provisioned value.

Before lowering SAN performance, lower group reservations first if necessary to maintain that constraint.

# [PowerShell](#tab/azure-powershell-reservations)

Replace the placeholder with an existing Business critical group. The example reserves 10,000 IOPS and 200 MB/s; account for the other groups' reservations before choosing these values.

```azurepowershell
$businessCriticalGroupName = "<business-critical-volume-group>"

Get-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $businessCriticalGroupName

Update-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $businessCriticalGroupName -ReservedIops 10000 -ReservedMBps 200

Get-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $businessCriticalGroupName
```

# [Azure CLI](#tab/azure-cli-reservations)

Replace the placeholder with an existing Business critical group. The example reserves 10,000 IOPS and 200 MB/s; account for the other groups' reservations before choosing these values.

```azurecli
businessCriticalGroupName="<business-critical-volume-group>"

az elastic-san volume-group show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$businessCriticalGroupName"

az elastic-san volume-group update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$businessCriticalGroupName" --reserved-iops 10000 --reserved-mbps 200

az elastic-san volume-group show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$businessCriticalGroupName"
```

---

## Logical sector size

Azure Elastic SAN Next Generation volumes support only a 512-byte logical sector size (512e). This matches Azure Elastic SAN (Classic). You can't create or convert an Elastic SAN Next Generation volume with a 4-KiB native (4Kn) logical sector size.

When you create an Elastic SAN Next Generation volume from an Azure managed disk snapshot, the source managed disk must have a 512e logical sector size. Managed disk snapshots inherit the logical sector size of the source disk. For more information about managed disk snapshot and sector sizes, see [Incremental snapshots of Premium SSD v2 and Ultra Disks](/azure/virtual-machines/disks-incremental-snapshots#incremental-snapshots-of-premium-ssd-v2-and-ultra-disks).

## Expand a volume

You can increase a volume's provisioned size in 1-GiB increments. You can't decrease its size.

Before expanding a volume, check both the applicable per-volume limit and the SAN-wide logical-capacity limits. After the change, the combined provisioned size of all volumes must not exceed the smaller of five times the SAN's provisioned capacity and the autoscale maximum. You don't necessarily need to increase SAN capacity for every volume expansion; increase it when required by these limits and your expected data usage.

> [!IMPORTANT]
> Live resizing isn't supported for Business critical volumes or General purpose volumes that use Direct attach. Before resizing these volumes, stop the workload, detach the volume from every VM that uses it, and wait for detachment to complete. After resizing, reattach it and complete any required guest operating system changes.

# [Portal](#tab/azure-portal)

1. On your SAN, select **SAN Management** > **Volumes**.
1. Select the volume name to open **Edit volume**.
1. Enter a larger **Size (GiB)**. Review the calculated maximum IOPS and bandwidth. The following example stages an increase from 1 GiB to 2 GiB.

    :::image type="content" source="media/next-generation-manage/volume-resize.png" alt-text="Screenshot of the Edit volume pane with a proposed size of 2 GiB and the Save and Cancel buttons." lightbox="media/next-generation-manage/volume-resize.png":::

1. Select **Save** and wait for the update to complete.
1. Refresh **Volumes** and verify the new size.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$newVolumeSizeGiB = 2

Update-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName `
    -SizeGiB $newVolumeSizeGiB

Get-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
newVolumeSizeGiB=2

az elastic-san volume update \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName" \
  --size-gib "$newVolumeSizeGiB"

az elastic-san volume show \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName"
```

---

Increasing the Azure resource size doesn't automatically extend a guest partition or file system. After reconnecting or reattaching, use the appropriate operating system procedure to rescan the disk and extend the existing partition or file system if required. Don't initialize or format an existing volume as part of expansion.

## Prepare to delete resources

> [!WARNING]
> Deletion can cause data loss and interrupt workloads. Back up any data you need, stop affected workloads, and verify the target resource and its dependencies before proceeding. Deleting a volume group or SAN also deletes its contained volumes. Run only the deletion procedure that matches your intended scope.

Disconnect or detach every affected volume before deleting it or its parent:

- **Direct attach:** Stop I/O and detach the volume from every VM that uses it. Wait for detachment to complete. Deletion is blocked while a VM still manages the volume; restarting or merely stopping the VM isn't a substitute for detaching it. Don't try to clear the service-managed ownership property manually.
- **iSCSI:** Stop applications and disconnect all client sessions. For the existing Windows and Linux disconnect procedures, see [Disconnect volumes from clients](elastic-san-delete.md#disconnect-volumes-from-clients). These iSCSI procedures aren't Direct Attach detach procedures.


The individual-volume delete example explicitly sets the force-delete and delete-snapshots options to false and doesn't request permanent purge. These options aren't a guarantee about snapshot retention when deleting a parent resource. If deletion is blocked, resolve the reported dependency or connection instead of adding force options.

## Delete a volume

# [Portal](#tab/azure-portal)

1. Select **SAN Management** > **Volumes**.
1. Select the checkbox for the intended volume, and select **Delete**.
1. In **Delete a volume**, verify the volume name and review the warning and acknowledgement.

    :::image type="content" source="media/next-generation-manage/volume-delete-confirmation.png" alt-text="Screenshot of the Delete a volume confirmation pane identifying volume-01 and showing Delete and Cancel." lightbox="media/next-generation-manage/volume-delete-confirmation.png":::

1. Only when the deletion prerequisites are satisfied, select the acknowledgement checkbox and then select **Delete**. Otherwise, select **Cancel**.
1. Wait for completion and refresh the volume list to confirm that the volume is no longer listed.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName -Name $volumeName `
    -ForceDelete "false" -DeleteSnapshot "false" -Confirm
```

After you confirm and wait for the operation to complete, check the parent group's volume list:

```azurepowershell
Get-AzElasticSanVolume -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -VolumeGroupName $volumeGroupName |
    Where-Object Name -eq $volumeName
```

The deleted volume shouldn't appear.

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume delete \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" --name "$volumeName" \
  --force-delete false --delete-snapshots false
```

After you confirm and wait for the operation to complete, check the parent group's volume list:

```azurecli
az elastic-san volume list \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --volume-group-name "$volumeGroupName" \
  --query "[?name=='$volumeName'].name" --output tsv
```

The deleted volume shouldn't appear.

---

## Delete a volume group

Delete a volume group only when you no longer need it or its contained volumes. Complete the deletion prerequisites for every affected volume, not just one selected volume.

# [Portal](#tab/azure-portal)

1. Select **SAN Management** > **Volume groups**.
1. Select the group's selection control, and select **Delete**.
1. In **Delete a volume group**, verify the group name and review **Dependent resources to be deleted**.

    :::image type="content" source="media/next-generation-manage/volume-group-delete-confirmation.png" alt-text="Screenshot of the Delete a volume group confirmation pane listing volume-group-01 and its dependent resource counts." lightbox="media/next-generation-manage/volume-group-delete-confirmation.png":::

1. Review the warning and complete any required acknowledgement. Select **Delete** only when you're ready to delete the group and its affected resources, or select **Cancel**.
1. Wait for completion and refresh the group list to confirm that the group is no longer listed.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName `
    -Name $volumeGroupName -Confirm

Get-AzElasticSanVolumeGroup -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -ElasticSanName $sanName |
    Where-Object Name -eq $volumeGroupName
```

The deleted group shouldn't appear.

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group delete \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --name "$volumeGroupName"

az elastic-san volume-group list \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --elastic-san-name "$sanName" \
  --query "[?name=='$volumeGroupName'].name" --output tsv
```

The deleted group shouldn't appear.

---

## Delete the entire SAN

Delete the SAN only when you no longer need any of its volume groups or volumes. You don't have to delete each volume individually if your intent is to delete the SAN and its contained resources, but you must complete the disconnect and detach prerequisites for all affected volumes first.

# [Portal](#tab/azure-portal)

1. Open the SAN's **Overview** page and select **Delete**.
1. In **Delete an Elastic SAN**, verify the SAN name and review **Dependent volume groups and volumes to be deleted**.

    :::image type="content" source="media/next-generation-manage/san-delete-confirmation.png" alt-text="Screenshot of Delete an Elastic SAN showing the example SAN, its dependent volume group and volume count, and Delete and Cancel." lightbox="media/next-generation-manage/san-delete-confirmation.png":::

1. Review the warning and complete any required acknowledgement. Select **Delete** only when you're ready to delete the SAN and its affected resources, or select **Cancel**.
1. Wait for completion and confirm that the SAN no longer appears in the resource group.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName -Name $sanName -Confirm

Get-AzElasticSan -SubscriptionId $subscriptionId `
    -ResourceGroupName $resourceGroupName |
    Where-Object Name -eq $sanName
```

The deleted SAN shouldn't appear.

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san delete \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" --name "$sanName"

az elastic-san list \
  --subscription "$subscriptionId" \
  --resource-group "$resourceGroupName" \
  --query "[?name=='$sanName'].name" --output tsv
```

The deleted SAN shouldn't appear.

---

## Next steps

- [Elastic SAN Next Generation scale targets](next-generation-scale-targets.md)
- [Attach and detach Elastic SAN Next Generation volumes](next-generation-attach-volume-portal.md)
- [Deploy Elastic SAN Next Generation](next-generation-create.md)
