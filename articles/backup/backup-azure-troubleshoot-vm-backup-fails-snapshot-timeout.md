---
title: 'Troubleshoot Azure Backup failure: Guest Agent Status Unavailable | Microsoft Docs'
description: 'Symptoms, causes, and resolutions of Azure Backup failures related to error: Could not communicate with the VM agent'
services: backup
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
keywords: Azure backup; VM agent; Network connectivity; 

ms.assetid: 4b02ffa4-c48e-45f6-8363-73d536be4639
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: genli;markgal;
---

# Troubleshoot Azure Backup failure: VM Agent unable to communicate with Azure Backup
## Summary
After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of four conditions might prevent the snapshot from being triggered, which in turn can lead to Backup failure. This article provides troubleshooting steps to help you resolve Backup failures related to problems in communication with VM agent and extension.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Symptom
Azure Backup for an infrastructure as a service (IaaS) VM fails, returning the following error message in the job error details in the [Azure portal](https://portal.azure.com/): "VM agent is unable to communicate with the Azure Backup Service.", "Snapshot operation failed due to no network connectivity on the virtual machine."

## Cause 1: The VM has no Internet access
Per the deployment requirement, the VM has no Internet access, or it has restrictions in place that prevent access to the Azure infrastructure.

To function correctly, the backup extension requires connectivity to the Azure public IP addresses. The extension sends commands to an Azure Storage endpoint (HTTP URL) to manage the snapshots of the VM. If the extension has no access to the public Internet, Backup eventually fails.

### Solution
To resolve the issue, try one of the methods listed here.
#### Allow access to the Azure datacenter IP ranges

1. Obtain the [list of Azure datacenter IPs](https://www.microsoft.com/download/details.aspx?id=41653) to allow access to.
2. Unblock the IPs by running the **New-NetRoute** cmdlet in the Azure VM in an elevated PowerShell window. Run the cmdlet as an administrator.
3. To allow access to the IPs, add rules to the network security group, if you have one.

#### Create a path for HTTP traffic to flow

1. If you have network restrictions in place (for example, a network security group), deploy an HTTP proxy server to route the traffic.
2. To allow access to the Internet from the HTTP proxy server, add rules to the network security group, if you have one.

To learn how to set up an HTTP proxy for VM backups, see [Prepare your environment to back up Azure virtual machines](backup-azure-vms-prepare.md#using-an-http-proxy-for-vm-backups).

In case you are using Managed Disks, you may need an additional port (8443) opening up on the firewalls.

## Cause 2: The agent installed in the VM is out of date (for Linux VMs)

### Solution
Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an outdated VM agent. To troubleshoot this issue, follow these general guidelines:

1. Follow the instructions for [updating the Linux VM agent](../virtual-machines/linux/update-agent.md).

 >[!NOTE]
 >We *strongly recommend* that you update the agent only through a distribution repository. We do not recommend downloading the agent code directly from GitHub and updating it. If the latest agent is unavailable for your distribution, contact distribution support for instructions on how to install it. To check for the most recent agent, go to the [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) page in the GitHub repository.

2. Make sure that the Azure agent is running on the VM by running the following command: `ps -e`

 If the process is not running, restart it by using the following commands:

 * For Ubuntu: `service walinuxagent start`
 * For other distributions: `service waagent start`

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
4. Run a new test backup. If the failure persists, please collect the following logs from the customer’s VM:

   * /var/lib/waagent/*.xml
   * /var/log/waagent.log
   * /var/log/azure/*

If we require verbose logging for waagent, follow these steps:

1. In the /etc/waagent.conf file, locate the following line: **Enable verbose logging (y|n)**
2. Change the **Logs.Verbose** value from *n* to *y*.
3. Save the change, and then restart waagent by following the previous steps in this section.

## Cause 3: The agent installed in the VM but unresponsive (for Windows VMs)

### Solution
The VM Agent might have been corrupted or the service might have been stopped. Re-installing the VM agent would help get the latest version and restart the communication.

1. Verify whether you can view Windows Guest Agent service in services of the machine (services.msc)
2. if it is not visible there, verify in Programs and Features whether Windows Guest agent service is installed.
3. If you are able to view in programs and features uninstall the Windows Guest Agent.
4. Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need Administrator privileges to complete the installation.
5. Then you should be able to view Windows Guest Agent services in services
6. Try running an on-demand/adhoc backup by clicking "Backup Now" in the portal.

Also verify if you have **.NET 4.5 installed in the system**. It is required for the VM agent to communicate with the service

## Cause 4: The backup extension fails to update or load
If extensions cannot be loaded, Backup fails because a snapshot cannot be taken.

### Solution

For Windows guests:

Verify that the iaasvmprovider service is enabled and has a startup type of *automatic*. If the service is not configured in this way, enable it to determine whether the next backup succeeds.

For Linux guests:

The latest version of VMSnapshot for Linux (the extension used by Backup) is 1.0.91.0.

If the backup extension still fails to update or load, you can force the VMSnapshot extension to be reloaded by uninstalling the extension. The next backup attempt will reload the extension.

To uninstall the extension, do the following:

1. Go to the [Azure portal](https://portal.azure.com/).
2. Locate the VM that has backup problems.
3. Click **Settings**.
4. Click **Extensions**.
5. Click **Vmsnapshot Extension**.
6. Click **Uninstall**.  

This procedure causes the extension to be reinstalled during the next backup.

## Cause 5: The snapshot status cannot be retrieved or a snapshot cannot be taken
The VM backup relies on issuing a snapshot command to the underlying storage account. Backup can fail either because it has no access to the storage account or because the execution of the snapshot task is delayed.

### Solution
The following conditions can cause snapshot task failure:

| Cause | Solution |
| --- | --- |
| The VM has SQL Server backup configured. | By default, the VM backup runs a VSS full backup on Windows VMs. On VMs that are running SQL Server-based servers and on which SQL Server backup is configured, snapshot execution delays may occur.<br><br>If you are experiencing a Backup failure because of a snapshot issue, set the following registry key:<br><br>**[HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT] "USEVSSCOPYBACKUP"="TRUE"** |
| The VM status is reported incorrectly because the VM is shut down in RDP. | If you shut down the VM in Remote Desktop Protocol (RDP), check the portal to determine whether the VM status is correct. If it’s not correct, shut down the VM in the portal by using the **Shutdown** option on the VM dashboard. |
| Many VMs from the same cloud service are configured to back up at the same time. | It’s a best practice to spread out the backup schedules for VMs from the same cloud service. |
| The VM is running at high CPU or memory usage. | If the VM is running at high CPU usage (more than 90 percent) or high memory usage, the snapshot task is queued and delayed, and it eventually times out. In this situation, try an on-demand backup. |
| The VM cannot get the host/fabric address from DHCP. | DHCP must be enabled inside the guest for the IaaS VM backup to work.  If the VM cannot get the host/fabric address from DHCP response 245, it cannot download or run any extensions. If you need a static private IP, you should configure it through the platform. The DHCP option inside the VM should be left enabled. For more information, see [Setting a Static Internal Private IP](../virtual-network/virtual-networks-reserved-private-ip.md). |
