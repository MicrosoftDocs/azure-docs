<properties linkid="manage-services-recovery-configure-backup-vault" urlDisplayName="Configure a Backup Vault" pageTitle="Configure Azure Recovery Services to quickly and easily back-up Windows Server" metaKeywords="disaster recovery" description="Use this tutorial to learn how to use the Backup service in Microsoft's Azure cloud offering to back up Windows Server to the cloud." metaCanonical="" services="recovery-services" documentationCenter="" title="Configure Azure Backup to quickly and easily back-up Windows Server" authors="starra" solutions="" manager="cynthn" editor="tysonn" />



<h1><a id="configure-a-backup-vault-tutorial"></a>Configure Azure Backup to quickly and easily back-up Windows Server</h1>
<div class="dev-callout"> 
<strong>Note</strong>
 
<p>To complete this tutorial, you need an Azure account that has the Azure Backup feature enabled.</p>
<ul> 
<li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="/en-us/pricing/free-trial/">Azure Free Trial</a>.</li> 
 

</ul>
 

</div>
  

<p>To backup files and data from your Windows Server to Azure, you must create a backup vault in the geographic region where you want to store the data. This tutorial will walk you through the creation of the vault you will use to store backups, the uploading of a certificate to the vault, the installation of a backup agent, and an overview of the backup management tasks available through the management portal.</p>

<div class="dev-callout"> 
<strong>Before you begin</strong> 
<p>To successfully complete this tutorial you must have 
an X.509 v3 certificate to register your servers with backup vaults.  The certificate must have a key length of at least 2048 bits and should reside in the Personal certificate store of your Local Computer. When the certificate is installed on your server, it should contain the private key of the certificate. To upload to the certificate to the Azure Management Portal, you must export the public key as a .cer format file.</p> 

<p>You can either use:</p> 
<ul>
<li>Your own self-signed certificate created using the makecert tool, OR</li> 

<li>Any valid SSL certificate issued by a Certificate Authority (CA) that is trusted by Microsoft and whose root certificates are distributed via the Microsoft Root Certificate Program. For more information about this program see <a href="http://go.microsoft.com/fwlink/p/?LinkId=294666">Windows Root Certificate Program members</a>.</li>
</ul> 

<p>Some other attributes which you need to ensure on the certificates are:</p> 

<ul>
<li>Has a valid ClientAuthentication EKU</li>

<li>Is currently valid with a validity period that does not exceed 3 years</li>  
</ul>

<p>To use your own self-signed certificate, follow these steps: </p>
<ol>
<li>Download the <a href="http://msdn.microsoft.com/library/windows/desktop/aa386968(v=vs.85).aspx">Certificate Creation tool (MakeCert.exe)</a>.</li>  


<li>Open Command Prompt (cmd.exe) with Administrator privileges and run the following command, replacing <i>CertificateName</i> with the name of your certificate and specifying the actual expiration date of your certificate after -e: 
<code>
makecert.exe -r -pe -n CN=CertificateName -ss my -sr localmachine -eku 1.3.6.1.5.5.7.3.2 -len 2048 -e 01/01/2016 CertificateName.cer
</code></li>
</ol>
<p>
If you will be registering a different server than the one you used to make the certificate, you need to export the .pfx file (that contains the private key), copy it to the other server and import it to that server's Personal certificate store. 
</p>
<p>
For step-by-step instructions on the vault certificate upload process and more information on exporting and importing .pfx files, see <a href="http://go.microsoft.com/fwlink/p/?LinkID=294662">Manage vault certificates</a>.</p> 
</div>

<h2><a id="create"></a>Create a backup vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click **Create New**,  point to **Backup Vault**, and then click **Quick Create**.

	![New backup vault][new-backup-vault]

3. In **Name**, enter a friendly name to identify the backup vault.

4. In **Region**, select the geographic region for the backup vault.  

5. In **Subscription**, enter the Azure subscription that you want to use the backup vault with. 


6. Click **Create Backup vault**.

	It can take a while for the backup vault to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the backup vault has been created, a message will tell you that the vault has been successfully created and it will be listed in the resources for Recovery Services as **Online**. 

	![Backup vault creation][backup-vault-create]

<h2><a id="upload"></a>Upload a certificate</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault that will be identified by the certificate and then click **Manage certificate**.
	
	![Manage certificate][manage-cert]

3. In the **Manage Certificate** dialog click Browse Your Computer to locate the .cer file to use with this backup vault.
<h2><a id="download"></a>Download and install a backup agent</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault to view the vault dashboard.

3. Click **Install Agent** 
	
	![Install Agent][install-agent]
4. You will be presented with a dialog where you can choose which agent to download:
	* Agent for Windows Server 2012 and System Center 2012 SP1 - Data Protection Manager
	* Agent for Windows Server 2012 Essentials
5. Select the appropriate agent. You will be redirected to the Microsoft Download Center to download the agent software. For more information see:

	* [Install Azure Backup Agent for Windows Server 2012 and System Center 2012 SP1 - Data Protection Manager](http://technet.microsoft.com/en-us/library/hh831761.aspx#BKMK_installagent)
	* [Install Azure Backup Agent for Windows Server 2012 Essentials](http://technet.microsoft.com/en-us/library/jj884318.aspx)

Once the agent is installed you can use the appropriate local management interface (such as the Microsoft Management Console snap-in, System Center Data Protection Manager Console, or Windows Server Essentials Dashboard) to configure the backup policy for the server.  

<h2><a id="manage"></a>Manage backup vaults and servers</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault to view the vault dashboard. From here you can perform the following tasks:
	* **Manage certificate**. Used to update the certificate previously uploaded.
	* **Delete**. Deletes the current backup vault. If a backup vault is no longer being used, you can delete it to free up storage space. **Delete** is only enabled after all registered servers have been deleted from the vault. 

3. Click **Protected Items** to view the items that have been backed up from the servers. This list is for information purposes only.  
![Protected Items][protected-itmes]

4. Click **Servers** to view the names of the servers that are register to this vault. From here you can perform the following tasks:
	* **Allow Re-register**. When this option is selected for a server you can use the Registration Wizard in the agent to register the server with the backup vault a second time. You might need to re-register due to an error in the certificate or if a server had to be rebuilt. Re-registration is allowed only once per server name.
	* **Delete**. Deletes a server from the backup vault. All of the stored data associated with the server is deleted immediately.

		![Deleted Server][deleted-server]

<h2><a id="next"></a>Next steps</h2>

- To learn more about Azure Backup, see [Azure Backup Overview](http://go.microsoft.com/fwlink/p/?LinkId=222425). 

- Visit the [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933).

[new-backup-vault]: ./media/backup-configure-vault/RS_howtobackup1.png
[backup-vault-create]: ./media/backup-configure-vault/RS_howtobackup2.png
[manage-cert]: ./media/backup-configure-vault/RS_howtoupload1.png
[install-agent]: ./media/backup-configure-vault/RS_howtodownload1.png
[deleted-server]: ./media/backup-configure-vault/RS_deletedserver.png
[protected-itmes]: ./media/backup-configure-vault/RS_protecteditems.png
