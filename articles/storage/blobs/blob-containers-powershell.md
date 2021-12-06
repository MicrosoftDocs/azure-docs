---
title: Work with blob containers from PowerShell
titleSuffix: Azure Storage
description: Learn how to ... (do this last)
services: storage
author: stevenmatthew

ms.service: storage
ms.topic: how-to
ms.date: 12/02/2021
ms.author: shaas
ms.subservice: blobs
ms.custom: template-how-to
---

# Work with blob containers using PowerShell

<!--Intro TBD (keep it short, do this last)-->

The Azure Storage platform offers a variety of cloud solutions, each designed to address a specific use-case. Azure blob storage allows you to store large amounts of unstructured object data. Using this solution, you can gather or expose media, content, or application data to users. You can also build an enterprise data lake to perform big data analytics. Objects stored in blob storage are saved as block blobs, which are optimized for fast and efficient transfer. To learn more about blob storage, read the [Introduction to Azure Blob storage](storage-blobs-introduction.md).

You can leverage PowerShell conditional and iterative operations to automate workflows involving Azure storage objects. PowerShell operations occur through the use of context objects. Context objects are PowerShell objects which represent your active subscription and the authentication information with which you'll connect to it. Because context objects are utilized, Azure PowerShell doesn't need to reauthenticate your account each time you switch subscriptions. 

This how-to article explains how to work with individual storage containers as well as collections of multiple objects.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow the steps outlined in the [Create a storage account](../common/storage-account-create.md) article to create one.

- Azure PowerShell module Az version 0.7 or later. Run `Get-InstalledModule -Name Az -AllVersions | select Name,Version` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

<!--Goal: To provide simple but useful examples for users in one place. It's okay if the examples here are somewhat redundant with those in the PS reference and elsewhere in our docs (but shouldn't be exactly the same).

Point users to these resources for further info somewhere:

- PS reference available at [Az.Storage Module](https://docs.microsoft.com/powershell/module/az.storage) / Relative link for doc: [Az.Storage Module](/powershell/module/az.storage)
- PS Gallery: https://www.powershellgallery.com/packages/Az.Storage

Avoid using the Azure resource manager implementation for storage; they're an alternate way to work with containers. We may go back and add them in.-->

## Create a container

Before you can upload a blob, you must first create a container. Azure blob containers are themselves contained within an Azure storage account. Although billing, configuration, and replication properties are set at the storage account level, all blob data resides within containers. There is no limit to the number of blobs or containers that can be created within a storage account, but containers cannot be nested.

To create containers with PowerShell, call the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) cmdlet. 

The following simplified example illustrates three options for the creation of blob containers with the `New-AzStorageContainer` cmdlet. The first approach creates a single container, while the remaining two approaches automate container creation by leveraging PowerShell operations.

To use this example, supply values for the variables and ensure that you've created a connection to your Azure subscription. 

 ```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "<new-container-name>"
 $prefixName     = "<new-prefix-name>"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Approach 1: Create a container
 New-AzStorageContainer -Name $containerName -Context $ctx

# Approach 2: Create containers with a PowerShell loop
 for ($i = 1; $i -le 3; $i++) { 
     New-AzStorageContainer -Name (-join($containerName, $i)) -Context $ctx
    } 

# Approach 3: Create containers using the PowerShell Split method
 "$($containername)4 $($containername)5 $($containername)6".split() | New-AzStorageContainer -Context $ctx
```

The result provides the URI of the blob endpoint and confirms the creation of the new container.

```Result
Blob End Point: https://demostorageaccount.blob.core.windows.net/

Name                   PublicAccess   LastModified
----                   ------------   ------------
democontainer          Off            11/2/2021 4:09:05 AM +00:00
powershellcontainer1   Off            11/2/2021 4:09:05 AM +00:00
powershellcontainer2   Off            11/2/2021 4:09:05 AM +00:00
powershellcontainer3   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer4   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer5   Off            11/2/2021 4:09:05 AM +00:00           
powershellcontainer6   Off            11/2/2021 4:09:05 AM +00:00          
```

## List containers

You can use the `Get-AzStorageContainer` cmdlet to retrieve a single container or a collection of containers. Use the `-Name` switch to retrieve a single container, or use the `-Prefix` switch or return a collection of containers. 

In some cases it is possible to retrieve containers that have been deleted. If your storage account's soft delete data protection option is enabled, the `-IncludeDeleted` switch will return containers deleted within the associated retention period. The `-IncludeDeleted` switch can only be used in conjunction with the`-Prefix` switch when returning a container collection. To learn more about soft delete, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

The following example retrieves both an individual container and a collection of container resources. 

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "<container-name>"
 $prefixName     = "<prefix-name>"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Approach 1: Retrieve an individual container
 Get-AzStorageContainer -Name $containerName -Context $ctx
 Write-Host

# Approach 2: Retrieve a collection of containers
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx
 Write-Host

# Approach 3: Retrieve a collection of containers including those recently deleted
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx -IncludeDeleted
```

The result provides the URI of the blob endpoint and lists the containers retrieved by name and prefix.

```Result
   Storage Account Name: shaasstorageaccount

Name                 PublicAccess         LastModified                   IsDeleted  VersionId        
----                 ------------         ------------                   ---------  ---------        
democontainer                             12/2/2021 5:52:08 PM +00:00                                

samplecontainer1                          12/2/2021 12:22:00 AM +00:00                               
samplecontainer2                          12/2/2021 12:22:00 AM +00:00                               

