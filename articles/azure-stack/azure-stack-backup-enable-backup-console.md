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
ms.date: 07/11/2018
ms.author: jeffgilb
---
# Enable backup for Azure Stack from the administration portal
Enable the Infrastructure Backup Service through the administration portal so that Azure Stack can generate backups. You can use these backups to restore your environment using cloud recovery in the event of [a catastrophic failure](.\azure-stack-backup-recover-data.md). The purpose of cloud recovery is to ensure that your operators and users can log back into the portal after recovery is complete. Users will have their subscriptions restored including role-based access permissions and roles, original plans, offers, and previously defined compute, storage, and network quotas.

However, the Infrastructure Backup Service does not backup IaaS VMs, network configurations, and storage resources such as storage accounts, blobs, tables, and so on, so users logging in after cloud recovery completes will not see any of their previously existing resources. Platform as a Service (PaaS) resources and data are also not backed up by the service. 

Administrators and users are responsible for backing up and restoring IaaS and PaaS resources separately from the infrastructure backup processes. For information about backing up IaaS and PaaS resources, see the following links:

- [Virtual Machines](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-manage-vm-protect)
- [App Service](https://docs.microsoft.com/azure/app-service/web-sites-backup)
- [SQL Server](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-iaas-overview)


> [!Note]  
> Before you enable the backup through the console, you need to configure the backup service. You can configure the backup service using PowerShell. For more information, see [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).

## Enable backup

1. Open the Azure Stack administration portal at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.

    ![Azure Stack - Backup controller settings](media\azure-stack-backup\azure-stack-backup-settings.png).

3. Type the path to the **Backup storage location**. Use a Universal Naming Convention (UNC) string for the path to a file share hosted on a separate device. A UNC string specifies the location of resources such as shared files or devices. For the service, you can use an IP address. To ensure availability of the backup data after a disaster, the  device should be in a separate location.
    > [!Note]  
    > If your environment supports name resolution from the Azure Stack infrastructure network to your enterprise environment, you can use an FQDN rather than the IP.
4. Type the **Username** using the domain and username with sufficient access to read and write files. For example, `Contoso\backupshareuser`.
5. Type the **Password** for the user.
5. Type the password again to **Confirm Password**.
6. Provide a pre-shared key in the **Encryption Key** box. Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view this key from this interface. For more instructions to generate a pre-shared key, follow the scripts at [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).
7. Select **OK** to save your backup controller settings.

To execute a backup, you need to download the Azure Stack Tools, and then run the PowerShell cmdlet **Start-AzSBackup** on your Azure Stack administration node. For more information, see [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).

## Next steps

- Learn to run a backup. See [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).
- Learn to verify that your backup ran. See [Confirm backup completed in administration portal](azure-stack-backup-back-up-azure-stack.md).
