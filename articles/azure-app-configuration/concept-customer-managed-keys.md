---
title: Use Customer-Managed Keys to Encrypt Configuration Data 
description: Find out how to use a customer-managed key to encrypt your configuration data so you can rotate the key on demand and revoke access to the key if needed.
author: maud-lv
ms.author: malev
ms.date: 08/12/2025
ms.custom: devdivchpfy22, devx-track-azurecli
ms.topic: concept-article
ms.service: azure-app-configuration
# customer intent: As a developer, I want to become familiar with customer-managed keys in Azure Key Vault so that I can use them to encrypt my Azure App Configuration data.
---
# Use customer-managed keys to encrypt your App Configuration data

Azure App Configuration [encrypts sensitive information at rest](../security/fundamentals/encryption-atrest.md). The use of customer-managed keys provides enhanced data protection by giving you greater control over your encryption keys. When you use managed-key encryption, all sensitive information in App Configuration is encrypted with an Azure Key Vault key that you provide. As a result, you can rotate the encryption key on demand. You can also revoke your App Configuration store's access to sensitive information by revoking the store's access to the key.

## Overview

App Configuration encrypts sensitive information at rest by using a 256-bit Advanced Encryption Standard (AES) encryption key provided by Microsoft. Every App Configuration store has its own encryption key that's managed by the service and used to encrypt sensitive information. Sensitive information includes the values found in key-value pairs.

When you use a customer-managed key in App Configuration, the following events take place:

* App Configuration uses a managed identity assigned to the App Configuration store to authenticate with Microsoft Entra ID.
* The managed identity calls Key Vault and wraps the encryption key of the App Configuration store.
* The wrapped encryption key is stored.
* The unwrapped encryption key is cached within App Configuration for one hour.
* Every hour, App Configuration refreshes the unwrapped version of the encryption key of the App Configuration store.

This process ensures availability under normal operating conditions.

