---
title: Manage volumes in Azure NetApp Files application volume group | Microsoft Docs
description: Describes how to manage a volume from its application volume group, including resizing, deleting, or changing throughput for the volume. 
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
ms.date: 11/10/2021
ms.author: b-juche
---
# Manage volumes in application volume group

You can manage a volume from its volume group. You can resize, delete, or change throughput for the volume. 

## Steps

1. From your NetApp account, select **Application volume groups**. Click a volume group to display the volumes in the group. Select the volume you want to resize, delete, or change throughput. The volume overview will be displayed. 

    ![Screenshot that shows Application Volume Groups overview page.](../media/azure-netapp-files/application-volume-group-overview.png) 

    1. To resize the volume, click **Resize** and specify the quota in GiB.
    
    ![Screenshot that shows the Update Volume Quota window.](../media/azure-netapp-files/application-volume-resize.png) 

    2. To change the throughput for the volume, click **Change throughput** and specify the intended throughput in MiB/s.

    ![Screenshot that shows the Change Throughput window.](../media/azure-netapp-files/application-volume-change-throughput.png) 

    3. To delete the volume in the volume group, click **Delete**. If you are prompted, type the volume name to confirm the deletion.  

    > [!IMPORTANT]
    > The volume deletion operation cannot be undone.
    
    ![Screenshot that shows the Delete Volume window.](../media/azure-netapp-files/application-volume-delete.png) 

## Next steps  

* 
