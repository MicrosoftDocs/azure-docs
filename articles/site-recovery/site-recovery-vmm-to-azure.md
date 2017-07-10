---
title: Replicate Hyper-V VMs in VMM clouds to Azure | Microsoft Docs
description: Orchestrate replication, failover, and recovery of Hyper-V VMs managed in System Center VMM clouds to Azure
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: tysonn

ms.assetid: 8e7d868e-00f3-4e8b-9a9e-f23365abf6ac
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 06/14/2017
ms.author: raynew

---
# Replicate Hyper-V virtual machines in VMM clouds to Azure using Site Recovery in the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](site-recovery-vmm-to-azure.md)
> * [Azure classic](site-recovery-vmm-to-azure-classic.md)
> * [PowerShell Resource Manager](site-recovery-vmm-to-azure-powershell-resource-manager.md)
> * [PowerShell classic](site-recovery-deploy-with-powershell.md)


This article describes how to replicate on-premises Hyper-V virtual machines managed in System Center VMM clouds to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

If you want to migrate machines to Azure (without failback), learn more in [this article](site-recovery-migrate-to-azure.md).


## Deployment steps

Follow the article to complete these deployment steps:


1. [Learn more](site-recovery-components.md#hyper-v-to-azure) about the architecture for this deployment. In addition, [learn about](site-recovery-hyper-v-azure-architecture.md) how Hyper-V replication works in Site Recovery.
2. Verify prerequisites and limitations.
3. Set up Azure network and storage accounts.
4. Prepare the on-premises VMM server and Hyper-V hosts.
5. Create a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.
6. Specify source settings. Register the VMM server in the vault. Install the Azure Site Recovery Provider on the VMM server Install the Microsoft Recovery Services agent on Hyper-V hosts.
7. Set up target and replication settings.
8. Enable replication for the VMs.
9. Run a test failover to make sure everything's working as expected.



## Prerequisites


**Support requirement** | **Details**
--- | ---
**Azure** | Learn about [Azure requirements](site-recovery-prereq.md#azure-requirements).
**On-premises servers** | [Learn more](site-recovery-prereq.md#disaster-recovery-of-hyper-v-virtual-machines-in-virtual-machine-manager-clouds-to-azure) about requirements for the on-premises VMM server and Hyper-V hosts.
**On-premises Hyper-V VMs** | VMs you want to replicate should be running a [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions), and conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).
**Azure URLs** | The VMM server needs access to these URLs:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/> If you have IP address-based firewall rules, ensure they allow communication to Azure.<br/></br> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br/></br> Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).


## Prepare for deployment
To prepare for deployment, you need to:

1. [Set up an Azure network](#set-up-an-azure-network) in which Azure VMs will be located after failover.
2. [Set up an Azure storage account](#set-up-an-azure-storage-account) for replicated data.
3. [Prepare the VMM server](#prepare-the-vmm-server) for Site Recovery deployment.
4. Prepare for network mapping. Set up networks so that you can configure network mapping during Site Recovery deployment.

### Set up an Azure network
You need an Azure network to which Azure VMs created after failover will connect.

* The network should be in the same region as the Recovery Services vault.
* Depending on the resource model you want to use for failed over Azure VMs, you set up the Azure network in [Resource Manager mode](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or [classic mode](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).
* We recommend you set up a network before you begin. If you don't, you need to do it during Site Recovery deployment.
Azure networks used by Site Recovery can't be [moved](../azure-resource-manager/resource-group-move-resources.md) within the same, or across different, subscriptions.

### Set up an Azure storage account
* You need a standard/premium Azure storage account to hold data replicated to Azure.[Premium storage](../storage/storage-premium-storage.md) is  used for virtual machines that need a consistently high IO performance, and low latency to host IO intensive workloads. If you want to use a premium account to store replicated data, you also need a standard storage account to store replication logs that capture ongoing changes to on-premises data. The account must be in the same region as the Recovery Services vault.
* Depending on the resource model you want to use for failed over Azure VMs, you set up an account in [Resource Manager mode](../storage/storage-create-storage-account.md) or [classic mode](../storage/storage-create-storage-account-classic-portal.md).
* We recommend that you set up an account before you begin. If you don't, you need to do it during Site Recovery deployment.
- Note that storage accounts used by Site Recovery can't be [moved](../azure-resource-manager/resource-group-move-resources.md) within the same, or across different, subscriptions.

### Prepare the VMM server
* Make sure that the VMM server complies with the [prerequisites](#prerequisites).
* During Site Recovery deployment, you can specify that all clouds on a VMM server should be available in the Azure portal. If you only want specific clouds to appear in the portal, you can enable that setting on the cloud in the VMM admin console.

### Prepare for network mapping
You must set up network mapping during Site Recovery deployment. Network mapping maps between source VMM VM networks and target Azure networks, to enable the following:

* Machines that fail over on the same network can connect to each other, even if they're not failed over in the same way or in the same recovery plan.
* If a network gateway is set up on the target Azure network, Azure virtual machines can connect to on-premises virtual machines.
* To set up network mapping, here's what you need:

  * Make sure that VMs on the source Hyper-V host server are connected to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.
  * An Azure network as described [above](#set-up-an-azure-network)

## Create a Recovery Services vault
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Monitoring + Management** > **Backup and Site Recovery (OMS)**.

    ![New vault](./media/site-recovery-vmm-to-azure/new-vault3.png)
3. In **Name**, specify a friendly name to identify the vault. If you have more than one subscription, select one of them.
4. [Create a resource group](../azure-resource-manager/resource-group-template-deploy-portal.md), or select an existing one. Specify an Azure region. Machines will be replicated to this region. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/)
5. If you want to quickly access the vault from the Dashboard, click **Pin to dashboard** > **Create vault**.

    ![New vault](./media/site-recovery-vmm-to-azure/new-vault.png)

The new vault appears on the **Dashboard** > **All resources**, and on the main **Recovery Services vaults** blade.


## Select the protection goal

Select what you want to replicate, and where you want to replicate to.

1. In **Recovery Services vaults**, select the vault.
2. In **Getting Started**, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-vmm-to-azure/choose-goals.png)
3. In **Protection goal** select **To Azure**, and select **Yes, with Hyper-V**. Select **Yes** to confirm you're using VMM to manage Hyper-V hosts and the recovery site. Then click **OK**.

## Set up the source environment

Install the Azure Site Recovery Provider on the VMM server, and register the server in the vault. Install the Azure Recovery Services agent on Hyper-V hosts.

1. Click **Prepare Infrastructure** > **Source**.

    ![Set up source](./media/site-recovery-vmm-to-azure/set-source1.png)

2. In **Prepare source**, click **+ VMM** to add a VMM server.

    ![Set up source](./media/site-recovery-vmm-to-azure/set-source2.png)

3. In **Add Server**, check that **System Center VMM server** appears in **Server type** and that the VMM server meets the [prerequisites and URL requirements](#prerequisites).
4. Download the Azure Site Recovery Provider installation file.
5. Download the registration key. You need this when you run setup. The key is valid for five days after you generate it.

    ![Set up source](./media/site-recovery-vmm-to-azure/set-source3.png)


## Install the Provider on the VMM server

1. Run the Provider setup file on the VMM server.
2. In **Microsoft Update**, you can opt in for updates so that Provider updates are installed in accordance with your Microsoft Update policy.
3. In **Installation**, accept or modify the default Provider installation location and click **Install**.

    ![Install location](./media/site-recovery-vmm-to-azure/provider2.png)
4. When installation finishes, click **Register** to register the VMM server in the vault.
5. In the **Vault Settings** page, click **Browse** to select the vault key file. Specify the Azure Site Recovery subscription and the vault name.

    ![Server registration](./media/site-recovery-vmm-to-azure/provider10.PNG)
6. In **Internet Connection**, specify how the Provider running on the VMM server will connect to Site Recovery over the internet.

   * If you want the Provider to connect directly, select **Connect directly to Azure Site Recovery without a proxy**.
   * If your existing proxy requires authentication, or you want to use a custom proxy, select **Connect to Azure Site Recovery using a proxy server**.
   * If you use a custom proxy, specify the address, port, and credentials.
   * If you're using a proxy, you should have already allowed the URLs described in [prerequisites](#on-premises-prerequisites).
   * If you use a custom proxy, a VMM RunAs account (DRAProxyAccount) will be created automatically using the specified proxy credentials. Configure the proxy server so that this account can authenticate successfully. The VMM RunAs account settings can be modified in the VMM console. In **Settings**, expand **Security** > **Run As Accounts**, and then modify the password for DRAProxyAccount. You’ll need to restart the VMM service so that this setting takes effect.

     ![internet](./media/site-recovery-vmm-to-azure/provider13.PNG)
7. Accept or modify the location of an SSL certificate that’s automatically generated for data encryption. This certificate is used if you enable data encryption for a cloud protected by Azure in the Azure Site Recovery portal. Keep this certificate safe. When you run a failover to Azure you’ll need it to decrypt, if data encryption is enabled.
8. In **Server name**, specify a friendly name to identify the VMM server in the vault. In a cluster configuration, specify the VMM cluster role name.
9. Enable **Sync cloud metadata**, if you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console. Click **Register** to complete the process.

    ![Server registration](./media/site-recovery-vmm-to-azure/provider16.PNG)
10. Registration starts. After registration finishes, the server is displayed in **Site Recovery Infrastructure** > **VMM Servers**.


## Install the Azure Recovery Services agent on Hyper-V hosts

1. After you've set up the Provider, you need to download the installation file for the Azure Recovery Services agent. Run setup on each Hyper-V server in the VMM cloud.

    ![Hyper-V sites](./media/site-recovery-vmm-to-azure/hyperv-agent1.png)
2. In **Prerequisites Check**, click **Next**. Any missing prerequisites will be automatically installed.

    ![Prerequisites Recovery Services Agent](./media/site-recovery-vmm-to-azure/hyperv-agent2.png)
3. In **Installation Settings**, accept or modify the installation location, and the cache location. You can configure the cache on a drive that has at least 5 GB of storage available but we recommend a cache drive with 600 GB or more of free space. Then click **Install**.
4. After installation is complete, click **Close** to finish.

    ![Register MARS Agent](./media/site-recovery-vmm-to-azure/hyperv-agent3.png)

### Command line installation
You can install the Microsoft Azure Recovery Services Agent from command line using the following command:

     marsagentinstaller.exe /q /nu

### Set up internet proxy access to Site Recovery from Hyper-V hosts

The Recovery Services agent running on Hyper-V hosts needs internet access to Azure for VM replication. If you're accessing the internet through a proxy, set it up as follows:

1. Open the Microsoft Azure Backup MMC snap-in on the Hyper-V host. By default, a shortcut for Microsoft Azure Backup is available on the desktop or in C:\Program Files\Microsoft Azure Recovery Services Agent\bin\wabadmin.
2. In the snap-in, click **Change Properties**.
3. On the **Proxy Configuration** tab, specify proxy server information.

    ![Register MARS Agent](./media/site-recovery-vmm-to-azure/mars-proxy.png)
4. Check that the agent can reach the URLs described in the [prerequisites](#on-premises-prerequisites).

## Set up the target environment
Specify the Azure storage account to be used for replication, and the Azure network to which Azure VMs will connect after failover.

1. Click **Prepare infrastructure** > **Target**, select the subscription and the resource group where you want to create the failed over virtual machines. Choose the deployment model that you want to use in Azure (classic or resource management) for the failed over virtual machines.

	![Storage](./media/site-recovery-vmm-to-azure/enablerep3.png)

2. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

  	![Storage](./media/site-recovery-vmm-to-azure/compatible-storage.png)

3. If you haven't created a storage account, and you want to create one using Resource Manager, click **+Storage account** to do that inline.  On the **Create storage account** blade specify an account name, type, subscription, and location. The account should be in the same location as the Recovery Services vault.

   ![Storage](./media/site-recovery-vmm-to-azure/gs-createstorage.png)


   * If you want to create a storage account using the classic model, do that in the Azure portal. [Learn more](../storage/storage-create-storage-account-classic-portal.md)
   * If you’re using a premium storage account for replicated data, set up an additional standard storage account, to store replication logs that capture ongoing changes to on-premises data.
5. If you haven't created an Azure network, and you want to create one using Resource Manager, click **+Network** to do that inline. On the **Create virtual network** blade specify a network name, address range, subnet details, subscription, and location. The network should be in the same location as the Recovery Services vault.

   ![Network](./media/site-recovery-vmm-to-azure/gs-createnetwork.png)

   If you want to create a network using the classic model, do that in the Azure portal. [Learn more](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).

### Configure network mapping

* [Read](#prepare-for-network-mapping) a quick overview of what network mapping does.
* Verify that virtual machines on the VMM server are connected to a VM network, and that you've created at least one Azure virtual network. Multiple VM networks can be mapped to a single Azure network.

Configure mapping as follows:

1. In **Site Recovery Infrastructure** > **Network mappings** > **Network Mapping**, click the **+Network Mapping** icon.

    ![Network mapping](./media/site-recovery-vmm-to-azure/network-mapping1.png)
2. In **Add network mapping**, select the source VMM server, and **Azure** as the target.
3. Verify the subscription and the deployment model after failover.
4. In **Source network**, select the source on-premises VM network you want to map from the list associated with the VMM server.
5. In **Target network**, select the Azure network in which replica Azure VMs will be located when they're created. Then click **OK**.

    ![Network mapping](./media/site-recovery-vmm-to-azure/network-mapping2.png)

Here's what happens when network mapping begins:

* Existing VMs on the source VM network are connected to the target network when mapping begins. New VMs connected to the source VM network are connected to the mapped Azure network when replication occurs.
* If you modify an existing network mapping, replica virtual machines connect using the new settings.
* If the target network has multiple subnets, and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine connects to that target subnet after failover.
* If there’s no target subnet with a matching name, the virtual machine connects to the first subnet in the network.

## Configure replication settings
1. To create a new replication policy, click **Prepare infrastructure** > **Replication Settings** > **+Create and associate**.

    ![Network](./media/site-recovery-vmm-to-azure/gs-replication.png)
2. In **Create and associate policy**, specify a policy name.
3. In **Copy frequency**, specify how often you want to replicate delta data after the initial replication (every 30 seconds, 5 or 15 minutes).

	> [!NOTE]
	>  A 30 second frequency isn't supported when replicating to premium storage. The limitation is determined by the number of snapshots per blob (100) supported by premium storage. [Learn more](../storage/storage-premium-storage.md#snapshots-and-copy-blob)

4. In **Recovery point retention**, specify in hours how long the retention window will be for each recovery point. Protected machines can be recovered to any point within a window.
5. In **App-consistent snapshot frequency**, specify how frequently (1-12 hours) recovery points containing application-consistent snapshots will be created. Hyper-V uses two types of snapshots — a standard snapshot that provides an incremental snapshot of the entire virtual machine, and an application-consistent snapshot that takes a point-in-time snapshot of the application data inside the virtual machine. Application-consistent snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken. Note that if you enable application-consistent snapshots, it will affect the performance of applications running on source virtual machines. Ensure that the value you set is less than the number of additional recovery points you configure.
6. In **Initial replication start time**, indicate when to start the initial replication. The replication occurs over your internet bandwidth so you might want to schedule it outside your busy hours.
7. In **Encrypt data stored on Azure**, specify whether to encrypt at rest data in Azure storage. Then click **OK**.

    ![Replication policy](./media/site-recovery-vmm-to-azure/gs-replication2.png)
8. When you create a new policy it's automatically associated with the VMM cloud. Click **OK**. You can associate additional VMM clouds (and the VMs in them) with this replication policy in **Replication** > policy name > **Associate VMM Cloud**.

    ![Replication policy](./media/site-recovery-vmm-to-azure/policy-associate.png)

## Capacity planning

Now that you have your basic infrastructure set up, think about capacity planning, and figure out whether you need additional resources.

Site Recovery provides a capacity planner to help you allocate the right resources for your source environment, Site Recovery components, networking, and storage. You can run the planner in quick mode for estimations based on an average number of VMs, disks, and storage, or in detailed mode in which you input figures at the workload level. Before you start:

* Gather information about your replication environment, including VMs, disks per VMs, and storage per disk.
* Estimate the daily change (churn) rate you’ll have for replicated data. You can use the [Capacity planner for Hyper-V Replica](https://www.microsoft.com/download/details.aspx?id=39057) to help you do this.

1. Click **Download**, to download the tool and then run it. [Read the article](site-recovery-capacity-planner.md) that accompanies the tool.
2. When you’re done, select **Yes** in **Have you run the Capacity Planner**?

   ![Capacity planning](./media/site-recovery-vmm-to-azure/gs-capacity-planning.png)

   Learn more about [controlling network bandwidth](#network-bandwidth-considerations)




## Enable replication

Before you start, ensure that your Azure user account has the required  [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) to enable replication of a new virtual machine to Azure.

Now enable replication as follows:

1. Click **Step 2: Replicate application** > **Source**. After you've enabled replication for the first time, click **+Replicate** in the vault to enable replication for additional machines.

    ![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication1.png)
2. In the **Source** blade, select the VMM server, and the cloud in which the Hyper-V hosts are located. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication-source.png)
3. In **Target**, select the subscription, post-failover deployment model, and the storage account you're using for replicated data.

    ![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication-target.png)
4. Select the storage account you want to use. If you want to use a different storage account than those you have, you can [create one](#set-up-an-azure-storage-account). If you’re using a premium storage account for replicated data, you need to select  an additional standard storage account to store replication logs that capture ongoing changes to on-premises data.To create a storage account using the Resource Manager model click **Create new**. If you want to create a storage account using the classic model, do that [in the Azure portal](../storage/storage-create-storage-account-classic-portal.md). Then click **OK**.
5. Select the Azure network and subnet to which Azure VMs will connect, when they're created after failover. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later**, to select the Azure network per machine. If you want to use a different network from those you have, you can [create one](#set-up-an-azure-network). To create a network using the Resource Manager model click **Create new**. If you want to create a network using the classic model, do that [in the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md). Select a subnet if applicable. Then click **OK**.
6. In **Virtual Machines** > **Select virtual machines**, click and select each machine you want to replicate. You can only select machines for which replication can be enabled. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication5.png)

7. In **Properties** > **Configure properties**, select the operating system for the selected VMs, and the OS disk.

    - Verify that the Azure VM name (target name) complies with [Azure virtual machine requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).   
    - By default all the disks of the VM are selected for replication, but you can clear disks to exclude them.

        - You might want to exclude disks to reduce replication bandwidth. For example, you might not want to replicate disks with temporary data, or data that's refreshed each time a machine or apps restarts (such as pagefile.sys or Microsoft SQL Server tempdb). You can exclude the disk from replication by unselecting the disk.
        - Only basic disks can be exclude. You can't exclude OS disks.
        - We recommend that you don't exclude dynamic disks. Site Recovery can't identify whether a virtual hard disk inside a guest VM is basic or dynamic. If all dependent dynamic volume disks aren't excluded, the protected dynamic disk will show as a failed disk when the VM fails over, and the data on that disk won't be accessible.
        - After replication is enabled, you can't add or remove disks for replication. If you want to add or exclude a disk, you need to disable protection for the VM, and then re-enable it.
        - Disks you create manually in Azure aren't failed back. For example, if you fail over three disks, and create two directly in Azure VM, only the three disks which were failed over will be failed back from Azure to Hyper-V. You can't include disks created manually in failback, or in reverse replication from Hyper-V to Azure.
        - If you exclude a disk that's needed for an application to operate, after failover to Azure you need to create it manually in Azure, so that the replicated application can run. Alternatively, you could integrate Azure automation into a recovery plan, to create the disk during failover of the machine.

    Click **OK** to save changes. You can set additional properties later.

	![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication6-with-exclude-disk.png)

8. In **Replication settings** > **Configure replication settings**, select the replication policy you want to apply for the protected VMs. Then click **OK**. You can modify the replication policy in **Replication policies** > policy name > **Edit Settings**. Changes you apply are used for machines that are already replicating, and new machines.

   ![Enable replication](./media/site-recovery-vmm-to-azure/enable-replication7.png)

You can track progress of the **Enable Protection** job in **Jobs** > **Site Recovery jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.

### View and manage VM properties

We recommend that you verify the properties of the source machine. Remember that the Azure VM name should conform with [Azure virtual machine requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).

1. In **Protected Items**, click **Replicated Items**, and select the machine to see its details.

    ![Enable replication](./media/site-recovery-vmm-to-azure/vm-essentials.png)
2. In **Properties**, you can view replication and failover information for the VM.

    ![Enable replication](./media/site-recovery-vmm-to-azure/test-failover2.png)
3. In **Compute and Network** > **Compute properties**, you can specify the Azure VM name and target size. Modify the name to comply with [Azure requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) if you need to. You can also view and modify information about the target network, subnet, and the IP address that's assigned to the Azure VM.
Note that:

   * You can set the target IP address. If you don't provide an address, the failed over machine will use DHCP. If you set an address that isn't available at failover, the failover will fail. The same target IP address can be used for test failover if the address is available in the test failover network.
   * The number of network adapters is dictated by the size you specify for the target virtual machine, as follows:

     * If the number of network adapters on the source machine is less than or equal to the number of adapters allowed for the target machine size, then the target will have the same number of adapters as the source.
     * If the number of adapters for the source virtual machine exceeds the number allowed for the target size, then the target size maximum is used.
     * For example if a source machine has two network adapters and the target machine size supports four, the target machine will have two adapters. If the source machine has two adapters but the supported target size only supports one, then the target machine will have only one adapter.     
     * If the VM has multiple network adapters, they will all connect to the same network.

     ![Enable replication](./media/site-recovery-vmm-to-azure/test-failover4.png)

4. In **Disks** you can see the operating system and data disks on the VM that will be replicated.

#### Managed disks

In **Compute and Network** > **Compute properties**, you can set "Use managed disks" setting to "Yes" for the VM if you want to attach managed disks to your machine on migration to Azure. Managed disks simplifies disk management for Azure IaaS VMs by managing the storage accounts associated with the VM disks. [Learn More about managed disks](https://docs.microsoft.com/en-us/azure/storage/storage-managed-disks-overview).

   - Managed disks are created and attached to the virtual machine only on a failover to Azure. On enabling protection, data from on-premises machines will continue to replicate to storage accounts.
   Managed disks can be created only for virtual machines deployed using the Resource manager deployment model.  

  > [!NOTE]
  > Failback from Azure to on-premises Hyper-V environment is not currently supported for machines
  > with managed disks. Set "Use managed disks" to "Yes" only if you intend to migrate this machine to
  > Azure.

   - When you set "Use managed disks" to "Yes", only availability sets in the resource group with "Use managed disks" set to "Yes" would be available for selection. This is because virtual machines with managed disks can only be part of availability sets with "Use managed disks" property set to "Yes". Make sure that you create availability sets with "Use managed disks" property set based on your intent to use managed disks on failover.  Likewise, when you set "Use managed disks" to "No", only availability sets in the resource group with "Use managed disks" property set to "No" would be available for selection. [Learn more about managed disks and availability sets](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/manage-availability#use-managed-disks-for-vms-in-an-availability-set).

  > [!NOTE]
  > If the storage account used for replication was encrypted with Storage Service Encryption at any
  > point in time, creation of managed disks during failover will fail. You can either set "Use
  > managed disks" to "No" and retry failover or disable protection for the virtual machine and
  > protect it to a storage account which did not have Storage service encryption enabled at any point
  > in time.
  > [Learn more about Storage service encryption and managed disks](https://docs.microsoft.com/en-us/azure/storage/storage-managed-disks-overview#managed-disks-and-encryption).


## Test the deployment

To test the deployment you can run a test failover for a single virtual machine or a recovery plan that contains one or more virtual machines.

### Before you start

 - If you want to connect to Azure VMs using RDP after failover, learn about [preparing to connect](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover).
 - To fully test you need to copy of Active Directory and DNS in your test environment. [Learn more](site-recovery-active-directory.md#test-failover-considerations).

### Run a test failover

1. To fail over a single VM, in **Replicated Items**, click the VM > **+Test Failover**.
2. To fail over a recovery plan, in **Recovery Plans**, right-click the plan > **Test Failover**. To create a recovery plan, [follow these instructions](site-recovery-create-recovery-plans.md).
3. In **Test Failover**, select the Azure network to which Azure VMs connect after failover occurs.
4. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its properties, or on the **Test Failover** job in **Site Recovery jobs**.
5. After the failover completes, you should also be able to see the replica Azure machine appear in the Azure portal > **Virtual Machines**. You should make sure that the VM is the appropriate size, that it's connected to the appropriate network, and is running.
6. If you prepared for connections after failover, you should be able to connect to the Azure VM.
7. Once you're done, click on **Cleanup test failover** on the recovery plan. In **Notes** record and save any observations associated with the test failover. This will delete the virtual machines that were created during test failover.

For more details, read the [Test failover to Azure](site-recovery-test-failover-to-azure.md) article.

## Monitor the deployment

Here's how you can monitor configuration settings, status, and health for the Site Recovery deployment:

1. Click on the vault name to access the **Essentials** dashboard. In this dashboard you can Site Recovery jobs, replication status, recovery plans, server health, and events.  You can customize **Essentials** to show the tiles and layouts that are most useful to you, including the status of other Site Recovery and Backup vaults.

    ![Essentials](./media/site-recovery-vmm-to-azure/essentials.png)
2. In **Health**, you can monitor issues on on-premises servers (VMM or configuration servers), and the events raised by Site Recovery in the last 24 hours.
3. In the **Replicated Items**, **Recovery Plans**, and **Site Recovery Jobs** tiles you can manage and monitor replication. You can drill into jobs in **Jobs** > **Site Recovery Jobs**.

## Command-line installation for the Azure Site Recovery Provider

The Azure Site Recovery Provider can be installed from the command-line. This method can be used to install the Provider on Server Core for Windows Server 2012 R2.

1. Download the Provider installation file and registration key to a folder. For example, C:\ASR.
2. From an elevated command prompt, run these commands to extract the Provider installer:

            C:\Windows\System32> CD C:\ASR
            C:\ASR> AzureSiteRecoveryProvider.exe /x:. /q
3. Run this command to install the components:

            C:\ASR> setupdr.exe /i
4. Then run these commands, to register the server in the vault:

        CD C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin
        C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin\> DRConfigurator.exe /r  /Friendlyname <friendly name of the server> /Credentials <path of the credentials file> /EncryptionEnabled <full file name to save the encryption certificate>       

Where:

* **/Credentials**: Mandatory parameter that specifies where the registration key file is located.  
* **/FriendlyName**: Mandatory parameter for the name of the Hyper-V host server that appears in the Azure Site Recovery portal.
* * **/EncryptionEnabled**: Optional parameter when you're replicating Hyper-V VMs in VMM clouds to Azure. Specify if you want to encrypt virtual machines in Azure (at rest encryption). Ensure that the name of the file has a **.pfx** extension. Encryption is off by default.
* **/proxyAddress**: Optional parameter that specifies the address of the proxy server.
* **/proxyport**: Optional parameter that specifies the port of the proxy server.
* **/proxyUsername**: Optional parameter that specifies the proxy user name (if proxy requires authentication).
* **/proxyPassword**: Optional parameter that specifies the password to authenticate with proxy server (if the proxy requires authentication).


### Network bandwidth considerations
You can use the capacity planner tool to calculate the bandwidth you need for replication (initial replication and then delta). To control the amount of bandwidth use for replication, you have a few options:

* **Throttle bandwidth**: Hyper-V traffic that replicates to a secondary site goes through a specific Hyper-V host. You can throttle bandwidth on the host server.
* **Tweak bandwidth**: You can influence the bandwidth used for replication using a couple of registry keys.

#### Throttle bandwidth
1. Open the Microsoft Azure Backup MMC snap-in on the Hyper-V host server. By default, a shortcut for Microsoft Azure Backup is available on the desktop or in C:\Program Files\Microsoft Azure Recovery Services Agent\bin\wabadmin.
2. In the snap-in, click **Change Properties**.
3. On the **Throttling** tab, select **Enable internet bandwidth usage throttling for backup operations**, and set the limits for work and non-work hours. Valid ranges are from 512 Kbps to 102 Mbps per second.

    ![Throttle bandwidth](./media/site-recovery-vmm-to-azure/throttle2.png)

You can also use the [Set-OBMachineSetting](https://technet.microsoft.com/library/hh770409.aspx) cmdlet to set throttling. Here's a sample:

    $mon = [System.DayOfWeek]::Monday
    $tue = [System.DayOfWeek]::Tuesday
    Set-OBMachineSetting -WorkDay $mon, $tue -StartWorkHour "9:00:00" -EndWorkHour "18:00:00" -WorkHourBandwidth  (512*1024) -NonWorkHourBandwidth (2048*1024)

**Set-OBMachineSetting -NoThrottle** indicates that no throttling is required.

#### Influence network bandwidth
The **UploadThreadsPerVM** registry value controls the number of threads that are used for data transfer (initial or delta replication) of a disk. A higher value increases the network bandwidth used for replication. The **DownloadThreadsPerVM** registry value specifies the number of threads used for data transfer during failback.

1. In the registry, navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Replication**.

   * Modify the value **UploadThreadsPerVM** (or create the key if it doesn't exist) to control threads used for disk replication.
   * Modify the value **DownloadThreadsPerVM** (or create the key if it doesn't exist) to control threads used for failback traffic from Azure.
2. The default value is 4. In an “overprovisioned” network, these registry keys should be changed from the default values. The maximum is 32. Monitor traffic to optimize the value.

## Next steps

After initial replication is complete, and you've tested the deployment, you can invoke failovers as the need arises. [Learn more](site-recovery-failover.md) about different types of failovers and how to run them.
