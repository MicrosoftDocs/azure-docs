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

You can control access to the data in your account by using Azure role-based access control (RBAC) and access control lists (ACLs). This article describes both mechanisms, and how the system evaluates them together to make authorization decisions.  

## Role based access control (RBAC)

RBAC uses role assignments to apply sets of permissions to [security principals](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal). A security principal is an object that represents a user, group, service principal, or managed identity that is defined in Azure Active Directory (AD). A permission set can give a security principal a "coarse-grain" level of access such as read or write access to **all** of the data in a storage account or **all** of the data in a container. 

### RBAC roles: Management vs data

Azure Storage has two layers of access: management and data. Subscriptions and storage accounts are accessed through the management layer. Containers, blobs, and other data resources are accessed through the data layer. For example, if you want to get a list of your storage accounts from Azure, you send a request to the management endpoint. If you want a list of blob containers in an account, you send a request to the appropriate service endpoint.

RBAC roles can contain permissions for management or data layer access. The **Reader** role, for example, grants read-only access to management layer resources.

Only roles explicitly defined for data access permit a security principal to access blob or queue data. Roles such as **Owner**, **Contributor**, **Reader** and **Storage Account Contributor** permit a security principal to manage a storage account, but do not provide access to the blob or queue data within that account. However, these roles (excluding **Reader**) can obtain access to the storage keys which can be used in various client tools to access the data.

### Built-in management roles

|Role|Description|
|--|--|
| [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) | Manage everything, including access to management layer resources. |
| [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) | Manage everything, excluding access to management layer resources. |
| [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) | Read and list management layer resources. |
| [Storage Account Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-contributor) | Full management of storage accounts. |

### Built-in data roles

|Role|Description|
|--|--|
| [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Full access to Blob storage containers and data. This access permits the security principal to set the owner an item, and to modify the ACLs of all items. |
| [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Read, write, and delete access to Blob storage containers and blobs. This access does not permit the security principal to set the ownership of an item, but it can modify the ACL of items that are owned by the security principal. |
| [Storage Blob Data Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) | Read and list Blob storage containers and blobs. |

### Assigning the least privileged RBAC role

For each security principal, choose an RBAC role that provides a basic minimal level of access, and then use ACLs to grant **elevated** access permissions to directories and files. Because of the way that access permissions are evaluated by the system, you cannot use an ACL to restrict access that has already been granted by a role assignment. The system evaluates RBAC role assignments before it evaluates ACLs. If the assignment grants sufficient access permission, ACLs are ignored. 

## Access control lists (ACLs)

You can use ACLs to restrict access to specific directories and files. All directories and files have an ACL. An ACL is a permission construct that contains a series of ACL entries. Each ACL entry associates security principal with an access level. To restrict access to an item (directory or file), you can add an entry to the ACL of that time which associates a security principal with a permission set. For a detailed explanation of ACLs, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## How RBAC role assignments and ACLs are evaluated

During security principal-based authorization, permissions are evaluated in the following order.

1. RBAC role assignments are evaluated first and take priority over any ACL assignments.

2. If the operation is fully authorized based on RBAC role assignment, then ACLs are not evaluated at all.

3. If the operation is not fully authorized, then ACLs are evaluated.

This evaluation order excludes Shared Key and SAS authentication methods in which no identity is associated with the operation and assumes that the storage account is accessible via appropriate networking configuration. It also excludes scenarios in which the security principal has been assigned the **Storage Blob Data Owner** built-in role which provides super-user access. 

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow.png)

### Listing operations

Image goes here

### Read operation

Image goes here

### Write operation

Image goes here

## Assigning roles to groups

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

The number of RBAC role assignments permitted in a subscription is limited. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments).

Changes to an ACL take time to propagate through the system if the number of affected files is large. Also, there's a limit of **32** ACL entries for each directory and file. 

If group security principals together, you can change the access level of multiple security principals by changing only one ACL entry. 

## Get started

If you're ready to get started, here's some guidance.

### Create security groups

Set up groups. Point to guidance.

If the security principal is a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), it's important to use the object ID of the service principal and not the object ID of the related app registration. 

To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <your-app-id> --query objectId`. Make sure to replace the `<your-app-id>` placeholder with the App ID of your app registration.

### Assign RBAC roles

You can use the [Azure portal](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-portal?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Azure CLI](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-cli?toc=/azure/storage/blobs/toc.json), or [PowerShell](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-powershell?toc=/azure/storage/blobs/toc.json) to assign a role to a security principal.

### Set ACLs

You modify the ACL of individual items or modify the ACL of entire hierarchies of items.

#### Modify the ACL of a single item

To set ACLs, you'll need either the account key or a security principal that has been assigned the appropriate RBAC role. See the built-in data role table earlier in this article.

Modify the ACL of an individual directory or file by using any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|[Azure Storage Explorer](data-lake-storage-explorer.md#managing-access)|[.NET](data-lake-storage-directory-file-acl-dotnet.md#manage-access-control-lists-acls)|
|[PowerShell](data-lake-storage-directory-file-acl-powershell.md#manage-access-control-lists-acls)|[Java](data-lake-storage-directory-file-acl-java.md#manage-access-control-lists-acls)|
|[Azure CLI](data-lake-storage-directory-file-acl-cli.md#manage-access-control-lists-acls)|[Python](data-lake-storage-directory-file-acl-python.md#manage-directory-permissions)|
||[JavaScript](data-lake-storage-directory-file-acl-javascript.md#manage-access-control-lists-acls)|
||[REST](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update)|

#### Modify ACLs recursively (preview)

If you want to change the ACLs of all items in a hierarchy of folders, you can use an API specifically designed to accomplish that task. By using that API, you can update ACLs recursively to the child items of a directory without having to update the ACL of each item individually. 

To modify ACLs recursively, see [Set access control lists (ACLs) recursively for Azure Data Lake Storage Gen2](recursive-access-control-lists.md).

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
