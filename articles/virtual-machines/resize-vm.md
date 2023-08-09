---
title: Resize a virtual machine
description: Change the VM size used for an Azure virtual machine.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 08/09/2023
ms.author: cynthn 
ms.custom: devx-track-azurepowershell

---
# Change the size of a virtual machine 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to change an existing virtual machine's [VM size](sizes.md).

After you create a virtual machine (VM), you can scale the VM up or down by changing the VM size. In some cases, you must deallocate the VM first. Deallocation may be necessary if the new size isn't available on the same hardware cluster that is currently hosting the VM.

If your VM uses Premium Storage, make sure that you choose an **s** version of the size to get Premium Storage support. For example, choose Standard_E4**s**_v3 instead of Standard_E4_v3.

## Change the VM size

### [Portal](#tab/portal)

1. Open the [Azure portal](https://portal.azure.com).
1. Open the page for the virtual machine.
1. In the left menu, select **Size**.
1. Pick a new size from the list of available sizes and then select **Resize**.

> [!Note] 
> If the virtual machine is currently running, changing its size will cause it to restart. 

If your VM is still running and you don't see the size you want in the list, stopping the virtual machine may reveal more sizes.

   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 
  

### [CLI](#tab/cli)

To resize a VM, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

The below script checks if the desired VM size is available before resizing. If the desired size is not available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again. You can replace the values of `resourceGroup`, `vm`, and `size` with your own.
   
```azurecli-interactive
 # Set variables
resourceGroup=myResourceGroup
vm=myVM
size=Standard_DS3_v2

# Check if the desired VM size is available
if ! az vm list-vm-resize-options --resource-group $resourceGroup --name $vm --query "[].name" | grep -q $size; then
    echo "The desired VM size is not available."
    exit 1
fi

# Deallocate the VM
az vm deallocate --resource-group $resourceGroup --name $vm

# Resize the VM
az vm resize --resource-group $resourceGroup --name $vm --size $size

# Start the VM
az vm start --resource-group $resourceGroup --name $vm
```
   
   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 

### [PowerShell](#tab/powershell)

**Use PowerShell to resize a VM not in an availability set.**

Set some variables. Replace the values with your own information.

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$vmName = "myVM"
```

List the VM sizes that are available in the region where you hosted the VM. 
   
```azurepowershell-interactive
Get-AzVMSize -ResourceGroupName $resourceGroup -VMName $vmName 
```

If you see the size you want listed, run the following commands to resize the VM. If you don't see the desired size, go on to step 3.
   
```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName $resourceGroup -VMName $vmName
$vm.HardwareProfile.VmSize = "<newVMsize>"
Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
```

If you don't see the size you want listed, run the following commands to deallocate the VM, resize it, and restart the VM. Replace **\<newVMsize>** with the size you want.
   
```azurepowershell-interactive
Stop-AzVM -ResourceGroupName $resourceGroup -Name $vmName -Force
$vm = Get-AzVM -ResourceGroupName $resourceGroup -VMName $vmName
$vm.HardwareProfile.VmSize = "<newVMSize>"
Update-AzVM -VM $vm -ResourceGroupName $resourceGroup
Start-AzVM -ResourceGroupName $resourceGroup -Name $vmName
```

   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region.


**Use PowerShell to resize a VM in an availability set**

If the new size for a VM in an availability set isn't available on the hardware cluster currently hosting the VM, then you will need to deallocate all VMs in the availability set to resize the VM. You also might need to update the size of other VMs in the availability set after one VM has been resized. To resize a VM in an availability set, perform the following steps.

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$vmName = "myVM"
```

List the VM sizes that are available on the hardware cluster where you hosted the VM. 
   
```azurepowershell-interactive
Get-AzVMSize `
-ResourceGroupName $resourceGroup `
-VMName $vmName 
```

If you see the size you want listed, run the following commands to resize the VM. If you don't see it listed, go to the next section.
   
```azurepowershell-interactive
$vm = Get-AzVM `
-ResourceGroupName $resourceGroup `
-VMName $vmName 
$vm.HardwareProfile.VmSize = "<newVmSize>"
Update-AzVM `
-VM $vm `
-ResourceGroupName $resourceGroup
```
	
If you don't see the size you want listed, continue with the following steps to deallocate all VMs in the availability set, resize VMs, and restart them.

Stop all VMs in the availability set.
   
```azurepowershell-interactive
$availabilitySetName = "<availabilitySetName>"
$as = Get-AzAvailabilitySet `
-ResourceGroupName $resourceGroup `
-Name $availabilitySetName
$virtualMachines = $as.VirtualMachinesReferences |  Get-AzResource | Get-AzVM
$virtualMachines |  Stop-AzVM -Force -NoWait  
```

Resize and restart the VMs in the availability set.
   
```azurepowershell-interactive
$availabilitySetName = "<availabilitySetName>"
$newSize = "<newVmSize>"
$as = Get-AzAvailabilitySet -ResourceGroupName $resourceGroup -Name $availabilitySetName
$virtualMachines = $as.VirtualMachinesReferences |  Get-AzResource | Get-AzVM
$virtualMachines | Foreach-Object { $_.HardwareProfile.VmSize = $newSize }
$virtualMachines | Update-AzVM
$virtualMachines | Start-AzVM
```

---
## Limitations

You can't resize a VM size that has a local temp disk to a VM size with no local temp disk and vice versa.

The only combinations allowed for resizing are:

- VM (with local temp disk) -> VM (with local temp disk); and
- VM (with no local temp disk) -> VM (with no local temp disk).

For a work-around, see [How do I migrate from a VM size with local temp disk to a VM size with no local temp disk? ](azure-vms-no-temp-disk.yml#how-do-i-migrate-from-a-vm-size-with-local-temp-disk-to-a-vm-size-with-no-local-temp-disk---). The work-around can be used to resize a VM with no local temp disk to VM with a local temp disk. You will create a snapshot of the VM with no local temp disk > create a disk from the snapshot > create VM from the disk with appropriate [VM size](sizes.md) that supports VMs with a local temp disk.


## Next steps

- For more scalability, run multiple VM instances and scale out.
- For more information, see [Automatically scale machines in a Virtual Machine Scale Set](../virtual-machine-scale-sets/tutorial-autoscale-powershell.md).
- For more cost management planning, see [Plan and manage your Azure costs](https://learn.microsoft.com/en-us/training/modules/plan-manage-azure-costs/1-introduction).
