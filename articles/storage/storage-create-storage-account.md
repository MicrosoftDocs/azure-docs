<properties
	pageTitle="How to create, manage, or delete a storage account in the Azure Portal | Microsoft Azure"
	description="Create a new storage account, manage your account access keys, or delete a storage account in the Azure Portal. Learn about standard and premium storage accounts."
	services="storage"
	documentationCenter=""
	authors="robinsh"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="02/14/2016"
	ms.author="robinsh"/>


# About Azure storage accounts

[AZURE.INCLUDE [storage-selector-portal-create-storage-account](../../includes/storage-selector-portal-create-storage-account.md)]

## Overview

An Azure storage account gives you access to the Azure Blob, Queue, Table, and File services in Azure Storage. Your storage account provides the unique namespace for your Azure Storage data objects. By default, the data in your account is available only to you, the account owner.

There are two types of storage accounts:

- A standard storage account includes Blob, Table, Queue, and File storage.
- A premium storage account currently supports Azure virtual machine disks only. See [Premium Storage: High-performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md) for an in-depth overview of Premium Storage.

## Storage account billing

You are billed for Azure Storage usage based on your storage account. Storage costs are based on four factors: storage capacity, replication scheme, storage transactions, and data egress.

- Storage capacity refers to how much of your storage account allotment you are using to store data. The cost of simply storing your data is determined by how much data you are storing, and how it is replicated.
- Replication determines how many copies of your data are maintained at once, and in what locations.
- Transactions refer to all read and write operations to Azure Storage.
- Data egress refers to data transferred out of an Azure region. When the data in your storage account is accessed by an application that is not running in the same region, whether that application is a cloud service or some other type of application, then you are charged for data egress. (For Azure services, you can take steps to group your data and services in the same data centers to reduce or eliminate data egress charges.)  

