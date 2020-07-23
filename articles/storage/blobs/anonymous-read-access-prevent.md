---
title: Prevent anonymous public read access to containers and blobs
titleSuffix: Azure Storage
description: Learn how to analyze anonymous requests against a storage account and how to prevent anonymous access for the entire storage account or for an individual container.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/22/2020
ms.author: tamram
ms.reviewer: fryu
---

# Prevent anonymous public read access to containers and blobs

Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data, but may also present a security risk. It's important to manage anonymous access judiciously and to understand how to evaluate anonymous access to your data. Operational complexity, human error, or malicious attack against data that is publicly accessible can result in costly data breaches. Microsoft recommends that you enable anonymous access only when necessary for your application scenario.

By default, public access is disabled. A user with appropriate permissions can configure public access to containers and blobs in a storage account. For enhanced security, you can disallow all public access to storage account, regardless of the public access setting for an individual container. Microsoft recommends that you disallow public access to a storage account unless your scenario requires it. Disallowing public access helps to prevent data breaches caused by undesired anonymous access.

When you disallow public blob access for the storage account, Azure Storage rejects all anonymous requests to that account. After public access is disallowed for an account, containers in that account cannot be subsequently configured for public access. Any containers that have already been configured for public access will no longer accept anonymous requests. For more information, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md).

This article describes how to analyze anonymous requests against a storage account and how to prevent anonymous access for the entire storage account or for an individual container.

## Detect anonymous requests from client applications

When you disallow public read access for a storage account, you risk rejecting requests to containers and blobs that are currently configured for public access. Disallowing public access for a storage account overrides the public access settings for individual containers in that storage account. When public access is disallowed for the storage account, any future anonymous requests to that account will fail.

To understand how disallowing public access may affect client applications, Microsoft recommends that you enable logging and metrics for that account and analyze patterns of anonymous requests over an interval of time. Use metrics to determine the number of anonymous requests to the storage account, and use logs to determine which containers are being accessed anonymously.

### Monitor anonymous requests with Metrics Explorer

To track anonymous requests to a storage account, use Azure Metrics Explorer in the Azure portal. For more information about Metrics Explorer, see [Getting started with Azure Metrics Explorer](../../azure-monitor/platform/metrics-getting-started.md).

Follow these steps to create a metric that tracks anonymous requests:

1. Navigate to your storage account in the Azure portal. Under the **Monitoring** section, select **Metrics**.
1. Select **Add metric**. In the **Metric** dialog, specify the following values:
    1. Leave the Scope field set to the name of the storage account.
    1. Set the **Metric Namespace** to *Blob*. This metric will report requests against Blob storage only.
    1. Set the **Metric** field to *Transactions*.
    1. Set the **Aggregation** field to *Sum*.

    The new metric will display the sum of the number of transactions against Blob storage over a given interval of time. The resulting metric appears as shown in the following image:

    :::image type="content" source="media/anonymous-read-access-prevent/configure-metric-blob-transactions.png" alt-text="Screenshot showing how to configure metric to sum blob transactions":::

1. Next, select the **Add filter** button to create a filter on the metric for anonymous requests.
1. In the **Filter** dialog, specify the following values:
    1. Set the **Property** value to *Authentication*.
    1. Set the **Operator** field to the equal sign (=).
    1. Set the **Values** field to *Anonymous*.
1. In the upper-right corner, select the time interval over which you want to view the metric. You can also indicate how granular the aggregation of requests should be, by specifying intervals anywhere from 1 minute to 1 month.

After you have configured the metric, anonymous requests will begin to appear on the graph. The following image shows anonymous requests aggregated over the past thirty minutes.

:::image type="content" source="media/anonymous-read-access-prevent/metric-anonymous-blob-requests.png" alt-text="Screenshot showing aggregated anonymous requests against Blob storage":::

You can also configure an alert rule to notify you when a certain number of anonymous requests are made against your storage account. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

### Analyze logs to identify containers receiving anonymous requests

Azure Storage logs capture details about requests made against the storage account, including how a request was authorized. You can analyze the logs to determine which containers are receiving anonymous requests.

