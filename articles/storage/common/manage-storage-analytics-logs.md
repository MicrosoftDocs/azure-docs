---
title: Enable and manage Azure Storage Analytic logs (classic) | Microsoft Docs
description: Learn how to monitor a storage account in Azure by using Azure Storage Analytics.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
ms.custom: monitoring
---
# Enable and manage Azure Storage Analytic logs (classic)

[Azure Storage Analytics](storage-analytics.md) provides logs for blobs, queues, and tables. You can use the [Azure portal](https://portal.azure.com) to configure logs are recorded for your account. This article shows you how to enable and manage logs. To learn how to enable metrics, see [Enable and manage Azure Storage Analytic metrics (classic)](storage-monitor-storage-account.md). 

We recommend you review [Azure Monitor for Storage](../../azure-monitor/insights/storage-insights-overview.md) (preview). It is a feature of Azure Monitor that offers comprehensive monitoring of your Azure Storage accounts by delivering a unified view of your Azure Storage services performance, capacity, and availability. It does not require you to enable or configure anything, and you can immediately view these metrics from the pre-defined interactive charts and other visualizations included.

> [!NOTE]
> There are costs associated with examining monitoring data in the Azure portal. For more information, see [Storage Analytics](storage-analytics.md).
>
> Azure Files does not yet support Storage Analytics logs.

> For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md).
>

<a id="configure-logging"></a>

## Enable logs

You can instruct Azure Storage to save diagnostics logs for read, write, and delete requests for the blob, table, and queue services. The data retention policy you set also applies to these logs.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), select **Storage accounts**, then the name of the storage account to open the storage account blade.

2. Select **Diagnostics settings (classic)** in the **Monitoring (classic)** section of the menu blade.

    ![Diagnostics menu item under MONITORING in the Azure portal.](./media/manage-storage-analytics-logs/storage-enable-metrics-00.png)

3. Ensure **Status** is set to **On**, and select the **services** for which you'd like to enable logging.

   > [!div class="mx-imgBorder"]
   > ![Configure logging in the Azure portal.](./media/manage-storage-analytics-logs/enable-diagnostics.png)    

4. Click **Save**.

