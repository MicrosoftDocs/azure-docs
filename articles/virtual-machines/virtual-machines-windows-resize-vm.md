<properties
	pageTitle="Resize a Windows VM | Microsoft Azure"
	description="Resize a Windows virtual machine created in the Resource Manager deployment model, using Azure Powershell."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="Drewm3"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/12/2016"
	ms.author="drewm"/>

	
# Resize a Windows VM

This article shows you how to resize a Windows VM, created in the Resource Manager deployment model using Azure Powershell.

After you create a virtual machine (VM), you can scale the VM up or down by changing the VM size. In some cases, you must deallocate the VM first. This can happen if the new size is not available on the hardware cluster that is currently hosting the VM.

## Resize a Windows VM not in an availability set

List the VM sizes that are available on the hardware cluster where the VM is hosted. 

	```powershell
	Get-AzureRmVMSize -ResourceGroupName <resource-group-name> -VMName <vm-name> 
	```

If the desired size is listed, run the following commands to resize the VM. 

	```powershell
	$vm = Get-AzureRmVM -ResourceGroupName <resourceGroupName> -VMName <vmName>
	$vm.HardwareProfile.VmSize = "<newVMsize>"
	Update-AzureRmVM -VM $vm -ResourceGroupName <resourceGroupName>
	```

If the desired size is not listed, run the following commands to deallocate the VM, resize it, and restart the VM.

	```powershell
	$rgname = "<resourceGroupName>"
	$vmname = "<vmName>"
	Stop-AzureRmVM -ResourceGroupName $rgname -VMName $vmname -Force
	$vm = Get-AzureRmVM -ResourceGroupName $rgname -VMName $vmname
	$vm.HardwareProfile.VmSize = "<newVMSize>"
	Update-AzureRmVM -VM $vm -ResourceGroupName $rgname
	Start-AzureRmVM -ResourceGroupName $rgname -Name $vmname
	```

> [AZURE.WARNING] Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected. 

## Resize a Windows VM in an availability set

If the new size for a VM in an availability set is not available on the hardware cluster currently hosting the VM, then all VMs in the availability set will need to be deallocated to resize the VM. Additionally it may be required to update the size of other VMs in the availability set after one VM has been resized. To resize a VM in an availability set, perform the following steps.

List the VM sizes that are available on the hardware cluster where the VM is hosted.

	```powershell
	Get-AzureRmVMSize -ResourceGroupName <resourceGroupName> -VMName <vmName>
	```

If the desired size is listed, run the following commands to resize the VM.

	```powershell
	$vm = Get-AzureRmVM -ResourceGroupName <resourceGroupName> -VMName <vmName>
	$vm.HardwareProfile.VmSize = "<newVmSize>"
	Update-AzureRmVM -VM $vm -ResourceGroupName <resourceGroupName>
	```

If the desired size is not listed, continue with the following steps to deallocate all VMs in the availability set, resize VMs, and restart them.

1.	Stop all VMs in the availability set.

	```powershell
	$rg = "<resourceGroupName>"
	$as = Get-AzureRmAvailabilitySet -ResourceGroupName $rg
	$vmIds = $as.VirtualMachinesReferences
	foreach ($vmId in $vmIDs){
		$string = $vmID.Id.Split("/")
		$vmName = $string[8]
		Stop-AzureRmVM -ResourceGroupName $rg -Name $vmName -Force
	} 
	```
              
2.	Resize and restart the VMs in the availability set.

	```powershell
	$rg = "<resource-group-name>"
	$newSize = "<new-VM-Size>"
	$as = Get-AzureRmAvailabilitySet -ResourceGroupName $rg
	$vmIds = $as.VirtualMachinesReferences
	foreach ($vmId in $vmIDs){
		$string = $vmID.Id.Split("/")
		$vmName = $string[8]
		$vm = Get-AzureRmVM -ResourceGroupName $rg -Name $vmName
		$vm.HardwareProfile.VmSize = $newSize
		Update-AzureRmVM -ResourceGroupName $rg -VM $vm
		Start-AzureRmVM -ResourceGroupName $rg -Name $vmName
	}
	```

## Next steps

- For additional scalability, run multiple VM instances and scale out. For more information, see [Automatically scale Windows machines in a Virtual Machine Scale Set](../virtual-machine-scale-sets/virtual-machine-scale-sets-windows-autoscale.md).



