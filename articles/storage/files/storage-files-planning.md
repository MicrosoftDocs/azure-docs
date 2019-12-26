---
title: Planning for an Azure Files deployment | Microsoft Docs
description: Learn what to consider when planning for an Azure Files deployment.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 1/3/2020
ms.author: rogarana
ms.subservice: files
---

# Planning for an Azure Files deployment
[Azure Files](storage-files-introduction.md) can be deployed in two main ways: by directly mounting the serverless Azure file shares or by caching Azure file shares on-premises using Azure File Sync. Which deployment option you choose changes the things you need to consider as you plan for your deployment. 

1. **Direct mount of an Azure file share**: Since Azure Files provides SMB access, you can mount Azure file shares on-premises or in the cloud using the standard SMB client available in Windows, macOS, and Linux. Because Azure file shares are serverless, deploying for production scenarios does not require managing a file server or NAS device. This means you don't have to apply software patches or swap physical disks out. 

2. **Cache Azure file share on-premises with Azure File Sync**: Azure File Sync enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server into a quick cache of your Azure file share. 

This article primarily addresses deployment considerations for deploying an Azure file share to be directly mounted by an on-premises or cloud client. To plan for an Azure File Sync deployment, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md).

## Management concepts
Azure file shares are deployed into *storage accounts*, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares, as well as other storage resources such as blob containers, queues, or tables. All storage resources that are deployed into a storage account share the limits that apply to that storage account. To see the current limits for a storage account, see [Azure Files scalability and performance targets](storage-files-scale-targets.md).

There are two main types of storage accounts you will use for Azure Files deployments: 
- **General purpose version 2 (GPv2) storage accounts**: GPv2 storage accounts allow you to deploy Azure file shares on standard/hard disk-based (HDD-based) hardware. In addition to storing Azure file shares, GPv2 storage accounts can store other storage resources such as blob containers, queues, or tables. 
- **FileStorage storage accounts**: FileStorage storage accounts allow you to deploy Azure file shares on premium/solid-state disk-based (SSD-based) hardware. FileStorage accounts can only be used to store Azure file shares; no other storage resources (blob containers, queues, tables, etc.) can be deployed in a FileStorage account.

There are several other storage account types you may come across in the Azure Portal, PowerShell, or CLI. Two storage account types, BlockBlobStorage and BlobStorage storage accounts, cannot contain Azure file shares. The other two storage account types you may see are general purpose version 1 (GPv1) and classic storage accounts, both of which can contain Azure file shares. Although GPv1 and classic storage accounts may contain Azure file shares, most new features of Azure Files are available only in GPv2 and FileStorage storage accounts. We therefore recommend to only use GPv2 and FileStorage storage accounts for new deployments, and to upgrade GPv1 and classic storage accounts if they already exist in your environment.  

When deploying Azure file shares into storage accounts, we recommend:

1. Only deploying Azure file shares into storage accounts with other Azure file shares. Although GPv2 storage accounts allow you to have mixed purpose storage accounts, since storage resources such as Azure file shares and blob containers share the storage account's limits, mixing resources together may make it more difficult to troubleshoot performance issues later on. 

2. Paying attention to a storage accounts IOPS limitations when deploying Azure file shares. Ideally, you would map file shares 1:1 with storage accounts, however this may not always be possible due to various limits and restrictions, both from your organization and from Azure. When it is not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

3. Only deploy GPv2 and FileStorage accounts and upgrade GPv1 and classic storage accounts when you find them in your environment. 

