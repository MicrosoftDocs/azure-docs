---
title: Application-consistent backups of Linux VMs using Azure Backup
description: Create application-consistent backups of your Linux virtual machines to Azure. This article explains configuring the script framework to back up Azure-deployed Linux VMs. This article also includes troubleshooting information.
ms.service: azure-backup
ms.topic: how-to
ms.custom: linux-related-content, engagement-fy24
ms.date: 04/23/2024
author: jyothisuri
ms.author: jsuri
---

# Application-consistent backup of Azure Linux VMs using Azure Backup

This article describes how to create application-consistent backups of your Linux Virtual Machines to Azure by using Azure Backup. In this article, you'll configure the script framework to back up Azure-deployed Linux VMs. This article also provides the troubleshooting information.

When you take backup snapshots of VMs, application consistency means your applications start when the VMs boot after being restored. As you can imagine, application consistency is extremely important. To ensure your Linux VMs are application consistent, you can use the Linux prescript and post-script framework to take application-consistent backups. The prescript and post-script framework supports Azure Resource Manager-deployed Linux virtual machines. Scripts for application consistency don't support Service Manager-deployed virtual machines or Windows virtual machines.

## How the framework works

The framework provides an option to run custom prescripts and post-scripts while you're taking VM snapshots. Prescripts run just before you take the VM snapshot, and post-scripts run immediately after you take the VM snapshot. Prescripts and post-scripts provide the flexibility to control your application and environment, while you're taking VM snapshots.

Prescripts invoke native application APIs, which quiesce the IOs, and flush in-memory content to the disk. These actions ensure the snapshot is application consistent. Post-scripts use native application APIs to thaw the IOs, which enable the application to resume normal operations after the VM snapshot.

## Configure prescript and post-script for Azure Linux VM

To configure Prescript and post-script, follow these steps:

1. Sign in as the root user to the Linux VM that you want to back up.

2. From [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig), download **VMSnapshotScriptPluginConfig.json** and copy it to the **/etc/azure** folder for all VMs you want to back up. If the **/etc/azure** folder doesn't exist, create it.

3. Copy the prescript and post-script for your application on all VMs you plan to back up. You can copy the scripts to any location on the VM. Be sure to update the full path of the script files in the **VMSnapshotScriptPluginConfig.json** file.

4. Ensure the following permissions for these files:

   - **VMSnapshotScriptPluginConfig.json**: Permission “600.” For example, only “root” user should have “read” and “write” permissions to this file, and no user should have “execute” permissions.

   - **Pre-script file**: Permission “700.”  For example, only “root” user should have “read”, “write”, and “execute” permissions to this file. The file is expected to be a shell script but theoretically this script can internally spawn or refer to other scripts like a Python script.

   - **Post-script** Permission “700.” For example, only “root” user should have “read”, “write”, and “execute” permissions to this file. The file is expected to be a shell script but theoretically this script can internally spawn or refer to other scripts like a Python script.

   > [!IMPORTANT]
   > The framework gives users a lot of power. Secure the framework, and ensure only “root” user has access to critical JSON and script files.
   > If the requirements aren't met, the script won't run, which results in a file system crash and inconsistent backup.
   >

