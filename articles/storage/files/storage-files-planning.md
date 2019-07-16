---
title: Planning for an Azure Files deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
services: storage
author: roygara
ms.service: storage
ms.topic: article
ms.date: 04/25/2019
ms.author: rogarana
ms.subservice: files
---

# Planning for an Azure Files deployment

[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. Because Azure Files is fully managed, deploying it in production scenarios is much easier than deploying and managing a file server or NAS device. This article addresses the topics to consider when deploying an Azure file share for production use within your organization.

## Management concepts

 The following diagram illustrates the Azure Files management constructs:

![File Structure](./media/storage-files-introduction/files-concepts.png)

* **Storage Account**: All access to Azure Storage is done through a storage account. See [Scalability and Performance Targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for details about storage account capacity.

* **Share**: A File Storage share is an SMB file share in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the 5 TiB total capacity of the file share.

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
* Optional requirement of encrypted data in-transit: when selected, Azure Files rejects access the data over unencrypted channels. Specifically, only HTTPS and SMB 3.0 with encryption connections are allowed.

    > [!Important]  
    > Requiring secure transfer of data will cause older SMB clients not capable of communicating with SMB 3.0 with encryption to fail. For more information, see [Mount on Windows](storage-how-to-use-files-windows.md), [Mount on Linux](storage-how-to-use-files-linux.md), and [Mount on macOS](storage-how-to-use-files-mac.md).

For maximum security, we strongly recommend always enabling both encryption at-rest and enabling encryption of data in-transit whenever you are using modern clients to access your data. For example, if you need to mount a share on a Windows Server 2008 R2 VM, which only supports SMB 2.1, you need to allow unencrypted traffic to your storage account since SMB 2.1 does not support encryption.

If you are using Azure File Sync to access your Azure file share, we will always use HTTPS and SMB 3.0 with encryption to sync your data to your Windows Servers, regardless of whether you require encryption of data at-rest.

## File share performance tiers

Azure Files offers two performance tiers: standard and premium.

### Standard file shares

Standard file shares are backed by hard disk drives (HDDs). Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.

Standard file shares up to 5 TiB in size are available as a GA offering. While larger file shares, which are any shares larger than 5 TiB, up to a maximum of 100 TiB, are currently available as a preview offering.

> [!IMPORTANT]
> See the [Onboard to larger file shares (standard tier)](#onboard-to-larger-file-shares-standard-tier) section for steps to onboard, as well as the scope and restrictions of the preview.

### Premium file shares

Premium file shares are backed by solid-state drives (SSDs). Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. This makes them suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares are only available in a provisioned billing model. Premium file shares use a deployment model separate from standard file shares.

Azure Backup is available for premium file shares and Azure Kubernetes Service supports premium file shares in version 1.13 and above.

If you'd like to learn how to create a premium file share, see our article on the subject: [How to create an Azure premium file storage account](storage-how-to-create-premium-fileshare.md).

Currently, you cannot directly convert between a standard file share and a premium file share. If you would like to switch to either tier, you must create a new file share in that tier and manually copy the data from your original share to the new share you created. You can do this using any of the Azure Files supported copy tools, such as Robocopy or AzCopy.

> [!IMPORTANT]
> Premium file shares are only available with LRS and are available in most regions that offer storage accounts. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure.

### Provisioned shares

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

Share size can be increased at any time but can be decreased only after 24 hours since the last increase. After waiting for 24 hours without a size increase, you can decrease the share size as many times as you like, until you increase it again. IOPS/Throughput scale changes will be effective within a few minutes after the size change.

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
> File shares performance is subject to machine network limits, available network bandwidth, IO sizes, parallelism, among many other factors. To achieve maximum performance scale, spread the load across multiple VMs. Please refer [troubleshooting guide](storage-troubleshooting-files-performance.md) for some common performance issues and workarounds.

### Bursting

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

Azure Files standard shares support three data redundancy options: locally redundant storage (LRS), zone redundant storage (ZRS), and geo-redundant storage (GRS).

Azure Files premium shares only support locally redundant storage (LRS).

The following sections describe the differences between the different redundancy options:

### Locally redundant storage

[!INCLUDE [storage-common-redundancy-LRS](../../../includes/storage-common-redundancy-LRS.md)]

### Zone redundant storage

[!INCLUDE [storage-common-redundancy-ZRS](../../../includes/storage-common-redundancy-ZRS.md)]

### Geo-redundant storage

> [!Warning]  
> If you are using your Azure file share as a cloud endpoint in a GRS storage account, you shouldn't initiate storage account failover. Doing so will cause sync to stop working and may also cause unexpected data loss in the case of newly tiered files. In the case of loss of an Azure region, Microsoft will trigger the storage account failover in a way that is compatible with Azure File Sync.

Geo-redundant storage (GRS) is designed to provide at least 99.99999999999999% (16 9's) durability of objects over a given year by replicating your data to a secondary region that is hundreds of miles away from the primary region. If your storage account has GRS enabled, then your data is durable even in the case of a complete regional outage or a disaster in which the primary region isn't recoverable.

If you opt for read-access geo-redundant storage (RA-GRS), you should know that Azure File does not support read-access geo-redundant storage (RA-GRS) in any region at this time. File shares in the RA-GRS storage account work like they would in GRS accounts and are charged GRS prices.

GRS replicates your data to another data center in a secondary region, but that data is available to be read only if Microsoft initiates a failover from the primary to secondary region.

For a storage account with GRS enabled, all data is first replicated with locally redundant storage (LRS). An update is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region using GRS. When data is written to the secondary location, it's also replicated within that location using LRS.

Both the primary and secondary regions manage replicas across separate fault domains and upgrade domains within a storage scale unit. The storage scale unit is the basic replication unit within the datacenter. Replication at this level is provided by LRS; for more information, see [Locally redundant storage (LRS): Low-cost data redundancy for Azure Storage](../common/storage-redundancy-lrs.md).

Keep these points in mind when deciding which replication option to use:

* Zone-redundant storage (ZRS) provides highly availability with synchronous replication and may be a better choice for some scenarios than GRS. For more information on ZRS, see [ZRS](../common/storage-redundancy-zrs.md).
* Asynchronous replication involves a delay from the time that data is written to the primary region, to when it is replicated to the secondary region. In the event of a regional disaster, changes that haven't yet been replicated to the secondary region may be lost if that data can't be recovered from the primary region.
* With GRS, the replica isn't available for read or write access unless Microsoft initiates a failover to the secondary region. In the case of a failover, you'll have read and write access to that data after the failover has completed. For more information, please see [Disaster recovery guidance](../common/storage-disaster-recovery-guidance.md).

## Onboard to larger file shares (standard tier)

This section only applies to the standard file shares. All premium file shares are available with 100 TiB as a GA offering.

### Restrictions

- Requires you to create a new general purpose storage account (cannot expand existing storage accounts).
- LRS/ZRS to GRS account conversion will not be possible on any new storage account created after the subscription is accepted to the larger file shares preview.

### Regional availability

Standard file shares are available in all regions up to 5 TiB. In certain regions, it is available with a 100 TiB limit, those regions are listed in the following table:

|Region  |Supported redundancy  |Supports existing storage accounts  |
|---------|---------|---------|
|SouthEast Asia     |LRS|No         |
|West Europe     |LRS|No         |
|West US 2     |LRS, ZRS|No         |

To help us prioritize new regions and features, please fill out this [survey](https://aka.ms/azurefilesatscalesurvey).

### Steps to onboard

To enroll your subscription to the larger file shares preview, you need to use Azure PowerShell. You can either use [Azure Cloud Shell](https://shell.azure.com/) or install the [Azure PowerShell module locally](https://docs.microsoft.com/powershell/azure/install-Az-ps?view=azps-2.4.0) to run the following PowerShell commands:

First, make sure the subscription you want to enroll in the preview is selected:

```powershell
$context = Get-AzSubscription -SubscriptionId ...
Set-AzContext $context
```

Then, enroll in the preview using the following commands:

```powershell
Register-AzProviderFeature -FeatureName AllowLargeFileShares -ProviderNamespace Microsoft.Storage
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```
Your subscription is automatically approved once both commands are run.

To verify your registration status, you can run the following command:

```powershell
Get-AzProviderFeature -FeatureName AllowLargeFileShares -ProviderNamespace Microsoft.Storage
```

It may take up to 15 minutes for your status to update to **registered**. Once your status is **registered**, you should be able to use the feature.

### Use larger file shares

To begin using larger file shares, create a new general purpose v2 storage account and a new file share.

## Data growth pattern

Today, the maximum size for an Azure file share is 5 TiB (100 TiB in preview). Because of this current limitation, you must consider the expected data growth when deploying an Azure file share.

It is possible to sync multiple Azure file shares to a single Windows File Server with Azure File Sync. This allows you to ensure that older, large file shares that you may have on-premises can be brought into Azure File Sync. For more information, see [Planning for an Azure File Sync Deployment](storage-files-planning.md).

## Data transfer method

There are many easy options to bulk transfer data from an existing file share, such as an on-premises file share, into Azure Files. A few popular ones include (non-exhaustive list):

* **Azure File Sync**: As part of a first sync between an Azure file share (a "Cloud Endpoint") and a Windows directory namespace (a "Server Endpoint"), Azure File Sync will replicate all data from the existing file share to Azure Files.
* **[Azure Import/Export](../common/storage-import-export-service.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: The Azure Import/Export service allows you to securely transfer large amounts of data into an Azure file share by shipping hard disk drives to an Azure datacenter. 
* **[Robocopy](https://technet.microsoft.com/library/cc733145.aspx)**: Robocopy is a well known copy tool that ships with Windows and Windows Server. Robocopy may be used to transfer data into Azure Files by mounting the file share locally, and then using the mounted location as the destination in the Robocopy command.
* **[AzCopy](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: AzCopy is a command-line utility designed for copying data to and from Azure Files, as well as Azure Blob storage, using simple commands with optimal performance.

## Next steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
* [Deploying Azure Files](storage-files-deployment-guide.md)
* [Deploying Azure File Sync](storage-sync-files-deployment-guide.md)
