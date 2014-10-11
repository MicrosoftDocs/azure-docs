<properties urlDisplayName="configure-Azure-Site-Recovery" pageTitle="Getting Started with Azure Site Recovery: On-Premises to On-Premises Protection" metaKeywords="Azure Site Recovery, VMM, clouds, disaster recovery" description="Azure Site Recovery coordinates the replication, failover and recovery of Hyper-V virtual machines located in on-premises VMM clouds to another on-premises site." metaCanonical="" umbracoNaviHide="0" disqusComments="1" title="Getting Started with Azure Site Recovery: On-Premises to On-Premises Protection" editor="jimbe" manager="johndaw" authors="raynew" />

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="raynew" />


# Getting Started with Azure Site Recovery:  On-Premises to On-Premises Protection


<div class="dev-callout"> 

<p>Use Azure Site Recovery to orchestrate protection for virtual machines on on-premises Hyper-V host servers located in VMM clouds. You can configure:</p>

<ul>
<li><b>On-premises to on-premises protection</b>—Replicate on-premise virtual machines to another on-premises site. You configure and enable protection settings in Azure Site Recovery vaults. Virtual machine data replicates from one on-premises Hyper-V server to another.
Learn about this scenario in <a href="http://go.microsoft.com/fwlink/?LinkId=398765">Getting Started with Azure Site Recovery: On-Premises to On-Premises Protection</a>.</li><li><b>On-premises to Azure protection</b>—Replicate on-premise virtual machines to Azure. You configure and enable protection settings in Azure Site Recovery vaults. Virtual machine data replicates from an on-premises Hyper-V server to Azure storage. Learn about this scenario in <a href="http://go.microsoft.com/fwlink/?LinkId=398764">Getting Started with Azure Site Recovery: On-Premises to Azure Protection</a></li>

</ul>




<h2><a id="about"></a>About this tutorial</h2>

<P>Use this tutorial to set up a quick proof-of-concept for Azure Site Recovery in an on-premises to Azure deployment. It uses the quickest path and default settings where possible. You'll create an Azure Site Recovery vault, install the Azure Site Recovery Provider in the source VMM server, configure cloud protection settings, enable protection for virtual machines, and test your deployment.</P>


<P>If you want information about a full deployment see:</P>

<UL>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=321294">Plan for Azure Site Recovery Deployment</a>—Describes the planning steps you should complete before a starting a full deployment.</LI>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=321295">Deploy Azure Site Recovery: On-Premises to On-Premises Protection</a>—Provides step-by-step instructions for a full deployment.</LI>

</UL>
<P>If you run into problems during this tutorial, review the wiki article <a href="http://go.microsoft.com/fwlink/?LinkId=389879">Azure Site Recovery: Common Error Scenarios and Resolutions</a>, or post your questions on the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</P>

</div>


<h2><a id="before"></a>Before you begin</h2> 
<div class="dev-callout"> 
<P>Before you start this tutorial check the prerequisites.</P>

<h3><a id="HVRMPrereq"></a>Prerequisites</h3>

<UL>
<LI><b>Azure account</b>—You'll need an Azure account. If you don't have one, see <a href="http://aka.ms/try-azure">Azure free trial</a>. Get pricing information at <a href="http://go.microsoft.com/fwlink/?LinkId=378268">Azure Site Recovery Manager Pricing Details</a>.</LI>
<LI><b>VMM server</b>—You'll need at least one VMM server running on System Center 2012 SP1 or System Center 2012 R2.</LI>
<LI><b>VMM clouds</b>—You should have at least one cloud on the source VMM server you want to protect, and one on the target VMM server. If you're running one VMM server it'll need two clouds. The primary cloud you want to protect must contain the following:<UL>
	<LI>One or more VMM host groups</LI>
	<LI>One or more Hyper-V host servers or clusters in each host group.</LI>
	<li>One or more virtual machines located on the source Hyper-V server in the cloud.</li>
		</UL></LI>
</UL>



<h2><a id="tutorial"></a>Tutorial steps</h2> 

