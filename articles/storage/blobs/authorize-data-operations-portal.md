---
title: Authorize access to blob data in the Azure portal
titleSuffix: Azure Storage
description: Learn how to authorize access to blob data in the Azure portal using either your Microsoft Entra account or the storage account access key.
author: normesta
ms.author: normesta
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/18/2026
ms.reviewer: nachakra
ms.custom: sfi-image-nochange
# Customer intent: As a cloud administrator, I want to authorize access to blob data using Microsoft Entra or account access key, so that I can manage permissions and ensure secure data access within the Azure portal.
---

# Choose how to authorize access to blob data in the Azure portal

When you access blob data by using the [Azure portal](https://portal.azure.com), the portal makes requests to Azure Storage on your behalf. You can authorize a request to Azure Storage by using either your Microsoft Entra account or the storage account access key. The portal shows which method you're using, and if you have the right permissions, you can switch between the two methods.

## Permissions needed to access blob data

You need specific permissions depending on how you want to authorize access to blob data in the Azure portal. In most cases, Azure RBAC provides these permissions. For more information about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)

### Use the account access key

To access blob data by using the account access key, you must have an Azure role assigned to you that includes the Azure RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This Azure role can be a built-in role or a custom role.

The following built-in roles, listed from least to greatest permissions, support **Microsoft.Storage/storageAccounts/listkeys/action**:

- [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access)
- [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor)
- Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor)
- Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner)

When you attempt to access blob data in the Azure portal, the portal first checks whether you're assigned a role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have a role with this action, the portal uses the account key to access blob data. If you don't have a role with this action, the portal tries to access data by using your Microsoft Entra account.

> [!IMPORTANT]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation isn't permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users must use Microsoft Entra credentials to access blob data in the portal. For information about accessing blob data in the portal with Microsoft Entra ID, see [Use your Microsoft Entra account](#use-your-azure-ad-account).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, including the **Microsoft.Storage/storageAccounts/listkeys/action**, so a user with one of these administrative roles can also access blob data by using the account key. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

<a name='use-your-azure-ad-account'></a>

### Use your Microsoft Entra account

To access blob data from the Azure portal by using your Microsoft Entra account, both of the following statements must be true for you:

- You're assigned either a built-in or custom role that provides access to blob data. Built-in data-access roles include [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader), [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor), and [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner).
- You're assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.

The Azure Resource Manager **Reader** role is a management-plane role that lets you view storage account resources, but not modify them. It only grants access to account management resources, not to data in Azure Storage. The **Reader** role is necessary so that you can navigate to blob containers in the Azure portal, but on its own it doesn't authorize access to blob data. To read or write blob data, you also need a data-plane role such as **Storage Blob Data Reader** or **Storage Blob Data Contributor**.

For information about the built-in roles that support access to blob data, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

Custom roles can support different combinations of the same permissions provided by the built-in roles. For more information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and [Understand role definitions for Azure resources](../../role-based-access-control/role-definitions.md).

## Navigate to blobs in the Azure portal

To view blob data in the portal, use either of the following paths:

- On the storage account **Overview** page, select the **Blobs** tile in the **Properties** tab.
- In the storage account's left menu, expand **Data storage**, and then select **Containers**.

:::image type="content" source="media/authorize-data-operations-portal/blob-access-portal.png" alt-text="Screenshot of how to navigate to blob data in the Azure portal.":::

## Determine the current authentication method

When you navigate to a container, the Azure portal indicates whether you're currently using the account access key or your Microsoft Entra account to authenticate.

### Authenticate with the account access key

If you authenticate by using the account access key, you see **Access Key** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-access-key.png" alt-text="Screenshot of user currently accessing containers with the account key.":::

To switch to the Microsoft Entra account, select the link highlighted in the preceding image. If your assigned Azure roles grant the appropriate permissions, you can proceed. If you don't have the right permissions, you see an error message and no blobs appear in the list.

Select the **Switch to access key** link to use the access key for authentication again.

<a name='authenticate-with-your-azure-ad-account'></a>

### Authenticate with your Microsoft Entra account

If you authenticate by using your Microsoft Entra account, you see **Microsoft Entra user Account** specified as the authentication method in the portal:

:::image type="content" source="media/authorize-data-operations-portal/auth-method-azure-ad.png" alt-text="Screenshot of user currently accessing containers with Microsoft Entra account.":::

To switch to the account access key, select the link highlighted in the preceding image. If you have access to the account key, you can proceed. If you don't have access to the account key, you see an error message and no blobs appear in the list.

Select the **Switch to Microsoft Entra user account** link to use your Microsoft Entra account for authentication again.

<a name='default-to-azure-ad-authorization-in-the-azure-portal'></a>

## Default to Microsoft Entra authorization in the Azure portal

When you create a new storage account, you can specify that the Azure portal defaults to authorization with Microsoft Entra ID when a user navigates to blob data. You can also configure this setting for an existing storage account. This setting specifies the default authorization method only, so a user can override this setting and choose to authorize data access with the account key.

To make the portal use Microsoft Entra authorization by default when you create a storage account, follow these steps:

1. Create a new storage account, following the instructions in [Create a storage account](../common/storage-account-create.md).
1. On the **Advanced** tab, in the **Security** section, check the box next to **Default to Microsoft Entra authorization in the Azure portal**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-create-portal.png" alt-text="Screenshot of how to configure default Microsoft Entra authorization in Azure portal for a new account.":::

1. Select the **Review + create** button to run validation and create the account.

To update this setting for an existing storage account, follow these steps:

1. Navigate to the account overview in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Set **Default to Microsoft Entra authorization in the Azure portal** to **Enabled**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-update-portal.png" alt-text="Screenshot of how to configure default Microsoft Entra authorization in Azure portal for an existing account.":::

The **defaultToOAuthAuthentication** property of a storage account isn't set by default and doesn't return a value until you explicitly set it.

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to blob data](assign-azure-role-data-access.md)
