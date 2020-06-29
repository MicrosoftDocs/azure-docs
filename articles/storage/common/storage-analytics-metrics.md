---
title: "Azure Storage Analytics metrics (classic)"
description: Learn how to use Storage Analytics metrics in Azure Storage.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 03/11/2019
ms.author: normesta
ms.reviewer: fryu
ms.subservice: common
ms.custom: monitoring
---
# Azure Storage Analytics metrics (classic)

Azure Storage uses the Storage Analytics solution to store metrics that include aggregated transaction statistics and capacity data about requests to a storage service. Transactions are reported at the API operation level and at the storage service level. Capacity is reported at the storage service level. Metrics data can be used to:
- Analyze storage service usage.
- Diagnose issues with requests made against the storage service.
- Improve the performance of applications that use a service.

 Storage Analytics metrics are enabled by default for new storage accounts. You can configure metrics in the [Azure portal](https://portal.azure.com/). For more information, see [Monitor a storage account in the Azure portal](/azure/storage/storage-monitor-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Set Service Properties operations to enable Storage Analytics for each service.  

> [!NOTE]
> Storage Analytics metrics are available for Azure Blob storage, Azure Queue storage, Azure Table storage, and Azure Files.
> Storage Analytics metrics are now classic metrics. We recommend that you use [storage metrics in Azure Monitor](monitor-storage.md) instead of Storage Analytics metrics.

## Transaction metrics  
 A robust set of data is recorded at hourly or minute intervals for each storage service and requested API operation, which includes ingress and egress, availability, errors, and categorized request percentages. For a complete list of the transaction details, see [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema).  

 Transaction data is recorded at the service level and the API operation level. At the service level, statistics that summarize all requested API operations are written to a table entity every hour, even if no requests were made to the service. At the API operation level, statistics are only written to an entity if the operation was requested within that hour.  

 For example, if you perform a **GetBlob** operation on your blob service, Storage Analytics Metrics logs the request and includes it in the aggregated data for the blob service and the **GetBlob** operation. If no **GetBlob** operation is requested during the hour, an entity isn't written to *$MetricsTransactionsBlob* for that operation.  

 Transaction metrics are recorded for user requests and requests made by Storage Analytics itself. For example, requests by Storage Analytics to write logs and table entities are recorded.

## Capacity metrics  

> [!NOTE]
>  Currently, capacity metrics are available only for the blob service.

 Capacity data is recorded daily for a storage account's blob service, and two table entities are written. One entity provides statistics for user data, and the other provides statistics about the `$logs` blob container used by Storage Analytics. The *$MetricsCapacityBlob* table includes the following statistics:  

- **Capacity**: The amount of storage used by the storage account's blob service, in bytes.  
- **ContainerCount**: The number of blob containers in the storage account's blob service.  
- **ObjectCount**: The number of committed and uncommitted block or page blobs in the storage account's blob service.  

  For more information about capacity metrics, see [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema).  

## How metrics are stored  

 All metrics data for each of the storage services is stored in three tables reserved for that service. One table is for transaction information, one table is for minute transaction information, and another table is for capacity information. Transaction and minute transaction information consists of request and response data. Capacity information consists of storage usage data. Hour metrics, minute metrics, and capacity for a storage account's blob service is accessed in tables that are named as described in the following table.  

|Metrics level|Table names|Supported for versions|  
|-------------------|-----------------|----------------------------|  
|Hourly metrics, primary location|-   $MetricsTransactionsBlob<br />-   $MetricsTransactionsTable<br />-   $MetricsTransactionsQueue|Versions prior to August 15, 2013, only. While these names are still supported, we recommend that you switch to using the tables that follow.|  
|Hourly metrics, primary location|-   $MetricsHourPrimaryTransactionsBlob<br />-   $MetricsHourPrimaryTransactionsTable<br />-   $MetricsHourPrimaryTransactionsQueue<br />-   $MetricsHourPrimaryTransactionsFile|All versions. Support for file service metrics is available only in version April 5, 2015, and later.|  
|Minute metrics, primary location|-   $MetricsMinutePrimaryTransactionsBlob<br />-   $MetricsMinutePrimaryTransactionsTable<br />-   $MetricsMinutePrimaryTransactionsQueue<br />-   $MetricsMinutePrimaryTransactionsFile|All versions. Support for file service metrics is available only in version April 5, 2015, and later.|  
|Hourly metrics, secondary location|-   $MetricsHourSecondaryTransactionsBlob<br />-   $MetricsHourSecondaryTransactionsTable<br />-   $MetricsHourSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|  
|Minute metrics, secondary location|-   $MetricsMinuteSecondaryTransactionsBlob<br />-   $MetricsMinuteSecondaryTransactionsTable<br />-   $MetricsMinuteSecondaryTransactionsQueue|All versions. Read-access geo-redundant replication must be enabled.|  
|Capacity (blob service only)|$MetricsCapacityBlob|All versions.|  

 These tables are automatically created when Storage Analytics is enabled for a storage service endpoint. They're accessed via the namespace of the storage account, for example, `https://<accountname>.table.core.windows.net/Tables("$MetricsTransactionsBlob")`. The metrics tables don't appear in a listing operation and must be accessed directly via the table name.

## Enable metrics by using the Azure portal
Follow these steps to enable metrics in the [Azure portal](https://portal.azure.com):

1. Go to your storage account.
1. Select **Diagnostics settings (classic)** in the menu pane.
1. Ensure that **Status** is set to **On**.
1. Select the metrics for the services you want to monitor.
1. Specify a retention policy to indicate how long to retain metrics and log data.
1. Select **Save**.

The [Azure portal](https://portal.azure.com) doesn't currently enable you to configure minute metrics in your storage account. You must enable minute metrics by using PowerShell or programmatically.

## Enable storage metrics by using PowerShell  
You can use PowerShell on your local machine to configure storage metrics in your storage account by using the Azure PowerShell cmdlet **Get-AzStorageServiceMetricsProperty** to retrieve the current settings. Use the cmdlet **Set-AzStorageServiceMetricsProperty** to change the current settings.  

The cmdlets that control storage metrics use the following parameters:  

* **ServiceType**: Possible values are **Blob**, **Queue**, **Table**, and **File**.
* **MetricsType**: Possible values are **Hour** and **Minute**.  
* **MetricsLevel**: Possible values are:
   * **None**: Turns off monitoring.
   * **Service**: Collects metrics such as ingress and egress, availability, latency, and success percentages, which are aggregated for the blob, queue, table, and file services.
   * **ServiceAndApi**: In addition to the service metrics, collects the same set of metrics for each storage operation in the Azure Storage service API.

For example, the following command switches on minute metrics for the blob service in your storage account with the retention period set to five days: 

> [!NOTE]
> This command assumes that you've signed in to your Azure subscription by using the `Connect-AzAccount` command.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"

Set-AzStorageServiceMetricsProperty -MetricsType Minute -ServiceType Blob -MetricsLevel ServiceAndApi  -RetentionDays 5 -Context $storageAccount.Context
```  

* Replace the `<resource-group-name>` placeholder value with the name of your resource group.      
* Replace the `<storage-account-name>` placeholder value with the name of your storage account.



The following command retrieves the current hourly metrics level and retention days for the blob service in your default storage account:  

```powershell
Get-AzStorageServiceMetricsProperty -MetricsType Hour -ServiceType Blob -Context $storagecontext.Context
```  

For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see [Install and configure Azure PowerShell](https://azure.microsoft.com/documentation/articles/install-configure-powershell/).  

## Enable storage metrics programmatically  
In addition to using the Azure portal or the Azure PowerShell cmdlets to control storage metrics, you can also use one of the Azure Storage APIs. For example, if you use a .NET language you can use the Azure Storage client library.  

The classes **CloudBlobClient**, **CloudQueueClient**, **CloudTableClient**, and **CloudFileClient** all have methods such as **SetServiceProperties** and **SetServicePropertiesAsync** that take a **ServiceProperties** object as a parameter. You can use the **ServiceProperties** object to configure storage metrics. For example, the following C# snippet shows how to change the metrics level and retention days for the hourly queue metrics:  

```csharp
var storageAccount = CloudStorageAccount.Parse(connStr);  
var queueClient = storageAccount.CreateCloudQueueClient();  
var serviceProperties = queueClient.GetServiceProperties();  

serviceProperties.HourMetrics.MetricsLevel = MetricsLevel.Service;  
serviceProperties.HourMetrics.RetentionDays = 10;  

queueClient.SetServiceProperties(serviceProperties);  
```  

For more information about using a .NET language to configure storage metrics, see [Azure Storage client libraries for .NET](https://msdn.microsoft.com/library/azure/mt347887.aspx).  

For general information about configuring storage metrics by using the REST API, see [Enabling and configuring Storage Analytics](/rest/api/storageservices/Enabling-and-Configuring-Storage-Analytics).  

##  View storage metrics  
After you configure Storage Analytics metrics to monitor your storage account, Storage Analytics records the metrics in a set of well-known tables in your storage account. You can configure charts to view hourly metrics in the [Azure portal](https://portal.azure.com):

1. Go to your storage account in the [Azure portal](https://portal.azure.com).
1. Select **Metrics (classic)** in the menu pane for the service whose metrics you want to view.
1. Select the chart you want to configure.
1. On the **Edit Chart** pane, select the **Time range**, the **Chart type**, and the metrics you want displayed in the chart.

In the **Monitoring (classic)** section of your storage account's menu pane in the Azure portal, you can configure [Alert rules](#metrics-alerts). For example, you can send email alerts to notify you when a specific metric reaches a certain value.

If you want to download the metrics for long-term storage or to analyze them locally, you must use a tool or write some code to read the tables. You must download the minute metrics for analysis. The tables don't appear if you list all the tables in your storage account, but you can access them directly by name. Many storage-browsing tools are aware of these tables and enable you to view them directly. For a list of available tools, see [Azure Storage client tools](/azure/storage/storage-explorers).

||||  
|-|-|-|  
|**Metrics**|**Table names**|**Notes**|  
|Hourly metrics|$MetricsHourPrimaryTransactionsBlob<br /><br /> $MetricsHourPrimaryTransactionsTable<br /><br /> $MetricsHourPrimaryTransactionsQueue<br /><br /> $MetricsHourPrimaryTransactionsFile|In versions prior to August 15, 2013, these tables were known as:<br /><br /> $MetricsTransactionsBlob<br /><br /> $MetricsTransactionsTable<br /><br /> $MetricsTransactionsQueue<br /><br /> Metrics for the file service are available beginning with version April 5, 2015.|  
|Minute metrics|$MetricsMinutePrimaryTransactionsBlob<br /><br /> $MetricsMinutePrimaryTransactionsTable<br /><br /> $MetricsMinutePrimaryTransactionsQueue<br /><br /> $MetricsMinutePrimaryTransactionsFile|Can only be enabled by using PowerShell or programmatically.<br /><br /> Metrics for the file service are available beginning with version April 5, 2015.|  
|Capacity|$MetricsCapacityBlob|Blob service only.|  

For full details of the schemas for these tables, see [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema). The following sample rows show only a subset of the columns available, but they illustrate some important features of the way storage metrics saves these metrics:  

||||||||||||  
|-|-|-|-|-|-|-|-|-|-|-|  
|**PartitionKey**|**RowKey**|**Timestamp**|**TotalRequests**|**TotalBillableRequests**|**TotalIngress**|**TotalEgress**|**Availability**|**AverageE2ELatency**|**AverageServerLatency**|**PercentSuccess**|  
|20140522T1100|user;All|2014-05-22T11:01:16.7650250Z|7|7|4003|46801|100|104.4286|6.857143|100|  
|20140522T1100|user;QueryEntities|2014-05-22T11:01:16.7640250Z|5|5|2694|45951|100|143.8|7.8|100|  
|20140522T1100|user;QueryEntity|2014-05-22T11:01:16.7650250Z|1|1|538|633|100|3|3|100|  
|20140522T1100|user;UpdateEntity|2014-05-22T11:01:16.7650250Z|1|1|771|217|100|9|6|100|  

In this example of minute metrics data, the partition key uses the time at minute resolution. The row key identifies the type of information that's stored in the row. The information is composed of the access type and the request type:  

-   The access type is either **user** or **system**, where **user** refers to all user requests to the storage service and **system** refers to requests made by Storage Analytics.  
-   The request type is either **all**, in which case it's a summary line, or it identifies the specific API such as **QueryEntity** or **UpdateEntity**.  

This sample data shows all the records for a single minute (starting at 11:00AM), so the number of **QueryEntities** requests plus the number of **QueryEntity** requests plus the number of **UpdateEntity** requests adds up to seven. This total is shown in the **user:All** row. Similarly, you can derive the average end-to-end latency 104.4286 on the **user:All** row by calculating ((143.8 * 5) + 3 + 9)/7.  

## Metrics alerts
Consider setting up alerts in the [Azure portal](https://portal.azure.com) so you'll be automatically notified of important changes in the behavior of your storage services. If you use a Storage Explorer tool to download this metrics data in a delimited format, you can use Microsoft Excel to analyze the data. For a list of available Storage Explorer tools, see [Azure Storage client tools](/azure/storage/storage-explorers). You can configure alerts in the **Alert (classic)** pane, which is accessible under **Monitoring (classic)** in the storage account menu pane.

> [!IMPORTANT]
> There might be a delay between a storage event and when the corresponding hourly or minute metrics data is recorded. In the case of minute metrics, several minutes of data might be written at once. This issue can lead to transactions from earlier minutes being aggregated into the transaction for the current minute. When this issue happens, the alert service might not have all available metrics data for the configured alert interval, which might lead to alerts firing unexpectedly.
>

## Access metrics data programmatically  
The following listing shows sample C# code that accesses the minute metrics for a range of minutes and displays the results in a console window. The code sample uses the Azure Storage client library version 4.x or later, which includes the **CloudAnalyticsClient** class that simplifies accessing the metrics tables in storage.  

```csharp
private static void PrintMinuteMetrics(CloudAnalyticsClient analyticsClient, DateTimeOffset startDateTime, DateTimeOffset endDateTime)  
{  
 // Convert the dates to the format used in the PartitionKey.  
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

     // Filter on "user" transactions after fetching the metrics from Azure Table storage.  
     // (StartsWith is not supported using LINQ with Azure Table storage.)  
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

Read and delete requests of metrics data by a client are also billable at standard rates. If you configured a data retention policy, you aren't charged when Azure Storage deletes old metrics data. If you delete analytics data, your account is charged for the delete operations.  

The capacity used by the metrics tables is also billable. Use the following information to estimate the amount of capacity used for storing metrics data:  

-   If each hour a service utilizes every API in every service, approximately 148 KB of data is stored every hour in the metrics transaction tables if you enabled a service-level and API-level summary.  
-   If within each hour a service utilizes every API in the service, approximately 12 KB of data is stored every hour in the metrics transaction tables if you enabled only a service-level summary.  
-   The capacity table for blobs has two rows added each day provided you opted in for logs. This scenario implies that every day the size of this table increases by up to approximately 300 bytes.

## Next steps
* [Monitor a storage account](https://www.windowsazure.com/manage/services/storage/how-to-monitor-a-storage-account/)   
* [Storage Analytics metrics table schema](/rest/api/storageservices/storage-analytics-metrics-table-schema)   
* [Storage Analytics logged operations and status messages](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages)   
* [Storage Analytics logging](storage-analytics-logging.md)
