---
title: Tools for Azure Stack storage | Microsoft Docs
description: Learn about Azure Stack storage data transfer tools
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/10/2018
ms.author: mabrigg
ms.reviewer: xiaofmao


---
# Use data transfer tools for Azure Stack storage

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Microsoft Azure Stack provides a set of the storage services for disks, blobs, tables, queues, and account management functions. You can use a set of Azure storage tools if you want to manage or move data to or from Azure Stack storage. This article provides an  overview of the available tools.

Your requirements determine which of the following tools works best for you:

* [AzCopy](#azcopy)

    A storage-specific, command-line utility that you can download to copy data from one object to another object within your storage account, or between storage accounts.

* [Azure PowerShell](#azure-powershell)

    A task-based, command-line shell and scripting language designed especially for system administration.

* [Azure CLI](#azure-cli)

    An open-source, cross-platform tool that provides a set of commands for working with the Azure and Azure Stack platforms.

* [Microsoft storage explorer](#microsoft-azure-storage-explorer)

    An easy-to-use stand-alone app with a user interface.

* [Blobfuse ](#blobfuse)

    A virtual file system driver for Azure Blob Storage, which allows you to access your existing block blob data in your Storage account through the Linux file system. 

Due to the storage services differences between Azure and Azure Stack, there might be some specific requirements for each tool described in the following sections. For a comparison between Azure Stack storage and Azure storage, see [Azure Stack storage: Differences and considerations](azure-stack-acs-differences.md).

## AzCopy

AzCopy is a command-line utility designed to copy data to and from Microsoft Azure blob and table storage using simple commands with optimal performance. You can copy data from one object to another within your storage account, or between storage accounts.

### Download and install AzCopy

There are two versions of the AzCopy utility: AzCopy on Windows and AzCopy on Linux.

 - **AzCopy on Windows**
    - Download the supported version of AzCopy for Azure Stack. You can install and use AzCopy on Azure Stack the same way as Azure. To learn more, see [AzCopy on Windows](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy).
        - For the 1802 update, or newer versions, [download AzCopy 7.1.0](https://aka.ms/azcopyforazurestack20170417).
        - For previous versions, [download AzCopy 5.0.0](https://aka.ms/azcopyforazurestack20170417).

 - **AzCopy on Linux**

    - AzCopy on Linux supports Azure Stack 1802 update or newer versions. You can install and use AzCopy on Azure Stack the same way as Azure. To learn more, see [AzCopy on Linux](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux).

### AzCopy command examples for data transfer

The following examples follow typical scenarios for copying data to and from Azure Stack blobs. To learn more, see [AzCopy on Windows](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux) and [AzCopy on Linux](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux).

### Download all blobs to a local disk

**Windows**

````AzCopy
AzCopy.exe /source:https://myaccount.blob.local.azurestack.external/mycontainer /dest:C:\myfolder /sourcekey:<key> /S
````

**Linux**

````AzCopy
azcopy \
    --source https://myaccount.blob.local.azurestack.external/mycontainer \
    --destination /mnt/myfiles \
    --source-key <key> \
    --recursive
````

### Upload single file to virtual directory

**Windows**

```AzCopy
AzCopy /Source:C:\myfolder /Dest:https://myaccount.blob.local.azurestack.external/mycontainer/vd /DestKey:key /Pattern:abc.txt
```

**Linux**

````AzCopy
azcopy \
    --source /mnt/myfiles/abc.txt \
    --destination https://myaccount.blob.local.azurestack.external/mycontainer/vd/abc.txt \
    --dest-key <key>
````

### Move data between Azure and Azure Stack storage

Asynchronous data transfer between Azure storage and Azure Stack is not supported. You need to specify the transfer with the **/SyncCopy** or **--sync-copy** option.

**Windows**

````AzCopy
Azcopy /Source:https://myaccount.blob.local.azurestack.external/mycontainer /Dest:https://myaccount2.blob.core.windows.net/mycontainer2 /SourceKey:AzSKey /DestKey:Azurekey /S /SyncCopy
````

**Linux**

````AzCopy
azcopy \
    --source https://myaccount1.blob.local.azurestack.external/myContainer/ \
    --destination https://myaccount2.blob.core.windows.net/myContainer/ \
    --source-key <key1> \
    --dest-key <key2> \
    --include "abc.txt" \
    --sync-copy
````

### Azcopy known issues

 - Any AzCopy operation on a file store is not available because file storage is not yet available in Azure Stack.
 - Asynchronous data transfer between Azure storage and Azure Stack is not supported. You can specify the transfer with the **/SyncCopy** option to copy the data.
 - The Linux version of Azcopy only supports 1802 update or later versions. And it doesn’t support Table service.

## Azure PowerShell

Azure PowerShell is a module that provides cmdlets for managing services on both Azure and Azure Stack. It's a task-based, command-line shell and scripting language designed especially for system administration.

### Install and Configure PowerShell for Azure Stack

Azure Stack compatible Azure PowerShell modules are required to work with Azure Stack. For more information, see [Install PowerShell for Azure Stack](azure-stack-powershell-install.md) and [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md) to learn more.

### PowerShell Sample script for Azure Stack 

This sample assume you have successfully [Installed PowerShell for Azure Stack](azure-stack-powershell-install.md). This script will help you complete the configuration and ask your Azure Stack tenant credentials to add your account to the local PowerShell environment. Then, the script will set the default Azure subscription, create a new storage account in Azure, create a new container in this new storage account, and upload an existing image file (blob) to that container. After the script lists all blobs in that container, it will create a new destination directory on your local computer and download the image file.

1. Install [Azure Stack-compatible Azure PowerShell modules](azure-stack-powershell-install.md).
2. Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).
3. Open **Windows PowerShell ISE** and **Run as Administrator**, click **File** > **New** to create a new script file.
4. Copy the script below and paste to the new script file.
5. Update the script variables based on your configuration settings.
   > [!NOTE]
   > This script has to be run at the root directory for **AzureStack_Tools**.

```PowerShell  
# begin

$ARMEvnName = "AzureStackUser" # set AzureStackUser as your Azure Stack environment name
$ARMEndPoint = "https://management.local.azurestack.external" 
$GraphAudiance = "https://graph.windows.net/" 
$AADTenantName = "<myDirectoryTenantName>.onmicrosoft.com" 

$SubscriptionName = "basic" # Update with the name of your subscription.
$ResourceGroupName = "myTestRG" # Give a name to your new resource group.
$StorageAccountName = "azsblobcontainer" # Give a name to your new storage account. It must be lowercase.
$Location = "Local" # Choose "Local" as an example.
$ContainerName = "photo" # Give a name to your new container.
$ImageToUpload = "C:\temp\Hello.jpg" # Prepare an image file and a source directory in your local computer.
$DestinationFolder = "C:\temp\downlaod" # A destination directory in your local computer.

# Import the Connect PowerShell module"
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Import-Module .\Connect\AzureStack.Connect.psm1

# Configure the PowerShell environment
# Register an AzureRM environment that targets your Azure Stack instance
Add-AzureRmEnvironment -Name $ARMEvnName -ARMEndpoint $ARMEndPoint 

# Set the GraphEndpointResourceId value
Set-AzureRmEnvironment -Name $ARMEvnName -GraphEndpoint $GraphAudience

# Login
$TenantID = Get-AzsDirectoryTenantId -AADTenantName $AADTenantName -EnvironmentName $ARMEvnName
Add-AzureRmAccount -EnvironmentName $ARMEvnName -TenantId $TenantID 

# Set a default Azure subscription.
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

# Create a new Resource Group 
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

# Create a new storage account.
New-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName -Location $Location -Type Standard_LRS

# Set a default storage account.
Set-AzureRmCurrentStorageAccount -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName 

# Create a new container.
New-AzureStorageContainer -Name $ContainerName -Permission Off

# Upload a blob into a container.
Set-AzureStorageBlobContent -Container $ContainerName -File $ImageToUpload

# List all blobs in a container.
Get-AzureStorageBlob -Container $ContainerName

# Download blobs from the container:
# Get a reference to a list of all blobs in a container.
$blobs = Get-AzureStorageBlob -Container $ContainerName

# Create the destination directory.
New-Item -Path $DestinationFolder -ItemType Directory -Force  

# Download blobs into the local destination directory.
$blobs | Get-AzureStorageBlobContent –Destination $DestinationFolder

# end
````

### PowerShell known issues

The current compatible Azure PowerShell module version for Azure Stack is 1.2.11 for the user operations. It’s different from the latest version of Azure PowerShell. This difference impacts storage services operation:

* The return value format of `Get-AzureRmStorageAccountKey` in version 1.2.11 has two properties: `Key1` and `Key2`, while the current Azure version returns an array containing all the account keys.

   ```
   # This command gets a specific key for a storage account, 
   # and works for Azure PowerShell version 1.4, and later versions.
   (Get-AzureRmStorageAccountKey -ResourceGroupName "RG01" `
   -AccountName "MyStorageAccount").Value[0]

   # This command gets a specific key for a storage account, 
   # and works for Azure PowerShell version 1.3.2, and previous versions.
   (Get-AzureRmStorageAccountKey -ResourceGroupName "RG01" `
   -AccountName "MyStorageAccount").Key1

   ```

   For more information, see [Get-​Azure​Rm​Storage​Account​Key](https://docs.microsoft.com/powershell/module/azurerm.storage/Get-AzureRmStorageAccountKey?view=azurermps-4.1.0).

## Azure CLI

The Azure CLI is Azure’s command-line experience for managing Azure resources. You can install it on macOS, Linux, and Windows and run it from the command line.

Azure CLI is optimized for managing and administering Azure resources from the command line, and for building automation scripts that work against the Azure Resource Manager. It provides many of the same functions found in the Azure Stack portal, including rich data access.

Azure Stack requires Azure CLI version 2.0 or later. For more information about installing and configuring Azure CLI with Azure Stack, see [Install and configure Azure Stack CLI](azure-stack-version-profiles-azurecli2.md). For more information about how to use the Azure CLI to perform several tasks working with resources in your Azure Stack storage account, see [Using the Azure CLI with Azure storage](../../storage/storage-azure-cli.md)

### Azure CLI sample script for Azure Stack

Once you complete the CLI installation and configuration, you can try the following steps to work with a small shell sample script to interact with Azure Stack storage resources. The script completes the following actions:

* Creates a new container in your storage account.
* Uploads an existing file (as a blob) to the container.
* Lists all blobs in the container.
* Downloads the file to a destination on your local computer that you specify.

Before you run this script, make sure that you can successfully connect to, and sign in to the target Azure Stack.

1. Open your favorite text editor, then copy and paste the preceding script into the editor.
2. Update the script's variables to reflect your configuration settings.
3. After you've updated the necessary variables, save the script, and exit your editor. The next steps assume you've named your script **my_storage_sample.sh**.
4. Mark the script as executable, if necessary: `chmod +x my_storage_sample.sh`
5. Execute the script. For example, in Bash: `./my_storage_sample.sh`

```bash
#!/bin/bash
# A simple Azure Stack storage example script

export AZURESTACK_RESOURCE_GROUP=<resource_group_name>
export AZURESTACK_RG_LOCATION="local"
export AZURESTACK_STORAGE_ACCOUNT_NAME=<storage_account_name>
export AZURESTACK_STORAGE_CONTAINER_NAME=<container_name>
export AZURESTACK_STORAGE_BLOB_NAME=<blob_name>
export FILE_TO_UPLOAD=<file_to_upload>
export DESTINATION_FILE=<destination_file>

echo "Creating the resource group..."
az group create --name $AZURESTACK_RESOURCE_GROUP --location $AZURESTACK_RG_LOCATION

echo "Creating the storage account..."
az storage account create --name $AZURESTACK_STORAGE_ACCOUNT_NAME --resource-group $AZURESTACK_RESOURCE_GROUP --account-type Standard_LRS

echo "Creating the blob container..."
az storage container create --name $AZURESTACK_STORAGE_CONTAINER_NAME --account-name $AZURESTACK_STORAGE_ACCOUNT_NAME

echo "Uploading the file..."
az storage blob upload --container-name $AZURESTACK_STORAGE_CONTAINER_NAME --file $FILE_TO_UPLOAD --name $AZURESTACK_STORAGE_BLOB_NAME --account-name $AZURESTACK_STORAGE_ACCOUNT_NAME

echo "Listing the blobs..."
az storage blob list --container-name $AZURESTACK_STORAGE_CONTAINER_NAME --account-name $AZURESTACK_STORAGE_ACCOUNT_NAME --output table

echo "Downloading the file..."
az storage blob download --container-name $AZURESTACK_STORAGE_CONTAINER_NAME --account-name $AZURESTACK_STORAGE_ACCOUNT_NAME --name $AZURESTACK_STORAGE_BLOB_NAME --file $DESTINATION_FILE --output table

echo "Done"
````

## Microsoft Azure storage explorer

Microsoft Azure storage explorer is a standalone app from Microsoft. It allows you to easily work with both Azure storage and Azure Stack storage data on Windows, macOS and Linux computers. If you want an easy way to manage your Azure Stack storage data, then consider using Microsoft Azure storage explorer.

* To learn more about configuring Azure storage explorer to work with Azure Stack, see [Connect storage explorer to an Azure Stack subscription](azure-stack-storage-connect-se.md).
* To learn more about Microsoft Azure storage explorer, see [Get started with storage explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md)

## Blobfuse 

[Blobfuse](https://github.com/Azure/azure-storage-fuse) is a virtual file system driver for Azure Blob Storage, which allows you to access your existing block blob data in your Storage account through the Linux file system. Azure Blob Storage is an object storage service and therefore does not have a hierarchical namespace. Blobfuse provides this namespace using the virtual direcectory scheme with the use of forward-slash `/` as a delimiter. Blobfuse works on both Azure and Azure Stack. 

To learn more about mounting Blob storage as a file system with Blobfuse on Linux, see [How to mount Blob storage as a file system with Blobfuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux). 

For Azure Stack, **blobEndpoint** needs to be specified besides accountName, accountKey/sasToken, containerName, while configuring your Storage account credentials in the step of preparing for mounting. 

In the Azure Stack development Kit, the blobEndpoint should be `myaccount.blob.local.azurestack.external`. In Azure Stack integrated system, contact your cloud administrator if you’re not sure about your endpoint. 

Please be aware that accountKey and sasToken can only be configured one at a time. When storage account key is given, the credentials configuration file is in the following format: 

```text  
    accountName myaccount 
    accountKey myaccesskey== 
    containerName mycontainer 
    blobEndpoint myaccount.blob.local.azurestack.external
```

When shared access token is given, the credentials configuration file is in the following format:

```text  
    accountName myaccount 
    sasToken ?mysastoken 
    containerName mycontainer 
    blobEndpoint myaccount.blob.local.azurestack.external
```

## Next steps

* [Connect storage explorer to an Azure Stack subscription](azure-stack-storage-connect-se.md)
* [Get started with storage explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md)
* [Azure-consistent storage: differences and considerations](azure-stack-acs-differences.md)
* [Introduction to Microsoft Azure storage](../../storage/common/storage-introduction.md)
