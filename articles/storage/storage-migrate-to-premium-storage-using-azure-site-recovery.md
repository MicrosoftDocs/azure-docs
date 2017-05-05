---
  title: Migrating to Azure Premium Storage using Azure Site Recovery | Microsoft Docs
  description: Migrate your existing virtual machines to Azure Premium Storage using Site Recovery. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines.
  services: storage
  cloud: Azure
  documentationcenter: na
  author: luywang
  manager: kavithag

  ms.assetid:
  ms.service: <service per approved list>
  ms.workload: storage
  ms.tgt_pltfrm: na
  ms.devlang: na
  ms.topic: article
  ms.date: 04/06/2017
  ms.author: luywang

---
# Migrating to Premium Storage using Azure Site Recovery

[Azure Premium Storage](storage-premium-storage.md) delivers high-performance, low-latency disk support for virtual machines (VMs) that are running I/O-intensive workloads. The purpose of this guide is to help users migrate their VM disks from a Standard storage account to a Premium storage account by using [Azure Site Recovery](../site-recovery/site-recovery-overview.md).

Site Recovery is an Azure service that contributes to your business continuity and disaster recovery strategy by orchestrating the replication of on-premises physical servers and VMs to the cloud (Azure) or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep applications and workloads available. You fail back to your primary location when it returns to normal operation. Site Recovery provides test failovers to support disaster recovery drills without affecting production environments. You can run failovers with minimal data loss (depending on replication frequency) for unexpected disasters. In the scenario of migrating to Premium Storage, you can use the [Failover in Site Recovery](../site-recovery/site-recovery-failover.md) in Azure Site Recovery to migrate target disks to a Premium storage account.

