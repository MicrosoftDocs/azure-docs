---
title: Create and manage encryption scopes
titleSuffix: Azure Storage
description: Learn how to create an encryption scope to isolate blob data at the container or blob level.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 11/07/2023
ms.topic: conceptual
ms.author: normesta
ms.reviewer: ozgun
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
---

# Create and manage encryption scopes

Encryption scopes enable you to manage encryption at the level of an individual blob or container. You can use encryption scopes to create secure boundaries between data that resides in the same storage account but belongs to different customers. For more information about encryption scopes, see [Encryption scopes for Blob storage](encryption-scope-overview.md).

This article shows how to create an encryption scope. It also shows how to specify an encryption scope when you create a blob or container.

## Create an encryption scope

You can create an encryption scope that is protected with a Microsoft-managed key or with a customer-managed key that is stored in an Azure Key Vault or in an Azure Key Vault Managed Hardware Security Model (HSM). To create an encryption scope with a customer-managed key, you must first create a key vault or managed HSM and add the key you intend to use for the scope. The key vault or managed HSM must have purge protection enabled.

The storage account and the key vault can be in the same tenant, or in different tenants. In either case, the storage account and key vault can be in different regions.

An encryption scope is automatically enabled when you create it. After you create the encryption scope, you can specify it when you create a blob. You can also specify a default encryption scope when you create a container, which automatically applies to all blobs in the container.

When you configure an encryption scope, you are billed for a minimum of one month (30 days). After the first month, charges for an encryption scope are prorated on an hourly basis. For more information, see [Billing for encryption scopes](encryption-scope-overview.md#billing-for-encryption-scopes).

# [Portal](#tab/portal)

To create an encryption scope in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Security + networking** select **Encryption**.
1. Select the **Encryption Scopes** tab.
1. Click the **Add** button to add a new encryption scope.
1. In the **Create Encryption Scope** pane, enter a name for the new scope.
1. Select the desired type of encryption key support, either **Microsoft-managed keys** or **Customer-managed keys**.
    - If you selected **Microsoft-managed keys**, click **Create** to create the encryption scope.
    - If you selected **Customer-managed keys**, then select a subscription and specify a key vault and a key to use for this encryption scope. If the desired key vault is in a different region, select **Enter key URI** and specify the key URI.
1. If infrastructure encryption is enabled for the storage account, then it will automatically be enabled for the new encryption scope. Otherwise, you can choose whether to enable infrastructure encryption for the encryption scope.

    :::image type="content" source="media/encryption-scope-manage/create-encryption-scope-customer-managed-key-portal.png" alt-text="Screenshot showing how to create encryption scope in Azure portal" lightbox="media/encryption-scope-manage/create-encryption-scope-customer-managed-key-portal.png":::

# [PowerShell](#tab/powershell)

To create an encryption scope with PowerShell, install the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) PowerShell module, version 3.4.0 or later.

### Create an encryption scope protected by Microsoft-managed keys

To create an encryption scope that is protected by Microsoft-managed keys, call the [New-AzStorageEncryptionScope](/powershell/module/az.storage/new-azstorageencryptionscope) command with the `-StorageEncryption` parameter.

If infrastructure encryption is enabled for the storage account, then it will automatically be enabled for the new encryption scope. Otherwise, you can choose whether to enable infrastructure encryption for the encryption scope. To create the new scope with infrastructure encryption enabled, include the `-RequireInfrastructureEncryption` parameter.

Remember to replace the placeholder values in the example with your own values:

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$scopeName = "<encryption-scope>"

New-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName1 `
    -StorageEncryption
```

### Create an encryption scope protected by customer-managed keys in the same tenant

To create an encryption scope that is protected by customer-managed keys stored in a key vault or managed HSM that is in the same tenant as the storage account, first configure customer-managed keys for the storage account. You must assign a managed identity to the storage account that has permissions to access the key vault. The managed identity can be either a user-assigned managed identity or a system-assigned managed identity. To learn more about configuring customer-managed keys, see [Configure customer-managed keys in the same tenant for an existing storage account](../common/customer-managed-keys-configure-existing-account.md).

To grant the managed identity permissions to access the key vault, assign the **Key Vault Crypto Service Encryption User** role the managed identity.

To configure customer-managed keys for use with an encryption scope, purge protection must be enabled on the key vault or managed HSM.

The following example shows how to configure an encryption scope with a system-assigned managed identity. Remember to replace the placeholder values in the example with your own values:

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$keyVaultName = "<key-vault>"
$scopeName = "<encryption-scope>"

# Assign a system-assigned managed identity to the storage account.
$storageAccount = Set-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -AssignIdentity

