<properties
	pageTitle="Create VM from a specialized VHD | Microsoft Azure"
	description="Learn how to create a virtual machine by attaching specialized specialized VHD running Windows, in the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/21/2016"
	ms.author="cynthn"/>

# Create a VM from a specialized VHD

A specialized VHD maintains the user accounts, applications and other state data from your original VM. If you intend to use the VHD as-is to create a new VM, you need to attach the VHD as an OS disk. 

## Create a VM from a specialized VHD using a quick start template

The quickest way to create a VM from a specialized VHD is to use a [quick start template](https://azure.microsoft.com
/documentation/templates/201-vm-from-specialized-vhd/). 

To use this quick start template, you need to provice the following information:
- osDiskVhdUriUri - Uri of the VHD. This is in the format: `https://<storageAccountName>.blob.core.windows.net/<containerName>/<vhdName>.vhd`.
- osType - the operating system type, either Windows or Linux 
- vmSize - [Size of the VM](virtual-machines-windows-sizes.md) 
- vmName - the name you want to use for the new VM 



## Create the VM and attach the VHD using PowerShell

The following PowerShell script shows how to set up the virtual machine configurations and attach the uploaded VHD as the OS disk for the new VM.


```powershell
	# Create variables
	# Enter a new user name and password to use as the local administrator account for the remotely accessing the VM
	$cred = Get-Credential
	
	# Name of the storage account where the VHD file is and where the OS disk will be created
	$storageAccName = "<storageAccountName>"
	
	# Name of the virtual machine
	$vmName = "<vmName>"
	
	# Size of the virtual machine. 
    # Use "Get-Help New-AzureRmVMConfig" to know the available options for -VMsize
	$vmSize = "<vmSize>"
	
	# Computer name for the VM
	$computerName = "<computerName>"
	
	# Name of the disk that holds the OS
	$osDiskName = "<osDiskName>"

	# Get the storage account where the uploaded image is stored
	$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName $storageAccName

	# Set the VM name and size
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize $vmSize

	# Set the Windows operating system configuration and add the NIC
	$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate

	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id

	# Set the OS disk URI, this is the full URI for the VHD that you uploaded to the storage account
	$osDiskUri = "https://<storageaccountname>.blob.core.windows.net/<container>/<vhd-name>.vhd"

	# Configure the OS disk to be created using the specified OS disk (-CreateOption attach), and give the URL of the uploaded image VHD for the -SourceImageUri parameter
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption "Attach" -Windows

	# Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
	
```

## View the newly created VM

When complete, you should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands:

```powershell
	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name
```

## Next step

- Connect to the virtual machine.



