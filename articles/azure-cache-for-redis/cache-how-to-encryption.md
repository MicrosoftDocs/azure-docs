# Configure disk encryption for Enterprise Azure Cache for Redis instances

The Enterprise and Enterprise Flash tiers of Azure Cache for Redis offer the ability to encrypt the OS and data persistence disks using customer managed keys (CMK). 

Data in Redis is stored in memory by default. This data is not encrypted, although you can implement your own encryption on the data before writing it to the cache. In some cases, data can reside on-disk, either due to the operations of the operating system or because of deliberate actions to persist data through the export or data persistence features.

In this article, you learn how to configure disk encryption using Customer Managed Keys (CMK). 

## Scope of availability

|Tier     | Basic, Standard, Premium  |Enterprise, Enterprise Flash  |
|---------|---------|---------|
|Available  | No     |  Yes (preview)  |

> [!NOTE]
> On the Premium tier, data persistence streams data directly to Azure Storage, so disk encryption is less important. Azure Storage offers a [variety of encryption methods](../storage/common/storage-service-encryption.md) to be used instead.
>

## Prerequisites and Limitations

