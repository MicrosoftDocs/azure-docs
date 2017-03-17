---
title: Replicate physical servers to Azure | Microsoft Docs
description: Describes how to deploy Azure Site Recovery to orchestrate replication, failover and recovery of on-premises Windows/Linux physical servers to Azure using the Azure portal
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid:
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/17/2017
ms.author: raynew

---
# Replicate applications
> [!div class="op_single_selector"]
> * [VMware Virtual Machines](./site-recovery-replicate-vmware-to-azure.md)
> * [Physical Servers](./site-recovery-replicate-physical-servers-to-azure.md)

This article describes how to replicate on-premises Windows/Linux physical servers to Azure, using Azure Site Recovery in the Azure portal.

## Prerequisites

The article assumes that you have already

1.  [Setup on-premise source environment](site-recovery-set-up-physical-to-azure.md)
2.  [Setup target environment in Azure](site-recovery-prepare-target-physical-to-azure.md)
3.  [Configure replication settings](./site-recovery-setup-replication-settings-vmware.md).


## Enable replication

Before you start:

- When you add or modify VMs, it can take up to 15 minutes or longer for changes to take effect, and for them to appear in the portal.
- You can check the last discovered time for VMs in **Configuration Servers** > **Last Contact At**.
- To add VMs without waiting for the scheduled discovery, highlight the configuration server (don’t click it), and click **Refresh**.
* If a VM is prepared for push installation, the process server automatically installs the Mobility service when you enable replication.


### Exclude disks from replication

By default all disks on a machine are replicated. You can exclude disks from replication. For example you might not want to replicate disks with temporary data, or data that's refreshed each time a machine or application restarts (for example pagefile.sys or SQL Server tempdb).

### Replicate machines

1. Click **Step 2: Replicate application** > **Source**.
2. In **Source**, select On-premises
3. In **Source-location**, select the configuration server name
4. In **Machine type**, select **Physical Machines**.
5. In **Process server** choose the Process server. If you haven't created any additional process servers this will be the configuration server. Then click **OK**.

    ![Enable replication](./media/site-recovery-physical-to-azure/chooseVM.png)

6. In **Target**, select the subscription and the resource group in which you want to create the failed over VMs. Choose the deployment model that you want to use in Azure (classic or resource management), for the failed over VMs.

7. Select the Azure storage account you want to use for replicating data. If you don't want to use an account you've already set up, you can create a new one.

8. Select the Azure network and subnet to which Azure VMs will connect, when they're created after failover. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. If you don't want to use an existing network, you can create one.

    ![Enable replication](./media/site-recovery-physical-to-azure/targetsettings.png)
9. In **Physical Machines**, Click the '+' button and enter **Name**, **IP address** and choose OS type of the machine you want to replicate.
  ![Enable replication](./media/site-recovery-physical-to-azure/machineselect.png)
You'd need to wait for a few minutes before the machines are discovered and shown in the list.

10. In **Properties** > **Configure properties**, select the account that will be used by the process server to automatically install the Mobility service on the machine.
11. By default all disks are replicated. Click **All Disks** and clear any disks you don't want to replicate. Then click **OK**. You can set additional VM properties later.

    ![Enable replication](./media/site-recovery-physical-to-azure/configprop.png)
11. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. If you modify a policy, changes will be applied to replicating machine, and to new machines.
12. Enable **Multi-VM consistency** if you want to gather machines into a replication group, and specify a name for the group. Then click **OK**. Note that:

    * Machines in replication groups replicate together, and have shared crash-consistent and app-consistent recovery points when they fail over.
    * We recommend that you gather VMs and physical servers together so that they mirror your workloads. Enabling multi-VM consistency can impact workload performance, and should only be used if machines are running the same workload and you need consistency.
    ![Enable replication](./media/site-recovery-physical-to-azure/policy.png)

13. Click **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

After you enable replication, the Mobility service will be installed if you set up push installation. After the Mobility service is push installed on a VM, a protection job will start and fail. After the failure you need to manually restart each machine. Then the protection job begins again, and initial replication occurs.


### View and manage VM properties

