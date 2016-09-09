<properties
	pageTitle="Troubleshoot Azure virtual machine backup | Microsoft Azure"
	description="Troubleshoot backup and restore of Azure virtual machines"
	services="backup"
	documentationCenter=""
	authors="trinadhk"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/10/2016"
	ms.author="trinadhk;jimpark;"/>


# Troubleshoot Azure virtual machine backup

> [AZURE.SELECTOR]
- [Recovery services vault](backup-azure-vms-troubleshoot.md)
- [Backup vault](backup-azure-vms-troubleshoot-classic.md)

You can troubleshoot errors encountered while using Azure Backup with information listed in the table below.

## Discovery

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Discovery | Failed to discover new items - Microsoft Azure Backup encountered and internal error. Wait for a few minutes and then try the operation again. | Retry the discovery process after 15 minutes.
| Discovery | Failed to discover new items – Another Discovery operation is already in progress. Please wait until the current Discovery operation has completed. | None |

## Register
| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Register | Number of data disks attached to the virtual machine exceeded the supported limit - Please detach some data disks on this virtual machine and retry the operation. Azure backup supports up to 16 data disks attached to an Azure virtual machine for backup | None |
| Register | Microsoft Azure Backup encountered an internal error - Wait for a few minutes and then try the operation again. If the issue persists, contact Microsoft Support. | You can get this error due to one of the following unsupported configuration: <ul><li>Premium LRS </ul> Premium storage VMs can be backed up using recovery services vault. [Learn More](backup-introduction-to-azure-backup.md/#back-up-and-restore-premium-storage-vms) |
| Register | Registration failed with Install Agent operation timeout | Check if the OS version of the virtual machine is supported. |
| Register | Command execution failed - Another operation is in progress on this item. Please wait until the previous operation is completed | None |
| Register | Virtual machines having virtual hard disks stored on Premium storage are not supported for backup | None |
| Register | Virtual machine agent is not present on the virtual machine - Please install the required pre-requisite, VM agent and restart the operation. | [Read more](#vm-agent) about VM agent installation, and how to validate the VM agent installation. |

## Backup

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Backup | Could not communicate with the VM agent for snapshot status. Snapshot VM sub task timed out. - Please see the troubleshooting guide on how to resolve this. | This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. Learn more about [debugging up VM snapshot issues](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md). <br> If the VM agent is not causing any issues, then restart the VM. At times an incorrect VM state can cause issues and restarting the VM resets this "bad state" |
| Backup | Backup failed with an internal error - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support | Please check if there is a transient issue in accessing VM storage. Please check [Azure Status](https://azure.microsoft.com/en-us/status/) to see if there is any on-going issue related to compute/storage/network in the region. Please retry the backup post issue is mitigated. |
| Backup | Could not perform the operation as VM no longer exists. | Backup cannot be performed as the Vm configured for backup has been deleted. Please stop further backups by going to Backup Item view(Settings > Backup Items > Click on Item Name) and clicking on Stop Backup. You can retain data by selecting Retain Backup data option. You can later resume protection for this virtual machine by clicking on Resume Backup.|
| Backup | Failed to install the Azure Recovery Services extension on the selected item - VM Agent is a pre-requisite for Azure Recovery Services Extension. Please install the Azure VM agent and restart the registration operation | <ol> <li>Check if the VM agent has been installed correctly. <li>Ensure that the flag on the VM config is set correctly.</ol> [Read more](#validating-vm-agent-installation) about VM agent installation, and how to validate the VM agent installation. |
| Backup | Command execution failed - Another operation is currently in progress on this item. Please wait until the previous operation is completed, and then retry | An existing backup or restore job for the VM is running, and a new job cannot be started while the existing job is running. |
| Backup | Extension installation failed with the error "COM+ was unable to talk to the Microsoft Distributed Transaction Coordinator | This usually means that the COM+ service is not running. Contact Microsoft support for help on fixing this issue. |
| Backup | Snapshot operation failed with the VSS operation error "This drive is locked by BitLocker Drive Encryption. You must unlock this drive from Control Panel. | Turn off BitLocker for all drives on the VM and observe if the VSS issue is resolved |
| Backup | Virtual machines having virtual hard disks stored on Premium storage are not supported for backup | None |
| Backup | Azure Virtual Machine Not Found. | This happens when the primary VM is deleted but the backup policy continues to look for a VM to perform backup. To fix this error: <ol><li>Recreate the virtual machine with the same name and same resource group name [cloud service name], <br>(OR) <li> Disable protection for this VM so that backup jobs will not be created </ol> |
| Backup | Virtual machine agent is not present on the virtual machine - Please install the required pre-requisite, VM agent and restart the operation. | [Read more](#vm-agent) about VM agent installation, and how to validate the VM agent installation. |

## Jobs
| Operation | Error details | Workaround |
| -------- | -------- | -------|
| Cancel job | Cancellation is not supported for this job type - Please wait until the job completes. | None |
| Cancel job | The job is not in a cancellable state - Please wait until the job completes. <br>OR<br> The selected job is not in a cancellable state - Please wait for the job to complete.| In all likelihood the job is almost completed; please wait until the job completes |
| Cancel job | Cannot cancel the job because it is not in progress - Cancellation is only supported for jobs which are in progress. Please attempt cancel on an in progress job. | This happens due to a transitory state. Wait for a minute and retry the cancel operation |
| Cancel job | Failed to cancel the Job - Please wait till job finishes. | None |


## Restore
| Operation | Error details | Workaround |
| -------- | -------- | -------|
| Restore | Restore failed with Cloud Internal error | <ol><li>Cloud service to which you are trying to restore is configured with DNS settings. You can check <br>$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production" 	Get-AzureDns -DnsSettings $deployment.DnsSettings<br>If there is Address configured, this means that DNS settings are configured.<br> <li>Cloud service to which to you are trying to restore is configured with ReservedIP and existing VMs in cloud service are in stopped state.<br>You can check a cloud service has reserved IP by using following powershell cmdlets:<br>$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName <br><li>You are trying to restore a virtual machine with following special network configurations in to same cloud service. <br>- Virtual machines under load balancer configuration ( Internal adn external)<br>- Virtual machines with multiple Reserved IPs<br>- Virtual machines with multiple NICs<br>Please select a new cloud service in the UI or please refer to [restore considerations](./backup-azure-restore-vms.md/#restoring-vms-with-special-network-configurations) for VMs with special network configurations</ol> |
| Restore | The selected DNS name is already taken - Please specify a different DNS name and try again. | The DNS name here refers to the cloud service name (usually ending with .cloudapp.net). This needs to be unique. If you encounter this error, you need to choose a different VM name during restore. <br><br> Note that this error is shown only to users of the Azure portal. The restore operation through PowerShell will succeed because it only restores the disks and doesn't create the VM. The error will be faced when the VM is explicitly created by you after the disk restore operation. |
| Restore | The specified virtual network configuration is not correct - Please specify a different virtual network configuration and try again. | None |
| Restore | The specified cloud service is using a reserved IP, which doesn't match with the configuration of the virtual machine being restored - Please specify a different cloud service which is not using reserved IP, or choose another recovery point to restore from. | None |
| Restore | Cloud service has reached limit on number of input end points - Retry the operation by specifying a different cloud service or by using an existing endpoint. | None |
| Restore | Backup vault and target storage account are in two different regions - Ensure that the storage account specified in restore operation is in the same Azure region as the backup vault. | None |
| Restore | Storage Account specified for the restore operation is not supported - Only Basic/Standard storage accounts with locally redundant or geo redundant replication settings are supported. Please select a supported storage account | None |
| Restore | Type of Storage Account specified for restore operation is not online - Make sure that the storage account specified in restore operation is online | This might happen because of a transient error in Azure Storage or due to an outage. Please choose another storage account. |
| Restore | Resource Group Quota has been reached - Please delete some resource groups from Azure portal or contact Azure support to increase the limits. | None |
| Restore | Selected subnet does not exist - Please select a subnet which exists | None |


## Policy
| Operation | Error details | Workaround |
| -------- | -------- | -------|
| Create policy | Failed to create the policy - Please reduce the retention choices to continue with policy configuration. | None |


## VM Agent

### Setting up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly. Read more about [installing the VM agent on an existing VM](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx).

For Windows VMs:

- Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation.
- [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.

For Linux VMs:

- Install latest [Linux agent](https://github.com/Azure/WALinuxAgent) from github.
- [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.


### Updating the VM Agent
For Windows VMs:

- Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). However, you need to ensure that no backup operation is running while the VM Agent is being updated.

For Linux VMs:

- Follow the instructions on [Updating Linux VM Agent ](../virtual-machines/virtual-machines-linux-update-agent.md).


### Validating VM Agent installation
How to check for the VM Agent version on Windows VMs:

1. Log on to the Azure virtual machine and navigate to the folder *C:\WindowsAzure\Packages*. You should find the WaAppAgent.exe file present.
2. Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher





