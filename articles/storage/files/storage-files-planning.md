---
title: Planning for an Azure Files deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: rogarana
ms.subservice: files
---

# Planning for an Azure Files deployment

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. Because Azure Files is fully managed, deploying it in production scenarios is much easier than deploying and managing a file server or NAS device. This article addresses the topics to consider when deploying an Azure file share for production use within your organization.

## Management concepts

 The following diagram illustrates the Azure Files management constructs:

![File Structure](./media/storage-files-introduction/files-concepts.png)

* **Storage Account**: All access to Azure Storage is done through a storage account. See [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for details about storage account capacity.

* **Share**: A File Storage share is an SMB file share in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares and a share can store an unlimited number of files, up to the total capacity of the file share. The total capacity for premium and standard file shares is 100 TiB.

* **Directory**: An optional hierarchy of directories.

* **File**: A file in the share. A file may be up to 1 TiB in size.

* **URL format**: For requests to an Azure file share made with the File REST protocol, files are addressable using the following URL format:

    ```
    https://<storage account>.file.core.windows.net/<share>/<directory>/<file>
    ```

## Data access method

Azure Files offers two, built-in, convenient data access methods that you can use separately, or in combination with each other, to access your data:

1. **Direct cloud access**: Any Azure file share can be mounted by [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and/or [Linux](storage-how-to-use-files-linux.md) with the industry standard Server Message Block (SMB) protocol or via the File REST API. With SMB, reads and writes to files on the share are made directly on the file share in Azure. To mount by a VM in Azure, the SMB client in the OS must support at least SMB 2.1. To mount on-premises, such as on a user's workstation, the SMB client supported by the workstation must support at least SMB 3.0 (with encryption). In addition to SMB, new applications or services may directly access the file share via File REST, which provides an easy and scalable application programming interface for software development.
2. **Azure File Sync**: With Azure File Sync, shares can be replicated to Windows Servers on-premises or in Azure. Your users would access the file share through the Windows Server, such as through an SMB or NFS share. This is useful for scenarios in which data will be accessed and modified far away from an Azure datacenter, such as in a branch office scenario. Data may be replicated between multiple Windows Server endpoints, such as between multiple branch offices. Finally, data may be tiered to Azure Files, such that all data is still accessible via the Server, but the Server does not have a full copy of the data. Rather, data is seamlessly recalled when opened by your user.

The following table illustrates how your users and applications can access your Azure file share:

| | Direct cloud access | Azure File Sync |
|------------------------|------------|-----------------|
| What protocols do you need to use? | Azure Files supports SMB 2.1, SMB 3.0, and File REST API. | Access your Azure file share via any supported protocol on Windows Server (SMB, NFS, FTPS, etc.) |  
| Where are you running your workload? | **In Azure**: Azure Files offers direct access to your data. | **On-premises with slow network**: Windows, Linux, and macOS clients can mount a local on-premises Windows File share as a fast cache of your Azure file share. |
| What level of ACLs do you need? | Share and file level. | Share, file, and user level. |

## Data security

Azure Files has several built-in options for ensuring data security:

* Support for encryption in both over-the-wire protocols: SMB 3.0 encryption and File REST over HTTPS. By default: 
    * Clients that support SMB 3.0 encryption send and receive data over an encrypted channel.
    * Clients that do not support SMB 3.0 with encryption can communicate intra-datacenter over SMB 2.1 or SMB 3.0 without encryption. SMB clients are not allowed to communicate inter-datacenter over SMB 2.1 or SMB 3.0 without encryption.
    * Clients can communicate over File REST with either HTTP or HTTPS.
* Encryption at-rest ([Azure Storage Service Encryption](../common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)): Storage Service Encryption (SSE) is enabled for all storage accounts. Data at-rest is encrypted with fully-managed keys. Encryption at-rest does not increase storage costs or reduce performance. 
* Optional requirement of encrypted data in-transit: when selected, Azure Files rejects access to the data over unencrypted channels. Specifically, only HTTPS and SMB 3.0 with encryption connections are allowed.

    > [!Important]  
    > Requiring secure transfer of data will cause older SMB clients not capable of communicating with SMB 3.0 with encryption to fail. For more information, see [Mount on Windows](storage-how-to-use-files-windows.md), [Mount on Linux](storage-how-to-use-files-linux.md), and [Mount on macOS](storage-how-to-use-files-mac.md).

For maximum security, we strongly recommend always enabling both encryption at-rest and enabling encryption of data in-transit whenever you are using modern clients to access your data. For example, if you need to mount a share on a Windows Server 2008 R2 VM, which only supports SMB 2.1, you need to allow unencrypted traffic to your storage account since SMB 2.1 does not support encryption.

If you are using Azure File Sync to access your Azure file share, we will always use HTTPS and SMB 3.0 with encryption to sync your data to your Windows Servers, regardless of whether you require encryption of data at-rest.

## File share performance tiers

Azure Files offers two performance tiers: standard and premium.

### Standard file shares

Standard file shares are backed by hard disk drives (HDDs). Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.

> [!IMPORTANT]
> If you want to use file shares larger than 5 TiB, see the [Onboard to larger file shares (standard tier)](#onboard-to-larger-file-shares-standard-tier) section for steps to onboard, as well as regional availability and restrictions.

### Premium file shares

Premium file shares are backed by solid-state drives (SSDs). Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. This makes them suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares are only available in a provisioned billing model. Premium file shares use a deployment model separate from standard file shares.

Azure Backup is available for premium file shares and Azure Kubernetes Service supports premium file shares in version 1.13 and above.

If you'd like to learn how to create a premium file share, see our article on the subject: [How to create an Azure premium file storage account](storage-how-to-create-premium-fileshare.md).

Currently, you cannot directly convert between a standard file share and a premium file share. If you would like to switch to either tier, you must create a new file share in that tier and manually copy the data from your original share to the new share you created. You can do this using any of the Azure Files supported copy tools, such as Robocopy or AzCopy.

> [!IMPORTANT]
> Premium file shares are available with LRS in most regions that offer storage accounts and with ZRS in a smaller subset of regions. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure. For information about regions that support ZRS, see [Azure Storage redundancy](../common/storage-redundancy.md).
>
> To help us prioritize new regions and premium tier features, please fill out this [survey](https://aka.ms/pfsfeedback).

#### Provisioned shares

Premium file shares are provisioned based on a fixed GiB/IOPS/throughput ratio. For each GiB provisioned, the share will be issued one IOPS and 0.1 MiB/s throughput up to the max limits per share. The minimum allowed provisioning is 100 GiB with min IOPS/throughput.

On a best effort basis, all shares can burst up to three IOPS per GiB of provisioned storage for 60 minutes or longer depending on the size of the share. New shares start with the full burst credit based on the provisioned capacity.

Shares must be provisioned in 1 GiB increments. Minimum size is 100 GiB, next size is 101 GiB and so on.

> [!TIP]
> Baseline IOPS = 1 * provisioned GiB. (Up to a max of 100,000 IOPS).
>
> Burst Limit = 3 * Baseline IOPS. (Up to a max of 100,000 IOPS).
>
> egress rate = 60 MiB/s + 0.06 * provisioned GiB
>
> ingress rate = 40 MiB/s + 0.04 * provisioned GiB

Provisioned share size is specified by share quota. Share quota can be increased at any time but can be decreased only after 24 hours since the last increase. After waiting for 24 hours without a quota increase, you can decrease the share quota as many times as you like, until you increase it again. IOPS/Throughput scale changes will be effective within a few minutes after the size change.

It is possible to decrease the size of your provisioned share below your used GiB. If you do this, you will not lose data but, you will still be billed for the size used and receive the performance (baseline IOPS, throughput, and burst IOPS) of the provisioned share, not the size used.

The following table illustrates a few examples of these formulae for the provisioned share sizes:

|Capacity (GiB) | Baseline IOPS | Burst IOPS | Egress (MiB/s) | Ingress (MiB/s) |
|---------|---------|---------|---------|---------|
|100         | 100     | Up to 300     | 66   | 44   |
|500         | 500     | Up to 1,500   | 90   | 60   |
|1,024       | 1,024   | Up to 3,072   | 122   | 81   |
|5,120       | 5,120   | Up to 15,360  | 368   | 245   |
|10,240      | 10,240  | Up to 30,720  | 675 | 450   |
|33,792      | 33,792  | Up to 100,000 | 2,088 | 1,392   |
|51,200      | 51,200  | Up to 100,000 | 3,132 | 2,088   |
|102,400     | 100,000 | Up to 100,000 | 6,204 | 4,136   |

> [!NOTE]
> File shares performance is subject to machine network limits, available network bandwidth, IO sizes, parallelism, among many other factors. For example, based on internal testing with 8 KiB read/write IO sizes, a single Windows virtual machine, *Standard F16s_v2*, connected to premium file share over SMB could achieve 20K read IOPS and 15K write IOPS. With 512 MiB read/write IO sizes, the same VM could achieve 1.1 GiB/s egress and 370 MiB/s ingress throughput. To achieve maximum performance scale, spread the load across multiple VMs. Please refer [troubleshooting guide](storage-troubleshooting-files-performance.md) for some common performance issues and workarounds.

#### Bursting

Premium file shares can burst their IOPS up to a factor of three. Bursting is automated and operates based on a credit system. Bursting works on a best effort basis and the burst limit is not a guarantee, file shares can burst *up to* the limit.

Credits accumulate in a burst bucket whenever traffic for your file share is below baseline IOPS. For example, a 100 GiB share has 100 baseline IOPS. If actual traffic on the share was 40 IOPS for a specific 1-second interval, then the 60 unused IOPS are credited to a burst bucket. These credits will then be used later when operations would exceed the baseline IOPs.

> [!TIP]
> Size of the burst bucket = Baseline IOPS * 2 * 3600.

Whenever a share exceeds the baseline IOPS and has credits in a burst bucket, it will burst. Shares can continue to burst as long as credits are remaining, though shares smaller than 50 TiB will only stay at the burst limit for up to an hour. Shares larger than 50 TiB can technically exceed this one hour limit, up to two hours but, this is based on the number of burst credits accrued. Each IO beyond baseline IOPS consumes one credit and once all credits are consumed the share would return to baseline IOPS.

Share credits have three states:

- Accruing, when the file share is using less than the baseline IOPS.
- Declining, when the file share is bursting.
- Remaining constant, when there are either no credits or baseline IOPS are in use.

New file shares start with the full number of credits in its burst bucket. Burst credits will not be accrued if the share IOPS fall below baseline IOPS due to throttling by the server.

## File share redundancy

[!INCLUDE [storage-common-redundancy-options](../../../includes/storage-common-redundancy-options.md)]

If you opt for read-access geo-redundant storage (RA-GRS), you should know that Azure File does not support read-access geo-redundant storage (RA-GRS) in any region at this time. File shares in the RA-GRS storage account work like they would in GRS accounts and are charged GRS prices.

> [!Warning]  
> If you are using your Azure file share as a cloud endpoint in a GRS storage account, you shouldn't initiate storage account failover. Doing so will cause sync to stop working and may also cause unexpected data loss in the case of newly tiered files. In the case of loss of an Azure region, Microsoft will trigger the storage account failover in a way that is compatible with Azure File Sync.

Azure Files premium shares support both LRS and ZRS, ZRS is currently available in a smaller subset of regions.

## Onboard to larger file shares (standard tier)

This section only applies to the standard file shares. All premium file shares are available with 100 TiB capacity.

### Restrictions

- LRS/ZRS to GRS/GZRS account conversion will not be possible for any storage account with large file shares enabled.

### Regional availability

Standard file shares with 100 TiB capacity limit are available globally in all Azure regions -

- LRS: All regions, except for South Africa North and South Africa West.
   - East US and West Europe: All new accounts are supported. A small number of existing accounts have not completed the upgrade process. You can check if your existing storage accounts have completed the upgrade process by attempting to [Enable large file shares](storage-files-how-to-create-large-file-share.md).

- ZRS: All regions, except for Japan East, North Europe, South Africa North.
- GRS/GZRS: Not supported.

### Enable and create larger file shares

To begin using larger file shares, see our article [How to enable and create large file shares](storage-files-how-to-create-large-file-share.md).

## Data growth pattern

Today, the maximum size for an Azure file share is 100 TiB. Because of this current limitation, you must consider the expected data growth when deploying an Azure file share.

It is possible to sync multiple Azure file shares to a single Windows File Server with Azure File Sync. This allows you to ensure that older, large file shares that you may have on-premises can be brought into Azure File Sync. For more information, see [Planning for an Azure File Sync Deployment](storage-files-planning.md).

## Data transfer method

There are many easy options to bulk transfer data from an existing file share, such as an on-premises file share, into Azure Files. A few popular ones include (non-exhaustive list):

* **[Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning)**: As part of a first sync between an Azure file share (a "Cloud Endpoint") and a Windows directory namespace (a "Server Endpoint"), Azure File Sync will replicate all data from the existing file share to Azure Files.
* **[Azure Import/Export](../common/storage-import-export-service.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: The Azure Import/Export service allows you to securely transfer large amounts of data into an Azure file share by shipping hard disk drives to an Azure datacenter. 
* **[Robocopy](https://technet.microsoft.com/library/cc733145.aspx)**: Robocopy is a well known copy tool that ships with Windows and Windows Server. Robocopy may be used to transfer data into Azure Files by mounting the file share locally, and then using the mounted location as the destination in the Robocopy command.
* **[AzCopy](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: AzCopy is a command-line utility designed for copying data to and from Azure Files, as well as Azure Blob storage, using simple commands with optimal performance.

## Next steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
* [Deploying Azure Files](storage-files-deployment-guide.md)
* [Deploying Azure File Sync](storage-sync-files-deployment-guide.md)
