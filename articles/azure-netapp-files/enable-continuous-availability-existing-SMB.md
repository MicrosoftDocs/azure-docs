---
title: Enable Continuous Availability on existing Azure NetApp Files SMB volumes | Microsoft Docs
description: Describes how to enable SMB Continuous Availability on existing Azure NetApp Files SMB volume.  
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/15/2021
ms.author: b-juche
---
# Enable Continuous Availability on existing SMB volumes

You can enable the SMB Continuous Availability (CA) feature when you [create a new SMB volume](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume). You can also enable SMB CA on an existing SMB volume; this article shows you how to do so.  

## Steps

1. Make sure that you have [registered the SMB Continuous Availability Shares](https://aka.ms/anfsmbcasharespreviewsignup) feature.  
2. Click the SMB volume that you want to have SMB CA enabled. Then click **Edit**.  
3. On the Edit window that appears, select the **Enable Continuous Availability** checkbox.   
    ![Snapshot that shows the Enable Continuous Availability option.](../media/azure-netapp-files/enable-continuous-availability.png)

4. Reboot the server.   

    > [!NOTE]
    > Selecting the **Enable Continuous Availability** option alone does not automatically make the existing SMB sessions continuously available. After selecting the option, be sure to reboot the server for the change to take effect.  

## Next steps  

* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)