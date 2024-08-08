---
title: Configure customer-managed keys with managed Hardware Security Module for Azure NetApp Files volume encryption 
description: Learn how to encrypt data in Azure NetApp Files with customer-managed keys using the Hardware Security Module
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.custom: references_regions
ms.date: 08/08/2024
ms.author: anfdocs
---
# Configure customer-managed keys with managed Hardware Security Module for Azure NetApp Files volume encryption 

Azure NetApp Files volume encryption with customer-managed keys with the managed Hardware Security Module (HSM) is an extension to [customer-managed keys for Azure NetApp Files volumes encryption feature](configure-customer-managed-keys.md). Customer-managed keys with HSM allows you to store your encryptions keys in a more secure FIPS 140-2 Level 3 HSM instead of the FIPS 140-2 Level 1 or Level 2 service used by Azure Key Vault (AKV).

## Requirements 

* Customer-managed keys with managed HSM is supported using the 2022.11 or later API version.
* Customer-managed keys with managed HSM is only supported for Azure NetApp Files accounts that don't have existing encryption. 
* Before creating a volume using customer-managed key with managed HSM volume, you must have: 
    * created an [Azure Key Vault](../key-vault/general/overview.md), containing at least one key.
        * The key vault must have soft delete and purge protection enabled.
        * The key must be type RSA.
    * created a VNet with a subnet delegated to Microsoft.Netapp/volumes.
    * a user- or system-assigned identity for your Azure NetApp Files account. 
    * [provisioned and activated a managed HSM.](../key-vault/managed-hsm/quick-create-cli.md)

## Supported regions

* Australia East
* Brazil South
* Canada Central
* Central US
* East Asia
* East US
* East US 2
* France Central
* Japan East
* Korea Central
* North Central US
* North Europe
* Norway East
* Norway West
* South Africa North
* South Central US
* Southeast Asia
* Sweden Central
* Switzerland North
* UAE Central
* UAE North
* UK South
* West US
* West US 2
* West US 3

## Register the feature

This feature is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. No UI control is required. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFManagedHsmEncryption
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFManagedHsmEncryption
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 


<!-- 

## Create a customer-managed key with managed HSM account volume

1. Grant yourself permission to create keys in HSM. 

    ```azurecli
    az keyvault role assignment create --hsm-name <hsm name> --role 'Managed HSM Crypto User' --assignee <user principal name> --scope /keys
    ```

1. Create the HSM key. Azure NetApp Files supports key lengths of 2048 or greater. 

    ```azurecli
    az keyvault key create --hsm-name <hsm name> --name <key name> --ops encrypt decrypt --kty RSA-HSM --size 4096
    ```

1. Create a new subnet in the Azure NetApp Files account’s VNet.
    ```azurecli
    az network vnet subnet create --vnet-name <vnet name> -g <resource group name> --name <subnet name> --address-prefixes <address prefix>
    ```
    
1. Create a new private endpoint.
    ```azurecli
    az network private-endpoint create --name <private endpoint name> -g <resource group name> 
    --location <location> --vnet-name <vnet name> --subnet <subnet’s name> --private-connection-resource-id <hsm resource id> --group-id 'managedhsm' --connection-name <private link name>
    ```

1. Authorize the HSM permissions on your Azure NetApp Files account. The role must be authorized to read, encrypt, and decrypt keys. You can use a predefined role or a custom role.  
    ```azurecli
    az keyvault role assignment create --hsm-name <hsm name> --role 'Managed HSM Crypto User' --assignee <user principal name> --scope /keys
    ```

1. Update the Azure NetApp Files account with the HSM key information.
    * If if the account authorization is managed with a user-assigned identity: 
    ```azurecli
    az netappfiles account update --name <Azure NetApp Files account name> -g <resource_group name> --user-assigned-identity <managed identity resource id> --key-source Microsoft.Keyvault --key-vault-resource-id <hsm resource id> --key-vault-uri <hsm uri> --key-name <key name>
    ```
    * If if the account authorization is managed with a system-assigned identity: 
    ```azurecli
    az rest -m patch -u https://management.azure.com/<account-resource-id>?apiversion=
    2022-11-01 -b 
    "{'properties': {
        'encryption': {
            'keySource': 'Microsoft.KeyVault',
            'keyVaultProperties': {
                'keyVaultUri': '<HSM URI>',
                'keyName': '<key name>',
                'keyVaultResourceId': '<HSM resource ID>'
            }
        }
    }"
    ```
-->

## Configure customer-managed keys with managed HSM for system-assigned identity

When you configure customer-managed keys with a system-assigned identity, Azure configures the NetApp account automatically by adding a system-assigned identity. The access policy is created on your Azure Key Vault with key permissions of Get, Encrypt, and Decrypt.

### Requirements

To use a system-assigned identity, the Azure Key Vault must be configured to use Vault access policy as its permission model. Otherwise, you must use a user-assigned identity. 

### Steps

1. In the Azure portal, navigate to Azure NetApp Files then select **Encryption**.
1. In the **Encryption** menu, provide the following values:
    * For **Encryption key source**, select **Customer Managed Key**.
    * For **Key URI**, select **Enter Key URI** then provide the URI for the managed HSM.
    * Select the NetApp **Subscription**.
    * For **Identity type**, select **System-assigned**.

    :::image type="content" source="./media/configure-customer-managed-keys/key-enter-uri.png" alt-text="Screenshot of the encryption menu showing key URI field." lightbox="./media/configure-customer-managed-keys//key-enter-uri.png":::

1. Select **Save**.

## Configure customer-managed keys with managed HSM for user-assigned identity

1. In the Azure portal, navigate to Azure NetApp Files then select **Encryption**.
1. In the **Encryption** menu, provide the following values:
    * For **Encryption key source**, select **Customer Managed Key**.
    * For **Key URI**, select **Enter Key URI** then provide the URI for the managed HSM.
    * Select the NetApp **Subscription**.
    * For **Identity type**, select **User-assigned**.
1. When you select **User-assigned**, a context pane opens to select the identity. 
    * If your Azure Key Vault is configured to use a Vault access policy, Azure configures the NetApp account automatically and adds the user-assigned identity to your NetApp account. The access policy is created on your Azure Key Vault with key permissions of Get, Encrypt, and Decrypt.
    * If your Azure Key Vault is configured to use Azure role-based access control (RBAC), ensure the selected user-assigned identity has a role assignment on the key vault with permissions for data actions:
        * "Microsoft.KeyVault/vaults/keys/read"
        * "Microsoft.KeyVault/vaults/keys/encrypt/action"
        * "Microsoft.KeyVault/vaults/keys/decrypt/action"
    The user-assigned identity you select is added to your NetApp account. Due to RBAC being customizable, the Azure portal doesn't configure access to the key vault. For more information, see [Using Azure RBAC secret, key, and certificate permissions with Key Vault](../key-vault/general/rbac-guide.md#using-azure-rbac-secret-key-and-certificate-permissions-with-key-vault)

    :::image type="content" source="./media/configure-customer-managed-keys/encryption-user-assigned.png" alt-text="Screenshot of user-assigned submenu." lightbox="./media/configure-customer-managed-keys/encryption-user-assigned.png":::

1. Select **Save**.

## Next steps

* [Configure customer-managed keys](configure-customer-managed-keys.md)
* [Security FAQs](faq-security.md)