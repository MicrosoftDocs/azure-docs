---
title: Limit the source accounts for Azure Storage Account copy operations to accounts in the same tenant or on the same virtual network
titleSuffix: Azure Storage
description: Learn how to use the "Permitted scope of copy operations" (preview) Azure storage account setting to limit the source accounts of copy operations to the same tenant or with private links to the same virtual network.
author: jimmart-dev
ms.author: jammart
ms.service: storage
ms.topic: how-to
ms.date: 11/21/2022
ms.reviewer: santoshc 
ms.custom: template-how-to
---

# Restrict copy operations to source accounts in the same tenant or virtual network

For security reasons, storage administrators might want to limit copy operations to a secured storage account such that the source accounts are in trusted environments. Limiting the scope of permitted copy operations helps prevent the exfiltration of data... (a better explanation here).

The **allowedCopyScope** property of a storage account controls the environments where the source accounts of copy operations are allowed to reside. The property is not set by default and does not return a value until you explicitly set it. The property has three possible settings:

- ***(not defined)***: Defaults to allowing copying from any storage account.
- **AAD**: Permits copying only from accounts in the same Azure AD tenant as the destination account.
- **PrivateLink**:  Permits copying only from storage accounts that have private links to the same virtual network as the destination account.

When the source of a copy request does not meet the requirements you specify, the request fails with HTTP status code 403 and error message "This request is not authorized to perform this operation."

This article shows you how to limit the source accounts of copy operations to accounts in the same tenant as the destination account, or with private links to the same virtual network.

> [!IMPORTANT]
> **Permitted scope of copy operations** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Identify the source storage accounts of copy operations

Before changing the value of **allowedCopyScope** for a storage account, identify users, applications or services that would be affected by the change. Depending on your findings, it might be necessary to adjust the setting to include all of the desired copy sources, or to adjust the network or Azure AD configuration for some storage accounts.

Azure Storage logs capture details in Azure Monitor about requests made against the storage account, including the source and destination of copy operations. For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md). Enable and analyze the logs to identify copy operations that might be affected by changing **allowedCopyScope** for the destination storage account.

### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account, or use an existing Log Analytics workspace. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests." lightbox="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs](../blobs/monitor-blob-storage-reference.md#resource-logs-preview).

### Query logs for copy requests

Azure Storage logs include all requests to copy data to a storage account from another source. The log entries include the name of the destination storage account and the URI of the source object. To retrieve logs for copy requests made in the last seven days that were authorized with Shared Key or SAS, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. This query displays the ten IP addresses that most frequently sent requests that were authorized with Shared Key or SAS:

```kusto
StorageBlobLogs
| where OperationName has "CopyBlobSource"
| summarize count() by AccountName, Uri, CallerIpAddress, UserAgentHeader
```

The URI field is the full path to the source object being copied, which includes the storage account name, the container name and the file name. From the list of URIs, determine whether the copy operations would be blocked if an allowedCopyScope setting was applied.

You can also configure an alert rule based on this query to notify you about requests authorized with Shared Key or SAS. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links 
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
-->
<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
