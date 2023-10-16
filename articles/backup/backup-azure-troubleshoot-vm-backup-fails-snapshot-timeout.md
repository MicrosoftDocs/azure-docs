---
title: Troubleshoot Agent and extension issues
description: Symptoms, causes, and resolutions of Azure Backup failures related to agent, extension, and disks.
ms.topic: troubleshooting
ms.date: 05/05/2022
ms.service: backup
ms.custom: devx-track-linux
ms.reviewer: geg
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Backup failure: Issues with the agent or extension

This article provides troubleshooting steps that can help you resolve Azure Backup errors related to communication with the VM agent and extension.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Step-by-step guide to troubleshoot backup failures

Most common backup failures can be self-resolved by following the troubleshooting steps listed below:

### Step 1: Check Azure VM health

- **Ensure Azure VM provisioning state is 'Running'**: If the [VM provisioning state](../virtual-machines/states-billing.md) is in the **Stopped/Deallocated/Updating** state, then it will interfere with the backup operation. Open *Azure portal > VM > Overview >* and check the VM status to ensure it's **Running**  and retry the backup operation.
- **Review pending OS updates or reboots**: Ensure there are no pending OS update or pending reboots on the VM.

### Step 2: Check Azure VM Guest Agent service health

- **Ensure Azure VM Guest Agent service is started and up-to-date**:
  - On a Windows VM:
    - Navigate to **services.msc** and ensure **Windows Azure VM Guest Agent service** is up and running. Also, ensure the [latest version](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) is installed. To learn more, see [Windows VM guest agent issues](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms).
    - The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Marketplace image from the portal, PowerShell, Command Line Interface, or an Azure Resource Manager template. A [manual installation of the Agent](../virtual-machines/extensions/agent-windows.md#manual-installation) may be necessary when you create a custom VM image that's deployed to Azure.
    - Review the support matrix to check if VM runs on the [supported Windows operating system](backup-support-matrix-iaas.md#operating-system-support-windows).
  - On Linux VM,
    - Ensure the Azure VM Guest Agent service is running by executing the command `ps -e`. Also, ensure the [latest version](../virtual-machines/extensions/update-linux-agent.md) is installed. To learn more, see [Linux VM guest agent issues](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms).
    - Ensure the [Linux VM agent dependencies on system packages](../virtual-machines/extensions/agent-linux.md#requirements) have the supported configuration. For example: Supported Python version is 2.6 and above.
    - Review the support matrix to check if VM runs on the [supported Linux operating system.](backup-support-matrix-iaas.md#operating-system-support-linux)

### Step 3: Check Azure VM Extension health

- **Ensure all Azure VM Extensions are in 'provisioning succeeded' state**:
  If any extension is in a failed state, then it can interfere with the backup.
- *Open  Azure portal > VM > Settings > Extensions > Extensions status* and check if all the extensions are in **provisioning succeeded** state.
- Ensure all [extension issues](../virtual-machines/extensions/overview.md#troubleshoot-extensions) are resolved and retry the backup operation.
- **Ensure COM+ System Application** is up and running. Also, the **Distributed Transaction Coordinator service** should be running as **Network Service account**. Follow the steps in this article to [troubleshoot COM+ and MSDTC issues](backup-azure-vms-troubleshoot.md#extensionsnapshotfailedcom--extensioninstallationfailedcom--extensioninstallationfailedmdtc---extension-installationoperation-failed-due-to-a-com-error).

### Step 4: Check Azure Backup Extension health

Azure Backup uses the VM Snapshot Extension to take an application consistent backup of the Azure virtual machine. Azure Backup will install the extension as part of the first scheduled backup triggered after enabling backup.

- **Ensure VMSnapshot extension isn't in a failed state**: Follow the steps listed in this [section](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#usererrorvmprovisioningstatefailed---the-vm-is-in-failed-provisioning-state) to verify and ensure the Azure Backup extension is healthy.

- **Check if antivirus is blocking the extension**: Certain antivirus software can prevent extensions from executing.
  
  At the time of the backup failure, verify if there are log entries in ***Event Viewer Application logs*** with ***faulting application name: IaaSBcdrExtension.exe***. If you see entries, then it could be the antivirus configured in the VM  is restricting the execution of the backup extension. Test by excluding the following directories in the antivirus configuration and retry the backup operation.
  - `C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot`
  - `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot`

- **Check if network access is required**: Extension packages are downloaded from the Azure Storage extension repository and extension status uploads are posted to Azure Storage. [Learn more](../virtual-machines/extensions/features-windows.md#network-access).
  - If you're on a non-supported version of the agent, you need to allow outbound access to Azure storage in that region from the VM.
  - If you've blocked access to `168.63.129.16` using the guest firewall or with a proxy, extensions will fail regardless of the above. Ports 80, 443, and 32526 are required, [Learn more](../virtual-machines/extensions/features-windows.md#network-access).

- **Ensure DHCP is enabled inside the guest VM**: This is required to get the host or fabric address from DHCP for the IaaS VM backup to work. If you need a static private IP, you should configure it through the Azure portal or PowerShell and make sure the DHCP option inside the VM is enabled, [Learn more](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken).

- **Ensure the VSS writer service is up and running**: Follow these steps To [Troubleshoot VSS writer issues](backup-azure-vms-troubleshoot.md#extensionfailedvsswriterinbadstate---snapshot-operation-failed-because-vss-writers-were-in-a-bad-state).
- **Follow backup best practice guidelines**: Review the [best practices to enable Azure VM backup](backup-azure-vms-introduction.md#best-practices).
- **Review guidelines for encrypted disks**: If you're enabling backup for VMs with encrypted disk, ensure you've provided all the required permissions. To learn more, see [Back up and restore encrypted Azure VM](backup-azure-vms-encryption.md).

## <a name="UserErrorGuestAgentStatusUnavailable-vm-agent-unable-to-communicate-with-azure-backup"></a>UserErrorGuestAgentStatusUnavailable - VM agent unable to communicate with Azure Backup

**Error code**: UserErrorGuestAgentStatusUnavailable <br>
**Error message**: VM Agent unable to communicate with Azure Backup<br>

The Azure VM agent might be stopped, outdated, in an inconsistent state, or not installed. These states prevent the Azure Backup service from triggering snapshots.

- **Open Azure portal > VM > Settings > Properties pane** > ensure VM **Status** is **Running** and **Agent status** is **Ready**. If the VM agent is stopped or is in an inconsistent state, restart the agent<br>
  - For Windows VMs, follow these [steps](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms) to restart the Guest Agent.<br>
  - For Linux VMs, follow these [steps](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms) to restart the Guest Agent.
- **Open  Azure portal > VM > Settings > Extensions** > Ensure all extensions are in **provisioning succeeded** state. If not, follow these [steps](#usererrorvmprovisioningstatefailed---the-vm-is-in-failed-provisioning-state) to resolve the issue.

## GuestAgentSnapshotTaskStatusError - Could not communicate with the VM agent for snapshot status

**Error code**: GuestAgentSnapshotTaskStatusError<br>
**Error message**: Could not communicate with the VM agent for snapshot status <br>

After you register and schedule a VM for the Azure Backup service, Backup starts the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  

**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  

**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**

**Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**

**Cause 4: [VM-Agent configuration options are not set (for Linux VMs)](#vm-agent-configuration-options-are-not-set-for-linux-vms)**

**Cause 5: [Application control solution is blocking IaaSBcdrExtension.exe](#application-control-solution-is-blocking-iaasbcdrextensionexe)**

## UserErrorVmProvisioningStateFailed - The VM is in failed provisioning state

**Error code**: UserErrorVmProvisioningStateFailed<br>
**Error message**: The VM is in failed provisioning state<br>

This error occurs when one of the extension failures puts the VM into provisioning failed state.<br>**Open  Azure portal > VM > Settings > Extensions > Extensions status** and check if all extensions are in **provisioning succeeded** state. To learn more, see [Provisioning states](../virtual-machines/states-billing.md).

- If any extension is in a failed state, then it can interfere with the backup. Ensure those extension issues are resolved and retry the backup operation.
- If the VM provisioning state is in an updating state, it can interfere with the backup. Ensure that it's healthy and retry the backup operation.

## UserErrorRpCollectionLimitReached - The Restore Point collection max limit has reached

**Error code**: UserErrorRpCollectionLimitReached <br>
**Error message**: The Restore Point collection max limit has reached. <br>

- This issue could happen if there's a lock on the recovery point resource group preventing automatic cleanup of recovery points.
- This issue can also happen if multiple backups are triggered per day. Currently we recommend only one backup per day, as the instant restore points are retained for 1-5 days per the configured snapshot retention and only 18 instant RPs can be associated with a VM at any given time. <br>
- The number of restore points across restore point collections and resource groups for a VM can't exceed 18. To create a new restore point, delete existing restore points.

Recommended Action:<br>
To resolve this issue, remove the lock on the resource group of the VM, and retry the operation to trigger clean-up.
> [!NOTE]
> Backup service creates a separate resource group than the resource group of the VM to store restore point collection. You're advised to not lock the resource group created for use by the Backup service. The naming format of the resource group created by Backup service is: AzureBackupRG_`<Geo>`_`<number>`. For example: *AzureBackupRG_northeurope_1*

**Step 1: [Remove lock from the restore point resource group](#remove_lock_from_the_recovery_point_resource_group)** <br>
**Step 2: [Clean up restore point collection](#clean_up_restore_point_collection)**<br>

## UserErrorKeyvaultPermissionsNotConfigured - Backup doesn't have sufficient permissions to the key vault for backup of encrypted VMs

**Error code**: UserErrorKeyvaultPermissionsNotConfigured <br>
**Error message**: Backup doesn't have sufficient permissions to the key vault for backup of encrypted VMs. <br>

For a backup operation to succeed on encrypted VMs, it must have permissions to access the key vault. Permissions can be set through the [Azure portal](./backup-azure-vms-encryption.md)/ [PowerShell](./backup-azure-vms-automation.md#enable-protection)/ [CLI](./quick-backup-vm-cli.md#prerequisites-to-backup-encrypted-vms).

>[!Note]
>If the required permissions to access the key vault have already been set, retry the operation after a little while.

## <a name="ExtensionSnapshotFailedNoNetwork-snapshot-operation-failed-due-to-no-network-connectivity-on-the-virtual-machine"></a>ExtensionSnapshotFailedNoNetwork - Snapshot operation failed due to no network connectivity on the virtual machine

**Error code**: ExtensionSnapshotFailedNoNetwork<br>
**Error message**: Snapshot operation failed due to no network connectivity on the virtual machine<br>

After you register and schedule a VM for the Azure Backup service, Backup starts the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting step, and then retry your operation:

**[The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  

## <a name="ExtensionOperationFailed-vmsnapshot-extension-operation-failed"></a>ExtensionOperationFailedForManagedDisks - VMSnapshot extension operation failed

**Error code**: ExtensionOperationFailedForManagedDisks <br>
**Error message**: VMSnapshot extension operation failed<br>

After you register and schedule a VM for the Azure Backup service, Backup starts the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  
**Cause 1: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  
**Cause 2: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  
**Cause 3: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**

## BackUpOperationFailed / BackUpOperationFailedV2 - Backup fails, with an internal error

**Error code**: BackUpOperationFailed / BackUpOperationFailedV2 <br>
**Error message**: Backup failed with an internal error - Please retry the operation in a few minutes <br>

After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  

- **Cause 1: [The agent installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  
- **Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
- **Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  
- **Cause 4: [Backup service doesn't have permission to delete the old restore points because of a resource group lock](#remove_lock_from_the_recovery_point_resource_group)**
- **Cause 5**: There's an extension version/bits mismatch with the Windows version you're running or the following module is corrupt:
  **C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\\<extension version\>\iaasvmprovider.dll** <br>   To resolve this issue, check if the module is compatible with x86 (32-bit)/x64 (64-bit) version of _regsvr32.exe_, and then follow these steps:

  1. In the affected VM, go to **Control panel** -> **Program and features**.
  1. Uninstall **Visual C++ Redistributable x64** for **Visual Studio 2013**.
  1. Reinstall **Visual C++ Redistributable** for **Visual Studio 2013** in the VM. To install, follow these steps:
     1. Go to the folder: **C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\\<LatestVersion\>**
     1. Search and run the **vcredist2013_x64** file to install.
  1. Retry the backup operation.

## UserErrorUnsupportedDiskSize - The configured disk size(s) is currently not supported by Azure Backup

**Error code**: UserErrorUnsupportedDiskSize <br>
**Error message**: The configured disk size(s) is currently not supported by Azure Backup. <br>

Your backup operation could fail when backing up a VM with a disk size greater than 32 TB. Also, backup of encrypted disks greater than 4 TB in size isn't currently supported. Ensure that the disk size(s) is less than or equal to the supported limit by splitting the disk(s).

## UserErrorBackupOperationInProgress - Unable to initiate backup as another backup operation is currently in progress

**Error code**: UserErrorBackupOperationInProgress <br>
**Error message**: Unable to initiate backup as another backup operation is currently in progress<br>

Your recent backup job failed because there's an existing backup job in progress. You can't start a new backup job until the current job finishes. Ensure the backup operation currently in progress is completed before triggering or scheduling another backup operations. To check the backup jobs status, do the following steps:

1. Sign in to the Azure portal, select **All services**. Type Recovery Services and select **Recovery Services vaults**. The list of Recovery Services vaults appears.
2. From the list of Recovery Services vaults, select a vault in which the backup is configured.
3. On the vault dashboard menu, select **Backup Jobs** it displays all the backup jobs.
   - If a backup job is in progress, wait for it to complete or cancel the backup job.
     - To cancel the backup job, right-click on the backup job and select **Cancel** or use [PowerShell](/powershell/module/az.recoveryservices/stop-azrecoveryservicesbackupjob).
   - If you've reconfigured the backup in a different vault, then ensure there are no backup jobs running in the old vault. If it exists, then cancel the backup job.
     - To cancel the backup job, right-click on the backup job and select **Cancel** or use [PowerShell](/powershell/module/az.recoveryservices/stop-azrecoveryservicesbackupjob)
4. Retry backup operation.

If the scheduled backup operation is taking longer, conflicting with the next backup configuration, then review the [Best Practices](backup-azure-vms-introduction.md#best-practices), [Backup Performance](backup-azure-vms-introduction.md#backup-performance), and [Restore consideration](backup-azure-vms-introduction.md#backup-and-restore-considerations).

## UserErrorCrpReportedUserError - Backup failed due to an error. For details, see Job Error Message Details

**Error code**: UserErrorCrpReportedUserError <br>
**Error message**: Backup failed due to an error. For details, see Job Error Message Details.

This error is reported from the IaaS VM. To identify the root cause of the issue, go to the Recovery Services vault settings. Under the **Monitoring** section, select **Backup jobs** to filter and view the status. Select **Failures** to review the underlying error message details. Take further actions according to the recommendations in the error details page.

## UserErrorBcmDatasourceNotPresent - Backup failed: This virtual machine is not (actively) protected by Azure Backup

**Error code**: UserErrorBcmDatasourceNotPresent <br>
**Error message**: Backup failed: This virtual machine is not (actively) protected by Azure Backup.

Check if the given virtual machine is actively (not in pause state) protected by Azure Backup. To overcome this issue, ensure the virtual machine is active and then retry the operation.

## Causes and solutions

### <a name="the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms"></a>The agent is installed in the VM, but it's unresponsive (for Windows VMs)

#### Solution for this error

The VM agent might have been corrupted, or the service might have been stopped. Reinstalling the VM agent helps get the latest version. It also helps restart communication with the service.

1. Determine whether the Windows Azure Guest Agent service is running in the VM services (services.msc). Try to restart the Windows Azure Guest Agent service and initiate the backup.
2. If the Windows Azure Guest Agent service isn't visible in services, in Control Panel, go to **Programs and Features** to determine whether the Windows Azure Guest Agent service is installed.
3. If the Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Azure Guest Agent.
4. Download and install the [latest version of the agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You must have Administrator rights to complete the installation.
5. Verify that the Windows Azure Guest Agent services appear in services.
6. Run an on-demand backup:
   - In the portal, select **Backup Now**.

Also, verify that [Microsoft .NET 4.5 is installed](/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) in the VM. .NET 4.5 is required for the VM agent to communicate with the service.

### The agent installed in the VM is out of date (for Linux VMs)

#### Solution

Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an outdated VM agent. To troubleshoot this issue, follow these general guidelines:

1. Follow the instructions for [updating the Linux VM agent](../virtual-machines/extensions/update-linux-agent.md).

   > [!NOTE]
   > We *strongly recommend* that you update the agent only through a distribution repository. We don't recommend downloading the agent code directly from GitHub and updating it. If the latest agent for your distribution is not available, contact distribution support for instructions on how to install it. To check for the most recent agent, go to the [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) page in the GitHub repository.

2. Ensure that the Azure agent is running on the VM by running the following command: `ps -e`

   If the process isn't running, restart it by using the following commands:

   - For Ubuntu/Debian: 
     ```bash
        sudo systemctl restart walinuxagent
     ```
  
   - For other distributions: 
     ```bash
        sudo systemctl restart waagent
     ```

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
4. Run a new test backup. If the failure persists, collect the following logs from the VM:

   - /var/lib/waagent/*.xml
   - /var/log/waagent.log
   - /var/log/azure/*

If you require verbose logging for waagent, follow these steps:

1. In the /etc/waagent.conf file, locate the following line: **Enable verbose logging (y|n)**
2. Change the **Logs.Verbose** value from *n* to *y*.
3. Save the change, and then restart waagent by completing the steps described earlier in this section.

### VM-Agent configuration options are not set (for Linux VMs)

A configuration file (/etc/waagent.conf) controls the actions of waagent. Configuration File Options **Extensions.Enable** should be set to **y** and **Provisioning.Agent** should be set to **auto** for Backup to work.
For full list of VM-Agent Configuration File Options, see <https://github.com/Azure/WALinuxAgent#configuration-file-options>

### Application control solution is blocking IaaSBcdrExtension.exe

If you're running [AppLocker](/windows/security/threat-protection/windows-defender-application-control/applocker/what-is-applocker) (or another application control solution), and the rules are publisher or path based, they may block the **IaaSBcdrExtension.exe** executable from running.

#### Solution to this issue

Exclude the `/var/lib` path or the **IaaSBcdrExtension.exe** executable from AppLocker (or other application control software.)

### <a name="the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken"></a>The snapshot status can't be retrieved, or a snapshot can't be taken

The VM backup relies on issuing a snapshot command to the underlying storage account. Backup can fail either because it has no access to the storage account, or because the execution of the snapshot task is delayed.

#### Solution for this issue

The following conditions might cause the snapshot task to fail:

| Cause | Solution |
| --- | --- |
| The VM status is reported incorrectly because the VM is shut down in Remote Desktop Protocol (RDP). | If you shut down the VM in RDP, check the portal to determine whether the VM status is correct. If it's not correct, shut down the VM in the portal by using the **Shutdown** option on the VM dashboard. |
| The VM can't get the host or fabric address from DHCP. | DHCP must be enabled inside the guest for the IaaS VM backup to work. If the VM can't get the host or fabric address from DHCP response 245, it can't download or run any extensions. If you need a static private IP, you should configure it through the **Azure portal** or **PowerShell** and make sure the DHCP option inside the VM is enabled. [Learn more](../virtual-network/ip-services/virtual-networks-static-private-ip-arm-ps.md) about setting up a static IP address with PowerShell.

### <a name="remove_lock_from_the_recovery_point_resource_group"></a>Remove lock from the recovery point resource group

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to **All Resources option**, select the restore point collection resource group in the following format AzureBackupRG_`<Geo>`_`<number>`.
3. In the **Settings** section, select **Locks** to display the locks.
4. To remove the lock, select the ellipsis and select **Delete**.

    ![Delete lock](./media/backup-azure-arm-vms-prepare/delete-lock.png)

### <a name="clean_up_restore_point_collection"></a> Clean up restore point collection

After removing the lock, the restore points have to be cleaned up.

If you delete the Resource Group of the VM, or the VM itself, the instant restore snapshots of managed disks remain active and expire according to the retention set. To delete the instant restore snapshots (if you don't need them anymore) that are stored in the Restore Point Collection, clean up the restore point collection according to the steps given below.

To clean up the restore points, follow any of the methods:<br>

- [Clean up restore point collection by running on-demand backup](#clean-up-restore-point-collection-by-running-on-demand-backup)<br>
- [Clean up restore point collection from Azure portal](#clean-up-restore-point-collection-from-azure-portal)<br>

#### <a name="clean-up-restore-point-collection-by-running-on-demand-backup"></a>Clean up restore point collection by running on-demand backup

After removing the lock, trigger an on-demand backup. This action will ensure the restore points are automatically cleaned up. Expect this on-demand operation to fail the first time. However, it will ensure automatic cleanup instead of manual deletion of restore points. After cleanup, your next scheduled backup should succeed.

> [!NOTE]
> Automatic cleanup will happen after few hours of triggering the on-demand backup. If your scheduled backup still fails, then try manually deleting the restore point collection using the steps listed [here](#clean-up-restore-point-collection-from-azure-portal).

#### <a name="clean-up-restore-point-collection-from-azure-portal"></a>Clean up restore point collection from Azure portal <br>

To manually clear the restore points collection, which isn't cleared because of the lock on the resource group, try the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the **Hub** menu, select **All resources**, select the Resource group with the following format AzureBackupRG_`<Geo>`_`<number>` where your VM is located.

    ![Select the resource group](./media/backup-azure-arm-vms-prepare/resource-group.png)

3. Select Resource group, the **Overview** pane is displayed.
4. Select **Show hidden types** option to display all the hidden resources. Select the restore point collections with the following format AzureBackupRG_`<VMName>`_`<number>`.

    ![Select the restore point collection](./media/backup-azure-arm-vms-prepare/restore-point-collection.png)

5. Select **Delete** to clean the restore point collection.
6. Retry the backup operation again.

> [!NOTE]
 >If the resource (RP Collection) has a large number of Restore Points, then deleting them from the portal may timeout and fail. This is a known CRP issue, where all restore points aren't deleted in the stipulated time and the operation times out. However, the delete operation usually succeeds after two or three retries.
