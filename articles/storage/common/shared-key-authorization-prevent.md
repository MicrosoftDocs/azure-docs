---
title: Prevent authorization with Shared Key (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/10/2020
ms.author: tamram
ms.reviewer: fryu
---

# Prevent Shared Key authorization for an Azure Storage account (preview)

Every request for data in an Azure Storage account must be authorized, with the exception of anonymous requests when public access is permitted for a container. Requests can be authorized with either Azure Active Directory (Azure AD) or Shared Key authorization. Microsoft recommends using Azure AD to authorize requests to blob and queue data for superior security and ease of use. For more information about using Azure AD, see [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md).

By default, a storage account permits access to blob and queue data via either Shared Key or Azure AD authorization. To require clients to use Azure AD to authorize requests, you can disallow access requests to the storage account that are authorized with Shared Key (preview). Microsoft recommends that you disallow Shared Key authorization to storage accounts containing blob and queue data to help prevent data breaches.

When you disallow Shared Key authorization for a storage account, Azure Storage rejects all subsequent requests to that account that are authorized with Shared Key. Only secured requests that are authorized with Azure AD will succeed.

This article describes how to use a DRAG (Detection-Remediation-Audit-Governance) framework to control Shared Key authorization for your storage accounts.

## About the preview

Disallowing Shared Key authorization is supported for storage accounts that use the Azure Resource Manager deployment model only.

The preview includes the following limitations:

???

> [!IMPORTANT]
> This preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

## Detect the type of authorization used by client applications

When you disallow Shared Key authorization for a storage account, requests from clients that are using Shared Key authorization will fail. To understand how disallowing Shared Key authorization may affect client applications, Microsoft recommends that you enable logging and metrics for that account and analyze requests over a period of time to determine how requests to your account are being authorized.

Use metrics to determine how many requests the storage account is receiving that are authorized with Shared Key or a SAS. Use logs to determine which containers are being accessed anonymously.

### Monitor how many requests are authorized with Shared Key

To track how requests to a storage account are being authorized, use Azure Metrics Explorer in the Azure portal. For more information about Metrics Explorer, see [Getting started with Azure Metrics Explorer](../../azure-monitor/platform/metrics-getting-started.md).

Follow these steps to create a metric that tracks anonymous requests:

1. Navigate to your storage account in the Azure portal. Under the **Monitoring** section, select **Metrics**.
1. Select **Add metric**. In the **Metric** dialog, specify the following values:
    1. Leave the **Scope** field set to the name of the storage account.
    1. Set the **Metric Namespace** to *Account*. This metric will report on all requests against the storage account.
    1. Set the **Metric** field to *Transactions*.
    1. Set the **Aggregation** field to *Sum*.

    The new metric will display the sum of the number of transactions against the storage account over a given interval of time. The resulting metric appears as shown in the following image:

    :::image type="content" source="media/shared-key-authorization-prevent/configure-metric-account-transactions.png" alt-text="Screenshot showing how to configure metric to sum transactions made with Shared Key or SAS":::

1. Next, select the **Add filter** button to create a filter on the metric for anonymous requests.
1. In the **Filter** dialog, specify the following values:
    1. Set the **Property** value to *Authentication*.
    1. Set the **Operator** field to the equal sign (=).
    1. Set the **Values** field to *Account Key* and *SAS*.
1. In the upper-right corner, select the time interval over which you want to view the metric. You can also indicate how granular the aggregation of requests should be, by specifying intervals anywhere from 1 minute to 1 month.

After you have configured the metric, requests to your storage account will begin to appear on the graph. The following image shows requests that were authorized with Shared Key and requests made with a SAS token that was signed with Shared Key. Requests are aggregated over the past thirty minutes.

:::image type="content" source="media/shared-key-authorization-prevent/metric-shared-key-requests.png" alt-text="Screenshot showing aggregated requests authorized with Shared Key":::

You can also configure an alert rule to notify you when a certain number of requests that are authorized with Shared Key are made against your storage account. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

> [!IMPORTANT]
> For the preview, the **SAS** filter in Azure Metrics Explorer does not distinguish between different types of shared access signatures. A service SAS token or an account SAS token is authorized with Shared Key and will not be permitted on a request when the **AllowSharedKeyAccess** property is set to **false**. A user delegation SAS is authorized with Azure AD and will be permitted on a request when the **AllowSharedKeyAccess** property is set to **false**. The **SAS** filter in Azure Metrics Explorer reports requests that are authorized with any type of SAS.

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
1. Select the Azure Storage service for which you want to log requests. For example, choose **Blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose which types of requests to log. You can log read, write, and delete requests. To analyze log data for Shared Key access, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/shared-key-authorization-prevent/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs (preview)](../common/monitor-storage-reference.md#resource-logs-preview).

#### Query logs for requests made with Shared Key or SAS

Azure Storage logs in Azure Monitor include the type of authorization that was used to make a request to a storage account. To retrieve logs for requests made in the last 7 days that were authorized with Shared Key or SAS, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. This query displays the top 10 IP addresses that most frequently sent requests authorized with Shared Key or SAS:

```kusto
StorageBlobLogs
| where AuthenticationType in ("AccountKey", "SAS") and TimeGenerated > ago(7d)
| summarize count() by CallerIpAddress, UserAgentHeader
| top 10 by count_ desc
```

You can also configure an alert rule based on this query to notify you about requests authorized with Shared Key or SAS. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/platform/alerts-log.md).

