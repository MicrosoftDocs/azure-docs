<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of your Azure virtual machine running Windows, in the Resource Manager deployment model, by creating a *specialized image*."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="dkshir"/>

# How to create a copy of a Windows virtual machine in the Resource Manager deployment model


This article shows you how to create a copy of your Azure virtual machine (VM) running Windows, in the Resource Manager deployment model using the Azure PowerShell and the Azure Portal. It shows you how to create a **_specialized_** image of your Azure VM, which maintains the user accounts and other state data from your original VM. A specialized image is useful for scenarios like porting your Windows VM from classic deployment model to the Resource Manager deployment model, or creating a backup copy of your Windows VM created in the Resource Manager deployment model. You can copy over the OS and data disks this way and then set up the network resources to create the new virtual machine. 

If you need to create mass deployments of similar Windows VMs, you need a *generalized* image; for that, read [How to capture a Windows virtual machine](virtual-machines-windows-capture-image.md). 



## Check these before you begin

This article assumes the following prerequisites are met before you start the steps:

1. You have an Azure virtual machine running Windows, created using either the classic or the Resource Manager deployment model. You have configured the operating system, attached data disks as well as made other customizations like installing required applications. We will use this VM to create the copy; if you need help in creating the source VM, read [How to create a Windows VM with Resource Manager](virtual-machines-windows-ps-create.md). 

1. You have the Azure PowerShell installed on your machine, and you are logged in to your Azure subscription. For more information, read [How to install and configure PowerShell](../powershell-install-configure.md).

1. You have downloaded and installed AzCopy tool. For more information about this tool, read [Transfer data with AzCopy commandline tool](../storage/storage-use-azcopy.md).

1. You have a resource group, and a storage account as well as a blob container created in that resource group to copy the VHDs to. Read the section [Create or find an Azure storage account](virtual-machines-windows-upload-image.md#createstorage) for steps to use an existing storage account or create a new one.



> [AZURE.NOTE] Similar steps apply for a VM created using either of the two deployment models as the source image. We will note the minor differences where applicable.


## Copy VHDs to your Resource Manager storage account


1. First free up the VHDs used by the source VM, by doing either of the following two options:

	- If you want to **_copy_** your source virtual machine, then **stop** and **deallocate** it.
	
		- For a VM created using classic deployment model, you can either use the [portal](https://portal.azure.com), and click **Browse** > **Virtual machines (classic)** > *your VM* > **Stop**, or the PowerShell command `Stop-AzureVM -ServiceName <yourServiceName> -Name <yourVmName>`. 
		
		- For a VM in Resource Manager deployment model, you can login to the portal and click **Browse** > **Virtual machines** > *your VM* > **Stop**, or use PowerShell command `Stop-AzureRmVM -ResourceGroupName <yourResourceGroup> -Name <yourVmName>`. Notice that the *Status* of the VM in the portal changes from **Running** to **Stopped (deallocated)**.

	
	- Or, if you want to **_migrate_** your source virtual machine, then **delete** that VM and use the VHD left behind. **Browse** to your virtual machine in the [portal](https://portal.azure.com) and click **Delete**.
	
1. Find the access keys for the storage account which contains your source VHD, as well as the storage account where you will copy your VHD to create the new VM. The key for the account from where we are copying the VHD is called the *Source Key* and that for the account to which it will be copied to is called the *Destination Key*. Read [About Azure storage accounts](../storage/storage-create-storage-account.md) for more information on access keys.

	- If your source VM was created using the classic deployment model, click **Browse** > **Storage accounts (classic)** > *your storage account* > **All Settings** > **Keys** and copy the key labelled as **PRIMARY ACCESS KEY**. 
	
	- For a VM created using the Resource Manager deployment model or for the storage account that you will use for your new VM, click **Browse** > **Storage accounts** > *your storage account* > **All Settings** > **Access keys** and copy the key labelled as **key1**. 

1. Get the URLs to access your source and destination storage accounts. In the portal, **Browse** to your storage account and click on **Blobs**. Then click the container that hosts your source VHD (e.g. *vhds* for classic deployment model) or the container that you want the VHD to be copied to. Click **Properties** for the container and copy the text labelled **URL**. We will need the URLs of both the source and destination containers. The URLs will look similar to `https://myaccount.blob.core.windows.net/mycontainer`.

1. On your local computer, open a command window and navigate to the folder where AzCopy is installed. It would be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. From there, run the following command:
</br>

		AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying>
</br>

>[AZURE.NOTE] You will need to copy the OS and data disks separately by using AzCopy as described above. 


## Create a VM using the copied VHD

These steps show you how to use Azure PowerShell to create a Resource Manager-based Windows VM in a new virtual network using the VHD copied in the above steps. The VHD should be present in the same storage account as the new virtual machine that will be created.


First set up a virtual network and NIC for your new VM similar to following script. Use values for the variables (represented by the **$** sign) as appropriate to your application.

	$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

	$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix $vnetSubnetAddressPrefix

	$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix $vnetAddressPrefix -Subnet $subnetconfig

	$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id


Now set up the VM configurations and use the copied VHDs to create a new virtual machine as shown below.
</br>

	#Set the VM name and size
	$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A2"

	#Add the NIC
	$vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id

	#Add the OS disk using the URL of the copied OS VHD
	$osDiskName = $vmName + "osDisk"
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption attach -Windows
	
	#Add data disks using the URLs of the copied data VHDs at the appropriate Logical Unit Number (Lun)
	$dataDiskName = $vmName + "dataDisk"
	$vm = Add-AzureRmVMDataDisk -VM $vm -Name $dataDiskName -VhdUri $dataDiskUri -Lun 0 -CreateOption attach
	
The data and OS disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this out on the portal by browsing to the target storage container, clicking the OS or data VHD that was copied, and then copying the contents of the **URL**.
	
	#Create the new VM
	New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm
	
If this command was successful, you will see an output like this:

	RequestId IsSuccessStatusCode StatusCode ReasonPhrase
	--------- ------------------- ---------- ------------
	                         True         OK OK


You should see the newly created VM in either the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, OR by using the following PowerShell commands:

	$vmList = Get-AzureRmVM -ResourceGroupName $rgName
	$vmList.Name

To sign in to your new virtual machine, **Browse** to the VM in the [portal](https://portal.azure.com), click **Connect** and open the *Remote Desktop* RDP file. Use the account credentials of your original virtual machine to login to your new virtual machine. 


## Next steps

To manage your new virtual machine with Azure PowerShell, see [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
