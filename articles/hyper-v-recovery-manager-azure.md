<properties urlDisplayName="configure-Azure-Site-Recovery" pageTitle="Getting Started with Azure Site Recovery: On-Premises to Azure Protection" metaKeywords="Azure Site Recovery, VMM, clouds, disaster recovery" description="Azure Site Recovery coordinates the replication, failover and recovery of Hyper-V virtual machines located in on-premises VMM clouds to Azure." metaCanonical="" umbracoNaviHide="0" disqusComments="1" title="Getting Started with Azure Site Recovery: On-Premises to Azure Protection" editor="jimbe" manager="johndaw" authors="raynew" />

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="raynew" />


# Getting Started with Azure Site Recovery: On-Premises to Azure Protection



<div class="dev-callout"> 

<p>Use Azure Site Recovery to orchestrate protection for virtual machines on on-premises Hyper-V host servers located in VMM clouds. You can configure:</p>

<ul>
<li><b>On-premises to Azure protection</b>—Replicate on-premise virtual machines to Azure. You configure and enable protection settings in Azure Site Recovery vaults. Virtual machine data replicates from an on-premises Hyper-V server to Azure storage.</li>

<li><b>On-premises to on-premises protection</b>—Replicate on-premise virtual machines to another on-premises site. You configure and enable protection settings in Azure Site Recovery vaults. Virtual machine data replicates from one on-premises Hyper-V server to another.
Learn about this scenario in <a href="http://go.microsoft.com/fwlink/?LinkId=398765">Getting Started with Azure Site Recovery: On-Premises to On-Premises Protection</a>.</li>
</ul>
 
<h2><a id="about"></a>About this tutorial</h2>


<P>Use this tutorial to set up a quick proof-of-concept for Azure Site Recovery in an on-premises to Azure deployment. It uses the quickest path and default settings where possible. You'll create an Azure Site Recovery vault, install the Azure Site Recovery Provider in the source VMM server, install the Azure Recovery Services Agent on Hyper-V host servers in the VMM clouds, configure cloud protection settings, enable protection for virtual machines, and test your deployment.</P>

<P>If you want information about a full deployment see:</P>

<UL>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=321294">Plan for Azure Site Recovery Deployment</a>—Describes the planning steps you'll need before a starting a full deployment.</LI>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=402679">Deploy Azure Site Recovery: On-Premises to Azure Protection</a>—Provides step-by-step instructions for a full deployment.</LI>

</UL>
<P>If you run into problems during this tutorial, review the wiki article <a href="http://go.microsoft.com/fwlink/?LinkId=389879">Azure Site Recovery: Common Error Scenarios and Resolutions</a>, or post your questions on the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</P>

</div>


<h2><a id="before"></a>Before you begin</h2> 
<div class="dev-callout"> 
<P>Before you start this tutorial check the prerequisites.</P>

<h3><a id="HVRMPrereq"></a>Prerequisites</h3>

<UL>
<LI><b>Azure account</b>—You'll need an Azure account. If you don't have one, see <a href="http://aka.ms/try-azure">Azure free trial</a>. Get pricing information at <a href="http://go.microsoft.com/fwlink/?LinkId=378268">Azure Site Recovery Manager Pricing Details</a>.</LI>

<LI><b>Azure storage account</b>—You'll need an Azure storage account to store data replicated to Azure. The account needs geo-replication enabled. It should be in the same region as the Azure Site Recovery service, and be associated with the same subscription. To learn more about setting up Azure storage, see <a href="http://go.microsoft.com/fwlink/?LinkId=398704">Introduction to Microsoft Azure Storage</a>.</LI><LI><b>VMM server</b>—A VMM server running on System Center 2012 R2.</LI>
<LI><b>VMM clouds</b>—At least one cloud on the VMM server.The cloud should contain:
	<UL>
	<LI>One or more VMM host groups</LI>
	<LI>One or more Hyper-V host servers or clusters in each host group.</LI>
	<li>One or more virtual machines located on the source Hyper-V server in the cloud. The virtual machines should be generation 1.</li>
		</UL></LI>	