The [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage) page provides detailed pricing information for storage capacity, replication, and transactions. The [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page provides detailed pricing information for data egress.

For details about storage account capacity and performance targets, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

> [AZURE.NOTE] When you create an Azure virtual machine, a storage account is created for you automatically in the deployment location if you do not already have a storage account in that location. So it's not necessary to follow the steps below to create a storage account for your virtual machine disks. The storage account name will be based on the virtual machine name. See the [Azure Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/) for more details.

## Storage account endpoints

Every object that you store in Azure Storage has a unique URL address. The storage account name forms the subdomain of that address. The combination of subdomain and domain name, which is specific to each service, forms an *endpoint* for your storage account.

For example, if your storage account is named *mystorageaccount*, then the default endpoints for your storage account are:

- Blob service: http://*mystorageaccount*.blob.core.windows.net

- Table service: http://*mystorageaccount*.table.core.windows.net

- Queue service: http://*mystorageaccount*.queue.core.windows.net

- File service: http://*mystorageaccount*.file.core.windows.net

The URL for accessing an object in a storage account is built by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

You can also configure a custom domain name to use with your storage account. For Classic storage accounts, see [Configure a custom domain Name for your Blob Storage Endpoint](storage-custom-domain-name.md) for details. For ARM storage accounts, this capability has not been added to the [Azure Portal](https://portal.azure.com) yet, but you can configure it with PowerShell. For more information, see the [Set-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607146.aspx) cmdlet.  

## Create a storage account

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. On the Hub menu, select **New** -> **Data + Storage** -> **Storage account**.

3. Select a deployment model: **Resource Manager** or **Classic**. **Resource Manager** is the recommended deployment model. For more information, see [Understanding Resource Manager deployment and classic deployment](../resource-manager-deployment-model.md).

4. Enter a name for your storage account.

	> [AZURE.NOTE] Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
	>  
	> Your storage account name must be unique within Azure. The Azure Portal will indicate if the storage account name you select is already taken.

	See [Storage account endpoints](#storage-account-endpoints) below for details about how the storage account name will be used to address your objects in Azure Storage.

5. Specify the type of storage account to create. The storage account type determines how the storage account is replication and whether it is a standard storage account or a premium storage account.

	The default storage account type is **Standard-RAGRS**, which is a standard storage account with read-access geo-redundant replication. This type of storage account is replicated to a secondary region that is hundreds of miles away from the primary region, and provides read access to the secondary location.

	For more details on Azure Storage replication options, see [Azure Storage replication](storage-redundancy.md). For more details on standard and premium storage accounts, see [Introduction to Microsoft Azure Storage](storage-introduction.md) and [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage.md)

6. Indicate whether you wish to enable Diagnostics for your storage account. Diagnostics include Storage Analytics logging and metrics.

7. If you have more than one Azure subscription, then the **Subscription** field is displayed. Select the subscription in which you want to create the new storage account.

8. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Using the Azure Portal to manage your Azure resources](../azure-portal/resource-group-portal.md).

9. Select the geographic location for your storage account.

10. Click **Create** to create the storage account.

## Manage your storage access keys

When you create a storage account, Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

> [AZURE.NOTE] We recommend that you avoid sharing your storage access keys with anyone else. To permit access to storage resources without giving out your access keys, you can use a *shared access signature*. A shared access signature provides access to a resource in your account for an interval that you define and with the permissions that you specify. See [Shared Access Signatures: Understanding the SAS model](storage-dotnet-shared-access-signature-part-1.md) for more information.

### View and copy storage access keys

In the [Azure Portal](https://portal.azure.com), navigate to your storage account and click the **Keys** icon to view, copy, and regenerate your account access keys. The **Access Keys** blade also includes pre-configured connection strings using your primary and secondary keys that you can copy to use in your applications.

### Regenerate storage access keys

We recommend that you change the access keys to your storage account periodically to help keep your storage connections secure. Two access keys are assigned so that you can maintain connections to the storage account by using one access key while you regenerate the other access key.

> [AZURE.WARNING] Regenerating your access keys affects virtual machines, media services, and any applications that are dependent on the storage account. All clients that use the access key to access the storage account must be updated to use the new key.

**Virtual machines** - If your storage account contains any virtual machines that are running, you will have to redeploy all virtual machines after you regenerate the access keys. To avoid redeployment, shut down the virtual machines before you regenerate the access keys.

**Media services** - If you have media services that are dependent on your storage account, you must re-sync the access keys with your media service after you regenerate the keys.

**Applications** - If you have web applications or cloud services that use the storage account, you will lose the connections if you regenerate keys, unless you roll your keys.

Here is the process for rotating your storage access keys:

1. Update the connection strings in your application code to reference the secondary access key of the storage account.

2. Regenerate the primary access key for your storage account. On the **Access Keys** blade, click **Regenerate Key1**, and then click **Yes** to confirm that you want to generate a new key.

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key in the same manner.

## Delete a storage account

To remove a storage account that you are no longer using, navigate to the storage account in the [Azure Portal](https://portal.azure.com), and click **Delete**. Deleting a storage account deletes the entire account, including all data in the account.

> [AZURE.WARNING] It's not possible to restore a deleted storage account or retrieve any of the content that it contained before deletion. Be sure to back up anything you want to save before you delete the account. This also holds true for any resources in the account—once you delete a blob, table, queue, or file, it is permanently deleted.

To delete a storage account that is associated with an Azure virtual machine, you must first ensure that any virtual machine disks have been deleted. If you do not first delete your virtual machine disks, then when you attempt to delete your storage account, you will see an error message similar to:

    Failed to delete storage account <vm-storage-account-name>. Unable to delete storage account <vm-storage-account-name>: 'Storage account <vm-storage-account-name> has some active image(s) and/or disk(s). Ensure these image(s) and/or disk(s) are removed before deleting this storage account.'.

If the storage account uses the Classic deployment model, you can remove the virtual machine disk by following these steps in the [Classic Azure Portal](https://manage.windowsazure.com):

1. Navigate to the [Azure Classic Portal](https://manage.windowsazure.com).
2. Navigate to the Virtual Machines tab.
3. Click the Disks tab.
4. Select your data disk, then click Delete Disk.
5. To delete disk images, navigate to the Images tab and delete any images that are stored in the account.

For more information, see the [Azure Virtual Machine documentation](http://azure.microsoft.com/documentation/services/virtual-machines/).

## Next steps

- [Azure Storage replication](storage-redundancy.md)
- [Configure Azure Storage Connection Strings](storage-configure-connection-string.md)
- [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)
- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).
