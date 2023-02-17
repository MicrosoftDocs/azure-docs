---
title: Continuous export of telemetry from Application Insights | Microsoft Docs
description: Export diagnostic and usage data to storage in Azure and download it from there.
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: references_regions
ms.reviewer: mmcc
---

# Export telemetry from Application Insights
Do you want to keep your telemetry for longer than the standard retention period? Or do you want to process it in some specialized way? Continuous export is ideal for this purpose. The events you see in the Application Insights portal can be exported to storage in Azure in JSON format. From there, you can download your data and write whatever code you need to process it.

> [!IMPORTANT]
> * On February 29, 2024, continuous export will be deprecated as part of the classic Application Insights deprecation.
> * When you [migrate to a workspace-based Application Insights resource](convert-classic-resource.md), you must use [diagnostic settings](#diagnostic-settings-based-export) for exporting telemetry. All [workspace-based Application Insights resources](./create-workspace-resource.md) must use [diagnostic settings](./create-workspace-resource.md#export-telemetry).
> * Diagnostic settings export might increase costs. For more information, see [Diagnostic settings-based export](export-telemetry.md#diagnostic-settings-based-export).

Before you set up continuous export, there are some alternatives you might want to consider:

* The **Export** button at the top of a metrics or search tab lets you transfer tables and charts to an Excel spreadsheet.
* [Log Analytics](../logs/log-query-overview.md) provides a powerful query language for telemetry. It can also export results.
* If you're looking to [explore your data in Power BI](../logs/log-powerbi.md), you can do that without using continuous export if you've [migrated to a workspace-based resource](convert-classic-resource.md).
* The [Data Access REST API](/rest/api/application-insights/) lets you access your telemetry programmatically.
* You can also access setup for [continuous export via PowerShell](/powershell/module/az.applicationinsights/new-azapplicationinsightscontinuousexport).

After continuous export copies your data to storage, where it can stay as long as you like, it's still available in Application Insights for the usual [retention period](./data-retention-privacy.md).

## Supported regions

Continuous export is supported in the following regions:

* Southeast Asia
* Canada Central
* Central India
* North Europe
* UK South
* Australia East
* Japan East
* Korea Central
* France Central
* East Asia
* West US
* Central US
* East US 2
* South Central US
* West US 2
* South Africa North
* North Central US
* Brazil South
* Switzerland North
* Australia Southeast
* UK West
* Germany West Central
* Switzerland West
* Australia Central 2
* UAE Central
* Brazil Southeast
* Australia Central
* UAE North
* Norway East
* Japan West

> [!NOTE]
> Continuous export will continue to work for applications in East US and West Europe if the export was configured before February 23, 2021. New continuous export rules can't be configured on any application in East US or West Europe, no matter when the application was created.

## Continuous export advanced storage configuration

Continuous export *doesn't support* the following Azure Storage features or configurations:

* Use of [Azure Virtual Network/Azure Storage firewalls](../../storage/common/storage-network-security.md) with Azure Blob Storage.
* [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md).

## <a name="setup"></a> Create a continuous export

> [!NOTE]
> An application can't export more than 3 TB of data per day. If more than 3 TB per day is exported, the export will be disabled. To export without a limit, use [diagnostic settings-based export](#diagnostic-settings-based-export).

1. In the Application Insights resource for your app under **Configure** on the left, open **Continuous export** and select **Add**.

1. Choose the telemetry data types you want to export.

1. Create or select an [Azure Storage account](../../storage/common/storage-introduction.md) where you want to store the data. For more information on storage pricing options, see the [Pricing page](https://azure.microsoft.com/pricing/details/storage/).

     Select **Add** > **Export destination** > **Storage account**. Then either create a new store or choose an existing store.

    > [!Warning]
    > By default, the storage location will be set to the same geographical region as your Application Insights resource. If you store in a different region, you might incur transfer charges.

1. Create or select a container in the storage.

> [!NOTE]
> After you've created your export, newly ingested data will begin to flow to Azure Blob Storage. Continuous export only transmits new telemetry that's created or ingested after continuous export was enabled. Any data that existed prior to enabling continuous export won't be exported. There's no supported way to retroactively export previously created data by using continuous export.

There can be a delay of about an hour before data appears in the storage.

After the first export is finished, you'll find the following structure in your Blob Storage container. (This structure varies depending on the data you're collecting.)

|Name | Description |
|:----|:------|
| [Availability](#availability) | Reports [availability web tests](./availability-overview.md).  |
| [Event](#events) | Custom events generated by [TrackEvent()](./api-custom-events-metrics.md#trackevent).
| [Exceptions](#exceptions) |Reports [exceptions](./asp-net-exceptions.md) in the server and in the browser.
| [Messages](#trace-messages) | Sent by [TrackTrace](./api-custom-events-metrics.md#tracktrace), and by the [logging adapters](./asp-net-trace-logs.md).
| [Metrics](#metrics) | Generated by metric API calls.
| [PerformanceCounters](#application-insights-export-data-model) | Performance Counters collected by Application Insights.
| [Requests](#requests)| Sent by [TrackRequest](./api-custom-events-metrics.md#trackrequest). The standard modules use requests to report server response time, measured at the server.| 

### Edit continuous export

Select **Continuous export** and select the storage account to edit.

### Stop continuous export

To stop the export, select **Disable**. When you select **Enable** again, the export restarts with new data. You won't get the data that arrived in the portal while export was disabled.

To stop the export permanently, delete it. Doing so doesn't delete your data from storage.

### Can't add or change an export?

To add or change exports, you need Owner, Contributor, or Application Insights Contributor access rights. [Learn about roles][roles].

## <a name="analyze"></a> What events do you get?
The exported data is the raw telemetry we receive from your application with added location data from the client IP address.

Data that has been discarded by [sampling](./sampling.md) isn't included in the exported data.

Other calculated metrics aren't included. For example, we don't export average CPU utilization, but we do export the raw telemetry from which the average is computed.

The data also includes the results of any [availability web tests](./app-insights-overview.md) that you have set up.

> [!NOTE]
> If your application sends a lot of data, the sampling feature might operate and send only a fraction of the generated telemetry. [Learn more about sampling.](./sampling.md)
>

## <a name="get"></a> Inspect the data
You can inspect the storage directly in the portal. Select **Home** on the leftmost menu. At the top where it says **Azure services**, select **Storage accounts**. Select the storage account name, and on the **Overview** page select **Services** > **Blobs**. Finally, select the container name.

To inspect Azure Storage in Visual Studio, select **View** > **Cloud Explorer**. If you don't have that menu command, you need to install the Azure SDK. Open the **New Project** dialog, expand **Visual C#/Cloud**, and select **Get Microsoft Azure SDK for .NET**.

When you open your blob store, you'll see a container with a set of blob files. You'll see the URI of each file derived from your Application Insights resource name, its instrumentation key, and telemetry type, date, and time. The resource name is all lowercase, and the instrumentation key omits dashes.

![Screenshot that shows inspecting the blob store with a suitable tool.](./media/export-telemetry/04-data.png)

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

The date and time are UTC and are when the telemetry was deposited in the store, not the time it was generated. For this reason, if you write code to download the data, it can move linearly through the data.

Here's the form of the path:

```console
$"{applicationName}_{instrumentationKey}/{type}/{blobDeliveryTimeUtc:yyyy-MM-dd}/{ blobDeliveryTimeUtc:HH}/{blobId}_{blobCreationTimeUtc:yyyyMMdd_HHmmss}.blob"
```

Where:

* `blobCreationTimeUtc` is the time when the blob was created in the internal staging storage.
* `blobDeliveryTimeUtc` is the time when the blob is copied to the export destination storage.

## <a name="format"></a> Data format

The data is formatted so that:

* Each blob is a text file that contains multiple `\n`-separated rows. It contains the telemetry processed over a time period of roughly half a minute.
* Each row represents a telemetry data point, such as a request or page view.
* Each row is an unformatted JSON document. If you want to view the rows, open the blob in Visual Studio and select **Edit** > **Advanced** > **Format File**.

   ![Screenshot that shows viewing the telemetry with a suitable tool](./media/export-telemetry/06-json.png)

Time durations are in ticks, where 10 000 ticks = 1 ms. For example, these values show a time of 1 ms to send a request from the browser, 3 ms to receive it, and 1.8 s to process the page in the browser:

```json
"sendRequest": {"value": 10000.0},
"receiveRequest": {"value": 30000.0},
"clientProcess": {"value": 17970000.0}
```

For a detailed data model reference for the property types and values, see [Application Insights export data model](#application-insights-export-data-model).

## Process the data
On a small scale, you can write some code to pull apart your data and read it into a spreadsheet. For example:

```csharp
private IEnumerable<T> DeserializeMany<T>(string folderName)
{
   var files = Directory.EnumerateFiles(folderName, "*.blob", SearchOption.AllDirectories);
   foreach (var file in files)
   {
      using (var fileReader = File.OpenText(file))
      {
         string fileContent = fileReader.ReadToEnd();
         IEnumerable<string> entities = fileContent.Split('\n').Where(s => !string.IsNullOrWhiteSpace(s));
         foreach (var entity in entities)
         {
            yield return JsonConvert.DeserializeObject<T>(entity);
         }
      }
   }
}
```

For a larger code sample, see [Using a worker role][exportasa].

## <a name="delete"></a>Delete your old data
You're responsible for managing your storage capacity and deleting old data, if necessary.

## Regenerate your storage key
If you change the key to your storage, continuous export will stop working. You'll see a notification in your Azure account.

Select the **Continuous Export** tab and edit your export. Edit the**Export Destination** value, but leave the same storage selected. Select **OK** to confirm.

Continuous export will restart.

## Export samples

For export samples, see:

* [Export to SQL using Stream Analytics][exportasa]
* [Stream Analytics sample 2](../../stream-analytics/app-insights-export-stream-analytics.md)

On larger scales, consider [HDInsight](https://azure.microsoft.com/services/hdinsight/) Hadoop clusters in the cloud. HDInsight provides various technologies for managing and analyzing big data. You can use it to process data that's been exported from Application Insights.

## Frequently asked questions

This section provides answers to common questions.

### Can I get a one-time download of a chart?

You can do that. At the top of the tab, select **Export Data**.

### I set up an export, but why is there no data in my store?

Did Application Insights receive any telemetry from your app since you set up the export? You'll only receive new data.

### I tried to set up an export, but why was I denied access?

If the account is owned by your organization, you have to be a member of the Owners or Contributors groups.

### Can I export straight to my own on-premises store?

No. Our export engine currently only works with Azure Storage at this time.

### Is there any limit to the amount of data you put in my store?

No. We'll keep pushing data in until you delete the export. We'll stop if we hit the outer limits for Blob Storage, but that limit is huge. It's up to you to control how much storage you use.

### How many blobs should I see in the storage?

  * For every data type you selected to export, a new blob is created every minute, if data is available.
  * For applications with high traffic, extra partition units are allocated. In this case, each unit creates a blob every minute.

### I regenerated the key to my storage, or changed the name of the container, but why doesn't the export  work?

Edit the export and select the **Export destination** tab. Leave the same storage selected as before, and select **OK** to confirm. Export will restart. If the change was within the past few days, you won't lose data.

### Can I pause the export?

Yes. Select **Disable**.

## Code samples

* [Stream Analytics sample](../../stream-analytics/app-insights-export-stream-analytics.md)
* [Export to SQL by using Stream Analytics][exportasa]
* [Detailed data model reference for property types and values](#application-insights-export-data-model)

## Diagnostic settings-based export

Diagnostic settings export is preferred because it provides extra features:
 > [!div class="checklist"]
 > * Azure Storage accounts with virtual networks, firewalls, and private links.
 > * Export to Azure Event Hubs.

Diagnostic settings export further differs from continuous export in the following ways:
* Updated schema.
* Telemetry data is sent as it arrives instead of in batched uploads.

 > [!IMPORTANT]
 > Extra costs might be incurred because of an increase in calls to the destination, such as a storage account.

To migrate to diagnostic settings export:

1. Disable current continuous export.
1. [Migrate application to workspace based](convert-classic-resource.md).
1. [Enable diagnostic settings export](create-workspace-resource.md#export-telemetry). Select **Diagnostic settings** > **Add diagnostic setting** from within your Application Insights resource.

> [!CAUTION]
> If you want to store diagnostic logs in a Log Analytics workspace, there are two points to consider to avoid seeing duplicate data in Application Insights:
>
> * The destination can't be the same Log Analytics workspace that your Application Insights resource is based on.
> * The Application Insights user can't have access to both workspaces. Set the Log Analytics [access control mode](../logs/log-analytics-workspace-overview.md#permissions) to **Requires workspace permissions**. Through [Azure role-based access control](./resources-roles-access-control.md), ensure the user only has access to the Log Analytics workspace the Application Insights resource is based on.
>
> These steps are necessary because Application Insights accesses telemetry across Application Insight resources, including Log Analytics workspaces, to provide complete end-to-end transaction operations and accurate application maps. Because diagnostic logs use the same table names, duplicate telemetry can be displayed if the user has access to multiple resources that contain the same data.

## Application Insights Export Data Model
This table lists the properties of telemetry sent from the [Application Insights](./app-insights-overview.md) SDKs to the portal.
You'll see these properties in data output from [Continuous Export](export-telemetry.md).
They also appear in property filters in [Metric Explorer](../essentials/metrics-charts.md) and [Diagnostic Search](./diagnostic-search.md).

Points to note:

* `[0]` in these tables denotes a point in the path where you have to insert an index; but it isn't always 0.
* Time durations are in tenths of a microsecond, so 10000000 == 1 second.
* Dates and times are UTC, and are given in the ISO format `yyyy-MM-DDThh:mm:ss.sssZ`

### Example

```json
// A server report about an HTTP request
{
  "request": [
    {
      "urlData": { // derived from 'url'
        "host": "contoso.org",
        "base": "/",
        "hashTag": ""
      },
      "responseCode": 200, // Sent to client
      "success": true, // Default == responseCode<400
      // Request id becomes the operation id of child events
      "id": "fCOhCdCnZ9I=",  
      "name": "GET Home/Index",
      "count": 1, // 100% / sampling rate
      "durationMetric": {
        "value": 1046804.0, // 10000000 == 1 second
        // Currently the following fields are redundant:
        "count": 1.0,
        "min": 1046804.0,
        "max": 1046804.0,
        "stdDev": 0.0,
        "sampledValue": 1046804.0
      },
      "url": "/"
    }
  ],
  "internal": {
    "data": {
      "id": "7f156650-ef4c-11e5-8453-3f984b167d05",
      "documentVersion": "1.61"
    }
  },
  "context": {
    "device": { // client browser
      "type": "PC",
      "screenResolution": { },
      "roleInstance": "WFWEB14B.fabrikam.net"
    },
    "application": { },
    "location": { // derived from client ip
      "continent": "North America",
      "country": "United States",
      // last octagon is anonymized to 0 at portal:
      "clientip": "168.62.177.0",
      "province": "",
      "city": ""
    },
    "data": {
      "isSynthetic": true, // we identified source as a bot
      // percentage of generated data sent to portal:
      "samplingRate": 100.0,
      "eventTime": "2016-03-21T10:05:45.7334717Z" // UTC
    },
    "user": {
      "isAuthenticated": false,
      "anonId": "us-tx-sn1-azr", // bot agent id
      "anonAcquisitionDate": "0001-01-01T00:00:00Z",
      "authAcquisitionDate": "0001-01-01T00:00:00Z",
      "accountAcquisitionDate": "0001-01-01T00:00:00Z"
    },
    "operation": {
      "id": "fCOhCdCnZ9I=",
      "parentId": "fCOhCdCnZ9I=",
      "name": "GET Home/Index"
    },
    "cloud": { },
    "serverDevice": { },
    "custom": { // set by custom fields of track calls
      "dimensions": [ ],
      "metrics": [ ]
    },
    "session": {
      "id": "65504c10-44a6-489e-b9dc-94184eb00d86",
      "isFirst": true
    }
  }
}
```

### Context
All types of telemetry are accompanied by a context section. Not all of these fields are transmitted with every data point.

| Path | Type | Notes |
| --- | --- | --- |
| context.custom.dimensions [0] |object [ ] |Key-value string pairs set by custom properties parameter. Key max length 100, values max length 1024. More than 100 unique values, the property can be searched but cannot be used for segmentation. Max 200 keys per ikey. |
| context.custom.metrics [0] |object [ ] |Key-value pairs set by custom measurements parameter and by TrackMetrics. Key max length 100, values may be numeric. |
| context.data.eventTime |string |UTC |
| context.data.isSynthetic |boolean |Request appears to come from a bot or web test. |
| context.data.samplingRate |number |Percentage of telemetry generated by the SDK that is sent to portal. Range 0.0-100.0. |
| context.device |object |Client device |
| context.device.browser |string |IE, Chrome, ... |
| context.device.browserVersion |string |Chrome 48.0, ... |
| context.device.deviceModel |string | |
| context.device.deviceName |string | |
| context.device.id |string | |
| context.device.locale |string |en-GB, de-DE, ... |
| context.device.network |string | |
| context.device.oemName |string | |
| context.device.os |string | |
| context.device.osVersion |string |Host OS |
| context.device.roleInstance |string |ID of server host |
| context.device.roleName |string | |
| context.device.screenResolution |string | |
| context.device.type |string |PC, Browser, ... |
| context.location |object |Derived from `clientip`. |
| context.location.city |string |Derived from `clientip`, if known |
| context.location.clientip |string |Last octagon is anonymized to 0. |
| context.location.continent |string | |
| context.location.country |string | |
| context.location.province |string |State or province |
| context.operation.id |string |Items that have the same `operation id` are shown as Related Items in the portal. Usually the `request id`. |
| context.operation.name |string |url or request name |
| context.operation.parentId |string |Allows nested related items. |
| context.session.id |string |`Id` of a group of operations from the same source. A period of 30 minutes without an operation signals the end of a session. |
| context.session.isFirst |boolean | |
| context.user.accountAcquisitionDate |string | |
| context.user.accountId |string | |
| context.user.anonAcquisitionDate |string | |
| context.user.anonId |string | |
| context.user.authAcquisitionDate |string |[Authenticated User](./api-custom-events-metrics.md#authenticated-users) |
| context.user.authId |string | |
| context.user.isAuthenticated |boolean | |
| context.user.storeRegion |string | |
| internal.data.documentVersion |string | |
| internal.data.id |string | `Unique id` that is assigned when an item is ingested to Application Insights |

### Events
Custom events generated by [TrackEvent()](./api-custom-events-metrics.md#trackevent).

| Path | Type | Notes |
| --- | --- | --- |
| event [0] count |integer |100/([sampling](./sampling.md) rate). For example 4 =&gt; 25%. |
| event [0] name |string |Event name.  Max length 250. |
| event [0] url |string | |
| event [0] urlData.base |string | |
| event [0] urlData.host |string | |

### Exceptions
Reports [exceptions](./asp-net-exceptions.md) in the server and in the browser.

| Path | Type | Notes |
| --- | --- | --- |
| basicException [0] assembly |string | |
| basicException [0] count |integer |100/([sampling](./sampling.md) rate). For example 4 =&gt; 25%. |
| basicException [0] exceptionGroup |string | |
| basicException [0] exceptionType |string | |
| basicException [0] failedUserCodeMethod |string | |
| basicException [0] failedUserCodeAssembly |string | |
| basicException [0] handledAt |string | |
| basicException [0] hasFullStack |boolean | |
| basicException [0] `id` |string | |
| basicException [0] method |string | |
| basicException [0] message |string |Exception message. Max length 10k. |
| basicException [0] outerExceptionMessage |string | |
| basicException [0] outerExceptionThrownAtAssembly |string | |
| basicException [0] outerExceptionThrownAtMethod |string | |
| basicException [0] outerExceptionType |string | |
| basicException [0] outerId |string | |
| basicException [0] parsedStack [0] assembly |string | |
| basicException [0] parsedStack [0] fileName |string | |
| basicException [0] parsedStack [0] level |integer | |
| basicException [0] parsedStack [0] line |integer | |
| basicException [0] parsedStack [0] method |string | |
| basicException [0] stack |string |Max length 10k |
| basicException [0] typeName |string | |

### Trace Messages
Sent by [TrackTrace](./api-custom-events-metrics.md#tracktrace), and by the [logging adapters](./asp-net-trace-logs.md).

| Path | Type | Notes |
| --- | --- | --- |
| message [0] loggerName |string | |
| message [0] parameters |string | |
| message [0] raw |string |The log message, max length 10k. |
| message [0] severityLevel |string | |

### Remote dependency
Sent by TrackDependency. Used to report performance and usage of [calls to dependencies](./asp-net-dependencies.md) in the server, and AJAX calls in the browser.

| Path | Type | Notes |
| --- | --- | --- |
| remoteDependency [0] async |boolean | |
| remoteDependency [0] baseName |string | |
| remoteDependency [0] commandName |string |For example "home/index" |
| remoteDependency [0] count |integer |100/([sampling](./sampling.md) rate). For example 4 =&gt; 25%. |
| remoteDependency [0] dependencyTypeName |string |HTTP, SQL, ... |
| remoteDependency [0] durationMetric.value |number |Time from call to completion of response by dependency |
| remoteDependency [0] `id` |string | |
| remoteDependency [0] name |string |Url. Max length 250. |
| remoteDependency [0] resultCode |string |from HTTP dependency |
| remoteDependency [0] success |boolean | |
| remoteDependency [0] type |string |Http, Sql,... |
| remoteDependency [0] url |string |Max length 2000 |
| remoteDependency [0] urlData.base |string |Max length 2000 |
| remoteDependency [0] urlData.hashTag |string | |
| remoteDependency [0] urlData.host |string |Max length 200 |

### Requests
Sent by [TrackRequest](./api-custom-events-metrics.md#trackrequest). The standard modules use this to reports server response time, measured at the server.

| Path | Type | Notes |
| --- | --- | --- |
| request [0] count |integer |100/([sampling](./sampling.md) rate). For example: 4 =&gt; 25%. |
| request [0] durationMetric.value |number |Time from request arriving to response. 1e7 == 1s |
| request [0] `id` |string |`Operation id` |
| request [0] name |string |GET/POST + url base.  Max length 250 |
| request [0] responseCode |integer |HTTP response sent to client |
| request [0] success |boolean |Default == (responseCode &lt; 400) |
| request [0] url |string |Not including host |
| request [0] urlData.base |string | |
| request [0] urlData.hashTag |string | |
| request [0] urlData.host |string | |

### Page View Performance
Sent by the browser. Measures the time to process a page, from user initiating the request to display complete (excluding async AJAX calls).

Context values show client OS and browser version.

| Path | Type | Notes |
| --- | --- | --- |
| clientPerformance [0] clientProcess.value |integer |Time from end of receiving the HTML to displaying the page. |
| clientPerformance [0] name |string | |
| clientPerformance [0] networkConnection.value |integer |Time taken to establish a network connection. |
| clientPerformance [0] receiveRequest.value |integer |Time from end of sending the request to receiving the HTML in reply. |
| clientPerformance [0] sendRequest.value |integer |Time from taken to send the HTTP request. |
| clientPerformance [0] total.value |integer |Time from starting to send the request to displaying the page. |
| clientPerformance [0] url |string |URL of this request |
| clientPerformance [0] urlData.base |string | |
| clientPerformance [0] urlData.hashTag |string | |
| clientPerformance [0] urlData.host |string | |
| clientPerformance [0] urlData.protocol |string | |

### Page Views
Sent by trackPageView() or [stopTrackPage](./api-custom-events-metrics.md#page-views)

| Path | Type | Notes |
| --- | --- | --- |
| view [0] count |integer |100/([sampling](./sampling.md) rate). For example 4 =&gt; 25%. |
| view [0] durationMetric.value |integer |Value optionally set in trackPageView() or by startTrackPage() - stopTrackPage(). Not the same as clientPerformance values. |
| view [0] name |string |Page title.  Max length 250 |
| view [0] url |string | |
| view [0] urlData.base |string | |
| view [0] urlData.hashTag |string | |
| view [0] urlData.host |string | |

### Availability
Reports [availability web tests](./app-insights-overview.md).

| Path | Type | Notes |
| --- | --- | --- |
| availability [0] availabilityMetric.name |string |availability |
| availability [0] availabilityMetric.value |number |1.0 or 0.0 |
| availability [0] count |integer |100/([sampling](./sampling.md) rate). For example 4 =&gt; 25%. |
| availability [0] dataSizeMetric.name |string | |
| availability [0] dataSizeMetric.value |integer | |
| availability [0] durationMetric.name |string | |
| availability [0] durationMetric.value |number |Duration of test. 1e7==1s |
| availability [0] message |string |Failure diagnostic |
| availability [0] result |string |Pass/Fail |
| availability [0] runLocation |string |Geo source of http req |
| availability [0] testName |string | |
| availability [0] testRunId |string | |
| availability [0] testTimestamp |string | |

### Metrics
Generated by TrackMetric().

The metric value is found in context.custom.metrics[0]

For example:

```json
{
  "metric": [ ],
  "context": {
  ...
    "custom": {
      "dimensions": [
        { "ProcessId": "4068" }
      ],
      "metrics": [
        {
          "dispatchRate": {
            "value": 0.001295,
            "count": 1.0,
            "min": 0.001295,
            "max": 0.001295,
            "stdDev": 0.0,
            "sampledValue": 0.001295,
            "sum": 0.001295
          }
        }
      ]  
    }
  }
}
```

### About metric values
Metric values, both in metric reports and elsewhere, are reported with a standard object structure. For example:

```json
"durationMetric": {
  "name": "contoso.org",
  "type": "Aggregation",
  "value": 468.71603053650279,
  "count": 1.0,
  "min": 468.71603053650279,
  "max": 468.71603053650279,
  "stdDev": 0.0,
  "sampledValue": 468.71603053650279
}
```

Currently - though this might change in the future - in all values reported from the standard SDK modules, `count==1` and only the `name` and `value` fields are useful. The only case where they would be different would be if you write your own TrackMetric calls in which you set the other parameters.

The purpose of the other fields is to allow metrics to be aggregated in the SDK, to reduce traffic to the portal. For example, you could average several successive readings before sending each metric report. Then you would calculate the min, max, standard deviation and aggregate value (sum or average) and set count to the number of readings represented by the report.

In the tables above, we have omitted the rarely used fields count, min, max, stdDev, and sampledValue.

Instead of pre-aggregating metrics, you can use [sampling](./sampling.md) if you need to reduce the volume of telemetry.

#### Durations
Except where otherwise noted, durations are represented in tenths of a microsecond, so that 10000000.0 means 1 second.

## See also
* [Application Insights](./app-insights-overview.md)
* [Continuous Export](export-telemetry.md)
* [Code samples](export-telemetry.md#code-samples)

<!--Link references-->

[exportasa]: ../../stream-analytics/app-insights-export-sql-stream-analytics.md
[roles]: ./resources-roles-access-control.md
