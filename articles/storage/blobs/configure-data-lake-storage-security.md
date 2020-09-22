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

### What is the best way to apply ACLs?

Always use Azure AD security groups as the assigned principal in ACLs. Resist the opportunity to directly assign individual users or service principals. Using this structure will allow you to add and remove users or service principals without the need to reapply ACLs to an entire directory structure. Instead, you simply need to add or remove them from the appropriate Azure AD security group. Keep in mind that ACLs are not inherited and so reapplying ACLs requires updating the ACL on every file and subdirectory. 

Once a security group is assigned permissions, adding or removing users from the group doesn’t require any updates to Data Lake Storage Gen2. This also helps ensure you don't exceed the maximum number of access control entries per access control list (ACL). Currently, that number is 32, (including the four POSIX-style ACLs that are always associated with every file and directory): the owning user, the owning group, the mask, and other. Each directory can have two types of ACL, the access ACL and the default ACL, for a total of 64 access control entries.

### Which permissions are required to recursively delete a directory and its contents?

## Best practice: set permissions on groups not individual users

In general, you should assign permissions to [groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups) and not individual users or service principals. There's a few reasons for this:

The number of RBAC role assignments permitted in a subscription is limited. For the latest information about those limits, see [Role assignments](https://docs.microsoft.com/azure/role-based-access-control/overview#role-assignments).

Changes to an ACL take time to propagate through the system if the number of affected files is large. Also, there's a limit of **32** ACL entries for each directory and file. 

If group security principals together, you can change the access level of multiple security principals by changing only one ACL entry.

If the security principal is a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), it's important to use the object ID of the service principal and not the object ID of the related app registration. 

To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <your-app-id> --query objectId`. Make sure to replace the `<your-app-id>` placeholder with the App ID of your app registration.

### How do I set ACLs correctly for a service principal?

When you define ACLs for service principals, it's important to use the Object ID (OID) of the *service principal* for the app registration that you created. It's important to note that registered apps have a separate service principal in the specific Azure AD tenant. Registered apps have an OID that's visible in the Azure portal, but the *service principal* has another (different) OID.

To get the OID for the service principal that corresponds to an app registration, you can use the `az ad sp show` command. Specify the Application ID as the parameter. Here's an example on obtaining the OID for the service principal that corresponds to an app registration with App ID = 18218b12-1895-43e9-ad80-6e8fc1ea88ce. Run the following command in the Azure CLI:

```azurecli
az ad sp show --id 18218b12-1895-43e9-ad80-6e8fc1ea88ce --query objectId
```

OID will be displayed.

When you have the correct OID for the service principal, go to the Storage Explorer **Manage Access** page to add the OID and assign appropriate permissions for the OID. Make sure you select **Save**.

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