---
title: 'Azure Backup: application consistent backups of Linux VMs | Microsoft Docs'
description: Use scripts to guarantee application-consistent backups to Azure, for your Linux virtual machines. The scripts apply only to Linux VMs in a Resource Manager deployment; the scripts do not apply to Windows VMs or service manager deployments. This article takes you through the steps for configuring the scripts, including troubleshooting.
services: backup
documentationcenter: dev-center-name
author: anuragmehrotra
manager: shivamg
keywords: app-consistent backup; application-consistent Azure VM backup; Linux VM backup; Azure Backup

ms.assetid: bbb99cf2-d8c7-4b3d-8b29-eadc0fed3bef
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 4/12/2017
ms.author: anuragm;markgal

---
# Application consistent backup of Azure Linux VMs (Preview)

This article talks about the Linux pre- and post-script framework, and how it can be used to take application-consistent backups of Azure Linux VMs.

> [!Note]
> Pre- and post-script framework is supported only for Resource Manager-deployed Linux virtual machines. Scripts for application consistency is not supported for Service Manager-deployed virtual machines or Windows virtual machines.
>

## How the framework works

The framework provides an option to run custom pre and post scripts while taking VM snapshot. Pre-script is executed just before taking the VM snapshot and post script is executed immediately after VM snapshot completion. This gives the flexibility to users to control their application and environment while taking VM backup.

An important scenario for this framework is to ensure application consistent VM backup. The pre-script can invoke application native APIs to quiesce the IOs and flush in memory content to the disk, this will ensure that the snapshot is application consistent i.e. application will come up when the VM is booted post restore. Post-script can be used to thaw the IOs using application native APIs so the application can resume normal operations post VM snapshot.

## Steps to configure pre-script and post-script

1. Log in to the Linux VM to be backed up as the root user.

2. Download VMSnapshotScriptPluginConfig.json from [github](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig) and copy it to /etc/azure folder on all the VMs to be backed up. Create the /etc/azure directory if it does not exist already.

3. Copy the pre-script and post-script for your application on all the VMs to be backed up. You can copy the scripts to any location with-in the VM, you need to update the full path of the script files in VMSnapshotScriptPluginConfig.json file

4. Ensure following permissions for the files:

   - VMSnapshotScriptPluginConfig.json- Permission “600” i.e. only “root” user should have “read” and “write” permissions to this file, no user should have “execute” permissions.
   - Pre-script file- Permission “700” i.e. only “root” user should have “read”, “write”, and “execute” permissions to this file.
   - Post-script- Permission “700” i.e. only “root” user should have “read”, “write”, and “execute” permissions to this file.

   > [!Note]
   > The framework provides a lot of power to the users, so it’s very important it is completely secure and only “root” user should have access to critical json and script files.
   > If in case the above requirements are not met, script will not be executed, resulting in file system/crash consistent backup.
   >

5. Configure VMSnapshotScriptPluginConfig.json as per below details
    - **pluginName**- Leave this field as it is otherwise your scripts may not work as expected.
    - **preScriptLocation**- Provide full path of the pre-script on the VM to be backed up.
    - **postScriptLocation**- Provide full path of the post-script on the VM to be backed up.
    - **preScriptParams**- Any optional parameter that need to be passed to the pre-script, all parameters should be in quotes and comma separated in case of multiple params.
    - **postScriptParams**- Any optional parameter that need to be passed to the post-script, all parameters should be in quotes and comma separated in case of multiple params.
    - **preScriptNoOfRetries**- Number of times the pre-script should be re-tried in case of any error before terminating. 0 means only one try and no retry in case of failure.
    - **postScriptNoOfRetries**- Number of times the post-script should be re-tried in case of any error before terminating. 0 means only one try and no retry in case of failure.
    - **timeoutInSeconds**- Individual timeouts for the pre-script and the post-script.
    - **continueBackupOnFailure**- Set this value to true if you want Azure Backup to fall back to a file system consistent/crash consistent backup in case pre-script or post-script fails. Setting this to false will fail the backup in case of script failure (except in case of single disk VM where it will fall back to crash consistent backup irrespective of this setting).
    - **fsFreezeEnabled**- This specifies if Linux fsfreeze should be called while taking VM snapshot to ensure file system consistency. We recommend keeping this as true unless your application has dependency on disabling fsfreeze.

6. The script framework is now configured, if the VM backup is already configured next backup will invoke the scripts and trigger application consistent backup. If the VM backup is not configured, please configure using [Back up Azure virtual machines to Recovery Services vaults.](https://docs.microsoft.com/azure/backup/backup-azure-vms-first-look-arm)

## Troubleshooting

Please make sure you add appropriate logging while writing your pre-script and post-script and review your script logs to fix any script issues. If you still have problems executing scripts refer to following table for more information.

| Error | Error message | Recommended action |
| ------------------------ | -------------- | ------------------ |
| Pre-ScriptExecutionFailed |Pre-Script returned an error so backup may not be application consistent.	| Please look at the failure logs for your script to rectify the issue.|  
|	Post-ScriptExecutionFailed |	Post-Script returned an error which might impact application state. |	Please look at the failure logs for your script to rectify the issue and check the application state. |
| Pre-ScriptNotFound |	Pre-Script was not found at the location specified in the VMSnapshotScriptPluginConfig.json config file. |	Please make sure that Pre-Script is present at the path specified in the config file to ensure application consistent backup.|
| Post-ScriptNotFound |	Post-Script was not found at the location specified in VMSnapshotScriptPluginConfig.json config file |	Please make sure that Post-Script is present at the path specified in the config file to ensure application consistent backup.|
| IncorrectPluginhostFile |	Pluginhost file which comes with the VmSnapshotLinux extension is corrupted so pre-script and post-script cannot be executed and the backup will not be application consistent.	| Please un-install the VmSnapshotLinux extension, it will automatically be re-installed with next backup to fix the problem. |
| IncorrectJSONConfigFile | VMSnapshotScriptPluginConfig.json file is incorrect, so pre-script and post-script cannot be executed and the backup will not be application consistent | Please download the copy from [github](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig) and configure it again |
| InsufficientPermissionforPre-Script | For executing scripts, root user should be the owner of the file and file should have “700” permissions i.e. only owner should have “read”, “write”, and “execute” permissions | Make sure “root” user is the “owner” of the script file and only owner have “read”, “write” and “execute” permissions. |
| InsufficientPermissionforPost-Script | For executing scripts, root user should be the owner of the file and file should have “700” permissions i.e. only owner should have “read”, “write”, and “execute” permissions | Make sure “root” user is the “owner” of the script file and only owner have “read”, “write” and “execute” permissions. |
| Pre-ScriptTimeout | Execution of Application Consistent Backup Pre-Script timed-out. | Please check the script and increase the timeout in the VMSnapshotScriptPluginConfig.json file located at /etc/azure. |
| Post-ScriptTimeout | Execution of Application Consistent Backup Post-Script timed-out. | Please check the script and increase the timeout in the VMSnapshotScriptPluginConfig.json file located at /etc/azure. |

## Next Steps
[Configure VM backup to a Recovery Services Vault](https://docs.microsoft.com/azure/backup/backup-azure-arm-vms)