5. Configure **VMSnapshotScriptPluginConfig.json** as described here:
    - **pluginName**: Leave this field as is, or your scripts might not work as expected.

    - **preScriptLocation**: Provide the full path of the prescript on the VM that's going to be backed up.

    - **postScriptLocation**: Provide the full path of the post-script on the VM that's going to be backed up.

    - **preScriptParams**: Provide the optional parameters that need to be passed to the prescript. All parameters should be in quotes. If you use multiple parameters, separate the parameters with a comma.

    - **postScriptParams**: Provide the optional parameters that need to be passed to the post-script. All parameters should be in quotes. If you use multiple parameters, separate the parameters with a comma.

    - **preScriptNoOfRetries**: Set the number of times the prescript should be retried if there's any error before terminating. Zero means only one try and no retry if there's a failure.

    - **postScriptNoOfRetries**:  Set the number of times the post-script should be retried if there's any error before terminating. Zero means only one try and no retry if there's a failure.

    - **timeoutInSeconds**: Specify individual timeouts for the prescript and the post-script (maximum value can be 1800).

    - **continueBackupOnFailure**: Set this value to **true** if you want Azure Backup to fall back to a file system consistent/crash consistent backup if prescript or post-script fails. Setting this to **false** fails the backup if there's a script failure (except when you have a single-disk VM that falls back to crash-consistent backup regardless of this setting). When the **continueBackupOnFailure** value is set to false, if the backup fails the backup operation will be attempted again based on a retry logic in service (for the stipulated number of attempts).

    - **fsFreezeEnabled**: Specify whether Linux fsfreeze should be called while you're taking the VM snapshot to ensure file system consistency. We recommend keeping this setting set to **true** unless your application has a dependency on disabling fsfreeze.

    - **ScriptsExecutionPollTimeSeconds**: Set the time the extension has to sleep between each poll to the script execution. For example, if the value is 2, the extension checks whether the pre/post script execution completed every 2 seconds. The minimum and maximum value it can take is 1 and 5 respectively. The value should be strictly an integer.

6. The script framework is now configured. If the VM backup is already configured, the next backup invokes the scripts and triggers application-consistent backup. If the VM backup isn't configured, configure it by using [Back up Azure virtual machines to Recovery Services vaults.](./backup-azure-vms-first-look-arm.md)

## Troubleshooting

Make sure you add appropriate logging while writing your prescript and post-script, and review your script logs to fix any script issues. If you still have problems running scripts, refer to the following table for more information.

| Error | Error message | Recommended action |
| ------------------------ | -------------- | ------------------ |
| Pre-ScriptExecutionFailed |The prescript returned an error, so backup might not be application-consistent.| Look at the failure logs for your script to fix the issue.|  
|Post-ScriptExecutionFailed |The post-script returned an error that might impact application state. |Look at the failure logs for your script to fix the issue and check the application state. |
| Pre-ScriptNotFound |The prescript wasn't found at the location that's specified in the **VMSnapshotScriptPluginConfig.json** config file. |Make sure that prescript is present at the path that's specified in the config file to ensure application-consistent backup.|
| Post-ScriptNotFound |The post-script wasn't found at the location that's specified in the **VMSnapshotScriptPluginConfig.json** config file. |Make sure that post-script is present at the path that's specified in the config file to ensure application-consistent backup.|
| IncorrectPluginhostFile |The **Pluginhost** file, which comes with the VmSnapshotLinux extension, is corrupted, so prescript and post-script can't run and the backup won't be application-consistent.| Uninstall the **VmSnapshotLinux** extension, and it will automatically be reinstalled with the next backup to fix the problem. |
| IncorrectJSONConfigFile | The **VMSnapshotScriptPluginConfig.json** file is incorrect, so prescript and post-script can't run and the backup won't be application-consistent. | Download the copy from [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig) and configure it again. |
| InsufficientPermissionforPre-Script | For running scripts, "root" user should be the owner of the file and the file should have “700” permissions (that is, only "owner" should have “read”, “write”, and “execute” permissions). | Make sure “root” user is the “owner” of the script file and that only "owner" has “read”, “write” and “execute” permissions. |
| InsufficientPermissionforPost-Script | For running scripts, root user should be the owner of the file and the file should have “700” permissions (that is, only "owner" should have “read”, “write”, and “execute” permissions). | Make sure “root” user is the “owner” of the script file and that only "owner" has “read”, “write” and “execute” permissions. |
| Pre-ScriptTimeout | The execution of the application-consistent backup pre-script timed-out. | Check the script and increase the timeout in the **VMSnapshotScriptPluginConfig.json** file that's located at **/etc/azure**. |
| Post-ScriptTimeout | The execution of the application-consistent backup post-scripts timed out. | Check the script and increase the timeout in the **VMSnapshotScriptPluginConfig.json** file that's located at **/etc/azure**. |

## Next steps

[Configure VM backup to a Recovery Services vault](./backup-azure-vms-first-look-arm.md)
