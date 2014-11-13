<properties urlDisplayName="How to create" pageTitle="How to create a storage account | Azure" metaKeywords="" description="Learn how to create a storage account in the Azure management portal." metaCanonical="" services="storage" documentationCenter="" title="How To Create a Storage Account" solutions="" authors="tamram" manager="adinah" editor="cgronlun" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />


<h1><a id="createstorageaccount"></a>How To Create a Storage Account</h1>

To store files and data in the Blob, Table, Queue, and File services in Azure, you must create a storage account in the geographic region where you want to store the data. This topic describes how to create a storage account in the Azure Management Portal.

For details about storage account capacity and throughput, see [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx).

> [WACOM.NOTE] For an Azure virtual machine, a storage account is created automatically in the deployment location if you do not already have a storage account in that location. The storage account name will be based on the virtual machine name.

##Table of Contents##

* [How to: Create a storage account](#create)
* [Next steps](#next)

<h2><a id="create"></a>How to: Create a storage account</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **Create New**, click **Storage**, and then click **Quick Create**.

	![NewStorageAccount](./media/storage-create-storage-account/storage_NewStorageAccount.png)

3. In **URL**, enter a subdomain name to use in the storage account URL. To access an object in storage, you will append the object's location to the endpoint. For example, the URL for accessing a blob might be http://*myaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

4. In **Region/Affinity Group**, select a region or affinity group for the storage.  Select an affinity group instead of a region if you want your storage services to be in the same data center with other Azure services that you are using. This can improve performance, and no charges are incurred for egress.

	> [WACOM.NOTE]  To create an affinity group, open the <b>Settings</b> area of the Management Portal, click <b>Affinity Groups</b>, and then click either <b>Add an affinity group</b> or the <b>Add</b> button. You can also create and manage affinity groups using the Azure Service Management API. See <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee460798.aspx">Operations on Affinity Groups</a> for more information.

5. If you have more than one Azure subscription, then the **Subscription** field is displayed. In **Subscription**, enter the Azure subscription that you want to use the storage account with. You can create up to five storage accounts for a subscription.

6. In **Replication**, select the level of replication that you desire for your storage account.

	[WACOM.INCLUDE [storage-replication-options](../includes/storage-replication-options.md)]

6. Click **Create Storage Account**.

	It may take a few minutes to create your storage account. To check the status, you can monitor the notifications at the bottom of the portal. After the storage account has been created, your new storage account has **Online** status and is ready for use. 

	![StoragePage](./media/storage-create-storage-account/Storage_StoragePage.png)

<h2><a id="next"></a>Next steps</h2>

- To learn more about Azure Storage, see the Azure Storage documentation on [azure.com](http://azure.microsoft.com/en-us/documentation/services/storage/) and on [MSDN](http://msdn.microsoft.com/en-us/library/gg433040.aspx). 

- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).

