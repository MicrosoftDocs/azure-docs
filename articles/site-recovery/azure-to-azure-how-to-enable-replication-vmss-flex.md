---
title: Enable disaster recovery for VMs in Virtual Machine Scale Sets with Flexible orchestration
description: Learn how to use Azure Site Recovery to replicate, fail over, reprotect, and fail back Azure VMs that run in Virtual Machine Scale Sets with Flexible orchestration.
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 10/28/2026
author: Aarthi-Vijaya-raghavan
ms.author: aarthiv
---

# Enable disaster recovery for VMs in Virtual Machine Scale Sets with Flexible orchestration

**Applies to:** ✔️ Linux VMs ✔️ Windows VMs ✔️ Flexible scale sets

This article describes how to use [Azure Site Recovery](site-recovery-overview.md) to protect Azure virtual machines (VMs) that run in Virtual Machine Scale Sets with Flexible orchestration(VMSS Flex). You can replicate these VMs to another Azure region or to another availability zone in the same region, fail them over into a scale set in the recovery location, and then reprotect and fail back.

In this article, you learn how to:

> * Prepare a target scale set in the recovery location.
> * Enable replication for VMs in a Flexible scale set.
> * View and update the target scale set settings.
> * Run a failover, reprotect, and fail back.

## How it works

Site Recovery protects each VM in a Flexible scale set as an individual replicated item. You enable replication on the individual VMs in the scale set, not at the scale set level. 

> [!NOTE]
> You can't enable Site Recovery for an entire scale set in one step. Select the individual VMs in the scale set that you want to protect. To fail over a group of VMs together, add them to a [recovery plan](site-recovery-create-recovery-plans.md).

- **Replication:** Disks of each protected VM replicate continuously to the recovery location, the same way as for any other [Azure VM](azure-to-azure-architecture.md).
- **Target scale set:** You create a Flexible scale set in the recovery location before you enable replication. When you enable replication, you select that scale set and, where it applies, an availability zone and fault domain in it.
- **Failover:** At failover, Site Recovery creates the recovery VM and places it in the target scale set, in the availability zone and fault domain you configured.
- **Reprotect and failback:** After failover, you reprotect the VM back to the original location. Failback returns the workload to the original source VM, so it keeps the source VM's scale set configuration.

## Supported scenarios

### Source VM deployment

You can select a Flexible scale set as the target for VMs with the following source deployments.

| Source VM deployment | Region-to-region DR | Zone-to-zone DR |
|---|---|---|
| VM in a zonal Flexible scale set | Supported | Supported |
| VM in a regional Flexible scale set (fault domain count = 1 or greater than 1) | Supported | Not supported |
| Single-instance zonal VM | Supported | Supported |
| Single-instance regional VM | Supported | Not supported |
| VM in an availability set | Supported | Not supported |

### Target scale set types

| Target scale set | Region-to-region DR | Zone-to-zone DR |
|---|---|---|
| Regional, fault domain count = 1 | Supported | Not supported |
| Regional, fault domain count greater than 1 | Supported | Not supported |
| Zonal (single zone or multiple zones), fault domain count = 1 | Supported | Supported, if the scale set spans at least one zone other than the source VM's zone |

For zone-to-zone DR:

- Only zonal scale sets are listed as targets. Regional scale sets aren't supported.
- The target resource group must be different from the source resource group.

For region-to-region DR, you can use a regional or a zonal target scale set. If the target region doesn't support availability zones, use a regional scale set.

### Settings you provide for the target scale set

The settings you need depend on the type of target scale set.

| Target scale set type | Target scale set | Availability zone | Fault domain |
|---|---|---|---|
| Regional, fault domain count = 1 | Required | Not applicable | Not required. The scale set has a single fault domain, and the recovery VM is placed in it. |
| Regional, fault domain count greater than 1 | Required | Not applicable | Optional. If you select a fault domain, the recovery VM is placed in it at test failover and failover. If you don't, Site Recovery uses the source VM's fault domain when it exists in the target scale set; otherwise, the platform assigns a fault domain at failover. A fault domain that isn't valid for the scale set causes the operation to fail. |
| Single zone, fault domain count = 1 | Required | Selected for you. Only the zone that the scale set spans is available. | Not required |
| Multiple zones, fault domain count = 1 | Required | **Required.** Only zones that the scale set spans are available. | Not required |

## Limitations

