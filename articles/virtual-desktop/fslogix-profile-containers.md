---
title: User profile management for Azure Virtual Desktop with FSLogix profile containers
description: Learn about using User profile management for Azure Virtual Desktop with FSLogix profile containers to manage user profiles and personalization.
author: sipastak
ms.topic: conceptual
ms.date: 01/04/2021
ms.author: sipastak
---

# User profile management for Azure Virtual Desktop with FSLogix profile containers

We recommend using [FSLogix profile containers](/fslogix/concepts-container-types#profile-container) with Azure Virtual Desktop to manage user profiles and personalization. FSLogix is designed to roam profiles in remote computing environments, such as Azure Virtual Desktop. It stores a complete user profile in a single container. At sign in, this container is dynamically attached to the computing environment using natively supported Virtual Hard Disk (VHD) and Hyper-V Virtual Hard disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile. This article describes how FSLogix profile containers work with Azure Virtual Desktop.

> [!NOTE]
> If you're looking for comparison material about the different FSLogix Profile Container storage options on Azure, see [Storage options for FSLogix profile containers](store-fslogix-profile.md).

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


## FSLogix profile containers

Existing and legacy Microsoft solutions for user profiles came with various challenges. No previous solution handled all the user profile needs that come with an RDSH or VDI environment. For example, UPD cannot handle large OST files and RUP does not persist modern settings.

On November 19, 2018, [Microsoft acquired FSLogix](https://blogs.microsoft.com/blog/2018/11/19/microsoft-acquires-fslogix-to-enhance-the-office-365-virtualization-experience/). FSLogix addresses many profile container challenges. Key among them are:

- **Performance:** The [FSLogix profile containers](/fslogix/configure-profile-container-tutorial/) are high performance and resolve performance issues that have historically blocked cached exchange mode.
- **OneDrive:** Without FSLogix profile containers, OneDrive for Business is not supported in non-persistent RDSH or VDI environments. The [OneDrive VDI support page](/onedrive/sync-vdi-support) will tell you how they interact. For more information, see [Use the sync client on virtual desktops](/deployoffice/rds-onedrive-business-vdi/).
- **Additional folders:** FSLogix provides the ability to extend user profiles to include additional folders.

Since the acquisition, Microsoft started replacing existing user profile solutions, like UPD, with FSLogix profile containers.

## Best practices for Azure Virtual Desktop

Azure Virtual Desktop offers full control over size, type, and count of VMs that are being used by customers. For more information, see [What is Azure Virtual Desktop?](overview.md).

To ensure your Azure Virtual Desktop environment follows best practices:

- If you use Azure Files:
   - The storage account must be in the same region as the session host VMs.
   - Azure Files permissions should match permissions described in [Configure SMB Storage Permissions for FSLogix](/fslogix/fslogix-storage-config-ht).
   - Azure Files has limits on the number of open handles per root directory, directory, and file. For more information on the limits and sizing guidance, see [Azure Files scalability and performance targets](../storage/files/storage-files-scale-targets.md#file-scale-targets) and [Azure Files sizing guidance for Azure Virtual Desktop](../storage/files/storage-files-scale-targets.md#azure-files-sizing-guidance-for-azure-virtual-desktop).
- Each host pool VM must be built of the same type and size VM based on the same master image.
- Each host pool VM must be in the same resource group to aid management, scaling and updating.
- For optimal performance, the storage solution and the FSLogix profile container should be in the same data center location.
- The storage account containing the master image must be in the same region and subscription where the VMs are being provisioned.

## Next steps

- Learn more about storage options for FSLogix profile containers, see [Storage options for FSLogix profile containers in Azure Virtual Desktop](store-fslogix-profile.md).
- [Set up FSLogix Profile Container with Azure Files and Active Directory](fslogix-profile-container-configure-azure-files-active-directory.md)
- [Set up FSLogix Profile Container with Azure Files and Microsoft Entra ID](create-profile-container-azure-ad.yml)
- [Set up FSLogix Profile Container with Azure NetApp Files](create-fslogix-profile-container.md)
