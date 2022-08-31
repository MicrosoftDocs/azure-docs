---
title: Configure customer-managed keys for encryption
titleSuffix: Azure Load Testing
description: Learn how to configure customer-managed keys for your Azure Load Testing resource with Azure Key Vault
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 05/10/2022
ms.topic: how-to
---

# Configure customer-managed keys for your Azure Load Testing Preview resource with Azure Key Vault

Azure Load Testing Preview automatically encrypts all data stored in your load testing resource with keys that Microsoft provides (service-managed keys). Optionally, you can add a second layer of security by also providing your own (customer-managed) keys. Customer-managed keys offer greater flexibility for controlling access and using key-rotation policies.

The keys you provide are stored securely using [Azure Key Vault](../key-vault/general/overview.md). You can create a separate key for each Azure Load Testing resource you enable with customer-managed keys.

Azure Load Testing uses the customer-managed key to encrypt the following data in the load testing resource:

- Test script and configuration files
- Secrets
- Environment variables

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An existing user-assigned managed identity. For more information about creating a user-assigned managed identity, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

## Limitations

- Customer-managed keys are only available for new Azure Load Testing resources. You should configure the key during resource creation.

- Azure Load Testing cannot automatically rotate the customer-managed key to use the latest version of the encryption key. You should update the key URI in the resource after the key is rotated in the Azure Key Vault.

- Once customer-managed key encryption is enabled on a resource, it cannot be disabled.

## Configure your Azure Key Vault
You can use a new or existing key vault to store customer-managed keys. The Azure Load Testing resource and key vault may be in different regions or subscriptions in the same tenant. 

You have to set the **Soft Delete** and **Purge Protection** properties on your Azure Key Vault instance to use customer-managed keys with Azure Load Testing. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection at any time.

# [Azure portal](#tab/portal)

To learn how to create a key vault with the Azure portal, see [Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md). When you create the key vault, select **Enable purge protection**, as shown in the following image.

:::image type="content" source="media/how-to-configure-customer-managed-keys/purge-protection-on-azure-key-vault.png" alt-text="Screenshot that shows how to enable purge protection on a new key vault.":::

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under **Settings**, choose **Properties**.
1. In the **Purge protection** section, choose **Enable purge protection**.

# [PowerShell](#tab/powershell)

To create a new key vault with PowerShell, install version 2.0.0 or later of the [Az.KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault/2.0.0) PowerShell module. Then call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault) to create a new key vault. With version 2.0.0 and later of the Az.KeyVault module, soft delete is enabled by default when you create a new key vault.

The following example creates a new key vault with both soft delete and purge protection enabled. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnablePurgeProtection
```

To learn how to enable purge protection on an existing key vault with PowerShell, see [Azure Key Vault recovery overview](../key-vault/general/key-vault-recovery.md?tabs=azure-powershell).

# [Azure CLI](#tab/azure-cli)

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). Remember to replace the placeholder values in brackets with your own values:

```azurecli
az keyvault create \
    --name <key-vault> \
    --resource-group <resource_group> \
    --location <region> \
    --enable-purge-protection
```

To learn how to enable purge protection on an existing key vault with Azure CLI, see [Azure Key Vault recovery overview](../key-vault/general/key-vault-recovery.md?tabs=azure-cli).

---

## Add a key

Next, add a key to the key vault. Azure Load Testing encryption supports RSA keys. For more information about supported key types, see [About keys](../key-vault/keys/about-keys.md).

# [Azure portal](#tab/portal)

To learn how to add a key with the Azure portal, see [Set and retrieve a key from Azure Key Vault using the Azure portal](../key-vault/keys/quick-create-portal.md).

# [PowerShell](#tab/powershell)

To add a key with PowerShell, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName `
    -Name <key> `
    -Destination 'Software'
```

# [Azure CLI](#tab/azure-cli)

To add a key with Azure CLI, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli
az keyvault key create \
    --name <key> \
    --vault-name <key-vault>