After verifying the prerequisites, do the following:
<UL>
<LI><a href="#vault">Step 1: Create a vault</a>—Create an Azure Site Recovery vault.</LI>
<LI><a href="#download">Step 2: Install the Provider application</a>—Generate a registration key, and run the Microsoft Azure Site Recovery Provider application on the VMM server. This installs the Provider and registers the VMM server in the vault.</LI>
<LI><a href="#clouds">Step 3: Configure cloud protection</a>—Configure protection settings for VMM clouds.</LI>
<LI><a href="#networkmapping">Step 5: Configure network mapping—You can optionally configure network mapping to map source VM networks to target VM networks.</LI>
<LI><a href="#storagemapping">Step 6: Configure storage mapping</a>—You can optionally configure storage mapping to map storage classifications on the source VMM server to storage classifications on the target server.</LI>
<LI><a href="#enablevirtual">Step 7: Enable protection for virtual machines</a>—Enable protection for virtual machines located in protected VMM clouds</LI>
<LI><a href="#recovery plans">Step 8: Configure and run recovery plans</a>—Create a recovery plan and run a test failover for the plan.</LI>

</UL>




<a name="vault"></a> <h2>Step 1: Create a vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).


2. Expand <b>Data Services</b>, expand <b>Recovery Services</b>, and click <b>Site Recovery Vault</b>.


3. Click <b>Create New</b> and then click <b>Quick Create</b>.
	
4. In <b>Name</b>, enter a friendly name to identify the vault.

5. In <b>Region</b>, select the geographic region for the vault. To check supported regions see Geographic Availability in <a href="http://go.microsoft.com/fwlink/?LinkId=389880">Azure Site Recovery Pricing Details</a>

6. Click <b>Create vault</b>. 

	![New Vault](./media/hyper-v-recovery-manager-configure-vault/SR_HvVault.png)

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as <b>Active</b> on the main Recovery Services page.</P>

<a name="upload"></a> <h2>Step 2: Configure the vault</h2>


1. In the <b>Recovery Services</b> page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/hyper-v-recovery-manager-configure-vault/SR_QuickStartIcon.png)

2. In the dropdown list, select **Between two on-premises Hyper-V sites**.
3. In **Prepare VMM Servers**, click **Generate registration key** file. The key is valid for 5 days after it's generated. Copy the file to the VMM server. You'll need it when you set up the Provider.

	![Registration key](./media/hyper-v-recovery-manager-configure-vault/SR_E2ERegisterKey.png)
	



<a name="download"></a> <h2>Step 3: Install the Azure Site Recovery Provider</h2>
	

1. On the <b>Quick Start</b> page, in **Prepare VMM servers**, click <b>Download Microsoft Azure Site Recovery Provider for installation on VMM servers</b> to obtain the latest version of the Provider installation file.

2. Run this file on the source and target VMM servers.

3. In **Pre-requirements Check** select to stop the VMM service to begin Provider setup. The service stops and will restart automatically when setup finishes. 

	![Prerequisites](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderPrereq.png)

4. In **Microsoft Update** you can opt in for updates. With this setting enabled Provider updates will be installed according to your Microsoft Update policy.

	![Microsoft Updates](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderUpdate.png)

After the Provider is installed continue setup to register the server in the vault.

5. On the Internet Connection page specify how the Provider running on the VMM server connects to the Internet. select <b>Use default system proxy settings</b> to use the default Internet connection settings configured on the server.

	![Internet Settings](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderProxy.png)

6. In **Registration Key**, select that you downloaded from Azure Site Recovery and copied to the VMM server.
7. In **Vault name**, verify the name of the vault in which the server will be registered.
8. In **Server name**, specify a friendly name to identify the VMM server in the vault.

	![Server registration](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderRegKeyServerName.png)


9. In **Initial cloud metadata** sync select whether you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console.


7. In **Data Encryption** you generate a certificate that's used to encrypt data protected in Azure. 
This option isn’t relevant if you’re replicating from one on-premises site to another.

	![Server registration](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderSyncEncrypt.png)

8. Click <b>Register</b> to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed on the ed on the <b>Resources</b> tab on the **Servers** page in the vault.




