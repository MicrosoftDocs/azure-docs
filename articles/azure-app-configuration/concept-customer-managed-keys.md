---
title: Use Customer-Managed Keys to Encrypt Configuration Data 
description: Encrypt your configuration data using customer-managed keys
author: maud-lv
ms.author: malev
ms.date: 02/20/2024
ms.custom: devdivchpfy22, devx-track-azurecli
ms.topic: conceptual
ms.service: azure-app-configuration
---
# Use customer-managed keys to encrypt your App Configuration data

Azure App Configuration [encrypts sensitive information at rest](../security/fundamentals/encryption-atrest.md). The use of customer-managed keys in App Configuration provides enhanced data protection. Specifically, when you use managed-key encryption, all sensitive information in App Configuration is encrypted with an Azure Key Vault key that you provide. As a result, you can rotate the encryption key on demand. You can also revoke the access that App Configuration has to sensitive information by revoking the App Configuration instance's access to the key.

## Overview

App Configuration encrypts sensitive information at rest by using a 256-bit Advanced Encryption Standard (AES) encryption key provided by Microsoft. Every App Configuration instance has its own encryption key that's managed by the service and used to encrypt sensitive information. Sensitive information includes the values found in key-value pairs.

When you use a customer-managed key in App Configuration, the following events take place:

* App Configuration uses a managed identity assigned to the App Configuration instance to authenticate with Microsoft Entra ID.
* The managed identity calls Azure Key Vault and wraps the App Configuration instance's encryption key.
* The wrapped encryption key is stored.
* The unwrapped encryption key is cached within App Configuration for one hour.
* Every hour, App Configuration refreshes the unwrapped version of the App Configuration instance's encryption key.

This process ensures availability under normal operating conditions.

> [!IMPORTANT]
> When any of the following conditions are met, sensitive information stored in the App Configuration instance can't be decrypted:
> 
> * The identity assigned to the App Configuration instance is no longer authorized to unwrap the instance's encryption key.
> * The managed key is permanently deleted.
> * The managed key version that's in use expires.
> 
> You can use the [soft delete](/azure/key-vault/general/soft-delete-overview) function in Key Vault to mitigate the chance of accidentally deleting your encryption key. To mitigate the possibility of the underlying managed key expiring, you can omit the key version when you configure managed-key encryption and set up [key auto-rotation](/azure/key-vault/keys/how-to-configure-key-rotation) in key vault.

## Requirements

The following components are required to successfully enable the customer-managed key capability for Azure App Configuration:

* A Standard or Premium tier Azure App Configuration instance.
* An Azure Key Vault with soft-delete and purge-protection features enabled.
* An RSA or RSA-HSM key within the Key Vault.
  * The key must not be expired, it must be enabled, and it must have both wrap and unwrap capabilities enabled.

After these resources are configured, use the following steps so that the Azure App Configuration can use the Key Vault key:

1. Assign a managed identity to the Azure App Configuration instance.
1. Grant permissions to the identity to be able to access the Key Vault key.
    * For Key Vault's with [Azure RBAC](/azure/key-vault/general/rbac-guide) enabled, assign the identity the `Key Vault Crypto Service Encryption User` role on the target Key Vault.
    * For Key Vault's using access policy authorization, grant the identity `GET`, `WRAP`, and `UNWRAP` permissions in the target Key Vault's access policy.

## Enable customer-managed key encryption

1. [Create an App Configuration store](./quickstart-azure-app-configuration-create.md) in the Standard or Premium tier if you don't have one.

1. Use the Azure CLI to create an Azure Key Vault with purge protection enabled. Soft delete is enabled by default. Both `vault-name` and `resource-group-name` are user-provided and must be unique. We use `contoso-vault` and `contoso-resource-group` in these examples. 

    ```azurecli
    az keyvault create --name contoso-vault --resource-group contoso-resource-group --enable-purge-protection
    ```

    The output of this command lists the resource id, `id`, of the key vault. Make a note of its value, which has the following format:

    `/subscriptions/<subscription-ID>/resourceGroups/<Key-Vault-resource-group>/providers/Microsoft.KeyVault/vaults/<Key-Vault-name>`

