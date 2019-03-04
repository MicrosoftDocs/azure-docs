---
title: Continuous export of telemetry from Application Insights | Microsoft Docs
description: Export diagnostic and usage data to storage in Microsoft Azure, and download it from there.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.assetid: 5b859200-b484-4c98-9d9f-929713f1030c
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 02/26/2019
ms.author: mbullwin
---
# Export telemetry from Application Insights
Want to keep your telemetry for longer than the standard retention period? Or process it in some specialized way? Continuous Export is ideal for this. The events you see in the Application Insights portal can be exported to storage in Microsoft Azure in JSON format. From there you can download your data and write whatever code you need to process it.  

Before you set up continuous export, there are some alternatives you might want to consider:

* The Export button at the top of a metrics or search blade lets you transfer tables and charts to an Excel spreadsheet.

* [Analytics](../../azure-monitor/app/analytics.md) provides a powerful query language for telemetry. It can also export results.
* If you're looking to [explore your data in Power BI](../../azure-monitor/app/export-power-bi.md ), you can do that without using Continuous Export.
* The [Data access REST API](https://dev.applicationinsights.io/) lets you access your telemetry programmatically.
* You can also access setup [continuous export via Powershell](https://docs.microsoft.com/powershell/module/az.applicationinsights/new-azapplicationinsightscontinuousexport).

After Continuous Export copies your data to storage (where it can stay for as long as you like), it's still available in Application Insights for the usual [retention period](../../azure-monitor/app/data-retention-privacy.md).

## Continuous Export advanced storage configuration

Continuous Export **does not support** the following Azure storage features/configurations:

* Use of [VNET/Azure Storage firewalls](https://docs.microsoft.com/azure/storage/common/storage-network-security) in conjunction with Azure Blob storage.

* [Immutable storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutable-storage) for Azure Blob storage.

* [Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction).

## <a name="setup"></a> Create a Continuous Export
1. In the Application Insights resource for your app, open Continuous Export and choose **Add**:

2. Choose the telemetry data types you want to export.

3. Create or select an [Azure storage account](../../storage/common/storage-introduction.md) where you want to store the data. For more information on storage pricing options visit the [official pricing page](https://azure.microsoft.com/pricing/details/storage/).

    > [!Warning]
    > By default, the storage location will be set to the same geographical region as your Application Insights resource. If you store in a different region, you may incur transfer charges.

    ![Click Add, Export Destination, Storage account, and then either create a new store or choose an existing store](./media/export-telemetry/02-add.png)

4. Create or select a container in the storage:

    ![Click Choose event types](./media/export-telemetry/create-container.png)

Once you've created your export, it starts going. You only get data that arrives after you create the export.

There can be a delay of about an hour before data appears in the storage.

### To edit continuous export

If you want to change the event types later, just edit the export:

![Click Choose event types](./media/export-telemetry/05-edit.png)

### To stop continuous export

To stop the export, click Disable. When you click Enable again, the export will restart with new data. You won't get the data that arrived in the portal while export was disabled.

To stop the export permanently, delete it. Doing so doesn't delete your data from storage.

### Can't add or change an export?
* To add or change exports, you need Owner, Contributor or Application Insights Contributor access rights. [Learn about roles][roles].

## <a name="analyze"></a> What events do you get?
The exported data is the raw telemetry we receive from your application, except that we add location data which we calculate from the client IP address.

Data that has been discarded by [sampling](../../azure-monitor/app/sampling.md) is not included in the exported data.

Other calculated metrics are not included. For example, we don't export average CPU utilization, but we do export the raw telemetry from which the average is computed.

The data also includes the results of any [availability web tests](../../azure-monitor/app/monitor-web-app-availability.md) that you have set up.

> [!NOTE]
> **Sampling.** If your application sends a lot of data, the sampling feature may operate and send only a fraction of the generated telemetry. [Learn more about sampling.](../../azure-monitor/app/sampling.md)
>
>

## <a name="get"></a> Inspect the data
You can inspect the storage directly in the portal. Click **Browse**, select your storage account, and then open **Containers**.

To inspect Azure storage in Visual Studio, open **View**, **Cloud Explorer**. (If you don't have that menu command, you need to install the Azure SDK: Open the **New Project** dialog, expand Visual C#/Cloud and choose **Get Microsoft Azure SDK for .NET**.)

When you open your blob store, you'll see a container with a set of blob files. The URI of each file derived from your Application Insights resource name, its instrumentation key, telemetry-type/date/time. (The resource name is all lowercase, and the instrumentation key omits dashes.)

![Inspect the blob store with a suitable tool](./media/export-telemetry/04-data.png)

The date and time are UTC and are when the telemetry was deposited in the store - not the time it was generated. So if you write code to download the data, it can move linearly through the data.

Here's the form of the path:

    $"{applicationName}_{instrumentationKey}/{type}/{blobDeliveryTimeUtc:yyyy-MM-dd}/{ blobDeliveryTimeUtc:HH}/{blobId}_{blobCreationTimeUtc:yyyyMMdd_HHmmss}.blob"

Where

* `blobCreationTimeUtc` is time when blob was created in the internal staging storage
* `blobDeliveryTimeUtc` is the time when blob is copied to the export destination storage

## <a name="format"></a> Data format
* Each blob is a text file that contains multiple '\n'-separated rows. It contains the telemetry processed over a time period of roughly half a minute.
* Each row represents a telemetry data point such as a request or page view.
* Each row is an unformatted JSON document. If you want to sit and stare at it, open it in Visual Studio and choose Edit, Advanced, Format File:

![View the telemetry with a suitable tool](./media/export-telemetry/06-json.png)

Time durations are in ticks, where 10 000 ticks = 1 ms. For example, these values show a time of 1 ms to send a request from the browser, 3 ms to receive it, and 1.8 s to process the page in the browser:

    "sendRequest": {"value": 10000.0},
    "receiveRequest": {"value": 30000.0},
    "clientProcess": {"value": 17970000.0}

[Detailed data model reference for the property types and values.](export-data-model.md)

## Processing the data
On a small scale, you can write some code to pull apart your data, read it into a spreadsheet, and so on. For example:

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

For a larger code sample, see [using a worker role][exportasa].

## <a name="delete"></a>Delete your old data
You are responsible for managing your storage capacity and deleting the old data if necessary.

## If you regenerate your storage key...
If you change the key to your storage, continuous export will stop working. You'll see a notification in your Azure account.

Open the Continuous Export blade and edit your export. Edit the Export Destination, but just leave the same storage selected. Click OK to confirm.

![Edit the continuous export, open and close thee export destination.](./media/export-telemetry/07-resetstore.png)

The continuous export will restart.

## Export samples

* [Export to SQL using Stream Analytics][exportasa]
* [Stream Analytics sample 2](export-stream-analytics.md)

On larger scales, consider [HDInsight](https://azure.microsoft.com/services/hdinsight/) - Hadoop clusters in the cloud. HDInsight provides a variety of technologies for managing and analyzing big data, and you could use it to process data that has been exported from Application Insights.

## Q & A
* *But all I want is a one-time download of a chart.*  

    Yes, you can do that. At the top of the blade, click **Export Data**.
* *I set up an export, but there's no data in my store.*

    Did Application Insights receive any telemetry from your app since you set up the export? You'll only receive new data.
* *I tried to set up an export, but was denied access*

    If the account is owned by your organization, you have to be a member of the owners or contributors groups.
* *Can I export straight to my own on-premises store?*

    No, sorry. Our export engine currently only works with Azure storage at this time.  
* *Is there any limit to the amount of data you put in my store?*

    No. We'll keep pushing data in until you delete the export. We'll stop if we hit the outer limits for blob storage, but that's pretty huge. It's up to you to control how much storage you use.  
* *How many blobs should I see in the storage?*

  * For every data type you selected to export, a new blob is created every minute (if data is available).
  * In addition, for applications with high traffic, additional partition units are allocated. In this case, each unit creates a blob every minute.
* *I regenerated the key to my storage or changed the name of the container, and now the export doesn't work.*

    Edit the export and open the export destination blade. Leave the same storage selected as before, and click OK to confirm. Export will restart. If the change was within the past few days, you won't lose data.
* *Can I pause the export?*

    Yes. Click Disable.

## Code samples

* [Stream Analytics sample](export-stream-analytics.md)
* [Export to SQL using Stream Analytics][exportasa]
* [Detailed data model reference for the property types and values.](export-data-model.md)

<!--Link references-->

[exportasa]: ../../azure-monitor/app/code-sample-export-sql-stream-analytics.md
[roles]: ../../azure-monitor/app/resources-roles-access-control.md
