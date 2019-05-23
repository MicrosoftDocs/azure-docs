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

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** </br> *Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)* | <ul><li> The vault credentials are invalid (that is, they were downloaded more than 48 hours before the time of registration).<li>MARS Agent is unable to download files to the Windows Temp directory. <li>The vault credentials are on a network location. <li>TLS 1.0 is disabled<li> A configured proxy server is blocking the connection. <br> |  <ul><li>Download the new vault credentials.(**Note**: If multiple vault credential files are downloaded previously, only the latest downloaded file is valid within 48 hours.) <li>Launch **IE** > **Setting** > **Internet options** > **Security** > **Internet**. Next, select **Custom Level**, and scroll until you see the file download section. Then select **Enable**.<li>You might also have to add these sites in IE [trusted sites](https://docs.microsoft.com/azure/backup/backup-configure-vault#verify-internet-access).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li> Match the date and time with your machine.<li>If you get an error stating that file downloads are not allowed, it is likely that there are a large number of files in the C:/Windows/Temp directory.<li>Go to C:/Windows/Temp and check whether there are more than 60,000 or 65,000 files with the .tmp extension. If there are, delete these files.<li>Ensure that you have .NET framework 4.6.2 installed. <li>If you have disabled TLS 1.0 due to PCI compliance, refer to this [troubleshooting page](https://support.microsoft.com/help/4022913). <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan: <ul><li>CBengine.exe<li>CSC.exe, which is related to .NET Framework. There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET Framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.<br><li>The bin folder C:\Program Files\Microsoft Azure Recovery Services Agent\Bin

## Unable to download vault credential file

| Error details | Recommended actions |
| ---     | ---    |
|Failed to download the vault credential file. (ID: 403) | <ul><li> Try downloading vault credentials using different browser or perform the below steps: <ul><li> Launch IE, press F12. </li><li> Go to **Network** tab to clear IE cache and cookies </li> <li> Refresh the page<br>(OR)</li></ul> <li> Check if the subscription is disabled/expired<br>(OR)</li> <li> Check if any firewall rule is blocking vault credential file download <br>(OR)</li> <li> Ensure you have not exhausted the limit on the vault (50 machines per vault)<br>(OR)</li>  <li> Ensure user has required Azure Backup permission to download vault credential and register server with vault, see [article](backup-rbac-rs-vault.md)</li></ul> |

## The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** <br /><ol><li>*The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to internet*<li>*(407) Proxy Authentication Required* |Proxy blocking the connection. |  <ul><li>Launch **IE** > **Setting** > **Internet options** > **Security** > **Internet**. Then select **Custom Level** and scroll until you see the file download section. Select **Enable**.<li>You might also have to add these sites in IE [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan. <ul><li>CBEngine.exe (instead of dpmra.exe).<li>CSC.exe (related to .NET Framework). There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.<li>The bin folder C:\Program Files\Microsoft Azure Recovery Services Agent\Bin


## Failed to set the encryption key for secure backups

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** <br />*Failed to set the encryption key for secure backups. Activation did not succeed completely but the encryption passphrase was saved to the following file*. |<li>The server is already registered with another vault.<li>During configuration, the passphrase was corrupted.| Unregister the server from the vault, and register again with a new passphrase.

## The activation did not complete successfully

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** <br /><ol>*The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Retry the operation after some time. If the issue persists, please contact Microsoft support*     | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.         | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equal to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.        |

## Encryption passphrase not correctly configured

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** <br /><ol>*Error 34506. The encryption passphrase stored on this computer is not correctly configured*.    | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.        | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equivalent to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.         |


## Backups don't run according to the schedule
If scheduled backups don't get triggered automatically, while manual backups work without issues, try the following actions:

- Ensure Windows Server backup schedule does not conflict with Azure files and folders backup schedule.
- Go to **Control Panel** > **Administrative Tools** > **Task Scheduler**. Expand **Microsoft**, and select **Online Backup**. Double-click **Microsoft-OnlineBackup**, and go to the **Triggers** tab. Ensure that the status is set to **Enabled**. If it isn't, select **Edit**, and select the **Enabled** check box and click **OK**. On the **General** tab, go to **Security options** and ensure that the user account selected for running the task is either **SYSTEM** or **Local Administrators' group** on the server.

- See if PowerShell 3.0 or later is installed on the server. To check the PowerShell version, run the following command and verify that the *Major* version number is equal to or greater than 3.

  `$PSVersionTable.PSVersion`

- See if the following path is part of the *PSMODULEPATH* environment variable.

  `<MARS agent installation path>\Microsoft Azure Recovery Services Agent\bin\Modules\MSOnlineBackup`

- If the PowerShell execution policy for *LocalMachine* is set to restricted, the PowerShell cmdlet that triggers the backup task might fail. Run the following commands in elevated mode, to check and set the execution policy to either *Unrestricted* or *RemoteSigned*.

  `PS C:\WINDOWS\system32> Get-ExecutionPolicy -List`

  `PS C:\WINDOWS\system32> Set-ExecutionPolicy Unrestricted`

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