## Remediate authorization via Shared Key

After you have analyzed how requests to your storage account are being authorized, you can take action to prevent access via Shared Key. But first, you need to update any applications that are using Shared Key authorization to use Azure AD instead. You can monitor logs and metrics as described in [Detect the type of authorization used by client applications](#detect-the-type-of-authorization-used-by-client-applications) to track the transition. For more information about using Azure AD with blob and queue data, see [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md).

> [!IMPORTANT]
> Azure Storage supports Azure AD authorization for requests to Blob and Queue storage only. Microsoft recommends that you migrate any Azure Files or Table storage data to a separate storage account before you disallow access to the account via Shared Key.

When you are confident that you can safely prevent Shared Key authorization to your storage account, you can take action to prevent access via Shared Key by setting the **AllowSharedKeyAccess** property for the account to **false**.

The following example shows how to set the **AllowSharedKeyAccess** property with Azure CLI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
$storage_account_id=$(az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query id \
    --output tsv)

az resource update \
    --ids $storage_account_id \
    --set properties.allowSharedKeyAccess=false

az resource show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --resource-type Microsoft.Storage/storageAccounts \
    --query properties.allowSharedKeyAccess \
    --output tsv
```

After you disallow Shared Key authorization, making a requests to the storage account with Shared Key authorization will fail with error code 403 (Forbidden).

> [!NOTE]
> Anonymous requests are not authorized and will succeed if you have configured the storage account and container for anonymous public read access. For more information, see [Configure anonymous public read access for containers and blobs](../blobs/anonymous-read-access-configure.md).

### Verify that Shared Key access is not allowed

To verify that Shared Key authorization is no longer permitted, you can attempt to call a data operation with the account access key. The following example attempts to create a container using the access key. This call will fail when Shared Key authorization is disallowed for the storage account. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container create \
    --account-name <storage-account> \
    --name sample-container \
    --account-key <key>
    --auth-mode key
```

### Check the Shared Key access setting for multiple accounts

To check the Shared Key access setting across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the Shared Key access setting for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend allowSharedKeyAccess = parse_json(properties).allowSharedKeyAccess
| project subscriptionId, resourceGroup, name, allowSharedKeyAccess
```

## Understanding authorization for shared access signatures (SAS)

When a request includes a shared access signature (SAS) token, the result depends on how that SAS is authorized. When you create a SAS, you can authorize that SAS with either Shared Key or with Azure AD. The access key or credentials that you use to create a SAS are also used by Azure Storage to grant access to a client that possesses the SAS.

The following table shows how each type of SAS is authorized and how Azure Storage will handle that SAS when the **AllowSharedKeyAccess** property for the storage account is **false**.

| Type of SAS | Type of authorization | Behavior when AllowSharedKeyAccess is false |
|-|-|-|
| User delegation SAS | Azure AD | Request is permitted. Microsoft recommends using a user delegation SAS when possible for superior security. |
| Service SAS | Shared Key | Request is denied. |
| Account SAS | Shared Key | Request is denied. |

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

## Next steps

- [Authorizing access to data in Azure Storage](storage-auth.md)
- [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md)
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key)