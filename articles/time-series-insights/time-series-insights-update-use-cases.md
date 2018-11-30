---
title: Azure Time Series Insights (preview) use cases | Microsoft Docs
description: Understanding Azure Time Series Insights (preview) use cases
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/27/2018
---

# Azure Time Series Insights (preview) use cases

This article provides an overview of several common use cases for Azure Time Series Insights (TSI). The recommendations in this article serve as a starting point as you develop applications and solutions with TSI.

After reading this article, you'll be able to answer the following questions:

* What are the common use cases for Azure TSI?
* What are the benefits of using Azure TSI for data exploration and visual anomaly detection?
* What are the benefits of using Azure TSI for operational analysis and process efficiency?
* What are the benefits of using Azure TSI for advanced analytics?

This document provides an overview of the use cases that the Azure TSI Private Preview is designed for.

## Introduction

Azure TSI is an end-to-end Platform-As-A-Service to ingest, process, store, and query highly contextualized, time-series-optimized IoT-scale data. As such, Azure TSI is ideal for ad-hoc data exploration as well as operational analysis. TSI is a uniquely extensible, customized, service offering that meets the broad needs of industrial IoT deployments.

## Data exploration and visual anomaly detection

Instantly explore and analyze billions of events to spot anomalies and discover hidden trends in your data. Azure TSI delivers near real-time performance for your IoT and DevOps analysis workloads.

![data-explorer][1]

Of all of Azure TSI’s strengths, most customers agree that the time-to-insight is among the strongest. TSI requires no upfront data preparation and works fast, connecting you to billions of events in your Azure IoT Hub or Event Hub in minutes.  Once connected, you can visualize and analyze billions of events to spot anomalies and discover hidden trends in your data.  Because TSI is intuitive and simple to use, you’ll start interacting with your data without writing a single line of code. There’s also no new language to learn; Time Series Insights provides granular text-based querying for advanced users familiar with SQL, as well as select-and-click exploration for novices.

We see customers taking advantage of this speed to diagnose asset-related issues quickly, in performing DevOps to get to the root cause of a bug in an IoT solution, and in identifying the areas to investigate for data science initiatives.  

There are three primary ways to interact with data stored in TSI:

1. The first and easiest to get started with is our visualization, the Explorer, which enables you to quickly visualize all of your IoT data in one place. It provides tools like heatmap, which make visually spotting anomalies in your data simple as well as perspective view, which enables you compare up to four views from one or more TSI environments in a single dashboard, giving you a view of your time-series data across all your locations. Learn more about the [TSI Explorer](./time-series-insights-update-explorer.md). To plan out your TSI update environment, read [TSI update planning](./time-series-insights-update-plan.md).

1. The second way is to use our JavaScript SDK to quickly embed powerful charts and graphs in your own web application. With just a few lines of code, you can author powerful queries to populate line charts, pie charts, bar charts, heatmaps, data grids and more. All of these elements exist out-of-the-box using the SDK. The SDK also abstracts TSI query APIs, enabling you to author SQL-like predicates to query the data you want to show on a dashboard. For hybrid presentation-layer solutions, TSI offers parameterized URLs that provide seamless connection points with the explorer for deep-dives into data. To learn more about the JavaScript SDK, read the [TSI JS client library](https://docs.microsoft.com/azure/time-series-insights/tutorial-explore-js-client-lib) and the [TSI client](https://github.com/Microsoft/tsiclient) documentation. For more on parameterized URLs, read our article on [parameterized URLs](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-parameterized-urls).  

1. Finally, TSI provides powerful APIs for querying data stored in TSI. TSI has temporal operators like from, to, first, and last, aggregations and transformations like average, min, max, split by, order by, and DateHistogram, and filtering operators like has, in and, or, greater than, REGEX, etc. All these operators enable downstream applications to quickly find interesting trends and patterns in your data, and can be used to populate home-grown visualizations to spot anomalies.  

For more information on Azure offerings for IoT, see [Create the Internet of Your Things](https://www.microsoft.com/internet-of-things).

## Operational analysis and driving process efficiency

Enable monitoring the health, usage, and performance of equipment’s at scale, thereby providing an easy way to measure operational efficiency. Time Series Insights helps manage diverse and unpredictable IoT workloads without sacrificing ingestion or query performance.

![overview][2]

Streaming and continuous processing of data coming from operational processes can successfully transform any business if coupled with right technology/solution. Often these solutions are a combination of multiple systems that enable exploration and analysis of data that changes constantly specially in IoT realm. These systems together light up the scenarios, which share a common pattern when it comes to ingest, process, store, analyze, and visualize the IoT data.

Part of the solution, systems need to ingest billions of events from devices and sensors spanning various locales. Next, these systems process and analyze streaming data to derive real-time insights. The data is then archived to warm and cold storage for near real time and batch analytics.

Next, these systems need to process the data being collected to enable cleanse and contextualization, while storing data for enabling downstream querying and analytics scenarios. Microsoft Azure offers rich services that can be applied for these IoT scenarios including Azure TSI, Azure IoT Hub, Azure Event Hubs, Azure Stream Analytics, Azure Functions, Azure Logic Apps, Azure Databricks, Azure Machine Learning, and Microsoft Power BI.

With the above solution setup, data can be ingested via Azure IoT or Event Hubs as it offers high throughput data ingestion with low latency. Data ingested that needs to be processed for real-time insight can be funneled to Azure Stream Analytics, Azure Logic Apps, and Azure Functions. The result can then be fed to Power BI for real-time dashboarding, as well as can be loaded into Azure Time Series Insights for alerting and monitoring comparing it to historical seeding. Data ingested that needs data exploration in near real-time or adhoc querying for historical trending, can be loaded directly to Azure Time Series Insights. The data loaded is ready to be queried along with unlimited historical data for operational analysis and analytics to optimize processes for maximum efficiencies. All data or just changes to data in that loaded most recently can be used as reference data as part of real-time analytics. In addition, data can further be refined and processed by connecting Azure Time Series Insights data to HDInsight for Map/Reduce, Hive, etc. jobs. Finally making this data available in Power BI and in any customer application via our Public surface query APIs.

## Advanced Analytics

Integrate with Advanced Analytics Services such as Azure Machine Learning and Azure Databricks. TSI ingresses raw data from millions of devices and adds contextual data that can be consumed seamlessly by a suite of Azure Analytics services.

![analytics][3]

Advanced analytics and machine learning consume and process large volumes of data to make data-driven decisions and perform predictive analysis. In IoT use cases, advanced analytics algorithms learn from the data collected from millions of devices that can transmit data multiple times every second. However, the data collected from IoT devices is raw and lacks contextual information such as the location of device, unit of the sensor reading etc. This data cannot be consumed directly for advanced analytics.

Azure TSI bridges the gap between IoT data and advanced analytics in a simple and cost-effective way. TSI collects raw telemetry data from millions of devices, enriches data with contextual information, and transforms data into ‘parquet format’ that can easily integrate with a number of Azure Advanced Analytics Services such as Azure Machine Learning, Azure DataBricks, and your own third-party applications. Advanced Analytics models can learn continuously from incoming IoT telemetry data to make more accurate predictions.

## Next steps

Learn more about the [TSI Explorer](./time-series-insights-update-explorer.md).

To plan out your environment, read [TSI (preview) planning](./time-series-insights-update-plan.md).

Read the [TSI client](https://github.com/Microsoft/tsiclient) documentation.

<!-- Images -->
[1]: media/v2-update-use-cases/data-explorer.png
[2]: media/v2-update-use-cases/overview.png
[3]: media/v2-update-use-cases/advanced-analytics.png
