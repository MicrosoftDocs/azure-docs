---
title: Configure anonymous read access for containers and blobs
titleSuffix: Azure Storage
description: Learn how to allow or disallow anonymous access to blob data for the storage account. Set the container's anonymous access setting to make containers and blobs available for anonymous access.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/12/2023
ms.author: akashdubey
ms.reviewer: nachakra
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
---

# Configure anonymous read access for containers and blobs

Azure Storage supports optional anonymous read access for containers and blobs. By default, anonymous access to your data is never permitted. Unless you explicitly enable anonymous access, all requests to a container and its blobs must be authorized. When you configure a container's access level setting to permit anonymous access, clients can read data in that container without authorizing the request.

> [!WARNING]
> When a container is configured for anonymous access, any client can read data in that container. Anonymous access presents a potential security risk, so if your scenario does not require it, we recommend that you remediate anonymous access for the storage account.

This article describes how to configure anonymous read access for a container and its blobs. For information about how to remediate anonymous access for optimal security, see one of these articles:

- [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](anonymous-read-access-prevent.md)
- [Remediate anonymous read access to blob data (classic deployments)](anonymous-read-access-prevent-classic.md)

## About anonymous read access

Anonymous access to your data is always prohibited by default. There are two separate settings that affect anonymous access:

1. **Anonymous access setting for the storage account.** An Azure Resource Manager storage account offers a setting to allow or disallow anonymous access for the account. Microsoft recommends disallowing anonymous access for your storage accounts for optimal security.

    When anonymous access is permitted at the account level, blob data is not available for anonymous read access unless the user takes the additional step to explicitly configure the container's anonymous access setting.

1. **Configure the container's anonymous access setting.** By default, a container's anonymous access setting is disabled, meaning that authorization is required for every request to the container or its data. A user with the appropriate permissions can modify a container's anonymous access setting to enable anonymous access only if anonymous access is allowed for the storage account.

The following table summarizes how the two settings together affect anonymous access for a container.

|  | Anonymous access level for the container is set to Private (default setting) | Anonymous access level for the container is set to Container | Anonymous access level for the container is set to Blob |
|--|--|--|--|
| **Anonymous access is disallowed for the storage account** | No anonymous access to any container in the storage account. | No anonymous access to any container in the storage account. The storage account setting overrides the container setting. | No anonymous access to any container in the storage account. The storage account setting overrides the container setting. |
| **Anonymous access is allowed for the storage account** | No anonymous access to this container (default configuration). | Anonymous access is permitted to this container and its blobs. | Anonymous access is permitted to blobs in this container, but not to the container itself. |

When anonymous access is permitted for a storage account and configured for a specific container, then a request to read a blob in that container that is passed without an *Authorization* header is accepted by the service, and the blob's data is returned in the response.

## Allow or disallow anonymous read access for a storage account

When anonymous access is allowed for a storage account, a user with the appropriate permissions can modify a container's anonymous access setting to enable anonymous access to the data in that container. Blob data is never available for anonymous access unless the user takes the additional step to explicitly configure the container's anonymous access setting.

Keep in mind that anonymous access to a container is always turned off by default and must be explicitly configured to permit anonymous requests. Regardless of the setting on the storage account, your data will never be available for anonymous access unless a user with appropriate permissions takes this additional step to enable anonymous access on the container.

Disallowing anonymous access for the storage account overrides the access settings for all containers in that storage account, preventing anonymous access to blob data in that account. When anonymous access is disallowed for the account, it is not possible to configure the access setting for a container to permit anonymous access, and any future anonymous requests to that account will fail. Before changing this setting, be sure to understand the impact on client applications that may be accessing data in your storage account anonymously. For more information, see [Prevent anonymous read access to containers and blobs](anonymous-read-access-prevent.md).