# Assign the necessary permissions to the managed identity 
# so that it can access the key vault.
$principalId = $storageAccount.Identity.PrincipalId
$keyVault = Get-AzKeyVault $keyVaultName

New-AzRoleAssignment -ObjectId $storageAccount.Identity.PrincipalId `
    -RoleDefinitionName "Key Vault Crypto Service Encryption User" `
    -Scope $keyVault.ResourceId
```

Next, call the [New-AzStorageEncryptionScope](/powershell/module/az.storage/new-azstorageencryptionscope) command with the `-KeyvaultEncryption` parameter, and specify the key URI. Including the key version on the key URI is optional. If you omit the key version, then the encryption scope will automatically use the most recent key version. If you include the key version, then you must update the key version manually to use a different version.

The format of the key URI is similar to the following examples, and can be constructed from the key vault's [VaultUri](/dotnet/api/microsoft.azure.commands.keyvault.models.pskeyvault.vaulturi) property and the key name:

```http
# Without the key version
https://<key-vault>.vault.azure.net/keys/<key>

# With the key version
https://<key-vault>.vault.azure.net/keys/<key>/<version>
```

If infrastructure encryption is enabled for the storage account, then it will automatically be enabled for the new encryption scope. Otherwise, you can choose whether to enable infrastructure encryption for the encryption scope. To create the new scope with infrastructure encryption enabled, include the `-RequireInfrastructureEncryption` parameter.

Remember to replace the placeholder values in the example with your own values:

```azurepowershell
$keyUri = $keyVault.VaultUri + "keys/" + $keyName

New-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName `
    -KeyUri $keyUri `
    -KeyvaultEncryption
```

### Create an encryption scope protected by customer-managed keys in a different tenant

To create an encryption scope that is protected by customer-managed keys stored in a key vault or managed HSM that is in a different tenant than the storage account, first configure customer-managed keys for the storage account. You must configure a user-assigned managed identity for the storage account that has permissions to access the key vault in the other tenant. To learn more about configuring cross-tenant customer-managed keys, see [Configure cross-tenant customer-managed keys for an existing storage account](../common/customer-managed-keys-configure-cross-tenant-existing-account.md).

To configure customer-managed keys for use with an encryption scope, purge protection must be enabled on the key vault or managed HSM.

After you have configured cross-tenant customer-managed keys for the storage account, you can create an encryption scope on the storage account in one tenant that is scoped to a key in a key vault in the other tenant. You will need the key URI to create the cross-tenant encryption scope.

Remember to replace the placeholder values in the example with your own values:

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$scopeName = "<encryption-scope>"

# Construct the key URI from the key vault URI and key name.
$keyUri = $kvUri + "keys/" + $keyName

New-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName `
    -KeyUri $keyUri `
    -KeyvaultEncryption
```

# [Azure CLI](#tab/cli)

To create an encryption scope with Azure CLI, first install Azure CLI version 2.20.0 or later.

### Create an encryption scope protected by Microsoft-managed keys

