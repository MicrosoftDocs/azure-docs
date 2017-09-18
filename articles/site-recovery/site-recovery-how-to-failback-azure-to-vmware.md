---
title: How to fail back from Azure to VMware | Microsoft Docs
description: After failover of virtual machines to Azure, you can initiate a failback to bring virtual machines back to on-premises. Learn the steps for how to fail back.
services: site-recovery
documentationcenter: ''
author: ruturaj
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: ruturajd

---
# Fail back from Azure to an on-premises site

This article describes how to fail back virtual machines from Azure Virtual Machines to the on-premises site. Follow the instructions in this article to fail back your VMware virtual machines or Windows/Linux physical servers after they've failed over from the on-premises site to Azure by using the [Replicate VMware virtual machines and physical servers to Azure with Azure Site Recovery](site-recovery-vmware-to-azure-classic.md) tutorial.

> [!WARNING]
> If you have [completed migration](site-recovery-migrate-to-azure.md#what-do-we-mean-by-migration), moved the virtual machine to another resource group, or deleted the Azure virtual machine, you cannot failback after that.

> [!NOTE]
> If you have failed over VMware virtual machines then you cannot failback to a Hyper-v host.

## Overview of failback
Here is how failback works. After you have failed over to Azure, you fail back to your on-premises site in a few stages:

1. [Reprotect](site-recovery-how-to-reprotect.md) the virtual machines on Azure so that they start to replicate to VMware virtual machines in your on-premises site. As part of this process, you also need to:
	1. Set up an on-premises master target: Windows master target for Windows virtual machines and [Linux master target](site-recovery-how-to-install-linux-master-target.md) for Linux virtual machines.
	2. Set up a [process server](site-recovery-vmware-setup-azure-ps-resource-manager.md).
	3. Initiate [reprotect](site-recovery-how-to-reprotect.md). This will turn off the on-premises virtual machine and synchronize the Azure virtual machine's data with the on-premises disks.
5. After your virtual machines on Azure are replicating to your on-premises site, you initiate a fail over from Azure to the on-premises site.

After your data has failed back, you reprotect the on-premises virtual machines that you failed back to, so that they start to replicate to Azure.

For a quick overview, watch the following video about how to fail over from Azure to an on-premises site.
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]

### Fail back to the original or alternate location

If you failed over a VMware virtual machine, you can fail back to the same source on-premises virtual machine if it still exists. In this scenario, only the changes are replicated back. This scenario is known as original location recovery. If the on-premises virtual machine does not exist, the scenario is an alternate location recovery.

> [!NOTE]
> You can only failback to the original vCenter and configuration server. You cannot deploy a new configuration server and failback using it. Also, you cannot add a new vCenter to the exiting configuration server and failback into the new vCenter.

#### Original location recovery

If you fail back to the original virtual machine, the following conditions are required:
* If the virtual machine is managed by a vCenter server, then the master target's ESX host should have access to the virtual machine's datastore.
* If the virtual machine is on an ESX host but isn’t managed by vCenter, then the hard disk of the virtual machine must be in a datastore that the master target's host can access.
* If your virtual machine is on an ESX host and doesn't use vCenter, then you should complete discovery of the ESX host of the master target before you reprotect. This applies if you're failing back physical servers, too.
* You can fail back to a virtual storage area network (vSAN) or a disk that based on raw device mapping (RDM) if the disks already exist and are connected to the on-premises virtual machine.

#### Alternate location recovery
If the on-premises virtual machine does not exist before reprotecting the virtual machine, the scenario is called an alternate location recovery. The reprotect workflow creates the on-premises virtual machine again. This will also cause a full data download.

* When you fail back to an alternate location, the virtual machine will be recovered to the same ESX host on which the master target server is deployed. The datastore that's used to create the disk will be the same datastore that was selected when reprotecting the virtual machine.
* You can fail back only to a virtual machine file system (VMFS) datastore. If you have a vSAN or RDM, reprotect and failback will not work.
* Reprotect involves one large initial data transfer that's followed by the changes. This process exists because the virtual machine does not exist on premises. The complete data needs to be replicated back. This reprotect will also take more time than an original location recovery.
* You cannot fail back to vSAN- or RDM-based disks. Only new virtual machine disks (VMDKs) can be created on a VMFS datastore.

