<properties linkid="configure-hyper-v-recovery-vault" urlDisplayName="configure-hyper-v-recovery-vault" pageTitle="Configure Windows Azure Recovery Services to provide a Hyper-V recovery environment" metaKeywords="hyper-v recovery, disaster recovery" metaDescription="Windows Azure Hyper-V Recovery Manager can help you protect important services by coordinating the replication and recovery of System Center 2012 private clouds at a secondary location." metaCanonical="" umbracoNaviHide="0" disqusComments="1" writer="starra" editor="tysonn" manager="cynthn" />
<div chunk="../chunks/recoveryservices-left-nav.md"/> 


<h1><a id="configure-hyper-v-recovery-vault-tutorial"></a>Configure Hyper-V Recovery Manager in Windows Azure Recovery Services</h1>
<div class="dev-callout"> 
<p>Hyper-V Recovery Manager in Windows Azure Recovery Services provides failover and protection for Hyper-V virtual machines located in clouds on System Center 2012 Virtual Machine Manager (VMM) servers.</p>

<p>This tutorial helps you create a Hyper-V Recovery Manager vault in Windows Azure, upload a management certificate to the vault, download and install the Hyper-V Recovery Manager agent on VMM servers,  register VMM servers with the vault, configure settings for VMM clouds, and enable protection for Hyper-V virtual machines in the clouds.</p>

<p>After virtual machines are enabled for protection, you can create recovery plans that specify the order in which groups of virtual machines should fail over.</p>

<p>To complete this tutorial, you need a Windows Azure account that has the Windows Azure Recovery Services feature enabled.</p>

<ul> 
<li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="/en-us/pricing/free-trial/">Windows Azure Free Trial</a>.</li> 
<li>If you have an existing account but need to enable the Windows Azure Recovery Services preview, see <a href="/en-us/develop/net/tutorials/create-a-windows-azure-account/#enable" target="_blank">Enable Windows Azure preview features</a>.</li>
</ul>
</div>

<h2><a id="before"></a>Before you begin</h2> 
<div class="dev-callout"> 

<p>To successfully complete this tutorial you need the following:</p>

<ul>
<li>At least two VMM servers running System Center 2012 Service Pack 1 (SP1), located in different datacenters. Check that VMM servers in both datacenters are available.</li>
<li>At least one cloud configured on the source VMM server you want to protect, and one cloud on the destination VMM server that you want to use for failover and recovery.</li>
<li>One or more virtual machines located in the cloud that you want to protect.</li>
<li>Verify that VM networks are configured on the source server, and that corresponding VM networks are created on the destination server. Ensure that networks are connected to the correct source and destination clouds.</li>
<li>A management certificate that you will upload to the Hyper-V Recovery vault. Note that:
	<ul>
	<li>To upload to the certificate to the vault, you must export it as a .cer format file that contains the public key.</li>
	<li>The certificate should be an x.509 v3 certificate.</li>
	<li>The key length should be at least 2048 bits.</li>
	<li>The certificate must have a valid ClientAuthentication EKU.</li>
	<li>The certificate should be currently valid with a validity period that does not exceed 3 years.</li>
	<li>The certificate should reside in the Personal certificate store of your Local Computer.</li>
	<li>The private key should be included during installation of the certificate.</li>
	<li>You can create a self-signed certificate using the makecert tool, or use any valid SSL certificate issued by a Certification Authority (CA) trusted by Microsoft, whose root certificates are distributed via the Microsoft Root Certificate Program. For more information about this program, see Microsoft article <a href="http://go.microsoft.com/fwlink/p/?LinkId=294666">Windows Root Certificate Program members</a>.</li>
	</ul>
</li>
</ul>

<p>To use makecert.exe note that:</p>

<ul>
<li>If you register the server you used to run makecert.exe, you can browse for the certificate using the Register Server Wizard (after installation of the agent).</li>
<li>If you want to register a server that was not used to run makecert.exe, you must export the .pfx file (containing the private key) from that server, and copy it to the server you want to register, and import it into the Personal certificate store on that server. After the import, you can browse for the certificate using the Register Server Wizard (which runs as part of the agent installation application).</li>
</ul>

<p>Use the following procedures to perform these actions.</p>

