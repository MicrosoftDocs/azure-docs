---
title: Configure your own key for encrypting Azure Service Bus data at rest
description: This article provides information on how to configure your own key for encrypting Azure Service Bus data rest. 
services: service-bus-messaging
ms.service: service-bus
documentationcenter: ''
author: axisc

ms.topic: conceptual
ms.date: 11/15/2019
ms.author: aschhab

---

# Configure customer-managed keys for encrypting Azure Service Bus data at rest by using the Azure portal
Azure Service Bus Premium provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). Service Bus Premium relies on Azure Storage to store the data and by default, all the data that is stored with Azure Storage is encrypted using Microsoft-managed keys. 

## Overview
Azure Service Bus now supports the option of encrypting data at rest with either Microsoft-managed keys or customer-managed keys (Bring Your Own Key - BYOK). this feature enables you to create, rotate, disable, and revoke access to the customer-managed keys that are used for encrypting Azure Service Bus at rest.

Enabling the BYOK feature is a one time setup process on your namespace.

> [!NOTE]
> There are some caveats to the customer managed key for service side encryption. 
>   * This feature is supported by [Azure Service Bus Premium](service-bus-premium-messaging.md) tier. It cannot be enabled for standard tier Service Bus namespaces.
>   * The encryption can only be enabled for new or empty namespaces. If the namespace contains data, then the encryption operation will fail.

You can use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. For more information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/key-vault-overview.md)

This article shows how to configure a key vault with customer-managed keys by using the Azure portal. To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/quick-create-portal.md).

> [!IMPORTANT]
> Using customer-managed keys with Azure Service Bus requires that the key vault have two required properties configured. They are:  **Soft Delete** and **Do Not Purge**. These properties are enabled by default when you create a new key vault in the Azure portal. However, if you need to enable these properties on an existing key vault, you must use either PowerShell or Azure CLI.

## Enable customer-managed keys
To enable customer-managed keys in the Azure portal, follow these steps:

1. Navigate to your Service Bus Premium namespace.
2. On the **Settings** page of your Service Bus namespace, select **Encryption**.
3. Select the **Customer-managed key encryption at rest** as shown in the following image.

    ![Enable customer managed key](./media/configure-customer-managed-key/enable-customer-managed-key.png)


## Set up a key vault with keys

After you enable customer-managed keys, you need to associate the customer managed key with your Azure Service Bus namespace. Service Bus supports only Azure Key Vault. If you enable the **Encryption with customer-managed key** option in the previous section, you need to have the key imported into Azure Key Vault. Also, the keys must have **Soft Delete** and **Do Not Purge** configured for the key. These settings can be configured using [PowerShell](../key-vault/key-vault-soft-delete-powershell.md) or [CLI](../key-vault/key-vault-soft-delete-cli.md#enabling-purge-protection).

1. To create a new key vault, follow the Azure Key Vault [Quickstart](../key-vault/key-vault-overview.md). For more information about importing existing keys, see [About keys, secrets, and certificates](../key-vault/about-keys-secrets-and-certificates.md).
1. To turn on both soft delete and purge protection when creating a vault, use the [az keyvault create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command.

    ```azurecli-interactive
    az keyvault create --name contoso-SB-BYOK-keyvault --resource-group ContosoRG --location westus --enable-soft-delete true --enable-purge-protection true
    ```    
1. To add purge protection to an existing vault (that already has soft delete enabled), use the [az keyvault update](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-update) command.

    ```azurecli-interactive
    az keyvault update --name contoso-SB-BYOK-keyvault --resource-group ContosoRG --enable-purge-protection true
    ```
1. Create keys by following these steps:
    1. To create a new key, select **Generate/Import** from the **Keys** menu under **Settings**.
        
        ![Select Generate/Import button](./media/configure-customer-managed-key/select-generate-import.png)

    1. Set **Options** to **Generate** and give the key a name.

        ![Create a key](./media/configure-customer-managed-key/create-key.png) 

    1. You can now select this key to associate with the Service Bus namespace for encrypting from the drop-down list. 

        ![Select key from key vault](./media/configure-customer-managed-key/select-key-from-key-vault.png)
        > [!NOTE]
        > For redundancy, you can add up to 3 keys. In the event that one of the keys has expired, or is not accessible, the other keys will be used for encryption.
        
    1. Fill in the details for the key and click **Select**. This will enable the encryption of data at rest on the namespace with a customer managed key. 


> [!IMPORTANT]
> If you are looking to use Customer managed key along with Geo disaster recovery, please review the below  - 
>
> To enable encryption at rest with customer managed key, an [access policy](../key-vault/key-vault-secure-your-key-vault.md) is set up for the Service Bus' managed identity on the specified Azure KeyVault. This ensures controlled access to the Azure KeyVault from the Azure Service Bus namespace.
>
> Due to this:
> 
>   * If [Geo disaster recovery](service-bus-geo-dr.md) is already enabled for the Service Bus namespace and you are looking to enable customer managed key, then 
>     * Break the pairing
>     * [Set up the access policy](../key-vault/managed-identity.md) for the managed identity for both the primary and secondary namespaces to the key vault.
>     * Set up encryption on the primary namespace.
>     * Re-pair the primary and secondary namespaces.
> 
>   * If you are looking to enable Geo-DR on a Service Bus namespace where customer managed key is already set up, then -
>     * [Set up the access policy](../key-vault/managed-identity.md) for the managed identity for the secondary namespace to the key vault.
>     * Pair the primary and secondary namespaces.


## Rotate your encryption keys

You can rotate your key in the key vault by using the Azure Key Vaults rotation mechanism. For more information, see [Set up key rotation and auditing](../key-vault/key-vault-key-rotation-log-monitoring.md). Activation and expiration dates can also be set to automate key rotation. The Service Bus service will detect new key versions and start using them automatically.

## Revoke access to keys

Revoking access to the encryption keys won't purge the data from Service Bus. However, the data can't be accessed from the Service Bus namespace. You can revoke the encryption key through access policy or by deleting the key. Learn more about access policies and securing your key vault from [Secure access to a key vault](../key-vault/key-vault-secure-your-key-vault.md).

Once the encryption key is revoked, the Service Bus service on the encrypted namespace will become inoperable. If the access to the key is enabled or the deleted key is restored, Service Bus service will pick the key so you can access the data from the encrypted Service Bus namespace.

## Next steps
See the following articles:
- [Service Bus overview](service-bus-messaging-overview.md)
- [Key Vault overview](../key-vault/key-vault-overview.md)