To create an encryption scope that is protected by Microsoft-managed keys, call the [az storage account encryption-scope create](/cli/azure/storage/account/encryption-scope#az-storage-account-encryption-scope-create) command, specifying the `--key-source` parameter as `Microsoft.Storage`.

If infrastructure encryption is enabled for the storage account, then it will automatically be enabled for the new encryption scope. Otherwise, you can choose whether to enable infrastructure encryption for the encryption scope. To create the new scope with infrastructure encryption enabled, include the `--require-infrastructure-encryption` parameter and set its value to `true`.

Remember to replace the placeholder values with your own values:

```azurecli
az storage account encryption-scope create \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --name <encryption-scope> \
    --key-source Microsoft.Storage
```

### Create an encryption scope protected by customer-managed keys in the same tenant

To create an encryption scope that is protected by customer-managed keys stored in a key vault or managed HSM that is in the same tenant as the storage account, first configure customer-managed keys for the storage account. You must assign a managed identity to the storage account that has permissions to access the key vault. The managed identity can be either a user-assigned managed identity or a system-assigned managed identity. To learn more about configuring customer-managed keys, see [Configure customer-managed keys in the same tenant for an existing storage account](../common/customer-managed-keys-configure-existing-account.md).

To grant the managed identity permissions to access the key vault, assign the **Key Vault Crypto Service Encryption User** role the managed identity.

To configure customer-managed keys for use with an encryption scope, purge protection must be enabled on the key vault or managed HSM.

The following example shows how to configure an encryption scope with a system-assigned managed identity. Remember to replace the placeholder values in the example with your own values:

```azurecli
az storage account update \
    --name <storage-account> \
    --resource-group <resource_group> \
    --assign-identity

principalId=$(az storage account show --name <storage-account> \
    --resource-group <resource_group> \
    --query identity.principalId \
    --output tsv)

$kvResourceId=$(az keyvault show \
    --resource-group <resource-group> \
    --name <key-vault> \
    --query id \
    --output tsv)

az role assignment create --assignee-object-id $principalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $kvResourceId
```

Next, call the [az storage account encryption-scope](/cli/azure/storage/account/encryption-scope#az-storage-account-encryption-scope-create) command with the `--key-uri` parameter, and specify the key URI. Including the key version on the key URI is optional. If you omit the key version, then the encryption scope will automatically use the most recent key version. If you include the key version, then you must update the key version manually to use a different version.

The format of the key URI is similar to the following examples, and can be constructed from the key vault's **vaultUri** property and the key name:

```http
# Without the key version
https://<key-vault>.vault.azure.net/keys/<key>

# With the key version
https://<key-vault>.vault.azure.net/keys/<key>/<version>
```

If infrastructure encryption is enabled for the storage account, then it will automatically be enabled for the new encryption scope. Otherwise, you can choose whether to enable infrastructure encryption for the encryption scope. To create the new scope with infrastructure encryption enabled, include the `--require-infrastructure-encryption` parameter and set its value to `true`.

Remember to replace the placeholder values in the example with your own values:

```azurecli
az storage account encryption-scope create \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --name <encryption-scope> \
    --key-source Microsoft.KeyVault \
    --key-uri <key-uri>
```

### Create an encryption scope protected by customer-managed keys in a different tenant

To create an encryption scope that is protected by customer-managed keys stored in a key vault or managed HSM that is in a different tenant than the storage account, first configure customer-managed keys for the storage account. You must configure a user-assigned managed identity for the storage account that has permissions to access the key vault in the other tenant. To learn more about configuring cross-tenant customer-managed keys, see [Configure cross-tenant customer-managed keys for an existing storage account](../common/customer-managed-keys-configure-cross-tenant-existing-account.md).

To configure customer-managed keys for use with an encryption scope, purge protection must be enabled on the key vault or managed HSM.

After you have configured cross-tenant customer-managed keys for the storage account, you can create an encryption scope on the storage account in one tenant that is scoped to a key in a key vault in the other tenant. You will need the key URI to create the cross-tenant encryption scope.

Remember to replace the placeholder values in the example with your own values:

```azurecli
az storage account encryption-scope create \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --name <encryption-scope> \
    --key-source Microsoft.KeyVault \
    --key-uri <key-uri>
```

---

## List encryption scopes for storage account

# [Portal](#tab/portal)

To view the encryption scopes for a storage account in the Azure portal, navigate to the **Encryption Scopes** setting for the storage account. From this pane, you can enable or disable an encryption scope or change the key for an encryption scope.

:::image type="content" source="media/encryption-scope-manage/list-encryption-scopes-portal.png" alt-text="Screenshot showing list of encryption scopes in Azure portal" lightbox="media/encryption-scope-manage/list-encryption-scopes-portal.png":::

To view details for a customer-managed key, including the key URI and version and whether the key version is automatically updated, follow the link in the **Key** column.

:::image type="content" source="media/encryption-scope-manage/customer-managed-key-details-portal.png" alt-text="Screenshot showing details for a key used with an encryption scope" lightbox="media/encryption-scope-manage/customer-managed-key-details-portal.png":::

# [PowerShell](#tab/powershell)

To list the encryption scopes available for a storage account with PowerShell, call the **Get-AzStorageEncryptionScope** command. Remember to replace the placeholder values in the example with your own values:

```azurepowershell
Get-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName
```

To list all encryption scopes in a resource group by storage account, use the pipeline syntax:

```azurepowershell
Get-AzStorageAccount -ResourceGroupName $rgName | Get-AzStorageEncryptionScope
```

# [Azure CLI](#tab/cli)

To list the encryption scopes available for a storage account with Azure CLI, call the [az storage account encryption-scope list](/cli/azure/storage/account/encryption-scope#az-storage-account-encryption-scope-list) command. Remember to replace the placeholder values in the example with your own values:

```azurecli
az storage account encryption-scope list \
    --account-name <storage-account> \
    --resource-group <resource-group>
```

---

## Create a container with a default encryption scope

When you create a container, you can specify a default encryption scope. Blobs in that container will use that scope by default.

An individual blob can be created with its own encryption scope, unless the container is configured to require that all blobs use the default scope. For more information, see [Encryption scopes for containers and blobs](encryption-scope-overview.md#encryption-scopes-for-containers-and-blobs).

# [Portal](#tab/portal)

To create a container with a default encryption scope in the Azure portal, first create the encryption scope as described in [Create an encryption scope](#create-an-encryption-scope). Next, follow these steps to create the container:

1. Navigate to the list of containers in your storage account, and select the **Add** button to create a container.
1. Expand the **Advanced** settings in the **New Container** pane.
1. In the **Encryption scope** drop-down, select the default encryption scope for the container.
1. To require that all blobs in the container use the default encryption scope, select the checkbox to **Use this encryption scope for all blobs in the container**. If this checkbox is selected, then an individual blob in the container cannot override the default encryption scope.

    :::image type="content" source="media/encryption-scope-manage/create-container-default-encryption-scope.png" alt-text="Screenshot showing container with default encryption scope" lightbox="media/encryption-scope-manage/create-container-default-encryption-scope.png":::

# [PowerShell](#tab/powershell)

To create a container with a default encryption scope with PowerShell, call the [New-AzStorageContainer](/powershell/module/az.storage/new-azstoragecontainer) command, specifying the scope for the `-DefaultEncryptionScope` parameter. To force all blobs in a container to use the container's default scope, set the `-PreventEncryptionScopeOverride` parameter to `true`.

```azurepowershell
$containerName1 = "container1"
$ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Create a container with a default encryption scope that cannot be overridden.
New-AzStorageContainer -Name $containerName1 `
    -Context $ctx `
    -DefaultEncryptionScope $scopeName1 `
    -PreventEncryptionScopeOverride $true
```

# [Azure CLI](#tab/cli)

To create a container with a default encryption scope with Azure CLI, call the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command, specifying the scope for the `--default-encryption-scope` parameter. To force all blobs in a container to use the container's default scope, set the `--prevent-encryption-scope-override` parameter to `true`.

The following example uses your Microsoft Entra account to authorize the operation to create the container. You can also use the account access key. For more information, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md).

```azurecli
az storage container create \
    --account-name <storage-account> \
    --resource-group <resource-group> \
    --name <container> \
    --default-encryption-scope <encryption-scope> \
    --prevent-encryption-scope-override true \
    --auth-mode login
```

---

If a client attempts to specify a scope when uploading a blob to a container that has a default encryption scope and the container is configured to prevent blobs from overriding the default scope, then the operation fails with a message indicating that the request is forbidden by the container encryption policy.

## Upload a blob with an encryption scope

When you upload a blob, you can specify an encryption scope for that blob, or use the default encryption scope for the container, if one has been specified.

> [!NOTE]
> When you upload a new blob with an encryption scope, you cannot change the default access tier for that blob. You also cannot change the access tier for an existing blob that uses an encryption scope. For more information about access tiers, see [Hot, Cool, and Archive access tiers for blob data](access-tiers-overview.md).

# [Portal](#tab/portal)

To upload a blob with an encryption scope via the Azure portal, first create the encryption scope as described in [Create an encryption scope](#create-an-encryption-scope). Next, follow these steps to create the blob:

1. Navigate to the container to which you want to upload the blob.
1. Select the **Upload** button, and locate the blob to upload.
1. Expand the **Advanced** settings in the **Upload blob** pane.
1. Locate the **Encryption scope** drop-down section. By default, the blob is created with the default encryption scope for the container, if one has been specified. If the container requires that blobs use the default encryption scope, this section is disabled.
1. To specify a different scope for the blob that you are uploading, select **Choose an existing scope**, then select the desired scope from the drop-down.

    :::image type="content" source="media/encryption-scope-manage/upload-blob-encryption-scope.png" alt-text="Screenshot showing how to upload a blob with an encryption scope" lightbox="media/encryption-scope-manage/upload-blob-encryption-scope.png":::

# [PowerShell](#tab/powershell)

To upload a blob with an encryption scope via PowerShell, call the [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent) command and provide the encryption scope for the blob.

```azurepowershell
$containerName2 = "container2"
$localSrcFile = "C:\temp\helloworld.txt"
$ctx = New-AzStorageContext -StorageAccountName $accountName -UseConnectedAccount

# Create a container with no default scope defined.
New-AzStorageContainer -Name $containerName2 -Context $ctx

# Upload a block upload with an encryption scope specified.
Set-AzStorageBlobContent -Context $ctx `
    -Container $containerName2 `
    -File $localSrcFile `
    -Blob "helloworld.txt" `
    -BlobType Block `
    -EncryptionScope $scopeName2
```

# [Azure CLI](#tab/cli)

To upload a blob with an encryption scope via Azure CLI, call the [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) command and provide the encryption scope for the blob.

If you are using Azure Cloud Shell, follow the steps described in [Upload a blob](storage-quickstart-blobs-cli.md#upload-a-blob) to create a file in the root directory. You can then upload this file to a blob using the following sample.

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --file <file> \
    --name <file> \
    --encryption-scope <encryption-scope>
```

---

## Change the encryption key for a scope

To change the key that protects an encryption scope from a Microsoft-managed key to a customer-managed key, first make sure that you have enabled customer-managed keys with Azure Key Vault or Key Vault HSM for the storage account. For more information, see [Configure encryption with customer-managed keys stored in Azure Key Vault](../common/customer-managed-keys-configure-key-vault.md) or [Configure encryption with customer-managed keys stored in Azure Key Vault](../common/customer-managed-keys-configure-key-vault.md).

# [Portal](#tab/portal)

To change the key that protects a scope in the Azure portal, follow these steps:

1. Navigate to the **Encryption Scopes** tab to view the list of encryption scopes for the storage account.
1. Select the **More** button next to the scope you wish to modify.
1. In the **Edit encryption scope** pane, you can change the encryption type from Microsoft-managed key to customer-managed key or vice versa.
1. To select a new customer-managed key, select **Use a new key** and specify the key vault, key, and key version.

# [PowerShell](#tab/powershell)

To change the key that protects an encryption scope from a customer-managed key to a Microsoft-managed key with PowerShell, call the **Update-AzStorageEncryptionScope** command and pass in the `-StorageEncryption` parameter:

```azurepowershell
Update-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName2 `
    -StorageEncryption
```

Next, call the **Update-AzStorageEncryptionScope** command and pass in the `-KeyUri` and `-KeyvaultEncryption` parameters:

```azurepowershell
Update-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName1 `
    -KeyUri $keyUri `
    -KeyvaultEncryption
```

# [Azure CLI](#tab/cli)

To change the key that protects an encryption scope from a customer-managed key to a Microsoft-managed key with Azure CLI, call the [az storage account encryption-scope update](/cli/azure/storage/account/encryption-scope#az-storage-account-encryption-scope-update) command and pass in the `--key-source` parameter with the value `Microsoft.Storage`:

```azurecli
az storage account encryption-scope update \
    --account-name <storage-account> \
    --resource-group <resource-group>
    --name <encryption-scope> \
    --key-source Microsoft.Storage
```

Next, call the **az storage account encryption-scope update** command, pass in the `--key-uri` parameter, and pass in the `--key-source` parameter with the value `Microsoft.KeyVault`:

```azurecli
az storage account encryption-scope update \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --name <encryption-scope> \
    --key-source Microsoft.KeyVault \
    --key-uri <key-uri>
```

---

## Disable an encryption scope

Disable any encryption scopes that are not needed to avoid unnecessary charges. For more information, see [Billing for encryption scopes](encryption-scope-overview.md#billing-for-encryption-scopes).

# [Portal](#tab/portal)

To disable an encryption scope in the Azure portal, navigate to the **Encryption Scopes** setting for the storage account, select the desired encryption scope, and select **Disable**.

# [PowerShell](#tab/powershell)

To disable an encryption scope with PowerShell, call the Update-AzStorageEncryptionScope command and include the `-State` parameter with a value of `disabled`, as shown in the following example. To re-enable an encryption scope, call the same command with the `-State` parameter set to `enabled`. Remember to replace the placeholder values in the example with your own values:

```azurepowershell
Update-AzStorageEncryptionScope -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EncryptionScopeName $scopeName1 `
    -State disabled
```

# [Azure CLI](#tab/cli)

To disable an encryption scope with Azure CLI, call the [az storage account encryption-scope update](/cli/azure/storage/account/encryption-scope#az-storage-account-encryption-scope-update) command and include the `--state` parameter with a value of `Disabled`, as shown in the following example. To re-enable an encryption scope, call the same command with the `--state` parameter set to `Enabled`. Remember to replace the placeholder values in the example with your own values:

```azurecli
az storage account encryption-scope update \
    --account-name <storage-account> \
    --resource-group <resource-group> \
    --name <encryption-scope> \
    --state Disabled
```

> [!IMPORTANT]
> It is not possible to delete an encryption scope. To avoid unexpected costs, be sure to disable any encryption scopes that you do not currently need.

---

## Next steps

- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Encryption scopes for Blob storage](encryption-scope-overview.md)
- [Customer-managed keys for Azure Storage encryption](../common/customer-managed-keys-overview.md)
- [Enable infrastructure encryption for double encryption of data](../common/infrastructure-encryption-enable.md)
