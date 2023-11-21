---
title: Configure customer-managed keys for encryption
titleSuffix: Azure Load Testing
description: Learn how to configure customer-managed keys for your Azure load testing resource with Azure Key Vault
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 09/18/2023
ms.topic: how-to
---

# Configure customer-managed keys for Azure Load Testing with Azure Key Vault

Azure Load Testing automatically encrypts all data stored in your load testing resource with keys that Microsoft provides (service-managed keys). Optionally, you can add a second layer of security by also providing your own (customer-managed) keys. Customer-managed keys offer greater flexibility for controlling access and using key-rotation policies.

The keys you provide are stored securely using [Azure Key Vault](../key-vault/general/overview.md). You can create a separate key for each Azure load testing resource you enable with customer-managed keys.

When you use customer-managed encryption keys, you need to specify a user-assigned managed identity to retrieve the keys from Azure Key Vault.

Azure Load Testing uses the customer-managed key to encrypt the following data in the load testing resource:

- Test script and configuration files
- Secrets
- Environment variables

> [!NOTE]
> Azure Load Testing does not encrypt metrics data for a test run with your customer-managed key, including the JMeter metrics sampler names that you specify in the JMeter script. Microsoft has access to this metrics data.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An existing user-assigned managed identity. For more information about creating a user-assigned managed identity, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

## Limitations

- Customer-managed keys are only available for new Azure load testing resources. You should configure the key during resource creation.

- Once customer-managed key encryption is enabled on a resource, it can't be disabled.

- Azure Load Testing can't automatically rotate the customer-managed key to use the latest version of the encryption key. You should update the key URI in the resource after the key is rotated in the Azure Key Vault.

## Configure your Azure key vault

To use customer-managed encryption keys with Azure Load Testing, you need to store the key in Azure Key Vault. You can use an existing key vault or create a new one. The load testing resource and key vault may be in different regions or subscriptions in the same tenant.

Make sure to configure the following key vault settings when you use customer-managed encryption keys.

### Configure key vault networking settings

If you restricted access to your Azure key vault by a firewall or virtual networking, you need to grant access to Azure Load Testing for retrieving your customer-managed keys. Follow these steps to [grant access to trusted Azure services](/azure/key-vault/general/overview-vnet-service-endpoints#grant-access-to-trusted-azure-services).

### Configure soft delete and purge protection

You have to set the *Soft Delete* and *Purge Protection* properties on your key vault to use customer-managed keys with Azure Load Testing. Soft delete is enabled by default when you create a new key vault and can't be disabled. You can enable purge protection at any time. Learn more about [soft delete and purge protection in Azure Key Vault](/azure/key-vault/general/soft-delete-overview).

# [Azure portal](#tab/portal)

Follow these steps to [verify if soft delete is enabled and enable it on a key vault](/azure/key-vault/general/key-vault-recovery?tabs=azure-portal#verify-if-soft-delete-is-enabled-on-a-key-vault-and-enable-soft-delete). Soft delete is abled by default when you create a new key vault.

You can enable purge protection when you [create a new key vault](/azure/key-vault/general/quick-create-portal) by selecting the **Enable purge protection** settings.

:::image type="content" source="media/how-to-configure-customer-managed-keys/purge-protection-on-azure-key-vault.png" alt-text="Screenshot that shows how to enable purge protection when creating a new key vault in the Azure portal.":::

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under **Settings**, choose **Properties**.
1. In the **Purge protection** section, choose **Enable purge protection**.

# [PowerShell](#tab/powershell)

To create a new key vault with PowerShell, install version 2.0.0 or later of the [Az.KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault/2.0.0) PowerShell module. Then call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault) to create a new key vault. With version 2.0.0 and later of the Az.KeyVault module, soft delete is enabled by default when you create a new key vault.

The following example creates a new key vault with both soft delete and purge protection enabled. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
$keyVault = New-AzKeyVault -Name <key-vault-name> `
    -ResourceGroupName <resource-group> `
    -Location <location> `
    -EnablePurgeProtection
```

To enable purge protection on an existing key vault with PowerShell:

```azurepowershell
Update-AzKeyVault -VaultName <key-vault-name> -ResourceGroupName <resource-group> -EnablePurgeProtection
```

# [Azure CLI](#tab/azure-cli)

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). Soft delete is enabled by default when you create a new key vault.

The following example creates a new key vault with both soft delete and purge protection enabled. Remember to replace the placeholder values in brackets with your own values.

```azurecli
az keyvault create \
    --name <key-vault-name> \
    --resource-group <resource-group> \
    --location <region> \
    --enable-purge-protection
```

To enable purge protection on an existing key vault with Azure CLI:

```azurecli
az keyvault update --subscription <subscription-id> -g <resource-group> -n <key-vault-name> --enable-purge-protection true
```

---

## Add a customer-managed key to Azure Key Vault

Next, add a key to the key vault. Azure Load Testing encryption supports RSA keys. For more information about supported key types in Azure Key Vault, see [About keys](/azure/key-vault/keys/about-keys).

# [Azure portal](#tab/portal)

To learn how to add a key with the Azure portal, see [Set and retrieve a key from Azure Key Vault using the Azure portal](../key-vault/keys/quick-create-portal.md).

# [PowerShell](#tab/powershell)

To add a key with PowerShell, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$key = Add-AzKeyVaultKey -VaultName <key-vault-name> `
    -Name <key-name> `
    -Destination 'Software'
