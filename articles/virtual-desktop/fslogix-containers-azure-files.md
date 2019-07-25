---
title: FSLogix profile containers and Azure Files in Windows Virtual Desktop - Azure
description: This article describes FSLogix profile containers within Windows Virtual Desktop and Azure files.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/16/2019
ms.author: v-chjenk
---

# FSLogix profile containers and Azure files

The Windows Virtual Desktop Preview service recommends FSLogix profile containers as a user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. It stores a complete user profile in a single container. At sign in, this container is dynamically attached to the computing environment using natively supported Virtual Hard Disk (VHD) and Hyper-V Virtual Hard disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

In this article, we'll describe FSLogix profile containers used with Azure Files. The information is in the context of Windows Virtual Desktop, which was [announced on 3/21](https://www.microsoft.com/microsoft-365/blog/2019/03/21/windows-virtual-desktop-public-preview/).

## User profiles

A user profile contains data elements about an individual, including configuration information like desktop settings, persistent network connections, and application settings. By default, Windows creates a local user profile that is tightly integrated with the operating system.

A remote user profile provides a partition between user data and the operating system. It allows the operating system to be replaced or changed without affecting the user data. In Remote Desktop Session Host (RDSH) and Virtual Desktop Infrastructures (VDI), the operating system may be replaced for the following reasons:

- An upgrade of the operating system
- A replacement of an existing Virtual Machine (VM)
- A user being part of a pooled (non-persistent) RDSH or VDI environment

Microsoft products operate with several technologies for remote user profiles, including these technologies:
- Roaming user profiles (RUP)
- User profile disks (UPD)
- Enterprise state roaming (ESR)

UPD and RUP are the most widely used technologies for user profiles in Remote Desktop Session Host (RDSH) and Virtual Hard Disk (VHD) environments.

### Challenges with previous user profile technologies

Existing and legacy Microsoft solutions for user profiles came with various challenges. No previous solution handled all the user profile needs that come with an RDSH or VDI environment. For example, UPD cannot handle large OST files and RUP does not persist modern settings.

#### Functionality

The following table shows benefits and limitations of previous user profile technologies.

| Technology | Modern settings | Win32 settings | OS settings | User data | Supported on server SKU | Back-end storage on Azure | Back-end storage on-premises | Version support | Subsequent sign in time |Notes|
| ---------- | :-------------: | :------------: | :---------: | --------: | :---------------------: | :-----------------------: | :--------------------------: | :-------------: | :---------------------: |-----|
| **User Profile Disks (UPD)** | Yes | Yes | Yes | Yes | Yes | No | Yes | Win 7+ | Yes | |
| **Roaming User Profile (RUP), maintenance mode** | No | Yes | Yes | Yes | Yes| No | Yes | Win 7+ | No | |
| **Enterprise State Roaming (ESR)** | Yes | No | Yes | No | See notes | Yes | No | Win 10 | No | Functions on server SKU but no supporting user interface |
| **User Experience Virtualization (UE-V)** | Yes | Yes | Yes | No | Yes | No | Yes | Win 7+ | No |  |
| **OneDrive cloud files** | No | No | No | Yes | See notes | See notes  | See Notes | Win 10 RS3 | No | Not tested on server SKU. Back-end storage on Azure depends on sync client. Back-end storage on-prem needs a sync client. |

#### Performance

UPD requires [Storage Spaces Direct (S2D)](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment) to address performance requirements. UPD uses Server Message Block (SMB) protocol. It copies the profile to the VM in which the user is being logged. UPD with S2D was the solution the RDS team recommended for Windows Virtual Desktop during the preview of the service.  

#### Cost

While S2D clusters achieve the necessary performance, the cost is expensive for enterprise customers, but especially expensive for small and medium business (SMB) customers. For this solution, businesses pay for premium storage disks, along with the cost of the VMs that use the disks for a share.

#### Administrative overhead

S2D clusters require an operating system that is patched, updated, and maintained in a secure state. These processes and the complexity of setting up S2D disaster recovery make S2D feasible only for enterprises with a dedicated IT staff.

## FSLogix profile containers

On November 19, 2018, [Microsoft acquired FSLogix](https://blogs.microsoft.com/blog/2018/11/19/microsoft-acquires-fslogix-to-enhance-the-office-365-virtualization-experience/). FSLogix addresses many profile container challenges. Key among them are:

- **Performance:** The [FSLogix profile containers](https://fslogix.com/products/profile-containers) are high performance and resolve performance issues that have historically blocked cached exchange mode.
- **OneDrive:** Without FSLogix profile containers, OneDrive for Business is not supported in non-persistent RDSH or VDI environments. [OneDrive for Business and FSLogix best practices](https://fslogix.com/products/technical-faqs/284-onedrive-for-business-and-fslogix-best-practices) describes how they interact. For more information, see [Use the sync client on virtual desktops](https://docs.microsoft.com/deployoffice/rds-onedrive-business-vdi).
- **Additional folders:** FSLogix provides the ability to extend user profiles to include additional folders.

Since the acquisition, Microsoft started replacing existing user profile solutions, like UPD, with FSLogix profile containers.

## Azure Files integration with Azure Active Directory

FSLogix profile containers performance and features take advantage of the cloud. On Sept. 24, 2018, Microsoft Azure Files announced a public preview of [Azure Files supporting Azure Active Directory authentication](https://azure.microsoft.com/blog/azure-active-directory-integration-for-smb-access-now-in-public-preview/). By addressing both cost and administrative overhead, Azure Files with Azure Active Directory authentication is a premium solution for user profiles in the new Windows Virtual Desktop service.

## Best practices for Windows Virtual Desktop

Windows Virtual Desktop offers full control over size, type, and count of VMs that are being used by customers. For more information, see [What is Windows Virtual Desktop Preview?](https://docs.microsoft.com/azure/virtual-desktop/overview).

To ensure your Windows Virtual Desktop environment follows best practices:

- Azure Files storage account must be in the same region as the session host VMs.
- Azure Files permissions should match permissions described in [Requirements - Profile Containers](https://docs.fslogix.com/display/20170529/Requirements+-+Profile+Containers).
- Each host pool must be built of the same type and size VM based on the same master image.
- Each host pool VM must be in the same resource group to aid management, scaling and updating.
- For optimal performance, the storage solution and the FSLogix profile container should be in the same data center location.
- The storage account containing the master image must be in the same region and subscription where the VMs are being provisioned.

## Next steps

Use the following instructions to set up a Windows Virtual Desktop environment.

- To start building out your desktop virtualization solution, see [Create a tenant in Windows Virtual Desktop](https://docs.microsoft.com/azure/virtual-desktop/tenant-setup-azure-active-directory).
- To create a host pool within your Windows Virtual Desktop tenant, see [Create a host pool with Azure Marketplace](https://docs.microsoft.com/azure/virtual-desktop/create-host-pools-azure-marketplace).
- To set up fully managed file shares in the cloud, see [Set up Azure Files share](https://docs.microsoft.com/azure/storage/files/storage-files-active-directory-enable).
- To configure FSLogix profile containers, see [Set up a user profile share for a host pool](https://docs.microsoft.com/azure/virtual-desktop/create-host-pools-user-profile).
- To assign users to a host pool, see [Manage app groups for Windows Virtual Desktop](https://docs.microsoft.com/azure/virtual-desktop/manage-app-groups).
- To access your Windows Virtual Desktop resources from a web browser, see [Connect to Windows Virtual Desktop](https://docs.microsoft.com/azure/virtual-desktop/connect-web).
