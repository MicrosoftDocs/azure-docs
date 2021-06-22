---
title: 'Quickstart: Metrics Advisor web portal'
titleSuffix: Azure Cognitive Services
description: Learn how to start using the Metrics Advisor web portal.
services: cognitive-services
author: mrbullwinkle
ms.author: mbullwin
manager: nitinme
ms.date: 09/30/2020
ms.topic: quickstart
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.custom:
  - mode-portal
---

# Quickstart: Monitor your first metric using the web portal

When you provision a Metrics Advisor instance, you can use the APIs and web-based workspace to work with the service. The web-based workspace can be used as a straightforward way to quickly get started with the service. It also provides a visual way to configure settings, customize your model, and perform root cause analysis. 

* Onboard your metric data
* View your metrics and visualizations
* Fine-tune detection configurations
* Explore diagnostic insights
* Create and subscribe to anomaly alerts

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  

    
> [!TIP]
> * It may 10 to 30 minutes for your Metrics Advisor resource to deploy. Select **Go to resource** once it successfully deploys.
> * If you'd like to use the REST API to interact with the service, you will need the key and endpoint from the resource you create. You can find them in the  **Keys and endpoints** tab in the created resource.


This document uses a SQL Database as an example for creating your first monitor.

## Sign in to your workspace

