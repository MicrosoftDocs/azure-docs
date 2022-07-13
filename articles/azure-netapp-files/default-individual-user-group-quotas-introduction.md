---
title: Understand default and individual user and group quotas for Azure NetApp Files volumes | Microsoft Docs
description: Helps you understand the use cases of managing default and individual user and group quotas for Azure NetApp Files volumes.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/22/2022
ms.author: anfdocs
---
# Understand default and individual user and group quotas  

Quotas enable you to restrict the storage space that a user or group can use. Quotas apply to a specific Azure NetApp Files volume. 

The following are the types of quotas based on the targets that they apply to for a volume: 
* **Individual user quota**   
    The target is a user. The user can be specified by a UNIX UID or a Windows SID. 
* **Individual group quota**   
    The target is a group. The group is specified by a GID.
    Group quotas aren’t applicable to SMB and dual protocol volumes.
* **Default user quota**   
    Automatically applies a quota limit to all the users accessing the volume without creating separate quotas for each target. 
* **Default group quota**   
    Automatically applies a quota limit to all the groups accessing the volume without creating separate quotas for each target. 

To understand considerations and manage user and group quotas for Azure NetApp Files volumes, see [Manage default and individual user and group quotas for a volume](manage-default-individual-user-group-quotas.md).

## Next steps

* [Manage default and individual user and group quotas for a volume](manage-default-individual-user-group-quotas.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
