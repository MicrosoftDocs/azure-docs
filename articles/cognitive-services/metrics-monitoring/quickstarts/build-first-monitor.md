---
title: Build your first Metrics monitor on the web
description: Laern how to build your first Metrics monitor on the web
ms.date: 07/07/2020
ms.topic: conceptual
ms.author: aahi
---

# Quickstart: Build your first Metrics monitor on the web

Project "Gualala" provides a web UI to help customers quickly onboard their own data and take use of capabilities on anomaly detection, diagnostics...You may access the web portal at: **https://{resource-name}.azurewebsites.net**. This {resource-name} is the Name you set when creating your Project "Gualala" resource.

Click into the URL, you're ready to use portal as the interface to interact with your metrics, by onboarding data, setting up detecting configurations, viewing time series visualization, exploring on diagnostics insights and also subscribing anomalies for alerting. It's more of a POC purpose, and getting first monitor ready by several simple clicks. This document will only take SQL Database as one example to guide you through the process of building your first monitor and key steps/configurations. More details could be got through additional links provided.

## Common concepts

The following terms are frequently used in the Premium SKU. For detailed explanation of these concepts, please search the keyword on the [glossary](../../glossary.md).

* **Data feed**: a data feed is your time series data source which consists of one or more metrics.
* **Metric**: a combination of measure and dimension values.
* **Measure**: a numeric value of a time series.
* **Dimension**: dimensions are attributes of your metrics.
* **Timestamp**: time associated with a dimension and measure combination.
* **Granularity**: how frequently the data point is produced in the data feed.
* **Start Time**: the start time that data starts to get ingested.

## Data schema requirements

Project "Gualala" is a service that focuses on time series anomaly detection, diagnostics and further analysis. As an AI powered service, it requires to collect historical data from customers' data source, trains a model and uses it for future detection. Basically what it expects from customers data source is one or multiple rows of  **aggregated** metric data with **Measure**(mandatory), **Timestamp**(optional) and **Dimension**(optional). There're no constraints for time-series data field namings. The following are requirements for data types.

* **Measure** [mandatory]: one or more columns containing numeric values.
* **Timestamp** [optional]: zero or one column with type of 'DateTime' or 'String'. When this column is not set, the timestamp is set as the start time of each ingestion period.
* **Dimension** [optional]: columns can be of any data types. Be extreme cautious with columns of large cardinality (meaning that columns with huge amount of different values) to prevent dimension explosion.

> [!Note]
> For one metric, at one particular timestamp there should only have one measure corresponding to one dimension combination. Please aggregate your data ahead of onboarding or use query to specify data to be ingested.

## Onboard metric data

Project "Gualala" provides a set of connectors to collect data from various data sources, like SQL Database, Azure Data Explorer, Azure Table Storage... Major steps to onboard metric data from various sources are pretty much the same, but may vary on specific parameters.

We'll take SQL Database as one example to go through onboarding process. 
### Step 1: Go to "Add data feed" blade

After signed in your Project "Gualala" portal with your Active Directory account, from the landing page, select "Get started". That will take you to the main page of the portal. Then select the "Add data feed" menu item from the left menu.

### Step 2: Configure connection settings

Starting from here, you'll input a set of parameters to properly add a data feed by connecting to your time-series data source. Please refer to the [cheat sheet](../howto/datafeeds/add-data-feeds-overview.md/#cheat-sheet-data-feed-creation-parameters) for details of all those parameters.

You'll start with selecting the "Source Type", "Granularity", and "Ingest data since (UTC)".

* **Source Type**: The type of data source where your time series data is stored.
* **Granularity**: The interval between consecutive data points in your time series data. Currently we support these options: Yearly, Monthly, Weekly, Daily, Hourly, and Customize. The customization option supports the lowest interval of 60 seconds.
* **Ingest data since (UTC)**: The very start time for the first timestamp to be ingested, please ensure data is available after this timestamp.

