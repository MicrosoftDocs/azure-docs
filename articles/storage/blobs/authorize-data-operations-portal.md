---
title: Choose how to authorize access to blob data in the Azure portal
titleSuffix: Azure Storage
description: When you access blob data using the Azure portal, the portal makes requests to Azure Storage under the covers. These requests to Azure Storage can be authenticated and authorized using either your Azure AD account or the storage account access key.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/10/2021
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: blobs
ms.custom: contperf-fy21q1
---

# Choose how to authorize access to blob data in the Azure portal

When you access blob data using the [Azure portal](https://portal.azure.com), the portal makes requests to Azure Storage under the covers. A request to Azure Storage can be authorized using either your Azure AD account or the storage account access key. The portal indicates which method you are using, and enables you to switch between the two if you have the appropriate permissions.  

You can also specify how to authorize an individual blob upload operation in the Azure portal. By default the portal uses whichever method you are already using to authorize a blob upload operation, but you have the option to change this setting when you upload a blob.

## Permissions needed to access blob data

Depending on how you want to authorize access to blob data in the Azure portal, you'll need specific permissions. In most cases, these permissions are provided via Azure role-based access control (Azure RBAC). For more information about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Use the account access key

To access blob data with the account access key, you must have an Azure role assigned to you that includes the Azure RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This Azure role may be a built-in or a custom role. Built-in roles that support **Microsoft.Storage/storageAccounts/listkeys/action** include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

When you attempt to access blob data in the Azure portal, the portal first checks whether you have been assigned a role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the portal uses the account key for accessing blob data. If you have not been assigned a role with this action, then the portal attempts to access data using your Azure AD account.

> [!IMPORTANT]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is not permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users must use Azure AD credentials to access blob data in the portal. For information about accessing blob data in the portal with Azure AD, see [Use your Azure AD account](#use-your-azure-ad-account).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, including the **Microsoft.Storage/storageAccounts/listkeys/action**, so a user with one of these administrative roles can also access blob data with the account key. For more information, see [Classic subscription administrator roles, Azure roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Use your Azure AD account

To access blob data from the Azure portal using your Azure AD account, both of the following statements must be true for you:

- You have been assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.
- You have been assigned either a built-in or custom role that provides access to blob data.

The **Reader** role assignment or another Azure Resource Manager role assignment is necessary so that the user can view and navigate storage account management resources in the Azure portal. The Azure roles that grant access to blob data do not grant access to storage account management resources. To access blob data in the portal, the user needs permissions to navigate storage account resources. For more information about this requirement, see [Assign the Reader role for portal access](../common/storage-auth-aad-rbac-portal.md#assign-the-reader-role-for-portal-access).

The built-in roles that support access to your blob data include:

- [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner): For POSIX access control for Azure Data Lake Storage Gen2.
- [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor): Read/write/delete permissions for blobs.
- [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader): Read-only permissions for blobs.

Custom roles can support different combinations of the same permissions provided by the built-in roles. For more information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and [Understand role definitions for Azure resources](../../role-based-access-control/role-definitions.md).

> [!IMPORTANT]
> The preview version of Storage Explorer in the Azure portal does not support using Azure AD credentials to view and modify blob data. Storage Explorer in the Azure portal always uses the account keys to access data. To use Storage Explorer in the Azure portal, you must be assigned a role that includes **Microsoft.Storage/storageAccounts/listkeys/action**.

## Navigate to blobs in the Azure portal

To view blob data in the portal, navigate to the **Overview** for your storage account, and click on the links for **Blobs**. Alternatively you can navigate to the **Containers** section in the menu.

:::image type="content" source="media/authorize-data-operations-portal/blob-access-portal.png" alt-text="Screenshot showing how to navigate to blob data in the Azure portal":::

## Determine the current authentication method

When you navigate to a container, the Azure portal indicates whether you are currently using the account access key or your Azure AD account to authenticate.

### Authenticate with the account access key

If you are authenticating using the account access key, you'll see **Access Key** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-access-key.png" alt-text="Screenshot showing user currently accessing containers with the account key":::

To switch to using Azure AD account, click the link highlighted in the image. If you have the appropriate permissions via the Azure roles that are assigned to you, you'll be able to proceed. However, if you lack the right permissions, you'll see an error message like the following one:

:::image type="content" source="media/authorize-data-operations-portal/auth-error-azure-ad.png" alt-text="Error shown if Azure AD account does not support access":::

Notice that no blobs appear in the list if your Azure AD account lacks permissions to view them. Click on the **Switch to access key** link to use the access key for authentication again.

### Authenticate with your Azure AD account

If you are authenticating using your Azure AD account, you'll see **Azure AD User Account** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-azure-ad.png" alt-text="Screenshot showing user currently accessing containers with Azure AD account":::

To switch to using the account access key, click the link highlighted in the image. If you have access to the account key, then you'll be able to proceed. However, if you lack access to the account key, you'll see an error message like the following one:

:::image type="content" source="media/authorize-data-operations-portal/auth-error-access-key.png" alt-text="Error shown if you do not have access to account key":::

Notice that no blobs appear in the list if you do not have access to the account keys. Click on the **Switch to Azure AD User Account** link to use your Azure AD account for authentication again.

## Specify how to authorize a blob upload operation

When you upload a blob from the Azure portal, you can specify whether to authenticate and authorize that operation with the account access key or with your Azure AD credentials. By default, the portal uses the current authentication method, as shown in [Determine the current authentication method](#determine-the-current-authentication-method).

To specify how to authorize a blob upload operation, follow these steps:

1. In the Azure portal, navigate to the container where you wish to upload a blob.
1. Select the **Upload** button.
1. Expand the **Advanced** section to display the advanced properties for the blob.
1. In the **Authentication Type** field, indicate whether you want to authorize the upload operation by using your Azure AD account or with the account access key, as shown in the following image:

    :::image type="content" source="media/authorize-data-operations-portal/auth-blob-upload.png" alt-text="Screenshot showing how to change authorization method on blob upload":::

## Next steps

- [Authenticate access to Azure blobs and queues using Azure Active Directory](../common/storage-auth-aad.md)
- [Use the Azure portal to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-portal.md)
- [Use the Azure CLI to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-cli.md)
- [Use the Azure PowerShell module to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-powershell.md)
