---
title: Work with blob containers from PowerShell
titleSuffix: Azure Storage
description: Learn how to ... (do this last)
services: storage
author: stevenmatthew

ms.service: storage
ms.topic: how-to
ms.date: 11/04/2021
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

The following example lists all blob storage containers and their associated blobs. Blobs stored in containers configured for anonymous access can be read, but access requests for secured containers must be authorized. You can read more about this topic in the [Authorize access to blobs](authorize-access-azure-active-directory.md) article.

In this example, you will assign yourself the Azure role-based access control (Azure RBAC) built-in `Storage Blob Data Reader` role to obtain access to the blob containers.

To assign yourself this role, you need to define three elements: your security principal, the role definition, and the access scope.

### Step 1: obtain your user object ID

To assign yourself a role, you'll need to get your user principal name (UPN), such as *user\@contoso.com* or the user object ID. The ID has the format: `nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn`. To get the object ID, you can use [Get-AzADUser](/powershell/module/az.resources/get-azaduser).

```azurepowershell
(Get-AzADUser -DisplayName '<Display Name>').Id
```



### Step 2: Select the appropriate role

Permissions are grouped together into roles. You can select from a list of several [Azure built-in roles](../../role-based-access-control/built-in-roles.md) or you can use your own custom roles. It's a best practice to grant access with the least privilege that is needed, so avoid assigning a broader role.

To list roles and get the unique role ID, you can use [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition).

```azurepowershell
Get-AzRoleDefinition | FT Name, IsCustom, Id
```

Here's how to list the details of a particular role.

```azurepowershell
Get-AzRoleDefinition <roleName>
```

For more information, see [List Azure role definitions](role-definitions-list.md#azure-powershell).

### Step 3: Identify the needed scope

Azure provides four levels of scope: resource, [resource group](../azure-resource-manager/management/overview.md#resource-groups), subscription, and [management group](../governance/management-groups/overview.md). It's a best practice to grant access with the least privilege that is needed, so avoid assigning a role at a broader scope. For more information about scope, see [Understand scope](scope-overview.md).

For resource scope, you need the resource ID for the resource. You can find the resource ID by looking at the properties of the resource in the Azure portal. A resource ID has the following format.

```
/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/<providerName>/<resourceType>/<resourceSubType>/<resourceName>
```

### Step 4: Assign role

To assign a role, use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. Depending on the scope, the command typically has one of the following formats.

```azurepowershell
New-AzRoleAssignment -ObjectId <objectId> `
-RoleDefinitionName <roleName> `
-Scope /subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/<providerName>/<resourceType>/<resourceSubType>/<resourceName>
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