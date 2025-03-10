---
title: Configure disk encryption in Azure Managed Redis (preview)
description: Learn about disk encryption when using Azure Managed Redis.


ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/15/2024
---

# Configure disk encryption for Azure Managed Redis (preview) instances using customer managed keys

Data in a Redis server is stored in memory by default. This data isn't encrypted. You can implement your own encryption on the data before writing it to the cache. In some cases, data can reside on-disk, either due to the operations of the operating system, or because of deliberate actions to persist data using [export](managed-redis-how-to-import-export-data.md) or [data persistence](managed-redis-how-to-persistence.md).

Azure Managed Redis (preview) offers platform-managed keys (PMKs), also know as Microsoft-managed keys (MMKs), by default to encrypt data on-disk in all tiers. Azure Managed Redis additionally offers the ability to encrypt the OS and data persistence disks with a customer-managed key (CMK). Customer managed keys can be used to wrap the MMKs to control access to these keys. This makes the CMK a _key encryption key_ or KEK. For more information, see [key management in Azure](/azure/security/fundamentals/key-management).

## Scope of availability for CMK disk encryption

| Tier | Memory Optimized, Balanced, Compute Optimized  | Flash Optimized  |
|:-:|---------|---------------|
|Microsoft managed keys (MMK) | Yes   | Yes             |
|Customer managed keys (CMK) | Yes     |  Yes            |


## Encryption coverage

In Azure Managed Redis, disk encryption is used to encrypt the persistence disk, temporary files, and the OS disk:

- persistence disk: holds persisted RDB or AOF files as part of [data persistence](managed-redis-how-to-persistence.md)
- temporary files used in _export_: temporary data used exported is encrypted. When you [export](managed-redis-how-to-import-export-data.md) data, the encryption of the final exported data is controlled by settings in the storage account.
- the OS disk

MMK is used to encrypt these disks by default, but CMK can also be used.

In the **Flash Optimized** tier, keys and values are also partially stored on-disk using nonvolatile memory express (NVMe) flash storage. However, this disk isn't the same as the one used for persisted data. Instead, it's ephemeral, and data isn't persisted after the cache is stopped, deallocated, or rebooted. MMK is only supported on this disk because this data is transient and ephemeral.

| Data stored |Disk    |Encryption Options |
|-------------------|------------------|-------------------|
|Persistence files | Persistence disk | MMK or CMK |
|RDB files waiting to be exported | OS disk and Persistence disk | MMK or CMK |
|Keys & values (Flash Optimized tier only) | Transient NVMe disk | MMK |

## Prerequisites and limitations

### General prerequisites and limitations

- Only user assigned managed identity is supported to connect to Azure Key Vault. System assigned managed identity is not supported.
- Changing between MMK and CMK on an existing cache instance triggers a long-running maintenance operation. We don't recommend this for production use because a service disruption occurs.

### Azure Key Vault prerequisites and limitations

- The Azure Key Vault resource containing the customer managed key must be in the same region as the cache resource.
- [Purge protection and soft-delete](/azure/key-vault/general/soft-delete-overview) must be enabled in the Azure Key Vault instance. Purge protection isn't enabled by default.
- When you use firewall rules in the Azure Key Vault, the Key Vault instance must be configured to [allow trusted services](/azure/key-vault/general/network-security).
- Only RSA keys are supported
- The user assigned managed identity must be given the permissions _Get_, _Unwrap Key_, and _Wrap Key_ in the Key Vault access policies, or the equivalent permissions within Azure Role Based Access Control. A recommended built-in role definition with the least privileges needed for this scenario is called [KeyVault Crypto Service Encryption User](/azure/role-based-access-control/built-in-roles#key-vault-crypto-service-encryption-user).

## How to configure CMK encryption in Azure Managed Redis

### Use the portal to create a new cache with CMK enabled

1. Sign in to the [Azure portal](https://portal.azure.com) and start the [Create an Azure Managed Redis instance](../quickstart-create-managed-redis.md) quickstart guide.

1. On the **Advanced** page, go to the section titled **Customer-managed key encryption at rest** and enable the **Use a customer-managed key** option.

   :::image type="content" source="media/managed-redis-how-to-encryption/managed-redis-use-key-encryption.png" alt-text="Screenshot of the advanced settings with customer-managed key encryption checked and in a red box.":::

1. Select **Add** to assign a [user assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) to the resource. This managed identity is used to connect to the [Azure Key Vault](/azure/key-vault/general/overview) instance that holds the customer managed key.

    :::image type="content" source="media/managed-redis-how-to-encryption/managed-redis-managed-identity-user-assigned.png" alt-text="Screenshot showing user managed identity in the working pane.":::

1. Select your chosen user assigned managed identity, and then choose the key input method to use.

1. If using the **Select Azure key vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache.

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](/azure/key-vault/secrets/quick-create-portal). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance. Remember that both purge protection and soft delete must be enabled in your Key Vault instance.

1. Choose the specific key and version using the **Customer-managed key (RSA)** and **Version** drop-downs.

   :::image type="content" source="media/managed-redis-how-to-encryption/managed-redis-managed-identity-version.png" alt-text="Screenshot showing the select identity and key fields completed.":::

1. If using the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.  

1. When you've entered all the information for your cache, select **Review + create**.

### Add CMK encryption to an existing Azure Managed Redis instance

1. Go to the **Encryption** in the Resource menu of your cache instance. If CMK is already set up, you see the key information.

1. If you haven't set up or if you want to change CMK settings, select **Change encryption settings**
   :::image type="content" source="media/managed-redis-how-to-encryption/managed-redis-encryption-existing-use.png" alt-text="Screenshot encryption selected in the Resource menu for an Enterprise tier cache.":::

1. Select **Use a customer-managed key** to see your configuration options.

1. Select **Add** to assign a [user assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) to the resource. This managed identity is used to connect to the [Azure Key Vault](/azure/key-vault/general/overview) instance that holds the customer managed key.

1. Select your chosen user assigned managed identity, and then choose which key input method to use.

1. If using the **Select Azure key vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache.

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](/azure/key-vault/secrets/quick-create-portal). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance.  

1. Choose the specific key using the **Customer-managed key (RSA)** drop-down. If there are multiple versions of the key to choose from, use the **Version** drop-down.
   :::image type="content" source="media/managed-redis-how-to-encryption/managed-redis-encryption-existing-key.png" alt-text="Screenshot showing the select identity and key fields completed for Encryption.":::

1. If using the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.  

1. Select **Save**

## Next steps

- [Data persistence](managed-redis-how-to-persistence.md)
- [Import/Export](managed-redis-how-to-import-export-data.md)
