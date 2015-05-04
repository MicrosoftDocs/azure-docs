<properties 
	pageTitle="How to create, manage, or delete a storage account | Azure" 
	description="Learn how to create, manage, or delete a storage account in the Azure management portal." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/05/2015" 
	ms.author="tamram"/>


# About Azure Storage Accounts

## Overview

An Azure storage account is a secure account that gives you access to services in Azure Storage. Your storage account provides the unique namespace for your data, and by default, it is available only to you, the account owner. 

There are two types of storage accounts:

- A standard storage account includes Blob, Table, and Queue storage. File storage is available by request via the [Azure Preview page](/services/preview/).
- A premium storage account currently supports Azure Virtual Machine disks only. Azure Premium Storage is available by request via the [Azure Preview page](/services/preview/). See [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](http://go.microsoft.com/fwlink/?LinkId=521898) for an in-depth overview of Premium Storage.

You are billed for Azure Storage usage based on your storage account. Storage costs are based on four factors: storage capacity, replication scheme, storage transactions, and data egress. 

- Storage capacity refers to how much of your storage account allotment you are using to store data. The cost of simply storing your data is determined by how much data you are storing, and how it is replicated. 
- Replication determines how many copies of your data are maintained at once, and in what locations. 
- Transactions refer to all read and write operations to Azure Storage. 
- Data egress refers to data transferred out of an Azure region. When the data in your storage account is accessed by an application that is not running in the same region, whether that application is a cloud service or some other type of application, then you are charged for data egress. (For Azure services, you can take steps to group your data and services in the same data centers to reduce or eliminate data egress charges.)  

The [Storage Pricing Details](http://azure.microsoft.com/pricing/details/#storage) page provides detailed pricing information for storage capacity, replication, and transactions. The [Data Transfers Pricing Details](http://azure.microsoft.com/pricing/details/data-transfers/) provides detailed pricing information for data egress.

For details about storage account capacity and performance targets, see [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/library/azure/dn249410.aspx).

> [AZURE.NOTE] When you create an Azure virtual machine, a storage account is created for you automatically in the deployment location if you do not already have a storage account in that location. So it's not necessary to follow the steps below to create a storage account for your virtual machine disks. The storage account name will be based on the virtual machine name. See the [Azure Virtual Machines documentation](/documentation/services/virtual-machines/) for more details. <br />

## Create a storage account

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Create New**, click **Storage**, and then click **Quick Create**.

	![NewStorageAccount](./media/storage-create-storage-account/storage_NewStorageAccount.png)

3. In **URL**, enter a name for your storage account. See [Storage account endpoints](#account-endpoints) below for details about how this name will be used to address objects that you store in Azure Storage.

4. In **Location/Affinity Group**, select a location for your storage account that is close to you or to your customers. If data in your storage account will be accessed from another Azure service, such as an Azure virtual machine or cloud service, you may want to select an affinity group from the list to group your storage account in the same data center with other Azure services that you are using to improve performance and lower costs. 

	> [AZURE.NOTE] Note that you must select an affinity group when your storage account is created; you cannot move an existing account to an affinity group.

	For details about affinity groups, see [Service co-location with an affinity group](#affinity-group) below.

	
5. If you have more than one Azure subscription, then the **Subscription** field is displayed. In **Subscription**, enter the Azure subscription that you want to use the storage account with. You can create up to five storage accounts for a subscription.

6. In **Replication**, select the desired level of replication for your storage account. The recommended replication option is Geo-Redundant replication, which provides maximum durability for your data. For more details on Azure Storage replication options, see [Storage account replication options](#replication-options) below.

6. Click **Create Storage Account**.

	It may take a few minutes to create your storage account. To check the status, you can monitor the notifications at the bottom of the portal. After the storage account has been created, your new storage account has **Online** status and is ready for use. 

![StoragePage](./media/storage-create-storage-account/Storage_StoragePage.png)


### Storage account endpoints 

Every object that you store in Azure Storage has a unique URL address; the storage account name forms the subdomain of that address. The subdomain together with the domain name, which is specific to each service, form an *endpoint* for your storage account. 

For example, if your storage account is named *mystorageaccount*, then the default endpoints for your storage account are: 

- Blob service: http://*mystorageaccount*.blob.core.windows.net

- Table service: http://*mystorageaccount*.table.core.windows.net

- Queue service: http://*mystorageaccount*.queue.core.windows.net

- File service: http://*mystorageaccount*.file.core.windows.net

You can see the endpoints for your storage account on the storage Dashboard in the Azure Management Portal once the account has been created.

The URL for accessing an object in a storage account is built by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure a custom domain name to use with your storage account. See [Configure a custom domain name for blob data in a storage account](storage-custom-domain-name.md) for details.

### Service co-location with an affinity group 

An *affinity group* is a geographic grouping of your Azure services and VMs with your Azure storage account. An affinity group can improve service performance by locating computer workloads in the same data center or near the target user audience. Also, no billing charges are incurred for egress when data in a storage account is accessed from another service that is part of the same affinity group.

> [AZURE.NOTE]  To create an affinity group, open the <b>Settings</b> area of the Management Portal, click <b>Affinity Groups</b>, and then click either <b>Add an affinity group</b> or the <b>Add</b> button. You can also create and manage affinity groups using the Azure Service Management API. See <a href="http://msdn.microsoft.com/library/azure/ee460798.aspx">Operations on Affinity Groups</a> for more information.


### Storage account replication options

[AZURE.INCLUDE [storage-replication-options-include](../includes/storage-replication-options-include.md)]


## View, copy, and regenerate storage access keys

When you create a storage account, Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

> [AZURE.NOTE] We recommend that you avoid sharing your storage account access keys with anyone else. To permit access to storage resources without giving out your access keys, you can use a *shared access signature*. A shared access signature provides access to a resource in your account for an interval that you define and with the permissions that you specify. See the [shared access signature tutorial](storage-dotnet-shared-access-signature-part-1.md) for more information.

In the [Management Portal](http://manage.windowsazure.com), use **Manage Keys** on the dashboard or the **Storage** page to view, copy, and regenerate the storage access keys that are used to access the Blob, Table, and Queue services. 

### Copy a storage access key  

You can use **Manage Keys** to copy a storage access key to use in a connection string. The connection string requires the storage account name and a key to use in authentication. For information about configuring connection strings to access Azure storage services, see [Configuring Connection Strings](http://msdn.microsoft.com/library/azure/ee758697.aspx).

1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**, and then click the name of the storage account to open the dashboard.

2. Click **Manage Keys**.

 	**Manage Access Keys** opens.

	![Managekeys](./media/storage-create-storage-account/Storage_ManageKeys.png)

 
3. To copy a storage access key, select the key text. Then right-click, and click **Copy**.

### Regenerate storage access keys
You should change the access keys to your storage account periodically to help keep your storage connections more secure. Two access keys are assigned to enable you to maintain connections to the storage account using one access key while you regenerate the other access key. 

> [AZURE.WARNING] Regenerating your access keys affects virtual machines, media services, and any applications that are dependent on the storage account. All clients that use the access key to access the storage account must be updated to use the new key.

**Virtual machines** - If your storage account contains any virtual machines that are running, you will have to redeploy all virtual machines after you regenerate the access keys. To avoid redeployment, shut down the virtual machines before you regenerate the access keys.
 
**Media services** - If you have media services dependent on your storage account, you must re-sync the access keys with your media service after you regenerate the keys.
 
**Applications** - If you have web applications or cloud services using the storage account, you will lose the connections if you regenerate keys, unless you roll your keys. Here is the process:

1. Update the connection strings in your application code to reference the secondary access key of the storage account. 

2. Regenerate the primary access key for your storage account. In the [Management Portal](http://manage.windowsazure.com), from the dashboard or the **Configure** page, click **Manage Keys**. Click **Regenerate** under the primary access key, and then click **Yes** to confirm you want to generate a new key.

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key.

## Delete a storage account

To remove a storage account that you are no longer using, use **Delete** on the dashboard or the **Configure** page. **Delete** deletes the entire storage account, including all of the blobs, tables, and queues in the account. 

> [AZURE.WARNING] There's no way to restore the content from a deleted storage account. Make 
	sure you back up anything you want to save before you delete the account. <br />
	If your storage account contains any VHD files or disks for an Azure virtual machine, then you must delete any images and disks that are using those VHD files before you can delete the storage account. First, stop the virtual machine if it is running, and then delete it. To delete disks, navigate to the Disks tab and delete any disks contained in the storage account. To delete images, navigate to the Images tab and delete any images stored in the account.


1. In the [Management Portal](http://manage.windowsazure.com), click **Storage**.

2. Click anywhere in the storage account entry except the name, and then click **Delete**.

	 -Or-

	Click the name of the storage account to open the dashboard, and then click **Delete**.

3. Click **Yes** to confirm you want to delete the storage account.

## Next steps

- To learn more about Azure Storage, see the Azure Storage documentation on [azure.com](http://azure.microsoft.com/documentation/services/storage/) and on [MSDN](http://msdn.microsoft.com/library/azure/gg433040.aspx). 

- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).



