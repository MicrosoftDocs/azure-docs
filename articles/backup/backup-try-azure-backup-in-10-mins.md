<properties
   pageTitle="Learn to back up files and folders from Windows to Azure | Microsoft Azure"
   description="Learn how to backup Windows Server data by creating a vault, installing the backup agent, and backing up your files and folders to Azure."
   services="backup"
   documentationCenter=""
   authors="Jim-Parker"
   manager="jwhit"
   editor=""
   keywords="how to backup; how to back up"/>

<tags
   ms.service="backup"
   ms.workload="storage-backup-recovery"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.date="04/14/2016"
   ms.author="jimpark;"/>

# First look: back up files and folders from Windows Server or client to Azure

This article explains how to back up your Windows Server (or Windows client) files and folders to Azure using Azure Backup. It's a tutorial intended to walk you through the basics. If you want to get started using Azure Backup, you're in the right place.

If you want to know more about Azure Backup, read this [overview](backup-introduction-to-azure-backup.md).

Backing up files and folders to Azure requires these activities:

![Step 1](./media/backup-try-azure-backup-in-10-mins/step-1.png) Get an Azure subscription (if you don't already have one).<br>
![Step 2](./media/backup-try-azure-backup-in-10-mins/step-2.png) Create a backup vault and download the necessary items.<br>
![Step 3](./media/backup-try-azure-backup-in-10-mins/step-3.png) Install and register the backup agent.<br>
![Step 4](./media/backup-try-azure-backup-in-10-mins/step-4.png) Back up your files and folders.


![How to back up your Windows machine with Azure Backup](./media/backup-try-azure-backup-in-10-mins/windows-machine-backup-process.png)

## Step 1: Get an Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) that lets you access any Azure service.

## Step 2: Create a backup vault and download the necessary items

To back up your files and folders, you need to create a backup vault in the region where you want to store the data. You also determine how storage is replicated and download credentials and the backup agent.

### To create a backup vault

1. If you haven't already done so, sign in to the [Azure Portal](https://portal.azure.com/) using your Azure subscription.

2. Click **New > Hybrid Integration > Backup**.

    ![Begin preparing to back up your files and folders](./media/backup-try-azure-backup-in-10-mins/second-blade-backup.png)

3. For **Name**, enter a friendly name to identify the backup vault.

4. For **Region**, select the region closest to your location for faster file transfers.

5. Click **CREATE VAULT**.

    ![Create a vault](./media/backup-try-azure-backup-in-10-mins/demo-vault-name.png)

    When the backup vault is ready, it’s listed in the resources for Recovery Services as **Active**.

    ![Vault status is active](./media/backup-try-azure-backup-in-10-mins/recovery-services-select-vault.png)

After creating the vault, you select how your storage is replicated.

>[AZURE.NOTE] You must choose how storage is replicated right after creating a vault and before any machines are registered to it. Once an item has been registered to the vault, storage replication is locked and can't be modified.

### To select how storage is replicated

1. Click the vault you created.
2. On the Quick Start page, select **Configure**.

    ![Configure vault](./media/backup-try-azure-backup-in-10-mins/configure-vault.png)

3. Choose the appropriate storage option.

    If you're using Azure as your primary backup, choose [geo-redundant storage](../storage/storage-redundancy.md#geo-redundant-storage). If you're using Azure as a tertiary backup, choose [locally redundant storage](../storage/storage-redundancy.md#locally-redundant-storage).

    ![Choose storage replication option](./media/backup-try-azure-backup-in-10-mins/geo-redundant.png)

4. If you selected **Locally Redundant**, click **Save** since **Geo Redundant** is the default.

You use vault credentials to authenticate your machine with the backup vault. Here's how you download those credentials.

### To download vault credentials
The vault credentials file is used only during the registration process and expires after 48 hours.

1. To return to the **Quick Start** page for your vault, click
    ![Select your new vault](./media/backup-try-azure-backup-in-10-mins/quick-start-icon.png)

2. Click **Download vault credentials > Save**.

Next, you download the backup agent.

### To download the backup agent

Click **Agent for Windows Server or System Center Data Protection Manager or Windows Client > Save**.

![Save the backup agent](./media/backup-try-azure-backup-in-10-mins/agent.png)

Now that your vault is created and you've downloaded everything, you install and register the backup agent.

## Step 3: Install and register the backup agent

1. Double click the **MARSagentinstaller.exe** from the saved location.
2. Complete the Microsoft Azure Recovery Services Agent Setup Wizard. To complete the wizard, you need to:
    - Choose a location for the installation and cache folder.
    - Provide your proxy server info if you use a proxy server to connect to the internet.
    - Provide your user name and password details if you use an authenticated proxy.
    - Save the encryption passphrase in a secure location.

    >[AZURE.NOTE] If you lose or forget the passphrase, Microsoft cannot help recover the backup data. Please save the file in a secure location. It is required to restore a backup.

The agent is now installed and your machine is registered to the vault. You're ready to configure and schedule your backup.

## Step 4: Back up your files and folders
If the backup agent isn't already open, you can find it by searching your machine for Microsoft Azure Backup.

1. In the **Backup agent**, click **Schedule Backup**.

    ![Schedule a Windows Server Backup](./media/backup-try-azure-backup-in-10-mins/snap-in-schedule-backup-closeup.png)

2. Complete the Schedule Backup Wizard. While completing the wizard, you will:

    - Select which files and folders you want to back up.
    - Specify your backup schedule (daily or weekly).
    - Determine your retention policy.
    - Choose how you want to complete the initial backup (over the network, or offline).

    Learn more about [completing the initial backup offline](backup-azure-backup-import-export.md).
<br><br>

3. When the wizard is complete, return to the **Backup agent** and click **Back Up Now** to complete the initial backup over the network.

    ![Windows Server backup now](./media/backup-try-azure-backup-in-10-mins/backup-now.png)

4. On the **Confirmation** screen, click **Back Up**. If you close the wizard before the backup process completes, it continues to run in the background.

    When the initial backup is done, the **Jobs** view in the console shows that the job is completed.

    ![Initial backup complete](./media/backup-try-azure-backup-in-10-mins/ircomplete.png)

Congratulations, you've successfully backed up your files and folders to Azure Backup.

## Next steps
- Get more details about [backing up Windows machines](backup-configure-vault.md).
- Now that you've backed up your files and folders, you can [manage your vaults and servers](backup-azure-manage-windows-server.md).
- If you need to restore a backup, use this article to [restore files to a Windows machine](backup-azure-restore-windows-server.md).
