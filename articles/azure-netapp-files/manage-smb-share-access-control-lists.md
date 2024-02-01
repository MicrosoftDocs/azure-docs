---
title: Manage SMB share ACLs in Azure NetApp Files
description: Learn how to manage SMB share access control lists in Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 11/03/2023
---
# Manage SMB share ACLs in Azure NetApp Files

SMB shares can control access to who can mount and access a share, as well as control access levels to users and groups in an Active Directory domain. The first level of permissions that get evaluated are share access control lists (ACLs). 

There are two ways to view share settings:

* In the **Advanced permissions** settings

* With the **Microsoft Management Console (MMC)**

## Prerequisites 

You must have the mount path. You can retrieve this in the Azure portal by navigating to the **Overview** menu of the volume for which you want to configure share ACLs. Identify the **Mount path**.

:::image type="content" source="../media/azure-netapp-files/volume-mount-path.png" alt-text="Screenshot of the mount path." lightbox="../media/azure-netapp-files/volume-mount-path.png":::


## View SMB share ACLs with advanced permissions 

Advanced permissions for files, folders, and shares on an Azure NetApp File volume can be accessed by right-clicking the Azure NetApp Files share at the top level of the UNC path (for example, `\\Azure.NetApp.Files\`) or in the Windows Explorer view when navigating to the share itself (for instance, `\\Azure.NetApp.Files\sharename`).

>[!NOTE]
>You can only view SMB share ACLs in the **Advanced permissions** settings.

1. In Windows Explorer, use the mount path to open the volume. Right-click on the volume, select **Properties**. Switch to the **Security** tab then select **Advanced**.

    :::image type="content" source="../media/azure-netapp-files/security-advanced-tab.png" alt-text="Screenshot of security tab." lightbox="../media/azure-netapp-files/security-advanced-tab.png":::

1. In the new window that pops up, switch to the **Share** tab to view the share-level ACLs. You cannot modify share-level ACLs.  

    >[!NOTE]
    >Azure NetApp Files doesn't support windows audit ACLs. Azure NetApp Files ignores any audit ACL applied to files or directories hosted on Azure NetApp Files volumes.

    :::image type="content" source="../media/azure-netapp-files/view-permissions.png" alt-text="Screenshot of the permissions tab." lightbox="../media/azure-netapp-files/view-permissions.png":::

    :::image type="content" source="../media/azure-netapp-files/view-shares.png" alt-text="Screenshot of the share tab." lightbox="../media/azure-netapp-files/view-shares.png":::


## Modify share-levels ACLs with the Microsoft Management Console

You can only modify the share ACLs in Azure NetApp Files with the Microsoft Management Console (MMC).

1. To modify share-level ACLs in Azure NetApp Files, open the Computer Management MMC from the Server Manager in Windows. From there, select the **Tools** menu then **Computer Management**.

1. In the Computer Management window, right-click **Computer management (local)** then select **Connect to another computer**. 

    :::image type="content" source="../media/azure-netapp-files/computer-management-local.png" alt-text="Screenshot of the computer management window." lightbox="../media/azure-netapp-files/computer-management-local.png":::

1. In the **Another computer** field, enter the fully qualified domain name (FQDN).

    The FQDN comes from the mount path you retrieved in the prerequisites. For example, if the mount path is `\\ANF-West-f899.contoso.com\SMBVolume`, enter `ANF-West-f899.contoso.com` as the FQDN. 

1. Once connected, expand **System Tools** then select **Shared Folders > Shares**.
1. To manage share permissions, right-click on the name of the share you want to modify from list and select **Properties**.

    :::image type="content" source="../media/azure-netapp-files/share-folder.png" alt-text="Screenshot of the share folder." lightbox="../media/azure-netapp-files/share-folder.png":::

1. Add, remove, or modify the share ACLs as appropriate. 

    :::image type="content" source="../media/azure-netapp-files/add-share.png" alt-text="Screenshot showing how to add a share." lightbox="../media/azure-netapp-files/add-share.png":::
  
## Next step

* [Understand NAS permissions in Azure NetApp Files](network-attached-storage-permissions.md)