## Identity
To access an Azure file share, the user of the file share must be authenticated and and have authorization to access the share. This is done based on the identity of the user accessing the file share. Azure Files integrates with three main identity providers:
- **Customer-owned Active Directory** (preview): Azure storage accounts can be domain joined to a customer-owned, Windows Server Active Directory, just like a Windows Server file server or NAS device. Your Active Directory Domain Controller can deployed on-premises, in an Azure VM, or even as a VM in another cloud provider; Azure Files is agnostic to where your DC is hosted. Once a storage account is domain joined, the end-user can mount a file share with the user account they signed into their PC with. AD-based authentication uses the Kerberos authentication protocol.
- **Azure Active Directory Domain Services (Azure AD DS)**: Azure AD DS provides a Microsoft-managed Active Directory Domain Controller that can be used for Azure resources. Domain joining your storage account to Azure AD DS provides similar benefits to domain joining it to a customer-owned Active Directory. This deployment option is most useful for application lift-and-shift scenarios that require AD-based permissions. Since Azure AD DS provides AD-based authentication, this option also uses the Kerberos authentication protocol.
- **Azure storage account key**: Azure file shares may also be mounted with an Azure storage account key. To mount a file share this way, the storage account name is used as the username and the storage account key is used as a password. Using the storage account key to mount the Azure file share is effectively an administrator operation, since the mounted file share will have full permissions to all of the files and folders on the share, even if they have ACLs. When using the storage account key to mount over SMB, the NTLMv2 authentication protocol is used.

For customers migrating from on-premises file servers, or creating new file shares in Azure Files intended to behave like Windows file servers or NAS appliances, domain joining your storage account to **Customer-owned Active Directory** is the recommended option. To learn more about domain joining your storage account to a customer-owned Active Directory, see [Azure Files Active Directory overview](storage-files-active-directory-overview.md).

