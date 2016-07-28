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
	ms.date="07/28/2016"
	ms.author="cynthn"/>

# Create a copy of a Linux virtual machine running on Azure


This article shows you how to create a copy of your Azure virtual machine (VM) running Linux using the Resource Manager deployment model. First you copy over the operating system and data disks to a new container, then set up the network resources and create the new virtual machine.

You can also [upload and create a VM from custom disk image](virtual-machines-linux-upload-vhd.md).


## Before you begin

Ensure that you meet the following prerequisites before you start the steps:

- You have the [Azure CLI] (../xplat-cli-install.md) downloaded and installed on your machine. 

- You also need some information about your existing Azure Linux VM:

| Source VM information | Where to get it |
|------------|-----------------|
| VM name | 'azure vm list' |
| Resource Group name | 'azure vm list' |
| Location | 'azure vm list' |
| Storage Account name | azure storage account list -g <resourceGroup> |
| Container name | azure storage container list -a <sourcestorageaccountname> ||
| Source VM VHD file name | azure storage blob list --container <containerName> |



- You will need to make some choices about your new VM: 
     <br> -Container name
     <br> -VM name 
     <br> -VM size 
     <br> -vNet name 
     <br> -SubNet name 
     <br> -IP Name 
     <br> -NIC name
	

## Login and set your subscription

1. Login to the CLI.
		
		azure login

2. Make sure you are in Resource Manager mode.
	
		azure config mode arm

3. Set the correct subscription. You can use 'azure account list' to see all of your subscriptions.

		azure account set <SubscriptionId>



## Stop the VM 

Stop and deallocate the source VM. You can use 'azure vm list' to get a list of all of the VMs in your subscription and their resource group names.
	
		azure vm stop <ResourceGroup> <VmName>
		azure vm deallocate <ResourceGroup> <VmName>




## Copy the VHD


You can copy the VHD from the source storage to the destination using the `azure storage blob copy start`. In this example, we are going to copy the VHD to the same storage account, but a different container.

To copy the VHD to another container in the same storage account, type:

		azure storage blob copy start https://<sourceStorageAccountName>.blob.core.windows.net:8080/<sourceContainerName>/<SourceVHDFileName.vhd> <newcontainerName>
		

## Set up the virtual network for your new VM

Set up a virtual network and NIC for your new VM. 

	azure network vnet create <ResourceGroupName> <VnetName> -l <Location>

	azure network vnet subnet create -a <address.prefix.in.CIDR/format> <ResourceGroupName> <VnetName> <SubnetName>

	azure network public-ip create <ResourceGroupName> <IpName> -l <yourLocation>

	azure network nic create <ResourceGroupName> <NicName> -k <SubnetName> -m <VnetName> -p <IpName> -l <Location>


## Create the new VM 

You can now create a VM from your uploaded virtual disk [using a resource manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd) or through the CLI by specifying the URI to your copied disk by typing:

```bash
azure vm create -n <newVMName> -l "<location>" -g <resourceGroup> -f <newNicName> -z "<vmSize>" -d https://<storageAccountName>.blob.core.windows.net/<containerName/<fileName.vhd> -y Linux
```



## Next steps

To learn how to use Azure CLI to manage your new virtual machine, see [Azure CLI commands for the Azure Resource Manager](azure-cli-arm-commands.md).
