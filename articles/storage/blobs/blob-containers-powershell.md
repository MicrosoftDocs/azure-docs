---
title: Work with blob containers from PowerShell
titleSuffix: Azure Storage
description: Learn how to manage Azure storage containers using Azure PowerShell
services: storage
author: stevenmatthew

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/03/2022
ms.author: shaas
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
---

# Manage blob containers using PowerShell

Azure blob storage allows you to store large amounts of unstructured object data. You can use blob storage to gather or expose media, content, or application data to users. Because all blob data is stored within containers, you must create a storage container before you can begin to upload data. To learn more about blob storage, read the [Introduction to Azure Blob storage](storage-blobs-introduction.md).

This how-to article explains how to work with both individual and multiple storage container objects.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- Azure PowerShell module Az, which is the recommended PowerShell module for interacting with Azure. To get started with the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

You'll need to obtain authorization to an Azure subscription before you can use the examples in this article. Authorization can occur by authenticating with a Microsoft Entra account or using a shared key. The examples in this article use Microsoft Entra authentication in conjunction with context objects. Context objects encapsulate your Microsoft Entra credentials and pass them on subsequent data operations, eliminating the need to reauthenticate.

To sign in to your Azure account with a Microsoft Entra account, open PowerShell and call the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

```powershell
# Connect to your Azure subscription
 Connect-AzAccount
```

After the connection has been established, create the storage account context by calling the `New-AzStorageContext` cmdlet. Include the `-UseConnectedAccount` parameter so that data operations will be performed using your Microsoft Entra credentials.

```powershell
# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName <storage account name> -UseConnectedAccount
```

Remember to replace the placeholder values in brackets with your own values. For more information about signing into Azure with PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

## Create a container

To create containers with PowerShell, call the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) cmdlet. There are no limits to the number of blobs or containers that can be created within a storage account. Containers cannot be nested within other containers.

The following example illustrates three options for the creation of blob containers with the `New-AzStorageContainer` cmdlet. The first approach creates a single container, while the remaining two approaches leverage PowerShell operations to automate container creation.

To use this example, supply values for the variables and ensure that you've created a connection to your Azure subscription. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
# Create variables
 $containerName  = "individual-container"
 $prefixName     = "loop"

# Approach 1: Create a container
 New-AzStorageContainer -Name $containerName -Context $ctx

# Approach 2: Create containers with a PowerShell loop
 for ($i = 1; $i -le 3; $i++) { 
     New-AzStorageContainer -Name (-join($prefixName, $i)) -Context $ctx
    } 

# Approach 3: Create containers using the PowerShell Split method
 "$($prefixName)4 $($prefixName)5 $($prefixName)6".split() | New-AzStorageContainer -Context $ctx
```

The result provides the name of the storage account and confirms the creation of the new container.

```Result
Storage Account Name: demostorageaccount

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

Use the `Get-AzStorageContainer` cmdlet to retrieve storage containers. To retrieve a single container, include the `-Name` parameter. To return a list of containers that begins with a given character string, specify a value for the -Prefix parameter.

The following example retrieves both an individual container and a list of container resources.

```azurepowershell
# Create variables
 $containerName  = "individual-container"
 $prefixName     = "loop-"

# Approach 1: Retrieve an individual container
 Get-AzStorageContainer -Name $containerName -Context $ctx
 Write-Host

# Approach 2: Retrieve a list of containers
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx
```
 
The result provides the URI of the blob endpoint and lists the containers retrieved by name and prefix.

```Results
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

## Read container properties and metadata

A container exposes both system properties and user-defined metadata. System properties exist on each blob storage resource. Some properties are read-only, while others can be read or set. Under the covers, some system properties map to certain standard HTTP headers.

User-defined metadata consists of one or more name-value pairs that you specify for a blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

### Container properties

The following example retrieves all containers with the **demo** prefix and iterates through them, listing their properties.

```azurepowershell
# Create variable
 $prefix = "loop"

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

The results display all containers with the prefix **loop** and list their properties.

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

Users that have many thousands of objects within their storage account can quickly locate specific containers based on their metadata. To access the metadata, you'll use the `BlobContainerClient` object. This object allows you to access and manipulate containers and their blobs. To update metadata, you'll need to call the `SetMetadata()` method. The method only accepts key-value pairs stored in a generic `IDictionary` object. For more information, see the [BlobContainerClient class](/dotnet/api/azure.storage.blobs.blobcontainerclient)

The example below first updates a container's metadata and afterward retrieve a container's metadata. The example flushes the sample container from memory and retrieves it again to ensure that metadata isn't being read from the object in memory.

