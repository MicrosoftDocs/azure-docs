---
title: Configure minimum required version of Transport Layer Security (TLS) for a storage account
titleSuffix: Azure Storage
description: Configure a storage account to require a minimum version of Transport Layer Security (TLS) for clients making requests against Azure Storage.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/22/2020
ms.author: tamram
ms.reviewer: fryu
ms.subservice: common
---

# Configure minimum required version of Transport Layer Security (TLS) for a storage account

Communication between a client application and an Azure Storage account is encrypted using Transport Layer Security (TLS). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet. For more information about TLS, see [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security).

Azure Storage currently supports three versions of the TLS protocol: 1.0, 1.1, and 1.2. TLS 1.2 is the most secure version of TLS. Azure Storage uses TLS 1.2 on public HTTPs endpoints, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

By default, Azure Storage accounts permit clients to send and receive data with the oldest version of TLS, TLS 1.0. To enforce stricter security measures, you can configure your storage account to require that clients send and receive data with a newer version of TLS. For information about how to configure the minimum version of TLS required by your Azure Storage account, see [Configure Transport Layer Security (TLS) for a storage account](transport-layer-security-configure.md).

This article describes how to enforce a minimum version of TLS for an Azure Storage account. For information about how to specify a particular version of TLS in a client application, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

## Detect the TLS version used by client applications

When you enforce a minimum TLS version for your storage account, you risk rejecting requests from clients that are sending data with an earlier version of TLS. To understand how configuring the minimum TLS version may affect client applications, Microsoft recommends that you enable logging for your Azure Storage account and analyze the logs after an interval of time to determine what versions of TLS client applications are using.

To log requests to your Azure Storage account and determine the TLS version used by the client, you can use Azure Storage logging in Azure Monitor (preview). For more information, see [Monitor Azure Storage](monitor-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/log-query/get-started-portal.md).

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Enroll in the [Azure Storage logging in Azure Monitor preview](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxW65f1VQyNCuBHMIMBV8qlUM0E0MFdPRFpOVTRYVklDSE1WUTcyTVAwOC4u).
1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/learn/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings (preview)**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **Blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose which types of requests to log. For example, choosing **StorageRead** and **StorageWrite** will log read and write requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/transport-layer-security-configure/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md). After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting.

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs (preview)](common/monitor-storage-reference.md#resource-logs-preview).

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

## Check the minimum required TLS version for an account

To determine the minimum required TLS version that is configured for a storage account, check the Azure Resource Manager **minimumTlsVersion** property. To check this property for a large number storage accounts at once, use the Azure Resource Graph Explorer.

### Check the minimum required TLS version for a single storage account

To check the minimum required TLS version for a single storage account using Azure CLI, call the **az resource show** command and query for the **minimumTlsVersion** property:

```azurecli-interactive
az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.minimumTlsVersion \
    --output tsv
```

### Check the minimum required TLS version for a set of storage accounts

To check the minimum required TLS version across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the minimum TLS version for each account:

```msgraph-interactive
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend minimumTlsVersion = parse_json(properties).minimumTlsVersion
| project subscriptionId, resourceGroup, name, minimumTlsVersion
```

---

## Test the minimum TLS version from a client

To test that the minimum required TLS version for a storage account forbids calls made with an earlier version, you can configure a client to use an earlier version of TLS. For more information, see [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md).

When a client accesses a storage account using a TLS version that does not meet the minimum TLS version configured for the account, Azure Storage returns error code 400 error (Not Found) and a message indicating that the TLS version that was used is not permitted on this storage account.

## Next steps

- [Configure Transport Layer Security (TLS) for a client application](transport-layer-security-configure-client-version.md)
- [Security recommendations for Blob storage](../blobs/security-recommendations.md)