samplecontainer1                          12/2/2021 12:22:00 AM +00:00                               
samplecontainer2                          12/2/2021 12:22:00 AM +00:00
samplecontainer3                          12/2/2021 12:22:00 AM +00:00   True       01D7E7129FDBD7D4
samplecontainer4                          12/2/2021 12:22:00 AM +00:00   True       01D7E8A5EF01C787 
```

<!--**include soft-deleted containers (with -IncludeDeleted)**

This example lists all containers of a storage account, include deleted containers. Then show the deleted container properties, include : DeletedOn, RemainingRetentionDays. Deleted containers will only exist after enabled Container softdelete with Enable-AzStorageBlobDeleteRetentionPolicy.

*****NOTE: If we're looking at including the developer guide, does it not make sense to include more in-depth info in the Storage Account article?-->

## Read container properties and metadata

In addition to the blob data stored within a container, the container itself exposes both system properties and user-defined metadata. 

System properties exist on each Blob storage resource. Some properties are read-only, while others can be read or set. Under the covers, some system properties map to certain standard HTTP headers. The Azure Storage client library for .NET maintains these properties for you.

User-defined metadata consists of one or more name-value pairs that you specify for a Blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

### Container properties

The following example retrieves all containers with the **demo** prefix and iterates through them, listing their properties. 

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $prefix         = "<prefix-name>"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Get containers
 $containers = Get-AzStorageContainer -Prefix $prefix -Context $ctx

# Iterate containers, display properties
 Foreach ($container in $containers) 
 {
     Write-Host $container.Name "properties:"
    $container.CloudBlobContainer.Properties
 }
```

The results display all containers with the prefix **demo** and lists their properties.

```Results
democontainer1 properties:
ETag                   : "0x8D9B529C241D131"
HasImmutabilityPolicy  : False
HasLegalHold           : False
LastModified           : 12/2/2021 12:22:00 AM +00:00
LeaseStatus            : Unlocked
LeaseState             : Available
LeaseDuration          : Unspecified
PublicAccess           : Off
EncryptionScopeOptions : Microsoft.Azure.Storage.Blob.BlobContainerEncryptionScopeOptions

democontainer2 properties:
ETag                   : "0x8D9B529C24C2FEA"
HasImmutabilityPolicy  : False
HasLegalHold           : False
LastModified           : 12/2/2021 12:22:00 AM +00:00
LeaseStatus            : Unlocked
LeaseState             : Available
LeaseDuration          : Unspecified
PublicAccess           : Off
EncryptionScopeOptions : Microsoft.Azure.Storage.Blob.BlobContainerEncryptionScopeOptions

democontainer3 properties:
ETag                   : "0x8D9B529C251FB7C"
HasImmutabilityPolicy  : False
HasLegalHold           : False
LastModified           : 12/2/2021 12:22:00 AM +00:00
LeaseStatus            : Unlocked
LeaseState             : Available
LeaseDuration          : Unspecified
PublicAccess           : Off
EncryptionScopeOptions : Microsoft.Azure.Storage.Blob.BlobContainerEncryptionScopeOptions
```

### Read and write container metadata

Containers support the use of metadata, which allows a greater degree of flexibility when performing operations on containers and their contents. Metadata consists of a series of key-value pairs that can be used to describe or categorize your data. Users that have many thousands of objects within their storage account can quickly locate specific containers based on their metadata. 

The examples below update and subsequently retrieve a container's metadata. Note that the example flushes the example container from memory and retrieves it again to ensure that the new metadata is not being read from memory.

```azurepowershell
# Create variables
 $accountName   = "<storage-account>"
 $containerName = "<container-name>"

# Create a context object using Azure AD credentials, retrieve container
 $ctx       = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount
 $container = Get-AzStorageContainer -Name $containerName -Context $ctx

# Add metadata key-value pairs
 $container.CloudBlobContainer.Metadata.Add("CustomerName","Anthony Bennedetto")
 $container.CloudBlobContainer.Metadata.Add("CustomerDOB","08/03/1926")
 $container.CloudBlobContainer.Metadata.Add("CustomerBirthplace","Long Island City")

# Update metadata
  $container.CloudBlobContainer.SetMetadata()

# Flush container from memory
 $container = ""

# Fetch the newly-updated container, read metadata
 $container = Get-AzStorageContainer -Name $containerName -Context $ctx

 Foreach($pair in $container.Cloud) {
     $pair
 }

# Or

$container.BlobContainerProperties.Metadata

#Or 

$container.CloudBlobContainer.Metadata
```

The results display the complete metadata for a container.

## Get a shared access signature for a container

New-AzStorageContainerSASToken

Create a service SAS for a container with start time, expiry time, permissions, & protocol

## Delete a container

As previously shown in the [List containers](#list-containers) section, you can choose to perform operations on either a single or multiple storage containers, depending on your use case. The examples below explain how to delete both a single container as well as a collection of multiple containers.

The following is a simplified example used to delete a single container. To use this example, supply values for the variables and ensure that you've created a connection to your Azure subscription. 

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "democontainer"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Delete the named container
 Remove-AzStorageContainer -Name $containerName -Context $ctx
```

You can also automate container deletion by leveraging conditional operations with PowerShell as shown in the examples below. To use these examples, supply values for the variables and ensure that you've created a connection to your Azure subscription.

```azurepowershell
# Create variables
 $accountName     = "<storage-account>"
 $containerPrefix = "democontainer"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Iterate through a loop and delete containers
 for ($i = 1; $i -le 3; $i++) { 
     Remove-AzStorageContainer -Name (-join($containerPrefix, $i)) -Context $ctx
    } 

# Split a string into substrings and delete containers
 "$($containerPrefix)4 $($containerPrefix)5 $($containerPrefix)6".split() | Remove-AzStorageContainer -Context $ctx
```

## Restore a soft-deleted container

Restore-AzStorageContainer

Restore a soft-deleted container. For this one, you'll need to enable container soft delete for the storage account (https://docs.microsoft.com/en-us/azure/storage/blobs/soft-delete-container-overview).

## See also