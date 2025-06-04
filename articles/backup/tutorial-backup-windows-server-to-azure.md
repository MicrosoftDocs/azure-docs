---
title: Tutorial - Back up Windows Server to Azure
description: This tutorial details backing up on-premises Windows Servers to a Recovery Services vault.
ms.topic: tutorial
ms.date: 05/22/2025
ms.custom: mvc, engagement-fy23
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a system administrator, I want to back up my on-premises Windows Server to a cloud storage solution, so that I can protect my files and ensure data recovery in case of corruption, cyberattacks, or disasters.
---
# Tutorial: Back up Windows Server to Azure

This tutorial describes how to back up on-premises Windows Server to Azure using the Microsoft Azure Recovery Services (MARS) agent.

Azure Backup protects Windows Server from corruption, cyberattacks, and disasters. This solution uses the lightweight Microsoft Azure Recovery Services (MARS) agent, which is installed on the server to protect files, folders, and system configuration data through Windows Server System State backups.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Download Recovery Services agent

The Microsoft Azure Recovery Services (MARS) agent creates an association between Windows Server and your Recovery Services vault.

To download the agent to your server, follow these steps:

1. From the list of Recovery Services vaults, select **myRecoveryServicesVault** to open its dashboard.

   ![Screenshot shows how to select the vault to open the dashboard.](./media/tutorial-backup-windows-server-to-azure/open-vault-from-list.png)

2. On the vault dashboard menu, select **Backup**.

3. On the **Backup Goal** menu:

   * For **Where is your workload running?**, select **On-premises**
   * For **What do you want to backup?**, select **Files and folders** and **System State**

   ![Screenshot shows the Backup Goal menu.](./media/tutorial-backup-windows-server-to-azure/backup-goal.png)

4. Select **Prepare Infrastructure** to open the **Prepare infrastructure** menu.

5. On the **Prepare infrastructure** menu, select **Download Agent for Windows Server or Windows Client** to download the *MARSAgentInstaller.exe*.

    ![Screenshot shows how to download MARS agent for Windows Server or Windows Client.](./media/tutorial-backup-windows-server-to-azure/prepare-infrastructure.png)

    The installer opens a separate browser and downloads **MARSAgentInstaller.exe**.

6. Before you run the downloaded file, on the **Prepare infrastructure** menu select **Download** and save the **Vault Credentials** file. Vault credentials are required to connect the MARS Agent with the Recovery Services vault.

    ![Screenshot shows how to download the vault credentials file.](./media/tutorial-backup-windows-server-to-azure/download-vault-credentials.png)

## Install and register the agent

To install and register the agent, follow these steps:

1. Locate and double-click the downloaded **MARSagentinstaller.exe**.

   The **Microsoft Azure Recovery Services Agent Setup Wizard** appears.

2.  On the wizard, enter the following details when prompted:
   * Location for the installation and cache folder.
   * Proxy server details, if you use a proxy server to connect to the internet.
   * Your user name and password details if you use an authenticated proxy.

     ![Screenshot shows the Microsoft Azure Recovery Services Agent setup wizard.](./media/tutorial-backup-windows-server-to-azure/mars-installer.png)

4.  Select **Register**.
5. At the end of the wizard, select **Proceed to Registration** and provide the **Vault Credentials** file you downloaded in the previous procedure.

6. When prompted, enter an encryption passphrase to encrypt backups from Windows Server. Save the passphrase in a secure location since Microsoft can't recover the passphrase if it's lost.

7. Select **Finish**.

## Configure backup and retention for Windows Server

You use the Microsoft Azure Recovery Services agent to schedule when backups to Azure, occur on Windows Server.

To configure backup and retention on the server where you downloaded the agent, follow these steps:

1. Open the Microsoft Azure Recovery Services agent. You can find it by searching your machine for **Microsoft Azure Backup**.

2. On the Recovery Services agent console, select **Schedule Backup** under the **Actions Pane**.

    ![Screenshot shows tbe Schedule Backup option.](./media/tutorial-backup-windows-server-to-azure/mars-schedule-backup.png)

3. Select **Next** to go to the **Select Items to Back up** pane.

4. Select **Add Items** and from the dialog box that opens, select **System State** and files or folders that you want to back up. Then select **OK**.

5. Select **Next**.

6. On the **Specify Backup Schedule (System State)** pane, specify the time of the day, or week when backups need to be triggered for System State and select **Next**.

7. On the **Select Retention Policy (System State)** pane, select the Retention Policy for the backup copy for System State and select **Next**.

8. Similarly, select the backup schedule and retention policy for selected files and folders.

9. On the **Choose Initial Back up Type** pane, select **Automatically over the network**, and select **Next**.

10. On the **Confirmation** pane, review the information, and select **Finish**.

11. After the wizard finishes creating the backup schedule, select **Close**.

## Run an on-demand backup of Windows Server

After you configure the backup schedule, jobs run automatically. However, the server isn't protected until a backup is actually performed. As a disaster recovery best practice, we recommend you to initiate an on-demand backup to ensure data resiliency.

To run an on-demand backup of Windows Server, follow these steps:

1. On the Microsoft Azure Recovery Services agent console, select **Back Up Now**.

    ![Screenshot shows how to select Back Up Now.](./media/tutorial-backup-windows-server-to-azure/backup-now.png)

2. On the **Back Up Now** wizard, select one from **Files and Folders** or **System State** that you want to back up and select **Next**
3. On the **Confirmation** pane, review the settings that the **Back Up Now** wizard uses to back up your server. Then select **Back Up**.
4. Select **Close** to close the wizard. If you close the wizard before the backup process finishes, the wizard continues to run in the background.

After the initial backup is complete, **Job completed** status appears on **Jobs** pane of the MARS agent console.

## Next steps

In this tutorial, you used the Azure portal to:

> [!div class="checklist"]
>
> * Create a Recovery Services vault
> * Download the Microsoft Azure Recovery Services agent
> * Install the agent
> * Configure backup for Windows Server
> * Perform an on-demand backup

Continue to the next tutorial to recover files from Azure to Windows Server

> [!div class="nextstepaction"]
> [Restore files from Azure to Windows Server](./tutorial-backup-restore-files-windows-server.md)
