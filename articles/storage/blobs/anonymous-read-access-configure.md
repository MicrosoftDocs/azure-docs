---
title: Configure anonymous public read access for containers and blobs
titleSuffix: Azure Storage
description: Learn how to allow or disallow anonymous access to blob data for the storage account. Set the container public access setting to make containers and blobs available for anonymous access.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: how-to
ms.date: 11/01/2022
ms.author: jammart
ms.reviewer: fryu
ms.subservice: blobs
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
---

# Configure anonymous public read access for containers and blobs

Azure Storage supports optional anonymous public read access for containers and blobs. By default, anonymous access to your data is never permitted. Unless you explicitly enable anonymous access, all requests to a container and its blobs must be authorized. When you configure a container's public access level setting to permit anonymous access, clients can read data in that container without authorizing the request.

> [!WARNING]
> When a container is configured for public access, any client can read data in that container. Public access presents a potential security risk, so if your scenario does not require it, Microsoft recommends that you disallow it for the storage account. For more information, see [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md).

This article describes how to configure anonymous public read access for a container and its blobs. For information about how to access blob data anonymously from a client application, see [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md).

## Allow or disallow public read access for a storage account

By default, a storage account is configured to allow a user with the appropriate permissions to enable public access to a container. When public access is allowed, a user with the appropriate permissions can modify a container's public access setting to enable anonymous public access to the data in that container. Blob data is never available for public access unless the user takes the additional step to explicitly configure the container's public access setting.

Keep in mind that public access to a container is always turned off by default and must be explicitly configured to permit anonymous requests. Regardless of the setting on the storage account, your data will never be available for public access unless a user with appropriate permissions takes this additional step to enable public access on the container.

Disallowing public access for the storage account prevents anonymous access to all containers and blobs in that account. When public access is disallowed for the account, it is not possible to configure the public access setting for a container to permit anonymous access. For improved security, Microsoft recommends that you disallow public access for your storage accounts unless your scenario requires that users access blob resources anonymously.







When a container is configured for anonymous public access, requests to read blobs in that container do not need to be authorized. However, any firewall rules that are configured for the storage account remain in effect and will block anonymous traffic.

Allowing or disallowing blob public access requires version 2019-04-01 or later of the Azure Storage resource provider. For more information, see [Azure Storage Resource Provider REST API](/rest/api/storagerp/).

The examples in this section showed how to read the **AllowBlobPublicAccess** property for the storage account to determine if public access is currently allowed or disallowed. To learn more about how to verify that an account's public access setting is configured to prevent anonymous access, see [Remediate anonymous public access](anonymous-read-access-prevent.md#remediate-anonymous-public-access).

## Set the public access level for a container

To grant anonymous users read access to a container and its blobs, first allow public access for the storage account, then set the container's public access level. If public access is denied for the storage account, you will not be able to configure public access for a container.

When public access is allowed for a storage account, you can configure a container with the following permissions:

- **No public read access:** The container and its blobs can be accessed only with an authorized request. This option is the default for all new containers.
- **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available anonymously. Anonymous clients cannot enumerate the blobs within the container.
- **Public read access for container and its blobs:** Container and blob data can be read by anonymous request, except for container permission settings and container metadata. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

You cannot change the public access level for an individual blob. Public access level is set only at the container level. You can set the container's public access level when you create the container, or you can update the setting on an existing container.

# [Azure portal](#tab/portal)

To update the public access level for one or more existing containers in the Azure portal, follow these steps:

1. Navigate to your storage account overview in the Azure portal.
1. Under **Data storage** on the menu blade, select **Blob containers**.
1. Select the containers for which you want to set the public access level.
1. Use the **Change access level** button to display the public access settings.
1. Select the desired public access level from the **Public access level** dropdown and click the OK button to apply the change to the selected containers.

    :::image type="content" source="media/anonymous-read-access-configure/configure-public-access-container.png" alt-text="Screenshot showing how to set public access level in the portal." lightbox="media/anonymous-read-access-configure/configure-public-access-container.png":::

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, you'll see that the setting is disabled because public access is disallowed for the account.

:::image type="content" source="media/anonymous-read-access-configure/container-public-access-blocked.png" alt-text="Screenshot showing that setting container public access level is blocked when public access disallowed":::

# [PowerShell](#tab/powershell)

To update the public access level for one or more containers with PowerShell, call the [Set-AzStorageContainerAcl](/powershell/module/az.storage/set-azstoragecontaineracl) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example creates a container with public access disabled, and then updates the container's public access setting to permit anonymous access to the container and its blobs. Remember to replace the placeholder values in brackets with your own values:

```powershell
# Set variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Get context object.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

# Create a new container with public access setting set to Off.
$containerName = "<container>"
New-AzStorageContainer -Name $containerName -Permission Off -Context $ctx

# Read the container's public access setting.
Get-AzStorageContainerAcl -Container $containerName -Context $ctx

# Update the container's public access setting to Container.
Set-AzStorageContainerAcl -Container $containerName -Permission Container -Context $ctx

# Read the container's public access setting.
Get-AzStorageContainerAcl -Container $containerName -Context $ctx
```

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, Azure Storage returns error indicating that public access is not permitted on the storage account.

# [Azure CLI](#tab/azure-cli)

To update the public access level for one or more containers with Azure CLI, call the [az storage container set permission](/cli/azure/storage/container#az-storage-container-set-permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following example creates a container with public access disabled, and then updates the container's public access setting to permit anonymous access to the container and its blobs. Remember to replace the placeholder values in brackets with your own values:

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

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, Azure Storage returns error indicating that public access is not permitted on the storage account.

# [Template](#tab/template)

N/A.

---

## Check the public access setting for a set of containers

It is possible to check which containers in one or more storage accounts are configured for public access by listing the containers and checking the public access setting. This approach is a practical option when a storage account does not contain a large number of containers, or when you are checking the setting across a small number of storage accounts. However, performance may suffer if you attempt to enumerate a large number of containers.

The following example uses PowerShell to get the public access setting for all containers in a storage account. Remember to replace the placeholder values in brackets with your own values:

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

- [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
- [Authorizing access to Azure Storage](../common/authorize-data-access.md)
