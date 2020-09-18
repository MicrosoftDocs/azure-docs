---
title: Controlling access to data in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn how to configure container, directory, and file-level access in accounts that have a hierarchical namespace. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/16/2020
ms.author: normesta
---

# Controlling access to data in Azure Data Lake Storage Gen2

You can control access to the data in your account by using Azure role-based access control and access control lists. 

Role-based access control lets you grant access to top-level resources such as a storage or a container. Access control lists give you the ability to control access to specific directories and files. This article describes both mechanisms and how you can use them together to secure data in your account.  

## Role based access control (RBAC)

RBAC lets you control access to top-level resources such as a storage account or a containers. You can assign roles [security principals](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal). These roles define which operations the security principal can perform such as reading or writing data.  

Azure Storage provides two layers of access: the management layer, and the data layer. A security principal can access subscriptions and storage accounts by using the management layer, and access containers, blobs, and other data resources by using the data layer. For example, if a user wants to get a list of their storage accounts, they would send a request to the management endpoint. If they wanted a list of blob containers in one of those accounts, they would send a request to the appropriate service endpoint.

An RBAC role can provide access to either the management layer or the data layer. For example, the Reader role grants read-only access to management layer resources.

### Built-in management roles

The following table lists the built-in management roles. These roles permit a security principal to manage a storage account, but do not provide access to the blob or queue data within that account. 

|Role|Description|
|--|--|
| [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) | Manage everything, including access to resources. |
| [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) | Manage everything, excluding access to resources. |
| [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) | Read and list resources. |
| [Storage Account Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-contributor) | Full management of storage accounts. |

> [!TIP] 
> All roles except for the Reader role can obtain access to the storage keys which can be used in various client tools to access the data.

### Built-in data roles

The following table lists the built-in data roles. These roles are explicitly defined for data access and permit a security principal to access blob or queue data.

