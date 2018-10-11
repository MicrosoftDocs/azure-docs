---
title: Migrate your Windows VMs to Azure Premium Storage with Azure Site Recovery | Microsoft Docs
description: Migrate your existing virtual machines to Azure Premium Storage by using Site Recovery. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines.
services: "virtual-machines-windows,storage"
cloud: Azure
author: luywang
ms.service: virtual-machines-windows
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/15/2017
ms.author: luywang
ms.component: disks
---
# Migrate to Premium Storage by using Azure Site Recovery

[Azure Premium Storage](premium-storage.md) delivers high-performance, low-latency disk support for virtual machines (VMs) that are running I/O-intensive workloads. This guide helps you migrate your VM disks from a standard storage account to a premium storage account by using [Azure Site Recovery](../../site-recovery/site-recovery-overview.md).

Site Recovery is an Azure service that contributes to your strategy for business continuity and disaster recovery by orchestrating the replication of on-premises physical servers and VMs to the cloud (Azure) or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep applications and workloads available. You fail back to your primary location when it returns to normal operation. 

Site Recovery provides test failovers to support disaster recovery drills without affecting production environments. You can run failovers with minimal data loss (depending on replication frequency) for unexpected disasters. In the scenario of migrating to Premium Storage, you can use the [failover in Site Recovery](../../site-recovery/site-recovery-failover.md) to migrate target disks to a premium storage account.

We recommend migrating to Premium Storage by using Site Recovery because this option provides minimal downtime. This option also avoids the manual execution of copying disks and creating new VMs. Site Recovery will systematically copy your disks and create new VMs during failover. 

Site Recovery supports a number of types of failover with minimal or no downtime. To plan your downtime and estimate data loss, see the [types of failover in Site Recovery](../../site-recovery/site-recovery-failover.md). If you [prepare to connect to Azure VMs after failover](../../site-recovery/vmware-walkthrough-overview.md), you should be able to connect to the Azure VM by using RDP after failover.

![Disaster recovery diagram][1]

## Azure Site Recovery components

These Site Recovery components are relevant to this migration scenario:

* **Configuration server** is an Azure VM that coordinates communication and manages data replication and recovery processes. On this VM, you run a single setup file to install the configuration server and an additional component, called a process server, as a replication gateway. Read about [configuration server prerequisites](../../site-recovery/vmware-walkthrough-overview.md). You set up the configuration server only once, and you can use it for all migrations to the same region.