1. Use the Azure CLI to assign yourself the access to Key Vault that you need to create a key. The command you use depends on the access configuration of your key vault. Two types of access configuration are available:

    * Azure role-based access control (Azure RBAC)
    * A vault access policy

    For both types, you need your user object ID to run the command. You can find your user object ID in the Azure portal:

    1. Select **Microsoft Entra ID**, and then select **Manage** > **Users**.
    1. Enter your name in the search box, and then select your user in the results.
    1. Copy the **Object ID** value.

    ### [Azure RBAC](#tab/azurerbac)

    In the following command:

    * Replace `<role>` with a role like **Key Vault Crypto Officer** or **Key Vault Administrator** that gives you the access you need to create a key.
    * Replace <key-vault-resource-ID> with the key vault ID you noted in the previous step.

    ```azurecli
    az role assignment create --assignee <user-object-ID> --role <role> --scope <key-vault-resource-ID>
    ```

    ### [Access Policy](#tab/accesspolicy)

    ```azurecli
    az keyvault set-policy -n <key-vault-name> --resource-group <key-vault-resource-group-name> --object-id <user-object-ID> --key-permissions create
    ```

    ---

1. Create a Key Vault key. Provide a unique `key-name` for this key, and substitute the name of the Key Vault (`contoso-vault`) created in step 2. Specify whether you prefer `RSA` or `RSA-HSM` encryption (`RSA-HSM` is only available in the Premium tier).

    ```azurecli
    az keyvault key create --name key-name --kty {RSA or RSA-HSM} --vault-name contoso-vault
    ```

    The output of this command lists the key ID (`kid`) for the generated key. Make a note of the key ID to use later in this exercise. The key ID has the form: `https://{my key vault}.vault.azure.net/keys/{key-name}/{key-version}`. The key ID has three important components:
    
    * Key Vault URI: `https://{my key vault}.vault.azure.net`
    * Key Vault key name: `{key-name}`
    * Key Vault key version: `{key-version}`

