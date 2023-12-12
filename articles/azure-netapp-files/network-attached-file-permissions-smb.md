---
title: Understand SMB file permissions in Azure NetApp Files
description: Learn about SMB file permissions options in Azure NetApp Files.   
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/13/2023
ms.author: anfdocs
---

# Understand SMB file permissions in Azure NetApp Files 

SMB volumes in Azure NetApp Files can leverage NTFS security styles to make use of NTFS access control lists (ACLs) for access controls. 

NTFS ACLs provide granular permissions and ownership for files and folders by way of access control entries (ACEs). Directory permissions can also be set to enable or disable inheritance of permissions.

:::image type="content" source="../media/azure-netapp-files/access-control-entry-diagram.png" alt-text="Diagram of access control entries." lightbox="../media/azure-netapp-files/access-control-entry-diagram.png":::

For a complete overview of NTFS-style ACLs, see [Microsoft Access Control overview](/windows/security/identity-protection/access-control/access-control).

## Next steps 

* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)