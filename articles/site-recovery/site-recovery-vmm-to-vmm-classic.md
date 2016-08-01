<properties
	pageTitle="Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site | Microsoft Azure"
	description="This article describes how to replicate Hyper-V VMs in VMM clouds to a secondary VMM site with Azure Site Recovery."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/06/2016"
	ms.author="raynew"/>

# Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site

> [AZURE.SELECTOR]
- [Azure Portal](site-recovery-vmm-to-vmm.md)
- [Classic Portal](site-recovery-vmm-to-vmm-classic.md)
- [PowerShell - Resource Manager](site-recovery-vmm-to-vmm-powershell-resource-manager.md)

The Azure Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. For a quick overview read [What is Azure Site Recovery?](site-recovery-overview.md)

## Overview

This article describes how to replicate Hyper-V virtual machines on Hyper-V host servers that are managed in VMM clouds to secondary VMM site using Azure Site Recovery.

The article includes prerequisites, shows you how to set up a Site Recovery vault, install the Azure Site Recovery Provider on source and target VMM servers, register the servers in the vault, configure protection settings for VMM clouds and then enable protection for Hyper-V VMs. Finish up by testing the failover to make sure everything's working as expected.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Architecture

The picture below shows the different communication channels and ports used by Azure Site Recovery for orchestration and replication

![E2E Topology](./media/site-recovery-vmm-to-vmm-classic/e2e-topology.png)

## Before you start

Make sure you have these prerequisites in place:

**Prerequisites** | **Details**
--- | ---
**Azure**| You'll need a [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.
**VMM** | You'll need at least one VMM server.<br/><br/>The VMM server should be running at least System Center 2012 SP1 with the latest cumulative updates.<br/><br/>If you want to set up protection with a single VMM server you'll need at least two clouds configured on the server.<br/><br/>If you want to deploy protection with two VMM servers each server must have at least one cloud configured on the primary VMM server you want to protect and one cloud configured on the secondary VMM server you want to use for protection and recovery<br/><br/>All VMM clouds must have the Hyper-V capability profile set.<br/><br/>The source cloud that you want to protect must contain one or more VMM host groups.<br/><br/>Learn more about setting up VMM clouds in [Walkthrough: Creating private clouds with System Center 2012 SP1 VMM](http://blogs.technet.com/b/keithmayer/archive/2013/04/18/walkthrough-creating-private-clouds-with-system-center-2012-sp1-virtual-machine-manager-build-your-private-cloud-in-a-month.aspx) on Keith Mayer's blog.
**Hyper-V** | You'll need one or more Hyper-V host servers in the primary and secondary VMM host groups, and one or more virtual machines on each Hyper-V host server.<br/><br/>The host and target Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role and have the latest updates installed.<br/><br/>Any Hyper-V server containing VMs you want to protect must be located in a VMM cloud.<br/><br/>If you're running Hyper-V in a cluster note that cluster broker isn't created automatically if you have a static IP address-based cluster. You'll need to configure the cluster broker manually. [Learn more](https://www.petri.com/use-hyper-v-replica-broker-prepare-host-clusters) in Aidan Finn's blog entry.
**Network mapping** | You can configure network mapping to make sure that replicated virtual machines are optimally placed on secondary Hyper-V host servers after failover, and that they can connect to appropriate VM networks. If you don't configure network mapping replica VMs won't be connected to any network after failover.<br/><br/>To set up network mapping during deployment make sure that the virtual machines on the source Hyper-V host server are connected to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.<br/<br/>The target cloud on the secondary VMM server that you use for recovery should have a corresponding VM network configured, and it in turn should be linked to a corresponding logical network that is associated with the target cloud.<br/><br/>[Learn more](site-recovery-network-mapping.md) about network mapping.
**Storage mapping** | By default when you replicate a virtual machine on a source Hyper-V host server to a target Hyper-V host server, replicated data is stored in the default location that’s indicated for the target Hyper-V host in Hyper-V Manager. For more control over where replicated data is stored, you can configure storage mapping<br/><br/> To configure storage mapping you'll need to set up storage classifications on the source and target VMM servers before you begin deployment. [Learn more](site-recovery-storage-mapping.md).


## Step 1: Create a Site Recovery vault

1. Sign in to the [Management Portal](https://portal.azure.com) from the VMM server you want to register.

2. Expand **Data Services** > **Recovery Services** and click **Site Recovery Vault**.

3. Click **Create New** > **Quick Create**.

4. In **Name**, enter a friendly name to identify the vault.

5. In **Region** select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](http://go.microsoft.com/fwlink/?LinkId=389880).

6. Click **Create vault**.

	![Create vault](./media/site-recovery-vmm-to-vmm-classic/create-vault.png)

Check in the status bar that the vault was created. The vault will be listed as **Active** on the main Recovery Services page.

## Step 2: Generate a vault registration key

Generate a registration key in the vault. After you download the Azure Site Recovery Provider and install it on the VMM server, you'll use this key to register the VMM server in the vault.

1. In the **Recovery Services** page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/site-recovery-vmm-to-vmm-classic/quick-start-icon.png)

2. In the dropdown list, select **Between two on-premises VMM sites**.
3. In **Prepare VMM Servers**, click **Generate registration key file**. The key file is generated automatically and is valid for 5 days after it's generated. If you're not accessing the Azure portal from the VMM server you'll need to copy this file to the server.

	![Registration key](./media/site-recovery-vmm-to-vmm-classic/register-key.png)

## Step 3: Install the Azure Site Recovery Provider

4. On the **Quick Start** page, in **Prepare VMM servers**, click **Download Microsoft Azure Site Recovery Provider for installation on VMM servers** to obtain the latest version of the Provider installation file.

2. Run this file on the source VMM server.

	>[AZURE.NOTE] If VMM is deployed in a cluster and you're installing the Provider for the first time install it on an active node and finish the installation to register the VMM server in the vault. Then install the Provider on the other nodes. Note that if you're upgrading the Provider you'll need to upgrade on all nodes because they should all be running the same Provider version.

3. The Installer does a few **Pre-requirements Check** and requests permission to stop the VMM service to begin Provider setup. The VMM Service will be restarted automatically when setup finishes. If you're installing on a VMM cluster you'll be prompted to stop the Cluster role.

4. In **Microsoft Update** you can opt in for updates. With this setting enabled Provider updates will be installed according to your Microsoft Update policy.

	![Microsoft Updates](./media/site-recovery-vmm-to-vmm-classic/ms-update.png)

5. The install location is set to **<SystemDrive>\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin**. Click on the Install button to start installing the Provider.

	![InstallLocation](./media/site-recovery-vmm-to-vmm-classic/install-location.png)

6. After the Provider is installed click **Register** to register the server in the vault.

	![InstallComplete](./media/site-recovery-vmm-to-vmm-classic/install-complete.png)
9. In **Vault name**, verify the name of the vault in which the server will be registered. Click *Next*.

	![Server registration](./media/site-recovery-vmm-to-vmm-classic/vaultcred.png)

7. In **Internet Connection** specify how the Provider running on the VMM server connects to the Internet. Select **Connect with existing proxy settings** to use the default Internet connection settings configured on the server.

	![Internet Settings](./media/site-recovery-vmm-to-vmm-classic/proxydetails.PNG)

	- If you want to use a custom proxy you should set it up before you install the Provider. When you configure custom proxy settings a test will run to check the proxy connection.
	- If you do use a custom proxy, or your default proxy requires authentication you'll need to enter the proxy details, including the proxy address and port.
	- Following urls should be accessible from the VMM Server and the Hyper-v hosts
		- *.hypervrecoverymanager.windowsazure.com
		- *.accesscontrol.windows.net
		- *.backup.windowsazure.com
		- *.blob.core.windows.net
		- *.store.core.windows.net
	- Allow the IP addresses described in [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and HTTPS (443) protocol. You would have to white-list IP ranges of the Azure region that you plan to use and that of West US.
	- If you use a custom proxy a VMM RunAs account (DRAProxyAccount) will be created automatically using the specified proxy credentials. Configure the proxy server so that this account can authenticate successfully. The VMM RunAs account settings can be modified in the VMM console. To do this, open the **Settings** workspace, expand **Security**, click **Run As Accounts**, and then modify the password for DRAProxyAccount. You’ll need to restart the VMM service so that this setting takes effect.


8. In **Registration Key**, select the key that you downloaded from Azure Site Recovery and copied to the VMM server.


10.  The encryption setting is only used when you're replicating Hyper-V VMs in VMM clouds to Azure. If you're replicating to a secondary site it's not used.

11.  In **Server name**, specify a friendly name to identify the VMM server in the vault. In a cluster configuration specify the VMM cluster role name.
12.  In **Synchronize cloud metadata** select whether you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console.

13.  Click **Next** to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed on the  **VMM Servers** tab on the **Servers** page in the vault.
 	
	![Lastpage](./media/site-recovery-vmm-to-vmm-classic/provider13.png)

### Command line installation

The Azure Site Recovery Provider can also be installed from the command line. This method can be used to install the provider on a Server CORE for Windows Server 2012 R2.

1. Download the Provider installation file and registration key to a folder. For example C:\ASR.
2. Stop the System Center Virtual Machine Manager Service
3. Extract the Provider installer by running these commands from a command prompt with **Administrator** privileges:

    	C:\Windows\System32> CD C:\ASR
    	C:\ASR> AzureSiteRecoveryProvider.exe /x:. /q

4. Install the provider by running:

    	C:\ASR> setupdr.exe /i

5. Register the provider by running:

    	CD C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin
    	C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin\> DRConfigurator.exe /r  /Friendlyname <friendly name of the server> /Credentials <path of the credentials file> /EncryptionEnabled <full file name to save the encryption certificate>     

Where the parameters are:

 - **/Credentials** : Mandatory parameter that specifies the location in which the registration key file is located  
 - **/FriendlyName** : Mandatory parameter for the name of the Hyper-V host server that appears in the Azure Site Recovery portal.
 - **/EncryptionEnabled** : Optional Parameter that you need to use only in the VMM to Azure Scenario if you need encryption of your virtual machines at at rest in Azure. Please ensure that the name of the file you provide has a **.pfx** extension.
 - **/proxyAddress** : Optional parameter that specifies the address of the proxy server.
 - **/proxyport** : Optional parameter that specifies the port of the proxy server.
 - **/proxyUsername** : Optional parameter that specifies the Proxy user name (if proxy requires authentication).
 - **/proxyPassword** :Optional parameter that specifies the Password for authenticating with the proxy server (if proxy requires authentication).  

## Step 4: Configure cloud protection settings

After VMM servers are registered, you can configure cloud protection settings. If you enabled the option **Synchronize cloud data with the vault** when you installed the Provider so all clouds on the VMM server will appear in the **Protected Items** tab in the vault. If you didn't you can synchronize a specific cloud with Azure Site Recovery in the **General** tab of the cloud properties page in the VMM console.

![Published Cloud](./media/site-recovery-vmm-to-vmm-classic/clouds-list.png)

1. On the Quick Start page, click **Set up protection for VMM clouds**.
2. On the **VMM Clouds** tab, select the cloud that you want to configure and go to the **Configuration** tab.
3. In **Target**, select **VMM**.
4. In **Target location**, select the on-site VMM server that manages the cloud you want to use for recovery.
4. In **Target cloud**, select the target cloud you want to use for failover of virtual machines in the source cloud. Note that:

	- We recommend that you select a target cloud that meets recovery requirements for the virtual machines you'll protect.
	- A cloud can only belong to a single cloud pair — either as a primary or a target cloud.

5. In **Copy frequency** specify how often data should be synchronized between he source and target locations. Note that this setting is only relevant when the Hyper-V host is running Windows Server 2012 R2. For other servers a default setting of five minutes is used.
6. In **Additional recovery points** specify whether you want to create additional recovery points.The default zero value indicates that only the latest recovery point for a primary virtual machine is stored on a replica host server. Note that enabling multiple recovery points requires additional storage for the snapshots that are stored at each recovery point. By default, recovery points are created every hour, so that each recovery point contains an hour’s worth of data. The recovery point value that you assign for the virtual machine in the VMM console should not be less than the value that you assign in the Azure Site Recovery console.
7. In **Frequency of application-consistent snapshots** specify how often to create application-consistent snapshots. Hyper-V uses two types of snapshots — a standard snapshot that provides an incremental snapshot of the entire virtual machine, and an application-consistent snapshot that takes a point-in-time snapshot of the application data inside the virtual machine. Application-consistent snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken. Note that if you enable application-consistent snapshots, it will affect the performance of applications running on source virtual machines. Ensure that the value you set is less than the number of additional recovery points you configure.

	![Configure protection settings](./media/site-recovery-vmm-to-vmm-classic/cloud-settings.png)

8. In **Data transfer compression**, specify whether replicated data that is transferred should be compressed.
9. In **Authentication**, specify how traffic is authenticated between the primary and recovery Hyper-V host servers. Select HTTPS unless you have a working Kerberos environment configured. Azure Site Recovery will automatically configure certificates for HTTPS authentication. No manual configuration is required. If you do select Kerberos, a Kerberos ticket will be used for mutual authentication of the host servers. By default, port 8083 and 8084 (for certificates) will be opened in the Windows Firewall on the Hyper-V host servers. Note that this setting is only relevant for Hyper-V host servers running on Windows Server 2012 R2.
10. In **Port**,modify the port number on which the source and target host computers listen for replication traffic. For example, you might modify the setting if you want to apply Quality of Service (QoS) network bandwidth throttling for replication traffic. Check that the port isn’t used by any other application and that it’s open in the firewall settings.
11. In **Replication method**, specify how the initial replication of data from source to target locations will be handled, before regular replication starts:

	- **Over network**—Copying data over the network can be time-consuming and resource-intensive. We recommend that you use this option if the cloud contains virtual machines with relatively small virtual hard disks, and if the primary site is connected to the secondary site over a connection with wide bandwidth. You can specify that the copy should start immediately, or select a time. If you use network replication, we recommend that you schedule it during off-peak hours.
	- **Offline**—This method specifies that the initial replication will be performed using external media. It's useful if you want to avoid degradation in network performance, or for geographically remote locations. To use this method you specify the export location on the source cloud, and the import location on the target cloud. When you enable protection for a virtual machine, the virtual hard disk is copied to the specified export location. You send it to the target site, and copy it to the import location. The system copies the imported information to the replica virtual machines.

12. Select **Delete Replica Virtual Machine** to specify that the replica virtual machine should be deleted if you stop protecting the virtual machine by selecting the **Delete protection for the virtual machine** option on the Virtual Machines tab of the cloud properties. With this setting enabled, when you disable protection the virtual machine is removed from Azure Site Recovery, the Site Recovery settings for the virtual machine are removed in the VMM console, and the replica is deleted.

	![Configure protection settings](./media/site-recovery-vmm-to-vmm-classic/cloud-settings-replica.png)

After you save the settings a job will be created and can be monitored on the **Jobs** tab. All Hyper-V host servers in the VMM source cloud will be configured for replication. Cloud settings can be modified on the **Configure** tab. If you want to modify the target location or target cloud you must remove the cloud configuration, and then reconfigure the cloud.

### Prepare for offline initial replication

You’ll need to do the following actions to prepare for initial replication offline:

- On the source server, you’ll specify a path location from which the data export will take place. Assign Full Control for NTFS and Share permissions to the VMM service on the export path. On the target server, you’ll specify a path location from which the data import will occur. Assign the same permissions on this import path.
- If the import or export path is shared, assign Administrator, Power User, Print Operator, or Server Operator group membership for the VMM service account on the remote computer on which the shared is located.
- If you are using any Run As accounts to add hosts, on the import and export paths, assign read and write permissions to the Run As accounts in VMM.
- The import and export shares should not be located on any computer used as a Hyper-V host server, because loopback configuration is not supported by Hyper-V.
- In Active Directory, on each Hyper-V host server that contains virtual machines you want to protect, enable and configure constrained delegation to trust the remote computers on which the import and export paths are located, as follows:
	1. On the domain controller, open **Active Directory Users and Computers**.
	2. In the console tree click **DomainName** > **Computers**.
	3. Right-click the Hyper-V host server name > **Properties**.
	4. On the **Delegation** tab click T**rust this computer for delegation to specified services only**.
	5. Click **Use any authentication protocol**.
	6. Click **Add** > **Users and Computers**.
	7. Type the name of the computer that hosts the export path > **OK**.From the list of available services, hold down the CTRL key and click **cifs** > **OK**. Repeat for the name of the computer that hosts the import path. Repeat as necessary for additional Hyper-V host servers.

## Step 5: Configure network mapping
1. On the Quick Start page, click **Map networks**.
2. Select the source VMM server from which you want to map networks, and then the target VMM server to which the networks will be mapped. The list of source networks and their associated target networks are displayed. A blank value is shown for networks that are not currently mapped.
3. Select a network in **Network on source** > **Map**. The service detects the VM networks on the target server and displays them. Click the information icon next to the source and target network names to view the subnets for each network.

	![Configure network mapping](./media/site-recovery-vmm-to-vmm-classic/network-mapping1.png)

4. In the dialog box select one of the VM networks from the target VMM server.

	![Select a target network](./media/site-recovery-vmm-to-vmm-classic/network-mapping2.png)

5. When you select a target network, the protected clouds that use the source network are displayed. Available target networks that are associated with the clouds used for protection are also displayed. We recommend that you select a target network that is available to all the clouds you are using for protection. Or you can also go to the VMM Server and modify the cloud properties to add the logical network corresponding to the vm network that you want to choose.
6. Click the check mark to complete the mapping process. A job starts to track the mapping progress. You can view it on the **Jobs** tab.


## Step 6: Configure storage mapping
By default when you replicate a virtual machine on a source Hyper-V host server to a target Hyper-V host server, replicated data is stored in the default location that’s indicated for the target Hyper-V host in Hyper-V Manager. For more control over where replicated data is stored, you can configure storage mappings as follows:



1. Define storage classifications on both the source and target VMM servers. [Learn more](https://technet.microsoft.com/library/gg610685.aspx). Classifications must be available to the Hyper-V host servers in source and target clouds. Classifications don’t need to have the same type of storage. For example you can map a source classification that contains SMB shares to a target classification that contains CSVs.
2. After classifications are in place you can create mappings. To do this, on the **Quick Start** page > **Map storage**.
3. Click the **Storage** tab > **Map storage classifications**.
4. On the **Map storage classifications** tab, select classifications on the source and target VMM servers. Save your settings.

	![Select a target network](./media/site-recovery-vmm-to-vmm-classic/storage-mapping.png)


## Step 7: Enable virtual machine protection
After servers, clouds, and networks are configured correctly, you can enable protection for virtual machines in the cloud.

1. On the **Virtual Machines** tab in the cloud in which the virtual machine is located, click **Enable protection** > **Add virtual machines**.
2. From the list of virtual machines in the cloud, select the one you want to protect.

	![Enable virtual machine protection](./media/site-recovery-vmm-to-vmm-classic/enable-protection.png)

3. Track progress of the Enable Protection action in the **Jobs** tab, including the initial replication. After the Finalize Protection job runs the virtual machine is ready for failover. After protection is enabled and virtual machines are replicated, you’ll be able to view them in Azure.

	![Virtual machine protection job](./media/site-recovery-vmm-to-vmm-classic/vm-jobs.png)

>[AZURE.NOTE] You can also enable protection for virtual machines in the VMM console. Click **Enable Protection** on the toolbar in the **Azure Site Recovery** tab in the virtual machine properties.

### On-board existing virtual machines

If you have existing virtual machines in VMM that are replicating with Hyper-V Replica you’ll need to onboard them for Azure Site Recovery protection as follows:

1. Verify you have primary and secondary clouds. Ensure that the Hyper-V server hosting the existing virtual machine is located in the primary cloud and that the Hyper-V server hosting the replica virtual machine is located in the secondary cloud. Make sure you’ve configured protection settings for the clouds. The settings should match those currently configured for Hyper-V Replica. Otherwise virtual machine replication might not work as expected.
2. Then enable protection for the primary virtual machine. Azure Site Recovery and VMM will ensure that the same replica host and virtual machine is detected, and Azure Site Recovery will reuse and reestablish replication using the settings configured during cloud configuration.


## Test your deployment

To test your deployment you can run a test failover for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test failover for the plan.  Test failover simulates your failover and recovery mechanism in an isolated network.

### Create a recovery plan

1. On the **Recovery Plans** tab, click **Create Recovery Plan**.
2. Specify a name for the recovery plan, and source and target VMM servers. The source server must have virtual machines that are enabled for failover and recovery. Select **Hyper-V** to view only clouds that are configured for Hyper-V replication.

	![Create recovery plan](./media/site-recovery-vmm-to-vmm-classic/recovery-plan1.png)

3. In **Select Virtual Machine**, select replication groups. All virtual machines associated with the replication group will be selected and added to the recovery plan. These virtual machines are added to the recovery plan default group—Group 1. you can add more groups if required. Note that after replication virtual machines will start up in accordance with the order of the recovery plan groups.

	![Add virtual machines](./media/site-recovery-vmm-to-vmm-classic/recovery-plan2.png)

After a recovery plan has been created, it appears in the list on the **Recovery Plans** tab.

###Run a test failover

1. On the **Recovery Plans** tab, select the plan and click **Test Failover**.
2. On the **Confirm Test Failover** page, select **None**. Note that with this option enabled the failed over replica virtual machines won't be connected to any network. This will test that the virtual machine fails over as expected but does not test your replication network environment. Look at how to [run a test failover](site-recovery-failover.md#run-a-test-failover) for more details about how to use different networking options.
3. The test virtual machine will be created on the same host as the host on which the replica virtual machine exists. It is added to the same cloud in which the replica virtual machine is located.

### Run a recovery plan
After replication the replica virtual machine might not have an IP address that's the same as the IP address of the primary virtual machine. Virtual machines will update the DNS server that they are using after they start. You can also add a script to update the DNS Server to ensure a timely update.

#### Script to retrieve the IP address
Run this sample script to retrieve the IP address.

    	$vm = Get-SCVirtualMachine -Name <VM_NAME>
		$na = $vm[0].VirtualNetworkAdapters>
		$ip = Get-SCIPAddress -GrantToObjectID $na[0].id
		$ip.address  

#### Script to update DNS
Run this sample script to update DNS, specifying the IP address you retrieved using the previous sample script.

		string]$Zone,
		[string]$name,
		[string]$IP
		)
		$Record = Get-DnsServerResourceRecord -ZoneName $zone -Name $name
		$newrecord = $record.clone()
		$newrecord.RecordData[0].IPv4Address  =  $IP
		Set-DnsServerResourceRecord -zonename $zone -OldInputObject $record -NewInputObject $Newrecord



## Privacy information for Site Recovery

This section provides additional privacy information for the Microsoft Azure Site Recovery service (“Service”). To view the privacy statement for Microsoft Azure services, see the
[Microsoft Azure Privacy Statement](http://go.microsoft.com/fwlink/?LinkId=324899)

**Feature: Registration**

- **What it does**: Registers server with service so that virtual machines can be protected
- **Information collected**: After registering the Service collects, processes and transmits management certificate information from the VMM server that’s designated to provide disaster recovery using the Service name of the VMM server, and the name of virtual machine clouds on your VMM server.
- **Use of information**:
	- Management certificate—This is used to help identify and authenticate the registered VMM server for access to the Service. The Service uses the public key portion of the certificate to secure a token that only the registered VMM server can gain access to. The server needs to use this token to gain access to the Service features.
	- Name of the VMM server—The VMM server name is required to identify and communicate with the appropriate VMM server on which the clouds are located.
	- Cloud names from the VMM server—The cloud name is required when using the Service cloud pairing/unpairing feature described below. When you decide to pair your cloud from a primary data center with another cloud in the recovery data center, the names of all the clouds from the recovery data center are presented.

- **Choice**: This information is an essential part of the Service registration process because it helps you and the Service to identify the VMM server for which you want to provide Azure Site Recovery protection, as well as to identify the correct registered VMM server. If you don’t want to send this information to the Service, do not use this Service. If you register your server and then later want to unregister it, you can do so by deleting the VMM server information from the Service portal (which is the Azure portal).

**Feature: Enable Azure Site Recovery protection**

- **What it does**: The Azure Site Recovery Provider installed on the VMM server is the conduit for communicating with the Service. The Provider is a dynamic-link library (DLL) hosted in the VMM process. After the Provider is installed, the “Datacenter Recovery” feature gets enabled in the VMM administrator console. Any new or existing virtual machines in a cloud can enable a property called “Datacenter Recovery” to help protect the virtual machine. Once this property is set, the Provider sends the name and ID of the virtual machine to the Service. The virtual protection is enabled by Windows Server 2012 or Windows Server 2012 R2 Hyper-V replication technology. The virtual machine data gets replicated from one Hyper-V host to another (typically located in a different “recovery” data center).

- **Information collected**: The Service collects, processes, and transmits metadata for the virtual machine, which includes the name, ID, virtual network, and the name of the cloud to
which it belongs.

- **Use of information**: The Service uses the above information to populate the virtual machine information on your Service portal.

- **Choice**: This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t enable Azure Site Recovery protection for any virtual machines. Note that all data sent by the Provider to the Service is sent over HTTPS.

**Feature: Recovery plan**

- **What it does**: This feature helps you to build an orchestration plan for the “recovery” data center. You can define the order in which the virtual machines or a group of virtual machines should be started at the recovery site. You can also specify any automated scripts to be run, or any manual action to be taken, at the time of recovery for each virtual machine. Failover (covered in the next section) is typically triggered at the Recovery Plan level for coordinated recovery.

- **Information collected**: The Service collects, processes, and transmits metadata for the recovery plan, including virtual machine metadata, and metadata of any automation scripts and manual action notes.

- **Use of information**: The metadata described above is used to build the recovery plan in your Service portal.

- **Choice**: This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t build Recovery Plans in this Service.

**Feature: Network mapping**

- **What it does**: This feature allows you to map network information from the primary data center to the recovery data center. When the virtual machines are recovered on the recovery site, this mapping helps in establishing network connectivity for them.

- **Information collected**: As part of the network mapping feature, the Service collects, processes, and transmits the metadata of the logical networks for each site (primary and datacenter).

- **Use of information**:The Service uses the metadata to populate your Service portal where you can map the network information.

- **Choice**: This is an essential part of the Service and can’t be turned off. If you don’t want this information sent to the Service, don’t use the network mapping feature.

**Feature: Failover - planned, unplanned, test**

- **What it does**: This feature helps failover of a virtual machine from one VMM managed data center to another VMM managed data center. The failover action is triggered by the user on their Service portal. Possible reasons for a failover include an unplalled event (for example in the case of a natural disaster0; a planned event (for example datacenter load balancing); a test failover (for example a recovery plan rehearsal).

The Provider on the VMM server gets notified of the event from the Service, and executes a failover action on the Hyper-V host through VMM interfaces. Actual failover of the virtual machine from one Hyper-V host to another (typically running in a different “recovery” data center) is handled by the Windows Server 2012 or Windows Server 2012 R2 Hyper-V replication technology. After the failover is complete, the Provider installed on the VMM server of the “recovery” data center sends the success information to the Service.

- **Information collected**: The Service uses the above information to populate the status of the failover action information on your Service portal.

- **Use of information**: The Service uses the above information as follows:

	- Management certificate—This is used to help identify and authenticate the registered VMM server for access to the Service. The Service uses the public key portion of the certificate to secure a token that only the registered VMM server can gain access to. The server needs to use this token to gain access to the Service features.
	- Name of the VMM server—The VMM server name is required to identify and communicate with the appropriate VMM server on which the clouds are located.
	- Cloud names from the VMM server—The cloud name is required when using the Service cloud pairing/unpairing feature described below. When you decide to pair your cloud from a primary data center with another cloud in the recovery data center, the names of all the clouds from the recovery data center are presented.

- **Choice**: This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t use this Service.
 
## Next steps

After you've run a test failover to check your environment is working as expected, [learn about](site-recovery-failover.md) different types of failovers.

