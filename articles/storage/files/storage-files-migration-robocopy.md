---
title: Migrate to Azure file shares using RoboCopy
description: Learn how to migrate files from several locations Azure file shares with RoboCopy.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 04/12/2021
ms.author: fauhse
ms.subservice: files
---

# Use RoboCopy to migrate to Azure file shares

This migration article describes the use of RoboCopy to move or migrate files to an Azure file share. RoboCopy is a trusted and well-known file copy utility with a feature set that makes it well suited for migrations. It uses the SMB protocol, which makes it broadly applicable to any source and target combination, supporting SMB.

> [!div class="checklist"]
> * Data sources: Any source supporting the SMB protocol, such as Network Attached Storage (NAS), Windows or Linux servers, another Azure file share and many more
> * Migration route: From source storage &rArr; Windows machine with RoboCopy &rArr; Azure file share

There are many different migration routes for different source and deployment combinations. Look through the [table of migration guides](storage-files-migration-overview.md#migration-guides) to find the migration that best suits your needs.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## AzCopy vs. RoboCopy
AzCopy and RoboCopy are two fundamentally different file copy tools. RoboCopy uses any version of the SMB protocol. AzCopy is a "born-in-the-cloud" tool that can be used to move data as long as the target is in Azure storage. AzCopy depends on a REST protocol.

RoboCopy, as a trusted, Windows-based copy tool, has the home-turf advantage when it comes to copying files at full fidelity. RoboCopy supports many migration scenarios due to its rich set of features and the ability to copy files and folders in full fidelity. Check out the [file fidelity section in the migration overview article](storage-files-migration-overview.md#migration-basics) to learn more about the importance of copying files at maximum possible fidelity.

AzCopy, on the other hand, has only recently expanded to support file copy with some fidelity and added the first features needed to be considered as a migration tool. However, there are still gaps and there can easily be misunderstandings of functionality when comparing AzCopy flags to RoboCopy flags.

An example: *RoboCopy /MIR* will mirror source to target - that means added, changed, and deleted files are considered. An important difference to *AzCopy -sync* is that deleted files on the source will not be removed on the target. That makes for an incomplete differential-copy feature set. AzCopy will continue to evolve. At this time AzCopy is not a recommended tool for migration scenarios with Azure file shares as the target. 

## Migration goals

The goal is to move the data from existing file share locations to Azure. In Azure, you'll store you data in native Azure file shares you can use without a need for a Windows Server. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

The migration process consists of several phases. You'll need to deploy Azure storage accounts and file shares. Furthermore, you'll configure networking, consider a DFS Namespace deployment (DFS-N) or update your existing one. Once it's time for the actual data copy, you'll need to consider repeated, differential RoboCopy runs to minimize downtime, and finally, cut-over your users to the newly created Azure file shares. The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you are returning to this article, use the navigation on the right side to jump to the migration phase where you left off.

## Phase 1: Identify how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 3: Preparing to use Azure file shares

With the information in this phase, you will be able to decide how your servers and users in Azure and outside of Azure will be enabled to utilize your Azure file shares. The most critical decisions are:

- **Networking:** Enable your networks to route SMB traffic.
- **Authentication:** Configure Azure storage accounts for Kerberos authentication. AdConnect and Domain joining your storage account will allow your apps and users to use their AD identity to for authentication
- **Authorization:** Share-level ACLs for each Azure file share will allow AD users and groups to access a given share and within an Azure file share, native NTFS ACLs will take over. Authorization based on file and folder ACLs then works like it does for on-premises SMB shares.
- **Business continuity:** Integration of Azure file shares into an existing environment often entails to preserve existing share addresses. If you are not already using [DFS-Namespaces](files-manage-namespaces.md), consider establishing that in your environment. You'd be able to keep share addresses your users and scripts use, unchanged. DFS-N provides a namespace routing service for SMB, by redirecting clients to Azure file shares.

:::row:::
    :::column:::
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/jd49W33DxkQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps.</br>
        The video references dedicated documentation for some topics:

* [Identity overview](storage-files-active-directory-overview.md)
* [How to domain join a storage account](storage-files-identity-auth-active-directory-enable.md)
* [Networking overview for Azure file shares](storage-files-networking-overview.md)
* [How to configure public and private endpoints](storage-files-networking-endpoints.md)
* [How to configure a S2S VPN](storage-files-configure-s2s-vpn.md)
* [How to configure a Windows P2S VPN](storage-files-configure-p2s-vpn-windows.md)
* [How to configure a Linux P2S VPN](storage-files-configure-p2s-vpn-linux.md)
* [How to configure DNS forwarding](storage-files-networking-dns.md)
* [Configure DFS-N](files-manage-namespaces.md)
   :::column-end:::
:::row-end:::

### Mounting an Azure file share

Before you can use RoboCopy, you need to make the Azure file share accessible over SMB. The easiest way is to mount the share as a local network drive to the Windows Server you are planning on using for RoboCopy. 

> [!IMPORTANT]
> Before you can successfully mount an Azure file share to a local Windows Server, you need to have completed Phase 3: Preparing to use Azure file shares.

Once you are ready, review the [Use an Azure file share with Windows how-to article](storage-how-to-use-files-windows.md). Then mount the Azure file share you want to start the RoboCopy for.

## Phase 4: RoboCopy

The following RoboCopy command will copy only the differences (updated files and folders) from your source storage to your Azure file share.

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

> [!TIP]
> [Check out the Troubleshooting section](#troubleshoot-and-optimize) if RoboCopy is impacting your production environment, reports lots of errors or is not progressing as fast as expected.

## Phase 5: User cut-over

When you run the RoboCopy command for the first time, your users and applications are still accessing files on the source of your migration and potentially change them. It is possible, that RoboCopy has processed a directory, moves on to the next and then a user on the source location adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. This behavior is expected.

The first run is about moving the bulk of the churned data to your Azure file share. This first copy can take a while. Check out the [Troubleshooting section](#troubleshoot-and-optimize) for more insight into what can affect RoboCopy speeds.

Once the initial run is complete, run the command again.

A second time you run RoboCopy for the same share, it will finish faster, because it only needs to transport changes that happened since the last run. You can run repeated jobs for the same share.

When you consider the downtime acceptable, then you need to remove user access to your source shares. You can do that by any steps that prevent users from changing the file and folder structure and content. An example is to point your DFS-Namespace to a non-existing location or change the ACLs on each share.

Run one last RoboCopy round. It will pick up any changes, that might have been missed.
How long this final step takes, dependents on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

In a previous section, you've configured your users to [access the share with their identity](#phase-3-preparing-to-use-azure-file-shares) and should have established a strategy for your users to [use established paths to your new Azure file shares (DFS-N)](files-manage-namespaces.md).

You can try to run a few of these copies between different source and target shares in parallel. When doing so, keep your network throughput and core to thread count ratio in mind to not overtax the system.

## Troubleshoot and optimize

[!INCLUDE [storage-files-migration-robocopy-optimize](../../../includes/storage-files-migration-robocopy-optimize.md)]

## Next steps

There is more to discover about Azure file shares. The following articles help understand advanced options, best practices, and also contain troubleshooting help. These articles link to [Azure file share documentation](storage-files-introduction.md) as appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Backup: Azure file share snapshots](storage-snapshots-files.md)
* [How to use DFS Namespaces with Azure Files](files-manage-namespaces.md)
