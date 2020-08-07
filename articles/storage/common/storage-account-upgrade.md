---
title: Upgrade to a general-purpose v2 storage account
titleSuffix: Azure Storage
description: Upgrade to general-purpose v2 storage accounts.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/25/2019
ms.author: tamram  
---

# Upgrade to a general-purpose v2 storage account

General-purpose v2 storage accounts support the latest Azure Storage features and incorporate all of the functionality of general-purpose v1 and Blob storage accounts. General-purpose v2 accounts are recommended for most storage scenarios. General-purpose v2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices. General-purpose v2 accounts support default account access tiers of hot or cool and blob level tiering between hot, cool, or archive.

Upgrading to a general-purpose v2 storage account from your general-purpose v1 or Blob storage accounts is straightforward. You can upgrade using the Azure portal, PowerShell, or Azure CLI. There is no downtime or risk of data loss associated with upgrading to a general-purpose v2 storage account. The account upgrade happens via a simple Azure Resource Manager operation that changes the account type.

> [!IMPORTANT]
> Upgrading a general-purpose v1 or Blob storage account to general-purpose v2 is permanent and cannot be undone.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your storage account.
3. In the **Settings** section, click **Configuration**.
4. Under **Account kind**, click on **Upgrade**.
5. Under **Confirm upgrade**, type in the name of your account.
6. Click **Upgrade** at the bottom of the blade.

    ![Upgrade Account Kind](../blobs/media/storage-blob-account-upgrade/upgrade-to-gpv2-account.png)

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To upgrade a general-purpose v1 account to a general-purpose v2 account using PowerShell, first update PowerShell to use the latest version of the **Az.Storage** module. See [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-Az-ps) for information about installing PowerShell.

