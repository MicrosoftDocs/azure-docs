---
title: Manage volumes in Azure NetApp Files application volume group for Oracle
description: Describes how to manage a volume from its application volume group for Oracle, including resizing, deleting, or changing throughput for the volume. 
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 05/06/2025
ms.author: anfdocs
ms.custom:
  - build-2025
# Customer intent: "As a database administrator, I want to manage volumes in an Azure NetApp Files application volume group for Oracle, so that I can resize, delete, or adjust throughput to optimize performance and storage efficiency for my applications."
---
# Manage volumes in an application volume group for Oracle

You can manage a volume from its volume group. You can resize, delete, or change throughput for the volume. 

[!INCLUDE [CLI & PowerShell call-out](includes/application-volume-group-powershell-oracle.md)]

## Steps

1. From your NetApp account, select **Application volume groups**.   
    Select a volume group to display the volumes in the group. 

2. Select the volume you want to resize, delete, or change throughput. The volume overview will be displayed. 

3. From **Volume Overview**, you can select:

    * **Edit**    
        You can change individual volume properties:
        * Protocol type
        * Hide snapshot path
        * Snapshot policy
        * Unix permissions

        > [!NOTE] 
        > Changing the protocol type involves reconfiguration at the Linux host. When using dNFS, it's not recommended to mix volumes using NFSv3 and NFSv4.1.  

        > [!NOTE] 
        > Using Azure NetApp Files built-in automated snapshots doesn't create database consistent backups. Instead, use data protection software such as [AzAcSnap](azacsnap-introduction.md), [SnapCenter](https://docs.netapp.com/us-en/snapcenter/protect-azure/protect-applications-azure-netapp-files.html), or other [validated partner solutions](../storage/solution-integration/validated-partners/backup-archive-disaster-recovery/partner-overview.md) that support snapshot-based data protection for Oracle. 

    * **Change Throughput**   
        You can adapt the throughput of the volume.

## Next steps

* [Understand application volume group for Oracle](application-volume-group-oracle-introduction.md)
* [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)
* [Deploy application volume group for Oracle](application-volume-group-oracle-deploy-volumes.md)
* [Configure application volume group for Oracle using REST API](configure-application-volume-oracle-api.md) 
* [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)