---
title: Work with blob containers from PowerShell
titleSuffix: Azure Storage
description: Learn how to ... (do this last)
services: storage
author: stevenmatthew

ms.service: storage
ms.topic: how-to
ms.date: 10/26/2021
ms.author: shaas
ms.subservice: blobs
---

# Work with blob containers from PowerShell

Intro TBD (keep it short, do this last)

Goal: To provide simple but useful examples for users in one place. It's okay if the examples here are somewhat redundant with those in the PS reference and elsewhere in our docs (but shouldn't be exactly the same).

Point users to these resources for further info somewhere:

- PS reference available at [Az.Storage Module](https://docs.microsoft.com/powershell/module/az.storage) / Relative link for doc: [Az.Storage Module](/powershell/module/az.storage)
- PS Gallery: https://www.powershellgallery.com/packages/Az.Storage

For now, let's avoid using the commands that start with -AzRm. These commands are using the Azure resource manager implementation for storage and are an alternate way to work with containers. We may go back and add them in.

Login? Use `Create-AzConnection`.

## Create a container

The `New-AzStorageContainer` cmdlet creates an Azure storage container.

To create a container with PowerShell, call the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) command. 

Basic example, e.g.:

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container>"

# Get context object, using Azure AD credentials
$ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Create new container
New-AzStorageContainer -Name $containerName -Context $ctx
```

The response provides the URI of the blob endpoint and confirms the creation of the new container.

```Response
Blob End Point: https://shaasstorageaccount.blob.core.windows.net/

Name                   PublicAccess   LastModified
----                   ------------   ------------
powershellcontainer    Off            11/2/2021 3:58:23 AM +00:00
```


Here's a couple of possible examples:

Create containers with a for loop:

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container>"
$ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

for ($i = 1; $i -le 6; $i++) { 
    New-AzStorageContainer -Name (-join($containerName, $i)) -Context $ctx
    } 
```

The response provides the URI of the blob endpoint and confirms the creation of the new containers.

```Response
Blob End Point: https://shaasstorageaccount.blob.core.windows.net/

Name                   PublicAccess   LastModified
----                   ------------   ------------
powershellcontainer1   Off            11/2/2021 4:09:05 AM +00:00
powershellcontainer2   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer3   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer4   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer5   Off            11/2/2021 4:09:05 AM +00:00          
powershellcontainer6   Off            11/2/2021 4:09:05 AM +00:00
```

The following example creates three new containers from a string of container names:

```azurepowershell
"container1 container2 container3".split() | New-AzStorageContainer -Context $ctx -Permission Container
```

The response provides the URI of the blob endpoint and confirms the creation of the new containers.

```Response
Blob End Point: https://shaasstorageaccount.blob.core.windows.net/

Name                       PublicAccess   LastModified
----                       ------------   ------------
powershellcontainernum1    Container      11/2/2021 4:15:36 AM +00:00
powershellcontainernum2    Container      11/2/2021 4:15:36 AM +00:00
powershellcontainernum3    Container      11/2/2021 4:15:36 AM +00:00
```

## List containers

Use Get-AzStorageContainer

The response provides the URI of the blob endpoint and confirms the creation of the new containers.

```Response
Blob End Point: https://shaasstorageaccount.blob.core.windows.net/

Name                       PublicAccess   LastModified
----                       ------------   ------------
powershellcontainernum1    Container      11/2/2021 4:15:36 AM +00:00
powershellcontainernum2    Container      11/2/2021 4:15:36 AM +00:00
powershellcontainernum3    Container      11/2/2021 4:15:36 AM +00:00
```

**include soft-deleted containers (with -IncludeDeleted)**

This example lists all containers of a storage account, include deleted containers. Then show the deleted container properties, include : DeletedOn, RemainingRetentionDays. Deleted containers will only exist after enabled Container softdelete with Enable-AzStorageBlobDeleteRetentionPolicy.



we can skip the continuation token example for now

## Read container properties

Use Get-AzStorageContainer to get a container object, then read a few of its properties

## Read and write container metadata

Set-AzStorageContainer, write to metadata array
Get-AzStorageContainer, read from metadata array

i haven't done this, may require getting .NET BlobClient object in PS?

## Get a shared access signature for a container

New-AzStorageContainerSASToken

Create a service SAS for a container with start time, expiry time, permissions, & protocol

## Delete a container

Remove-AzStorageContainer

## Restore a soft-deleted container

Restore-AzStorageContainer

Restore a soft-deleted container. For this one, you'll need to enable container soft delete for the storage account (https://docs.microsoft.com/en-us/azure/storage/blobs/soft-delete-container-overview).

## See also