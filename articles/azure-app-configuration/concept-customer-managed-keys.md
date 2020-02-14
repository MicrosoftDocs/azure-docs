---
title: Use customer-managed keys to encrypt your configuration data 
description: Encrypt your configuration data using customer-managed keys
author: lisaguthrie

ms.author: lcozzens
ms.date: 02/14/2020
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Use customer-managed keys to encrypt your App Configuration data
Azure App Configuration [encrypts data at rest](../security/fundamentals/encryption-atrest.md) to protect your stored data. The use of customer-managed keys provides enhanced data protection by allowing you to manage your encryption keys.  When managed key encryption is used, all data in App Configuration is encrypted with a user-provided Azure Key Vault key.  This provides the ability to rotate the encryption key on demand.  It also provides the ability to revoke Azure App Configuration's access to data at rest by revoking the App Configuration instance's access to the key.

## Overview 
Azure App Configuration encrypts data at rest using a 256-bit AES encryption key provided by Microsoft. Every App Configuration instance has its own encryption key managed by the service and used to encrypt its data. When customer-managed key capability is enabled, App Configuration uses a managed identity assigned to the App Configuration instance to authenticate with Azure Active Directory, calls Azure Key Vault and wraps the App Configuration instance's encryption key.  The wrapped encryption key is then stored and the unwrapped encryption key is cached within App Configuration for one hour.  App Configuration performs this procedure hourly to refresh the unwrapped version of the App Configuration instance's encryption key. This ensures availability under normal operating conditions. If the identity assigned to the App Configuration instance is no longer authorized to unwrap the instance's encryption key, or if the managed key is permanently deleted, then it will no longer be possible to decrypt data stored in the App Configuration instance.

When users enable the customer managed key capability on their Azure App Configuration instance, they control the service’s ability to access their data. The managed key serves as a root encryption key. A user can revoke their Azure App Configuration instance’s access to their managed key by changing their key vault access policy. When this access is revoked, App Configuration will lose the ability to decrypt user data within one hour. At this point, the App Configuration instance will forbid all access attempts. This situation is recoverable by granting the service access to the managed key once again.  Within one hour, App Configuration will be able to decrypt user data and operate under normal conditions.

>[!NOTE]
>Data at rest will be stored for up to 24 hours in an isolated backup. This data is not immediately available to the service or service team. In the event of an emergency restore, Azure App Configuration will re-revoke itself from the managed key data.

## Requirements
The following components are required to successfully enable the customer-managed key capability for Azure App Configuration:
- Standard tier Azure App Configuration instance
- Azure Key Vault with soft-delete and purge-protection features enabled
- An RSA or RSA-HSM key within the Key Vault
    - The key must not be expired, it must be enabled, and it must have both wrap and unwrap capabilities enabled

Once these resources are configured, two steps remain to allow Azure App Configuration to use the Key Vault key:
1. Assign a managed identity to the Azure App Configuration instance
2. Grant the identity GET, WRAP, and UNWRAP permissions in the target Key Vault's access policy.

## Enable customer-managed key encryption for your Azure App Configuration instance
To begin, you will need a properly configured Azure App Configuration instance. If you do not yet have an App Configuration instance available, follow one of these quickstarts to set one up:
- [Create an ASP.NET Core app with Azure App Configuration](quickstart-aspnet-core-app.md)
- [Create a .NET Core app with Azure App Configuration](quickstart-dotnet-core-app.md)
- [Create a .NET Framework app with Azure App Configuration](quickstart-dotnet-app.md)
- [Create a Java Spring app with Azure App Configuration](quickstart-java-spring-app.md)

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the command line instructions in this article.  It has common Azure tools preinstalled, including the .NET Core SDK. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

### Create and configure an Azure Key Vault
1. Create an Azure Key Vault using the following Azure CLI command.  Note that both `vault-name` and `resource-group-name` must be unique.

    ```azurecli
    az keyvault create --name vault-name --resource-group resource-group-name
    ```
    
1. Enable soft-delete and purge-protection for the Key Vault.
    Substitute the names of the Key Vault (`vault-name`) and Resource Group (`resource-group-name`) created in step 1.

    ```azurecli
    az keyvault update --name vault-name --resource-group resource-group-name --enable-purge-protection --enable-soft-delete
    ```
    
1. Create an Key Vault key
    Provide a unique `key-name` for this key, and substitute the names of the Key Vault (`vault-name`) created in step 1. Specify whether you prefer `RSA` or `RSA-HSM` encryption.

    ```azurecli
    az keyvault key create --name key-name --kty {RSA or RSA-HSM} --vault-name vault-name
    ```
    
    The output from this command shows the key ID ("kid") for the generated key.  Make a note of the key ID because it will be used later in this exercise.  The key ID has the form: `https://{my key vault}.vault.azure.net/keys/{key-name}/{Key version}`.  The key ID has three important components:
    1. Key Vault URI: `https://{my key vault}.vault.azure.net
    2. Key Vault key name: {Key Name}
    3. Key Vault key version: {Key version}
1. Assign a Managed Identity
    A managed identity is assigned to an Azure App Configuration instance in order to access the managed key.  Create a system assigned managed identity using the Azure CLI:
    
    ```azurecli
    az appconfig identity assign --na1. me {App Configuration instance name} --group {Resource Group name} --identities [system]
    ```
    
    The output of this command includes the principal ID ("principalId") and tenant ID ("tenandId") of the system assigned identity.  This will be used to grant the identity access to the managed key.

    ```json
    {
    "principalId": {Principal Id},
    "tenantId": {Tenant Id},
    "type": "SystemAssigned",
    "userAssignedIdentities": null
    }
    ```
    
1. Grant Key Vault access to App Configuration
    The managed identity of the Azure App Configuration instance needs access to the key to perform key validation, encryption and decryption. The specific set of actions to which it needs access includes: `GET`, `WRAP`, and `UNWRAP` for keys.  Granting the access requires the principal ID, also known as the object ID, of the App Configuration instance's managed identity. This value was obtained in the previous step.  Grant permission to the managed key using the command line:
    ```azurecli
    az keyvault set-policy -n {vault-name} --object-id {App Configuration Instance Principal Id} --key-permissions get wrapKey unwrapKey
    ```
1. Enable customer-managed key
    Once the Azure App Configuration instance can access the managed key, we can enable the customer-managed key capability in the service using the Azure CLI. Recall the following properties recorded during the key creation steps: `key name` `key vault URI`.
    ```azurecli
    az appconfig update -g {Resource Group Name} -n {App Configuration Name} --encryption-key-name {Key Vault Key Name} --encryption-key-version {Key Vault Key Version} --encryption-key-vault {Key Vault URI}
    ```
Your Azure App Configuration instance is now configured to use a customer-managed key stored in Azure Key Vault.

## Next Steps
In this article, you configured your Azure App Configuration instance to use a customer-managed key for encryption.  Learn how to [integrate your service with Azure Managed Identities](howto-integrate-azure-managed-service-identity.md).