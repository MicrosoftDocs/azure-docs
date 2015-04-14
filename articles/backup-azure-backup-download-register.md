<properties
   pageTitle="Download, Install and Register Azure Backup agent"
   description="Learn how & where to download the Azure Backup agent, installation steps and how to register the Azure Backup agent using the vault credentials"
   services="backup"
   documentationCenter=""
   authors="prvijay"
   manager="shreeshd"
   editor=""/>
<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="storage-backup-recovery"
   ms.date="04/08/2015"
   ms.author="prvijay"/>

# Download, install and register Azure Backup agent

After creating the Azure Backup vault, an agent should be installed on each of your on-premises server (Windows Server, Windows client or System Center Data Protection Manager server) that enables you to backup data and application to Azure. This article covers the steps required to setup the Azure Backup agent on a Windows Server or Windows client machine.

1. Sign in to the [Management Portal](https://manage.windowsazure.com/)

2. Click **Recovery Services**, then select the backup vault that you want to register with a server. The Quick Start page for that backup vault appears. <br/>
![Quick start][1]

3. On the Quick Start page, click on **For Windows Server or System Center Data Protection Manager or Windows client** under **Download Agent** option. Click on Save to copy it to the local machine. <br/>
![Save agent][2]

4. Once the agent is installed, double click on MARSAgentInstaller.exe to launch the installation of the Azure Backup agent. Choose the installation folder and scratch folder required for the agent. The cache location specified must have free space which is at least 5% of the backup data.

5.	If you use a proxy server to connect to the internet, in the **Proxy configuration** screen, enter the proxy server details. If you use an authenticated proxy, enter the user name and password details in this screen.

6.	The Azure Backup agent install .NET Framework 4.5 and Windows PowerShell (if it’s not available already) to complete the installation.

7.	Once the agent is installed, click on the **Proceed to Registration** button to continue with the workflow. <br/>
![Register][3]

8. In the vault credentials screen, browse to and select the vault credentials file which was previously downloaded. <br/>
![Vault credentials][4] <br/> <br/>
> [AZURE.NOTE] The vault credentials file is valid only for 48 hrs (after it’s downloaded from the portal). If you encounter any error in this screen (e.g “Vault credentials file provided has expired”), login to the Azure portal and download the vault credentials file again.
>
> Ensure that the vault credentials file is available in a location which can be accessed by the setup application. If you encounter access related errors, copy the vault credentials file to a temporary location in this machine and retry the operation.
>
> If you encounter an invalid vault credential error (e.g “Invalid vault credentials provided". The file is either corrupted or does not have the latest credentials associated with the recovery service”, retry the operation after downloading a new vault credential file from the portal. This error is typically seen if the user clicks on the Download vault credential option in the Azure portal, in quick succession. In this case, only the second vault credential file is valid.

9. In the **Encryption setting** screen, you could either generate a passphrase or provide a passphrase (minimum of 16 characters) and remember to save the passphrase in a secure location. <br/>
![Encryption][5] <br/> <br/>
> [AZURE.WARNING] If the passphrase is lost or forgotten; Microsoft cannot help in recovering the backup data. The end user owns the encryption passphrase and Microsoft does not have any visibility into the passphrase which is used by the end user. Please save the file in a secure location as it would be required during a recovery operation.

10. Once you click the **Finish** button, the machine is registered successfully to the vault and you are now ready to start backing up to Microsoft Azure. You can modify the settings specified during the registration workflow by clicking on the **Change Properties** option in the Azure Backup mmc snap in. <br/>
![Change Properties][6]

## Next Steps
+ Refer to the installation and configuration of the Azure Backup [FAQ](backup-azure-backup-faq.md) for any questions about the workflow.


<!--Image references-->
[1]: ./media/backup-azure-backup-download-register/quickstart.png
[2]: ./media/backup-azure-backup-download-register/agent.png
[3]: ./media/backup-azure-backup-download-register/register.png
[4]: ./media/backup-azure-backup-download-register/vc.png
[5]: ./media/backup-azure-backup-download-register/encryption.png
[6]: ./media/backup-azure-backup-download-register/change.png
