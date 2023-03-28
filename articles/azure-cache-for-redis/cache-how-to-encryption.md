---
title: Configure active encryption for Enterprise Azure Cache for Redis instances
description: Learn about encryption for your Azure Cache for Redis Enterprise instances across Azure regions.
author: flang-msft

ms.service: cache
ms.topic: how-to
ms.date: 03/24/2023
ms.author: franlanglois

---

# Configure disk encryption for Azure Cache for Redis instances using customer managed keys (preview)

Data in a Redis server is stored in memory by default. This data isn't encrypted. You can implement your own encryption on the data before writing it to the cache. In some cases, data can reside on-disk, either due to the operations of the operating system, or because of deliberate actions to persist data using [export](cache-how-to-import-export-data.md) or [data persistence](cache-how-to-premium-persistence.md).

Azure Cache for Redis offers platform-managed keys (PMKs), also know as Microsoft-managed keys (MMKs), by default to encrypt data on-disk in all tiers. The Enterprise and Enterprise Flash tiers of Azure Cache for Redis additionally offer the ability to encrypt the OS and data persistence disks with a customer-managed key (CMK). Customer managed keys can be used to wrap the MMKs to control access to these keys. This makes the CMK a _key encryption key_ or KEK. For more information, see [key management in Azure](/azure/security/fundamentals/key-management).


## Scope of availability for CMK disk encryption

| Tier | Basic, Standard, Premium  | Enterprise, Enterprise Flash  |
|:-:|---------|---------------|
|Microsoft managed keys (MMK) | Yes   | Yes             |
|Customer managed keys (CMK) | No     |  Yes (preview)  |

> [!WARNING]
> By default, all Azure Cache for Redis tiers use Microsoft managed keys to encrypt disks mounted to cache instances. However, in the Basic and Standard tiers, the C0 and C1 SKUs do not support any disk encryption. 
>

> [!IMPORTANT]
> On the Premium tier, data persistence streams data directly to Azure Storage, so disk encryption is less important. Azure Storage offers a [variety of encryption methods](../storage/common/storage-service-encryption.md) to be used instead.
>

## Encryption coverage

### Enterprise tiers

In the **Enterprise** tier, disk encryption is used to encrypt the persistence disk, temporary files, and the OS disk:

- persistence disk: holds persisted RDB or AOF files as part of [data persistence](cache-how-to-premium-persistence.md) 
- temporary files used in _export_: temporary data used exported is encrypted. When you [export](cache-how-to-import-export-data.md) data, the encryption of the final exported data is controlled by settings in the storage account.
- the OS disk 

MMK is used to encrypt these disks by default, but CMK can also be used.

In the **Enterprise Flash** tier, keys and values are also partially stored on-disk using nonvolatile memory express (NVMe) flash storage. However, this disk isn't the same as the one used for persisted data. Instead, it's ephemeral, and data isn't persisted after the cache is stopped, deallocated, or rebooted. only MMK is only supported on this disk because this data is transient and ephemeral.

| Data stored |Disk    |Encryption Options |
|-------------------|------------------|-------------------|
|Persistence files | Persistence disk | MMK or CMK |
|RDB files waiting to be exported | OS disk and Persistence disk | MMK or CMK |
|Keys & values (Enterprise Flash tier only) | Transient NVMe disk | MMK |

### Other tiers

In the **Basic, Standard, and Premium** tiers, the OS disk is encrypted by default using MMK. There's no persistence disk mounted and Azure Storage is used instead. The C0 and C1 SKUs do not use disk encryption.

## Prerequisites and limitations

### General prerequisites and limitations

- Disk encryption isn't available in the Basic and Standard tiers for the C0 or C1 SKUs
- Only user assigned managed identity is supported to connect to Azure Key Vault. System assigned managed identity is not supported.
- Changing between MMK and CMK on an existing cache instance triggers a long-running maintenance operation. We don't recommend this for production use because a service disruption occurs. 

### Azure Key Vault prerequisites and limitations

- The Azure Key Vault resource containing the customer managed key must be in the same region as the cache resource.
- [Purge protection and soft-delete](../key-vault/general/soft-delete-overview.md) must be enabled in the Azure Key Vault instance. Purge protection isn't enabled by default.
- When you use firewall rules in the Azure Key Vault, the Key Vault instance must be configured to [allow trusted services](/azure/key-vault/general/network-security).
- Only RSA keys are supported
- The user assigned managed identity must be given the permissions _Get_, _Unwrap Key_, and _Wrap Key_ in the Key Vault access policies, or the equivalent permissions within Azure Role Based Access Control. A recommended built-in role definition with the least privileges needed for this scenario is called [KeyVault Crypto Service Encryption User](../role-based-access-control/built-in-roles.md#key-vault-crypto-service-encryption-user).

## How to configure CMK encryption on Enterprise caches

### Use the portal to create a new cache with CMK enabled

1. Sign in to the [Azure portal](https://portal.azure.com) and start the [Create a Redis Enterprise cache](quickstart-create-redis-enterprise.md) quickstart guide.

1. On the **Advanced** page, go to the section titled **Customer-managed key encryption at rest** and enable the **Use a customer-managed key** option. 

   :::image type="content" source="media/cache-how-to-encryption/cache-use-key-encryption.png" alt-text="Screenshot of the advanced settings with customer-managed key encryption checked and in a red box.":::

1. Select **Add** to assign a [user assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to the resource. This managed identity is used to connect to the [Azure Key Vault](../key-vault/general/overview.md) instance that holds the customer managed key.

    :::image type="content" source="media/cache-how-to-encryption/cache-managed-identity-user-assigned.png" alt-text="Screenshot showing user managed identity in the working pane.":::

1. Select your chosen user assigned managed identity, and then choose the key input method to use. 

1. If using the **Select Azure key vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache. 

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](../key-vault/secrets/quick-create-portal.md). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance. Remember that both purge protection and soft delete must be enabled in your Key Vault instance.

1. Choose the specific key and version using the **Customer-managed key (RSA)** and **Version** drop-downs.

   :::image type="content" source="media/cache-how-to-encryption/cache-managed-identity-version.png" alt-text="Screenshot showing the select identity and key fields completed.":::

1. If using the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.  

1. When you've entered all the information for your cache, select **Review + create**.

### Add CMK encryption to an existing Enterprise cache

1. Go to the **Encryption** in the Resource menu of your cache instance. If CMK is already set up, you see the key information. 

1. If you haven't set up or if you want to change CMK settings, select **Change encryption settings** 
   :::image type="content" source="media/cache-how-to-encryption/cache-encryption-existing-use.png" alt-text="Screenshot encryption selected in the Resource menu for an Enterprise tier cache.":::

1. Select **Use a customer-managed key** to see your configuration options. 

1. Select **Add** to assign a [user assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to the resource. This managed identity is used to connect to the [Azure Key Vault](../key-vault/general/overview.md) instance that holds the customer managed key.

1. Select your chosen user assigned managed identity, and then choose which key input method to use. 

1. If using the **Select Azure key vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache. 

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](../key-vault/secrets/quick-create-portal.md). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance.  

1. Choose the specific key using the **Customer-managed key (RSA)** drop-down. If there are multiple versions of the key to choose from, use the **Version** drop-down.
   :::image type="content" source="media/cache-how-to-encryption/cache-encryption-existing-key.png" alt-text="Screenshot showing the select identity and key fields completed for Encryption.":::
   
1. If using the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.  

1. Select **Save**

## Next steps

Learn more about Azure Cache for Redis features:

- [Data persistence](cache-how-to-premium-persistence.md)
- [Import/Export](cache-how-to-import-export-data.md)
