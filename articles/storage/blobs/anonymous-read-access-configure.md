---
title: Configure anonymous public read access for containers and blobs
titleSuffix: Azure Storage
description: Learn how to allow or disallow anonymous access to blob data for the storage account. Set the container public access setting to make containers and blobs available for anonymous access.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/03/2020
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
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

To allow or disallow public access for a storage account, configure the account's **AllowBlobPublicAccess** property. This property is available for all storage accounts that are created with the Azure Resource Manager deployment model. For more information, see [Storage account overview](../common/storage-account-overview.md).

The **AllowBlobPublicAccess** property is not set for a storage account by default and does not return a value until you explicitly set it. The storage account permits public access when the property value is either **null** or **true**.

# [Azure portal](#tab/portal)

To allow or disallow public access for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Blob public access** to **Enabled** or **Disabled**.

    :::image type="content" source="media/anonymous-read-access-configure/blob-public-access-portal.png" alt-text="Screenshot showing how to allow or disallow blob public access for account":::

# [PowerShell](#tab/powershell)

To allow or disallow public access for a storage account with PowerShell, install [Azure PowerShell version 4.4.0](https://www.powershellgallery.com/packages/Az/4.4.0) or later. Next, configure the **AllowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **AllowBlobPublicAccess** property to **true**. It then updates the storage account to set the **AllowBlobPublicAccess** property to **false**. The example also retrieves the property value in each case. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$location = "<location>"

# Create a storage account with AllowBlobPublicAccess set to true (or null).
New-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -Location $location `
    -SkuName Standard_GRS
    -AllowBlobPublicAccess $false

# Read the AllowBlobPublicAccess property for the newly created storage account.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).AllowBlobPublicAccess

# Set AllowBlobPublicAccess set to false
Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -AllowBlobPublicAccess $false

# Read the AllowBlobPublicAccess property.
(Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).AllowBlobPublicAccess
```

# [Azure CLI](#tab/azure-cli)

To allow or disallow public access for a storage account with Azure CLI, install Azure CLI version 2.9.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowBlobPublicAccess** property for a new or existing storage account.

The following example creates a storage account and explicitly sets the **allowBlobPublicAccess** property to **true**. It then updates the storage account to set the **allowBlobPublicAccess** property to **false**. The example also retrieves the property value in each case. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --kind StorageV2 \
    --location <location> \
    --allow-blob-public-access true

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query allowBlobPublicAccess \
    --output tsv

az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allow-blob-public-access false

az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query allowBlobPublicAccess \
    --output tsv
```

# [Template](#tab/template)

To allow or disallow public access for a storage account with a template, create a template with the **AllowBlobPublicAccess** property set to **true** or **false**. The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose **Create a resource**.
1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.
1. Choose **Template deployment (deploy using custom templates) (preview)**, choose **Create**, and then choose **Build your own template in the editor**.
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
> Disallowing public access for a storage account does not affect any static websites hosted in that storage account. The **$web** container is always publicly accessible.
>
> After you update the public access setting for the storage account, it may take up to 30 seconds before the change is fully propagated.

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
1. Under **Blob service** on the menu blade, select **Containers**.
1. Select the containers for which you want to set the public access level.
1. Use the **Change access level** button to display the public access settings.
1. Select the desired public access level from the **Public access level** dropdown and click the OK button to apply the change to the selected containers.

    ![Screenshot showing how to set public access level in the portal](./media/anonymous-read-access-configure/configure-public-access-container.png)

When public access is disallowed for the storage account, a container's public access level cannot be set. If you attempt to set the container's public access level, you'll see that the setting is disabled because public access is disallowed for the account.

:::image type="content" source="media/anonymous-read-access-configure/container-public-access-blocked.png" alt-text="Screenshot showing that setting container public access level is blocked when public access disallowed":::

# [PowerShell](#tab/powershell)

To update the public access level for one or more containers with PowerShell, call the [Set-AzStorageContainerAcl](/powershell/module/az.storage/set-azstoragecontaineracl) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

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

To update the public access level for one or more containers with Azure CLI, call the [az storage container set permission](/cli/azure/storage/container#az_storage_container_set_permission) command. Authorize this operation by passing in your account key, a connection string, or a shared access signature (SAS). The [Set Container ACL](/rest/api/storageservices/set-container-acl) operation that sets the container's public access level does not support authorization with Azure AD. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

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

## Next steps

- [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
- [Authorizing access to Azure Storage](../common/storage-auth.md)
