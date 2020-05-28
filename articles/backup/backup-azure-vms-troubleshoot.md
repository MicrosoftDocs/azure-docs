---
title: Troubleshoot backup errors with Azure VMs
description: In this article, learn how to troubleshoot errors encountered with backup and restore of Azure virtual machines.
ms.reviewer: srinathv
ms.topic: troubleshooting
ms.date: 08/30/2019
---

# Troubleshooting backup failures on Azure virtual machines

You can troubleshoot errors encountered while using Azure Backup with the information listed below:

## Backup

This section covers backup operation failure of Azure Virtual machine.

### Basic troubleshooting

* Ensure that the VM Agent (WA Agent) is the [latest version](https://docs.microsoft.com/azure/backup/backup-azure-arm-vms-prepare#install-the-vm-agent).
* Ensure that the Windows or Linux VM OS version is supported, refer to the [IaaS VM Backup Support Matrix](https://docs.microsoft.com/azure/backup/backup-support-matrix-iaas).
* Verify that another backup service is not running.
  * To ensure there are no snapshot extension issues, [uninstall extensions to force reload and then retry the backup](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout).
* Verify that the VM has internet connectivity.
  * Make sure another backup service is not running.
* From `Services.msc`, ensure the **Windows Azure Guest Agent** service is **Running**. If the **Windows Azure Guest Agent** service is missing, install it from [Back up Azure VMs in a Recovery Services vault](https://docs.microsoft.com/azure/backup/backup-azure-arm-vms-prepare#install-the-vm-agent).
* The **Event log** may show backup failures that are from other backup products, for example, Windows Server backup, and are not due to Azure backup. Use the following steps to determine whether the issue is with Azure Backup:
  * If there is an error with an entry **Backup** in the event source or message, check whether Azure IaaS VM Backup backups were successful, and whether a Restore Point was created with the desired snapshot type.
  * If Azure Backup is working, then the issue is likely with another backup solution.
  * Here is an example of an event viewer error 517 where Azure backup was working fine but "Windows Server Backup" was failing:<br>
    ![Windows Server Backup failing](media/backup-azure-vms-troubleshoot/windows-server-backup-failing.png)
  * If Azure Backup is failing, then look for the corresponding Error Code in the section Common VM backup errors in this article.

## Common issues

The following are common issues with backup failures on Azure virtual machines.

## CopyingVHDsFromBackUpVaultTakingLongTime - Copying backed up data from vault timed out

Error code: CopyingVHDsFromBackUpVaultTakingLongTime <br/>
Error message: Copying backed up data from vault timed out

This could happen due to transient storage errors or insufficient storage account IOPS for backup service to transfer data to the vault within the timeout period. Configure VM backup using these [best practices](backup-azure-vms-introduction.md#best-practices) and retry the backup operation.

## UserErrorVmNotInDesirableState - VM is not in a state that allows backups

Error code: UserErrorVmNotInDesirableState <br/>
Error message: VM is not in a state that allows backups.<br/>

The backup operation failed because the VM is in Failed state. For a successful backup, the VM state should be Running, Stopped, or Stopped (deallocated).

* If the VM is in a transient state between **Running** and **Shut down**, wait for the state to change. Then trigger the backup job.
* If the VM is a Linux VM and uses the Security-Enhanced Linux kernel module, exclude the Azure Linux Agent path **/var/lib/waagent** from the security policy and make sure the Backup extension is installed.

## UserErrorFsFreezeFailed - Failed to freeze one or more mount-points of the VM to take a file-system consistent snapshot

Error code: UserErrorFsFreezeFailed <br/>
Error message: Failed to freeze one or more mount-points of the VM to take a file-system consistent snapshot.

* Unmount the devices for which the file system state was not cleaned, using the **umount** command.
* Run a file system consistency check on these devices by using the **fsck** command.
* Mount the devices again and retry backup operation.</ol>

## ExtensionSnapshotFailedCOM / ExtensionInstallationFailedCOM / ExtensionInstallationFailedMDTC - Extension installation/operation failed due to a COM+ error

Error code: ExtensionSnapshotFailedCOM <br/>
Error message: Snapshot operation failed due to COM+ error

Error code: ExtensionInstallationFailedCOM  <br/>
Error message: Extension installation/operation failed due to a COM+ error

Error code: ExtensionInstallationFailedMDTC <br/>
Error message: Extension installation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator <br/>

The Backup operation failed due to an issue with Windows service **COM+ System** application.  To resolve this issue, follow these steps:

* Try starting/restarting Windows service **COM+ System Application** (from an elevated command prompt **- net start COMSysApp**).
* Ensure **Distributed Transaction Coordinator** service is running as **Network Service** account. If not, change it to run as **Network Service** account and restart **COM+ System Application**.
* If unable to restart the service, then reinstall **Distributed Transaction Coordinator** service by following the below steps:
  * Stop the MSDTC service
  * Open a command prompt (cmd)
  * Run command "msdtc -uninstall"
  * Run command "msdtc -install"
  * Start the MSDTC service
* Start the Windows service **COM+ System Application**. After the **COM+ System Application** starts, trigger a backup job from the Azure portal.</ol>

## ExtensionFailedVssWriterInBadState - Snapshot operation failed because VSS writers were in a bad state

Error code: ExtensionFailedVssWriterInBadState <br/>
Error message: Snapshot operation failed because VSS writers were in a bad state.

Restart VSS writers that are in a bad state. From an elevated command prompt, run ```vssadmin list writers```. The output contains all VSS writers and their state. For every VSS writer with a state that's not **[1] Stable**, to restart VSS writer, run the following commands from an elevated command prompt:

* ```net stop serviceName```
* ```net start serviceName```

Another procedure that can help is to run the following command from an elevated command-prompt (as an administrator).

```CMD
REG ADD "HKLM\SOFTWARE\Microsoft\BcdrAgentPersistentKeys" /v SnapshotWithoutThreads /t REG_SZ /d True /f
```

Adding this registry key will cause the threads to be not created for blob-snapshots, and prevent the time-out.

## ExtensionConfigParsingFailure - Failure in parsing the config for the backup extension

Error code: ExtensionConfigParsingFailure<br/>
Error message: Failure in parsing the config for the backup extension.

This error happens because of changed permissions on the **MachineKeys** directory: **%systemdrive%\programdata\microsoft\crypto\rsa\machinekeys**.
Run the following command and verify that permissions on the **MachineKeys** directory are default ones:**icacls %systemdrive%\programdata\microsoft\crypto\rsa\machinekeys**.

Default permissions are as follows:

* Everyone: (R,W)
* BUILTIN\Administrators: (F)

If you see permissions in the **MachineKeys** directory that are different than the defaults, follow these steps to correct permissions, delete the certificate, and trigger the backup:

1. Fix permissions on the **MachineKeys** directory. By using Explorer security properties and advanced security settings in the directory, reset permissions back to the default values. Remove all user objects except the defaults from the directory and make sure the **Everyone** permission has special access as follows:

   * List folder/read data
   * Read attributes
   * Read extended attributes
   * Create files/write data
   * Create folders/append data
   * Write attributes
   * Write extended attributes
   * Read permissions
2. Delete all certificates where **Issued To** is the classic deployment model or **Windows Azure CRP Certificate Generator**:

   * [Open certificates on a local computer console](https://docs.microsoft.com/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in).
   * Under **Personal** > **Certificates**, delete all certificates where **Issued To** is the classic deployment model or **Windows Azure CRP Certificate Generator**.
3. Trigger a VM backup job.

## ExtensionStuckInDeletionState - Extension state is not supportive to backup operation

Error code: ExtensionStuckInDeletionState <br/>
Error message: Extension state is not supportive to backup operation

The Backup operation failed due to inconsistent state of Backup Extension. To resolve this issue, follow these steps:

* Ensure Guest Agent is installed and responsive
* From the Azure portal, go to **Virtual Machine** > **All Settings** > **Extensions**
* Select the backup extension VmSnapshot or VmSnapshotLinux and click **Uninstall**
* After deleting backup extension, retry the backup operation
* The subsequent backup operation will install the new extension in the desired state

## ExtensionFailedSnapshotLimitReachedError - Snapshot operation failed as snapshot limit is exceeded for some of the disks attached

Error code: ExtensionFailedSnapshotLimitReachedError  <br/>
Error message: Snapshot operation failed as snapshot limit is exceeded for some of the disks attached

The snapshot operation failed as the snapshot limit has exceeded for some of the disks attached. Complete the below troubleshooting steps and then retry the operation.

* Delete the disk blob-snapshots that are not required. Be cautious to not delete Disk blob, only snapshot blobs should be deleted.
* If Soft-delete is enabled on VM disk Storage-Accounts, configure soft-delete retention such that existing snapshots are less than the maximum allowed at any point of time.
* If Azure Site Recovery is enabled in the backed-up VM, then perform the steps below:

  * Ensure the value of **isanysnapshotfailed** is set as false in /etc/azure/vmbackup.conf
  * Schedule Azure Site Recovery at a different time, such that it does not conflict the backup operation.

## ExtensionFailedTimeoutVMNetworkUnresponsive - Snapshot operation failed due to inadequate VM resources

Error code: ExtensionFailedTimeoutVMNetworkUnresponsive<br/>
Error message: Snapshot operation failed due to inadequate VM resources.

Backup operation on the VM failed due to delay in network calls while performing the snapshot operation. To resolve this issue, perform Step 1. If the issue persists, try steps 2 and 3.

**Step 1**: Create snapshot through Host

From an elevated (admin) command-prompt, run the below command:

```text
REG ADD "HKLM\SOFTWARE\Microsoft\BcdrAgentPersistentKeys" /v SnapshotMethod /t REG_SZ /d firstHostThenGuest /f
REG ADD "HKLM\SOFTWARE\Microsoft\BcdrAgentPersistentKeys" /v CalculateSnapshotTimeFromHost /t REG_SZ /d True /f
```

This will ensure the snapshots are taken through host instead of Guest. Retry the backup operation.

**Step 2**: Try changing the backup schedule to a time when the VM is under less load (less CPU/IOps etc.)

**Step 3**: Try [increasing the size of VM](https://azure.microsoft.com/blog/resize-virtual-machines/) and retry the operation

## Common VM backup errors

| Error details | Workaround |
| ------ | --- |
| **Error code**: 320001, ResourceNotFound <br/> **Error message**: Could not perform the operation as VM no longer exists. <br/> <br/> **Error code**: 400094, BCMV2VMNotFound <br/> **Error message**: The virtual machine doesn't exist <br/> <br/>  An Azure virtual machine wasn't found.  |This error happens when the primary VM is deleted, but the backup policy still looks for a VM to back up. To fix this error, take the following steps: <ol><li> Re-create the virtual machine with the same name and same resource group name, **cloud service name**,<br>**or**</li><li> Stop protecting the virtual machine with or without deleting the backup data. For more information, see [Stop protecting virtual machines](backup-azure-manage-vms.md#stop-protecting-a-vm).</li></ol>|
|**Error code**: UserErrorBCMPremiumStorageQuotaError<br/> **Error message**: Could not copy the snapshot of the virtual machine, due to insufficient free space in the storage account | For premium VMs on VM backup stack V1, we copy the snapshot to the storage account. This step makes sure that backup management traffic, which works on the snapshot, doesn't limit the number of IOPS available to the application using premium disks. <br><br>We recommend that you allocate only 50 percent, 17.5 TB, of the total storage account space. Then the Azure Backup service can copy the snapshot to the storage account and transfer data from this copied location in the storage account to the vault. |
| **Error code**: 380008, AzureVmOffline <br/> **Error message**: Failed to install Microsoft Recovery Services extension as virtual machine  is not running | The VM Agent is a prerequisite for the Azure Recovery Services extension. Install the Azure Virtual Machine Agent and restart the registration operation. <br> <ol> <li>Check if the VM Agent is installed correctly. <li>Make sure that the flag on the VM config is set correctly.</ol> Read more about installing the VM Agent and how to validate the VM Agent installation. |
| **Error code**: ExtensionSnapshotBitlockerError <br/> **Error message**: The snapshot operation failed with the Volume Shadow Copy Service (VSS) operation error **This drive is locked by BitLocker Drive Encryption. You must unlock this drive from the Control Panel.** |Turn off BitLocker for all drives on the VM and check if the VSS issue is resolved. |
| **Error code**: VmNotInDesirableState <br/> **Error message**:  The VM isn't in a state that allows backups. |<ul><li>If the VM is in a transient state between **Running** and **Shut down**, wait for the state to change. Then trigger the backup job. <li> If the VM is a Linux VM and uses the Security-Enhanced Linux kernel module, exclude the Azure Linux Agent path **/var/lib/waagent** from the security policy and make sure the Backup extension is installed.  |
| The VM Agent isn't present on the virtual machine: <br>Install any prerequisite and the VM Agent. Then restart the operation. |Read more about [VM Agent installation and how to validate VM Agent installation](#vm-agent). |
| **Error code**: ExtensionSnapshotFailedNoSecureNetwork <br/> **Error message**: The snapshot operation failed because of failure to create a secure network communication channel. | <ol><li> Open the Registry Editor by running **regedit.exe** in an elevated mode. <li> Identify all versions of the .NET Framework present in your system. They're present under the hierarchy of registry key **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft**. <li> For each .NET Framework present in the registry key, add the following key: <br> **SchUseStrongCrypto"=dword:00000001**. </ol>|
| **Error code**: ExtensionVCRedistInstallationFailure <br/> **Error message**: The snapshot operation failed because of failure to install Visual C++ Redistributable for Visual Studio 2012. | <li> Navigate to `C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\agentVersion` and install vcredist2013_x64.<br/>Make sure that the registry key value that allows the service installation is set to the correct value. That is, set the **Start** value in **HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Msiserver** to **3** and not **4**. <br><br>If you still have issues with installation, restart the installation service by running **MSIEXEC /UNREGISTER** followed by **MSIEXEC /REGISTER** from an elevated command prompt. <br><br><li> Check the event log to verify if you are noticing access related issues. For example: *Product: Microsoft Visual C++ 2013 x64 Minimum Runtime - 12.0.21005 -- Error 1401.Could not create key: Software\Classes.  System error 5.  Verify that you have sufficient access to that key, or contact your support personnel.* <br><br> Ensure the administrator or user account has sufficient permissions to update the registry key **HKEY_LOCAL_MACHINE\SOFTWARE\Classes**. Provide sufficient permissions and restart the Windows Azure Guest Agent.<br><br> <li> If you have antivirus products in place, ensure they have the right exclusion rules to allow the installation.    |
| **Error code**:  UserErrorRequestDisallowedByPolicy <BR> **Error message**: An invalid policy is configured on the VM which is preventing Snapshot operation. | If you have an Azure Policy that [governs tags within your environment](https://docs.microsoft.com/azure/governance/policy/tutorials/govern-tags), either consider changing the policy from a [Deny effect](https://docs.microsoft.com/azure/governance/policy/concepts/effects#deny) to a [Modify effect](https://docs.microsoft.com/azure/governance/policy/concepts/effects#modify), or create the resource group manually according to the [naming schema required by Azure Backup](https://docs.microsoft.com/azure/backup/backup-during-vm-creation#azure-backup-resource-group-for-virtual-machines).

## Jobs

| Error details | Workaround |
| --- | --- |
| Cancellation isn't supported for this job type: <br>Wait until the job finishes. |None |
| The job isn't in a cancelable state: <br>Wait until the job finishes. <br>**or**<br> The selected job isn't in a cancelable state: <br>Wait for the job to finish. |It's likely that the job is almost finished. Wait until the job is finished.|
| Backup can't cancel the job because it isn't in progress: <br>Cancellation is supported only for jobs in progress. Try to cancel an in-progress job. |This error happens because of a transitory state. Wait a minute and retry the cancel operation. |
| Backup failed to cancel the job: <br>Wait until the job finishes. |None |

## Restore

| Error details | Workaround |
| --- | --- |
| Restore failed with a cloud internal error. |<ol><li>The cloud service to which you're trying to restore is configured with DNS settings. You can check: <br>**$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production"     Get-AzureDns -DnsSettings $deployment.DnsSettings**.<br>If **Address** is configured, then DNS settings are configured.<br> <li>The cloud service to which to you're trying to restore is configured with **ReservedIP**, and existing VMs in the cloud service are in the stopped state. You can check that a cloud service has reserved an IP by using the following PowerShell cmdlets: **$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName**. <br><li>You're trying to restore a virtual machine with the following special network configurations into the same cloud service: <ul><li>Virtual machines under load balancer configuration, internal and external.<li>Virtual machines with multiple reserved IPs. <li>Virtual machines with multiple NICs. </ul><li>Select a new cloud service in the UI or see [restore considerations](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) for VMs with special network configurations.</ol> |
| The selected DNS name is already taken: <br>Specify a different DNS name and try again. |This DNS name refers to the cloud service name, usually ending with **.cloudapp.net**. This name needs to be unique. If you get this error, you need to choose a different VM name during restore. <br><br> This error is shown only to users of the Azure portal. The restore operation through PowerShell succeeds because it restores only the disks and doesn't create the VM. The error will be faced when the VM is explicitly created by you after the disk restore operation. |
| The specified virtual network configuration isn't correct: <br>Specify a different virtual network configuration and try again. |None |
| The specified cloud service is using a reserved IP that doesn't match the configuration of the virtual machine being restored: <br>Specify a different cloud service that isn't using a reserved IP. Or choose another recovery point to restore from. |None |
| The cloud service has reached its limit on the number of input endpoints: <br>Retry the operation by specifying a different cloud service or by using an existing endpoint. |None |
| The Recovery Services vault and target storage account are in two different regions: <br>Make sure the storage account specified in the restore operation is in the same Azure region as your Recovery Services vault. |None |
| The storage account specified for the restore operation isn't supported: <br>Only Basic or Standard storage accounts with locally redundant or geo-redundant replication settings are supported. Select a supported storage account. |None |
| The type of storage account specified for the restore operation isn't online: <br>Make sure that the storage account specified in the restore operation is online. |This error might happen because of a transient error in Azure Storage or because of an outage. Choose another storage account. |
| The resource group quota has been reached: <br>Delete some resource groups from the Azure portal or contact Azure Support to increase the limits. |None |
| The selected subnet doesn't exist: <br>Select a subnet that exists. |None |
| The Backup service doesn't have authorization to access resources in your subscription. |To resolve this error, first restore disks by using the steps in [Restore backed-up disks](backup-azure-arm-restore-vms.md#restore-disks). Then use the PowerShell steps in [Create a VM from restored disks](backup-azure-vms-automation.md#restore-an-azure-vm). |

## Backup or restore takes time

If your backup takes more than 12 hours, or restore takes more than 6 hours, review [best practices](backup-azure-vms-introduction.md#best-practices), and
[performance considerations](backup-azure-vms-introduction.md#backup-performance)

## VM Agent

### Set up the VM Agent

Typically, the VM Agent is already present in VMs that are created from the Azure gallery. But virtual machines that are migrated from on-premises datacenters won't have the VM Agent installed. For those VMs, the VM Agent needs to be installed explicitly.

#### Windows VMs

* Download and install the [agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need Administrator privileges to finish the installation.
* For virtual machines created by using the classic deployment model, [update the VM property](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline#use-the-provisionguestagent-property-for-classic-vms) to indicate that the agent is installed. This step isn't required for Azure Resource Manager virtual machines.

#### Linux VMs

* Install the latest version of the agent from the distribution repository. For details on the package name, see the [Linux Agent repository](https://github.com/Azure/WALinuxAgent).
* For VMs created by using the classic deployment model, [update the VM property](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/install-vm-agent-offline#use-the-provisionguestagent-property-for-classic-vms) and verify that the agent is installed. This step isn't required for Resource Manager virtual machines.

### Update the VM Agent

#### Windows VMs

* To update the VM Agent, reinstall the [VM Agent binaries](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). Before you update the agent, make sure no backup operations occur during the VM Agent update.

#### Linux VMs

* To update the Linux VM Agent, follow the instructions in the article [Updating the Linux VM Agent](../virtual-machines/linux/update-agent.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

    > [!NOTE]
    > Always use the distribution repository to update the agent.

    Don't download the agent code from GitHub. If the latest agent isn't available for your distribution, contact the distribution support for instructions to acquire the latest agent. You can also check the latest [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) information in the GitHub repository.

### Validate VM Agent installation

Verify the VM Agent version on Windows VMs:

1. Sign in to the Azure virtual machine and navigate to the folder **C:\WindowsAzure\Packages**. You should find the **WaAppAgent.exe** file.
2. Right-click the file and go to **Properties**. Then select the **Details** tab. The **Product Version** field should be 2.6.1198.718 or higher.

## Troubleshoot VM snapshot issues

VM backup relies on issuing snapshot commands to underlying storage. Not having access to storage or delays in a snapshot task run can cause the backup job to fail. The following conditions can cause snapshot task failure:

* **VMs with SQL Server backup configured can cause snapshot task delay**. By default, VM backup creates a VSS full backup on Windows VMs. VMs that run SQL Server, with SQL Server backup configured, can experience snapshot delays. If snapshot delays cause backup failures, set following registry key:

   ```text
   [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
   "USEVSSCOPYBACKUP"="TRUE"
   ```

* **VM status is reported incorrectly because the VM is shut down in RDP**. If you used the remote desktop to shut down the virtual machine, verify that the VM status in the portal is correct. If the status isn't correct, use the **Shutdown** option in the portal VM dashboard to shut down the VM.
* **If more than four VMs share the same cloud service, spread the VMs across multiple backup policies**. Stagger the backup times, so no more than four VM backups start at the same time. Try to separate the start times in the policies by at least an hour.
* **The VM runs at high CPU or memory**. If the virtual machine runs at high memory or CPU usage, more than 90 percent, your snapshot task is queued and delayed. Eventually it times out. If this issue happens, try an on-demand backup.

## Networking

DHCP must be enabled inside the guest for IaaS VM backup to work. If you need a static private IP, configure it through the Azure portal or PowerShell. Make sure the DHCP option inside the VM is enabled.
Get more information on how to set up a static IP through PowerShell:

* [How to add a static internal IP to an existing VM](https://docs.microsoft.com/powershell/module/az.network/set-aznetworkinterfaceipconfig?view=azps-3.5.0#description)
* [Change the allocation method for a private IP address assigned to a network interface](../virtual-network/virtual-networks-static-private-ip-arm-ps.md#change-the-allocation-method-for-a-private-ip-address-assigned-to-a-network-interface)
