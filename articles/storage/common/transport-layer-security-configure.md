---
title: Configure Transport Layer Security (TLS)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/22/2020
ms.author: tamram
ms.reviewer: fryu
ms.subservice: common
---

# Configure Transport Layer Security (TLS) for a storage account

Communication between a client application and an Azure Storage account is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security).

Azure Storage currently supports three versions of the TLS protocol: 1.0, 1.1, and 1.2. TLS 1.2 is the most secure version of TLS. Azure Storage uses TLS 1.2 on public HTTPs endpoints, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility. ???do we support requests made with TLS 1.3???

By default, Azure Storage accounts permit clients to send and receive data with the oldest version of TLS, TLS 1.0. To enforce stricter security measures, you can configure your storage account to require that clients send and receive data with a newer version of TLS. For information about how to configure the minimum version of TLS required by your Azure Storage account, see [Configure Transport Layer Security (TLS) for a storage account](transport-layer-security-configure.md).

This article describes how to enforce a minimum version of TLS for an Azure Storage account, and how to enable TLS in client application.

## Detect the TLS version used by client applications

When you enforce a minimum TLS version for your storage account, you risk rejecting requests from clients that are sending data with an earlier version of TLS. To understand how configuring the minimum TLS version may affect client applications, Microsoft recommends that you enable logging for your Azure Storage account and analyze the logs after an interval of time to determine what versions of TLS client applications are using.

To log requests to your Azure Storage account and determine the TLS version used by the client, you can use Azure Storage logging in Azure Monitor (preview) together with Azure Log Analytics. For more information, see [Monitor Azure Storage](monitor-storage.md).

To log Azure Storage data with Azure Monitor, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md). After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting.

???should we show how to do this for storage in portal at least - this configuration is confusing - and it's still in preview???

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use Azure Log Analytics. To get started with Log Analytics, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/log-query/get-started-portal.md).

### Query logged requests by TLS version

Azure Storage logs in Azure Monitor include the TLS version used to send a request to a storage account. Use the **TlsVersion** property to check the TLS version of a logged request.

To retrieve logs for the last 7 days and determine how many requests were made against Blob storage with each version of TLS, create a new Log Analytics workspace. Next, paste the following query into a new log query and run it. Remember to replace the placeholder values in brackets with your own values:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == "<account-name>"
| summarize count() by TlsVersion
```

The results show the count of the number of requests made with each version of TLS. In this case, all requests were made using TLS version 1.2:

:::image type="content" source="media/transport-layer-security-configure/log-analytics-query-version.png" alt-text="Screenshot showing results of log analytics query to return TLS version":::

### Query logged requests by caller IP address and user agent header

Azure Storage logs in Azure Monitor also include the caller IP address and user agent header to help you to evaluate which client applications accessed the storage account. You can analyze these values to decide whether a client applications must be updated to use a newer version of TLS, or whether it's acceptable to fail the client's requests if it does not meet the minimum TLS version.

To retrieve logs for the last 7 days and determine which clients made requests with a version of TLS prior to TLS 1.2, paste the following query into a new log query and run it. Remember to replace the placeholder values in brackets with your own values:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == "<account-name>" and TlsVersion != "TLS 1.2"
| project TlsVersion, CallerIpAddress, UserAgentHeader
```

## Configure the minimum TLS version for an account

To configure the minimum TLS version for a storage account using Azure CLI, first get the resource ID for your storage account by calling the [az resource show](/cli/azure/resource#az-resource-show) command. Next, call the [az resource update](/cli/azure/resource#az-resource-update) command to set the **minimumTlsVersion** property for the storage account. Valid values for **minimumTlsVersion** are `TLS1_0`, `TLS1_1` and `TLS1_2`.

The following example sets the minimum TLS version to 1.2. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
storage_account_id=$(az resource show \
  --name <storage-account> \
  --resource-group <resource-group> \
  --resource-type Microsoft.Storage/storageAccounts \
  --query id \
  --output tsv)

az resource update \
  --ids $storage_account_id \
  --set properties.minimumTlsVersion="TLS1_2"
```

> [!NOTE]
> After you update the minimum TLS version for the storage account, it may take up to 30 seconds before the change is fully propagated.

## Check the minimum TLS version for an account

To determine the minimum TLS version that is configured for a storage account, check the Azure Resource Manager **minimumTlsVersion** property ???will be available in both ARM and SRP? i'm a bit confused on relationship???. To check this property for a large number storage accounts at once, use the Azure Resource Graph Explorer. ???when SRP support is available, i will also note here that you can use List Storage Accounts for a small number of accounts???

### Check the minimum TLS version for a single storage account

To check the minimum TLS version for a single storage account using Azure CLI, call the **az resource show** command and query for the **minimumTlsVersion** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.minimumTlsVersion \
    --output tsv
```

### Check the minimum TLS version for a set of storage accounts

To check the minimum TLS version across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the minimum TLS version for each account:

```msgraph-interactive
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend minimumTlsVersion = parse_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

---

## Configure TLS 1.2 in a client

In order for a client to send a request with TLS 1.2, the operating system must support TLS 1.2. For more information, see [Support for TLS 1.2](/dotnet/framework/network-programming/tls#support-for-tls-12).

To configure a client application for TLS 1.2, ...

### PowerShell client

The following example assumes that the minimum TLS version for the storage account has been set to 1.2. When the PowerShell client is configured to use TLS 1.1, then calls to read and write data will fail.  

```powershell
# Set the TLS version used by the PowerShell client to TLS 1.1.
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls11;

# Attempt to create a new container.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context
New-AzStorageContainer -Name "sample-container" -Context $ctx
```

### .NET client

For the client to negotiate TLS 1.2, the OS and the .NET Framework version both need to support TLS 1.2. See more details in [Support for TLS 1.2](https://docs.microsoft.com/dotnet/framework/network-programming/tls#support-for-tls-12).

The following sample shows how to enable TLS 1.2 in your .NET client.

```csharp
static void EnableTls12()
{
    // Enable TLS 1.2 before connecting to Azure Storage
    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

    // Connect to Azure Storage
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName={yourstorageaccount};AccountKey={yourstorageaccountkey};EndpointSuffix=core.windows.net");
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    CloudBlobContainer container = blobClient.GetContainerReference("foo");
    container.CreateIfNotExists();
}
```

## Test the minimum TLS version from a client

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 error (Not Found) and a message indicating that the TLS version of the connection is not permitted on this storage account.

verify with fiddler



## Next steps

- [Security recommendations for Blob storage](../blobs/security-recommendations.md)
