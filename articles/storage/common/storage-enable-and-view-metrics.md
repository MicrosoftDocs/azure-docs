---
title: Enabling storage metrics in the Azure portal | Microsoft Docs
description: How to enable storage metrics for the Blob, Queue, Table, and File services
services: storage
author: roygara
ms.service: storage
ms.devlang: dotnet
ms.topic: article
ms.date: 02/14/2017
ms.author: rogarana
ms.component: common
---
# Enabling Azure Storage metrics and viewing metrics data
[!INCLUDE [storage-selector-portal-enable-and-view-metrics](../../../includes/storage-selector-portal-enable-and-view-metrics.md)]

## Overview
Storage Metrics is enabled by default when you create a new storage account. You can configure monitoring via the [Azure portal](https://portal.azure.com) or Windows PowerShell, or programmatically via one of the storage client libraries.

You can configure a retention period for the metrics data: this period determines for how long the storage service keeps the metrics and charges you for the space required to store them. Typically, you should use a shorter retention period for minute metrics than hourly metrics because of the significant extra space required for minute metrics. Choose a retention period such that you have sufficient time to analyze the data and download any metrics you wish to keep for off-line analysis or reporting purposes. Remember that you are also billed for downloading metrics data from your storage account.

## How to enable metrics using the Azure portal
Follow these steps to enable metrics in the [Azure portal](https://portal.azure.com):

1. Navigate to your storage account.
1. Select **Diagnostics** from the **Menu** pane.
1. Ensure that **Status** is set to **On**.
1. Select the metrics for the services you wish to monitor.
1. Specify a retention policy to indicate how long to retain metrics and log data.
1. Select **Save**.

The [Azure portal](https://portal.azure.com) does not currently enable you to configure minute metrics in your storage account; you must enable minute metrics using PowerShell or programmatically.

## How to enable metrics using PowerShell
You can use PowerShell on your local machine to configure Storage Metrics in your storage account by using the Azure PowerShell cmdlet Get-AzureStorageServiceMetricsProperty to retrieve the current settings, and the cmdlet Set-AzureStorageServiceMetricsProperty to change the current settings.

The cmdlets that control Storage Metrics use the following parameters:

* MetricsType: possible values are Hour and Minute.
* ServiceType: possible values are Blob, Queue, and Table.
* MetricsLevel: possible values are None, Service, and ServiceAndApi.

For example, the following command switches on minute metrics for the Blob service in your default storage account with the retention period set to five days:

```powershell
Set-AzureStorageServiceMetricsProperty -MetricsType Minute -ServiceType Blob -MetricsLevel ServiceAndApi  -RetentionDays 5`
```

The following command retrieves the current hourly metrics level and retention days for the blob service in your default storage account:

```powershell
Get-AzureStorageServiceMetricsProperty -MetricsType Hour -ServiceType Blob
```

For information about how to configure the Azure PowerShell cmdlets to work with your Azure subscription and how to select the default storage account to use, see: [How to install and configure Azure PowerShell](/powershell/azure/overview).

## How to enable Storage metrics programmatically
The following C# snippet shows how to enable metrics and logging for the Blob service using the storage client library for .NET:

```csharp
//Parse the connection string for the storage account.
const string ConnectionString = "DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key";
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);

// Create service client for credentialed access to the Blob service.
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Enable Storage Analytics logging and set retention policy to 10 days.
ServiceProperties properties = new ServiceProperties();
properties.Logging.LoggingOperations = LoggingOperations.All;
properties.Logging.RetentionDays = 10;
properties.Logging.Version = "1.0";

// Configure service properties for metrics. Both metrics and logging must be set at the same time.
properties.HourMetrics.MetricsLevel = MetricsLevel.ServiceAndApi;
properties.HourMetrics.RetentionDays = 10;
properties.HourMetrics.Version = "1.0";

properties.MinuteMetrics.MetricsLevel = MetricsLevel.ServiceAndApi;
properties.MinuteMetrics.RetentionDays = 10;
properties.MinuteMetrics.Version = "1.0";

// Set the default service version to be used for anonymous requests.
properties.DefaultServiceVersion = "2015-04-05";

// Set the service properties.
blobClient.SetServiceProperties(properties);
```

## Viewing Storage metrics
After you configure Storage Analytics metrics to monitor your storage account, Storage Analytics records the metrics in a set of well-known tables in your storage account. You can configure charts to view hourly metrics in the [Azure portal](https://portal.azure.com):

1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Select **Metrics** in the **Menu** pane for the service whose metrics you want to view.
1. Select **Edit** on the chart you want to configure.
1. In the **Edit Chart** pane, select the **Time Range**, **Chart type**, and the metrics you want displayed in the chart.
1. Select **OK**

If you want to download the metrics for long-term storage or to analyze them locally, you need to:

* Use a tool that is aware of these tables and will allow you to view and download them.
* Write a custom application or script to read and store the tables.

Many third-party storage-browsing tools are aware of these tables and enable you to view them directly.
See [Azure Storage Client Tools](storage-explorers.md) for a list of available tools.

> [!NOTE]
> Starting with version 0.8.0 of the [Microsoft Azure Storage Explorer](http://storageexplorer.com/), you can view and download the analytics metrics tables.
>
>

In order to access the analytics tables programmatically, do note that the analytics tables do not appear if you list all the tables in your storage account. You can either access them directly by name, or use the [CloudAnalyticsClient API](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.analytics.cloudanalyticsclient.aspx) in the .NET client library to query the table names.

### Hourly metrics
* $MetricsHourPrimaryTransactionsBlob
* $MetricsHourPrimaryTransactionsTable
* $MetricsHourPrimaryTransactionsQueue

### Minute metrics
* $MetricsMinutePrimaryTransactionsBlob
* $MetricsMinutePrimaryTransactionsTable
* $MetricsMinutePrimaryTransactionsQueue

### Capacity
* $MetricsCapacityBlob

You can find full details of the schemas for these tables at [Storage Analytics Metrics Table Schema](https://msdn.microsoft.com/library/azure/hh343264.aspx). The sample rows below show only a subset of the columns available, but illustrate some important features of the way Storage Metrics saves these metrics:

| PartitionKey | RowKey | Timestamp | TotalRequests | TotalBillableRequests | TotalIngress | TotalEgress | Availability | AverageE2ELatency | AverageServerLatency | PercentSuccess |
| --- |:---:| ---:| --- | --- | --- | --- | --- | --- | --- | --- |
| 20140522T1100 |user;All |2014-05-22T11:01:16.7650250Z |7 |7 |4003 |46801 |100 |104.4286 |6.857143 |100 |
| 20140522T1100 |user;QueryEntities |2014-05-22T11:01:16.7640250Z |5 |5 |2694 |45951 |100 |143.8 |7.8 |100 |
| 20140522T1100 |user;QueryEntity |2014-05-22T11:01:16.7650250Z |1 |1 |538 |633 |100 |3 |3 |100 |
| 20140522T1100 |user;UpdateEntity |2014-05-22T11:01:16.7650250Z |1 |1 |771 |217 |100 |9 |6 |100 |

In this example minute metrics data, the partition key uses the time at minute resolution. The row key identifies the type of information that is stored in the row. The row key is composed of two pieces of information, the access type, and the request type:

* The access type is either user or system, where user refers to all user requests to the storage service, and system refers to requests made by Storage Analytics.
* The request type is either all in which case it is a summary line, or it identifies the specific API such as QueryEntity or UpdateEntity.

The sample data above shows all the records for a single minute (starting at 11:00AM), so the number of QueryEntities requests plus the number of QueryEntity requests plus the number of UpdateEntity requests add up to seven, which is the total shown on the user:All row. Similarly, you can derive the average end-to-end latency 104.4286 on the user:All row by calculating ((143.8 * 5) + 3 + 9)/7.

Please note that **Blob hourly metric settings** are applied to both **Blob capacity metric** ($MetricsCapacityBlob) and **hourly Blob transaction metrics** ($MetricsHourPrimaryTransactionsBlob). Both are enabled or disabled together and use same retention policy.

## Metrics alerts
You should consider setting up alerts in the [Azure portal](https://portal.azure.com) so Storage Metrics can automatically notify you of important changes in the behavior of your storage services. If you use a storage explorer tool to download this metrics data in a delimited format, you can use Microsoft Excel to analyze the data. See [Azure Storage Client Tools](storage-explorers.md) for a list of available storage explorer tools. You can configure alerts in the **Alert rules** pane, accessible under **Monitoring** in the Storage account menu pane.

> [!IMPORTANT]
> There may be a delay between a storage event and when the corresponding hourly or minute metrics data is recorded. When logging minute metrics, several minutes of data may be written at once. Transactions from earlier minutes may then be aggregated into the transaction for the current minute. When this happens, the alert service may not have all available metrics data for the configured alert interval, which may lead to alerts firing unexpectedly.
>

## Accessing metrics data programmatically
The following listing shows sample C# code that accesses the minute metrics for a range of minutes and displays the results in a console Window. It uses the Azure Storage Library version 4 that includes the CloudAnalyticsClient class that simplifies accessing the metrics tables in storage.

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
        // (StartsWith is not supported using LINQ with Azure table storage)
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

## What charges do you incur when you enable storage metrics?
Write requests to create table entities for metrics are charged at the standard rates applicable to all Azure Storage operations.

Read and delete requests by a client to metrics data are also billable at standard rates. If you have configured a data retention policy, you are not charged when Azure Storage deletes old metrics data. However, if you delete analytics data, your account is charged for the delete operations.

The capacity used by the metrics tables is also billable: you can use the following to estimate the amount of capacity used for storing metrics data:

* If each hour a service utilizes every API in every service, then approximately 148KB of data is stored every hour in the metrics transaction tables if you have enabled both service and API level summary.
* If each hour a service utilizes every API in every service, then approximately 12KB of data is stored every hour in the metrics transaction tables if you have enabled just service level summary.
* The capacity table for blobs has two rows added each day (provided user has opted in for logs): this implies that every day the size of this table increases by up to approximately 300 bytes.

## Next steps
[Enabling Storage Logging and Accessing Log Data](/rest/api/storageservices/Enabling-Storage-Logging-and-Accessing-Log-Data)
