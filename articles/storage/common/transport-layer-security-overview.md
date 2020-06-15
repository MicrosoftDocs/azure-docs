---
title: Overview of Transport Layer Security (TLS)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/12/2020
ms.author: tamram
ms.reviewer: fryu
ms.subservice: common
---

# Overview of Transport Layer Security (TLS) in Azure Storage

together with Azure Log Analytics./wiki/Transport_Layer_Security). TLS is a standard cryptographic protocol that ensures privacy and data integrity between clients and services over the Internet.

There are currently three versions of the TLS protocol: 1.0, 1.1, and 1.2. TLS 1.2 is the most secure version of TLS.

By default, Azure Storage accounts permit clients to send and receive data with the oldest version of TLS, TLS 1.0. To enforce stricter security measures, you can configure your storage account to require that clients send and receive data with a newer version of TLS. For information about how to configure the minimum version of TLS required by your Azure Storage account, see [Configure Transport Layer Security (TLS) for a storage account](transport-layer-security-configure.md).

Before you enforce a minimum TLS version for your storage account, 

## Understand how configuring the minimum TLS version affects requests



## Detect the TLS version used by client applications

When you enforce a minimum TLS version for your storage account, you risk rejecting requests from clients that are sending data with an earlier version of TLS. To understand how configuring the minimum TLS version may affect client applications, Microsoft recommends that you enable logging for your Azure Storage account and analyze the logs after an interval of time to determine what versions of TLS client applications are using.

To log requests to your Azure Storage account and determine the TLS version used by the client, you can use Azure Storage logging in Azure Monitor (preview) together with Azure Log Analytics. For more information, see [Monitor Azure Storage](monitor-storage.md).

To log Azure Storage data with Azure Monitor, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md). After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting.

???should we show how to do this for storage in portal at least - this configuration is confusing - and it's still in preview???

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use Azure Log Analytics. To get started with Log Analytics, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/log-query/get-started-portal.md).

### Query logged requests by TLS version

Azure Storage logs in Azure Monitor include the TLS version used to send a request to a storage account. Use the **TlsVersion** property to check the TLS version of a logged request.

To retrieve logs for the last 7 days and see how many requests were made against Blob storage with each version of TLS, create a new Log Analytics workspace. Next, paste the following query into a new log query and run the query. Remember to replace the placeholder values in brackets with your own values:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == "<account-name>"
| summarize count() by TlsVersion
```

The results show the count of the number of requests made with each version of TLS. In this case, all requests were made using TLS version 1.2:

:::image type="content" source="media/transport-layer-security-overview/log-analytics-query-results.png" alt-text="Screenshot showing results of log analytics query to return TLS version":::

### Query logged requests by caller IP address and user agent header

Azure Storage logs in Azure Monitor also include the caller IP address and user agent header to help you to evaluate which client applications accessed the storage account. You can analyze these values to decide whether a client applications must be updated to use a newer version of TLS, or whether it's acceptable to fail the client's requests if it does not meet the minimum TLS version.

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AccountName == “{storage account name}” and TlsVersion != "TLS 1.2"
| project TlsVersion, CallerIpAddress, UserAgentHeader
```


Storage logs also provide CallerIpAddress and UserAgentHeader to help you to evaluate what client applications access storage account. You can better judge whether you change TLS version in these client applications or if it’s fine to fail these requests with TLS version enforcement on storage accounts. The following is an example how to analyze client applications by querying logs in Log Analytics:

