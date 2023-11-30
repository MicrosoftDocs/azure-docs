---
title: Enable Continuous Availability on existing Azure NetApp Files SMB volumes | Microsoft Docs
description: Describes how to enable SMB Continuous Availability on existing Azure NetApp Files SMB volume.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 05/31/2023
ms.author: anfdocs
---
# Enable Continuous Availability on existing SMB volumes

You can enable the SMB Continuous Availability (CA) feature when you [create a new SMB volume](azure-netapp-files-create-volumes-smb.md#continuous-availability). You can also enable SMB CA on an existing SMB volume; this article shows you how to do so.

>[!IMPORTANT]
> Custom applications are not supported with SMB Continuous Availability.
> 
> For more information, see [**Enable Continuous Availability**](azure-netapp-files-create-volumes-smb.md#continuous-availability).

[!INCLUDE [SMB Continuous Availability warning](includes/smb-continuous-availability.md)]
 
## Steps
       
1. Select the SMB volume that you want to have SMB CA enabled. Then select **Edit**.  
1. On the Edit window that appears, select the **Enable Continuous Availability** checkbox.   
    ![Snapshot that shows the Enable Continuous Availability option.](../media/azure-netapp-files/enable-continuous-availability.png)

1. Reboot the Windows systems connecting to the existing SMB share.   

    > [!NOTE]
    > Selecting the **Enable Continuous Availability** option alone does not automatically make the existing SMB sessions continuously available. After selecting the option, be sure to reboot the server immediately for the change to take effect.  

1. Use the following command to verify that CA is enabled and used on the system that’s mounting the volume:

    ```powershell-interactive
    get-smbconnection | select -Property servername,ContinuouslyAvailable
    ```
 
    You might need to install a newer PowerShell version. 

    If you know the server name, you can use the `-ServerName` parameter with the command. See the [Get-SmbConnection](/powershell/module/smbshare/get-smbconnection?view=windowsserver2019-ps&preserve-view=true) PowerShell command details.

## Next steps  

* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
