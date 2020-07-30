---
title: "Quickstart: build your first metrics monitor" 
titleSuffix: Azure Cognitive Services
description: Learn how to build your first metrics monitor. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-monitoring
ms.topic: quickstart
ms.date: 07/30/2020
ms.author: aahi
---

# Quickstart: Build your first Metrics monitor on the web

Metrics Monitor provides a web portal to help you onboard your data and begin using the service. 

Use the portal to:
* Interact with your metrics
* Onboarding your data
* Set up detection configurations
* View time-series visualizations
* Explore diagnostic insights 
* Create alerts and subscriptions 

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* A [Metrics Monitor instance](create-instance.md)
  * You can access the web portal for your instance at: `https://<resource-name>.azurewebsites.net` where `<resource-name>` is the name for your Metrics Monitor resource.

This document uses a SQL Database as an example for creating your first monitor.

## Onboard time series data

Metrics Monitor provides a set of connectors to collect data from various sources such as SQL Database, Azure Data Explorer, and Azure Table Storage. The steps for connecting data are mostly the same across different connectors, although some parameters may vary. This quickstart uses a SQL Database as an example.

To get started, sign into your Metrics Monitor portal, with your Active Directory account. from the landing page, select **Get started**. After the main page of the portal loads, select **Add data feed** from the left menu.

### Configure connection settings

Add the data feed by connecting to your time-series data source. See [How to add data feeds](../how-tos/datafeeds.md) for details on the available parameters.

Start by selecting the following parameters:

* **Source Type**: The type of data source where your time series data is stored.
* **Granularity**: The interval between consecutive data points in your time series data. The options are: Yearly, Monthly, Weekly, Daily, Hourly, and Customize. The lowest interval customization supports is 60 seconds.
* **Ingest data since (UTC)**: The very start time for the first timestamp to be ingested, please ensure data is available after this timestamp.

Next, specify the **Connection string** with your credentials to access data source, and a custom **Query**. The query is used to specify the data to be ingested, and converted into the required schema. For information on the other fields listed here, see [How to add datafeeds](../how-tos/datafeeds.md).

![Connections settings](../media/connection-settings.png)

### Verify the connection and load the data schema

After the connection string and query string are set, select **Verify and get schema** to verify the connection and run the query to get your data schema from the data source. Normally it takes a few seconds depending on your data source connection. If there's an error at this step, confirm that:

1. Your connection string and query are correct.
2. Your Metrics Monitor instance is able to connect to the data source if there are firewall settings.

### Schema configuration

Once the data schema is loaded and shown like below, select the appropriate fields.


|Selection  |Description  |Notes  |
|---------|---------|---------|
|**Timestamp**     | The timestamp of a data point. If omitted, Metrics Monitor will use the timestamp when the data point is ingested instead. For each data feed, you could specify at most one column as timestamp.        | Optional. Should be specified with at most one column.       |
|**Measure**     |  The numeric values in the data feed. For each data feed, you could specify multiple measures but at least one column should be selected as measure.        | Should be specified with at least one column.        |
|**Dimension**     | Categorical values. A combination of different values identifies a particular single-dimension time series, for example: country, language, tenant. You could select none or arbitrary number of columns as dimensions. Note: if you're selecting a non-string column as dimension, be cautious with dimension explosion.
        | Optional.        |
|**Ignore**     | Ignore the selected column.        | See the [Datafeeds](../how-tos/datafeeds.md#schema-configuration) article for more information on this parameter.        |


![Schema configuration](../media/schema-configuration.png)

### Specify a name for onboarded data feed
 
Give a custom name for the data feed, which will be displayed on the portal. Click on **Submit**. 

## Tune detecting configuration

After the data feed is created, Metrics Monitor will attempt to ingest metric data from the specified start date. It will take some time for data to be fully ingested, and you can view the ingestion status by clicking **Ingestion progress** at the top of the data feed page. If data is ingested, Metrics Monitor will apply detection, and continue to monitor the source for new data. See [detection period](../faq.md#what-is-the-relationship-between-granularity-and-detection-period).

When detection is applied, click into one metric listed in data feed, you will be pivoted to metric detail page. At this page, you are able to 
- View visualizations of all time series slices under this metric
- Update detecting configuration to meet expected results
- Set up notification for detected anomalies

![Metric detail](../media/metric-details.png)

## Next Steps

- [Add a data feed](../howto/datafeeds/add-data-feeds-overview.md)
- [Tune detecting configuration](../howto/metrics/tune-detecting-config.md)
