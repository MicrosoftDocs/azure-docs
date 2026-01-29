---
title: Configure customer-managed keys for Elastic zone-redundant volume encryption in Azure NetApp Files
description: Learn how to configure customer-managed keys for volume encryption with Azure NetApp Files' Elastic zone-redundant service level. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/26/2026
ms.author: anfdocs
---
# Configure customer-managed keys for Elastic zone-redundant volume encryption in Azure NetApp Files

Customer-managed keys for Azure NetApp Files volume encryption enable you to use your own keys rather than the platform-managed (Microsoft-managed) key when creating a new volume. With customer-managed keys, you can fully manage the relationship between a key's life cycle, key usage permissions, and auditing operations on keys.

>[!IMPORTANT]  
> To configure customer-managed keys for the Flexible, Standard, Premium, or Ultra service level, see [Configure customer-managed keys](configure-customer-managed-keys.md).

## Considerations

[!INCLUDE [Customer-managed keys considerations](includes/customer-managed-keys-considerations.md)]

## Requirements

Before creating your first customer-managed key volume, you must set up:

* A virtual network:
    The virtual network subnet need to be delegated to `Microsoft.Netapp/elasticVolumes`
* An [Azure Key Vault](/azure/key-vault/general/overview), containing at least one key.
    * The key vault must have soft delete and purge protection enabled.
    * The key must be of type RSA.
* The key vault must have an [Azure Private Endpoint](../private-link/private-endpoint-overview.md).
    * The private endpoint must reside in a different subnet than the one delegated to Azure NetApp Files. The subnet must be in the same virtual network as the one delegated to Azure NetApp.

* If you've configured your Azure Key Vault to use Azure role-based access control (RBAC), ensure the user-assigned identity you intend to use for encypriont has a role assignment on the key vault with permissions for actions: 

    `Microsoft.KeyVault/vaults/keys/read`
    `Microsoft.KeyVault/vaults/keys/encrypt/action`
    `Microsoft.KeyVault/vaults/keys/decrypt/action`

    To learn about configuring an Azure Key Vault with RBAC, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](/azure/key-vault/general/rbac-guide). 

    * If you've configured your Azure Key Vault to use a Vault access policy, the Azure portal configures the Elastic account automatically when you configure the customer-managed key.

For more information about Azure Key Vault and Azure Private Endpoint, see:
* [Quickstart: Create a key vault ](/azure/key-vault/general/quick-create-portal)
* [Create or import a key into the vault](/azure/key-vault/keys/quick-create-portal)
* [Create a private endpoint](../private-link/create-private-endpoint-portal.md)
* [More about keys and supported key types](/azure/key-vault/keys/about-keys)
* [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md)

## Configure an Elastic NetApp account to use customer-managed keys

1. In your Elastic storage account, select **Encryption**. 
1. For Encryption key source, select **Customer Managed Key**. 
1. Provide the Encryption Key. 
    * If you have the URI, select **Enter key URI** then enter manually the **Key URI** and **Subscription**. 

    :::image type="content" source="./media/elastic-customer-managed-keys/enter-key.png" alt-text="Screenshot of manually entering key URI and subscription." lightbox="./media/elastic-customer-managed-keys/enter-key.png":::

    * To select the key from a list, choose **Select key vault** then **Select a key vault and key**. 
    In the dropdown menus, select the **Subscription**, **Key vault**, and **Key** then **Select** to confirm your choices. 

    :::image type="content" source="./media/elastic-customer-managed-keys/select-key.png" alt-text="Screenshot of select a key menu." lightbox="./media/elastic-customer-managed-keys/select-key.png":::

1. Choose the identity type for authentication with the Azure Key Vault. 
    
    If your Azure Key Vault is configured to use Vault access policy as its permission model, both options are available. Otherwise, only the user-assigned option is available. 

    * If you choose **User-assigned**, select an identity. Choose **Select an identity** to open a context pane. Select the appropriate user-assigned managed identity. 

    :::image type="content" source="./media/elastic-customer-managed-keys/select-identity.png" alt-text="Screenshot of selecting user assigned managed identity." lightbox="./media/elastic-customer-managed-keys/select-identity.png":::

    * If you choose **System-assigned**, skip to the next step. When you save your encryption settings, Azure configures the NetApp account automatically by adding a system-assigned identity to your NetApp account and creates an access policy on your Azure Key Vault with key permissions Get, Encrypt, Decrypt. 

1. Select **Save**. 

## Next steps

After you configure encryption settings for your Elastic NetApp account, [Create an Elastic zone-redundant capacity pool](elastic-capacity-pool-task.md). Ensure you select **Customer Managed** for the encryption key source, then provide the configured Azure key vault in the key vault private endpoint. 

After the capacity pool is created with customer-managed keys, volumes created in the capacity pool automatically inherit customer-managed key encryption settings. 

## More information 

* [Create an Elastic zone-redundant capacity pool](elastic-capacity-pool-task.md)
* [Troubleshoot customer-managed keys](troubleshoot-customer-managed-keys.md)
