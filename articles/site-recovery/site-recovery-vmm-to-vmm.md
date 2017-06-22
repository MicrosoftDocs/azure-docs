---
title: Replicate Hyper-V VMs to a secondary site with Azure Site Recovery | Microsoft Docs
description: Describes how to replicate Hyper-V VMs in VMM clouds to a secondary VMM site using the Azure portal.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: b33a1922-aed6-4916-9209-0e257620fded
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: raynew

---
# Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site using the Azure portal
> [!div class="op_single_selector"]
> * [Azure portal](site-recovery-vmm-to-vmm.md)
> * [Classic portal](site-recovery-vmm-to-vmm-classic.md)
> * [PowerShell - Resource Manager](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
>
>

This article describes how to replicate on-premises Hyper-V virtual machines managed in System Center Virtual Machine Manager (VMM) clouds, to a secondary site using [Azure Site Recovery](site-recovery-overview.md) in the Azure portal. Learn more about this [scenario architecture](site-recovery-components.md#hyper-v-to-a-secondary-site).

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Prerequisites

**Prerequisite** | **Details**
--- | ---
**Azure** | You need a [Microsoft Azure](http://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.
**On-premises VMM** | We recommend you have two VMM servers, one in the primary site, and one in the secondary.<br/><br/> You can replicate between clouds on a single VMM server.<br/><br/> VMM servers should be running at least System Center 2012 SP1 with the latest updates.<br/><br/> VMM servers need internet access.
**VMM clouds** | Each VMM server must have at one or more clouds, and all clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more VMM host groups.<br/><br/> If you only have one VMM server, it needs at least two clouds, to act as primary and secondary.
**Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role, and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, install [update 2961977](https://support.microsoft.com/kb/2961977)<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012, cluster broker isn't created automatically if you have a static IP address-based cluster. Configure the cluster broker manually. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx).<br/><br/> Hyper-V servers need internet access.
**URLs** | VMM servers and Hyper-V hosts should be able to reach these URLs:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]

## Deployment steps

Here's what you do:

1. Verify prerequisites.
2. Prepare the VMM server and Hyper-V hosts.
3. Create a Recovery Services vault. The vault contains configuration settings, and orchestrates replication.
4. Specify source, target, and replication settings.
5. Deploying the Mobility service on VMs you want to replicate.
6. Prepare for replication, and enable replication for Hyper-V VMs.
7. Run a test failover to make sure everything's working as expected.

## Prepare VMM servers and Hyper-V hosts

To prepare for deployment:

1. Make sure the VMM server and Hyper-V hosts comply with the prerequisites described above, and can reach the required URLs.
2. Set up VMM networks so that you can configure [network mapping](#network-mapping-overview).

    - Make sure that VMs on the source Hyper-V host server are connected to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.
    Verify that the secondary cloud that you use for recovery has a corresponding VM network configured. That VM network should be linked to a logical network that's associated with the secondary cloud.

3. Prepare for a [single server deployment](#single-vmm-server-deployment), if you want to replicate VMs between clouds on the same VMM server.

## Create a Recovery Services vault
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Management** > **Recovery Services**.
3. In **Name**, specify a friendly name to identify the vault. If you have more than one subscription, select one of them.
4. [Create a resource group](../azure-resource-manager/resource-group-template-deploy-portal.md), or select an existing one. Specify an Azure region. Machines are replicated to this region. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/)
5. If you want to quickly access the vault from the Dashboard, click **Pin to dashboard** > **Create vault**.

    ![New vault](./media/site-recovery-vmm-to-vmm/new-vault-settings.png)

The new vault appears on the **Dashboard**, in **All resources**, and on the main **Recovery Services vaults** blade.


## Choose a protection goal

Select what you want to replicate and where you want to replicate to.

2. Click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.
3. Select **To recovery site**, and select **Yes, with Hyper-V**.
4. Select **Yes** to indicate you're using VMM to manage the Hyper-V hosts.
5. Select **Yes** if you have a secondary VMM server. If you're deploying replication between clouds on a single VMM server, click **No**. Then click **OK**.

    ![Choose goals](./media/site-recovery-vmm-to-vmm/choose-goals.png)

## Set up the source environment

Install the Azure Site Recovery Provider on VMM servers, and discover and register servers in the vault.

1. Click **Step 1: Prepare Infrastructure** > **Source**.

    ![Set up source](./media/site-recovery-vmm-to-vmm/goals-source.png)
2. In **Prepare source**, click **+ VMM** to add a VMM server.

    ![Set up source](./media/site-recovery-vmm-to-vmm/set-source1.png)
3. In **Add Server**, check that **System Center VMM server** appears in **Server type** and that the VMM server meets the [prerequisites](#prerequisites).
4. Download the Azure Site Recovery Provider installation file.
5. Download the registration key. You need this when you run setup. The key is valid for five days after you generate it.

    ![Set up source](./media/site-recovery-vmm-to-vmm/set-source3.png)
6. Install the Azure Site Recovery Provider on the VMM server. You don't need to explicitly install anything on Hyper-V host servers.


### Install the Azure Site Recovery Provider

1. Run the Provider setup file on each VMM server. If VMM is deployed in a cluster, do the following the first time you install:
    -  Install the provider on an active node, and finish the installation to register the VMM server in the vault.
    - Then, install the Provider on the other nodes. Cluster nodes should all run the same version of the Provider.
2. Setup runs a few prerequisite checks, and requests permission to stop the VMM service. The VMM service will be restarted automatically when setup finishes. If you install on a VMM cluster, you're prompted to stop the Cluster role.
3. In **Microsoft Update**, you can opt in to specify that provider updates are installed in accordance with your Microsoft Update policy.
4. In **Installation**, accept or modify the default installation location, and click **Install**.

    ![Install location](./media/site-recovery-vmm-to-vmm/provider-location.png)
5. After installation is complete, click **Register** to register the server in the vault.

    ![Install location](./media/site-recovery-vmm-to-vmm/provider-register.png)
6. In **Vault name**, verify the name of the vault in which the server will be registered. Click *Next*.

    ![Server registration](./media/site-recovery-vmm-to-vmm-classic/vaultcred.PNG)
7. In **Internet Connection**, specify how the provider running on the VMM server connects to Azure.

    ![Internet Settings](./media/site-recovery-vmm-to-vmm-classic/proxydetails.PNG)

   - You can specify that the provider should connect directly to the internet, or via a proxy.
   - Specify proxy settings if needed.
   - If you use a proxy, a VMM RunAs account (DRAProxyAccount) is created automatically using the specified proxy credentials. Configure the proxy server so that this account can authenticate successfully. The RunAs account settings can be modified in the VMM console > **Settings** > **Security** > **Run As Accounts**. Restart the VMM service to update changes.
8. In **Registration Key**, select the key that you downloaded from Azure Site Recovery and copied to the VMM server.
9. The encryption setting is only used when you're replicating Hyper-V VMs in VMM clouds to Azure. If you're replicating to a secondary site it's not used.
10. In **Server name**, specify a friendly name to identify the VMM server in the vault. In a cluster configuration specify the VMM cluster role name.
11. In **Synchronize cloud metadata**, select whether you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked, and synchronize each cloud individually in the cloud properties in the VMM console.
12. Click **Next** to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed on the **VMM Servers** tab on the **Servers** page in the vault.

    ![Server](./media/site-recovery-vmm-to-vmm-classic/provider13.PNG)
13. After the server is available in the Site Recovery console, in **Source** > **Prepare source** select the VMM server, and select the cloud in which the Hyper-V host is located. Then click **OK**.

You can also install the provider from the command line:

[!INCLUDE [site-recovery-rw-provider-command-line](../../includes/site-recovery-rw-provider-command-line.md)]


## Set up the target environment

Select the target VMM server and cloud.

1. Click **Prepare infrastructure** > **Target**, and select the target VMM server you want to use.
2. Clouds on the server that are synchronized with Site Recovery will be displayed. Select the target cloud.

   ![Target](./media/site-recovery-vmm-to-vmm/target-vmm.png)

## Set up replication settings

- When you create a replication policy, all host using the policy must have the same operating system. The VMM cloud can contain Hyper-V hosts running different versions of Windows Server, but in this case, you need multiple replication policies.
- You can perform the initial replication offline. [Learn more](#prepare-for-initial-offline-replication)

1. To create a new replication policy click **Prepare infrastructure** > **Replication Settings** > **+Create and associate**.

    ![Network](./media/site-recovery-vmm-to-vmm/gs-replication.png)
2. In **Create and associate policy**, specify a policy name. The source and target type should be **Hyper-V**.
3. In **Hyper-V host version**, select which operating system is running on the host.
4. In **Authentication type** and **Authentication port**, specify how traffic is authenticated between the primary and recovery Hyper-V host servers. Select **Certificate** unless you have a working Kerberos environment. Azure Site Recovery will automatically configure certificates for HTTPS authentication. You don't need to do anything manually. By default, port 8083 and 8084 (for certificates) will be opened in the Windows Firewall on the Hyper-V host servers. If you do select **Kerberos**, a Kerberos ticket will be used for mutual authentication of the host servers. Note that this setting is only relevant for Hyper-V host servers running on Windows Server 2012 R2.
5. In **Copy frequency**, specify how often you want to replicate delta data after the initial replication (every 30 seconds, 5 or 15 minutes).
6. In **Recovery point retention**, specify in hours how long the retention window will be for each recovery point. Protected machines can be recovered to any point within a window.
7. In **App-consistent snapshot frequency**, specify how frequently (1-12 hours) recovery points containing application-consistent snapshots are created. Hyper-V uses two types of snapshots — a standard snapshot that provides an incremental snapshot of the entire virtual machine, and an application-consistent snapshot that takes a point-in-time snapshot of the application data inside the virtual machine. Application-consistent snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken. If you enable application-consistent snapshots, it will affect the performance of applications running on source virtual machines. Ensure that the value you set is less than the number of additional recovery points you configure.
8. In **Data transfer compression**, specify whether replicated data that is transferred should be compressed.
9. Select **Delete replica VM**, to specify that the replica virtual machine should be deleted if you disable protection for the source VM. If you enable this setting, when you disable protection for the source VM it's removed from the Site Recovery console, Site Recovery settings for the VMM are removed from the VMM console, and the replica is deleted.
10. In **Initial replication method**, if you're replicating over the network, specify whether to start the initial replication or schedule it. To save network bandwidth, you might want to schedule it outside your busy hours. Then click **OK**.

     ![Replication policy](./media/site-recovery-vmm-to-vmm/gs-replication2.png)
11. When you create a new policy it's automatically associated with the VMM cloud. In **Replication policy**, click **OK**. You can associate additional VMM Clouds (and the VMs in them) with this replication policy in **Replication** > policy name > **Associate VMM Cloud**.

     ![Replication policy](./media/site-recovery-vmm-to-vmm/policy-associate.png)


### Configure network mapping

- Learn about [network mapping](#prepare-for-network-mapping) before you start.
- Verify that virtual machines on VMM servers are connected to a VM network.


1. In **Site Recovery Infrastructure** > **Network Mapping** > **Network mappings**, click **+Network Mapping**.

    ![Network mapping](./media/site-recovery-vmm-to-azure/network-mapping1.png)
2. In **Add network mapping** tab, select the source and target VMM servers. The VM networks associated with the VMM servers are retrieved.
3. In **Source network**, select the network you want to use from the list of VM networks associated with the primary VMM server.
4. In **Target network**, select the network you want to use on the secondary VMM server. Then click **OK**.

    ![Network mapping](./media/site-recovery-vmm-to-vmm/network-mapping2.png)

Here's what happens when network mapping begins:

* Any existing replica virtual machines that correspond to the source VM network will be connected to the target VM network.
* New virtual machines that are connected to the source VM network will be connected to the target mapped network after replication.
* If you modify an existing mapping with a new network, replica virtual machines will be connected using the new settings.
* If the target network has multiple subnets and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.

### Configure storage mapping.

[Storage mapping](#prepare-for-storage-mapping) isn't supported in the new Azure portal. However, it can be enabled using Powershell. [Learn more](site-recovery-vmm-to-vmm-powershell-resource-manager.md#step-7-configure-storage-mapping).

## Step 5: Capacity planning

Now that you have your basic infrastructure set up, think about capacity planning, and figure out whether you need additional resources.

- Download and run the [Azure Site Recovery Capacity planner](site-recovery-capacity-planner.md), to gather information about your replication environment, including VMs, disks per VM, and storage per disk.
- After you've collected real-time replication information, you can modify the NetQos policy to control replication bandwidth for VMs. Read more about [Throttling Hyper-V Replica Traffic](http://www.thomasmaurer.ch/2013/12/throttling-hyper-v-replica-traffic/), on Thomas Maurer's blog. Get more information about the [New-NetQosPolicy cmdlet](https://technet.microsoft.com/library/hh967468.aspx.).

## Enable replication

1. Click **Step 2: Replicate application** > **Source**. After you've enabled replication for the first time, you click **+Replicate** in the vault to enable replication for additional machines.

    ![Enable replication](./media/site-recovery-vmm-to-vmm/enable-replication1.png)
2. In **Source**, select the VMM server, and the cloud in which the Hyper-V hosts you want to replicate are located. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmm-to-vmm/enable-replication2.png)
3. In **Target**, verify the secondary VMM server and cloud.
4. In **Virtual machines**, select the VMs you want to protect from the list.

    ![Enable virtual machine protection](./media/site-recovery-vmm-to-vmm/enable-replication5.png)

You can track progress of the **Enable Protection** action in **Jobs** > **Site Recovery jobs**. After the **Finalize Protection** job completes, the virtual machine is ready for failover.

Note that:

- You can also enable protection for virtual machines in the VMM console. Click **Enable Protection** on the toolbar in the virtual machine properties > **Azure Site Recovery** tab.
- After you've enabled replication, you can view properties for the VM in **Replicated Items**. On the **Essentials** dashboard, you can see information about the replication policy for the VM and its status. Click **Properties** for more details.

### Onboard existing virtual machines
If you have existing virtual machines in VMM that are replicating with Hyper-V Replica, you can onboard them for Azure Site Recovery replication as follows:

1. Ensure that the Hyper-V server hosting the existing VM is located in the primary cloud, and that the Hyper-V server hosting the replica virtual machine is located in the secondary cloud.
2. Make sure a replication policy is configured for the primary VMM cloud.
3. Enable replication for the primary virtual machine. Azure Site Recovery and VMM ensure that the same replica host and virtual machine is detected, and Azure Site Recovery will reuse and reestablish replication using the specified settings.

## Test your deployment

To test your deployment, you can run a [test failover](site-recovery-test-failover-vmm-to-vmm.md) for a single virtual machine, or [create a recovery plan](site-recovery-create-recovery-plans.md) that contains one or more virtual machines.



## Prepare for offline initial replication

You can do offline replication for the initial data copy. You can prepare this as follows:

* On the source server, you specify a path location from which the data export will take place. Assign Full Control for NTFS and, Share permissions to the VMM service on the export path. On the target server, you specify a path location from which the data import will occur. Assign the same permissions on this import path.
* If the import or export path is shared, assign Administrator, Power User, Print Operator, or Server Operator group membership for the VMM service account on the remote computer on which the shared is located.
* If you're using any Run As accounts to add hosts, on the import and export paths, assign read and write permissions to the Run As accounts in VMM.
* The import and export shares should not be located on any computer used as a Hyper-V host server, because loopback configuration is not supported by Hyper-V.
* In Active Directory, on each Hyper-V host server that contains virtual machines you want to protect, enable and configure constrained delegation to trust the remote computers on which the import and export paths are located, as follows:
  1. On the domain controller, open **Active Directory Users and Computers**.
  2. In the console tree, click **DomainName** > **Computers**.
  3. Right-click the Hyper-V host server name > **Properties**.
  4. On the **Delegation** tab, click **Trust this computer for delegation to specified services only**.
  5. Click **Use any authentication protocol**.
  6. Click **Add** > **Users and Computers**.
  7. Type the name of the computer that hosts the export path > **OK**. From the list of available services, hold down the CTRL key and click **cifs** > **OK**. Repeat for the name of the computer that hosts the import path. Repeat as necessary for additional Hyper-V host servers.



## Prepare for network mapping
Network mapping maps between VMM VM networks on the primary and secondary VMM servers to:

* Optimally place replica VMs on secondary Hyper-V hosts after failover.
* Connect replica VMs to appropriate VM networks after failover.

Note that:
- Network mapping can be configured between VM networks on two VMM servers, or on a single VMM server if two sites are managed by the same server.
- When mapping is configured correctly and replication is enabled, a VM at the primary location will be connected to a network, and its replica at the target location will be connected to its mapped network.
- If networks have been set up correctly in VMM, when you select a target VM network during network mapping, the VMM source clouds that use the source VM network will be displayed, along with the available target VM networks on the target clouds that are used for protection.
- If the target network has multiple subnets and one of those subnets has the same name as the subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.


Here’s an example to illustrate this mechanism. Let’s take an organization with two locations in New York and Chicago.

| **Location** | **VMM server** | **VM networks** | **Mapped to** |
| --- | --- | --- | --- |
| New York |VMM-NewYork |VMNetwork1-NewYork |Mapped to VMNetwork1-Chicago |
| VMNetwork2-NewYork |Not mapped | | |
| Chicago |VMM-Chicago |VMNetwork1-Chicago |Mapped to VMNetwork1-NewYork |
| VMNetwork2-Chicago |Not mapped | | |

With this example:

* When a replica virtual machine is created for any virtual machine that is connected to VMNetwork1-NewYork, it will be connected to VMNetwork1-Chicago.
* When a replica virtual machine is created for VMNetwork2-NewYork or VMNetwork2-Chicago, it will not be connected to any network.

Here's how VMM clouds are set up in our example organization, and the logical networks associated with the clouds.

### Cloud protection settings
| **Protected cloud** | **Protecting cloud** | **Logical network (New York)** |
| --- | --- | --- |
| GoldCloud1 |GoldCloud2 | |
| SilverCloud1 |SilverCloud2 | |
| GoldCloud2 |<p>NA</p><p></p> |<p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p> |
| SilverCloud2 |<p>NA</p><p></p> |<p>LogicalNetwork1-NewYork</p><p>LogicalNetwork1-Chicago</p> |

### Logical and VM network settings
| **Location** | **Logical network** | **Associated VM network** |
| --- | --- | --- |
| New York |LogicalNetwork1-NewYork |VMNetwork1-NewYork |
| Chicago |LogicalNetwork1-Chicago |VMNetwork1-Chicago |
| LogicalNetwork2Chicago |VMNetwork2-Chicago | |

### Target networks
Based on these settings, when you select the target VM network, the following table shows the choices that will be available.

| **Select** | **Protected cloud** | **Protecting cloud** | **Target network available** |
| --- | --- | --- | --- |
| VMNetwork1-Chicago |SilverCloud1 |SilverCloud2 |Available |
| GoldCloud1 |GoldCloud2 |Available | |
| VMNetwork2-Chicago |SilverCloud1 |SilverCloud2 |Not available |
| GoldCloud1 |GoldCloud2 |Available | |


### Failback
To see what happens in the case of failback (reverse replication), let’s assume that VMNetwork1-NewYork is mapped to VMNetwork1-Chicago, with the following settings.

| **Virtual machine** | **Connected to VM network** |
| --- | --- |
| VM1 |VMNetwork1-Network |
| VM2 (replica of VM1) |VMNetwork1-Chicago |

With these settings, let's review what happens in a couple of possible scenarios.

| **Scenario** | **Outcome** |
| --- | --- |
| No change in the network properties of VM-2 after failover. |VM-1 remains connected to the source network. |
| Network properties of VM-2 are changed after failover and is disconnected. |VM-1 is disconnected. |
| Network properties of VM-2 are changed after failover and is connected to VMNetwork2-Chicago. |If VMNetwork2-Chicago isn’t mapped, VM-1 will be disconnected. |
| Network mapping of VMNetwork1-Chicago is changed. |VM-1 will be connected to the network now mapped to VMNetwork1-Chicago. |


## Prepare for single server deployment


If you only have a single VMM server, you can replicate VMs in Hyper-V hosts in the VMM cloud to [Azure](site-recovery-vmm-to-azure.md) or to a secondary VMM cloud. We recommend the first option because replicating between clouds isn't seamless. If you do want to replicate between clouds, you can replicate with a single standalone VMM server, or with a single VMM server deployed in a stretched Windows cluster

### Standalone VMM server

In this scenario, you deploy the single VMM server as a virtual machine in the primary site, and replicate this VM to a secondary site using Site Recovery and Hyper-V Replica.

1. **Set up VMM on a Hyper-V VM**. We suggest that you colocate the SQL Server instance used by VMM on the same VM. This saves time as only one VM has to be created. If you want to use remote instance of SQL Server and an outage occurs, you need to recover that instance before you can recover VMM.
2. **Ensure the VMM server has at least two clouds configured**. One cloud will contain the VMs you want to replicate and the other cloud will serve as the secondary location. The cloud that contains the VMs you want to protect should comply with [prerequisites](#prerequisites).
3. Set up Site Recovery as described in this article. Create and register the VMM server in a vault, set up a replication policy, and enable replication. The source and target VMM names will be the same. Specify that initial replication takes place over the network.
4. When you set up network mapping you map the VM network for the primary cloud to the VM network for the secondary cloud.
5. In the Hyper-V Manager console, enable Hyper-V Replica on the Hyper-V host that contains the VMM VM, and enable replication on the VM. Make sure you don't add the VMM virtual machine to clouds that are protected by Site Recovery, to ensure that Hyper-V Replica settings aren't overridden by Site Recovery.
6. If you create recovery plans for failover you use the same VMM server for source and target.
7. In a complete outage, you fail over and recover as follows:

   1. Run an unplanned failover in the Hyper-V Manager console in the secondary site, to fail over the primary VMM VM to the secondary site.
   2. Verify that the VMM VM is up and running, and in the vault, run an unplanned failover to fail over the VMs from primary to secondary clouds. Commit the failover, and select an alternate recovery point if required.
   3. After the unplanned failover is complete, all resources can be accessed from the primary site again.
   4. When the primary site is available again, in the Hyper-V Manager console in the secondary site, enable reverse replication for the VMM VM. This starts replication for the VM from secondary to primary.
   5. Run a planned failover in the Hyper-V Manager console in the secondary site, to fail over the VMM VM to the primary site. Commit the failover. Then enable reverse replication, so that the VMM VM is again replicating from primary to secondary.
   6. In the Recovery Services vault, enable reverse replication for the workload VMs, to start replicating them from secondary to primary.
   7. In the Recovery Services vault, run a planned failover to fail back the workload VMs to the primary site. Commit the failover to complete it. Then enable reverse replication to start replicating the workload VMs from primary to secondary.

### Stretched VMM cluster

Instead of deploying a standalone VMM server as a VM that replicates to a secondary site, you can make VMM highly available by deploying it as a VM in a Windows failover cluster. This provides workload resilience and protection against hardware failure. To deploy with Site Recovery the VMM VM should be deployed in a stretch cluster across geographically separate sites. To do this:

1. Install VMM on a virtual machine in a Windows failover cluster, and select the option to run the server as highly available during setup.
2. The SQL Server instance that's used by VMM should be replicated with SQL Server AlwaysOn availability groups, so that there's a replica of the database in the secondary site.
3. Follow the instructions in this article to create a vault, register the server, and set up protection. You need to register each VMM server in the cluster in the Recovery Services vault. To do this, you install the Provider on an active node, and register the VMM server. Then you install the Provider on other nodes.
4. When an outage occurs, the VMM server and its corresponding SQL Server database are failed over, and accessed from the secondary site.



## Prepare for storage mapping


You set up storage mapping by mapping storage classifications on a source and target VMM servers to do the following:

  * **Identify target storage for replica virtual machines**—A source VM hard disk will replicate to the storage that you specified (SMB share or cluster shared volumes (CSVs)) in the target location.
  * **Replica virtual machine placement**—Storage mapping is used to optimally place replica virtual machines on Hyper-V host servers. Replica virtual machines will be placed on hosts that can access the mapped storage classification.
  * **No storage mapping**—If you don’t configure storage mapping, virtual machines will be replicated to the default storage location specified on the Hyper-V host server associated with the replica virtual machine.

Note that:
- You can set up mapping between two VMM clouds on a single server.
- Storage classifications must be available to the host groups located in source and target clouds.
- Classifications don’t need to have the same type of storage. For example, you can map a source classification that contains SMB shares to a target classification that contains CSVs.

### Example
If classifications are configured correctly in VMM when you select the source and target VMM server during storage mapping, the source and target classifications will be displayed. Here’s an example of storage files shares and classifications for an organization with two locations in New York and Chicago.

| **Location** | **VMM server** | **File share (source)** | **Classification (source)** | **Mapped to** | **File share (target)** |
| --- | --- | --- | --- | --- | --- |
| New York |VMM_Source |SourceShare1 |GOLD |GOLD_TARGET |TargetShare1 |
| SourceShare2 |SILVER |SILVER_TARGET |TargetShare2 | | |
| SourceShare3 |BRONZE |BRONZE_TARGET |TargetShare3 | | |
| Chicago |VMM_Target | |GOLD_TARGET |Not mapped | |
|  |SILVER_TARGET |Not mapped | | | |
|  |BRONZE_TARGET |Not mapped | | | |

With this example:

* When a replica virtual machine is created for any virtual machine on GOLD storage (SourceShare1), it will be replicated to a GOLD_TARGET storage (TargetShare1).
* When a replica virtual machine is created for any virtual machine on SILVER storage (SourceShare2), it will be replicated to a SILVER_TARGET (TargetShare2) storage, and so on.

### Multiple storage locations
If the target classification is assigned to multiple SMB shares or CSVs, the optimal storage location will be selected automatically when the virtual machine is protected. If no suitable target storage is available with the specified classification, the default storage location specified on the Hyper-V host is used to place the replica virtual hard disks.

The following table show how storage classification and cluster shared volumes are set up in our example.

| **Location** | **Classification** | **Associated storage** |
| --- | --- | --- |
| New York |GOLD |<p>C:\ClusterStorage\SourceVolume1</p><p>\\FileServer\SourceShare1</p> |
| SILVER |<p>C:\ClusterStorage\SourceVolume2</p><p>\\FileServer\SourceShare2</p> | |
| Chicago |GOLD_TARGET |<p>C:\ClusterStorage\TargetVolume1</p><p>\\FileServer\TargetShare1</p> |
| SILVER_TARGET |<p>C:\ClusterStorage\TargetVolume2</p><p>\\FileServer\TargetShare2</p> | |

This table summarizes the behavior when you enable protection for virtual machines (VM1 - VM5) in this example environment.

| **Virtual machine** | **Source storage** | **Source classification** | **Mapped target storage** |
| --- | --- | --- | --- |
| VM1 |C:\ClusterStorage\SourceVolume1 |GOLD |<p>C:\ClusterStorage\SourceVolume1</p><p>\\\FileServer\SourceShare1</p><p>Both GOLD_TARGET</p> |
| VM2 |\\FileServer\SourceShare1 |GOLD |<p>C:\ClusterStorage\SourceVolume1</p><p>\\FileServer\SourceShare1</p> <p>Both GOLD_TARGET</p> |
| VM3 |C:\ClusterStorage\SourceVolume2 |SILVER |<p>C:\ClusterStorage\SourceVolume2</p><p>\FileServer\SourceShare2</p> |
| VM4 |\FileServer\SourceShare2 |SILVER |<p>C:\ClusterStorage\SourceVolume2</p><p>\\FileServer\SourceShare2</p><p>Both SILVER_TARGET</p> |
| VM5 |C:\ClusterStorage\SourceVolume3 |N/A |No mapping, so the default storage location of the Hyper-V host is used |



### Data privacy overview

This table summarizes how data is stored in this scenario:

- - -
| Action | **Details** | **Collected data** | **Use** | **Required** |
| --- | --- | --- | --- | --- |
| **Registration** | You register a VMM server in a Recovery Services vault. If you later want to unregister a server, you can do so by deleting the server information from the Azure portal. | After a VMM server is registered Site Recovery collects, processes, and transfers metadata about the VMM server and the names of the VMM clouds detected by Site Recovery. | The data is used to identify and communicate with the appropriate VMM server and configure settings for appropriate VMM clouds. | This feature is required. If you don't want to send this information to Site Recovery you shouldn't use the Site Recovery service. |
| **Enable replication** | The Azure Site Recovery Provider is installed on the VMM server and is the conduit for communication with the Site Recovery service. The Provider is a dynamic-link library (DLL) hosted in the VMM process. After the Provider is installed, the "Datacenter Recovery" feature gets enabled in the VMM administrator console. New and existing VMs can enable this feature to enable protection for a VM. |With this property set, the Provider sends the name and ID of the VM to Site Recovery.  Replication is enabled by Windows Server 2012 or Windows Server 2012 R2 Hyper-V Replica. The virtual machine data gets replicated from one Hyper-V host to another (typically located in a different “recovery” data center). |Site Recovery uses the metadata to populate the VM information in the Azure portal. | This feature is an essential part of the service and can't be turned off. If you don't want to send this information, don't enable Site Recovery protection for VMs. Note that all data sent by the Provider to Site Recovery is sent over HTTPS. |
| **Recovery plan** | Recovery plans help you build an orchestration plan for the recovery data center. You can define the order in which VMs or a group of virtual machines should be started at the recovery site. You can also specify any automated scripts to be run, or any manual action to be taken, at the time of recovery for each VM. Failover is typically triggered at the recovery plan level for coordinated recovery. | Site Recovery collects, processes, and transmits metadata for the recovery plan, including virtual machine metadata, and metadata of any automation scripts and manual action notes. |The metadata is used to build the recovery plan in the Azure portal. |This feature is an essential part of the service and can't be turned off. If you don't want to send this information to Site Recovery, don't create recovery plans. |
| **Network mapping** | Maps network information from the primary data center to the recovery data center. When VMs are recovered on the recovery site, network mapping helps in establishing network connectivity. |Site Recovery collects, processes, and transmits the metadata of the logical networks for each site (primary and datacenter). |The metadata is used to populate network settings so that you can map the network information. | This feature is an essential part of the service and can't be turned off. If you don't want to send this information to Site Recovery, don't use network mapping. |
| **Failover (planned/unplanned/test)** | Failover fails over VMs from one VMM-managed data center to another. The failover action is triggered manually in the Azure portal. |The Provider on the VMM server is notified of the failover event by Site Recovery and runs a failover action on the Hyper-V host through VMM interfaces. Actual failover of a VM is from one Hyper-V host to another and handled by Windows Server 2012 or Windows Server 2012 R2 Hyper-V Replica. Aft Site Recovery uses the information sent to populate the status of the failover action information in the Azure portal. | This feature is an essential part of the service and can't be turned off. If you don't want to send this information to Site Recovery, don't use failover. |

## Next steps

After you've tested the deployment, learn more about other types of [failover](site-recovery-failover.md)
