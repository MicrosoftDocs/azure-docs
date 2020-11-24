---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 08/28/2020
 ms.author: rogarana
 ms.custom: include file
---
Azure Files offers four different tiers of storage, premium, transaction optimized, hot, and cool to allow you to tailor your shares to the performance and price requirements of your scenario:

- **Premium**: Premium file shares are backed by solid-state drives (SSDs) and are deployed in the **FileStorage storage account** type. Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. Premium file shares are suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares can be used with both Server Message Block (SMB) and Network File System (NFS) protocols.
- **Transaction optimized**: Transaction optimized file shares enable transaction heavy workloads that don't need the latency offered by premium file shares. Transaction optimized file shares are offered on the standard storage hardware backed by hard disk drives (HDDs) and are deployed in the **general purpose version 2 (GPv2) storage account** type. Transaction optimized has historically been called "standard", however this refers to the storage media type rather than the tier itself (the hot and cool are also "standard" tiers, because they are on standard storage hardware).
- **Hot**: Hot file shares offer storage optimized for general purpose file sharing scenarios such as team shares and Azure File Sync. Hot file shares are offered on the standard storage hardware backed by HDDs and are deployed in the **general purpose version 2 (GPv2) storage account** type.
- **Cool**: Cool file shares offer cost-efficient storage optimized for online archive storage scenarios. Azure File Sync may also be a good fit for lower churn workloads. Cool file shares are offered on the standard storage hardware backed by HDDs and are deployed in the **general purpose version 2 (GPv2) storage account** type.

Premium file shares are only available in a provisioned billing model. For more information on the provisioned billing model for premium file shares, see [Understanding provisioning for premium file shares](../articles/storage/files/storage-files-planning.md#understanding-provisioning-for-premium-file-shares). Standard file shares, including transaction optimized, hot, and cool file shares, are available through pay as you go billing.

Hot and cool file shares are available in all Azure Public and Azure Government regions. Transaction optimized file shares are available in all Azure regions, including Azure China and Azure Germany regions.

> [!Important]  
> You can move file shares between tiers within GPv2 storage account types (transaction optimized, hot, and cool). Share moves between tiers incur transactions: moving from a hotter tier to a cooler tier will incur the cooler tier's write transaction charge for each file in the share, while a move from a cooler tier to a hotter tier will incur the cool tier's read transaction charge for each file the share.