---
title: Azure Storage account options | Microsoft Docs
description: Understanding options for using Azure Storage.
services: storage
documentationcenter: ''
author: jirwin
manager: jwillis
editor:

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 12/11/2017
ms.author: jirwin

---
# Azure Storage account 0ptions

## Overview
Azure Storage provides three distinct account options, with different pricing and features supported. It is important that users consider these differences to determine the option that is best for their applications.  The three different options are as follows:

* **General Purpose v2 (GPv2)** accounts provide all the latest features, and supports Blobs, Files, Queues, and Tables. Today, these latest features include blob-level tiering, archive storage, higher scale account limits, and storage events. Pricing has been designed to deliver the lowest GB prices, and industry competitive transaction prices.

* **Blob Storage** accounts provide all the latest features for block blobs, but only support Block Blobs.  Pricing is broadly similar to that in General Purpose v2. We encourage most users to use General Purpose v2 rather than using Blob Storage accounts.

* **General Purpose v1 (GPv1)** accounts provide use of all Azure Storage Services, but may not have the latest features or the lowest GB pricing. For example, cool and archive storage are not supported in GPv1.  Pricing is lower for transactions, so workloads with high churn or high read rates may benefit from this account type.

### Changing account kind
Users can upgrade either a GPv1 or Blob Storage accounts to a GPv2 account at any time via the portal, CLI, or PowerShell. This change cannot be reversed, and no other changes are permitted.

## General Purpose v2
**General Purpose v2 (GPv2)** are storage accounts which support all features for all storage services, including Blobs, Files, Queues, and Tables. For Block Blobs, You can choose between hot and cool storage tiers at account level, or hot, cool, and archive tiers at the blob level based on access patterns. Store frequently, infrequently, and rarely accessed data in the hot, cool, and archive storage tiers respectively to optimize costs. Importantly, any GPv1 account can be upgraded to a GPv2 account in the portal, CLI, or PowerShell. GPv2 accounts support all API's and features supported in Blob Storage and GPv1 accounts, share all the great durability, availability, scalability, and performance features in those account types.

Blob Storage accounts expose the **Access Tier** attribute at the account level, which specifies the default storage account tier as **Hot** or **Cool**. The default storage account tier is applied to any blob that does not have an explicit tier set at the blob level. If there is a change in the usage pattern of your data, you can also switch between these storage tiers at any time. The **archive tier** can only be applied at the blob level.

