---
title: Security Features for protecting hybrid backups using Azure Backup | Microsoft Docs
description: Learn how to use security features in Azure Backup to make backups more secure
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 47bc8423-0a08-4191-826d-3f52de0b4cb8
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/17/2017
ms.author: pajosh

---
# Security features for protecting hybrid backups using Azure Backup
More and more customers are hit with security issues like malware, ransomware, intrusion etc. These security issues result in data loss and cost per security breach has been ever increasing. To guard against such attacks, Azure Backup now provides Security Features to protect hybrid backups. This article talks about how to enable and leverage these features using Microsoft Azure Recovery Services Agent and Microsoft Azure Backup Server. These features have been built on three pillars of security:

1. **Prevention** - An additional layer of authentication is added whenever a critical operation like Change Passphrase is performed. This validation is to ensure that such operations can be performed only by users having valid Azure credentials.
2. **Alerting** - Email notification is sent to subscription admin whenever a critical operation like Delete Backup data is performed. This email ensures that user is timely notified about such actions.
3. **Recovery** - Deleted backup data is retained for additional 14 days from the date of delete. This ensures recoverability of the data within given time period so there is no data loss even if attack happens. Also, more number of minimum recovery points are maintained to guard against corrupt data.

> [!NOTE]
> Security Features should be enabled only if you are using: <br/>
> * **MAB agent** - minimum agent version 2.0.9052. Once you have enabled these features, you should upgrade to this agent version to perform critical operations like Change Passphrase, Stop backup with Delete data. <br/>
> * **Azure Backup Server** - minimum MAB agent version 2.0.9052 with Azure Backup Server update 1. <br/>
> * **DPM** - minimum MAB agent version 2.0.9052 with DPM 2012 R2 UR12 or DPM 2016 UR2. <br/>
> * **IaaS VM Backup** - Do not enable these features for IaaS VM Backup. These features are not yet available for IaaS VM backup, so enabling them will not have any impact on IaaS VM backup.
> * These features are available only for Recovery Services vault.
> * All the newly created Recovery Services vaults have these features enabled by default. For existing recovery services vaults, users need to enable these features using the steps mentioned in the section below.
> * Once enabled, you get Security Features for all the Azure Recovery Services Agent (MARS) machines, Azure Backup Servers and DPM servers registered with the vault. <br/>
> * Enabling this setting is a one-time action and you cannot disable these features after enabling them. <br/>
>
>

## Enabling Security features
Users creating recovery services vault would be able to avail all the Security Features. For existing recovery services vault, following steps should be used to enable these features:

1. Log in to Azure portal using Azure credentials
2. Type in Recovery Services in the Hub menu to navigate to recovery services list.

    ![Create Recovery Services Vault step 1](./media/backup-azure-security-feature/browse-to-rs-vaults.png) <br/>

    The list of recovery services vaults appears. From this list, select a vault.

    The selected vault dashboard opens.
3. From the list of items that appears under vault, click **Properties** under **Settings**.

    ![Open vault properties](./media/backup-azure-security-feature/vault-list-properties.png)
4. Click **Update** under **Security Settings**.

    ![Open security settings](./media/backup-azure-security-feature/security-settings-update.png)

    Update link opens Security Settings blade, which lets you Enable these features and gives summary of the feature.
5. Select a value from the drop down **Have you configured Azure Multi-Factor Authentication?** to confirm if you have enabled [Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md). If it is enabled, you are asked to authenticate from another device (e.g. mobile phone) while logging in to Azure portal.

   As part of Security Features, when critical operations are performed in Azure Backup, you have to enter Security PIN available on Azure portal. Enabling Azure Multi-Factor authentication adds a layer of security, ensuring only authorized users with valid Azure credentials and authenticated from second device can access Azure portal and perform such critical operations.
6. Use the toggle button to **Enable** and click **Save** button on top to save Security Settings as shown in the figure. You can select **Enable** only after you select a value from "Have you configured Azure Multi-Factor Authentication?" drop down.

    ![Enable security settings](./media/backup-azure-security-feature/enable-security-settings.png)

## Recovering deleted backup data
As a security measure, Azure Backup retains deleted backup data for additional 14 days and does not delete it immediately if Stop backup with delete backup data operation is performed. To restore this data in the 14-day period, use the following steps:

For **Microsoft Recovery Services Agent (MARS)** users:

1. If the machine where backups were happening is still available, use [Recover data to the same machine](backup-azure-restore-windows-server.md#use-instant-restore-to-recover-data-to-the-same-machine) in MARS to recover from all the old recovery points.
2. If the machine mentioned above is not available, use [Recover to an alternate machine](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine) to use another MARS machine to get this data.

For **Azure Backup Server** users:

1. If the server where backups were happening is still available, re-protect the deleted data sources and use Recover Data feature to recover from all the old recovery points.
2. If the machine mentioned above is not available, use [Recover data from another Azure Backup Server](backup-azure-alternate-dpm-server.md#recover-data-from-another-azure-backup-server) to use another Azure Backup Server to get this data.

For **Data Protection Manager (DPM)** users:

1. If the server where backups were happening is still available, re-protect the deleted data sources and use Recover Data feature to recover from all the old recovery points.
2. If the machine mentioned above is not available, use [Add External DPM](backup-azure-alternate-dpm-server.md#recover-data-from-another-azure-backup-server) to use another DPM Server to get this data.

## Preventing attacks
As part of this feature, checks have been added to make sure only valid users can perform various operations.

### Authentication to perform critical operations
As part of adding extra layer of authentication for critical operations, you would be prompted to enter Security PIN when performing Stop Protection with Delete data and Change Passphrase operations.

To receive Security PIN, use the following steps:

1. Log in to Azure portal.
2. Navigate to recovery service vault > Settings > Properties.
3. Click **Generate** under Security PIN. Generate link opens a blade, which contains Security PIN to be entered in Azure Recovery Services Agent UI.
    This PIN is valid only for 5 minutes and gets generated automatically after that period.

### Maintaining minimum retention range
To ensure that there are always a valid number of recovery points available, following checks have been added:

1. For daily retention, minimum **seven** days of retention should be done
2. For weekly retention, minimum **four** weeks of retention should be done
3. For monthly retention, minimum **three** months of retention should be done
4. For yearly retention, minimum **one** year of retention should be done

## Notifications for critical operations
Whenever some critical operations are performed, subscription admin would be sent an email notification with details about the operation. If you want to configure additional email ids to receive email notifications, you can use Azure portal to configure them.

The Security features mentioned in this article, provide defense mechanisms against targeted attacks preventing attackers to touch the backups. More importantly, these features provide an ability to recover data if at all attack happens.

## Next Steps
* [Get started with Azure Recovery Services vault](backup-azure-vms-first-look-arm.md) to enable these features
* [Download latest Azure Recovery Services agent](http://aka.ms/azurebackup_agent) to protect Windows machines and guard your backup data against attacks
* [Download latest Azure Backup Server](https://aka.ms/latest_azurebackupserver) to protect workloads and guard your backup data against attacks
* [Download UR12 for System Center 2012 R2 Data Protection Manager](https://support.microsoft.com/help/3209592/update-rollup-12-for-system-center-2012-r2-data-protection-manager) or [download UR2 for System Center 2016 Data Protection Manager](https://support.microsoft.com/help/3209593/update-rollup-2-for-system-center-2016-data-protection-manager) to protect workloads and guard your backup data against attacks