The diagnostics logs are saved in a blob container named *$logs* in your storage account. You can view the log data using a storage explorer like the [Microsoft Azure Storage Explorer](https://storageexplorer.com), or programmatically using the storage client library or PowerShell.

For information about accessing the $logs container, see [Storage analytics logging](storage-analytics-logging.md).

### [PowerShell](#tab/azure-powershell)

1. Open a Windows PowerShell command window.

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

5. Get the storage account context that defines the storage account you want to use.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account. 

6. Use the **Set-AzStorageServiceLoggingProperty** to change the current log settings. The cmdlets that control Storage Logging use a **LoggingOperations** parameter that is a string containing a comma-separated list of request types to log. The three possible request types are **read**, **write**, and **delete**. To switch off logging, use the value **none** for the **LoggingOperations** parameter.  

   The following command switches on logging for read, write, and delete requests in the Queue service in your default storage account with retention set to five days:  

   ```powershell
   Set-AzStorageServiceLoggingProperty -ServiceType Queue -LoggingOperations read,write,delete -RetentionDays 5 -Context = $ctx
   ```  
   The following command switches off logging for the table service in your default storage account:  

   ```powershell
   Set-AzStorageServiceLoggingProperty -ServiceType Table -LoggingOperations none -Context = $ctx 
   ```  

   For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see: [How to install and configure Azure PowerShell](/powershell/azure/).  

### [.NET v12](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/Monitoring.cs" id="snippet_EnableDiagnosticLogs":::

### [.NET v11](#tab/dotnet11)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();  

serviceProperties.Logging.LoggingOperations = LoggingOperations.All;  
serviceProperties.Logging.RetentionDays = 2;  

queueClient.SetServiceProperties(serviceProperties);  
``` 

---

> [!NOTE]
> Azure Files currently supports Storage Analytics metrics, but does not yet support logging.
>

<a id="modify-retention-policy"></a>

## Update log settings

You can update log settings. For example, the retention period that you hold on to logs.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), select **Storage accounts**, then the name of the storage account to open the storage account blade.
2. Select **Diagnostics settings (classic)** in the **Monitoring (classic)** section of the menu blade.

    ![Diagnostics menu item under MONITORING in the Azure portal](./media/manage-storage-analytics-logs/storage-enable-metrics-00.png)

3. Ensure that the **Delete data** check box is selected.  Then, set the number of days that you would like log data to be retained by moving the slider control beneath the check box, or by directly modifying the value that appears in the text box next to the slider control.

   > [!div class="mx-imgBorder"]
   > ![Modify the retention period in the Azure portal](./media/manage-storage-analytics-logs/modify-retention-period.png)
   
4. Click **Save**.

The diagnostics logs are saved in a blob container named *$logs* in your storage account. You can view the log data using a storage explorer like the [Microsoft Azure Storage Explorer](https://storageexplorer.com), or programmatically using the storage client library or PowerShell.

For information about accessing the $logs container, see [Storage analytics logging](storage-analytics-logging.md).

### [PowerShell](#tab/azure-powershell)

1. Open a Windows PowerShell command window.

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

5. Get the storage account context that defines the storage account.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account. 

6. Use the **Set-AzStorageServiceLoggingProperty** to change the current log settings. The following example changes the retention period for logs for the blob and queue storage services to 4 days.  

   ```powershell
   Set-AzStorageServiceLoggingProperty -ServiceType Blob, Queue -RetentionDays 4 -Context = $ctx
   ```  

   For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see: [How to install and configure Azure PowerShell](/powershell/azure/).  

### [.NET v12](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/Monitoring.cs" id="snippet_ModifyRetentionPeriod":::

### [.NET v11](#tab/dotnet11)

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();  

serviceProperties.Logging.LoggingOperations = LoggingOperations.All;  
serviceProperties.Logging.RetentionDays = 2;  

queueClient.SetServiceProperties(serviceProperties);  
``` 

---

> [!NOTE]
> Azure Files currently supports Storage Analytics metrics, but does not yet support logging.
>


<a id="download-storage-logging-log-data"></a>

## View log data

 To view and analyze your log data, you should download the blobs that contain the log data you are interested in to a local machine. Many storage-browsing tools enable you to download blobs from your storage account; you can also use the Azure Storage team provided command-line Azure Copy Tool [AzCopy](storage-use-azcopy-v10.md) to download your log data.  
 
>[!NOTE]
> The `$logs` container isn't integrated with Event Grid, so you won't receive notifications when log files are written. 

 To make sure you download the log data you are interested in and to avoid downloading the same log data more than once:  

-   Use the date and time naming convention for blobs containing log data to track which blobs you have already downloaded for analysis to avoid re-downloading the same data more than once.  

-   Use the metadata on the blobs containing log data to identify the specific period for which the blob holds log data to identify the exact blob you need to download.  

To get started with AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md) 

The following example shows how you can download the log data for the queue service for the hours starting at 09 AM, 10 AM, and 11 AM on 20th May, 2014.

```
azcopy copy 'https://mystorageaccount.blob.core.windows.net/$logs/queue' 'C:\Logs\Storage' --include-path '2014/05/20/09;2014/05/20/10;2014/05/20/11' --recursive
```

To learn more about how to download specific files, see [Download specific files](./storage-use-azcopy-blobs.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#download-specific-files).

When you have downloaded your log data, you can view the log entries in the files. These log files use a delimited text format that many log reading tools are able to parse (for more information, see the guide [Monitoring, Diagnosing, and Troubleshooting Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md)). Different tools have different facilities for formatting, filtering, sorting, ad searching the contents of your log files. For more information about the Storage Logging log file format and content, see [Storage Analytics Log Format](/rest/api/storageservices/storage-analytics-log-format) and [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages).

## Next steps

* Find more details about [metrics, logging, and billing](storage-analytics.md) for Storage Analytics.
* [Configure Storage Analytics metrics](storage-monitor-storage-account.md).
* For more information about using a .NET language to configure Storage Logging, see [Storage Client Library Reference](/previous-versions/azure/dn261237(v=azure.100)). 
* For general information about configuring Storage Logging using the REST API, see [Enabling and Configuring Storage Analytics](/rest/api/storageservices/Enabling-and-Configuring-Storage-Analytics).