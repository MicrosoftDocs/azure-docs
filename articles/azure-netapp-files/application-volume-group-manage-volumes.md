---
title: Manage volumes in Azure NetApp Files application volume group | Microsoft Docs
description: Describes how to manage a volume from its application volume group, including resizing, deleting, or changing throughput for the volume.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 11/19/2021
ms.author: anfdocs
---
# Manage volumes in an application volume group for SAP HANA

You can manage a volume from its volume group. You can resize, delete, or change throughput for the volume. 

## Steps

1. From your NetApp account, select **Application volume groups**. Click a volume group to display the volumes in the group.  

2. Select the volume you want to resize, delete, or change throughput. The volume overview is displayed. 

    [![Screenshot that shows Application Volume Groups overview page.](./media/application-volume-group-manage-volumes/application-volume-group-overview.png)](./media/application-volume-group-manage-volumes/application-volume-group-overview.png#lightbox)  

    * To resize the volume, click **Resize** and specify the quota in GiB.
    
    ![Screenshot that shows the Update Volume Quota window.](./media/application-volume-group-manage-volumes/application-volume-resize.png)

    * To change the throughput for the volume, click **Change throughput** and specify the intended throughput in MiB/s.

    ![Screenshot that shows the Change Throughput window.](./media/application-volume-group-manage-volumes/application-volume-change-throughput.png)

    * To delete the volume in the volume group, click **Delete**. If you are prompted, type the volume name to confirm the deletion.  

    > [!IMPORTANT]
    > The volume deletion operation cannot be undone.
    
    ![Screenshot that shows the Delete Volume window.](./media/application-volume-group-manage-volumes/application-volume-delete.png)

## Next steps  

* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
