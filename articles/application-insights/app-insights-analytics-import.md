---
title: Import your data to Analytics in Azure Application Insights | Microsoft Docs
description: Import static data to join with app telemetry, or import a separate data stream to query with Analytics.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 12/03/2016
ms.author: awills

---
# Import data into Analytics

Import any tabular data into [Analytics](app-insights-analytics.md), either to join it with [Application Insights](app-insights-overview.md) telemetry from your app, or so that you can analyze it as a separate stream. Analytics is a powerful query language well-suited to analyzing high-volume timestamped streams of telemetry.

You can import data into Analytics using your own schema. It doesn't have to use the standard Application Insights schemas such as request or trace.

Currently, you can import CSV (comma-separated value) files, or similar formats using tab or semicolon separators.

There are three situations where importing to Analytics is useful:

* **Join with app telemetry.** For example, you could import a table that maps URLs from your website to more readable page titles. In Analytics you can create a dashboard chart report that shows the ten most popular pages in your website. Now it can show the page titles instead of the URLs.
* **Correlate your application telemetry** with other sources such as network traffic, server data, or CDN log files.
* **Apply Analytics to a separate data stream.** Application Insights Analytics is a very powerful tool, that works well with sparse, timestamped streams - much better than SQL in many cases. If you have such a stream from some other source, you can analyze it with Analytics.

Sending data to your data source is very easy. 

1. (One time) Define the schema of your data as a 'data source'.
2. (Periodically) Upload your data to Azure storage, and call the REST API to notify us that new data is waiting for ingestion. Within a few minutes the data is available for query in Analytics.

The frequency of the upload is defined by you and how fast would you like your data to be available for queries. It is more efficient to upload data in larger chunks.

## Before you start

You need:

1. An Application Insights resource in Microsoft Azure.

 * If you want to analyze your data separately from any other telemetry, [create a new Application Insights resource](app-insights-create-new-resource.md).
 * If you're joining or comparing your data with telemetry from an app that is already set up with Application Insights, then you can use the resource for that app.
 * You need contributor or owner access to that resource.
 
2. Azure storage. You upload to Azure storage, and Analytics gets your data from there.

2. While this feature is in preview, you need to ask for access.

 * From your Application Insights resource in the [Azure portal](https://portal.azure.com), open Analytics. 
 * At the bottom of the schema pane, click the 'Contact us' link under **Other Data Sources.** 
 * If you see 'Add data source', then you already have access.


## Define your schema

Before you can import data, you need to define a *data source,* which specifies the schema of your data.

1. Start the data source wizard

    ![Add new data source](./media/app-insights-analytics-import/add-new-data-source.png)

2. Follow the instructions to upload a sample data file.

 * The first row of the sample should be column headers.
 * The sample should include at least 20 rows of data.

3. Review the schema that the wizard has inferred from your sample. You can adjust the inferred types of the columns if necessary.

4. Select a Timestamp. All data in Analytics must have a timestamp field. It must have type `datetime`, but it doesn't have to be named 'timestamp'. If your data has a column containing a date and time in a standard format, choose this as the timestamp column. Otherwise, choose "as data arrived", and the import process will add a timestamp field.


    ![Review the schema](./media/app-insights-analytics-import/data-source-review-schema.png)

5. Create the data source.


## Import data

To import data, you upload it to Azure storage, create an access key for it, and then make a REST API call.

![Add new data source](./media/app-insights-analytics-import/analytics-upload-process.png)

You can perform the following process manually, or set up an automated system to do it at regular intervals. You need to follow these steps for each block of data you want to import.

1. Upload the data to Azure blob storage.
2. [Create a Shared Access Signature key for the blob](../storage/storage-dotnet-shared-access-signature-part-2.md). The key should have an expiration period of one day and provide read access.
3. Make a REST call to notify Application Insights that data is waiting.
4. Query your data in Analytics. The data is available after a few minutes.

