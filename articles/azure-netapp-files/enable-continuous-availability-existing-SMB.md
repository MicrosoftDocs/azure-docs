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

You should enable Continuous Availability for the following workloads/use cases only:

* [Citrix App Layering](https://docs.citrix.com/en-us/citrix-app-layering/4.html)
* [FSLogix user profile containers](../virtual-desktop/create-fslogix-profile-container.md), including [FSLogix ODFC containers](/fslogix/concepts-container-types#odfc-container)
* [MSIX app attach with Azure Virtual Desktop](../virtual-desktop/create-netapp-files.md) with [Azure Virtual Desktop](../virtual-desktop/overview.md)
    * When using MSIX applications with the `CIM FS` file format:
        * The number of AVD session hosts shouldn't exceed 500.
        * The number of MSIX applications shouldn't exceed 40.
    * When using MSIX applications with the `VHDX` file format:
        * The number of AVD session hosts shouldn't exceed 500.
        * The number of MSIX applications shouldn't exceed 60.
    * When using a combination of MSIX applications with both the `VHDX` and `CIM FS` file formats:
        * The number of AVD session hosts shouldn't exceed 500.
        * The number of MSIX applications using the `CIM FS` file format shouldn't exceed 24.
        * The number of MSIX applications using the `VHDX` file format shouldn't exceed 24.
* SQL Server
    * Continuous Availability is currently supported on Windows SQL Server.
    * Linux SQL Server is not currently supported.

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
