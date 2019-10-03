---
title: Storage options for FSLogix profile containers - Azure
description: Options for storing your Windows Virtual Desktop FSLogix profile on Azure Storage.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: helohr
---
# Storage options for FSLogix profile containers

Windows Virtual Desktop offers FSLogix profile containers as the recommended user profile solution. FSLogix is designed to roam profiles in remote computing environments, such as Windows Virtual Desktop. At sign in, this container is dynamically attached to the computing environment using natively supported Virtual Hard Disk (VHD) and Hyper-V Virtual Hard disk (VHDX). The user profile is immediately available and appears in the system exactly like a native user profile.

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. 

## Comparing Azure storage options

The following table compares the storage solutions Azure Storage offers for Windows Virtual Desktop FSLogix profile container user profiles.

|Storage option|Status|Platform service|Regional availability|Protocols|Security compliance|Azure Active Directory integration|Tiers and performance|Capacity|Redundancy|Backup|Access|Minimum|Pricing|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Azure Files||||||||||||||||||||
|Azure NetApp Files||||||||||||||||||||
|Storage Spaces Direct (S2D)||||||||||||||||||||