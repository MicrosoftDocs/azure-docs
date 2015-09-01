<properties
	pageTitle="Azure virtual machine backup - Troubleshooting | Microsoft Azure"
	description="Find information to troubleshoot backup and restore of Azure virtual machine"
	services="backup"
	documentationCenter=""
	authors="aashishr"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/20/2015"
	ms.author="aashishr"/>


# Troubleshooting errors
You can troubleshoot errors encountered while using Azure Backup with information listed in the table below.

## Discovery

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Discovery | Failed to discover new items - Microsoft Azure Backup encountered and internal error. Wait for a few minutes and then try the operation again. | Retry the discovery process after 15 minutes.
| Discovery | Failed to discover new items – Another Discovery operation is already in progress. Please wait until the current Discovery operation has completed. | None |

## Register
| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Register | Azure VM role is not in a state to install extension – Please check if the VM is in the Running state. Azure Recovery Services extension requires the VM to be Running. | Start the virtual machine and when it is in the Running state, retry the register operation.|
| Register | Number of data disks attached to the virtual machine exceeded the supported limit - Please detach some data disks on this virtual machine and retry the operation. Azure backup supports up to 5 data disks attached to an Azure virtual machine for backup | None |
| Register | Microsoft Azure Backup encountered an internal error - Wait for a few minutes and then try the operation again. If the issue persists, contact Microsoft Support. | You can get this error due to one of the following unsupported configurations: <ol><li>Premium LRS <li>Multi NIC <li>Load balancer </ol> |
| Register | VM Guest Agent Certificate not found | Follow these instructions to resolve the error: <ol><li>Download the latest version of the VM Agent from [here](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). Ensure that the version of the downloaded agent is 2.6.1198.718 or higher. <li>Install the VM Agent in the virtual machine.</ol> [Learn](#validating-vm-agent-installation) how to check  the version of the VM Agent. |
| Register | Registration failed with Install Agent operation timeout | Check if the OS version of the virtual machine is supported. |
| Register | Command execution failed - Another operation is in progress on this item. Please wait until the previous operation is completed | None |

## Backup

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Backup | Copying VHDs from backup vault timed out - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support. | This happens when there is too much data to be copied. Please check if you have less than 6 data disks. |
| Backup | Snapshot VM sub task timed out - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support | This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. <ul><li>Learn about [debugging VM Agent issues](#Troubleshooting-vm-agent-related-issues) <li>Learn about [debugging networking issues](#troubleshooting-networking-issues) </ul> |
| Backup | Backup failed with an internal error - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support | You can get this error for 2 reasons: <ol><li> There is too much data to be copied. Please check if you have less than 6 disks. <li>The original VM has been deleted and therefore backup cannot be taken. In order to keep the backup data for a deleted VM but stop the backup errors, Unprotect the VM and choose the option to keep the data. This will stop the backup schedule and also the recurring error messages. |
| Backup | Failed to install the Azure Recovery Services extension on the selected item - VM Agent is a pre-requisite for Azure Recovery Services Extension. Please install the Azure VM agent and restart the registration operation | <ol> <li>Check if the VM agent has been installed correctly. <li>Ensure that the flag on the VM config is set correctly.</ol> [Read more](#validating-vm-agent-installation) about VM agent installation, and how to validate the VM agent installation. |
| Backup | Command execution failed - Another operation is currently in progress on this item. Please wait until the previous operation is completed, and then retry | An existing backup or restore job for the VM is running, and a new job cannot be started while the existing job is running. <br><br>If you would like the option to cancel an ongoing job, add your vote to the [Azure Feedback forum](http://feedback.azure.com/forums/258995-azure-backup-and-scdpm/suggestions/7941501-add-feature-to-allow-cancellation-of-backup-restor). |

### VM Agent

#### Setting up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly. Read more about [installing the VM agent on an existing VM](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx).

For Windows VMs:

- Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation.
- [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.


#### Updating the VM Agent
Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). However, you need to ensure that no backup operation is running while the VM Agent is being updated.


#### Validating VM Agent installation
How to check for the VM Agent version on Windows VMs:

1. Log on to the Azure virtual machine and navigate to the folder *C:\WindowsAzure\Packages*. You should find the WaAppAgent.exe file present.
2. Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher

### Networking
Like all extensions, Backup extension need access to the public internet to work. Not having access to the public internet can manifest itself in a variety of of ways:

- The extension installation can fail
- The backup operations (like disk snapshot) can fail
- Displaying the status of the backup operation can fail

The need for resolving public internet addresses has been articulated [here](http://blogs.msdn.com/b/mast/archive/2014/06/18/azure-vm-provisioning-stuck-on-quot-installing-extensions-on-virtual-machine-quot.aspx). You will need to check the DNS configurations for the VNET and ensure that the Azure URIs can be resolved.

Once the name resolution is done correctly, access to the Azure IPs also needs to be provided. To unblock access to the Azure infrastructure, follow these steps:

1. Get the list of [Azure datacenter IPs](https://msdn.microsoft.com/library/azure/dn175718.aspx) to be whitelisted.
2. Unblock the IPs using the [New-NetRoute](https://technet.microsoft.com/library/hh826148.aspx) commandlet. Run this commandlet within the Azure VM, in an elevated PowerShell window (run as Administrator).
