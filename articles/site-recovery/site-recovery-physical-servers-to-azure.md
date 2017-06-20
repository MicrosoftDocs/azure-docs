---
title: Replicate physical servers to Azure | Microsoft Docs
description: Describes how to deploy Azure Site Recovery to orchestrate replication, failover and recovery of on-premises Windows/Linux physical servers to Azure, using the Azure portal
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
ms.date: 04/19/2017
ms.author: raynew

---
# Replicate physical machines to Azure with Site Recovery


This article describes how to replicate on-premises physical machines to Azure, using the Azure Site Recovery service in the Azure portal.

If you want to migrate physical machines to Azure (failover only), read this [article](site-recovery-migrate-to-azure.md) to learn more.

Post comments and questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Deployment summary

Here's what you need to do:

1. Verify prerequisites and limitations.
2. Set up Azure network and storage accounts.
3. Prepare an on-premises machine to act as the configuration server.
4. Create a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.
5. Specify source, target, and replication settings.
6. Deploy the Mobility service on machines that you want to replicate.
7. Enable replication for the machines.
7. Run a test failover to make sure everything's working as expected

## Prerequisites

**Support requirement** | **Details**
--- | ---
**Azure** | Learn about [Azure requirements](site-recovery-prereq.md#azure-requirements)
**On-premises configuration server** | On-premises machine (physical or VMware VM) running Windows Server 2012 R2 or later. You set up the configuration server during Site Recovery deployment.<br/><br/> By default the process server and master target server are also installed on this machine. When you scale up, you might need a separate process server, and it has the same requirements as the configuration server.<br/><br/> Learn more about these components [here](site-recovery-set-up-vmware-to-azure.md#configuration-server-minimum-requirements)
**On-premises VMs** | Machines you want to replicate should be running a [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions), and conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).
**URLs** | The configuration server needs access to these URLs:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/> If you have IP address-based firewall rules, ensure they allow communication to Azure.<br/></br> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br/></br> Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).<br/><br/> Allow this URL for the MySQL download: http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi.
**Mobility service** | This will be installed on each machine you want to replicate.

## Limitations

