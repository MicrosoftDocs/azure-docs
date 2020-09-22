---
title: Grant access permissions in Azure Data Lake Storage Gen2  | Microsoft Docs
description: Learn how to configure directory, and file-level access in accounts that have a hierarchical namespace.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 09/09/2020
ms.author: normesta
ms.reviewer: jamsbak
---

# Grant access to directories, and files in Azure Data Lake Storage Gen2

Grant access to directories and files by using Azure role-based access control (RBAC) and access control lists (ACLs). You can use either of these mechanisms alone or use them together. 

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.

- An understanding of RBAC and ACLs, and how the system evaluates them together to make authorization decisions. See [Access control model](data-lake-storage-access-control-model.md).

## Step 1: Create security groups

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

First, using groups reduces the risk of exceeding the number of allowed RBAC role assignments in a subscription. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments). Also, for each directory or file, there's a limit of **32** ACL entries. After the four default entries, that leaves only **28** remaining for permission assignments. If you have to provide access to more than **28** named users, you'll exceed the number of allowed entries. 

If you group security principals together, you can change the access level of multiple security principals by changing only one ACL entry. It's also far easier to add and remove users and service principals. You can do so without the need to reapply ACLs to an entire directory structure. Instead, you simply need to add or remove them from the appropriate Azure AD security group. Keep in mind that ACLs are not inherited and so reapplying ACLs requires updating the ACL on every file and subdirectory. 

Decide how best to group users, service principals, and managed identities. Some recommended groups to start with might be **ReadOnlyUsers**, **WriteAccessUsers**, and **FullAccessUsers** for the root of the container, and even separate ones for key subdirectories. If there are any other anticipated groups of users that might be added later, but have not been identified yet, you might consider creating dummy security groups that have access to certain folders. Using security group ensures that you can avoid long processing time when assigning new permissions to thousands of files.

Something here about how you can nest groups by adding groups to other groups.

To create a group and add members, see [Create a basic group and add members using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

### Correctly identify service principals

If you plan to grant permission to a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) or add a service principal to a group, it's important to use the object ID of the service principal and not the object ID of the related app registration. 

To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <your-app-id> --query objectId`. Make sure to replace the `<your-app-id>` placeholder with the App ID of your app registration.

## Step 2: Plan your approach

Decide whether to use RBAC only, RBAC and ACLs together, or just ACLs alone. To learn about how the system evaluates RBAC and ACL permissions to make authorization decisions, see [Access control model](data-lake-storage-access-control-model.md). 

If you decide to use RBAC, choose RBAC roles that provide the minimal level of required access, and then use ACLs to grant **elevated** access permissions to directories and files. Because of the way that access permissions are evaluated by the system, you **cannot** use an ACL to **restrict** access that has already been granted by a role assignment. The system evaluates RBAC role assignments before it evaluates ACLs. If the assignment grants sufficient access permission, ACLs are ignored. 

To see a table that shows how to grant access to common tasks by using any combination of RBAC and ACLs, see [Permissions table: Combining RBAC and ACL](data-lake-storage-access-control-model.md#permissions-table-combining-rbac-and-acl).

## Step 3: Assign RBAC roles

To assign roles, your [security principal](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal) needs to have the [Owner](../../role-based-access-control/built-in-roles.md#owner) role assigned to it. 

See any of these articles to create role assignments:

- [Use the Azure portal to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-portal.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
- [Use PowerShell to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-powershell.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
- [Use Azure CLI to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-cli?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[!NOTE] A guest user can't create a role assignment.

## Step 4: Set ACLs

To set ACLs, your [security principal](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal) needs to have the [Blob Storage Data Owner](../../role-based-access-control/built-in-roles.md#blob-storage-data-owner) role assigned to it. Alternatively, you can use Shared Key authorization, which provides you with *super user* access to the storage account.
 
To modify an individual ACL, see any of these tools or SDKs:

|Tools|SDKs|
|---|---|
|  [Azure Storage Explorer](data-lake-storage-explorer.md#managing-access)  |  [.NET](data-lake-storage-directory-file-acl-dotnet.md#manage-access-control-lists-acls)  |
|  [PowerShell](data-lake-storage-directory-file-acl-powershell.md#manage-access-control-lists-acls)|  [Java](data-lake-storage-directory-file-acl-java.md#manage-access-control-lists-acls)|
|  [Azure CLI](data-lake-storage-directory-file-acl-cli.md#manage-access-control-lists-acls)|  [Python](data-lake-storage-directory-file-acl-python.md#manage-access-control-lists-acls)|
|  |  [JavaScript](data-lake-storage-directory-file-acl-javascript.md#manage-access-control-lists-acls)|
|  |  [REST](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update)|

To apply ACLs recursively to all of the items in a directory hierarchy, see [Set access control lists (ACLs) recursively for Azure Data Lake Storage Gen2(preview)](recursive-access-control-lists.md).

## Next steps

- [Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration.md)
- [Query acceleration SQL language reference](query-acceleration-sql-reference.md)