* **Process server** is a replication gateway that: 

  1. Receives replication data from source VMs.
  2. Optimizes the data with caching, compression, and encryption.
  3. Sends the data to a storage account. 

  It also handles push installation of the mobility service to source VMs and performs automatic discovery of source VMs. The default process server is installed on the configuration server. You can deploy additional standalone process servers to scale your deployment. Read about [best practices for process server deployment](https://azure.microsoft.com/blog/best-practices-for-process-server-deployment-when-protecting-vmware-and-physical-workloads-with-azure-site-recovery/) and [deploying additional process servers](../../site-recovery/site-recovery-plan-capacity-vmware.md#deploy-additional-process-servers). You set up the process server only once, and you can use it for all migrations to the same region.

* **Mobility service** is a component that is deployed on every standard VM that you want to replicate. It captures data writes on the standard VM and forwards them to the process server. Read about [replicated machine prerequisites](../../site-recovery/vmware-walkthrough-overview.md).

This graphic shows how these components interact:

![Interaction of Site Recovery components][15]

> [!NOTE]
> Site Recovery does not support the migration of Storage Spaces disks.

For additional components for other scenarios, see [Scenario architecture](../../site-recovery/vmware-walkthrough-overview.md).

## Azure essentials

These are the Azure requirements for this migration scenario:

* An Azure subscription.
* An Azure premium storage account to store replicated data.
* An Azure virtual network to which VMs will connect when they're created at failover. The Azure virtual network must be in the same region as the one in which Site Recovery runs.
* An Azure standard storage account to store replication logs. This can be the same storage account for the VM disks that are being migrated.

## Prerequisites

* Understand the relevant migration scenario components in the preceding section.
* Plan your downtime by learning about [failover in Site Recovery](../../site-recovery/site-recovery-failover.md).

## Setup and migration steps

You can use Site Recovery to migrate Azure IaaS VMs between regions or within same region. The following instructions are tailored for this migration scenario from the article [Replicate VMware VMs or physical servers to Azure](../../site-recovery/vmware-walkthrough-overview.md). Please follow the links for detailed steps in addition to the instructions in this article.

### Step 1: Create a Recovery Services vault

1. Open the [Azure portal](https://portal.azure.com).
2. Select **Create a resource** > **Management** > **Backup and Site Recovery (OMS)**. Alternatively, you can select **Browse** > **Recovery Services Vault** > **Add**. 
3. Specify a region that VMs will be replicated to. For the purpose of migration in the same region, select the region where your source VMs and source storage accounts are. 

### Step 2: Choose your protection goals 

1. On the VM where you want to install the configuration server, open the [Azure portal](https://portal.azure.com).
2. Go to **Recovery Services vaults** > **Settings** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

   ![Browsing to the Protection goal pane][2]

3. Under **Protection goal**, in the first drop-down list, select **To Azure**. In the second drop-down list, select **Not virtualized / Other**, and then select **OK**.

   ![Protection goal pane with filled-in boxes][3]

### Step 3: Set up the source environment (configuration server)

1. Download **Azure Site Recovery Unified Setup** and the vault registration key by going to the **Prepare infrastructure** > **Prepare source** > **Add Server** panes. 
 
   You will need the vault registration key to run the unified setup. The key is valid for five days after you generate it.

   ![Browsing to the Add Server pane][4]

2. In the **Add Server** pane, add a configuration server.

   ![Add Server pane with Configuration Server selected][5]

3. On the VM that you're using as the configuration server, run Unified Setup to install the configuration server and the process server. You can [walk through the screenshots](../../site-recovery/vmware-walkthrough-overview.md) to complete the installation. You can refer to the following screenshots for steps specified for this migration scenario.

   1. In **Before You Begin**, select **Install the configuration server and process server**.

      ![Before You Begin page][6]

   2. In **Registration**, browse and select the registration key that you downloaded from the vault.

      ![Registration page][7]

   3. In **Environment Details**, select whether you're going to replicate VMware VMs. For this migration scenario, choose **No**.

      ![Environment Details page][8]

4. After the installation is complete, do the following in the **Microsoft Azure Site Recovery Configuration Server** window:
 
   1. Use the **Manage Accounts** tab to create the account that Site Recovery can use for automatic discovery. (In the scenario about protecting physical machines, setting up the account isn't relevant, but you need at least one account to enable one of the following steps. In this case, you can name the account and password as any.) 
   2. Use the **Vault Registration** tab to upload the vault credential file.

      ![Vault Registration tab][9]

### Step 4: Set up the target environment

Select **Prepare infrastructure** > **Target**, and specify the deployment model that you want to use for VMs after failover. You can choose **Classic** or **Resource Manager**, depending on your scenario.

![Target pane][10]

Site Recovery checks that you have one or more compatible Azure storage accounts and networks. 

> [!NOTE]
> If you're using a premium storage account for replicated data, you need to set up an additional standard storage account to store replication logs.

### Step 5: Set up replication settings

To verify that your configuration server is successfully associated with the replication policy that you create, follow [Set up replication settings](../../site-recovery/vmware-walkthrough-overview.md).

### Step 6: Plan capacity

1. Use the [capacity planner](../../site-recovery/site-recovery-capacity-planner.md) to accurately estimate network bandwidth, storage, and other requirements to meet your replication needs. 
2. When you're done, select **Yes, I have done it** in **Have you completed capacity planning?**.

   ![Box for confirming that you completed capacity planning][11]

### Step 7: Install the mobility service and enable replication

1. You can choose to [push installation](../../site-recovery/vmware-walkthrough-overview.md) to your source VMs or to [manually install the mobility service](../../site-recovery/site-recovery-vmware-to-azure-install-mob-svc.md) on your source VMs. You can find the requirement of pushing installation and the path of the manual installer in the provided link. If you're doing a manual installation, you might need to use an internal IP address to find the configuration server.

   ![Configuration Server Details page][12]

   The failed-over VM will have two temporary disks: one from the primary VM and the other created during the provisioning of the VM in the recovery region. To exclude the temporary disk before replication, install the mobility service before you enable replication. To learn more about how to exclude the temporary disk, see [Exclude disks from replication](../../site-recovery/vmware-walkthrough-overview.md).

2. Enable replication as follows:
   1. Select **Replicate Application** > **Source**. After you've enabled replication for the first time, select **+Replicate** in the vault to enable replication for additional machines.
   2. In step 1, set up **Source** as your process server.
   3. In step 2, specify the post-failover deployment model, a premium storage account to migrate to, a standard storage account to save logs, and a virtual network to fail to.
   4. In step 3, add protected VMs by IP address. (You might need an internal IP address to find them.)
   5. In step 4, configure the properties by selecting the accounts that you set up previously on the process server.
   6. In step 5, choose the replication policy that you created previously in "Step 5: Set up replication settings."
   7. Select **OK**.

   > [!NOTE]
   > When an Azure VM is deallocated and started again, there is no guarantee that it will get the same IP address. If the IP address of the configuration server/process server or the protected Azure VMs changes, the replication in this scenario might not work correctly.

   ![Enable replication pane with Source selected][13]

When you design your Azure Storage environment, we recommend that you use separate storage accounts for each VM in an availability set. We recommend that you follow the best practice in the storage layer to [use multiple storage accounts for each availability set](../linux/manage-availability.md). Distributing VM disks to multiple storage accounts helps to improve storage availability and distributes the I/O across the Azure storage infrastructure.

If your VMs are in an availability set, instead of replicating disks of all VMs into one storage account, we highly recommend migrating multiple VMs multiple times. That way, the VMs in the same availability set do not share a single storage account. Use the **Enable Replication** pane to set up a destination storage account for each VM, one at a time.
 
You can choose a post-failover deployment model according to your need. If you choose Azure Resource Manager as your post-failover deployment model, you can fail over a VM (Resource Manager) to a VM (Resource Manager), or you can fail over a VM (classic) to a VM (Resource Manager).

### Step 8: Run a test failover

To check whether your replication is complete, select your Site Recovery instance and then select **Settings** > **Replicated Items**. You will see the status and percentage of your replication process. 

After initial replication is complete, run a test failover to validate your replication strategy. For detailed steps of a test failover, see [Run a test failover in Site Recovery](../../site-recovery/vmware-walkthrough-overview.md). 

> [!NOTE]
> Before you run any failover, make sure that your VMs and replication strategy meet the requirements. For more information about running a test failover, see [Test failover to Azure in Site Recovery](../../site-recovery/site-recovery-test-failover-to-azure.md).

You can see the status of your test failover in **Settings** > **Jobs** > *YOUR_FAILOVER_PLAN_NAME*. In the pane, you  can see a breakdown of the steps and success/failure results. If the test failover fails at any step, select the step to check the error message. 

### Step 9: Run a failover

After the test failover is completed, run a failover to migrate your disks to Premium Storage and replicate the VM instances. Follow the detailed steps in [Run a failover](../../site-recovery/site-recovery-failover.md#run-a-failover). 

Be sure to select **Shut down VMs and synchronize the latest data**. This option specifies that Site Recovery should try to shut down the protected VMs and synchronize the data so that the latest version of the data will be failed over. If you don't select this option or the attempt doesn't succeed, the failover will be from the latest available recovery point for the VM. 

Site Recovery will create a VM instance whose type is the same as or similar to a Premium Storage-capable VM. You can check the performance and price of various VM instances by going to [Windows Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) or [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

## Post-migration steps

1. **Configure replicated VMs to the availability set if applicable**. Site Recovery does not support migrating VMs along with the availability set. Depending on the deployment of your replicated VM, do one of the following:
   * For a VM created through the classic deployment model: Add the VM to the availability set in the Azure portal. For detailed steps, go to [Add an existing virtual machine to an availability set](../linux/classic/configure-availability-classic.md).
   * For a VM created through the Resource Manager deployment model: Save your configuration of the VM and then delete and re-create the VMs in the availability set. To do so, use the script at [Set Azure Resource Manager VM Availability Set](https://gallery.technet.microsoft.com/Set-Azure-Resource-Manager-f7509ec4). Before you run this script, check its limitations and plan your downtime.

2. **Delete old VMs and disks**. Make sure that the Premium disks are consistent with source disks and that the new VMs perform the same function as the source VMs. Delete the VM and delete the disks from your source storage accounts in the Azure portal. If there's a problem in which the disk is not deleted even though you deleted the VM, see [Troubleshoot storage resource deletion errors](storage-resource-deletion-errors.md).

3. **Clean the Azure Site Recovery infrastructure**. If Site Recovery is no longer needed, you can clean its infrastructure. Delete replicated items, the configuration server, and the recovery policy, and then delete the Azure Site Recovery vault.

## Troubleshooting

* [Monitor and troubleshoot protection for virtual machines and physical servers](../../site-recovery/site-recovery-monitoring-and-troubleshooting.md)
* [Microsoft Azure Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr)

## Next steps

For specific scenarios for migrating virtual machines, see the following resources:

* [Migrate Azure Virtual Machines between Storage Accounts](https://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/)
* [Create and upload a Windows Server VHD to Azure](upload-generalized-managed.md)
* [Migrating Virtual Machines from Amazon AWS to Microsoft Azure](http://channel9.msdn.com/Series/Migrating-Virtual-Machines-from-Amazon-AWS-to-Microsoft-Azure)

Also, see the following resources to learn more about Azure Storage and Azure Virtual Machines:

* [Azure Storage](https://azure.microsoft.com/documentation/services/storage/)
* [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)
* [Premium Storage: High-performance storage for Azure virtual machine workloads](premium-storage.md)

[1]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-1.png
[2]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-2.png
[3]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-3.png
[4]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-4.png
[5]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-5.png
[6]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-6.PNG
[7]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-7.PNG
[8]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-8.PNG
[9]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-9.PNG
[10]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-10.png
[11]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-11.PNG
[12]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-12.PNG
[13]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-13.png
[14]:../site-recovery/media/site-recovery-vmware-to-azure/v2a-architecture-henry.png
[15]:./media/migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-14.png
