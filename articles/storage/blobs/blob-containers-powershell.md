---
title: Work with blob containers from PowerShell
titleSuffix: Azure Storage
description: Learn how to manage Azure storage containers using Azure PowerShell
services: storage
author: stevenmatthew

ms.service: storage
ms.topic: how-to
ms.date: 12/07/2021
ms.author: shaas
ms.subservice: blobs
ms.custom: template-how-to
---

# Manage blob containers using PowerShell

The Azure Storage platform offers a suite of cloud solutions, each designed to address a specific use-case. Azure blob storage allows you to store large amounts of unstructured object data. Using this solution, you can gather or expose media, content, or application data to users. You can also build an enterprise data lake to perform big data analytics. Objects stored in blob storage are saved as block blobs, which are optimized for fast and efficient transfer. To learn more about blob storage, read the [Introduction to Azure Blob storage](storage-blobs-introduction.md).

You can use PowerShell conditional and iterative operations to automate workflows involving Azure storage objects. PowerShell operations occur through the use of context objects. Context objects are PowerShell objects that represent your active subscription and the authentication information with which you'll connect to it. Because context objects are used, Azure PowerShell doesn't need to reauthenticate your account each time you switch subscriptions.

This how-to article explains how to work with individual storage containers and collections of multiple objects.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow the steps outlined in the [Create a storage account](../common/storage-account-create.md) article to create one.

- Azure PowerShell module Az version 0.7 or later. Run `Get-InstalledModule -Name Az -AllVersions | select Name,Version` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

<!--
Point users to these resources for further info somewhere:

- PS reference available at [Az.Storage Module](https://docs.microsoft.com/powershell/module/az.storage) / Relative link for doc: [Az.Storage Module](/powershell/module/az.storage)
- PS Gallery: https://www.powershellgallery.com/packages/Az.Storage

Avoid using the Azure resource manager implementation for storage; they're an alternate way to work with containers. We may go back and add them in.
-->

## Create a container

Before you can upload a blob, you must first create a container. Azure blob containers are themselves contained within an Azure storage account. Although billing, configuration, and replication properties are set at the storage account level, all blob data resides within containers. There are no limits to the number of blobs or containers that can be created within a storage account. Containers cannot be nested within other containers.

To create containers with PowerShell, call the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) cmdlet.

The following simplified example illustrates three options for the creation of blob containers with the `New-AzStorageContainer` cmdlet. The first approach creates a single container, while the remaining two approaches automate container creation by leveraging PowerShell operations.

To use this example, supply values for the variables and ensure that you've created a connection to your Azure subscription. 

 ```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "individual-container"
 $prefixName     = "loop-container"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Approach 1: Create a container
 New-AzStorageContainer -Name $containerName -Context $ctx

# Approach 2: Create containers with a PowerShell loop
 for ($i = 1; $i -le 3; $i++) { 
     New-AzStorageContainer -Name (-join($prefixName, $i)) -Context $ctx
    } 

# Approach 3: Create containers using the PowerShell Split method
 "$($prefixName)4 $($prefixName)5 $($prefixName)6".split() | New-AzStorageContainer -Context $ctx
```

The result provides the URI of the blob endpoint and confirms the creation of the new container.

```Result
Blob End Point: https://demostorageaccount.blob.core.windows.net/

Name                   PublicAccess   LastModified
----                   ------------   ------------
individual-container   Off            11/2/2021 4:09:05 AM +00:00
loop-container1        Off            11/2/2021 4:09:05 AM +00:00
loop-container2        Off            11/2/2021 4:09:05 AM +00:00
loop-container3        Off            11/2/2021 4:09:05 AM +00:00           
loop-container4        Off            11/2/2021 4:09:05 AM +00:00           
loop-container5        Off            11/2/2021 4:09:05 AM +00:00           
loop-container6        Off            11/2/2021 4:09:05 AM +00:00          
```

## List containers

You can use the `Get-AzStorageContainer` cmdlet to retrieve a single container or a collection of containers. Use the `-Name` switch to retrieve a single container. Instead, you can use the `-Prefix` switch to return a collection of containers.