- **Uniform orchestration:** Not supported.
- **Scale set configuration isn't replicated:** Site Recovery doesn't create the target scale set or copy its configuration, VM profile, autoscale settings, or instance count. 
- **Target scale set must be created:** You must create and configure the target scale set yourself and then only enable replication. For zonal VMs, the target VMSS Flex must include the saved target zone, which you must explicitly select during configuration. For regional VMs, the target VMSS Flex must support the required fault-domain configuration. 
- **New instances aren't protected automatically:** VMs that you add to a scale set after you enable replication, including VMs created by autoscale, aren't protected automatically. Enable replication for each VM you want to protect. 
- **Target resource group:** The target scale set must be in the target resource group where Site Recovery creates the recovery VM. A VM and its scale set must be in the same resource group. 
- **Proximity placement groups:** When the target is a scale set, the proximity placement group configuration is inherited from the target scale set. You can't select or configure a separate proximity placement group for the VM in the Site Recovery experience.
- **Capacity reservation:** Capacity reservation isn't supported at the scale set level for Flexible scale sets. To reserve capacity, associate a capacity reservation group with each protected VM in its Site Recovery target settings.
- **VM sizes:** When you enable replication, Azure Site Recovery automatically selects a compatible target VM size.
- **Zone and fault domain after protection:** After replication is enabled, you can change the target scale set, but the target availability zone and fault domain are read-only. To change them, disable replication and enable it again.
- **Target scale set type after protection:** You can change the target only to a scale set of the same type. A zonal target can't be changed to a regional scale set, and a regional target can't be changed to a zonal scale set.

All other requirements in the [Azure-to-Azure support matrix](azure-to-azure-support-matrix.md) also apply.

## Prerequisites