> [!IMPORTANT]
> After anonymous access is disallowed for a storage account, clients that use the anonymous bearer challenge will find that Azure Storage returns a 403 error (Forbidden) rather than a 401 error (Unauthorized). We recommend that you make all containers private to mitigate this issue. For more information on modifying the anonymous access setting for containers, see [Set the access level for a container](anonymous-read-access-configure.md#set-the-anonymous-access-level-for-a-container).

Allowing or disallowing anonymous access requires version 2019-04-01 or later of the Azure Storage resource provider. For more information, see [Azure Storage Resource Provider REST API](/rest/api/storagerp/).

### Permissions for disallowing anonymous access

To set the **AllowBlobPublicAccess** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

Role assignments must be scoped to the level of the storage account or higher to permit a user to disallow anonymous access for the storage account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those administrative users who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

These roles do not provide access to data in a storage account via Azure Active Directory (Azure AD). However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

The **Microsoft.Storage/storageAccounts/listkeys/action** itself grants data access via the account keys, but does not grant a user the ability to change the **AllowBlobPublicAccess** property for a storage account. For users who need to access data in your storage account but should not have the ability to change the storage account's configuration, consider assigning roles such as [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor), [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader), or [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create storage accounts and manage account configuration. For more information, see [Azure roles, Azure AD roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Set the storage account's AllowBlobPublicAccess property

To allow or disallow anonymous access for a storage account, set the account's **AllowBlobPublicAccess** property. This property is available for all storage accounts that are created with the Azure Resource Manager deployment model. For more information, see [Storage account overview](../common/storage-account-overview.md).

# [Azure portal](#tab/portal)

To allow or disallow anonymous access for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Allow Blob anonymous access** to **Enabled** or **Disabled**.

    :::image type="content" source="media/anonymous-read-access-configure/blob-public-access-portal.png" alt-text="Screenshot showing how to allow or disallow anonymous access for account":::

# [PowerShell](#tab/powershell)

To allow or disallow anonymous access for a storage account with PowerShell, install [Azure PowerShell version 4.4.0](https://www.powershellgallery.com/packages/Az/4.4.0) or later. Next, configure the **AllowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **AllowBlobPublicAccess** property to **false**. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$location = "<location>"

# Create a storage account with AllowBlobPublicAccess explicitly set to false.
New-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -Location $location `
    -SkuName Standard_GRS `
    -AllowBlobPublicAccess $false

# Read the AllowBlobPublicAccess property for the newly created storage account.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).AllowBlobPublicAccess
```

# [Azure CLI](#tab/azure-cli)

To allow or disallow anonymous access for a storage account with Azure CLI, install Azure CLI version 2.9.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **allowBlobPublicAccess** property to **false**. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --kind StorageV2 \
    --location <location> \
    --allow-blob-public-access false

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query allowBlobPublicAccess \
    --output tsv
```

# [Template](#tab/template)

To allow or disallow anonymous access for a storage account with a template, create a template with the **AllowBlobPublicAccess** property set to **true** or **false**. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search services and marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment (deploy using custom templates)**, choose **Create**, and then choose **Build your own template in the editor**.
1. In the template editor, paste in the following JSON to create a new account and set the **AllowBlobPublicAccess** property to **true** or **false**. Remember to replace the placeholders in angle brackets with your own values.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {
            "storageAccountName": "[concat(uniqueString(subscription().subscriptionId), 'template')]"
        },
        "resources": [
            {
            "name": "[variables('storageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-06-01",
            "location": "<location>",
            "properties": {
                "allowBlobPublicAccess": false
            },
            "dependsOn": [],
            "sku": {
              "name": "Standard_GRS"
            },
            "kind": "StorageV2",
            "tags": {}
            }
        ]
    }
    ```

1. Save the template.
1. Specify resource group parameter, then choose the **Review + create** button to deploy the template and create a storage account with the **allowBlobPublicAccess** property configured.

---

> [!NOTE]
> Disallowing anonymous access for a storage account does not affect any static websites hosted in that storage account. The **$web** container is always publicly accessible.
>
> After you update the anonymous access setting for the storage account, it may take up to 30 seconds before the change is fully propagated.

When a container is configured for anonymous access, requests to read blobs in that container do not need to be authorized. However, any firewall rules that are configured for the storage account remain in effect and will block traffic inline with the configured ACLs.

Allowing or disallowing anonymous access requires version 2019-04-01 or later of the Azure Storage resource provider. For more information, see [Azure Storage Resource Provider REST API](/rest/api/storagerp/).

The examples in this section showed how to read the **AllowBlobPublicAccess** property for the storage account to determine whether anonymous access is currently allowed or disallowed. To learn how to verify that an account's anonymous access setting is configured to prevent anonymous access, see [Remediate anonymous access for the storage account](anonymous-read-access-prevent.md#remediate-anonymous-access-for-the-storage-account).

## Set the anonymous access level for a container

To grant anonymous users read access to a container and its blobs, first allow anonymous access for the storage account, then set the container's anonymous access level. If anonymous access is denied for the storage account, you will not be able to configure anonymous access for a container.

> [!CAUTION]
> Microsoft recommends against permitting anonymous access to blob data in your storage account.

When anonymous access is allowed for a storage account, you can configure a container with the following permissions:

- **No public read access:** The container and its blobs can be accessed only with an authorized request. This option is the default for all new containers.
- **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available anonymously. Anonymous clients cannot enumerate the blobs within the container.
- **Public read access for container and its blobs:** Container and blob data can be read by anonymous request, except for container permission settings and container metadata. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

You cannot change the anonymous access level for an individual blob. Anonymous access level is set only at the container level. You can set the container's anonymous access level when you create the container, or you can update the setting on an existing container.

# [Azure portal](#tab/portal)

To update the anonymous access level for one or more existing containers in the Azure portal, follow these steps:

1. Navigate to your storage account overview in the Azure portal.
1. Under **Data storage** on the menu blade, select **Containers**.
1. Select the containers for which you want to set the anonymous access level.
1. Use the **Change access level** button to display the anonymous access settings.
1. Select the desired anonymous access level from the **Anonymous access level** dropdown and click the OK button to apply the change to the selected containers.

    :::image type="content" source="media/anonymous-read-access-configure/configure-public-access-container.png" alt-text="Screenshot showing how to set anonymous access level in the portal." lightbox="media/anonymous-read-access-configure/configure-public-access-container.png":::

When anonymous access is disallowed for the storage account, a container's anonymous access level cannot be set. If you attempt to set the container's anonymous access level, you'll see that the setting is disabled because anonymous access is disallowed for the account.

:::image type="content" source="media/anonymous-read-access-configure/container-public-access-blocked.png" alt-text="Screenshot showing that setting a container's anonymous access level is blocked when anonymous access disallowed for the account":::

# [PowerShell](#tab/powershell)

To update the anonymous access level for one or more containers with PowerShell, call the [Set-AzStorageContainerAcl](/powershell/module/az.storage/set-azstoragecontaineracl) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's anonymous access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example creates a container with anonymous access disabled, and then updates the container's anonymous access setting to permit anonymous access to the container and its blobs. Remember to replace the placeholder values in brackets with your own values:

```powershell
# Set variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
# Get context object.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
# Create a new container with anonymous access setting set to Off.
$containerName = "<container>"
New-AzStorageContainer -Name $containerName -Permission Off -Context $ctx
# Read the container's anonymous access setting.
Get-AzStorageContainerAcl -Container $containerName -Context $ctx
# Update the container's anonymous access setting to Container.
Set-AzStorageContainerAcl -Container $containerName -Permission Container -Context $ctx
# Read the container's anonymous access setting.
Get-AzStorageContainerAcl -Container $containerName -Context $ctx
```

When anonymous access is disallowed for the storage account, a container's anonymous access level cannot be set. If you attempt to set the container's anonymous access level, Azure Storage returns error indicating that anonymous access is not permitted on the storage account.

# [Azure CLI](#tab/azure-cli)

To update the anonymous access level for one or more containers with Azure CLI, call the [az storage container set permission](/cli/azure/storage/container#az-storage-container-set-permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's anonymous access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example creates a container with anonymous access disabled, and then updates the container's anonymous access setting to permit anonymous access to the container and its blobs. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container create \
    --name <container-name> \
    --account-name <account-name> \
    --resource-group <resource-group>
    --public-access off \
    --account-key <account-key> \
    --auth-mode key
az storage container show-permission \
    --name <container-name> \
    --account-name <account-name> \
    --account-key <account-key> \
    --auth-mode key
az storage container set-permission \
    --name <container-name> \
    --account-name <account-name> \
    --public-access container \
    --account-key <account-key> \
    --auth-mode key
az storage container show-permission \
    --name <container-name> \
    --account-name <account-name> \
    --account-key <account-key> \
    --auth-mode key
```

When anonymous access is disallowed for the storage account, a container's anonymous access level cannot be set. If you attempt to set the container's anonymous access level, Azure Storage returns error indicating that anonymous access is not permitted on the storage account.

# [Template](#tab/template)

N/A.

---

## Check the anonymous access setting for a set of containers

It is possible to check which containers in one or more storage accounts are configured for anonymous access by listing the containers and checking the anonymous access setting. This approach is a practical option when a storage account does not contain a large number of containers, or when you are checking the setting across a small number of storage accounts. However, performance may suffer if you attempt to enumerate a large number of containers.

The following example uses PowerShell to get the anonymous access setting for all containers in a storage account. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
Get-AzStorageContainer -Context $ctx | Select Name, PublicAccess
```

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Next steps

- [Prevent anonymous read access to containers and blobs](anonymous-read-access-prevent.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
- [Authorizing access to Azure Storage](../common/authorize-data-access.md)