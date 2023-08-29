---
title: Troubleshoot restore point failures
description: Symptoms, causes, and resolutions of restore point failures related to agent, extension, and disks.
ms.topic: troubleshooting
ms.date: 04/12/2023
ms.service: virtual-machines
ms.custom: devx-track-linux
---

# Troubleshoot restore point failures: Issues with the agent or extension

This article provides troubleshooting steps that can help you resolve restore point errors related to communication with the VM agent and extension.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Step-by-step guide to troubleshoot restore point failures

Most common restore point failures can be resolved by following the troubleshooting steps listed below:

### Step 1: Check the health of Azure VM

- **Ensure Azure VM provisioning state is 'Running'**:
  If the [VM provisioning state](states-billing.md) is in the **Stopped/Deallocated/Updating** state, it interferes with the restore point operation. In the Azure portal, go to **Virtual Machines** > **Overview** and ensure the VM status is **Running**  and retry the restore point operation.
- **Review pending OS updates or reboots**: Ensure there are no pending OS updates or pending reboots on the VM.

### Step 2: Check the health of Azure VM Guest Agent service

**Ensure Azure VM Guest Agent service is started and up-to-date**:

# [On a Windows VM](#tab/windows)

- Navigate to **services.msc** and ensure **Windows Azure VM Guest Agent service** is up and running. Also, ensure the [latest version](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) is installed. [Learn more](#the-agent-is-installed-in-the-vm-but-its-unresponsive-for-windows-vms).
- The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Marketplace image from the portal, PowerShell, Command Line Interface, or an Azure Resource Manager template. A [manual installation of the Agent](../virtual-machines/extensions/agent-windows.md#manual-installation) may be necessary when you create a custom VM image that's deployed to Azure.
- Review the support matrix to check if VM runs on the [supported Windows operating system](concepts-restore-points.md#operating-system-support-for-application-consistency).

# [On Linux VM](#tab/linux)

- Ensure the Azure VM Guest Agent service is running by executing the command `ps -e`. Also, ensure the [latest version](../virtual-machines/extensions/update-linux-agent.md) is installed. [Learn more](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms).
- Ensure the [Linux VM agent dependencies on system packages](../virtual-machines/extensions/agent-linux.md#requirements) have the supported configuration. For example: Supported Python version is 2.6 and above.
- Review the support matrix to check if VM runs on the [supported Linux operating system.](concepts-restore-points.md#operating-system-support-for-application-consistency).

---

### Step 3: Check the health of Azure VM Extension

- **Ensure all Azure VM Extensions are in 'provisioning succeeded' state**:
  If any extension is in a failed state, then it can interfere with the restore point operation.
  - In the Azure portal, go to **Virtual machines** > **Settings** > **Extensions** > **Extensions status** and check if all the extensions are in **provisioning succeeded** state.
  - Ensure all [extension issues](../virtual-machines/extensions/overview.md#troubleshoot-extensions) are resolved and retry the restore point operation.
- **Ensure COM+ System Application** is up and running. Also, the **Distributed Transaction Coordinator service** should be running as **Network Service account**. 

Follow the troubleshooting steps in [troubleshoot COM+ and MSDTC issues](../backup/backup-azure-vms-troubleshoot.md#extensionsnapshotfailedcom--extensioninstallationfailedcom--extensioninstallationfailedmdtc---extension-installationoperation-failed-due-to-a-com-error) in case of issues.

### Step 4: Check the health of Azure VM Snapshot Extension

Restore points use the VM Snapshot Extension to take an application consistent snapshot of the Azure virtual machine. Restore points install the extension as part of the first restore point creation operation.

- **Ensure VMSnapshot extension isn't in a failed state**: Follow the steps in [Troubleshooting](../backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#usererrorvmprovisioningstatefailed---the-vm-is-in-failed-provisioning-state) to verify and ensure the Azure VM snapshot extension is healthy.

- **Check if antivirus is blocking the extension**: Certain antivirus software can prevent extensions from executing.
  
  At the time of the restore point failure, verify if there are log entries in **Event Viewer Application logs** with *faulting application name: IaaSBcdrExtension.exe*. If you see entries, the antivirus configured in the VM  could be restricting the execution of the VMSnapshot extension. Test by excluding the following directories in the antivirus configuration and retry the restore point operation.
  - `C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot`
  - `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot`

- **Check if network access is required**: Extension packages are downloaded from the Azure Storage extension repository and extension status uploads are posted to Azure Storage. [Learn more](../virtual-machines/extensions/features-windows.md#network-access).
  - If you're on a non-supported version of the agent, you need to allow outbound access to Azure storage in that region from the VM.
  - If you've blocked access to `168.63.129.16` using the guest firewall or with a proxy, extensions will fail regardless of the above. Ports 80, 443, and 32526 are required. [Learn more](../virtual-machines/extensions/features-windows.md#network-access).

- **Ensure DHCP is enabled inside the guest VM**: This is required to get the host or fabric address from DHCP for the restore point to work. If you need a static private IP, you should configure it through the **Azure portal**, or **PowerShell** and make sure the DHCP option inside the VM is enabled. [Learn more](#the-snapshot-status-cant-be-retrieved-or-a-snapshot-cant-be-taken).

- **Ensure the VSS writer service is up and running**: 
  Follow these steps to [troubleshoot VSS writer issues](../backup/backup-azure-vms-troubleshoot.md#extensionfailedvsswriterinbadstate---snapshot-operation-failed-because-vss-writers-were-in-a-bad-state).

## Common issues

### DiskRestorePointUsedByCustomer - There is an active shared access signature outstanding for disk restore point

**Error code**: DiskRestorePointUsedByCustomer

**Error message**: There is an active shared access signature outstanding for disk restore point. Call EndGetAccess before deleting the restore point.

You can't delete a restore point if there are active Shared Access Signatures (SAS) on any of the underlying disk restore points. End the shared access on the disk restore points and retry the operation.

### OperationNotAllowed - Changes were made to the Virtual Machine while the operation 'Create Restore Point' was in progress.

**Error code**: OperationNotAllowed

**Error message**: Changes were made to the Virtual Machine while the operation 'Create Restore Point' was in progress. Operation Create Restore Point cannot be completed at this time. Please try again later.

Restore point creation fails if there are changes being made in parallel to the VM model, for example, a new disk being attached or an existing disk being detached. This is to ensure data integrity of the restore point that is created. Retry creating the restore point once the VM model has been updated.

### OperationNotAllowed - Operation 'Create Restore Point' is not allowed as disk(s) have not been allocated successfully.

**Error code**: OperationNotAllowed

**Error message**: Operation 'Create Restore Point' is not allowed as disk(s) have not been allocated successfully. Please exclude these disk(s) using excludeDisks property and retry.

If any one of the disks attached to the VM isn't allocated properly, the restore point fails. You must exclude these disks before triggering creation of restore points for the VM. If you're using ARM processor API to create a restore point, to exclude a disk, add its identifier to the excludeDisks property in the request body. If you're using [CLI](virtual-machines-create-restore-points-cli.md#exclude-disks-when-creating-a-restore-point), [PowerShell](virtual-machines-create-restore-points-powershell.md#exclude-disks-from-the-restore-point), or [Portal](virtual-machines-create-restore-points-portal.md#step-2-create-a-vm-restore-point), set the respective parameters.

### OperationNotAllowed - Creation of Restore Point of a Virtual Machine with Shared disks is not supported.

**Error code**: VMRestorePointClientError

**Error message**: Creation of Restore Point of a Virtual Machine with Shared disks is not supported. You may exclude this disk from the restore point via excludeDisks property.

Restore points are currently not supported for shared disks. You need to exclude these disks before triggering creation of restore point for the VM. If you are using ARM processor API to create restore point, to exclude a disk, add its identifier to the excludeDisks property in the request body. If you are using [CLI](virtual-machines-create-restore-points-cli.md#exclude-disks-when-creating-a-restore-point), [PowerShell](virtual-machines-create-restore-points-powershell.md#exclude-disks-from-the-restore-point), or [Portal](virtual-machines-create-restore-points-portal.md#step-2-create-a-vm-restore-point), follow the respective steps.

### VMAgentStatusCommunicationError - VM agent unable to communicate with compute service

**Error code**: VMAgentStatusCommunicationError

**Error message**: VM has not reported status for VM agent or extensions.

The Azure VM agent might be stopped, outdated, in an inconsistent state, or not installed. These states prevent the creation of restore points.

- In the Azure portal, go to **Virtual Machines** > **Settings** > **Properties** and ensure that the VM **Status** is **Running** and **Agent status** is **Ready**. If the VM agent is stopped or is in an inconsistent state, restart the agent.
  - [Restart](#the-agent-is-installed-in-the-vm-but-its-unresponsive-for-windows-vms) the Guest Agent for Windows VMs.
  - [Restart](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms) the Guest Agent for Linux VMs.
- In the Azure portal, go to **Virtual Machines** > **Settings** > **Extensions** and ensure all extensions are in **provisioning succeeded** state. If not, follow these [steps](../backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#usererrorvmprovisioningstatefailed---the-vm-is-in-failed-provisioning-state) to resolve the issue.

### VMRestorePointInternalError - Restore Point creation failed due to an internal execution error while creating VM snapshot. Please retry the operation after some time.Internal

**Error code**: VMRestorePointInternalError

**Error message**: Restore Point creation failed due to an internal execution error while creating VM snapshot. Please retry the operation after some time. 

After you trigger a restore point operation, the compute service starts the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, restore point creation will fail. Complete the following troubleshooting steps in the order listed, and then retry your operation:  

**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-is-installed-in-the-vm-but-its-unresponsive-for-windows-vms)**  

**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**

**Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cant-be-retrieved-or-a-snapshot-cant-be-taken)**

**Cause 4: [VM-Agent configuration options aren't set (for Linux VMs)](#vm-agent-configuration-options-are-not-set-for-linux-vms)**

**Cause 5: [Application control solution is blocking IaaSBcdrExtension.exe](#application-control-solution-is-blocking-iaasbcdrextensionexe)**

This error could also occur when one of the extension failures puts the VM into provisioning failed state. If the above steps didn't resolve your issue, then do the following:
 
 In the Azure portal, go to **Virtual Machines** > **Settings** > **Extensions** and ensure all extensions are in **provisioning succeeded** state. [Learn more](states-billing.md) about Provisioning states.

- If any extension is in a failed state, it can interfere with the restore point operation. Ensure the extension issues are resolved and retry the restore point operation.
- If the VM provisioning state is in an updating state, it can interfere with the restore point operation. Ensure that it's healthy and retry the restore point operation.

### VMRestorePointClientError - Restore Point creation failed due to COM+ error.

**Error code**: VMRestorePointClientError

**Error message**: Restore Point creation failed due to COM+ error. Please restart windows service "COM+ System Application" (COMSysApp). If the issue persists, restart the VM.

Restore point operations fail if the COM+ service is not running or if there are any errors with this service. Restart the COM+ System Application, and restart the VM and retry the restore point operation.

### VMRestorePointClientError - Restore Point creation failed due to insufficient memory available in COM+ memory quota.

**Error code**: VMRestorePointClientError

**Error message**: Restore Point creation failed due to insufficient memory available in COM+ memory quota. Please restart windows service "COM+ System Application" (COMSysApp). If the issue persists, restart the VM. 

Restore point operations fail if there's insufficient memory in the COM+ service. Restarting the COM+ System Application service and the VM usually frees up the memory. Once restarted, retry the restore point operation.

### VMRestorePointClientError - Restore Point creation failed due to VSS Writers in bad state.

**Error code**: VMRestorePointClientError

**Error message**: Restore Point creation failed due to VSS Writers in bad state. Restart VSS Writer services and reboot VM. 

Restore point creation invokes VSS writers to flush in-memory IOs to the disk before taking snapshots to achieve application consistency. If the VSS writers are in bad state, it affects the restore point creation operation. Restart the VSS writer service and restart the VM before retrying the operation.

### VMRestorePointClientError - Restore Point creation failed due to failure in installation of Visual C++ Redistributable for Visual Studio 2012. 

**Error code**: VMRestorePointClientError 

**Error message**: Restore Point creation failed due to failure in installation of Visual C++ Redistributable for Visual Studio 2012. Please install Visual C++ Redistributable for Visual Studio 2012. If you are observing issues with installation or if it is already installed and you are observing this error, please restart the VM to clean installation issues. 

Restore point operations require Visual C++ Redistributable for Visual Studio 2021. Download Visual C++ Redistributable for Visual Studio 2012 and restart the VM before retrying the restore point operation.

### VMRestorePointClientError - Restore Point creation failed as the maximum allowed snapshot limit of one or more disk blobs has been reached. Please delete some existing restore points of this VM and then retry.

**Error code**: VMRestorePointClientError

**Error message**: Restore Point creation failed as the maximum allowed snapshot limit of one or more disk blobs has been reached. Please delete some existing restore points of this VM and then retry.

The number of restore points across the restore point collections and resource groups for a VM can't exceed 500. To create a new restore point, delete the existing restore points.

### VMRestorePointClientError - Restore Point creation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator".

**Error code**: VMRestorePointClientError 

**Error message**: Restore Point creation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator". 

Follow these steps to resolve this error:  

- Open services.msc from an elevated command prompt
- Make sure that **Log On As** value for **Distributed Transaction Coordinator** service is set to **Network Service** and the service is running. 
- If this service fails to start, reinstall this service.

### VMRestorePointClientError - Restore Point creation failed due to inadequate VM resources.

**Error code**: VMRestorePointClientError 

**Error message**: Restore Point creation failed due to inadequate VM resources. Increase VM resources by changing the VM size and retry the operation. To resize the virtual machine, refer https://azure.microsoft.com/blog/resize-virtual-machines/. 

Creating a restore point requires enough compute resource to be available. If you get the above error when creating a restore point, you need resize the VM and choose a higher VM size. Follow the steps in [how to resize your VM](https://azure.microsoft.com/blog/resize-virtual-machines/). Once the VM is resized, retry the restore point operation.

### VMRestorePointClientError - Restore point creation failed due to no network connectivity on the virtual machine.

**Error code**: VMRestorePointClientError

**Error message**: Restore Point creation failed due to no network connectivity on the virtual machine. Ensure that VM has network access. Either allowlist the Azure datacenter IP ranges or set up a proxy server for network access. For more information, see https://go.microsoft.com/fwlink/?LinkId=800034. If you are already using proxy server, make sure that proxy server settings are configured correctly.

After you trigger creation of restore point, the compute service starts communicating with the VM snapshot extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a restore point failure might occur. Complete the following troubleshooting step, and then retry your operation:

**[The snapshot status can't be retrieved, or a snapshot can't be taken].(#the-snapshot-status-cant-be-retrieved-or-a-snapshot-cant-be-taken)**  

### VMRestorePointClientError - RestorePoint creation failed since a concurrent 'Create RestorePoint' operation was triggered on the VM.

**Error code**: VMRestorePointClientError

**Error message**: RestorePoint creation failed since a concurrent 'Create RestorePoint' operation was triggered on the VM.

Your recent restore point creation failed because there's already an existing restore point being created. You can't create a new restore point until the current restore point is fully created. Ensure the restore point creation operation currently in progress is completed before triggering another restore point creation operation.

To check the restore points in progress, do the following steps:

1. Sign in to the Azure portal, select **All services**. Enter **Recovery Services** and select **Restore point collection**. The list of Restore point collections appears.
2. From the list of Restore point collections, select a Restore point collection in which the restore point is being created.
3. Select **Settings** > **Restore points** to view all the restore points. If a restore point  is in progress, wait for it to complete.
4. Retry creating a new restore point.

### DiskRestorePointClientError - Keyvault associated with DiskEncryptionSet is not found. 

**Error code**: DiskRestorePointClientError

**Error message**: Keyvault associated with DiskEncryptionSet not found. The resource may have been deleted due to which Restore Point creation failed. Please retry the operation after re-creating the missing resource with the same name. 

If you are creating restore points for a VM that has encrypted disks, you must ensure the keyvault where the keys are stored, is available. We use the same keys to create encrypted restore points.

### BadRequest - This request can be made with api-version '2021-03-01' or newer

**Error code**: BadRequest

**Error message**: This request can be made with api-version '2022-03-01' or newer.

Restore points are supported only with API version 2022-03-01 or later. If you are using REST APIs to create and manage restore points, use the specified API version when calling the restore point API.

### InternalError / InternalExecutionError / InternalOperationError - An internal execution error occurred. Please retry later.

**Error code**: InternalError / InternalExecutionError / InternalOperationError

**Error message**: An internal execution error occurred. Please retry later.

After you trigger creation of restore point, the compute service starts communicating with the VM snapshot extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a restore point failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  

- **Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-is-installed-in-the-vm-but-its-unresponsive-for-windows-vms)**.  
- **Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**.  
- **Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cant-be-retrieved-or-a-snapshot-cant-be-taken)**.  
- **Cause 4: [Compute service does not have permission to delete the old restore points because of a resource group lock](#remove-lock-from-the-recovery-point-resource-group)**.
- **Cause 5**: There's an extension version/bits mismatch with the Windows version you're running, or the following module is corrupt:

  **C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\\<extension version\>\iaasvmprovider.dll**   
  
  To resolve this issue, check if the module is compatible with x86 (32-bit)/x64 (64-bit) version of _regsvr32.exe_, and then follow these steps:

  1. In the affected VM, go to **Control panel** > **Program and features**.
  1. Uninstall **Visual C++ Redistributable x64** for **Visual Studio 2013**.
  1. Reinstall **Visual C++ Redistributable** for **Visual Studio 2013** in the VM. To install, follow these steps:
     1. Go to the folder: **C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\\<LatestVersion\>**.
     1. Search and run the **vcredist2013_x64** file to install.
  1. Retry the restore point operation.

### OSProvisioningClientError - Restore points operation failed due to an error. For details, see restore point provisioning error Message details

**Error code**: OSProvisioningClientError 

**Error message**: OS Provisioning did not finish in the allotted time. This error occurred too many times consecutively from image. Make sure the image has been properly prepared (generalized).

This error is reported from the IaaS VM. Take necessary actions as described in the error message and retry the operation.

### AllocationFailed - Restore points operation failed due to an error. For details, see restore point provisioning error Message details

**Error code**: AllocationFailed

**Error message**: Allocation failed. If you are trying to add a new VM to an Availability Set or update/resize an existing VM in an Availability Set, please note that such Availability Set allocation is scoped to a single cluster, and it is possible that the cluster is out of capacity. [Learn more](https://aka.ms/allocation-guidance) about improving likelihood of allocation success.

This error is reported from the IaaS VM. Take necessary actions as described in the error message and retry the operation.

## Causes and solutions

### The agent is installed in the VM, but it's unresponsive (for Windows VMs)

#### Solution

The VM agent might have been corrupted, or the service might have been stopped. Reinstalling the VM agent helps get the latest version. It also helps restart communication with the service.

1. Determine whether the Microsoft Azure Guest Agent service is running in the VM services (services.msc). Try to restart the Microsoft Azure Guest Agent service and initiate the restore point operation.
2. If the Microsoft Azure Guest Agent service isn't visible in services, in Control Panel, go to **Programs and Features** to determine whether the Microsoft Azure Guest Agent service is installed.
3. If the Microsoft Azure Guest Agent appears in **Programs and Features**, uninstall the Microsoft Azure Guest Agent.
4. Download and install the [latest version of the agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You must have Administrator rights to complete the installation.
5. Verify that the Microsoft Azure Guest Agent services appear in services.
6. Retry the restore point operation.

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
   sudo systemctl start walinuxagent
   ```

   - For other Linux distributions:

   ```bash
   sudo systemctl start waagent
   ```

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
4. Retry the restore point operation. If the failure persists, collect the following logs from the VM:

   - /var/lib/waagent/*.xml
   - /var/log/waagent.log
   - /var/log/azure/*

If you require verbose logging for waagent, follow these steps:

1. In the `/etc/waagent.conf` file, locate the following line: **Enable verbose logging (y|n)**.
2. Change the **Logs.Verbose** value from *n* to *y*.
3. Save the change, and then restart waagent by completing the steps described earlier in this section.

### VM-Agent configuration options are not set (for Linux VMs)

A configuration file (`/etc/waagent.conf`) controls the actions of waagent. Configuration File Options **Extensions.Enable** should be set to **y** and **Provisioning.Agent** should be set to **auto** for restore points to work.
For the full list of VM-Agent Configuration File Options, see https://github.com/Azure/WALinuxAgent#configuration-file-options.

### Application control solution is blocking IaaSBcdrExtension.exe

If you're running [AppLocker](/windows/security/threat-protection/windows-defender-application-control/applocker/what-is-applocker) (or another application control solution), and the rules are publisher or path based, they may block the **IaaSBcdrExtension.exe** executable from running.

#### Solution

Exclude the `/var/lib` path or the **IaaSBcdrExtension.exe** executable from AppLocker (or other application control software.)

### The snapshot status can't be retrieved, or a snapshot can't be taken

Restore points rely on issuing a snapshot command to the underlying storage account. Restore point can fail either because it has no access to the storage account, or because the execution of the snapshot task is delayed.

#### Solution

The following conditions might cause the snapshot task to fail:

| Cause | Solution |
| --- | --- |
| The VM status is reported incorrectly because the VM is shut down in Remote Desktop Protocol (RDP). | If you shut down the VM in RDP, check the portal to determine whether the VM status is correct. If it's not correct, shut down the VM in the portal by using the **Shutdown** option on the VM dashboard. |
| The VM can't get the host or fabric address from DHCP. | DHCP must be enabled inside the guest for restore point to work. If the VM can't get the host or fabric address from DHCP response 245, it can't download or run any extensions. If you need a static private IP, you should configure it through the **Azure portal**, or **PowerShell** and make sure the DHCP option inside the VM is enabled. [Learn more](../virtual-network/ip-services/virtual-networks-static-private-ip-arm-ps.md) about setting up a static IP address with PowerShell.

### Remove lock from the recovery point resource group

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to **All Resources**, select the restore point collection resource group.
3. In the **Settings** section, select **Locks** to display the locks.
4. To remove the lock, select **Delete**.

   :::image type="content" source="./media/restore-point-troubleshooting/delete-lock-inline.png" alt-text="Screenshot of Delete lock in Azure portal." lightbox="./media/restore-point-troubleshooting/delete-lock-expanded.png":::
