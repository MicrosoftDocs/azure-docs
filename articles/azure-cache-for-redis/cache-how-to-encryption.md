# Configure disk encryption for Enterprise Azure Cache for Redis instances using customer managed keys

The Enterprise and Enterprise Flash tiers of Azure Cache for Redis offer the ability to encrypt the OS and data persistence disks using customer managed keys (CMK). 

Data in Redis is stored in memory by default. This data is not encrypted, although you can implement your own encryption on the data before writing it to the cache. In some cases, data can reside on-disk, either due to the operations of the operating system or because of deliberate actions to persist data through the [export](cache-how-to-import-export-data.md) or [data persistence](cache-how-to-premium-persistence.md) features.

In this article, you learn how to configure disk encryption using Customer Managed Keys (CMK). 

## Scope of availability for CMK disk encryption

|Tier                         | Basic, Standard, Premium  |Enterprise, Enterprise Flash  |
|-----------------------------|---------|---------------|
|Microsoft managed keys (MMK) | Yes   | Yes             |
|Customer managed keys (CMK) | No     |  Yes (preview)  |

> [!NOTE]
> By default, all tiers use Microsoft managed keys to encrypt disks mounted to cache instances. However, in the Basic and Standard tiers, the C0 and C1 SKUs do not support any disk encryption. 
>

> [!IMPORTANT]
> On the Premium tier, data persistence streams data directly to Azure Storage, so disk encryption is less important. Azure Storage offers a [variety of encryption methods](../storage/common/storage-service-encryption.md) to be used instead.
>

## Encryption coverage

### Enterprise tiers

In the **Enterprise** tier, disk encryption is used to encrypt both the Persistence disk, which holds persisted RDB or AOF files as part of the [data persistence](cache-how-to-premium-persistence.md) and [export](cache-how-to-import-export-data.md) feature, and the OS disk. MMK is used to encrypt these disks by default, but CMK can also be used.

In the **Enterprise Flash** tier, keys and values are also partially stored on-disk using NVMe flash storage. However, this disk is not the same as the one used for persisted data. Instead, it is ephermeral and data is not persisted after the cache is stopped, deallocated, or rebooted. Because this data is transient and emphemeral, only MMK is supported on this disk. 

| Data stored |Disk    |Encryption Options |
|-------------------|------------------|-------------------|
|Persistence files | Persistence disk | MMK or CMK |
|RDB files waiting to be exported | OS disk and Persistence disk | MMK or CMK |
|Keys & values (Enterprise Flash tier only) | Transient NVMe disk | MMK |

### Other tiers

In the **Basic, Standard, and Premium** tiers, the OS disk is encrypted using MMK. There is no persistence disk mounted and Azure Storage is used instead. 


## Prerequisites and Limitations

- Disk encryption is not available in the Basic and Standard tiers for the C0 or C1 SKUs
- Only user-assigned managed identity is supported to connect to Azure Key Vault
- You cannot switch between MMK and CMK encryption at runtime. This will trigger a patching-like operation that will provision new disks and VMs.
- The Azure Key Vault resource containing the customer managed key must be in the same region as the cache resource.

## How to configure CMK encryption on Enterprise caches

### Use the portal to create a new cache with CMK enabled

1. Sign in to the [Azure portal](https://portal.azure.com) and start the [Create a Redis Enterprise cache](quickstart-create-redis-enterprise.md) quickstart guide.

1. On the **Advanced** page, go to the section titled **Customer-managed key encryption at rest** and enable the **Use a customer-managed key** option. 

  **[FRAN] we will need a screenshot here**

1. Select **Add** to assign a [user assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to the resource. This managed identity will be used to connect to the [Azure Key Vault](../key-vault/general/overview.md) instance that holds the customer managed key.

1. Select your chosen user assigned managed identity, and then choose which key input method to use. 

1. If using Azure Key vault, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache. 

> [!NOTE]
> For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](../key-vault/secrets/quick-create-portal.md). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Valut instance.  

1. Choose the specific key using the **Customer-managed key (RSA)** drop-down. If there are multiple versions of the key to choose from, use the **Version** drop-down.

  **[FRAN] Need a screen shot for the above steps--can probably all be in one screenshot**

### Add CMK encryption to an existing Enterprise cache

1. Go to the **Encryption** blade of an Enterprise or Enterprise Flash tier cache. If CMK is already set up, you will see the key information here.

1. To change CMK settings, select **Change encryption settings** 

  **FRAN -- need a screenshot here**

1. Select **Use a customer-managed key**. This will bring up configuration options. 

1. Select **Add** to assign a [user assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to the resource. This managed identity will be used to connect to the [Azure Key Vault](../key-vault/general/overview.md) instance that holds the customer managed key.

1. Select your chosen user assigned managed identity, and then choose which key input method to use. 

1. If using Azure Key vault, choose the Key Vault instance that holds your customer managed key. This instance must be in the same region as your cache. 

> [!NOTE]
> For instructions on how to set up an Azure Key Vault instance, see the [Azure Key Vault quickstart guide](../key-vault/secrets/quick-create-portal.md). You can also select the _Create a key vault_ link beneath the Key Vault selection to create a new Key Valut instance.  

1. Choose the specific key using the **Customer-managed key (RSA)** drop-down. If there are multiple versions of the key to choose from, use the **Version** drop-down.

  **[FRAN] Need a screen shot for the above steps--can probably all be in one screenshot**

## Next Steps

Learn more about Azure Cache for Redis features:

- [Data persistence](cache-how-to-premium-persistence.md)
- [Import/Export](cache-how-to-import-export-data.md)
