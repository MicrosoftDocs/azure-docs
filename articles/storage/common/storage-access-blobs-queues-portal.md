---
title: Use the Azure portal to access blob or queue data - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/19/2019
ms.author: tamram
ms.subservice: common
---

# Use the Azure portal to access blob or queue data

When you access blob or queue data using the Azure portal, the portal makes requests to Azure Storage under the covers. These requests to Azure Storage can be authenticated and authorized using either your Azure AD credentials or the account access key. The portal indicates which authentication method you are using, and enables you to switch between the two if you have the appropriate permissions.  

## Permissions needed to access blob or queue data

Depending on how you want to authenticate access blob or queue data in the Azure portal, you'll need specific permissions. In most cases, these permissions are provided via role-based access control (RBAC). For more information about RBAC, see [What is role-based access control (RBAC)?](../../role-based-access-control/overview.md).

### Account access key

To access blob and queue data with the account access key, one of the following two statements must be true for you:

1. You are the owner of the storage account. In this case, you can always access data with your account key. 
1. An RBAC role has been assigned to you that includes the RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This RBAC role may be a built-in or a custom role. 

The built-in RBAC roles that support **Microsoft.Storage/storageAccounts/listkeys/action** action are:
    - The [Storage Account Key Operator Service](../../role-based-access-control/built-in-roles.md#storage-account-key-operator-service-role) role.
    - The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role. This role includes the wildcard **Microsoft.Storage/storageAccounts/\*** actions, so it also supports **Microsoft.Storage/storageAccounts/listkeys/action**.
    
The Azure portal attempts to authenticate access to blob and queue data with the account key first. If you do not have permissions to access data with the account key, then the Azure portal attempts to authenticate access with the user's Azure AD credentials. 

### Azure AD credentials

To access blob or queue data from the Azure portal using your Azure AD credentials, both of the following statements must be true for you:

1. You have been assigned either a built-in or custom role that provides access to blobs or queue. 
1. You have been assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher.

The built-in roles that support access to your blob or queue data include:
    - [Storage Blob Data Owner (Preview)](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner-preview): For POSIX access control for Azure Data Lake Storage Gen2 (preview).
    - [Storage Blob Data Contributor (Preview)](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor-preview): Read/write/delete permissions for blobs.
    - [Storage Blob Data Reader (Preview)](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader-preview): Read-only permissions for blobs.
    - [Storage Queue Data Contributor (Preview)](../../role-based-access-control/built-in-roles.md#storage-queue-data-contributor-preview): Read/write/delete permissions for queues.
    - [Storage Queue Data Reader (Preview)](../../role-based-access-control/built-in-roles.md#storage-queue-data-reader-preview): Read-only permissions for queues.

The **Reader** role permits users to view storage account resources in the Azure portal, but not to modify them. The **Reader** role does not provide read permissions to data in Azure Storage, but only to account management resources. Without the **Reader** role, you cannot navigate to blob or queue data in the Azure portal. For more information about the Reader role, see [Assign the Reader role for portal access](../common/storage-auth-aad-rbac.md#assign-the-reader-role-for-portal-access).

## Navigate to blobs or queues in the portal

To view blob or queue data in the portal, navigate to the **Overview** for your storage account, and click on the links for **Blobs** or **Queues**. 

![Navigate to blob or queue data in the Azure portal](media/storage-access-blobs-queues-portal/blob-queue-access.png)

## Determine the current authentication method

When you navigate to a container or a queue, the Azure portal indicates whether you are currently using the account access key or your Azure AD credentials to authenticate.

The examples in this section show accessing a container and its blobs, but the portal displays the same message when you are accessing a queue and its messages.

### Account access key

If you are authenticating using the account access key, you'll see the access key specified as the authentication method in the portal:

![Currently accessing container data with the account key](media/storage-access-blobs-queues-portal/auth-method-access-key.png)

To switch to using Azure AD credentials, click the link highlighted in the image. If you have the appropriate permissions via the RBAC roles that are assigned to you, you'll be able to proceed. However, if you lack the right permissions, you'll see an error message like the following one:

![Error shown if Azure AD credentials do not support access](media/storage-access-blobs-queues-portal/auth-error-azure-ad.png)

Notice that no blobs appear in the list if your Azure AD credentials lack permissions to view them. Click on the **Switch to access key** link to use the access key for authentication again.

### Azure AD credentials

If you are authenticating using your Azure AD credentials, you'll see Azure AD credentials specified as the authentication method in the portal:

![Currently accessing container data with Azure AD credentials](media/storage-access-blobs-queues-portal/auth-method-azure-ad.png)

To switch to using the account access key, click the link highlighted in the image. If you have access to the account key, then you'll be able to proceed. However, if you lack access to the account key, you'll see an error message like the following one:

![Error shown if you do not have access to account key](media/storage-access-blobs-queues-portal/auth-error-access-key.png)

Notice that no blobs appear in the list if you do not have access to the account keys. Click on the **Switch to Azure AD User Account** link to use your Azure AD credentials for authentication again.

## Next steps

- [Authenticate access to Azure blobs and queues using Azure Active Directory (Preview)](storage-auth-aad.md)
- [Grant access to Azure containers and queues with RBAC in the Azure portal (preview)](storage-auth-aad-rbac.md)