The next step then is to specify the **Connection string** with proper confidential to access data source and a custom **Query** which is used to specify data to be ingested and convert the data into [desired schema](#data-schema-requirements). There're other unique fields than those two for some data source types. For details, please refer to [add data feeds from different data sources](../howto/datafeeds/add-data-feeds-from-different-data-sources.md).

![Onboarding parameters](../media/onboard_parameters.png "product portal landing page")

### Step 3: Verify connection and load schema

After the connection string and query string are set, select "Verify and get schema" to verify the connection and run the query to get your data schema from the data source. Normally it takes a few seconds depending on the connectivity with your data source. If there's an error at this step, please confirm that:

1. Your connection string is correct;
1. Your Premium SKU instance is able to connect to the data source if there're firewall settings;
1. Your query is correct.

If all those requirements are met but you're still encountering errors, please reach out to us via the [support channel](../../support.md).

### Step 4: Schema configuration: define timestamp(optional), dimensions(optional) and measures

Once the data schema is loaded and shown like below, you could select from the table to define the desired fields.

![Schema configuration](../media/configureschema.png "Schema configuration")

> [!Note]
> * Timestamp should be specified at most one column.
> * Measure should be chosen at least one column.

For additional parameters, please refer to details in [add data feeds overview](../howto/datafeeds/add-data-feeds-overview.md).

### Step 5: Specify a name for onboarded data feed
 
Give a custom name of the data feed which will be displayed on the portal, click on 'Submit', then your data feed is onboarded successfully. 

## Tune detecting configuration

After data feed is created, Project "Gualala" will try to ingest metric data from the start date that specified. It will cost sometime for data to be fully ingested, you can view the ingestion status by checking 'Ingestion progress' at the top of data feed page. If data is ingested, Project "Gualala" will apply detection on a historical period of data, as well as new data ingested afterwards. Please refer to [detection period](../faq.md#what-is-the-relationship-between-granularity-and-detection-period).

When detection is applied, click into one metric listed in data feed, you will be pivoted to metric detail page. At this page, you are able to 
- View visualizations of all time series slices under this metric
- Update detecting configuration to meet expected results
- Set up notification for detected anomalies

![Metric detail](../media/metric_detail.png "Metric detail")

### Tune metric-level detecting configuration

On the left side of the page lays metric-level detecting configuration, you can update parameters to impact detecting results for all time series globally. There're three detecting methods been supported: smart detection, change threshold, hard threshold to support on different scenarios. 

- Smart detection method is powered by machine learning which learns series pattern from historical data and use the pattern for future detection. **Sensitivity** is the most important parameter to tune the detection results. By dragging it to a smaller or larger value, you will get different results instantly from the visualization on the right. Choose one that suits for your scenario and save it. 

- Change threshold method is normally used in scenario that metric data normally stays around a certain range and doesn't expect to have obvious change over time. The threshold is set according to **Change percentage**. The change is updated instantly as well. 

- Hard threshold method is the basic method been used in traditional anomaly detection. You're able to set a upper bound and/or a lower bound to determine expected value range. Any points fall out of the boundary will be identified as an anomaly. 

There're additional parameters like 'Direction', 'Valid anomaly'... which could be leveraged to tune and identify a true anomaly combined with business scenario. 

Project "Gualala" support combinations of different detecting configurations. For example to combine 'Smart detection' and 'Hard threshold' to filter out tiny anomalies without real business impact. You can even specify the operator to be used for either 'And' or 'OR'. 

![Configuration combination](../media/config_combination.png "Configuration combination")

### Tune detecting configuration for specific series or group of series

Sometimes series pattern or criteria on determining an anomaly may not be the same for all time series in one metric. Tuning for specific series or group of series is required. 

Click 'Advanced settings' in detecting configuration section, a pop-up window will be displayed. There're two sections named 'Configuration for series group' and 'Configuration for specific series'. Click '+' button to create a group-level/ series-level configuration. 

![Advanced configuration](../media/advanced_configuration.png "Advanced configuration")

Parameters to be set for group-level/ series-level configuration are similar with metric-level configuration. But you may need to specify at least one dimension value for group-level configuration to identify a group of series. And specify all dimension values for series-level configuration to identify a specific series.

## View diagnostic insights

With fine-tuned detecting configuration, anomalies that detected mostly reflect real business issues. Project "Gualala" performs analysis on multi-dimensional metrics, like anomaly clustering, incident correlation and root cause digging. Those are been exposed as **diagnostics insights** by a set of powerful features. 

To view the diagnostic insights, you can just click on the red dots on time series visualizations which stand for anomalies that detected. A pop-up window will be displayed with a link to incident analysis page. 

![Incident link](../media/incident_link.png "Incident link")

You will be pivoted to the incident analysis page which the anomaly belongs to with bunch of diagnostics insights. At the top, there're some statistics about the incident like 'Severity', 'Anomalies involved', and incident impacted 'Start time' and 'End time'. 

Below that shows ancestor anomaly of the incident and automated root cause advice. This automated root cause advice is analyzed upon diagnosing tree through all related anomalies on deviation, distribution and contribution to parent anomalies, which would most likely to be the root cause of the incident. 

![Incident diagnostic](../media/incident_diagnostic.png "Incident diagnostic")

Based on these, you can already get a straightforward view of what is happening and the impact of the incident as well as the most potential root cause. So that immediate action could be taken to resolve incident as soon as possible. 

But you can also pivot across more diagnostics insights leveraging additional features to drill down anomalies by dimension, view similar anomalies and do comparison across metrics. Please find more at [Diagnose workflow](../howto/diagnose/diagnose-workflows.md). 

## Subscribe anomalies for notification

If you'd like to get noticed in near real time whenever an anomaly is detected, you can subscribe the metric for anomalies. There're two major steps:

### Step 1: Create a hook

A hook is the entry point for all the information you care and the channel to escalate an anomaly. This is the prerequisite to get anomaly notification. Currently, we only support Web Hook for anomalies that detected.For details on how to create a hook, please refer to [create a hook](../howto/alerts/create-hooks.md). 

### Step 2: Set up alert settings

An alert setting defines the rule that how the alert notification should be sent, which should be sent and which not. You can set multiple alert settings for different monitoring scenarios. 

There're two major parts on settings, one is 'Alert for' which specifies the scope to be applied, the other is 'Filter anomaly options' which defines the rule on what anomalies to be noticed. 

For more detail, please refer to [add alert settings](../howto/alerts/add-alert-settings.md). 


## Sumamry

After going through all above steps, you've already built your first metric monitor on Project "Gualala" on web portal and experienced some of the features on anomaly detection as well as diagnostic. Just onboard more metrics and explore more features we've provided! 

## Next Steps

- [Onboard your metric data](../howto/datafeeds/add-data-feeds-overview.md)
- [Tune detecting configuration](../howto/metrics/tune-detecting-config.md)
- [Use APIs to customize a solution](use-API-to-build-solution.md)
