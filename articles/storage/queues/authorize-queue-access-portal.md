---
title: Choose how to authorize access to queue data in the Azure portal
titleSuffix: Azure Storage
description: When you access queue data using the Azure portal, the portal makes requests to Azure Storage under the covers. These requests to Azure Storage can be authenticated and authorized using either your Azure AD account or the storage account access key.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/08/2020
ms.author: tamram
ms.reviewer: ozguns
ms.subservice: queues
ms.custom: contperfq1
---

# Choose how to authorize access to queue data in the Azure portal

When you access queue data using the [Azure portal](https://portal.azure.com), the portal makes requests to Azure Storage under the covers. A request to Azure Storage can be authorized using either your Azure AD account or the storage account access key. The portal indicates which method you are using, and enables you to switch between the two if you have the appropriate permissions.  

## Permissions needed to access queue data

Depending on how you want to authorize access to queue data in the Azure portal, you'll need specific permissions. In most cases, these permissions are provided via Azure role-based access control (Azure RBAC). For more information about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Use the account access key

To access queue data with the account access key, you must have an Azure role assigned to you that includes the Azure RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This Azure role may be a built-in or a custom role. Built-in roles that support **Microsoft.Storage/storageAccounts/listkeys/action** include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

When you attempt to access queue data in the Azure portal, the portal first checks whether you have been assigned a role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the portal uses the account key for accessing queue data. If you have not been assigned a role with this action, then the portal attempts to access data using your Azure AD account.

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, including the **Microsoft.Storage/storageAccounts/listkeys/action**, so a user with one of these administrative roles can also access queue data with the account key. For more information, see [Classic subscription administrator roles, Azure roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Use your Azure AD account

To access queue data from the Azure portal using your Azure AD account, both of the following statements must be true for you:

- You have been assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.
- You have been assigned either a built-in or custom role that provides access to queue data.

The **Reader** role assignment or another Azure Resource Manager role assignment is necessary so that the user can view and navigate storage account management resources in the Azure portal. The Azure roles that grant access to queue data do not grant access to storage account management resources. To access queue data in the portal, the user needs permissions to navigate storage account resources. For more information about this requirement, see [Assign the Reader role for portal access](../common/storage-auth-aad-rbac-portal.md#assign-the-reader-role-for-portal-access).

The built-in roles that support access to your queue data include:

- [Storage Queue Data Contributor](../../role-based-access-control/built-in-roles.md#storage-queue-data-contributor): Read/write/delete permissions for queues.
- [Storage Queue Data Reader](../../role-based-access-control/built-in-roles.md#storage-queue-data-reader): Read-only permissions for queues.

Custom roles can support different combinations of the same permissions provided by the built-in roles. For more information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and [Understand role definitions for Azure resources](../../role-based-access-control/role-definitions.md).

Listing queues with a classic subscription administrator role is not supported. To list queues, a user must have assigned to them the Azure Resource Manager **Reader** role, the **Storage Queue Data Reader** role, or the **Storage Queue Data Contributor** role.

> [!IMPORTANT]
> The preview version of Storage Explorer in the Azure portal does not support using Azure AD credentials to view and modify queue data. Storage Explorer in the Azure portal always uses the account keys to access data. To use Storage Explorer in the Azure portal, you must be assigned a role that includes **Microsoft.Storage/storageAccounts/listkeys/action**.

## Navigate to queues in the Azure portal

To view queue data in the portal, navigate to the **Overview** for your storage account, and click on the links for **Queues**. Alternatively you can navigate to the **Queue service** sections in the menu.

:::image type="content" source="media/authorize-queue-access-portal/queue-access-portal.png" alt-text="Screenshot showing how to navigate to queue data in the Azure portal":::

## Determine the current authentication method

When you navigate to a queue, the Azure portal indicates whether you are currently using the account access key or your Azure AD account to authenticate.

### Authenticate with the account access key

If you are authenticating using the account access key, you'll see **Access Key** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-queue-access-portal/auth-method-access-key.png" alt-text="Screenshot showing user currently accessing queues with the account key":::

To switch to using Azure AD account, click the link highlighted in the image. If you have the appropriate permissions via the Azure roles that are assigned to you, you'll be able to proceed. However, if you lack the right permissions, you'll see an error message like the following one:

:::image type="content" source="media/authorize-queue-access-portal/auth-error-azure-ad.png" alt-text="Error shown if Azure AD account does not support access":::

Notice that no queues appear in the list if your Azure AD account lacks permissions to view them. Click on the **Switch to access key** link to use the access key for authentication again.

### Authenticate with your Azure AD account

If you are authenticating using your Azure AD account, you'll see **Azure AD User Account** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-queue-access-portal/auth-method-azure-ad.png" alt-text="Screenshot showing user currently accessing queues with Azure AD account":::

To switch to using the account access key, click the link highlighted in the image. If you have access to the account key, then you'll be able to proceed. However, if you lack access to the account key, the Azure portal displays an error message.

Queues are not listed in the portal if you do not have access to the account keys. Click on the **Switch to Azure AD User Account** link to use your Azure AD account for authentication again.

## Next steps

- [Authenticate access to Azure blobs and queues using Azure Active Directory](../common/storage-auth-aad.md)
- [Use the Azure portal to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-portal.md)
- [Use the Azure CLI to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-cli.md)
- [Use the Azure PowerShell module to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-powershell.md)
