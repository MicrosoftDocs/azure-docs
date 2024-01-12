---
title: Understand NAS file permissions in Azure NetApp Files
description: Learn about NAS file permissions options in Azure NetApp Files.   
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

# Understand NAS file permissions in Azure NetApp Files

To control access to specific files and folders in a file system, permissions can be applied. File and folder permissions are more granular than share permissions. The following table shows the differences in permission attributes that file and share permissions can apply.

| SMB share permission | NFS export policy rule permissions | SMB file permission attributes | NFS file permission attributes |
| --- | --- | --- | --- |
| <ul><li>Read</li><li>Change</li><li>Full control</li></ul> | <ul><li>Read</li><li>Write</li><li>Root</li></ul> | <ul><li>Full control</li><li>Traverse folder/execute</li><li>Read data/list folders</li><li>Read attributes</li><li>Read extended attributes</li><li>Write data/create files</li><li>Append data/create folders</li><li>Write attributes</li><li>Write extended attributes</li><li>Delete subfolders/files</li><li>Delete</li><li>Read permissions</li><li>Change permissions</li><li>Take ownership</li></ul> | **NFSv3** <br /> <ul><li>Read</li><li>Write</li><li>Execute</li></ul> <br /> **NFSv4.1** <br /> <ul><li>Read data/list files and folders</li><li>Write data/create files and folders</li><li>Append data/create subdirectories</li><li>Execute files/traverse directories</li><li>Delete files/directories</li><li>Delete subdirectories (directories only)</li><li>Read attributes (GETATTR)</li><li>Write attributes (SETATTR/chmod)</li><li>Read named attributes</li><li>Write named attributes</li><li>Read ACLs</li><li>Write ACLs</li><li>Write owner (chown)</li><li>Synchronize I/O</li></ul> |

File and folder permissions can overrule share permissions, as the most restrictive permissions countermand less restrictive permissions.

## Permission inheritance 

Folders can be assigned inheritance flags, which means that parent folder permissions propagate to child objects. This can help simplify permission management on high file count environments. Inheritance can be disabled on specific files or folders as needed.

* In Windows SMB shares, inheritance is controlled in the advanced permission view.

:::image type="content" source="../media/azure-netapp-files/share-inheritance.png" alt-text="Screenshot of enable inheritance interface." lightbox="../media/azure-netapp-files/share-inheritance.png":::

* For NFSv3, permission inheritance doesn’t work via ACL, but instead can be mimicked using umask and setgid flags. 
* With NFSv4.1, permission inheritance can be handled using inheritance flags on ACLs. 

## Next steps 

* [Understand NFS file permissions](network-attached-file-permissions-nfs.md)
* [Understand SMB file permissions](network-attached-file-permissions-smb.md)
* [Understand NAS share permissions in Azure NetApp Files](network-attached-storage-permissions.md)