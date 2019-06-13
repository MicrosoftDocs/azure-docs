---
title: Troubleshoot Azure Backup Agent
description: Troubleshoot installation and registration of Azure Backup Agent
services: backup
author: saurabhsensharma
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: saurse
---

# Troubleshoot Microsoft Azure Recovery Services (MARS) Agent

Here's how to resolve errors you might see during configuration, registration, backup, and restore.

## Basic troubleshooting

We recommend you perform the below validation, before you start troubleshooting Microsoft Azure Recovery Services (MARS) agent:

- [Ensure Microsoft Azure Recovery Services (MARS) Agent is up to date](https://go.microsoft.com/fwlink/?linkid=229525&clcid=0x409)
- [Ensure there is network connectivity between MARS agent and Azure](https://aka.ms/AB-A4dp50)
- Ensure Microsoft Azure Recovery Services is running (in Service console). If required restart and retry the operation
- [Ensure 5-10% free volume space is available on scratch folder location](https://aka.ms/AB-AA4dwtt)
- [Check if another process or antivirus software is interfering with Azure Backup](https://aka.ms/AB-AA4dwtk)
- [Scheduled backup fails, but manual backup works](https://aka.ms/ScheduledBackupFailManualWorks)
- Ensure your OS has the latest updates
- [Ensure unsupported drives and files with unsupported attributes are excluded from backup](backup-support-matrix-mars-agent.md#supported-drives-or-volumes-for-backup)
- Ensure **System Clock** on the protected system is configured to correct time zone <br>
- [Ensure that the server has at least .Net Framework version 4.5.2 and higher](https://www.microsoft.com/download/details.aspx?id=30653)<br>
- If you are trying to **reregister your server** to a vault, then: <br>
  - Ensure the agent is uninstalled on the server and it is deleted from portal <br>
  - Use the same passphrase that was initially used for registering the server <br>
- In case of offline backup ensure that Azure PowerShell version 3.7.0 is installed on both source and copy computer before you begin offline backup operation
- [Consideration when Backup agent is running on an Azure virtual machine](https://aka.ms/AB-AA4dwtr)

## Invalid vault credentials provided

**Error message**: Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)

| Cause | Recommended Action |
| ---     | ---    |
| **The vault credentials are invalid** <br/> <br/> Vault credential files might be corrupt or may have expired (i.e. downloaded more than 48 hours before the time of registration)| Download a new credential from Recovery Services vault from the Azure portal (see *Step 6* under [**Download the MARS agent**](https://docs.microsoft.com/azure/backup/backup-configure-vault#download-the-mars-agent) section) and perform the below: <ul><li> If you have already installed and registered Microsoft Azure Backup Agent, then open the Microsoft Azure Backup Agent MMC console and choose **Register Server** from Action Pane to complete the registration with the newly downloaded credentials <br/> <li> If the new installation failed then try re-installing using the new credentials</ul> **Note**: If multiple vault credential files are downloaded previously, only the latest downloaded file is valid within 48 hours. Hence it is recommended to download fresh new vault credentials file.
| **Proxy Server/firewall is blocking <br/>or <br/>No Internet connectivity** <br/><br/> If your machine or Proxy Server has limited Internet access then without listing the necessary URLs the registration will fail.| To resolve this issue, perform the below:<br/> <ul><li> Work with your IT team to ensure the system has Internet connectivity<li> If you do not have Proxy server, then ensure the proxy option is unselected when registering the agent, verify proxy settings steps listed [here](#verifying-proxy-settings-for-windows)<li> If you do have a firewall/proxy server then work with your networking team to ensure that below URLs and IP address have access<br/> <br> **URLs**<br> - *www.msftncsi.com* <br>- *.Microsoft.com* <br> - *.WindowsAzure.com* <br>- *.microsoftonline.com* <br>- *.windows.net* <br>**IP address**<br> - *20.190.128.0/18* <br> - *40.126.0.0/18* <br/></ul></ul>Try re-registering after you complete the above troubleshooting steps
| **Anti-virus software is blocking** | If you have anti-virus software installed on the server, then add necessary exclusion rules for the following files from the anti-virus scan: <br/><ui> <li> *CBengine.exe* <li> *CSC.exe*<li> Scratch folder, the default location is *C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch* <li> Bin folder at *C:\Program Files\Microsoft Azure Recovery Services Agent\Bin*

### Additional recommendations
- Go to *C:/Windows/Temp* and check whether there are more than 60,000 or 65,000 files with the .tmp extension. If there are, delete these files
- Ensure the machine’s date and time is matching with local time zone
- Ensure the [following](backup-configure-vault.md#verify-internet-access) sites are added to IE trusted sites

### Verifying proxy settings for Windows

- Download **psexec** from [here](https://docs.microsoft.com/sysinternals/downloads/psexec)
- Run this `psexec -i -s "c:\Program Files\Internet Explorer\iexplore.exe"` command from elevated prompt:
- This will launch *Internet Explorer* window
- Go to *Tools* -> *Internet Options* -> *Connections* -> *LAN settings*
- Verify proxy settings for *System* account
- If no proxy is configured and proxy details are provided, then remove the details
-	If proxy is configured and proxy details are incorrect, then ensure *Proxy IP* and *port* details are accurate
- Close *Internet Explorer*

## Unable to download vault credential file

| Error details | Recommended actions |
| ---     | ---    |
|Failed to download the vault credential file. (ID: 403) | <ul><li> Try downloading vault credentials using different browser or perform the below steps: <ul><li> Launch IE, press F12. </li><li> Go to **Network** tab to clear IE cache and cookies </li> <li> Refresh the page<br>(OR)</li></ul> <li> Check if the subscription is disabled/expired<br>(OR)</li> <li> Check if any firewall rule is blocking vault credential file download <br>(OR)</li> <li> Ensure you have not exhausted the limit on the vault (50 machines per vault)<br>(OR)</li>  <li> Ensure user has required Azure Backup permission to download vault credential and register server with vault, see [article](backup-rbac-rs-vault.md)</li></ul> |

## The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** <br /><ol><li>*The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to internet*<li>*(407) Proxy Authentication Required* |Proxy blocking the connection. |  <ul><li>Launch **IE** > **Setting** > **Internet options** > **Security** > **Internet**. Then select **Custom Level** and scroll until you see the file download section. Select **Enable**.<li>You might also have to add these sites in IE [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins).<li>Change the settings to use a proxy server. Then provide the proxy server details.<li> If your machine has limited internet access, ensure that firewall settings on the machine or proxy allow these [URLs](backup-configure-vault.md#verify-internet-access) and [IP address](backup-configure-vault.md#verify-internet-access). <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan. <ul><li>CBEngine.exe (instead of dpmra.exe).<li>CSC.exe (related to .NET Framework). There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.<li>The bin folder C:\Program Files\Microsoft Azure Recovery Services Agent\Bin



## Failed to set the encryption key for secure backups

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** <br />*Failed to set the encryption key for secure backups. Activation did not succeed completely but the encryption passphrase was saved to the following file*. |<li>The server is already registered with another vault.<li>During configuration, the passphrase was corrupted.| Unregister the server from the vault, and register again with a new passphrase.

## The activation did not complete successfully

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** <br />*The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Retry the operation after some time. If the issue persists, please contact Microsoft support*     | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.         | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equal to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.        |

## Encryption passphrase not correctly configured

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** <br />*Error 34506. The encryption passphrase stored on this computer is not correctly configured*.    | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.        | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equivalent to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.         |


## Backups don't run according to the schedule
If scheduled backups don't get triggered automatically, while manual backups work without issues, try the following actions:

- Ensure Windows Server backup schedule does not conflict with Azure files and folders backup schedule.

- Ensure the  Online Backup status is set to **Enable**. To verify the status perform the below:

  - Open **Task Scheduler** and expand **Microsoft**, and select **Online Backup**.
  - Double-click **Microsoft-OnlineBackup**, and go to the **Triggers** tab.
  - Verify if the status is set to **Enabled**. If it isn't, then select **Edit** > **Enabled** check box and click **OK**.

- Ensure the user account selected for running the task is either **SYSTEM** or **Local Administrators' group** on the server. To verify the user account, go to the **General** tab and check the **Security** options.

- Ensure PowerShell 3.0 or later is installed on the server. To check the PowerShell version, run the following command and verify that the *Major* version number is equal to or greater than 3.

  `$PSVersionTable.PSVersion`

- Ensure the following path is part of the *PSMODULEPATH* environment variable

  `<MARS agent installation path>\Microsoft Azure Recovery Services Agent\bin\Modules\MSOnlineBackup`

- If the PowerShell execution policy for *LocalMachine* is set to restricted, the PowerShell cmdlet that triggers the backup task might fail. Run the following commands in elevated mode, to check and set the execution policy to either *Unrestricted* or *RemoteSigned*

  `PS C:\WINDOWS\system32> Get-ExecutionPolicy -List`

  `PS C:\WINDOWS\system32> Set-ExecutionPolicy Unrestricted`

- Ensure there are no missing or corrupted **PowerShell** module **MSonlineBackup**. In case there is any missing or corrupt file, to resolve this issue perform the below:

  - From any machine having MARS agent that is working properly, copy the MSOnlineBackup folder from *(C:\Program Files\Microsoft Azure Recovery Services Agent\bin\Modules)* path.
  - Paste this in problematic machine in the same path *(C:\Program Files\Microsoft Azure Recovery Services Agent\bin\Modules)*.
  - If **MSOnlineBackup** folder is already existed in the machine, paste or replace the content files inside it.


> [!TIP]
> To ensure that changes are applied consistently, reboot the server after performing the steps above.


## Troubleshoot restore issues

Azure Backup might not successfully mount the recovery volume, even after several minutes. You might also receive error messages during the process. To begin recovering normally, follow these steps:

1.  Cancel the ongoing mount process, in case it has been running for several minutes.

2.  See if you're on the latest version of the Backup Agent. To find out the version, on the **Actions** pane of the MARS console, select **About Microsoft Azure Recovery Services Agent**. Confirm that the **Version** number is equal to or higher than the version mentioned in [this article](https://go.microsoft.com/fwlink/?linkid=229525). You can download the latest version from [here](https://go.microsoft.com/fwLink/?LinkID=288905).

3.  Go to **Device Manager** > **Storage Controllers**, and locate **Microsoft iSCSI Initiator**. If you can locate it, go directly to step 7.

4.  If you can't locate Microsoft iSCSI Initiator service, try to find an entry under **Device Manager** > **Storage Controllers** called **Unknown Device**, with Hardware ID **ROOT\ISCSIPRT**.

5.  Right-click on **Unknown Device**, and select **Update Driver Software**.

6.	Update the driver by selecting the option to  **Search automatically for updated driver software**. Completion of the update should change **Unknown Device** to **Microsoft iSCSI Initiator**, as shown below.

    ![Screenshot of Azure Backup Device Manager, with Storage controllers highlighted](./media/backup-azure-restore-windows-server/UnknowniSCSIDevice.png)

7.  Go to **Task Manager** > **Services (Local)** > **Microsoft iSCSI Initiator Service**.

    ![Screenshot of Azure Backup Task Manager, with Services (Local) highlighted](./media/backup-azure-restore-windows-server/MicrosoftInitiatorServiceRunning.png)

8.  Restart the Microsoft iSCSI Initiator service. To do this, right-click on the service, select **Stop**, right-click again, and select **Start**.

9.  Retry recovery by using [**Instant Restore**](backup-instant-restore-capability.md).

If the recovery still fails, reboot your server or client. If you don't want to reboot, or the recovery still fails even after rebooting the server, try recovering from an alternate machine. Follow the steps in [this article](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine).

## Need help? Contact support
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps
* Get more details on [how to back up Windows Server with the Azure Backup Agent](tutorial-backup-windows-server-to-azure.md).
* If you need to restore a backup, use this article to [restore files to a Windows machine](backup-azure-restore-windows-server.md).
