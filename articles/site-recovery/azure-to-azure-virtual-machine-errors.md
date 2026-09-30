---
title: Troubleshoot Azure VM replication in Azure Site Recovery - VM errors
description: Troubleshoot VM errors when replicating Azure virtual machines for disaster recovery.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: As a cloud administrator, I want to troubleshoot Azure VM replication errors in Site Recovery so that I can ensure reliable disaster recovery and maintain operational continuity for my organization's virtual machines.
---

# Troubleshoot Azure-to-Azure VM replication errors - VM errors

This article describes how to troubleshoot common errors in Azure Site Recovery during replication and recovery of [Azure virtual machines](azure-to-azure-tutorial-enable-replication.md) (VM) from one region to another. For more information about supported configurations, see the [support matrix for replicating Azure VMs](azure-to-azure-support-matrix.md).

## Disk not found in VM (error code 150039)

A new disk attached to the VM must be initialized. If the disk isn't found, the following message is displayed:

```Output
Azure data disk <DiskName> <DiskURI> with logical unit number <LUN> <LUNValue> was not mapped to a corresponding disk being reported from within the VM that has the same LUN value.
```

**Possible causes**

- A new data disk was attached to the VM but wasn't initialized.
- The data disk inside the VM isn't correctly reporting the logical unit number (LUN) value at which the disk was attached to the VM.

**Workaround**

Make sure that the data disks are initialized, and then retry the operation.

- **Windows**: [Attach and initialize a new disk](/azure/virtual-machines/windows/attach-managed-disk-portal).
- **Linux**: [Initialize a new data disk in Linux](/azure/virtual-machines/linux/add-disk).

If the problem persists, contact support.

## VM removed from vault completed with information (error code 150225)

When Site Recovery protects the virtual machine, it creates links on the source virtual machine. When you remove the protection or disable replication, Site Recovery removes these links as a part of the cleanup job. If the virtual machine has a resource lock, the cleanup job gets completed with the information. The information says that the virtual machine has been removed from the Recovery Services vault, but that some of the stale links couldn't be cleaned up on the source machine.

You can ignore this warning if you never intend to protect this virtual machine again. But if you have to protect this virtual machine later, follow the steps in this section to clean up the links.

> [!WARNING]
> If you don't do the cleanup:
>
> - When you enable replication by means of the Recovery Services vault, the virtual machine won't be listed.
> - If you try to protect the VM by using **Virtual machine** > **Settings** > **Disaster Recovery**, the operation will fail with the message **Replication cannot be enabled because of the existing stale resource links on the VM**.

**Workaround**

> [!NOTE]
> Site Recovery doesn't delete the source virtual machine or affect it in any way while you perform these steps.

1. Remove the lock from the VM or VM resource group. For example, in the following image, the resource lock on the VM named `MoveDemo` must be deleted:

   :::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/vm-locks.png" alt-text="Remove lock from VM.":::