We recommend that you verify the VM properties, and make any changes you need to.

1. Click **Replicated items** >, and select the machine. The **Essentials** blade shows information about machines settings and status.
2. In **Properties**, you can view replication and failover information for the VM.
3. In **Compute and Network** > **Compute properties**, you can specify the Azure VM name and target size. Modify the name to comply with [Azure requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) if you need to.
4. Modify settings for the target network, subnet, and IP address that will be assigned to the Azure VM:

   - You can set the target IP address.

    - If you don't provide an address, the failed over machine will use DHCP.
    - If you set an address that isn't available at failover, failover won't work.
    - The same target IP address can be used for test failover, if the address is available in the test failover network.

   - The number of network adapters is dictated by the size you specify for the target virtual machine:

     - If the number of network adapters on the source machine is the same as, or less than, the number of adapters allowed for the target machine size, then the target will have the same number of adapters as the source.
     - If the number of adapters for the source virtual machine exceeds the number allowed for the target size, then the target size maximum will be used.
     - For example, if a source machine has two network adapters and the target machine size supports four, the target machine will have two adapters. If the source machine has two adapters but the supported target size only supports one then the target machine will have only one adapter.     
   - If the virtual machine has multiple network adapters they will all connect to the same network.
   - If the virtual machine has multiple network adapters then the first one shown in the list becomes the *Default* network adapter in the Azure virtual machine.
5. In **Disks**, you can see the VM operating system, and the data disks that will be replicated.

## Run a test failover

After you've set everything up, run a test failover to make sure everything's working as expected.


1. To fail over a single machine, in **Settings** > **Replicated Items**, click the VM > **+Test Failover** icon.

    ![Test failover](./media/site-recovery-vmware-to-azure/TestFailover.png)

1. To fail over a recovery plan, in **Settings** > **Recovery Plans**, right-click the plan > **Test Failover**. To create a recovery plan, [follow these instructions](site-recovery-create-recovery-plans.md).  

1. In **Test Failover**, select the Azure network to which Azure VMs will be connected after failover occurs.

1. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its properties, or on the **Test Failover** job in vault name > **Settings** > **Jobs** > **Site Recovery jobs**.

1. After the failover completes, you should also be able to see the replica Azure machine appear in the Azure portal > **Virtual Machines**. You should make sure that the VM is the appropriate size, that it's connected to the appropriate network, and that it's running.

1. If you [prepared for connections after failover](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover), you should be able to connect to the Azure VM.

1. Once you're done, click on **Cleanup test failover** on the recovery plan. In **Notes** record and save any observations associated with the test failover. This will delete the virtual machines that were created during test failover.

For more details, refer to [Test failover to Azure](site-recovery-test-failover-to-azure.md) document.

## Next steps

After you get replication up and running, when an outage occurs you fail over to Azure, and Azure VMs are created from the replicated data. You can then access workloads and apps in Azure, until you fail back to your primary location when it returns to normal operations.

- [Learn more](site-recovery-failover.md) about different types of failovers, and how to run them.
- If you're migrating machines rather than replicating and failing back, [read more](site-recovery-migrate-to-azure.md#migrate-on-premises-vms-and-physical-servers).
- When replicating physical machines, you can only failback to a VMWare environment. [Read about failback](site-recovery-failback-azure-to-vmware.md).

## Third-party software notices and information
Do Not Translate or Localize

The software and firmware running in the Microsoft product or service is based on or incorporates material from the projects listed below (collectively, “Third Party Code”).  Microsoft is the not original author of the Third Party Code.  The original copyright notice and license, under which Microsoft received such Third Party Code, are set forth below.

The information in Section A is regarding Third Party Code components from the projects listed below. Such licenses and information are provided for informational purposes only.  This Third Party Code is being relicensed to you by Microsoft under Microsoft's software licensing terms for the Microsoft product or service.  

The information in Section B is regarding Third Party Code components that are being made available to you by Microsoft under the original licensing terms.

The complete file may be found on the [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkId=529428). Microsoft reserves all rights not expressly granted herein, whether by implication, estoppel or otherwise.
