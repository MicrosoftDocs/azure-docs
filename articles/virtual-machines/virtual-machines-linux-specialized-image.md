<properties
	pageTitle="Create a copy of your Linux VM | Microsoft Azure"
	description="Learn how to create a copy of your Azure virtual machine running Linux, in the Resource Manager deployment model, by creating a *specialized image*."
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



This article shows you how to create a copy of your Azure virtual machine (VM) running Linux, in the Resource Manager deployment model using the Azure CLI and the Azure Portal. It shows you how to create a **_specialized_** image of your Azure VM, which maintains the user accounts and other state data from your original VM. A specialized image is useful for scenarios like porting your Linux VM from classic deployment model to the Resource Manager deployment model, or creating a backup copy of your Linux VM created in the Resource Manager deployment model. You can copy over the OS and data disks this way and then set up the network resources to create the new virtual machine. 

If you need to create mass deployments of similar Linux VMs, you need a *generalized* image; for that, read [How to capture a Linux virtual machine](virtual-machines-linux-capture-image.md).



## Check these before you begin

This article assumes you have:

1. An **Azure virtual machine running Linux**, in the classic or the Resource Manager deployment model, with the operating system configured, data disks attached, and your required applications installed. If you need help in creating this VM, read [Create a Linux VM in Azure](virtual-machines-linux-quick-create-cli.md). 

1. The **Azure CLI** installed on your machine, and logged in to your Azure subscription. For more information, read [How to install Azure CLI](../xplat-cli-install.md).

1. A **resource group** with a **storage account** and a **blob container** created in it to copy the VHDs to. Read [Using the Azure CLI with Azure Storage](../storage/storage-azure-cli.md) for more information.



> [AZURE.NOTE] Similar steps apply for a VM created using either of the two deployment models as the source image. We will note the the minor differences where applicable.  


## Copy VHDs to your Resource Manager storage account


1. First free up the VHDs used by the source VM, by doing either of the following two options:

	- If you want to **_copy_** your source virtual machine, **stop** and **deallocate** it. In portal, click **Browse** > **Virtual machines** or **Virtual machines (classic)** > *your VM* > **Stop**. For VMs created in the Resource Manager deployment model, you can also use the Azure CLI command `azure vm stop <yourResourceGroup> <yourVmName>` followed by `azure vm deallocate <yourResourceGroup> <yourVmName>`. Notice that the *Status* of the VM in the portal changes from **Running** to **Stopped (deallocated)**.
	
	- Or, if you want to **_migrate_** your source virtual machine, then **delete** that VM and use the VHD left behind. **Browse** to your virtual machine in the [portal](https://portal.azure.com) and click **Delete**. 
	
1. Find the access key for the storage account which contains your source VHD. Read [About Azure storage accounts](../storage/storage-create-storage-account.md) for more information on access keys.

	- If your source VM was created using the classic deployment model, click **Browse** > **Storage accounts (classic)** > *your storage account* > **All Settings** > **Keys** and copy the key labelled as **PRIMARY ACCESS KEY**. Or in Azure CLI, change to classic mode by using `azure config mode asm` and then use `azure storage account keys list <yourSourceStorageAccountName>`.

	- For a VM created using the Resource Manager deployment model, click **Browse** > **Storage accounts** > *your storage account* > **All Settings** > **Access keys** and copy the text labelled as **key1**. Or in Azure CLI, make sure you are in Resource Manager mode by using `azure config mode arm` and then use `azure storage account keys list -g <yourDestinationResourceGroup> <yourDestinationStorageAccount>`.

1. Copy the VHD files using the [Azure CLI commands for Storage](../storage/storage-azure-cli.md), as described in the following steps. Alternatively, if you prefer a UI approach to achieve the same results, you can use the [Microsoft Azure Storage Explorer](http://storageexplorer.com/ ) instead.
</br>
	1. Set up the connection string for the destination storage account. This connection string will contain the access key for this storage account.
	
			$azure storage account connectionstring show -g <yourDestinationResourceGroup> <yourDestinationStorageAccount>
			$export AZURE_STORAGE_CONNECTION_STRING=<the_connectionstring_output_from_above_command>
	
	2. Create a [Shared Access Signature](../storage/storage-dotnet-shared-access-signature-part-1.md) for the VHD file in the source storage account. Note down the **Shared Access URL** output of the following command.
	
			$azure storage blob sas create  --account-name <yourSourceStorageAccountName> --account-key <SourceStorageAccessKey> --container <SourceStorageContainerName> --blob <FileNameOfTheVHDtoCopy> --permissions "r" --expiry <mm/dd/yyyy_when_you_want_theSAS_to_expire>
	
	3. Copy the VHD from source storage to destination by using the following command.
	
			$azure storage blob copy start <SharedAccessURL_ofTheSourceVHD> <DestinationContainerName>
	
	4. The VHD file will be copied asynchronously. You can check the progress by using the following command.
	
			$azure storage blob copy show <DestinationContainerName> <FileNameOfTheVHDtoCopy>
		
</br>

>[AZURE.NOTE] You will need to copy the OS and data disks separately as described above. 


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
