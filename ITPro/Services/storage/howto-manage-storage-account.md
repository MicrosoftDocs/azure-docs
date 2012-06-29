<properties umbracoNaviHide="0" pageTitle="How To Manage Storage Accounts" metaKeywords="Windows Azure storage, storage service, service, storage account, account, manage storage account, manage, geo-replication, regenerate storage access keys" metaDescription="Learn how to manage Windows Azure storage accounts." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="managestorageaccounts">How To Manage Storage Accounts</h1>


##Table of Contents##

* [How to: Turn geo-replication off or on](#georeplication)
* [How to: View, copy, and regenerate storage access keys](#regeneratestoragekeys)
* [How to: Delete a storage account](#deletestorageaccount)
* [Next steps](#next)



<h2 id="georeplication">How to: Turn geo-replication off or on</h2>

When geo-replication is turned on, the stored content is replicated to a secondary location to enable failover to that location in case of a major disaster in the primary location. The secondary location is in the same region, but is hundreds of miles from the primary location. This is the highest level of storage durability, known as *geo redundant storage* (GRS). Geo-replication is turned on by default. 

If you turn off geo-replication, you have *locally redundant storage* (LRS). For locally redundant storage, account data is replicated three times within the same data center. LRS is offered at discounted rates. Be aware that if you turn off geo-replication, and you later change your mind, you will incur a one-time data cost to replicate your existing data to the secondary location. 

For more information about geo-replication, see [Introducing Geo-Replication for Windows Azure](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx). For pricing information, see [Windows Azure Pricing Overview](http://www.windowsazure.com/en-us/pricing/details/).

### To turn geo-replication on or off for a storage account ###

1. In the [Windows (Preview) Management Portal](http://manage.windowsazure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Configure**.

3. Beside **Geo-Replication**, click **On** or **Off**.

4. Click **Save**.


<h2 id="regeneratestoragekeys">How to: View, copy, and regenerate storage access keys</h2>
When you create a storage account, Windows Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Windows Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

In the [Management Portal](http://manage.windowsazure.com), use **Manage Keys** on the dashboard or the **Storage** page to view, copy, and regenerate the storage access keys that are used to access the Blob, Table, and Queue services. 

### Copy a storage access key ###

You can use **Manage Keys** to copy a storage access key to use in a connection string. The connection string requires the storage account name and a key to use in authentication. For information about configuring connection strings to access Windows Azure storage services, see [Configuring Connection Strings](http://msdn.microsoft.com/en-us/library/ee758697.aspx).

1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Manage Keys**.

 **Manage Access Keys** opens.

	![Managekeys] (../media/Storage_ManageKeys.png)

 
3. To copy a storage access key, select the key text. Then right-click, and click **Copy**.

### Regenerate storage access keys ###
You should change the access keys to your storage account periodically to help keep your storage connections more secure. Two access keys are assigned to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. 

<div class="dev-callout"> 
    <b>Warning</b> 
    <p>Regenerating your access keys affects virtual machines, media services, and any applications that are dependent on the storage account.
    </p> 
    </div>

**Virtual machines** - If your storage account contains any virtual machines that are running, you will have to redeploy all virtual machines after you regenerate the access keys. To avoid redeployment, shut down the virtual machines before you regenerate the access keys.
 
**Media services** - If you have media services dependent on your storage account, you must re-sync the access keys with your media service after you regenerate the keys.
 
**Applications** - If you have web applications or cloud services using the storage account, you will lose the connections if you regenerate keys, unless you roll your keys. Here is the process:

1. Update the connection strings in your application code to reference the secondary access key of the storage account. 

2. Regenerate the primary access key for your storage account. In the [Management Portal](http://manage.windowsazure.com), from the dashboard or the **Configure** page, click **Manage Keys**. Click **Regenerate** under the primary access key, and then click **Yes** to confirm you want to generate a new key.

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key.


<h2 id="deletestorageaccount">How to: Delete a storage account</h2>

To remove a storage account that you are no longer using, use **Delete** on the dashboard or the **Configure** page. **Delete** deletes the entire storage account, including all of the blobs, tables, and queues in the account. 

<div class="dev-callout">
	<b>Warning</b>
	<p>There's no way to restore the content from a deleted storage account. Make 
	sure you back up anything you want to save before you delete the account.
	</p>
</div>


1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**.

2. Click anywhere in the storage account entry except the name, and then click **Delete**.

 -Or-

 Click the name of the storage account to open the dashboard, and then click **Delete**.

3. Click **Yes** to confirm you want to delete the storage account.


<h2 id="next">Next steps</h2>

- Learn more about Windows Azure storage services at [Storing and Accessing Data in Windows Azure](http://msdn.microsoft.com/en-us/library/gg433040.aspx). 

- Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

- Configure your apps to use Windows Azure Blob, Table, and Queue services. The [Windows Azure Developer Center](http://www.windowsazure.com/en-us/develop/overview/) provides How To Guides for using the Blob, Table, and Queue storage services with your .NET, Node.js, Java, and PHP applications. For instructions specific to a programming language, see the How To Guides for that language.

