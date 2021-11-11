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
ms.date: 10/15/2021
ms.author: b-juche
---
# Enable Continuous Availability on existing SMB volumes

You can enable the SMB Continuous Availability (CA) feature when you [create a new SMB volume](azure-netapp-files-create-volumes-smb.md#continuous-availability). You can also enable SMB CA on an existing SMB volume; this article shows you how to do so.

## Considerations

* The [**Hide Snapshot Path**](snapshots-edit-hide-path.md) option currently does not have any effect for CA-enabled SMB volumes.  

* The `~snapshot` directory (which can be used to traverse in other SMB volumes) is not visible for CA-enabled SMB volumes. You can still manually type `~snapshot\<snapshotName>` to access the snapshot.

## Steps

1. Make sure that you have [registered the SMB Continuous Availability Shares](https://aka.ms/anfsmbcasharespreviewsignup) feature.  

    You should enable Continuous Availability only for SQL Server and [FSLogix user profile containers](../virtual-desktop/create-fslogix-profile-container.md). Using SMB Continuous Availability shares for workloads other than SQL Server and FSLogix user profile containers is *not* supported. This feature is currently supported on Windows SQL Server. Linux SQL Server is not currently supported. If you are using a non-administrator (domain) account to install SQL Server, ensure that the account has the required security privilege assigned. If the domain account does not have the required security privilege (`SeSecurityPrivilege`), and the privilege cannot be set at the domain level, you can grant the privilege to the account by using the **Security privilege users** field of Active Directory connections. See [Create an Active Directory connection](create-active-directory-connections.md#create-an-active-directory-connection).
            
3. Click the SMB volume that you want to have SMB CA enabled. Then click **Edit**.  
4. On the Edit window that appears, select the **Enable Continuous Availability** checkbox.   
    ![Snapshot that shows the Enable Continuous Availability option.](../media/azure-netapp-files/enable-continuous-availability.png)

4. Reboot the Windows systems connecting to the existing SMB share.   

    > [!NOTE]
    > Selecting the **Enable Continuous Availability** option alone does not automatically make the existing SMB sessions continuously available. After selecting the option, be sure to reboot the server for the change to take effect.  

5. Use the following command to verify that CA is enabled and used on the system that’s mounting the volume:

    ```powershell-interactive
    get-smbconnection | select -Property servername,ContinuouslyAvailable
    ```
 
    You might need to install a newer PowerShell version. 

    If you know the server name, you can use the `-ServerName` parameter with the command. See the [Get-SmbConnection](/powershell/module/smbshare/get-smbconnection?view=windowsserver2019-ps&preserve-view=true) PowerShell command details.

## Next steps  

* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
