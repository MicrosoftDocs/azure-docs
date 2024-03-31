---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 03/31/2024
 ms.author: kendownie
 ms.custom: include file
---
Azure Files offers two different media tiers of storage, SSD and HDD, which allow you to tailor your shares to the performance and price requirements of your scenario:

- **SSD (Premium)**: Premium file shares are backed by solid-state drives (SSDs) and provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. Premium file shares are suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares can be used with both Server Message Block (SMB) and Network File System (NFS) protocols. Premium file shares are deployed in the **FileStorage storage account** kind and are only available in a provisioned billing model. For more information on the provisioned billing model for premium file shares, see [Understanding provisioning for premium file shares](../articles/storage/files/understanding-billing.md#provisioned-model). Premium file shares support a [99.99% SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) (see "Azure Files Premium Tier").

- **HDD (Standard)**: Standard file shares are backed by hard disk drives (HDDs) and provide a cost-effective storage option for general purpose file shares. Standard file shares are deployed in the **general purpose version 2 (GPv2) storage account** kind. Standard file shares support a [99.9% SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) (see "Storage Accounts"). Standard file shares use a pay-as-you-go model which provides usage-based pricing. You can further tailor the ratio between storage and IOPS cost through *access tiers*:
    - **Transaction optimized**: Transaction optimized file shares enable transaction heavy workloads that don't need the latency offered by premium file shares.
    - **Hot**: Hot file shares offer storage optimized for general purpose file sharing scenarios such as team shares.
    - **Cool**: Cool file shares offer cost-efficient storage optimized for online archive storage scenarios.

When selecting a media tier for your workload, consider your performance and usage requirements. If your workload requires single-digit latency, or you are using SSD storage media on-premises, the premium tier is probably the best fit. If low latency isn't as much of a concern, for example with team shares mounted on-premises from Azure or cached on-premises using Azure File Sync, standard storage may be a better fit from a cost perspective.

Once you've created a file share in a storage account, you cannot move it to tiers exclusive to different storage account kinds. For example, to move a transaction optimized file share to the premium tier, you must create a new file share in a FileStorage storage account and copy the data from your original share to a new file share in the FileStorage account. We recommend using AzCopy to copy data between Azure file shares, but you may also use tools like `robocopy` on Windows or `rsync` for macOS and Linux. 

See [Understanding Azure Files billing](../articles/storage/files/understanding-billing.md) for more information.