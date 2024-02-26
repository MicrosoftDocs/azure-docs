---
title: Use customer-managed keys to encrypt your configuration data 
description: Encrypt your configuration data using customer-managed keys
author: maud-lv
ms.author: malev
ms.date: 08/30/2022
ms.custom: devdivchpfy22, devx-track-azurecli
ms.topic: conceptual
ms.service: azure-app-configuration
---
# Use customer-managed keys to encrypt your App Configuration data

Azure App Configuration [encrypts sensitive information at rest](../security/fundamentals/encryption-atrest.md). The use of customer-managed keys provides enhanced data protection by allowing you to manage your encryption keys. When managed key encryption is used, all sensitive information in App Configuration is encrypted with a user-provided Azure Key Vault key. This provides the ability to rotate the encryption key on demand. It also provides the ability to revoke Azure App Configuration's access to sensitive information by revoking the App Configuration instance's access to the key.

## Overview

Azure App Configuration encrypts sensitive information at rest by using a 256-bit AES encryption key provided by Microsoft. Every App Configuration instance has its own encryption key managed by the service and used to encrypt sensitive information. Sensitive information includes the values found in key-value pairs. When the customer-managed key capability is enabled, App Configuration uses a managed identity assigned to the App Configuration instance to authenticate with Microsoft Entra ID. The managed identity then calls Azure Key Vault and wraps the App Configuration instance's encryption key. The wrapped encryption key is then stored, and the unwrapped encryption key is cached within App Configuration for one hour. Every hour, the App Configuration refreshes the unwrapped version of the App Configuration instance's encryption key. This process ensures availability under normal operating conditions.

> [!IMPORTANT]
> If the identity assigned to the App Configuration instance is no longer authorized to unwrap the instance's encryption key, or if the managed key is permanently deleted, then it will no longer be possible to decrypt sensitive information stored in the App Configuration instance. By using Azure Key Vault's [soft delete](../key-vault/general/soft-delete-overview.md) function, you mitigate the chance of accidentally deleting your encryption key.

When users enable the customer managed key capability on their Azure App Configuration instance, they control the service’s ability to access their sensitive information. The managed key serves as a root encryption key. Users can revoke their App Configuration instance’s access to their managed key by changing their key vault access policy. When this access is revoked, App Configuration will lose the ability to decrypt user data within one hour. At this point, the App Configuration instance will forbid all access attempts. This situation is recoverable by granting the service access to the managed key once again. Within one hour, App Configuration will be able to decrypt user data and operate under normal conditions.

> [!NOTE]
> All Azure App Configuration data is stored for up to 24 hours in an isolated backup. This includes the unwrapped encryption key. This data isn't immediately available to the service or service team. In the event of an emergency restore, Azure App Configuration will revoke itself again from the managed key data.

## Requirements

The following components are required to successfully enable the customer-managed key capability for Azure App Configuration:

- Standard tier Azure App Configuration instance.
- Azure Key Vault with soft-delete and purge-protection features enabled.
- An RSA or RSA-HSM key within the Key Vault.
  - The key must not be expired, it must be enabled, and it must have both wrap and unwrap capabilities enabled.

After these resources are configured, use the following steps so that the Azure App Configuration can use the Key Vault key:

1. Assign a managed identity to the Azure App Configuration instance.
1. Grant the identity `GET`, `WRAP`, and `UNWRAP` permissions in the target Key Vault's access policy.

## Enable customer-managed key encryption for your Azure App Configuration instance

To begin, you'll need a properly configured Azure App Configuration instance. If you don't yet have an App Configuration instance available, follow one of these quickstarts to set one up:

- [Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)
- [Create a .NET Core app with Azure App Configuration](quickstart-dotnet-core-app.md)
- [Create a .NET Framework app with Azure App Configuration](quickstart-dotnet-app.md)
- [Create a Java Spring app with Azure App Configuration](quickstart-java-spring-app.md)
- [Create a JavaScript app with Azure App Configuration](quickstart-javascript.md)
- [Create a Python app with Azure App Configuration](quickstart-python.md)

> [!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md).

### Create and configure an Azure Key Vault

1. Create an Azure Key Vault by using the Azure CLI. Both `vault-name` and `resource-group-name` are user-provided and must be unique. We use `contoso-vault` and `contoso-resource-group` in these examples.

    ```azurecli
    az keyvault create --name contoso-vault --resource-group contoso-resource-group
    ```

1. Enable soft-delete and purge-protection for the Key Vault. Substitute the names of the Key Vault (`contoso-vault`) and Resource Group (`contoso-resource-group`) created in step 1.

    ```azurecli
    az keyvault update --name contoso-vault --resource-group contoso-resource-group --enable-purge-protection --enable-soft-delete
    ```

1. Create a Key Vault key. Provide a unique `key-name` for this key, and substitute the names of the Key Vault (`contoso-vault`) created in step 1. Specify whether you prefer `RSA` or `RSA-HSM` encryption.

    ```azurecli
    az keyvault key create --name key-name --kty {RSA or RSA-HSM} --vault-name contoso-vault
    ```

    The output from this command shows the key ID ("kid") for the generated key. Make a note of the key ID to use later in this exercise. The key ID has the form: `https://{my key vault}.vault.azure.net/keys/{key-name}/{Key version}`. The key ID has three important components:
    1. Key Vault URI: `https://{my key vault}.vault.azure.net
    1. Key Vault key name: {Key Name}
    1. Key Vault key version: {Key version}

1. Create a system-assigned managed identity by using the Azure CLI, substituting the name of your App Configuration instance and resource group used in the previous steps. The managed identity will be used to access the managed key. We use `contoso-app-config` to illustrate the name of an App Configuration instance:

    ```azurecli
    az appconfig identity assign --name contoso-app-config --resource-group contoso-resource-group --identities [system]
    ```

    The output of this command includes the principal ID (`"principalId"`) and tenant ID (`"tenandId"`) of the system-assigned identity.  These IDs will be used to grant the identity access to the managed key.

    ```json
    {
    "principalId": {Principal Id},
    "tenantId": {Tenant Id},
    "type": "SystemAssigned",
    "userAssignedIdentities": null
    }
    ```

1. The managed identity of the Azure App Configuration instance needs access to the key to perform key validation, encryption, and decryption. The specific set of actions to which it needs access includes: `GET`, `WRAP`, and `UNWRAP` for keys. Granting access requires the principal ID of the App Configuration instance's managed identity. This value was obtained in the previous step. It's shown below as `contoso-principalId`. Grant permission to the managed key by using the command line:

    ```azurecli
    az keyvault set-policy -n contoso-vault --object-id contoso-principalId --key-permissions get wrapKey unwrapKey
    ```

1. After the Azure App Configuration instance can access the managed key, we can enable the customer-managed key capability in the service by using the Azure CLI. Recall the following properties recorded during the key creation steps: `key name` `key vault URI`.

    ```azurecli
    az appconfig update -g contoso-resource-group -n contoso-app-config --encryption-key-name key-name --encryption-key-version key-version --encryption-key-vault key-vault-Uri
    ```

Your Azure App Configuration instance is now configured to use a customer-managed key stored in Azure Key Vault.

## Next Steps

In this article, you configured your Azure App Configuration instance to use a customer-managed key for encryption. To learn more about how to integrate your app service with Azure managed identities, continue to the next step.

> [!div class="nextstepaction"]
> [Integrate your service with Azure Managed Identities](./howto-integrate-azure-managed-service-identity.md)
