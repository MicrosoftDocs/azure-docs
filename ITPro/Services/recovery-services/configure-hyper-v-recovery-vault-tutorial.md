<properties linkid="configure-hyper-v-recovery-vault" urlDisplayName="configure-hyper-v-recovery-vault" pageTitle="Configure Windows Azure Recovery Services to provide a Hyper-V recovery environment" metaKeywords="hyper-v recovery, disaster recovery" metaDescription="Windows Azure Hyper-V Recovery Manager can help you protect important services by coordinating the replication and recovery of System Center 2012 private clouds at a secondary location." metaCanonical="http://www.windowsazure.com/" umbracoNaviHide="0" disqusComments="1" writer="starra" editor="tysonn" manager="cynthn" />
<div chunk="../chunks/recoveryservices-left-nav.md"/> 

<h1><a id="configure-hyper-v-recovery-vault-tutorial"></a>Configure Windows Azure Recovery Services to provide a Hyper-V recovery environment</h1>

A Hyper-V Recovery Manager vault defines a collection of Hyper-V virtual machines located in clouds on System Center 2012 Virtual Machine Manager (VMM) servers that are enabled for failover and protection using Windows Azure Recovery Services. This tutorial will walk you through the creation of the vault, the uploading of a certificate to the vault, the download and installation of the agent, and configuration tasks performed through the management portal.

<div class="dev-callout"> 
<strong>Before you begin</strong> 
<p>To successfully complete this tutorial you must have 
an X.509 v3 certificate to register your servers with Recovery Services vaults.  The certificate must have a key length of at least 2048 bits and should reside in the Personal certificate store of your Local Computer. When the certificate is installed on your server, it should contain the private key of the certificate. To upload to the certificate to the Windows Azure Management Portal, you must export the public key as a .cer format file.</p> 

<p>You can either use:</p> 
<ul>
<li>Your own self-signed certificate created using makecert tool, OR</li> 

<li>Any valid SSL certificate issued by a Certificate Authority (CA) that is trusted by Microsoft and whose root certificates are distributed via the Microsoft Root Certificate Program. For more information about this program see <a><href>http://support.microsoft.com/kb/931125</href></a>.</li>
</ul> 

<p>Some other attributes which you need to ensure on the certificates are:</p> 

<ul>
<li>Has a valid ClientAuthentication EKU</li>

<li>Is currently valid with a validity period that does not exceed 3 years</li>  
</ul>

<p>To use your own self-signed certificate, follow these steps: </p>
<ol>
<li>Download the Certificate Creation Tool (makecert.exe) from <a><href>http://gallery.technet.microsoft.com/Certificate-Creation-tool-5b7c054d</href></a></li>  


<li>Open Command Prompt (cmd.exe) with Administrator privileges and run the following command, replacing <i>CertificateName</i> with the name of your certificate : 
<code>
makecert.exe -R -PE -N CN=CertificateName -SS my -SR localmachine -EKU 1.3.6.1.5.5.7.3.2 –len 2048 “CertificateName.cer”</code></li>
</ol>
<p>
If you will be registering a different server than the one you used to make the certificate, you need to export the .pfx file (that contains the private key), copy it to the other server and import it to that server’s Personal certificate store. 
</p> 
</div>

<h2><a id="create"></a>Create a vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

<div chunk="../../Shared/Chunks/disclaimer.md"/>

2. Click **Recovery Services**, then click **Create New**,  point to **Hyper-V Recovery Manager Vault**, and then click **Quick Create**.

	![New vault](../media/RS_hvvault.png)

3. In **Name**, enter a friendly name to identify the backup vault.

4. In **Region**, select the geographic region for the backup vault.  

5. Click **Create vault**.

	It can take a while for the vault to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the vault has been created, a message will tell you that the vault has been successfully created and it will be listed in the resources for Recovery Services as **Online**. 

<h2><a id="upload"></a>Upload a certificate</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of vault that will be identified by the certificate and then click **Manage certificate**.
	
	![Manage certificate](../media/RS_howtoupload1.png)
3. In the **Manage Certificate** dialog click Browse Your Computer to locate the .cer file to use with this backup vault.
<h2><a id="download"></a>Download and install the agent</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of vault to view the vault dashboard.

3. Click **Download Agent**. The agent will be automatically download and the installation wizard will start.
	
	![Download Agent](../media/RS_installwiz.png)
4. Complete the wizard to register the VMM server, identify the private key certificate on the VMM server that matches the public key certificate you uploaded to the vault, and then associate this VMM server with a specific vault. 
  

<h2><a id="manage"></a>Configure clouds for protection</h2>
After VMM servers are registered, all clouds configured on the servers are displayed in the vault.  When you select a cloud to protect, you specify the following configuration details in the management portal: 

* The target location that will be used for failover of virtual machines in the source cloud.
* How initial replication of data from the source to target locations will be handled.
* How frequently data will be synced between the source and target locations following initial replication.
* How often to create data checkpoints.  
After you select a cloud, all clusters and host servers that are configured in the source and target clouds are configured for replication. Specifically:
* Firewall rules used by Hyper-V Replica are configured.
* Ports for replication traffic are opened.
* Certificates required for replication are installed.
* Hyper-V Replica settings are configured.

<h2><a id="networks"></a>Configure Networks and Servers (Optional)</h2>

You can optionally map logical networks in source clouds to logical networks in target clouds, to ensure that failed over virtual machines are connected to appropriate networks after the failover.
 
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of vault that contains the VMM servers for which you want to configure network mapping.

3. Select the source cloud and then click **Networks**

4. Select a source server and a target location.

5. Select an item from **Network on source** and then click **Map**. The network settings from the source network are applied to the target location automatically.

	![Manage certificate](../media/RS_networks.png)

<h2><a id="protect"></a>How to: Protect virtual machines</h2>
After servers, clouds, and networks are configured correctly, you can enable virtual machines in the cloud for recovery and failover. Protection is enabled in the VMM console, by selecting the **Enable Replication** checkbox for each virtual machine you want to protect. Once the virtual machines are replicated to the vault you will be able to view them in the virtual machines list of your cloud.
 
![Manage certificate](../media/RS_clouds.png)

<h2><a id="next"></a>Next steps</h2>

- [Create a recovery plan](http://go.microsoft.com/fwlink/p/?LinkId=290953) to group virtual machines together for the purposes of failover and recovery. 
- To learn more about Windows Azure Recovery Services, see [Introducing Windows Azure Recovery Services](http://www.windowsazure.com/). 
- Visit the [Windows Azure Recovery Services Forum]( http://go.microsoft.com/fwlink/p/?LinkId=290933).