A physical machine, when failed over to Azure, can be failed back only as a VMware virtual machine (also referred to as P2A2V). This flow falls under the alternate location recovery.

* A Windows Server 2008 R2 SP1 physical server, if protected and failed over to Azure, cannot be failed back.
* Ensure that you discover at least one master target server and the necessary ESX/ESXi hosts to which you need to fail back.

## Have you completed reprotection?
Before you proceed, complete the reprotect steps so that the virtual machines are in a replicated state, and you can initiate a failover back to an on-premises site. For more information, see [How to reprotect from Azure to on-premises](site-recovery-how-to-reprotect.md).

## Prerequisites

* A configuration server is required on premises when you do a failback. During failback, the virtual machine must exist in the configuration server database, or failback won't succeed. Thus, ensure that you take regularly scheduled backups of your server. If there was a disaster, you will need to restore the server with the same IP address for failback to work.
* The master target server should not have any snapshots before triggering failback.

## Steps to fail back

> [!IMPORTANT]
> Before you initiate failback, ensure that you have completed reprotection of the virtual machines. The virtual machines should be in a protected state, and their health should be **OK**. To reprotect the virtual machines, read [how to reprotect](site-recovery-how-to-reprotect.md).

1. In the replicated items page, select the virtual machine, and right-click it to select **Unplanned Failover**.
2. In **Confirm Failover**, verify the failover direction (from Azure), and then select the recovery point (latest, or the latest app consistent) that you want to use for the failover. The app consistent point is behind the latest point in time and causes some data loss.
3. During failover, Site Recovery shuts down the virtual machines on Azure. After you check that failback has completed as expected, you can check that the virtual machines on Azure have been shut down.

### To what recovery point can I fail back the virtual machines?

During failback, you have two options to fail back the virtual machine/recovery plan.

If you select the latest processed point in time, all virtual machines will be failed over to their latest available point in time. In case there is a replication group within the recovery plan, then each virtual machine of the replication group will fail over to its independent latest point in time.

You cannot fail back a virtual machine until it has at least one recovery point. You cannot fail back a recovery plan until all its virtual machines have at least one recovery point.

> [!NOTE]
> A latest recovery point is a crash-consistent recovery point.

If you select the application consistent recovery point, a single virtual machine failback will recover to its latest available application-consistent recovery point. In the case of a recovery plan with a replication group, each replication group will recover to its common available recovery point.
Note that application-consistent recovery points can be behind in time, and there might be loss in data.

### What happens to VMware tools post failback?

During failover to Azure, the VMware tools cannot be running on the Azure virtual machine. In case of a Windows virtual machine, ASR disables the VMware tools during failover. In case of Linux virtual machine, ASR uninstalls the VMware tools during failover.

During failback of the Windows virtual machine, the VMware tools are re-enabled upon failback. Similarly, for a linux virtual machine, the VMware tools are reinstalled on the machine during failback.

## Next steps

After failback finishes, you need to commit the virtual machine to ensure that recovered virtual machines in Azure are deleted.

### Commit
Commit is required to remove the failed over virtual machine from Azure.
Right-click the protected item, and then click **Commit**. A job will remove the failed over virtual machines in Azure.

### Reprotect from on-premises to Azure

After commit finishes, your virtual machine is back on the on-premises site, but it won’t be protected. To start to replicate to Azure again, do the following:

1. In **Vault** > **Setting** > **Replicated items**, select the virtual machines that have failed back, and then click **Re-Protect**.
2. Give the value of the process server that needs to be used to send data back to Azure.
3. Click **OK** to begin the reprotect job.

> [!NOTE]
> After an on-premises virtual machine boots up, it takes some time for the agent to register back to the configuration server (up to 15 minutes). During this time, reprotect fails and returns an error message stating that the agent is not installed. Wait for a few minutes, and then try reprotect again.

After the reprotect job finishes, the virtual machine is replicating back to Azure, and you can do a failover.

## Common issues
Make sure that the vCenter is in a connected state before you do a failback. Otherwise, disconnecting disks and attaching them back to the virtual machine will fail.