<h3><a id="obtaincert"></a>To obtain a self-signed certificate</h3>
<ol>
<li>Obtain the Makecert tool as described in  <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/aa386968(v=vs.85).aspx">MakeCert</a>. Note that when installing the Windows SDK, you can install makecert.exe only by selecting the option <b>Tools</b> under <b>.Net Development</b> and leave everything else unchecked.</li>  
<li>Open Command Prompt (cmd.exe) with Administrator privileges and run the following command, replacing <i>CertificateName</i> with the name of your certificate and specifying the actual expiration date of your certificate after -e:
<code>
makecert.exe -r -pe -n CN=CertificateName -ss my -sr localmachine -eku 1.3.6.1.5.5.7.3.2 -len 2048 -e 01/01/2016 CertificateName.cer</code></li>
</ol>


<h3><a id="exportcert"></a>To export a certificate (.pfx) using the Certificates snap-in</h3>
<ol>
<li>From the Start screen type mmc.exe to start the Microsoft Management Console (MMC).</li>
<li>On the <b>File</b> menu, click <b>Add/Remove Snap-in</b>. The Add or Remove Snap-ins dialog box appears.</li>
<li>In <b>Available snap-ins</b>, click <b>Certificates</b>, and then click <b>Add</b>.</li>
<li>Select <b>Computer account</b>, and then click <b>Next</b>.</li>
<li>Select <b>Local computer</b>, and then click <b>Finish</b>.</li>
<li>In the MMC, in the console tree, expand <b>Certificates</b>, and then expand <b>Personal</b>.</li>
<li>In the details pane, click the certificate you want to manage.</li>
<li>On the <b>Action</b> menu, point to <b>All Tasks</b>, and then click <b>Export</b>. The Certificate Export Wizard appears. Click <b>Next</b>.</li>
<li>On the <b>Export Private Key</b> page, click <b>Yes</b>, export the private key. Click <b>Next</b>. Note that this is only required if you want to export the private key to other servers after the installation.</li>
<li>On the <b>Export File Format</b> page, select <b>Personal Information Exchange – PKCS #12 (.PFX)</b>. Click <b>Next</b>.</li>
<li>On the <b>Password</b> page, type and confirm the password that is used to encrypt the private key. Click <b>Next</b>.</li>
<li>Follow the pages of the wizard to export the certificate in PFX format.</li>
</ol>


<h3><a id="obtaincert"></a>To import the private key certificate to a different server</h3>
<ol>
<li>Copy the private-key (.pfx) certificate files to a location on the local server.</li>
<li>In the Certificates MMC snap-in select <b>Computer account</b> and click <b>Next</b>.</li>
<li>Select <b>Local Computer</b> and click <b>Finish</b>. You are returned to the Add/Remove Snap-in dialog box, click <b>OK</b>. </li>
<li>In the MMC, expand <b>Certificates</b>, right-click <b>Personal</b>, point to <b>All Tasks</b>, and then click <b>Import</b> to start the Certificate Import Wizard.</li>
<li>On the <b>Certificate Import Wizard Welcome</b> page, click <b>Next</b>.</li>
<li>On the <b>File to Import</b> page, click <b>Browse</b> and locate the folder that contains the .pfx certificate file that contains the certificate that you want to import. Select the appropriate file, and then click <b>Open</b>.</li>
<li>On the <b>Password</b> page, in the <b>Password</b> box, type the password for the private-key file that you specified in the previous procedure and then click <b>Next</b>.</li>
<li>On the <b>Certificate Store</b> page, select <b>Place all certificates in the following store</b>, click <b>Browse</b>, select the <b>Personal</b> store, click <b>OK</b>, and then click <b>Next</b>.</li>
<li>On the <b>Completing the Certificate Import Wizard</b> page, click <b>Finish</b>.</li>
</ol>
</div>

<h2><a id="create"></a>Create a vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

	<div chunk="../../Shared/Chunks/disclaimer.md"/>

2. Click **Data Services**, then click **Recovery Services**. If you have not signed up for the Recovery Services preview, the vault options will be grayed out. To register for the preview, click **Preview Program**. The preview process is automatically approved.

	![Preview Program](../media/RS_PreviewProgram.png)

3. Click **Recovery Services**, then click **Create New**,  point to **Hyper-V Recovery Manager Vault**, and then click **Quick Create**.

	![New vault](../media/RS_hvvault.png)

3. In **Name**, enter a friendly name to identify the vault.

4. In **Region**, select the geographic region for the vault.  

5. Click **Create vault**.

	It can take a while for the vault to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the vault has been created, a message will tell you that the vault has been successfully created and it will be listed in the resources for Recovery Services as **Online**. 

<h2><a id="upload"></a>Upload a certificate</h2>


1. Click the Quick Start icon to open the Quick Start page.

	![Quick Start Icon](../media/RS_QuickStartIcon.png)

2. Click **Manage Certificate**.

	![Quick Start](../media/RS_QuickStart.png)

