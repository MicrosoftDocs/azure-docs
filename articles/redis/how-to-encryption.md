---
title: "Configure disk encryption in Azure Managed Redis"
description: "Learn how to configure disk encryption in Azure Managed Redis using customer-managed keys (CMK) and Azure Key Vault to protect your data at rest."
ms.date: 06/02/2026
ms.topic: how-to

ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Configure disk encryption for Azure Managed Redis instances by using customer-managed keys

Data in a Redis server is stored in memory by default. This data isn't encrypted. You can implement your own encryption on the data before writing it to the cache. In some cases, data can reside on disk, either due to the operations of the operating system, or because of deliberate actions to persist data by using [export](how-to-import-export-data.md) or [data persistence](how-to-persistence.md).

Azure Managed Redis offers platform-managed keys (PMKs), also known as Microsoft-managed keys (MMKs), by default to encrypt data on disk in all tiers. Azure Managed Redis additionally offers the ability to encrypt the OS and data persistence disks by using a customer-managed key (CMK). Use customer managed keys to wrap the MMKs and control access to these keys. This key makes the CMK a _key encryption key_ or KEK. For more information, see [key management in Azure](/azure/security/fundamentals/key-management).

## Scope of availability for CMK disk encryption

| Tier                         | Memory Optimized, Balanced, Compute Optimized | Flash Optimized |
| :--------------------------- | :-------------------------------------------- | :-------------: |
| Microsoft managed keys (MMK) | Yes                                           | Yes             |
| Customer managed keys (CMK)  | Yes                                           | Yes             |


## Disk encryption coverage in Azure Managed Redis

In Azure Managed Redis, disk encryption protects the persistence disk, temporary files, and the OS disk:

- **Persistence disk**: Holds persisted RDB or AOF files as part of [data persistence](how-to-persistence.md).
- **Temporary files used in _export_**: Encrypts temporary data used during export. When you [export](how-to-import-export-data.md) data, the storage account settings control the encryption of the final exported data.
- **OS disk**

MMK is always used to encrypt these disks by default, and CMK can be added on top to control access to the data encryption key.

In the **Flash Optimized** tier, keys and values are also partially stored on-disk using nonvolatile memory express (NVMe) flash storage. However, this disk isn't the same as the one used for persisted data. Instead, it's ephemeral, meaning the data isn't persisted after the cache is stopped, deallocated, or rebooted. Only MMK is supported on this disk because this data is ephemeral.

| Data stored                                 | Disk                         | Encryption Options |
|---------------------------------------------|------------------------------|--------------------|
| Persistence files                           | Persistence disk             | MMK or CMK         |
| RDB files waiting to be exported            | OS disk and Persistence disk | MMK or CMK         |
| Keys and values (Flash Optimized tier only) | Transient NVMe disk          | MMK                |

## Prerequisites and limitations

### General prerequisites and limitations

- To connect to Azure Key Vault, use only user assigned managed identity. System assigned managed identity isn't supported.
- Changing between MMK and CMK on an existing cache instance triggers a long-running maintenance operation. Don't use this operation in production because it causes a service disruption.

### Azure Key Vault prerequisites and limitations

