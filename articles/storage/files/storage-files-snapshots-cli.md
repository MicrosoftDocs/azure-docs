---
title: Using snapshots with Azure file shares and CLI | Azure Docs
description: Learn to use the Azure CLI to to work with snapshots of Azure file shares.
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
ms.date: 02/20/2018
ms.author: wgries
---

# Working with snapshots of Azure files shares using the CLI (Preview)

A snapshot preserves a point in time copy of an Azure file share. File share snapshots are similar to other technologies you may already be familiar with like:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS.

## Create a snapshot

Create a share snapshot by using [`az storage share snapshot`](/cli/azure/storage/share#az_storage_share_snapshot).

```azurecli-interactive
SNAPSHOT=$(az storage share snapshot \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" | \
    jq ".snapshot" |
    tr -d '"')
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
    --include-snapshot | \
jq '.[] | select(.name == "myshare") | select(.snapshot != null) | .snapshot' | \
tr -d '"'
```

### Restore from a share snapshot
You can restore a file by using the `az storage file copy start` command we used before. For the purposes of this quickstart, we'll first delete our `SampleUpload.txt` file we previously uploaded so we can restore it from the snapshot.

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
    --name $STORAGEACCT | \
    jq ".primaryEndpoints.file" | \
    tr -d '"')

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