- An Azure subscription with permissions to enable replication. See [Prepare Azure VMs for disaster recovery](azure-to-azure-tutorial-enable-replication.md#prerequisites).
- A Recovery Services vault. For region-to-region DR, create the vault in the target region.
- Source VMs that meet the [support matrix](azure-to-azure-support-matrix.md) requirements, with [outbound connectivity](azure-to-azure-about-networking.md) to Site Recovery.
- A target Flexible scale set.

## Prepare the target scale set

Before you enable replication, create the target scale set in the recovery location:

1. Create the target resource group in the target region (or, for zone-to-zone DR, a resource group in the same region that's different from the source resource group).
2. In that resource group, create a Virtual Machine Scale Set with **Flexible** orchestration: no VM profile and an instance count of 0. Don't add VMs to it; Site Recovery adds the recovery VMs at failover.
3. Configure the scale set to match your recovery design:
   - **Region-to-region DR:** Use a zonal or regional scale set. If the target region doesn't support availability zones, use a regional scale set.
   - **Zone-to-zone DR:** Use a zonal scale set that spans at least one zone other than the source VM's zone.
   - **Fault domains:** We recommend matching the source scale set's fault domain count. For zonal scale sets, the fault domain count is 1.
   - **Proximity placement group:** If you need one, set it on the target scale set. Site Recovery uses it at failover. Proximity placement group is disabled when target is set to virtual machine scale set.
   - **VM sizes:** If the fault domain count is greater than 1 and you protect VM sizes that don't support memory-preserving maintenance, set `singlePlacementGroup` to `true`.

## Enable replication

### Portal


**From the Recovery Services vault**
1. In the Azure portal, open your Recovery Services vault. In the left menu, under **Getting started**, select **Site Recovery**, and then under **Azure virtual machines**, select **Enable replication**. 
2. On the **Source** tab, select the source region, subscription, and resource group. For zone-to-zone DR, select **Yes** for **Disaster recovery between availability zones?**
3. On the **Virtual machines** tab, select the individual VMs in the scale set that you want to protect. Each VM you select is protected as its own replicated item.
4. On the **Replication settings** tab, select the target region, subscription, target resource group, and the target virtual network that contains your target scale set.
5. Under **Availability options**, select **view/edit availability options**. For each VM:
   1. For **Target availability**, select **Virtual machine scale set (Flexible)**.
   2. Select the **Target virtual machine scale set**. Select the Flexible scale set in the target resource group. For zone-to-zone DR, only zonal scale sets are listed.
   3. If the scale set spans multiple zones, select the **Availability zone**. If it spans one zone, the zone is selected for you.
   4. If the target scale set is regional with more than one fault domain, optionally select a **Fault domain**.
The **Target proximity placement group** field is unavailable as the one set at target scale set level is used during failover.
6. Optionally, under **Capacity reservation**, select a capacity reservation group for each VM.
7. Complete the **Manage** tab, and then select **Review + Enable replication** > **Enable replication**.


You can enable replication from the Recovery Services vault or from the VM's **Disaster recovery** page.

**From the VM**

1. In the Azure portal, open the VM in the scale set that you want to protect, and then select **Disaster recovery** under **Backup + disaster recovery**.
2. On the **Basics** tab, select the target region. For zone-to-zone DR, select **Yes** for **Disaster recovery between availability zones**.
3. On the **Advanced settings** tab, select the target resource group, and then for **Target availability**, select **Virtual machine scale set (Flexible)**. Select the target scale set and, where it applies, the availability zone and fault domain.
4. Optionally, under **Capacity reservation**, select a capacity reservation group.

   The review page shows the source and target scale sets together with their zones.
5. Select **Review + Start replication**.


## View and update target settings

After you enable replication:

1. In the vault, select **Replicated items**, and then select the VM.
1. Select **Compute**. For **Availability**, **Source settings** show **Virtual machine scale set (Flexible)**, the source scale set name, and the source VM's zone. **Target settings** show the target scale set and the target zone or fault domain.
1. To change the target scale set, select **Edit**, select a different scale set, and then select **Save**. The list shows only scale sets of the same type (regional or zonal) as the current target. The zone and fault domain fields are read-only.

The following rules apply when you change the target scale set:

- If the current target is a regional scale set, the new target must also be a regional scale set.
- If the current target is a zonal scale set, the new target must also be a zonal scale set that spans the configured target zone.
- You can't change the target availability zone and fault domain.
- The new scale set must be in the target resource group.

## Run a test failover

Run a [test failover](azure-to-azure-tutorial-dr-drill.md) to validate your configuration without affecting replication. The test failover VM is created in the target scale set, in the configured availability zone or fault domain. After you validate it, clean up the test failover.


## Fail over

1. In the vault, select **Replicated items**, and then select the VM.
2. Select **Failover**, choose a recovery point, and then select **OK**.
3. After failover completes, verify that the recovery VM is in the target scale set, in the expected availability zone and fault domain.
4. Select **Commit**.

> [!NOTE]
> VM extensions aren't replicated. Install any extensions that the workload needs on the recovery VM after failover.

## Reprotect and fail back

After failover, the recovered VM is unprotected. Follow the steps below to protect it back to the original location:

1. Wait for the failover to commit. The **Re-protect** option might not be available immediately after failover.
2. In **Replicated items**, select the VM, and then select **Re-protect**.
3. Review the target settings. The **Re-protect** pane shows **Target virtual machine scale sets** with the zone, for example *sap-vmss-01 (Zone 1)*, and **Target availability zones**. By default, Site Recovery uses the original source scale set, availability zone, and fault domain. You can select **Customize** to change the cache storage account and other settings. You can't change the availability zone or fault domain.
4. Select **OK** to start reprotection.
5. After reprotection completes and the VM is healthy, fail back to the original location. Failback returns to the original source VM. If the source VM is still in its scale set, it stays there. If you detached it from the scale set after failover, the failed-back VM isn't in a scale set.
6. After failback, reprotect again to resume replication to the recovery location. Site Recovery uses the target scale set and availability zone that you configured originally.

To reprotect with PowerShell, specify the target scale set and availability zone:

```azurepowershell
Update-AzRecoveryServicesAsrProtectionDirection -AzureToAzure `
    -ReplicationProtectedItem $item `
    -ProtectionContainerMapping $mapping `
    -LogStorageAccountId $cache.Id `
    -RecoveryResourceGroupId $targetRg.ResourceId `
    -RecoveryVirtualMachineScaleSetId $targetVmss.Id `
    -RecoveryAvailabilityZone "1"
```

## Troubleshoot
| Error code | Message | Resolution |
|---|---|---|
| 28165 | Target proximity placement group is specified and proximity placement group in virtual scale set is null. | Don't specify a target proximity placement group when you use a target scale set. Configure the proximity placement group on the target scale set instead. |
| 28168 | The target virtual machine scale set is zonal, and the target availability zone isn't specified. | Specify an availability zone that the target scale set spans. |
| 150405 | A target virtual machine scale set is required. | This error can occur when you reprotect after failback. Reprotect with PowerShell and specify `-RecoveryVirtualMachineScaleSetId` and `-RecoveryAvailabilityZone`.

## Next steps

- [Support matrix for Azure VM disaster recovery](azure-to-azure-support-matrix.md)
- [Common questions about Azure-to-Azure disaster recovery](azure-to-azure-common-questions.md)
- [Run a disaster recovery drill](azure-to-azure-tutorial-dr-drill.md)
- [Virtual Machine Scale Sets orchestration modes](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes)
