---
title: 'Troubleshoot Azure Backup failure: Guest Agent Status Unavailable'
description: 'Symptoms, causes, and resolutions of Azure Backup failures related to agent, extension, and disks.'
services: backup
author: genlin
manager: cshepard
keywords: Azure backup; VM agent; Network connectivity;
ms.service: backup
ms.topic: troubleshooting
ms.date: 12/03/2018
ms.author: genli
---

# Troubleshoot Azure Backup failure: Issues with the agent or extension

This article provides troubleshooting steps that can help you resolve Azure Backup errors related to communication with the VM agent and extension.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## <a name="UserErrorGuestAgentStatusUnavailable-vm-agent-unable-to-communicate-with-azure-backup"></a>UserErrorGuestAgentStatusUnavailable - VM agent unable to communicate with Azure Backup

**Error code**: UserErrorGuestAgentStatusUnavailable <br>
**Error message**: VM Agent unable to communicate with Azure Backup<br>

After you register and schedule a VM for the Backup service, Backup initiates the job by communicating with the VM agent to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. When a snapshot isn't triggered, the backup might fail. Complete the following troubleshooting steps in the order listed, and then retry your operation:<br>
**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**    
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
**Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**    
**Cause 4: [The backup extension fails to update or load](#the-backup-extension-fails-to-update-or-load)**  
**Cause 5: [The VM doesn't have internet access](#the-vm-has-no-internet-access)**

## GuestAgentSnapshotTaskStatusError - Could not communicate with the VM agent for snapshot status

**Error code**: GuestAgentSnapshotTaskStatusError<br>
**Error message**: Could not communicate with the VM agent for snapshot status <br>

After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  
**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
**Cause 3: [The VM doesn't have internet access](#the-vm-has-no-internet-access)**

## UserErrorRpCollectionLimitReached - The Restore Point collection max limit has reached

**Error code**: UserErrorRpCollectionLimitReached <br>
**Error message**: The Restore Point collection max limit has reached. <br>
* This issue could happen if there is a lock on the recovery point resource group preventing automatic cleanup of recovery point.
* This issue can also happen if multiple backups are triggered per day. Currently we recommend only one backup per day as the instant RPs are retained for 7 days and only 18 instant RPs can be associated with a VM at any given time. <br>

Recommended Action:<br>
To resolve this issue, remove the lock on the resource group and retry the operation to trigger clean-up.

> [!NOTE]
	> Backup service creates a separate resource group than the resource group of the VM to store restore point collection. Customers are advised not to lock the resource group created for use by the Backup service. The naming format of the resource group created by Backup service is: AzureBackupRG_`<Geo>`_`<number>` Eg: AzureBackupRG_northeurope_1

**Step 1: [Remove lock from the restore point resource group](#remove_lock_from_the_recovery_point_resource_group)** <br>
**Step 2: [Clean up restore point collection](#clean_up_restore_point_collection)**<br>

## UserErrorKeyvaultPermissionsNotConfigured - Backup doesn't have sufficient permissions to the key vault for backup of encrypted VMs.

**Error code**: UserErrorKeyvaultPermissionsNotConfigured <br>
**Error message**: Backup doesn't have sufficient permissions to the key vault for backup of encrypted VMs. <br>

For backup operation to succeed on encrypted VMs, it must have permissions to access the key vault. This can be done using the [Azure portal](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption#provide-permissions-to-backup) or through the [PowerShell](https://docs.microsoft.com/azure/backup/backup-azure-vms-automation#enable-protection)

## <a name="ExtensionSnapshotFailedNoNetwork-snapshot-operation-failed-due-to-no-network-connectivity-on-the-virtual-machine"></a>ExtensionSnapshotFailedNoNetwork - Snapshot operation failed due to no network connectivity on the virtual machine

**Error code**: ExtensionSnapshotFailedNoNetwork<br>
**Error message**: Snapshot operation failed due to no network connectivity on the virtual machine<br>

After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:    
**Cause 1: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  
**Cause 2: [The backup extension fails to update or load](#the-backup-extension-fails-to-update-or-load)**  
**Cause 3: [The VM doesn't have internet access](#the-vm-has-no-internet-access)**

## <a name="ExtentionOperationFailed-vmsnapshot-extension-operation-failed"></a>ExtentionOperationFailedForManagedDisks - VMSnapshot extension operation failed

**Error code**: ExtentionOperationFailedForManagedDisks <br>
**Error message**: VMSnapshot extension operation failed<br>

After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  
**Cause 1: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  
**Cause 2: [The backup extension fails to update or load](#the-backup-extension-fails-to-update-or-load)**  
**Cause 3: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  
**Cause 4: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**

## BackUpOperationFailed / BackUpOperationFailedV2 - Backup fails, with an internal error

**Error code**: BackUpOperationFailed / BackUpOperationFailedV2 <br>
**Error message**: Backup failed with an internal error - Please retry the operation in a few minutes <br>

After you register and schedule a VM for the Azure Backup service, Backup initiates the job by communicating with the VM backup extension to take a point-in-time snapshot. Any of the following conditions might prevent the snapshot from being triggered. If the snapshot isn't triggered, a backup failure might occur. Complete the following troubleshooting steps in the order listed, and then retry your operation:  
**Cause 1: [The agent installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**  
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
**Cause 3: [The snapshot status can't be retrieved, or a snapshot can't be taken](#the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken)**  
**Cause 4: [The backup extension fails to update or load](#the-backup-extension-fails-to-update-or-load)**  
**Cause 5: [Backup service doesn't have permission to delete the old restore points because of a resource group lock](#backup-service-does-not-have-permission-to-delete-the-old-restore-points-due-to-resource-group-lock)** <br>
**Cause 6: [The VM doesn't have internet access](#the-vm-has-no-internet-access)**

## UserErrorUnsupportedDiskSize - Currently Azure Backup does not support disk sizes greater than 1023GB

**Error code**: UserErrorUnsupportedDiskSize <br>
**Error message**: Currently Azure Backup does not support disk sizes greater than 1023GB <br>

Your backup operation could fail when backing up VM with disk size greater than 1023GB since your vault is not upgraded to Azure VM Backup stack V2. Upgrading to Azure VM Backup stack V2 will provide support up to 4TB. Review these [benefits](backup-upgrade-to-vm-backup-stack-v2.md), [considerations](backup-upgrade-to-vm-backup-stack-v2.md#considerations-before-upgrade), and then proceed to upgrade by following these [instructions](backup-upgrade-to-vm-backup-stack-v2.md#upgrade).  

## UserErrorStandardSSDNotSupported - Currently Azure Backup does not support Standard SSD disks

**Error code**: UserErrorStandardSSDNotSupported <br>
**Error message**: Currently Azure Backup does not support Standard SSD disks <br>

Currently Azure Backup supports Standard SSD disks only for vaults that are upgraded to Azure VM Backup stack V2. Review these [benefits](backup-upgrade-to-vm-backup-stack-v2.md), [considerations](backup-upgrade-to-vm-backup-stack-v2.md#considerations-before-upgrade), and then proceed to upgrade by following these [instructions](backup-upgrade-to-vm-backup-stack-v2.md#upgrade).


## Causes and solutions

### <a name="the-vm-has-no-internet-access"></a>The VM doesn't have internet access
Per the deployment requirement, the VM doesn't have internet access. Or, it might have restrictions that prevent access to the Azure infrastructure.

To function correctly, the Backup extension requires connectivity to Azure public IP addresses. The extension sends commands to an Azure storage endpoint (HTTPs URL) to manage the snapshots of the VM. If the extension doesn't have access to the public internet, backup eventually fails.

It is possible to deploy a proxy server to route the VM traffic.
##### Create a path for HTTPs traffic

1. If you have network restrictions in place (for example, a network security group), deploy an HTTPs proxy server to route the traffic.
2. To allow access to the internet from the HTTPs proxy server, add rules to the network security group, if you have one.

To learn how to set up an HTTPs proxy for VM backups, see [Prepare your environment to back up Azure virtual machines](backup-azure-arm-vms-prepare.md#establish-network-connectivity).

Either the backed up VM or the proxy server through which the traffic is routed requires access to Azure Public IP addresses

####  Solution
To resolve the issue, try one of the following methods:

##### Allow access to Azure storage that corresponds to the region

You can use [service tags](../virtual-network/security-overview.md#service-tags) to allow connections to storage of the specific region. Ensure that the rule that allows access to the storage account has higher priority than the rule that blocks internet access.

![Network security group with storage tags for a region](./media/backup-azure-arm-vms-prepare/storage-tags-with-nsg.png)

To understand the step by step procedure to configure service tags, watch [this video](https://youtu.be/1EjLQtbKm1M).

> [!WARNING]
> Storage service tags are in preview. They are available only in specific regions. For a list of regions, see [Service tags for storage](../virtual-network/security-overview.md#service-tags).

If you use Azure Managed Disks, you might need an additional port opening (port 8443) on the firewalls.

Furthermore, if your subnet doesn't have a route for internet outbound traffic, you need to add a service endpoint with service tag "Microsoft.Storage" to your subnet.

### <a name="the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms"></a>The agent is installed in the VM, but it's unresponsive (for Windows VMs)

#### Solution
The VM agent might have been corrupted, or the service might have been stopped. Reinstalling the VM agent helps get the latest version. It also helps restart communication with the service.

1. Determine whether the Windows Azure Guest Agent service is running in the VM services (services.msc). Try to restart the Windows Azure Guest Agent service and initiate the backup.    
2. If the Windows Azure Guest Agent service isn't visible in services, in Control Panel, go to **Programs and Features** to determine whether the Windows Azure Guest Agent service is installed.
4. If the Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Azure Guest Agent.
5. Download and install the [latest version of the agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You must have Administrator rights to complete the installation.
6. Verify that the Windows Azure Guest Agent services appear in services.
7. Run an on-demand backup:
	* In the portal, select **Backup Now**.

Also, verify that [Microsoft .NET 4.5 is installed](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) in the VM. .NET 4.5 is required for the VM agent to communicate with the service.

### The agent installed in the VM is out of date (for Linux VMs)

#### Solution
Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an outdated VM agent. To troubleshoot this issue, follow these general guidelines:

1. Follow the instructions for [updating the Linux VM agent](../virtual-machines/linux/update-agent.md).

 > [!NOTE]
 > We *strongly recommend* that you update the agent only through a distribution repository. We do not recommend downloading the agent code directly from GitHub and updating it. If the latest agent for your distribution is not available, contact distribution support for instructions on how to install it. To check for the most recent agent, go to the [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) page in the GitHub repository.

2. Ensure that the Azure agent is running on the VM by running the following command: `ps -e`

 If the process isn't running, restart it by using the following commands:

 * For Ubuntu: `service walinuxagent start`
 * For other distributions: `service waagent start`

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
4. Run a new test backup. If the failure persists, collect the following logs from the VM:

   * /var/lib/waagent/*.xml
   * /var/log/waagent.log
   * /var/log/azure/*

If we require verbose logging for waagent, follow these steps:

1. In the /etc/waagent.conf file, locate the following line: **Enable verbose logging (y|n)**
2. Change the **Logs.Verbose** value from *n* to *y*.
3. Save the change, and then restart waagent by completing the steps described earlier in this section.

###  <a name="the-snapshot-status-cannot-be-retrieved-or-a-snapshot-cannot-be-taken"></a>The snapshot status can't be retrieved, or a snapshot can't be taken
The VM backup relies on issuing a snapshot command to the underlying storage account. Backup can fail either because it has no access to the storage account, or because the execution of the snapshot task is delayed.

#### Solution
The following conditions might cause the snapshot task to fail:

| Cause | Solution |
| --- | --- |
| The VM status is reported incorrectly because the VM is shut down in Remote Desktop Protocol (RDP). | If you shut down the VM in RDP, check the portal to determine whether the VM status is correct. If it’s not correct, shut down the VM in the portal by using the **Shutdown** option on the VM dashboard. |
| The VM can't get the host or fabric address from DHCP. | DHCP must be enabled inside the guest for the IaaS VM backup to work. If the VM can't get the host or fabric address from DHCP response 245, it can't download or run any extensions. If you need a static private IP, you should configure it through the **Azure Portal** or **PowerShell** and make sure the DHCP option inside the VM is enabled. For more information, on how to setup a static IP through the PowerShell, see [Classic VM](../virtual-network/virtual-networks-reserved-private-ip.md#how-to-add-a-static-internal-ip-to-an-existing-vm) and [Resource Manager VM](../virtual-network/virtual-networks-static-private-ip-arm-ps.md#change-the-allocation-method-for-a-private-ip-address-assigned-to-a-network-interface).

### The backup extension fails to update or load
If extensions can't load, backup fails because a snapshot can't be taken.

#### Solution

Uninstall the extension to force the VMSnapshot extension to reload. The next backup attempt reloads the extension.

To uninstall the extension:

1. In the [Azure portal](https://portal.azure.com/), go to the VM that is experiencing backup failure.
2. Select **Settings**.
3. Select **Extensions**.
4. Select **Vmsnapshot Extension**.
5. Select **Uninstall**.

For Linux VM, If the VMSnapshot extension does not show in the Azure portal, [update the Azure Linux Agent](../virtual-machines/linux/update-agent.md), and then run the backup.

Completing these steps causes the extension to be reinstalled during the next backup.

### <a name="remove_lock_from_the_recovery_point_resource_group"></a>Remove lock from the recovery point resource group
1. Sign in to the [Azure portal](http://portal.azure.com/).
2. Go to **All Resources option**, select the restore point collection resource group in the following format AzureBackupRG_`<Geo>`_`<number>`.
3. In the **Settings** section, select **Locks** to display the locks.
4. To remove the lock, select the ellipsis and click **Delete**.

	![Delete lock ](./media/backup-azure-arm-vms-prepare/delete-lock.png)

### <a name="clean_up_restore_point_collection"></a> Clean up restore point collection
After removing the lock, the restore points have to be cleaned up. To clean up the restore points, follow any of the methods:<br>
* [Clean up restore point collection by running ad-hoc backup](#clean-up-restore-point-collection-by-running-ad-hoc-backup)<br>
* [Clean up restore point collection from Azure portal](#clean-up-restore-point-collection-from-azure-portal)<br>

#### <a name="clean-up-restore-point-collection-by-running-ad-hoc-backup"></a>Clean up restore point collection by running ad-hoc backup
After removing lock, trigger an ad-hoc/manual backup. This will ensure the restore points are automatically cleaned up. Expect this ad-hoc/manual operation to fail first time; however, it will ensure automatic cleanup instead of manual deletion of restore points. After cleanup your next scheduled backup should succeed.

> [!NOTE]
	> Automatic cleanup will happen after few hours of triggering the ad-hoc/manual backup. If your scheduled backup still fails, then try manually deleting the restore point collection using the steps listed [here](#clean-up-restore-point-collection-from-azure-portal).

#### <a name="clean-up-restore-point-collection-from-azure-portal"></a>Clean up restore point collection from Azure portal <br>

To manually clear the restore points collection which are not cleared due to the lock on the resource group, try the following steps:
1. Sign in to the [Azure portal](http://portal.azure.com/).
2. On the **Hub** menu, click **All resources**, select the Resource group with the following format AzureBackupRG_`<Geo>`_`<number>` where your VM is located.

	![Delete lock ](./media/backup-azure-arm-vms-prepare/resource-group.png)

3. Click Resource group, the **Overview** blade is displayed.
4. Select **Show hidden types** option to display all the hidden resources. Select the restore point collections with the following format AzureBackupRG_`<VMName>`_`<number>`.

	![Delete lock ](./media/backup-azure-arm-vms-prepare/restore-point-collection.png)

5. Click **Delete**, to clean the restore point collection.
6. Retry the backup operation again.
