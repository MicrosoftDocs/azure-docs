---
title: Managing Azure file shares using the Azure CLI
description: Learn to use the Azure CLI to manage Azure Files.
services: storage
documentationcenter: na
author: wmgries
manager: jeconnoc
editor: 

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/26/2018
ms.author: wgries
---

# Managing Azure file shares using the Azure CLI
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows, Linux, and macOS. This guide walks you through the basics of working with Azure file shares using Azure CLI. Learn how to: 

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file 
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use the Azure CLI locally, this guide requires that you are running the Azure CLI version 2.0.4 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

By default, the Azure CLI commands return JSON (JavaScript Object Notation), which is the de facto way of sending and receiving messages from REST APIs. To facilitate working with the JSON responses, some of the examples in this guide uses the query parameter on the Azure CLI commands. This parameter uses the [JMESPath query language](http://jmespath.org/) for parsing JSON. You can learn more about how to manipulate the results of the Azure CLI commands by following the [JMESPath Tutorial](http://jmespath.org/tutorial.html).

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [az group create](/cli/azure/group#create) command. 

The following example creates a resource group named *myResourceGroup* in the *East US* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of file shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

This example creates a storage account named `mystorageaccount<random number>` using the [az storage account create](/cli/azure/storage/account#create) command and then puts the name of that storage account in the variable `$STORAGEACCT`. Storage account names must be unique; using `$RANDOM` to appends a number to the end of the storage account name to make it unique. 

```azurecli-interactive 
STORAGEACCT=$(az storage account create \
    --resource-group "myResourceGroup" \
    --name "mystorageacct$RANDOM" \
    --location eastus \
    --sku Standard_LRS \
    --query "name" | tr -d '"')
```

### Get the storage account key
Storage account keys are used to control access to resources in a storage account. They are automatically created when you create a storage account. You can get the storage account keys for the storage account using the [az storage account keys list](/cli/azure/storage/account/keys#list) command. 

```azurecli-interactive 
STORAGEKEY=$(az storage account keys list \
    --resource-group "myResourceGroup" \
    --account-name $STORAGEACCT \
    --query "[0].value" | tr -d '"')
```

## Create an Azure file share
Now you can create your first Azure file share. You can create file shares using [az storage share create](/cli/azure/storage/share#create) command. This example creates an Azure file share named `myshare`. 

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" 
```

> [!Important]  
> Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Manipulating the contents of the Azure file share
Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can manipulate your Azure file share with the Azure CLI. This is advantageous over mounting the file share with SMB, because all requests made with the Azure CLI are made with the File REST API enabling you to create, modify, and delete files and directories in your file share from:

- The Bash Cloud Shell (which cannot mount file shares over SMB).
- Clients which cannot mount SMB shares, such as on-premises clients which do not have port 445 unblocked.
- Serverless scenarios, such as in [Azure Functions](../../azure-functions/functions-overview.md). 

### Create directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory#az_storage_directory_create) command.

```azurecli-interactive
az storage directory create \
   --account-name $STORAGEACCT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --name "myDirectory" 
```

### Upload a file
To demonstrate how to upload a file using the [`az storage file upload`](/cli/azure/storage/file#az_storage_file_upload) command, we first need to create a file inside your Azure CLI Cloud Shell's scratch drive to upload. In the following example, we create and then upload the file.

```azurecli-interactive
date > ~/clouddrive/SampleUpload.txt

az storage file upload \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
	--share-name "myshare" \
	--source "~/clouddrive/SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running the Azure CLI locally, you should substitute `~/clouddrive` with a path that exists on your machine.

After uploading the file, you can use the [`az storage file list`](/cli/azure/storage/file#az_storage_file_list) command to check to make sure that the file was uploaded to your Azure file share.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare" \
    --path "myDirectory" \
	--output table
```

### Download a file
You can use the [`az storage file download`](/cli/azure/storage/file#az_storage_file_download) command to download a copy of the file you uploaded to the scratch drive of your Cloud Shell.

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists because you've run this example before
rm -rf ~/clouddrive/SampleDownload.txt

az storage file download \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt" \
    --dest "~/clouddrive/SampleDownload.txt"
```

### Copy files
One common task is to copy files from one file share to another file share, or to/from an Azure Blob storage container. To demonstrate this functionality, you can create a new share and copy the file you uploaded over to this new share using the [az storage file copy](/cli/azure/storage/file/copy) command. 

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare2"

az storage directory create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare2" \
    --name "myDirectory2"

az storage file copy start \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --source-share "myshare" \
	--source-path "myDirectory/SampleUpload.txt" \
    --destination-share "myshare2" \
	--destination-path "myDirectory2/SampleCopy.txt"
```

Now, if you list the files in the new share, you should see your copied file.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare2" \
	--output table
```

While the `az storage file copy start` command is convenient for ad-hoc file moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves (in terms of number or size of files being moved). Learn more about [AzCopy for Linux](../common/storage-use-azcopy-linux.md) and [AzCopy for Windows](../common/storage-use-azcopy.md). AzCopy must be installed locally - it is not available in Cloud Shell 

## Create and modify share snapshots
One additional useful task you can do with an Azure file share is to create share snapshots. A snapshot preserves a point in time for an Azure file share. Share snapshots are similar to operating system technologies you may already be familiar with such as:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS

You can create a share snapshot by using the [`az storage share snapshot`](/cli/azure/storage/share#az_storage_share_snapshot) command.

```azurecli-interactive
SNAPSHOT=$(az storage share snapshot \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --query "snapshot" | tr -d '"')
```

### Browse share snapshot contents
You can browse the contents of a share snapshot by passing the timestamp of the share snapshot we captured in the variable `$SNAPSHOT` to the `az storage file list` command.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --snapshot $SNAPSHOT \
    --output table
```

### List share snapshots
You can see the list of snapshots you've taken for your share with the following command.

```azurecli-interactive
az storage share list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --include-snapshot \
    --query "[? name=='myshare' && snapshot!=null]" | tr -d '"'
```

### Restore from a share snapshot
You can restore a file by using the `az storage file copy start` command we used before. First, we'll delete our `SampleUpload.txt` file we uploaded so we can restore it from the snapshot.

```azurecli-interactive
# Delete SampleUpload.txt
az storage file delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt"

# Build the source URI for snapshot restore
URI=$(az storage account show \
    --resource-group "myResourceGroup" \
    --name $STORAGEACCT \
    --query "primaryEndpoints.file" | tr -d '"')

URI=$URI"myshare/myDirectory/SampleUpload.txt?sharesnapshot="$SNAPSHOT

# Restore SampleUpload.txt from the share snapshot
az storage file copy start \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --source-uri $URI \
    --destination-share "myshare" \
    --destination-path "myDirectory/SampleUpload.txt"
```

### Delete a share snapshot
You can delete a share snapshot by using the [`az storage share delete`](/cli/azure/storage/share#az_storage_share_delete) command, with the variable containing the `$SNAPSHOT` reference to the `--snapshot` parameter.

```azurecli-interactive
az storage share delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --snapshot $SNAPSHOT
```

## Clean up resources
When you are done, you can use the [`az group delete`](/cli/azure/group#delete) command to remove the resource group and all related resources. 

```azurecli-interactive 
az group delete --name "myResourceGroup"
```

You can alternatively remove resources one by one:
- To remove the Azure file shares we created for this quickstart.

```azurecli-interactive
az storage share delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --delete-snapshots include

az storage share delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare2" \
    --delete-snapshots include
```

- To remove the storage account itself (this will implicitly remove the Azure file shares we created as well as any other storage resources you may have created such as an Azure Blob storage container).

```azurecli-interactive
az storage account delete \
    --resource-group "myResourceGroup" \
    --name $STORAGEACCT \
    --yes
```

## Next steps
- [Managing file shares with the Azure portal](storage-how-to-use-files-portal.md)
- [Managing file shares with Azure PowerShell](storage-how-to-use-files-powershell.md)
- [Managing file shares with Storage Explorer](storage-how-to-use-files-storage-explorer.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)