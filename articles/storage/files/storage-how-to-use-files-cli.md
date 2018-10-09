---
title: Manage Azure file shares using Azure CLI
description: Learn how to use Azure CLI to manage Azure Files.
services: storage
author: wmgries
ms.service: storage
ms.topic: get-started-article
ms.date: 03/26/2018
ms.author: wgries
ms.component: files
---

# Manage Azure file shares using Azure CLI
[Azure Files](storage-files-introduction.md) is the easy-to-use cloud file system from Microsoft. Azure file shares can be mounted in Windows, Linux, and macOS. This article walks you through the basics of working with Azure file shares by using Azure CLI. Learn how to: 

> [!div class="checklist"]
> * Create a resource group and a storage account
> * Create an Azure file share 
> * Create a directory
> * Upload a file 
> * Download a file
> * Create and use a share snapshot

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally, for the steps in this article, you must be running Azure CLI version 2.0.4 or later. Run **az --version** to find your Azure CLI version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

By default, Azure CLI commands return JavaScript Object Notation (JSON). JSON is the standard way to send and receive messages from REST APIs. To facilitate working with JSON responses, some of the examples in this article use the *query* parameter on Azure CLI commands. This parameter uses the [JMESPath query language](http://jmespath.org/) to parse JSON. To learn more about how to use the results of Azure CLI commands by following the JMESPath query language, see the [JMESPath tutorial](http://jmespath.org/tutorial.html).

## Create a resource group
A resource group is a logical container in which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can use the [az group create](/cli/azure/group#create) command to create one. 

The following example creates a resource group named *myResourceGroup* in the *East US* location:

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file shares or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of file shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

The following example creates a storage account named *mystorageaccount\<random number\>* by using the [az storage account create](/cli/azure/storage/account#create) command, and then puts the name of that storage account in the `$STORAGEACCT` variable. Storage account names must be unique. Using `$RANDOM` appends a number to the storage account name to make it unique. 

```azurecli-interactive 
STORAGEACCT=$(az storage account create \
    --resource-group "myResourceGroup" \
    --name "mystorageacct$RANDOM" \
    --location eastus \
    --sku Standard_LRS \
    --query "name" | tr -d '"')
```

### Get the storage account key
Storage account keys control access to resources in a storage account. The keys are automatically created when you create a storage account. You can get the storage account keys for your storage account by using the [az storage account keys list](/cli/azure/storage/account/keys#list) command: 

```azurecli-interactive 
STORAGEKEY=$(az storage account keys list \
    --resource-group "myResourceGroup" \
    --account-name $STORAGEACCT \
    --query "[0].value" | tr -d '"')
```

## Create an Azure file share
Now, you can create your first Azure file share. Create file shares by using the [az storage share create](/cli/azure/storage/share#create) command. This example creates an Azure file share named *myshare*: 

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" 
```

> [!IMPORTANT]  
> Share names can contain only lowercase letters, numbers, and single hyphens (but they can't start with a hyphen). For complete details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Work with the contents of an Azure file share
Now that you have created an Azure file share, you can mount the file share by using SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can work with your Azure file share by using Azure CLI. The advantage of using Azure CLI instead of mounting the file share by using SMB is that all requests that are made with Azure CLI are made by using the File REST API. You can use the File REST API to create, modify, and delete files and directories in your file share from these locations:

- The Bash Azure Cloud Shell (which can't mount file shares over SMB)
- Clients that can't mount SMB shares, such as on-premises clients that don't have port 445 unblocked
- Serverless scenarios, such as in [Azure Functions](../../azure-functions/functions-overview.md)

### Create a directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory#az_storage_directory_create) command:

```azurecli-interactive
az storage directory create \
   --account-name $STORAGEACCT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --name "myDirectory" 
```

### Upload a file
To demonstrate how to upload a file by using the [`az storage file upload`](/cli/azure/storage/file#az_storage_file_upload) command, first create a file to upload on the Cloud Shell scratch drive. In the following example, you create and then upload the file:

```azurecli-interactive
date > ~/clouddrive/SampleUpload.txt

az storage file upload \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
	--share-name "myshare" \
	--source "~/clouddrive/SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running Azure CLI locally, substitute `~/clouddrive` with a path that exists on your machine.

After you upload the file, you can use the [`az storage file list`](/cli/azure/storage/file#az_storage_file_list) command to make sure that the file was uploaded to your Azure file share:

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare" \
    --path "myDirectory" \
	--output table
```

### Download a file
You can use the [`az storage file download`](/cli/azure/storage/file#az_storage_file_download) command to download a copy of the file that you uploaded to the Cloud Shell scratch drive:

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists, because you've run this example before
rm -rf ~/clouddrive/SampleDownload.txt

az storage file download \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt" \
    --dest "~/clouddrive/SampleDownload.txt"
```

### Copy files
A common task is to copy files from one file share to another file share, or to or from an Azure Blob storage container. To demonstrate this functionality, create a new share. Copy the file that you uploaded to this new share by using the [az storage file copy](/cli/azure/storage/file/copy) command: 

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

Now, if you list the files in the new share, you should see your copied file:

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare2" \
	--output table
```

Although the `az storage file copy start` command is convenient for file moves between Azure file shares and Azure Blob storage containers, we recommend that you use AzCopy for larger moves. (Larger in terms of the number or size of files being moved.) Learn more about [AzCopy for Linux](../common/storage-use-azcopy-linux.md) and [AzCopy for Windows](../common/storage-use-azcopy.md). AzCopy must be installed locally. AzCopy isn't available in Cloud Shell. 

## Create and modify share snapshots
Another useful task that you can do with an Azure file share is create share snapshots. A snapshot preserves a point-in-time copy of an Azure file share. Share snapshots are similar to some operating system technologies that you might already be familiar with:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/en-us/windows/desktop/VSS/volume-shadow-copy-service-portal) for Windows file systems, such as NTFS and ReFS

You can create a share snapshot by using the [`az storage share snapshot`](/cli/azure/storage/share#az_storage_share_snapshot) command:

```azurecli-interactive
SNAPSHOT=$(az storage share snapshot \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --query "snapshot" | tr -d '"')
```

### Browse share snapshot contents
You can browse the contents of a share snapshot by passing the time stamp of the share snapshot that you captured in the `$SNAPSHOT` variable to the `az storage file list` command:

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --snapshot $SNAPSHOT \
    --output table
```

### List share snapshots
To see the list of snapshots that you've taken for your share, use the following command:

```azurecli-interactive
az storage share list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --include-snapshot \
    --query "[? name=='myshare' && snapshot!=null]" | tr -d '"'
```

### Restore from a share snapshot
You can restore a file by using the `az storage file copy start` command that you used earlier. First, delete the SampleUpload.txt file that you uploaded, so you can restore it from the snapshot:

```azurecli-interactive
# Delete SampleUpload.txt
az storage file delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt"

# Build the source URI for a snapshot restore
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
You can delete a share snapshot by using the [`az storage share delete`](/cli/azure/storage/share#az_storage_share_delete) command. Use the variable that contains the `$SNAPSHOT` reference to the `--snapshot` parameter:

```azurecli-interactive
az storage share delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --snapshot $SNAPSHOT
```

## Clean up resources
When you are done, you can use the [`az group delete`](/cli/azure/group#delete) command to remove the resource group and all related resources: 

```azurecli-interactive 
az group delete --name "myResourceGroup"
```

Alternatively, you can remove resources individually.
- To remove the Azure file shares that you created for this article:

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

- To remove the storage account itself. (This implicitly removes the Azure file shares that you created, and any other storage resources that you might have created, such as an Azure Blob storage container.)

    ```azurecli-interactive
    az storage account delete \
        --resource-group "myResourceGroup" \
        --name $STORAGEACCT \
        --yes
    ```

## Next steps
- [Manage file shares with the Azure portal](storage-how-to-use-files-portal.md)
- [Manage file shares with Azure PowerShell](storage-how-to-use-files-powershell.md)
- [Manage file shares with Storage Explorer](storage-how-to-use-files-storage-explorer.md)
- [Plan for an Azure Files deployment](storage-files-planning.md)