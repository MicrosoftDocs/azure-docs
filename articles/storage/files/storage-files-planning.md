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

- **Direct mount of an Azure file share**: Since Azure Files provides SMB access, you can mount Azure file shares on-premises or in the cloud using the standard SMB client available in Windows, macOS, and Linux. Because Azure file shares are serverless, deploying for production scenarios does not require managing a file server or NAS device. This means you don't have to apply software patches or swap out physical disks. 

- **Cache Azure file share on-premises with Azure File Sync**: Azure File Sync enables you to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms an on-premises (or cloud) Windows Server into a quick cache of your Azure file share. 

This article primarily addresses deployment considerations for deploying an Azure file share to be directly mounted by an on-premises or cloud client. To plan for an Azure File Sync deployment, see [Planning for an Azure File Sync deployment](storage-sync-files-planning.md).

## Management concepts
[!INCLUDE [storage-files-file-share-management-concepts](../../../includes/storage-files-file-share-management-concepts.md)]

When deploying Azure file shares into storage accounts, we recommend:

- Only deploying Azure file shares into storage accounts with other Azure file shares. Although GPv2 storage accounts allow you to have mixed purpose storage accounts, since storage resources such as Azure file shares and blob containers share the storage account's limits, mixing resources together may make it more difficult to troubleshoot performance issues later on. 

- Paying attention to a storage account's IOPS limitations when deploying Azure file shares. Ideally, you would map file shares 1:1 with storage accounts, however this may not always be possible due to various limits and restrictions, both from your organization and from Azure. When it is not possible to have only one file share deployed in one storage account, consider which shares will be highly active and which shares will be less active to ensure that the hottest file shares don't get put in the same storage account together.

- Only deploy GPv2 and FileStorage accounts and upgrade GPv1 and classic storage accounts when you find them in your environment. 

## Identity
To access an Azure file share, the user of the file share must be authenticated and have authorization to access the share. This is done based on the identity of the user accessing the file share. Azure Files integrates with three main identity providers:
- **On-premises Active Directory Domain Services (AD DS, or on-premises AD DS)** (preview): Azure storage accounts can be domain joined to a customer-owned, Active Directory Domain Services, just like a Windows Server file server or NAS device. You can deploy a domain controller on-premises, in an Azure VM, or even as a VM in another cloud provider; Azure Files is agnostic to where your domain controller is hosted. Once a storage account is domain-joined, the end user can mount a file share with the user account they signed into their PC with. AD-based authentication uses the Kerberos authentication protocol.
- **Azure Active Directory Domain Services (Azure AD DS)**: Azure AD DS provides a Microsoft-managed domain controller that can be used for Azure resources. Domain joining your storage account to Azure AD DS provides similar benefits to domain joining it to a customer-owned Active Directory. This deployment option is most useful for application lift-and-shift scenarios that require AD-based permissions. Since Azure AD DS provides AD-based authentication, this option also uses the Kerberos authentication protocol.
- **Azure storage account key**: Azure file shares may also be mounted with an Azure storage account key. To mount a file share this way, the storage account name is used as the username and the storage account key is used as a password. Using the storage account key to mount the Azure file share is effectively an administrator operation, since the mounted file share will have full permissions to all of the files and folders on the share, even if they have ACLs. When using the storage account key to mount over SMB, the NTLMv2 authentication protocol is used.

For customers migrating from on-premises file servers, or creating new file shares in Azure Files intended to behave like Windows file servers or NAS appliances, domain joining your storage account to **Customer-owned Active Directory** is the recommended option. To learn more about domain joining your storage account to a customer-owned Active Directory, see [Azure Files Active Directory overview](storage-files-active-directory-overview.md).