Next, call the following command to upgrade the account, substituting your resource group name, storage account name, and desired account access tier.

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> -AccountName <storage-account> -UpgradeToStorageV2 -AccessTier <Hot/Cool>
```
# [Azure CLI](#tab/azure-cli)

To upgrade a general-purpose v1 account to a general-purpose v2 account using Azure CLI, first install the latest version of Azure CLI. See [Install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) for information about installing the CLI.

Next, call the following command to upgrade the account, substituting your resource group name, storage account name, and desired account access tier.

```azurecli
az storage account update -g <resource-group> -n <storage-account> --set kind=StorageV2 --access-tier=<Hot/Cool>
```

---

## Specify an access tier for blob data

General-purpose v2 accounts support all Azure storage services and data objects, but access tiers are available only to block blobs within Blob storage. When you upgrade to a general-purpose v2 storage account, you can specify a default account access tier of hot or cool, which indicates the default tier your blob data will be uploaded as if the individual blob access tier parameter is not specified.

Blob access tiers enable you to choose the most cost-effective storage based on your anticipated usage patterns. Block blobs can be stored in a hot, cool, or archive tiers. For more information on access tiers, see [Azure Blob storage: Hot, Cool, and Archive storage tiers](../blobs/storage-blob-storage-tiers.md).

By default, a new storage account is created in the hot access tier, and a general-purpose v1 storage account can be upgraded to either the hot or cool account tier. If an account access tier is not specified on upgrade, it will be upgraded to hot by default. If you are exploring which access tier to use for your upgrade, consider your current data usage scenario. There are two typical user scenarios for migrating to a general-purpose v2 account:

* You have an existing general-purpose v1 storage account and want to evaluate an upgrade to a general-purpose v2 storage account, with the right storage access tier for blob data.
* You have decided to use a general-purpose v2 storage account or already have one and want to evaluate whether you should use the hot or cool storage access tier for blob data.

In both cases, the first priority is to estimate the cost of storing, accessing, and operating on your data stored in a general-purpose v2 storage account and compare that against your current costs.

## Pricing and billing

Upgrading a v1 storage account to a general-purpose v2 account is free. You may specify the desired account tier during the upgrade process. If an account tier is not specified on upgrade, the default account tier of the upgraded account will be `Hot`. However, changing the storage access tier after the upgrade may result in changes to your bill so it is recommended to specify the new account tier during upgrade.

All storage accounts use a pricing model for blob storage based on the tier of each blob. When using a storage account, the following billing considerations apply:

* **Storage costs**: In addition to the amount of data stored, the cost of storing data varies depending on the storage access tier. The per-gigabyte cost decreases as the tier gets cooler.

* **Data access costs**: Data access charges increase as the tier gets cooler. For data in the cool and archive storage access tier, you are charged a per-gigabyte data access charge for reads.

* **Transaction costs**: There is a per-transaction charge for all tiers that increases as the tier gets cooler.

* **Geo-Replication data transfer costs**: This charge only applies to accounts with geo-replication configured, including GRS and RA-GRS. Geo-replication data transfer incurs a per-gigabyte charge.

* **Outbound data transfer costs**: Outbound data transfers (data that is transferred out of an Azure region) incur billing for bandwidth usage on a per-gigabyte basis, consistent with general-purpose storage accounts.

* **Changing the storage access tier**: Changing the account storage access tier from cool to hot incurs a charge equal to reading all the data existing in the storage account. However, changing the account access tier from hot to cool incurs a charge equal to writing all the data into the cool tier (GPv2 accounts only).

> [!NOTE]
> For more information on the pricing model for storage accounts, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) page. For more information on outbound data transfer charges, see [Data Transfers Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/) page.

### Estimate costs for your current usage patterns

To estimate the cost of storing and accessing blob data in a general-purpose v2 storage account in a particular tier, evaluate your existing usage pattern or approximate your expected usage pattern. In general, you want to know:

* Your Blob storage consumption, in gigabytes, including:
  * How much data is being stored in the storage account?
  * How does the data volume change on a monthly basis; does new data constantly replace old data?

* The primary access pattern for your Blob storage data, including:
  * How much data is being read from and written to the storage account?
  * How many read operations versus write operations occur on the data in the storage account?

To decide on the best access tier for your needs, it can be helpful to determine your blob data capacity, and how that data is being used. This can be best done by looking at the monitoring metrics for your account.

### Monitoring existing storage accounts

To monitor your existing storage accounts and gather this data, you can make use of Azure Storage Analytics, which performs logging and provides metrics data for a storage account. Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to the storage service for GPv1, GPv2, and Blob storage account types. This data is stored in well-known tables in the same storage account.

For more information, see [About Storage Analytics Metrics](https://msdn.microsoft.com/library/azure/hh343258.aspx) and [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/azure/hh343264.aspx)

> [!NOTE]
> Blob storage accounts expose the Table service endpoint only for storing and accessing the metrics data for that account.

To monitor the storage consumption for Blob storage, you need to enable the capacity metrics.
With this enabled, capacity data is recorded daily for a storage account's Blob service and recorded as a table entry that is written to the *$MetricsCapacityBlob* table within the same storage account.

To monitor data access patterns for Blob storage, you need to enable the hourly transaction metrics from the API. With hourly transaction metrics enabled, per API transactions are aggregated every hour, and recorded as a table entry that is written to the *$MetricsHourPrimaryTransactionsBlob* table within the same storage account. The *$MetricsHourSecondaryTransactionsBlob* table records the transactions to the secondary endpoint when using RA-GRS storage accounts.

> [!NOTE]
> If you have a general-purpose storage account in which you have stored page blobs and virtual machine disks, or queues, files, or tables, alongside block and append blob data, this estimation process is not applicable. The capacity data does not differentiate block blobs from other types, and does not give capacity data for other data types. If you use these types, an alternative methodology is to look at the quantities on your most recent bill.

To get a good approximation of your data consumption and access pattern, we recommend you choose a retention period for the metrics that is representative of your regular usage and extrapolate. One option is to retain the metrics data for seven days and collect the data every week, for analysis at the end of the month. Another option is to retain the metrics data for the last 30 days and collect and analyze the data at the end of the 30-day period.

For details on enabling, collecting, and viewing metrics data, see [Storage analytics metrics](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

> [!NOTE]
> Storing, accessing, and downloading analytics data is also charged just like regular user data.

### Utilizing usage metrics to estimate costs

#### Capacity costs

The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'data'* shows the storage capacity consumed by user data. The latest entry in the capacity metrics table *$MetricsCapacityBlob* with the row key *'analytics'* shows the storage capacity consumed by the analytics logs.

This total capacity consumed by both user data and analytics logs (if enabled) can then be used to estimate the cost of storing data in the storage account. The same method can also be used for estimating storage costs in GPv1 storage accounts.

#### Transaction costs

The sum of *'TotalBillableRequests'*, across all entries for an API in the transaction metrics table indicates the total number of transactions for that particular API. *For example*, the total number of *'GetBlob'* transactions in a given period can be calculated by the sum of total billable requests for all entries with the row key *'user;GetBlob'*.

In order to estimate transaction costs for Blob storage accounts, you need to break down the transactions into three groups since they are priced differently.

* Write transactions such as *'PutBlob'*, *'PutBlock'*, *'PutBlockList'*, *'AppendBlock'*, *'ListBlobs'*, *'ListContainers'*, *'CreateContainer'*, *'SnapshotBlob'*, and *'CopyBlob'*.
* Delete transactions such as *'DeleteBlob'* and *'DeleteContainer'*.
* All other transactions.

In order to estimate transaction costs for GPv1 storage accounts, you need to aggregate all transactions irrespective of the operation/API.

#### Data access and geo-replication data transfer costs

While storage analytics does not provide the amount of data read from and written to a storage account, it can be roughly estimated by looking at the transaction metrics table. The sum of *'TotalIngress'* across all entries for an API in the transaction metrics table indicates the total amount of ingress data in bytes for that particular API. Similarly the sum of *'TotalEgress'* indicates the total amount of egress data, in bytes.

In order to estimate the data access costs for Blob storage accounts, you need to break down the transactions into two groups.

* The amount of data retrieved from the storage account can be estimated by looking at the sum of *'TotalEgress'* for primarily the *'GetBlob'* and *'CopyBlob'* operations.

* The amount of data written to the storage account can be estimated by looking at the sum of *'TotalIngress'* for primarily the *'PutBlob'*, *'PutBlock'*, *'CopyBlob'* and *'AppendBlock'* operations.

The cost of geo-replication data transfer for Blob storage accounts can also be calculated by using the estimate for the amount of data written when using a GRS or RA-GRS storage account.

> [!NOTE]
> For a more detailed example about calculating the costs for using the hot or cool storage access tier, take a look at the FAQ titled *'What are Hot and Cool access tiers and how should I determine which one to use?'* in the [Azure Storage Pricing Page](https://azure.microsoft.com/pricing/details/storage/).

## Next steps

* [Create a storage account](storage-account-create.md)
