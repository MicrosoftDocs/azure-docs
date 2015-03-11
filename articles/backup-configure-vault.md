<properties 
	pageTitle="Configure Azure Backup Services to quickly and easily back-up Windows Server" 
	description="Use this tutorial to learn how to use the Backup service in Microsoft's Azure cloud offering to back up Windows Server to the cloud." 
	services="backup" 
	documentationCenter="" 
	authors="markgalioto" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="backup" 
	ms.workload="storage-backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/04/2015" 
	ms.author="markgal"/>



<h1><a id="configure-a-backup-vault-tutorial"></a>Configure Azure Backup to quickly and easily back up Windows Server</h1>

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. This tutorial will lead you through enabling the Azure Backup feature. Previously you needed to create or acquire a X.509 v3 certificate in order to register your backup server. Certificates are still supported, but now to ease Azure vault registration with a server, you can generate a vault credential right from the Quick Start page. 
<ul><li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="/pricing/free-trial/">Azure Free Trial</a>.</li></ul>
  

<p>To back up files and data from your Windows Server to Azure, you must create a backup vault in the geographic region where you want to store the data. This tutorial will walk you through: the creation of the vault you will use to store backups, downloading a vault credential, the installation of a backup agent, and an overview of the backup management tasks available through the management portal.</p>



<h2><a id="create"></a>Create a backup vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **New**, then click **Data Services**, then click **Recovery Services**, then click **Backup Vault**, and then click **Quick Create**.

3. In **Name**, enter a friendly name to identify the backup vault.

