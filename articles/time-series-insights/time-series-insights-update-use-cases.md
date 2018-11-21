# Time Series Insights Update Use Cases

This article provides an overview of several common use cases for Azure Time Series Insights. The recommendations in this article serve as a starting point as you develop applications and solutions with Time Series Insights.

After reading this article, you'll be able to answer the following questions:

*	What are the common use cases for Azure Time Series Insights?
*	What are the benefits of using Azure Time Series Insights for data exploration and visual anomaly detection?
*	What are the benefits of using Azure Time Series Insights for operational analysis and process efficiency?
*	What are the benefits of using Azure Time Series Insights for advanced analytics?

This document provides an overview of the use cases that the Time Series Insights update is designed for. 

## Introduction

Azure Time Series Insights is Microsoft’s BLAH.

Data exploration and visual anomaly detection

 Instantly explore and analyze billions of events to spot anomalies and discover hidden trends in your data.  Time Series Insights delivers near real-time performance for your IoT and DevOps analysis workloads.   

 
Of all Time Series Insight’s strengths, most customers agree that one of the top is the time-to-insight we provide.  Time Series Insights requires no upfront data preparation and works fast, connecting you to billions of events in your Azure IoT Hub or Event Hub in minutes.  Once connected, you can visualize and analyze billions of events to spot anomalies and discover hidden trends in your data.  Because Time Series Insights is intuitive and simple to use, you’ll start interacting with your data without writing a single line of code. There’s also no new language to learn; Time Series Insights provides granular text-based querying for advanced users familiar with SQL, as well as select-and-click exploration for novices.

We see customers taking advantage of this speed to diagnose asset-related issues quickly, in performing DevOps to get to the root cause of a bug in an IoT solutions, and in identifying the areas to investigate for data science initiatives.  

There are three primary ways to interact with data stored in Time Series Insights.  

The first and easiest to get started with is our visualization, the explorer, that enables you to quickly visualize all of your IoT data in one place.  It provides tools like heatmap which make visually spotting anomalies in your data simple as well as perspective view, which enables you compare up to four view from one or more Time Series Insights environments in a single dashboard, giving you a view of your time-series data across all your locations.  To learn more about the Time Series Insights explorer, head here.  For more on the Time Series Insights update explorer, which does require a little modeling ahead of time, head here. 
 
The second way is to use our JavaScript SDK to quickly embed powerful charts and graphs in your own web application.  With just a few lines of code, you can author powerful queries to populate line charts, pie charts, bar charts, heatmaps, data grids and more – all which are elements of the SDK.  The SDK abstracts Time Series Insights query APIs, enabling you to author SQL-like predicates to query the data you want to show on a dashboard.  For hybrid presentation-layer solutions, Time Series Insights offers parameterized URLs that provide seamless connection points with the explorer for deep-dives into data.  To learn more about the JavaScript SDK, head here for documentation and here for GitHub.  For more on parameterized URLs, head here.  

Finally, Time Series Insights provides powerful APIs for querying data stored in Time Series Insights.  Time Series Insights has temporal operators like from, to, first, and last, aggregations and transformations like average, min, max, split by, order by, and DateHistogram, and filtering operators like has, in and, or, greater than, REGEX, etc.  All these operators enable downstream applications to quickly find interesting trends and patterns in your data,and can be used to populate home-grown visualizations to spot anomalies.  

For more information on Azure offerings for IoT, see Create the Internet of Your Things.

## Operational analysis and driving process efficiency

Enable monitoring the health, usage and performance of equipment’s at scale, thereby providing an easy way to measure operational efficiency. Time Series Insights helps manage diverse and unpredictable IoT workloads without sacrificing ingestion or query performance.

Streaming and continuous processing of data coming from operational processes can successfully transform any business if coupled with right technology/solution. Often these solutions are a combination of multiple systems that enable exploration and analysis of data that changes constantly specially in IoT realm. These systems together light up the scenarios, which share a common pattern when it comes to ingest, process, store, analyze and visualize the IoT data.

Part of the solution, systems need to ingest billions of events from devices and sensors spanning various locales. Next, these systems process and analyze streaming data to derive real-time insights. The data is then archived to warm and cold storage for near real time and batch analytics.

Next, these systems need to process the data being collected to enable cleanse and contextualization, while storing data for enabling downstream querying and analytics scenarios. Microsoft Azure offers rich services that can be applied for these IoT scenarios including Azure Time Series Insights, Azure IoT Hub, Azure Event Hubs, Azure Stream Analytics, Azure Functions, Azure Logic Apps, Azure Databricks, Azure Machine Learning, and Microsoft Power BI.

With the above solution setup, data can be ingested via Azure IoT or Event Hubs as it offers high throughput data ingestion with low latency. Data ingested that needs to be processed for real-time insight can be funneled to Azure Stream Analytics, Azure Logic Apps and Azure Functions. The result can then be fed to Power BI for real time dashboarding, as well as can be loaded into Azure Time Series Insights for alerting and monitoring comparing it to historical seeding. Data ingested that needs data exploration in near real-time or adhoc querying for historical trending, can be loaded directly to Azure Time Series Insights. The data loaded is ready to be queried along with unlimited historical data for operational analysis and analytics to optimize processes for maximum efficiencies. All data or just changes to data in that loaded most recently can be used as reference data as part of real-time analytics. In addition, data can further be refined and processed by connecting Azure Time Series Insights data to HDInsight for Map/Reduce, Hive, etc. jobs. Finally making this data available in Power BI and in any customer application via our Public surface query APIs.

## Advanced Analytics

Integrate with Advanced Analytics Services such as Azure Machine Learning and Azure Databricks. Time Series Insights ingresses raw data from millions of devices and adds contextual data that can be consumed seamlessly by a suite of Azure Analytics services.

Advanced analytics and machine learning consume and process large volumes of data to make data-driven decisions and perform predictive analysis. In IoT use cases, advanced analytics algorithms learn from the data collected from millions of devices that can transmit data multiple times every second. However, the data collected from IoT devices is raw and lacks contextual information such as the location of device, unit of the sensor reading etc. This data cannot be consumed directly for advanced analytics.

Azure Time Series Insights bridges the gap between IoT data and advanced analytics in a simple and cost-effective way. Time Series Insights collects raw telemetry data from millions of devices, enriches data with contextual information and transforms data into ‘parquet format’ that can easily integrate with a number of Azure Advanced Analytics Serices such as Azure Machine Learning, Azure DataBricks and your own 3rd party applications. Advanced Analytics models can learn continuously from incoming IoT telemetry data to make more accurate predictions.
