---
title: Continuous export of telemetry from Application Insights | Microsoft Docs
description: Export diagnostic and usage data to storage in Azure and download it from there.
ms.topic: conceptual
ms.date: 10/24/2022
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
* The [Data Access REST API](https://dev.applicationinsights.io/) lets you access your telemetry programmatically.
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
| [Availability](export-data-model.md#availability) | Reports [availability web tests](./monitor-web-app-availability.md).  |
| [Event](export-data-model.md#events) | Custom events generated by [TrackEvent()](./api-custom-events-metrics.md#trackevent).
| [Exceptions](export-data-model.md#exceptions) |Reports [exceptions](./asp-net-exceptions.md) in the server and in the browser.
| [Messages](export-data-model.md#trace-messages) | Sent by [TrackTrace](./api-custom-events-metrics.md#tracktrace), and by the [logging adapters](./asp-net-trace-logs.md).
| [Metrics](export-data-model.md#metrics) | Generated by metric API calls.
| [PerformanceCounters](export-data-model.md) | Performance Counters collected by Application Insights.
| [Requests](export-data-model.md#requests)| Sent by [TrackRequest](./api-custom-events-metrics.md#trackrequest). The standard modules use requests to report server response time, measured at the server.| 

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

The data also includes the results of any [availability web tests](./monitor-web-app-availability.md) that you have set up.

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

For a detailed data model reference for the property types and values, see [Application Insights export data model](export-data-model.md).

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

## Q & A

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
* [Detailed data model reference for property types and values](export-data-model.md)

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

<!--Link references-->

[exportasa]: ../../stream-analytics/app-insights-export-sql-stream-analytics.md
[roles]: ./resources-roles-access-control.md
