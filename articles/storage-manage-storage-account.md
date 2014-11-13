<properties urlDisplayName="How to manage" pageTitle="How to manage storage accounts | Microsoft Azure" metaKeywords="Azure manage storage accounts, storage account management portal, storage account geo-replication, Azure geo-replication, Azure access keys" description="Learn how to manage storage accounts in Azure by using the Management Portal." metaCanonical="" services="storage" documentationCenter="" title="How To Manage Storage Accounts" authors="tamram" solutions="" manager="adinah" editor="cgronlun" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />



<h1><a id="managestorageaccounts"></a>How To Manage Storage Accounts</h1>

##Table of Contents##

* [How to: Manage storage account replication](#georeplication)
* [How to: View, copy, and regenerate storage access keys](#regeneratestoragekeys)
* [How to: Delete a storage account](#deletestorageaccount)

<h2><a id="georeplication"></a>How to: Replicate your storage account data for durability and high availability</h2>

[WACOM.INCLUDE [storage-replication-options](../includes/storage-replication-options.md)]

### To specify replication settings for a storage account ###

1. In the [Azure Management Portal](https://manage.windowsazure.com), click **Storage**, and then click the name of your storage account to display the dashboard.

2. Click **Configure**.

3. In the **Replication**, field, select the type of replication you want for your storage account.

4. Click **Save**, and confirm your choice if prompted.


<h2><a id="regeneratestoragekeys"></a>How to: View, copy, and regenerate storage access keys</h2>
When you create a storage account, Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

In the [Management Portal](http://manage.windowsazure.com), use **Manage Keys** on the dashboard or the **Storage** page to view, copy, and regenerate the storage access keys that are used to access the Blob, Table, and Queue services. 

### Copy a storage access key ###

You can use **Manage Keys** to copy a storage access key to use in a connection string. The connection string requires the storage account name and a key to use in authentication. For information about configuring connection strings to access Azure storage services, see [Configuring Connection Strings](http://msdn.microsoft.com/en-us/library/ee758697.aspx).

1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Manage Keys**.

 	**Manage Access Keys** opens.

	![Managekeys](./media/storage-manage-storage-account/Storage_ManageKeys.png)

 
3. To copy a storage access key, select the key text. Then right-click, and click **Copy**.

### Regenerate storage access keys ###
You should change the access keys to your storage account periodically to help keep your storage connections more secure. Two access keys are assigned to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. 

<div class="dev-callout"> 
    <b>Warning</b> 
    <p>Regenerating your access keys affects virtual machines, media services, and any applications that are dependent on the storage account. All clients that use the access key to access the storage account must be updated to use the new key.
    </p> 
    </div>

**Virtual machines** - If your storage account contains any virtual machines that are running, you will have to redeploy all virtual machines after you regenerate the access keys. To avoid redeployment, shut down the virtual machines before you regenerate the access keys.
 
**Media services** - If you have media services dependent on your storage account, you must re-sync the access keys with your media service after you regenerate the keys.
 
**Applications** - If you have web applications or cloud services using the storage account, you will lose the connections if you regenerate keys, unless you roll your keys. Here is the process:

1. Update the connection strings in your application code to reference the secondary access key of the storage account. 

2. Regenerate the primary access key for your storage account. In the [Management Portal](http://manage.windowsazure.com), from the dashboard or the **Configure** page, click **Manage Keys**. Click **Regenerate** under the primary access key, and then click **Yes** to confirm you want to generate a new key.

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key.


<h2><a id="deletestorageaccount"></a>How to: Delete a storage account</h2>

To remove a storage account that you are no longer using, use **Delete** on the dashboard or the **Configure** page. **Delete** deletes the entire storage account, including all of the blobs, tables, and queues in the account. 

<div class="dev-callout">
	<b>Warning</b>
	<p>There's no way to restore the content from a deleted storage account. Make 
	sure you back up anything you want to save before you delete the account.
	</p>
	<p>
	If your storage account contains any VHD files or disks for an Azure 
	virtual machine, then you must delete any images and disks that are using those VHD files 
	before you can delete the storage account. First, stop the virtual machine if it is running, and then delete it. To delete disks, navigate to the Disks tab and delete any disks contained in the storage account. To delete images, navigate to the Images tab and delete any images stored in the account.
	</p>
</div>


1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**.

2. Click anywhere in the storage account entry except the name, and then click **Delete**.

	 -Or-

	Click the name of the storage account to open the dashboard, and then click **Delete**.

3. Click **Yes** to confirm you want to delete the storage account.
