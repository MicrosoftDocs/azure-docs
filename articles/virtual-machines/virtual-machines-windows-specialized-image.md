<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of VHD for your specialized Azure VM running Windows, in the Resource Manager deployment model."
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
	ms.date="09/13/2016"
	ms.author="cynthn"/>

# Create a copy of a specialized Windows Azure VM VHD in the Azure Resource Manager deployment model

This article shows you how to use the AZCopy tool to create a copy of your **specialized** Azure virtual machine (VM) running Windows. A **specialized** VM maintains the user accounts and other state data from your original VM. 

If you need to create mass deployments of similar Windows VMs, you should use an image that has been **generalized** using Sysprep. To create generalized image, see [How to capture a Windows virtual machine](virtual-machines-windows-capture-image.md).


## Before you begin

Make sure that you:

- Have information about the **source and destination storage accounts**. For the source VM, you need to storage account and container names. Usually, the container name will be **vhds**. You also need to have a destination storage account. If you don't already have one, you can create one using either the portal (**More Services** > Storage accounts > Add or using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet. 

- Have Azure [PowerShell 1.0](../powershell-install-configure.md) (or later) installed.

- Have downloaded and installed the [AzCopy tool](../storage/storage-use-azcopy.md). 

## Deallocate the VM

Deallocate the VM, which frees up the VHD to be copied.

- **Portal**: Click **Virtual machines** > <vmName> > Stop
- **Powershell**: `Stop-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName>`

The **Status** for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.

## Download the source VM template

1. Log in to the [Azure portal](https://portal.azure.com/).
2. One the hub menu, select **Virtual Machines**.
3. Select the original virtual machine in the list.
5. In select **Automation script**.
6. Select **Download** and save the .zip file to your local computer.
7. Open the .zip file and extract the files to a folder. The .zip file should contain:
	
	- deploy.ps1
	- deploy.sh 
	- deployer.rb
	- DeploymentHelper.cs
	- parameters.json
	- template.json

You can also download the template using [Azure PowerShell](https://msdn.microsoft.com/library/mt715427.aspx):

```powershell
	Export-AzureRmResourceGroup -ResourceGroupName "<resourceGroupName"
```

## Get the storage account URLs

You need the URLs of the source and destination storage accounts. The URLs look like: https://<storageaccount>.blob.core.windows.net/<containerName>. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

You can use the Azure portal or Azure Powershell to get the URL:

- **Portal**: Click **More services** > **Storage accounts** > <storage account> **Blobs** and your source VHD file is probably in the **vhds** container. Click **Properties** for the container, and copy the text labeled **URL**. You'll need the URLs of both the source and destination containers. 

- **Powershell**: `Get-AzureRmVM -ResourceGroupName "resource_group_name" -Name "vm_name"`. In the results, look in the **Storage profile** section for the **Vhd Uri**. The first part of the Uri is the URL to the container and the last part is the OS VHD name for the VM.

## Get the storage access keys

Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

- **Portal**: Click **More services** > **Storage accounts** > <storage account> **All Settings** > **Access keys**. Copy the key labeled as **key1**.
- **Powershell**: `Get-AzureRmStorageAccountKey -Name <storageAccount> -ResourceGroupName <resourceGroupName>`. Copy the key labeled as **key1**.


## Copy the VHD 

You can copy files between storage accounts using AzCopy. For the destination container, if the specified container doesn't exist, it will be created for you. 

To use AzCopy, open a command prompt on your local machine and navigate to the folder where AzCopy is installed. It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. 

To copy all of the files within a container, you use the **/S** switch. This can be used to copy the VMs OS VHD and all of the data disks if they are in the same container.

```
	AzCopy /Source:https://<sourceStorageAccountName>.blob.core.windows.net/<sourceContainerName> /Dest:https://<destinationStorageAccount>.blob.core.windows.net/<destinationContainerName> /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> /S
```

If you only want to copy a specific VHD in a container with multiple files, you can also specify the file name using the /Pattern switch.

```
 	AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying.vhd>
```

	
## Get the URI of the copied VHD file




## Troubleshooting

- When you use AZCopy, if you see the error "Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature." and you are using Key 2 or the secondary storage key, try using the primary or 1st storage key.


## Next steps

- Attach the VHD to a new VM.
