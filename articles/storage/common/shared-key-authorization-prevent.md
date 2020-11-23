---
title: Prevent authorization with Shared Key (preview)
titleSuffix: Azure Storage
description: To require clients to use Azure AD to authorize requests, you can disallow requests to the storage account that are authorized with Shared Key (preview).
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/20/2020
ms.author: tamram
ms.reviewer: fryu
---

# Prevent Shared Key authorization for an Azure Storage account (preview)

Every secure request to an Azure Storage account must be authorized. By default, requests can be authorized with either Azure Active Directory (Azure AD) credentials, or by using the account access key for Shared Key authorization. Of these two types of authorization, Azure AD provides superior security and ease of use over Shared Key, and is recommended by Microsoft. To require clients to use Azure AD to authorize requests, you can disallow requests to the storage account that are authorized with Shared Key (preview).

When you disallow Shared Key authorization for a storage account, Azure Storage rejects all subsequent requests to that account that are authorized with the account access keys. Only secured requests that are authorized with Azure AD will succeed. For more information about using Azure AD, see [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md).

> [!WARNING]
> Azure Storage supports Azure AD authorization for requests to Blob and Queue storage only. If you disallow authorization with Shared Key for a storage account, requests to Azure Files or Table storage that use Shared Key authorization will fail.
>
> During the preview, requests to Azure Files or Table storage that use shared access signature (SAS) tokens that were generated using the account access keys will succeed when Shared Key authorization is disallowed. For more information, see [About the preview](#about-the-preview).
>
> Disallowing Shared Key access for a storage account does not affect SMB connections to Azure Files.
>
> Microsoft recommends that you either migrate any Azure Files or Table storage data to a separate storage account before you disallow access to the account via Shared Key, or that you do not apply this setting to storage accounts that support Azure Files or Table storage workloads.

This article describes how to detect requests sent with Shared Key authorization and how to remediate Shared Key authorization for your storage account. To learn how to register for the preview, see [About the preview](#about-the-preview).

## Detect the type of authorization used by client applications

When you disallow Shared Key authorization for a storage account, requests from clients that are using the account access keys for Shared Key authorization will fail. To understand how disallowing Shared Key authorization may affect client applications before you make this change, enable logging and metrics for the storage account. You can then analyze patterns of requests to your account over a period of time to determine how requests are being authorized.

Use metrics to determine how many requests the storage account is receiving that are authorized with Shared Key or a shared access signature (SAS). Use logs to determine which clients are sending those requests.

For more information about interpreting requests made with a shared access signature during the preview, see [About the preview](#about-the-preview).

### Monitor how many requests are authorized with Shared Key

To track how requests to a storage account are being authorized, use Azure Metrics Explorer in the Azure portal. For more information about Metrics Explorer, see [Getting started with Azure Metrics Explorer](../../azure-monitor/platform/metrics-getting-started.md).

Follow these steps to create a metric that tracks requests made with Shared Key or SAS:

1. Navigate to your storage account in the Azure portal. Under the **Monitoring** section, select **Metrics**.
1. Select **Add metric**. In the **Metric** dialog, specify the following values:
    1. Leave the **Scope** field set to the name of the storage account.
    1. Set the **Metric Namespace** to *Account*. This metric will report on all requests against the storage account.
    1. Set the **Metric** field to *Transactions*.
    1. Set the **Aggregation** field to *Sum*.

    The new metric will display the sum of the number of transactions against the storage account over a given interval of time. The resulting metric appears as shown in the following image:

    :::image type="content" source="media/shared-key-authorization-prevent/configure-metric-account-transactions.png" alt-text="Screenshot showing how to configure metric to sum transactions made with Shared Key or SAS":::

1. Next, select the **Add filter** button to create a filter on the metric for type of authorization.
1. In the **Filter** dialog, specify the following values:
    1. Set the **Property** value to *Authentication*.
    1. Set the **Operator** field to the equal sign (=).
    1. In the **Values** field, select *Account Key* and *SAS*.
1. In the upper-right corner, select the time range for which you want to view the metric. You can also indicate how granular the aggregation of requests should be, by specifying intervals anywhere from 1 minute to 1 month. For example, set the **Time range** to 30 days and the **Time granularity** to 1 day to see requests aggregated by day over the past 30 days.

After you have configured the metric, requests to your storage account will begin to appear on the graph. The following image shows requests that were authorized with Shared Key or made with a SAS token. Requests are aggregated per day over the past thirty days.

:::image type="content" source="media/shared-key-authorization-prevent/metric-shared-key-requests.png" alt-text="Screenshot showing aggregated requests authorized with Shared Key":::

You can also configure an alert rule to notify you when a certain number of requests that are authorized with Shared Key are made against your storage account. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).

### Analyze logs to identify clients that are authorizing requests with Shared Key or SAS

Azure Storage logs capture details about requests made against the storage account, including how a request was authorized. You can analyze the logs to determine which clients are authorizing requests with Shared Key or a SAS token.

To log requests to your Azure Storage account in order to evaluate how they are authorized, you can use Azure Storage logging in Azure Monitor (preview). For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md).

Azure Storage logging in Azure Monitor supports using log queries to analyze log data. To query logs, you can use an Azure Log Analytics workspace. To learn more about log queries, see [Tutorial: Get started with Log Analytics queries](../../azure-monitor/log-query/get-started-portal.md).

#### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Enroll in the [Azure Storage logging in Azure Monitor preview](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxW65f1VQyNCuBHMIMBV8qlUM0E0MFdPRFpOVTRYVklDSE1WUTcyTVAwOC4u).
1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account, or use an existing Log Analytics workspace. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/learn/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings (preview)**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **Blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media/shared-key-authorization-prevent/create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests":::

You can create a diagnostic setting for each type of Azure Storage resource in your storage account.

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/platform/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs (preview)](../blobs/monitor-blob-storage-reference.md#resource-logs-preview).

#### Query logs for requests made with Shared Key or SAS

Azure Storage logs in Azure Monitor include the type of authorization that was used to make a request to a storage account. To retrieve logs for requests made in the last seven days that were authorized with Shared Key or SAS, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. This query displays the ten IP addresses that most frequently sent requests that were authorized with Shared Key or SAS:

```kusto
StorageBlobLogs
| where AuthenticationType in ("AccountKey", "SAS") and TimeGenerated > ago(7d)
| summarize count() by CallerIpAddress, UserAgentHeader, AccountName
| top 10 by count_ desc
```

You can also configure an alert rule based on this query to notify you about requests authorized with Shared Key or SAS. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/platform/alerts-log.md).

