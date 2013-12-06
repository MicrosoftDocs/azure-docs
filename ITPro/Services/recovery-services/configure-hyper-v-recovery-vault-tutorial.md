<properties linkid="manage-services-recovery-hyperv-recovery-vault" urlDisplayName="Configure a Recovery Vault" pageTitle="Configure Windows Azure Recovery Services to provide a Hyper-V recovery environment" metaKeywords="disaster recovery" description="Use this tutorial to learn how to use the Hyper-V Recovery Manager service in Microsoft's Windows Azure cloud offering to provide a Hyper-V recovery environment." metaCanonical="" services="recovery-services" documentationCenter="" title="Configure Windows Azure Hyper-V Recovery Manager" authors=""  solutions="" writer="starra" manager="cynthn" editor="tysonn"  />





<h1><a id="configure-hyper-v-recovery-vault-tutorial"></a>Configure Windows Azure Hyper-V Recovery Manager</h1>
<div class="dev-callout"> 

Windows Azure Hyper-V Recovery Manager coordinates, orchestrates, and manages the protection and failover of Hyper-V virtual machines located in private clouds on Virtual Machine Manager (VMM) servers in System Center 2012 Service Pack 1 (SP1) or System Center 2012 R2. Hyper-V Recovery Manager uses vaults to store and protect your recovery and failover configuration and settings.

<h2><a id="before"></a>About this tutorial</h2>
This tutorial provides a quick walkthrough of the steps required to deploy Hyper-V Recovery Manager. For more detailed explanations and procedures read the following:
<UL>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=321294">Planning Guide for Hyper-V Recovery Manager</a>—This guide summarizes the prerequisites and the planning steps you should complete before starting a full deployment of Hyper-V Recovery Manager.</LI>
<LI><a href="http://go.microsoft.com/fwlink/?LinkId=321295">Deployment Guide for Hyper-V Recovery Manager</a>—This guide provides detailed step-by-step deployment instructions for a full deployment.</LI>
</UL>
</div>

<h2><a id="before"></a>Before you begin</h2> 
<div class="dev-callout"> 
To successfully complete this tutorial you need the following:
<h3><a id="before"></a>Infrastructure requirements</h3> 
<UL>
<LI>At least one VMM server running in System Center 2012 SP1 or System Center 2012 R2.</LI>
<LI>At least one cloud configured on the source VMM server you want to protect, and one cloud on the destination VMM server that you'll use for protection and recovery. If you're deploying Hyper-V Recovery Manager with a single VMM server you'll need two clouds configured on that server.</LI>
<LI>One or more virtual machines located in the source cloud that you want to protect.</LI>
<LI>To ensure that replicated virtual machines are connected to appropriate networks in the target location after failover, you can configure network mapping in Hyper-V Recovery Manager. To prepare your infrastructure, verify that VM networks are configured on the source VMM server, and that corresponding VM networks are created on the destination VMM server. Ensure that the networks are connected to appropriate source and destination clouds. To learn more, read <a href="http://go.microsoft.com/fwlink/?LinkId=324817">Prepare for network mapping</a> in the Planning Guide for Hyper-V Recovery Manager.</LI>
</UL>
<h3><a id="before"></a>Hyper-V Recovery Manager requirements</h3>
<UL>
<LI>A Windows Azure account with the Windows Azure Recovery Services feature enabled.</LI>
	<UL>
	<LI>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="/en-us/pricing/free-trial/">Windows Azure Free Trial</a>.</LI>
	<LI>If you have an existing account but need to enable the Windows Azure Recovery Services, see <a href="/en-us/develop/net/tutorials/create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</LI>
	</UL>
<LI>Read <a href="http://go.microsoft.com/fwlink/?LinkId=321295">Privacy information</a> in the Deployment Guide for Hyper-V Recovery Manager. This provides an overview of information that is collected, processed, or transmitted for each Hyper-V Recovery Manager feature.</LI>
<LI>A management certificate (.cer) that you'll upload to the Hyper-V Recovery vault in order to register VMM servers with the vault. Note that:</LI>
	<UL>
	<LI>You can use any valid SSL certificate issued by a Microsoft Enterprise certification authority (CA) or by any CA that is trusted by Microsoft (and whose root certificates are distributed through the Microsoft Root Certificate Program). Alternatively, for test or tutorial purposes you can use a self-signed certificate that you create using the Makecert.exe tool.</LI>
	<LI>The certificate should be an x.509 v3 certificate.</LI>
	<LI>The key length should be at least 2048 bits.</LI>
	<LI>The certificate must have a valid ClientAuthentication EKU.</LI>
	<LI>The certificate should be currently valid with a validity period that does not exceed 3 years.</LI>
	<LI>The certificate should reside in the Personal certificate store of your local computer.</LI>
	<LI>To upload to the certificate to the vault, it must be in cer format, and contain the public key.</LI>
	<LI>The .cer certificate must be exported as a .pfx file (and contain the private key) This .pfx file should be located on each VMM server that you want to add to the Hyper-V Recovery Manager vault.</LI>
	<LI>Each Hyper-V Recovery vault has only a single .certificate associated with it at any time. You can upload a new management certificate to overwrite the current certificate associated with a vault as required.</LI>
	</UL>