```azurepowershell
# Create variable
  $containerName = "individual-container"

# Retrieve container
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

A shared access signature (SAS) provides delegated access to Azure resources. A SAS gives you granular control over how a client can access your data. For example, you can specify which resources are available to the client. You can also limit the types of operations that the client can perform, and specify the amount of time for which the actions can be taken.

A SAS is commonly used to provide temporary and secure access to a client who wouldn't normally have permissions. An example of this scenario would be a service that allows users read and write their own data to your storage account.

Azure Storage supports three types of shared access signatures: user delegation, service, and account SAS. For more information on shared access signatures, see the [Create a service SAS for a container or blob](../common/storage-sas-overview.md) article.

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS.

The following example illustrates the process of configuring a service SAS for a specific container using the `New-AzStorageContainerSASToken` cmdlet. The example will configure the SAS with start and expiry times and a protocol. It will also specify the **read**, **write**, and **list** permissions in the SAS using the `-Permission` parameter. You can reference the full table of permissions in the [Create a service SAS](/rest/api/storageservices/create-service-sas#permissions-for-a-directory-container-or-blob) article.

```azurepowershell
# Create variables
 $accountName   = "<storage-account>"
 $containerName = "individual-container"
 $startTime     = Get-Date
 $expiryTime    = $startTime.AddDays(7)
 $permissions   = "rwl"
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

# Approach 2: Generate SAS tokens for a container list using pipeline
  Get-AzStorageContainer -Container $filterName -Context $ctx | New-AzStorageContainerSASToken `
 -Context $ctx `
 -StartTime $startTime `
 -ExpiryTime $expiryTime `
 -Permission $permissions `
 -Protocol $protocol | Write-Output
```

> [!NOTE]
> The SAS token returned by Blob Storage doesn't include the delimiter character ('?') for the URL query string. If you are appending the SAS token to a resource URL, remember to also append the delimiter character.

## Delete containers

Depending on your use case, you can delete a container or list of containers with the `Remove-AzStorageContainer` cmdlet. When deleting a list of containers, you can leverage conditional operations, loops, or the PowerShell pipeline as shown in the examples below.

```azurepowershell
# Create variables
 $accountName    = "<storage-account>"
 $containerName  = "individual-container"
 $prefixName     = "loop-"

# Delete a single named container
 Remove-AzStorageContainer -Name $containerName -Context $ctx

# Iterate a loop, deleting containers
 for ($i = 1; $i -le 2; $i++) { 
     Remove-AzStorageContainer -Name (-join($containerPrefix, $i)) -Context $ctx
    } 

# Retrieve container list, delete using a pipeline
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx | Remove-AzStorageContainer
```

In some cases, it's possible to retrieve containers that have been deleted. If your storage account's soft delete data protection option is enabled, the `-IncludeDeleted` parameter will return containers deleted within the associated retention period. The `-IncludeDeleted` parameter can only be used in conjunction with the `-Prefix` parameter when returning a list of containers. To learn more about soft delete, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

Use the following example to retrieve a list of containers deleted within the storage account's associated retention period.

```azurepowershell
# Retrieve a list of containers including those recently deleted
 Get-AzStorageContainer -Prefix $prefixName -Context $ctx -IncludeDeleted
```

## Restore a soft-deleted container

As mentioned in the [List containers](#list-containers) section, you can configure the soft delete data protection option on your storage account. When enabled, it's possible to restore containers deleted within the associated retention period.

The following example explains how to restore a soft-deleted container with the `Restore-AzStorageContainer` cmdlet. Before you can follow this example, you'll need to enable soft delete and configure it on at least one of your storage accounts.

To learn more about the soft delete data protection option, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

```azurepowershell
# Create variables
 $accountName = "<storage-account>"
 $prefixName  = "loop-"

# Create a context object using Azure AD credentials
 $ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Retrieve all containers, filter deleted containers, restore deleted containers
 Get-AzStorageContainer -Prefix $prefixName -IncludeDeleted `
    -Context $ctx | ? { $_.IsDeleted } | Restore-AzStorageContainer
```

The results display all containers with the prefix **demo** which have been restored.

```Results
    Storage Account Name: demostorageaccount

Name                 PublicAccess         LastModified                   IsDeleted  VersionId        
----                 ------------         ------------                   ---------  ---------        
loop-container3                                                                                       
loop-container4               
```

## See also

- [Run PowerShell commands with Microsoft Entra credentials to access blob data](./authorize-data-operations-powershell.md)
- [Create a storage account](../common/storage-account-create.md?tabs=azure-portal&toc=/azure/storage/blobs/toc.json)
