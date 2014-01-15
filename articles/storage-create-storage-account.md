<properties linkid="manage-services-how-to-create-a-storage-account" urlDisplayName="How to create" pageTitle="How to create a storage account - Windows Azure" metaKeywords="" description="Learn how to create a storage account in the Windows Azure Management Portal." metaCanonical="" services="storage" documentationCenter="" title="How To Create a Storage Account" authors=""  solutions="" writer="tysonn" manager="" editor=""  />




<h1><a id="createstorageaccount"></a>How To Create a Storage Account</h1>

To store files and data in the Blob, Table, and Queue services in Windows Azure, you must create a storage account in the geographic region where you want to store the data. A storage account can contain up to 200 TB of data if it was created on or after June 8th, 2012. Storage accounts created before June 8th, 2012, can store 100 TB of blob, table, and queue data. You can create up to twenty storage accounts for each Windows Azure subscription. See [Windows Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx) for more information.

This topic describes how to create a storage account in the Windows Azure Management Portal.

<div class="dev-callout"> 
<b>Note</b> 
<p>For a Windows Azure virtual machine, a storage account is created automatically in the deployment location if you do not already have a storage account in that location. The storage account name will be based on the virtual machine name.</p> 
</div>

##Table of Contents##

* [How to: Create a storage account](#create)
* [Next steps](#next)

<h2><a id="create"></a>How to: Create a storage account</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Create New**, click **Storage**, and then click **Quick Create**.

	![NewStorageAccount](./media/storage-create-storage-account/storage_NewStorageAccount.png)

3. In **URL**, enter a subdomain name to use in the storage account URL. To access an object in storage, you will append the object's location to the endpoint. For example, the URL for accessing a blob might be http://*myaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

4. In **Region/Affinity Group**, select a region or affinity group for the storage.  Select an affinity group instead of a region if you want your storage services to be in the same data center with other Windows Azure services that you are using. This can improve performance, and no charges are incurred for egress.

	> [WACOM.NOTE]
        > To create an affinity group, open the <b>Networks</b> area of the Management Portal, click <b>Affinity Groups</b>, and then click either <b>Create a new affinity group</b> or <b>Create</b>. You can use affinity groups that you create in the previous Management Portal. To open the other portal, click <b>Preview</b> on the title bar, and then click <b>Take me to the previous portal</b>. (To return to this portal, click <b>View the Preview Portal</b> at the bottom of the portal.) You can also create and manage affinity groups using the Windows Azure Service Management API. See <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee460798.aspx">Operations on Affinity Groups</a> for more information.

5. If you have more than one Windows Azure subscription, then the **Subscription** field is displayed. In **Subscription**, enter the Windows Azure subscription that you want to use the storage account with. You can create up to five storage accounts for a subscription.

6. In **Replication**, select the level of replication that you desire for your storage account.

	By default, replication is set to **Geo-Redundant**. With geo-redundant replication, your storage account and all data in it fails over to a secondary location in the event of a major disaster in the primary location. Windows Azure assigns a secondary location in the same region, which cannot be changed. After a failover, the secondary location becomes the primary location for the storage account, and your data is replicated to a new secondary location.

 	If you don't want to use geo-redundant replication, or if your organization's policies won't allow its use, set **Replication** to **Locally Redundant**. This will result in locally redundant storage, which is offered at a discount. Be aware that if you turn off geo-redundant replication, and you later decide to turn it on again, you will incur a one-time charge to replicate your existing data to the secondary location.

	A third replication option, **Read Access Geo-Redundant**, is currently in preview. This option enables read-only access to the replicated data in the secondary location. Read-access geo-redundant replication allows you to access your data from either the primary or the secondary location, in the event that one location becomes unavailable.

	> [WACOM.NOTE]
        > In order to use read-access geo-redundant replication while it is in preview, you must manually request that the feature be enabled for your subscription. Visit the <a href="https://account.windowsazure.com/PreviewFeatures">Windows Azure Preview Features</a> page to request read-access geo-redundant replication for your subscription. For more details about read-access geo-redundant replication, see the <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2013/12/04/introducing-read-access-geo-replicated-storage-ra-grs-for-windows-azure-storage.aspx">Windows Azure Storage Team Blog</a>.
	> If read-access geo-redundant replication is not enabled as a preview feature on your subscription, the option to select it for your storage account will be disabled.

	For pricing information for storage account replication, see [Storage Pricing Details](http://www.windowsazure.com/en-us/pricing/details/storage/).

6. Click **Create Storage Account**.

	It may take a few minutes to create your storage account. To check the status, you can monitor the notifications at the bottom of the portal. After the storage account has been created, your new storage account has **Online** status and is ready for use. 

	![StoragePage](./media/storage-create-storage-account/Storage_StoragePage.png)

<h2><a id="next"></a>Next steps</h2>

- To learn more about Windows Azure storage services, see [Understanding Cloud Storage](http://www.windowsazure.com/en-us/develop/net/fundamentals/cloud-storage/) and [Blobs, Queues, and Tables](http://msdn.microsoft.com/en-us/library/gg433040.aspx). 

- Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

- Configure your apps to use Windows Azure Blob, Table, and Queue services. The [Windows Azure Developer Center](http://www.windowsazure.com/en-us/develop/overview/) provides How To Guides for using the Blob, Table, and Queue storage services with your .NET, Node.js, Java, and PHP applications. For instructions specific to a programming language, see the How To Guides for that language.