If you intend to use the storage account key to access your Azure file shares, we recommend using service endpoints as described in the [Networking](#networking) section.

## Networking
By default, Azure services including Azure Files can be accessed over the internet. Since by default traffic to your storage account is encrypted (and SMB 2.1 mounts are never allowed outside of an Azure region), there is nothing inherently insecure about accessing your Azure file shares over the internet. Based on your organization's policy or unique regulatory requirements, you may require more restrictive communication with Azure, and therefore Azure provides several ways to restrict how traffic from outside of Azure gets to Azure Files. For example, many organizations and internet service providers (ISPs) block port 445 outbound, the port used by SMB to communicate.

Based on the commonality of customer requirements to restrict access at the network level (in addition to the identity level as described above), most customers will need to combine the following Azure networking features to deploy Azure Files within their organization:

- **Service endpoints**: Service endpoints provide a method for restricting traffic to your storage account to within a virtual network. Mount requests coming from outside the virtual network boundary (excluding requests tunneled into the virtual network) are rejected, even if the user/application performing the mount has otherwise valid credentials.
- **Private endpoints**: Private endpoints give your storage account a dedicated IP address from within the address space of the virtual network. This enables network tunneling without needing to open on-premises networks up to all the of the IP address ranges owned by the Azure storage clusters. 
- **Network tunneling using ExpressRoute, Site-to-Site, or Point-to-Site VPN**: Tunneling into a virtual network allows accessing Azure file shares from on-premises, even if port 445 is blocked.

To plan for the networking associated with deploying an Azure file share, see [Azure Files networking considerations](storage-files-networking-overview.md).

## Encryption
Azure Files supports two different types of encryption: encryption in transit, which relates to the encryption used when mounting/accessing the Azure file share, and encryption at rest, which relates to how the data is encrypted when it is stored on disk. 

### Encryption in transit
By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files will only allow the connection if it is made with SMB 3.0+ with encryption or HTTPS. Clients that do not support SMB 3.0 or clients that support SMB 3.0 but not SMB encryption will not be able to mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.0 with encryption, see our detailed documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.  

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1, SMB 3.0 without encryption, and un-encrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, will not be able to access the file share.

We strongly recommend ensuring encryption of data in-transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Encryption at rest
All data stored in Azure Files is encrypted at rest. This functionality works similarly to how BitLocker works on-premises; data is encrypted beneath the file system level. This means that when you read the data, you don't have to have access to the underlying key to decrypt it at the client side.

By default, data stored in Azure Files is encrypted with Microsoft-managed keys. This means that Microsoft holds the keys to encrypt/decrypt the data, and is responsible for rotating them on a regular basis. You can also choose to manage your own keys, which gives you control over the rotation process. If you choose to encrypt your file shares with customer-managed keys, Azure Files is authorized to access your keys to fulfill read and write requests from your clients. With customer-managed keys, you can revoke this authorization at any time, but this means that your Azure file share will no longer be accessible via SMB or the FileREST API.

Azure Files uses the same encryption scheme as the other Azure storage services such as Azure Blob storage. To learn more about Azure storage service encryption (SSE), see [Azure storage encryption for data at rest](../common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

## Storage tiers
Azure Files offers two different tiers of storage, premium and standard, to allow you to tailor your shares to the performance and price requirements of your scenario:

- **Premium file shares**: Premium file shares are backed by solid-state drives (SSDs) and are deployed in the **FileStorage storage account** type. Premium file shares provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads. This makes them suitable for a wide variety of workloads like databases, web site hosting, and development environments. Premium file shares are only available in a provisioned billing model. For more information on the provisioned billing model for premium file shares, see [Understanding provisioning for premium file shares](#understanding-provisoning-for-premium-file-shares).
- **Standard file shares**: Standard file shares are backed by hard disk drives (HDDs) and are deployed in the **general purpose version 2 (GPv2) storage account** type. Standard file shares provide reliable performance for IO workloads that are less sensitive to performance variability such as general-purpose file shares and dev/test environments. Standard file shares are only available in a pay-as-you-go billing model.

In general, Azure Files features and interoperability with other services are the same between premium file shares and standard file shares, however there are a few important differences:
- **Billing model**
    - Premium file shares are billed using a provisioned billing model, which means you pay for how much storage you provision rather than how much storage you actually ask for. 
    - Standard file shares are billed using a pay-as-you-go model, which includes a base cost of storage for how much storage you're actually consuming and then an additional transaction cost based on how you use the share. With standard file shares, your bill will increase if you use (read/write/mount) the Azure file share more.
- **Redundancy options**
    - Premium file shares are only available for locally redundant (LRS) and zone redundant (ZRS) storage. 
    - Standard file shares are available for locally redundant, zone redundant, geo-redundant (GRS), and geo-zone redundant (GZRS) storage.
- **Maximum size of file share**
    - Premium file shares can be provisioned for up to 100 TiB without any additional work.
    - By default, standard file shares can span only up to 5 TiB, although the share limit can be increased to 100 TiB by opting into the *large file share* storage account feature flag. Standard file shares may only span up to 100 TiB for locally redundant or zone redundant storage accounts. For more information on increasing  
- **Regional availability**
    - Premium file shares are not available in every region, and zone redundant support is available in a smaller subset of regions. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure. To find out what regions support ZRS, see [Support coverage and regional availability](../common/storage-redundancy-zrs.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#support-coverage-and-regional-availability). To help us prioritize new regions and premium tier features, please fill out this [survey](https://aka.ms/pfsfeedback).
    - Standard file shares are available in every Azure region.
- Azure Kubernetes Service (AKS) supports premium file shares in version 1.13 and later.

Once a file share is created as either a premium or a standard file share, you cannot automatically convert it to the other tier. If you would like to switch to the other tier, you must create a new file share in that tier and manually copy the data from your original share to the new share you created. We recommend using `robocopy` for Windows or `rsync` for macOS and Linux to perform that copy.

### Understanding provisioning for premium file shares
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

### Enable standard file shares to span up to 100 TiB
By default, standard file shares can span only up to 5 TiB, although the share limit can be increased to 100 TiB. To do this, *large file share* feature must be enabled at the storage account-level. Enabling this flag is only required for standard file shares; all premium file shares are already enabled for provisioning up to the full 100 TiB capacity.

You can enable large file shares when you create a new storage account or on an existing storage account, however this can only be done on a locally redundant or zone redundant storage account. Note that enabling the large file share feature on a locally redundant or zone redundant storage account also disables the ability to convert the storage account to geo-redundant or geo-zone-redundant storage in the future.

You can learn more about how to enable large file shares on a new storage account by following the steps in the [creating an Azure file share](storage-how-to-create-file-share.md) how to guide. To enable large file shares on an existing storage account, navigate to the **Configuration** view in the storage account's table of contents, and switch the large file share rocker switch to enabled:

![A screenshot of the enable large file share rocker switch in the Azure portal](media/storage-files-planning/enable-LFS-1.png)

This can also be done through the [`Set-AzStorageAccount`](https://docs.microsoft.com/powershell/module/az.storage/set-azstorageaccount) PowerShell cmdlet and the [`az storage account update`](https://docs.microsoft.com/cli/azure/storage/account#az-storage-account-update) Azure CLI command.

#### Regional availability
Standard file shares with 100 TiB capacity limit are available globally in all Azure regions, except:

- Locally redundant storage: All regions, except for South Africa North, South Africa West, Germany West Central, and Germany North.
- Zone redundant storage: Supported for all regions where Zone redundant storage is supported, except for Japan East, North Europe, South Africa North.
- GRS/GZRS: Not supported.

## Redundancy
To protect your data against data loss or corruption, all Azure file shares store multiple copies of each file as they are written. Depending on the requirements of your workload, you can select additional degrees of redundancy. Azure Files currently supports the following data redundancy options:

- **Locally redundant**: Locally redundant storage, often referred to as LRS, means that every file is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive.
- **Zone redundant**: Zone redundant storage, often referred to as ZRS, means that every file is stored three times across three distinct Azure storage cluster. The three distinct Azure storage clusters each store the file three times, just like with locally redundant storage, and are physically isolated in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. A write to storage is not accepted until it is written to the storage clusters in all three availability zones. This means that zone redundant storage provides 9 copies of your data within a given Azure region.
- **Geo-redundant**: Geo-redundant storage, often referred to as GRS, is like locally redundant storage, in that a file is stored three times within an Azure storage cluster in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. This means that geo-redundant storage provides 6 copies of your data spread between two Azure regions. In the event of a major disaster such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft will perform a failover so that the secondary in effect becomes the primary, serving all operations. Since the replication between the primary and secondary regions are asynchronous, in the event of a major disaster, data not yet replicated to the secondary region will be lost. You can also perform a manual failover of a geo-redundant storage account.
- **GeoZone redundant**: Geo-zone-redundant storage, often referred to as GZRS, is like zone redundant storage, in that a file is stored nine times across 3 distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. This means that geo-zone-redundant storage provides 18 copies of your data spread between three availability zones in the primary region and three availability zones in the secondary region. The failover process for geo-zone-redundant storage works the same as it does for geo-redundant storage.

Standard Azure file shares support all four redundancy types, while premium Azure file shares only support locally redundant and zone redundant storage.

General purpose version 2 (GPv2) storage accounts provide two additional redundancy options that are not supported by Azure Files: read accessible geo-redundant storage, often referred to as RA-GRS, and read accessible geo-zone-redundant storage, often referred to as RA-GZRS. You can provision Azure file shares in storage accounts with these options set, however the Azure file share will not be read accessible in the secondary region and will be billed as geo-redundant or geo-zone-redundant storage, respectively.

## Migration
In many cases, you will not be establishing a net new file share for your organization, but instead migrating an existing file share from an on-premises file server or NAS device to Azure Files. There are many tools, provided both by Microsoft and 3rd parties, to do a migration to a file share, but they can roughly be divided into two categories:

- **Tools which maintain file system attributes such as ACLs and timestamps**:
    - **[Azure File Sync](storage-sync-files-planning.md)**: Azure File Sync can be used as a method to ingest data into an Azure file share, even when the desired end deployment isn't to maintain an on-premises presence. Azure File Sync can be installed in place on existing Windows Server 2012 R2, Windows Server 2016, and Windows Server 2019 deployments. An advantage to using Azure File Sync as an ingest mechanism is that end-users can continue to use the existing file share in place; cut-over to the Azure file share can occur after all of the data is finished uploading in the background.
    - **[Robocopy](https://technet.microsoft.com/library/cc733145.aspx)**: Robocopy is a well known copy tool that ships with Windows and Windows Server. Robocopy may be used to transfer data into Azure Files by mounting the file share locally, and then using the mounted location as the destination in the Robocopy command.

- **Tools which do not maintain file system attributes**:
    - **Data Box**: Data Box provides an offline data transfer mechanism to physical ship data into Azure. This method is designed to increase throughput and save bandwidth, but does not currently support file system attributes like timestamps and ACLs.
    - **[AzCopy](../common/storage-use-azcopy-v10.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)**: AzCopy is a command-line utility designed for copying data to and from Azure Files, as well as Azure Blob storage, using simple commands with optimal performance.

## Next steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
* [Deploying Azure Files](storage-files-deployment-guide.md)
* [Deploying Azure File Sync](storage-sync-files-deployment-guide.md)