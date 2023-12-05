---
title: Migrate a Windows virtual machine from unmanaged disks to managed disks
description: How to migrate a Windows VM from unmanaged disks to managed disks by using PowerShell in the Resource Manager deployment model
author: roygara
ms.service: azure-disk-storage
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 07/12/2018
ms.author: rogarana
---

# Migrate a Windows virtual machine from unmanaged disks to managed disks

**Applies to:** :heavy_check_mark: Windows VMs 

If you have existing Windows virtual machines (VMs) that use unmanaged disks, you can migrate the VMs to use managed disks through the [Azure Managed Disks](../managed-disks-overview.md) service. This process converts both the operating system (OS) disk and any attached data disks.


## Before you begin


* Review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks).

* Review [the FAQ about migration to Managed Disks](../faq-for-disks.yml).

* Ensure the VM is in a healthy sate before converting.


[!INCLUDE [virtual-machines-common-convert-disks-considerations](../../../includes/virtual-machines-common-convert-disks-considerations.md)]

* The original VHDs and the storage account used by the VM before migration are not deleted. They continue to incur charges. To avoid being billed for these artifacts, delete the original VHD blobs after you verify that the migration is complete. If you need to find these unattached disks in order to delete them, see our article [Find and delete unattached Azure managed and unmanaged disks](find-unattached-disks.md).


## Migrate single-instance VMs
This section covers how to migrate single-instance Azure VMs from unmanaged disks to managed disks. (If your VMs are in an availability set, see the next section.) 

1. Deallocate the VM by using the [Stop-AzVM](/powershell/module/az.compute/stop-azvm) cmdlet. The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`: 

   ```azurepowershell-interactive
   $rgName = "myResourceGroup"
   $vmName = "myVM"
   Stop-AzVM -ResourceGroupName $rgName -Name $vmName -Force
   ```

2. Migrate the VM to managed disks by using the [ConvertTo-AzVMManagedDisk](/powershell/module/az.compute/convertto-azvmmanageddisk) cmdlet. The following process converts the previous VM, including the OS disk and any data disks, and starts the Virtual Machine:

   ```azurepowershell-interactive
   ConvertTo-AzVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
   ```



## Migrate VMs in an availability set

If the VMs that you want to migrate to managed disks are in an availability set, you first need to migrate the availability set to a managed availability set.

1. Migrate the availability set by using the [Update-AzAvailabilitySet](/powershell/module/az.compute/update-azavailabilityset) cmdlet. The following example updates the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

   ```azurepowershell-interactive
   $rgName = 'myResourceGroup'
   $avSetName = 'myAvailabilitySet'

   $avSet = Get-AzAvailabilitySet -ResourceGroupName $rgName -Name $avSetName
   Update-AzAvailabilitySet -AvailabilitySet $avSet -Sku Aligned 
   ```

   If the region where your availability set is located has only 2 managed fault domains but the number of unmanaged fault domains is 3, this command shows an error similar to "The specified fault domain count 3 must fall in the range 1 to 2." To resolve the error, update the fault domain to 2 and update `Sku` to `Aligned` as follows:

   ```azurepowershell-interactive
   $avSet.PlatformFaultDomainCount = 2
   Update-AzAvailabilitySet -AvailabilitySet $avSet -Sku Aligned
   ```

2. Deallocate and migrate the VMs in the availability set. The following script deallocates each VM by using the [Stop-AzVM](/powershell/module/az.compute/stop-azvm) cmdlet, converts it by using [ConvertTo-AzVMManagedDisk](/powershell/module/az.compute/convertto-azvmmanageddisk), and restarts it automatically as apart of the migration process:

   ```azurepowershell-interactive
   $avSet = Get-AzAvailabilitySet -ResourceGroupName $rgName -Name $avSetName

   foreach($vmInfo in $avSet.VirtualMachinesReferences)
   {
     $vm = Get-AzVM -ResourceGroupName $rgName | Where-Object {$_.Id -eq $vmInfo.id}
     Stop-AzVM -ResourceGroupName $rgName -Name $vm.Name -Force
     ConvertTo-AzVMManagedDisk -ResourceGroupName $rgName -VMName $vm.Name
   }
   ```


## Troubleshooting

- Before converting, make sure all the VM extensions are in the 'Provisioning succeeded' state or the migration will fail with the error code 409.
- If there is an error during migration, or if a VM is in a failed state because of issues in a previous migration, run the `ConvertTo-AzVMManagedDisk` cmdlet again. A simple retry usually unblocks the situation.
- If you are converting a Linux VM to managed disks, use the latest version of the Azure Linux Agent. Operations using Azure Linux Agent versions '2.2.0' and earlier will likely fail. Running the migration on a generalized VM or a VM that belongs to a classic availability set is also not supported.
- If the migration fails with the "SnapshotCountExceeded" error, delete some snapshots and attempt the operation again.


## Migrate using the Azure portal

You can also migrate unmanaged disks to managed disks using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of VMs in the portal.
3. In the blade for the VM, select **Disks** from the menu.
4. At the top of the **Disks** blade, select **Migrate to managed disks**.
5. If your VM is in an availability set, there will be a warning on the **Migrate to managed disks** blade that you need to migrate the availability set first. The warning should have a link you can click to migrate the availability set. Once the availability set is converted or if your VM is not in an availability set, click **Migrate** to start the process of migrating your disks to managed disks.

The VM will be stopped and restarted after migration is complete.

## Next steps

[Change the disk type of an Azure managed disk](../disks-convert-types.md).

Take a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).