1. Create a managed identity.

    * To create a user-assigned managed identity, follow the steps in [Adding a user-assigned identity](./overview-managed-identity.md#adding-a-user-assigned-identity).

    * To create a system-assigned managed identity, use the following Azure CLI command. Substitute the name of your App Configuration instance and resource group used in the previous steps. The managed identity will be used to access the managed key. We use `contoso-app-config` to illustrate the name of an App Configuration instance:

    ```azurecli
    az appconfig identity assign --name contoso-app-config --resource-group contoso-resource-group --identities [system]
    ```

    The output of this command includes the principal ID (`"principalId"`) and tenant ID (`"tenantId"`) of the system-assigned identity. These IDs will be used to grant the identity access to the managed key.

    ```json
    {
        "principalId": {Principal Id},
        "tenantId": {Tenant Id},
        "type": "SystemAssigned",
        "userAssignedIdentities": null
    }
    ```

1. The managed identity of the Azure App Configuration instance needs access to the key to perform key validation, encryption, and decryption. The specific set of actions to which it needs access includes: `GET`, `WRAP`, and `UNWRAP` for keys. These permissions can be granted by assigning the `Key Vault Crypto Service Encryption User` role for Azure RBAC enabled Key Vaults. For Key Vaults using access policy authorization, set the policy for the aforementioned key permissions. Granting access requires the principal ID of the App Configuration instance's managed identity. Replace the value shown below as `contoso-principalId` with the principal ID obtained in the previous step. Grant permission to the managed key by using the command line:

    ### [Azure RBAC](#tab/azurerbac)

    For Key Vaults with Azure RBAC enabled, use the following command.

    ```azurecli
    az role assignment create --assignee contoso-principalId --role "Key Vault Crypto Service Encryption User" --scope key-vault-resource-id
    ```

    ### [Access Policy](#tab/accesspolicy)
    
    For Key Vaults using access policy authorization, use the following command.

    ```azurecli
    az keyvault set-policy -n contoso-vault --resource-group row12appconfigrg --object-id contoso-principalId --key-permissions get wrapKey unwrapKey
    ```

    ---

1. Now that the Azure App Configuration instance can access the managed key, we can enable the customer-managed key capability in the service by using the Azure CLI. Recall the following properties recorded during the key creation steps: `key name` `key vault URI`.

   ```azurecli
   az appconfig update -g contoso-resource-group -n contoso-app-config --encryption-key-name key-name --encryption-key-vault key-vault-Uri
   ```

   The command uses system-assigned managed identity to authenticate with the key vault by default. 

   > [!NOTE]
   > When using a user-assigned managed identity to access the customer-managed key, you can specify its client ID explicitly by adding `--identity-client-id <client ID of your user assigned identity>` to the command.

Your Azure App Configuration instance is now configured to use a customer-managed key stored in Azure Key Vault.

## Disable customer-managed key encryption

1. Ensure the current customer-managed key is valid and operational. App Configuration needs to decrypt existing data with the current key before reverting to Microsoft-managed keys. If the current key has expired or its access has been revoked, you must first restore access to that key.

1. Use the Azure CLI to update your App Configuration instance and remove the customer-managed key configuration. Replace `contoso-resource-group` and `contoso-app-config` with the appropriate values for your setup.

   ```azurecli
   az appconfig update -g contoso-resource-group -n contoso-app-config --encryption-key-name ""
   ```

   This command removes the customer-managed key configuration from your App Configuration instance.

1. Verify that the customer-managed key configuration has been removed by checking the properties of your App Configuration instance.

   ```azurecli
   az appconfig show -g contoso-resource-group -n contoso-app-config --query "encryption"
   ```

   The output should show that the `encryption.keyVaultProperties` property is set to `null`.

Your Azure App Configuration instance is now configured to use Microsoft managed keys for encryption.

> [!NOTE]
> If you disable customer-managed key encryption, your App Configuration instance reverts to using Microsoft managed keys. Ensure that this change aligns with your organization's security policies and compliance requirements.

## Access revocation

When you enable the customer-managed key capability on your App Configuration instance, you control the service's ability to access your sensitive information. The managed key serves as a root encryption key.

You can revoke your App Configuration instance's access to your managed key by changing your key vault access policy. When you revoke this access, App Configuration loses the ability to decrypt user data within one hour. At this point, the App Configuration instance forbids all access attempts.

This situation is recoverable by granting the service access to the managed key again. Within one hour, App Configuration is able to decrypt user data and operate under normal conditions.

> [!NOTE]
> All App Configuration data is stored for up to 24 hours in an isolated backup. This data includes the unwrapped encryption key. This data isn't immediately available to the service or service team. In the event of an emergency restore, App Configuration revokes itself again from the managed key data.

## Key rotation

When you configure a customer-managed key on an App Configuration instance, you need to periodically rotate the managed key to ensure that it doesn't expire. For a successful key rotation, the current key must be valid and operational. If the current key is expired or App Configuration access to it is revoked, the App Configuration instance isn't able to decrypt data, making rotation impossible.

[Key vault key auto-rotation](/azure/key-vault/keys/how-to-configure-key-rotation) can be configured to avoid the need to manually rotate encryption keys, and thus ensure that the latest version of a key remains valid. When relying on key vault key auto-rotation, you should ensure your App Configuration instance's managed key configuration does not reference a specific key version. Omitting the version allows App Configuration to always move to the latest version of the key vault key when an auto-rotation is performed. Failure to rotate the managed key can be considered a security concern, but additionally a lack of rotation can result in loss of access to the App Configuration instance. This is due to the fact that if the managed key version in use expires, then App Configuration will not be able to decrypt data.

To recap, the following best practices are encouraged:

* Enable [key vault key auto-rotation](/azure/key-vault/keys/how-to-configure-key-rotation) for your managed key.
* Omit using a specific version of a key vault key when setting up customer-managed key encryption.

### Versioned vs versionless keys

Setting up customer-managed key encryption requires passing an identifier of a key in key vault. A key vault key identifier may or may not contain a version. Our recommendation is to omit version when configuring customer-managed key encryption to enable auto-rotation. Using a versioned key should be considered carefully as failure to manually rotate will result in loss of access to the App Configuration instance if the key version in question expires.

* Versionless key identifier example: `https://{my key vault}.vault.azure.net/keys/{key-name}`
* Versioned key identifier example (not recommended): `https://{my key vault}.vault.azure.net/keys/{key-name}/{key-version}`

## Next Steps

In this article, you configured your Azure App Configuration instance to use a customer-managed key for encryption. To learn more about how to integrate your app service with Azure managed identities, continue to the next step.

> [!div class="nextstepaction"]
> [Integrate your service with Azure Managed Identities](./howto-integrate-azure-managed-service-identity.md)
