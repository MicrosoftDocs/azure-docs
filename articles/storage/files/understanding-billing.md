---
title: Understand Azure Files billing | Microsoft Docs
description: Learn how to interpret the provisioned and pay-as-you-go billing models for Azure file shares.
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 4/13/2022
ms.author: kendownie
ms.subservice: files
---

# Understand Azure Files billing
Azure Files provides two distinct billing models: provisioned and pay-as-you-go. The provisioned model is only available for premium file shares, which are file shares deployed in the **FileStorage** storage account kind. The pay-as-you-go model is only available for standard file shares, which are file shares deployed in the **general purpose version 2 (GPv2)** storage account kind. This article explains how both models work in order to help you understand your monthly Azure Files bill.

:::row:::
    :::column:::
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/m5_-GsKv4-o" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    :::column-end:::
    :::column:::
        This video is an interview discussing covering the basics of the Azure Files billing model including how to optimize Azure file shares to achieve the lowest costs possible and how to compare Azure Files to other file storage offerings on-premises and in the cloud.
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
Azure Files uses base-2 units of measurement to represent storage capacity: KiB, MiB, GiB, and TiB. Your operating system may or may not use the same unit of measurement or counting system.

### Windows
Both the Windows operating system and Azure Files measure storage capacity using the base-2 counting system, but there is a difference when labeling units. Azure Files labels its storage capacity with base-2 units of measurement while Windows labels its storage capacity in base-10 units of measurement. When reporting storage capacity, Windows doesn't convert its storage capacity from base-2 to base-10.

| Acronym | Definition                         | Unit     | Windows displays as |
|---------|------------------------------------|----------|---------------------|
| KiB     | 1,024 bytes                        | kibibyte | KB (kilobyte)       |
| MiB     | 1,024 KiB (1,048,576 bytes)        | mebibyte | MB (megabyte)       |
| GiB     | 1024 MiB (1,073,741,824 bytes)     | gibibyte | GB (gigabyte)       |
| TiB     | 1024 GiB (1,099,511,627,776 bytes) | tebibyte | TB (terabyte)       |

