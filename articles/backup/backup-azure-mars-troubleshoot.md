---
title: Troubleshoot the Azure Backup agent
description: In this article, learn how to troubleshoot the installation and registration of the Azure Backup agent.
ms.reviewer: saurse
ms.topic: troubleshooting
ms.date: 07/15/2019
---

# Troubleshoot the Microsoft Azure Recovery Services (MARS) agent

This article describes how to resolve errors you might see during configuration, registration, backup, and restore.

## Basic troubleshooting

We recommend that you check the following before you start troubleshooting Microsoft the Azure Recovery Services (MARS) agent:

- [Ensure the MARS agent is up to date](https://go.microsoft.com/fwlink/?linkid=229525&clcid=0x409).
- [Ensure you have network connectivity between the MARS agent and Azure](https://docs.microsoft.com/azure/backup/backup-azure-mars-troubleshoot#the-microsoft-azure-recovery-service-agent-was-unable-to-connect-to-microsoft-azure-backup).
- Ensure MARS is running (in Service console). If you need to, restart and retry the operation.
- [Ensure 5% to 10% free volume space is available in the scratch folder location](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#whats-the-minimum-size-requirement-for-the-cache-folder).
- [Check if another process or antivirus software is interfering with Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-slow-backup-performance-issue#cause-another-process-or-antivirus-software-interfering-with-azure-backup).
- If the backup job completed with warnings, see [Backup Jobs Completed with Warning](#backup-jobs-completed-with-warning)
- If scheduled backup fails but manual backup works, see [Backups don't run according to schedule](https://docs.microsoft.com/azure/backup/backup-azure-mars-troubleshoot#backups-dont-run-according-to-schedule).
- Ensure your OS has the latest updates.
- [Ensure unsupported drives and files with unsupported attributes are excluded from backup](backup-support-matrix-mars-agent.md#supported-drives-or-volumes-for-backup).
- Ensure the clock on the protected system is configured to the correct time zone.
- [Ensure .NET Framework 4.5.2 or later is installed on the server](https://www.microsoft.com/download/details.aspx?id=30653).
- If you're trying to reregister your server to a vault:
  - Ensure the agent is uninstalled on the server and that it's deleted from the portal.
  - Use the same passphrase that was initially used to register the server.
- For offline backups, ensure Azure PowerShell 3.7.0 is installed on both the source and the copy computer before you start the backup.
- If the Backup agent is running on an Azure virtual machine, see [this article](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-slow-backup-performance-issue#cause-backup-agent-running-on-an-azure-virtual-machine).

## Invalid vault credentials provided

**Error message**: Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)

| Cause | Recommended actions |
| ---     | ---    |
| **Vault credentials aren't valid** <br/> <br/> Vault credential files might be corrupt or might have expired. (For example, they might have been downloaded more than 48 hours before the time of registration.)| Download new credentials from Recovery Services vault on the Azure portal. (See step 6 in the [Download the MARS agent](https://docs.microsoft.com/azure/backup/install-mars-agent#download-the-mars-agent) section.) Then take these steps, as appropriate: <ul><li> If you've already installed and registered MARS, open the Microsoft Azure Backup Agent MMC console and then select **Register Server** in the **Actions** pane to complete the registration with the new credentials. <br/> <li> If the new installation fails, try reinstalling with the new credentials.</ul> **Note**: If multiple vault credential files have been downloaded, only the latest file is valid for the next 48 hours. We recommend that you download a new vault credential file.
| **Proxy server/firewall is blocking registration** <br/>or <br/>**No internet connectivity** <br/><br/> If your machine or proxy server has limited internet connectivity and you don't ensure access for the necessary URLs, the registration will fail.| Take these steps:<br/> <ul><li> Work with your IT team to ensure the system has internet connectivity.<li> If you don't have a proxy server, ensure the proxy option isn't selected when you register the agent. [Check your proxy settings](#verifying-proxy-settings-for-windows).<li> If you do have a firewall/proxy server, work with your networking team to ensure these URLs and IP addresses have access:<br/> <br> **URLs**<br> `www.msftncsi.com` <br> .Microsoft.com <br> .WindowsAzure.com <br> .microsoftonline.com <br> .windows.net <br>**IP addresses**<br>  20.190.128.0/18 <br>  40.126.0.0/18 <br/></ul></ul>Try registering again after you complete the preceding troubleshooting steps.<br></br> If your connection is via Azure ExpressRoute, make sure the settings are configured as described in [Azure ExpressRoute support](backup-support-matrix-mars-agent.md#azure-expressroute-support).
| **Antivirus software is blocking registration** | If you have antivirus software installed on the server, add necessary exclusion rules to the antivirus scan for these files and folders: <br/><ul> <li> CBengine.exe <li> CSC.exe<li> The scratch folder. Its default location is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch. <li> The bin folder at C:\Program Files\Microsoft Azure Recovery Services Agent\Bin.

### Additional recommendations

- Go to C:/Windows/Temp and check whether there are more than 60,000 or 65,000 files with the .tmp extension. If there are, delete these files.
- Ensure the machine's date and time match the local time zone.
- Ensure [these sites](install-mars-agent.md#verify-internet-access) are added to your trusted sites in Internet Explorer.

### Verifying proxy settings for Windows

1. Download PsExec from the [Sysinternals](https://docs.microsoft.com/sysinternals/downloads/psexec) page.
1. Run `psexec -i -s "c:\Program Files\Internet Explorer\iexplore.exe"` from an elevated command prompt.

   This command will open Internet Explorer.
1. Go to **Tools** > **Internet options** > **Connections** > **LAN settings**.
1. Check the proxy settings for the system account.
1. If no proxy is configured and proxy details are provided, remove the details.
1. If a proxy is configured and the proxy details are incorrect, ensure the **Proxy IP** and **Port** details are correct.
1. Close Internet Explorer.

## Unable to download vault credential file

| Error   | Recommended actions |
| ---     | ---    |
|Failed to download the vault credential file. (ID: 403) | <ul><li> Try downloading the vault credentials by using a different browser, or take these steps: <ul><li> Start Internet Explorer. Select F12. </li><li> Go to the **Network** tab and clear the cache and cookies. </li> <li> Refresh the page.<br></li></ul> <li> Check if the subscription is disabled/expired.<br></li> <li> Check if any firewall rule is blocking the download. <br></li> <li> Ensure you haven't exhausted the limit on the vault (50 machines per vault).<br></li>  <li> Ensure the user has the Azure Backup permissions that are required to download vault credentials and register a server with the vault. See [Use Role-Based Access Control to manage Azure Backup recovery points](backup-rbac-rs-vault.md).</li></ul> |

## The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error  | Possible cause | Recommended actions |
| ---     | ---     | ---    |
| <br /><ul><li>The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to the internet.<li>(407) Proxy Authentication Required. |A proxy is blocking the connection. |  <ul><li>In Internet Explorer, go to **Tools** > **Internet options** > **Security** > **Internet**. Select **Custom Level** and scroll down to the **File download** section. Select **Enable**.<p>You might also have to add [URLs and IP addresses](install-mars-agent.md#verify-internet-access) to your trusted sites in Internet Explorer.<li>Change the settings to use a proxy server. Then provide the proxy server details.<li> If your machine has limited internet access, ensure that firewall settings on the machine or proxy allow these [URLs and IP addresses](install-mars-agent.md#verify-internet-access). <li>If you have antivirus software installed on the server, exclude these files from the antivirus scan: <ul><li>CBEngine.exe (instead of dpmra.exe).<li>CSC.exe (related to .NET Framework). There's a CSC.exe for every .NET Framework version installed on the server. Exclude CSC.exe files for all versions of .NET Framework on the affected server. <li>The scratch folder or cache location. <br>The default location for the scratch folder or the cache path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch.<li>The bin folder at C:\Program Files\Microsoft Azure Recovery Services Agent\Bin.

## Backup jobs completed with warning

- When the MARS agent iterates over files and folders during backup, it might encounter various conditions that can cause the backup to be marked as completed with warnings. During these conditions, a job shows as completed with warnings. That is fine, but it means that at least one file wasn't able to be backed up. So the job skipped that file, but backed up all other files in question on the data source.

  ![Backup job completed with warnings](./media/backup-azure-mars-troubleshoot/backup-completed-with-warning.png)

- Conditions that can cause the backups to skip files include:
  - Unsupported file attributes (for example: in a OneDrive folder, Compressed stream, reparse points). For the complete list, refer to the [support matrix](https://docs.microsoft.com/azure/backup/backup-support-matrix-mars-agent#supported-file-types-for-backup).
  - A file system issue
  - Another process interfering (for example: antivirus software holding handles on files can prevent the MARS agent from accessing the files)
  - Files locked by an application  

- The backup service will mark these files as failed in the log file, with the following naming convention: *LastBackupFailedFilesxxxx.txt* under the *C:\Program Files\Microsoft Azure Recovery Service Agent\temp* folder.
- To resolve the issue, review the log file to understand the nature of the issue:

  | Error code             | Reasons                                             | Recommendations                                              |
  | ---------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
  | 0x80070570             | The file or directory is  corrupted and unreadable. | Run **chkdsk** on the source  volume.                             |
  | 0x80070002, 0x80070003 | The system cannot find the  file specified.         | [Ensure the scratch folder isn't full](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#manage-the-backup-cache-folder)  <br><br>  Check if the volume where  scratch space is configured exists (not deleted)  <br><br>   [Ensure the MARS agent is excluded from the antivirus installed on the machine](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-slow-backup-performance-issue#cause-another-process-or-antivirus-software-interfering-with-azure-backup)  |
  | 0x80070005             | Access Is Denied                                    | [Check if antivirus or other third-party software is blocking access](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-slow-backup-performance-issue#cause-another-process-or-antivirus-software-interfering-with-azure-backup)     |
  | 0x8007018b             | Access to the cloud file is  denied.                | OneDrive files, Git Files, or any other files that can be in offline state on the machine |

- You can use [Add Exclusion rules to existing policy](https://docs.microsoft.com/azure/backup/backup-azure-manage-mars#add-exclusion-rules-to-existing-policy) to exclude unsupported, missing, or deleted files from your backup policy to ensure successful backups.

- Avoid deleting and recreating protected folders with the same names in the top-level folder. Doing so could result in the backup completing with warnings with the error *A critical inconsistency was detected, therefore changes cannot be replicated.*  If you need to delete and recreate folders, then consider doing so in subfolders under the protected top-level folder.

## Failed to set the encryption key for secure backups

| Error | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| <br />Failed to set the encryption key for secure backups. Activation did not succeed completely but the encryption passphrase was saved to the following file. |<li>The server is already registered with another vault.<li>During configuration, the passphrase was corrupted.| Unregister the server from the vault and register it again with a new passphrase.

## The activation did not complete successfully

| Error  | Possible causes | Recommended actions |
|---------|---------|---------|
|<br />The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Retry the operation after some time. If the issue persists, please contact Microsoft support.     | <li> The scratch folder is located on a volume that doesn't have enough space. <li> The scratch folder has been incorrectly moved. <li> The OnlineBackup.KEK file is missing.         | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS agent.<li>Move the scratch folder or cache location to a volume with free space that's between 5% and 10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Common questions about backing up files and folders](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#manage-the-backup-cache-folder).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.        |

## Encryption passphrase not correctly configured

| Error  | Possible causes | Recommended actions |
|---------|---------|---------|
| <br />Error 34506. The encryption passphrase stored on this computer is not correctly configured.    | <li> The scratch folder is located on a volume that doesn't have enough space. <li> The scratch folder has been incorrectly moved. <li> The OnlineBackup.KEK file is missing.        | <li>Upgrade to the [latest version](https://aka.ms/azurebackup_agent) of the MARS Agent.<li>Move the scratch folder or cache location to a volume with free space that's between 5% and 10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Common questions about backing up files and folders](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#manage-the-backup-cache-folder).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.         |

## Backups don't run according to schedule

If scheduled backups don't get triggered automatically but manual backups work correctly, try the following actions:

- Ensure the Windows Server backup schedule doesn't conflict with the Azure files and folders backup schedule.

- Ensure the  online backup status is set to **Enable**. To verify the status, take these steps:

  1. In Task Scheduler, expand **Microsoft** and select **Online Backup**.
  1. Double-click **Microsoft-OnlineBackup** and go to the **Triggers** tab.
  1. Check if the status is set to **Enabled**. If it isn't, select **Edit**, select **Enabled**, and then select **OK**.

- Ensure the user account selected for running the task is either **SYSTEM** or **Local Administrators' group** on the server. To verify the user account, go to the **General** tab and check the **Security** options.

- Ensure PowerShell 3.0 or later is installed on the server. To check the PowerShell version, run this command and verify that the `Major` version number is 3 or later:

  `$PSVersionTable.PSVersion`

- Ensure this path is part of the `PSMODULEPATH` environment variable:

  `<MARS agent installation path>\Microsoft Azure Recovery Services Agent\bin\Modules\MSOnlineBackup`

- If the PowerShell execution policy for `LocalMachine` is set to `restricted`, the PowerShell cmdlet that triggers the backup task might fail. Run these commands in elevated mode to check and set the execution policy to either `Unrestricted` or `RemoteSigned`:

 ```PowerShell
 Get-ExecutionPolicy -List

Set-ExecutionPolicy Unrestricted
 ```

- Ensure there are no missing or corrupt PowerShell module MSOnlineBackup files. If there are any missing or corrupt files, take these steps:

  1. From any machine that has a MARS agent that's working properly, copy the MSOnlineBackup folder from C:\Program Files\Microsoft Azure Recovery Services Agent\bin\Modules.
  1. On the problematic machine, paste the copied files at the same folder location (C:\Program Files\Microsoft Azure Recovery Services Agent\bin\Modules).

     If there's already an MSOnlineBackup folder on the machine, paste the files into it or replace any existing files.

> [!TIP]
> To ensure changes are applied consistently, restart the server after performing the preceding steps.

## Resource not provisioned in service stamp

Error | Possible causes | Recommended actions
--- | --- | ---
The current operation failed due to an internal service error "Resource not provisioned in service stamp". Please retry the operation after some time. (ID: 230006) | The protected server was renamed. | <li> Rename the server back to the original name as registered with the vault. <br> <li> Re-register the server to the vault with the new name.

## Troubleshoot restore problems

Azure Backup might not successfully mount the recovery volume, even after several minutes. And you might receive error messages during the process. To begin recovering normally, take these steps:

1. Cancel the mount process if it's been running for several minutes.

2. Check if you have the latest version of the Backup agent. To check the version, on the **Actions** pane of the MARS console, select **About Microsoft Azure Recovery Services Agent**. Confirm that the **Version** number is equal to or higher than the version mentioned in [this article](https://go.microsoft.com/fwlink/?linkid=229525). Select this link to [download the latest version](https://go.microsoft.com/fwLink/?LinkID=288905).

3. Go to **Device Manager** > **Storage controllers** and locate **Microsoft iSCSI Initiator**. If you locate it, go directly to step 7.

4. If you can't locate the Microsoft iSCSI Initiator service, try to find an entry under **Device Manager** > **Storage controllers** named **Unknown Device** with Hardware ID **ROOT\ISCSIPRT**.

5. Right-click **Unknown Device** and select **Update Driver Software**.

6. Update the driver by selecting the option to  **Search automatically for updated driver software**. This update should change **Unknown Device** to **Microsoft iSCSI Initiator**:

    ![Screenshot of Azure Backup Device Manager, with Storage controllers highlighted](./media/backup-azure-restore-windows-server/UnknowniSCSIDevice.png)

7. Go to **Task Manager** > **Services (Local)** > **Microsoft iSCSI Initiator Service**:

    ![Screenshot of Azure Backup Task Manager, with Services (Local) highlighted](./media/backup-azure-restore-windows-server/MicrosoftInitiatorServiceRunning.png)

8. Restart the Microsoft iSCSI Initiator service. To do this, right-click the service and select **Stop**. Then right-click it again and select **Start**.

9. Retry recovery by using [Instant Restore](backup-instant-restore-capability.md).

If the recovery still fails, restart your server or client. If you don't want to restart, or if the recovery still fails even after you restart the server, try [recovering from another machine](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine).

## Troubleshoot Cache problems

Backup operation may fail if the cache folder (also referred as scratch folder) is incorrectly configured, missing prerequisites or has restricted access.

### Prerequisites

For MARS agent operations to succeed the cache folder needs to adhere to the below requirements:

- [Ensure 5% to 10% free volume space is available in the scratch folder location](backup-azure-file-folder-backup-faq.md#whats-the-minimum-size-requirement-for-the-cache-folder)
- [Ensure scratch folder location is valid and accessible](backup-azure-file-folder-backup-faq.md#how-to-check-if-scratch-folder-is-valid-and-accessible)
- [Ensure file attributes on the cache folder are supported](backup-azure-file-folder-backup-faq.md#are-there-any-attributes-of-the-cache-folder-that-arent-supported)
- [Ensure the allocated shadow copy storage space is sufficient for backup process](#increase-shadow-copy-storage)
- [Ensure there are no other processes (ex. anti-virus software) restricting access to cache folder](#another-process-or-antivirus-software-blocking-access-to-cache-folder)

### Increase shadow copy storage

Backup operations could fail if there is insufficient shadow copy storage space required to protect the data source. To resolve this issue, increase the shadow copy storage space on the protected volume using vssadmin as shown below:

- Check the current shadow storage space from the elevated command prompt:<br/>
  `vssadmin List ShadowStorage /For=[Volume letter]:`
- Increase the shadow storage space using the below command:<br/>
  `vssadmin Resize ShadowStorage /On=[Volume letter]: /For=[Volume letter]: /Maxsize=[size]`

### Another process or antivirus software blocking access to cache folder

If you have antivirus software installed on the server, add necessary exclusion rules to the antivirus scan for these files and folders:  

- The scratch folder. Its default location is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch
- The bin folder at C:\Program Files\Microsoft Azure Recovery Services Agent\Bin
- CBengine.exe
- CSC.exe

## Common issues

This section covers the common errors that you encounter while using MARS agent.

### SalChecksumStoreInitializationFailed

Error message | Recommended action
-- | --
Microsoft Azure Recovery Services Agent was unable to access backup checksum stored in scratch location | To resolve this issue, perform the below and restart the server <br/> - [Check if there is an antivirus or other processes locking the scratch location files](#another-process-or-antivirus-software-blocking-access-to-cache-folder)<br/> - [Check if the scratch location is valid and accessible to mars agent.](backup-azure-file-folder-backup-faq.md#how-to-check-if-scratch-folder-is-valid-and-accessible)

### SalVhdInitializationError

Error message | Recommended action
-- | --
Microsoft Azure Recovery Services Agent was unable to access the scratch location to initialize VHD | To resolve this issue, perform the below and restart the server <br/> - [Check if there is an antivirus or other processes locking the scratch location files](#another-process-or-antivirus-software-blocking-access-to-cache-folder)<br/> - [Check if the scratch location is valid and accessible to mars agent.](backup-azure-file-folder-backup-faq.md#how-to-check-if-scratch-folder-is-valid-and-accessible)

### SalLowDiskSpace

Error message | Recommended action
-- | --
Backup failed due to insufficient storage in volume  where the scratch folder is located | To resolve this issue, verify the below steps and retry the operation:<br/>- [Ensure MARS agent is latest](https://go.microsoft.com/fwlink/?linkid=229525&clcid=0x409)<br/> - [Verify and resolve storage issues that impact backup scratch space](#prerequisites)

### SalBitmapError

Error message | Recommended action
-- | --
Unable to find changes in a file. This could be due to various reasons. Please retry the operation | To resolve this issue, verify the below steps and retry the operation:<br/> - [Ensure MARS agent is latest](https://go.microsoft.com/fwlink/?linkid=229525&clcid=0x409) <br/> - [Verify and resolve storage issues that impact backup scratch space](#prerequisites)

## Next steps

- Get more details on [how to back up Windows Server with the Azure Backup agent](tutorial-backup-windows-server-to-azure.md).
- If you need to restore a backup, see [restore files to a Windows machine](backup-azure-restore-windows-server.md).
