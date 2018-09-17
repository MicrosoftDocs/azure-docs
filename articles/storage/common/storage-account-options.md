---
title: Azure Storage account options | Microsoft Docs
description: Understanding options for using Azure Storage.
services: storage
author: xyh1
ms.service: storage
ms.topic: get-started-article
ms.date: 07/14/2018
ms.author: hux
ms.component: common
---

# Azure Storage account options

## Overview
Azure Storage provides three distinct account options, with different pricing and features supported. Consider these differences before you create a storage account to determine the option that is best for your applications. The three different storage account options are:

* [**General-purpose v2 (GPv2)** accounts](#general-purpose-v2-accounts)
* [**General-purpose v1 (GPv1)** accounts](#general-purpose-v1-accounts)
* [**Blob storage** accounts](#blob-storage-accounts)

Each type of account is described in greater detail in the following section:

## Storage account options

### General-purpose v2 accounts

General-purpose v2 (GPv2) accounts are storage accounts that support all of the latest features for blobs, files, queues, and tables. GPv2 accounts support all APIs, services, and features supported by General-purpose v1 (GPv1) and Blob storage accounts. They also retain the same durability, availability, scalability, and performance provided by all storage account types. Pricing for GPv2 accounts has been designed to deliver the lowest per gigabyte prices, and industry competitive transaction prices.

You can upgrade your GPv1 or Blob storage account to a GPv2 account using Azure portal, PowerShell, or Azure CLI. 

For block blobs in a GPv2 storage account, you can choose between hot or cool storage access tiers at the account level and between hot, cool, or archive access tiers at the blob level based on usage patterns. Store frequently, infrequently, and rarely accessed data in the hot, cool, and archive storage tiers respectively to optimize storage and transaction costs. 

GPv2 storage accounts expose the **Access Tier** attribute at the account level, which specifies the default storage account tier as **Hot** or **Cool**. The default storage account tier is applied to any blob that does not have an explicit tier set at the blob level. If there is a change in the usage pattern of your data, you can also switch between these storage tiers at any time. The **Archive** tier can only be applied at the blob level.

> [!NOTE]
> Changing the storage tier may result in additional charges. For more information, see the [Pricing and billing](#pricing-and-billing) section.
>
> Microsoft recommends using general-purpose v2 storage accounts over Blob storage accounts for most scenarios.

> [!NOTE]
> The [Premium access tier](../blobs/storage-blob-storage-tiers.md#premium-access-tier) is available in preview as a locally redundant storage (LRS) account in the North Europe, US East 2, US Central and US West regions.

### Upgrade a storage account to GPv2

Users can upgrade a GPv1 or Blob storage account to a GPv2 account at any time using Azure portal, PowerShell, or Azure CLI. This change cannot be reversed, and no other account type changes are permitted. For more information on evaluating your existing storage account, see the [Evaluating and migrating to GPv2 storage accounts](#evaluating-and-migrating-to-gpv2-storage-accounts) section.
* [Upgrade to GPv2 with Azure portal](#upgrade-with-azure-portal)
* [Upgrade to GPv2 with PowerShell](#upgrade-with-powershell)
* [Upgrade to GPv2 with Azure CLI](#upgrade-with-azure-cli)

#### Upgrade with Azure portal
To upgrade a GPv1 or Blob storage account to a GPv2 account using Azure portal, first sign into the [Azure portal](https://portal.azure.com) and select your storage account. Select **Settings** > **Configuration**. There you will see the **Upgrade** button along with a note regarding the upgrade process.

#### Upgrade with PowerShell

To upgrade a GPv1 or Blob storage account to a GPv2 account using PowerShell, first update PowerShell to use the latest version of the **AzureRm.Storage** module. See [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) for information about installing PowerShell. Then call the following command to upgrade the account, substituting the name of your resource group and storage account:

```powershell
Set-AzureRmStorageAccount -ResourceGroupName <resource-group> -AccountName <storage-account> -UpgradeToStorageV2
```

#### Upgrade with Azure CLI

To upgrade a GPv1 or Blob storage account to a GPv2 account using Azure CLI, first install the latest version of Azure CLI. See [Install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) for information about installing the CLI. Then call the following command to upgrade the account, substituting the name of your resource group and storage account:

```cli
az storage account update -g <resource-group> -n <storage-account> --set kind=StorageV2
``` 

### General-purpose v1 accounts

General-purpose v1 (GPv1) accounts provide access to all Azure Storage services, but may not have the latest features or the lowest per gigabyte pricing. For example, cool storage and archive storage are not supported in GPv1. Pricing is lower for GPv1 transactions, so workloads with high churn or high read rates may benefit from this account type.

General-purpose v1 (GPv1) storage accounts are the oldest type of storage account, and the only kind that can be used with the classic deployment model. 

### Blob storage accounts

Blob storage accounts support all the same block blob features as GPv2, but are limited to supporting only block blobs. Pricing is broadly similar to pricing for general-purpose v2 accounts. Customers should review the pricing differences between Blob storage accounts and GPv2, and consider upgrading to GPv2. This upgrade cannot be undone.

> [!NOTE]
> Blob storage accounts support only block and append blobs, and not page blobs.
>
> Microsoft recommends using general-purpose v2 storage accounts over Blob storage accounts for most scenarios.

## Recommendations

For more information on storage accounts, see [About Azure storage accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

For applications requiring the latest block or append blob features, using GPv2 storage accounts is recommended, to take advantage of the differentiated pricing model of tiered storage. However, you may want to use GPv1 in certain scenarios, such as:

* You still need to use the classic deployment model. GPv2 and Blob storage accounts are only available via the Azure Resource Manager deployment model.
* You use high volumes of transactions or geo-replication bandwidth, both of which cost more in GPv2 and Blob storage accounts than in GPv1, and don't have enough storage that benefits from the lower costs of GB storage.
* You use a version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) that is earlier than 2014-02-14 or a client library with a version lower than 4.x, and cannot upgrade your application.

## Pricing and billing
All storage accounts use a pricing model for blob storage based on the tier of each blob. When using a storage account, the following billing considerations apply:

* **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the storage tier. The per-gigabyte cost decreases as the tier gets cooler.
* **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive storage tier, you are charged a per-gigabyte data access charge for reads.
* **Transaction costs**: There is a per-transaction charge for all tiers that increases as the tier gets cooler.
* **Geo-Replication data transfer costs**: This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.
* **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.
* **Changing the storage tier**: Changing the account storage tier from cool to hot incurs a charge equal to reading all the data existing in the storage account. However, changing the account storage tier from hot to cool incurs a charge equal to writing all the data into the cool tier (GPv2 accounts only).

> [!NOTE]
> For more information on the pricing model for storage accounts, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

## Quickstart scenarios

In this section, the following scenarios are demonstrated using the Azure portal:

* [How to create a GPv2 storage account.](#create-a-gpv2-storage-account-using-the-azure-portal)
* [How to convert a GPv1 or Blob storage account to a GPv2 storage account.](#convert-a-gpv1-or-blob-storage-account-to-a-gpv2-storage-account-using-the-azure-portal)
* [How to set account tier in a GPv2 or Blob storage account.](#change-the-storage-tier-of-a-gpv2-storage-account-using-the-azure-portal)
* [How to set blob tier in a GPv2 or Blob storage account.](#change-the-storage-tier-of-a-blob-using-the-azure-portal)

You cannot set the access tier to archive in the following examples because this setting applies to the whole storage account. Archive can only be set on a specific blob.

### Create a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, select **Create a resource** > **Data + Storage** > **Storage account**.

3. Enter a name for your storage account.

    This name must be globally unique; it is used as part of the URL used to access the objects in the storage account.  

4. Select **Resource Manager** as the deployment model.

    Tiered storage can only be used with Resource Manager storage accounts; Resource Manager is the recommended deployment model for new resources. For more information, see the [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).  

5. In the **Account Kind** dropdown list, select **General-purpose v2**.

    When you select GPv2, the performance tier is set to Standard. Tiered storage is not available with the Premium performance tier.

6. Select the replication option for the storage account: **LRS**, **ZRS**, **GRS**, or **RA-GRS**. The default is **RA-GRS**.

    LRS = locally-redundant storage; ZRS = zone-redundant storage; GRS = geo-redundant storage (two regions); RA-GRS = read-access geo-redundant storage (two regions with read access to the second).

    For more details on Azure Storage replication options, see [Azure Storage replication](../common/storage-redundancy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

7. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**. The default is **Hot**.

8. Select the subscription in which you want to create the new storage account.

9. Specify a new resource group or select an existing resource group. For more information on resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

10. Select the region for your storage account.

11. Click **Create** to create the storage account.

### Convert a GPv1 or Blob storage account to a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account: select **All resources**, then select your storage account.

3. In the Settings section, click **Configuration**.

4. Under **Account kind**, click on **Upgrade**.

5. Under **Confirm upgrade**, type in the name of your account. 

5. Click Upgrade at the bottom of the blade.

### Change the storage tier of a GPv2 storage account using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your storage account: select **All resources**, then select your storage account.

3. In the Settings blade, click **Configuration** to view and/or change the account configuration.

4. Select the right storage tier for your needs: Set the **Access tier** to either **Cool** or **Hot**.

5. Click Save at the top of the blade.

### Change the storage tier of a blob using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. To navigate to your blob in your storage account: select **All resources**, select your storage account, select your container, and then select your blob.

3. In the Blob properties blade, click the **Access Tier** dropdown menu to select the **Hot**, **Cool**, or **Archive** storage tier.

5. Click Save at the top of the blade.

> [!NOTE]
> Changing the storage tier may result in additional charges. For more information, see the [Pricing and Billing](#pricing-and-billing) section.


## Evaluating and migrating to GPv2 storage accounts
The purpose of this section is to help users to make a smooth transition to using GPv2 storage accounts from GPv1 storage accounts. There are two user scenarios:

* You have an existing GPv1 storage account and want to evaluate a change to a GPv2 storage account with the right storage tier.
* You have decided to use a GPv2 storage account or already have one and want to evaluate whether you should use the hot or cool storage tier.

In both cases, the first priority is to estimate the cost of storing, accessing, and operating on your data stored in a GPv2 storage account and compare that against your current costs.

## Evaluating GPv2 storage account tiers

In order to estimate the cost of storing and accessing data stored in a GPv2 storage account, you need to evaluate your existing usage pattern or approximate your expected usage pattern. In general, you want to know:

* Your data storage consumption (GB)
    - How much data is being stored in the storage account?
    - How does the data volume change on a monthly basis; does new data constantly replace old data?
* Your storage access pattern (operations and data transfer)
    - How much data is being read from (egress) and written to (ingress) the storage account? 
    - How many operations occur on the data in the storage account?
    - What kinds of operations (Read vs. Write) are transacted on the data?

## Monitoring existing storage accounts

To monitor your existing storage accounts and gather this data, you can make use of Azure Storage Analytics, which performs logging and provides metrics data for a storage account. Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to the storage service for GPv1, GPv2, and Blob storage account types. This data is stored in well-known tables in the same storage account.

For more information, see [About Storage Analytics Metrics](https://msdn.microsoft.com/library/azure/hh343258.aspx) and [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/azure/hh343264.aspx)

> [!NOTE]
> Blob storage accounts expose the Table service endpoint only for storing and accessing the metrics data for that account. 

To monitor the storage consumption for Blob storage, you need to enable the capacity metrics.
With this enabled, capacity data is recorded daily for a storage account's Blob service and recorded as a table entry that is written to the *$MetricsCapacityBlob* table within the same storage account.

To monitor data access patterns for Blob storage, you need to enable the hourly transaction metrics from the API. With hourly transaction metrics enabled, per API transactions are aggregated every hour, and recorded as a table entry that is written to the *$MetricsHourPrimaryTransactionsBlob* table within the same storage account. The *$MetricsHourSecondaryTransactionsBlob* table records the transactions to the secondary endpoint when using RA-GRS storage accounts.

> [!NOTE]
> If you have a general-purpose storage account with stored page blobs and virtual machine disks, or queues, files, or tables, alongside block and append blob data, this estimation process is not applicable. The capacity data does not differentiate block blobs from other types, and does not give capacity data for other data types. If you use these types, an alternative methodology is to look at the quantities on your most recent bill.

To get a good approximation of your data consumption and access pattern, we recommend you choose a retention period for the metrics that is representative of your regular usage and extrapolate. One option is to retain the metrics data for seven days and collect the data every week, for analysis at the end of the month. Another option is to retain the metrics data for the last 30 days and collect and analyze the data at the end of the 30-day period.

For details on enabling, collecting, and viewing metrics data, see [Enabling Azure Storage metrics and viewing metrics data](../common/storage-enable-and-view-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

> [!NOTE]
> Storing, accessing, and downloading analytics data is also charged just like regular user data.

### Utilizing usage metrics to estimate costs

#### Storage costs

The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'data'* shows the storage capacity consumed by user data. The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'analytics'* shows the storage capacity consumed by the analytics logs.

This total capacity consumed by both user data and analytics logs (if enabled) can then be used to estimate the cost of storing data in the storage account. The same method can also be used for estimating storage costs in GPv1 storage accounts.

#### Transaction costs

The sum of *'TotalBillableRequests'*, across all entries for an API in the transaction metrics table indicates the total number of transactions for that particular API. *For example*, the total number of *'GetBlob'* transactions in a given period can be calculated by the sum of total billable requests for all entries with the row key *'user;GetBlob'*.

In order to estimate transaction costs for Blob storage accounts, you need to break down the transactions into three groups since they are priced differently.

* Write transactions such as *'PutBlob'*, *'PutBlock'*, *'PutBlockList'*, *'AppendBlock'*, *'ListBlobs'*, *'ListContainers'*, *'CreateContainer'*, *'SnapshotBlob'*, and *'CopyBlob'*.
* Read transactions such as *'GetBlob'*.
* All other transactions.

In order to estimate transaction costs for GPv1 storage accounts, you need to aggregate all transactions irrespective of the operation/API.

### Data access and geo-replication data transfer costs

While storage analytics does not provide the amount of data read from and written to a storage account, it can be roughly estimated by looking at the transaction metrics table. The sum of *'TotalIngress'* across all entries for an API in the transaction metrics table indicates the total amount of ingress data in bytes for that particular API. Similarly the sum of *'TotalEgress'* indicates the total amount of egress data, in bytes.

In order to estimate the data access costs for Blob storage accounts, you need to break down the transactions into two groups:

* The amount of data retrieved from the storage account can be estimated by looking at the sum of *'TotalEgress'* for primarily the *'GetBlob'* and *'CopyBlob'* operations.
* The amount of data written to the storage account can be estimated by looking at the sum of *'TotalIngress'* for primarily the *'PutBlob'*, *'PutBlock'*, *'CopyBlob'* and *'AppendBlock'* operations.

The cost of geo-replication data transfer for Blob storage accounts can also be calculated by using the estimate for the amount of data written when using a GRS or RA-GRS storage account.

> [!NOTE]
> For a more detailed example about calculating the costs for using the hot or cool storage tier, take a look at the FAQ titled *'What are Hot and Cool access tiers and how should I determine which one to use?'* in the [Azure Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/).

## Migrating existing data

A GPv1 or Blob storage account can be easily upgraded to GPv2 with no downtime or API changes, and without the need to migrate data. For this reason, it's strongly recommended that you migrate GPv1 accounts to GPv2 accounts, instead of to Blob storage accounts. For more information on upgrading to GPv2, see [Upgrade a storage account to GPv2](#upgrade-a-storage-account-to-gpv2).

However, if you need to migrate from GPv1 to a Blob storage account and are unable to use GPv2 accounts, you can use the following instructions. 

A Blob storage account is specialized for storing only block and append blobs. Existing general-purpose storage
accounts, which allow you to store tables, queues, files, and disks, as well as blobs, cannot be converted to Blob storage accounts. To use the storage tiers, you need to create new Blob storage accounts and migrate your existing data into the newly created accounts. 

You can use the following methods to migrate existing data into Blob storage accounts from on-premises storage devices, from third-party cloud storage providers, or from your existing general-purpose storage accounts in Azure:

### AzCopy

AzCopy is a Windows command-line utility designed for high-performance copying of data to and from Azure Storage. You can use AzCopy to copy data into your Blob storage account from your existing general-purpose storage accounts, or to upload data from your on-premises storage devices into your Blob storage account.

For more information, see [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

### Data movement library

The Azure Storage data movement library for .NET is based on the core data movement framework that powers AzCopy. The library is designed for high-performance, reliable, and easy data transfer operations similar to AzCopy. You can use it to take advantage of the features provided by AzCopy in your application natively without having to deal with running and monitoring external instances of AzCopy.

For more information, see [Azure Storage Data Movement Library for .Net](https://github.com/Azure/azure-storage-net-data-movement)

### REST API or client library

You can create a custom application to migrate your data into a Blob storage account using one of the Azure client libraries or the Azure storage services REST API. Azure Storage provides rich client libraries for multiple languages and platforms like .NET, Java, C++, Node.JS, PHP, Ruby, and Python. The client libraries offer advanced capabilities such as retry logic, logging, and parallel uploads. You can also develop directly against the REST API, which can be called by any language that makes HTTP/HTTPS requests.

For more information, see [Get Started with Azure Blob storage](../blobs/storage-dotnet-how-to-use-blobs.md).

> [!IMPORTANT]
> Blobs encrypted using client-side encryption store encryption-related metadata with the blob. If you copy a blob that is encrypted with client-side encryption, ensure that the copy operation preserves the blob metadata, and especially the encryption-related metadata. If you copy a blob without the encryption metadata, the blob content cannot be retrieved again. For more information regarding encryption-related metadata, see [Azure Storage Client-Side Encryption](../common/storage-client-side-encryption.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## FAQ

**Are existing storage accounts still available?**

Yes, existing storage accounts (GPv1) are still available and are unchanged in pricing or functionality. GPv1 accounts do not have the ability to choose a storage tier and will not have tiering capabilities in the future.

**Why and when should I start using GPv2 storage accounts?**

GPv2 storage accounts are specialized for providing the lowest GB storage costs, while delivering industry competitive transaction and data access costs. Going forward, GPv2 storage accounts are the recommended way for storing blobs, as future capabilities such as change notifications will be introduced based on this account type. However, it is up to you when you would like to upgrade based on your business requirements. For example, you may choose to optimize your transaction patterns prior to upgrade.

Downgrades from GPv2 are not supported, so consider all pricing implications prior to upgrading your accounts to GPv2.

**Can I upgrade my existing storage account to a GPv2 storage account?**

Yes. GPv1 or Blob storage accounts can easily be upgraded to GPv2 in the portal, or using PowerShell or CLI. 

Downgrades from GPv2 are not supported, so consider all pricing implications prior to upgrading your accounts to GPv2.

**Can I store objects in both storage tiers in the same account?**

Yes. The **Access Tier** attribute set at an account level is the default tier that applies to all objects in that account without an explicit set tier. However, blob-level tiering allows you to set the access tier on at the object level regardless of what the access tier setting on the account is. Blobs in any of the three storage tiers (hot, cool, or archive) may exist within the same account.

**Can I change the storage tier of my GPv2 storage account?**

Yes, you can change the account storage tier by setting the **Access Tier** attribute on the storage account. Changing the account storage tier applies to all objects stored in the account that do not have an explicit tier set. Changing the storage tier from hot to cool incurs write operations (per 10,000) charges (GPv2 storage accounts only), while changing from cool to hot incurs both read operations (per 10,000) and data retrieval (per GB) charges for reading all the data in the account.

**How frequently can I change the storage tier of my GPv2 or Blob storage account?**

While there is no enforced limitation on how frequently the storage tier can be changed, be aware that changing the storage tier from cool to hot can incur significant charges. Changing the storage tier frequently is not recommended.

**Do the blobs in the cool storage tier behave differently than the ones in the hot storage tier?**

Blobs in the hot storage tier of GPv2 and Blob storage accounts have the same latency as blobs in GPv1 storage accounts. Blobs in the cool storage tier have a similar latency (in milliseconds) as blobs in the hot tier. Blobs in the archive storage tier have several hours of latency.

Blobs in the cool storage tier have a slightly lower availability service level (SLA) than the blobs stored in the hot storage tier. For more information, see [SLA for storage](https://azure.microsoft.com/support/legal/sla/storage).

**Can I store page blobs and virtual machine disks in Blob storage accounts?**

No. Blob storage accounts support only block and append blobs, and not page blobs. Azure virtual machine disks are backed by page blobs and as a result Blob storage accounts cannot be used to store virtual machine disks. However it is possible to store backups of the virtual machine disks as block blobs in a Blob storage account. This is one of the reasons to consider using GPv2 instead of Blob storage accounts.

**Can I tier page blobs in GPv2 storage accounts?**

No. Page blobs will infer the storage tier of your account but it has no effect on pricing or availability. You will not be able to change the access tier of a page blob to hot, cool, or archive. The Set Blob Tier operation is allowed on a page blob in a premium storage account but it only determines the allowed size, IOPS, and bandwidth of the premium page blob. For more information, see [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier).

**Do I need to change my existing applications to use GPv2 storage accounts?**

GPv2 storage accounts are 100% API consistent with GPv1 and Blob storage accounts. As long as your application is using block blobs or append blobs, and you are using the 2014-02-14 version of the [Storage Services REST API](https://msdn.microsoft.com/library/azure/dd894041.aspx) or greater your application should work. If you are using an older version of the protocol, then you must update your application to use the new version so as to work seamlessly with both types of storage accounts. In general, we always recommend using the latest version regardless of which storage account type you use.

GPv2 pricing is generally higher than GPv1 for transactions and bandwidth. Therefore, it may be necessary to optimize your transaction patterns prior to upgrade so that your total bill will not increase.

**Is there a change in user experience?**

GPv2 storage accounts are very similar to GPv1 storage accounts, and support all the key features of Azure Storage, including high durability and availability, scalability, performance, and security. Other than the features and restrictions specific to Blob storage accounts and its storage tiers that have been called out above, everything else remains the same when upgrading to either GPv2 or Blob storage.

## Next steps

### Evaluate Blob storage accounts

[Check availability of Blob storage accounts by region](https://azure.microsoft.com/regions/#services)

[Evaluate usage of your current storage accounts by enabling Azure Storage metrics](../common/storage-enable-and-view-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Check Blob storage pricing by region](https://azure.microsoft.com/pricing/details/storage/)

[Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)

### Start using GPv2 storage accounts

[Get Started with Azure Blob storage](../blobs/storage-dotnet-how-to-use-blobs.md)

[Moving data to and from Azure Storage](../common/storage-moving-data.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

[Browse and explore your storage accounts](http://storageexplorer.com/)