We recommend migrating to Premium Storage by using Site Recovery because this option provides minimal downtime and avoids the manual execution of copying disks and creating new VMs. Site Recovery will systematically copy your disks and create new VMs during failover. Site Recovery supports a number of types of failover with minimal or no downtime. To plan your downtime and estimate data loss, see the [Types of failover](../site-recovery/site-recovery-failover.md) table in Site Recovery. If you [prepare to connect to Azure VMs after failover](../site-recovery/site-recovery-vmware-to-azure.md#prepare-vms-for-replication), you should be able to connect to the Azure VM using RDP after failover.

![][1]

## Azure Site Recovery components

These are the Site Recovery components that are relevant to this migration scenario.

* **Configuration server** is an Azure VM that coordinates communication and manages data replication and recovery processes. On this VM you will run a single setup file to install the configuration server and an additional component, called a process server, as a replication gateway. Read about [configuration server prerequisites](../site-recovery/site-recovery-vmware-to-azure.md#prerequisites). Configuration server only needs to be configured once and can be used for all migrations to the same region.

* **Process server** is a replication gateway that receives replication data from source VMs optimizes the data with caching, compression, and encryption, and sends it to a storage account. It also handles push installation of the mobility service to source VMs and performs automatic discovery of source VMs. The default process server is installed on the configuration server. You can deploy additional standalone process servers to scale your deployment. Read about [best practices for process server deployment](https://azure.microsoft.com/blog/best-practices-for-process-server-deployment-when-protecting-vmware-and-physical-workloads-with-azure-site-recovery/) and [deploying additional process servers](../site-recovery/site-recovery-plan-capacity-vmware.md#deploy-additional-process-servers). Process server only needs to be configured once and can be used for all migrations to the same region.

* **Mobility service** is a component that is deployed on every standard VM you want to replicate. It captures data writes on the standard VM and forwards them to the process server. Read about [Replicated machine prerequisites](../site-recovery/site-recovery-vmware-to-azure.md#prerequisites).

This graphic shows how these components interact.

![][15]

> [!NOTE]
> Site Recovery does not support the migration of Storage Spaces disks.

For additional components for other scenarios, please refer to [Scenario architecture](../site-recovery/site-recovery-vmware-to-azure.md).

## Azure essentials

These are the Azure requirements for this migration scenario.

* An Azure subscription
* An Azure Premium storage account to store replicated data
* An Azure virtual network (VNet) to which VMs will connect when they're created at failover. The Azure VNet must be in the same region as the one in which the Site Recovery runs
* An Azure Standard storage account in which to store replication logs. This can be the same storage account as the VM disks being migrated

## Prerequisites

* Understand the relevant migration scenario components in the preceding section
* Plan your downtime by learning about the [Failover in Site Recovery](../site-recovery/site-recovery-failover.md)

## Setup and migration steps

You can use Site Recovery to migrate Azure IaaS VMs between regions or within same region. The following instructions have been tailored for this migration scenario from the article [Replicate VMware VMs or physical servers to Azure](../site-recovery/site-recovery-vmware-to-azure.md). Please follow the links for detailed steps in additional to the instructions in this article.

1. **Create a Recovery Services vault**. Create and manage the Site Recovery vault through the [Azure portal](https://portal.azure.com). Click **New** > **Management** > **Backup** and **Site Recovery (OMS)**. Alternatively you can click **Browse** > **Recovery Services Vault** > **Add**. VMs will be replicated to the region you specify in this step. For the purpose of migration in the same region, select the region where your source VMs and source storage accounts are. Note that migration to Premium storage accounts is only supported in the [Azure portal](https://portal.azure.com), not the [classic portal](https://manage.windowsazure.com).

2. The following steps help you **choose your protection goals**.

    2a. On the VM where you want to install the configuration server, open the [Azure portal](https://portal.azure.com). Go to **Recovery Services vaults** > **Settings**. Under **Settings**, select **Site Recovery**. Under **Site Recovery**, select **Step 1: Prepare Infrastructure**. Under **Prepare infrastructure**, select **Protection goal**.

    ![][2]

    2b. Under **Protection goal**, in the first drop-down list, select **To Azure**. In the second drop-down list, select **Not virtualized / Other**, and then click **OK**.

    ![][3]

3. The following steps help you **set up the source environment (configuration server)**.

    3a. Download the **Azure Site Recovery Unified Setup** and the **vault registration key** by going to the **Prepare infrastructure** > **Prepare source** > **Add Server** blade. You will need the vault registration key to run the unified setup. The key is valid for 5 days after you generate it.

    ![][4]

    3b. Add Configuration Server in the **Add Server** blade.

    ![][5]

    3c. On the VM you're using as the configuration server, run Unified Setup to install the configuration server and the process server. You can walk through the screenshots [here](../site-recovery/site-recovery-vmware-to-azure.md#set-up-the-source-environment) to complete the installation. You can refer to the following screenshots for steps specified for this migration scenario.

    In **Before you begin**, select **Install the configuration server and process server**.

    ![][6]

    3d. In **Registration**, browse and select the registration key you downloaded from the vault.

    ![][7]

    3e. In **Environment Details**, select whether you're going to replicate VMware VMs. For this migration scenario, choose **No**.

    ![][8]

    3f. After the installation is complete, you will see the **Microsoft Azure Site Recovery Configuration Server** window. Use the **Manage Accounts** tab to create the account that Site Recovery can use for automatic discovery. (In the scenario about protecting physical machines, setting up the account isn't relevant, but you need at least one account to enable one of the following steps. In this case, you can name the account and password as any.) Use the **Vault Registration** tab to upload the vault credential file.

    ![][9]

4. **Set up the target environment**. Click **Prepare infrastructure** > **Target**, and specify the deployment model you want to use for VMs after failover. You can choose **Classic** or **Resource Manager**, depending on your scenario.

    ![][10]

    Site Recovery checks that you have one or more compatible Azure storage accounts and networks. Note that if you're using a Premium storage account for replicated data, you need to set up an additional Standard storage account to store replication logs.

5. **Set up replication settings**. Please follow [Set up replication settings](../site-recovery/site-recovery-vmware-to-azure.md#set-up-replication-settings) to verify that your configuration server is successfully associated with the replication policy you create.

6. **Capacity planning**. Use the [capacity planner](../site-recovery/site-recovery-capacity-planner.md) to accurately estimate network bandwidth, storage, and other requirements to meet your replication needs. When you're done, select **Yes** in **Have you completed capacity planning?**.

    ![][11]

7. The following steps help you **install mobility service and enable replication**.

    7a. You can choose to [push installation](../site-recovery/site-recovery-vmware-to-azure.md#prepare-for-automatic-discovery-and-push-installation) to your source VMs or to [manually install mobility service](../site-recovery/site-recovery-vmware-to-azure-install-mob-svc.md) on your source VMs. You can find the requirement of pushing installation and the path of the manual installer in the link provided. If you are doing a manual installation, you might need to use an internal IP address to find the configuration server.

    ![][12]

    The failed-over VM will have two temporary disks: one from the primary VM and the other created during the provisioning of VM in the recovery region. To exclude the temporary disk before replication, install the mobility service before you enable replication. To learn more about how to exclude the temp disk, refer to [Exclude disks from replication](../site-recovery/site-recovery-vmware-to-azure.md#exclude-disks-from-replication).

    7b. Now enable replication as follows:
      * Click **Replicate application** > **Source**. After you've enabled replication for the first time, click +Replicate in the vault to enable replication for additional machines.
      * In step 1, set up Source as your process server.
      * In step 2, specify the post-failover deployment model, a Premium storage account to migrate to, a Standard storage account to save logs, and a virtual network to fail to.
      * In step 3, add protected VMs by IP address (you might need an internal IP address to find them).
      * In step 4, configure the properties by selecting the accounts you set up previously on the process server.
      * In step 5, choose the replication policy you created previously, Set up replication settings.
      Click **OK** and enable replication.

    > [!NOTE]
    > When an Azure VM is deallocated and started again, there is no guarantee that it will get the same IP address. If the IP address of the configuration server/process server or the protected Azure VMs change, the replication in this scenario might not work correctly.

    ![][13]

    When you design your Azure Storage environment, we recommend that you use separate storage accounts for each VM in an availability set. We recommend that you follow the best practice in the storage layer to [Use multiple storage accounts for each availability set](../virtual-machines/windows/manage-availability.md). Distributing VM disks to multiple storage accounts helps to improve storage availability and distributes the I/O across the Azure storage infrastructure. If your VMs are in an availability set, instead of replicating disks of all VMs into one storage account, we highly recommend migrating multiple VMs multiple times, so that the VMs in the same availability set do not share a single storage account. Use the **Enable Replication** blade to set up a destination storage account for each VM, one at a time. 
You can choose a post-failover deployment model according to your need. If you choose Resource Manager (RM) as your post-failover deployment model, you can fail over a RM VM to an RM VM, or you can fail over a classic VM to an RM VM.

8. **Run a test failover**. To check whether your replication is complete, click your Site Recovery and then click **Settings** > **Replicated Items**. You will see the status and percentage of your replication process. After initial replication is complete, run Test Failover to validate your replication strategy. For detailed steps of test failover, please refer to [Run a test failover in Site Recovery](../site-recovery/site-recovery-vmware-to-azure.md#run-a-test-failover). You can see the status of test failover in **Settings** > **Jobs** > **YOUR_FAILOVER_PLAN_NAME**. On the blade, you will see a breakdown of the steps and success/failure results. If the test failover fails at any step, click the step to check the error message. Make sure your VMs and replication strategy meet the requirements before you run a failover. Read [Test Failover to Azure in Site Recovery](../site-recovery/site-recovery-test-failover-to-azure.md) for more information and instructions of test failover.

9. **Run a failover**. After the test failover is completed, run a failover to migrate your disks to Premium Storage and replicate the VM instances. Please follow the detailed steps in [Run a failover](../site-recovery/site-recovery-failover.md#run-a-failover). Make sure you select **Shut down VMs and synchronize the latest data** to specify that Site Recovery should try to shut down the protected VMs and synchronize the data so that the latest version of the data will be failed over. If you don't select this option or the attempt doesn't succeed the failover will be from the latest available recovery point for the VM. Site Recovery will create a VM instance whose type is the same as or similar to a Premium Storage–capable VM. You can check the performance and price of various VM instances by going to [Windows Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) or [Linux Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

## Post-migration steps

1. **Configure replicated VMs to the availability set if applicable**. Site Recovery does not support migrating VMs along with the availability set. Depending on the deployment of your replicated VM, do one of the following:
  * For a VM created using the classic deployment model: Add the VM to the availability set in the Azure portal. For detailed steps, go to [Add an existing virtual machine to an availability set](../virtual-machines/windows/classic/configure-availability.md#a-idaddmachine-aoption-2-add-an-existing-virtual-machine-to-an-availability-set).
  * For the Resource Manager deployment model: Save your configuration of the VM and then delete and re-create the VMs in the availability set. To do so, use the script at [Set Azure Resource Manager VM Availability Set](https://gallery.technet.microsoft.com/Set-Azure-Resource-Manager-f7509ec4). Check the limitation of this script and plan downtime before running the script.

2. **Delete old VMs and disks**. Before deleting these, please make sure the Premium disks are consistent with source disks and the new VMs perform the same function as the source VMs. In the Resource Manager (RM) deployment model, delete the VM and delete the disks from your source storage accounts in the Azure portal. In the classic deployment model, you can delete the VM and disks in the classic portal or Azure portal. If there is an issue in which the disk is not deleted even though you deleted the VM, please see [Troubleshoot errors when you delete VHDs in an RM deployment](storage-resource-manager-cannot-delete-storage-account-container-vhd.md) or [Troubleshoot deleting VHDs in a classic deployment](storage-cannot-delete-storage-account-container-vhd.md).

3. **Clean the Azure Site Recovery infrastructure**. If Site Recovery is no longer needed, you can clean its infrastructure by deleting replicated items, the configuration server, and the Recovery Policy, and then deleting the Azure Site Recovery vault.

## Troubleshooting

* [Monitor and troubleshoot protection for virtual machines and physical servers](../site-recovery/site-recovery-monitoring-and-troubleshooting.md)
* [Microsoft Azure Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr)

## Next steps

See the following resources for specific scenarios for migrating virtual machines:

* [Migrate Azure Virtual Machines between Storage Accounts](https://azure.microsoft.com/blog/2014/10/22/migrate-azure-virtual-machines-between-storage-accounts/)
* [Create and upload a Windows Server VHD to Azure.](../virtual-machines/windows/classic/createupload-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../virtual-machines/linux/classic/create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Migrating Virtual Machines from Amazon AWS to Microsoft Azure](http://channel9.msdn.com/Series/Migrating-Virtual-Machines-from-Amazon-AWS-to-Microsoft-Azure)

Also, see the following resources to learn more about Azure Storage and Azure Virtual Machines:

* [Azure Storage](https://azure.microsoft.com/documentation/services/storage/)
* [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)
* [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md)

[1]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-1.png
[2]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-2.png
[3]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-3.png
[4]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-4.png
[5]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-5.png
[6]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-6.PNG
[7]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-7.PNG
[8]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-8.PNG
[9]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-9.PNG
[10]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-10.png
[11]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-11.PNG
[12]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-12.PNG
[13]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-13.png
[14]:../site-recovery/media/site-recovery-vmware-to-azure/v2a-architecture-henry.png
[15]:./media/storage-migrate-to-premium-storage-using-azure-site-recovery/migrate-to-premium-storage-using-azure-site-recovery-14.png
