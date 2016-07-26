<properties
	pageTitle="Create a copy of your Azure Linux VM | Microsoft Azure"
	description="Learn how to create a copy of your Azure Linux virtual machine in the Resource Manager deployment model"
	services="virtual-machines-linux"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="cynthn"/>

# Create a copy of a Linux virtual machine running on Azure


This article shows you how to create a copy of your Azure virtual machine (VM) running Linux using the Resource Manager deployment model. First you copy over the operating system and data disks to a new resource group, then set up the network resources and create the new virtual machine.

If you need to create mass deployments of similar Linux VMs, you should use a *generalized* image. For that, see [How to capture a Linux virtual machine](virtual-machines-linux-capture-image.md).



## Before you begin

Ensure that you meet the following prerequisites before you start the steps:

- You have an Azure virtual machine running Linux, which you created by using either the classic or the Resource Manager deployment model. You have configured the operating system, attached data disks, and made other customizations like installing required applications. You'll use this VM to create the copy. If you need help creating the source VM, see [Create a Linux VM in Azure](virtual-machines-linux-quick-create-cli.md).

- You have the Azure CLI downloaded and installed on your machine, and you have signed in to your Azure subscription. For more information, see [How to install Azure CLI](../xplat-cli-install.md).

- You have a resource group, a storage account, and a blob container created in that resource group to hold the new VM. For more information about creating storage accounts and blob containers, see [Using the Azure CLI with Azure Storage](../storage/storage-azure-cli.md).

> [AZURE.NOTE] Similar steps apply for a VM created by using either of the two deployment models as the source image. Where applicable, this article notes the minor differences.  

## Login and set your subscription

1. Login to the CLI.
		azure login

2. Make sure you are in Resource Manager mode.
	
		azure config mode arm

3. Set the correct subscription. You can use 'azure account list' to see all of your subscriptions.

		azure account set <SubscriptionId>

## Create a storage account and a container for the new VM

First, create a resource group:

```bash
azure group create TestRG --location "WestUS"
```

Create a storage account to hold your virtual disks:

```bash
azure storage account create testuploadedstorage --resource-group TestRG \
	--location "WestUS" --kind Storage --sku-name LRS
```

List the storage keys for the storage account you just created and make a note of `key1`:

```bash
azure storage account keys list testuploadedstorage --resource-group TestRG
```

The output will be similar to:

```
info:    Executing command storage account keys list
+ Getting storage account keys
data:    Name  Key                                                                                       Permissions
data:    ----  ----------------------------------------------------------------------------------------  -----------
data:    key1  d4XAvZzlGAgWdvhlWfkZ9q4k9bYZkXkuPCJ15NTsQOeDeowCDAdB80r9zA/tUINApdSGQ94H9zkszYyxpe8erw==  Full
data:    key2  Ww0T7g4UyYLaBnLYcxIOTVziGAAHvU+wpwuPvK4ZG0CDFwu/mAxS/YYvAQGHocq1w7/3HcalbnfxtFdqoXOw8g==  Full
info:    storage account keys list command OK
```

Create a container within your storage account using the storage key you just obtained:

```bash
azure storage container create --account-name testuploadedstorage \
	--account-key <key1> --container vm-images
```

Finally, upload your VHD to the container you just created:

```bash
azure storage blob upload --blobtype page --account-name testuploadedstorage \
	--account-key <key1> --container vm-images /path/to/disk/yourdisk.vhd
```

## Stop the VM 



3. Stop and deallocate the source VM. To get the names and resource group of all of the VMs in your subscription, use 'azure vm list'.
	
		azure vm stop <ResourceGroup> <VmName>
		azure vm deallocate <ResourceGroup> <VmName>

		
		
		
## Get the access key for the source VM storage account

Copy the access key source VM storage account. For more information about access keys, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

- If your source VM was created by using the classic deployment model, change to classic mode by using 
		
		azure config mode asm
		azure storage account keys list <yourSourceStorageAccountName>

- If your source VM was created by using the Resource Manager deployment model, make sure you are in Resource Manager mode by using 
		
		azure config mode arm
		azure storage account keys list -g <yourSourceResourceGroup> <yourSourceStorageAccount>

## Copy the VHD files 





Get the source connection string: 
	azure storage account connectionstring show <source_storage_account>

