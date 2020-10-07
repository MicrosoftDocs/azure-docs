---
title: Using customer-managed storage accounts in Azure Monitor Log Analytics
description: Use your own storage account for Log Analytics scenarios
ms.subservice: logs
ms.topic: conceptual
author: noakup
ms.author: noakuper
ms.date: 09/03/2020
---

# Using customer-managed storage accounts in Azure Monitor Log Analytics

Log Analytics relies on Azure Storage in a variety of scenarios. This use is typically managed automatically. However, some cases require you to provide and manage your own storage account, also referred to as a customer-managed storage account. This document details the usage of customer-managed storage for the ingestion of WAD/LAD logs, Private Link specific scenarios, and CMK encryption. 

> [!NOTE]
> We recommend that you don’t take a dependency on the contents Log Analytics uploads to customer-managed storage, given that formatting and content may change.

## Ingesting Azure Diagnostics extension logs (WAD/LAD)
The Azure Diagnostics extension agents (also called WAD and LAD for Windows and Linux agents respectively) collect various operating system logs and store them on a customer-managed storage account. You can then ingest these logs into Log Analytics to review and analyze them.
How to collect Azure Diagnostics extension logs from your storage account
Connect the storage account to your Log Analytics workspace as a storage data source using [the Azure portal](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostics-extension-logs#collect-logs-from-azure-storage) or by calling the [Storage Insights API](https://docs.microsoft.com/rest/api/loganalytics/connectedsources/storage%20insights/createorupdate).

Supported data types:
* Syslog
* Windows events
* Service Fabric
* ETW Events
* IIS Logs

## Using Private links
Customer managed storage accounts are required in some use cases, when private links are used to connect to Azure Monitor resources. One such case is the ingestion of Custom logs or IIS logs. These data types are first uploaded as blobs to an intermediary Azure Storage account and only then ingested to a workspace. Similarly, some Azure Monitor solutions may use storage accounts to store large files, such as Watson dump files, which are used by the Azure Security Center solution. 

##### Private Link scenarios that require a customer-managed storage
* Ingestion of Custom logs and IIS logs
* Allowing ASC solution to collect Watson dump files

### How to use a customer-managed storage account over a Private Link
##### Workspace requirements
When connecting to Azure Monitor over a private link, Log Analytics agents are only able to send logs to workspaces linked to your network over a private link. This rule requires that you properly configure an Azure Monitor Private Link Scope (AMPLS) object, connect it to your workspaces, and then connect the AMPLS to your network over a private link. For more information on the AMPLS configuration procedure, see [Use Azure Private Link to securely connect networks to Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/private-link-security). 
##### Storage account requirements
For the storage account to successfully connect to your private link, it must:
* Be located on your VNet or a peered network and connected to your VNet over a private link. This allows agents on your VNet to send logs to the storage account.
* Be located on the same region as the workspace it’s linked to.
* Allow Azure Monitor to access the storage account. If you chose to allow only select networks to access your storage account, you should also allow this exception: “allow trusted Microsoft services to access this storage account”. This allows Log Analytics to read the logs ingested to this storage account.
* If your workspace handles traffic from other networks as well, you should configure the storage account to allow incoming traffic coming from the relevant networks/internet.

##### Link your storage account to a Log Analytics workspace
You can link your storage account to the workspace via the [Azure CLI](https://docs.microsoft.com/cli/azure/monitor/log-analytics/workspace/linked-storage) or [REST API](https://docs.microsoft.com/rest/api/loganalytics/linkedstorageaccounts). 
Applicable dataSourceType values:
* CustomLogs – to use the storage for custom logs and IIS logs during ingestion.
* AzureWatson – use the storage for Watson dump files uploaded by the ASC (Azure Security Center) solution. 
For more information on managing retention, replacing a linked storage account, and monitoring your storage account activity, see [Managing linked storage accounts](#managing-linked-storage-accounts). 

## Encrypting data with CMK
Azure Storage encrypts all data at rest in a storage account. By default, it encrypts data with Microsoft-managed keys (MMK). However, Azure Storage will instead let you use a Customer-managed key (CMK) from Azure Key vault to encrypt your storage data. You can either import your own keys into Azure Key Vault, or you can use the Azure Key Vault APIs to generate keys.
##### CMK scenarios that require a customer-managed storage account
* Encrypting log-alert queries with CMK
* Encrypting saved queries with CMK

### How to apply CMK to customer-managed storage accounts
##### Storage account requirements
The storage account and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Storage encryption and key management, see [Azure Storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

##### Apply CMK to your storage accounts
To configure your Azure Storage account to use customer-managed keys with Azure Key Vault, use the [Azure portal](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal?toc=/azure/storage/blobs/toc.json), [PowerShell](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-powershell?toc=/azure/storage/blobs/toc.json) or the [CLI](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-cli?toc=/azure/storage/blobs/toc.json). 

## Managing linked storage accounts

To link or unlink storage accounts to your workspace use the [Azure CLI](https://docs.microsoft.com/cli/azure/monitor/log-analytics/workspace/linked-storage) or [REST API](https://docs.microsoft.com/rest/api/loganalytics/linkedstorageaccounts).

##### Create or modify a link
When you link a storage account to a workspace, Log Analytics will start using it instead of the storage account owned by the service. You can 
* Register multiple storage accounts to spread the load of logs between them
* Reuse the same storage account for multiple workspaces

##### Unlink a storage account
To stop using a storage account, unlink the storage from the workspace. 
Unlinking all storage accounts from a workspace means Log Analytics will attempt to rely on service-managed storage accounts. If your network has limited access to the internet, these storages may not be available and any scenario that relies on storage will fail.

##### Replace a storage account
To replace a storage account used for ingestion,
1.	**Create a link to a new storage account.** The logging agents will get the updated configuration and start sending data to the new storage as well. The process could take a few minutes.
2.	**Then unlink the old storage account so agents will stop writing to the removed account.** The ingestion process keeps reading data from this account until it’s all ingested. Don’t delete the storage account until you see all logs were ingested.

### Maintaining storage accounts
##### Manage log retention
When using your own storage account, retention is up to you. In other words, Log Analytics does not delete logs stored on your private storage. Instead, you should setup a policy to handle the load according to your preferences.

##### Consider load
Storage accounts can handle a certain load of read and write requests before they start throttling requests (see [Scalability and performance targets for Blob storage](https://docs.microsoft.com/azure/storage/common/scalability-targets-standard-account) for more details). Throttling affects the time it takes to ingest logs. If your storage account is overloaded, register an additional storage account to spread the load between them. To monitor your storage account’s capacity and performance review its [Insights in the Azure portal]( https://docs.microsoft.com/azure/azure-monitor/insights/storage-insights-overview).

### Related charges
Storage accounts are charged by the volume of stored data, the type of the storage, and the type of redundancy. For details see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs) and [Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables).


## Next steps

- Learn about [using Azure Private Link to securely connect networks to Azure Monitor](private-link-security.md)
- Learn about [Azure Monitor customer-managed keys](customer-managed-keys.md)