</UL>


<h2><a id="tutorial"></a>Tutorial steps</h2> 

This tutorial walks you through the steps required to configure Hyper-V Recovery Manager to protect virtual machines located in VMM clouds:


<UL>

<LI><a href="#createcert">Obtain and configure certificates</a>—Before you begin to the tutorial tutorial you must obtain and configure the prerequisite certificates required for Hyper-V Recovery Manager deployment. In addition, read through the <a href="hhttp://go.microsoft.com/fwlink/?LinkId=325515">Prerequisites and Requirements</a> page in the Planning Guide</LI>
<LI><a href="#vault">Step 1: Create a vault</a>—Create a Hyper-V Recovery Manager vault in Windows Azure.</LI>
<LI><a href="#upload">Step 2: Upload a certificate (.cer)</a>—Upload the .cer certificate to the vault.</LI>
<LI><a href="#download">Step 3: Download and install the Provider</a>—Download and install the Hyper-V Recovery Manager Provider on VMM servers you want to protect. Then register the VMM servers with the vault.</LI>
<LI><a href="#clouds">Step 4: Configure cloud protection</a>—Configure protection settings for VMM clouds.</LI>
<LI><a href="#networks">Step 5: Configure network mapping</a>—Map VM networks from source VMM servers to target VMM servers.</LI>
<LI><a href="#virtualmachines">Step 6: Enable protection for virtual machines</a>—Enable protection for Hyper-V virtual machines located in the VMM clouds.</LI>
<LI><a href="#recovery plans">Step 7: Configure and run recovery plans</a>—Create and customize recovery plans that group together virtual machines, and specify the order in those virtual machine groups fail over. Then run the recovery plans as required.</LI>
<LI><a href="#jobs">Step 8: Monitor</a>—Monitor settings, status, and progress using the <b>Jobs</b> and <b>Dashboard</b> tabs.</LI>
</UL>



<a name="createcert"></a> <h2>Obtain and configure certificates</h2>

Obtain and configure certificates as follows:
<OL>
<LI>Obtain a management certificate—You can obtain a management certificate (.cer) using either of the following methods:</LI>
<UL>

<LI>Use a existing management cerficate (.cer).</LI>
<LI>For test purposes, create a self-signed certificate using the Makecert tool. For instructions, see <a href="#obtaincert">Obtain a self-signed certificate (.cer)</a>.</LI>
</UL>

<LI><a href="#exportcert">Export the certificate in .pfx format</a>—On the server on which the certificate resides or was created, export the .cer file as a .pfx file (containing the private key). </LI>
<LI><a href="#importcert">Import the .pfx certificate to VMM servers</a>—After export of the .pfx file is complete, import it to the Personal certificate store on each VMM server that you want to register with the vault.</LI>
</OL>

<p>Use the following procedures to configure certificates.</p>

<h3><a id="obtaincert"></a>Obtain a self-signed certificate (.cer)</h3>
<P>If you want to use a self-signed certificate, create one as follows:</P>
<ol>
<li>Obtain the Makecert tool as described in  <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/aa386968(v=vs.85).aspx">MakeCert</a>. Note that when installing the Windows SDK, you can limit the installation to install makecert.exe only by selecting the option <b>Tools</b> under <b>.Net Development</b> and leaving everything else unchecked.</li>  
<li>Open a command prompt(cmd.exe) with Administrator privileges and run the following command, replacing <i>CertificateName</i> with the name of your certificate and specifying the actual expiration date of your certificate after -e:
<code>
makecert.exe -r -pe -n CN=CertificateName -ss my -sr localmachine -eku 1.3.6.1.5.5.7.3.2 -len 2048 -e 01/01/2016 CertificateName.cer</code></li>
</ol>
<P>The certificate will be created and stored in the same location.</P>



<h3><a id="exportcert"></a>Export the certificate in .pfx format</h3>
<P>Complete the steps in this procedure to export the .cer file in .pfx format.</P>
<ol>
<li>From the **Start** screen type mmc.exe to start the Microsoft Management Console (MMC).</li>
<li>On the <b>File</b> menu, click <b>Add/Remove Snap-in</b>. The **Add or Remove Snap-ins** dialog box appears.</li>
<li>In <b>Available snap-ins</b>, click <b>Certificates</b>, and then click <b>Add</b>.</li>
<li>Select <b>Computer account</b>, and then click <b>Next</b>.</li>
<li>Select <b>Local computer</b>, and then click <b>Finish</b>.</li>
<li>In the MMC, in the console tree, expand <b>Certificates</b>, and then expand <b>Personal</b>.</li>
<li>In the details pane, click the certificate you want to manage.</li>
<li>On the <b>Action</b> menu, point to <b>All Tasks</b>, and then click <b>Export</b>. The Certificate Export Wizard appears. Click <b>Next</b>.</li>
<li>On the <b>Export Private Key</b> page, click <b>Yes</b> to export the private key. Click <b>Next</b>. Note that this is only required if you want to export the private key to other servers after the installation.</li>
<li>On the <b>Export File Format</b> page, select <b>Personal Information Exchange – PKCS #12 (.PFX)</b>. Click <b>Next</b>.</li>
<li>On the <b>Password</b> page, type and confirm the password that is used to encrypt the private key. Click <b>Next</b>.</li>
<li>Follow the pages of the wizard to export the certificate in .pfx format.</li>
</ol>


