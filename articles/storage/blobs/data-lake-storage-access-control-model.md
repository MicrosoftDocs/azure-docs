---
title: Access control model for Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn how to configure container, directory, and file-level access in accounts that have a hierarchical namespace. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 10/16/2020
ms.author: normesta
---

# Access control model in Azure Data Lake Storage Gen2

Data Lake Storage Gen2 supports the following authorization mechanisms:

- Shared Key authorization
- Shared access signature (SAS) authorization
- Role-based access control (Azure RBAC)
- Access control lists (ACL)

[Shared Key and SAS authorization](#shared-key-and-shared-access-signature-sas-authorization) grants access to a user (or application) without requiring them to have an identity in Azure Active Directory (Azure AD). With these two forms of authentication, Azure RBAC and ACLs have no effect.

Azure RBAC and ACL both require the user (or application) to have an identity in Azure AD.  Azure RBAC lets you grant "coarse-grain" access to storage account data, such as read or write access to **all** of the data in a storage account, while ACLs let you grant "fine-grained" access, such as write access to a specific directory or file.  

This article focuses on Azure RBAC and ACLs, and how the system evaluates them together to make authorization decisions for storage account resources.

<a id="role-based-access-control"></a>

## Role-based access control (Azure RBAC)

Azure RBAC uses role assignments to apply sets of permissions to [security principals](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal). A security principal is an object that represents a user, group, service principal, or managed identity that is defined in Azure Active Directory (AD). A permission set can give a security principal a "coarse-grain" level of access such as read or write access to **all** of the data in a storage account or **all** of the data in a container. 

The following roles permit a security principal to access data in a storage account. 

|Role|Description|
|--|--|
| [Storage Blob Data Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Full access to Blob storage containers and data. This access permits the security principal to set the owner an item, and to modify the ACLs of all items. |
| [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner) | Read, write, and delete access to Blob storage containers and blobs. This access does not permit the security principal to set the ownership of an item, but it can modify the ACL of items that are owned by the security principal. |
| [Storage Blob Data Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) | Read and list Blob storage containers and blobs. |

Roles such as [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner), [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor), [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader), and [Storage Account Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-contributor) permit a security principal to manage a storage account, but do not provide access to the data within that account. However, these roles (excluding **Reader**) can obtain access to the storage keys, which can be used in various client tools to access the data.

## Access control lists (ACLs)

ACLs give you the ability to apply "finer grain" level of access to directories and files. An *ACL* is a permission construct that contains a series of *ACL entries*. Each ACL entry associates security principal with an access level.  To learn more, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## How permissions are evaluated

During security principal-based authorization, permissions are evaluated in the following order.

:one:&nbsp;&nbsp; Azure RBAC role assignments are evaluated first and take priority over any ACL assignments.

:two:&nbsp;&nbsp; If the operation is fully authorized based on Azure RBAC role assignment, then ACLs are not evaluated at all.

:three:&nbsp;&nbsp; If the operation is not fully authorized, then ACLs are evaluated.

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow.png)

Because of the way that access permissions are evaluated by the system, you **cannot** use an ACL to **restrict** access that has already been granted by a role assignment. That's because the system evaluates Azure RBAC role assignments first, and if the assignment grants sufficient access permission, ACLs are ignored. 

The following diagram shows the permission flow for three common operations: listing directory contents, reading a file, and writing a file.

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow example](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-example.png)

## Permissions table: Combining Azure RBAC and ACL

The following table shows you how to combine Azure RBAC roles and ACL entries so that a security principal can perform the operations listed in the **Operation** column. 
This table shows a column that represents each level of a fictitious directory hierarchy. There's a column for the root directory of the container (`/`), a subdirectory named **Oregon**, a subdirectory of the Oregon directory named **Portland**, and a text file in the Portland directory named **Data.txt**. Appearing in those columns are [short form](data-lake-storage-access-control.md#short-forms-for-permissions) representations of the ACL entry required to grant permissions. **N/A** (_Not applicable_) appears in the column if an ACL entry is not required to perform the operation.

|    Operation             | Assigned RBAC role               |    /        | Oregon/     | Portland/ | Data.txt |             
|--------------------------|----------------------------------|-------------|-------------|-----------|----------|
| Read Data.txt            |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |  
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | N/A      | N/A      | N/A       | N/A    |
|                          |   None                           | `--X`    | `--X`    | `--X`     | `R--`  |
| Append to Data.txt       |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | `--X`    | `--X`    | `--X`     | `-W-`  |
|                          |   None                           | `--X`    | `--X`    | `--X`     | `RW-`  |
| Delete Data.txt          |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | `--X`    | `--X`    | `-WX`     | N/A    |
|                          |   None                           | `--X`    | `--X`    | `-WX`     | N/A    |
| Create Data.txt          |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | `--X`    | `--X`    | `-WX`     | N/A    |
|                          |   None                           | `--X`    | `--X`    | `-WX`     | N/A    |
| List /                   |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | N/A      | N/A      | N/A       | N/A    |
|                          |   None                           | `R-X`    | N/A      | N/A       | N/A    |
| List /Oregon/            |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | N/A      | N/A      | N/A       | N/A    |
|                          |   None                           | `--X`    | `R-X`    | N/A       | N/A    |
| List /Oregon/Portland/   |   Storage Blob Data Owner        | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Contributor  | N/A      | N/A      | N/A       | N/A    |
|                          |   Storage Blob Data Reader       | N/A      | N/A      | N/A       | N/A    |
|                          |   None                           | `--X`    | `--X`    | `R-X`     | N/A    |


> [!NOTE] 
> To view the contents of a container in Azure Storage Explorer, security principals must [sign into Storage Explorer by using Azure AD](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows#add-a-resource-via-azure-ad), and (at a minimum) have read access (R--) to the root folder (`\`) of a container. This level of permission does give them the ability to list the contents of the root folder. If you don't want the contents of the root folder to be visible, you can assign them [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role. With that role, they'll be able to list the containers in the account, but not container contents. You can then grant access to specific directories and files by using ACLs.   

## Security groups

[!INCLUDE [Security groups](../../../includes/azure-storage-data-lake-groups.md)]

## Limits on Azure RBAC role assignments and ACL entries

By using groups, you're less likely to exceed the maximum number of role assignments per subscription and the maximum number of ACl entries per file or directory. The following table describes these limits.

[!INCLUDE [Security groups](../../../includes/azure-storage-data-lake-rbac-acl-limits.md)] 

## Shared Key and Shared Access Signature (SAS) authorization

Azure Data Lake Storage Gen2 also supports [Shared Key](https://docs.microsoft.com/rest/api/storageservices/authorize-with-shared-key) and [SAS](https://docs.microsoft.com/azure/storage/common/storage-sas-overview?toc=/azure/storage/blobs/toc.json) methods for authentication. A characteristic of these authentication methods is that no identity is associated with the caller and therefore security principal permission-based authorization cannot be performed.

In the case of Shared Key, the caller effectively gains 'super-user' access, meaning full access to all operations on all resources including data, setting owner, and changing ACLs.

SAS tokens include allowed permissions as part of the token. The permissions included in the SAS token are effectively applied to all authorization decisions, but no additional ACL checks are performed.

## Next steps

To learn more about access control lists, see  [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