|Role|Description|
|--|--|
| [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Full access to Blob storage containers and data. This access permits the security principal to set the owner an item, and to modify the ACLs of all items. |
| [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Read, write, and delete access to Blob storage containers and blobs. This access does not permit the security principal to set the ownership of an item, but it can modify the ACL of items that are owned by the security principal. |
| [Storage Blob Data Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) | Read and list Blob storage containers and blobs. |

You can use the [Azure portal](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-portal?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Azure CLI](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-cli?toc=/azure/storage/blobs/toc.json), or [PowerShell](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-powershell?toc=/azure/storage/blobs/toc.json) to assign a role to a security principal.

## Access control lists (ACLs)

You can use ACLs to restrict access to specific directories and files. All directories and files have an ACL. An ACL is a permission construct that contains a series of ACL entries. Each ACL entry associates user with an access level. To restrict access to an item (directory or file), you can add an entry to the ACL of that time which associates a security principal with a permission set. To learn more about the anatomy of an ACL and how to apply them, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

To set ACLs, you'll need either the account key or a security principal that has been assigned the appropriate RBAC role. See the built-in data role table earlier in this article. 

### Modify the ACL of a single item

Modify the ACL of an individual directory or file by using any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|[Azure Storage Explorer](data-lake-storage-explorer.md#managing-access)|[.NET](data-lake-storage-directory-file-acl-dotnet.md#manage-a-directory-acl)|
|[PowerShell](data-lake-storage-directory-file-acl-powershell.md#manage-access-permissions)|[Java](data-lake-storage-directory-file-acl-java.md#manage-a-directory-acl)|
|[Azure CLI](data-lake-storage-directory-file-acl-cli.md#manage-permissions)|[Python](data-lake-storage-directory-file-acl-python.md#manage-directory-permissions)|
||[JavaScript](data-lake-storage-directory-file-acl-javascript.md#manage-a-directory-acl)|
||[REST](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update)|

### Modify ACLs recursively (preview)

If you want to change the ACLs of all items in a hierarchy of folders, you can use an API specifically designed to accomplish that task. By using that API, you can update ACLs recursively to the child items of a directory without having to update the ACL of each item individually. 

To modify ACLs recursively, see [Set access control lists (ACLs) recursively for Azure Data Lake Storage Gen2](recursive-access-control-lists.md).

### Service principals: Find the correct object ID

If the security principal is a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), it's important to use the object ID of the service principal and not the object ID of the related app registration. 

To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <your-app-id> --query objectId`. Make sure to replace the `<your-app-id>` placeholder with the App ID of your app registration.

## Assigning permissions to groups

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

The number of RBAC role assignments permitted in a subscription is limited. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments).

Changes to an ACL take time to propagate through the system if the number of affected files is large. Also, there's a limit of **32** ACL entries for each directory and file. 

If group security principals together, you can change the access level of multiple security principals by changing only one ACL entry. 

## How access to data is evaluated

During security principal-based authorization, permissions are evaluated in the following order.

1. RBAC is evaluated first and takes priority over any ACL assignments.

2. If the operation is fully authorized based on RBAC then ACLs are not evaluated at all.

3. If the operation is not fully authorized then ACLs are evaluated.

This evaluation order excludes Shared Key and SAS authentication methods in which no identity is associated with the operation and assumes that the storage account is accessible via appropriate networking configuration. It also excludes scenarios in which the security principal has been assigned the Storage Blob Data Owner built-in role which provides super-user access. 

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow.png)

If access is granted based on role assignment, then the ACL is ignored. Therefore, you can't use an ACL to grant a level of access that is lower than a level granted by a role assignment. 

If access is denied based on role assignment, then the ACL is evaluated. Therefore, you can use an ACL to grant elevated access to an item.

The ACL is also evaluated in cases where there are no relevant roles assigned to the security principal. This means that you don't have to use RBAC at all. If you don't use RBAC as part of your permission model, you'll have to set your ACLs up a certain way to ensure that users can traverse the directories in your containers and see the contents of those directories. See the example scenarios in the next section.

### Listing operations

Image goes here

### Read operation

Image goes here

### Write operation

Image goes here


## Example scenarios

Here's a few scenarios

•	See containers in ASE
•	List containers in a storage account
•	List contents of directory but no access to files
•	Read access to a specific file

Scenario: You want to give access for users to use Storage Explorer to look through files

Because of the way that ASE mounts containers, you must provide read access to the root folder of the container. From there, you can provide either execute only (if you want the user to be able to traverse the hierarchy to the desired file or B) Read access to directories if you want them to see files in directories but not read files or C) Read access to all items in directories.
Good tip from James:
"Regarding how the R permission is propagated to child directories, you need to consider the role of ‘default’ permissions (described in the same doc). 

In this particular case, you may not want defaults to propagate from the root to top-level directories. You may want to manually set permissions (and defaults) on the top-level directories & not apply a default to the root. This will allow you, for instance, to grant Chris the ability to see all of the top-level directories, but not see any of the contents (except folder1) and as he clicks down the directory structure, he will only be able to click down where he has R permission (the other top-level directories he won’t have R)"

Scenario: You want to enumerate the containers in a storage account

List all containers in the account. You need to have either super user access or Blob Data Reader. If you don’t want folks to have read access of directories and files, you can give them “reader” access. Then use ACLs to control which directories and files they can see (if you want them to see any)
ACL only – won’t work because it won’t grant access to view containers in the account.
Option A: Grant “Reader” role if you just want folks to see containers.  Then grant ACLs beyond that for whatever read or list permission you want them to have.
Option B: Grant “Data Reader” role and they can list and also read any file in the hierarchy. You can then give ACLs to provide write permissions wherever you want.

Scenario: You want to provide the ability to list contents of a container without allowing read on blob data
Read on root folder of container. 

Scenario: You want to set the ACL of a file.

Scenario: You want users to traverse through system but only see files in one folder

Execute on all folders but not read on any of the folders that you don't want folks to see the files. Apply read only to the folder that you want users to see the files. Read on a folder lets you list files. Read on a file lets you read the file.


## See also

* [Overview of Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md)
