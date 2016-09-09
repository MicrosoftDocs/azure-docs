<properties
   pageTitle="Azure VM Backup fails: Could not communicate with the VM agent for snapshot status - Snapshot VM sub task timed out | Microsoft Azure"
   description="Symptoms causes and resolutions for Azure VM backup failures related to could not communicate with the VM agent for snapshot status. Snapshot VM sub task timed out error"
   services="backup"
   documentationCenter=""
   authors="genlin"
   manager="jwhit"
   editor=""/>

<tags
    ms.service="backup"
    ms.workload="storage-backup-recovery"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/14/2016"
    ms.author="jimpark; markgal;genli"/>

# Azure VM Backup fails: Could not communicate with the VM agent for snapshot status - Snapshot VM sub task timed out

## Summary

After registering and scheduling a Virtual Machine (VM) for Azure Backup, the Azure Backup service initiates the backup job at the scheduled time by communicating with the backup extension in the VM to take a point-in-time snapshot. There are conditions that may prevent the snapshot from being triggered which leads to a backup failure. This article provides troubleshooting steps for issues related to Azure VM backup failures related to snapshot time out error.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Symptom

Microsoft Azure Backup for infrastructure as a service (IaaS) VM fails and returns the following error message in the job error details in Azure Portal.

**Could not communicate with the VM agent for snapshot status - Snapshot VM sub task timed out.**

## Cause
There are four common causes for this error:

- The VM does not have Internet access.
- The Microsoft Azure VM agent installed in the VM is out of date (for Linux VMs).
- The backup extension fails to update or load.
- The snapshots status cannot be retrieved or the snapshots cannot be taken.

## Cause 1: The VM does not have Internet access
Per the deployment requirement, the VM has no Internet access, or has restrictions in place that prevent access to the Azure infrastructure.

The backup extension requires connectivity to the Azure public IP addresses to function correctly. This is because it sends commands to an Azure Storage endpoint (HTTP URL) to manage the snapshots of the VM. If the extension does not have access to the public Internet, the backup eventually fails.

### Solution
In this scenario, use one of the following methods to resolve the issue:

- Whitelist the Azure datacenter IP ranges
- Create a path for HTTP traffic to flow

### To whitelist the Azure datacenter IP ranges

1. Obtain the [list of Azure datacenter IPs](https://www.microsoft.com/download/details.aspx?id=41653) to be whitelisted.
2. Unblock the IPs by using the New-NetRoute cmdlet. Run this cmdlet in the Azure VM in an elevated PowerShell window (run as Administrator).
3. Add rules to the Network Security Group (NSG) if you have one to allow access to the IPs.

### To create a path for HTTP traffic to flow

1. If you have network restrictions in place (for example, an NSG), deploy an HTTP proxy server to route the traffic.
2. If you have a network security group (NSG), add rules to allow access to the Internet from the HTTP proxy.

Learn how to [set up an HTTP proxy for VM backups](backup-azure-vms-prepare.md#using-an-http-proxy-for-vm-backups).

## Cause 2: The Microsoft Azure VM agent installed in the VM is out of date (for Linux VMs)

### Solution
Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an old VM agent. As a general guideline, the first steps to troubleshoot this issue are the following:

1. [Install the latest Azure VM agent](https://acom-swtest-2.azurewebsites.net/documentation/articles/virtual-machines-linux-update-agent/).
2. Make sure that the Azure agent is running on the VM. To do this, run the following command:     ```ps -e```

    If this process is not running, use the following commands to restart it.

    For Ubuntu:     ```service walinuxagent start```

    For other distributions:     ```service waagent start
```

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).

4. Run a new test backup. If the failures persist, please collect logs from the following folders for further debugging.

    We require the following logs from the customer’s VM:

    - /var/lib/waagent/*.xml
    - /var/log/waagent.log
    - /var/log/azure/*

If we require verbose logging for waagent, follow these steps to enable this:

1. In the /etc/waagent.conf file, locate the following line:

    Enable verbose logging (y|n)

2. Change the **Logs.Verbose** value from n to y.
3. Save the change, and then restart waagent by following the previous steps in this section.

## Cause 3: The backup extension fails to update or load
If extensions cannot be loaded, then Backup fails because a snapshot cannot be taken.

### Solution
For Windows guests:

1. Verify that the iaasvmprovider service is enabled and has a startup type of automatic.
2. If this is not the configuration, enable the service to determine whether the next backup succeeds.

For Linux guests:

The latest version of VMSnapshot Linux (extension used by backup) is 1.0.91.0

If the backup extension still fails to update or load, you can force the VMSnapshot extension to be reloaded by uninstalling the extension. The next backup attempt will reload the extension.

### To uninstall the extension

1. Go to the [Azure portal](https://portal.azure.com/).
2. Locate the particular VM that has backup problems.
3. Click **Settings**.
4. Click **Extensions**.
5. Click **Vmsnapshot Extension**.
6. Click **uninstall**.

This will cause the extension to be reinstalled during the next backup.

## Cause 4: The snapshots status cannot be retrieved or the snapshots cannot be taken
VM backup relies on issuing snapshot command to underlying storage. The backup can fail because it has no access to storage or because of a delay in snapshot task execution.

### Solution
The following conditions can cause snapshot task failure:

| Cause | Solution |
| ----- | ----- |
| VMs that have Microsoft SQL Server Backup configured. By default, VM Backup runs a VSS Full backup on Windows VMs. On VMs that are running SQL Server-based servers and on which SQL Server Backup is configured, snapshot execution delays may occur. | Set following registry key if you are experiencing backup failures because of snapshot issues.<br><br>[HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT] "USEVSSCOPYBACKUP"="TRUE" |
| VM status is reported incorrectly because the VM is shut down in RDP. If you shut down the virtual machine in RDP, check the portal to determine whether that VM status is reflected correctly. | If it’s not, shut down the VM in the portal by using the ”Shutdown” option in the VM dashboard. |
| Many VMs from the same cloud service are configured to back up at the same time. | It’s a best practice to spread out the VMs from the same cloud service to have different backup schedules. |
| The VM is running at high CPU or memory usage. | If the VM is running at high CPU usage (more than 90 percent) or high memory usage, the snapshot task is queued and delayed and eventually times out. In this situation, try on-demand backup. |
|The VM cannot get host/fabric address from DHCP.|DHCP must be enabled inside the guest for IaaS VM Backup to work.  If the VM cannot get host/fabric address from DHCP response 245, then it cannot download ir run any extensions. If you need a static private IP, you should configure it through the platform. The DHCP option inside the VM should be left enabled. View more information about [Setting a Static Internal Private IP](../virtual-network/virtual-networks-reserved-private-ip.md).|
