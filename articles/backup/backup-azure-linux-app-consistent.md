---
title: Configure Application-Consistent Backup for Azure Linux VMs by Using Azure Backup
description: Learn how to create application-consistent backups for Azure-deployed Linux VMs by using Azure Backup.
ms.service: azure-backup
ms.topic: how-to
ms.custom: linux-related-content, engagement-fy24
ms.date: 04/15/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a system administrator managing Azure Linux VMs, I want to configure application-consistent backups for Azure VMs with Linux by using custom scripts so that I can ensure that my applications remain functional and data integrity is maintained after restoration.
---

# Configure application-consistent backup for Azure Linux VMs by using Azure Backup

This article describes how to create application-consistent backups for Azure-deployed Linux virtual machines (VMs) by using Azure Backup. It covers how to configure the script framework and troubleshooting.

When Azure Backup takes a snapshot of a VM, application consistency ensures that applications start correctly after VM restoration. To achieve this behavior, use the Linux prescript and postscript framework, which supports Linux VMs deployed with Azure Resource Manager. These scripts don't work for VMs deployed with System Center Service Manager or Windows.

## How does the framework work?

The framework provides an option to run custom prescripts and postscripts while you're taking VM snapshots. Prescripts run before you take the VM snapshot. Postscripts run immediately after you take the VM snapshot. Prescripts and postscripts provide the flexibility to control your application and environment while you're taking VM snapshots.

Prescripts invoke native application APIs, which quiet the I/Os, and flush in-memory content to the disk. These actions ensure that the snapshot is application consistent. Postscripts use native-application APIs to thaw the I/Os, which enables the application to resume normal operations after the VM snapshot.

## Configure prescript and postscript for Azure Linux VMs

To configure prescript and postscript, follow these steps:

1. Sign in as the root user to the Linux VM that you want to back up.

1. From [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig), download **VMSnapshotScriptPluginConfig.json** and copy it to the **/etc/azure** folder for all the VMs that you want to back up. If the **/etc/azure** folder doesn't exist, create it.

1. Copy the prescript and postscript for your application on all VMs that you plan to back up. You can copy the scripts to any location on the VM. Be sure to update the full path of the script files in the **VMSnapshotScriptPluginConfig.json** file.

1. To use the following files, ensure that you have the corresponding permissions:

   - **VMSnapshotScriptPluginConfig.json**: Permission is **600**. For example, only the root user should have read and write permissions to this file, and no user should have execute permissions.
   - **Prescript file**: Permission is **700**. For example, only the root user should have read, write, and execute permissions to this file. The file is expected to be a shell script, but theoretically, this script can internally spawn or refer to other scripts like a Python script.
   - **Postscript**: Permission is **700**. For example, only the root user should have read, write, and execute permissions to this file. The file is expected to be a shell script, but theoretically, this script can internally spawn or refer to other scripts like a Python script.

   > [!IMPORTANT]
   > The framework gives users numerous powers. Secure the framework, and ensure that only the root user has access to critical JSON and script files.
   >
   > If the requirements aren't met, the script can't run, which results in a file system crash and inconsistent backup.

