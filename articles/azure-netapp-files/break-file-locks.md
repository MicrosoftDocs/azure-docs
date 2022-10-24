---
title: Beak file locks for an Azure NetApp Files volume | Microsoft Docs
description: This article explains how to break file locks in an Azure NetApp Files volume. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 10/24/2022
ms.author: anfdocs
---
# Break file locks on an Azure NetApp Files volume

Azure Netapp Files allows you to break file locks on NFS and SMB volumes.

You can break file locks for all files in a volume or limit the breaking to a files in a specified client. Breaking file locks may be disruptive.  

> [!NOTE]
> File locking is only supported over NFSv4.1. For more information about file locking in NFSv4.1, refer to [How does Azure NetApp Files support NFSv4.1 file-locking?](faq-nfs.md#how-does-azure-netapp-files-support-nfsv41-file-locking)

## Break file locks

1. Navigate to the volume you want to break file locks on. In the **Volume** menu under **Support & Troubleshooting**, navigate to **Break File Locks**.
1. To break file locks on a specific client IP, enter an IP address in **Client IP**. To break file locks only for the volume, leave the **Client IP** field empty. Select **Break File Locks**.

    :::image type="content" source="../media/azure-netapp-files/break-file-locks.png" alt-text="Screenshot of break file locks portal" lightbox="../media/azure-netapp-files/break-file-locks.png":::

1. Confirm you understand that breaking file locks may be disruptive.