In some cases, it's possible to retrieve containers that have been deleted. If your storage account's soft delete data protection option is enabled, the `-IncludeDeleted` switch will return containers deleted within the associated retention period. The `-IncludeDeleted` switch can only be used in conjunction with the`-Prefix` switch when returning a container collection. To learn more about soft delete, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

The following example retrieves both an individual container and a collection of container resources.

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "individual-container"
 $prefixName     = "loop-"

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
   Storage Account Name: demostorageaccount

Name                 PublicAccess         LastModified                   IsDeleted  VersionId        
----                 ------------         ------------                   ---------  ---------        
individual-container                      11/2/2021 5:52:08 PM +00:00                                

loop-container1                           11/2/2021 12:22:00 AM +00:00                               
loop-container2                           11/2/2021 12:22:00 AM +00:00                               

loop-container1                           11/2/2021 12:22:00 AM +00:00                               
loop-container2                           11/2/2021 12:22:00 AM +00:00
loop-container3                           11/2/2021 12:22:00 AM +00:00   True       01D7E7129FDBD7D4
loop-container4                           11/2/2021 12:22:00 AM +00:00   True       01D7E8A5EF01C787 
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
 $prefix         = "loop"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Get containers
 $containers = Get-AzStorageContainer -Prefix $prefix -Context $ctx

# Iterate containers, display properties
 Foreach ($container in $containers) 
 {
    $containerProperties = $container.BlobContainerClient.GetProperties()
    Write-Host $container.Name "properties:"
    $containerProperties.Value
 }
```

The results display all containers with the prefix loop and list their properties.

```Results
loop-container1 properties:

LastModified                      : 12/7/2021 7:47:17 PM +00:00
LeaseStatus                       : Unlocked
LeaseState                        : Available
LeaseDuration                     : Infinite
PublicAccess                      : 
HasImmutabilityPolicy             : False
HasLegalHold                      : False
DefaultEncryptionScope            : $account-encryption-key
PreventEncryptionScopeOverride    : False
DeletedOn                         : 
RemainingRetentionDays            : 
ETag                              : 0x8D9B9BA602806DA
Metadata                          : {}
HasImmutableStorageWithVersioning : False

loop-container2 properties:
LastModified                      : 12/7/2021 7:47:18 PM +00:00
LeaseStatus                       : Unlocked
LeaseState                        : Available
LeaseDuration                     : Infinite
PublicAccess                      : 
HasImmutabilityPolicy             : False
HasLegalHold                      : False
DefaultEncryptionScope            : $account-encryption-key
PreventEncryptionScopeOverride    : False
DeletedOn                         : 
RemainingRetentionDays            : 
ETag                              : 0x8D9B9BA605996AE
Metadata                          : {}
HasImmutableStorageWithVersioning : False
```

### Read and write container metadata

Containers support the use of metadata, which allows a greater degree of flexibility when performing operations on containers and their contents. Metadata consists of a series of key-value pairs that can be used to describe or categorize your data. Users that have many thousands of objects within their storage account can quickly locate specific containers based on their metadata.

In order to access the metadata, utilize the `BlobContainerClient`. This allows you to access and manipulate containers and their blobs. To update metadata, you'll need to call the `SetMetadata()` method. The method only accepts key-value pairs stored in a generic `IDictionary` object. For more information, refer to the [BlobContainerClient class](/dotnet/api/azure.storage.blobs.blobcontainerclient)

The example below first updates a container's metadata and afterward retrieve a container's metadata. Note that the example flushes the sample container from memory and retrieves it again to ensure that metadata is not being read from the object in memory.

```azurepowershell
# Create variables
 $accountName   = "<storage-account>"
 $containerName = "individual-container"

# Create a context object using Azure AD credentials, retrieve container
 $ctx       = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount
 $container = Get-AzStorageContainer -Name $containerName -Context $ctx

# Create IDictionary, add key-value metadata pairs to IDictionary
 $metadata = New-Object System.Collections.Generic.Dictionary"[String,String]"
 $metadata.Add("CustomerName","Anthony Bennedetto")
 $metadata.Add("CustomerDOB","08/03/1926")
 $metadata.Add("CustomerBirthplace","Long Island City")

