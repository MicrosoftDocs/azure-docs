<properties umbracoNaviHide="0" pageTitle="How To Create a Storage Account" metaKeywords="Windows Azure storage, storage service, service, storage account, account, create storage account, create account" metaDescription="Learn how to create a Windows Azure storage account." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="createstorageaccount">How To Create a Storage Account</h1>

To store files and data in the Blob, Table, and Queue services in Windows Azure, you must create a storage account in the geographic region where you want to store the data. A storage account can contain up to 100 TB of blob, table, and queue data. You can create up to five storage accounts for each Windows Azure subscription. This topic describes how to create a storage account in the Windows Azure Preview Management Portal.

<div class="dev-callout"> 
<b>Note</b> 
<p>For a Windows Azure virtual machine, a storage account is created automatically in the deployment location if you do not already have a storage account in that location. The storage account name will be based on the virtual machine name.</p> 
</div>

##Table of Contents##

* [How to: Create a storage account](#create)
* [Next steps](#next)

<h2 id="create">How to: Create a storage account</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Create New**, click **Storage**, and then click **Quick Create**.

	![NewStorageAccount] (../media/storage_NewStorageAccount.png)

3. In **URL**, enter a subdomain name to use in the storage account URL. To access an object in storage, you will append the object's location to the endpoint. For example, the URL for accessing a blob might be http://*myaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

4. In **Region/Affinity Group**, select a region or affinity group for the storage.  Select an affinity group instead of a region if you want your storage services to be in the same data center with other Windows Azure services that you are using. This can improve performance, and no charges are incurred for egress.

	<div class="dev-callout"> 
<b>Note</b> 
	<p>To create an affinity group, open the <b>Networks</b> area of the Management Portal, click <b>Affinity Groups</b>, and then click either <b>Create a new affinity group</b> or <b>Create</b>. You can use affinity groups that you create in the previous Management Portal. To open the other portal, click <b>Preview</b> on the title bar, and then click <b>Take me to the previous portal</b>. (To return to this portal, click <b>View the Preview Portal</b> at the bottom of the portal.) You can also create and manage affinity groups using the Windows Azure Service Management API. See <a href=http://msdn.microsoft.com/en-us/library/windowsazure/ee460798.aspx>Operations on Affinity Groups</a> for more information.</p> 
</div>

5. In **Subscription**, enter the Windows Azure subscription that you want to use the storage account with. You can create up to five storage accounts for a subsccription.

6. If you don't want geo-replication for your storage account, clear the **Enable Geo-Replication** check box.

 Geo-replication is enabled by default so that, in the event of a major disaster in the primary location, storage fails over to a secondary location. A secondary location in the same region is assigned and cannot be changed. After a geo-failover, the secondary location becomes the primary location for the storage account, and stored data is replicated to a new secondary location.

 If you don't want to use geo-replication, or if your organization's policies won't allow its use, you can turn off geo-replication. This will result in locally redundant storage, which is offered at a discount. Be aware that if you turn off geo-replication, and you later decide to turn it on again, you will incur a one-time charge to replicate your existing data to the secondary location.

6. Click **Create Storage Account**.

	It can take a while for the storage account to be created. To check the status, you can monitor the notifications at the bottom of the portal. After the storage account has been created, your new storage account has **Online** status and is ready for use. 

	![StoragePage] (../media/Storage_StoragePage.png)

<h2 id="next">Next steps</h2>

- To learn more about Windows Azure storage services, see [Understanding Cloud Storage](http://www.windowsazure.com/en-us/develop/net/fundamentals/cloud-storage/) and [Blobs, Queues, and Tables](http://msdn.microsoft.com/en-us/library/gg433040.aspx). 

- Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

- Configure your apps to use Windows Azure Blob, Table, and Queue services. The [Windows Azure Developer Center](http://www.windowsazure.com/en-us/develop/overview/) provides How To Guides for using the Blob, Table, and Queue storage services with your .NET, Node.js, Java, and PHP applications. For instructions specific to a programming language, see the How To Guides for that language.