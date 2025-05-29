---
title: Use Azure Files for virtual desktop workloads
description: Learn how to use SMB Azure file shares for virtual desktop workloads, including profile containers and disk images for Azure Virtual Desktop, and how to optimize scale and performance.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 05/29/2025
ms.author: kendownie
---

# Azure Files guidance for virtual desktop workloads

Azure Files is the recommended file storage solution for a virtual desktop environment. Azure Files is ideal for [Azure Virtual Desktop](/azure/virtual-desktop/overview) (AVD) because it provides fully managed, scalable file shares that integrate seamlessly with [FSLogix](/azure/virtual-desktop/fslogix-profile-containers) for user profile storage or [App Attach](/azure/virtual-desktop/app-attach-overview) for dynamic application delivery. It reduces infrastructure overhead, ensures high availability, supports enterprise-grade security, and delivers consistent performance for a smooth user experience across virtual sessions.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

To use Azure Files for Azure Virtual Desktop, you'll need a storage account that's in the same Azure region and resource group as your Azure Virtual Desktop host pool.

## Availability and disaster recovery

Before you select an [Azure region](/azure/reliability/regions-list) for your virtual desktop workload, you should be aware of its regional compliance and data residency requirements.

Another important consideration in region selection is latency. It's generally best to centralize all necessary virtual desktop resources, including user profiles, in the same Azure region and subscription as your Azure Virtual Desktop host pool. If you deploy file shares in a region that's far from your users, it can increase latency and degrade performance. It can also increase the cost of data transfer between regions.

Azure Files offers both HDD (standard) and SSD (premium) file shares. Keep in mind that SSD Azure file shares don’t offer geo-redundancy. See [Azure Files redundancy](files-redundancy.md) for more information about the different redundancy options available for Azure Files.

> [!NOTE]
> Azure Files supports SSD file shares in a subset of Azure regions. See [Azure Files redundancy support for SSD file shares](redundancy-premium-file-shares.md) for more information.

## Performance, scale, and cost

Azure Files offers different billing models, including provisioned and pay-as-you-go. See [Understand Azure Files billing](understanding-billing.md).

While Azure Files can support thousands of concurrent virtual desktop users from a single file share, it's critical to properly test your workloads against the size and type of file share you're using. Your requirements might vary based on number of users and profile size.

The following table lists our general recommendations based on the number of concurrent users. This table is based on the assumption that the user profile has a capacity of 5 GiB and a performance of 50 IOPS during sign in and 20 IOPS during steady state.

| **Number of virtual desktop users** | **Recommended file storage** |
|------------------------------------------------|------------------------------|
| Less than 400 concurrent users                | HDD pay-as-you-go file shares              |
| 400-1,000 concurrent users                       | HDD provisioned v2 file shares or multiple HDD pay-as-you-go file shares  |
| 1,000-2,000 concurrent users                 | SSD or multiple HDD file shares |
| More than 2,000 concurrent users             | Multiple SSD file shares |

## Azure Files sizing guidance for Azure Virtual Desktop

In large scale Azure Virtual Desktop deployments, you might run out of handles if you're using a single Azure file share. This section describes how various types of disk images consume handles and provides sizing guidance based on the technology you're using.

### FSLogix

If you're using [FSLogix with Azure Virtual Desktop](/azure/virtual-desktop/fslogix-containers-azure-files), your user profile containers are either Virtual Hard Disk (VHD) or Hyper-V Virtual Hard Disk (VHDX) files, and they're mounted in a user context, not a system context. Each user opens a single root directory handle, which should be to the file share. Azure Files can support a maximum of 10,000 users assuming you have the file share (`\\storageaccount.file.core.windows.net\sharename`) + the profile directory (`%sid%_%username%`) + profile container (`profile_%username.vhd(x)`).

If you're hitting the limit of 10,000 concurrent handles for the root directory or users are seeing poor performance, try using an additional Azure file share and distributing the containers between the shares.

