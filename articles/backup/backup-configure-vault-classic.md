---
title: Back up Windows server or workstation to Azure (classic model) | Microsoft Docs
description: Backup Windows servers or clients to a backup vault in Azure. Go through basics for protecting files and folders to a Backup vault by using the Azure Backup agent.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: backup vault; back up a Windows server; backup windows;

ms.assetid: 3b543bfd-8978-4f11-816a-0498fe14a8ba
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: markgal;trinadhk;

---
# Back up a Windows server or workstation to Azure using the classic portal
> [!div class="op_single_selector"]
> * [Classic portal](backup-configure-vault-classic.md)
> * [Azure portal](backup-configure-vault.md)
>
>

This article covers the procedures that you need to follow to prepare your environment and back up a Windows server (or workstation) to Azure. It also covers considerations for deploying your backup solution. If you're interested in trying Azure Backup for the first time, this article quickly walks you through the process.


> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: Resource Manager and classic. This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.
>
>

## Before you start
To back up a server or client to Azure, you need an Azure account. If you don't have one, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

## Create a backup vault
To back up files and folders from a server or client, you need to create a backup vault in the geographic region where you want to store the data.

> [!IMPORTANT]
> Starting March 2017, you can no longer use the classic portal to create Backup vaults.
>
> You can now upgrade your Backup vaults to Recovery Services vaults. For details, see the article [Upgrade a Backup vault to a Recovery Services vault](backup-azure-upgrade-backup-to-recovery-services.md). Microsoft encourages you to upgrade your Backup vaults to Recovery Services vaults.<br/> **Starting November 1, 2017**:
>- Any remaining Backup vaults will be automatically upgraded to Recovery Services vaults.
>- You won't be able to access your backup data in the classic portal. Instead, use the Azure portal to access your backup data in Recovery Services vaults.
>


## Download the vault credential file
The on-premises machine needs to be authenticated with a backup vault before it can back up data to Azure. The authentication is achieved through *vault credentials*. The vault credential file is downloaded through a secure channel from the classic portal. The certificate private key does not persist in the portal or the service.

### To download the vault credential file to a local machine
1. In the left navigation pane, click **Recovery Services**, and then select the backup vault that you created.

    ![IR complete](./media/backup-configure-vault-classic/rs-left-nav.png)
2. On the Quick Start page, click **Download vault credentials**.

   The classic portal generates a vault credential by using a combination of the vault name and the current date. The vault credentials file is used only during the registration workflow and expires after 48 hours.

   The vault credential file can be downloaded from the portal.
3. Click **Save** to download the vault credential file to the Downloads folder of the local account. You can also select **Save As** from the **Save** menu to specify a location for the vault credential file.

   > [!NOTE]
   > Make sure the vault credential file is saved in a location that can be accessed from your machine. If it is stored in a file share or server message block, verify that you have the permissions to access it.
   >
   >

## Download, install, and register the Backup agent
After you create the backup vault and download the vault credential file, an agent must be installed on each of your Windows machines.

### To download, install, and register the agent
1. Click **Recovery Services**, and then select the backup vault that you want to register with a server.
2. On the Quick Start page, click the agent **Agent for Windows Server or System Center Data Protection Manager or Windows client**. Then click **Save**.

    ![Save agent](./media/backup-configure-vault-classic/agent.png)
3. After the MARSagentinstaller.exe file has downloaded, click **Run** (or double-click **MARSAgentInstaller.exe** from the saved location).
4. Choose the installation folder and cache folder that are required for the agent, and then click **Next**. The cache location you specify must have free space equal to at least 5 percent of the backup data.
5. You can continue to connect to the Internet through the default proxy settings.             If you use a proxy server to connect to the Internet, on the Proxy Configuration page, select the **Use custom proxy settings** check box, and then enter the proxy server details. If you use an authenticated proxy, enter the user name and password details, and then click **Next**.
6. Click **Install** to begin the agent installation. The Backup agent installs .NET Framework 4.5 and Windows PowerShell (if it’s not already installed) to complete the installation.
7. After the agent is installed, click **Proceed to Registration** to continue with the workflow.
8. On the Vault Identification page, browse to and select the vault credential file that you previously downloaded.

    The vault credential file is valid for only 48 hours after it’s downloaded from the portal. If you encounter an error on this page (such as “Vault credentials file provided has expired”), sign in to the portal and download the vault credential file again.

    Ensure that the vault credential file is available in a location that can be accessed by the setup application. If you encounter access-related errors, copy the vault credential file to a temporary location on the same machine and retry the operation.

    If you encounter a vault credential error such as “Invalid vault credentials provided," the file is damaged or does not have the latest credentials associated with the recovery service. Retry the operation after downloading a new vault credential file from the portal. This error can also occur if a user clicks the **Download vault credential** option several times in quick succession. In this case, only the last vault credential file is valid.
