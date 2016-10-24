<properties
	pageTitle="Security Features for protecting hybrid backups using Azure Backup | Microsoft Azure"
	description="Learn how to use security features in Azure Backup to make backups more secure"
	services="backup"
	documentationCenter=""
	authors="JPallavi"
	manager="vijayts"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/24/2016"
	ms.author="JPallavi" />
  
# Security features for protecting hybrid backups using Azure Backup
This article talks about security features enabled in Microsoft Azure Recovery Services Agent to guard against machine compromise and other attacks. These features are built on three pillars of security:

1. **Prevention** - An additional layer of security is added whenever a critical operation like Change Passphrase is performed. This is to ensure that such operations can be performed only by users having valid Azure credentials. Also, more number of minimum recovery points are maintained to guard against corrupt data. 

2. **Alerting** - Email notification is sent to subscription admin whenever a critical operation like Delete Backup data is performed. This ensures that user is timely notified about such actions.

3. **Recovery** - Deleted backup data is retained for additional 14 days from the date of delete. This ensures recoverability of the data within given time period so there is no data loss even if attack happens.

## Enabling Security features 
Users creating new recovery services vault would be able to avail all the Security Features. For existing recovery services vault, following steps should be used to enabled these features:

1. Log in to Azure portal using Azure credentials

2. Type in Recovery Services in the Hub menu to navigate to recovery services list. 
	The list of recovery services vaults appears. From this list, select a vault. The selected vault dashboard opens.

3. Click on **Settings** and select **Properties**.

4. Click on **Update** under **Security Settings**.
	This would open Security Settings blade which lets you Enable these features and gives summary of the feature.
	
5. Use the toggle button to **Enable** and click on **Save** button on top to save Security Settings as shown in the figure above.

> [AZURE.NOTE]
1. Security Features should be enabled only if you are using: <br>
	i. MAB agent - minimum agent version 2.0.9052  
	ii. Azure Backup Server - minimum MAB agent version 2.0.9052 with Azure Backup Server upgrade 1 <br>
	iii. DPM - Do not enable this for DPM, this feature is coming soon in future URs <br>
2. Once enabled, you will get Security Features for all the Azure Recovery Services Agent (MARS) machines and Azure Backup Server registered with the vault. <br>
3. This is a one-time action and you cannot disable these features after enabling them. <br>

## Recovering deleted backup data
As a security measure, Azure Backup will retain deleted backup data for additional 14 days and not delete it immediately if Stop backup with delete backup data operation is performed. To restore this data in the 14 day period, use the following steps:

1. If the machine where backups were happening is still available, use [Recover Data feature](backup-azure-restore-windows-server.md) in MARS to get all the old recovery points.

2. If the above machine is not available, use [Alternate Server Recovery](backup-azure-restore-windows-server.md) to use another MARS machine to get this data.

## Preventing attacks
As part of this feature, few validations have been added to make sure only valid users can perform various operations.

### Authentication to perform critical operations
As part of adding extra layer of authentication for critical operations, you would be prompted to enter Security PIN when performing Stop Protection with Delete data and Change Passphrase operations. 

To receive Security PIN, use the following steps:

1. Log in to Azure portal.

2. Navigate to recovery service vault > Settings > Properties.

3. Click on **Generate** under Security PIN. This opens a blade which contains Security PIN to be entered in Azure Recovery Services Agent UI. 
	This PIN is valid only for 5 mintues and gets generated automatically after that.
	
### Maintaing minimum retention range
To ensure that there are always a valid number of recovery points available, following checks have been added:

1. For daily retention, minimum 7 days of retention should be done

2. For weekly retention, minimum 4 weeks of retention should be done

3. For monthly retention, minimum 3 months of retention should be done

4. For yearly retention, minimum 1 year of retention should be done

## Notifications for critical operations
Whenever some critical opeartions are performed, subscription admin would be sent an email notification with details about the operation. If you want to configure additional email ids to receive email notifications, you can use Azure portal to configure them.

The above Security features would provide defense mechanism against targeted attacks, preventing attackers to harm the backups and more importantly, provide ability to recover if at all attack happens.
