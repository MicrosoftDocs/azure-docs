---
title: User profile management for Azure Virtual Desktop with FSLogix profile containers
description: Learn about using User profile management for Azure Virtual Desktop with FSLogix profile containers to manage user profiles and personalization.
author: dknappettmsft
ms.topic: conceptual
ms.date: 01/04/2021
ms.author: daknappe
ms.custom: docs_inherited
---

# User profile management for Azure Virtual Desktop with FSLogix profile containers

A user profile contains data elements about an individual, including configuration information like desktop settings, persistent network connections, and application settings. By default, Windows creates a local user profile that is tightly integrated with the operating system.

A remote user profile provides a partition between user data and the operating system. It allows the operating system to be replaced or changed without affecting the user data. With a VDI solution, such as Azure Virtual Desktop, the operating system may be replaced for the following reasons:

- An upgrade of the operating system.
- A replacement of an existing session host.
- A user is assigned to a pooled host pool where they might connect to a different session host each time they sign in.

We recommend using [FSLogix profile containers](/fslogix/concepts-container-types#profile-container) with Azure Virtual Desktop to manage and roam user profiles and personalization. FSLogix profile containers store a complete user profile in a single container. At sign in, this container is dynamically attached to the remote session as a natively supported Virtual Hard Disk (VHDX or VHD) file. The user profile is immediately available and appears in the system exactly like a native user profile. This article describes how FSLogix profile containers work with Azure Virtual Desktop.

> [!NOTE]
> If you're looking for comparison material about the different FSLogix Profile Container storage options on Azure, see [Storage options for FSLogix profile containers](store-fslogix-profile.md).


## FSLogix profile containers

Existing and legacy Microsoft solutions for user profiles came with various challenges. No previous solution handled all the user profile needs of a VDI environment.

FSLogix profile containers address many user profile challenges. Key among them are:

- **Performance:** The [FSLogix profile containers](/fslogix/configure-profile-container-tutorial/) are high performance and resolve performance issues that have historically blocked cached exchange mode.

- **OneDrive:** Without FSLogix profile containers, OneDrive is not supported in non-persistent VDI environments.

- **Additional folders:** FSLogix profile containers provides the ability to extend user profiles to include additional folders.


## Best practices for Azure Virtual Desktop

Azure Virtual Desktop offers full control over size, type, and count of VMs that are being used by customers. For more information, see [What is Azure Virtual Desktop?](overview.md).

To ensure your Azure Virtual Desktop environment follows best practices:

- We recommend you use Azure Files or Azure NetApp Files to store profile containers. To compare the different FSLogix Profile Container storage options on Azure, see [Storage options for FSLogix profile containers](/fslogix/concepts-container-storage-options).

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
