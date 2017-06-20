---
title: Troubleshoot backup errors with Azure virtual machine | Microsoft Docs
description: Troubleshoot backup and restore of Azure virtual machines
services: backup
documentationcenter: ''
author: trinadhk
manager: shreeshd
editor: ''

ms.assetid: 73214212-57a4-4b57-a2e2-eaf9d7fde67f
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/15/2017
ms.author: trinadhk;markgal;jpallavi;

---
# Troubleshoot Azure virtual machine backup
> [!div class="op_single_selector"]
> * [Recovery services vault](backup-azure-vms-troubleshoot.md)
> * [Backup vault](backup-azure-vms-troubleshoot-classic.md)
>
>

You can troubleshoot errors encountered while using Azure Backup with information listed in the table below.

## Backup
| Error details | Workaround |
| --- | --- |
| Could not perform the operation as VM no longer exists. - Stop protecting virtual machine without deleting backup data. More details at http://go.microsoft.com/fwlink/?LinkId=808124 |This happens when the primary VM is deleted, but the backup policy continues looking for a VM to back up. To fix this error: <ol><li> Recreate the virtual machine with the same name and same resource group name [cloud service name],<br>(OR)</li><li> Stop protecting virtual machine with or without deleting the backup data. [More details](http://go.microsoft.com/fwlink/?LinkId=808124)</li></ol> |
| Could not communicate with the VM agent for snapshot status. - Ensure that VM has internet access. Also, update the VM agent as mentioned in the troubleshooting guide at http://go.microsoft.com/fwlink/?LinkId=800034 |This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. [Learn more](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) about debugging up VM snapshot issues.<br> If the VM agent is not causing any issues, then restart the VM. At times an incorrect VM state can cause issues, and restarting the VM resets this "bad state" |
| Unable to perform the operation as the VM agent is not responsive |This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. For Windows VMs, check the VM agent service status in services and whether the agent appears in programs in control panel. Try removing the program from control panel and re-installing the agent as mentioned [below](#vm-agent). After re-installing the agent, trigger an adhoc backup to verify. |
| Recovery services extension operation failed. - Please make sure that latest virtual machine agent is present on the virtual machine and agent service is running. Please retry backup operation and if it fails, contact Microsoft support. |This error is thrown when VM agent is out of date. Refer “Updating the VM Agent” section below to update the VM agent. |
| Virtual machine doesn't exist. - Please make sure that virtual machine exists or select a different virtual machine. |This happens when the primary VM is deleted but the backup policy continues to look for a VM to perform backup. To fix this error: <ol><li> Recreate the virtual machine with the same name and same resource group name [cloud service name],<br>(OR)<br></li><li>Stop protecting the virtual machine without deleting the backup data. [More details](http://go.microsoft.com/fwlink/?LinkId=808124)</li></ol> |
| Command execution failed. - Another operation is currently in progress on this item. Please wait until the previous operation is completed, and then retry |An existing backup on the VM is running, and a new job cannot be started while the existing job is running. |
| Copying VHDs from the backup vault timed out - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support. | This happens if there is a transient error on storage side or if backup service is not getting sufficient IOPS from storage account hosting the VM in order to transfer data within timeout period to vault. Make sure that you followed [Best practices](backup-azure-vms-introduction.md#best-practices) while setting up backup. Try moving VM to a different storage account which is not loaded and retry backup.|
| Backup failed with an internal error - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support |You can get this error for 2 reasons: <ol><li> There is a transient issue in accessing the VM storage. Please check [Azure Status](https://azure.microsoft.com/en-us/status/) to see if there is any on-going issue related to compute, storage, or networking in the region. Then retry the backup job once the issue is resolved. <li>The original VM has been deleted and therefore, the recovery point cannot be taken. To keep the backup data for a deleted VM, but remove the backup errors: Unprotect the VM and choose the option to keep the data. This action stops the scheduled backup job and the recurring error messages. |
| Failed to install the Azure Recovery Services extension on the selected item - The VM agent is a prerequisite for the Azure Recovery Services Extension. Install the Azure VM agent and restart the registration operation |<ol> <li>Check if the VM agent has been installed correctly. <li>Ensure the flag on the VM config is set correctly.</ol> [Read more](#validating-vm-agent-installation) about installing the VM agent, and how to validate the VM agent installation. |
| Extension installation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator |This usually means that the COM+ service is not running. Contact Microsoft support for help on fixing this issue. |
| Snapshot operation failed with the VSS operation error "This drive is locked by BitLocker Drive Encryption. You must unlock this drive from the Control Panel. |Turn off BitLocker for all drives on the VM and observe if the VSS issue is resolved |
| VM is not in a state that allows backups. |<ul><li>Check if VM is in a transient state between Running and Shut down. If it is, wait for the VM state to be one of them and trigger backup again. <li> If the VM is a Linux VM and uses [Security Enhanced Linux] kernel module, you need to exclude the Linux Agent path(_/var/lib/waagent_) from security policy to make sure backup extension gets installed.  |
| Azure Virtual Machine Not Found. |This happens when the primary VM is deleted but the backup policy continues to look for a VM to perform back up. To fix this error: <ol><li>Recreate the virtual machine with the same name and same resource group name [cloud service name], <br>(OR) <li> Disable protection for this VM so the backup jobs will not be created. </ol> |
| Virtual machine agent is not present on the virtual machine - Please install any prerequisite and the VM agent, and then restart the operation. |[Read more](#vm-agent) about VM agent installation, and how to validate the VM agent installation. |
| Snapshot operation failed due to VSS Writers in bad state |You need to restart VSS(Volume Shadow copy Service) writers that are in bad state. To achieve this, from an elevated command prompt, run _vssadmin list writers_. Output contains all VSS writers and their state. For every VSS writer whose state is not "[1] Stable", restart VSS writer by running following commands from an elevated command prompt<br> _net stop serviceName_ <br> _net start serviceName_|
| Snapshot operation failed due to a parsing failure of the configuration |This happens due to changed permissions on the MachineKeys directory: _%systemdrive%\programdata\microsoft\crypto\rsa\machinekeys_ <br>Please run below command and verify that permissions on MachineKeys directory are default-ones:<br>_icacls %systemdrive%\programdata\microsoft\crypto\rsa\machinekeys_ <br><br> Default permissions are:<br>Everyone:(R,W) <br>BUILTIN\Administrators:(F)<br><br>If you see permissions on MachineKeys directory different than default, please follow below steps to correct permissions, delete the certificate and trigger the backup.<ol><li>Fix permissions on MachineKeys directory.<br>Using Explorer Security Properties and Advanced Security Settings on the directory, reset permissions back to the default values, remove any extra (than default) user object from the directory, and ensure that the ‘Everyone’ permissions had special access for:<br>-List folder / read data <br>-Read attributes <br>-Read extended attributes <br>-Create files / write data <br>-Create folders / append data<br>-Write attributes<br>-Write extended attributes<br>-Read permissions<br><br><li>Delete all certificates with field ‘Issued To’ = "Windows Azure Service Management for Extensions" or "Windows Azure CRP Certificate Generator”.<ul><li>[Open Certificates(Local computer) console](https://msdn.microsoft.com/library/ms788967(v=vs.110).aspx)<li>Delete all certificates (under Personal -> Certificates) with field ‘Issued To’ = "Windows Azure Service Management for Extensions" or "Windows Azure CRP Certificate Generator”.</ul><li>Trigger VM backup. </ol>|
| Validation failed as virtual machine is encrypted with BEK alone. Backups can be enabled only for virtual machines encrypted with both BEK and KEK. |Virtual machine should be encrypted using both BitLocker Encryption Key and Key Encryption Key. After that, backup should be enabled. |
| Azure Backup Service does not have sufficient permissions to Key Vault for Backup of Encrypted Virtual Machines. |Backup service should be provided these permissions in PowerShell using steps mentioned in **Enable Backup** section of [PowerShell documentation](backup-azure-vms-automation.md). |
|Installation of snapshot extension failed with error - COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator | Please try to start windows service "COM+ System Application" (from an elevated command prompt - _net start COMSysApp_). <br>If it fails while starting, please follow below steps:<ol><li> Validate that the Logon account of service "Distributed Transaction Coordinator" is "Network Service". If it is not, please change it to "Network Service", restart this service and then try to start service "COM+ System Application".'<li>If it still fails to start, uninstall/install service "Distributed Transaction Coordinator" by following below steps:<br> - Stop the MSDTC service<br> - Open a command prompt (cmd) <br> - Run command “msdtc -uninstall” <br> - Run command “msdtc -install” <br> - Start the MSDTC service<li>Start windows service "COM+ System Application" and after it is started, trigger backup from portal.</ol> |
|  Snapshot operation failed due to COM+ error | The recommended action is to restart windows service "COM+ System Application" (from an elevated command prompt - _net start COMSysApp_). If the issue persists, restart the VM. If restarting the VM doesn't help, try [removing the VMSnapshot Extension](https://docs.microsoft.com/en-us/azure/backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout#cause-3-the-backup-extension-fails-to-update-or-load) and trigger the backup manually |
| Failed to freeze one or more mount-points of the VM to take a file-system consistent snapshot | <ol><li>Check the file-system state of all mounted devices using _'tune2fs'_ command.<br> Eg: tune2fs -l /dev/sdb1 \| grep "Filesystem state" <li>Unmount the devices for which filesystem state is not clean using _'umount'_ command <li> Run FileSystemConsistency Check on these devices using _'fsck'_ command <li> Mount the devices again and try backup.</ol> |
| Snapshot operation failed due to failure in creating secure network communication channel | <ol><Li> Open Registry Editor by running regedit.exe in an elevated mode. <li> Identify all versions of .NetFramework present in system. They are present under the hierarchy of registry key "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft" <li> For each .NetFramework present in registry key, add following key: <br> "SchUseStrongCrypto"=dword:00000001 </ol>|
| Snapshot operation failed due to failure in installation of Visual C++ Redistributable for Visual Studio 2012 | Navigate to C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\agentVersion and install vcredist2012_x64. Make sure that registry key value for allowing this service installation is set to correct value i.e. value of registry key  _HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Msiserver_ is set to 3 and not 4. If you are still facing issues with installation, restart installation service by running _MSIEXEC /UNREGISTER_ followed by _MSIEXEC /REGISTER_ from an elevated command prompt.  |


## Jobs
| Error details | Workaround |
| --- | --- |
| Cancellation is not supported for this job type - Please wait until the job completes. |None |
| The job is not in a cancelable state - Please wait until the job completes. <br>OR<br> The selected job is not in a cancelable state - Please wait for the job to complete. |In all likelihood, the job is almost completed. Please wait until the job is completed.|
| Cannot cancel the job because it is not in progress - Cancellation is only supported for jobs which are in progress. Please attempt cancel on an in progress job. |This happens due to a transitory state. Wait for a minute and retry the cancel operation |
| Failed to cancel the Job - Please wait till job finishes. |None |

## Restore
| Error details | Workaround |
| --- | --- |
| Restore failed with Cloud Internal error |<ol><li>Cloud service to which you are trying to restore is configured with DNS settings. You can check <br>$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production"     Get-AzureDns -DnsSettings $deployment.DnsSettings<br>If there is Address configured, this means that DNS settings are configured.<br> <li>Cloud service to which to you are trying to restore is configured with ReservedIP and existing VMs in cloud service are in stopped state.<br>You can check a cloud service has reserved IP by using following powershell cmdlets:<br>$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName <br><li>You are trying to restore a virtual machine with following special network configurations in to same cloud service. <br>- Virtual machines under load balancer configuration (Internal and external)<br>- Virtual machines with multiple Reserved IPs<br>- Virtual machines with multiple NICs<br>Please select a new cloud service in the UI or please refer to [restore considerations](backup-azure-arm-restore-vms.md#restoring-vms-with-special-network-configurations) for VMs with special network configurations</ol> |
| The selected DNS name is already taken - Please specify a different DNS name and try again. |The DNS name here refers to the cloud service name (usually ending with .cloudapp.net). This needs to be unique. If you encounter this error, you need to choose a different VM name during restore. <br><br> This error is shown only to users of the Azure portal. The restore operation through PowerShell will succeed because it only restores the disks and doesn't create the VM. The error will be faced when the VM is explicitly created by you after the disk restore operation. |
| The specified virtual network configuration is not correct - Please specify a different virtual network configuration and try again. |None |
| The specified cloud service is using a reserved IP, which doesn't match with the configuration of the virtual machine being restored - Please specify a different cloud service, which is not using reserved IP, or choose another recovery point to restore from. |None |
| Cloud service has reached limit on number of input end points - Retry the operation by specifying a different cloud service or by using an existing endpoint. |None |
| Backup vault and target storage account are in two different regions - Ensure that the storage account specified in restore operation is in the same Azure region as the backup vault. |None |
| Storage Account specified for the restore operation is not supported - Only Basic/Standard storage accounts with locally redundant or geo redundant replication settings are supported. Please select a supported storage account |None |
| Type of Storage Account specified for restore operation is not online - Make sure that the storage account specified in restore operation is online |This might happen because of a transient error in Azure Storage or due to an outage. Please choose another storage account. |
| Resource Group Quota has been reached - Please delete some resource groups from Azure portal or contact Azure support to increase the limits. |None |
| Selected subnet does not exist - Please select a subnet which exists |None |
| Backup Service does not have authorization to access resources in your subscription. |To resolve this, first Restore Disks using steps mentioned in section **Restore backed up disks** in [Choosing VM restore configuration](backup-azure-arm-restore-vms.md#choosing-a-vm-restore-configuration). After that, use PowerShell steps mentioned in [Create a VM from restored disks](backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create full VM from restored disks. |

## Backup or Restore taking time
If you see your backup(>12 hours) or restore taking time(>6 hours):
* Understand [factors contributing to backup time](backup-azure-vms-introduction.md#total-vm-backup-time) and [factors contributing to restore time](backup-azure-vms-introduction.md#total-restore-time).
* Make sure that you follow [Backup best practices](backup-azure-vms-introduction.md#best-practices). 

## VM Agent
### Setting up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly. Read more about [installing the VM agent on an existing VM](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx).

For Windows VMs:

* Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need Administrator privileges to complete the installation.
* for classic virtual machines, [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.

For Linux VMs:

* Install latest from distribution repository. We **strongly recommend** installing agent only through distribution repository. For details on package name, please refer to [Linux agent repository](https://github.com/Azure/WALinuxAgent) 
* For classic VMs, [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.

### Updating the VM Agent
For Windows VMs:

* Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). However, you need to ensure that no backup operation is running while the VM Agent is being updated.

For Linux VMs:

* Follow the instructions on [Updating Linux VM Agent](../virtual-machines/linux/update-agent.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
We **strongly recommend** updating agent only through distribution repository. We do not recommend downloading the agent code from directly github and updating it. If latest agent is not available for your distribution, please reach out to distribution support for instructions on how to install latest agent. You can check latest [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) information in github repository.

### Validating VM Agent installation
How to check for the VM Agent version on Windows VMs:

1. Log on to the Azure virtual machine and navigate to the folder *C:\WindowsAzure\Packages*. You should find the WaAppAgent.exe file present.
2. Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher

## Troubleshoot VM Snapshot Issues
VM backup relies on issuing snapshot commands to underlying storage. Not having access to storage, or delays in a snapshot task execution can cause the backup job to fail. The following can cause snapshot task failure.

1. Network access to Storage is blocked using NSG<br>
    Learn more on how to [enable network access](backup-azure-vms-prepare.md#network-connectivity) to Storage using either WhiteListing of IPs or through proxy server.
2. VMs with Sql Server backup configured can cause snapshot task delay <br>
   By default VM backup issues VSS Full backup on Windows VMs. On VMs that are running Sql Servers and if Sql Server backup is configured, this might cause delay in snapshot execution. Please set following registry key if you are experiencing backup failures because of snapshot issues.

   ```
   [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
   "USEVSSCOPYBACKUP"="TRUE"
   ```
3. VM status reported incorrectly because VM is shut down in RDP.  <br>
   If you have Shut down the virtual machine in RDP, please check back in the portal that VM status is reflected correctly. If not, please shut down the VM in portal using 'Shutdown' option in VM dashboard.
4. If more than four VMs share the same cloud service, configure multiple backup policies to stage the backup times so no more than four VM backups are started at the same time. Try to spread the backup start times an hour apart between policies.
5. VM is running at High CPU/Memory.<br>
   If the virtual machine is running at High CPU usage(>90%) or memory, snapshot task is queued, delayed and will eventually gets timed-out. Try on-demand backup in such situations.

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
   * Unblock the IPs using the [New-NetRoute](https://technet.microsoft.com/library/hh826148.aspx) cmdlet. Run this cmdlet within the Azure VM, in an elevated PowerShell window (run as Administrator).
   * Add rules to the NSG (if you have one in place) to allow access to the IPs.
2. Create a path for HTTP traffic to flow
   * If you have some network restriction in place (a Network Security Group, for example) deploy an HTTP proxy server to route the traffic. Steps to deploy an HTTP Proxy server can found [here](backup-azure-vms-prepare.md#network-connectivity).
   * Add rules to the NSG (if you have one in place) to allow access to the INTERNET from the HTTP Proxy.

> [!NOTE]
> DHCP must be enabled inside the guest for IaaS VM Backup to work.  If you need a static private IP, you should configure it through the platform. The DHCP option inside the VM should be left enabled.
> View more information about [Setting a Static Internal Private IP](../virtual-network/virtual-networks-reserved-private-ip.md).
>
>
