---
title: Access control model for Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn how to configure container, directory, and file-level access in accounts that have a hierarchical namespace. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/16/2020
ms.author: normesta
---

# Access control model in Azure Data Lake Storage Gen2

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

ACLs give you the ability to apply "finer grain" level of access to directories and files. An ACL is a permission construct that contains a series of ACL entries. Each ACL entry associates security principal with an access level.  To learn more, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## How permissions are evaluated

During security principal-based authorization, permissions are evaluated in the following order.

:one:&nbsp;&nbsp; RBAC role assignments are evaluated first and take priority over any ACL assignments.

:two:&nbsp;&nbsp; If the operation is fully authorized based on RBAC role assignment, then ACLs are not evaluated at all.

:three:&nbsp;&nbsp; If the operation is not fully authorized, then ACLs are evaluated.

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

## Scenario table

The following table lists some common scenarios to help you understand which permissions are needed to perform certain operations on a storage account.

|    Operation             | Assigned RBAC role               |    /        | Oregon/     | Portland/ | Data.txt |             
|--------------------------|----------------------------------|-------------|-------------|-----------|----------|
| Read Data.txt            |   Storage Blob Data Owner        |   ---       |   ---       |  ---      | ---      |  
|                          |   Storage Blob Data Contributor  |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   ---       |  ---      | ---      |
|                          |   None                           |   --X       |   --X       |  --X      | R--      |
| Append to Data.txt       |   Storage Blob Data Owner        |   ---       |  ---        | ---       | ---      |
|                          |   Storage Blob Data Contributor  |   ---       |  ---        | ---       | ---      |
|                          |   Storage Blob Data Reader       |   ---       |  ---        | ---       | -W-      |
|                          |   None                           |   --X       |  --X        | --X       | RW-      |
| Delete Data.txt          |   Storage Blob Data Owner        |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Contributor  |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   ---       |  -WX      | ---      |
|                          |   None                           |   --X       |   --X       |  -WX      | ---      |
| Create Data.txt          |   Storage Blob Data Owner        |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Contributor  |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   ---       |  -W-      | ---      |
|                          |   None                           |   --X       |   --X       |  -WX      | ---      |
| List /                   |   Storage Blob Data Owner        |   ----      |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Contributor  |  ---        |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   ---       |  ---      | ---      |
|                          |   None                           |   R-X       |   ---       |  ---      | ---      |
| List /Oregon/            |   Storage Blob Data Owner        |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Contributor  |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   --        |  ---      | ---      |
|                          |   None                           |   --X       |   R-X       |  ---      | ---      |
| List /Oregon/Portland/   |   Storage Blob Data Owner        |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Contributor  |   ---       |   ---       |  ---      | ---      |
|                          |   Storage Blob Data Reader       |   ---       |   ---       |  ---      | ---      |
|                          |   None                           |   --X       |   --X       |  R-X      | ---      |

Key takeaways:

- You need execute permissions (--X) on all directories leading to the desired content.
- To list contents of a directory, that directory needs read and execute (R-X).
- To read the contents of a file, the file needs read permission (R--.)
- To use Azure Storage explorer to see container and files, you must give Read access to the root folder (R--).
- To list all containers in the account, you need any of these:
  - Super user access - Shared key or Storage Blob Data Owner.
  - Reader role to see containers + appropriate ACL permissions to list directories or read files.
  - Storage Blob Data Reader + appropriate ACL permissions to give write permissions if you want.

## Next steps

Set up groups, assign RBAC roles, and apply ACLs. See [Configure access permission to containers, directories, and files in Azure Data Lake Storage Gen2](configure-data-lake-storage-security.md).

