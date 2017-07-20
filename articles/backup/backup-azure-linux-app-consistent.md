---
title: 'Azure Backup: application-consistent backups of Linux VMs | Microsoft Docs'
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

# Application-consistent backup of Azure Linux VMs (preview)

This article talks about the Linux pre-script and post-script framework, and how it can be used to take application-consistent backups of Azure Linux VMs.

> [!Note]
> The pre-script and post-script framework is supported only for Azure Resource Manager-deployed Linux virtual machines. Scripts for application consistency are not supported for Service Manager-deployed virtual machines or Windows virtual machines.
>

## How the framework works

The framework provides an option to run custom pre-scripts and post-scripts while you're taking VM snapshots. Pre-scripts are run just before you take the VM snapshot, and post-scripts are run immediately after you take the VM snapshot. This gives you the flexibility to control your application and environment while you're taking VM snapshots.

In this scenario, it's important to ensure application-consistent VM backup. The pre-script can invoke application-native APIs to quiesce the IOs and flush in-memory content to the disk. This ensures that the snapshot is application-consistent (that is, that the application comes up when the VM is booted post-restore). Post-script can be used to thaw the IOs. It does this by using application-native APIs so that the application can resume normal operations post-VM snapshot.

## Steps to configure pre-script and post-script

1. Sign in as the root user to the Linux VM that you want to back up.

2. Download **VMSnapshotScriptPluginConfig.json** from [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig), and then copy it to the **/etc/azure** folder on all the VMs that you're going to back up. Create the **/etc/azure** directory if it doesn't exist already.

3. Copy the pre-script and post-script for your application on all the VMs that you plan to back up. You can copy the scripts to any location on the VM. Be sure to update the full path of the script files in the **VMSnapshotScriptPluginConfig.json** file.

4. Ensure the following permissions for these files:

   - **VMSnapshotScriptPluginConfig.json**: Permission “600.” For example, only “root” user should have “read” and “write” permissions to this file, and no user should have “execute” permissions.

   - **Pre-script file**: Permission “700.”  For example, only “root” user should have “read”, “write”, and “execute” permissions to this file.
  
   - **Post-script** Permission “700.” For example, only “root” user should have “read”, “write”, and “execute” permissions to this file.

   > [!Important]
   > The framework gives users a lot of power. It’s important that it's secure and that only “root” user has access to critical JSON and script files.
   > If the previous requirements aren't met, the script doesn't run. This results in file system/crash consistent backup.
   >

5. Configure **VMSnapshotScriptPluginConfig.json** as described here:
    - **pluginName**: Leave this field as is or your scripts might not work as expected.

    - **preScriptLocation**: Provide the full path of the pre-script on the VM that's going to be backed up.

    - **postScriptLocation**: Provide the full path of the post-script on the VM that's going to be backed up.

    - **preScriptParams**: Provide the optional parameters that need to be passed to the pre-script. All parameters should be in quotes, and should be comma-separated if there are multiple parameters.

    - **postScriptParams**: Provide the optional parameters that need to be passed to the post-script. All parameters should be in quotes, and should be comma-separated if there are multiple parameters.

    - **preScriptNoOfRetries**: Set the number of times the pre-script should be retried if there is any error before terminating. Zero means only one try and no retry if there is a failure.

    - **postScriptNoOfRetries**:  Set the number of times the post-script should be retried if there is any error before terminating. Zero means only one try and no retry if there is a failure.
    
    - **timeoutInSeconds**: Specify individual timeouts for the pre-script and the post-script.

    - **continueBackupOnFailure**: Set this value to **true** if you want Azure Backup to fall back to a file system consistent/crash consistent backup if pre-script or post-script fails. Setting this to **false** fails the backup in case of script failure (except when you have single-disk VM that falls back to crash-consistent backup regardless of this setting).

    - **fsFreezeEnabled**: Specify whether Linux fsfreeze should be called while you're taking the VM snapshot to ensure file system consistency. We recommend keeping this setting set to **true** unless your application has a dependency on disabling fsfreeze.

6. The script framework is now configured. If the VM backup is already configured, the next backup invokes the scripts and triggers application-consistent backup. If the VM backup is not configured, configure it by using [Back up Azure virtual machines to Recovery Services vaults.](https://docs.microsoft.com/azure/backup/backup-azure-vms-first-look-arm)

## Troubleshooting

Make sure you add appropriate logging while writing your pre-script and post-script, and review your script logs to fix any script issues. If you still have problems running scripts, refer to the following table for more information.

| Error | Error message | Recommended action |
| ------------------------ | -------------- | ------------------ |
| Pre-ScriptExecutionFailed |The pre-script returned an error, so backup might not be application-consistent.	| Look at the failure logs for your script to fix the issue.|  
|	Post-ScriptExecutionFailed |	The post-script returned an error that might impact application state. |	Look at the failure logs for your script to fix the issue and check the application state. |
| Pre-ScriptNotFound |	The pre-script was not found at the location that's specified in the **VMSnapshotScriptPluginConfig.json** config file. |	Make sure that pre-script is present at the path that's specified in the config file to ensure application-consistent backup.|
| Post-ScriptNotFound |	The post-script wasn't found at the location that's specified in the **VMSnapshotScriptPluginConfig.json** config file. |	Make sure that post-script is present at the path that's specified in the config file to ensure application-consistent backup.|
| IncorrectPluginhostFile |	The **Pluginhost** file, which comes with the VmSnapshotLinux extension, is corrupted, so pre-script and post-script cannot run and the backup won't be application-consistent.	| Uninstall the **VmSnapshotLinux** extension, and it will automatically be reinstalled with the next backup to fix the problem. |
| IncorrectJSONConfigFile | The **VMSnapshotScriptPluginConfig.json** file is incorrect, so pre-script and post-script cannot run and the backup won't be application-consistent. | Download the copy from [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig) and configure it again. |
| InsufficientPermissionforPre-Script | For running scripts, "root" user should be the owner of the file and the file should have “700” permissions (that is, only "owner" should have “read”, “write”, and “execute” permissions). | Make sure “root” user is the “owner” of the script file and that only "owner" has “read”, “write” and “execute” permissions. |
| InsufficientPermissionforPost-Script | For running scripts, root user should be the owner of the file and the file should have “700” permissions (that is, only "owner" should have “read”, “write”, and “execute” permissions). | Make sure “root” user is the “owner” of the script file and that only "owner" has “read”, “write” and “execute” permissions. |
| Pre-ScriptTimeout | The execution of the application-consistent backup pre-script timed-out. | Check the script and increase the timeout in the **VMSnapshotScriptPluginConfig.json** file that's located at **/etc/azure**. |
| Post-ScriptTimeout | The execution of the application-consistent backup post-script timed out. | Check the script and increase the timeout in the **VMSnapshotScriptPluginConfig.json** file that's located at **/etc/azure**. |

## Next steps
[Configure VM backup to a Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-azure-arm-vms)
