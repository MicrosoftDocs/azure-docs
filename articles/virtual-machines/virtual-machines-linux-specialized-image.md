<properties
	pageTitle="Create a copy of your Linux VM | Microsoft Azure"
	description="Learn how to create an exact copy of your Azure virtual machine running Linux, in the Resource Manager deployment model."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="dkshir"/>

# How to create a copy of a Linux virtual machine in the Resource Manager deployment model



This article shows you how to create a copy of your Azure virtual machine (VM) running Linux, in the Resource Manager deployment model using Azure CLI and the Azure Portal. This process allows you to copy over the user accounts and other personal information from your original VM. This is called a **_specialized_** image. You can copy over the OS and data disks this way and then set up the network resources to create the new virtual machine. 

You will need a specialized image for scenarios like porting your Linux VM from classic deployment model to the Resource Manager deployment model, or creating a backup copy of your Linux VM created in the Resource Manager deployment model. If you need to create mass deployments of similar Linux VMs, you need a *generalized* image; for that, read [How to capture a Linux virtual machine](virtual-machines-linux-capture-image.md).



## Check these before you begin

This article assumes the following prerequisites are met before you start the steps:

1. You have an Azure virtual machine running Linux, created using either the classic or the Resource Manager deployment model. You have configured the operating system, attached data disks as well as made other customizations like installing required applications. We will use this VM to create the copy; if you need help in creating the source VM, read [Create a Linux VM in Azure](virtual-machines-linux-quick-create-cli.md). 

1. You have the Azure CLI downloaded and installed on your machine, and you have logged in to your Azure subscription. For more information, read [How to install Azure CLI](../xplat-cli-install.md).

1. You have downloaded and installed AzCopy tool. For more information about this tool, read [Transfer data with AzCopy commandline tool](../storage/storage-use-azcopy.md).