Output: 	
	info:    Executing command storage account connectionstring show
	+ Getting storage account keys
	data:    connectionstring: DefaultEndpointsProtocol=https;AccountName=suseclassicrg5769;AccountKey=Bnt4W6oMza4fE8EYs976MhbJtM2j0qI8hgpw8mKs3ejDMCNb/5efaC/uBF6n3qDimKRe66l3AWY+KUxyfm5+fw==
	info:    storage account connectionstring show command OK


Set the connection string 

DefaultEndpointsProtocol=[http|https];AccountName=myAccountName;AccountKey=myAccountKey

AZURE_STORAGE_CONNECTION_STRING=<the_connectionstring_output_from_above_command>

>> AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=suseclassicrg5769;AccountKey=Bnt4W6oMza4fE8EYs976MhbJtM2j0qI8hgpw8mKs3ejDMCNb/5efaC/uBF6n3qDimKRe66l3AWY+KUxyfm5+fw==

Set the destination storage account parameter:

	set AZURE_STORAGE_CONNECTION_STRING=<connection_string>

Get the container name:
	azure storage container list -a <sourcestorageaccountname> 

	Most likely the container is named **vhds**

## Copy the VHD files using the [Azure CLI commands for Storage](../storage/storage-azure-cli.md).

Set up the connection string for the destination storage account. This connection string will contain the access key for destination storage account.

			azure config mode arm
			
			azure storage account connectionstring show -g <yourDestinationResourceGroup> <yourDestinationStorageAccount>
			
			>> azure storage account connectionstring show -g LinuxCopyRG copylinuxstorage
			
			set AZURE_STORAGE_CONNECTION_STRING=<connection_string>
				
			>>  set AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=copylinuxstorage;AccountKey=R4ApUh8uYpl17iFz1W6ONysYrpTPVkWw9Q/pl+JoyFRfDbd90NGkCN/ennERcAnnPzBBKLXGDVJg4bhhw5wgZg==
			
			
## Create a shared access signature for the source storage account

Create a [Shared Access Signature](../storage/storage-dotnet-shared-access-signature-part-1.md) for the VHD file in the source storage account. Make a note of the **Shared Access URL** output of the following command.

switch to asm: azure config mode asm
get the connection string: azure storage account connectionstring show <source_storage_account>
set the connection string: set AZURE_STORAGE_CONNECTION_STRING=<connection_string>
container: azure storage container list
blob\vhd file name: azure storage blob list --container <container_name>

			azure storage blob sas create  --account-name <yourSourceStorageAccountName> --account-key <SourceStorageAccessKey> --container <SourceStorageContainerName> --blob <FileNameOfTheVHDtoCopy> --permissions "r" --expiry <mm/dd/yyyy_when_you_want_theSAS_to_expire>
			
			>> azure storage blob sas create  --account-name suseclassicrg5769 --account-key Bnt4W6oMza4fE8EYs976MhbJtM2j0qI8hgpw8mKs3ejDMCNb/5efaC/uBF6n3qDimKRe66l3AWY+KUxyfm5+fw== --container vhds --blob SUSEClassic-os-5299.vhd  --permissions "r" --expiry 01/01/2020
			
			Output:
			>> https://suseclassicrg5769.blob.core.windows.net/vhds/SUSEClassic-os-5299.vhd?se=2020-01-01T08%3A00%3A00Z&sp=r&sv=2015-04-05&sr=b&sig=YDtLBReoAuLpMrBOGhGWdcOAUISNyZ6UvBlbrVqHn8k%3D

