---
title: Troubleshoot backup errors with Azure virtual machine
description: Troubleshoot backup and restore of Azure virtual machines
services: backup
author: trinadhk
manager: shreeshd
ms.service: backup
ms.topic: conceptual
ms.date: 8/7/2018
ms.author: trinadhk
---
# Troubleshoot Azure virtual machine backup
You can troubleshoot errors encountered while using Azure Backup with information listed in the table below.

| Error details | Workaround |
| --- | --- |
| Could not perform the operation as VM no longer exists. - Stop protecting virtual machine without deleting backup data. More details at http://go.microsoft.com/fwlink/?LinkId=808124 |This happens when the primary VM is deleted, but the backup policy continues looking for a VM to back up. To fix this error: <ol><li> Recreate the virtual machine with the same name and same resource group name [cloud service name],<br>(OR)</li><li> Stop protecting virtual machine with or without deleting the backup data. [More details](http://go.microsoft.com/fwlink/?LinkId=808124)</li></ol> |
| Snapshot operation failed due to no network connectivity on the virtual machine - Ensure that VM has network access. For snapshot to succeed, either whitelist Azure datacenter IP ranges or set up a proxy server for network access. For more information, refer to  http://go.microsoft.com/fwlink/?LinkId=800034. If you are already using proxy server, make sure that proxy server settings are configured correctly | Occurs when you deny the outbound internet connectivity on the virtual machine. The VM snapshot extension requires internet connectivity to take a snapshot of underlying disks. [See the section on fixing snapshot failures due to blocked network access](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#snapshot-operation-failed-due-to-no-network-connectivity-on-the-virtual-machine). |
| VM agent is unable to communicate with the Azure Backup Service. - Ensure the VM has network connectivity and the VM agent is latest and running. For more information, refer to the article, http://go.microsoft.com/fwlink/?LinkId=800034. |This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. [Learn more](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#vm-agent-unable-to-communicate-with-azure-backup) about debugging up VM snapshot issues.<br> If the VM agent is not causing problems, restart the VM. An incorrect VM state can cause problems, and restarting the VM resets the state. |
| VM is in Failed Provisioning State - Restart the VM, and make sure the VM is running or shut down. | This error occurs when one of the extensions failures leads VM state to be in failed provisioning state. Go to extensions list and see if there is a failed extension, remove it and try restarting the virtual machine. If all extensions are in running state, check if VM agent service is running. If not, restart the VM agent service. | 
| VMSnapshot extension operation failed for managed disks - Retry the backup operation. If the problem continues, follow the instructions at 'http://go.microsoft.com/fwlink/?LinkId=800034'. If the problem still persists, contact Microsoft support | This error occurs when the Backup service fails to trigger a snapshot. [Learn more](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#vmsnapshot-extension-operation-failed) about debugging VM snapshot issues. |
| Could not copy the snapshot of the virtual machine, due to insufficient free space in the storage account - Ensure that storage account has free space equivalent to the data present on the premium storage disks attached to the virtual machine | In case of premium VMs on VM backup stack V1, we copy the snapshot to storage account. This is to make sure that backup management traffic, which works on snapshot, doesn't limit the number of IOPS available to the application using premium disks. Microsoft recommends you allocate only 50% (17.5 TB) of the total storage account space so the Azure Backup service can copy the snapshot to storage account and transfer data from this copied location in storage account to the vault. | 
| Unable to perform the operation as the VM agent is not responsive |This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. For Windows VMs, check the VM agent service status in services and whether the agent appears in programs in control panel. Try removing the program from control panel and re-installing the agent as mentioned [below](#vm-agent). After re-installing the agent, trigger an adhoc backup to verify. |
| Recovery services extension operation failed. - Make sure the latest virtual machine agent is present on the virtual machine, and agent service is running. Retry backup operation. If the backup operation fails, contact Microsoft support. |This error is thrown when VM agent is out of date. Refer “Updating the VM Agent” section below to update the VM agent. |
| Virtual machine doesn't exist. - Make sure the virtual machine exists, or select a different virtual machine. |Occurs when the primary VM is deleted, but the backup policy continues to look for a VM to back up. To fix this error: <ol><li> Recreate the virtual machine with the same name and same resource group name [cloud service name],<br>(OR)<br></li><li>Stop protecting the virtual machine without deleting the backup data. [More details](http://go.microsoft.com/fwlink/?LinkId=808124)</li></ol> |
| Command execution failed. - Another operation is currently in progress on this item. Wait until the previous operation completes, and then retry the operation. |An existing backup job is running, and a new job can't start until the current job finishes. |
| Copying VHDs from the Recovery Services vault timed out - Retry the operation in a few minutes. If the problem persists, contact Microsoft Support. | Occurs if there is a transient error on storage side, or if the Backup service doesn't receive sufficient storage account IOPS to transfer data to the vault, within the timeout period. Make sure to follow the [best practices when configuring your VMs](backup-azure-vms-introduction.md#best-practices). Move your VM to a different storage account that isn't loaded, and retry the backup job.|
| Backup failed with an internal error - Retry the operation in a few minutes. If the problem persists, contact Microsoft Support |You can receive this error for two reasons: <ol><li> There is a transient issue in accessing the VM storage. Check the [Azure Status site](https://azure.microsoft.com/status/) to see if there are Compute, Storage, or Networking issues in the region. Once the issue is resolved, retry the backup job. <li>The original VM has been deleted and the recovery point can't be taken. To keep the backup data for a deleted VM, but remove the backup errors: Unprotect the VM, and choose the option to retain the data. This action stops the scheduled backup job and the recurring error messages. |
| Failed to install the Azure Recovery Services extension on the selected item - The VM agent is a prerequisite for the Azure Recovery Services Extension. Install the Azure VM agent and restart the registration operation |<ol> <li>Check if the VM agent has been installed correctly. <li>Ensure the flag on the VM config is set correctly.</ol> [Read more](#validating-vm-agent-installation) about installing the VM agent, and how to validate the VM agent installation. |
| Extension installation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator |This usually means that the COM+ service is not running. Contact Microsoft support for help on fixing this issue. |
| Snapshot operation failed with the VSS operation error "This drive is locked by BitLocker Drive Encryption. You must unlock this drive from the Control Panel. |Turn off BitLocker for all drives on the VM and observe if the VSS issue is resolved |
| VM is not in a state that allows backups. |<ul><li>If the VM is in a transient state between **Running** and **Shut down**, wait for the state to change, and then trigger the backup job. <li> If the VM is a Linux VM and uses the Security Enhanced Linux kernel module, exclude the Linux Agent path (_/var/lib/waagent_) from security policy, and make sure the Backup extension is installed.  |
| Azure Virtual Machine Not Found. |This errors occurs when the primary VM is deleted, but the backup policy continues looking for the deleted VM. To fix this error: <ol><li>Recreate the virtual machine with the same name and same resource group name [cloud service name], <br>(OR) <li> Disable protection for this VM so the backup jobs will not be created. </ol> |
| Virtual machine agent is not present on the virtual machine - Please install any prerequisite and the VM agent, and then restart the operation. |[Read more](#vm-agent) about VM agent installation, and how to validate the VM agent installation. |
| Snapshot operation failed due to VSS Writers in bad state |You need to restart VSS(Volume Shadow copy Service) writers that are in bad state. To achieve this, from an elevated command prompt, run ```vssadmin list writers```. Output contains all VSS writers and their state. For every VSS writer whose state is not "[1] Stable", restart VSS writer by running following commands from an elevated command prompt:<br> ```net stop serviceName``` <br> ```net start serviceName```|
| Snapshot operation failed due to a parsing failure of the configuration |This happens due to changed permissions on the MachineKeys directory: _%systemdrive%\programdata\microsoft\crypto\rsa\machinekeys_ <br>Please run below command and verify that permissions on MachineKeys directory are default-ones:<br>_icacls %systemdrive%\programdata\microsoft\crypto\rsa\machinekeys_ <br><br> Default permissions are:<br>Everyone:(R,W) <br>BUILTIN\Administrators:(F)<br><br>If you see permissions on MachineKeys directory different than default, please follow below steps to correct permissions, delete the certificate and trigger the backup.<ol><li>Fix permissions on MachineKeys directory.<br>Using Explorer Security Properties and Advanced Security Settings on the directory, reset permissions back to the default values. Remove all user objects (except default) from the directory, and ensure the **Everyone** permission has special access for:<br>-List folder / read data <br>-Read attributes <br>-Read extended attributes <br>-Create files / write data <br>-Create folders / append data<br>-Write attributes<br>-Write extended attributes<br>-Read permissions<br><br><li>Delete all certificates where **Issued To** is the classic deployment model, or **Windows Azure CRP Certificate Generator**.<ul><li>[Open Certificates (Local computer) console](https://msdn.microsoft.com/library/ms788967(v=vs.110).aspx)<li>Under **Personal** > **Certificates**, delete all certificates where **Issued To** is the classic deployment model or **Windows Azure CRP Certificate Generator**.</ul><li>Trigger a VM backup job. </ol>|
| Azure Backup Service does not have sufficient permissions to Key Vault for Backup of Encrypted Virtual Machines. |Backup service should be provided these permissions in PowerShell using steps mentioned in **Enable Backup** section of [PowerShell documentation](backup-azure-vms-automation.md). |
|Installation of snapshot extension failed with error - COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator | From an elevated command prompt, start Windows service "COM+ System Application", for example  _net start COMSysApp_. <br>If the service fails to start, then:<ol><li> Make sure the Log on account of service "Distributed Transaction Coordinator" is "Network Service". If it's not, change the Log on account to "Network Service", restart the service, and then try to start "COM+ System Application".'<li>If "COM+ System Application won't start, use the following steps to uninstall/install service "Distributed Transaction Coordinator":<br> - Stop the MSDTC service<br> - Open a command prompt (cmd) <br> - Run command ```msdtc -uninstall``` <br> - Run command ```msdtc -install``` <br> - Start the MSDTC service<li>Start windows service "COM+ System Application". Once "COM+ System Application starts, trigger a backup job from the Azure portal.</ol> |
|  Snapshot operation failed due to COM+ error | The recommended action is to restart windows service "COM+ System Application" (from an elevated command prompt - _net start COMSysApp_). If the issue persists, restart the VM. If restarting the VM doesn't help, try [removing the VMSnapshot Extension](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout#cause-3-the-backup-extension-fails-to-update-or-load) and trigger the backup manually. |
| Failed to freeze one or more mount-points of the VM to take a file-system consistent snapshot | Use the following steps: <ol><li>Check the file-system state of all mounted devices using _'tune2fs'_ command.<br> Eg: tune2fs -l /dev/sdb1 \| grep "Filesystem state" <li>Unmount the devices for which filesystem state is not clean using _'umount'_ command <li> Run FileSystemConsistency Check on these devices using _'fsck'_ command <li> Mount the devices again and try backup.</ol> |
| Snapshot operation failed due to failure in creating secure network communication channel | <ol><Li> Open Registry Editor by running regedit.exe in an elevated mode. <li> Identify all versions of .NET Framework present in your system. They are present under the hierarchy of registry key "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft" <li> For each .Net Framework present in registry key, add following key: <br> "SchUseStrongCrypto"=dword:00000001 </ol>|
| Snapshot operation failed due to failure in installation of Visual C++ Redistributable for Visual Studio 2012 | Navigate to C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\agentVersion and install vcredist2012_x64. Make sure that registry key value for allowing this service installation is set to correct value i.e. value of registry key  _HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Msiserver_ is set to 3 and not 4. If you are still facing issues with installation, restart installation service by running _MSIEXEC /UNREGISTER_ followed by _MSIEXEC /REGISTER_ from an elevated command prompt.  |


## Jobs
| Error details | Workaround |
| --- | --- |
| Cancellation is not supported for this job type - Please wait until the job completes. |None |
| The job is not in a cancelable state - Please wait until the job completes. <br>OR<br> The selected job is not in a cancelable state - Please wait for the job to complete. |In all likelihood, the job is almost completed. Please wait until the job is completed.|
| Cannot cancel the job because it is not in progress - Cancellation is only supported for jobs which are in progress. Please attempt cancel on an in progress job. |This happens due to a transitory state. Wait for a minute and retry the cancel operation. |
| Failed to cancel the Job - Please wait till job finishes. |None |

## Restore
| Error details | Workaround |
| --- | --- |
| Restore failed with Cloud Internal error |<ol><li>Cloud service to which you are trying to restore is configured with DNS settings. You can check <br>$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production"     Get-AzureDns -DnsSettings $deployment.DnsSettings<br>If there is Address configured, this means that DNS settings are configured.<br> <li>Cloud service to which to you are trying to restore is configured with ReservedIP and existing VMs in cloud service are in stopped state.<br>You can check a cloud service has reserved IP by using following powershell cmdlets:<br>$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName <br><li>You are trying to restore a virtual machine with following special network configurations in to same cloud service. <br>- Virtual machines under load balancer configuration (Internal and external)<br>- Virtual machines with multiple Reserved IPs<br>- Virtual machines with multiple NICs<br>Please select a new cloud service in the UI or please refer to [restore considerations](backup-azure-arm-restore-vms.md#restore-vms-with-special-network-configurations) for VMs with special network configurations.</ol> |
| The selected DNS name is already taken - Please specify a different DNS name and try again. |The DNS name here refers to the cloud service name (usually ending with .cloudapp.net). This needs to be unique. If you encounter this error, you need to choose a different VM name during restore. <br><br> This error is shown only to users of the Azure portal. The restore operation through PowerShell will succeed because it only restores the disks and doesn't create the VM. The error will be faced when the VM is explicitly created by you after the disk restore operation. |
| The specified virtual network configuration is not correct - Please specify a different virtual network configuration and try again. |None |
| The specified cloud service is using a reserved IP, which doesn't match with the configuration of the virtual machine being restored - Please specify a different cloud service, which is not using reserved IP, or choose another recovery point to restore from. |None |
| Cloud service has reached limit on number of input end points - Retry the operation by specifying a different cloud service or by using an existing endpoint. |None |
| Recovery Services vault and target storage account are in two different regions - Make sure the storage account specified in the restore operation, is in the same Azure region as your Recovery Services vault. |None |
| Storage Account specified for the restore operation is not supported - Only Basic/Standard storage accounts with locally redundant or geo redundant replication settings are supported. Please select a supported storage account |None |
| Type of Storage Account specified for restore operation is not online - Make sure that the storage account specified in restore operation is online |This might happen because of a transient error in Azure Storage or due to an outage. Please choose another storage account. |
| Resource Group Quota has been reached - Please delete some resource groups from Azure portal or contact Azure support to increase the limits. |None |
| Selected subnet does not exist - Please select a subnet which exists |None |
| Backup Service does not have authorization to access resources in your subscription. |To resolve this, first Restore Disks using steps mentioned in section **Restore backed up disks** in [Choosing VM restore configuration](backup-azure-arm-restore-vms.md#choose-a-vm-restore-configuration). After that, use PowerShell steps mentioned in [Create a VM from restored disks](backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create full VM from restored disks. |

## Backup or Restore taking time
If you see your backup(>12 hours) or restore taking time(>6 hours):
* Understand [factors contributing to backup time](backup-azure-vms-introduction.md#total-vm-backup-time) and [factors contributing to restore time](backup-azure-vms-introduction.md#total-restore-time).
* Make sure that you follow [Backup best practices](backup-azure-vms-introduction.md#best-practices). 

## VM Agent
### Setting up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly.

For Windows VMs:

* Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need Administrator privileges to complete the installation.
* For Classic virtual machines, [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed. This step is not required for Resource Manager virtual machines.

For Linux VMs:

* Install the latest version of the agent from the distribution repository. For details on the package name, see the [Linux agent repository](https://github.com/Azure/WALinuxAgent).
* For classic VMs, [use the blog entry to update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx), and verfiy the agent is installed. This step isn't required for Resource Manager virtual machines.

### Updating the VM Agent
For Windows VMs:

* To update the VM Agent, reinstall the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). Before you update the agent, make sure no backup operations occur during the VM Agent update.

For Linux VMs:

* To update the Linux VM Agent, follow the instructions in the article, [Updating the Linux VM Agent](../virtual-machines/linux/update-agent.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
**You should always use the distribution repository to update the agent**. Do not download the agent code from GitHub. If the latest agent isn't available for your distribution, reach out to the distribution support for instructions on acquiring the latest agent. You can also check the latest [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) information in the GitHub repository.

### Validating VM Agent installation

To verify the VM Agent version on Windows VMs:

1. Sign in to the Azure virtual machine and navigate to the folder *C:\WindowsAzure\Packages*. You should find the WaAppAgent.exe file present.
2. Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher

## Troubleshoot VM Snapshot Issues
VM backup relies on issuing snapshot commands to underlying storage. Not having access to storage, or delays in a snapshot task execution can cause the backup job to fail. The following can cause snapshot task failure.

1. Network access to Storage is blocked using NSG<br>
    Learn more on how to [enable network access](backup-azure-arm-vms-prepare.md#establish-network-connectivity) to Storage using either WhiteListing of IPs or through proxy server.
2. VMs with Sql Server backup configured can cause snapshot task delay <br>
   By default, VM backup creates a VSS full backup on Windows VMs. VMs running SQL Server, with SQL Server backup configured, can experience snapshot delays. If snapshot delays cause backup failures, set following registry key.

   ```
   [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
   "USEVSSCOPYBACKUP"="TRUE"
   ```

3. VM status reported incorrectly because VM is shut down in RDP.  <br>
   If you used the remote desktop to shut down the virtual machine, verify the VM status in the portal is correct. If the status isn't correct, use the **Shutdown** option in the portal VM dashboard to shut down the VM.
4. If more than four VMs share the same cloud service, spread the VMs across multiple backup policies. Stagger the backup times so no more than four VM backups start at the same time. Try to separate the start times in the policies by at least an hour.
5. VM is running at High CPU/Memory.<br>
   If the virtual machine is running at high memory or CPU usage(>90%), your snapshot task is queued, delayed and eventually times-out. If this happens, try an on-demand backup.

<br>

## Networking
Like all extensions, Backup extension need access to the public internet to work. Not having access to the public internet can manifest itself in various ways:

* The extension installation can fail
* The backup operations (like disk snapshot) can fail
* Displaying the status of the backup operation can fail

The need for resolving public internet addresses has been articulated [here](http://blogs.msdn.com/b/mast/archive/2014/06/18/azure-vm-provisioning-stuck-on-quot-installing-extensions-on-virtual-machine-quot.aspx). You need to check the DNS configurations for the VNET and ensure that the Azure URIs can be resolved.

Once the name resolution is done correctly, access to the Azure IPs also needs to be provided. To unblock access to the Azure infrastructure, follow one of these steps:

1. WhiteList the Azure datacenter IP ranges.
   * Get the list of [Azure datacenter IPs](https://www.microsoft.com/download/details.aspx?id=41653) to be whitelisted.
   * Unblock the IPs using the [New-NetRoute](https://docs.microsoft.com/powershell/module/nettcpip/new-netroute) cmdlet. Run this cmdlet within the Azure VM, in an elevated PowerShell window (run as Administrator).
   * Add rules to the NSG (if you have one in place) to allow access to the IPs.
2. Create a path for HTTP traffic to flow
   * If you have some network restriction in place (a Network Security Group, for example) deploy an HTTP proxy server to route the traffic. Steps to deploy an HTTP Proxy server can found [here](backup-azure-arm-vms-prepare.md#establish-network-connectivity).
   * Add rules to the NSG (if you have one in place) to allow access to the INTERNET from the HTTP Proxy.

> [!NOTE]
> DHCP must be enabled inside the guest for IaaS VM Backup to work.  If you need a static private IP, you should configure it through the platform. The DHCP option inside the VM should be left enabled.
> View more information about [Setting a Static Internal Private IP](../virtual-network/virtual-networks-reserved-private-ip.md).
>
>
