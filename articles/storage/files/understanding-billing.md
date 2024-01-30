---
title: Understand Azure Files billing
description: Learn how to interpret the provisioned and pay-as-you-go billing models for Azure file shares.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: kendownie
---

# Understand Azure Files billing
Azure Files provides two distinct billing models: provisioned and pay-as-you-go. The provisioned model is only available for premium file shares, which are file shares deployed in the **FileStorage** storage account kind. The pay-as-you-go model is only available for standard file shares, which are file shares deployed in the **general purpose version 2 (GPv2)** storage account kind. This article explains how both models work in order to help you understand your monthly Azure Files bill.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/m5_-GsKv4-o]
    :::column-end:::
    :::column:::
        This video is an interview that discusses the basics of the Azure Files billing model. It covers how to optimize Azure file shares to achieve the lowest costs possible, and how to compare Azure Files to other file storage offerings on-premises and in the cloud.
   :::column-end:::
:::row-end:::

For Azure Files pricing information, see [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Storage units
Azure Files uses the base-2 units of measurement to represent storage capacity: KiB, MiB, GiB, and TiB. 

| Acronym | Definition                         | Unit     |
|---------|------------------------------------|----------|
| KiB     | 1,024 bytes                        | kibibyte |
| MiB     | 1,024 KiB (1,048,576 bytes)        | mebibyte |
| GiB     | 1024 MiB (1,073,741,824 bytes)     | gibibyte |
| TiB     | 1024 GiB (1,099,511,627,776 bytes) | tebibyte |

Although the base-2 units of measure are commonly used by most operating systems and tools to measure storage quantities, they are frequently mislabeled as the base-10 units, which you may be more familiar with: KB, MB, GB, and TB. Although the reasons for the mislabeling may vary, the common reason why operating systems like Windows mislabel the storage units is because many operating systems began using these acronyms before they were standardized by the IEC, BIPM, and NIST.

The following table shows how common operating systems measure and label storage:

| Operating system | Measurement system | Labeling |
|-|-|-|-|
| Windows | Base-2 | Consistently mislabels as base-10. |
| Linux distributions | Commonly base-2, some software may use base-10 | Inconsistent labeling, alignment between measurement and labeling depends on the software package. |
| macOS, iOS, and iPad OS | Base-10 | [Consistently labels as base-10](https://support.apple.com/HT201402). |

Check with your operating system vendor if your operating system isn't listed.

## File share total cost of ownership checklist
If you're migrating to Azure Files from on-premises or comparing Azure Files to other cloud storage solutions, you should consider the following factors to ensure a fair, apples-to-apples comparison:

- **How do you pay for storage, IOPS, and bandwidth?** With Azure Files, the billing model you use depends on whether you're deploying [premium](#provisioned-model) or [standard](#pay-as-you-go-model) file shares. Most cloud solutions have models that align with the principles of either provisioned storage, such as price determinism and simplicity, or pay-as-you-go storage, which can optimize costs by only charging you for what you actually use. Of particular interest for provisioned models are minimum provisioned share size, the provisioning unit, and the ability to increase and decrease provisioning.

- **Are there any methods to optimize storage costs?** You can use [Azure Files Reservations](#reservations) to achieve an up to 36% discount on storage. Other solutions may employ strategies like deduplication or compression to optionally optimize storage efficiency. However, these storage optimization strategies often have non-monetary costs, such as reducing performance. Reservations have no side effects on performance.

- **How do you achieve storage resiliency and redundancy?** With Azure Files, storage resiliency and redundancy are baked into the product offering. All tiers and redundancy levels ensure that data is highly available and at least three copies of your data are accessible. When considering other file storage options, consider whether storage resiliency and redundancy is built in or something you must assemble yourself.

- **What do you need to manage?** With Azure Files, the basic unit of management is a storage account. Other solutions may require additional management, such as operating system updates or virtual resource management (VMs, disks, network IP addresses, etc.).

- **What are the costs of value-added products, like backup, security, etc.?** Azure Files supports integrations with multiple first- and third-party [value-added services](#value-added-services). Value-added services such as Azure Backup, Azure File Sync, and Azure Defender provide backup, replication and caching, and security functionality for Azure Files. Value-added solutions, whether on-premises or in the cloud, have their own licensing and product costs, but are often considered part of the total cost of ownership for file storage.

## Reservations
Azure Files supports reservations (also referred to as *reserved instances*), which enable you to achieve a discount on storage by pre-committing to storage utilization. You should consider purchasing reserved instances for any production workload, or dev/test workloads with consistent footprints. When you purchase a Reservation, you must specify the following dimensions:

- **Capacity size**: Reservations can be for either 10 TiB or 100 TiB, with more significant discounts for purchasing a higher capacity Reservation. You can purchase multiple Reservations, including Reservations of different capacity sizes to meet your workload requirements. For example, if your production deployment has 120 TiB of file shares, you could purchase one 100 TiB Reservation and two 10 TiB Reservations to meet the total storage capacity requirements.
- **Term**: Reservations can be purchased for either a one-year or three-year term, with more significant discounts for purchasing a longer Reservation term.
- **Tier**: The tier of Azure Files for the Reservation. Reservations currently are available for the premium, hot, and cool tiers.
- **Location**: The Azure region for the Reservation. Reservations are available in a subset of Azure regions.
- **Redundancy**: The storage redundancy for the Reservation. Reservations are supported for all redundancies Azure Files supports, including LRS, ZRS, GRS, and GZRS.
- **Billing frequency**: Indicates how often the account is billed for the Reservation. Options include *Monthly* or *Upfront*.

Once you purchase a Reservation, it will automatically be consumed by your existing storage utilization. If you use more storage than you have reserved, you'll pay list price for the balance not covered by the Reservation. Transaction, bandwidth, data transfer, and metadata storage charges aren't included in the Reservation.

There are differences in how Reservations work with Azure file share snapshots for standard and premium file shares. If you're taking snapshots of standard file shares, then the snapshot differentials count against the Reservation and are billed as part of the normal used storage meter. However, if you're taking snapshots of premium file shares, then the snapshots are billed using a separate meter and don't count against the Reservation. For more information, see [Snapshots](#snapshots).

For more information on how to purchase Reservations, see [Optimize costs for Azure Files with Reservations](files-reserve-capacity.md).

## Provisioned model
Azure Files uses a provisioned model for premium file shares. In a provisioned billing model, you proactively specify to the Azure Files service what your storage requirements are, rather than being billed based on what you use. A provisioned model for storage is similar to buying an on-premises storage solution because when you provision an Azure file share with a certain amount of storage capacity, you pay for that storage capacity regardless of whether you use it or not. Unlike purchasing physical media on-premises, provisioned file shares can be dynamically scaled up or down depending on your storage and IO performance characteristics.

The provisioned size of the file share can be increased at any time but can be decreased only after 24 hours since the last increase. After waiting for 24 hours without a quota increase, you can decrease the share quota as many times as you like, until you increase it again. IOPS/throughput scale changes will be effective within a few minutes after the provisioned size change.

It's possible to decrease the size of your provisioned share below your used GiB. If you do, you won't lose data, but you'll still be billed for the size used and receive the performance of the provisioned share, not the size used.

### Provisioning method
When you provision a premium file share, you specify how many GiBs your workload requires. Each GiB that you provision entitles you to more IOPS and throughput on a fixed ratio. In addition to the baseline IOPS for which you are guaranteed, each premium file share supports bursting on a best effort basis. The formulas for IOPS and throughput are as follows:

| Item | Value |
|-|-|
| Minimum size of a file share | 100 GiB |
| Provisioning unit | 1 GiB |
| Baseline IOPS formula | `MIN(3000 + 1 * ProvisionedStorageGiB, 100000)` |
| Burst limit | `MIN(MAX(10000, 3 * ProvisionedStorageGiB), 100000)` |
| Burst credits | `(BurstLimit - BaselineIOPS) * 3600` |
| Throughput rate (ingress + egress) (MiB/sec) | `100 + CEILING(0.04 * ProvisionedStorageGiB) + CEILING(0.06 * ProvisionedStorageGiB)` |

The following table illustrates a few examples of these formulae for the provisioned share sizes:

| Capacity (GiB) | Baseline IOPS | Burst IOPS | Burst credits | Throughput (ingress + egress) (MiB/sec) |
|-|-|-|-|-|
| 100 | 3,100 | Up to 10,000 | 24,840,000 | 110 |
| 500 | 3,500 | Up to 10,000 | 23,400,000 | 150 |
| 1,024 | 4,024 | Up to 10,000 | 21,513,600 | 203 |
| 5,120 | 8,120 | Up to 15,360 | 26,064,000 | 613 |
| 10,240 | 13,240 | Up to 30,720 | 62,928,000 | 1,125 |
| 33,792 | 36,792 | Up to 100,000 | 227,548,800 | 3,480 |
| 51,200 | 54,200 | Up to 100,000 | 164,880,000 | 5,220 |
| 102,400 | 100,000 | Up to 100,000 | 0 | 10,340 |

Effective file share performance is subject to machine network limits, available network bandwidth, IO sizes, and parallelism, among many other factors. To achieve maximum benefit from parallelization, we recommend enabling SMB Multichannel on premium file shares. To learn more see [enable SMB Multichannel](files-smb-protocol.md#smb-multichannel). Refer to [SMB Multichannel performance](smb-performance.md) and [performance troubleshooting guide](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json) for some common performance issues and workarounds.

### Bursting
If your workload needs the extra performance to meet peak demand, your share can use burst credits to go above the share's baseline IOPS limit to give the share the performance it needs to meet the demand. Bursting is automated and operates based on a credit system. Bursting works on a best effort basis, and the burst limit isn't a guarantee.

Credits accumulate in a burst bucket whenever traffic for your file share is below baseline IOPS. Earned credits are used later to enable burst when operations would exceed the baseline IOPS.

Whenever a share exceeds the baseline IOPS and has credits in a burst bucket, it will burst up to the maximum allowed peak burst rate. Shares can continue to burst as long as credits are remaining, but this is based on the number of burst credits accrued. Each IO beyond baseline IOPS consumes one credit, and once all credits are consumed, the share would return to the baseline IOPS.

Share credits have three states:

- Accruing, when the file share is using less than the baseline IOPS.
- Declining, when the file share is using more than the baseline IOPS and in the bursting mode.
- Constant, when the files share is using exactly the baseline IOPS, there are either no credits accrued or used.

New file shares start with the full number of credits in its burst bucket. Burst credits won't be accrued if the share IOPS fall below baseline IOPS due to throttling by the server.

## Pay-as-you-go model
Azure Files uses a pay-as-you-go billing model for standard file shares. In a pay-as-you-go billing model, the amount you pay is determined by how much you actually use, rather than based on a provisioned amount. At a high level, you pay a cost for the amount of logical data stored, and then an additional set of transactions based on your usage of that data. A pay-as-you-go model can be cost-efficient, because you don't need to overprovision to account for future growth or performance requirements. You also don't need to deprovision if your workload and data footprint vary over time. On the other hand, a pay-as-you-go model can also be difficult to plan as part of a budgeting process, because the pay-as-you-go billing model is driven by end-user consumption.

### Differences in standard tiers
When you create a standard file share, you pick between the following tiers: transaction optimized, hot, and cool. All three tiers are stored on the exact same standard storage hardware. The main difference for these three tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. This means:

- Transaction optimized, as the name implies, optimizes the price for high transaction workloads. Transaction optimized has the highest data at-rest storage price, but the lowest transaction prices.
- Hot is for active workloads that don't involve a large number of transactions, and has a slightly lower data at-rest storage price, but slightly higher transaction prices as compared to transaction optimized. Think of it as the middle ground between the transaction optimized and cool tiers.
- Cool optimizes the price for workloads that don't have much activity, offering the lowest data at-rest storage price, but the highest transaction prices.

If you put an infrequently accessed workload in the transaction optimized tier, you'll pay almost nothing for the few times in a month that you make transactions against your share. However, you'll pay a high amount for the data storage costs. If you moved this same share to the cool tier, you'd still pay almost nothing for the transaction costs, simply because you're infrequently making transactions for this workload. However, the cool tier has a much cheaper data storage price. Selecting the appropriate tier for your use case allows you to considerably reduce your costs.

Similarly, if you put a highly accessed workload in the cool tier, you'll pay a lot more in transaction costs, but less for data storage costs. This can lead to a situation where the increased costs from the transaction prices increase outweigh the savings from the decreased data storage price, leading you to pay more money on cool than you would have on transaction optimized. For some usage levels, it's possible that the hot tier will be the most cost efficient, and the cool tier will be more expensive than transaction optimized.

Your workload and activity level will determine the most cost efficient tier for your standard file share. In practice, the best way to pick the most cost efficient tier involves looking at the actual resource consumption of the share (data stored, write transactions, etc.). For standard file shares, we recommend starting in the transaction optimized tier during the initial migration into Azure Files, and then picking the correct tier based on usage after the migration is complete. Transaction usage during migration is not typically indicative of normal transaction usage.

### What are transactions?
When you mount an Azure file share on a computer using SMB, the Azure file share is exposed on your computer as if it were local storage. This means that applications, scripts, and other programs that you have on your computer can access the files and folders on the Azure file share without needing to know that they are stored in Azure. 

When you read or write to a file, the application you are using performs a series of API calls to the file system API provided by your operating system. These calls are then interpreted by your operating system into SMB protocol transactions, which are sent over the wire to Azure Files to fulfill. A task that the end user perceives as a single operation, such as reading a file from start to finish, may be translated into multiple SMB transactions served by Azure Files.

As a principle, the pay-as-you-go billing model used by standard file shares bills based on usage. SMB and FileREST transactions made by the applications, scripts, and other programs used by your users represent usage of your file share and show up as part of your bill. The same concept applies to value-added cloud services that you might add to your share, such as Azure File Sync or Azure Backup. Transactions are grouped into five different transaction categories which have different prices based on their impact on the Azure file share. These categories are: write, list, read, other, and delete. 

The following table shows the categorization of each transaction:

| Transaction bucket | Management operations | Data operations |
|-|-|-|
| Write transactions | <ul><li>`CreateShare`</li><li>`SetFileServiceProperties`</li><li>`SetShareMetadata`</li><li>`SetShareProperties`</li><li>`SetShareAcl`</li><li>`SnapshotShare`</li><li>`RestoreShare`</li></ul> | <ul><li>`CopyFile`</li><li>`Create`</li><li>`CreateDirectory`</li><li>`CreateFile`</li><li>`PutRange`</li><li>`PutRangeFromURL`</li><li>`SetDirectoryMetadata`</li><li>`SetFileMetadata`</li><li>`SetFileProperties`</li><li>`SetInfo`</li><li>`Write`</li><li>`PutFilePermission`</li><li>`Flush`</li><li>`SetDirectoryProperties`</li></ul> |
| List transactions | <ul><li>`ListShares`</li></ul> | <ul><li>`ListFileRanges`</li><li>`ListFiles`</li><li>`ListHandles`</li></ul> |
| Read transactions | <ul><li>`GetFileServiceProperties`</li><li>`GetShareAcl`</li><li>`GetShareMetadata`</li><li>`GetShareProperties`</li><li>`GetShareStats`</li></ul> | <ul><li>`FilePreflightRequest`</li><li>`GetDirectoryMetadata`</li><li>`GetDirectoryProperties`</li><li>`GetFile`</li><li>`GetFileCopyInformation`</li><li>`GetFileMetadata`</li><li>`GetFileProperties`</li><li>`QueryDirectory`</li><li>`QueryInfo`</li><li>`Read`</li><li>`GetFilePermission`</li></ul> |
| Other/protocol transactions | <ul><li>`AcquireShareLease`</li><li>`BreakShareLease`</li><li>`ReleaseShareLease`</li><li>`RenewShareLease`</li><li>`ChangeShareLease`</li></ul> | <ul><li>`AbortCopyFile`</li><li>`Cancel`</li><li>`ChangeNotify`</li><li>`Close`</li><li>`Echo`</li><li>`Ioctl`</li><li>`Lock`</li><li>`Logoff`</li><li>`Negotiate`</li><li>`OplockBreak`</li><li>`SessionSetup`</li><li>`TreeConnect`</li><li>`TreeDisconnect`</li><li>`CloseHandles`</li><li>`AcquireFileLease`</li><li>`BreakFileLease`</li><li>`ChangeFileLease`</li><li>`ReleaseFileLease`</li></ul> |
| Delete transactions | <ul><li>`DeleteShare`</li></ul> | <ul><li>`ClearRange`</li><li>`DeleteDirectory`</li><li>`DeleteFile`</li></ul> |  

> [!Note]  
> NFS 4.1 is only available for premium file shares, which use the provisioned billing model. Transactions don't affect billing for premium file shares.

### Switching between standard tiers
Although you can change a standard file share between the three standard file share tiers, the best practice to optimize costs after the initial migration is to pick the most cost optimal tier to be in, and stay there unless your access pattern changes. This is because changing the tier of a standard file share results in additional costs as follows:

- Transactions: When you move a share from a hotter tier to a cooler tier, you will incur the cooler tier's write transaction charge for each file in the share. Moving a file share from a cooler tier to a hotter tier will incur the cool tier's read transaction charge for each file in the share. 

- Data retrieval: If you are moving from the cool tier to hot or transaction optimized, you will incur a data retrieval charge based on the size of data moved. Only the cool tier has a data retrieval charge.

The following table illustrates the cost breakdown of moving tiers:

| Tier | Transaction optimized (destination) | Hot (destination) | Cool (destination) |
|-|-|-|-|
| **Transaction optimized (source)** | -- | <ul><li>1 hot write transaction per file.</li></ul> | <ul><li>1 cool write transaction per file.</li></ul> |
| **Hot (source)** | <ul><li>1 hot read transaction per file.</li><ul> | -- | <ul><li>1 cool write transaction per file.</li></ul> |
| **Cool (source)** | <ul><li>1 cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | <ul><li>1 cool read transaction per file.</li><li>Data retrieval per total used GiB.</li></ul> | -- |

Although there is no formal limit on how often you can change the tier of your file share, your share will take time to transition based on the amount of data in your share. You cannot change the tier of the share while the file share is transitioning between tiers. Changing the tier of the file share does not impact regular file share access. 

Although there is no direct mechanism to move between premium and standard file shares because they are contained in different storage account types, you can use a copy tool such as robocopy to move between premium and standard file shares.

### Choosing a tier
Regardless of how you migrate existing data into Azure Files, we recommend initially creating the file share in transaction optimized tier due to the large number of transactions incurred during migration. After your migration is complete and you've operated for a few days or weeks with regular usage, you can plug your transaction counts into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to figure out which tier is best suited for your workload. 

Because standard file shares only show transaction information at the storage account level, using the storage metrics to estimate which tier is cheaper at the file share level is an imperfect science. If possible, we recommend deploying only one file share in each storage account to ensure full visibility into billing.

To see previous transactions:

1. Go to your storage account and select **Metrics** in the left navigation bar.
2. Select **Scope** as your storage account name, **Metric Namespace** as "File", **Metric** as "Transactions", and **Aggregation** as "Sum".
3. Select **Apply Splitting**.
4. Select **Values** as "API Name". Select your desired **Limit** and **Sort**.
5. Select your desired time period.

> [!Note]  
> Make sure you view transactions over a period of time to get a better idea of average number of transactions. Ensure that the chosen time period does not overlap with initial provisioning. Multiply the average number of transactions during this time period to get the estimated transactions for an entire month.

## Provisioned/quota, logical size, and physical size
Azure Files tracks three distinct quantities with respect to share capacity: 

- **Provisioned size or quota**: With both premium and standard file shares, you specify the maximum size that the file share is allowed to grow to. In premium file shares, this value is called the provisioned size, and whatever amount you provision is what you pay for, regardless of how much you actually use. In standard file shares, this value is called quota and does not directly affect your bill. Provisioned size is a required field for premium file shares. For standard file shares, if provisioned size isn't directly specified, the share will default to the maximum value supported by the storage account. This is either 5 TiB or 100 TiB, depending on the storage account type and settings.

- **Logical size**: The logical size of a file share or file relates to how big it is without considering how it's actually stored, where additional optimizations may be applied. One way to think about this is that the logical size of the file is how many KiB/MiB/GiB will be transferred over the wire if you copy it to a different location. In both premium and standard file shares, the total logical size of the file share is what is used for enforcement against provisioned size/quota. In standard file shares, the logical size is the quantity used for the data at-rest usage billing. Logical size is referred to as "size" in the Windows properties dialog for a file/folder and as "content length" by Azure Files metrics.

- **Physical size**: The physical size of the file relates to the size of the file as encoded on disk. This may align with the file's logical size, or it may be smaller, depending on how the file has been written to by the operating system. A common reason for the logical size and physical size to be different is by using [sparse files](/windows/win32/fileio/sparse-files). The physical size of the files in the share is used for snapshot billing, although allocated ranges are shared between snapshots if they are unchanged (differential storage). To learn more about how snapshots are billed in Azure Files, see [Snapshots](#snapshots).

## Snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. Snapshots are always differential from the live share and from each other, meaning that you're always paying only for what's different in each snapshot. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots do not count against file share size limits, although you're limited to a specific number of snapshots. To see the current snapshot limits, see [Azure file share scale targets](storage-files-scale-targets.md#azure-file-share-scale-targets).

Snapshots are always billed based on the differential storage utilization of each snapshot, however this looks slightly different between premium file shares and standard file shares:

- In premium file shares, snapshots are billed against their own snapshot meter, which has a reduced price over the provisioned storage price. This means that you'll see a separate line item on your bill representing snapshots for premium file shares for each FileStorage storage account on your bill.

- In standard file shares, snapshots are billed as part of the normal used storage meter, although you're still only billed for the differential cost of the snapshot. This means that you won't see a separate line item on your bill representing snapshots for each standard storage account containing Azure file shares. This also means that differential snapshot usage counts against Reservations that are purchased for standard file shares.

Value-added services for Azure Files may use snapshots as part of their value proposition. See [value-added services for Azure Files](#value-added-services) for more information on how snapshots are used.

## Value-added services
Like on-premises storage solutions that offer first- and third-party features and product integrations to add value to the hosted file shares, Azure Files provides integration points for first- and third-party products to integrate with customer-owned file shares. Although these solutions may provide considerable extra value to Azure Files, you should consider the extra costs that these services add to the total cost of an Azure Files solution.

Costs are broken down into three buckets:

- **Licensing costs for the value-added service.** These may come in the form of a fixed cost per customer, end user (sometimes called a "head cost"), Azure file share or storage account. They may also be based on units of storage utilization, such as a fixed cost for every 500 GiB chunk of data in the file share.

- **Transaction costs for the value-added service.** Some value-added services have their own concept of transactions distinct from what Azure Files views as a transaction. These transactions will show up on your bill under the value-added service's charges; however, they relate directly to how you use the value-added service with your file share.

- **Azure Files costs for using a value-added service.** Azure Files does not directly charge customers costs for adding value-added services, but as part of adding value to the Azure file share, the value-added service might increase the costs that you see on your Azure file share. This is easy to see with standard file shares, because standard file shares have a pay-as-you-go model with transaction charges. If the value-added service does transactions against the file share on your behalf, they will show up in your Azure Files transaction bill even though you didn't directly do those transactions yourself. This applies to premium file shares as well, although it may be less noticeable. Additional transactions against premium file shares from value-added services count against your provisioned IOPS numbers, meaning that value-added services may require provisioning more storage to have enough IOPS or throughput available for your workload.

When computing the total cost of ownership for your file share, you should consider the costs of Azure Files and of all value-added services that you would like to use with Azure Files.

There are multiple value-added first- and third-party services. This document covers a subset of the common first-party services customers use with Azure file shares. You can learn more about services not listed here by reading the pricing page for that service.

### Azure File Sync
Azure File Sync is a value-added service for Azure Files that synchronizes one or more on-premises Windows file shares with an Azure file share. Because the cloud Azure file share has a complete copy of the data in a synchronized file share that is available on-premises, you can transform your on-premises Windows File Server into a cache of the Azure file share to reduce your on-premises footprint. Learn more by reading [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

When considering the total cost of ownership for a solution deployed using Azure File Sync, you should consider the following cost aspects:

[!INCLUDE [storage-file-sync-cost-categories](../../../includes/storage-file-sync-cost-categories.md)]

To optimize costs for Azure Files with Azure File Sync, you should consider the tier of your file share. For more information on how to pick the tier for each file share, see [choosing a file share tier](#choosing-a-tier).

If you're migrating to Azure File Sync from StorSimple, see [Comparing the costs of StorSimple to Azure File Sync](../file-sync/file-sync-storsimple-cost-comparison.md).

### Azure Backup
Azure Backup provides a serverless backup solution for Azure Files that seamlessly integrates with your file shares, and with other value-added services such as Azure File Sync. Azure Backup for Azure Files is a snapshot-based backup solution that provides a scheduling mechanism for automatically taking snapshots on an administrator-defined schedule. It also provides a user-friendly interface for restoring deleted files/folders or the entire share to a particular point in time. To learn more about Azure Backup for Azure Files, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json).

When considering the costs of using Azure Backup to back up your Azure file shares, consider the following:

- **Protected instance licensing cost for Azure file share data.** Azure Backup charges a protected instance licensing cost per storage account containing backed up Azure file shares. A protected instance is defined as 250 GiB of Azure file share storage. Storage accounts containing less than 250 GiB of Azure file share storage are subject to a fractional protected instance cost. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). Note that you must select *Azure Files* from the list of services Azure Backup can protect.

- **Azure Files costs.** Azure Backup increases the costs of Azure Files in the following ways:
    - **Differential costs from Azure file share snapshots.** Azure Backup automates taking Azure file share snapshots on an administrator-defined schedule. Snapshots are always differential; however, the additional cost added to the total bill depends on the length of time snapshots are kept and the amount of churn on the file share during that time. This dictates how different the snapshot is from the live file share and therefore how much additional data is stored by Azure Files.

    - **Transaction costs from restore operations.** Restore operations from the snapshot to the live share will cause transactions. For standard file shares, this means that reads from snapshots/writes from restores will be billed as normal file share transactions. For premium file shares, these operations are counted against the provisioned IOPS for the file share.

### Microsoft Defender for Storage
Microsoft Defender provides support for Azure Files as part of its Microsoft Defender for Storage product. Microsoft Defender for Storage detects unusual and potentially harmful attempts to access or exploit your Azure file shares over SMB or FileREST. Microsoft Defender for Storage is enabled on the subscription level for all file shares in storage accounts in that subscription.

Microsoft Defender for Storage does not support antivirus capabilities for Azure file shares.

The main cost from Microsoft Defender for Storage is an additional set of transaction costs that the product levies on top of the transactions that are done against the Azure file share. Although these costs are based on the transactions incurred in Azure Files, they aren't part of the billing for Azure Files, but rather are part of the Microsoft Defender pricing. Microsoft Defender for Storage charges a transaction rate even on premium file shares, where Azure Files includes transactions as part of IOPS provisioning. The current transaction rate can be found on [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) under the *Microsoft Defender for Storage* table row.

Transaction heavy file shares will incur significant costs using Microsoft Defender for Storage. Based on these costs, you may wish to opt-out of Microsoft Defender for Storage for specific storage accounts. For more information, see [Exclude a storage account from Microsoft Defender for Storage protections](../../defender-for-cloud/defender-for-storage-exclude.md).

## See also
- [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).
- [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).
- [Create a file share](storage-how-to-create-file-share.md) and [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).
