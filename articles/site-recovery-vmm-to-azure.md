<properties
	pageTitle="Set up protection between an on-premises VMM site and Azure"
	description="Azure Site Recovery coordinates the replication, failover and recovery of Hyper-V virtual machines located in on-premises VMM clouds to Azure."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor="tysonn"/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/23/2015"
	ms.author="raynew"/>

#  Set up protection between an on-premises VMM site and Azure

## Overview

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines in a number of deployment scenarios. For a full list of deployment scenarios see  [Azure Site Recovery overview](hyper-v-recovery-manager-overview.md).

This scenario guide describes how to deploy Site Recovery to orchestrate and automate protection for workloads running on virtual machines on Hyper-V host servers that are located in VMM private clouds. In this scenario virtual machines are replicated from a primary VMM site to Azure using Hyper-V Replica.

The guide includes prerequisites for the scenario and shows you how to set up a Site Recovery vault, get the Azure Site Recovery Provider installed on the source VMM server, register the server in the vault, add an Azure storage account, install the Azure Recovery Services agent on Hyper-V host servers, configure protection settings for VMM clouds that will be applied to all protected virtual machines, and then enable protection for those virtual machines. Finish up by testing the failover to make sure everything's working as expected.

If you run into problems setting up this scenario post your questions on the [Azure Recovery Services Forum](http://go.microsoft.com/fwlink/?LinkId=313628).

## Before you start

Make sure you have these prerequisites in place:
### Azure prerequisites

- You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. If you don't have one, start with a [free trial](http://aka.ms/try-azure). In addition you can read about [Azure Site Recovery Manager pricing](http://go.microsoft.com/fwlink/?LinkId=378268).
- You'll need an Azure storage account to store data replicated to Azure. The account needs geo-replication enabled. It should be in the same region as the Azure Site Recovery service, and be associated with the same subscription. To learn more about setting up Azure storage, see [Introduction to Microsoft Azure Storage](http://go.microsoft.com/fwlink/?LinkId=398704).
- You'll need to make sure that virtual machines you want to protect comply with Azure requirements. See [Virtual machine support](https://msdn.microsoft.com/library/azure/dn469078.aspx#BKMK_E2A) for details.

### VMM prerequisites
- You'll need  VMM server running on System Center 2012 R2.
- Any VMM server containing virtual machines you want to protect must be running the Azure Site Recovery Provider. This is installed during the Azure Site Recovery deployment.
- You'll need at least one cloud on the VMM server you want to protect. The cloud should contain:
	- One or more VMM host groups.
	- One or more Hyper-V host servers or clusters in each host group .
	- One or more virtual machines on the source Hyper-V server. The virtual machines should be generation 1.
- Learn more about setting up VMM clouds:
	- Read more about private VMM clouds in [What’s New in Private Cloud with System Center 2012 R2 VMM](http://go.microsoft.com/fwlink/?LinkId=324952) and in [VMM 2012 and the clouds](http://go.microsoft.com/fwlink/?LinkId=324956).
	- Learn about [Configuring the VMM cloud fabric](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric)
	- After your cloud fabric elements are in place learn about creating private clouds in  [Creating a private cloud in VMM](http://go.microsoft.com/fwlink/?LinkId=324953) and [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://go.microsoft.com/fwlink/?LinkId=324954).

### Hyper-V prerequisites

- The host Hyper-V servers must be running at least Windows Server 2012 with Hyper-V role and have the latest updates installed.
- If you're running Hyper-V in a cluster note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. For instructions see [Configure Hyper-V Replica Broker](http://go.microsoft.com/fwlink/?LinkId=403937).
- Any Hyper-V host server or cluster for which you want to manage protection must be included in a VMM cloud.

### Network mapping prerequisites
When you protect virtual machines in Azure network mapping maps between VM networks on the source VMM server and target Azure networks to enable the following:

- All machines which failover on the same network can connect to each other, irrespective of which recovery plan they are in.
- If a network gateway is setup on the target Azure network, virtual machines can connect to other on-premises virtual machines.
- If you don’t configure network mapping only virtual machines that fail over in the same recovery plan will be able to connect to each other after failover to Azure.

If you want to deploy network mapping you'll need the following:

- The virtual machines you want to protect on the source VMM server should be connected to a VM network. That network should be linked to a logical network that is associated with the cloud.
- An Azure network to which replicated virtual machines can connect after failover. You'll select this network at the time of failover. The network should be in the same region as your Azure Site Recovery subscription.
- Learn more about network mapping:
	- [Configuring logical networking in VMM](http://go.microsoft.com/fwlink/?LinkId=386307)
	- [Configuring VM networks and gateways in VMM](http://go.microsoft.com/fwlink/?LinkId=386308)
	- [Configure and monitor virtual networks in Azure](http://go.microsoft.com/fwlink/?LinkId=402555)


## Step 1: Create a Site Recovery vault

1. Sign in to the [Management Portal](https://portal.azure.com) from the VMM server you want to register.


2. Expand 
3. *Data Services*, expand *Recovery Services*, and click *Site Recovery Vault*.
*
3. Click *Create New* and then click *Quick Create*.


4. In *Name*, enter a friendly name to identify the vault.

5. In *Region*, select the geographic region for the vault. Available geographic regions include East Asia, West Europe, West US, East US, North Europe, Southeast Asia.
6. Click *Create vault*.

	![New Vault](./media/site-recovery-vmm-to-azure/ASRE2AVMM_HvVault.png)

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as *Active* on the main Recovery Services page.</P>


## Step 2: Generate a vault registration key

Generate a registration key in the vault. After you download the Azure Site Recovery Provider and install it on the VMM server, you'll use this key to register the VMM server in the vault.

1. In the *Recovery Services* page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/site-recovery-vmm-to-azure/ASRE2AVMM_QuickStartIcon.png)

2. In the dropdown list, select **Between an on-premises Hyper-V site and Microsoft Azure**.
3. In **Prepare VMM Servers**, click **Generate registration key** file. The key file is generated automatically and is valid for 5 days after it's generated. If you're not accessing the Azure portal from the VMM server you'll need to copy this file to the server.

	![Registration key](./media/site-recovery-vmm-to-azure/ASRE2AVMM_RegisterKey.png)

## Step 3: Install the Azure Site Recovery Provider

4. On the *Quick Start* page, in **Prepare VMM servers**, click *Download Microsoft Azure Site Recovery Provider for installation on VMM servers* to obtain the latest version of the Provider installation file.

2. Run this file on the source VMM server. If VMM is deployed in a cluster and you're installing the Provider for the first time install it on an active node and finish the installation to register the VMM server in the vault. Then install the Provider on the other nodes. Note that if you're upgrading the Provider you'll need to upgrade on all nodes because they should all be running the same Provider version.


3. In **Pre-requirements Check** select to stop the VMM service to begin Provider setup. The service stops and will restart automatically when setup finishes. If you're installing on a VMM cluster you'll be prompted to stop the Cluster role.

	![Prerequisites](./media/site-recovery-vmm-to-azure/ASRE2AVMM_ProviderPrereq.png)

4. In **Microsoft Update** you can opt in for updates. With this setting enabled Provider updates will be installed according to your Microsoft Update policy.

	![Microsoft Updates](./media/site-recovery-vmm-to-azure/ASRE2AVMM_ProviderUpdate.png)

After the Provider is installed continue setup to register the server in the vault.

5. In **Internet Connection** specify how the Provider running on the VMM server connects to the Internet. Select *Use default system proxy settings* to use the default Internet connection settings configured on the server.

	![Internet Settings](./media/site-recovery-vmm-to-azure/ASRE2AVMM_ProviderProxy.png)
	- If you want to use a custom proxy you should set it up before you install the Provider. When you configure custom proxy settings a test will run to check the proxy connection.
	- If you do use a custom proxy, or your default proxy requires authentication you'll need to enter the proxy details, including the proxy address and port.
	- You should exempt the following addresses from routing through the proxy:
		- The URL for connecting to the Azure Site Recovery: *.hypervrecoverymanager.windowsazure.com
		- *.accesscontrol.windows.net
		- *.backup.windowsazure.com
		- *.blob.core.windows.net
		- *.store.core.windows.net
	- Allow the IP addresses described in [Azure Datacenter IP Ranges](http://go.microsoft.com/fwlink/?LinkId=511094), and allow the HTTP (80) and HTTPS (443) protocols. You would have to white-list IP ranges of the Azure region that you plan to use and of West US. 
	
	- If you use a custom proxy a VMM RunAs account (DRAProxyAccount) will be created automatically using the specified proxy credentials. Configure the proxy server so that this account can authenticate successfully. The VMM RunAs account settings can be modified in the VMM console. To do this, open the Settings workspace, expand Security, click Run As Accounts, and then modify the password for DRAProxyAccount. You’ll need to restart the VMM service so that this setting takes effect.

6. In **Registration Key**, select that you downloaded from Azure Site Recovery and copied to the VMM server.
7. In **Vault name**, verify the name of the vault in which the server will be registered.
8. In **Server name**, specify a friendly name to identify the VMM server in the vault. In a cluster configuration specify the VMM cluster role name.


	![Server registration](./media/site-recovery-vmm-to-azure/ASRE2AVMM_ProviderRegKeyServerName.png)

8. In **Initial cloud metadata** sync select whether you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console.


9. In **Data Encryption** you specify a location to save an SSL certificate that’s automatically generated for data encryption. This certificate is used if you enable data encryption for a cloud protected by Azure in the Azure Site Recovery portal. Keep this certificate safe. When you run a failover to Azure you’ll select it in order to decrypt encrypted data.

	![Server registration](./media/site-recovery-vmm-to-azure/ASRE2AVMM_ProviderSyncEncrypt.png)

8. Click *Register* to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed on the ed on the *Resources* tab on the **Servers** page in the vault.

## Step 4: Create an Azure storage account

If you don't ave an Azure storage account click **Add an Azure Storage Account**. The account should have geo-replication enabled. It must in the same region as the Azure Site Recovery service, and be associated with the same subscription.


![Storage account](./media/site-recovery-vmm-to-azure/ASRE2AVMM_StorageAgent.png)

## Step 5: Install the Azure Recovery Services Agent

Install the Azure Recovery Services agent on each Hyper-V host server located in the VMM clouds you want to protect.

1. On the Quick Start page, click <b>Download Azure Site Recovery Services Agent and install on hosts</b> to obtain the latest version of the agent installation file.

	![Install Recovery Services Agent](./media/site-recovery-vmm-to-azure/ASRE2AVMM_InstallHyperVAgent.png)

2. Run the installation file on each Hyper-V host server that's located in VMM clouds you want to protect.
3. On the **Prerequisites Check** page click <b>Next</b>. Any missing prerequisites will be automatically installed.

	![Prerequisites Recovery Services Agent](./media/site-recovery-vmm-to-azure/ASRE2AVMM_AgentPrereqs.png)

4. On the **Installation Settings** page, specify where you want to install the Agent and select the cache location in which backup metadata will be installed. Then click <b>Install</b>.

## Step 6: Configure cloud protection settings

After the VMM server is registered, you can configure cloud protection settings. You enabled the option **Synchronize cloud data with the vault** when you installed the Provider so all clouds on the VMM server will appear in the <b>Protected Items</b> tab in the vault.

![Published Cloud](./media/site-recovery-vmm-to-azure/ASRE2AVMM_CloudsList.png)


1. On the Quick Start page, click **Set up protection for VMM clouds**.
2. On the **Protected Items** tab, click on the cloud you want to configure and go to the **Configuration** tab.
3. In <b>Target</b>, select <b>Microsoft Azure</b>.
4. In <b>Storage Account</b>, select the Azure storage account you want to use to replicate your virtual machines to.
5. Set <b>Encrypt stored data</b> to <b>Off</b>. This setting specifies that data should be encrypted replicated between the on-premises site and Azure.
6. In <b>Copy frequency</b> leave the default setting. This value specifies how frequently data should be synchronized between source and target locations.
7. In <b>Retain recovery points for</b>, leave the default setting. With a default value of zero, only the latest recovery point for a primary virtual machine is stored on a replica host server.
8. In <b>Frequency of application-consistent snapshots</b>, leave the default setting. This value specifies how often to create snapshots. Snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken.  If you do set a value, make sure it's less than the number of additional recovery points you configure.
9. In <b>Replication start time</b>, specify when initial replication of data to Azure should start. The timezone on the Hyper-V host server will be used. We recommend that you schedule the initial replication during off-peak hours.

	![Cloud replication settings](./media/site-recovery-vmm-to-azure/ASRE2AVMM_CloudSettings.png)

After you save the settings a job will be created and can be monitored on the <b>Jobs</b> tab. All Hyper-V host servers in the VMM source cloud will be configured for replication.

After saving, cloud settings can be modified on the <b>Configure</b> tab. To modify the target location or target storage account you'll need to remove the cloud configuration, and then reconfigure the cloud. Note that if you change the storage account the change is only applied for virtual machines that are enabled for protection after the storage account has been modified. Existing virtual machines are not migrated to the new storage account.</p>

## Step 7: Configure network mapping
Before you begin network mapping verify that virtual machines on the source VMM server are connected to a VM network. In addition create one or more Azure virtual networks. Note that multiple VM networks can be mapped to a single Azure network.

1. On the Quick Start page, click **Map networks**.
2. On the **Networks** tab, in **Source location**, select the source VMM server. In **Target location** select Azure.
3. In **Source** networks a list of VM networks associated with the VMM server are displayed. In **Target** networks the Azure networks associated with the subscription are displayed.
4. Select the source VM network and click **Map**.
5. On the **Select a Target Network** page, select the target Azure network you want to use.
6. Click the check mark to complete the mapping process.

	![Cloud replication settings](./media/site-recovery-vmm-to-azure/ASRE2AVMM_MapNetworks.png)

After you save the settings a job starts to track the mapping progress and it can be monitored on the Jobs tab. Any existing replica virtual machines that correspond to the source VM network will be connected to the target Azure networks. New virtual machines that are connected to the source VM network will be connected to the mapped Azure network after replication. If you modify an existing mapping with a new network, replica virtual machines will be connected using the new settings.

Note that if the target network has multiple subnets and one of those subnets has the same name as subnet on which the source virtual machine is located, then the replica virtual machine will be connected to that target subnet after failover. If there’s no target subnet with a matching name, the virtual machine will be connected to the first subnet in the network.

## Step 8: Enable protection for virtual machines

After servers, clouds, and networks are configured correctly, you can enable protection for virtual machines in the cloud. Note the following:

- Virtual machines must meet Azure requirements. Check these in <a href="http://go.microsoft.com/fwlink/?LinkId=402602">Prerequisites and support</a> in the Planning guide.
- To enable protection the operating system and operating system disk properties must be set for the virtual machine. When you create a virtual machine in VMM using a virtual machine template you can set the property. You can also set these properties for existing virtual machines on the **General** and **Hardware Configuration** tabs of the virtual machine properties. If you don't set these properties in VMM you'll be able to configure them in the Azure Site Recovery portal.

![Create virtual machine](./media/site-recovery-vmm-to-azure/ASRE2AVMM_EnableNew.png)

![Modify virtual machine properties](./media/site-recovery-vmm-to-azure/ASRE2AVMM_EnableExisting.png)


1. To enable protection, on the <b>Virtual Machines</b> tab in the cloud in which the virtual machine is located, click <b>Enable protection</b> and then select <b>Add virtual machines</b>
2. From the list of virtual machines in the cloud, select the one you want to protect.

	![Enable virtual machine protection](./media/site-recovery-vmm-to-azure/ASRE2AVMM_SelectVM.png)

	Track progress of the Enable Protection action in the **Jobs** tab, including the initial replication. After the Finalize Protection job runs the virtual machine is ready for failover. After protection is enabled and virtual machines are replicated, you’ll be able to view them in Azure.


	![Virtual machine protection job](./media/site-recovery-vmm-to-azure/ASRE2AVMM_VMJobs.png)

3. Verify the virtual machine properties and modify as required.

	![Verify virtual machines](./media/site-recovery-vmm-to-azure/VMProperties.png)

4. On the configure tab of the virtual machine properties following network properties could be modified.

    1. Number of network adapters of target virtual machine - Number of network adapters on target virtual machine depends on the size of the virtual machine chosen. The number of network adapters of target virtual machines is minimum of the number of network adapters on source virtual machine and maximum number of network adapters supported by the size of the virutal machine chosen.  
    
	1. Network of the target virtual machine - The network to which the virtual machine connects to is determined by network mapping of the network of source virtual machine. In case source virtual machine has more than one network adapters and source networks are mapped to different networks on target, then the user would have to choose between one of the target networks.
	
	1. Subnet of each of the network adapters - For each network adapter the user can choose the subnet to which the failed over virtual machine would connect to.
	
	1. Target IP - If the network adapter of source virtual machine is configured to use static IP then the user can provide the ip for the target virtual machine. User can use this capability to retain the ip of the source virtual machine after a failover. If no IP is provided any available IP would be given to network adapter at the time of failover. In case the target IP provided by user is already used by some other virtual machine that is alread running in Azure then the failover would fail.  

		![Modify network properties](./media/site-recovery-vmm-to-azure/MultiNic.png)

## Test your deployment
To test your deployment you can run a test failover for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test failover for the plan.  Test failover simulates your failover and recovery mechanism in an isolated network. Note that:

- If you want to connect to the virtual machine in Azure using Remote Desktop after the failover, enable Remote Desktop Connection on the virtual machine before you run the test failover.
- After failover you'll use a public IP address to connect to the virtual machine in Azure using Remote Desktop. If you want to do this, ensure you don't have any domain policies that prevent you from connecting to a virtual machine using a public address.

### Create a recovery plan

1. On the **Recovery Plans** tab, add a new plan. Specify a name, **VMM** in **Source type**, and the source VMM server in **Source**, The target will be Azure.

	![Create recovery plan](./media/site-recovery-vmm-to-azure/ASRE2AVMM_RP1.png)

2. In the **Select Virtual Machines** page, select virtual machines to add to the recovery plan. These virtual machines are added to the recovery plan default group—Group 1. A maximum of 100 virtual machines in a single recovery plan have been tested.

	- If you want to verify the virtual machine properties before adding them to the plan, click the virtual machine on the properties page of the cloud in which it’s located. You can also configure the virtual machine properties in the VMM console.
	- All of the virtual machines that are displayed have been enabled for protection. The list includes both virtual machines that are enabled for protection and initial replication has completed, and those that are enabled for protection with initial replication pending. Only virtual machines with initial replication completed can fail over as part of a recovery plan. Therefore, verify the initial replication status of virtual machines in the plan before starting recovery plan failover.


	![Create recovery plan](./media/site-recovery-vmm-to-azure/ASRE2AVMM_SelectVMRP.png)

After a recovery plan has been created it appears in the **Recovery Plans** tab. You can also add [Azure Automation Runbooks](site-recovery-runbook-automation.md) to the recovery plan to automate failover time actions.

### Run a test failover

There are two ways to run a test failover to Azure.

- Test failover without an Azure network—This type of test failover checks that the virtual machine comes up correctly in Azure. The virtual machine won’t be connected to any Azure network after failover.
- Test failover with an Azure network—This type of failover checks that the entire replication environment comes up as expected and that failed over the virtual machines will be connected to the specified target Azure network. For subnet handling, for test failover the subnet of the test virtual machine will be figured out based on the subnet of the replica virtual machine. This is different to regular replication when the subnet of a replica virtual machine is based on the subnet of the source virtual machine.

If you want to run a test failover for a virtual machine enabled for protection to Azure without specifying an Azure target network you don’t need to prepare anything. To run a test failover with a target Azure network you’ll need to create a new Azure network that’s isolated from your Azure production network (default behavior when you create a new network in Azure) and set up the infrastructure for the replicated virtual machine to work as expected. For example, a virtual machine with Domain Controller and DNS can be replicated to Azure using Azure Site Recovery and can be created in the test network using Test Failover. To run a test failover follow the steps below:

1. Do a test failover of the virtual machine with Domain Controller and DNS in the same network that you’ll be using for the actual test failover of the on-premises virtual machine.
2. Note down the IP addresses that were allocated to the failed over DNS virtual machine.
3. In the Azure virtual network that will be used for the failover, add the IP address as the address of the DNS server.
4. Run the test failover of the source on-premises virtual machines, specifying the Azure test network.
5. After validating that the test failure worked as expected, mark the test failover as complete for the recovery plan, and then mark the test failover as complete for the Domain Controller and DNS virtual machines.

To run a test failover do the following:

1. On the **Recovery Plans** tab, select the plan and click **Test Failover**.
1. On the **Confirm Test Failover** page select **None** or a specific Azure network.  Note that if you select None the test failover will check that the virtual machine replicated correctly to Azure but doesn't check your replication network configuration.

	![No network](./media/site-recovery-vmm-to-azure/ASRE2AVMM_TestFailoverNoNetwork.png)

1. If data encryption is enabled for the cloud, in **Encryption Key** select the certificate that was issued during installation of the Provider on the VMM server, when you turned on the option to enable data encryption for a cloud.
1. On the **Jobs** tab you can track failover progress. You should also be able to see the virtual machine test replica in the Azure portal. If you’re set up to access virtual machines from your on-premises network you can initiate a Remote Desktop connection to the virtual machine.
1. When the failover reaches the **Complete testing** phase , click **Complete Test** to finish up the test failover. You can drill down to the **Job** tab to track failover progress and status, and to perform any actions that are needed.
1. After  failover you'll be able to see the virtual machine test replica in the Azure portal. If you’re set up to access virtual machines from your on-premises network you can initiate a Remote Desktop connection to the virtual machine. Note that:

    1. Verify that the virtual machines start successfully
    1. If you want to connect to the virtual machine in Azure using Remote Desktop after the failover, enable Remote Desktop Connection on the virtual machine before you run the test failover. You will also need to add an RDP endpoint on the virtual machine. You can leverage an [Azure Automation Runbooks](site-recovery-runbook-automation.md) to do that.
    1. After failover if you use a public IP address to connect to the virtual machine in Azure using Remote Desktop, ensure you don't have any domain policies that prevent you from connecting to a virtual machine using a public address.
    
1.  After the testing is complete do the following:
	- Click **The test failover is complete**. Clean up the test environment to automatically power off and delete the test virtual machines.
	- Click **Notes** to record and save any observations associated with the test failover.

## <a id="runtest" name="runtest" href="#runtest"></a>Monitor activity
<p>You can use the *Jobs* tab and *Dashboard* to view and monitor the main jobs performed by the Azure Site Recovery vault, including configuring protection for a cloud, enabling and disabling protection for a virtual machine, running a failover (planned, unplanned, or test), and committing an unplanned failover.</p>

<p>From the *Jobs* tab you view jobs, drill down into job details and errors, run job queries to retrieve jobs that match specific criteria, export jobs to Excel, and restart failed jobs.</p>

<p>From the *Dashboard* you can download the latest versions of Provider and Agent installation files, get configuration information for the vault, see the number of virtual machines that have protection managed by the vault, see recent jobs, manage the vault certificate, and resynchronize virtual machines.</p>

<p>For more information about interacting with jobs and the dashboard, see the <a href="http://go.microsoft.com/fwlink/?LinkId=398534">Operations and Monitoring Guide</a>.</p>

##<a id="next" name="next" href="#next"></a>Next steps
<UL>
<LI>To plan and deploy Azure Site Recovery in a full production environment, see <a href="http://go.microsoft.com/fwlink/?LinkId=321294">Planning Guide for Azure Site Recovery</a> and <a href="http://go.microsoft.com/fwlink/?LinkId=321295">Deployment Guide for Azure Site Recovery</a>.</LI>


<LI>For questions, visit the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</LI>
</UL>
