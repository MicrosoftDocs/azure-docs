---
title: Configure anonymous public read access for containers and blobs
titleSuffix: Azure Storage
description: Learn how to allow or disallow anonymous access to blob data for the storage account. Set the container public access setting to make containers and blobs available for anonymous access.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/23/2020
ms.author: tamram
ms.reviewer: fryu
---

# Configure anonymous public read access for containers and blobs

Azure Storage supports optional anonymous public read access for containers and blobs. By default, anonymous access to your data is never permitted. Unless you explicitly enable anonymous access, all requests to a container and its blobs must be authorized. When you configure a container's public access level setting to permit anonymous access, clients can read data in that container without authorizing the request.

> [!WARNING]
> When a container is configured for public access, any client can read data in that container. Public access presents a potential security risk, so if your scenario does not require it, Microsoft recommends that you disallow it for the storage account. For more information, see [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md).

This article describes how to configure anonymous public read access for a container and its blobs. For information about how to access blob data anonymously from a client application, see [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md).

## About anonymous public read access

Public access to your data is always prohibited by default. There are two separate settings that affect public access:

1. **Allow public access for the storage account.** By default, a storage account allows a user with the appropriate permissions to enable public access to a container. Blob data is not available for public access unless the user takes the additional step to explicitly configure the container's public access setting.
1. **Configure the container's public access setting.** By default, a container's public access setting is disabled, meaning that authorization is required for every request to the container or its data. A user with the appropriate permissions can modify a container's public access setting to enable anonymous access only if anonymous access is allowed for the storage account.

The following table summarizes how both settings together affect public access for a container.

| Public access setting | Public access is disabled for a container (default setting) | Public access for a container is set to Container | Public access a container is set to Blob |
|--|--|--|--|
| Public access is disallowed for the storage account | No public access to any container in the storage account. | No public access to any container in the storage account. The storage account setting overrides the container setting. | No public access to any container in the storage account. The storage account setting overrides the container setting. |
| Public access is allowed for the storage account (default setting) | No public access to this container (default configuration). | Public access is permitted to this container and its blobs. | Public access is permitted to blobs in this container, but not to the container itself. |

## Allow or disallow public read access for a storage account

By default, a storage account is configured to allow a user with the appropriate permissions to enable public access to a container. When public access is allowed, a user with the appropriate permissions can modify a container's public access setting to enable anonymous public access to the data in that container. Blob data is never available for public access unless the user takes the additional step to explicitly configure the container's public access setting.

Keep in mind that public access to a container is always turned off by default and must be explicitly configured to permit anonymous requests. Regardless of the setting on the storage account, your data will never be available for public access unless a user with appropriate permissions takes this additional step to enable public access on the container.

Disallowing public access for the storage account prevents anonymous access to all containers and blobs in that account. When public access is disallowed for the account, it is not possible to configure the public access setting for a container to permit anonymous access. For improved security, Microsoft recommends that you disallow public access for your storage accounts unless your scenario requires that users access blob resources anonymously.

> [!IMPORTANT]
> Disallowing public access for a storage account overrides the public access settings for all containers in that storage account. When public access is disallowed for the storage account, any future anonymous requests to that account will fail. Before changing this setting, be sure to understand the impact on client applications that may be accessing data in your storage account anonymously. For more information, see [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md).

To allow or disallow public access for a storage account, use the Azure portal or Azure CLI to configure the account's **blobPublicAccess** property. This property is available for all storage accounts that are created with the Azure Resource Manager deployment model. For more information, see [Storage account overview](../common/storage-account-overview.md).

# [Azure portal](#tab/portal)

To allow or disallow public access for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Blob public access** to **Enabled** or **Disabled**.

    :::image type="content" source="media/anonymous-read-access-configure/blob-public-access-portal.png" alt-text="Screenshot showing how to allow or disallow blob public access for account":::

# [Azure CLI](#tab/azure-cli)

To allow or disallow public access for a storage account with Azure CLI, first get the resource ID for your storage account by calling the [az resource show](/cli/azure/resource#az-resource-show) command. Next, call the [az resource update](/cli/azure/resource#az-resource-update) command to set the **allowBlobPublicAccess** property for the storage account. To permit public access, set the **allowBlobPublicAccess** property to true; to disallow, set it to **false**.

The following example disallows public blob access for the storage account. Remember to replace the placeholder values in brackets with your own values:

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

---

> [!NOTE]
> Disallowing public access for a storage account does not affect any static websites hosted in that storage account. The **$web** container is always publicly accessible.

## Check whether public access is allowed for a storage account

To check whether public access is allowed for a storage account, get the value of the **allowBlobPublicAccess** property. To check this property for a large number storage accounts at once, use the Azure Resource Graph Explorer.

> [!IMPORTANT]
> The **allowBlobPublicAccess** property is not set by default and does not return a value until you explicitly set it. The storage account allows public access when the property value is **null** or when it is **true**.

### Check whether public access is allowed for a single storage account

To check whether public access is allowed for a single storage account using Azure CLI, call the [az resource show](/cli/azure/resource#az-resource-show) command and query for the **allowBlobPublicAccess** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.allowBlobPublicAccess \
    --output tsv
```

### Check whether public access is allowed for a set of storage accounts

To check whether public access is allowed across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the value of the **allowBlobPublicAccess** property for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend allowBlobPublicAccess = parse_json(properties).allowBlobPublicAccess
| project subscriptionId, resourceGroup, name, allowBlobPublicAccess
| order by subscriptionId, resourceGroup, name asc
```

## Set the public access level for a container

To grant anonymous users read access to a container and its blobs, first allow public access for the storage account, then set the container's public access level. If public access is denied for the storage account, you will not be able to configure public access for a container.

When public access is allowed for a storage account, you can configure a container with the following permissions:

- **No public read access:** The container and its blobs can be accessed only with an authorized request. This option is the default for all new containers.
- **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available anonymously. Anonymous clients cannot enumerate the blobs within the container.
- **Public read access for container and its blobs:** Container and blob data can be read by anonymous request, except for container permission settings and container metadata. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

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

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, you'll see that the setting is disabled because public access is disallowed for the account.

:::image type="content" source="media/anonymous-read-access-configure/container-public-access-blocked.png" alt-text="Screenshot showing that setting container public access level is blocked when public access disallowed":::

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

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, an error occurs indicating that public access is not permitted on the storage account.

---

## Check the container public access setting

To check the public access setting for one or more containers, you can use the Azure portal, PowerShell, Azure CLI, one of the Azure Storage client libraries, or the Azure Storage resource provider. The following sections offer a few examples.  

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

### Check the public access setting for a set of containers

It is possible to check which containers in one or more storage accounts are configured for public access by listing the containers and checking the public access setting. This approach is a practical option when a storage account does not contain a large number of containers, or when you are checking the setting across a small number of storage accounts. However, performance may suffer if you attempt to enumerate a large number of containers.

The following example uses PowerShell to get the public access setting for all containers in a storage account. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

Get-AzStorageContainer -Context $ctx | Select Name, PublicAccess
```

## Next steps

- [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
- [Authorizing access to Azure Storage](../common/storage-auth.md)