# Update metadata
  $container.BlobContainerClient.SetMetadata($metadata, $null)

# Flush container from memory, retrieve updated container
 $container = $null
 $container = Get-AzStorageContainer -Name $containerName -Context $ctx
 
# Display metadata
 $properties = $container.BlobContainerClient.GetProperties()
 Write-Host $container.Name "metadata:" 
 Write-Host $properties.Value.Metadata
```

The results display the complete metadata for a container.

```Results
individual-container metadata:

[CustomerName, Anthony Bennedetto] [CustomerDOB, 08/03/1926] [CustomerBirthplace, Long Island City]
```

## Get a shared access signature for a container

A shared access signature (SAS) provides secure delegated access to Azure resources. With a SAS, you have granular control over how a client can access your data. For example, you can specify which resources are available to the client. You can also limit the types of operations which the client can perform on available resources, as well as specify the amount of time for which the actions can be taken.

SAS are commonly used to provide temporary and secure access to a client who would not normally have established permissions. An example of this scenario would be a service which allows users read and write their own data to your storage account.

Azure Storage supports three types of shared access signatures: user delegation, service, and account SAS. For more information on shared access signatures, refer to the [Create a service SAS for a container or blob](../common/storage-sas-overview) article.

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS.

The following example illustrates the process of configuring a service SAS for a specific container using the `New-AzStorageContainerSASToken` cmdlet. This example will configure the SAS with start and expiry times, a permission level, and a protocol.

```azurepowershell
# Create variables
 $accountName   = "<storage-account>"
 $containerName = "individual-container"
 $startTime     = Get-Date
 $expiryTime    = $startTime.AddDays(7)
 $permissions   = "rwd"
 $protocol      = "HttpsOnly"

# Create a context object using Azure AD credentials, retrieve container
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount
 
# Approach 1: Generate SAS token for a specific container
 $sas = New-AzStorageContainerSASToken `
 -Context $ctx `
 -Name $containerName `
 -StartTime $startTime `
 -ExpiryTime $expiryTime `
 -Permission $permissions `
 -Protocol $protocol

# Approach 2: Generate SAS tokens for a container collection using pipeline
  Get-AzStorageContainer -Container $filterName -Context $ctx | New-AzStorageContainerSASToken `
 -Context $ctx `
 -StartTime $startTime `
 -ExpiryTime $expiryTime `
 -Permission $permissions `
 -Protocol $protocol | Write-Output
```

## Delete a container

Depending on your use case, you can retrieve a container or container collection with the `Remove-AzStorageContainer` cmdlet. When deleting a collection, you can leverage conditional operations or loops, or simply use the PowerShell pipeline as shown in the examples below.

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "individual-container"
 $prefixName     = "loop-"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Delete a individual, named container
 Remove-AzStorageContainer -Name $containerName -Context $ctx

# Iterate a loop, deleting containers
 for ($i = 1; $i -le 2; $i++) { 
     Remove-AzStorageContainer -Name (-join($containerPrefix, $i)) -Context $ctx
    } 

# Retrieve collection, delete using a pipeline
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx | Remove-AzStorageContainer
```

## Restore a soft-deleted container

As mentioned in the [List containers](#list-containers) section, you can configure the soft delete data protection option on your storage account. When enabled, it is possible to restore containers deleted within the associated retention period.

The following example explains how to restore a soft-deleted container with the `Restore-AzStorageContainer` cmdlet. In order to utilize this example, you'll need to have soft delete enabled and configured for at least one of your storage accounts.

To learn more about the soft delete data protection option, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

```azurepowershell
# Create variables
 $accountName = "<storage-account>"
 $prefixName  = "loop-"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Retrieve all containers, filter deleted containers, restore deleted containers
 Get-AzStorageContainer -Prefix $prefixName -IncludeDeleted -Context $ctx | ? { $_.IsDeleted } | Restore-AzStorageContainer
```

The results display all containers with the prefix **demo** which have been restored.

```Results
    Storage Account Name: shaasstorageaccount

Name                 PublicAccess         LastModified                   IsDeleted  VersionId        
----                 ------------         ------------                   ---------  ---------        
democontainer3                                                                                       
democontainer4               
```

## See also...