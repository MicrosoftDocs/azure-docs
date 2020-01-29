---
title: Change a VMs availability set 
description: Learn how to change the availability set for your virtual machines using the Azure CLI.
author: cynthn
ms.service: virtual-machines-linux
ms.workload: infrastructure-services

ms.topic: article
ms.date: 01/29/2020
ms.author: cynthn
#pmcontact:
---
# Change the availability set for a Windows VM
The following steps describe how to change the availability set of a VM using theAzure CLI. A VM can only be added to an availability set when it is created. To change the availability set, you need to delete and then recreate the virtual machine. 

This article was last tested on 01/29/2020 using the [Azure Cloud Shell](https://shell.azure.com/bash) and the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.80.

 

## Change the availability set 

The following script provides an example of gathering the required information, deleting the original VM and then recreating it in a new availability set.

```azurecli-interactive
# Set variables

# Name of the resource group for the current availability set
    oldResourceGroup = "oldResourceGroup"
# Name of the resource group for the new availability set
    newResourceGroup = "myResourceGroup"
# Name of the VM to be moved
    vmName = "myVM"
# Location of the current availability set
    oldLocation = "West US"
# Location for the new availability set
    newLocation = "East US"
# Name of the current availability set
    oldAvailSetName = "oldAvailabilitySet"
# Name of the new availability set
    newAvailSetName = "myAvailabilitySet"

az group create --name $newResourceGroup --location $newLocation

az vm availability-set create \
    --resource-group $newResourceGroup \
    --name $newAvailSetName \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

# Remove the original VM
    Remove-AzVM -ResourceGroupName $resourceGroup -Name $vmName    

# Create the basic configuration for the replacement VM
    $newVM = New-AzVMConfig `
	   -VMName $originalVM.Name `
	   -VMSize $originalVM.HardwareProfile.VmSize `
	   -AvailabilitySetId $availSet.Id
  
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

