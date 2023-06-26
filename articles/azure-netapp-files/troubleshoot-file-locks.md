---
title: Troubleshoot file locks for an Azure NetApp Files volume | Microsoft Docs
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
ms.date: 05/03/2023
ms.author: anfdocs
---
# Troubleshoot file locks on an Azure NetApp Files volume

In case you encounter (stale) file locks on NFS, SMB, or dual-protocol volumes that need to be cleared, Azure NetApp Files allows you to break these locks.

You can break file locks for all files in a volume or break all file locks initiated by a specified client. Breaking file locks may be disruptive.   

## Break file locks

1. Navigate to the volume you want to break file locks on. In the **Volume** menu under **Support & Troubleshooting**, navigate to **Break File Locks**. 
1. To break file locks for a specific client connected to a volume, enter an IP address in the **Client IP**. To break file locks for all clients connected to a volume, leave the **Client IP** field empty.

    >[!IMPORTANT]
    > It is your responsibility to provide the _correct_ client IP address. 

1. Select **Break File Locks**.

    :::image type="content" source="../media/azure-netapp-files/break-file-locks.png" alt-text="Screenshot of break file locks portal." lightbox="../media/azure-netapp-files/break-file-locks.png":::

1. Confirm you understand that breaking file locks may be disruptive.

## Next steps

* [NFS FAQs for Azure NetApp Files](faq-nfs.md)
* [SMB FAQs for Azure NetApp Files](faq-smb.md)