<LI><b>Virtual machine</b>—You'll need virtual machines that comply with Azure requirements. See <a href="http://go.microsoft.com/fwlink/?LinkId=402602">Prerequisites and support</a> in the Planning guide.</LI>
<LI>For a full list of virtual machine support requirements for failover to Azure, read  </LI>
</UL>


<h2><a id="tutorial"></a>Tutorial steps</h2> 

After verifying the prerequisites, do the following:
<UL>

<LI><a href="#vault">Step 1: Create a vault</a>—Create an Azure Site Recovery vault.</LI>
<LI><a href="#download">Step 2: Install the Provider application</a>—Generate a registration key, and run the Microsoft Azure Site Recovery Provider application on the VMM server. This installs the Provider and registers the VMM server in the vault.</LI>
<LI><a href="#storage">Step 3: Add an Azure storage account</a>—If you don't have an account create one. </LI>
<LI><a href="#agent">Step 4: Install the Agent application</a>—Install the Microsoft Azure Recovery Services agent on each Hyper-V host.</LI>
<LI><a href="#clouds">Step 5: Configure cloud protection</a>—Configure protection settings for VMM clouds.</LI>
<LI><a href="#NetworkMapping">Step 6: Configure network mapping</a>—You can optionally configure network mapping to map source VM networks to target Azure networks.</LI>
<LI><a href="#virtualmachines">Step 7: Enable protection for virtual machines</a>—Enable protection for virtual machines located in protected VMM clouds.</LI>
<LI><a href="#test">Step 8: Test the deployment</a>—You can run a test failover for a single virtual machine, or you can create a recovery plan and run a test failover for the plan.</LI>
</UL>



<a name="vault"></a> <h2>Step 1: Create a vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).


2. Expand <b>Data Services</b>, expand <b>Recovery Services</b>, and click <b>Site Recovery Vault</b>.

3. Click <b>Create New</b> and then click <b>Quick Create</b>.
	

4. In <b>Name</b>, enter a friendly name to identify the vault.

5. In <b>Region</b>, select the geographic region for the vault. Available geographic regions include East Asia, West Europe, West US, East US, North Europe, Southeast Asia.
6. Click <b>Create vault</b>. 

	![New Vault](./media/hyper-v-recovery-manager-configure-vault/SR_HvVault.png)

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as <b>Active</b> on the main Recovery Services page.</P>





 <a name="download"></a> <h2>Step 2: Generate a registration key and install the Azure Site Recovery Provider</h2>
 

1. In the <b>Recovery Services</b> page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/hyper-v-recovery-manager-configure-vault/SR_QuickStartIcon.png)

2. In the dropdown list, select **Between an on-premises Hyper-V site and Microsoft Azure**.
3. In **Prepare VMM Servers**, click **Generate registration key** file. The key is valid for 5 days after it's generated. Copy the file to the VMM server. You'll need it when you set up the Provider.

	![Registration key](./media/hyper-v-recovery-manager-configure-vault/SR_E2ARegisterKey.png)

4. On the <b>Quick Start</b> page, in **Prepare VMM servers**, click <b>Download Microsoft Azure Site Recovery Provider for installation on VMM servers</b> to obtain the latest version of the Provider installation file.

2. Run this file on the source VMM server.


3. In **Pre-requirements Check** select to stop the VMM service to begin Provider setup. The service stops and will restart automatically when setup finishes.

	![Prerequisites](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderPrereq.png)

4. In **Microsoft Update** you can opt in for updates. With this setting enabled Provider updates will be installed according to your Microsoft Update policy.

	![Microsoft Updates](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderUpdate.png)

After the Provider is installed continue setup to register the server in the vault.

5. In **Internet Connection** specify how the Provider running on the VMM server connects to the Internet. Select <b>Use default system proxy settings</b> to use the default Internet connection settings configured on the server.

	![Internet Settings](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderProxy.png)

6. In **Registration Key**, select that you downloaded from Azure Site Recovery and copied to the VMM server.
7. In **Vault name**, verify the name of the vault in which the server will be registered.
8. In **Server name**, specify a friendly name to identify the VMM server in the vault.

	
	![Server registration](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderRegKeyServerName.png)

