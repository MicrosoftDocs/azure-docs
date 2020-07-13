---
title: Explore the sample data
description: Explore the sample data
ms.date: 07/07/2020
ms.topic: conceptual
ms.author: aahi
---

# Quickstart: Explore the Metrics Monitor sample data

## Pivot to Project "Gualala" demo site

To enable customers quickly get an experience of key features of Project "Gualala". We've provided a demo site with sample data and preset configurations. With those samples, customers can quickly get an understanding about the capabilities that can be achieved by leveraging Project "Gualala", also how it could benefit to the business problems. 

This is the URL of demo site: https://anomaly-detector.azurewebsites.net/

## View available sample data

When logging into the demo site, customers will be pivoted to 'Data feed' page, a 'Data feed' is a logical organization of time series data that queried from customers' data source, for more info please refer to ['Key Concepts'](../glossary.md). 

There're several data feeds been listed and they're ingesting from different kinds of data source, like 'Azure SQL database', 'Azure Table', 'Azure Blob'... They are using different ingesting configurations to fit for data source consuming method. 

![Data feed list](../media/sample_datafeeds.png "Sample data feeds")

## Explore data feed configurations

Click into one data feed, several parts of information is listed, like data ingestion status, metrics list of the feed, data feed not available records, audit logs and also configurations. 

Getting data ingested into the system is a critical step, customers can click 'Edit' to view more on detailed settings, like choosing data source type, specifying granularity, inputting a valid connection string and also a query which could be used for fetching metric data as expected schema. Then view the metric schema to specify timestamp, dimension and measure accordingly. This may help customers get a basic view of setting up proper configurations for their own data feeds.  

## View time series visualizations and configurations

After getting basics on data feeds, click into one metric to get into metric detail page, which contains major information/configuration on applying anomaly detection on metrics.

Let's take an example of clicking into one metric 'cost' in data feed 'Sample - Cost/Revenue - City/Category'. Note that this is a synthetic metric that only used for demonstrating capabilities of Project "Gualala" with no actual business significance. 

![Series visualization](../media/series_visualization.png "Series visualization")

Click into metric 'cost', all time series sliced by dimensions are visualized according to historical metric data. There's a blue tape around the metric data, points drop out of blue tape are tagged with red dots, which are the anomalies detected. 

Identifying anomalies in time series is configurable by tuning detecting configurations, which lays on left panel of metric detail page. Multiple detecting methods are available and even combinations of them. Sensitivity, detecting direction, valid anomaly configurations are also available for customers to set up feasible detecting settings for their specific scenarios. There's also 'Advanced configuration' which allows  more complex and customized detecting settings, which customers could set up for specific group/ individual series. 

![Detecting configuration](../media/detecting_configuration.png "Detecting configuration")

## Explore anomaly detection results and get insights from root cause analysis

Anomalies identified are tagged as red dots, if customers are not satisfied with detection results. One way is to tune configurations and make it workable for current metric. But if customers would like to provide feedback to the system, it's doable by clicking into the anomalies and using feedback signals to fine tune detection for future points. 

![Feedback for anomaly](../media/anomaly_feedback.png "Feedback for anomaly")

At the bottom of the dialog, customers are able to jump to incident page to get insights from root cause analysis. 

## Next Steps

- [View key concepts](glossary.md)
- [Create Gualala resource](create-instance.md)
