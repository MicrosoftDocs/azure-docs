---
title: FSLogix profile containers and Azure Files in Windows Virtual Desktop - Azure
description: This article contains information about FSLogix profile containers within Windows Virtual Desktop and Azure files.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/16/2019
ms.author: v-chjenk
---
# FSLogix Profile containers and Azure files

The Windows Virtual Desktop Preview service offers FSLogix profile containers as the recommended user profile solution. It's specifically designed to roam profiles in remote computing environments such as Windows Virtual Desktop. A complete user profile is stored in a single container and, at logon, the container is dynamically attached to the computing environment using native, in-guest VHD/VHDX Microsoft services.  The user's profile is then immediately available and appears to the system exactly like a native user profile.

In this article, we'll describ3e FSLogix profile containers and Azure Files. This information is in the context of Windows Virtual Desktop, which was [announced on 3/21](https://www.microsoft.com/microsoft-365/blog/2019/03/21/windows-virtual-desktop-public-preview/).

Key areas that are covered:
- Why we need user profiles
- FSLogix profile containers
- Advantages of using Azure Files
- Reference Infrastructure
- Setup guide

## User profiles

User profiles is a term that can be summarized as all data tied to a specific user that is both created by the user or tied to her/his settings. By default, Windows creates a local user profile that is tightly integrated with the operating system. 

Remote user profile add a layer of abstraction between a user's data and the operating system. This allows the operating system to be replaced without effecting the user data. In RDSH/VDI world the replacement of the operating system may be due to:
- Upgrade of the operating system
- Replacement of the existing VM 
- User being part of a pooled (non-persistent) RDSH / VDI environment

Microsoft has gone through few technologies in attempts to address user profiles. Few of the more popular are:
- Roaming user profiles (RUP)
- User profile disks (UPD)
- Enterprise state roaming (ESR)

Of the above-mentioned solutions UPD and RUP are the most widely used user profile in RDSH / VDH environments.

### Challenges with User Profiles

Existing and legacy Microsoft solutions around user profiles came with different set of challenges that no one solution could address.

Functionality

None of the existing Microsoft user profile solutions is capable of handling all needs that come up in and RDSH/VDI environment. UPD could not handle large OST files. RUP was not persisting modern setting. The table below is a good summary of existing and missing capabilities around user profile technologies.

| Technology | Modern settings | Win32 settings | OS settings | User data | Supported on server SKU | Back-end storage on Azure | Back-end storage on-prem | Verison support | Subsequent logon time |
| ---------- | --------------- | -------------- | ----------- | --------- | ----------------------- | ------------------------- | ------------------------ | --------------- | --------------------- |
| **UPD** | Yes | Yes | Yes | Yes | Yes | No | Yes | Win 7+ | Yes |
| **RUP** 1 | No | Yes | Yes | Yes | Yes| No | Yes | Win 7+ | No |
| **ESR** 2 | Yes | No | Yes | No | Yes 3 | Yes | No | Win 10 | No |
| **UE-V** 4 | Yes | Yes | Yes | No | Yes | No | Yes | Win 7+ | No |
| **Cloud Files** | No | No | No | Yes | Yes 5 | Yes 6 | Yes 7 | Win 10 RS3 | No |

1. Roaming User Profile, maintenance mode
2. Enterprise State Roaming
3. Yes, but no supporting user interface
4. User Experience Virtualization
5. Theoretically, but not tested
6. Yes, but depends on synch client
1. Needs a sync client (work folders?)




Performance

UPD requires [S2D](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-storage-spaces-direct-deployment) to address performance requirements. This is due to UPD using SMB protocol and copying the profile to the VM to which the user is being logged. UPD on top of S2D was the solution that the RDS team recommend for Windows Virtual Desktop during the private preview of the service.  

Cost

While S2D clusters achieve the needed performance, their monetary cost is considered high among enterprise customers and very high for SMB customers.

Administrative overhead

S2D clusters require an operating system that is patched, updated and maintained in secure state. This in addition with the complexity around setting up S2D disaster recovery and the many caveats in that process renders S2D usable only for enterprises that have dedicated IT staff to handle storage in VDO RDSH / VDI environments.

## FSLogix Profile Containers

On Nov 19, 2018 [Microsoft acquired FSLogix](https://blogs.microsoft.com/blog/2018/11/19/microsoft-acquires-fslogix-to-enhance-the-office-365-virtualization-experience/). This was done due to many reasons, key among those are:
- FSLogix profile containers performance, [Profile containers](https://fslogix.com/products/profile-containers) – resolving performance issues that historically have blocked cached exchange mode.
- FSLogix unblocking OneDrive, [OneDrive for Business and FSLogix best practices](https://fslogix.com/products/technical-faqs/284-onedrive-for-business-and-fslogix-best-practices) – its mandatory to call out that without FSLogix profile containers OneDrive for Business was not supported in non-persistent RDSH / VDI environments as outlined [here](https://docs.microsoft.com/deployoffice/rds-onedrive-business-vdi).
- Ability to extend used profiles to include additional folders.

Further this acquisition allows Microsoft to supersede existing user profile solutions like UPD with FSLogix profile containers.

## Azure Files integration with AD

FSLogix profile containers address performance and feature needs there was / is need for a storage solution that moves away S2D and takes advantage of the cloud and what it offers. Microsoft Azure Files [announced](https://azure.microsoft.com/blog/azure-active-directory-integration-for-smb-access-now-in-public-preview/) on Sept 24, 2018 a public preview of Azure Files supporting Azure Active Directory authentication. This evolution away from storage key enables Azure Files to step in and challenge S2D. By addressing both cost and administrative overhead Azure Files with Azure Active Directory authentication can be used as the premium solution for user profiles in the new Windows Virtual Desktop service.

## Reference Infrastructure

Windows Virtual Desktop offers full control over size, type and count of VMs that are being used by our customers. Hence the focus will be on the storage infrastructure.

MISSING INFO

### Best practices

Azure Files storage account must be in the same region as the session host VMs.

Azure Files permissions should match those outlined here (link).

## Setup Guide

(Needs intro; all bullets below have links:)
- Create Windows Virtual Desktop tenant
- Create session host pool VMs
- Follow this guide to setup Azure Files share
- Follow steps here to configure FSLogix
- Assign users to host pool
- Connect to Windows Virtual Desktop as outlined here

### Best practices

Each host pool must be built of same type and size VMs based on the same master image.

Each host pool VMs must be in the same resource group to aid management, scaling and updating.

The storage solution that will be used for FSLogix profile location should be in the same data center for optimal performance. 

The storage account containing the master image must be in the same region and subscription where the VMs are being provisioned. 

## Next steps