9. On the Encryption Setting page, you can either generate a passphrase or provide a passphrase (with a minimum of 16 characters). Remember to save the passphrase in a secure location.
10. Click **Finish**. The Register Server Wizard registers the server with Backup.

    > [!WARNING]
    > If you lose or forget the passphrase, Microsoft cannot help you recover the backup data. You own the encryption passphrase, and Microsoft does not have visibility into the passphrase that you use. Save the file in a secure location because it will be required during a recovery operation.
    >
    >

11. After the encryption key is set, leave the **Launch Microsoft Azure Recovery Services Agent** check box selected, and then click **Close**.

## Complete the initial backup
The initial backup includes two key tasks:

* Creating the backup schedule
* Backing up files and folders for the first time

After the backup policy completes the initial backup, it creates backup points that you can use if you need to recover the data. The backup policy does this based on the schedule that you define.

### To schedule the backup
1. Open the Microsoft Azure Backup agent. (It will open automatically if you left the **Launch Microsoft Azure Recovery Services Agent** check box selected when you closed the Register Server Wizard.) You can find it by searching your machine for **Microsoft Azure Backup**.

    ![Launch the Azure Backup agent](./media/backup-configure-vault-classic/snap-in-search.png)
2. In the Backup agent, click **Schedule Backup**.

    ![Schedule a Windows Server backup](./media/backup-configure-vault-classic/schedule-backup-close.png)
3. On the Getting started page of the Schedule Backup Wizard, click **Next**.
4. On the Select Items to Backup page, click **Add Items**.
5. Select the files and folders that you want to back up, and then click **Okay**.
6. Click **Next**.
7. On the **Specify Backup Schedule** page, specify the **backup schedule** and click **Next**.

    You can schedule daily (at a maximum rate of three times per day) or weekly backups.

    ![Items for Windows Server Backup](./media/backup-configure-vault-classic/specify-backup-schedule-close.png)

   > [!NOTE]
   > For more information about how to specify the backup schedule, see the article [Use Azure Backup to replace your tape infrastructure](backup-azure-backup-cloud-as-tape.md).
   >
   >

8. On the **Select Retention Policy** page, select the **Retention Policy** for the backup copy.

    The retention policy specifies the duration for which the backup will be stored. Rather than just specifying a “flat policy” for all backup points, you can specify different retention policies based on when the backup occurs. You can modify the daily, weekly, monthly, and yearly retention policies to meet your needs.
9. On the Choose Initial Backup Type page, choose the initial backup type. Leave the option **Automatically over the network** selected, and then click **Next**.

    You can back up automatically over the network, or you can back up offline. The remainder of this article describes the process for backing up automatically. If you prefer to do an offline backup, review the article [Offline backup workflow in Azure Backup](backup-azure-backup-import-export.md) for additional information.
10. On the Confirmation page, review the information, and then click **Finish**.
11. After the wizard finishes creating the backup schedule, click **Close**.

### Enable network throttling (optional)
The Backup agent provides network throttling. Throttling controls how network bandwidth is used during data transfer. This control can be helpful if you need to back up data during work hours but do not want the backup process to interfere with other Internet traffic. Throttling applies to back up and restore activities.

**To enable network throttling**

1. In the Backup agent, click **Change Properties**.

    ![Change properties](./media/backup-configure-vault-classic/change-properties.png)
2. On the **Throttling** tab, select the **Enable internet bandwidth usage throttling for backup operations** check box.

    ![Network throttling](./media/backup-configure-vault-classic/throttling-dialog.png)
3. After you have enabled throttling, specify the allowed bandwidth for backup data transfer during **Work hours** and **Non-work hours**.

    The bandwidth values begin at 512 kilobits per second (Kbps) and can go up to 1,023 megabytes per second (MBps). You can also designate the start and finish for **Work hours**, and which days of the week are considered work days. Hours outside of designated work hours are considered non-work hours.
4. Click **OK**.

### To back up now
1. In the Backup agent, click **Back Up Now** to complete the initial seeding over the network.

    ![Windows Server backup now](./media/backup-configure-vault-classic/backup-now.png)
2. On the Confirmation page, review the settings that the Back Up Now Wizard will use to back up the machine. Then click **Back Up**.
3. Click **Close** to close the wizard. If you do this before the backup process finishes, the wizard continues to run in the background.

After the initial backup is completed, the **Job completed** status appears in the Backup console.

![IR complete](./media/backup-configure-vault-classic/ircomplete.png)

## Next steps
* Sign up for a [free Azure account](https://azure.microsoft.com/free/).

For additional information about backing up VMs or other workloads, see:

* [Back up IaaS VMs](backup-azure-vms-prepare.md)
* [Back up workloads to Azure with Microsoft Azure Backup Server](backup-azure-microsoft-azure-backup.md)
* [Back up workloads to Azure with DPM](backup-azure-dpm-introduction.md)
