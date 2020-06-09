---
title: Troubleshoot Azure Backup Server
description: Troubleshoot installation, registration of Azure Backup Server, and backup and restore of application workloads.
ms.reviewer: srinathv
ms.topic: troubleshooting
ms.date: 07/05/2019
---

# Troubleshoot Azure Backup Server

Use the information in the following tables to troubleshoot errors that you encounter while using Azure Backup Server.

## Basic troubleshooting

We recommend you perform the below validation, before you start troubleshooting Microsoft Azure Backup Server (MABS):

- [Ensure Microsoft Azure Recovery Services (MARS) Agent is up to date](https://go.microsoft.com/fwlink/?linkid=229525&clcid=0x409)
- [Ensure there is network connectivity between MARS agent and Azure](https://docs.microsoft.com/azure/backup/backup-azure-mars-troubleshoot#the-microsoft-azure-recovery-service-agent-was-unable-to-connect-to-microsoft-azure-backup)
- Ensure Microsoft Azure Recovery Services is running (in Service console). If necessary, restart and retry the operation
- [Ensure 5-10% free volume space is available on scratch folder location](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#whats-the-minimum-size-requirement-for-the-cache-folder)
- If registration is failing, then ensure the server on which you are trying to install Azure Backup Server is not already registered with another vault
- If Push install fails, check if DPM agent is already present. If yes, then uninstall the agent and retry the installation
- [Ensure no other process or antivirus software is interfering with Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-slow-backup-performance-issue#cause-another-process-or-antivirus-software-interfering-with-azure-backup)<br>
- Ensure that the SQL Agent service is running and set to automatic in the MABS server<br>

## Invalid vault credentials provided

| Operation | Error details | Workaround |
| --- | --- | --- |
| Registering to a vault | Invalid vault credentials provided. The file is corrupted or does not have the latest credentials associated with the recovery service. | Recommended action: <br> <ul><li> Download the latest credentials file from the vault and try again. <br>(OR)</li> <li> If the previous action didn't work, try downloading the credentials to a different local directory or create a new vault. <br>(OR)</li> <li> Try updating the date and time settings as described in [this article](https://docs.microsoft.com/azure/backup/backup-azure-mars-troubleshoot#invalid-vault-credentials-provided). <br>(OR)</li> <li> Check to see if c:\windows\temp has more than 65000 files. Move stale files to another location or delete the items in the Temp folder. <br>(OR)</li> <li> Check the status of certificates. <br> a. Open **Manage Computer Certificates** (in Control Panel). <br> b. Expand the **Personal** node and its child node **Certificates**.<br> c.  Remove the certificate **Windows Azure Tools**. <br> d. Retry the registration in the Azure Backup client. <br> (OR) </li> <li> Check to see if any group policy is in place. </li></ul> |

## Replica is inconsistent

| Operation | Error details | Workaround |
| --- | --- | --- |
| Backup | Replica is inconsistent | Verify that the automatic consistency check option in the Protection Group Wizard is turned on. For more information about replication options and consistency checks, see [this article](https://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups?view=sc-dpm-2019) .<br> <ol><li> In case of System State/BMR backup, verify that Windows Server Backup is installed on the protected server.</li><li> Check for space-related issues in the DPM storage pool on the DPM/Microsoft Azure Backup Server, and allocate storage as required.</li><li> Check the state of the Volume Shadow Copy Service on the protected server. If it is in a disabled state, set it to start manually. Start the service on the server. Then go back to the DPM/Microsoft Azure Backup Server console, and start the sync with the consistency check job.</li></ol>|

## Online recovery point creation failed

| Operation | Error details | Workaround |
| --- | --- | --- |
| Backup | Online recovery point creation failed | **Error Message**: Windows Azure Backup Agent was unable to create a snapshot of the selected volume. <br> **Workaround**: Try increasing the space in replica and recovery point volume.<br> <br> **Error Message**: The Windows Azure Backup Agent cannot connect to the OBEngine service <br> **Workaround**: verify that the OBEngine exists in the list of running services on the computer. If the OBEngine service is not running, use the "net start OBEngine" command to start the OBEngine service. <br> <br> **Error Message**: The encryption passphrase for this server is not set. Please configure an encryption passphrase. <br> **Workaround**: Try configuring an encryption passphrase. If it fails, take the following steps: <br> <ol><li>Verify that the scratch location exists. This is the location that's mentioned in the registry **HKEY_LOCAL_MACHINE\Software\Microsoft\Windows Azure Backup\Config**, with the name **ScratchLocation** should exist.</li><li> If the scratch location exists, try re-registering by using the old passphrase. *Whenever you configure an encryption passphrase, save it in a secure location.*</li><ol>|

## The original and external DPM servers must be registered to the same vault

| Operation | Error details | Workaround |
| --- | --- | --- |
| Restore | **Error code**: CBPServerRegisteredVaultDontMatchWithCurrent/Vault Credentials Error: 100110 <br/> <br/>**Error message**: The original and external DPM servers must be registered to the same vault | **Cause**: This issue occurs when you are trying to restore files to the alternate server from the original server using External DPM recovery option and if the server that is being recovered and the original server from where the data is backed-up are not associated with the same Recovery Service vault.<br/> <br/>**Workaround** To resolve this issue ensure both the original and alternate server is registered to the same vault.|

## Online recovery point creation jobs for VMware VM fail

| Operation | Error details | Workaround |
| --- | --- | --- |
| Backup | Online recovery point creation jobs for VMware VM fail. DPM encountered an error from VMware while trying to get ChangeTracking information. ErrorCode - FileFaultFault (ID 33621) |  <ol><li> Reset the CTK on VMware for the affected VMs.</li> <li>Check that independent disk is not in place on VMware.</li> <li>Stop protection for the affected VMs and reprotect with the **Refresh** button. </li><li>Run a CC for the affected VMs.</li></ol>|

## The agent operation failed because of a communication error with the DPM agent coordinator service on the server

| Operation | Error details | Workaround |
| --- | --- | --- |
| Pushing agent(s) to protected servers | The agent operation failed because of a communication error with the DPM Agent Coordinator service on \<ServerName>. | **If the recommended action shown in the product doesn't work, then perform the following steps**: <ul><li> If you are attaching a computer from an untrusted domain, follow [these steps](https://docs.microsoft.com/system-center/dpm/back-up-machines-in-workgroups-and-untrusted-domains?view=sc-dpm-2019). <br> (OR) </li><li> If you are attaching a computer from a trusted domain, troubleshoot using the steps outlined in [this blog](https://techcommunity.microsoft.com/t5/system-center-blog/data-protection-manager-agent-network-troubleshooting/ba-p/344726). <br>(OR)</li><li> Try disabling antivirus as a troubleshooting step. If it resolves the issue, modify the antivirus settings as suggested in [this article](https://docs.microsoft.com/system-center/dpm/run-antivirus-server?view=sc-dpm-2019).</li></ul> |

## Setup could not update registry metadata

| Operation | Error details | Workaround |
|-----------|---------------|------------|
|Installation | Setup could not update registry metadata. This update failure could lead to overusage of storage consumption. To avoid this update the ReFS Trimming registry entry. | Adjust the registry key **SYSTEM\CurrentControlSet\Control\FileSystem\RefsEnableInlineTrim**. Set the value Dword to 1. |
|Installation | Setup could not update registry metadata. This update failure could lead to overusage of storage consumption. To avoid this, update the Volume SnapOptimization registry entry. | Create the registry key **SOFTWARE\Microsoft Data Protection Manager\Configuration\VolSnapOptimization\WriteIds** with an empty string value. |

## Registration and agent-related issues

| Operation | Error details | Workaround |
| --- | --- | --- |
| Pushing agent(s) to protected servers | The credentials that are specified for the server are invalid. | **If the recommended action that's shown in the product doesn't work, take the following steps**: <br> Try to install the protection agent manually on the production server as specified in [this article](https://docs.microsoft.com/system-center/dpm/deploy-dpm-protection-agent?view=sc-dpm-2019).|
| Azure Backup Agent was unable to connect to the Azure Backup service (ID: 100050) | The Azure Backup Agent was unable to connect to the Azure Backup service. | **If the recommended action that's shown in the product doesn't work, take the following steps**: <br>1. Run the following command from an elevated prompt: **psexec -i -s "c:\Program Files\Internet Explorer\iexplore.exe**. This opens the Internet Explorer window. <br/> 2. Go to **Tools** > **Internet Options** > **Connections** > **LAN settings**. <br/> 3. Change the settings to use a proxy server. Then provide the proxy server details.<br/> 4. If your machine has limited internet access, ensure that firewall settings on the machine or proxy allow these [URLs](install-mars-agent.md#verify-internet-access) and [IP address](install-mars-agent.md#verify-internet-access).|
| Azure Backup Agent installation failed | The Microsoft Azure Recovery Services installation failed. All changes that were made to the system by the Microsoft Azure Recovery Services installation were rolled back. (ID: 4024) | Manually install Azure Agent.

## Configuring protection group

| Operation | Error details | Workaround |
| --- | --- | --- |
| Configuring protection groups | DPM could not enumerate the application component on the protected computer (protected computer name). | Select **Refresh** on the configure protection group UI screen at the relevant datasource/component level. |
| Configuring protection groups | Unable to configure protection | If the protected server is a SQL server, verify that the sysadmin role permissions have been provided to the system account (NTAuthority\System) on the protected computer as described in [this article](https://docs.microsoft.com/system-center/dpm/back-up-sql-server?view=sc-dpm-2019).
| Configuring protection groups | There is insufficient free space in the storage pool for this protection group. | The disks that are added to the storage pool [should not contain a partition](https://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups?view=sc-dpm-2019). Delete any existing volumes on the disks. Then add them to the storage pool.|
| Policy change |The backup policy could not be modified. Error: The current operation failed due to an internal service error [0x29834]. Please retry the operation after some time has passed. If the issue persists, contact Microsoft support. | **Cause:**<br/>This error occurs under three conditions: when security settings are enabled, when you try to reduce retention range below the minimum values specified previously, and when you are on an unsupported  version. (Unsupported versions are those below Microsoft Azure Backup Server version 2.0.9052 and Azure Backup Server update 1.) <br/>**Recommended action:**<br/> To proceed with policy-related updates, set the retention period above the minimum retention period specified. (The minimum retention period is seven days for daily, four weeks for weekly, three weeks for monthly or one year for yearly.) <br><br>Optionally, another preferred approach is to update the backup agent and Azure Backup Server to leverage all the security updates. |

## Backup

| Operation | Error details | Workaround |
| --- | --- | --- |
| Backup | An unexpected error occurred while the job was running. The device is not ready. | **If the recommended action that's shown in the product doesn't work, take the following steps:** <br> <ul><li>Set the Shadow Copy Storage space to unlimited on the items in the protection group, and then run the consistency check.<br></li> (OR) <li>Try deleting the existing protection group and creating multiple new groups. Each new protection group should have an individual item in it.</li></ul> |
| Backup | If you are backing up only system state, verify that there is enough free space on the protected computer to store the system state backup. | <ol><li>Verify that Windows Server Backup is installed on the protected machine.</li><li>Verify that there is enough space on the protected computer for the system state. The easiest way to verify this is to go to the protected computer, open Windows Server Backup, click through the selections, and then select BMR. The UI then tells you how much space is required. Open **WSB** > **Local backup** > **Backup schedule** > **Select Backup Configuration** > **Full server** (size is displayed). Use this size for verification.</li></ol>
| Backup | Back up failure for BMR | If the BMR size is large, move some application files to the OS drive and retry. |
| Backup | The option to reprotect a VMware VM on a new Microsoft Azure Backup Server does not show as available to add. | VMware properties are pointed at an old, retired instance of Microsoft Azure Backup Server. To resolve this issue:<br><ol><li>In VCenter (SC-VMM equivalent), go to the **Summary** tab, and then to **Custom Attributes**.</li>  <li>Delete the old Microsoft Azure Backup Server name from the **DPMServer** value.</li>  <li>Go back to the new Microsoft Azure Backup Server and modify the PG.  After you select the **Refresh** button, the VM appears with a check box as available to add to protection.</li></ol> |
| Backup | Error while accessing files/shared folders | Try modifying the antivirus settings as suggested in this article [Run antivirus software on the DPM server](https://docs.microsoft.com/system-center/dpm/run-antivirus-server?view=sc-dpm-2019).|

## Change passphrase

| Operation | Error details | Workaround |
| --- | --- | --- |
| Change passphrase |The security PIN that was entered is incorrect. Provide the correct security PIN to complete this operation. |**Cause:**<br/> This error occurs when you enter an invalid or expired security PIN while you are performing a critical operation (such as changing a passphrase). <br/>**Recommended action:**<br/> To complete the operation, you must enter a valid security PIN. To get the PIN, sign in to the Azure portal and go to the Recovery Services vault. Then go to **Settings** > **Properties** > **Generate Security PIN**. Use this PIN to change the passphrase. |
| Change passphrase |Operation failed. ID: 120002 |**Cause:**<br/>This error occurs when security settings are enabled, or when you try to change the passphrase when you're using an  unsupported version.<br/>**Recommended action:**<br/> To change the passphrase, you must first update the backup agent to the minimum version, which is 2.0.9052. You also need to update Azure Backup Server to the minimum of update 1, and then enter a valid security PIN. To get the PIN, sign into the Azure portal and go to the Recovery Services vault. Then go to **Settings** > **Properties** > **Generate Security PIN**. Use this PIN to change the passphrase. |

## Configure email notifications

| Operation | Error details | Workaround |
| --- | --- | --- |
| Setting up email notifications using an Office 365 account |Error ID: 2013| **Cause:**<br> Trying to use Office 365 account <br>**Recommended action:**<ol><li> The first thing to ensure is that "Allow Anonymous Relay on a Receive Connector" for your DPM server is set up on Exchange. For more information about how to configure this, see [Allow Anonymous Relay on a Receive Connector](https://docs.microsoft.com/exchange/mail-flow/connectors/allow-anonymous-relay?view=exchserver-2019).</li> <li> If you can't use an internal SMTP relay and need to set up by using your Office 365 server, you can set up IIS to be a relay. Configure the DPM server to [relay the SMTP to O365 using IIS](https://docs.microsoft.com/exchange/mail-flow/test-smtp-with-telnet?view=exchserver-2019)).<br><br>  Be sure to use the user\@domain.com format and *not* domain\user.<br><br><li>Point DPM to use the local server name as SMTP server, port 587. Then point it to the user email that the emails should come from.<li> The username and password on the DPM SMTP setup page should be for a domain account in the domain that DPM is on. </li><br> When you are changing the SMTP server address, make the change to the new settings, close the settings box, and then reopen it to be sure it reflects the new value.  Simply changing and testing might not always cause the new settings to take effect, so testing it this way is a best practice.<br><br>At any time during this process, you can clear these settings by closing the DPM console and editing the following registry keys: **HKLM\SOFTWARE\Microsoft\Microsoft Data Protection Manager\Notification\ <br/> Delete SMTPPassword and SMTPUserName keys**. You can add them back to the UI when you launch it again.

## Common issues

This section covers the common errors that you might encounter while using Azure Backup Server.

### CBPSourceSnapshotFailedReplicaMissingOrInvalid

Error message | Recommended action |
-- | --
Backup failed because the disk-backup replica is either invalid or missing. | To resolve this issue, verify the below steps and retry the operation: <br/> 1. Create a disk recovery point<br/> 2. Run consistency check on datasource <br/> 3. Stop protection of datasource and then reconfigure protection for this data source

### CBPSourceSnapshotFailedReplicaMetadataInvalid

Error message | Recommended action |
-- | --
Source volume snapshot failed because metadata on replica is invalid. | Create a disk recovery point of this datasource and retry online backup again

### CBPSourceSnapshotFailedReplicaInconsistent

Error message | Recommended action |
-- | --
Source volume snapshot failed due to inconsistent datasource replica. | Run a consistency check on this datasource and try again

### CBPSourceSnapshotFailedReplicaCloningIssue

Error message | Recommended action |
-- | --
Backup failed as the disk-backup replica could not be cloned.| Ensure that all previous disk-backup replica files (.vhdx) are unmounted and no disk to disk backup is in progress during online backups