**Limitation** | **Details**
--- | ---
**Azure** | Storage and network accounts must be in the same region as the vault<br/><br/> If you use a premium storage account, you also need a standard store account to store replication logs<br/><br/> You can't replicate to premium accounts in Central and South India.
**On-premises configuration server** | If you install the configuration server on a VMware VM, the VM adapter type should be VMXNET3. If it isn't, [install this update](https://kb.vmware.com/selfservice/microsites/search.do?cmd=displayKC&docType=kc&externalId=2110245&sliceId=1&docTypeID=DT_KB_1_1&dialogID=26228401&stateId=1)<br/><br/> If you're using a VMware VM, vSphere PowerCLI 6.0 should be installed on it.<br/><br> The machine shouldn't be a domain controller.<br/><br/> The machine should have a static IP address.<br/><br/> The host name should be 15 characters or less, and operating system should be in English.
**Replicated machines** | Verify [Azure VM limitations](site-recovery-prereq.md#azure-requirements)<br/><br/> If you want to enable multi-VM consistency, which enables machines running the same workload to be recovered together to a consistent data point, open port 20004 on the machine.<br/><br/> Specific types of [Linux storage](site-recovery-support-matrix-to-azure.md#support-for-storage) are supported.
**Failback** | You can't fail back from Azure to a physical machine. If you want to be able to fail back to on-premises after failover, you need a VMware environment, so that you can fail back to a VMware VM.


## Set up Azure

1. [Set up an Azure network](../virtual-network/virtual-networks-create-vnet-arm-pportal.md).
    - Azure VMs will be placed in this network when they're created after failover.
    - You can set up a network in [Resource Manager](../resource-manager-deployment-model.md), or in classic mode.

2. Set up an [Azure storage account](../storage/storage-create-storage-account.md#create-a-storage-account) for replicated data.
    - The account can be standard or [premium](../storage/storage-premium-storage.md).
    - You can set up an account in Resource Manager, or in classic mode.

## Prepare the configuration server

1. Install Windows Server 2012 R2 or later, on an on-premises physical server, or VMware VM.
2. Make sure the machine has access the URLs listed in [prerequisites](#prerequisites).

## Prepare for Mobility service installation

If you want to push the Mobility service to physical machine, you need an account that can be used by the process server to access the machines. The account is only used for the push installation. You can use a domain or local account:

  - For Windows, if you're not using a domain account, you need to disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
    - If you want to add the registry entry for Windows from a CLI, type:
        ``REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.``
  - For Linux, the account should be a root user on the source Linux server.


## Create a Recovery Services vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]


## Select the protection goal

Select what you want to replicate, and where you want to replicate to.

1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu > click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-vmware-to-azure/choose-goal-physical.PNG)
3. In **Protection goal**, select **To Azure**, and select **Not virtualized/other**.


## Set up the source environment

Set up the configuration server, register it in the vault, and discover VMs.

1. Click **Site Recovery** > **Prepare Infrastructure** > **Source**.
2. If you don’t have a configuration server, click **+Configuration server**.

    ![Set up source](./media/site-recovery-vmware-to-azure/set-source1.png)
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   ![Set up source](./media/site-recovery-vmware-to-azure/set-source2.png)


## Run Site Recovery Unified Setup

Before you start, do the following:

- Get a quick video overview (the video describes how to replicate VMware VMs but the process is similar for physical machine replication)

    > [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video1-Source-Infrastructure-Setup/player]

- On the configuration server machine, make sure that the system clock is synchronized with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service). If it's 15 minutes in front or behind, setup might fail.
- Run setup as a Local Administrator on the configuration server machine.
- Make sure TLS 1.0 is enabled on the machine.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE]
> The configuration server can also be installed [from the command line](http://aka.ms/installconfigsrv).


## Set up the target environment

Before you set up the target environment, check you have an [Azure storage account and network](#set-up-azure)

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify whether your target deployment model is Resource Manager-based, or classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/site-recovery-vmware-to-azure/gs-target.png)
4. If you haven't created a storage account or network, click **+Storage account** or **+Network**, to create a Resource Manager account or network inline.

## Set up replication settings

Before you start, get a quick video overview (the video describes how to replicate VMware VMs but the process is similar for physical machine replication).

> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video2-vCenter-Server-Discovery-and-Replication-Policy/player]

1. To create a new replication policy, click **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
2. In **Create replication policy**, specify a policy name.
3. In **RPO threshold**, specify the RPO limit. This value specifies how often data recovery points are created. An alert is generated if continuous replication exceeds this limit.
4. In **Recovery point retention**, specify (in hours) how long the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window. Up to 24 hours retention is supported for machines replicated to premium storage, and 72 hours for standard storage.
5. In **App-consistent snapshot frequency**, specify how often (in minutes) recovery points containing application-consistent snapshots will be created. Click **OK** to create the policy.

    ![Replication policy](./media/site-recovery-vmware-to-azure/gs-replication2.png)
8. When you create a new policy it's automatically associated with the configuration server. By default, a matching policy is automatically created for failback. For example if the replication policy is **rep-policy** then the failback policy will be **rep-policy-failback**. This policy isn't used until you initiate a failback from Azure.  


## Plan capacity

1. Now that you have your basic infrastructure set up you can think about capacity planning, and figure out whether you need additional resources. [Learn more](site-recovery-plan-capacity-vmware.md).
2. When you’re done with capacity planning, select **Yes** in **Have you completed capacity planning?**

   ![Capacity planning](./media/site-recovery-vmware-to-azure/gs-capacity-planning.png)


## Prepare VMs for replication

All machines that you want to replicate must have the Mobility service installed. You can install the Mobility service in a number of ways:

1. Install with a push installation from the process server. You need to prepare machines in advance to use this method.
2. Install using deployment tools such as System Center Configuration Manager, or Azure automation DSC.
3.  Install manually.

[Learn more](site-recovery-vmware-to-azure-install-mob-svc.md)


## Enable replication

Before you start:

- When you add or modify VMs, it can take up to 15 minutes or longer for changes to take effect, and for them to appear in the portal.
- You can check the last discovered time for VMs in **Configuration Servers** > **Last Contact At**.
- To add VMs without waiting for the scheduled discovery, highlight the configuration server (don’t click it), and click **Refresh**.
* If a VM is prepared for push installation, the process server automatically installs the Mobility service when you enable replication.
- Before you start, get a quick video overview (the video describes how to replicate VMware VMs but the process is similar for physical machine replication).

    >[!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video3-Protect-VMware-Virtual-Machines/player]


### Exclude disks from replication

By default all disks on a machine are replicated. You can exclude disks from replication. For example you might not want to replicate disks with temporary data, or data that's refreshed each time a machine or application restarts (for example pagefile.sys or SQL Server tempdb).

### Replicate VMs

1. Click **Replicate application** > **Source**.
2. In **Source**, select On-premises
3. In **Source-location**, select the configuration server name
4. In **Machine type**, select **Physical Machines**.
5. In **Process server** choose the process server. If you haven't created any additional process servers this will be the configuration server. Then click **OK**.

    ![Enable replication](./media/site-recovery-physical-to-azure/chooseVM.png)

6. In **Target**, select the subscription and the resource group in which you want to create the Azure VMs after failover. Choose the deployment model that you want to use in Azure (classic or resource management), for the failed over VMs.

7. Select the Azure storage account you want to use for replicating data. If you don't want to use an account you've already set up, you can create a new one.

8. Select the Azure network and subnet to which Azure VMs will connect after failover. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. If you don't want to use an existing network, you can create one.

    ![Enable replication](./media/site-recovery-physical-to-azure/targetsettings.png)
9. In **Physical Machines**, Click the '+' button and enter **Name**, **IP address** and choose the operating system of the machine you want to replicate.
  ![Enable replication](./media/site-recovery-physical-to-azure/machineselect.png)
It will take a few minutes until machines are discovered, and shown in the list.

10. In **Properties** > **Configure properties**, select the account that will be used by the process server to automatically install the Mobility service on the machine.
11. By default all disks are replicated. Click **All Disks** and clear any disks you don't want to replicate. Then click **OK**. You can set additional VM properties later.

    ![Enable replication](./media/site-recovery-physical-to-azure/configprop.png)
11. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. If you modify a policy, changes will be applied to replicating machine, and to new machines.
12. Enable **Multi-VM consistency** if you want to gather machines into a replication group, and specify a name for the group. Then click **OK**. Note that:

    * Machines in replication groups replicate together, and have shared crash-consistent and app-consistent recovery points when they fail over.
    * We recommend that you gather VMs and physical servers together so that they mirror your workloads. Enabling multi-VM consistency can impact workload performance, and should only be used if machines are running the same workload and you need consistency.
    ![Enable replication](./media/site-recovery-physical-to-azure/policy.png)

13. Click **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

After you enable replication, the Mobility service will be installed if you set up push installation. After the Mobility service is push installed on a machine, a protection job will start and fail. After the failure you need to manually restart each machine. Then the protection job begins again, and initial replication occurs.


### View and manage Azure VM properties

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

After you've set everything up, run a test failover to make sure everything's working as expected. Watch a quick video overview before you start.

>[!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video4-Recovery-Plan-DR-Drill-and-Failover/player]


1. To fail over a single machine, in **Settings** > **Replicated Items**, click the VM > **+Test Failover** icon.

    ![Test failover](./media/site-recovery-vmware-to-azure/TestFailover.png)

2. To fail over a recovery plan, in **Settings** > **Recovery Plans**, right-click the plan > **Test Failover**. To create a recovery plan, [follow these instructions](site-recovery-create-recovery-plans.md).  
3. In **Test Failover**, select the Azure network to which Azure VMs will be connected after failover occurs.
4. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its properties, or on the **Test Failover** job in vault name > **Settings** > **Jobs** > **Site Recovery jobs**.
5. After the failover completes, you should also be able to see the replica Azure machine appear in the Azure portal > **Virtual Machines**. You should make sure that the VM is the appropriate size, that it's connected to the appropriate network, and that it's running.
6. If you [prepared for connections after failover](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover), you should be able to connect to the Azure VM.
7. Once you're done, click on **Cleanup test failover** on the recovery plan. In **Notes** record and save any observations associated with the test failover. This will delete the virtual machines that were created during test failover.

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
