---
title: Troubleshoot Azure Backup Agent
description: Troubleshoot installation and registration of Azure Backup Agent
services: backup
author: saurabhsensharma
manager: shreeshd
ms.service: backup
ms.topic: conceptual
ms.date: 7/25/2018
ms.author: saurse
---

# Troubleshoot Microsoft Azure Recovery Services (MARS) agent issues
## Recommended steps
Refer to this article to resolve errors during the configuration, registration, backup, and restore using the MARS Agent.

## Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service.
| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** </br> *Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)* | <ul><li> The vault credentials are invalid (that is, they were downloaded more than 48 hours before the time of registration).<li>MARS Agent is unable to download files to the Windows Temp directory. <li>The vault credentials are on a network location. <li>TLS 1.0 is disabled<li> A configured proxy server is blocking the connection. <br> |  <ul><li>Download the new vault credentials.<li>Go to **Internet options** > **Security** > **Internet**. Next, select **Custom Level**, and scroll until you see the file download section. Then select **Enable**.<li>You might also have to add the site to [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li> Match the date and time with your machine.<li>Go to C:/Windows/Temp and check whether there are more than 60,000 or 65,000 files with the .tmp extension. If there are, delete these files.<li>You can verify this running the SDP package on the server. If you get an error stating that file downloads are not allowed, it is likely that there are a large number of files in the C:/Windows/Temp directory.<li>Ensure that you have .NET framework 4.6.2 installed. <li>If you have disabled TLS 1.0 due to PCI compliance, refer to this [troubleshooting page](https://support.microsoft.com/help/4022913). <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan: <ul><li>CBengine.exe<li>CSC.exe, which is related to .NET Framework. There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.

## The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** </br><ol><li>*The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to internet*<li>*(407) Proxy Authentication Required* |Proxy blocking the connection. |  <ul><li>Go into **Internet options** > **Security** > **Internet**. Then select **Custom Level** and scroll until you see the file download section. Select **Enable**.<li>You might also have to add the site to [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan. <ul><li>CBEngine.exe (instead of dpmra.exe).<li>CSC.exe (related to .NET Framework). There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.

## Failed to set the encryption key for secure backups

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |		
| **Error** </br>*Failed to set the encryption key for secure backups Activation did not succeed completely but the encryption passphrase was saved to the following file*. |<li>Server is already registered with another vault.<li>During configuration, the passphrase was corrupted| Unregister the server from the vault and register again with a new passphrase.

## The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** </br><ol>*The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Retry the operation after some time. If the issue persists, please contact Microsoft support*     | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.         | <li>Upgrade to the [latest version](http://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equal to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.        |

## Error 34506. The encryption passphrase stored on this computer is not correctly configured

| Error details | Possible causes | Recommended actions |
|---------|---------|---------|
|**Error** </br><ol>*Error 34506. The encryption passphrase stored on this computer is not correctly configured*.    | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing.        | <li>Upgrade to the [latest version](http://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space equivalent to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.         |

## Backups do not run as per schedule
Perform the following steps when scheduled backups do not get triggered automatically, while manual backups work without issues. 
 
<li>Ensure that PowerShell 3.0 or above is installed on the server. To check the PowerShell version, execute the following command and verify that the *Major* version number is equal to or greater than 3.

`$PSVersionTable.PSVersion`
<li>Ensure that the following path is part of the *PSMODULEPATH* environment variable.

`<MARS agent installation path>\Microsoft Azure Recovery Services Agent\bin\Modules\MSOnlineBackup`
<li>If the powershell execution policy for the *LocalMachine* is set to restricted, the powershell cmdlet that triggers the backup task may fail. Execute the following commands in elevated mode to check and set the execution policy to either *Unrestricted* or *RemoteSigned*

`PS C:\WINDOWS\system32> Get-ExecutionPolicy -List`

`PS C:\WINDOWS\system32> Set-ExecutionPolicy Unrestricted`
<li>Go to Control Panel -> Administrative Tools -> Task Scheduler -> expand Microsoft -> select Online Backup 
<li>Double-click the 'Microsoft-OnlineBackup' task and go to the 'Triggers' tab.
<li>Ensure that the 'Status' of the task is set to 'Enabled'. If not, click on 'Edit' and select the 'Enabled' checkbox
<li>Navigate to the *Security options* section of the *General* tab
<li>Ensure that the user account selected for running the task is either *SYSTEM* or Local Administrators' group on the server

> [!TIP]
> It is recommended to reboot the server after performing the steps above to ensure that changes made are applied consistently


## Troubleshooting Restore Issues

### Failure to mount the Recovery Volume during recovery of files and folders
If Azure Backup does not successfully mount the recovery volume even after several minutes of clicking **Mount** or fails to mount the recovery volume with one or more errors, follow the steps below to begin recovering normally.

1.  Cancel the ongoing mount process in case it has been running for several minutes.

2.  Ensure that you are on the latest version of the Azure Backup agent. To find out the version information of Azure Backup agent, click on **About Microsoft Azure Recovery Services Agent** on the **Actions** pane of Microsoft Azure Backup console and ensure that the **Version** number is equal to or higher than the version mentioned in [this article](https://go.microsoft.com/fwlink/?linkid=229525). You can download the latest version from [here](https://go.microsoft.com/fwLink/?LinkID=288905)

3.  Go to **Device Manager** -> **Storage Controllers** and ensure that you can locate **Microsoft iSCSI Initiator**. If you can locate it, directly go to step 7 below. 

4.  If you cannot locate Microsoft iSCSI Initiator service as mentioned in step 3, check to see if you can find an entry under **Device Manager** -> **Storage Controllers** called **Unknown Device** with Hardware ID **ROOT\ISCSIPRT**.

5.  Right click on **Unknown Device** and select **Update Driver Software**.

6.	Update the driver by selecting the option to  **Search automatically for updated driver software**. Completion of the update should change **Unknown Device** to **Microsoft iSCSI Initiator** as shown below. 

    ![Encryption](./media/backup-azure-restore-windows-server/UnknowniSCSIDevice.png)

7.  Go to **Task Manager** -> **Services (Local)** -> **Microsoft iSCSI Initiator Service**. 

    ![Encryption](./media/backup-azure-restore-windows-server/MicrosoftInitiatorServiceRunning.png)
    
8.  Restart the Microsoft iSCSI Initiator service by right-clicking on the service, clicking on Stop, and further right-clicking again and clicking on **Start**.

9.  Retry recovering using Instant Restore. 

If the recovery still fails, reboot your server/client. If a reboot is not desirable or the recovery still fails even after rebooting the server, try recovering from an Alternate Machine by following steps listed in [this article](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine)

## Need help? Contact support
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps
* Get more details on [how to back up Windows Server with the Azure Backup Agent](tutorial-backup-windows-server-to-azure.md).
* If you need to restore a backup, use this article to [restore files to a Windows machine](backup-azure-restore-windows-server.md).
