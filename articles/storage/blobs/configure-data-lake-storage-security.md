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

Intro goes here.

## Prerequisites

- To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A **general-purpose v2** storage account. see [Create a storage account](../common/storage-quickstart-create-account.md).
- Ensure you have correct permissions
Blob data owner if using an AD security principal.

Contributor can work but only directories and files owned by that entity

Access key also works. This gives you 'super-user' access, meaning full access to all operations on all resources, including setting owner and changing ACLs.

[!NOTE] A guest user can't create a role assignment.

### Create security groups

Set up groups. Point to guidance.

## Best practice: set permissions on groups not individual users

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

The number of RBAC role assignments permitted in a subscription is limited. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments).

Changes to an ACL take time to propagate through the system if the number of affected files is large. Also, there's a limit of **32** ACL entries for each directory and file. 

If group security principals together, you can change the access level of multiple security principals by changing only one ACL entry.

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

## Next steps

- [Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration.md)
- [Query acceleration SQL language reference](query-acceleration-sql-reference.md)