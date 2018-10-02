---
title: Upgrade to a general-purpose v2 storage account - Azure Storage | Microsoft Docs
description: Upgrade to general-purpose v2 storage accounts.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 09/11/2018
ms.author: tamram  
---

# Upgrade to a general-purpose v2 storage account

General-purpose v2 storage accounts support the latest Azure Storage features and incorporate all of the functionality of general-purpose v1 and Blob storage accounts. General-purpose v2 accounts are recommended for most storage scenarios. General-purpose v2 accounts deliver the lowest per-gigabyte capacity prices for Azure Storage, as well as industry-competitive transaction prices.

Upgrading to a general-purpose v2 storage account from your general-purpose v1 or Blob storage accounts is simple. You can upgrade using the Azure portal, PowerShell, or Azure CLI. Upgrading an account cannot be reversed and may result in billing charges.

## Upgrade using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your storage account.
3. In the **Settings** section, click **Configuration**.
4. Under **Account kind**, click on **Upgrade**.
5. Under **Confirm upgrade**, type in the name of your account. 
6. Click **Upgrade** at the bottom of the blade.

## Upgrade with PowerShell

To upgrade a general-purpose v1 account to a general-purpose v2 account using PowerShell, first update PowerShell to use the latest version of the **AzureRm.Storage** module. See [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) for information about installing PowerShell. 

Next, call the following command to upgrade the account, substituting the name of your resource group and storage account:

```powershell
Set-AzureRmStorageAccount -ResourceGroupName <resource-group> -AccountName <storage-account> -UpgradeToStorageV2
```

## Upgrade with Azure CLI

To upgrade a general-purpose v1 account to a general-purpose v2 account using Azure CLI, first install the latest version of Azure CLI. See [Install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) for information about installing the CLI. 

Next, call the following command to upgrade the account, substituting the name of your resource group and storage account:

```cli
az storage account update -g <resource-group> -n <storage-account> --set kind=StorageV2
``` 

## Specify an access tier for blob data

General-purpose v2 accounts support all Azure storage services and data objects, but access tiers are available only for block blobs in Blob storage. When you upgrade to a general-purpose v2 storage account, you can specify an access tier for your blob data. 

Access tiers enable you to choose the most cost-effective storage based on your anticipated usage patterns. Block blobs can be stored in a hot, cool, or archive tier. For more information on access tiers, see [Azure Blob storage: Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

By default, a new storage account is created in the hot access tier, and a general-purpose v1 storage account is upgraded to the hot access tier. If you are exploring which access tier to use for your data post-upgrade, consider your scenario. There are two typical user scenarios for migrating to a general-purpose v2 account:

* You have an existing general-purpose v1 storage account and want to evaluate a change to a general-purpose v2 storage account, with the right storage tier for blob data.
* You have decided to use a general-purpose v2 storage account or already have one and want to evaluate whether you should use the hot or cool storage tier for blob data.

In both cases, the first priority is to estimate the cost of storing, accessing, and operating on your data stored in a general-purpose v2 storage account and compare that against your current costs.

### Estimate costs for your current usage patterns

To estimate the cost of storing and accessing blob data in a general-purpose v2 storage account in a particular tier, evaluate your existing usage pattern or approximate your expected usage pattern. In general, you want to know:

* Your Blob storage consumption, in gigabytes, including:
    - How much data is being stored in the storage account?
    - How does the data volume change on a monthly basis; does new data constantly replace old data?
* The primary access pattern for your Blob storage data, including:
    - How much data is being read from and written to the storage account? 
    - How many read operations versus write operations occur on the data in the storage account?

To decide on the best access tier for your needs, it can be helpful to determine how much capacity your blob data is currently using, and how that data is being used. 

To gather usage data for your storage account prior to migration, you can monitor the storage account using [Azure Monitor](../../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md). Azure Monitor performs logging and provides metrics data for Azure services, including Azure Storage. 

To monitor consumption data for blobs in your storage account, enable capacity metrics in Azure Monitor. Capacity metrics record data about how much storage the blobs in your account are using on a daily basis. Capacity metrics can be used to estimate the cost of storing data in the storage account. To learn how Blob storage capacity is priced for each type of account, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

To monitor data access patterns for Blob storage, enable transaction metrics in Azure Monitor. You can filter on different Azure Storage operations to estimate how frequently each is called. To learn how different types of transactions are priced for block and append blobs for each type of account, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).  

For more information about gathering metrics from Azure Monitor, see [Azure Storage metrics in Azure Monitor](storage-metrics-in-azure-monitor.md).

## Next steps

- [Create a storage account](storage-quickstart-create-account.md)
- [Manage Azure storage accounts](storage-account-manage.md)