4. In **Region**, select the geographic region for the backup vault.  
![New backup vault](http://i.imgur.com/8ptgjuo.png)

5. Click **Create Vault**.

	It can take a while for the backup vault to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the backup vault has been created, a message will tell you the vault has been successfully created and it will be listed in the resources for Recovery Services as **Active**. 
![backup vault creation](http://i.imgur.com/grtLcKM.png)

3. If you have multiple subscriptions associated with your organizational account, choose the correct account to associate with the backup vault.

<h2><a id="upload"></a>Download a vault credential</h2>

Vault credentials replace certificates as the way to register your Azure service with your server. You can still use certificates, however, vault credentials are easier to use because you use the Azure portal to generate and download vault credentials.  

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then select the backup vault that you want to register with a server.  The Quick Start page for that backup vault appears.
	

3. On the Quick Start page, click **Download vault credentials** to prompt the portal to generate and download the vault credentials you will use to register your server with the backup vault.

4. The portal will generate a vault credential using a combination of the vault name and the current date. Click **Save** to download the vault credentials to the local account's downloads folder, or select **Save As** from the **Save** menu to specify a location for the vault credentials. You cannot edit the vault credentials so there is no reason to click Open. Once the credentials have been downloaded, you'll be prompted to Open the folder. Click **x** to close this menu.

<h2><a id="download"></a>Download and install a backup agent</h2>
1. In the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then select a backup vault to view its Quick Start page.

3. On the Quick Start page, select the type of agent you want to download. You can choose **Download Azure Backup Agent**, **Windows Server and System Center Data Protection Manager**, or **Windows Server Essentials**.  For more information see:

	* [Install Azure Backup Agent for Windows Server 2012 and System Center 2012 SP1 - Data Protection Manager](http://technet.microsoft.com/library/hh831761.aspx#BKMK_installagent)
	* [Install Azure Backup Agent for Windows Server 2012 Essentials](http://technet.microsoft.com/library/jj884318.aspx)

Once the agent is installed you can use the appropriate local management interface (such as the Microsoft Management Console snap-in, System Center Data Protection Manager Console, or Windows Server Essentials Dashboard) to configure the backup policy for the server.
	
  

<h2><a id="manage"></a>Manage backup vaults and servers</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault to view the Quick Start page. 

3. Click **Dashboard** to see the usage overview for the server. At the bottom of the Dashboard you can perform the following tasks:
	* **Manage certificate**. If a certificate was used to register the server, then use this to update the certificate. If you are using vault credentials, do not use **Manage certificate**.
	* **Delete**. Deletes the current backup vault. If a backup vault is no longer being used, you can delete it to free up storage space. **Delete** is only enabled after all registered servers have been deleted from the vault.
	* **Vault credentials**. Use this Quick Glance menu item to configure your vault credentials. 

3. Click **Protected Items** to view the items that have been backed up from the servers. This list is for information purposes only.  
![Protected Items][protected-itmes]

4. Click **Servers** to view the names of the servers that are register to this vault. From here you can perform the following tasks:
	* **Allow Re-registration**. When this option is selected for a server you can use the Registration Wizard in the agent to register the server with the backup vault a second time. You might need to re-register due to an error in the certificate or if a server had to be rebuilt. Re-registration is allowed only once per server name.
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
=======
<properties 
	pageTitle="Configure Azure Recovery Services to quickly and easily back-up Windows Server" 
	description="Use this tutorial to learn how to use the Backup service in Microsoft's Azure cloud offering to back up Windows Server to the cloud." 
	services="site-recovery" 
	documentationCenter="" 
	authors="markgalioto" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="backup" 
	ms.workload="storage-backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/04/2015" 
	ms.author="markgal"/>



<h1><a id="configure-a-backup-vault-tutorial"></a>Configure Azure Backup to quickly and easily back up Windows Server</h1>

> [AZURE.NOTE] To complete this tutorial, you need an Azure account. This tutorial will lead you through enabling the Azure Backup feature. Previously you needed to create or acquire a X.509 v3 certificate in order to register your backup server. Certificates are still supported, but now to ease Azure vault registration with a server, you can generate a vault credential right from the Quick Start page. 
<ul><li>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="/pricing/free-trial/">Azure Free Trial</a>.</li></ul>
  

<p>To back up files and data from your Windows Server to Azure, you must create a backup vault in the geographic region where you want to store the data. This tutorial will walk you through: the creation of the vault you will use to store backups, downloading a vault credential, the installation of a backup agent, and an overview of the backup management tasks available through the management portal.</p>



<h2><a id="create"></a>Create a backup vault</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **New**, then click **Data Services**, then click **Recovery Services**, then click **Backup Vault**, and then click **Quick Create**.

3. In **Name**, enter a friendly name to identify the backup vault.

4. In **Region**, select the geographic region for the backup vault.  
![New backup vault](http://i.imgur.com/8ptgjuo.png)

5. Click **Create Vault**.

	It can take a while for the backup vault to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the backup vault has been created, a message will tell you the vault has been successfully created and it will be listed in the resources for Recovery Services as **Active**. 
![backup vault creation](http://i.imgur.com/grtLcKM.png)

3. If you have multiple subscriptions associated with your organizational account, choose the correct account to associate with the backup vault.

<h2><a id="upload"></a>Download a vault credential</h2>

Vault credentials replace certificates as the way to register your Azure service with your server. You can still use certificates, however, vault credentials are easier to use because you use the Azure portal to generate and download vault credentials.  

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then select the backup vault that you want to register with a server.  The Quick Start page for that backup vault appears.
	

3. On the Quick Start page, click **Download vault credentials** to prompt the portal to generate and download the vault credentials you will use to register your server with the backup vault.

4. The portal will generate a vault credential using a combination of the vault name and the current date. Click **Save** to download the vault credentials to the local account's downloads folder, or select **Save As** from the **Save** menu to specify a location for the vault credentials. You cannot edit the vault credentials so there is no reason to click Open. Once the credentials have been downloaded, you'll be prompted to Open the folder. Click **x** to close this menu.

<h2><a id="download"></a>Download and install a backup agent</h2>
1. In the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then select a backup vault to view its Quick Start page.

3. On the Quick Start page, select the type of agent you want to download. You can choose **Download Azure Backup Agent**, **Windows Server and System Center Data Protection Manager**, or **Windows Server Essentials**.  For more information see:

	* [Install Azure Backup Agent for Windows Server 2012 and System Center 2012 SP1 - Data Protection Manager](http://technet.microsoft.com/library/hh831761.aspx#BKMK_installagent)
	* [Install Azure Backup Agent for Windows Server 2012 Essentials](http://technet.microsoft.com/library/jj884318.aspx)

Once the agent is installed you can use the appropriate local management interface (such as the Microsoft Management Console snap-in, System Center Data Protection Manager Console, or Windows Server Essentials Dashboard) to configure the backup policy for the server.
	
  

<h2><a id="manage"></a>Manage backup vaults and servers</h2>
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Recovery Services**, then click the name of backup vault to view the Quick Start page. 

3. Click **Dashboard** to see the usage overview for the server. At the bottom of the Dashboard you can perform the following tasks:
	* **Manage certificate**. If a certificate was used to register the server, then use this to update the certificate. If you are using vault credentials, do not use **Manage certificate**.
	* **Delete**. Deletes the current backup vault. If a backup vault is no longer being used, you can delete it to free up storage space. **Delete** is only enabled after all registered servers have been deleted from the vault.
	* **Vault credentials**. Use this Quick Glance menu item to configure your vault credentials. 

3. Click **Protected Items** to view the items that have been backed up from the servers. This list is for information purposes only.  
![Protected Items][protected-itmes]

4. Click **Servers** to view the names of the servers that are register to this vault. From here you can perform the following tasks:
	* **Allow Re-registration**. When this option is selected for a server you can use the Registration Wizard in the agent to register the server with the backup vault a second time. You might need to re-register due to an error in the certificate or if a server had to be rebuilt. Re-registration is allowed only once per server name.
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
