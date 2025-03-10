---
title: Authorize access to blob data in the Azure portal
titleSuffix: Azure Storage
description: When you access blob data using the Azure portal, the portal makes requests to Azure Storage under the covers. These requests to Azure Storage can be authenticated and authorized using either your Microsoft Entra account or the storage account access key.
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 02/06/2025
ms.reviewer: nachakra
---

# Choose how to authorize access to blob data in the Azure portal

When you access blob data using the [Azure portal](https://portal.azure.com), the portal makes requests to Azure Storage under the covers. A request to Azure Storage can be authorized using either your Microsoft Entra account or the storage account access key. The portal indicates which method you're using, and enables you to switch between the two if you have the appropriate permissions.

## Permissions needed to access blob data

Depending on how you want to authorize access to blob data in the Azure portal, you need specific permissions. In most cases, these permissions are provided via Azure role-based access control (Azure RBAC). For more information about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Use the account access key

To access blob data with the account access key, you must have an Azure role assigned to you that includes the Azure RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This Azure role can be a built-in or a custom role.

The following built-in roles, listed from least to greatest permissions, support **Microsoft.Storage/storageAccounts/listkeys/action**:

- [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access)
- [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor)
- Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor)
- Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner)

When you attempt to access blob data in the Azure portal, the portal first checks whether you have been assigned a role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the portal uses the account key for accessing blob data. If you haven't been assigned a role with this action, then the portal attempts to access data using your Microsoft Entra account.

> [!IMPORTANT]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation isn't permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users must use Microsoft Entra credentials to access blob data in the portal. For information about accessing blob data in the portal with Microsoft Entra ID, see [Use your Microsoft Entra account](#use-your-azure-ad-account).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, including the **Microsoft.Storage/storageAccounts/listkeys/action**, so a user with one of these administrative roles can also access blob data with the account key. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

<a name='use-your-azure-ad-account'></a>

### Use your Microsoft Entra account

To access blob data from the Azure portal using your Microsoft Entra account, both of the following statements must be true for you:

- You're assigned either a built-in or custom role that provides access to blob data.
- You're assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.

The Azure Resource Manager **Reader** role permits users to view storage account resources, but not modify them. It doesn't provide read permissions to data in Azure Storage, but only to account management resources. The **Reader** role is necessary so that users can navigate to blob containers in the Azure portal.

For information about the built-in roles that support access to blob data, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

Custom roles can support different combinations of the same permissions provided by the built-in roles. For more information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and [Understand role definitions for Azure resources](../../role-based-access-control/role-definitions.md).

## Navigate to blobs in the Azure portal

To view blob data in the portal, navigate to the **Overview** for your storage account, and select on the links for **Blobs**. Alternatively you can navigate to the **Containers** section in the menu.

:::image type="content" source="media/authorize-data-operations-portal/blob-access-portal.png" alt-text="Screenshot showing how to navigate to blob data in the Azure portal":::

## Determine the current authentication method

When you navigate to a container, the Azure portal indicates whether you're currently using the account access key or your Microsoft Entra account to authenticate.

### Authenticate with the account access key

If you're authenticating using the account access key, you see **Access Key** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-access-key.png" alt-text="Screenshot showing user currently accessing containers with the account key":::

If you want to switch to use the Microsoft Entra account, select the link highlighted in the image. If you have the appropriate permissions via the Azure roles that are assigned to you, you're able to proceed. If you don't have the right permissions, you see an error message and no blobs appear in the list.

Select the **Switch to access key** link to use the access key for authentication again.

<a name='authenticate-with-your-azure-ad-account'></a>

### Authenticate with your Microsoft Entra account

If you're authenticating using your Microsoft Entra account, you see **Microsoft Entra user Account** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-azure-ad.png" alt-text="Screenshot showing user currently accessing containers with Microsoft Entra account":::

If you want to switch to use the account access key, select the link highlighted in the image. If you have access to the account key, then you're able to proceed. If you don't have access to the account key, you see an error message and no blobs appear in the list.

Select the **Switch to Microsoft Entra user account** link to use your Microsoft Entra account for authentication again.

<a name='default-to-azure-ad-authorization-in-the-azure-portal'></a>

## Default to Microsoft Entra authorization in the Azure portal

When you create a new storage account, you can specify that the Azure portal defaults to authorization with Microsoft Entra ID when a user navigates to blob data. You can also configure this setting for an existing storage account. This setting specifies the default authorization method only, so keep in mind that a user can override this setting and choose to authorize data access with the account key.

To specify that the portal should use Microsoft Entra authorization by default for data access when you create a storage account, follow these steps:

1. Create a new storage account, following the instructions in [Create a storage account](../common/storage-account-create.md).
1. On the **Advanced** tab, in the **Security** section, check the box next to **Default to Microsoft Entra authorization in the Azure portal**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-create-portal.png" alt-text="Screenshot showing how to configure default Microsoft Entra authorization in Azure portal for new account":::

1. Select the **Review + create** button to run validation and create the account.

To update this setting for an existing storage account, follow these steps:

1. Navigate to the account overview in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Set **Default to Microsoft Entra authorization in the Azure portal** to **Enabled**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-update-portal.png" alt-text="Screenshot showing how to configure default Microsoft Entra authorization in Azure portal for existing account":::

The **defaultToOAuthAuthentication** property of a storage account isn't set by default and doesn't return a value until you explicitly set it.

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to blob data](assign-azure-role-data-access.md)