For example, if you have 2,400 concurrent users, you'd need 2,400 handles on the root directory (one for each user), which is below the limit of 10,000 open handles. For FSLogix users, reaching the limit of 2,000 open file and directory handles is unlikely. If you have a single FSLogix profile container per user, you'd only consume two file/directory handles: one for the profile directory and one for the profile container file. If users have two containers each (profile and ODFC), you'd need one more handle for the ODFC file.

### App attach with CimFS

If you're using [MSIX App attach or App attach](/azure/virtual-desktop/app-attach-overview) to dynamically attach applications, you can use Composite Image File System (CimFS) or VHD/VHDX files for [disk images](/azure/virtual-desktop/app-attach-overview#application-images). Either way, the scale limits are per VM mounting the image, not per user. The number of users is irrelevant when calculating scale limits. When a VM is booted, it mounts the disk image, even if there are zero users.

If you're using App attach with CimFS, the disk images only consume handles on the disk image files. They don't consume handles on the root directory or the directory containing the disk image. However, because a CimFS image is a combination of the .cim file and at least two other files, for every VM mounting the disk image, you need one handle each for three files in the directory. So if you have 100 VMs, you need 300 file handles.

You might run out of file handles if the number of VMs per app exceeds 2,000. In this case, use an additional Azure file share.

### App attach with VHD/VHDX

If you're using App attach with VHD/VHDX files, the files are mounted in a system context, not a user context, and they're shared and read-only. More than one handle on the VHDX file can be consumed by a connecting system. To stay within Azure Files scale limits, the number of VMs multiplied by the number of apps must be less than 10,000, and the number of VMs per app can't exceed 2,000. So the constraint is whichever you hit first.

In this scenario, you could hit the per file/directory limit with 2,000 mounts of a single VHD/VHDX. Or, if the share contains multiple VHD/VHDX files, you could hit the root directory limit first. For example, 100 VMs mounting 100 shared VHDX files will hit the 10,000 handle root directory limit.

In another example, 100 VMs accessing 20 apps require 2,000 root directory handles (100 x 20 = 2,000), which is well within the 10,000 limit for root directory handles. You also need a file handle and a directory/folder handle for every VM mounting the VHD(X) image, so 200 handles in this case (100 file handles + 100 directory handles), which is comfortably below the 2,000 handle limit per file/directory.

If you're hitting the limits on maximum concurrent handles for the root directory or per file/directory, use an additional Azure file share.

## Authentication and authorization

You must use identity-based authentication and assign the correct permissions and Azure RBAC roles to enable users to securely access their profile or application.

You can use one of the following three identity sources to authenticate users to access the Azure file share:

- [On-premises Active Directory Domain Services (AD DS)](/fslogix/how-to-configure-profile-container-azure-files-active-directory): This option requires virtual desktop users to have unimpeded network connectivity to domain controllers.

- [Microsoft Entra Kerberos](/fslogix/how-to-configure-profile-container-entra-id-hybrid) (hybrid identities only): This option requires an existing AD DS deployment, which is then synced to your Microsoft Entra tenant so that Microsoft Entra ID can authenticate your hybrid identities. It's a good fit for virtual desktop workloads because it doesn't require users to have unimpeded network connectivity to domain controllers. With this option, you can store profiles that can be accessed by hybrid user identities from Microsoft Entra joined or Microsoft Entra hybrid joined session hosts.

- [Microsoft Entra Domain Services](/fslogix/how-to-configure-profile-container-azure-files-active-directory): If you don't have an AD DS and need to authenticate cloud-only identities, choose this option.

To configure storage permissions, see [Configure SMB storage permissions for FSLogix](/fslogix/how-to-configure-storage-permissions).

## See also

- [Storage considerations for Azure Virtual Desktop workloads](/azure/well-architected/azure-virtual-desktop/storage)
- [Storage options for FSLogix profile containers in Azure Virtual Desktop](/azure/virtual-desktop/store-fslogix-profile)
