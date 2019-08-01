---
title: Using Azure PowerShell with Azure Storage | Microsoft Docs
description: Learn how to use the Azure PowerShell cmdlets for Azure Storage.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/16/2018
ms.author: tamram
ms.subservice: common
---

# Using Azure PowerShell with Azure Storage

Azure PowerShell is used to create and manage Azure resources from the PowerShell command line or in scripts. For Azure Storage, these cmdlets fall into two categories -- the control plane and the data plane. The control plane cmdlets are used to manage the storage account -- to create storage accounts, set properties, delete storage accounts, rotate the access keys, and so on. The data plane cmdlets are used to manage the data stored *in* the storage account. For example, uploading blobs, creating file shares, and adding messages to a queue.

This how-to article covers common operations using the management plane cmdlets to manage storage accounts. You learn how to:

> [!div class="checklist"]
> * List storage accounts
> * Get a reference to an existing storage account
> * Create a storage account
> * Set storage account properties
> * Retrieve and regenerate the access keys
> * Protect access to your storage account
> * Enable Storage Analytics

This article provides links to several other PowerShell articles for Storage, such as how to enable and access the Storage Analytics, how to use the data plane cmdlets, and how to access the Azure independent clouds such as China Cloud, German Cloud, and Government Cloud.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This exercise requires the Azure PowerShell module Az version 0.7 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

For this exercise, you can type the commands into a regular PowerShell window, or you can use the [Windows PowerShell Integrated Scripting Environment (ISE)](/powershell/scripting/getting-started/fundamental/windows-powershell-integrated-scripting-environment--ise-) and type the commands into an editor, then test one or more commands at a time as you go through the examples. You can highlight the rows you want to execute and click Run Selected to just run those commands.

For more information about storage accounts, see [Introduction to Storage](storage-introduction.md) and [About Azure storage accounts](storage-create-storage-account.md).

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

## List the storage accounts in the subscription

Run the [Get-AzStorageAccount](/powershell/module/az.storage/Get-azStorageAccount) cmdlet to retrieve the list of storage accounts in the current subscription.

```powershell
Get-AzStorageAccount | Select StorageAccountName, Location
```

## Get a reference to a storage account

Next, you need a reference to a storage account. You can either create a new storage account or get a reference to an existing storage account. The following section shows both methods.

### Use an existing storage account

To retrieve an existing storage account, you need the name of the resource group and the name of the storage account. Set the variables for those two fields, then use the [Get-AzStorageAccount](/powershell/module/az.storage/Get-azStorageAccount) cmdlet.

```powershell
$resourceGroup = "myexistingresourcegroup"
$storageAccountName = "myexistingstorageaccount"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName
```

Now you have $storageAccount, which points to an existing storage account.

### Create a storage account

The following script shows how to create a general-purpose storage account using [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount). After you create the account, retrieve its context, which can be used in subsequent commands rather than specifying the authentication with each call.

```powershell
# Get list of locations and select one.
Get-AzLocation | select Location
$location = "eastus"

# Create a new resource group.
$resourceGroup = "teststoragerg"
New-AzResourceGroup -Name $resourceGroup -Location $location

# Set the name of the storage account and the SKU name.
$storageAccountName = "testpshstorage"
$skuName = "Standard_LRS"

# Create the storage account.
$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName $skuName

# Retrieve the context.
$ctx = $storageAccount.Context
```

The script uses the following PowerShell cmdlets:

*   [Get-AzLocation](/powershell/module/az.resources/get-azlocation) -- retrieves a list of the valid locations. The example uses `eastus` for location.

*   [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) -- creates a new resource group. A resource group is a logical container into which your Azure resources are deployed and managed. Ours is called `teststoragerg`.

*   [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) -- creates the storage account. The example uses `testpshstorage`.

The SKU name indicates the type of replication for the storage account, such as LRS (Locally Redundant Storage). For more information about replication, see [Azure Storage Replication](storage-redundancy.md).

> [!IMPORTANT]
> The name of your storage account must be unique within Azure and must be lowercase. For naming conventions and restrictions, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).
>

Now you have a new storage account and a reference to it.

## Manage the storage account

Now that you have a reference to a new storage account or an existing storage account, the following section shows some of the commands you can use to manage your storage account.

### Storage account properties

To change the settings for a storage account, use [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount). While you can't change the location of a storage account, or the resource group in which it resides, you can change many of the other properties. The following lists some of the properties you can change using PowerShell.

* The **custom domain** assigned to the storage account.

* The **tags** assigned to the storage account. Tags are often used to categorize resources for billing purposes.

* The **SKU** is the replication setting for the storage account, such as LRS for Locally Redundant Storage. For example, you might change from Standard\_LRS to Standard\_GRS or Standard\_RAGRS. Note that you can't change Standard\_ZRS or Premium\_LRS to other SKUs, or change other SKUs to these.

* The **access tier** for Blob storage accounts. The value for access tier is set to **hot** or **cool**, and allows you to minimize your cost by selecting the access tier that aligns with how you use the storage account. For more information, see [Hot, cool, and archive storage tiers](../blobs/storage-blob-storage-tiers.md).

* Only allow HTTPS traffic.

### Manage the access keys

An Azure Storage account comes with two account keys. To retrieve the keys, use [Get-AzStorageAccountKey](/powershell/module/az.Storage/Get-azStorageAccountKey). This example retrieves the first key. To retrieve the other one, use `Value[1]` instead of `Value[0]`.

```powershell
$storageAccountKey = `
    (Get-AzStorageAccountKey `
    -ResourceGroupName $resourceGroup `
    -Name $storageAccountName).Value[0]