## Remediate authorization via Shared Key

After you have analyzed how requests to your storage account are being authorized, you can take action to prevent access via Shared Key. But first, you need to update any applications that are using Shared Key authorization to use Azure AD instead. You can monitor logs and metrics as described in [Detect the type of authorization used by client applications](#detect-the-type-of-authorization-used-by-client-applications) to track the transition. For more information about using Azure AD with blob and queue data, see [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md).

When you are confident that you can safely reject requests that are authorized with Shared Key, you can set the **AllowSharedKeyAccess** property for the storage account to **false**.

The **AllowSharedKeyAccess** property is not set by default and does not return a value until you explicitly set it. The storage account permits requests that are authorized with Shared Key when the property value is **null** or when it is **true**.

> [!WARNING]
> If any clients are currently accessing data in your storage account with Shared Key, then Microsoft recommends that you migrate those clients to Azure AD before disallowing Shared Key access to the storage account.

# [Azure portal](#tab/portal)

To disallow Shared Key authorization for a storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Locate the **Configuration** setting under **Settings**.
1. Set **Allow shared key access** to **Disabled**.

    :::image type="content" source="media/shared-key-authorization-prevent/shared-key-access-portal.png" alt-text="Screenshot showing how to disallow Shared Key access for account":::

# [Azure CLI](#tab/azure-cli)

To disallow Shared Key authorization for a storage account with Azure CLI, install Azure CLI version 2.9.1 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowSharedKeyAccess** property for a new or existing storage account.

The following example shows how to set the **allowSharedKeyAccess** property with Azure CLI. Remember to replace the placeholder values in brackets with your own values:

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

---

After you disallow Shared Key authorization, making a request to the storage account with Shared Key authorization will fail with error code 403 (Forbidden). Azure Storage returns error indicating that key-based authorization is not permitted on the storage account.

### Verify that Shared Key access is not allowed

To verify that Shared Key authorization is no longer permitted, you can attempt to call a data operation with the account access key. The following example attempts to create a container using the access key. This call will fail when Shared Key authorization is disallowed for the storage account. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container create \
    --account-name <storage-account> \
    --name sample-container \
    --account-key <key>
    --auth-mode key
```

> [!NOTE]
> Anonymous requests are not authorized and will proceed if you have configured the storage account and container for anonymous public read access. For more information, see [Configure anonymous public read access for containers and blobs](../blobs/anonymous-read-access-configure.md).

### Check the Shared Key access setting for multiple accounts

To check the Shared Key access setting across a set of storage accounts with optimal performance, you can use the Azure Resource Graph Explorer in the Azure portal. To learn more about using the Resource Graph Explorer, see [Quickstart: Run your first Resource Graph query using Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md).

Running the following query in the Resource Graph Explorer returns a list of storage accounts and displays the Shared Key access setting for each account:

```kusto
resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| extend allowSharedKeyAccess = parse_json(properties).allowSharedKeyAccess
| project subscriptionId, resourceGroup, name, allowSharedKeyAccess
```

## Understand how disallowing Shared Key affects SAS tokens

When Shared Key is disallowed for the storage account, Azure Storage handles SAS tokens based on the type of SAS and the service that is targeted by the request. The following table shows how each type of SAS is authorized and how Azure Storage will handle that SAS when the **AllowSharedKeyAccess** property for the storage account is **false**.

| Type of SAS | Type of authorization | Behavior when AllowSharedKeyAccess is false |
|-|-|-|
| User delegation SAS (Blob storage only) | Azure AD | Request is permitted. Microsoft recommends using a user delegation SAS when possible for superior security. |
| Service SAS | Shared Key | Request is denied for Blob storage. Request is permitted for Queue and Table storage and for Azure Files. For more information, see [Requests with SAS tokens are permitted for queues, tables, and files when AllowSharedKeyAccess is false](#requests-with-sas-tokens-are-permitted-for-queues-tables-and-files-when-allowsharedkeyaccess-is-false) in the **About the preview** section. |
| Account SAS | Shared Key | Request is denied for Blob storage. Request is permitted for Queue and Table storage and for Azure Files. For more information, see [Requests with SAS tokens are permitted for queues, tables, and files when AllowSharedKeyAccess is false](#requests-with-sas-tokens-are-permitted-for-queues-tables-and-files-when-allowsharedkeyaccess-is-false) in the **About the preview** section. |

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

## Consider compatibility with other Azure tools and services

A number of Azure services use Shared Key authorization to communicate with Azure Storage. If you disallow Shared Key authorization for a storage account, these services will not be able to access data in that account, and your applications may be adversely affected.

Some Azure tools offer the option to use Azure AD authorization to access Azure Storage. The following table lists some popular Azure tools and notes whether they can use Azure AD to authorize requests to Azure Storage.

| Azure tool | Azure AD authorization to Azure Storage |
|-|-|
| Azure portal | Supported. For information about authorizing with your Azure AD account from the Azure portal, see [Choose how to authorize access to blob data in the Azure portal](../blobs/authorize-blob-access-portal.md). |
| AzCopy | Supported for Blob storage. For information about authorizing AzCopy operations, see [Choose how you'll provide authorization credentials](storage-use-azcopy-v10.md#choose-how-youll-provide-authorization-credentials) in the AzCopy documentation. |
| Azure Storage Explorer | Supported for Blob storage and Azure Data Lake Storage Gen2 only. Azure AD access to Queue storage is not supported. Make sure to select the correct Azure AD tenant. For more information, see [Get started with Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows#sign-in-to-azure) |
| Azure PowerShell | Supported. For information about how to authorize PowerShell commands for blob or queue operations with Azure AD, see [Run PowerShell commands with Azure AD credentials to access blob data](../blobs/authorize-active-directory-powershell.md) or [Run PowerShell commands with Azure AD credentials to access queue data](../queues/authorize-active-directory-powershell.md). |
| Azure CLI | Supported. For information about how to authorize Azure CLI commands with Azure AD for access to blob and queue data, see [Run Azure CLI commands with Azure AD credentials to access blob or queue data](authorize-data-operations-cli.md). |
| Azure IoT Hub | Supported. For more information, see [IoT Hub support for virtual networks](../../iot-hub/virtual-network-support.md). |
| Azure Cloud Shell | Azure Cloud Shell is an integrated shell in the Azure portal. Azure Cloud Shell hosts files for persistence in an Azure file share in a storage account. These files will become inaccessible if Shared Key authorization is disallowed for that storage account. For more information, see [Connect your Microsoft Azure Files storage](../../cloud-shell/overview.md#connect-your-microsoft-azure-files-storage). <br /><br /> To run commands in Azure Cloud Shell to manage storage accounts for which Shared Key access is disallowed, first make sure that you have been granted the necessary permissions to these accounts via Azure role-based access control (Azure RBAC). For more information, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md). |

## About the preview

The preview for disallowing Shared Key authorization is available in the Azure public cloud. It is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).

To register for the preview, see [Azure Storage Allow Shared Key Access Limited Public Preview](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxW65f1VQyNCuBHMIMBV8qlUN1o4TUtUUzZBV0JYVlhKQ1FITDlVUUU0Ui4u).

> [!IMPORTANT]
> This preview is intended for non-production use only.

The preview includes the limitations described in the following sections.

### Metrics and logging report all requests made with a SAS regardless of how they are authorized

Azure metrics and logging in Azure Monitor do not distinguish between different types of shared access signatures in the preview. The **SAS** filter in Azure Metrics Explorer and the **SAS** field in Azure Storage logging in Azure Monitor both report requests that are authorized with any type of SAS. However, different types of shared access signatures are authorized differently, and behave differently when Shared Key access is disallowed:

- A service SAS token or an account SAS token is authorized with Shared Key and will not be permitted on a request to Blob storage when the **AllowSharedKeyAccess** property is set to **false**.
- A user delegation SAS is authorized with Azure AD and will be permitted on a request to Blob storage when the **AllowSharedKeyAccess** property is set to **false**.

When you are evaluating traffic to your storage account, keep in mind that metrics and logs as described in [Detect the type of authorization used by client applications](#detect-the-type-of-authorization-used-by-client-applications) may include requests made with a user delegation SAS. For more information about how Azure Storage responds to a SAS when the **AllowSharedKeyAccess** property is set to **false**, see [Understand how disallowing Shared Key affects SAS tokens](#understand-how-disallowing-shared-key-affects-sas-tokens).

### Requests with SAS tokens are permitted for queues, tables, and files when AllowSharedKeyAccess is false

When Shared Key access is disallowed for the storage account during the preview, shared access signatures that target queue, table, or Azure Files resources continue to be permitted. This limitation applies to both service SAS tokens and account SAS tokens. Both types of SAS are authorized with Shared Key.

## Next steps

- [Authorizing access to data in Azure Storage](storage-auth.md)
- [Authorize access to blobs and queues using Azure Active Directory](storage-auth-aad.md)
- [Authorize with Shared Key](/rest/api/storageservices/authorize-with-shared-key)