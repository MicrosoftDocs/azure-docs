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

- **SSD (Premium)**: Premium file shares use by solid-state drives (SSDs) and provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. Premium file shares are suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares can be used with both Server Message Block (SMB) and Network File System (NFS) protocols. Premium file shares are deployed in the **FileStorage storage account** kind and are only available in a provisioned billing model. For more information on the provisioned billing model for premium file shares, see [Understanding provisioning for premium file shares](../articles/storage/files/understanding-billing.md#provisioned-model). Premium file shares offer a [higher availability SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) than standard file shares (see "Azure Files Premium Tier").

- **HDD (Standard)**: Standard file shares use hard disk drives (HDDs) and provide a cost-effective storage option for general purpose file shares. Standard file shares are deployed in the **general purpose version 2 (GPv2) storage account** kind. For information about the SLA, see the [Azure service-level agreements page](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services) (see "Storage Accounts"). Standard file shares use a pay-as-you-go model that provides usage-based pricing. The *access tier* of a file share enables you to adjust the storage costs against IOPS cost to optimized your total bill:
    - **Transaction optimized** file shares offer the lowest cost transaction pricing for transaction heavy workloads that don't need the low latency offered by premium file shares. Recommended while migrating data to Azure Files.
    - **Hot** file shares offer balanced storage and transaction pricing for workloads that have a good measure of both.
    - **Cool** file shares offer the most cost-efficient storage pricing for storage-intensive workloads.

When selecting a media tier for your workload, consider your performance and usage requirements. If your workload requires single-digit latency, or you're using SSD storage media on-premises, the premium tier is probably the best fit. If low latency isn't as much of a concern, for example with team shares mounted on-premises from Azure or cached on-premises using Azure File Sync, standard storage may be a better fit from a cost perspective.

Once you've created a file share in a storage account, you can't move it to tiers exclusive to different storage account kinds. For example, to move a transaction optimized file share to the premium tier, you must create a new file share in a FileStorage storage account and copy the data from your original share to a new file share in the FileStorage account. We recommend using AzCopy to copy data between Azure file shares, but you may also use tools like `robocopy` on Windows or `rsync` for macOS and Linux. 

See [Understanding Azure Files billing](../articles/storage/files/understanding-billing.md) for more information.