3. In the **Manage Certificate** dialog click **Browse Your Computer** to locate the .cer file to upload to the vault.

You can also upload and manage certificates from the **Dashboard** tab for the vault. To do this, click **Recovery Services**, and click the vault name. On the **Dashboard** tab, click **Manage Certificate**.

  
<h2><a id="download"></a>Download and install the agent</h2>

Install the Hyper-V Recovery Manager provider agent on each VMM server that contains virtual machines you want to protect. Agents are accessed on the Windows Azure Download Center, and have their own setup process. When setup runs the agent is installed, and the VMM server is registered with the vault, as follows:


1. On the **Quick Start** page, click **Download Agent**. Run Setup to start the installation wizard.

	![Download Agent](../media/RS_installwiz.png)

2. After the agent installation is complete, the VMM server is registered with the vault. During registration you do the following:
	<ul>
	<li>Specify how the agent running on the VMM server connects to the Internet. The agent can use the default Internet connection settings, or you can configure specific proxy settings.</li>
	<li>Select the .pfx file that corresponds to the .cer that you uploaded to the vault. The private key of the certificate is used to register the VMM server to the vault.</li>
	</ul>

<h2><a id="manage"></a>Configure clouds for protection</h2>
After VMM servers are registered, all clouds configured on the servers are displayed in the vault.

	![Clouds](../media/RS_clouds.png)

To configure clouds for protection, do the following: 

1. On the Quick Start page, click **Configure Protection Settings**.
2. In the **Protected Items** list, select the cloud that you want to configure and drill down to the **Configuration** tab.

	![Cloud Configuration](../media/RS_CloudConfig.png)

3. In **Target Location**, specify the VMM server that manages the cloud which will be used for recovery.
4. In **Target Cloud**, specify the target cloud that will be used for failover of virtual machines in the source cloud.
4. In **Application-Consistent Snapshot Frequency**, specify how often to create snapshots.These snapshots use Volume Shadow Copy Service (VSS) to ensure that applications are in a consistent state when the snapshot is taken.  Note that taking snapshots of applications running on source virtual machines will impact performance. 
5. In **Initial Replication Settings**, specify how the initial replication of data from source to target locations will be handled, before regular replication starts. 
	- Over the network—Copying data over the network can be time-consuming and resource-intensive. We recommend that you use this option if the cloud contains virtual machines with relatively small virtual hard disks, and if the primary VMM server is connected to the secondary VMM server over a connection with wide bandwidth. You can specify that the copy should start immediately, or select a time. If you use network replication, we recommend that you schedule it during off-peak hours.
	- Offline—This method specifies that the initial replication will be performed using external media. This method is useful if you want to avoid degradation in network performance, or for geographically remote locations. To use this method you specify the export location on the source cloud, and the import location on the target cloud. When you enable protection for a virtual machine, the virtual hard disk is copied to the specified export location. You send it to the target site, and copy it to the import location. The system copies the imported information to the replica virtual machines.

Note the following prerequisites for offline replication:

- On the source server, give full control NTFS & Share permissions to the VMM service  on the export path. On the target server, give these permissions to the VMM service account on the import path.
- If the path is shared, Administrator, Power User, Print Operator, or Server Operator group membership is required for the VMM service account  —on the remote machine on which the path is shared. This applies to both the import and export paths.
- If you are using any Run As Accounts to add hosts, give read & write permissions to the Run As Accounts in VMM, on the import & export path.
- In Active Directory, enable and configured constrained delegation on each host to trust the remote machine (with import/export path) to use any authentication protocol with allowed services as cifs.
- The import and export shares should not be located on any computer used as a host, because loopback configuration is not supported by Hyper-V.



After you select a cloud, all clusters and host servers that are configured in the source and target clouds are configured for replication. Specifically, the following are configured:


- Firewall rules used by Hyper-V Replica 
- Ports for replication traffic are opened
- Certificates required for replication are installed
- Hyper-V Replica settings are configured

Cloud settings can be modified and saved on the **Configure** tab:

- We recommend that you select a target cloud that meets recovery requirements for the virtual machines you will protect. 
- A cloud can only belong to a single cloud mapping — either as a primary or a target cloud.
- After saving the cloud configuration, to modify the target location or target cloud you must remove the cloud configuration, and then reconfigure the cloud.



<h2><a id="networks"></a>Configure Networks</h2>

On the **Networks** tab you configure mapping between VM networks on source and target VMM servers. Network mapping is used during placement of a replica virtual machine. Replica virtual machines are placed on hosts which have access to the VM networks. When protection is enabled, the replica virtual machine is connected to the VM network. This ensures that when the machine fails over it is connected to the right network. 

