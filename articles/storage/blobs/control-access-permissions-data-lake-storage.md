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

## Role-based access control (RBAC)

RBAC uses role assignments to apply sets of permissions to [security principals](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal). A security principal is an object that represents a user, group, service principal, or managed identity that is defined in Azure Active Directory (AD). A permission set can give a security principal a "coarse-grain" level of access such as read or write access to **all** of the data in a storage account or **all** of the data in a container. 

The following roles permit a security principal to access data in a storage account. 

|Role|Description|
|--|--|
| [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Full access to Blob storage containers and data. This access permits the security principal to set the owner an item, and to modify the ACLs of all items. |
| [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Read, write, and delete access to Blob storage containers and blobs. This access does not permit the security principal to set the ownership of an item, but it can modify the ACL of items that are owned by the security principal. |
| [Storage Blob Data Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) | Read and list Blob storage containers and blobs. |

Roles such as [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner), [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor), [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) and [Storage Account Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-contributor) permit a security principal to manage a storage account, but do not provide access to the data within that account. However, these roles (excluding **Reader**) can obtain access to the storage keys which can be used in various client tools to access the data.

## Access control lists (ACLs)

ACLs give you the ability to apply "finer grain" level of access to directories and files. An ACL is a permission construct that contains a series of ACL entries. Each ACL entry associates security principal with an access level. 

In general, these conditions are true.

- To traverse through directories, the security principal must have execute permissions on each directory.
- To list the contents of a directory, the security principal must have read and execute permissions on teh directory and execute permissions on all directories leading to that directory.
- To read a file, execute on all folders leading to the file and read access on the file.

The following table lists some common scenarios to help you understand which permissions are needed to perform certain operations on a storage account.

|    Operation             |    /    | Oregon/ | Portland/ | Data.txt     |
|--------------------------|---------|----------|-----------|--------------|
| Read Data.txt            |   Execute   |   Execute    |  Execute      | Read          |
| Append to Data.txt       |   Execute   |   Execute    |  Execute      | Read and Write          |
| Delete Data.txt          |   Execute   |   Execute    |  Write and Execute      | None          |
| Create Data.txt          |   Execute   |   Execute    |  Write and Execute      | None          |
| List /                   |   Read and Execute   |   None    |  None      | None          |
| List /Oregon/           |   Execute   |   Read and Execute    |  None      | None          |
| List /Oregon/Portland/  |   Execute   |   Execute    |  Read and Execute      | None          |


For a complete reference on ACLs in Data Lake Storage Gen2, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## How permissions are evaluated

During security principal-based authorization, permissions are evaluated in the following order.

1. RBAC role assignments are evaluated first and take priority over any ACL assignments.

2. If the operation is fully authorized based on RBAC role assignment, then ACLs are not evaluated at all.

3. If the operation is not fully authorized, then ACLs are evaluated.

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow.png)

Based on this model, choose RBAC roles that provide a basic minimal level of access, and then use ACLs to grant **elevated** access permissions to directories and files. Because of the way that access permissions are evaluated by the system, you cannot use an ACL to restrict access that has already been granted by a role assignment. The system evaluates RBAC role assignments before it evaluates ACLs. If the assignment grants sufficient access permission, ACLs are ignored. 

### Example: Request to list directory contents

If the security principal has been assigned the role of **Storage Blob Data Owner**, **Storage Blob Data Contributor**, or **Storage Blob Data Reader**, access is granted. Otherwise, the system checks the ACL. If an ACL entry gives the security principal read and execute permission to the directory, and execute permission on all parent directories in the hierarchy, access is granted.  

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow-list.png)

### Example: Request to read a file

If the security principal has been assigned the role of **Storage Blob Data Owner**, **Storage Blob Data Contributor**, or **Storage Blob Data Reader**, access is granted. Otherwise, the system checks the ACL. If an ACL entry gives the security principal read permission to the file and execute permission to the directory and all parent directories in the hierarchy, access is granted.  

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow-read-file.png)

### Example: Request to create or a delete a file

If the security principal has been assigned the role of **Storage Blob Data Owner** or **Storage Blob Data Contributor**, access is granted. 

If the security principal has been assigned the role of **Storage Blob Data Reader**, the system checks the ACL. If an ACL entry gives the security principal write and execute permission to the directory, then access is granted. 

If the security principal doesn't have any of these roles assigned to it, the system checks the ACL. If an ACL entry gives the security principal write and execute permission to the directory and execute permission to the directory and all parent directories in the hierarchy, access is granted.  

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow-create-delete-file.png)

## Best practice: set permissions on groups not individual users

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

The number of RBAC role assignments permitted in a subscription is limited. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments).

Changes to an ACL take time to propagate through the system if the number of affected files is large. Also, there's a limit of **32** ACL entries for each directory and file. 

If group security principals together, you can change the access level of multiple security principals by changing only one ACL entry. 

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

## Get started

If you're ready to get started, here's some guidance.

## See also

* [Overview of Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md)