8. In **Initial cloud metadata** sync select whether you want to synchronize metadata for all clouds on the VMM server with the vault. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console.


9. In **Data Encryption** you specify a location to save an SSL certificate that’s automatically generated for data encryption. This certificate is used if you enable data encryption for a cloud protected by Azure in the Azure Site Recovery portal. Keep this certificate safe. When you run a failover to Azure you’ll select it in order to decrypt encrypted data. 
This option isn’t relevant if you’re replicating from one on-premises site to another.

	![Server registration](./media/hyper-v-recovery-manager-configure-vault/SR_ProviderSyncEncrypt.png)

8. Click <b>Register</b> to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed on the ed on the <b>Resources</b> tab on the **Servers** page in the vault.

<h2><a id="storage"></a>Step 3: Create an Azure storage account</h2>
If you don't have an Azure storage account click **Add an Azure Storage Account**. The account should have geo-replication enabled. It must in the same region as the Azure Site Recovery service, and be associated with the same subscription.

<P>Use this tutorial to set up a quick proof-of-concept for Azure Site Recovery in an on-premises to Azure deployment. It uses the quickest path and default settings where possible. You'll create an Azure Site Recovery vault, install the Azure Site Recovery Provider in the source VMM server, install the Azure Recovery Services Agent on Hyper-V host servers in the VMM clouds, configure cloud protection settings, enable protection for virtual machines, and test your deployment.</P>![Storage account](./media/hyper-v-recovery-manager-configure-vault/SR_E2AStorageAgent.png)

<h2><a id="agent"></a>Step 4: Install the Azure Recovery Services Agent on Hyper-V hosts</h2>

<p>Install the Azure Recovery Services agent on each Hyper-V host server located in the VMM clouds you want to protect.</p>

1. On the Quick Start page, click <b>Download Azure Site Recovery Services Agent and install on hosts</b> to obtain the latest version of the agent installation file.

	![Install Recovery Services Agent](./media/hyper-v-recovery-manager-configure-vault/SR_E2AInstallHyperVAgent.png)

2. Run the installation file on each Hyper-V host server that's located in VMM clouds you want to protect.
3. On the **Prerequisites Check** page click <b>Next</b>. Any missing prerequisites will be automatically installed.

	![Prerequisites Recovery Services Agent](./media/hyper-v-recovery-manager-configure-vault/SR_AgentPrereqs.png)

4. On the **Installation Settings** page, specify where you want to install the Agent and select the cache location in which backup metadata will be installed. Then click <b>Install</b>.


<h2><a id="clouds"></a>Step 5: Configure cloud protection settings</h2>

After VMM servers are registered, you can configure cloud protection settings. You enabled the option **Synchronize cloud data with the vault** when you installed the Provider so all clouds on the VMM server will appear in the <b>Protected Items</b> tab in the vault.


![Published Cloud](./media/hyper-v-recovery-manager-configure-vault/SR_CloudsList.png)


1. On the Quick Start page, click **Set up protection for VMM clouds**.

2. On the **Protected Items** tab, click on the cloud you want to configure and go to the **Configuration** tab.
3. In <b>Target</b>, select <b>Microsoft Azure</b>.
4. In <b>Storage Account</b>, select the Azure storage you want to use to store Azure virtual machines.
5. Set <b>Encrypt stored data</b> to <b>Off</b>. This setting specifies that data should be encrypted replicated between the on-premises site and Azure.
6. In <b>Copy frequency</b> leave the default setting. This value specifies how frequently data should be synchronized between source and target locations.  
7. In <b>Retain recovery points for</b>, leave the default setting. With a default value of zero only the latest recovery point for a primary virtual machine is stored on a replica host server. 
8. In <b>Frequency of application-consistent snapshots</b>, leave the default setting. This value specifies how often to create snapshots. Snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken.  If you do set a value, make sure it's less than the number of additional recovery points you configure.
9. In <b>Replication start time</b>, specify when initial replication of data to Azure should start. The timezone on the Hyper-V host server will be used. We recommend that you schedule the initial replication during off-peak hours. 

	![Cloud replication settings](./media/hyper-v-recovery-manager-configure-vault/SR_CloudSettingsE2A.png)