We recommend you map networks as follows: 

- Map networks used by each cloud that is configured for protection.
- Perform network mapping before enabling virtual machines for protection. Hyper-V Recovery Manager tries to connect the virtual machine to specified network and the attempt will fail if the host on which the virtual machine is placed does not have access to the network. If you do not configure mapping first, you will need to either add the network to the host, or migrate the virtual machine to a host which has access to the network.  

To map networks, do the following:

1. On the Quick Start page, click **Configure Network Mapping**.

4. Select the source VMM server and then the target VMM server.

5. Select an item from **Network on source** and then click **Map**. 

	![Manage certificate](../media/RS_networks.png)

7. In the dialog that is displayed, select one of the VM networks from the target VMM server. 

8. Click the information icon next to the source and target network names to view the subnets and type for each network.

	When you select a target network, the protected clouds that use the source network are displayed. Availability of target networks associated with the clouds used for protection is also displayed. We reommend that you select a target network that is available to all clouds used for protection.

8. Click the checkmark to complete the mapping process.

	This will connect any existing replica virtual machines corresponding to the virtual machines connected to the source VM network to the target VM network. This will also connect new replica virtual machines that are created after enabling replication on the virtual machines connected to the source VM network to the target VM network.



<h2><a id="protect"></a>Enable protection for virtual machines</h2>
After servers, clouds, and networks are configured correctly, you can enable virtual machines in the cloud for recovery and failover. Protection is enabled in the VMM console, by selecting the **Enable Replication** checkbox for each virtual machine you want to protect. Once the virtual machines are replicated to the vault you will be able to view them in the virtual machines list of your cloud.
 
![Manage certificate](../media/RS_clouds.png)

<h2><a id="protect"></a>Create recovery plans</h2>
A recovery plan groups virtual machines together for the purposes of failover and recovery, and specifies the order in which the grouped virtual machines should fail over. You can customize recovery plans to include automatic scripts that run as part of the recovery plan, or add a prompt to wait for confirmation of a manual action. To create a recovery plan do the following: 

1. On the **Recovery Plans** tab, click **Create Recovery Plan**.
2. Specify a name for the recovery plan, and the source and target VMM servers. Note that source servers must have virtual machines that are enabled for failover and recovery.

	![Create Recovery Plan](../media/RS_RecoveryPlan1.png)

3. In **Select Virtual Machine**, select virtual machines to add to the recovery plan. These are added to the recovery plan default group — Group 1.

	![Recovery Plan VMs](../media/RS_RecoveryPlan2.png)

After creating a recovery plan, you can perform the following actions:

- Customize additional recovery plans. You can add new groups and custom actions in the form of scripts and manual actions that are completed before and after specified groups. Group names are incremental. After the default recovery plan Group 1, you create Group 2, then Group 3 etc. Virtual machines fail over according to group order.
- Perform failover on a recovery plan.
- Customize a recovery plan.
- Delete a recovery plan.


<h2><a id="protect"></a>Customize recovery plans</h2>

1. On the **Recovery Plans** tab, click a recovery plan to drill down. 
2. You can customize the recovery plan as follows:

	<ul>
	<li>Add new groups to the recovery plan—This appends a new empty group to the plan. You can create up to seven groups. </li>
	<li>Add virtual machines to a group—Only virtual machines that are not currently in the recovery plan are available to add. A virtual machine can be added to multiple recovery plans, but can only appear once in each plan. 
</li>
	<li>Add a script to the recovery plan—You can optionally add scripts to run before or after a specific group. When a script is added, a new set of actions for the group is created. For example a set of pre-steps for Group 1 will be created with the name: Group 1: Pre-steps. All pre-steps will be listed inside this set. To add a script to a recovery plan, do the following:</li>
		<ol>
		<li>Create the script, verify it works as expected, and place it at location \*VMM_Server_Name*\MSSCVMMLibrary on the source and target VMM servers.</li>
		<li>In the Script Location text box, type in the relative path to the share. For example, if the share is located at \\*VMM_Server_Name*\MSSCVMMLibrary\Scripts\Script.PS1, specify the path: \Scripts\Script.PS1.</li>
		</ol>
	<li>Move the script location—Use the Script command button to move the location of the script up or down, and specify at which point in the recovery plan it will run.</li>
	<li>Add a manual action to the recovery plan—You can optionally add manual actions to run before or after a selected group. Specify a name and a list of instructions for the action. You can specify whether the action should be included in a test failover, planned failover, unplanned failover, or in a combination of these. Use the Manual Action command button to specify the point at which the manual action will run. When the recovery plan runs, it will stop at the point that the manual action should be run, and a dialog will appear that allows you to specify that the manual action was completed.</li>
	<li>Move steps up or down—You can reorder steps in a recovery plan by moving them up or down.</li> 
	<li>Remove or move virtual machines—You can remove virtual machines from a recovery plan, or move them to a different group.</li>
	<li>Delete groups from the recovery plan—When a group is deleted, the groups below it are moved up. For example if you delete Group 2, then Group 3 becomes Group 2. You cannot delete the default group — Group 1. Deleting a group also deletes the pre and post custom actions steps if any. </li>
	</ul>


