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

# FSLogix Profile containers and Azure files

The Windows Virtual Desktop Preview service recommends FSLogix profile containers as a user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. A complete user profile is stored in a single container and, at sign in, the container is dynamically attached to the computing environment using native, in-guest Virtual Hard Disk (VHD), and Hyper-V Virtual Hard disk (VHDX) Microsoft services. The user profile is immediately available and appears in the system exactly like a native user profile.

In this article, we'll describe FSLogix profile containers used with Azure Files. The information is in the context of Windows Virtual Desktop, which was [announced on 3/21](https://www.microsoft.com/microsoft-365/blog/2019/03/21/windows-virtual-desktop-public-preview/).

Key issues:
- Why we need user profiles and user profile challenges
- FSLogix profile containers
- The advantages of using Azure files
- Reference infrastructure regarding storage
- Setup guide

## User profiles

A user profile is information about individuals that contains any of a variety of data elements, including configuration information for a specific user, such as desktop settings, persistent network connections, and application settings. By default, Windows creates a local user profile that is tightly integrated with the operating system.

A remote user profile was introduced to provide a partition between user data and the operating system, which allows the operating system to be replaced without effecting user data. In Remote Desktop Session Host (RDSH) and Virtual Desktop Infrastructures (VDI), the operating system may be replaced for the following reasons:

- An upgrade of the operating system
- A replacement of an existing Virtual Machine (VM)
- A user being part of a pooled (non-persistent) RDSH or VDI environment

Microsoft products operate with several technologies for remote user profiles, including these technologies:
- Roaming user profiles (RUP)
- User profile disks (UPD)
- Enterprise state roaming (ESR)

UPD and RUP are the most widely used technologies for user profiles in Remote Desktop Session Host (RDSH) and Virtual Hard Disk (VHD) environments.

### Challenges with User Profile technologies

Existing and legacy Microsoft solutions around user profiles came with various challenges. No previous solution handled all the user profile needs that come with an RDSH/VDI environment. For example, UPD cannot handle large OST files and RUP does not persist modern settings.

####Functionality####

The table below shows  benefits and limitations of previous user profile technologies.

| Technology | Modern settings | Win32 settings | OS settings | User data | Supported on server SKU | Back-end storage on Azure | Back-end storage on-premises | Version support | Subsequent sign in time |
| ---------- | --------------- | -------------- | ----------- | --------- | ----------------------- | ------------------------- | ------------------------ | --------------- | --------------------- |
| **UPD** | Yes | Yes | Yes | Yes | Yes | No | Yes | Win 7+ | Yes |
| **RUP** 1 | No | Yes | Yes | Yes | Yes| No | Yes | Win 7+ | No |
| **ESR** 2 | Yes | No | Yes | No | Yes 3 | Yes | No | Win 10 | No |
| **UE-V** 4 | Yes | Yes | Yes | No | Yes | No | Yes | Win 7+ | No |
| **Cloud Files** | No | No | No | Yes | Yes 5 | Yes 6 | Yes 7 | Win 10 RS3 | No |

``` footnotes
1. Roaming User Profile, maintenance mode
2. Enterprise State Roaming
3. Yes, but no supporting user interface
4. User Experience Virtualization
5. Theoretically, but not tested
6. Yes, but depends on synch client
7. Needs a sync client (work folders?)
```

#### Performance

UPD requires [Storage Spaces Direct (S2D)](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment) to address performance requirements. This is due to UPD using Server Message Block (SMB) protocol and copying the profile to the VM in which the user is being logged. UPD on top of S2D was the solution that the RDS team recommended for Windows Virtual Desktop during the preview of the service.  

#### Cost

While S2D clusters achieve the necessary performance, the cost is considered high among enterprise customers and very high for small and medium business (SMB) customers.

#### Administrative overhead

S2D clusters require an operating system that is patched, updated, and maintained in a secure state. This, in addition to the complexity of setting up S2D disaster recovery, makes S2D feasible only for enterprises with a dedicated IT staff.

## FSLogix Profile Containers

On Nov 19, 2018 [Microsoft acquired FSLogix](https://blogs.microsoft.com/blog/2018/11/19/microsoft-acquires-fslogix-to-enhance-the-office-365-virtualization-experience/). This is due to many reasons, key among those are:

- FSLogix profile containers high performance, [Profile containers](https://fslogix.com/products/profile-containers) resolve performance issues that have historically blocked cached exchange mode.
- FSLogix unblocks OneDrive: [OneDrive for Business and FSLogix best practices](https://fslogix.com/products/technical-faqs/284-onedrive-for-business-and-fslogix-best-practices). Without FSLogix profile containers, OneDrive for Business is not supported in non-persistent RDSH or VDI environments. For more information, see [Use the sync client on virtual desktops](https://docs.microsoft.com/deployoffice/rds-onedrive-business-vdi).
- Ability to extend user profiles to include additional folders.

This acquisition lets Microsoft replace existing user profile solutions, like UPD, with FSLogix profile containers.

## Azure Files integration with Active Directory

FSLogix profile containers address performance and feature needs there was / is need for a storage solution that moves away S2D and takes advantage of the cloud and what it offers. Microsoft Azure Files [announced](https://azure.microsoft.com/blog/azure-active-directory-integration-for-smb-access-now-in-public-preview/) on Sept 24, 2018 a public preview of Azure Files supporting Azure Active Directory authentication. This evolution away from storage key enables Azure Files to step in and challenge S2D. By addressing both cost and administrative overhead Azure Files with Azure Active Directory authentication can be used as the premium solution for user profiles in the new Windows Virtual Desktop service.

## Reference Infrastructure

The focus of this section is the storage infrastructure. Windows Virtual Desktop offers full control over size, type, and count of VMs that are being used by our customers.

MISSING INFO

### Best practices

Azure Files storage account must be in the same region as the session host VMs.

Azure Files permissions should match those outlined here (link).

## Setup Guide

(Needs intro; all bullets below have links:)
- Create Windows Virtual Desktop tenant
- Create session host pool VMs
- Follow this guide to set up Azure Files share
- Follow steps here to configure FSLogix
- Assign users to host pool
- Connect to Windows Virtual Desktop as outlined here

### Best practices

Each host pool must be built of the same type and size VM based on the same master image.

Each host pool VM must be in the same resource group to aid management, scaling and updating.

The storage solution that will be used for FSLogix profile location should be in the same data center for optimal performance.

The storage account containing the master image must be in the same region and subscription where the VMs are being provisioned.

## Next steps
