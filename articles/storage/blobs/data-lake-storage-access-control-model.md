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

Roles such as [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner), [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor), [Reader, and [Storage Account Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-account-contributor) permit a security principal to manage a storage account, but do not provide access to the data within that account. However, these roles (excluding **Reader**) can obtain access to the storage keys, which can be used in various client tools to access the data.

## Access control lists (ACLs)

ACLs give you the ability to apply "finer grain" level of access to directories and files. An ACL is a permission construct that contains a series of ACL entries. Each ACL entry associates security principal with an access level.  To learn more, see [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## How permissions are evaluated

During security principal-based authorization, permissions are evaluated in the following order.

:one:&nbsp;&nbsp; RBAC role assignments are evaluated first and take priority over any ACL assignments.

:two:&nbsp;&nbsp; If the operation is fully authorized based on RBAC role assignment, then ACLs are not evaluated at all.

:three:&nbsp;&nbsp; If the operation is not fully authorized, then ACLs are evaluated.

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-flow.png)

Based on this model, choose RBAC roles that provide the minimal level of required access, and then use ACLs to grant **elevated** access permissions to directories and files. Because of the way that access permissions are evaluated by the system, you **cannot** use an ACL to **restrict** access that has already been granted by a role assignment. The system evaluates RBAC role assignments before it evaluates ACLs. If the assignment grants sufficient access permission, ACLs are ignored. 

The following diagram shows the permission flow for three common operations: listing directory contents, reading a file, and writing a file.

> [!div class="mx-imgBorder"]
> ![data lake storage permission flow example](./media/control-access-permissions-data-lake-storage/data-lake-storage-permissions-example.png)

## Permissions table: Combining RBAC and ACL

The following table shows you how to combine RBAC roles and ACL entries so that a security principal can perform the operations listed in the **Operation** column. 
This table shows a column that represents each level of a fictitious directory hierarchy. There's a column for the root directory of the container (`\`), a subdirectory named **Oregon**, a subdirectory of the Oregon directory named **Portland**, and a text file in the Portland directory named **Data.txt**. Appearing in those columns are [short form](data-lake-storage-access-control.md#short-forms-for-permission) representations of the ACL entry required to grant permissions. 

|    Operation             | Assigned RBAC role               |    /        | Oregon/     | Portland/ | Data.txt |             
|--------------------------|----------------------------------|-------------|-------------|-----------|----------|
| Read Data.txt            |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |  
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   None                           |   `--X`       |   `--X`       |  `--X`      | `R--`      |
| Append to Data.txt       |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `---`      | `-W-`      |
|                          |   None                           |   `--X`       |   `--X`       |  `--X`      | `RW-`      |
| Delete Data.txt          |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `-WX`      | `---`      |
|                          |   None                           |   `--X`       |   `--X`       |  `-WX`      | `---`      |
| Create Data.txt          |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `-W-`      | `---`      |
|                          |   None                           |   `--X`       |   `--X`       |  `-WX`      | `---`      |
| List /                   |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   None                           |   `R-X`       |   `---`       |  `---`      | `---`      |
| List /Oregon/            |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   None                           |   `--X`       |   `R-X`       |  `---`      | `---`      |
| List /Oregon/Portland/   |   Storage Blob Data Owner        |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Contributor  |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   Storage Blob Data Reader       |   `---`       |   `---`       |  `---`      | `---`      |
|                          |   None                           |   `--X`       |   `--X`       |  `R-X`      | `---`      |

## Permissions required to use Azure Storage Explorer

To view the contents of a container, security principals must (at a minimum) have read access (R--) to the root folder (`\`) of a container. This level of permission does give the security principal the ability to list the contents of the root folder. Alternatively, you can assign them [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader) role. With that role, the security principal can connect to the account by using Storage Explorer. They'll be able to see the containers in the account, but not container contents. You can then grant access to specific directories and files by using ACLs.   

## Best practices

### Use security groups

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

First, using groups reduces the risk of exceeding the number of allowed RBAC role assignments in a subscription. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments). Also, for each directory or file, there's a limit of **32** ACL entries. After the four default entries, that leaves only **28** remaining for permission assignments. If you have to provide access to more than **28** named users, you'll exceed the number of allowed entries. 

If you group security principals together, you can change the access level of multiple security principals by changing only one ACL entry. It's also far easier to add and remove users and service principals. You can do so without the need to reapply ACLs to an entire directory structure. Instead, you simply need to add or remove them from the appropriate Azure AD security group. Keep in mind that ACLs are not inherited and so reapplying ACLs requires updating the ACL on every file and subdirectory. 

Decide how best to group users, service principals, and managed identities. Some recommended groups to start with might be **ReadOnlyUsers**, **WriteAccessUsers**, and **FullAccessUsers** for the root of the container, and even separate ones for key subdirectories. If there are any other anticipated groups of users that might be added later, but have not been identified yet, you might consider creating dummy security groups that have access to certain folders. Using security group ensures that you can avoid long processing time when assigning new permissions to thousands of files.

Something here about how you can nest groups by adding groups to other groups.

To create a group and add members, see [Create a basic group and add members using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

### Correctly identify service principals

If you plan to grant permission to a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) or add a service principal to a group, it's important to use the object ID of the service principal and not the object ID of the related app registration. 

To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <your-app-id> --query objectId`. Make sure to replace the `<your-app-id>` placeholder with the App ID of your app registration.

## Next steps

To learn more about access control lists, see  [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