> [!NOTE]
> Changing the storage tier may result in additional charges. See the [Pricing and billing](#pricing-and-billing) section for more details.

## Blob Storage accounts

**Blob Storage accounts** support all the same Block Blob features as GPv2, but are limited to supporting only Block Blobs. Customers should review the pricing differences between Blob Storage accounts and GPv2, and consider upgrading to GPv2. Note that this upgrade cannot be undone.

> [!NOTE]
> Blob Storage accounts support only block and append blobs, and not page blobs.

## General Purpose v1
**General Purpose v1 (GPv1)** are the oldest storage account, and the only kind that can be used in the classic deployment model. Features like cool and archive storage are not available in GPv1. GPv1 has generally higher GB storage costs, but lower transaction costs than either GPv2 or Blob Storage accounts.

## Recommendations

See [About Azure storage accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) for more information on storage accounts.

For applications requiring only block or append blob storage, we recommend using GPv2 storage accounts, to take advantage of the differentiated pricing model of tiered storage. However, we understand this might not be possible under certain circumstances where using GPv1 storage accounts would be advisable, such as:

* You still need to use the classic deployment model. Blob Storage accounts are only available via the Azure Resource Manager deployment model.

* You use high volumes of transactions or geo-replication bandwidth, both of which cost more in GPv2 and Blob Storage accounts than in GPv1, and don't have enough storage that benefits from the lower costs of GB storage.

* You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

> [!NOTE]
> Blob Storage accounts are currently supported in all Azure regions.

## Pricing and billing
All storage accounts use a pricing model for blob storage based on the tier of each blob. When using a storage account, the following billing considerations apply:

* **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the storage tier. The per-gigabyte cost decreases as the tier gets cooler.

* **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive storage tier, you are charged a per-gigabyte data access charge for reads.

* **Transaction costs**: There is a per-transaction charge for all tiers that increases as the tier gets cooler.

* **Geo-Replication data transfer costs**: This only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.

* **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.

* **Changing the storage tier**: Changing the account storage tier from cool to hot incurs a charge equal to reading all the data existing in the storage account. However, changing the account storage tier from hot to cool incurs a charge equal to writing all the data into the cool tier (GPv2 accounts only).

> [!NOTE]
> For more details on the pricing model for Blob Storage accounts, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more details on the outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

## Quickstart scenarios

In this section, the following scenarios are demonstrated using the Azure portal:

* How to create a GPv2 storage account.
* How to convert a GPv1 or Blob Storage account to a GPv2 storage account.
* How to set account and blob tier in a GPv2 storage account.

You cannot set the access tier to archive in the following examples because this setting applies to the whole storage account. Archive can only be set on a specific blob.

### Create a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, select **New** > **Data + Storage** > **Storage account**.

3. Enter a name for your storage account.

    This name must be globally unique; it is used as part of the URL used to access the objects in the storage account.  

4. Select **Resource Manager** as the deployment model.

    Tiered storage can only be used with Resource Manager storage accounts; this is the recommended deployment model for new resources. For more information, check out the [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).  

5. In the Account Kind dropdown list, select **General Purpose v2**.

    This is where you select the type of storage account. Tiered storage is not available in general-purpose storage; it is only available in the Blob Storage type account.     

    When you select this, the performance tier is set to Standard. Tiered storage is not available with the Premium performance tier.

6. Select the replication option for the storage account: **LRS**, **GRS**, or **RA-GRS**. The default is **RA-GRS**.

    LRS = locally redundant storage; GRS = geo-redundant storage (two regions); RA-GRS is read-access geo-redundant storage (2 regions with read access to the second).

    For more details on Azure Storage replication options, check out [Azure Storage replication](../common/storage-redundancy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

7. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**. The default is **Hot**.

8. Select the subscription in which you want to create the new storage account.

9. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

10. Select the region for your storage account.

11. Click **Create** to create the storage account.

### Convert a GPv1 or Blob Storage account to a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account, select All Resources, then select your storage account.

3. In the Settings blade, click **Configuration**.

4. Under Account kind, click on **Upgrade**.

5. A new blade on the right will appear for confirmation. Under Confirm upgrade, type in the name of your account. 

5. Click Upgrade at the bottom of the blade.

### Change the storage tier of a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account, select All Resources, then select your storage account.

3. In the Settings blade, click **Configuration** to view and/or change the account configuration.

4. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**.

5. Click Save at the top of the blade.

### Change the storage tier of a blob using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your blob in your storage account, select All Resources, select your storage account, select your container, and then select your blob.

3. In the Blob properties blade, click the **Access Tier** dropdown menu to select the **Hot**, **Cool**, or **Archive** storage tier.

5. Click Save at the top of the blade.

> [!NOTE]
> Changing the storage tier may result in additional charges. See the [Pricing and Billing](#pricing-and-billing) section for more details.


## Evaluating and migrating to GPv2 storage accounts
The purpose of this section is to help users to make a smooth transition to using GPv2 storage accounts (as opposed to GPv1). There are two user scenarios:

* You have an existing GPv1 storage account and want to evaluate a change to a GPv2 storage account with the right storage tier.
* You have decided to use a GPv2 storage account or already have one and want to evaluate whether you should use the hot or cool storage tier.

In both cases, the first priority is to estimate the cost of storing and accessing your data stored in a GPv2 storage account and compare that against your current costs.

## Evaluating GPv2 storage account tiers

In order to estimate the cost of storing and accessing data stored in a GPv2 storage account, you need to evaluate your existing usage pattern or approximate your expected usage pattern. In general, you want to know:

* Your storage consumption - How much data is being stored and how does this change on a monthly basis?

* Your storage access pattern - How much data is being read from and written to the account (including new data)? How many transactions are used for data access, and what kinds of transactions are they?

## Monitoring existing storage accounts

To monitor your existing storage accounts and gather this data, you can make use of Azure Storage Analytics, which performs logging and provides metrics data for a storage account. Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to the storage service for GPv1, GPv2, and Blob Storage account types. This data is stored in well-known tables in the same storage account.

For more details, see [About Storage Analytics Metrics](https://msdn.microsoft.com/library/azure/hh343258.aspx) and [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/azure/hh343264.aspx)

> [!NOTE]
> Blob Storage accounts expose the table service endpoint only for storing and accessing the metrics data for that account. GPv1 ZRS storage accounts do not support metrics data.

To monitor the storage consumption for the Blob Storage service, you need to enable the capacity metrics.
With this enabled, capacity data is recorded daily for a storage account's Blob service and recorded as a table entry that is written to the *$MetricsCapacityBlob* table within the same storage account.

To monitor the data access pattern for the Blob Storage service, you need to enable the hourly transaction metrics at an API level. With this enabled, per API transactions are aggregated every hour, and recorded as a table entry that is written to the *$MetricsHourPrimaryTransactionsBlob* table within the same storage account. The *$MetricsHourSecondaryTransactionsBlob* table records the transactions to the secondary endpoint when using RA-GRS storage accounts.

> [!NOTE]
> In case you have a general-purpose storage account in which you have stored page blobs and virtual machine disks, or queues, files, or tables, alongside block and append blob data, this estimation process is not applicable. This is because the capacity data does not differentiate block blobs from other types, and does not give capacity data for other data types. If you use these types, an alternative methodology is to look at the quantities on your most recent bill.

To get a good approximation of your data consumption and access pattern, we recommend you choose a retention period for the metrics that is representative of your regular usage and extrapolate. One option is to retain the metrics data for seven days and collect the data every week, for analysis at the end of the month. Another option is to retain the metrics data for the last 30 days and collect and analyze the data at the end of the 30-day period.

For details on enabling, collecting, and viewing metrics data, see [Enabling Azure Storage metrics and viewing metrics data](../common/storage-enable-and-view-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

> [!NOTE]
> Storing, accessing, and downloading analytics data is also charged just like regular user data.

### Utilizing usage metrics to estimate costs

### Storage costs

The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'data'* shows the storage capacity consumed by user data. The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'analytics'* shows the storage capacity consumed by the analytics logs.

This total capacity consumed by both user data and analytics logs (if enabled) can then be used to estimate the cost of storing data in the storage account. The same method can also be used for estimating storage costs in GPv1 storage accounts.

### Transaction costs

The sum of *'TotalBillableRequests'*, across all entries for an API in the transaction metrics table indicates the total number of transactions for that particular API. *For example*, the total number of *'GetBlob'* transactions in a given period can be calculated by the sum of total billable requests for all entries with the row key *'user;GetBlob'*.

In order to estimate transaction costs for Blob Storage accounts, you need to break down the transactions into three groups since they are priced differently.

* Write transactions such as *'PutBlob'*, *'PutBlock'*, *'PutBlockList'*, *'AppendBlock'*, *'ListBlobs'*, *'ListContainers'*, *'CreateContainer'*, *'SnapshotBlob'*, and *'CopyBlob'*.
* Delete transactions such as *'DeleteBlob'* and *'DeleteContainer'*.
* All other transactions.

In order to estimate transaction costs for GPv1 storage accounts, you need to aggregate all transactions irrespective of the operation/API.

### Data access and geo-replication data transfer costs

While storage analytics does not provide the amount of data read from and written to a storage account, it can be roughly estimated by looking at the transaction metrics table. The sum of *'TotalIngress'* across all entries for an API in the transaction metrics table indicates the total amount of ingress data in bytes for that particular API. Similarly the sum of *'TotalEgress'* indicates the total amount of egress data, in bytes.

In order to estimate the data access costs for Blob Storage accounts, you need to break down the transactions into two groups.

* The amount of data retrieved from the storage account can be estimated by looking at the sum of *'TotalEgress'* for primarily the *'GetBlob'* and *'CopyBlob'* operations.

* The amount of data written to the storage account can be estimated by looking at the sum of *'TotalIngress'* for primarily the *'PutBlob'*, *'PutBlock'*, *'CopyBlob'* and *'AppendBlock'* operations.

The cost of geo-replication data transfer for Blob Storage accounts can also be calculated by using the estimate for the amount of data written when using a GRS or RA-GRS storage account.

> [!NOTE]
> For a more detailed example about calculating the costs for using the hot or cool storage tier, take a look at the FAQ titled *'What are Hot and Cool access tiers and how should I determine which one to use?'* in the [Azure Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/).

## Migrating existing data

A GPv1 or Blob Storage account can be easily upgraded to GPv2 with no downtime or API changes, and without the need for moving data around. This is one of the primary benefits of GPv2 vs. Blob Storage accounts.

However, if you need to migrate to a Blob Storage account, you can use the below instructions.

A Blob Storage account is specialized for storing only block and append blobs. Existing general-purpose storage
accounts, which allow you to store tables, queues, files, and disks, as well as blobs, cannot be converted to Blob Storage accounts. To use the storage tiers, you need to create new Blob Storage accounts and migrate your existing data into the newly created accounts.

You can use the following methods to migrate existing data into Blob Storage accounts from on-premises storage devices, from third-party cloud storage providers, or from your existing general-purpose storage accounts in Azure:

### AzCopy

AzCopy is a Windows command-line utility designed for high-performance copying of data to and from Azure Storage. You can use AzCopy to copy data into your Blob Storage account from your existing general-purpose storage accounts, or to upload data from your on-premises storage devices into your Blob Storage account.

For more details, see [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Data movement library

Azure Storage data movement library for .NET is based on the core data movement framework that powers AzCopy. The library is designed for high-performance, reliable, and easy data transfer operations similar to AzCopy. This allows you to take full benefits of the features provided by AzCopy in your application natively without having to deal with running and monitoring external instances of AzCopy.

For more details, see [Azure Storage Data Movement Library for .Net](https://github.com/Azure/azure-storage-net-data-movement)

### REST API or client library

You can create a custom application to migrate your data into a Blob Storage account using one of the Azure client libraries or the Azure storage services REST API. Azure Storage provides rich client libraries for multiple languages and platforms like .NET, Java, C++, Node.JS, PHP, Ruby, and Python. The client libraries offer advanced capabilities such as retry logic, logging, and parallel uploads. You can also develop directly against the REST API, which can be called by any language that makes HTTP/HTTPS requests.

For more details, see [Get Started with Azure Blob Storage](storage-dotnet-how-to-use-blobs.md).

> [!NOTE]
> Blobs encrypted using client-side encryption store encryption-related metadata stored with the blob. It is absolutely critical that any copy mechanism should ensure that the blob metadata, and especially the encryption-related metadata, is preserved. If you copy the blobs without this metadata, the blob content cannot be retrieved again. For more details regarding encryption-related metadata, see [Azure Storage Client-Side Encryption](../common/storage-client-side-encryption.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## FAQ

**Are existing storage accounts still available?**

Yes, existing storage accounts are still available and are unchanged in pricing or functionality.  They do not have the ability to choose a storage tier and will not have tiering capabilities in the future.

**Why and when should I start using GPv2 storage accounts?**

GPv2 storage accounts are specialized for providing the lowest GB storage costs, while delivering industry competitive transaction and data access costs. Going forward, GPv2 storage accounts are the recommended way for storing blobs, as future capabilities such as change notifications will be introduced based on this account type. However, it is up to you when you would like to upgrade based on your business requirements.  For example, you may choose to optimize your transaction patterns prior to upgrade.

**Can I upgrade my existing storage account to a GPv2 storage account?**

Yes. GPv1 or Blob Storage accounts can easily be upgraded to GPv2 in the portal.

**Can I store objects in both storage tiers in the same account?**

Yes. The **Access Tier** attribute set at an account level is the default tier that applies to all objects in that account without an explicit set tier. However, blob-level tiering allows you to set the access tier on at the object level regardless of what the access tier setting on the account is. Blobs in any of the three storage tiers (hot, cool, or archive) may exist within the same account.

**Can I change the storage tier of my GPv2  storage account?**

Yes, you can change the account storage tier by setting the **Access Tier** attribute on the storage account. Changing the account storage tier applies to all objects stored in the account that do not have an explicit tier set. Changing the storage tier from hot to cool incurs write operations (per 10,000) charges (GPv2 storage accounts only), while changing from cool to hot incurs both read operations (per 10,000) and data retrieval (per GB) charges for reading all the data in the account.

**How frequently can I change the storage tier of my Blob Storage account?**

While we do not enforce a limitation on how frequently the storage tier can be changed, be aware that changing the storage tier from cool to hot can incur significant charges. Changing the storage tier frequently is not recommended.

**Do the blobs in the cool storage tier behave differently than the ones in the hot storage tier?**

Blobs in the hot storage tier of GPv2 and Blob Storage accounts have the same latency as blobs in GPv1 storage accounts. Blobs in the cool storage tier have a similar latency (in milliseconds) as blobs in the hot tier. Blobs in the archive storage tier have several hours of latency.

Blobs in the cool storage tier have a slightly lower availability service level (SLA) than the blobs stored in the hot storage tier. For more details, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage).

**Can I store page blobs and virtual machine disks in Blob Storage accounts?**

No. Blob Storage accounts support only block and append blobs, and not page blobs. Azure virtual machine disks are backed by page blobs and as a result Blob Storage accounts cannot be used to store virtual machine disks. However it is possible to store backups of the virtual machine disks as block blobs in a Blob Storage account. This is one of the reasons to consider using GPv2 instead of Blob Storage accounts.

**Do I need to change my existing applications to use GPv2 storage accounts?**

GPv2 storage accounts are 100% API consistent with GPv1 and Blob Storage accounts. As long as your application is using block blobs or append blobs, and you are using the 2014-02-14 version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) or greater your application should work. If you are using an older version of the protocol, then you must update your application to use the new version so as to work seamlessly with both types of storage accounts. In general, we always recommend using the latest version regardless of which storage account type you use.

**Is there a change in user experience?**

GPv2 storage accounts are very similar to GPv1 storage accounts, and support all the key features of Azure Storage, including high durability and availability, scalability, performance, and security. Other than the features and restrictions specific to Blob Storage accounts and its storage tiers that have been called out above, everything else remains the same when upgrading to either GPv2 or Blob Storage.

## Next steps

### Evaluate Blob Storage accounts

[Check availability of Blob Storage accounts by region](https://azure.microsoft.com/regions/#services)

[Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Check Blob Storage pricing by region](https://azure.microsoft.com/pricing/details/storage/)

[Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)

### Start using GPv2 storage accounts

[Get Started with Azure Blob Storage](storage-dotnet-how-to-use-blobs.md)

[Moving data to and from Azure Storage](../common/storage-moving-data.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Browse and explore your storage accounts](http://storageexplorer.com/)