<h2><a id="clouds"></a>Step 4: Configure cloud protection settings</h2>

After VMM servers are registered, you can configure cloud protection settings. You enabled the option **Synchronize cloud data with the vault** when you installed the Provider so all clouds on the VMM server will appear in the <b>Protected Items</b> tab in the vault.

![Published Cloud](./media/hyper-v-recovery-manager-configure-vault/SR_CloudsList.png)

1. On the Quick Start page, click **Set up protection for VMM clouds**.
2. On the **Protected Items** tab, select the cloud that you want to configure and go to the **Configuration** tab. Note that:
3. In <b>Target</b>, select <b>VMM</b>.
4. In <b>Target location</b>, select the on-site VMM server that manages the cloud you want to use for recovery.
4. In <b>Target cloud</b>, select the target cloud you want to use for failover of virtual machines in the source cloud. Note that:
	- We recommend that you select a target cloud that meets recovery requirements for the virtual machines you'll protect.
	- A cloud can only belong to a single cloud pair — either as a primary or a target cloud.

6. In <b>Copy frequency</b> leave the default setting. This value specifies how frequently data should be synchronized between source and target locations. It's only relevant when the Hyper-V host is running Windows Server 2012 R2. For other servers a default setting of five minutes is used.
7. In <b>Additional recovery points</b>, leave the default setting. This value specifies whether you want to create addition recovery points.The default zero value specifies that only the latest recovery point for a primary virtual machine is stored on a replica host server.
8. In <b>Frequency of application-consistent snapshots</b>, leave the default setting. This value specifies how often to create snapshots. Snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken.  If you do want to set this value for the tutorial walkthrough, ensure that it is set to less than the number of additional recovery points you configure.
	![Configure protection settings](./media/hyper-v-recovery-manager-configure-vault/SR_CloudSettingsE2E.png)
9. In <b>Data transfer compressed</b>, specify whether replicated data that is transferred should be compressed. 
10. In <b>Authentication</b>, specify how traffic is authenticated between the primary and recovery Hyper-V host servers. For the purpose of this walkthrough select HTTPS unless you have a working Kerberos environment configured. Azure Site Recovery will automatically configure certificates for HTTPS authentication. No manual configuration is required. Note that this setting is only relevant for Hyper-V host servers running on Windows Server 2012 R2.
11. In <b>Port</b>, leave the default setting. This value sets the port number on which the source and target Hyper-V host computers listen for replication traffic.
12. In <b>Replication method</b>, specify how the initial replication of data from source to target locations will be handled, before regular replication starts. 
	- <b>Over network</b>—Copying data over the network can be time-consuming and resource-intensive. We recommend that you use this option if the cloud contains virtual machines with relatively small virtual hard disks, and if the primary VMM server is connected to the secondary VMM server over a connection with wide bandwidth. You can specify that the copy should start immediately, or select a time. If you use network replication, we recommend that you schedule it during off-peak hours.
	- <b>Offline</b>—This method specifies that the initial replication will be performed using external media. It's useful if you want to avoid degradation in network performance, or for geographically remote locations. To use this method you specify the export location on the source cloud, and the import location on the target cloud. When you enable protection for a virtual machine, the virtual hard disk is copied to the specified export location. You send it to the target site, and copy it to the import location. The system copies the imported information to the replica virtual machines. For a complete list of offline replication prerequisites, see <a href="http://go.microsoft.com/fwlink/?LinkId=323469">Step 3: Configure protection settings for VMM clouds</a> in the Deployment Guide.
13. Select **Delete Replica Virtual Machine** to specify that the replica virtual machine should be deleted if you stop protecting the virtual machine by selecting the **Delete protection for the virtual machine** option on the Virtual Machines tab of the cloud properties. With this setting enabled, when you disable protection the virtual machine is removed from Azure Site Recovery, the Site Recovery settings for the virtual machine are removed in the VMM console, and the replica is deleted.
	![Configure protection settings](./media/hyper-v-recovery-manager-configure-vault/SR_CloudSettingsE2ERep.png)

