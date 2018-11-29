---
title: Troubleshoot backup errors with Azure virtual machines
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
You can troubleshoot errors encountered while using Azure Backup with the information listed in the following table:

| Error details | Workaround |
| --- | --- |
| Backup couldn't perform the operation as the virtual machine (VM) no longer exists: <br>Stop protecting the virtual machine without deleting backup data. For more information, see [Stop protecting virtual machines](http://go.microsoft.com/fwlink/?LinkId=808124). |This error happens when the primary VM is deleted, but the backup policy still looks for a VM to back up. To fix this error, take the following steps: <ol><li> Re-create the virtual machine with the same name and same resource group name, **cloud service name**,<br>**or**</li><li> Stop protecting the virtual machine with or without deleting the backup data. For more information, see [Stop protecting virtual machines](https://go.microsoft.com/fwlink/?LinkId=808124).</li></ol> |
| The snapshot operation failed because there was no network connectivity on the virtual machine: <br>Make sure that VM has network access. For the snapshot to succeed, either whitelist Azure datacenter IP ranges or set up a proxy server for network access. For more information, see [Troubleshoot Azure Backup failure: Issues with the agent or extension](http://go.microsoft.com/fwlink/?LinkId=800034). If you already use a proxy server, make sure that proxy server settings are configured correctly. | This error happens when you deny the outbound internet connectivity on the virtual machine. The VM snapshot extension requires internet connectivity to take a snapshot of underlying disks. See [ExtensionSnapshotFailedNoNetwork](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#ExtensionSnapshotFailedNoNetwork-snapshot-operation-failed-due-to-no-network-connectivity-on-the-virtual-machine). |
| The Azure Virtual Machine Agent (VM Agent) can't communicate with the Azure Backup service: <br>Make sure the VM has network connectivity, and the VM agent is the latest and running. For more information, see [Troubleshoot Azure Backup failure: Issues with the agent or extension](http://go.microsoft.com/fwlink/?LinkId=800034). |This error happens if there's a problem with the VM Agent, or network access to the Azure infrastructure is blocked in some way. Learn more about [debugging VM snapshot issues](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#UserErrorGuestAgentStatusUnavailable-vm-agent-unable-to-communicate-with-azure-backup). <br><br>If the VM Agent isn't causing problems, restart the VM. An incorrect VM state can cause problems, and restarting the VM resets the state. |
| The VM is in failed provisioning state: <br>Restart the VM and make sure the VM is running or shut down. | This error occurs when one of the extension failures puts the VM into failed provisioning state. Go to the extensions list, check if there's a failed extension, remove it, and try restarting the virtual machine. If all extensions are in running state, check if the VM Agent service is running. If not, restart the VM Agent service. |
| The **VMSnapshot** extension operation failed for managed disks: <br>Retry the backup operation. If the problem continues, follow the instructions in [Troubleshoot Azure Backup failure](http://go.microsoft.com/fwlink/?LinkId=800034). If the problem persists, contact Microsoft Support. | This error occurs when the Backup service fails to trigger a snapshot. Learn more about [debugging VM snapshot issues](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md#ExtentionOperationFailed-vmsnapshot-extension-operation-failed). |
| Backup couldn't copy the snapshot of the virtual machine because of insufficient free space in the storage account: <br>Make sure that storage account has free space equal to the data present on the premium storage disks attached to the virtual machine. | For premium VMs on VM backup stack V1, we copy the snapshot to the storage account. This step makes sure that backup management traffic, which works on the snapshot, doesn't limit the number of IOPS available to the application using premium disks. We recommend that you allocate only 50 percent, 17.5 TB, of the total storage account space. Then the Azure Backup service can copy the snapshot to the storage account and transfer data from this copied location in the storage account to the vault. |
| Backup can't perform the operation as the VM Agent isn't responsive. |This error happens if there's a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. For Windows VMs, check the VM Agent service status in services and whether the agent appears in programs in the control panel. Try removing the program from the control panel and reinstalling the agent as described in [VM Agent](#vm-agent). After you reinstall the agent, trigger an ad hoc backup to verify it. |
| The recovery services extension operation failed: <br>Make sure the latest VM Agent is present on the virtual machine, and the VM Agent service is running. Retry the backup operation. If the backup operation fails, contact Microsoft Support. |This error happens when the VM Agent is out of date. Refer to [Troubleshoot Azure virtual machine backup](#updating-the-VM-agent) to update the VM Agent. |
| The virtual machine doesn't exist: <br>Make sure the virtual machine exists, or select a different virtual machine. |This error occurs when the primary VM is deleted, but the backup policy still looks for a VM to back up. To fix this error, take the following steps: <ol><li> Re-create the virtual machine with the same name and same resource group name, **cloud service name**,<br>**or**<br></li><li>Stop protecting the virtual machine without deleting the backup data. For more information, see [Stop protecting virtual machines](https://go.microsoft.com/fwlink/?LinkId=808124).</li></ol> |
| The command run failed: <br>Another operation is currently in progress on this item. Wait until the previous operation finishes. Then retry the operation. |An existing backup job is running, and a new job can't start until the current job finishes. |
| Copying VHDs from the Recovery Services vault timed out: <br>Retry the operation in a few minutes. If the problem persists, contact Microsoft Support. | This error occurs if there's a transient error on the storage side, or if the Backup service doesn't receive sufficient storage account IOPS to transfer data to the vault, within the timeout period. Make sure to follow the [best practices when configuring your VMs](backup-azure-vms-introduction.md#best-practices). Move your VM to a different storage account that isn't loaded and retry the backup job.|
| Backup failed with an internal error: <br>Retry the operation in a few minutes. If the problem persists, contact Microsoft Support. |You get this error for two reasons: <ul><li> There's a transient issue in accessing the VM storage. Check the [Azure status site](https://azure.microsoft.com/status/) to see if there are compute, storage, or networking issues in the region. After the issue is resolved, retry the backup job. <li> The original VM has been deleted, and the recovery point can't be taken. To keep the backup data for a deleted VM but remove the backup errors, unprotect the VM and choose the option to retain the data. This action stops the scheduled backup job and the recurring error messages. |
| Backup failed to install the Azure Recovery Services extension on the selected item: <br>The VM Agent is a prerequisite for the Azure Recovery Services extension. Install the Azure Virtual Machine Agent and restart the registration operation. |<ol> <li>Check if the VM Agent is installed correctly. <li>Make sure that the flag on the VM config is set correctly.</ol> Read more about [installing the VM Agent](#validating-vm-agent-installation) and how to validate the VM Agent installation. |
| Extension installation failed with the error **COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator**. |This error usually means that the COM+ service isn't running. Contact Microsoft Support for help with fixing this issue. |
| The snapshot operation failed with the Volume Shadow Copy Service (VSS) operation error **This drive is locked by BitLocker Drive Encryption. You must unlock this drive from the Control Panel.** |Turn off BitLocker for all drives on the VM and check if the VSS issue is resolved. |
| The VM isn't in a state that allows backups. |<ul><li>If the VM is in a transient state between **Running** and **Shut down**, wait for the state to change. Then trigger the backup job. <li> If the VM is a Linux VM and uses the Security-Enhanced Linux kernel module, exclude the Azure Linux Agent path **/var/lib/waagent** from the security policy and make sure the Backup extension is installed.  |
| An Azure virtual machine wasn't found. |This error occurs when the primary VM is deleted, but the backup policy still looks for the deleted VM. Fix this error as follows: <ol><li>Re-create the virtual machine with the same name and same resource group name, **cloud service name**, <br>**or** <li> Disable protection for this VM, so the backup jobs won't be created. </ol> |
| The VM Agent isn't present on the virtual machine: <br>Install any prerequisite and the VM Agent. Then restart the operation. |Read more about [VM Agent installation and how to validate VM Agent installation](#vm-agent). |
| The snapshot operation failed because VSS writers were in a bad state. |Restart VSS writers that are in a bad state. From an elevated command prompt, run ```vssadmin list writers```. The output contains all VSS writers and their state. For every VSS writer with a state that's not **[1] Stable**, to restart VSS writer, run the following commands from an elevated command prompt: <ol><li>```net stop serviceName``` <li> ```net start serviceName```</ol>|
| The snapshot operation failed because of a parsing failure of the configuration. |This error happens because of changed permissions on the **MachineKeys** directory: **%systemdrive%\programdata\microsoft\crypto\rsa\machinekeys**. <br> Run the following command and verify that permissions on the **MachineKeys** directory are default ones:<br>**icacls %systemdrive%\programdata\microsoft\crypto\rsa\machinekeys**. <br><br>Default permissions are as follows: <ul><li>Everyone: (R,W) <li>BUILTIN\Administrators: (F)</ul> If you see permissions in the **MachineKeys** directory that are different than the defaults, follow these steps to correct permissions, delete the certificate, and trigger the backup. <ol><li>Fix permissions on the **MachineKeys** directory. By using Explorer security properties and advanced security settings in the directory, reset permissions back to the default values. Remove all user objects except the defaults from the directory and make sure the **Everyone** permission has special access as follows: <ul><li>List folder/read data <li>Read attributes <li>Read extended attributes <li>Create files/write data <li>Create folders/append data<li>Write attributes<li>Write extended attributes<li>Read permissions </ul><li>Delete all certificates where **Issued To** is the classic deployment model or **Windows Azure CRP Certificate Generator**:<ol><li>[Open certificates on a local computer console](https://msdn.microsoft.com/library/ms788967(v=vs.110).aspx).<li>Under **Personal** > **Certificates**, delete all certificates where **Issued To** is the classic deployment model or **Windows Azure CRP Certificate Generator**.</ol> <li>Trigger a VM backup job. </ol>|
| The Azure Backup service doesn't have sufficient permissions to Azure Key Vault for backup of encrypted virtual machines. |Provide the Backup service these permissions in PowerShell by using the steps in [Create a VM from restored disks](backup-azure-vms-automation.md). |
|Installation of the snapshot extension failed with the error **COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator**. | From an elevated command prompt, start the Windows service **COM+ System Application**. An example is **net start COMSysApp**. If the service fails to start, then take the following steps:<ol><li> Make sure the sign-in account of the service **Distributed Transaction Coordinator** is **Network Service**. If it's not, change the sign-in account to **Network Service** and restart the service. Then try to start **COM+ System Application**.<li>If **COM+ System Application** won't start, take the following steps to uninstall and install the service **Distributed Transaction Coordinator**: <ol><li>Stop the MSDTC service. <li>Open a command prompt, **cmd**. <li>Run the command ```msdtc -uninstall```. <li>Run the command ```msdtc -install```. <li>Start the MSDTC service. </ol> <li>Start the Windows service **COM+ System Application**. After the **COM+ System Application** starts, trigger a backup job from the Azure portal.</ol> |
|  The snapshot operation failed because of a COM+ error. | We recommend that you restart the Windows service **COM+ System Application** from an elevated command prompt, **net start COMSysApp**. If the issue persists, restart the VM. If restarting the VM doesn't help, try [removing the VMSnapshot Extension](https://docs.microsoft.com/azure/backup/backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout#cause-3-the-backup-extension-fails-to-update-or-load) and trigger the backup manually. |
| Backup failed to freeze one or more mount points of the VM to take a file system consistent snapshot. | Take the following step: <ul><li>Check the file system state of all mounted devices by using the **'tune2fs'** command. An example is **tune2fs -l /dev/sdb1 \**.| grep **Filesystem state**. <li>Unmount the devices for which the file system state isn't clean by using the **'umount'** command. <li> Run a file system consistency check on these devices by using the **'fsck'** command. <li> Mount the devices again and try backup.</ol> |
| The snapshot operation failed because of failure to create a secure network communication channel. | <ol><li> Open the Registry Editor by running **regedit.exe** in an elevated mode. <li> Identify all versions of the .NET Framework present in your system. They're present under the hierarchy of registry key **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft**. <li> For each .Net Framework present in the registry key, add the following key: <br> **SchUseStrongCrypto"=dword:00000001**. </ol>|
| The snapshot operation failed because of failure to install Visual C++ Redistributable for Visual Studio 2012. | Navigate to C:\Packages\Plugins\Microsoft.Azure.RecoveryServices.VMSnapshot\agentVersion and install vcredist2012_x64. Make sure that the registry key value that allows this service installation is set to the correct value. That is, the value of the registry key **HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Msiserver** is set to **3** and not **4**. If you still have issues with installation, restart the installation service by running **MSIEXEC /UNREGISTER** followed by **MSIEXEC /REGISTER** from an elevated command prompt.  |


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
| Restore failed with a cloud internal error. |<ol><li>The cloud service to which you're trying to restore is configured with DNS settings. You can check: <br>**$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production"     Get-AzureDns -DnsSettings $deployment.DnsSettings**.<br>If **Address** is configured, then DNS settings are configured.<br> <li>The cloud service to which to you're trying to restore is configured with **ReservedIP**, and existing VMs in the cloud service are in the stopped state.<br>You can check that a cloud service has reserved an IP by using the following PowerShell cmdlets:<br>**$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName**. <br><li>You're trying to restore a virtual machine with the following special network configurations into the same cloud service: <ul><li>Virtual machines under load balancer configuration, internal and external.<li>Virtual machines with multiple reserved IPs. <li>Virtual machines with multiple NICs. </ul><li>Select a new cloud service in the UI or see [restore considerations](backup-azure-arm-restore-vms.md#restore-vms-with-special-network-configurations) for VMs with special network configurations.</ol> |
| The selected DNS name is already taken: <br>Specify a different DNS name and try again. |This DNS name refers to the cloud service name, usually ending with **.cloudapp.net**. This name needs to be unique. If you get this error, you need to choose a different VM name during restore. <br><br> This error is shown only to users of the Azure portal. The restore operation through PowerShell succeeds because it restores only the disks and doesn't create the VM. The error will be faced when the VM is explicitly created by you after the disk restore operation. |
| The specified virtual network configuration isn't correct: <br>Specify a different virtual network configuration and try again. |None |
| The specified cloud service is using a reserved IP that doesn't match the configuration of the virtual machine being restored: <br>Specify a different cloud service that isn't using a reserved IP. Or choose another recovery point to restore from. |None |
| The cloud service has reached its limit on the number of input endpoints: <br>Retry the operation by specifying a different cloud service or by using an existing endpoint. |None |
| The Recovery Services vault and target storage account are in two different regions: <br>Make sure the storage account specified in the restore operation is in the same Azure region as your Recovery Services vault. |None |
| The storage account specified for the restore operation isn't supported: <br>Only Basic or Standard storage accounts with locally redundant or geo-redundant replication settings are supported. Select a supported storage account |None |
| The type of storage account specified for the restore operation isn't online: <br>Make sure that the storage account specified in the restore operation is online. |This error might happen because of a transient error in Azure Storage or because of an outage. Choose another storage account. |
| The resource group quota has been reached: <br>Delete some resource groups from the Azure portal or contact Azure Support to increase the limits. |None |
| The selected subnet doesn't exist: <br>Select a subnet that exists. |None |
| The Backup service doesn't have authorization to access resources in your subscription. |To resolve this error, first restore disks by using the steps in [Restore backed-up disks](backup-azure-arm-restore-vms.md#restore-backed-up-disks). Then use the PowerShell steps in [Create a VM from restored disks](backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create a full VM from restored disks. |

## Backup or restore takes time
If your backup takes more than 12 hours, or restore takes more than 6 hours:
* Understand [factors that contribute to backup time](backup-azure-vms-introduction.md#total-vm-backup-time) and [factors that contribute to restore time](backup-azure-vms-introduction.md#total-restore-time).
* Make sure that you follow [backup best practices](backup-azure-vms-introduction.md#best-practices).

## VM Agent
### Set up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. But virtual machines that are migrated from on-premises datacenters won't have the VM Agent installed. For those VMs, the VM Agent needs to be installed explicitly.

#### Windows VMs

* Download and install the [agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need Administrator privileges to finish the installation.
* For virtual machines created by using the classic deployment model, [update the VM property](https://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed. This step isn't required for Azure Resource Manager virtual machines.

#### Linux VMs

* Install the latest version of the agent from the distribution repository. For details on the package name, see the [Linux Agent repository](https://github.com/Azure/WALinuxAgent).
* For VMs created by using the classic deployment model, [use this blog](https://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to update the VM property and verify that the agent is installed. This step isn't required for Resource Manager virtual machines.

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

- **Network access to Storage is blocked by using NSG**. Learn more on how to [establish network access](backup-azure-arm-vms-prepare.md#establish-network-connectivity) to Storage by using either whitelisting of IPs or through a proxy server.
- **VMs with SQL Server backup configured can cause snapshot task delay**. By default, VM backup creates a VSS full backup on Windows VMs. VMs that run SQL Server, with SQL Server backup configured, can experience snapshot delays. If snapshot delays cause backup failures, set following registry key:

   ```
   [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
   "USEVSSCOPYBACKUP"="TRUE"
   ```

- **VM status is reported incorrectly because the VM is shut down in RDP**. If you used the remote desktop to shut down the virtual machine, verify that the VM status in the portal is correct. If the status isn't correct, use the **Shutdown** option in the portal VM dashboard to shut down the VM.
- **If more than four VMs share the same cloud service, spread the VMs across multiple backup policies**. Stagger the backup times, so no more than four VM backups start at the same time. Try to separate the start times in the policies by at least an hour.
- **The VM runs at high CPU or memory**. If the virtual machine runs at high memory or CPU usage, more than 90 percent, your snapshot task is queued and delayed. Eventually it times out. If this issue happens, try an on-demand backup.

## Networking
Like all extensions, Backup extensions need access to the public internet to work. Not having access to the public internet can manifest itself in various ways:

* Extension installation can fail.
* Backup operations like disk snapshot can fail.
* Displaying the status of the backup operation can fail.

The need to resolve public internet addresses is discussed in [this Azure Support blog](https://blogs.msdn.com/b/mast/archive/2014/06/18/azure-vm-provisioning-stuck-on-quot-installing-extensions-on-virtual-machine-quot.aspx). Check the DNS configurations for the VNET and make sure the Azure URIs can be resolved.

After name resolution is done correctly, access to the Azure IPs also needs to be provided. To unblock access to the Azure infrastructure, follow one of these steps:

- Whitelist the Azure datacenter IP ranges:
   1. Get the list of [Azure datacenter IPs](https://www.microsoft.com/download/details.aspx?id=41653) to be whitelisted.
   1. Unblock the IPs by using the [New-NetRoute](https://docs.microsoft.com/powershell/module/nettcpip/new-netroute) cmdlet. Run this cmdlet within the Azure VM, in an elevated PowerShell window. Run as an Administrator.
   1. Add rules to the NSG, if you have one in place, to allow access to the IPs.
- Create a path for HTTP traffic to flow:
   1. If you have some network restriction in place, deploy an HTTP proxy server to route the traffic. An example is a network security group. See the steps to deploy an HTTP proxy server in [Establish network connectivity](backup-azure-arm-vms-prepare.md#establish-network-connectivity).
   1. Add rules to the NSG, if you have one in place, to allow access to the internet from the HTTP proxy.

> [!NOTE]
> DHCP must be enabled inside the guest for IaaS VM backup to work. If you need a static private IP, configure it through the Azure portal or PowerShell. Make sure the DHCP option inside the VM is enabled.
> Get more information on how to set up a static IP through PowerShell:
> - [How to add a static internal IP to an existing VM](../virtual-network/virtual-networks-reserved-private-ip.md#how-to-add-a-static-internal-ip-to-an-existing-vm)
> - [Change the allocation method for a private IP address assigned to a network interface](../virtual-network/virtual-networks-static-private-ip-arm-ps.md#change-the-allocation-method-for-a-private-ip-address-assigned-to-a-network-interface)
>
>