3. Copy the VHD from the source storage to the destination by using the following command.

			azure storage blob copy start <SharedAccessURL_ofTheSourceVHD> <DestinationContainerName>
			
			>> azure storage blob copy start https://suseclassicrg5769.blob.core.windows.net/vhds/SUSEClassic-os-5299.vhd?se=2020-01-01T08%3A00%3A00Z&sp=r&sv=2015-04-05&sr=b&sig=YDtLBReoAuLpMrBOGhGWdcOAUISNyZ6UvBlbrVqHn8k%3D copylinuxcontainer  << failed
			
			
			I suspect I need to be in arm mode and have a destination container URL or something more specific. Need to figure out what parameters the storage blob copy supports.
			
			================================================================================================================
			
			Getting the connection thing as the "dest" portion of the copy blob command:
			
			>> azure storage account connectionstring show copylinuxstorage
			
			asks for RG name. RG is -g. Trying this:
			
			>> azure storage account connectionstring show copylinuxstorage -g LinuxCopyRG
			
			That worked. So, the command for getting the RM connection string is:
			
			azure storage account connectionstring show <destStorageAccount> -g <destResourceGroup>
			
			>> My connection string: connectionstring: DefaultEndpointsProtocol=https;AccountName=copylinuxstorage;AccountKey=R4ApUh8uYpl17iFz1W6ONysYrpTPVkWw9Q/pl+JoyFRfDbd90NGkCN/ennERcAnnPzBBKLXGDVJg4bhhw5wgZg==
			
			
			Soooo.... this should be the RM way to copy from asm to arm
			
			azure storage blob copy start <SharedAccessURL_ofTheSourceVHD> --dest-connection-string <destConnectionString> 
			
			But it might need the container. Let's try first....
			
			>> azure storage blob copy start https://suseclassicrg5769.blob.core.windows.net/vhds/SUSEClassic-os-5299.vhd?se=2020-01-01T08%3A00%3A00Z&sp=r&sv=2015-04-05&sr=b&sig=YDtLBReoAuLpMrBOGhGWdcOAUISNyZ6UvBlbrVqHn8k%3D --dest-connection-string DefaultEndpointsProtocol=https;AccountName=copylinuxstorage;AccountKey=R4ApUh8uYpl17iFz1W6ONysYrpTPVkWw9Q/pl+JoyFRfDbd90NGkCN/ennERcAnnPzBBKLXGDVJg4bhhw5wgZg==
			
			Yep, needs --dest-container <destContainer>
			
			>> azure storage blob copy start https://suseclassicrg5769.blob.core.windows.net/vhds/SUSEClassic-os-5299.vhd?se=2020-01-01T08%3A00%3A00Z&sp=r&sv=2015-04-05&sr=b&sig=YDtLBReoAuLpMrBOGhGWdcOAUISNyZ6UvBlbrVqHn8k%3D --dest-container copylinuxcontainer --dest-connection-string DefaultEndpointsProtocol=https;AccountName=copylinuxstorage;AccountKey=R4ApUh8uYpl17iFz1W6ONysYrpTPVkWw9Q/pl+JoyFRfDbd90NGkCN/ennERcAnnPzBBKLXGDVJg4bhhw5wgZg== 
			
			
			

4. The VHD file is copied asynchronously. Check the progress by using the following command.

			$azure storage blob copy show <DestinationContainerName> <FileNameOfTheVHDtoCopy>

</br>

>[AZURE.NOTE] You should copy the operating system and data disks separately, as described earlier.


## Create a VM by using the copied VHD

By using the VHD copied in the preceding steps, you can now use Azure CLI to create a Resource Manager-based Linux VM in a new virtual network. The VHD should be present in the same storage account as the new virtual machine that will be created.


Set up a virtual network and NIC for your new VM, similar to following script. Use values for the variables as appropriate to your application.

	$azure network vnet create <yourResourceGroup> <yourVnetName> -l <yourLocation>

	$azure network vnet subnet create <yourResourceGroup> <yourVnetName> <yourSubnetName>

	$azure network public-ip create <yourResourceGroup> <yourIpName> -l <yourLocation>

	$azure network nic create <yourResourceGroup> <yourNicName> -k <yourSubnetName> -m <yourVnetName> -p <yourIpName> -l <yourLocation>


Create the new virtual machine by using the copied VHDs by using the following command.
</br>

	$azure vm create -g <yourResourceGroup> -n <yourVmName> -f <yourNicName> -d <UriOfYourOsDisk> -x <UriOfYourDataDisk> -e <DataDiskSizeGB> -Y -l <yourLocation> -y Linux -z "Standard_A1" -o <DestinationStorageAccountName> -R <DestinationStorageAccountBlobContainer>


The data and operating system disk URLs look something like this: `https://StorageAccountName.blob.core.windows.net/BlobContainerName/DiskName.vhd`. You can find this on the portal by browsing to the storage container, clicking the operating system or data VHD that was copied, and then copying the contents of the URL.


If this command was successful, you'll see output similar to this:

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

Connect to your new virtual machine by using an SSH client of your choice, and use the account credentials of your original virtual machine (for example, `ssh OldAdminUser@<IPaddressOfYourNewVM>`). For more information, see [How to use SSH with Linux on Azure](virtual-machines-linux-ssh-from-linux.md).


## Next steps

To learn how to use Azure CLI to manage your new virtual machine, see [Azure CLI commands for the Azure Resource Manager](azure-cli-arm-commands.md).