After your resource is created, sign in to [Metrics Advisor portal](https://go.microsoft.com/fwlink/?linkid=2143774) with your Active Directory account. From the landing page, select your **Directory**, **Subscription** and **Workspace** that just created, then select **Get started**. For onboarding time series data, select **Add data feed** from the left menu.

 
Currently you can create one Metrics Advisor resource at each available region. You can switch workspaces in Metrics Advisor portal at any time.


## Onboard time series data

Metrics Advisor provides connectors for different data sources, such as SQL Database, Azure Data Explorer, and Azure Table Storage. The steps for connecting data are similar for different connectors, although some configuration parameters may vary. See [connect data different data feed sources](../data-feeds-from-different-sources.md) for different data connection settings.

This quickstart uses a SQL Database as an example. You can also ingest your own data follow the same steps.


### Data schema requirements and configuration

[!INCLUDE [data schema requirements](../includes/data-schema-requirements.md)]

### Configure connection settings and query

[Add the data feeds](../how-tos/onboard-your-data.md) by connecting to your time series data source. Start by selecting the following parameters:

* **Source Type**: The type of data source where your time series data is stored.
* **Granularity**: The interval between consecutive data points in your time series data, for example Yearly, Monthly, Daily. The lowest interval customization supports is 60 seconds.
* **Ingest data since (UTC)**: The start time for the first timestamp to be ingested. 


<!-- Next, specify the **Connection string** with the credentials for your data source, and a custom **Query**, see [how to write a valid query](../tutorials/write-a-valid-query.md) for more information. -->

:::image type="content" source="../media/connection-settings.png" alt-text="Connection settings" lightbox="../media/connection-settings.png":::


### Load data

After the connection string and query string are inputted, select **Load data**. Within this operation, Metrics Advisor will check connection and permission to load data, check necessary parameters (@IntervalStart and @IntervalEnd) which need to be used in query, and check the column name from data source. 

If there's an error at this step:
1. First check if the connection string is valid. 
2. Then confirm that there's sufficient permissions and that the ingestion worker IP address is granted access.
3. Next check if the required parameters (@IntervalStart and @IntervalEnd) are used in your query. 

### Schema configuration

Once the data is loaded by running the query and shown like below, select the appropriate fields.


|Selection  |Description  |Notes  |
|---------|---------|---------|
|**Timestamp**     | The timestamp of a data point. If omitted, Metrics Advisor will use the timestamp when the data point is ingested instead. For each data feed, you could specify at most one column as timestamp.        | Optional. Should be specified with at most one column.       |
|**Measure**     |  The numeric values in the data feed. For each data feed, you could specify multiple measures but at least one column should be selected as measure.        | Should be specified with at least one column.        |
|**Dimension**     | Categorical values. A combination of different values identifies a particular single-dimension time series, for example: country, language, tenant. You could select none or arbitrary number of columns as dimensions. Note: if you're selecting a non-string column as dimension, be cautious with dimension explosion. | Optional.        |
|**Ignore**     | Ignore the selected column.        | Optional. For data sources support using a query to get data, there is no 'Ignore' option.       |


:::image type="content" source="../media/schema-configuration.png" alt-text="Schema configuration" lightbox="../media/schema-configuration.png":::

After configuring the schema, select **Verify schema**. Within this operation, Metrics Advisor will perform following checks:
- Whether timestamp of queried data falls into one single interval. 
- Whether there's duplicate values returned for the same dimension combination within one metric interval.  

### Automatic roll up settings

> [!IMPORTANT]
> If you'd like to enable **root cause analysis** and other diagnostic capabilities, 'automatic roll up setting' needs to be configured. 
> Once enabled, the automatic roll up settings cannot be changed.

Metrics Advisor can automatically perform aggregation(SUM/MAX/MIN...) on each dimension during ingestion, then builds a hierarchy, which will be used in root case analysis and other diagnostic features. See [Automatic roll up settings](../how-tos/onboard-your-data.md#automatic-roll-up-settings) for more details.

Give a custom name for the data feed, which will be displayed in your workspace. Select **Submit**. 

## Tune detection configuration

After the data feed is added, Metrics Advisor will attempt to ingest metric data from the specified start date. It will take some time for data to be fully ingested, and you can view the ingestion status by selecting **Ingestion progress** at the top of the data feed page. If data is ingested, Metrics Advisor will apply detection, and continue to monitor the source for new data.

When detection is applied, select one of the metrics listed in data feed to find the **Metric detail page** to: 
- View visualizations of all time series' slices under this metric
- Update detection configuration to meet expected results
- Set up notification for detected anomalies

:::image type="content" source="../media/metric-details.png" alt-text="Metric details" lightbox="../media/metric-details.png":::

## View the diagnostic insights

After tuning the detection configuration, anomalies that are found should reflect actual anomalies in your data. Metrics Advisor performs analysis on multi-dimensional metrics to locate root cause into specific dimension and also cross-metrics analysis by using "Metrics graph". 

To view the diagnostic insights, select the red dots on time series visualizations, which represent detected anomalies. A window will appear with a link to incident analysis page. 

:::image type="content" source="../media/incident-link.png" alt-text="Incident link" lightbox="../media/incident-link.png":::

After selecting the link, you will be pivoted to the incident analysis page, which analyzes on a group of related anomalies with a bunch of diagnostics insights. There're 3 major steps to diagnose an incident:

### Check summary of current incident

At the top, there will be a summary including basic information, actions & tracings and an analyzed root cause. Basic information includes the "top impacted series" with a diagram, "impact start & end time", "incident severity" and "total anomalies included".

Analyzed root cause is an automatic analyzed result. Metrics Advisor analyzes on all anomalies that captured on time series within one metric with different dimension values at the same timestamp. Then performs correlation, clustering to group related anomalies together and generates a root cause advice.

:::image type="content" source="../media/diagnostics/incident-summary.png" alt-text="Incident diagnostic summary" lightbox="../media/diagnostics/incident-summary.png":::

Based on these, you can already get a straightforward view of current abnormal status and the impact of the incident and the most potential root cause. So that immediate action could be taken to resolve incident as soon as possible. 

### View cross-dimension diagnostic insights

After getting basic info and automatic analysis insight, you can get more detailed info on abnormal status on other dimensions within the same metric in a holistic way using **"Diagnostic tree"**.

For metrics with multiple dimensions, Metrics Advisor categorizes the time series into a hierarchy, which is named as "Diagnostic tree". For example, a "revenue" metric is monitored by two dimensions: "region" and "category". Despite concrete dimension values, there needs to have an **aggregated** dimension value, like **"SUM"**. Then time series of "region" = **"SUM"** and "category" = **"SUM"** will be categorized as the root node within the tree. Whenever there's an anomaly captured at **"SUM"** dimension, then it could be drilled down and analyzed to locate which specific dimension value has contributed the most to the parent node anomaly. Click on each node to expand detailed information.

:::image type="content" source="../media/diagnostics/cross-dimension-diagnostic.png" alt-text="Incident diagnostics cross dimension view" lightbox="../media/diagnostics/cross-dimension-diagnostic.png":::

### View cross-metrics diagnostic insights using "Metrics graph"

Sometimes, it's hard to analyze an issue by checking the abnormal status of a single metric, and you need to correlate multiple metrics together. Customers are able to configure a "Metrics graph" which indicates the relations between metrics. 
By leveraging above cross-dimension diagnostic result, the root cause is limited into specific dimension value. Then use "Metrics graph" and filter by the analyzed root cause dimension to check anomaly status on other metrics.
After clicking the link, you will be pivoted to the incident analysis page which analyzes on corresponding anomaly, with a bunch of diagnostics insights. There are three sections in the incident detail page which correspond to three major steps to diagnosing an incident. 

:::image type="content" source="../media/diagnostics/cross-metrics-analysis.png" alt-text="Incident diagnostics cross metric analysis" lightbox="../media/diagnostics/cross-metrics-analysis.png":::

But you can also pivot across more diagnostics insights leveraging additional features to drill down anomalies by dimension, view similar anomalies and do comparison across metrics. Please find more at [How to: diagnose an incident](../how-tos/diagnose-an-incident.md). 

## Get notified when new anomalies are found

If you'd like to get alerted when an anomaly is detected in your data, you can create a subscription for one or more of your metrics. Metrics Advisor uses hooks to send alerts. Three types of hooks are supported: email hook, web hook and Azure DevOps. We'll use web hook as an example. 

### Create a web hook

A web hook is the entry point to get anomaly noticed by a programmatic way from the Metrics Advisor service, which calls a user-provided API when an alert is triggered.For details on how to create a hook, refer to the **Create a hook** section in [How-to: Configure alerts and get notifications using a hook](../how-tos/alerts.md#create-a-hook). 

### Configure alert settings

After creating a hook, an alert setting determines how and which alert notifications should be sent. You can set multiple alert settings for each metric. two important settings are **Alert for** which specifies the anomalies to be included, and **Filter anomaly options**, which define which anomalies to include in the alert. See the **Add or Edit alert settings** section in [How-to: Configure alerts and get notifications using a hook](../how-tos/alerts.md#add-or-edit-alert-settings) for more details.


## Next steps

- [Onboard your data feeds](../how-tos/onboard-your-data.md)
    - [Manage data feeds](../how-tos/manage-data-feeds.md)
    - [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Use the REST API or Client libraries](./rest-api-and-client-library.md)
- [Configure metrics and fine tune detection configuration](../how-tos/configure-metrics.md)
