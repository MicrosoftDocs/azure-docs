---
title: Change a VMs availability set 
description: Learn how to change the availability set for your virtual machine using Azure PowerShell.
ms.service: virtual-machines
author: cynthn
ms.topic: article
ms.date: 01/31/2020
ms.author: cynthn
#pmcontact: 
---
# Change the availability set for a VM
The following steps describe how to change the availability set of a VM using Azure PowerShell. A VM can only be added to an availability set when it is created. To change the availability set, you need to delete and then recreate the virtual machine. 

This article applies to both Linux and Windows VMs.

This article was last tested on 2/12/2019 using the [Azure Cloud Shell](https://shell.azure.com/powershell) and the [Az PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps) version 1.2.0.


## Change the availability set 

The following script provides an example of gathering the required information, deleting the original VM and then recreating it in a new availability set.

```powershell
# Set variables
    $resourceGroup = "myResourceGroup"
    $vmName = "myVM"
    $newAvailSetName = "myAvailabilitySet"

# Get the details of the VM to be moved to the Availability Set
    $originalVM = Get-AzVM `
	   -ResourceGroupName $resourceGroup `
	   -Name $vmName

# Create new availability set if it does not exist
    $availSet = Get-AzAvailabilitySet `
	   -ResourceGroupName $resourceGroup `
	   -Name $newAvailSetName `
	   -ErrorAction Ignore
    if (-Not $availSet) {
    $availSet = New-AzAvailabilitySet `
	   -Location $originalVM.Location `
	   -Name $newAvailSetName `
	   -ResourceGroupName $resourceGroup `
	   -PlatformFaultDomainCount 2 `
	   -PlatformUpdateDomainCount 2 `
	   -Sku Aligned
    }
    
# Remove the original VM
    Remove-AzVM -ResourceGroupName $resourceGroup -Name $vmName    

# Create the basic configuration for the replacement VM. 
    $newVM = New-AzVMConfig `
	   -VMName $originalVM.Name `
	   -VMSize $originalVM.HardwareProfile.VmSize `
	   -AvailabilitySetId $availSet.Id
 
# For a Linux VM, change the last parameter from -Windows to -Linux 
    Set-AzVMOSDisk `
	   -VM $newVM -CreateOption Attach `
	   -ManagedDiskId $originalVM.StorageProfile.OsDisk.ManagedDisk.Id `
	   -Name $originalVM.StorageProfile.OsDisk.Name `
	   -Windows

# Add Data Disks
    foreach ($disk in $originalVM.StorageProfile.DataDisks) { 
    Add-AzVMDataDisk -VM $newVM `
	   -Name $disk.Name `
	   -ManagedDiskId $disk.ManagedDisk.Id `
	   -Caching $disk.Caching `
	   -Lun $disk.Lun `
	   -DiskSizeInGB $disk.DiskSizeGB `
	   -CreateOption Attach
    }
    
# Add NIC(s) and keep the same NIC as primary
	foreach ($nic in $originalVM.NetworkProfile.NetworkInterfaces) {	
	if ($nic.Primary -eq "True")
		{
    		Add-AzVMNetworkInterface `
       		-VM $newVM `
       		-Id $nic.Id -Primary
       		}
       	else
       		{
       		  Add-AzVMNetworkInterface `
      		  -VM $newVM `
      	 	  -Id $nic.Id 
                }
  	}

# Recreate the VM
    New-AzVM `
	   -ResourceGroupName $resourceGroup `
	   -Location $originalVM.Location `
	   -VM $newVM `
	   -DisableBginfoExtension
```

## Next steps

Add additional storage to your VM by adding an additional [data disk](attach-managed-disk-portal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

