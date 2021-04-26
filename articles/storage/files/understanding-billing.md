---
title: Understand Azure Files billing | Microsoft Docs
description: Learn how to interpret the provisioned and pay-as-you-go billing models for Azure file shares.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 01/27/2021
ms.author: rogarana
ms.subservice: files
---

# Understand Azure Files billing
Azure Files provides two distinct billing models: provisioned and pay-as-you-go. The provisioned model is only available for premium file shares, which are file shares deployed in the **FileStorage** storage account kind. The pay-as-you-go model is only available for standard file shares, which are file shares deployed in the **general purpose version 2 (GPv2)** storage account kind. This article explains how both models work in order to help you understand your monthly Azure Files bill.

For Azure Files pricing information, see [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

## Storage units	
Azure Files uses base-2 units of measurement to represent storage capacity: KiB, MiB, GiB, and TiB. Your operating system may or may not use the same unit of measurement or counting system.

### Windows

Both the Windows operating system and Azure Files measure storage capacity using the base-2 counting system, but there is a difference when labeling units. Azure Files labels its storage capacity with base-2 units of measurement while Windows labels its storage capacity in base-10 units of measurement. When reporting storage capacity, Windows doesn't convert its storage capacity from base-2 to base-10.

|Acronym  |Definition  |Unit  |Windows displays as  |
|---------|---------|---------|---------|
|KiB     |1,024 bytes         |kibibyte         |KB (kilobyte)         |
|MiB     |1,024 KiB (1,048,576 bytes)         |mebibyte         |MB (megabyte)         |
|GiB     |1024 MiB (1,073,741,824 bytes)         |gibibyte         |GB (gigabyte)         |
|TiB     |1024 GiB (1,099,511,627,776 bytes)         |tebibyte         |TB (terabyte)         |

### macOS

See [How iOS and macOS report storage capacity](https://support.apple.com/HT201402) on Apple's website to determine which counting system is used.

### Linux

A different counting system could be used by each operating system or individual piece of software. See their documentation to determine how they report storage capacity.

## Provisioned model
Azure Files uses a provisioned model for premium file shares. In a provisioned business model, you proactively specify to the Azure Files service what your storage requirements are, rather than being billed based on what you use. This is similar to buying hardware on-premises, in that when you provision an Azure file share with a certain amount of storage, you pay for that storage regardless of whether you use it or not, just like you don't start paying the costs of physical media on-premises when you start to use space. Unlike purchasing physical media on-premises, provisioned file shares can be dynamically scaled up or down depending on your storage and IO performance characteristics.

When you provision a premium file share, you specify how many GiBs your workload requires. Each GiB that you provision entitles you to additional IOPS and throughput on a fixed ratio. In addition to the baseline IOPS for which you are guaranteed, each premium file share supports bursting on a best effort basis. The formulas for IOPS and throughput are as follows:

- Baseline IOPS = 400 + 1 * provisioned GiB. (Up to a max of 100,000 IOPS).
- Burst Limit = MAX(4000, 3 * Baseline IOPS).
- Egress rate = 60 MiB/s + 0.06 * provisioned GiB.
- Ingress rate = 40 MiB/s + 0.04 * provisioned GiB.

The provisioned size of the file share can be increased at any time but can be decreased only after 24 hours since the last increase. After waiting for 24 hours without a quota increase, you can decrease the share quota as many times as you like, until you increase it again. IOPS/throughput scale changes will be effective within a few minutes after the provisioned size change.

It is possible to decrease the size of your provisioned share below your used GiB. If you do this, you will not lose data but, you will still be billed for the size used and receive the performance (baseline IOPS, throughput, and burst IOPS) of the provisioned share, not the size used.

The following table illustrates a few examples of these formulae for the provisioned share sizes:

|Capacity (GiB) | Baseline IOPS | Burst IOPS | Egress (MiB/s) | Ingress (MiB/s) |
|---------|---------|---------|---------|---------|
|100         | 500     | Up to 4,000     | 66   | 44   |
|500         | 900     | Up to 4,000  | 90   | 60   |
|1,024       | 1,424   | Up to 4,000   | 122   | 81   |
|5,120       | 5,520   | Up to 15,360  | 368   | 245   |
|10,240      | 10,640  | Up to 30,720  | 675   | 450   |
|33,792      | 34,192  | Up to 100,000 | 2,088 | 1,392   |
|51,200      | 51,600  | Up to 100,000 | 3,132 | 2,088   |
|102,400     | 100,000 | Up to 100,000 | 6,204 | 4,136   |

Effective file share performance is subject to machine network limits, available network bandwidth, IO sizes, parallelism, among many other factors. For example, based on internal testing with 8 KiB read/write IO sizes, a single Windows virtual machine without SMB Multichannel enabled, *Standard F16s_v2*, connected to premium file share over SMB could achieve 20K read IOPS and 15K write IOPS. With 512 MiB read/write IO sizes, the same VM could achieve 1.1 GiB/s egress and 370 MiB/s
ingress throughput. The same client can achieve up to \~3x performance if SMB Multichannel is enabled on the premium shares. To achieve maximum performance scale, [enable SMB
Multichannel](storage-files-enable-smb-multichannel.md) and spread the load across multiple VMs. Refer to [SMB multichannel performance](storage-files-smb-multichannel-performance.md) and [troubleshooting guide](storage-troubleshooting-files-performance.md) for some common performance issues and workarounds.

### Bursting
If your workload needs the extra performance to meet peak demand, your share can use burst credits to go above share baseline IOPS limit to offer share performance it needs to meet the demand. Premium file shares can burst their IOPS up to 4,000 or up to a factor of three, whichever is a higher value. Bursting is automated and operates based on a credit system. Bursting works on a best effort basis and the burst limit is not a guarantee, file shares can burst *up to* the limit for a max duration of 60 minutes.

Credits accumulate in a burst bucket whenever traffic for your file share is below baseline IOPS. For example, a 100 GiB share has 500 baseline IOPS. If actual traffic on the share was 100 IOPS for a specific 1-second interval, then the 400 unused IOPS are credited to a burst bucket. Similarly, an idle 1 TiB share, accrues burst credit at 1,424 IOPS. These credits will then be used later when operations would exceed the baseline IOPS.

Whenever a share exceeds the baseline IOPS and has credits in a burst bucket, it will burst at the max allowed peak burst rate. Shares can continue to burst as long as credits are remaining, up to max 60 minutes duration but, this is based on the number of burst credits accrued. Each IO beyond baseline IOPS consumes one credit and once all credits are consumed the share would return to the baseline IOPS.

Share credits have three states:

- Accruing, when the file share is using less than the baseline IOPS.
- Declining, when the file share is using more than the baseline IOPS and in the bursting mode.
- Constant, when the files share is using exactly the baseline IOPS, there are either no credits accrued or used.

New file shares start with the full number of credits in its burst bucket. Burst credits will not be accrued if the share IOPS fall below baseline IOPS due to throttling by the server.

## Pay-as-you-go model
Azure Files uses a pay-as-you-go business model for standard file shares. In a pay-as-you-go business model, the amount you pay is determined by how much you actually use, rather than based on a provisioned amount. At a high level, you pay a cost for the amount of data stored on disk, and then an additional set of transactions based on your usage of that data. A pay-as-you-go model can be cost-efficient, because you don't need to overprovision to account for future growth or performance requirements or deprovision if your workload is data footprint varies over time. On the other hand, a pay-as-you-go model can also be difficult to plan as part of a budgeting process, because the pay-as-you-go billing model is driven by end-user consumption.

### Differences in standard tiers
When you create a standard file share, you pick between the transaction optimized, hot, and cool tiers. All three tiers are stored on the exact same standard storage hardware. The main difference for these three tiers is their data at-rest storage prices, which are lower in cooler tiers, and the transaction prices, which are higher in the cooler tiers. This means:

- Transaction optimized, as the name implies, optimizes the price for high transaction workloads. Transaction optimized has the highest data at-rest storage price, but the lowest transaction prices.
- Hot is for active workloads that do not involve a large number of transactions, and has a slightly lower data at-rest storage price, but slightly higher transaction prices as compared to transaction optimized. Think of it as the middle ground between the transaction optimized and cool tiers.
- Cool optimizes the price for workloads that do not have much activity, offering the lowest data at-rest storage price, but the highest transaction prices.

If you put an infrequently accessed workload in the transaction optimized tier, you will pay almost nothing for the few times in a month that you make transactions against your share, but you will pay a high amount for the data storage costs. If you were to move this same share to the cool tier, you would still pay almost nothing for the transaction costs, simply because you are very infrequently making transactions for this workload, but the cool tier has a much cheaper data storage price. Selecting the appropriate tier for your use case allows you to considerably reduce your costs. Selecting the appropriate tier for your use case allows you to considerably reduce your costs.

Similarly, if you put a highly accessed workload in the cool tier, you will pay a lot more in transaction costs, but less for data storage costs. This can lead to a situation where the increased costs from the transaction prices increase outweigh the savings from the decreased data storage price, leading you to pay more money on cool than you would have on transaction optimized. It is possible for some usage levels that while the hot tier will be the most cost efficient tier, the cool tier will be more expensive than transaction optimized.

Your workload and activity level will determine the most cost efficient tier for your standard file share. In practice, the best way to pick the most cost efficient tier involves looking at the actual resource consumption of the share (data stored, write transactions, etc.).

### What are transactions?
Transactions are operations or requests against Azure Files to upload, download, or otherwise manipulate the contents of the file share. Every action taken on a file share translates to one or more transactions, and on standard shares that use the pay-as-you-go billing model, that translates to transaction costs.

There are five basic transaction categories: write, list, read, other, and delete. All operations done via the REST API or SMB are bucketed into one of these 4 categories as follows:

| Operation type | Write transactions | List transactions | Read transactions | Other transactions | Delete transactions |
|-|-|-|-|-|-|
| Management operations | <ul><li>`CreateShare`</li><li>`SetFileServiceProperties`</li><li>`SetShareMetadata`</li><li>`SetShareProperties`</li></ul> | <ul><li>`ListShares`</li></ul> | <ul><li>`GetFileServiceProperties`</li><li>`GetShareAcl`</li><li>`GetShareMetadata`</li><li>`GetShareProperties`</li><li>`GetShareStats`</li></ul> | | <ul><li>`DeleteShare`</li></ul> |
| Data operations | <ul><li>`CopyFile`</li><li>`Create`</li><li>`CreateDirectory`</li><li>`CreateFile`</li><li>`PutRange`</li><li>`PutRangeFromURL`</li><li>`SetDirectoryMetadata`</li><li>`SetFileMetadata`</li><li>`SetFileProperties`</li><li>`SetInfo`</li><li>`SetShareACL`</li><li>`Write`</li><li>`PutFilePermission`</li></ul> | <ul><li>`ListFileRanges`</li><li>`ListFiles`</li><li>`ListHandles`</li></ul>  | <ul><li>`FilePreflightRequest`</li><li>`GetDirectoryMetadata`</li><li>`GetDirectoryProperties`</li><li>`GetFile`</li><li>`GetFileCopyInformation`</li><li>`GetFileMetadata`</li><li>`GetFileProperties`</li><li>`QueryDirectory`</li><li>`QueryInfo`</li><li>`Read`</li><li>`GetFilePermission`</li></ul> | <ul><li>`AbortCopyFile`</li><li>`Cancel`</li><li>`ChangeNotify`</li><li>`Close`</li><li>`Echo`</li><li>`Ioctl`</li><li>`Lock`</li><li>`Logoff`</li><li>`Negotiate`</li><li>`OplockBreak`</li><li>`SessionSetup`</li><li>`TreeConnect`</li><li>`TreeDisconnect`</li><li>`CloseHandles`</li><li>`AcquireFileLease`</li><li>`BreakFileLease`</li><li>`ChangeFileLease`</li><li>`ReleaseFileLease`</li></ul> | <ul><li>`ClearRange`</li><li>`DeleteDirectory`</li></li>`DeleteFile`</li></ul> |

> [!Note]  
> NFS 4.1 is only available for premium file shares, which use the provisioned billing model, transactions do not affect billing for premium file shares.

## See also
- [Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).
- [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md).
- [Create a file share](storage-how-to-create-file-share.md) and [Deploy Azure File Sync](../file-sync/file-sync-deployment-guide.md).