```

To regenerate the key, use [New-AzStorageAccountKey](/powershell/module/az.Storage/New-azStorageAccountKey).

```powershell
New-AzStorageAccountKey -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -KeyName key1
```

To regenerate the other key, use `key2` as the key  name instead of `key1`.

Regenerate one of your keys and then retrieve it again to see the new value.

> [!NOTE]
> You should perform careful planning before regenerating the key for a production storage account. Regenerating one or both keys will invalidate the access for any application using the key that was regenerated. For more information, see [Access keys](storage-account-manage.md#access-keys).


### Delete a storage account

To delete a storage account, use [Remove-AzStorageAccount](/powershell/module/az.storage/Remove-azStorageAccount).

```powershell
Remove-AzStorageAccount -ResourceGroup $resourceGroup -AccountName $storageAccountName
```

> [!IMPORTANT]
> When you delete a storage account, all of the assets stored in the account are deleted as well. If you delete an account accidentally, call Support immediately and open a ticket to restore the storage account. Recovery of your data is not guaranteed, but it does sometimes work. Do not create a new storage account with the same name as the old one until the support ticket has been resolved.
>

### Protect your storage account using VNets and firewalls

By default, all storage accounts are accessible by any network that has access to the internet. However, you can configure network rules to only allow applications from specific virtual networks to access a storage account. For more information, see [Configure Azure Storage Firewalls and Virtual Networks](storage-network-security.md).

The article shows how to manage these settings using the following PowerShell cmdlets:
* [Add-AzStorageAccountNetworkRule](/powershell/module/az.Storage/Add-azStorageAccountNetworkRule)
* [Update-AzStorageAccountNetworkRuleSet](/powershell/module/az.storage/update-azstorageaccountnetworkruleset)
* [Remove-AzStorageAccountNetworkRule](https://docs.microsoft.com/powershell/module/az.storage/remove-azstorageaccountnetworkrule)

## Use storage analytics  

[Azure Storage Analytics](storage-analytics.md) consists of [Storage Analytics Metrics](/rest/api/storageservices/about-storage-analytics-metrics) and [Storage Analytics Logging](/rest/api/storageservices/about-storage-analytics-logging).

**Storage Analytics Metrics** is used to collect metrics for your Azure storage accounts that you can use to monitor the health of a storage account. Metrics can be enabled for blobs, files, tables, and queues.

**Storage Analytics Logging** happens server-side and enables you to record details for both successful and failed requests to your storage account. These logs enable you to see details of read, write, and delete operations against your tables, queues, and blobs as well as the reasons for failed requests. Logging is not available for Azure Files.

You can configure monitoring using the [Azure portal](https://portal.azure.com), PowerShell, or programmatically using the storage client library.

> [!NOTE]
> You can enable minute analytics using PowerShell. This capability is not available in the portal.
>

* To learn how to enable and view Storage Metrics data using PowerShell, see [Storage analytics metrics](storage-analytics-metrics.md).

* To learn how to enable and retrieve Storage Logging data using PowerShell, see [How to enable Storage Logging using PowerShell](/rest/api/storageservices/Enabling-Storage-Logging-and-Accessing-Log-Data) and [Finding your Storage Logging log data](/rest/api/storageservices/Enabling-Storage-Logging-and-Accessing-Log-Data).

* For detailed information on using Storage Metrics and Storage Logging to troubleshoot storage issues, see [Monitoring, Diagnosing, and Troubleshooting Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md).

## Manage the data in the storage account

Now that you understand how to manage your storage account with PowerShell, you can use the following articles to learn how to access the data objects in the storage account.

* [How to manage blobs with PowerShell](../blobs/storage-how-to-use-blobs-powershell.md)
* [How to manage files with PowerShell](../files/storage-how-to-use-files-powershell.md)
* [How to manage queues with PowerShell](../queues/storage-powershell-how-to-use-queues.md)
* [Perform Azure Table storage operations with PowerShell](../../storage/tables/table-storage-how-to-use-powershell.md)

Azure Cosmos DB Table API provides premium features for table storage such as turnkey global distribution, low latency reads and writes, automatic secondary indexing, and dedicated throughput.

* For more information, see [Azure Cosmos DB Table API](../../cosmos-db/table-introduction.md).

## Independent cloud deployments of Azure

Most people use Azure Public Cloud for their global Azure deployment. There are also some independent deployments of Microsoft Azure for reasons of sovereignty and so on. These independent deployments are referred to as "environments." These are the available environments:

* [Azure Government Cloud](https://azure.microsoft.com/features/gov/)
* [Azure China 21Vianet Cloud operated by 21Vianet in China](http://www.windowsazure.cn/)
* [Azure German Cloud](../../germany/germany-welcome.md)

For information about how to access these clouds and their storage with PowerShell, please see [Managing Storage in the Azure independent clouds using PowerShell](storage-powershell-independent-clouds.md).

## Clean up resources

If you created a new resource group and a storage account for this exercise, yous can remove all of the assets you created by removing the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account created and the resource group itself.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```
## Next steps

This how-to article covers common operations using the management plane cmdlets to manage storage accounts. You learned how to:

> [!div class="checklist"]
> * List storage accounts
> * Get a reference to an existing storage account
> * Create a storage account
> * Set storage account properties
> * Retrieve and regenerate the access keys
> * Protect access to your storage account
> * Enable Storage Analytics

This article also provided references to several other articles, such as how to manage the data objects, how to enable the Storage Analytics, and how to access the Azure independent clouds such as China Cloud, German Cloud, and Government Cloud. Here are some more related articles and resources for reference:

* [Azure Storage control plane PowerShell cmdlets](/powershell/module/az.storage/)
* [Azure Storage data plane PowerShell cmdlets](/powershell/module/azure.storage/)
* [Windows PowerShell Reference](https://msdn.microsoft.com/library/ms714469.aspx)
