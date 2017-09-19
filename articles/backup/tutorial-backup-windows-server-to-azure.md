---
title: Backup Windows Server to Azure | Microsoft Docs
description: This tutorial details backing up on-premises Windows Servers to a Recovery Services vault.
services: backup
documentationcenter: ''
author: saurabhsensharma
manager: shivamg
editor: ''
keywords: windows server backup; back up windows server; backup and disaster recovery

ms.assetid: 
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: saurabhsensharma;markgal;
ms.custom:

---
# Backup Windows Server to Azure

You can use Azure Backup to protect your Windows Server from corruptions, attacks, and disasters. Azure Backup provides a lightweight tool known as the Microsoft Azure Recovery Services (MARS) Agent. The MARS Agent can be installed on the Windows Server and used to protect files and folders, and server configuration info (via Windows Server System State). This tutorial explains how you can use MARS Agent to backup your Windows Server to Azure. In this tutorial you will learn how to: 

> [!div class="checklist"]
> * Download and setup the MARS Agent
> * Configure backup times and retention schedule for your server’s backups
> * Perform an ad-hoc backup

This tutorial assumes you already have an Azure Subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Recovery Services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a container in Azure that stores the backups from your Windows Server. Follow the steps below to create a Recovery Services Vault. 

1.  Sign in to the [Azure Portal](https://portal.azure.com) using your Azure subscription.
2.	On the Hub menu, click **New** and in the list of resources, type **Recovery Services** and click **Recovery Services vaults**.
3.	On the **Recovery Services vaults** menu, click **Add**.
4.	In the **Recovery Services vault** blade that opens, provide the following information:
    - For **Name**, provide a friendly name that starts with a letter and contains a combination of letters, numbers or hyphens 
    - For **Resource group**, ensure **Create New** is chosen and provide a friendly name for the resource group. 
    - For **Location**, select the geographical region where the backup data is sent.
5.	At the bottom of the **Recovery Services vault** blade, click **Create**. Monitor the status notifications in the upper right-hand area of the portal. 

Once your vault is created, it appears in the list of Recovery Services vaults.

## Download MARS Agent

1.	Click on the newly created Recovery services Vault from the **Recovery Services vaults** menu
2.	On the **Recovery Services vault** blade (for the vault you just created), in the **Getting Started** section, click **Backup**. 
3.	On the blade that opens, select :
    - **On-premises**, for **Where is your workload running?**
    - **Files and Folders**, and **System State** for **What do you want to backup?**
 
4.	Click on **Prepare Infrastructure** on the same blade
5.	On the **Prepare infrastructure** blade, click **Download Agent for Windows Server or Windows Client**. This downloads the **MARSAgentInstaller.exe**.
 
6.	Before you run the installer, click the **Download** button on the Prepare infrastructure blade to download and save the **Vault Credentials** file. This file is required for connecting the MARS Agent with the Recovery Services Vault.
 
## Install and register MARS agent

1.	Locate and double-click the downloaded **MARSagentinstaller.exe**
2.	The **Microsoft Azure Recovery Services Agent Setup Wizard** appears. Provide the following information when prompted and click **Register**
    - Location for the installation and cache folder.
    - Proxy server info if you use a proxy server to connect to the internet.
    - Your user name and password details if you use an authenticated proxy.
3.	Click on **Proceed to Registration** in the wizard and provide the downloaded **Vault Credentials** file 
4.	When prompted, provide an encryption passphrase that would be used to encrypt backups from your Windows Server. Ensure to save the passphrase in a secure location as Microsoft cannot recover the passphrase if it is lost.  
5.	Click **Finish**. 

## Configure Backup and Retention 
1.	Open the Microsoft Azure Recovery Services agent. You can find it by searching your machine for **Microsoft Azure Backup**.
2.	In the Recovery Services agent console, click **Schedule Backup** under the **Actions Pane**.
3.	Click **Next** to navigate to the **Select Items to Backup** page
4.	Click **Add Items** and from the dialog box that opens select **System State** and files or folders that you want to backup. Then click **OK**.
5.	Click **Next**.
6.	On the **Specify Backup Schedule** page, specify the times of the day or week when backups need to be triggered for files and folders. System State backup schedule is automatically configured.  
7.	On the **Select Retention Policy** page, select the Retention Policy for the backup copy for files and folders. System State backups’ retention is automatically set to 60 days.
8.	On the **Choose Initial Backup Type** page, leave the option **Automatically over the network** selected, and then click **Next**.
9.	On the **Confirmation** page, review the information, and then click **Finish**.
10.	After the wizard finishes creating the backup schedule, click **Close**.

## Perform an ad-hoc backup
1.	In the Recovery Services agent console, click **Back Up Now**  
2.	On the **Confirmation** page, review the settings that the Back Up Now Wizard will use to back up your server. Then click **Back Up**.
3.	Click **Close** to close the wizard. If you close the wizard before the backup process finishes, the wizard continues to run in the background.
4.	After the initial backup is completed, **Job completed** status appears in **Jobs** pane of the MARS Agent console.


## Next steps
•	Now that you've backed up your Windows Server, learn how you can [Recover Files from Azure to your Windows Server.](azure-docs-pr/articles/backup/backup-azure-restore-windows-server.md)