<h3><a id="importcert"></a>Import the .pfx certificate to VMM servers</h3>
<p>After exporting the server, copy it to each VMM server you want to register in the vault, and then import it as follows. Note that if you ran MakeCert.exe on a VMM server, you don't need to import the certificate on that server.</p>
 
<ol>
<li>Copy the private-key (.pfx) certificate files to a location on the local server.</li>
<li>In the Certificates MMC snap-in select <b>Computer account</b> and then click <b>Next</b>.</li>
<li>Select <b>Local Computer</b>, and click <b>Finish</b>. In the **Add/Remove Snap-ins** dialog box, click <b>OK</b>. </li>
<li>In the MMC, expand <b>Certificates</b>, right-click <b>Personal</b>, point to <b>All Tasks</b>, and then click <b>Import</b> to start the Certificate Import Wizard.</li>
<li>On the <b>Certificate Import Wizard Welcome</b> page, click
> <b>Next</b>.</li>
<li>On the <b>File to Import</b> page, click <b>Browse</b> and locate the folder that contains the .pfx certificate file that contains the certificate that you want to import. Select the appropriate file, and then click <b>Open</b>.</li>
<li>On the <b>Password</b> page, in the <b>Password</b> box, type the password for the private-key file that you specified in the previous procedure and then click <b>Next</b>.</li>
<li>On the <b>Certificate Store</b> page, select <b>Place all certificates in the following store</b>, click <b>Browse</b>, select the <b>Personal</b> store, click <b>OK</b>, and then click <b>Next</b>.</li>
<li>On the <b>Completing the Certificate Import Wizard</b> page, click <b>Finish</b>.</li>
</ol>

After completing these steps, during the walkthrough you'll be able to select the .cer certificate for upload to the vault, and the .pfx certificate when you register a VMM server during installation of the Hyper-V Recovery Manager Provider.
</div>


<a name="vault"></a> <h2>Step 1: Create a vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

	<div chunk="../../Shared/Chunks/disclaimer.md"/>


2. Click **Data Services**, and then click **Recovery Services**. If you haven't signed up for the Recovery Services preview, the vault options will be grayed out. To register for the preview, click **Preview Program**. 

	![Preview Program](../media/RS_PreviewProgram.png)

3. Click **Recovery Services**, click **Create New**,  point to **Hyper-V Recovery Manager Vault**, and then click **Quick Create**.
	
	![New vault](../media/RS_hvvault.png)

3. In **Name**, enter a friendly name to identify the vault.

4. In **Region**, select the geographic region for the vault. 
5. In **Subscription**, type in your subscription details. For the preview version select **Free Trial**.

5. Click **Create vault**. 

<P>To check vault status, you can monitor the notifications at the bottom of the portal. After the vault has been created, a message will tell you that the vault has been successfully created, and it will be listed in the Recovery Services page as <B>Active</B>.</P>

<a name="upload"></a> <h2>Step 2: Upload a certificate (.cer)</h2>


2. In the **Recovery Services** page, open the required vault.
3. Click the Quick Start icon to open the Quick Start page.


	![Quick Start Icon](../media/RS_QuickStartIcon.png)

2. Click **Manage Certificate**.

	![Quick Start](../media/RS_QuickStart.png)

3. In the **Manage Certificate** dialog box, click **Browse For File** to locate the .cer file you want to upload to the vault.


	![Manage Certificate](../media/RS_ManageCert.png)


<a name="download"></a> <h2>Step 3: Download and install the Provider</h2>
Install the Hyper-V Recovery Manager Provider  on each VMM server with clouds containing virtual machines you want to protect. You can install the Provider from the Quick Start page, or from the Dashboard. The Provider installation file is located on the Windows Azure Download Center. When Setup runs the Provider is installed, and the VMM server is registered with the vault.

1. On the **Quick Start** page, click **Download Provider** to obtain the Provider installation .exe file. Place this file on the VMM server, and run it to begin Setup. 

	![Download Agent](../media/RS_installwiz.png)

2. Follow the steps to complete the Provider installation.

	![Setup Complete](../media/RS_SetupComplete.png)

