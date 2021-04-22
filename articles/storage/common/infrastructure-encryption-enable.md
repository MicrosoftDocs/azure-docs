---
title: Create a storage account with infrastructure encryption enabled for double encryption of data
titleSuffix: Azure Storage
description: Customers who require higher levels of assurance that their data is secure can also enable 256-bit AES encryption at the Azure Storage infrastructure level. When infrastructure encryption is enabled, data in a storage account is encrypted twice with two different encryption algorithms and two different keys.
services: storage
author: tamram

ms.service: storage
ms.date: 09/17/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurecli
---

# Create a storage account with infrastructure encryption enabled for double encryption of data

Azure Storage automatically encrypts all data in a storage account at the service level using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. Customers who require higher levels of assurance that their data is secure can also enable 256-bit AES encryption at the Azure Storage infrastructure level. When infrastructure encryption is enabled, data in a storage account is encrypted twice &mdash; once at the service level and once at the infrastructure level &mdash; with two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

Service-level encryption supports the use of either Microsoft-managed keys or customer-managed keys with Azure Key Vault or Key Vault Managed Hardware Security Model (HSM) (preview). Infrastructure-level encryption relies on Microsoft-managed keys and always uses a separate key. For more information about key management with Azure Storage encryption, see [About encryption key management](storage-service-encryption.md#about-encryption-key-management).

To doubly encrypt your data, you must first create a storage account that is configured for infrastructure encryption. This article describes how to create a storage account that enables infrastructure encryption.

## Register to use infrastructure encryption

To create a storage account that has infrastructure encryption enabled, you must first register to use this feature with Azure by using PowerShell or Azure CLI.

# [Azure portal](#tab/portal)

N/A

# [PowerShell](#tab/powershell)

To register with PowerShell, call the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) command.

```powershell
Register-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName AllowRequireInfraStructureEncryption
```

To check the status of your registration with PowerShell, call the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) command.

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName AllowRequireInfraStructureEncryption
```

After your registration is approved, you must re-register the Azure Storage resource provider. To re-register the resource provider with PowerShell, call the [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) command.

```powershell
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Storage'
```

# [Azure CLI](#tab/azure-cli)

To register with Azure CLI, call the [az feature register](/cli/azure/feature#az_feature_register) command.

```azurecli
az feature register --namespace Microsoft.Storage \
    --name AllowRequireInfraStructureEncryption
```

To check the status of your registration with Azure CLI, call the [az feature](/cli/azure/feature#az_feature_show) command.

```azurecli
az feature show --namespace Microsoft.Storage \
    --name AllowRequireInfraStructureEncryption
```

After your registration is approved, you must re-register the Azure Storage resource provider. To re-register the resource provider with Azure CLI, call the [az provider register](/cli/azure/provider#az_provider_register) command.

```azurecli
az provider register --namespace 'Microsoft.Storage'
```

# [Template](#tab/template)

N/A

---

## Create an account with infrastructure encryption enabled

You must configure a storage account to use infrastructure encryption at the time that you create the account. The storage account must be of type general-purpose v2.

Infrastructure encryption cannot be enabled or disabled after the account has been created.

# [Azure portal](#tab/portal)

To use PowerShell to create a storage account with infrastructure encryption enabled, follow these steps:

1. In the Azure portal, navigate to the **Storage accounts** page.
1. Choose the **Add** button to add a new general-purpose v2 storage account.
1. On the **Advanced** tab, locate **Infrastructure** encryption, and select **Enabled**.
1. Select **Review + create** to finish creating the storage account.

    :::image type="content" source="media/infrastructure-encryption-enable/create-account-infrastructure-encryption-portal.png" alt-text="Screenshot showing how to enable infrastructure encryption when creating account":::

# [PowerShell](#tab/powershell)

To use PowerShell to create a storage account with infrastructure encryption enabled, make sure you have installed the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 2.2.0 or later. For more information, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

Next, create a general-purpose v2 storage account by calling the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Include the `-RequireInfrastructureEncryption` option to enable infrastructure encryption.

The following example shows how to create a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and has infrastructure encryption enabled for double encryption of data. Remember to replace the placeholder values in brackets with your own values:

```powershell
New-AzStorageAccount -ResourceGroupName <resource_group> `
    -AccountName <storage-account> `
    -Location <location> `
    -SkuName "Standard_RAGRS" `
    -Kind StorageV2 `
    -RequireInfrastructureEncryption
```

# [Azure CLI](#tab/azure-cli)

To use Azure CLI to create a storage account that has infrastructure encryption enabled, make sure you have installed Azure CLI version 2.8.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Next, create a general-purpose v2 storage account by calling the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command and include the `--require-infrastructure-encryption option` to enable infrastructure encryption.

The following example shows how to create a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and has infrastructure encryption enabled for double encryption of data. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_RAGRS \
    --kind StorageV2 \
    --require-infrastructure-encryption
```

# [Template](#tab/template)

The following JSON example creates a general-purpose v2 storage account that is configured for read-access geo-redundant storage (RA-GRS) and has infrastructure encryption enabled for double encryption of data. Remember to replace the placeholder values in brackets with your own values:

```json
"resources": [
    {
        "type": "Microsoft.Storage/storageAccounts",
        "apiVersion": "2019-06-01",
        "name": "[parameters('<storage-account>')]",
        "location": "[parameters('<location>')]",
        "dependsOn": [],
        "tags": {},
        "sku": {
            "name": "[parameters('Standard_RAGRS')]"
        },
        "kind": "[parameters('StorageV2')]",
        "properties": {
            "accessTier": "[parameters('<accessTier>')]",
            "supportsHttpsTrafficOnly": "[parameters('supportsHttpsTrafficOnly')]",
            "largeFileSharesState": "[parameters('<largeFileSharesState>')]",
            "encryption": {
                "keySource": "Microsoft.Storage",
                "requireInfrastructureEncryption": true,
                "services": {
                    "blob": { "enabled": true },
                    "file": { "enabled": true }
              }
            }
        }
    }
],
```

---

## Verify that infrastructure encryption is enabled

# [Azure portal](#tab/portal)

To verify that infrastructure encryption is enabled for a storage account with the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, choose **Encryption**.

    :::image type="content" source="media/infrastructure-encryption-enable/verify-infrastructure-encryption-portal.png" alt-text="Screenshot showing how to verify that infrastructure encryption is enabled for account":::

# [PowerShell](#tab/powershell)

To verify that infrastructure encryption is enabled for a storage account with PowerShell, call the [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) command. This command returns a set of storage account properties and their values. Retrieve the `RequireInfrastructureEncryption` field within the `Encryption` property and verify that it is set to `True`.

The following example retrieves the value of the `RequireInfrastructureEncryption` property. Remember to replace the placeholder values in angle brackets with your own values:

```powershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account>
$account.Encryption.RequireInfrastructureEncryption
```

# [Azure CLI](#tab/azure-cli)

To verify that infrastructure encryption is enabled for a storage account with Azure CLI, call the [az storage account show](/cli/azure/storage/account#az_storage_account_show) command. This command returns a set of storage account properties and their values. Look for the `requireInfrastructureEncryption` field within the `encryption` property and verify that it is set to `true`.

The following example retrieves the value of the `requireInfrastructureEncryption` property. Remember to replace the placeholder values in angle brackets with your own values:

```azurecli-interactive
az storage account show /
    --name <storage-account> /
    --resource-group <resource-group>
```

# [Template](#tab/template)

N/A

---

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