```

---

## Add an access policy to your Azure Key Vault

The user-assigned managed identity that you will use to configure customer-managed keys on Azure Load Testing resource must have appropriate permissions to access the key vault.

1. From the Azure portal, go to the Azure Key Vault instance that you plan to use to host your encryption keys. Select **Access Policies** from the left menu:

    :::image type="content" source="media/how-to-configure-customer-managed-keys/access-policies-azure-key-vault.png" alt-text="Screenshot that shows access policies option in Azure Key Vault.":::

1. Select **+ Add Access Policy**.

1. Under the **Key permissions** drop-down menu, select **Get**, **Unwrap Key**, and **Wrap Key** permissions:

    :::image type="content" source="media/how-to-configure-customer-managed-keys/azure-key-vault-permissions.png" alt-text="Screenshot that shows Azure Key Vault permissions.":::

1. Under **Select principal**, select **None selected**.

1. Search for the user-assigned managed identity you created and select it.

1. Choose **Select** at the bottom.

1. Select **Add** to add the new access policy.

1. Select **Save** on the Key Vault instance to save all changes.

## Configure customer-managed keys for a new Azure Load Testing resource

To configure customer-managed keys for a new Azure Load Testing resource, follow these steps:

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to the **Azure Load Testing** page, and select the **Create** button to create a new resource.

1. Follow the steps outlined in [create an Azure Load Testing resource](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource) to fill out the fields on the **Basics** tab.

1. Go to the **Encryption** tab. In the **Encryption type** field, select **Customer-managed keys (CMK)**.

1. In the **Key URI** field, paste the URI/key identifier of the Azure Key Vault key including the key version.

1. For the **User-assigned identity** field, select an existing user-assigned managed identity.

1. Select **Review + create** to validate and create the new resource.

:::image type="content" source="media/how-to-configure-customer-managed-keys/encryption-new-azure-load-testing-resource.png" alt-text="Screenshot that shows how to enable customer managed key encryption while creating an Azure Load Testing resource.":::

# [PowerShell](#tab/powershell)

You can deploy an ARM template using PowerShell to automate the creation of your Azure resources. You can create any resource of type `Microsoft.LoadTestService/loadtests` with customer managed key enabled for encryption by adding the following properties:

```json
"encryption": {
            "keyUrl": "https://contosovault.vault.azure.net/keys/contosokek/abcdef01234567890abcdef012345678",
            "identity": {
                "type": "UserAssigned",
                "resourceId": "User assigned managed identity resource id"
            }

```

For example, an Azure Load Testing resource might look like the following:

```json
{
    "type": "Microsoft.LoadTestService/loadtests",
    "apiVersion": "2022-04-15-preview",
    "name": "[parameters('name')]",
    "location": "[parameters('location')]",
    "tags": "[parameters('tags')]",
    "identity": {
        "type": "userassigned",
        "userAssignedIdentities": {
            "User assigned managed identity resource id": {}
        }
    },
    "properties": {
        "encryption": {
            "identity": {
                "type": "UserAssigned",
                "resourceId": "User assigned managed identity resource id"
            },
            "keyUrl": "https://contosovault.vault.azure.net/keys/contosokek/abcdef01234567890abcdef012345678"
        }
    }
}
```

Deploy the above template to a resource group, using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
```

# [Azure CLI](#tab/azure-cli)

You can deploy an ARM template using Azure CLI to automate the creation of your Azure resources. You can create any resource of type `Microsoft.LoadTestService/loadtests` with customer managed key enabled for encryption by adding the following properties:

```json
"encryption": {
            "keyUrl": "https://contosovault.vault.azure.net/keys/contosokek/abcdef01234567890abcdef012345678",
            "identity": {
                "type": "UserAssigned",
                "resourceId": "User assigned managed identity resource id"
            }
```

For example, an Azure Load Testing resource might look like the following:

```json
{
    "type": "Microsoft.LoadTestService/loadtests",
    "apiVersion": "2022-04-15-preview",
    "name": "[parameters('name')]",
    "location": "[parameters('location')]",
    "tags": "[parameters('tags')]",
    "identity": {
        "type": "userassigned",
        "userAssignedIdentities": {
            "User assigned managed identity resource id": {}
        }
    },
    "properties": {
        "encryption": {
            "identity": {
                "type": "UserAssigned",
                "resourceId": "User assigned managed identity resource id"
            },
            "keyUrl": "https://contosovault.vault.azure.net/keys/contosokek/abcdef01234567890abcdef012345678"
        }
    }
}
```

Deploy the above template to a resource group, using [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

```azurecli-interactive
az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>
```

----

## Change the managed identity

You can change the managed identity for customer-managed keys for an existing Azure Load Testing resource at any time.

1. Navigate to your Azure Load Testing resource.

1. On the **Settings** page, select **Encryption**.

    The **Encryption type** shows the encryption type you selected at resource creation time.

1. If the encryption type is **Customer-managed keys**, select the type of identity to use to authenticate to the key vault. The options include **System-assigned** (the default) or **User-assigned**.

    To learn more about each type of managed identity, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    - If you select System-assigned, the system-assigned managed identity needs to be enabled on the resource and granted access to the AKV before changing the identity for customer-managed keys.
    - If you select **User-assigned**, you must select an existing user-assigned identity that has permissions to access the key vault. To learn how to create a user-assigned identity, see [Use managed identities for Azure Load Testing Preview](how-to-use-a-managed-identity.md).

1. Save your changes.

:::image type="content" source="media/how-to-configure-customer-managed-keys/change-identity-existing-azure-load-testing-resource.png" alt-text="Screenshot that shows how to change the managed identity for customer managed keys on an existing Azure Load Testing resource.":::

> [!NOTE]
> The selected managed identity should have access granted on the Azure Key Vault.

## Change the key

You can change the key that you are using for Azure Load Testing encryption at any time. To change the key with the Azure portal, follow these steps:

1. Navigate to your Azure Load Testing resource.

1. On the **Settings** page, select **Encryption**. The **Encryption type** shows the encryption selected for the resource while creation.

1. If the selected encryption type is *Customer-managed keys*, you can edit the key URI field with the new key URI.

1. Save your changes.

## Key rotation

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. To rotate a key, in Azure Key Vault, update the key version or create a new key. You can then update the Azure Load Testing resource to [encrypt data using the new key URI](#change-the-key).

## Frequently asked questions

### Is there an additional charge to enable customer-managed keys?

No, there's no charge to enable this feature.

### Are customer-managed keys supported for existing Azure Load Testing resources?

This feature is currently only available for new Azure Load Testing resources.

### How can I tell if customer-managed keys are enabled on my Azure Load Testing account?

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
1. Go to the **Encryption** item in the left navigation bar.
1. You can verify the **Encryption type** on your resource.

### How do I revoke an encryption key?

You can revoke a key by disabling the latest version of the key in Azure Key Vault. Alternatively, to revoke all keys from an Azure Key Vault instance, you can delete the access policy granted to the managed identity of the Azure Load Testing resource.

When you revoke the encryption key you may be able to run tests for about 10 minutes, after which the only available operation is resource deletion. It is recommended to rotate the key instead of revoking it to manage resource security and retain your data.

## Next steps

- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [Parameterize a load test](./how-to-parameterize-load-tests.md).