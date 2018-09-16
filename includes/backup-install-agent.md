## Download, install, and register the Azure Backup agent
After creating the Recovery Services vault, install the Backup agent on each of your Windows machines (Windows Server, Windows client, System Center Data Protection Manager server, or Azure Backup Server machine) used to back up data to Azure.

1. Open your subscription in the [Azure Portal](https://ms.portal.azure.com/).
2. On the left-hand menu, select **All services** and in the services list, type **Recovery Services**. Click **Recovery Services vaults**.

   ![open Recovery Services vault](../articles/backup/media/tutorial-backup-windows-server-to-azure/full-browser-open-rs-vault_2.png)
3. On the Quick Start page, click the **For Windows Server or System Center Data Protection Manager or Windows client** option under **Download Agent**. Click **Save** to copy it to the local machine.
   
    ![Save agent](./media/backup-install-agent/agent.png)
4. Once the agent is installed, double-click MARSAgentInstaller.exe to launch the installation of the Azure Backup agent. Choose the installation folder and scratch folder required for the agent. The specified cache location should at least 5% of the backup data as free space.
5. If you use a proxy server to connect to the internet, in the **Proxy configuration** screen, enter the proxy server details. If you use an authenticated proxy, enter the user name and password details in this screen.
6. The Azure Backup agent installs .NET Framework 4.5 and Windows PowerShell (if it’s not available already) to complete the installation.
7. Once the agent is installed, click the **Proceed to Registration** button to continue with the workflow.
   
   ![Register](./media/backup-install-agent/register.png)
8. In the vault credentials screen, select the downloaded vault credentials file.
   
    ![Vault credentials](./media/backup-install-agent/vc.png)
   
    The vault credentials file is valid only for 48 hrs (after it’s downloaded from the portal). If you encounter any error in this screen (e.g “Vault credentials file provided has expired”), sign in to the Azure portal and download the vault credentials file again.
   
    Ensure the setup application can access the vault credentials file. If you encounter access-related errors, copy the vault credentials file to a temporary location on the local machine and retry the operation.
   
    If you encounter an invalid vault credential error such as “Invalid vault credentials provided", the vault credentials file is either corrupted or does not have the latest credentials associated with the recovery service. Retry the operation after downloading a new vault credential file from the portal. This error is typically seen when a user clicks the **Download vault credential** option in the Azure portal, in quick succession. When this happens, only the second vault credential file is valid.
9. In the **Encryption setting** screen, you can either generate a passphrase or provide a passphrase (minimum of 16 characters). Remember to save the passphrase in a secure location.
   
    ![Encryption](./media/backup-install-agent/encryption.png)
   
   > [!WARNING]
   > If the passphrase is lost or forgotten; Microsoft cannot help in recovering the backup data. The end user owns the encryption passphrase and Microsoft does not have visibility into the passphrase used by the end user. Save the file in a secure location as it is required during a recovery operation.
   > 
   > 
10. Once you click the **Finish** button, the machine is registered successfully to the vault and you are now ready to start backing up to Microsoft Azure.
11. When using Microsoft Azure Backup standalone, you can modify the settings specified during the registration workflow by clicking on the **Change Properties** option in the Azure Backup MMC snap in.
    
    ![Change Properties](./media/backup-install-agent/change.png)
    
    Alternatively, when using Data Protection Manager, you can modify the settings specified  during the registration workflow by clicking the **Configure** option by selecting **Online** under the **Management** Tab.
    
    ![Configure Azure Backup](./media/backup-install-agent/configure.png)