1. You have a resource group, and a storage account as well as a blob container created in that resource group to copy the VHDs to. Read the section [Create or find an Azure storage account](virtual-machines-windows-upload-image.md#createstorage) for steps to use an existing storage account or create a new one. 


> [AZURE.NOTE] Similar steps apply for a VM created using either of the two deployment models as the source image. We will note the the minor differences where applicable.  


## Copy VHDs to your Resource Manager storage account


1. First free up the VHDs used by the source VM. To do that you can do either of the following:

	- Stop and deallocate the source virtual machine. In portal, click **Browse** > **Virtual machines** or **Virtual machines (classic)** > *your VM* > **Stop**. For VMs created in the Resource Manager deployment model, you can also use the Azure CLI command `azure vm stop <yourResourceGroup> <yourVmName>` followed by `azure vm deallocate <yourResourceGroup> <yourVmName>`. Notice that the *Status* of the VM in the portal changes from **Running** to **Stopped (deallocated)**.	
	
	OR
</br>	
	- Delete the source VM and use the VHD left behind. **Browse** to your virtual machine in the [portal](https://portal.azure.com) and click **Delete**.
	
1. Find the access keys for the storage account which contains your source VHD, as well as the storage account where you will copy your VHD to create the new VM. The key for the account from where we are copying the VHD is called the *Source Key* and that for the account to which it will be copied to, is called the *Destination Key*. Read [About Azure storage accounts](../storage/storage-create-storage-account.md) for more information on access keys.

	- If your source VM was created using the classic deployment model, click **Browse** > **Storage accounts (classic)** > *your storage account* > **All Settings** > **Keys** and copy the key labelled as **PRIMARY ACCESS KEY**. 

	- For a VM created using the Resource Manager deployment model or for the storage account that you will use for your new VM, click **Browse** > **Storage accounts** > *your storage account* > **All Settings** > **Access keys** and copy the text labelled as **key1**. 

1. Get the URLs to access your source and destination storage accounts. In the portal, **Browse** to your storage account and click on **Blobs**. Then click the container that hosts your source VHD (e.g. *vhds* for classic deployment model) or the container that you want the VHD to be copied to. Click **Properties** for the container and copy the text labelled **URL**. We will need the URLs of both the source and destination containers. The URLs will look similar to `https://myaccount.blob.core.windows.net/mycontainer`.

1. On your local computer, open a command window and navigate to the folder where AzCopy is installed. It would be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. From there, run the following command:
</br>

		AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying>
</br>


>[AZURE.NOTE] You will need to copy the OS and data disks separately by using AzCopy as described above. 


## Create a VM using the copied VHD

These steps show you how to use Azure CLI to create a Resource Manager based Linux VM in a new virtual network using the VHD copied in the above steps. The VHD should be present in the same storage account as the new virtual machine that will be created.


First set up a virtual network and NIC for your new VM similar to following script. Use values for the variables as appropriate to your application.

	$azure network vnet create <yourResourceGroup> <yourVnetName> -l <yourLocation>

	$azure network vnet subnet create <yourResourceGroup> <yourVnetName> <yourSubnetName>

	$azure network public-ip create <yourResourceGroup> <yourIpName> -l <yourLocation>

	$azure network nic create <yourResourceGroup> <yourNicName> -k <yourSubnetName> -m <yourVnetName> -p <yourIpName> -l <yourLocation>


Now create the new virtual machine using the copied VHD(s) by using the following command.
</br>

	$azure vm create -g <yourResourceGroup> -n <yourVmName> -f <yourNicName> -d <UriOfYourOsDisk> -x <UriOfYourDataDisk> -e <DataDiskSizeGB> -Y -l <yourLocation> -y Linux -z "Standard_A1" -o <DestinationStorageAccountName> -R <DestinationStorageAccountBlobContainer>

	
The data and OS disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this out on the portal by browsing to the storage container, clicking the OS or data VHD that was copied, and then copying the contents of the **URL**.
	
	
If this command was successful, you will see an output similar to this:

	$azure vm create -g "testcopyRG" -n "redhatcopy" -f "LinCopyNic" -d https://testcopystore.blob.core.windows.net/testcopyblob/RedHat201631816334.vhd -x https://testcopystore.blob.core.windows.net/testcopyblob/RedHat-data.vhd -e 10 -Y -l "West US" -y Linux -z "Standard_A1" -o "testcopystore" -R "testcopyblob"
	info:    Executing command vm create
	+ Looking up the VM "redhatcopy"
	info:    Using the VM Size "Standard_A1"
	+ Looking up the NIC "LinCopyNic"
	info:    Found an existing NIC "LinCopyNic"
	info:    Found an IP configuration with virtual network subnet id "/subscriptions/b8e6a92b-d6b7-4dbb-87a8-3c8dfe248156/resourceGroups/testcopyRG/providers/Microsoft.Network/virtualNetworks/LinCopyVnet/subnets/LinCopySub" in the NIC "LinCopyNic"
	info:    This NIC IP configuration has a public ip already configured "/subscriptions/b8e6a92b-d6b7-4dbb-87a8-3c8dfe248156/resourcegroups/testcopyrg/providers/microsoft.network/publicipaddresses/lincopyip", any public ip parameters if provided, will be ignored.
	+ Looking up the storage account testcopystore
	info:    The storage URI 'https://testcopystore.blob.core.windows.net/' will be used for boot diagnostics settings, and it can be overwritten by the parameter input of '--boot-diagnostics-storage-uri'.
	+ Creating VM "redhatcopy"
	info:    vm create command OK

You should see the newly created VM in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**.

Connect to your new virtual machine using an SSH client of your choice, and use the account credentials of your original virtual machine, e.g., `ssh OldAdminUser@<IPaddressOfYourNewVM>`. To read more about SSH to your Linux VM, read [How to use SSH with Linux on Azure](virtual-machines-linux-ssh-from-linux.md).


## Next steps

To learn how to use Azure CLI to manage your new virtual machine, see [Azure CLI commands for the Azure Resource Manager](azure-cli-arm-commands.md).