```

# [Azure CLI](#tab/azure-cli)

To add a key with Azure CLI, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli
az keyvault key create \
    --name <key-name> \
    --vault-name <key-vault-name>
```

---

## Add an access policy to your key vault

When you use customer-managed encryption keys, you have to specify a user-assigned managed identity. The user-assigned managed identity for accessing the customer-managed keys in Azure Key Vault must have appropriate permissions to access the key vault.

1. In the [Azure portal](https://portal.azure.com), go to the Azure key vault instance that you plan to use to host your encryption keys.

1. Select **Access Policies** from the left menu.

    :::image type="content" source="media/how-to-configure-customer-managed-keys/access-policies-azure-key-vault.png" alt-text="Screenshot that shows the access policies option for a key vault in the Azure portal.":::

1. Select **+ Add Access Policy**.

1. In the **Key permissions** drop-down menu, select **Get**, **Unwrap Key**, and **Wrap Key** permissions.

    :::image type="content" source="media/how-to-configure-customer-managed-keys/azure-key-vault-permissions.png" alt-text="Screenshot that shows Azure Key Vault permissions.":::

1. In **Select principal**, select **None selected**.

1. Search for the user-assigned managed identity you created earlier, and select it from the list.

1. Choose **Select** at the bottom.

1. Select **Add** to add the new access policy.

1. Select **Save** on the key vault instance to save all changes.

## Use customer-managed keys with Azure Load Testing

You can only configure customer-managed encryption keys when you create a new Azure load testing resource. When you specify the encryption key details, you also have to select a user-assigned managed identity to retrieve the key from Azure Key Vault.

To configure customer-managed keys for a new load testing resource, follow these steps:

# [Azure portal](#tab/portal)

1. Follow these steps to [create an Azure load testing resource in the Azure portal](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource) and fill out the fields on the **Basics** tab.

1. Go to the **Encryption** tab, and then select *Customer-managed keys (CMK)* for the **Encryption type** field.

1. In the **Key URI** field, paste the URI/key identifier of the Azure Key Vault key including the key version.

1. For the **User-assigned identity** field, select an existing user-assigned managed identity.

1. Select **Review + create** to validate and create the new resource.

:::image type="content" source="media/how-to-configure-customer-managed-keys/encryption-new-azure-load-testing-resource.png" alt-text="Screenshot that shows how to enable customer managed key encryption while creating an Azure load testing resource.":::

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

The following code sample shows an ARM template for creating a load testing resource with customer-managed keys enabled:

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

Deploy the above template to a resource group by using [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

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

The following code sample shows an ARM template for creating a load testing resource with customer-managed keys enabled:

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

Deploy the above template to a resource group by using [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

```azurecli-interactive
az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>
```

----

## Change the managed identity for retrieving the encryption key

You can change the managed identity for customer-managed keys for an existing load testing resource at any time.

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.

1. On the **Settings** page, select **Encryption**.

    The **Encryption type** shows the encryption type that was used for creating the load testing resource.

1. If the encryption type is **Customer-managed keys**, select the type of identity to use to authenticate to the key vault. The options include **System-assigned** (the default) or **User-assigned**.

    To learn more about each type of managed identity, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    - If you select **System-assigned**, the system-assigned managed identity needs to be enabled on the resource and granted access to the AKV before changing the identity for customer-managed keys.
    - If you select **User-assigned**, you must select an existing user-assigned identity that has permissions to access the key vault. To learn how to create a user-assigned identity, see [Use managed identities for Azure Load Testing Preview](how-to-use-a-managed-identity.md).

1. Save your changes.

:::image type="content" source="media/how-to-configure-customer-managed-keys/change-identity-existing-azure-load-testing-resource.png" alt-text="Screenshot that shows how to change the managed identity for customer managed keys on an existing Azure load testing resource.":::

> [!IMPORTANT]
> Make sure that the selected [managed identity has access to the Azure Key Vault](#add-an-access-policy-to-your-key-vault).

## Update the customer-managed encryption key

You can change the key that you're using for Azure Load Testing encryption at any time. To change the key with the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.

1. On the **Settings** page, select **Encryption**. The **Encryption type** shows the encryption selected for the resource while creation.

1. If the selected encryption type is *Customer-managed keys*, you can edit the **Key URI** field with the new key URI.

1. Save your changes.

## Rotate encryption keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. To rotate a key:

1. In Azure Key Vault, update the key version or create a new key. 
1. [Update the customer-managed encryption key](#update-the-customer-managed-encryption-key) for your load testing resource.

## Frequently asked questions

### Is there an extra charge to enable customer-managed keys?

No, there's no charge to enable this feature.

### Are customer-managed keys supported for existing Azure load testing resources?

This feature is currently only available for new Azure load testing resources.

### How can I tell if customer-managed keys are enabled on my Azure load testing resource?

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.
1. Go to the **Encryption** item in the left navigation bar.
1. You can verify the **Encryption type** on your resource.

### How do I revoke an encryption key?

You can revoke a key by disabling the latest version of the key in Azure Key Vault. Alternatively, to revoke all keys from a key vault instance, you can delete the access policy granted to the managed identity of the load testing resource.

When you revoke the encryption key you may be able to run tests for about 10 minutes, after which the only available operation is resource deletion. It's recommended to rotate the key instead of revoking it to manage resource security and retain your data.

## Related content

- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [Parameterize a load test with secrets and environment variables](./how-to-parameterize-load-tests.md).