1. Configure **VMSnapshotScriptPluginConfig.json** as described here:

    - `pluginName`: Leave this field as is, or your scripts might not work as expected.
    - `preScriptLocation`: Provide the full path of the prescript on the VM to be backed up.
    - `postScriptLocation`: Provide the full path of the postscript on the VM to be backed up.
    - `preScriptParams`: Provide the optional parameters that must be passed to the prescript. All parameters must be in quotation marks. If you use multiple parameters, separate the parameters with a comma.
    - `postScriptParams`: Provide the optional parameters that must be passed to the postscript. All parameters must be in quotation marks. If you use multiple parameters, separate the parameters with a comma.
    - `preScriptNoOfRetries`: Set the number of times that the prescript should be retried if an error occurs before terminating. Zero means only one try, and no retry if there's a failure.
    - `postScriptNoOfRetries`: Set the number of times that the postscript should be retried if an error occurs before terminating. Zero means only one try, and no retry if there's a failure.
    - `timeoutInSeconds`: Specify individual timeouts for the prescript and the postscript (maximum value is **1800**).
    - `continueBackupOnFailure`: Set this value to **true** if you want Azure Backup to fall back to a file system-consistent/crash-consistent backup if prescript or postscript fails. Setting this value to **false** fails the backup if a script failure occurs. (An exception is when you have a single-disk VM that falls back to crash-consistent backup regardless of this setting.) When the `continueBackupOnFailure` value is set to **false**, if the backup fails, the backup operation is attempted again based on a retry logic in service (for the stipulated number of attempts).
    - `fsFreezeEnabled`: Specify whether Linux `fsfreeze` should be called while you're taking the VM snapshot to ensure file system consistency. We recommend that you keep this setting set to **true** unless your application has a dependency on disabling `fsfreeze`.
    - `ScriptsExecutionPollTimeSeconds`: Set the time that the extension has to sleep between each poll to the script execution. For example, if the value is **2**, the extension checks whether the prescript or postscript execution completed every 2 seconds. The minimum and maximum value it can take is **1** and **5**, respectively. The value should be strictly an integer.

1. The script framework is now configured. If the VM backup is already configured, the next backup invokes the scripts and triggers application-consistent backup. If the VM backup isn't configured, configure it by following the steps in [Back up Azure virtual machines to Recovery Services vaults.](./backup-azure-vms-first-look-arm.md)

## Troubleshoot Azure Linux VM application-consistent backup errors

Make sure that you add appropriate logging while you write the prescript and postscript. Review your script logs to fix any script issues. If you still have problems running scripts, refer to the following table.

| Error | Error message | Recommended action |
| ------------------------ | -------------- | ------------------ |
| `Pre-ScriptExecutionFailed` |The prescript returned an error, so backup might not be application consistent.| Look at the failure logs for your script to fix the issue.|
| `Post-ScriptExecutionFailed` |The postscript returned an error that might affect the application state. |Look at the failure logs for your script to fix the issue, and check the application state. |
| `Pre-ScriptNotFound` |The prescript wasn't found at the location specified in the VMSnapshotScriptPluginConfig.json config file. |Make sure that the prescript is present at the path that was specified in the config file to ensure application-consistent backup.|
| `Post-ScriptNotFound` |The postscript wasn't found at the location that was specified in the VMSnapshotScriptPluginConfig.json config file. |Make sure that the postscript is present at the path that was specified in the config file to ensure application-consistent backup.|
| `IncorrectPluginhostFile` |The `Pluginhost` file, which comes with the `VmSnapshotLinux` extension, is corrupted, so the prescript and postscript can't run and the backup isn't application consistent.| Uninstall the `VmSnapshotLinux` extension. It automatically reinstalls with the next backup to fix the problem. |
| `IncorrectJSONConfigFile` | The VMSnapshotScriptPluginConfig.json file is incorrect, so the prescript and postscript can't run and the backup isn't application consistent. | Download the copy from [GitHub](https://github.com/MicrosoftAzureBackup/VMSnapshotPluginConfig) and configure it again. |
| `InsufficientPermissionforPre-Script` | For running scripts, the root user should be the owner of the file. The file should have 700 permissions. (That is, only the owner should have read, write, and execute permissions.) | Make sure that the root user is the owner of the script file and that only the owner has read, write, and execute permissions. |
| `InsufficientPermissionforPost-Script` | For running scripts, the root user should be the owner of the file. The file should have 700 permissions. (That is, only the owner should have read, write, and execute permissions.) | Make sure that the root user is the owner of the script file and that only the owner has read, write, and execute permissions. |
| `Pre-ScriptTimeout` | The execution of the prescript for application-consistent backup timed out. | Check the script and increase the timeout in the VMSnapshotScriptPluginConfig.json file located at /etc/azure. |
| `Post-ScriptTimeout` | The execution of the postscript for application-consistent backup timed out. | Check the script and increase the timeout in the VMSnapshotScriptPluginConfig.json file located at /etc/azure. |

## Related content

- [Configure VM backup to a Recovery Services vault](./backup-azure-vms-first-look-arm.md)