Note the following:

- Scripts should be written using Windows PowerShell
- Scripts in a recovery plan run in the context of the VMM Service account.  Ensure that the script is tested to run at the VMM service account privilege level.
- If there is an exception in the script, the script stops running, and shows the task as failed. Ensure that you use try-catch blocks, so that the exceptions are handled gracefully.


<h2><a id="protect"></a>Run recovery plans</h2>
Recovery plans can run as part of a proactive test or planned failover, or during an unplanned failover.



- **Test failover**—Use a test failover if you want to verify that your recovery plan and virtual machine failover strategy is working as expected.  Test failover simulates your failover and recovery mechanism in an isolated network.  When a test failover is triggered, you are requested to select a logical network to use. You should create a separate  logical network (not used in production) for this purpose. This logical network is used to create VM networks during test failover. After the test failover completes, the temporary networks and test virtual machines are cleaned up automatically. Note that:
	- If you are using a VLAN-based logical network, ensure that the network sites you add to the logical network are isolated. 
	- If you are using a Windows Network Virtualization-based logical network, Hyper-V Recovery Manager will automatically create isolated VM networks.
- **Planned failover**—Use a planned failover to perform a complete failover and recovery of virtual machines in your recovery plans. This provides a real validation of your environment. The virtual machines being failed over should be shut down to ensure zero data loss. If any errors occur during planned failover of a recovery plan, the plan stops running.   Script failures will not stop the recovery plan failover.
- **Unplanned failover**—Un	planned failover occurs when a primary site experiences an unexpected incident such as a power outage or virus attack. Even if errors occur during an unplanned failover, the recovery plan runs until complete. 

After a failover is started, you can track its progress on the **Jobs** tab.

Note the following when running recovery plans:

- The first step shown in the recovery plan is shutdown of all the virtual machines. This step is only performed during a planned failover.
- If an error occurs when running a script, any remaining part of the script will not run. If this occurs, verify that the script works as expected and then rerun the recovery plan.
- If a planned or unplanned failover in a recovery plan does not run as expected, errors might not be displayed properly when you click **Error Details**. As a workaround, open the failover job in the **Jobs** tab to see error details.

<h2><a id="protect"></a>Using the Jobs tab and Dashboard</h2>

<h3><a id="protect"></a>Jobs</h3>
The **Jobs** tab displays the main tasks performed by the Hyper-V Recovery vault. 

- You can drill down to details for a job, to see the specific tasks and actions associated with the job, and their status. This is useful to check whether jobs complete as expected, and for troubleshooting if required.
- You can run queries to retrieve jobs that match specified criteria, including:
	- Find jobs that ran on a specific VMM server.
	- Find jobs that were performed on a cloud, virtual machine, network, recovery plan in a cloud, or on all of these.
	- Identify jobs that happened during a specific time range.

![Jobs tab](../media/RS_Jobs.png)

- Jobs errors can be viewed in **Error Details**. The error description can be copied to the clipboard for troubleshooting.


<h3><a id="protect"></a>Dashboard</h3>

The **Dashboard** tab provides a quick overview of Hyper-V Recovery Manager usage in your organization.  It provides a centralized gateway to view virtual machines protected by Hyper-V Recovery Manager vaults.

- **Usage Overview** shows the number of virtual machines that have protection managed by Hyper-V Recovery. 
- **Quick Glance** displays crucial configuration information for recovery services and the Hyper-V Recovery Manager vault. It tells you whether the vault is online, which certificate is assigned to it, when the certificate expires, and subscription details for the service.  

From the dashboard you can download the Hyper-V Recovery Manager agent for installation on a server, modify settings for certificates uploaded to the vault, and delete a vault if required.

![Dashboard](../media/RS_Dashboard.png)

<h2><a id="next"></a>Next steps</h2>

 Visit the [Windows Azure Recovery Services Forum]( http://go.microsoft.com/fwlink/p/?LinkId=296711). Note that sign in is required for the forum. It is only open to customers who have signed up for the Hyper-V Recovery Manager vault preview.