- The Azure Key Vault resource containing the customer managed key must be in the same region as the cache resource.
- [Purge protection and soft-delete](/azure/key-vault/general/soft-delete-overview) must be enabled in the Azure Key Vault instance. Purge protection isn't enabled by default.
- When you use firewall rules in the Azure Key Vault, you must configure the Key Vault instance to [allow trusted services](/azure/key-vault/general/network-security).
- Only RSA keys are supported.
- You must grant the user assigned managed identity the permissions _Get_, _Unwrap Key_, and _Wrap Key_ in the Key Vault access policies, or the equivalent permissions within Azure Role Based Access Control. A recommended built-in role definition with the least privileges needed for this scenario is called [KeyVault Crypto Service Encryption User](/azure/role-based-access-control/built-in-roles#key-vault-crypto-service-encryption-user).

## How to configure CMK encryption in Azure Managed Redis

### Use the portal to create a new cache with CMK enabled

1. Sign in to the [Azure portal](https://portal.azure.com) and start the [Create an Azure Managed Redis instance](quickstart-create-managed-redis.md) quickstart guide.

1. On the **Advanced** page, go to the section titled **Customer-managed key encryption at rest** and enable the **Use a customer-managed key** option.

   :::image type="content" source="media/how-to-encryption/managed-redis-use-key-encryption.png" alt-text="Screenshot of the Advanced settings page with the customer-managed key encryption at rest option enabled and highlighted in a red box.":::

1. Select **Add** to assign a [user assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal) to the resource. This managed identity is used to connect to the [Azure Key Vault](/azure/key-vault/general/overview) instance that holds the customer managed key.

    :::image type="content" source="media/how-to-encryption/managed-redis-managed-identity-user-assigned.png" alt-text="Screenshot of the user-assigned managed identity selection pane for customer-managed key encryption in Azure Managed Redis.":::

1. Select your chosen user assigned managed identity, and then choose the key input method to use.

1. If you select the **Select Azure Key Vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache.

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](/azure/key-vault/secrets/quick-create-portal). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance. Remember that both purge protection and soft delete must be enabled in your Key Vault instance.

1. Choose the specific key and version by using the **Customer-managed key (RSA)** and **Version** drop-downs.

   :::image type="content" source="media/how-to-encryption/managed-redis-managed-identity-version.png" alt-text="Screenshot of the identity and customer-managed key version fields completed for disk encryption configuration.":::

1. If you select the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.

1. When you enter all the information for your cache, select **Review + create**.

### Add CMK encryption to an existing Azure Managed Redis instance

1. Go to the **Encryption** section in the Resource menu of your cache instance. If CMK is already set up, you see the key information.

1. If you didn't set up CMK or if you want to change CMK settings, select **Change encryption settings**.
   :::image type="content" source="media/how-to-encryption/managed-redis-encryption-existing-use.png" alt-text="Screenshot of the Encryption option selected in the Resource menu for an Azure Managed Redis cache instance.":::

1. Select **Use a customer-managed key** to see your configuration options.

1. Select **Add** to assign a [user assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal) to the resource. This managed identity is used to connect to the [Azure Key Vault](/azure/key-vault/general/overview) instance that holds the customer managed key.

1. Select your chosen user assigned managed identity, and then choose which key input method to use.

1. If you select the **Select Azure Key Vault and key** input method, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache.

    > [!NOTE]
    > For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](/azure/key-vault/secrets/quick-create-portal). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Vault instance.

1. Choose the specific key by using the **Customer-managed key (RSA)** drop-down. If there are multiple versions of the key to choose from, use the **Version** drop-down.
   :::image type="content" source="media/how-to-encryption/managed-redis-encryption-existing-key.png" alt-text="Screenshot of the identity and customer-managed key fields completed on the Encryption settings page for an existing cache.":::

1. If you select the **URI** input method, enter the Key Identifier URI for your chosen key from Azure Key Vault.

1. Select **Save**.

## Key rotation for customer-managed keys

Schedule key rotation and expiry for cryptographic keys as a security best practice.
Azure Managed Redis automatically detects and uses the latest version of the configured key in Azure Key Vault.

It detects and uses a new key version within two hours of rotation being triggered.
Disable or expire the key only after this two-hour window. Otherwise, you risk the cache going offline because of lost access to the key.
Key rotation rewraps the underlying data encryption key and doesn't cause any disruptions.

> [!NOTE]
> The two-hour rotation guarantee applies only to Azure Managed Redis.
> Other services might have different guarantees for key rotation.

To check that key rotation completed, view the key version used in the [Azure portal](https://portal.azure.com) when viewing **Encryption** in the Resource menu.

## Next steps

- [Data persistence](how-to-persistence.md)
- [Import/Export](how-to-import-export-data.md)
