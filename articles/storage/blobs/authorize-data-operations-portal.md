---
title: Authorize access to blob data in the Azure portal
titleSuffix: Azure Storage
description: When you access blob data using the Azure portal, the portal makes requests to Azure Storage under the covers. These requests to Azure Storage can be authenticated and authorized using either your Azure AD account or the storage account access key.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/10/2021
ms.author: akashdubey
ms.reviewer: nachakra
ms.custom: contperf-fy21q1
---

# Choose how to authorize access to blob data in the Azure portal

When you access blob data using the [Azure portal](https://portal.azure.com), the portal makes requests to Azure Storage under the covers. A request to Azure Storage can be authorized using either your Azure AD account or the storage account access key. The portal indicates which method you are using, and enables you to switch between the two if you have the appropriate permissions.

You can also specify how to authorize an individual blob upload operation in the Azure portal. By default the portal uses whichever method you are already using to authorize a blob upload operation, but you have the option to change this setting when you upload a blob.

## Permissions needed to access blob data

Depending on how you want to authorize access to blob data in the Azure portal, you'll need specific permissions. In most cases, these permissions are provided via Azure role-based access control (Azure RBAC). For more information about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md).

### Use the account access key

To access blob data with the account access key, you must have an Azure role assigned to you that includes the Azure RBAC action **Microsoft.Storage/storageAccounts/listkeys/action**. This Azure role may be a built-in or a custom role. Built-in roles that support **Microsoft.Storage/storageAccounts/listkeys/action** include the following, in order from least to greatest permissions:

- The [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access) role
- The [Storage Account Contributor role](../../role-based-access-control/built-in-roles.md#storage-account-contributor)
- The Azure Resource Manager [Contributor role](../../role-based-access-control/built-in-roles.md#contributor)
- The Azure Resource Manager [Owner role](../../role-based-access-control/built-in-roles.md#owner)

When you attempt to access blob data in the Azure portal, the portal first checks whether you have been assigned a role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the portal uses the account key for accessing blob data. If you have not been assigned a role with this action, then the portal attempts to access data using your Azure AD account.

> [!IMPORTANT]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is not permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users must use Azure AD credentials to access blob data in the portal. For information about accessing blob data in the portal with Azure AD, see [Use your Azure AD account](#use-your-azure-ad-account).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, including the **Microsoft.Storage/storageAccounts/listkeys/action**, so a user with one of these administrative roles can also access blob data with the account key. For more information, see [Azure roles, Azure AD roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Use your Azure AD account

To access blob data from the Azure portal using your Azure AD account, both of the following statements must be true for you:

- You have been assigned either a built-in or custom role that provides access to blob data.
- You have been assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.

The Azure Resource Manager **Reader** role permits users to view storage account resources, but not modify them. It does not provide read permissions to data in Azure Storage, but only to account management resources. The **Reader** role is necessary so that users can navigate to blob containers in the Azure portal.

For information about the built-in roles that support access to blob data, see [Authorize access to blobs using Azure Active Directory](authorize-access-azure-active-directory.md).

Custom roles can support different combinations of the same permissions provided by the built-in roles. For more information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md) and [Understand role definitions for Azure resources](../../role-based-access-control/role-definitions.md).

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

## Default to Azure AD authorization in the Azure portal

When you create a new storage account, you can specify that the Azure portal will default to authorization with Azure AD when a user navigates to blob data. You can also configure this setting for an existing storage account. This setting specifies the default authorization method only, so keep in mind that a user can override this setting and choose to authorize data access with the account key.

To specify that the portal will use Azure AD authorization by default for data access when you create a storage account, follow these steps:

1. Create a new storage account, following the instructions in [Create a storage account](../common/storage-account-create.md).
1. On the **Advanced** tab, in the **Security** section, check the box next to **Default to Azure Active Directory authorization in the Azure portal**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-create-portal.png" alt-text="Screenshot showing how to configure default Azure AD authorization in Azure portal for new account":::

1. Select the **Review + create** button to run validation and create the account.

To update this setting for an existing storage account, follow these steps:

1. Navigate to the account overview in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Set **Default to Azure Active Directory authorization in the Azure portal** to **Enabled**.

    :::image type="content" source="media/authorize-data-operations-portal/default-auth-account-update-portal.png" alt-text="Screenshot showing how to configure default Azure AD authorization in Azure portal for existing account":::

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to blob data](assign-azure-role-data-access.md)