> [!IMPORTANT]
> When any of the following conditions are met, sensitive information stored in the App Configuration store can't be decrypted:
> 
> * The identity assigned to the App Configuration store is no longer authorized to unwrap the store's encryption key.
> * The managed key is permanently deleted.
> * The managed key version that's in use expires.
> 
> You can use the [soft delete](/azure/key-vault/general/soft-delete-overview) function in Key Vault to mitigate the chance of accidentally deleting your encryption key. To mitigate the possibility of the underlying managed key expiring, you can omit the key version when you configure managed-key encryption and set up automatic key rotation in Key Vault. For more information, see [Key rotation](#key-rotation), later in this article.

## Requirements

The following components are required to successfully enable the customer-managed key capability for App Configuration. This article shows you how to set up these components.

* A Standard-tier or Premium-tier App Configuration store.
* An instance of Key Vault that has the soft-delete and purge-protection features enabled.
* A key in the key vault that meets the following requirements:
  * It uses Rivest-Shamir-Adleman (RSA) encryption or RSA encryption that uses a hardware security module (RSA-HSM).
  * It isn't expired.
  * It's enabled.
  * It has wrap and unwrap capabilities enabled.

After this article shows you how to configure these resources, it walks you through the following steps so your App Configuration store can use the Key Vault key:

1. Assign a managed identity to the App Configuration store.
1. Grant permissions to the identity so it can access the Key Vault key:
    * For key vaults that use [Azure role-based access control (Azure RBAC)](/azure/key-vault/general/rbac-guide), assign the identity the **Key Vault Crypto Service Encryption User** role on the target key vault.
    * For key vaults that use access policy authorization, grant the identity the `GET`, `WRAP`, and `UNWRAP` permissions in the target key vault's access policy.

## Enable customer-managed key encryption

To use customer-managed key encryption, take the steps in the following sections.

### Create resources

1. Create an App Configuration store in the Standard or Premium tier if you don't have one. For instructions, see [Quickstart: Create an Azure App Configuration store](./quickstart-azure-app-configuration-create.md).

1. Run the following Azure CLI command to create an instance of Key Vault that has purge protection enabled. Soft delete is enabled by default. Replace `<vault-name>` and `<resource-group-name>` with your own unique values.

    ```azurecli
    az keyvault create --name <vault-name> --resource-group <resource-group-name> --enable-purge-protection
    ```

    The output of this command lists the resource ID, `id`, of the key vault. Note its value, which has the following format:

    `/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<vault-name>`

1. Use the Azure CLI to assign yourself the access to your key vault that you need to create a key. The command you use depends on the authorization system that your key vault uses. Two models are available:

    * The Azure RBAC model
    * The access policy model

    For both models, you need your user object ID to run the command. You can find your user object ID by using one of the following methods:

    * Use the `az ad user show --id <user-principal-name>` command in the Azure CLI, where `<user-principal-name>` is your user principal name (UPN).

    * Use the [Azure portal](https://portal.azure.com):
      1. Select **Microsoft Entra ID**, and then select **Manage** > **Users**.
      1. Enter your name in the search box, and then select your username in the results.
      1. Copy the **Object ID** value.

    Assign yourself access by running the command that's appropriate for the authorization system of your key vault:

    ### [Azure RBAC](#tab/azurerbac)

    Replace the placeholders with the following values:

    * For `<user-object-ID>`, use the object ID you just found.
    * For `<role>`, use a role such as **Key Vault Crypto Officer** that gives you the access you need to create a key. Enclose the role in quotation marks.
    * For `<vault-resource-ID>`, use the key vault resource ID from the previous step.

    ```azurecli
    az role assignment create --assignee <user-object-ID> --role <role> --scope <vault-resource-ID>
    ```

    ### [Access policy](#tab/accesspolicy)

    Replace the placeholders with the following values:

    * For `<vault-name>`, use the name of the key vault from step 2.
    * For `<user-object-ID>`, use the object ID you just found.

    ```azurecli
    az keyvault set-policy -n <vault-name> --object-id <user-object-ID> --key-permissions create
    ```

    ---

1. Create a Key Vault key by running the following command. Replace the placeholders with the following values:

    * For `<key-name>`, use your own unique value.
    * For `<key-type>`:
      * Use `RSA` for RSA encryption.
      * Use `RSA-HSM` for RSA-HSM encryption. RSA-HSM encryption is only available in the Premium tier.
    * For `<vault-name>`, use the name of the key vault from step 2.

    ```azurecli
    az keyvault key create --name <key-name> --kty <key-type> --vault-name <vault-name>
    ```

    The output of this command lists the key ID, `kid`, of the generated key. Note its value, which has the following format:

    `https://<vault-name>.vault.azure.net/keys/<key-name>/<key-version>`

    The key ID contains the following components:
    
    * The key vault URI: `https://<vault-name>.vault.azure.net`
    * The key vault key name: `<key-name>`
    * The key vault key version: `<key-version>`

1. Create a managed identity for your App Configuration store by using one of the following options:

    * To create a user-assigned managed identity, follow the steps in [Adding a user-assigned identity](./overview-managed-identity.md#adding-a-user-assigned-identity). Note the values of the `clientId` and `principalId` properties of the identity.

    * To create a system-assigned managed identity, use the following Azure CLI command. Replace the placeholders with the following values:
      * For `<App-Configuration-store-name>`, use the name of the App Configuration store from step 1.
      * For `<resource-group-name>`, use the name of the resource group that contains your App Configuration store.

    ```azurecli
    az appconfig identity assign --name <App-Configuration-store-name> --resource-group <resource-group-name> --identities [system]
    ```

    The output of this command includes the principal ID, `principalId`, and the tenant ID, `tenantId`, of the system-assigned identity. Note the value of the `principalID` property.

    ```json
    {
        "principalId": <principal-ID>,
        "tenantId": <tenant-ID>,
        "type": "SystemAssigned",
        "userAssignedIdentities": null
    }
    ```

### Grant access and enable the key

The managed identity of your App Configuration store needs access to the key to perform key validation, encryption, and decryption. Specifically, the managed identity needs access to the `GET`, `WRAP`, and `UNWRAP` actions for keys.

* For key vaults that use Azure RBAC, you can grant these permissions by assigning the **Key Vault Crypto Service Encryption User** role to the managed identity.
* For key vaults that use access policy authorization, you can set a policy for these key permissions.

1. Grant the managed identity access to the managed key by using the command that's appropriate for the authorization system of your key vault. For both systems, replace `<managed-identity-principal-ID>` with the principal ID from the previous step.

    ### [Azure RBAC](#tab/azurerbac)

    Replace `<key-vault-resource-id>` with the resource ID of the key vault from step 2 of [Create resources](#create-resources).

    ```azurecli
    az role assignment create --assignee <managed-identity-principal-ID> --role "Key Vault Crypto Service Encryption User" --scope <key-vault-resource-id>
    ```

    ### [Access policy](#tab/accesspolicy)

    Replace `<vault-name>` with the name of the key vault from step 2 of [Create resources](#create-resources).

    ```azurecli
    az keyvault set-policy -n <vault-name> --object-id <managed-identity-principal-ID> --key-permissions get wrapKey unwrapKey
    ```

    ---

1. Enable the customer-managed key capability in the service by running one of the following Azure CLI commands. Replace the placeholders with the following values:

    * For `<resource-group-name>`, use the name of the resource group that contains your App Configuration store.
    * For `<App-Configuration-store-name>`, use the name of your App Configuration store.
    * For `<key-name>` and `<key-vault-URI>`, use the values from step 4 of [Create resources](#create-resources).

    By default, the command uses a system-assigned managed identity to authenticate with the key vault.

    * If you use a system-assigned managed identity to access the customer-managed key, run the following command:

      ```azurecli
      az appconfig update -g <resource-group-name> -n <App-Configuration-store-name> --encryption-key-name <key-name> --encryption-key-vault <key-vault-URI>
      ```

    * If you use a user-assigned managed identity to access the customer-managed key, run the following command, which specifies the client ID explicitly. Replace `<user-assigned-managed-identity-client-ID>` with the `clientId` value from step 5 of [Create resources](#create-resources).

      ```azurecli
      az appconfig update -g <resource-group-name> -n <App-Configuration-store-name> --encryption-key-name <key-name> --encryption-key-vault <key-vault-URI> --identity-client-id <user-assigned-managed-identity-client-ID>
      ```

Your App Configuration store is now configured to use a customer-managed key stored in Key Vault.

## Disable customer-managed key encryption

When you disable customer-managed key encryption, your App Configuration store reverts to using Microsoft-managed keys. But before reverting to Microsoft-managed keys, App Configuration uses the current key to decrypt all existing data. If the current key is expired or access to it is revoked, you must first restore access to that key.

> [!NOTE]
> Before you configure your App Configuration store to use a Microsoft-managed key instead of a customer-managed key for encryption, ensure that this change aligns with your organization's security policies and compliance requirements.

1. Ensure the current customer-managed key is valid and operational.

1. Use the following Azure CLI command to update your App Configuration store by removing the customer-managed key configuration. Replace `<resource-group-name>` and `<App-Configuration-store-name>` with the values in your environment.

    ```azurecli
    az appconfig update -g <resource-group-name> -n <App-Configuration-store-name> --encryption-key-name ""
    ```

1. To verify that the customer-managed key configuration is disabled, check the properties of your App Configuration store.

    ```azurecli
    az appconfig show -g <resource-group-name> -n <App-Configuration-store-name> --query "encryption"
    ```

    In the output of this command, the `encryption.keyVaultProperties` property should have a value of `null`.

Your App Configuration store is now configured to use Microsoft-managed keys for encryption.

## Access revocation

When you enable the customer-managed key capability on your App Configuration store, you control the service's ability to access your sensitive information. The managed key serves as a root encryption key.

You can revoke your App Configuration store's access to your managed key by changing your key vault access policy. When you revoke this access, App Configuration loses the ability to decrypt user data within one hour. At this point, the App Configuration store forbids all access attempts.

This situation is recoverable by granting the App Configuration service access to the managed key again. Within one hour, App Configuration is able to decrypt user data and operate under normal conditions.

> [!NOTE]
> All App Configuration data is stored for up to 24 hours in an isolated backup. This data includes the unwrapped encryption key. This data isn't immediately available to the service or service team. During an emergency restore, App Configuration revokes itself again from the managed key data.

## Key rotation

When you configure a customer-managed key on an App Configuration store, you need to periodically rotate the managed key so that it doesn't expire. For a successful key rotation, the current key must be valid and operational. If the current key is expired, or if App Configuration access to it is revoked, the App Configuration store can't decrypt data, and rotation fails.

### Automatic rotation

A best practice is to configure [automatic rotation](/azure/key-vault/keys/how-to-configure-key-rotation) in Key Vault for your customer-managed key. Rotating keys frequently improves security. And when you use automatic rotation, you avoid losing access due to a lack of rotation. You also eliminate the need to manually rotate encryption keys.

### Versionless keys

Another best practice for automatic rotation in customer-managed key encryption is to omit the version of the key vault key. When you don't configure a specific key version, App Configuration can move to the latest version of the key when it's automatically rotated. As a result, your App Configuration store avoids losing access when a managed key version expires that's currently in use.

When you set up customer-managed key encryption, you provide the identifier of a key in your key vault. A key vault key identifier can have the following formats:

* Versionless key identifier: `https://<vault-name>.vault.azure.net/keys/<key-name>`
* Versioned key identifier (not recommended): `https://<vault-name>.vault.azure.net/keys/<key-name>/<key-version>`

To configure a versionless key, use the identifier format that omits the version.

## Next step

In this article, you configured your App Configuration store to use a customer-managed key for encryption. To find out more about how to integrate your app service with Azure managed identities, continue to the next step.

> [!div class="nextstepaction"]
> [Use managed identities to access App Configuration](./howto-integrate-azure-managed-service-identity.md)
