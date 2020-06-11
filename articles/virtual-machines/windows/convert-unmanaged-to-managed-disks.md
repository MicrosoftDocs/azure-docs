---
title: Convert a Windows virtual machine from unmanaged disks to managed disks
description: How to convert a Windows VM from unmanaged disks to managed disks by using PowerShell in the Resource Manager deployment model
author: roygara
ms.service: virtual-machines-windows
ms.subservice: disks
ms.topic: how-to
ms.date: 07/12/2018
ms.author: rogarana
---

# Convert a Windows virtual machine from unmanaged disks to managed disks

If you have existing Windows virtual machines (VMs) that use unmanaged disks, you can convert the VMs to use managed disks through the [Azure Managed Disks](managed-disks-overview.md) service. This process converts both the OS disk and any attached data disks.

 

## Before you begin


* Review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks).

* Review [the FAQ about migration to Managed Disks](faq-for-disks.md#migrate-to-managed-disks).

[!INCLUDE [virtual-machines-common-convert-disks-considerations](../../../includes/virtual-machines-common-convert-disks-considerations.md)]

* The original VHDs and the storage account used by the VM before conversion are not deleted. They continue to incur charges. To avoid being billed for these artifacts, delete the original VHD blobs after you verify that the conversion is complete. If you need to find these unattached disks in order to delete them, see our article [Find and delete unattached Azure managed and unmanaged disks](find-unattached-disks.md).


## Convert single-instance VMs
This section covers how to convert single-instance Azure VMs from unmanaged disks to managed disks. (If your VMs are in an availability set, see the next section.) 

1. Deallocate the VM by using the [Stop-AzVM](https://docs.microsoft.com/powershell/module/az.compute/stop-azvm) cmdlet. The following example deallocates the VM named `myVM` in the resource group named `myResourceGroup`: 

   ```azurepowershell-interactive
   $rgName = "myResourceGroup"
   $vmName = "myVM"
   Stop-AzVM -ResourceGroupName $rgName -Name $vmName -Force
   ```

2. Convert the VM to managed disks by using the [ConvertTo-AzVMManagedDisk](https://docs.microsoft.com/powershell/module/az.compute/convertto-azvmmanageddisk) cmdlet. The following process converts the previous VM, including the OS disk and any data disks, and starts the Virtual Machine:

   ```azurepowershell-interactive
   ConvertTo-AzVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
   ```



## Convert VMs in an availability set

If the VMs that you want to convert to managed disks are in an availability set, you first need to convert the availability set to a managed availability set.

1. Convert the availability set by using the [Update-AzAvailabilitySet](https://docs.microsoft.com/powershell/module/az.compute/update-azavailabilityset) cmdlet. The following example updates the availability set named `myAvailabilitySet` in the resource group named `myResourceGroup`:

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

2. Deallocate and convert the VMs in the availability set. The following script deallocates each VM by using the [Stop-AzVM](https://docs.microsoft.com/powershell/module/az.compute/stop-azvm) cmdlet, converts it by using [ConvertTo-AzVMManagedDisk](https://docs.microsoft.com/powershell/module/az.compute/convertto-azvmmanageddisk), and restarts it automatically as apart of the conversion process:

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

If there is an error during conversion, or if a VM is in a failed state because of issues in a previous conversion, run the `ConvertTo-AzVMManagedDisk` cmdlet again. A simple retry usually unblocks the situation.
Before converting, make sure all the VM extensions are in the 'Provisioning succeeded' state or the conversion will fail with the error code 409.

## Convert using the Azure portal

You can also convert unmanaged disks to managed disks using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of VMs in the portal.
3. In the blade for the VM, select **Disks** from the menu.
4. At the top of the **Disks** blade, select **Migrate to managed disks**.
5. If your VM is in an availability set, there will be a warning on the **Migrate to managed disks** blade that you need to convert the availability set first. The warning should have a link you can click to convert the availability set. Once the availability set is converted or if your VM is not in an availability set, click **Migrate** to start the process of migrating your disks to managed disks.

The VM will be stopped and restarted after migration is complete.

## Next steps

[Convert standard managed disks to premium](convert-disk-storage.md)

Take a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).

