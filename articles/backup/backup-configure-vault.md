<properties
	pageTitle="Back up a Windows Server or client to Azure | Microsoft Azure"
	description="Back up Windows Servers or clients to Azure by creating a backup vault, downloading credentials, installing the backup agent, and completing an initial backup of your files and folders."
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""
	keywords="backup vault; back up a Windows Server; backup windows;"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/19/2016"
	ms.author="jimpark; trinadhk; markgal"/>


# Back up a Windows Server or client to Azure
This article covers the procedures you need to prepare your environment and back up a Windows Server (or client) to Azure. It also covers considerations for deploying your backup solution. If you're interested in trying Azure Backup for the first time, this article will quickly walk you through the process.

![Create vault](./media/backup-configure-vault/initial-backup-process.png)

## Before you start
To back up a Windows Server (or client) to Azure, you need an Azure account. If you don't have one, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

## Step 1: Create a backup vault
To back up files and folders from a Windows Server or client you need to create a backup vault in the geographic region where you want to store the data.

### To create a backup vault

1. Sign in to the [Management Portal](https://manage.windowsazure.com/).

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault**, and then choose **Quick Create**.

3. For the **Name** parameter, enter a friendly name for the backup vault. Type a name that contains between 2 and 50 characters. It must start with a letter, and can contain only letters, numbers, and hyphens. This name needs to be unique for each subscription.

4. For the **Region** parameter, select the geographic region for the backup vault. This choice determines the geographic region where your backup data is sent. By choosing a geographic region close to your location, you can reduce network latency when backing up to Azure.

5. Click **Create Vault**.

    ![Create vault](./media/backup-configure-vault/demo-vault-name.png)

    It can take a while for the backup vault to be created. To check the status,  monitor the notifications at the bottom of the portal.

    After the backup vault has been created, you'll see a message saying the vault has been successfully created. It also appears as **Active** in the recovery services resource list.

    ![Creating vault status](./media/backup-configure-vault/recovery-services-select-vault.png)

4. Select the **storage redundancy** option.

    >[AZURE.IMPORTANT] The best time to identify your storage redundancy option is right after vault creation and before any machines are registered to the vault. Once an item has been registered to the vault, the storage redundancy option is locked and cannot be modified.

    If you are using Azure as a primary backup storage endpoint (for example, you are backing up to Azure from a Windows Server), consider picking (the default) [geo-redundant storage](../storage/storage-redundancy.md#geo-redundant-storage) option.

    If you are using Azure as a tertiary backup storage endpoint (for example, you are using SCDPM to have a local backup copy on-premises and using Azure for  long term retention needs),  consider choosing [locally redundant storage](../storage/storage-redundancy.md#locally-redundant-storage). This brings down the cost of storing data in Azure, while providing a lower level of durability for your data that might be acceptable for tertiary copies.

    **To select the storage redundancy option:**

    a. Click on the vault you just created.

    b. On the **Quick Start** page, select **Configure**.

    ![Configure Vault status](./media/backup-configure-vault/configure-vault.png)

    c. Choose the appropriate storage redundancy option.

    If you select **Locally Redundant**, you need to click **Save** (because **Geo Redundant** is the default option).

    d. In the left navigation pane, click **Recovery Services** to return to the list of resources for Recovery Services.

## Step 2: Download the vault credential file
The on-premises machine (Windows Server or Windows client) needs to be authenticated with a backup vault before it can back up data to Azure. The authentication is achieved using *vault credentials*. The vault credential file is downloaded through a secure channel from the Azure portal. The Azure Backup service is unaware of the certificate private key, which does not persist in the portal or the service.

Learn more about [using vault credentials to authenticate with the Azure Backup service](backup-introduction-to-azure-backup.md#what-is-the-vault-credential-file).

### To download the vault credential file to a local machine

1. Click **Recovery Services** in the left navigation pane and select the backup vault that you created.

    ![IR complete](./media/backup-configure-vault/rs-left-nav.png)

2.  On the **Quick Start** page, click **Download vault credentials**.

    The portal will generate a vault credential using a combination of the vault name and the current date. The vault credentials file is used only during the registration workflow and expires after 48 hours.

    The vault credentials file can be downloaded from the portal.

3. Click **Save** to download the vault credentials to the downloads folder of the local account, or select **Save As** from the **Save** menu to specify a location for the vault credentials.

    >[AZURE.NOTE] Make sure the vault credential file is saved in a location that can be accessed from your machine. If it is stored in a file share/SMB, verify that you have the permissions to access it.

## Step 3: Download, install, and register the Azure backup agent
After creating the Azure backup vault and downloading the vault credentials, an agent must be installed on each of your Windows computers (Windows Server or Windows client).

### To download, install, and register the agent

1. Click **Recovery Services**, then select the backup vault that you want to register with a server.

2. On the Quick Start page, click **Agent for Windows Server or System Center Data Protection Manager or Windows client**. Then click **Save**.

    ![Save agent](./media/backup-configure-vault/agent.png)

3. After the *MARSagentinstaller.exe* file has downloaded, click **Run** (or double click **MARSAgentInstaller.exe** from the saved location).

4. 	Choose the installation folder and cache folder that are required for the agent, and then click **Next**.

    The cache location you specify must have free space equal to at least 5% of the backup data.

5. You can continue to connect to the Internet through the default proxy settings. Or, if you use a proxy server to connect to the Internet, on the Proxy configuration screen, check the **Use custom proxy settings** box and enter the proxy server details.

    If you use an authenticated proxy, enter the user name and password details.

    Click **Next**.

6. Click **Install** to begin the agent installation.

    The Azure Backup agent installs .NET Framework 4.5 and Windows PowerShell (if it’s not already installed) to complete the installation.

7. Once the agent is installed, click **Proceed to Registration** to continue with the workflow.

8. On the Vault Identification screen, browse to and select the vault credentials file you previously downloaded.

    The vault credentials file is only valid for 48 hours after it’s downloaded from the portal. If you encounter any error in this screen (for example, “Vault credentials file provided has expired”), sign in to the portal and download the vault credentials file again.

    Ensure that the vault credentials file is available in a location that can be accessed by the setup application. If you encounter access-related errors, copy the vault credentials file to a temporary location on the same computer and retry the operation.

    If you encounter an invalid vault credential error (for example, “Invalid vault credentials provided"), the file is either corrupted or does not have the latest credentials associated with the recovery service. Retry the operation after downloading a new vault credential file from the portal. This error is typically seen if the user clicks the **Download vault credential** option in quick succession. In this case, only the last vault credential file is valid.

9. On the Encryption setting screen, you can either generate a passphrase or provide a passphrase (minimum of 16 characters). Remember to save the passphrase in a secure location.

10. Click **Finish**.

    > [AZURE.WARNING] If you lose or forget the passphrase, Microsoft cannot help recover the backup data. You own the encryption passphrase and Microsoft does not have visibility into the passphrase you use. Save the file in a secure location because it will be required during a recovery operation.

    The **Register Server Wizard** registers the server with Microsoft Azure Backup.

10. Once the **encryption key** is set, leave the **Launch Microsoft Azure Recovery Services Agent** checkbox checked, and click **Close**.

## Step 4: Complete the initial backup

The initial backup is comprised of two key tasks:
- Creating the backup schedule
- Backing up files and folder for the first time

After completing the initial backup, the backup policy creates backup points that you can use if you need to recover the data. The backup policy does this based on the schedule that you define.

### Schedule the backup

1. Open the Microsoft Azure Backup agent (it will open automatically if you left the **Launch Microsoft Azure Recovery Services Agent** checkbox checked when you closed the Register Server Wizard, or you can find it by searching your machine for *Microsoft Azure Backup*).

    ![Launch the Microsoft Azure Backup Agent](./media/backup-configure-vault/snap-in-search.png)

2. In the Microsoft Azure Backup agent, click **Schedule Backup**.

    ![Schedule a Windows Server backup](./media/backup-configure-vault/schedule-backup-close.png)

3. On the Schedule Backup Wizard Getting started screen, click **Next**.

4. On the Select Items to Backup screen, click **Add Items**.

5. Select the files and folders you want to back up and click **Okay**.

6. Click **Next**.

7. On the Specify Backup Schedule screen, specify the **backup schedule**, and then click **Next**.

You can schedule daily backups (with a maximum of 3 times per day) or weekly backups.

    ![Items for Windows Server Backup](./media/backup-configure-vault/specify-backup-schedule-close.png)

    >[AZURE.NOTE] Specifying the backup schedule is explained in detail in this [article](backup-azure-backup-cloud-as-tape.md).

8. On the Select Retention Policy screen, select the **Retention Policy** for the backup copy, and then click **Next**.

    The retention policy specifies the duration for which the backup will be stored. Rather than just specifying a “flat policy” for all backup points, you can specify different retention policies based on when the backup occurs. You can modify the daily, weekly, monthly, and yearly retention policies to meet your needs.

9. On the Choose Initial Backup Type screen, choose the initial backup type. Leave the **Automatically over the network** option selected and click **Next**.

    You can back up automatically over the network, or you can back up offline. The remainder of this article follows the process for backing up automatically. If you prefer to do an offline backup, review the article [Offline backup workflow in Azure Backup](backup-azure-backup-import-export.md) for additional information.

10. On the Confirmation screen, review the information and click **Finish**.

11. Once the wizard finishes creating the backup schedule, click **Close**.

### Enable network throttling (optional)

The Azure Backup agent provides network throttling. Throttling controls how network bandwidth is used during data transfer. This control can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other Internet traffic. Throttling of data transfer applies to back up and restore activities.

1. In the Backup agent, click **Change Properties**.

    ![Change properties](./media/backup-configure-vault/change-properties.png)

2. On the **Throttling** tab, select the **Enable internet bandwidth usage throttling for backup operations** check box.

    ![Network throttling](./media/backup-configure-vault/throttling-dialog.png)

3. Once you have enabled throttling, specify the allowed bandwidth for backup data transfer during **Work hours** and **Non-work hours**.

    The bandwidth values begin at 512 kilobytes per second (Kbps) and can go up to 1023 megabytes per second (Mbps). You can also designate the start and finish for **Work hours**, and which days of the week are considered work days. The time outside of the designated work hours is considered non-work hours.

4. Click **OK**.

### Back up now

1. In the **Backup agent**, click **Back Up Now** to complete the initial seeding over the network.

    ![Windows Server backup now](./media/backup-configure-vault/backup-now.png)

2. On the Confirmation screen, review the settings the wizard will use to back up the machine and click **Back Up**.

3. Click **Close** to close the wizard. You can do this before the backup process finishes and it will continue to run in the background.

After the initial backup is completed,  the *Job completed* status is reflected in the **Azure Backup console**.

![IR complete](./media/backup-configure-vault/ircomplete.png)

## Next steps
- Sign up for a [free Azure account](https://azure.microsoft.com/free/).

For additional information about backing up VMs or other workloads, see:

- [Back up IaaS VMs](backup-azure-vms-prepare.md)
- [Back up workloads to Azure with Microsoft Azure Backup Server](backup-azure-microsoft-azure-backup.md)
- [Back up workloads to Azure with DPM](backup-azure-dpm-introduction.md).
