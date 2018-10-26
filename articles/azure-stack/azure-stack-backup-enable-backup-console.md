---
title: Enable backup for Azure Stack from the administration portal | Microsoft Docs
description: Enable the Infrastructure Backup Service through the administration portal so that Azure Stack can be restored if there is a failure.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 56C948E7-4523-43B9-A236-1EF906A0304F
ms.service: azure-stack
ms.workload: naS
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2018
ms.author: jeffgilb
---
# Enable backup for Azure Stack from the administration portal
Enable the Infrastructure Backup Service through the administration portal so that Azure Stack can generate backups. You can use these backups to restore your environment using cloud recovery in the event of [a catastrophic failure](.\azure-stack-backup-recover-data.md). The purpose of cloud recovery is to ensure that your operators and users can log back into the portal after recovery is complete. Users will have their subscriptions restored including role-based access permissions and roles, original plans, offers, and previously defined compute, storage, and network quotas.

However, the Infrastructure Backup Service does not backup IaaS VMs, network configurations, and storage resources such as storage accounts, blobs, tables, and so on, so users logging in after cloud recovery completes will not see any of their previously existing resources. Platform as a Service (PaaS) resources and data are also not backed up by the service. 

Administrators and users are responsible for backing up and restoring IaaS and PaaS resources separately from the infrastructure backup processes. For information about backing up IaaS and PaaS resources, see the following links:

- [Virtual Machines](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-manage-vm-protect)
- [App Service](https://docs.microsoft.com/azure/app-service/web-sites-backup)
- [SQL Server](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-iaas-overview)


## Enable or reconfigure backup

1. Open the [Azure Stack administration portal](azure-stack-manage-portals.md).
2. Select **All services**, and then under the **ADMINISTRATION** category select **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.
3. Type the path to the **Backup storage location**. Use a Universal Naming Convention (UNC) string for the path to a file share hosted on a separate device. A UNC string specifies the location of resources such as shared files or devices. For the service, you can use an IP address. To ensure availability of the backup data after a disaster, the  device should be in a separate location.

    > [!Note]  
    > If your environment supports name resolution from the Azure Stack infrastructure network to your enterprise environment, you can use an FQDN rather than the IP.
    
4. Type the **Username** using the domain and username with sufficient access to read and write files. For example, `Contoso\backupshareuser`.
5. Type the **Password** for the user.
6. Type the password again to **Confirm Password**.
7. The **frequency in hours** determines how often backups are created. The default value is 12. Scheduler supports a maximum of 12 and a minimum of 4. 
8. The **retention period in days** determines how many days of backups are preserved on the external location. The default value is 7. Scheduler supports a maximum of 14 and a minimum of 2. Backups older than the retention period are automatically deleted from the external location.

    > [!Note]  
    > If you want to archive backups older than the retention period, make sure to backup the files before the scheduler deletes the backups. If you reduce the backup retention period (e.g. from 7 days to 5 days), the scheduler will delete all backups older than the new retention period. Make sure you are ok with the backups getting deleted before you update this value. 

9. Provide a pre-shared key in the **Encryption Key** box. Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view the key from this interface. To create the key, run the following Azure Stack PowerShell commands:
    ```powershell
    New-AzsEncryptionKeyBase64
    ```
10. Select **OK** to save your backup controller settings.

    ![Azure Stack - Backup controller settings](media\azure-stack-backup\backup-controller-settings.png)

## Start backup
To start a backup, click on **Backup now** to start an on-demand backup. An on-demand backup will not modify the time for the next scheduled backup. After the task completes, you can confirm the settings in **Essentials**:

![Azure Stack - on-demand backup](media\azure-stack-backup\scheduled-backup.png)

You can also run the PowerShell cmdlet **Start-AzsBackup** on your Azure Stack administration computer. For more information, see [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md).

## Enable or disable automatic backups
Backups are automatically scheduled when you enable backup. You can check the next schedule backup time in **Essentials**. 

![Azure Stack - on-demand backup](media\azure-stack-backup\on-demand-backup.png)

If you need to disable future scheduled backups, click on **Disable Automatic Backups**. Disabling automatic backups will keep backup settings configured and will retain the backup schedule. This action simply tells the scheduler to skip future backups. 

![Azure Stack - disable scheduled backups](media\azure-stack-backup\disable-auto-backup.png)

Confirm that future scheduled backups have been disabled in **Essentials**:

![Azure Stack - confirm backups have been disabled](media\azure-stack-backup\confirm-disable.png)

Click on **Enable Automatic Backups** to inform the scheduler to start future backups at the scheduled time. 

![Azure Stack - enable scheduled backups](media\azure-stack-backup\enable-auto-backup.png)


> [!Note]  
> If you configured infrastructure backup before updating to 1807, automatic backups will be disabled. This way the backups started by Azure Stack do not conflict with backups started by an external task scheduling engine. Once you disable any external task scheduler, click on **Enable Automatic Backups**.


## Next steps

- Learn to run a backup. See [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).
- Learn to verify that your backup ran. See [Confirm backup completed in administration portal](azure-stack-backup-back-up-azure-stack.md).