To log requests to your Azure Storage account in order to evaluate anonymous requests, you can use Azure Storage logging in Azure Monitor (preview). For more information, see [Monitor Azure Storage](../common/monitor-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/log-query/get-started-portal.md).

#### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Enroll in the [Azure Storage logging in Azure Monitor preview](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxW65f1VQyNCuBHMIMBV8qlUM0E0MFdPRFpOVTRYVklDSE1WUTcyTVAwOC4u).
1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/learn/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings (preview)**.
1. Select **Blob** to log requests made against Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose which types of requests to log. All anonymous requests will be read requests, so select **StorageRead** to capture anonymous requests.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/anonymous-read-access-prevent/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs (preview)](../common/monitor-storage-reference.md#resource-logs-preview).

#### Query logs for anonymous requests

Azure Storage logs in Azure Monitor include the type of authorization that was used to make a request to a storage account. In your log query, filter on the **AuthenticationType** property to view anonymous requests.

To retrieve logs for the last 7 days for anonymous requests against Blob storage, open your Log Analytics workspace. Next, paste the following query into a new log query and run it:

```kusto
StorageBlobLogs
| where TimeGenerated > ago(7d) and AuthenticationType == "Anonymous"
| project TimeGenerated, AccountName, AuthenticationType, Uri
```

You can also configure an alert rule based on this query to notify you about anonymous requests. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/platform/alerts-log.md).

## Remediate anonymous public access

After you have evaluated anonymous requests to containers and blobs in your storage account, you can take action to limit or prevent public access. If some containers in your storage account may need to be available for public access, then you can configure the public access setting for each container in your storage account. This option provides the most granular control over public access. For more information, see [Set the public access level for a container](anonymous-read-access-configure.md#set-the-public-access-level-for-a-container).

For enhanced security, you can disallow public access for the whole storage account. The public access setting for a storage account overrides the individual settings for containers in that account. When you disallow public access for a storage account, any containers that are configured to permit public access are no longer accessible anonymously. For more information, see [Allow or disallow public read access for a storage account](anonymous-read-access-configure.md#allow-or-disallow-public-read-access-for-a-storage-account).

If your scenario requires that certain containers need to be available for public access, it may be advisable to move those containers and their blobs into storage accounts that are reserved for public access. You can then disallow public access for any other storage accounts.

### Verify that public access to a blob is not permitted

To verify that public access to a specific blob is disallowed, you can attempt to download the blob via its URL. If the download succeeds, then the blob is still publicly available. If the blob is not publicly accessible because public access has been disallowed for the storage account, then you will see an error message indicating that public access is not permitted on this storage account.

The following example shows how to use PowerShell to attempt to download a blob via its URL. Remember to replace the placeholder values in brackets with your own values:

```powershell
$url = "<absolute-url-to-blob>"
$downloadTo = "<file-path-for-download>"
Invoke-WebRequest -Uri $url -OutFile $downloadTo -ErrorAction Stop
```

### Verify that modifying the container's public access setting is not permitted

To verify that a container's public access setting cannot be modified after public access is disallowed for the storage account, you can attempt to modify the setting. Changing the container's public access setting will fail if public access is disallowed for the storage account.

The following example shows how to use PowerShell to attempt to change a container's public access setting. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container-name>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

Set-AzStorageContainerAcl -Context $ctx -Container $containerName -Permission Blob
```

### Verify that creating a container with public access enabled is not permitted

If public access is disallowed for the storage account, then you will not be able to create a new container with public access enabled. To verify, you can attempt to create a container with public access enabled.

The following example shows how to use PowerShell to attempt to create a container with public access enabled. Remember to replace the placeholder values in brackets with your own values:

```powershell
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container-name>"

$storageAccount = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName
$ctx = $storageAccount.Context

New-AzStorageContainer -Name $containerName -Permission Blob -Context $ctx
```

## Next steps

- [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md)
- [Access public containers and blobs anonymously with .NET](anonymous-read-access-client.md)
