---
title: Enable backup for Azure Stack from the administration portal | Microsoft Docs
description: Enable the Infrastructure Backup Service through the administration portal so that Azure Stack can be restored if there is a failure.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 56C948E7-4523-43B9-A236-1EF906A0304F
ms.service: azure-stack
ms.workload: naS
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/20/2017
ms.author: mabrigg
ms.reviewer: hectorl

---
# Enable backup for Azure Stack from the administration portal

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Enable the Infrastructure Backup Service through the administration portal so that Azure Stack can generate backups. You can use these backups to restore your environment in the event of a failure.

> [!Note]  
> Before you enable the backup through the console, you need to configure the backup service. You can configure the backup service using PowerShell. For more information, see [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).

## Enable backup

1. Open the Azure Stack administration portal at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.

    ![Azure Stack - Backup controller settings](media\azure-stack-backup\azure-stack-backup-settings.png).

3. Type the path to the **Backup storage location**. Use a Universal Naming Convention (UNC) string for the path to a file share hosted on a separate device. A UNC string specifies the location of resources such as shared files or devices. For the service, you can use an IP address. To ensure availability of the backup data after a disaster, the  device should be in a separate location.
    > [!Note]  
    > If your environment supports name resolution from the Azure Stack infrastructure network to your enterprise environment, you can use an FQDN rather than the IP.
4. Type the **Username** using the domain and username. For example, `Contoso\administrator`.
5. Type the **Password** for the user.
5. Type the password again to **Confirm Password**.
6. Provide a pre-shared key in the **Encryption Key** box. Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view this key from this interface. For more instructions to generate a pre-shared key, follow the scripts at [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md#generate-a-new-encryption-key). 
7. Select **OK** to save your backup controller settings.

To execute a backup, you need to download the Azure Stack Tools, and then run the PowerShell cmdlet **Start-AzSBackup** on your Azure Stack administration node. For more information, see [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).

## Next steps

 - Learn to run a backup. See [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).
- Learn to verify that your backup ran. See [Confirm backup completed in administration portal](azure-stack-backup-back-up-azure-stack.md ).
