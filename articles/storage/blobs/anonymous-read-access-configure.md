---
title: Configure anonymous public read access for containers and blobs
titleSuffix: Azure Storage
description: Learn how to enable or disable anonymous access to blob data for the storage account. Set the container public access setting to make containers and blobs available for anonymous access.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/29/2020
ms.author: tamram
ms.reviewer: fryu
---

# Configure anonymous public read access for containers and blobs

Azure Storage supports anonymous public read access for containers and blobs. By default, all requests to a container and its blobs must be authorized by using either Azure Active Directory (Azure AD) or Shared Key authorization. When you configure a container's public access level setting to permit anonymous access, clients can read data in that container without authorizing the request.

> [!WARNING]
> When a container is configured for public access, any client can read data in that container. Public access presents a potential security risk, so if your scenario does not require it, Microsoft recommends that you disable it for the storage account. For more information, see [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md).

To configure public access for a container, you must perform two steps:

1. Enable public access for the storage account
1. Configure the container's public access setting

This article describes how to configure anonymous public read access for a container and its blobs. For information about how to access blob data anonymously from a client application, see [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md).

## Enable or disable public read access for a storage account

By default, public access is enabled for a storage account. Disabling public access prevents all anonymous access to containers and blobs in that account. For improved security, Microsoft recommends that you disable public access for your storage accounts unless your scenario requires that users access blob resources anonymously.

Disabling public access for a storage account overrides the public access settings for all containers in that storage account. When public access is disabled for the storage account, any future anonymous requests to that account will fail.

To enable or disable public access for a storage account, use the Azure portal or Azure CLI.

# [Azure portal](#tab/portal)

To enable or disable public access for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Blob public access** to **Disabled** or **Enabled**.

    :::image type="content" source="media/anonymous-read-access-configure/blob-public-access-portal.png" alt-text="Screenshot showing how to enable or disable blob public access for account":::

# [Azure CLI](#tab/azure-cli)

To enable or disable public access for a storage account with Azure CLI, first get the resource ID for your storage account by calling the [az resource show](/cli/azure/resource#az-resource-show) command. Next, call the [az resource update](/cli/azure/resource#az-resource-update) command to set the **allowBlobPublicAccess** property for the storage account. To enable public access, set the **allowBlobPublicAccess** property to true; to disable, set it to **false**.

The following example disables public blob access for the storage account. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
storage_account_id=$(az resource show \
    --name anonpublicaccess \
    --resource-group storagesamples-rg \
    --resource-type Microsoft.Storage/storageAccounts \
    --query id \
    --output tsv)

az resource update \
    --ids $storage_account_id \
    --set properties.allowBlobPublicAccess=false
    ```
```

To check whether public access is enabled with Azure CLI, call the [az resource show](/cli/azure/resource#az-resource-show) command and query for the **allowBlobPublicAccess** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.allowBlobPublicAccess \
    --output tsv
```

---

> [!NOTE]
> Disabling public access for a storage account does not affect any static websites hosted in that storage account. The **$web** container is always publicly accessible.

## Set the public access level for a container

To grant anonymous users read access to a container and its blobs, first enable public access for the storage account, then set the container's public access level. You can configure a container with the following permissions:

- **No public read access:** The container and its blobs can be accessed only with an authorized request. This option is the default for all new containers.
- **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available anonymously. Anonymous clients cannot enumerate the blobs within the container.
- **Public read access for container and its blobs:** Container and blob data can be read by anonymous request, except for container permission settings and container metadata. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

You can set a container's public access level only if public access is enabled for the storage account. If public access is disabled for the storage account, changing the public access level for a container is not permitted.

You cannot change the public access level for an individual blob. Public access level is set only at the container level.

To set a container's public access level, use the Azure portal or Azure CLI. You can set the container's public access level when you create the container, or update this setting on an existing container.

# [Azure portal](#tab/portal)

To update the public access level for one or more existing containers in the Azure portal, follow these steps:

1. Navigate to your storage account overview in the Azure portal.
1. Under **Blob service** on the menu blade, select **Containers**.
1. Select the containers for which you want to set the public access level.
1. Use the **Change access level** button to display the public access settings.
1. Select the desired public access level from the **Public access level** dropdown and click the OK button to apply the change to the selected containers.

    ![Screenshot showing how to set public access level in the portal](./media/anonymous-read-access-configure/configure-public-access-container.png)

When public access is disabled for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, you'll see that the setting is disabled because public access is forbidden for the account.

:::image type="content" source="media/anonymous-read-access-configure/container-public-access-blocked.png" alt-text="Screenshot showing that setting container public access level is blocked when public access disabled":::

# [Azure CLI](#tab/azure-cli)

To update the public access level for one or more containers with Azure CLI, call the [az storage container set permission](/cli/azure/storage/container#az-storage-container-set-permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

The following example sets the public access setting for a container to enable anonymous access to the container and its blobs. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container set-permission \
    --name <container-name> \
    --account-name <account-name> \
    --public-access container \
    --account-key <account-key> \
    --auth-mode key
```

When public access is disabled for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, an error occurs indicating that public access is not permitted on the storage account.

---

## Check the container public access setting


### Check the public access setting for a single container

To get the public access level for one or more containers with Azure CLI, call the [az storage container show permission](/cli/azure/storage/container#az-storage-container-show-permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Get Container ACL](/rest/api/storageservices/get-container-acl) operation that returns a container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

The following example reads the public access setting for a container. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container show-permission \
    --name <container-name> \
    --account-name <account-name> \
    --account-key <account-key>
    --auth-mode key
```

### Check the public access setting for a small set of containers

It is possible to check which containers in one or more storage accounts are configured for public access by listing the containers and checking the public access setting. This approach is a practical option when a storage account does not contain a large number of containers, or when you are checking the setting across a small number of storage accounts. However, performance may suffer if you attempt to enumerate a large number of containers.


## Next steps

- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
- [Authorizing access to Azure Storage](../common/storage-auth.md)