1. Download the script to [remove a stale Site Recovery configuration](https://github.com/AsrOneSdk/published-scripts/blob/master/Cleanup-Stale-ASR-Config-Azure-VM.ps1).
1. Run the script, _Cleanup-stale-asr-config-Azure-VM.ps1_. Provide the **Subscription ID**, **VM Resource Group**, and **VM name** as parameters.
1. If you're prompted for Azure credentials, provide them. Then verify that the script runs without any failures.

## Replication not enabled on VM with stale resources (error code 150226)

**Possible causes**

The virtual machine has a stale configuration from previous Site Recovery protection.

A stale configuration can occur on an Azure VM if you enabled replication for the Azure VM by using Site Recovery, and then:

- You disabled replication, but the source VM had a resource lock.
- You deleted the Site Recovery vault without explicitly disabling replication on the VM.
- You deleted the resource group containing the Site Recovery vault without explicitly disabling replication on the VM.

**Workaround**

> [!NOTE]
> Site Recovery doesn't delete the source virtual machine or affect it in any way while you perform these steps.

1. Remove the lock from the VM or VM resource group. For example, in the following image, the resource lock on the VM named `MoveDemo` must be deleted:

   :::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/vm-locks.png" alt-text="Remove lock from VM.":::

1. Download the script to [remove a stale Site Recovery configuration](https://github.com/AsrOneSdk/published-scripts/blob/master/Cleanup-Stale-ASR-Config-Azure-VM.ps1).
1. Run the script, _Cleanup-stale-asr-config-Azure-VM.ps1_. Provide the **Subscription ID**, **VM Resource Group**, and **VM name** as parameters.
1. If you're prompted for Azure credentials, provide them. Then verify that the script runs without any failures.

## Can't select VM or resource group in enable replication job

### Issue 1: The resource group and source VM are in different locations

Site Recovery currently requires the source region resource group and virtual machines to be in the same location. If they aren't, you won't be able to find the virtual machine or resource group when you try to apply protection.

As a workaround, you can enable replication from the VM instead of the Recovery Services vault. Go to **Source VM** > **Properties** > **Disaster Recovery** and enable the replication.

### Issue 2: The resource group isn't part of the selected subscription

You might not be able to find the resource group at the time of protection if the resource group isn't part of the selected subscription. Make sure that the resource group belongs to the subscription that you're using.

### Issue 3: Stale configuration

You might not see the VM that you want to enable for replication if a stale Site Recovery configuration exists on the Azure VM. This condition could occur if you enabled replication for the Azure VM by using Site Recovery, and then:

- You deleted the Site Recovery vault without explicitly disabling replication on the VM.
- You deleted the resource group containing the Site Recovery vault without explicitly disabling replication on the VM.
- You disabled replication, but the source VM had a resource lock.

**Workaround**

> [!NOTE]
> Make sure to update the `AzureRM.Resources` module before using the script mentioned in this section. Site Recovery doesn't delete the source virtual machine or affect it in any way while you perform these steps.

1. Remove the lock, if any, from the VM or VM resource group. For example, in the following image, the resource lock on the VM named `MoveDemo` must be deleted:

   :::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/vm-locks.png" alt-text="Remove lock from VM.":::

1. Download the script to [remove a stale Site Recovery configuration](https://github.com/AsrOneSdk/published-scripts/blob/master/Cleanup-Stale-ASR-Config-Azure-VM.ps1).
1. Run the script, _Cleanup-stale-asr-config-Azure-VM.ps1_. Provide the **Subscription ID**, **VM Resource Group**, and **VM name** as parameters.
1. If you're prompted for Azure credentials, provide them. Then verify that the script runs without any failures.

## VM provisioning state isn't valid (error code 150019)

To enable replication on the VM, its provisioning state must be **Succeeded**. Perform the following steps to check the provisioning state:

1. In the Azure portal, select the **Resource Explorer** from **All Services**.
1. Expand the **Subscriptions** list and select your subscription.
1. Expand the **ResourceGroups** list and select the resource group of the VM.
1. Expand the **Resources** list and select your VM.
1. Check the **provisioningState** field in the instance view on the right side.

**Workaround**

- If the **provisioningState** is **Failed**, contact support with details to troubleshoot.
- If the **provisioningState** is **Updating**, another extension might be being deployed. Check whether there are any ongoing operations on the VM, wait for them to finish, and then retry the failed Site Recovery job to enable replication.

## Unable to select target VM

### Issue 1: VM is attached to a network that's already mapped to a target network

During disaster recovery configuration, if the source VM is part of a virtual network, and another VM from the same virtual network is already mapped with a network in the target resource group, the network selection drop-down list box is unavailable (appears dimmed) by default.

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/unabletoselectnw.png" alt-text="Network selection list unavailable.":::

### Issue 2: You previously protected the VM and then you disabled the replication

Disabling replication of a VM doesn't delete the network mapping. The mapping must be deleted from the Recovery Services vault where the VM was protected. Select the **Recovery Services vault** and go to **Manage** > **Site Recovery Infrastructure** > **For Azure virtual machines** > **Network Mapping**.

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/delete_nw_mapping.png" alt-text="Delete network mapping.":::

The target network that was configured during the disaster recovery setup can be changed after the initial setup, and after the VM is protected. To **Modify network mapping** select the network name:

:::image type="content" source="./media/site-recovery-azure-to-azure-troubleshoot/modify_nw_mapping.png" alt-text="Modify network mapping.":::

## Next steps

[Replicate Azure VMs to another Azure region](azure-to-azure-how-to-enable-replication.md).
