---
title: "Azure Storage analytics metrics (Classic)"
description: Learn how to use metrics in Azure Storage.
services: storage
author: normesta

ms.service: storage
ms.topic: article
ms.date: 03/11/2019
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
---
# Azure Storage analytics metrics (Classic)

Storage Analytics can store metrics that include aggregated transaction statistics and capacity data about requests to a storage service. Transactions are reported at both the API operation level as well as at the storage service level, and capacity is reported at the storage service level. Metrics data can be used to analyze storage service usage, diagnose issues with requests made against the storage service, and to improve the performance of applications that use a service.  

 Storage Analytics metrics are enabled by default for new storage accounts. You can configure metrics in the [Azure portal](https://portal.azure.com/); for details, see [Monitor a storage account in the Azure portal](/azure/storage/storage-monitor-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Set Service Properties operations to enable Storage Analytics for each service.  

> [!NOTE]
> Storage Analytics metrics are available for the Blob, Queue, Table, and File services.
> Storage Analytics metrics are now Classic metrics. Microsoft recommends using [Storage Metrics in Azure Monitor](storage-metrics-in-azure-monitor.md) instead of Storage Analytics metrics.

## Transaction metrics  
 A robust set of data is recorded at hourly or minute intervals for each storage service and requested API operation, including ingress/egress, availability, errors, and categorized request percentages. You can see a complete list of the transaction details in the [Storage Analytics Metrics Table Schema](/rest/api/storageservices/storage-analytics-metrics-table-schema) topic.  

 Transaction data is recorded at two levels – the service level and the API operation level. At the service level, statistics summarizing all requested API operations are written to a table entity every hour even if no requests were made to the service. At the API operation level, statistics are only written to an entity if the operation was requested within that hour.  

 For example, if you perform a **GetBlob** operation on your Blob service, Storage Analytics Metrics will log the request and include it in the aggregated data for both the Blob service as well as the **GetBlob** operation. However, if no **GetBlob** operation is requested during the hour, an entity will not be written to the *$MetricsTransactionsBlob* for that operation.  

 Transaction metrics are recorded for both user requests and requests made by Storage Analytics itself. For example, requests by Storage Analytics to write logs and table entities are recorded.

## Capacity metrics  

> [!NOTE]
>  Currently, capacity metrics are only available for the Blob service.

 Capacity data is recorded daily for a storage account’s Blob service, and two table entities are written. One entity provides statistics for user data, and the other provides statistics about the `$logs` blob container used by Storage Analytics. The *$MetricsCapacityBlob* table includes the following statistics:  

- **Capacity**: The amount of storage used by the storage account’s Blob service, in bytes.  
- **ContainerCount**: The number of blob containers in the storage account’s Blob service.  
- **ObjectCount**: The number of committed and uncommitted block or page blobs in the storage account’s Blob service.  

  For more information about the capacity metrics, see [Storage Analytics Metrics Table Schema](/rest/api/storageservices/storage-analytics-metrics-table-schema).  

## How metrics are stored  

 All metrics data for each of the storage services is stored in three tables reserved for that service: one table for transaction information, one table for minute transaction information, and another table for capacity information. Transaction and minute transaction information consists of request and response data, and capacity information consists of storage usage data. Hour metrics, minute metrics, and capacity for a storage account’s Blob service is can be accessed in tables that are named as described in the following table.  

|Metrics Level|Table Names|Supported for Versions|  
|-------------------|-----------------|----------------------------|  
|Hourly metrics, primary location|-   $MetricsTransactionsBlob<br />-   $MetricsTransactionsTable<br />-   $MetricsTransactionsQueue|Versions prior to 2013-08-15 only. While these names are still supported, it’s recommended that you switch to using the tables listed below.|  
|Hourly metrics, primary location|-   $MetricsHourPrimaryTransactionsBlob<br />-   $MetricsHourPrimaryTransactionsTable<br />-   $MetricsHourPrimaryTransactionsQueue<br />-   $MetricsHourPrimaryTransactionsFile|All versions. Support for File service metrics is available only in version 2015-04-05 and later.|  
|Minute metrics, primary location|-   $MetricsMinutePrimaryTransactionsBlob<br />-   $MetricsMinutePrimaryTransactionsTable<br />-   $MetricsMinutePrimaryTransactionsQueue<br />-   $MetricsMinutePrimaryTransactionsFile|All versions. Support for File service metrics is available only in version 2015-04-05 and later.|  
|Hourly metrics, secondary location|-   $MetricsHourSecondaryTransactionsBlob<br />-   $MetricsHourSecondaryTransactionsTable<br />-   $MetricsHourSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|  
|Minute metrics, secondary location|-   $MetricsMinuteSecondaryTransactionsBlob<br />-   $MetricsMinuteSecondaryTransactionsTable<br />-   $MetricsMinuteSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|  
|Capacity (Blob service only)|$MetricsCapacityBlob|All versions.|  

 These tables are automatically created when Storage Analytics is enabled for a storage service endpoint. They are accessed via the namespace of the storage account, for example: `https://<accountname>.table.core.windows.net/Tables("$MetricsTransactionsBlob")`. The metrics tables do not appear in a listing operation, and must be accessed directly via the table name.  

## Enable metrics using the Azure portal
Follow these steps to enable metrics in the [Azure portal](https://portal.azure.com):

1. Navigate to your storage account.
1. Select **Diagnostics settings (classic)** from the **Menu** pane.
1. Ensure that **Status** is set to **On**.
1. Select the metrics for the services you wish to monitor.
1. Specify a retention policy to indicate how long to retain metrics and log data.
1. Select **Save**.

The [Azure portal](https://portal.azure.com) does not currently enable you to configure minute metrics in your storage account; you must enable minute metrics using PowerShell or programmatically.

> [!NOTE]
>  Note that the Azure portal does not currently enable you to configure minute metrics in your storage account. You must enable minute metrics using PowerShell or programmatically.

## Enable Storage metrics using PowerShell  
You can use PowerShell on your local machine to configure Storage Metrics in your storage account by using the Azure PowerShell cmdlet **Get-AzureStorageServiceMetricsProperty** to retrieve the current settings, and the cmdlet **Set-AzureStorageServiceMetricsProperty** to change the current settings.  

The cmdlets that control Storage Metrics use the following parameters:  

* **ServiceType**, possible value are **Blob**,  **Queue**, **Table**, and **File**.
* **MetricsType**, possible values are **Hour** and **Minute**.  
* **MetricsLevel**, possible values are:
* **None**: Turns off monitoring.
* **Service**: Collects metrics such as ingress/egress, availability, latency, and success percentages, which are aggregated for the blob, queue, table, and file services.
* **ServiceAndApi**: In addition to the Service metrics, collects the same set of metrics for each storage operation in the Azure Storage service API.

For example, the following command switches on minute metrics for the blob service in your storage account with the retention period set to five days: 

> [!NOTE]
> This command assumes that you've signed into your Azure subscription by using the `Connect-AzAccount` command.

```  
$storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"

Set-AzureStorageServiceMetricsProperty -MetricsType Minute -ServiceType Blob -MetricsLevel ServiceAndApi  -RetentionDays 5 -Context $storageAccount.Context
```  

* Replace the `<resource-group-name>` placeholder value with the name of your resource group.

* Replace the `<storage-account-name>` placeholder value with the name of your storage account.



The following command retrieves the current hourly metrics level and retention days for the blob service in your default storage account:  

```  
Get-AzureStorageServiceMetricsProperty -MetricsType Hour -ServiceType Blob -Context $storagecontext.Context
```  

For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see: [How to install and configure Azure PowerShell](https://azure.microsoft.com/documentation/articles/install-configure-powershell/).  

## Enable Storage metrics programmatically  
In addition to using the Azure portal or the Azure PowerShell cmdlets to control Storage Metrics, you can also use one of the Azure Storage APIs. For example, if you are using a .NET language you can use the Storage Client Library.  

The classes **CloudBlobClient**, **CloudQueueClient**, **CloudTableClient**, and **CloudFileClient** all have methods such as **SetServiceProperties** and **SetServicePropertiesAsync** that take a **ServiceProperties** object as a parameter. You can use the **ServiceProperties** object to configure Storage Metrics. For example, the following C# snippet shows how to change the metrics level and retention days for the hourly queue metrics:  

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();  

serviceProperties.HourMetrics.MetricsLevel = MetricsLevel.Service;  
serviceProperties.HourMetrics.RetentionDays = 10;  

queueClient.SetServiceProperties(serviceProperties);  
```  

For more information about using a .NET language to configure Storage Metrics, see [Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/mt347887.aspx).  

For general information about configuring Storage Metrics using the REST API, see [Enabling and Configuring Storage Analytics](/rest/api/storageservices/Enabling-and-Configuring-Storage-Analytics).  

##  Viewing Storage metrics  
After you configure Storage Analytics metrics to monitor your storage account, Storage Analytics records the metrics in a set of well-known tables in your storage account. You can configure charts to view hourly metrics in the [Azure portal](https://portal.azure.com):

1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Select **Metrics (classic)** in the **Menu** blade for the service whose metrics you want to view.
1. Click the chart you want to configure.
1. In the **Edit Chart** blade, select the **Time Range**, **Chart type**, and the metrics you want displayed in the chart.

In the **Monitoring (classic)** section of your Storage account's menu blade in the Azure portal, you can configure [Alert rules](#metrics-alerts), such as sending email alerts to notify you when a specific metric reaches a certain value.

If you want to download the metrics for long-term storage or to analyze them locally, you must use a tool or write some code to read the tables. You must download the minute metrics for analysis. The tables do not appear if you list all the tables in your storage account, but you can access them directly by name. Many storage-browsing tools are aware of these tables and enable you to view them directly (see [Azure Storage Client Tools](/azure/storage/storage-explorers) for a list of available tools).

||||  
|-|-|-|  
|**Metrics**|**Table names**|**Notes**|  
|Hourly metrics|$MetricsHourPrimaryTransactionsBlob<br /><br /> $MetricsHourPrimaryTransactionsTable<br /><br /> $MetricsHourPrimaryTransactionsQueue<br /><br /> $MetricsHourPrimaryTransactionsFile|In versions prior to 2013-08-15, these tables were known as:<br /><br /> $MetricsTransactionsBlob<br /><br /> $MetricsTransactionsTable<br /><br /> $MetricsTransactionsQueue<br /><br /> Metrics for the File service are available beginning with version 2015-04-05.|  
|Minute metrics|$MetricsMinutePrimaryTransactionsBlob<br /><br /> $MetricsMinutePrimaryTransactionsTable<br /><br /> $MetricsMinutePrimaryTransactionsQueue<br /><br /> $MetricsMinutePrimaryTransactionsFile|Can only be enabled using PowerShell or programmatically.<br /><br /> Metrics for the File service are available beginning with version 2015-04-05.|  
|Capacity|$MetricsCapacityBlob|Blob service only.|  

You can find full details of the schemas for these tables at [Storage Analytics Metrics Table Schema](/rest/api/storageservices/storage-analytics-metrics-table-schema). The sample rows below show only a subset of the columns available, but illustrate some important features of the way Storage Metrics saves these metrics:  

||||||||||||  
|-|-|-|-|-|-|-|-|-|-|-|  
|**PartitionKey**|**RowKey**|**Timestamp**|**TotalRequests**|**TotalBillableRequests**|**TotalIngress**|**TotalEgress**|**Availability**|**AverageE2ELatency**|**AverageServerLatency**|**PercentSuccess**|  
|20140522T1100|user;All|2014-05-22T11:01:16.7650250Z|7|7|4003|46801|100|104.4286|6.857143|100|  
|20140522T1100|user;QueryEntities|2014-05-22T11:01:16.7640250Z|5|5|2694|45951|100|143.8|7.8|100|  
|20140522T1100|user;QueryEntity|2014-05-22T11:01:16.7650250Z|1|1|538|633|100|3|3|100|  
|20140522T1100|user;UpdateEntity|2014-05-22T11:01:16.7650250Z|1|1|771|217|100|9|6|100|  

In this example minute metrics data, the partition key uses the time at minute resolution. The row key identifies the type of information that is stored in the row and this is composed of two pieces of information, the access type, and the request type:  

-   The access type is either **user** or **system**, where **user** refers to all user requests to the storage service, and **system** refers to requests made by Storage Analytics.  

-   The request type is either **all** in which case it is a summary line, or it identifies the specific API such as **QueryEntity** or **UpdateEntity**.  

The sample data above shows all the records for a single minute (starting at 11:00AM), so the number of **QueryEntities** requests plus the number of **QueryEntity** requests plus the number of **UpdateEntity** requests add up to seven, which is the total shown on the **user:All** row. Similarly, you can derive the average end-to-end latency 104.4286 on the **user:All** row by calculating ((143.8 * 5) + 3 + 9)/7.  

## Metrics alerts
You should consider setting up alerts in the [Azure portal](https://portal.azure.com) so you will be automatically notified of important changes in the behavior of your storage services. If you use a storage explorer tool to download this metrics data in a delimited format, you can use Microsoft Excel to analyze the data. See [Azure Storage Client Tools](/azure/storage/storage-explorers) for a list of available storage explorer tools. You can configure alerts in the **Alert (classic)** blade, accessible under **Monitoring (classic)** in the Storage account menu blade.

> [!IMPORTANT]
> There may be a delay between a storage event and when the corresponding hourly or minute metrics data is recorded. In the case of minute metrics, several minutes of data may be written at once. This can lead to transactions from earlier minutes being aggregated into the transaction for the current minute. When this happens, the alert service may not have all available metrics data for the configured alert interval, which may lead to alerts firing unexpectedly.
>

## Accessing metrics data programmatically  
The following listing shows sample C# code that accesses the minute metrics for a range of minutes and displays the results in a console Window. The code sample uses the Azure Storage Client Library version 4.x or later, which includes the **CloudAnalyticsClient** class that simplifies accessing the metrics tables in storage.  

```csharp
private static void PrintMinuteMetrics(CloudAnalyticsClient analyticsClient, DateTimeOffset startDateTime, DateTimeOffset endDateTime)  
{  
 // Convert the dates to the format used in the PartitionKey  
 var start = startDateTime.ToUniversalTime().ToString("yyyyMMdd'T'HHmm");  
 var end = endDateTime.ToUniversalTime().ToString("yyyyMMdd'T'HHmm");  

 var services = Enum.GetValues(typeof(StorageService));  
 foreach (StorageService service in services)  
 {  
     Console.WriteLine("Minute Metrics for Service {0} from {1} to {2} UTC", service, start, end);  
     var metricsQuery = analyticsClient.CreateMinuteMetricsQuery(service, StorageLocation.Primary);  
     var t = analyticsClient.GetMinuteMetricsTable(service);  
     var opContext = new OperationContext();  
     var query =  
             from entity in metricsQuery  
             // Note, you can't filter using the entity properties Time, AccessType, or TransactionType  
             // because they are calculated fields in the MetricsEntity class.  
             // The PartitionKey identifies the DataTime of the metrics.  
             where entity.PartitionKey.CompareTo(start) >= 0 && entity.PartitionKey.CompareTo(end) <= 0   
             select entity;  

     // Filter on "user" transactions after fetching the metrics from Table Storage.  
     // (StartsWith is not supported using LINQ with Azure Table storage)  
     var results = query.ToList().Where(m => m.RowKey.StartsWith("user"));  
     var resultString = results.Aggregate(new StringBuilder(), (builder, metrics) => builder.AppendLine(MetricsString(metrics, opContext))).ToString();  
     Console.WriteLine(resultString);  
 }  
}  

private static string MetricsString(MetricsEntity entity, OperationContext opContext)  
{  
 var entityProperties = entity.WriteEntity(opContext);  
 var entityString =  
         string.Format("Time: {0}, ", entity.Time) +  
         string.Format("AccessType: {0}, ", entity.AccessType) +  
         string.Format("TransactionType: {0}, ", entity.TransactionType) +  
         string.Join(",", entityProperties.Select(e => new KeyValuePair<string, string>(e.Key.ToString(), e.Value.PropertyAsObject.ToString())));  
 return entityString;  
}  
```  

## Billing on storage metrics  
Write requests to create table entities for metrics are charged at the standard rates applicable to all Azure Storage operations.  

Read and delete requests of metrics data by a client are also billable at standard rates. If you have configured a data retention policy, you are not charged when Azure Storage deletes old metrics data. However, if you delete analytics data, your account is charged for the delete operations.  

The capacity used by the metrics tables is also billable. You can use the following to estimate the amount of capacity used for storing metrics data:  

-   If each hour a service utilizes every API in every service, then approximately 148KB of data is stored every hour in the metrics transaction tables if you have enabled both service- and API-level summary.  
-   If within each hour, a service utilizes every API in the service, then approximately 12KB of data is stored every hour in the metrics transaction tables if you have enabled just service-level summary.  
-   The capacity table for blobs has two rows added each day, provided you have opted-in for logs. This implies that every day, the size of this table increases by up to approximately 300 bytes.

## Next steps
* [How To Monitor a Storage Account](https://www.windowsazure.com/manage/services/storage/how-to-monitor-a-storage-account/)   
* [Storage Analytics Metrics Table Schema](/rest/api/storageservices/storage-analytics-metrics-table-schema)   
* [Storage Analytics Logged Operations and Status Messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)   
* [Storage Analytics Logging](storage-analytics-logging.md)