<p>After you save the settings a job will be created and can be monitored on the <b>Jobs</b> tab. All Hyper-V host servers in the VMM source cloud will be configured for replication. Cloud settings can be modified on the <b>Configure</b> tab. If you want to modify the target location or target cloud you must remove the cloud configuration, and then reconfigure the cloud.</p>


<h2><a id="networkmapping"></a>Step 5: Configure network mapping</h2>

<p>This tutorial describes the simplest path to deploy Azure Site Recovery in a test environment. If you do want to configure network mapping as part of this tutorial, read <a href="http://go.microsoft.com/fwlink/?LinkId=324817">Prepare for network mapping</a> in the Planning Guide. To configure mapping follow the steps to <a href="http://go.microsoft.com/fwlink/?LinkId=402534">Configure network mapping</a> in the deployment guide.</p>

<h2><a id="storagemapping"></a>Step 6: Configure storage mapping</h2>

<p>This tutorial describes the simplest path to deploy Azure Site Recovery in a test environment. If you do want to configure storage mapping as part of this tutorial, follow the steps to <a href="http://go.microsoft.com/fwlink/?LinkId=402535">Configure storage mapping</a> in the deployment guide.</p>


<h2><a id="enablevirtual"></a>Step 7: Enable virtual machine protection</h2>
<p>After servers, clouds, and networks are configured correctly, you can enable protection for virtual machines in the cloud.</p>
<OL>
<li>On the <b>Virtual Machines</b> tab in the cloud in which the virtual machine is located, click <b>Enable protection</b> and then select <b>Add virtual machines</b>. </li>
<li>From the list of virtual machines in the cloud, select the one you want to protect.</li> 
</OL>

![Enable virtual machine protection](./media/hyper-v-recovery-manager-configure-vault/SR_EnableProtectionVM.png)


<P>Track progress of the Enable Protection action in the **Jobs** tab, including the initial replication. After the Finalize Protection job runs the virtual machine is ready for failover. After protection is enabled and virtual machines are replicated, you’ll be able to view them in Azure.</p>



![Virtual machine protection job](./media/hyper-v-recovery-manager-configure-vault/SR_VMJobs.png)


<h2><a id="recoveryplans"></a>Step 8: Test the deployment</h2>

To test your deployment you can run a test failover for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test failover for the plan.  Test failover simulates your failover and recovery mechanism in an isolated network. 


<UL>
<li>For instructions on creating a recovery plan see <a href="http://go.microsoft.com/fwlink/?LinkId=511492">Create and customize recovery plans: On-Premises to Azure</a>.</li>
<li>For instructions on running a test failover see <a href="http://go.microsoft.com/fwlink/?LinkId=511493">Test an on-premises to on-premises deployment</a>.</li>
</UL>


<h3><a id="runtest"></a>Monitor activity</h3>
<p>You can use the <b>Jobs</b> tab and <b>Dashboard</b> to view and monitor the main jobs performed by the Azure Site Recovery vault, including configuring protection for a cloud, enabling and disabling protection for a virtual machine, running a failover (planned, unplanned, or test), and committing an unplanned failover.</p>

<p>From the <b>Jobs</b> tab you view jobs, drill down into job details and errors, run job queries to retrieve jobs that match specific criteria, export jobs to Excel, and restart failed jobs.</p>

<p>From the <b>Dashboard</b> you can download the latest versions of Provider and Agent installation files, get configuration information for the vault, see the number of virtual machines that have protection managed by the vault, see recent jobs, manage the vault certificate, and resynchronize virtual machines.</p>

<p>For more information about interacting with jobs and the dashboard, see the <a href="http://go.microsoft.com/fwlink/?LinkId=398534">Operations and Monitoring Guide</a>.</p>
	
<h2><a id="next"></a>Next steps</h2>
<UL>
<LI>To plan and deploy Azure Site Recovery in a full production environment, see <a href="http://go.microsoft.com/fwlink/?LinkId=321294">Planning Guide for Azure Site Recovery</a> and <a href="http://go.microsoft.com/fwlink/?LinkId=321295">Deployment Guide for Azure Site Recovery</a>.</LI>
<LI>For questions, visit the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</LI> 
</UL>
