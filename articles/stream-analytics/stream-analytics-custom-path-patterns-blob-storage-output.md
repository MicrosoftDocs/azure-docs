---
title: Custom Date Time Path Patterns for Blob Storage Output for Azure Stream Analytics (Preview)
description: 
services: stream-analytics
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 09/24/2018
---

# Custom Date Time Path Patterns for Blob Storage Output for Azure Stream Analytics (Preview)

Azure Stream Analytics supports the use of custom date and time format specifiers in the file path for blob storage outputs. Custom DateTime path patterns allow you to specify an output format that aligns with Hive Streaming conventions, allowing Azure Stream Analytics to leverage Azure HDInsight and Azure Databricks for downstream processing. Custom DateTime path patterns is easily implemented by using the `datetime` keyword in the Path Prefix field of your Blob output, along with the desired format specifier. For example, `{datetime:yyyy}`.

Visit [Azure Portal](https://ms.portal.azure.com/?Microsoft_Azure_StreamAnalytics_bloboutputcustomdatetimeformats=true) to toggle to feature flag to enabled to use the custom DateTime path patterns for blob storage output preview.

## Supported tokens

The following format specifier tokens can be used alone or in combination to achieve custom DateTime formats not previously supported:

|Format specifier   |Description   |Results on example time 2018-01-02T10:06:08|
|----------|-----------|------------|
|{datetime:yyyy}|The year as a four-digit number|2018|
|{datetime:MM}|Month from 01 to 12|01|
|{datetime:M}|Month from 1 to 12|1|
|{datetime:dd}|Day from 01 to 31|02|
|{datetime:d}|Day from 1 to 12|2|
|{datetime:HH}|Hour using the 24-hour format, from 00 to 23|10|
|{datetime:mm}|Minutes from 00 to 24|06|
|{datetime:m}|Minutes from 0 to 24|6|
|{datetime:ss}|Seconds from 00 to 60|08|

All old DateTime formats continue to be enabled via the {date} and/or {time} token in the Path Prefix, which enable dropdowns with these options shown below: 

![Stream Analytics old  DateTime formats](./media/stream-analytics-custom-path-patterns-blob-storage-output/stream-analytics-old-date-time-formats.png)

## Extensibility and restrictions

You can use as many tokens, `{datetime:<specifier>}`, in the path pattern up to the Path Prefix character limit. Format specifiers can't be combined within a single token beyond the combinations already enabled by the Date and Time dropdowns supported by the tokens listed above. 

For a desired path partition of ‘logs/MM/dd’:

|logs/{datetime:MM}/{datetime:dd}|Valid expression|
|logs/{datetime:MM/dd}|Invalid expression|

You may use the same format specifier multiple times in the Path Prefix. The token must be repeated each time.

## Alignment with Hive Streaming Conventions

Custom path patterns for blob storage aligns with the Hive Streaming convention which expects folders to be labelled with `column=` in the folder name.

For example, `year={datetime:yyyy}/month={datetime:MM}/day={datetime:dd}/hour={datetime:HH}`.

Azure Stream Analytics support for this custom output eliminates the hassle of altering tables and manually adding partitions to port data between Azure Stream Analytics and Hive. Instead, now many folders can be added automatically using:

```bash
MSCK REPAIR TABLE while hive.exec.dynamic.partition true
```

## Example

A storage account, resource group, Stream Analytics job, and input source were created according to the [Azure Stream Analytics Azure Portal](stream-analytics-quick-create-portal.md) quickstart guide. Sample data used was the same sample data used in the quickstart guide, also available on [Github](https://raw.githubusercontent.com/Azure/azure-stream-analytics/master/Samples/GettingStarted/HelloWorldASA-InputStream.json).

Be sure to set a Custom Start Time for your Azure Stream Analytics job to **2018-01-01**, as specified in the quickstart.

An output sink was created accordingly:

![Stream Analytics create blob output sink](./media/stream-analytics-custom-path-patterns-blob-storage-output/stream-analytics-create-output-sink.png)

The full path pattern is as follows:

```
year={datetime:yyyy}/month={datetime:MM}/day={datetime:dd}
```

Once the job starts running, the desired folder structure is created. Digging down to the day level, we see:

![Stream Analytics blob output with custom path pattern](./media/stream-analytics-custom-path-patterns-blob-storage-output/stream-analytics-blob-output-folder-structure.png)

## Next steps