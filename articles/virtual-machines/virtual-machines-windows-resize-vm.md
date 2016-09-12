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
	ms.date="09/09/2016"
	ms.author="drewm"/>

	
# Resize a Windows VM

This article shows you how to resize a Windows VM, created in the Resource Manager deployment model using Azure Powershell.

After you create a virtual machine (VM), you can scale the VM up or down by changing the VM size. In some cases, you must deallocate the VM first. This can happen if the new size is not available on the hardware cluster that is currently hosting the VM.

## Resize a Windows VM not in an availability set

To resize a VM not in an availability set, perform the following steps.

1.	Run the following PowerShell command. This command lists the VM sizes that are available on the hardware cluster where the VM is hosted.

	Get-AzureRmVMSize -ResourceGroupName <resource-group-name> -VMName <vm-name> 
	
2.	If the desired size is listed, run the following commands to resize the VM.

		$vm = Get-AzureRmVM -ResourceGroupName <resourceGroupName> -VMName <vmName>
		$vm.HardwareProfile.VmSize = "<newVMsize>"
		Update-AzureRmVM -VM $vm -ResourceGroupName <resourceGroupName>
	
3.	Otherwise, if the desired size is not listed, run the following commands to deallocate the VM, resize it, and then restart the VM.

		$rgname = "<resourceGroupName>"
		$vmname = "<vmName>"
		Stop-AzureRmVM -ResourceGroupName $rgname -VMName $vmname -Force
		$vm = Get-AzureRmVM -ResourceGroupName $rgname -VMName $vmname
		$vm.HardwareProfile.VmSize = "<newVMSize>"
		Update-AzureRmVM -VM $vm -ResourceGroupName $rgname
		Start-AzureRmVM -ResourceGroupName $rgname -Name $vmname

Warning, deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected. 

## Resize a Windows VM in an availability set

If the new size for a VM in an availability set is not available on the hardware cluster currently hosting the VM, then all VMs in the availability set will need to be deallocated to resize the VM. Additionally it may be required to update the size of other VMs in the availability set after one VM has been resized. To resize a VM in an availability set, perform the following steps.

1.	Run the following PowerShell command. This command lists the VM sizes that are available on the hardware cluster where the VM is hosted.

		Get-AzureRmVMSize -ResourceGroupName <resource-group-name> -VMName <vm-name>

2.	If the desired size is listed, run the following commands to resize the VM.

		$vm = Get-AzureRmVM -ResourceGroupName <resource-group-name> -VMName <vm-name>
		$vm.HardwareProfile.VmSize = "<new-vm-size>"
		Update-AzureRmVM -VM $vm -ResourceGroupName <resource-group-name>
	
3.	Otherwise, if the desired size is not listed, continue with the following steps to deallocate all VMs in the availability set, resize VMs, and restart them.
4.	Run the following commands to stop all VMs in the availability set.
5.	Run the following commands to resize and restart the target VM.
6.	Run the following command to get the list of sizes available in the new hardware cluster.
7.	Run the following commands to resize any other VM in the availability set which needs to be resized for the new hardware cluster.
8.	Run the following commands to restart the remaining VMs in the availability set.

## Next steps

- For additional scalability, run multiple VM instances and scale out. For more information, see [Automatically scale Windows machines in a Virtual Machine Scale Set](../virtual-machine-scale-sets/virtual-machine-scale-sets-windows-autoscale.md).