If you intend to use the storage account key to access your Azure file shares, we recommend using service endpoints as described in the [Networking](#networking) section.

## Networking
Azure file shares are accessible from anywhere via the storage account's public endpoint. This means that authenticated requests, such as requests authorized by a user's logon identity, can originate securely from inside or outside of Azure. In many customer environments, an initial mount of the Azure file share on your on-premises workstation will fail, even though mounts from Azure VMs succeed. The reason for this is that many organizations and internet service providers (ISPs) block the port that SMB uses to communicate, port 445. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](https://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To unblock access to your Azure file share, you have two main options:

- Unblock port 445 for your organization's on-premises network. Azure file shares may only be externally accessed via the public endpoint using internet safe protocols such as SMB 3.0 and the FileREST API. This is the easiest way to access your Azure file share from on-premises since it doesn't require advanced networking configuration beyond changing your organization's outbound port rules, however, we recommend you remove legacy and deprecated versions of the SMB protocol, namely SMB 1.0. To learn how to do this, see [Securing Windows/Windows Server](storage-how-to-use-files-windows.md#securing-windowswindows-server) and [Securing Linux](storage-how-to-use-files-linux.md#securing-linux).

- Access Azure file shares over an ExpressRoute or VPN connection. When you access your Azure file share via a network tunnel, you are able to mount your Azure file share like an on-premises file share since SMB traffic does not traverse your organizational boundary.   

Although from a technical perspective it's considerably easier to mount your Azure file shares via the public endpoint, we expect most customers will opt to mount their Azure file shares over an ExpressRoute or VPN connection. To do this, you will need to configure the following for your environment:  

- **Network tunneling using ExpressRoute, Site-to-Site, or Point-to-Site VPN**: Tunneling into a virtual network allows accessing Azure file shares from on-premises, even if port 445 is blocked.
- **Private endpoints**: Private endpoints give your storage account a dedicated IP address from within the address space of the virtual network. This enables network tunneling without needing to open on-premises networks up to all the of the IP address ranges owned by the Azure storage clusters. 
- **DNS forwarding**: Configure your on-premises DNS to resolve the name of your storage account (i.e. `storageaccount.file.core.windows.net` for the public cloud regions) to resolve to the IP address of your private endpoints.

To plan for the networking associated with deploying an Azure file share, see [Azure Files networking considerations](storage-files-networking-overview.md).

## Encryption
Azure Files supports two different types of encryption: encryption in transit, which relates to the encryption used when mounting/accessing the Azure file share, and encryption at rest, which relates to how the data is encrypted when it is stored on disk. 

### Encryption in transit
By default, all Azure storage accounts have encryption in transit enabled. This means that when you mount a file share over SMB or access it via the FileREST protocol (such as through the Azure portal, PowerShell/CLI, or Azure SDKs), Azure Files will only allow the connection if it is made with SMB 3.0+ with encryption or HTTPS. Clients that do not support SMB 3.0 or clients that support SMB 3.0 but not SMB encryption will not be able to mount the Azure file share if encryption in transit is enabled. For more information about which operating systems support SMB 3.0 with encryption, see our detailed documentation for [Windows](storage-how-to-use-files-windows.md), [macOS](storage-how-to-use-files-mac.md), and [Linux](storage-how-to-use-files-linux.md). All current versions of the PowerShell, CLI, and SDKs support HTTPS.  

You can disable encryption in transit for an Azure storage account. When encryption is disabled, Azure Files will also allow SMB 2.1, SMB 3.0 without encryption, and unencrypted FileREST API calls over HTTP. The primary reason to disable encryption in transit is to support a legacy application that must be run on an older operating system, such as Windows Server 2008 R2 or older Linux distribution. Azure Files only allows SMB 2.1 connections within the same Azure region as the Azure file share; an SMB 2.1 client outside of the Azure region of the Azure file share, such as on-premises or in a different Azure region, will not be able to access the file share.

We strongly recommend ensuring encryption of data in-transit is enabled.

For more information about encryption in transit, see [requiring secure transfer in Azure storage](../common/storage-require-secure-transfer.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Encryption at rest
[!INCLUDE [storage-files-encryption-at-rest](../../../includes/storage-files-encryption-at-rest.md)]

## Storage tiers
[!INCLUDE [storage-files-tiers-overview](../../../includes/storage-files-tiers-overview.md)]

In general, Azure Files features and interoperability with other services are the same between premium file shares and standard file shares, however there are a few important differences:
- **Billing model**
    - Premium file shares are billed using a provisioned billing model, which means you pay for how much storage you provision rather than how much storage you actually ask for. 
    - Standard file shares are billed using a pay-as-you-go model, which includes a base cost of storage for how much storage you're actually consuming and then an additional transaction cost based on how you use the share. With standard file shares, your bill will increase if you use (read/write/mount) the Azure file share more.
- **Redundancy options**
    - Premium file shares are only available for locally redundant (LRS) and zone redundant (ZRS) storage.
    - Standard file shares are available for locally redundant, zone redundant, geo-redundant (GRS), and geo-zone redundant (GZRS) storage.
- **Maximum size of file share**
    - Premium file shares can be provisioned for up to 100 TiB without any additional work.
    - By default, standard file shares can span only up to 5 TiB, although the share limit can be increased to 100 TiB by opting into the *large file share* storage account feature flag. Standard file shares may only span up to 100 TiB for locally redundant or zone redundant storage accounts. For more information on increasing file share sizes, see [Enable and create large file shares](https://docs.microsoft.com/azure/storage/files/storage-files-how-to-create-large-file-share).
- **Regional availability**
    - Premium file shares are not available in every region, and zone redundant support is available in a smaller subset of regions. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure. To find out what regions support ZRS, see [Azure Availability Zone support by region](../../availability-zones/az-region.md). To help us prioritize new regions and premium tier features, please fill out this [survey](https://aka.ms/pfsfeedback).
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
[!INCLUDE [storage-files-tiers-enable-large-shares](../../../includes/storage-files-tiers-enable-large-shares.md)]

#### Limitations
[!INCLUDE [storage-files-tiers-large-file-share-availability](../../../includes/storage-files-tiers-large-file-share-availability.md)]

## Redundancy
[!INCLUDE [storage-files-redundancy-overview](../../../includes/storage-files-redundancy-overview.md)]

## Migration
In many cases, you will not be establishing a net new file share for your organization, but instead migrating an existing file share from an on-premises file server or NAS device to Azure Files. Picking the right migration strategy and tool for your scenario is important for the success of your migration. 

The [migration overview article](storage-files-migration-overview.md) briefly covers the basics and contains a table that leads you to migration guides that likely cover your scenario.

## Next steps
* [Planning for an Azure File Sync Deployment](storage-sync-files-planning.md)
* [Deploying Azure Files](storage-files-deployment-guide.md)
* [Deploying Azure File Sync](storage-sync-files-deployment-guide.md)
* [Check out the migration overview article to find the migration guide for your scenario](storage-files-migration-overview.md)