<p>After you save the settings a job will be created and can be monitored on the <b>Jobs</b> tab. All Hyper-V host servers in the VMM source cloud will be configured for replication.

After saving, cloud settings can be modified on the <b>Configure</b> tab. To modify the target location or target storage you'll need to remove the cloud configuration, and then reconfigure the cloud. Note that if you change the storage account the change is only applied for virtual machines that are enabled for protection after the storage account has been modified. Existing virtual machines are not migrated to the new storage account.</p>

<h2><a id="networkmapping"></a>Step 6: Configure network mapping</h2>

<p>This tutorial describes the simplest path to deploy Azure Site Recovery in a test environment. If you do want to configure network mapping as part of this tutorial, read <a href="http://go.microsoft.com/fwlink/?LinkId=324817">Prepare for network mapping</a> in the Planning Guide. To configure mapping follow the steps to <a href="http://go.microsoft.com/fwlink/?LinkId=402533">Configure network mapping</a> in the deployment guide.</p>




<h2><a id="virtualmachines"></a>Step 7: Enable protection for virtual machines</h2>

<p>After servers, clouds, and networks are configured correctly, you can enable protection for virtual machines in the cloud. Note the following:</p>

<ul>
<li>Virtual machines must meet Azure requirements. Check these in <a href="http://go.microsoft.com/fwlink/?LinkId=402602">Prerequisites and support</a> in the Planning guide.</li>
<li>To enable protection the operating system and operating system disk properties must be set for the virtual machine. When you create a virtual machine in VMM using a virtual machine template you can set the property. You can also set these properties for existing virtual machines on the **General** and **Hardware Configuration** tabs of the virtual machine properties. If you don't set these properties in VMM you'll be able to configure them in the Azure Site Recovery portal.</li>
</ul>

![Create virtual machine](./media/hyper-v-recovery-manager-configure-vault/SR_EnableVMME2ANew.png)

![Modify virtual machine properties](./media/hyper-v-recovery-manager-configure-vault/SR_EnableVMME2AExisting.png)


1. To enable protection, on the <b>Virtual Machines</b> tab in the cloud in which the virtual machine is located, click <b>Enable protection</b> and then select <b>Add virtual machines</b>
2. From the list of virtual machines in the cloud, select the one you want to protect. 

	![Enable virtual machine protection](./media/hyper-v-recovery-manager-configure-vault/SR_EnableVMME2ASelectVM.png)

3. Verify the virtual machine properties and modify as required.

	![Verify virtual machines](./media/hyper-v-recovery-manager-configure-vault/SR_EnableVME2AProps.png)

<P>Track progress of the Enable Protection action in the **Jobs** tab, including the initial replication. After the Finalize Protection job runs the virtual machine is ready for failover. After protection is enabled and virtual machines are replicated, you’ll be able to view them in Azure.
</p>

![Virtual machine protection job](./media/hyper-v-recovery-manager-configure-vault/SR_VMJobs.png)


<h2><a id="test"></a>Step 8: Test the deployment</h2>
To test your deployment you can run a test failover for a single virtual machine, or create a recovery plan consisting of multiple virtual machines and run a test failover for the plan.  Test failover simulates your failover and recovery mechanism in an isolated network. Note the following:
<UL>
<li>If you want to connect to the virtual machine in Azure using Remote Desktop after the failover, enable Remote Desktop Connection on the virtual machine before you run the test failover.</li>
<li>After failover you'll use a public IP address to connect to the virtual machine in Azure using Remote Desktop. If you want to do this, ensure you don't have any domain policies that prevent you from connecting to a virtual machine using a public address.</li>
</UL>
<UL>
<li>For instructions on creating a recovery plan see <a href="http://go.microsoft.com/fwlink/?LinkId=511492">Create and customize recovery plans: On-Premises to Azure</a>.</li>
<li>For instructions on running a test failover see <a href="http://go.microsoft.com/fwlink/?LinkId=511494">Test an on-premises to Azure deployment</a>.</li>
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
