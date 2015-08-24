<properties
   pageTitle="Download, Install and Register Azure Backup agent | Microsoft Azure"
   description="Learn how & where to download the Azure Backup agent, installation steps and how to register the Azure Backup agent using the vault credentials"
   services="backup"
   documentationCenter=""
   authors="Jim-Parker"
   manager="jwhit"
   editor=""/>
<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="07/01/2015"
   ms.author="jimpark"; "aashishr"/>

# Download, install and register the Azure Backup agent
After creating the Azure Backup vault, an agent should be installed on each of your on-premises servers (Windows Server, Windows client or System Center Data Protection Manager server) which enables you to backup data and applications to Azure. This article covers the steps required to setup the Azure Backup agent on a Windows Server or Windows client machine.

## Walkthrough

1. Sign in to the [Management Portal](https://manage.windowsazure.com/)

2. Click **Recovery Services**, then select the backup vault that you want to register with a server. The Quick Start page for that backup vault appears.

    ![Quick start](./media/backup-azure-backup-download-register/quickstart.png)

3. On the Quick Start page, click **For Windows Server or System Center Data Protection Manager or Windows client** under **Download Agent** option. Click **Save** to copy it to the local machine.

    ![Save agent](./media/backup-azure-backup-download-register/agent.png)

4. Once the agent is installed, double click MARSAgentInstaller.exe to launch the installation of the Azure Backup agent.

5. Choose the installation folder and scratch folder required for the agent. The cache location specified must have free space which is at least 5% of the backup data.

6.	If you use a proxy server to connect to the internet, in the **Proxy configuration** screen, enter the proxy server details. If you use an authenticated proxy, enter the user name and password details in this screen.

7. The Azure Backup agent install .NET Framework 4.5 and Windows PowerShell (if it’s not available already) to complete the installation.

8.	Once the agent is installed, click the **Proceed to Registration** button to continue with the workflow.

    ![Register](./media/backup-azure-backup-download-register/register.png)

9. In the vault credentials screen, browse to and select the vault credentials file which was previously downloaded.

    ![Vault credentials](./media/backup-azure-backup-download-register/vc.png)

    > [AZURE.NOTE] The vault credentials file is valid only for 48 hrs (after it’s downloaded from the portal). If you encounter any error in this screen (e.g “Vault credentials file provided has expired”), login to the Azure portal and download the vault credentials file again.

    Ensure that the vault credentials file is available in a location which can be accessed by the setup application. If you encounter access related errors, copy the vault credentials file to a temporary location in this machine and retry the operation.

    If you encounter an invalid vault credential error (e.g “Invalid vault credentials provided". The file is either corrupted or does not have the latest credentials associated with the recovery service”, retry the operation after downloading a new vault credential file from the portal. This error is typically seen if the user clicks on the Download vault credential option in the Azure portal, in quick succession. In this case, only the second vault credential file is valid.

10. In the **Encryption setting** screen, you can either generate a passphrase or provide a passphrase (minimum of 16 characters) and remember to save the passphrase in a secure location.

    ![Encryption](./media/backup-azure-backup-download-register/encryption.png)

    > [AZURE.WARNING] If the passphrase is lost or forgotten; Microsoft cannot help in recovering the backup data. The end user owns the encryption passphrase and Microsoft does not have any visibility into the passphrase which is used by the end user. Please save the file in a secure location as it would be required during a recovery operation.

11. Once you click the **Finish** button, the machine is registered successfully to the vault and you are now ready to start backing up to Microsoft Azure. You can modify the settings specified during the registration workflow by clicking the **Change Properties** option in the Azure Backup mmc snap in.

    ![Change Properties](./media/backup-azure-backup-download-register/change.png)

## Video Walkthrough

Here's a video walkthrough of this tutorial.

[AZURE.VIDEO download-install-and-register-the-azure-backup-agent]

## Next Steps
- See [Schedule backups](backup-azure-backup-and-recover.md) for information about backing up data and applications to Azure.