3. After the Provider installation is complete, follow the wizard steps to register the VMM server with the vault.
4. On the Internet Connection page, specify how the Provider running on the VMM server connects to the Internet. The Provider can use the default Internet connection settings, or click <b>Use a proxy server for Internet requests</b> to specify that the Provider should connect with custom settings.
	
	![Internet Settings](../media/RS_ProviderProxy.png)

	The proxy user name will be created as a [VMM Run As]( http://go.microsoft.com/fwlink/?LinkId=324816) account.

5. On the Certificate Registration page, select the .pfx file that corresponds to the .cer you uploaded to the vault. This file is used to register each VMM server with the vault. 

	![Certificate Register](../media/RS_CertReg1.png)

	![Certificate Vault](../media/RS_CertReg2.png)

1. On the VMM Server page, specify a friendly name for the VMM server. **Enable Synchronize cloud data with the vault** if you want to publish all private clouds on the VMM server so that they are detected by Hyper-V Recovery Manager. Publishing the cloud synchronizes the data on all clouds with Hyper-V Recovery Manager in Windows Azure. Click **Register** to complete the process. Note that this feature is only available when you run at least Provider version 3.2.12.0, released in October 2013.

Note that the friendly name you specify for the VMM server will be used to identify it in the Hyper-V Recovery Manager console.


![Internet Settings](../media/RS_PublishCloudSetup.png)

<P>At this stage, metadata from the VMM server is retrieved by Hyper-V Recovery Manager, in order to orchestrate failover and recovery. After a server has been successfully registered its friendly name will be displayed on the <B>Resources</B> tab of the Servers page in the vault.</P>


<h2><a id="clouds"></a>Step 4: Configure cloud protections</h2>

After VMM servers are registered, you can begin configuring cloud protection, as follows:


- In the VMM console, publish each cloud you want to protect to Hyper-V Recovery Manager. This step is required only if you didn't enable the option **Synchronize cloud data with the vault** on the Initial Cloud Synchronization page of the Provider installation. Note that this setting is only applicable for VMM on servers running Windows System Center 2012 R2.
- In the vault, configure protection settings for each cloud.

<h3><a id="clouds"></a>Publish clouds</h3>

1. In the VMM console, open the **VMs and Services** workspace.
2. in the **VMs and Services** pane, open the cloud you want to publish.
3. On the **General** page of the cloud properties, to publish the cloud, select **Send configuration data about this cloud to the Windows Azure Hyper-V Recovery Manager**.

![Clouds](../media/RS_PublishCloud.png)

After a cloud is published it's displayed in the vault.

![Clouds](../media/RS_Clouds.png)

<h3><a id="clouds"></a>Configure clouds</h3>

To configure clouds for protection, do the following: 

1. On the Quick Start page, click **Configure Protection Settings**.
2. On the **Protected Items** tab, select the cloud that you want to configure and go to the **Configuration** tab.

	![Cloud Configuration](../media/RS_CloudConfig.png)


3. In **Target Location**, specify the VMM server that manages the cloud you want to use for recovery.
4. In **Target Cloud**, specify the target cloud you want to use for failover of virtual machines in the source cloud.
5. In **Copy Frequency**, specify how frequently data should be synchronized between source and target locations. This setting is only relevant for VMM servers running on Windows Server 2012 R2.
6. In **Additional Recovery Points**, specify the number of addition recovery points that will contain one or more snapshots should be kept.
7. In **Application-Consistent Snapshot Frequency**, specify how often to create snapshots.These snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken.  Note that taking snapshots of applications running on source virtual machines will impact performance.
8. In **Data Transfer Compression**, specify whether replicated data that is transferred should be compressed. 
9. In **Port**, modify the port number on which the source and target host computers listen for replication traffic. For example, you might modify the setting if you want to apply Quality of Service (QoS) network bandwidth throttling for replication traffic. 
10. In **Initial Replication Settings**, specify how the initial replication of data from source to target locations will be handled, before regular replication starts. 
	- **Over the network**—Copying data over the network can be time-consuming and resource-intensive. We recommend that you use this option if the cloud contains virtual machines with relatively small virtual hard disks, and if the primary VMM server is connected to the secondary VMM server over a connection with wide bandwidth. You can specify that the copy should start immediately, or select a time. If you use network replication, we recommend that you schedule it during off-peak hours.
	- **Offline**—This method specifies that the initial replication will be performed using external media. This method is useful if you want to avoid degradation in network performance, or for geographically remote locations. To use this method you specify the export location on the source cloud, and the import location on the target cloud. When you enable protection for a virtual machine, the virtual hard disk is copied to the specified export location. You send it to the target site, and copy it to the import location. The system copies the imported information to the replica virtual machines.

<h3><a id="offline"></a>Offline replication prerequisites</h3>

Note the following prerequisites for offline replication:

- On the source server, give full control NTFS & Share permissions to the VMM service  on the export path. On the target server, give these permissions to the VMM service account on the import path.
- If the path is shared, Administrator, Power User, Print Operator, or Server Operator group membership is required for the VMM service account  —on the remote machine on which the path is shared. This applies to both the import and export paths.
- If you are using any Run As Accounts to add hosts, give read & write permissions to the Run As Accounts in VMM, on the import & export path.
- In Active Directory, enable and configured constrained delegation on each host to trust the remote machine (with import/export path) to use any authentication protocol with allowed services as CIFS.
- The import and export shares should not be located on any computer used as a host, because loopback configuration is not supported by Hyper-V.


<h3><a id="cloudsettingd"></a>Settings after configuring protection</h3>
After you configure a cloud, all clusters and host servers that are configured in the source and target clouds are configured for replication. Specifically, the following are configured:

- Firewall rules used by Hyper-V Replica so that ports for replication traffic are opened. 
- Certificates required for replication are installed.
- Hyper-V Replica settings are configured.

Cloud settings can be modified on the **Configure** tab. Note that:

- We recommend that you select a target cloud that meets recovery requirements for the virtual machines you'll protect. 
- A cloud can only belong to a single cloud pair — either as a primary or a target cloud.
- After saving the cloud configuration, a job will be created, and can be monitored on the **Jobs** tab. After saving the configuration, to modify the target location or target cloud you must remove the cloud configuration, and then reconfigure the cloud.




<h2><a id="networks"></a>Step 5: Configure network mapping</h2>

On the **Networks** tab you configure mapping between VM networks on source and target VMM servers. Network mapping ensures that failed over virtual machines are connected to appropriate networks after the failover. Network mapping is also used during placement of a replica virtual machine, so that replica virtual machines are placed on hosts that can access the VM networks. 

We recommend you map networks as follows: 

- Map networks used by each cloud that is configured for protection.
- Perform network mapping before enabling virtual machines for protection, because mapping is used during placement of replica virtual machines. Mapping will work correctly if you configure it after enabling protection, but you might need to migrate some replica virtual machines.  

To map networks, do the following:

1. On the Quick Start page, click **Configure Network Mapping**.
4. In **Source Location**, select the source VMM server. 
5. In **Target Location**, select the target VMM server. If you are deploying Hyper-V Recovery Manager with a single VMM server then the source and target will be the same.
The list of source VM networks and their associated target VM networks is displayed. A blank value is shown for networks that are not mapped.
6. Select an unmapped entry in the source and target list,  and click **Map**. The service detects the VM networks on the target server and displays them.  

	![Manage certificate](../media/RS_networks.png)

7. On the Select a Target Network page, select the target VM network you want to use on the target VMM server.
![Target Network](../media/RS_TargetNetwork.png) 

8. Click the information icons next to the source and target network names to view the subnets and type for each network.

	When you select a target network, the protected clouds that use the source network are displayed, and the availability of the target VM networks associated with the clouds is also displayed. We recommend that you select a target network that is available to all clouds used for protection.

8. Click the check mark to complete the mapping process. A job starts to track the mapping progress. This can be viewed on the **Jobs** tab.

	This will connect any existing replica virtual machines corresponding to the virtual machines connected to the source VM network to the target VM network. This will also connect new replica virtual machines that are created after enabling replication on the virtual machines connected to the source VM network to the target VM network.

<h3><a id="modifynetworks"></a>Modify network mappings</h3>
Network mappings can be modified or removed on the **Networks** tab. Note the following:
<UL>
<LI>If you unmap a selected mapping, the mapping is removed and the replica virtual machines are disconnected from the network they were connected to at the time of mapping.</LI>
<LI>When you modify a selected mapping, changes are updated, and the replica virtual machines are connected to the new network settings provided.</LI>
</UL>

<h2><a id="virtualmachines"></a>Step 6: Enable protection for virtual machines</h2>

<p>After servers, clouds, and networks are configured correctly, you can enable virtual machines in the cloud for recovery and failover. Protection is enabled in the VMM console, by right-clicking each virtual machine you want to protect and selecting <b>Enable Recovery</b>.</p>

<p>After the enable recovery action starts successfully, you will be able to view the virtual machines in the virtual machines list of your cloud. You can view the progress of the enable recovery action in the <B>Jobs</B> tab.</p>
![Virtual Machines](../media/RS_Clouds.png)

<P>Three jobs are created when you enable protection of virtual machines. Firstly the Enable Protection job runs. Then after the initial replication completes two more Finalize Protection jobs run. The virtual machine is ready for failover only after these three jobs have completed successfully.</P>

<h2><a id="recoveryplans"></a>Step 7: Configure and run recovery plans</h2>
A recovery plan gather virtual machines together into groups for the purposes of failover and recovery, and it specifies the order in which the group should fail over. You can customize recovery plans to include automatic scripts that run as part of the recovery plan, or add a prompt to wait for confirmation of a manual action. To create a recovery plan, do the following: 

1. On the Quick Start page, click **Create Recovery Plan**.
2. On the Specify the Recovery Page Name and Target page, type in a name and the source and target VMM servers. If you are deploying Hyper-V Recovery Manager on a single VMM server then the source and target will be the same. Note that the source VMM server must contain virtual machines that are enabled for failover and recovery.

	![Create Recovery Plan](../media/RS_RecoveryPlan1.png)
3. In the Select Virtual Machines page, select virtual machines to add to the recovery plan. These are added to the recovery plan default group (Group 1).
4. Click the check mark to create the recovery plan.

	![Recovery Plan VMs](../media/RS_RecoveryPlan2.png)


After creating a recovery plan, you can perform the following actions:

- Customize the plan. You can add new groups to a recovery plan, or add virtual machines to a group. You can define custom actions in the form of scripts and manual actions that are completed before and after specified groups. Group names are incremental. After the default recovery plan Group 1, you create Group 2, and then Group 3, and so on. Virtual machines fail over according to group order.
- Perform failover on a recovery plan.
- Delete a recovery plan.


<h3><a id="customize"></a>Customize recovery plans</h3>

1. On the **Recovery Plans** tab, click the required recovery plan. 
2. You can customize the recovery plan as follows:

	<ul>
	<li><b>Add new groups</b>—You can add a new empty group to the plan. You can create up to seven groups. </li>
	<li><b>Add virtual machines to a group</b>—Only virtual machines that are not currently in the recovery plan are available to add. A virtual machine can be added to multiple recovery plans, but it can only appear once in each plan.</li>
	<li><b>Add a script</b>—You can optionally add scripts to run before or after a specific group. When a script is added, a new set of actions for the group is created. For example a set of pre-steps for Group 1 will be created with the name: Group 1: Pre-steps. All pre-steps will be listed inside this set. To add a script to a recovery plan, do the following:</li>
		<ol>
		<li>Create the script, verify it works as expected, and place it at the location \VMM_Server_Name\MSSCVMMLibrary with the same relative path on source and target VMM servers.</li>
		<li>In the <b>Script Location</b> text box, type in the relative path to the share. For example, if the share is located at \\VMM_Server_Name\MSSCVMMLibrary\Scripts\Script.PS1, specify the path: \Scripts\Script.PS1.</li>
		</ol>
	<li><b>Move the script position</b>—Use the <b>Move Up</b> and <b>Move Down</b> command buttons to move the position of the script up or down, and specify at which point in the recovery plan it will run.</li>
	<li><b>Add a manual action</b>—You can optionally add manual actions to run before or after a selected group. Specify a name and a list of instructions for the action. You can specify whether the action should be included in a test failover, planned failover, unplanned failover, or in a combination of these. Use the Manual Action command button to specify the point at which the manual action will run. When the recovery plan runs, it will stop at the point that the manual action should be run, and a dialog will appear that allows you to specify that the manual action was completed.</li>
	<li><b>Move custom steps or manual actions up or down</b>—You can reorder steps in a recovery plan by moving them up or down.</li> 
	<li><b>Remove or move virtual machines</b>—You can remove virtual machines from a recovery plan, or move them to a different group.</li>
	<li><b>Delete groups</b>—When a group is deleted, the groups below it are moved up. For example, if you delete Group 2, then Group 3 becomes Group 2. You cannot delete the default group — Group 1. Deleting a group also deletes the pre and post custom actions steps if any are configured.</li>
	</ul>


<h4><a id="script"></a>Script requirements</h4>
- Scripts should be written using Windows PowerShell.
- Scripts in a recovery plan run in the context of the VMM service account. Ensure that the script is tested to run at the VMM service account privilege level.
- If there is an exception in the script, the script stops running, and shows the task as failed. Ensure that you use try-catch blocks, so that the exceptions are handled gracefully. If an error does occur, any remaining part of the script will not run. If this occurs, fix the script, make sure it runs as expected, and then rerun the recovery plan.


<h3><a id="run"></a>Run recovery plans</h3>
Recovery plans can run as part of a proactive test or planned failover, or during an unplanned failover.

<h4><a id="protect"></a>Test failover</h4>

Use this method to fail over a complete recovery plan in a test environment. A test failover is useful to verify that your recovery plan and virtual machine failover strategy are working as expected.  Test failover simulates your failover and recovery mechanism in an isolated network. 

<h5><a id="networkrecommendations"></a>Before you start</h5>
When a test failover is triggered, you are requested to specify how test virtual machines should be connected to networks after the failover. 
<UL>
<LI>We recommend that you create a separate logical network  that is not used in production for this purpose.</LI>
<LI>If you are using a virtual LAN (VLAN) based logical network, ensure that the network sites you add to the logical network are isolated. </LI>
<LI>If you are using a Windows Network Virtualization-based logical network, Hyper-V Recovery Manager will automatically create isolated VM networks.</LI>
</UL>


<h5><a id="runtest"></a>Run a test failover</h5>
Run a test failover for a recovery plan as follows:

<OL>
<LI>On the <b>Recovery Plans</b> tab, select the required recovery plan.</LI>
<LI>To initiate the failover, click the <b>Test Failover</b> button.</LI>
<LI>On the Confirm Test Failover page, specify how virtual machines should be connected to networks after the test failover, as follows:</LI>
<UL>
<LI><b>None</b>—Select this setting to specify that VM networks should not be used in the test failover. Use this option if you want to test individual virtual machines rather than your network configuration. It also provides a quick glance of how test failover functionality works. Test virtual machines will not be connected to networks after a failover.</LI>
<LI><b>Use existing</b>—Use this option if you have already created and isolated a VM network to use for test failover. After the failover all test virtual machines used in the test failover will be connected to the network specified in <b>VM Network</b>.</LI>
<LI><b>Create automatically</b>—Select this setting to specify that Hyper-V Recovery Manager should automatically create a VM network based on the setting you specify in Logical Network, and its related network sites. Use this option if the recovery plan uses more than one VM network. In the case of Windows Network Virtualization networks, this option can be used to automatically create VM networks with the same settings (subnets and IP address pools) of those in the network of the replica virtual machine. These VM networks are cleaned up automatically after the test failover is complete.</LI>
</UL>
</OL>


<P>After the test failover is complete, do the following:</P>
<OL>
<LI>Verify that the virtual machines start successfully.</LI>
<LI>After verifying that virtual machines start successfully, complete the test failover to clean up the isolated environment. If you selected to automatically create VM networks, clean up deletes all the test virtual machines and test networks.</LI>
<LI>Click <b>Notes</b> to record and save any observations associated with the test failover.</LI>
<LI>When a test failover is initiated for a recovery plan, the failover process is displayed on the details page of the recovery plan. You can see individual test failover steps and their status, and view or create notes associated with the test failover. In addition, details of failover jobs can be viewed by looking at the failover job on the <b>Jobs</b> tab. The details display each job associated with the failover, its status, when it was started, and its duration. You can export a job in the failover list into an Excel spreadsheet.</LI>
</OL>


Note the following:

- On the Confirm Test Failover page, details of the VMM server on which the test virtual machines will be created is displayed.  
- You can follow the progress of test failover jobs on the <b>Jobs</b> tab. 


<h4><a id="protect"></a>Planned failover</h4>
Use a planned failover to perform a complete failover and recovery of virtual machines in your recovery plans in a proactive, planned manner. This type of failover provides a real validation of your environment, and ensure that unreplicated changes are applied to the replica virtual machine with no data loss. Run a planned failover for a recovery plan as follows:

<OL>
<LI>On the <b>Recovery Plans</b> tab, select the required recovery plan.</LI>
<LI>To initiate the failover, click the <b>Failover</b> button, and then click <b>Planned Failover</b>.</LI>
<LI>To ensure no data loss, the first step in the recovery plan for a planned failover is to shut down the virtual machines.</LI>
<LI>On the Confirm Planned Failover page, verify the failover direction. If previous failovers have worked as expected, and all of the virtual machines servers are located on either the source or target location, the failover direction details are for information only. If, however, virtual machines are active on both the source and target locations, the <b>Change Direction</b> button will appear. Use this button to change and specify the direction in which the failover should occur.</LI>
</OL>

<P>After process is complete, verify that planned failover has worked as expected. Then, do the following:</P>
<OL>
<LI>After the failover, the virtual machines are in a commit pending state. Click <b>Commit</b> to commit the failover. Note that this is only required if your configuration uses multiple recovery points. After you commit, any additional recovery points that are configured for a virtual machine are removed. </LI>
<LI>Click <b>Reverse Replicate</b> to begin reverse replication. After the failover, the virtual machines start up and are running at the secondary site. However, they are not protected or replicating. When you enable reverse replication, all the virtual machines in the recovery plan that are waiting for reverse replication in order to be protected will begin replicating.</LI>
</OL>
	

Note the following:

- You can follow the progress of planned failover jobs on the <b>Jobs</b> tab. Note that the commit and reverse replication actions trigger separate jobs.
- If an error occurs in the failover (either on a virtual machine or in a script included in the recovery plan), the planned failover of a recovery plan will stop. You can reinitiate the failover for the other virtual machines.
- The planned failover steps and status are shown on the details page for the recovery plan.


<h4><a id="protect"></a>Unplanned failover</h4>

Use an unplanned failover to fail over virtual machines in a reactive manner when a primary site becomes inaccessible due to an unexpected incident such as a power outage or virus attack. Even if errors occur during an unplanned failover, the recovery plan runs until complete. Run an unplanned failover for a recovery plan as follows:

<OL>
<LI>On the <b>Recovery Plans</b> tab, select the required recovery plan.</LI>
<LI>To initiate the failover, click the <b>Failover</b> button, and then click <b>Unplanned Failover</b>.</LI>
<LI>On the Confirm Planned Failover page, verify the failover direction. If previous failovers have worked as expected, and all of the virtual machines servers are located on either the source or target location, the failover direction details are for information only. If, however, virtual machines are active on both the source and target locations, the <b>Change Direction</b> button will appear. Use this button to change and specify the direction in which the failover should occur.</LI>
<LI>Specify the data that should be used for the unplanned failover, as follows:</LI>
	<UL>
	<LI><b>Failover and attempt to replicate the latest data changes</b>—Use this option when you anticipate a disaster, or if you want to try to synchronize your latest data changes. With this option enabled, Hyper-V Recovery Manager makes a best effort attempt to shut down the protected virtual machines and synchronize the data so that the latest version of the data will be failed over.</LI>
	<LI><b>Failover without attempting to replicate the latest data changes</b>—Use this option if the primary site is inaccessible, and you want to quickly recover to the secondary site without the latest changes. If you select to failover without replicating the latest data changes, then the failover will be from the latest available recovery point for the virtual machine.</LI>
	</UL>
</OL>

<P>After the process is complete, do the following:</P>

<OL>
<LI>After the failover the virtual machines are in a commit pending state. Click <b>Commit</b> to commit the failover.  After you commit any additional recovery points that are configured for a virtual machine are removed.</LI>
<LI>After failing over, when the primary site comes up with same underlying infrastructure, you can click <b>Reverse Replicate</b> to  start replicating again. This ensures that all the data is replicated back to the primary site, and that the virtual machine is ready for failover again. Reverse replication after an unplanned failover incurs an overhead in data transfer. The transfer will use the same method that is configured for initial replication settings for the cloud.</LI>
</OL>

You can follow the progress of unplanned failover jobs on the <b>Jobs</b> tab. Note that the commit and reverse replication actions trigger separate jobs.



<h2><a id="jobsdashboard"></a>Step 8:Monitoring</h2>
<h3><a id="jobsdashboard"></a>Using the Jobs tab and Dashboard</h3>

<h4><a id="jobs"></a>Jobs</h4>
The <b>Jobs</b> tab displays the main tasks performed by the Hyper-V Recovery Manager vault, including configuring protection for a cloud; enabling and disabling protection for a virtual machine; running a failover (planned, unplanned, or test); committing an unplanned failover; and configuring reverse replication. 

On the **Jobs** tab, you can do the following tasks:



- **Run a job query**— You can run a query to retrieve jobs that match specified criteria. You can filter for jobs using the following parameters:

- 	Find jobs that ran on a specific VMM server.
- 	Find jobs that were performed on a cloud, virtual machine, network, recovery plan in a cloud, or on all of these.
- 	Identify jobs that happened during a specific time range.

Note that a query can return a maximum of 200 jobs, so we recommend you narrow query parameters to return less than the maximum.

- **Get job details**—You can click on a job in the **Jobs** list in order to get more details. The details include the job name, its status, when it started and how long it lasted. On the Job details tab you can export the job details to an Excel spreadsheet, or attempt to restart a failed, skipped, or cancelled job. 
- **Export Jobs**—You can export the results of a job query to an Excel spreadsheet.
- **Restart**—You can restart jobs that failed to attempt to run them again.
- **Error Details**—For failed jobs you can click <b>Error Details</b> to get a list of errors for the job. Possible causes and recommendations are displayed for each error. The error description can be copied to the clipboard for troubleshooting.


>The **Jobs** tab provides the following information:
<UL>
<LI><b>Name</b>—The job name</LI>
<LI><b>Item</b>—The name of the cloud, recovery plan, VMM server, or virtual machine on which the job ran.</LI>
<LI><b>Status</b>—Job status - completed, canceled, failed, or other</LI>
<LI><b>Type</b>—Job type</LI>
<LI><b>Started At</b>—When the job started</LI>
<LI><b>Task Time</b>—The job duration</LI>
</UL>

	

![Jobs tab](../media/RS_Jobs.png)



<h4><a id="protect"></a>Run a job query</h4>

You can run queries to retrieve jobs that match specified criteria, including:
<UL>
	<LI>Jobs that ran on a specific VMM server.</LI>
	<LI>Jobs that were performed on a specific cloud, virtual machine, network, recovery plan, or all of these.</LI>
	<LI>Jobs that happened during a specific time range.</LI>
</UL>
	

To run a job query do the following:
<OL>
<LI>Open the <b>Jobs</b> tab</LI>
<LI>In <b>Server</b>, specify the VMM server on which the job ran</LI>
<LI>In <b>Type</b>, specify whether the job was performed on a cloud, virtual machine, network, or recovery plan in a cloud.</LI>
<LI>In <b>Status</b>, specify the job status.</LI>
<LI>In <b>Duration</b>, specify the time range in which the job occurred.</LI>
</OL>


<h4><a id="dashboard"></a>Dashboard</h4>
<P>The <b>Dashboard</b> tab provides a quick overview of Hyper-V Recovery Manager usage in your organization.  It provides a centralized gateway to view virtual machines protected by Hyper-V Recovery Manager vaults. The Dashboard provided the following functionality:</P>

On the **Dashboard** tab you can do the following tasks:



- **Download Provider**—Download the Hyper-V Recovery Manager provider for installation on a VMM server.
- **Manage Certificate**—Modify settings for the certificate associated with the vault.
- **Delete—**Delete a vault.
- **Resynchronize virtual machines**—If Hyper-V Recovery Manager detects that any primary and recovery virtual machines are not synchronized as expected, you can view a list of the relevant virtual machines and select any that you want to attempt to resynchronize from the Dashboard. 


The **Dashboard** tab provides the following information:
<UL>
<LI><b>Usage Overview</b>—Shows the number of virtual machines that have protection managed by Hyper-V Recovery Manager.</LI>
<LI><b>Quick Glance</b>—Displays crucial configuration information for recovery services and the Hyper-V Recovery Manager vault. It tells you whether the vault is online, which certificate is assigned to it, when the certificate expires, and subscription details for the service.</LI>
<LI><b>Recent Jobs</b>—Shows jobs that have succeeded or failed in the last 24 hours, or jobs that are in progress or waiting for action.</LI>
<LI><b>Issues</b>—The dashboard shows information about issues with VMM server connections, and issues with cloud configuration settings or synchronization of virtual machine replication. You can get more details of an issue, view jobs associated with the issue, or try to resynchronize virtual machines.</LI>
</UL>


![Dashboard](../media/RS_Dashboard.png)

<h2><a id="next"></a>Next steps</h2>
<UL>
<LI>Visit the [MSDN library for Hyper-V Recovery Manager]( http://go.microsoft.com/fwlink/?LinkId=321296)</LI>
<LI>Visit the [Windows Azure Recovery Services Forum]( http://go.microsoft.com/fwlink/?LinkId=313628)</LI> 
</UL>