### macOS
See [How iOS and macOS report storage capacity](https://support.apple.com/HT201402) on Apple's website to determine which counting system is used.

### Linux
A different counting system could be used by each operating system or individual piece of software. See their documentation to determine how they report storage capacity.

## Reserve capacity
Azure Files supports storage capacity reservations, which enable you to achieve a discount on storage by pre-committing to storage utilization. You should consider purchasing reserved instances for any production workload, or dev/test workloads with consistent footprints. When you purchase reserved capacity, your reservation must specify the following dimensions:

- **Capacity size**: Capacity reservations can be for either 10 TiB or 100 TiB, with more significant discounts for purchasing a higher capacity reservation. You can purchase multiple reservations, including reservations of different capacity sizes to meet your workload requirements. For example, if your production deployment has 120 TiB of file shares, you could purchase one 100 TiB reservation and two 10 TiB reservations to meet the total capacity requirements.
- **Term**: Reservations can be purchased for either a one year or three year term, with more significant discounts for purchasing a longer reservation term. 
- **Tier**: The tier of Azure Files for the capacity reservation. Reservations for Azure Files currently are available for the premium, hot, and cool tiers.
- **Location**: The Azure region for the capacity reservation. Capacity reservations are available in a subset of Azure regions.
- **Redundancy**: The storage redundancy for the capacity reservation. Reservations are supported for all redundancies Azure Files supports, including LRS, ZRS, GRS, and GZRS.

Once you purchase a capacity reservation, it will automatically be consumed by your existing storage utilization. If you use more storage than you have reserved, you will pay list price for the balance not covered by the capacity reservation. Transaction, bandwidth, data transfer, and metadata storage charges are not included in the reservation.

For more information on how to purchase storage reservations, see [Optimize costs for Azure Files with reserved capacity](files-reserve-capacity.md).

## Snapshots
Azure Files supports snapshots, which are similar to volume shadow copies (VSS) on Windows File Server. Snapshots are always differential from the live share and from each other, meaning that you are always paying only for what's different in each snapshot. For more information on share snapshots, see [Overview of snapshots for Azure Files](storage-snapshots-files.md).

Snapshots do not count against file share size limits, although you are limited to a specific number of snapshots. To see the current snapshot limits, see [Azure file share scale targets](storage-files-scale-targets.md#azure-file-share-scale-targets).

Snapshots are always billed based on the differential storage utilization of each snapshot, however this looks slightly different between premium file shares and standard file shares:

- In premium file shares, snapshots are billed against their own snapshot meter, which has a reduced price over the provisioned storage price. This means that you will see a separate line item on your bill representing snapshots for premium file shares for each FileStorage storage account on your bill.

- In standard file shares, snapshots are billed as part of the normal used storage meter, although you are still only billed for the differential cost of the snapshot. This means that you will not see a separate line item on your bill representing snapshots for each standard storage account containing Azure file shares. This also means that differential snapshot usage counts against capacity reservations that are purchased for standard file shares.

Value-added services for Azure Files may use snapshots as part of their value proposition. See [value-added services for Azure Files](#value-added-services) for more information on how snapshots are used.

## Provisioned model
Azure Files uses a provisioned model for premium file shares. In a provisioned business model, you proactively specify to the Azure Files service what your storage requirements are, rather than being billed based on what you use. This is similar to buying hardware on-premises, in that when you provision an Azure file share with a certain amount of storage, you pay for that storage regardless of whether you use it or not, just like you don't start paying the costs of physical media on-premises when you start to use space. Unlike purchasing physical media on-premises, provisioned file shares can be dynamically scaled up or down depending on your storage and IO performance characteristics.

The provisioned size of the file share can be increased at any time but can be decreased only after 24 hours since the last increase. After waiting for 24 hours without a quota increase, you can decrease the share quota as many times as you like, until you increase it again. IOPS/throughput scale changes will be effective within a few minutes after the provisioned size change.

It is possible to decrease the size of your provisioned share below your used GiB. If you do this, you will not lose data but, you will still be billed for the size used and receive the performance (baseline IOPS, throughput, and burst IOPS) of the provisioned share, not the size used.

### Provisioning method
When you provision a premium file share, you specify how many GiBs your workload requires. Each GiB that you provision entitles you to additional IOPS and throughput on a fixed ratio. In addition to the baseline IOPS for which you are guaranteed, each premium file share supports bursting on a best effort basis. The formulas for IOPS and throughput are as follows:

| Item | Value |
|-|-|
| Minimum size of a file share | 100 GiB |
| Provisioning unit | 1 GiB |
| Baseline IOPS formula | `MIN(3000 + 1 * ProvisionedGiB, 100000)` |
| Burst limit | `MIN(MAX(10000, 3 * ProvisionedGiB), 100000)` |
| Burst credits | `(BurstLimit - BaselineIOPS) * 3600` |
| Throughput rate (ingress + egress) (MiB/sec) | `100 + CEILING(0.04 * ProvisionedGiB) + CEILING(0.06 * ProvisionedGiB)` |

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

Effective file share performance is subject to machine network limits, available network bandwidth, IO sizes, parallelism, among many other factors. For example, based on internal testing with 8 KiB read/write IO sizes, a single Windows virtual machine without SMB Multichannel enabled, *Standard F16s_v2*, connected to premium file share over SMB could achieve 20K read IOPS and 15K write IOPS. With 512 MiB read/write IO sizes, the same VM could achieve 1.1 GiB/s egress and 370 MiB/s ingress throughput. The same client can achieve up to \~3x performance if SMB Multichannel is enabled on the premium shares. To achieve maximum performance scale, [enable SMB Multichannel](files-smb-protocol.md#smb-multichannel) and spread the load across multiple VMs. Refer to [SMB Multichannel performance](storage-files-smb-multichannel-performance.md) and [troubleshooting guide](storage-troubleshooting-files-performance.md) for some common performance issues and workarounds.

### Bursting
If your workload needs the extra performance to meet peak demand, your share can use burst credits to go above share baseline IOPS limit to offer share performance it needs to meet the demand. Premium file shares can burst their IOPS up to 4,000 or up to a factor of three, whichever is a higher value. Bursting is automated and operates based on a credit system. Bursting works on a best effort basis and the burst limit is not a guarantee.

Credits accumulate in a burst bucket whenever traffic for your file share is below baseline IOPS. For example, a 100 GiB share has 500 baseline IOPS. If actual traffic on the share was 100 IOPS for a specific 1-second interval, then the 400 unused IOPS are credited to a burst bucket. Similarly, an idle 1 TiB share, accrues burst credit at 1,424 IOPS. These credits will then be used later when operations would exceed the baseline IOPS.

Whenever a share exceeds the baseline IOPS and has credits in a burst bucket, it will burst up to the max allowed peak burst rate. Shares can continue to burst as long as credits are remaining but, this is based on the number of burst credits accrued. Each IO beyond baseline IOPS consumes one credit and once all credits are consumed the share would return to the baseline IOPS.

Share credits have three states:

- Accruing, when the file share is using less than the baseline IOPS.
- Declining, when the file share is using more than the baseline IOPS and in the bursting mode.
- Constant, when the files share is using exactly the baseline IOPS, there are either no credits accrued or used.

New file shares start with the full number of credits in its burst bucket. Burst credits will not be accrued if the share IOPS fall below baseline IOPS due to throttling by the server.

## Pay-as-you-go model
Azure Files uses a pay-as-you-go business model for standard file shares. In a pay-as-you-go business model, the amount you pay is determined by how much you actually use, rather than based on a provisioned amount. At a high level, you pay a cost for the amount of logical data stored, and then an additional set of transactions based on your usage of that data. A pay-as-you-go model can be cost-efficient, because you don't need to overprovision to account for future growth or performance requirements or deprovision if your workload is data footprint varies over time. On the other hand, a pay-as-you-go model can also be difficult to plan as part of a budgeting process, because the pay-as-you-go billing model is driven by end-user consumption.

### Differences in standard tiers
When you create a standard file share, you pick between the transaction optimized, hot, and cool tiers. All three tiers are stored on the exact same standard storage hardware. The main difference for these three tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. This means:

- Transaction optimized, as the name implies, optimizes the price for high transaction workloads. Transaction optimized has the highest data at-rest storage price, but the lowest transaction prices.
- Hot is for active workloads that do not involve a large number of transactions, and has a slightly lower data at-rest storage price, but slightly higher transaction prices as compared to transaction optimized. Think of it as the middle ground between the transaction optimized and cool tiers.
- Cool optimizes the price for workloads that do not have much activity, offering the lowest data at-rest storage price, but the highest transaction prices.

If you put an infrequently accessed workload in the transaction optimized tier, you will pay almost nothing for the few times in a month that you make transactions against your share, but you will pay a high amount for the data storage costs. If you were to move this same share to the cool tier, you would still pay almost nothing for the transaction costs, simply because you are very infrequently making transactions for this workload, but the cool tier has a much cheaper data storage price. Selecting the appropriate tier for your use case allows you to considerably reduce your costs.

Similarly, if you put a highly accessed workload in the cool tier, you will pay a lot more in transaction costs, but less for data storage costs. This can lead to a situation where the increased costs from the transaction prices increase outweigh the savings from the decreased data storage price, leading you to pay more money on cool than you would have on transaction optimized. It is possible for some usage levels that while the hot tier will be the most cost efficient tier, the cool tier will be more expensive than transaction optimized.

Your workload and activity level will determine the most cost efficient tier for your standard file share. In practice, the best way to pick the most cost efficient tier involves looking at the actual resource consumption of the share (data stored, write transactions, etc.).

### Choosing a tier
Regardless of how you migrate existing data into Azure Files, we recommend initially creating the file share in transaction optimized tier due to the large number of transactions incurred during migration. After your migration is complete and you've operated for a few days/weeks with regular usage, you can plug in your transaction counts into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to figure out which tier is best suited for your workload. 

Because standard file shares only show transaction information at the storage account level, using the storage metrics to estimate which tier is cheaper at the file share level is an imperfect science. If possible, we recommend deploying only one file share in each storage account to ensure full visibility into billing.

To see previous transactions:

1. Go to your storage account and select **Metrics** in the left navigation bar.
2. Select **Scope** as your storage account name, **Metric Namespace** as "File", **Metric** as "Transactions", and **Aggregation** as "Sum".
3. Select **Apply Splitting**.
4. Select **Values** as "API Name". Select your desired **Limit** and **Sort**.
5. Select your desired time period.

> [!Note]  
> Make sure you view transactions over a period of time to get a better idea of average number of transactions. Ensure that the chosen time period does not overlap with initial provisioning. Multiply the average number of transactions during this time period to get the estimated transactions for an entire month.

### Logical size versus physical size
The data at-rest capacity charge for Azure Files is billed based on the logical size, often colloquially called "size" or "content length", of the file. The logical size of the file is distinct from the physical size of the file on disk, often called "size on disk" or "used size". The physical size of the file may be large or smaller than the logical size of the file.

### What are transactions?
Transactions are operations or requests against Azure Files to upload, download, or otherwise manipulate the contents of the file share. Every action taken on a file share translates to one or more transactions, and on standard shares that use the pay-as-you-go billing model, that translates to transaction costs.

There are five basic transaction categories: write, list, read, other, and delete. All operations done via the REST API or SMB are bucketed into one of these 4 categories as follows:

| Transaction bucket | Management operations | Data operations |
|-|-|-|
| Write transactions | <ul><li>`CreateShare`</li><li>`SetFileServiceProperties`</li><li>`SetShareMetadata`</li><li>`SetShareProperties`</li><li>`SetShareACL`</li></ul> | <ul><li>`CopyFile`</li><li>`Create`</li><li>`CreateDirectory`</li><li>`CreateFile`</li><li>`PutRange`</li><li>`PutRangeFromURL`</li><li>`SetDirectoryMetadata`</li><li>`SetFileMetadata`</li><li>`SetFileProperties`</li><li>`SetInfo`</li><li>`Write`</li><li>`PutFilePermission`</li></ul> |
| List transactions | <ul><li>`ListShares`</li></ul> | <ul><li>`ListFileRanges`</li><li>`ListFiles`</li><li>`ListHandles`</li></ul> |
| Read transactions | <ul><li>`GetFileServiceProperties`</li><li>`GetShareAcl`</li><li>`GetShareMetadata`</li><li>`GetShareProperties`</li><li>`GetShareStats`</li></ul> | <ul><li>`FilePreflightRequest`</li><li>`GetDirectoryMetadata`</li><li>`GetDirectoryProperties`</li><li>`GetFile`</li><li>`GetFileCopyInformation`</li><li>`GetFileMetadata`</li><li>`GetFileProperties`</li><li>`QueryDirectory`</li><li>`QueryInfo`</li><li>`Read`</li><li>`GetFilePermission`</li></ul> |
| Other transactions | | <ul><li>`AbortCopyFile`</li><li>`Cancel`</li><li>`ChangeNotify`</li><li>`Close`</li><li>`Echo`</li><li>`Ioctl`</li><li>`Lock`</li><li>`Logoff`</li><li>`Negotiate`</li><li>`OplockBreak`</li><li>`SessionSetup`</li><li>`TreeConnect`</li><li>`TreeDisconnect`</li><li>`CloseHandles`</li><li>`AcquireFileLease`</li><li>`BreakFileLease`</li><li>`ChangeFileLease`</li><li>`ReleaseFileLease`</li></ul> |
| Delete transactions | <ul><li>`DeleteShare`</li></ul> | <ul><li>`ClearRange`</li><li>`DeleteDirectory`</li></li>`DeleteFile`</li></ul> |  

> [!Note]  
> NFS 4.1 is only available for premium file shares, which use the provisioned billing model, transactions do not affect billing for premium file shares.

## Value-added services
Like on-premises storage solutions which offer first- and third-party features/product integrations to bring additional value to the hosted file shares, Azure Files provides integration points for first- and third-party products to integrate with customer-owned file shares. Although these solutions may provide considerable extra value to Azure Files, you should consider the additional costs that these services add to the total cost of an Azure Files solution. 

Costs are generally broken down into three buckets:

- **Licensing costs for the value-added service.** These may come in the form of a fixed cost per customer, end-user (sometimes referred to as a "head cost"), Azure file share or storage account, or in units of storage utilization, such as a fixed cost for every 500 GiB chunk of data in the file share.

- **Transaction costs for the value-added service.** Some value-added services have their own concept of transactions distinct from what Azure Files views as a transaction. These transactions will show up on your bill under the value-added service's charges; however, relate directly to how you use the value-added service with your file share.

- **Azure Files costs for using a value-added service.** Azure Files does not directly charge customers costs for adding value-added services, but as part of adding value to the Azure file share, the value-added service might increase the costs that you see on your Azure file share. This is really easy to see with standard file shares, because standard file shares have a pay-as-you-go model with transaction charges. If the value-added service does transactions against the file share on your behalf, they will show up in your Azure Files transaction bill even though you didn't directly do those transactions yourself. This applies to premium file shares as well, although it may be less noticeable. Additional transactions against premium file shares from value-added services count against your provisioned IOPS numbers, meaning that value-added services may require provisioning additional storage to have enough IOPS or throughput available for your workload.

When computing the total cost of ownership for your file share, you should consider the costs of Azure Files and of all value-added services that you would like to use with Azure Files.

There are multiple value-added first- and third-party services. This document covers a subset of the common first-party services customers use with Azure file shares. You can learn more about services not listed here by reading the pricing page for that service.

### Azure File Sync
Azure File Sync is a value-added service for Azure Files that synchronizes one or more on-premises Windows file shares with an Azure file share. Because the cloud Azure file share has a complete copy of the data in a synchronized file share that is available on-premises, you can transform your on-premises Windows File Server into a cache of the Azure file share to reduce your on-premises footprint. Learn more by reading [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md).

When considering the total cost of ownership for a solution deployed using Azure File Sync, you should consider the following cost aspects:

- **Capital and operational costs of Windows File Servers with one or more server endpoints.** Azure File Sync as a replication solution is agnostic of where the Windows File Servers that are synchronized with Azure Files are; they could be hosted on-premises, in an Azure VM, or even in another cloud. Unless you are using Azure File Sync with a Windows File Server that is hosted in an Azure VM, the capital (i.e. the upfront hardware costs of your solution) and operating (i.e. cost of labor, electricity, etc.) costs will not be part of your Azure bill, but will still be very much a part of your total cost of ownership. You should consider the amount of data you need to cache on-premises, the number of CPUs and amount of memory your Windows File Servers need to host Azure File Sync workloads (see [recommended system resources for more information](../file-sync/file-sync-planning.md#recommended-system-resources)), and other organization-specific costs you might have.

- **Per server licensing cost for servers registered with Azure File Sync.** To use Azure File Sync with a specific Windows File Server, you must first register it with Azure File Sync's Azure resource, the Storage Sync Service. Each server that you register after the first server has a flat monthly fee. Although this fee is very small, it is one component of your bill to consider. To see the current price of the server registration fee for your desired region, see [the File Sync section on Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

- **Azure Files costs.** Because Azure File Sync is a synchronization solution for Azure Files, it will cause you to consume Azure Files resources. Some of these resources, like storage consumption, are relatively obvious, while others such as transaction and snapshot utilization may not be. For most customers, we recommend using standard file shares with Azure File Sync, although Azure File Sync is fully supported with premium file shares if desired.
    - **Storage utilization.** Azure File Sync will replicate any changes you have made to the path on your Windows File Server specified on your server endpoint to your Azure file share, thus causing storage to be consumed. On standard file shares, this means that adding or increasing the size of existing files on server endpoints will cause storage costs to grow, because the changes will be replicated. On premium file shares, changes will be consume provisioned space - it is your responsibility to periodically increase provisioning as needed to account for file share growth.

    - **Snapshot utilization.** Azure File Sync takes share and file-level snapshots as part of regular usage. Although snapshot utilization is always differential, this can contribute in a noticeable way to the total Azure Files bill.

    - **Transactions from churn.** As files change on server endpoints, the changes are uploaded to the cloud share, which generates transactions. When cloud tiering is enabled, additional transactions are generated for managing tiered files, including I/O happening on tiered files, in addition to egress costs. Although the quantity and type of transactions is difficult to predict due to churn rates and cache efficiency, you can use your previous transaction patterns to estimate future costs if you believe your future usage will be similar to your current usage. 
    
    - **Transactions from cloud enumeration.** Azure File Sync enumerates the Azure File Share in the cloud once per day to discover changes that were made directly to the share so that they can sync down to the server endpoints. This scan generates transactions which are billed to the storage account at a rate of one `ListFiles` transaction per directory per day. You can put this number into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the scan cost.  

    > [!Tip]  
    > If you don't know how many folders you have, check out the TreeSize tool from JAM Software GmbH.

To optimize costs for Azure Files with Azure File Sync, you should consider the tier of your file share. For more information on how to pick the tier for each file share, see [choosing a file share tier](#choosing-a-tier).  

### Azure Backup
Azure Backup provides a serverless backup solution for Azure Files that seamlessly integrates with your file shares, as well as other value-added services such as Azure File Sync. Azure Backup for Azure Files is a snapshot-based backup solution, meaning that Azure Backup provides a scheduling mechanism for automatically taking snapshots on an administrator-defined schedule and a user-friendly interface for restoring deleted files/folders or the entire share to a particular point in time. To learn more about Azure Backup for Azure Files, see [About Azure file share backup](../../backup/azure-file-share-backup-overview.md?toc=/azure/storage/files/toc.json).

When considering the costs of using Azure Backup to backup your Azure file shares, you should consider the following:

- **Protected instance licensing cost for Azure file share data.** Azure Backup charges a protected instance licensing cost per storage account containing backed up Azure file shares. A protected instance is defined as 250 GiB of Azure file share storage. Storage accounts containing less than 250 GiB of Azure file share storage are subject to a fractional protected instance cost. See [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for more information (note that you must select *Azure Files* from the list of services Azure Backup can protect).

- **Azure Files costs.** Azure Backup increases the costs of Azure Files in the following ways:
    - **Differential costs from Azure file share snapshots.** Azure Backup automates taking Azure file share snapshots on an administrator-defined schedule. Snapshots are always differential; however, the additional cost added to the total bill depends on the length of time snapshots are kept and the amount of churn on the file share during that time, because that dictates how different the snapshot is from the live file share and therefore how much additional data is stored by Azure Files.

    - **Transaction costs from restore operations.** Restore operations from the snapshot to the live share will cause transactions. For standard file shares, this means that reads from snapshots/writes from restores will be billed as normal file share transactions. For premium file shares, these operations are counted against the provisioned IOPS for the file share.

### Microsoft Defender for Storage
Microsoft Defender provides support for Azure Files as part of its Microsoft Defender for Storage product. Microsoft Defender for Storage detects unusual and potentially harmful attempts to access or exploit your Azure file shares over SMB or FileREST. Microsoft Defender for Storage is enabled on the subscription level for all file shares in storage accounts in that subscription.

Microsoft Defender for Storage does not support antivirus capabilities for Azure file shares.

The main cost from Microsoft Defender for Storage is an additional set of transaction costs that the product levies on top of the transactions that are done against the Azure file share. Although these costs are based on the transactions incurred in Azure Files, they are not part of the billing for Azure Files, but rather are part of the Microsoft Defender pricing. Microsoft Defender for Storage charges a transaction rate even on premium file shares, where Azure Files includes transactions as part of IOPS provisioning. The current transaction rate can be found on [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) under the *Microsoft Defender for Storage* table row.

Transaction heavy file shares will incur significant costs using Microsoft Defender for Storage. Based on these costs, you may wish to opt-out of Microsoft Defender for Storage for specific storage accounts. For more information, see [Exclude a storage account from Microsoft Defender for Storage protections](../../defender-for-cloud/defender-for-storage-exclude.md).

## File storage comparison checklist
To correctly evaluate the cost of Azure Files compared to other file storage options, consider the following questions:

- **How do you pay for storage, IOPS, and bandwidth?** With Azure Files, the billing model you use depends on whether you are deploying [premium](#provisioned-model) or [standard](#pay-as-you-go-model) file shares. Most cloud solutions have models that align with the principles of either provisioned storage (price determinism, simplicity) or pay-as-you-go storage (pay only for what you actually use). Of particular interest for provisioned models are minimum provisioned share size, the provisioning unit, and the ability to increase and decrease provisioning.  

- **How do you achieve storage resiliency and redundancy?** With Azure Files, storage resiliency and redundancy are baked into the product offering. All tiers and redundancy levels ensure that data is highly available and at least three copies of your data are accessible. When considering other file storage options, consider whether storage resiliency and redundancy is built-in or something you must assemble yourself. 

- **What do you need to manage?** With Azure Files, the basic unit of management is a storage account. Other solutions may require additional management, such as operating system updates or virtual resource management (VMs, disks, network IP addresses, etc.).

- **What are the backup costs?** With Azure Files, Azure Backup integration is easily enabled, and backup storage is billed as part of the cost of the share (backups are stored as differential snapshots). Other solutions may require backup software licensing and additional backup storage costs.

## See also
- [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).
- [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).
- [Create a file share](storage-how-to-create-file-share.md) and [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).
