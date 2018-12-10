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
ms.date: 12/03/2018
---

# Azure Time Series Insights (Preview) use cases

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

1. The first and easiest to get started with is our visualization, the explorer, which enables you to quickly visualize all of your IoT data in one place. It provides tools like heatmap, which make visually spotting anomalies in your data simple. It also provides the perspective view, which enables you compare up to four views from one or more TSI environments in a single dashboard, giving you a view of your time-series data across all your locations. Learn more about the [TSI explorer](./time-series-insights-update-explorer.md). To plan out your TSI update environment, read [TSI update planning](./time-series-insights-update-plan.md).

1. The second way is to use our JavaScript SDK to quickly embed powerful charts and graphs in your own web application. With just a few lines of code, you can author powerful queries to populate line charts, pie charts, bar charts, heatmaps, data grids and more. All of these elements exist out-of-the-box using the SDK. The SDK also abstracts TSI query APIs, enabling you to author SQL-like predicates to query the data you want to show on a dashboard. For hybrid presentation-layer solutions, TSI offers parameterized URLs that provide seamless connection points with the explorer for deep-dives into data. To learn more about the JavaScript SDK, read the [TSI JS client library](https://docs.microsoft.com/azure/time-series-insights/tutorial-explore-js-client-lib) and the [TSI client](https://github.com/Microsoft/tsiclient) documentation. For more on parameterized URLs, read our article on [parameterized URLs](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-parameterized-urls).  

1. Finally, TSI provides powerful APIs for querying data stored in TSI. TSI has temporal operators like from, to, first, and last, aggregations and transformations like average, min, max, split by, order by, and DateHistogram, and filtering operators like has, in and, or, greater than, REGEX, etc. All these operators enable downstream applications to quickly find interesting trends and patterns in your data, and can be used to populate home-grown visualizations to spot anomalies.  

## Operational analysis and driving process efficiency

Enable monitoring the health, usage, and performance of equipment’s at scale, thereby providing an easy way to measure operational efficiency. Time Series Insights helps manage diverse and unpredictable IoT workloads without sacrificing ingestion or query performance.

![overview][2]

Streaming and continuous processing of data coming from operational processes can successfully transform any business if coupled with right technology/solution. Often these solutions are a combination of multiple systems that enable exploration and analysis of data that changes constantly specially in IoT realm and share a common pattern.

These patterns often start with IoT enabled platforms that ingest billions of events from devices and sensors spanning various locales. These systems process and analyze streaming data to derive real-time insights and actions, Data is typically archived to warm and cold storage for near real time and batch analytics. Data that is collected goes through series of processing to cleanse and contextualize for downstream querying and analytics scenarios. Microsoft Azure offers rich services that can be applied to these IoT scenarios (Asset Maintenance, Manufacturing, etc.). These include Azure TSI, Azure IoT Hub, Azure Event Hubs, Azure Stream Analytics, Azure Functions, Azure Logic Apps, Azure Databricks, Azure Machine Learning, and Microsoft Power BI.

This solution architecture can be achieved as follows – ingest data via Azure IoT Hub or Azure Event Hub for best-in-class security, throughput, and latency. Perform data processing and computations by funneling ingested data through services like Azure Stream Analytics, Azure Logic Apps, Azure Functions depending on the specific data processing needs. Computed signals from the processing pipeline are pushed to Azure TSI for storing and analytics. Azure Time Series Insights offers near real-time data exploration and asset-based insights over historical data. Depending on the business needs, MapReduce and Hive jobs can be run on data stored in Time Series Insights by connecting Time Series Insights to HDInsight. Data stored in Time Series Insights can be made available to Power BI, and other customer applications via Time Series Insights’ public surface query APIs for deep business and operational intelligence scenarios.

## Advanced Analytics

Integrate with advanced analytics Services such as Azure Machine Learning and Azure Databricks. Time Series Insights ingresses raw data from millions of devices and adds contextual data that can be consumed seamlessly by a suite of Azure analytics services.

![analytics][3]

Advanced analytics and machine learning consume and process large volumes of data to make data-driven decisions and perform predictive analysis. In IoT use cases, advanced analytics algorithms learn from the data collected from millions of devices that can transmit data multiple times every second. However, the data collected from IoT devices is raw and lacks contextual information such as the location of device, unit of the sensor reading etc, thus making it difficult for the data to be consumed directly for advanced analytics.

Azure Time Series Insights bridges the gap between IoT data and advanced analytics in two simple and cost-effective ways. First, Time Series Insights update collects raw telemetry data from millions of devices using IoT hub, enriches data with contextual information and transforms data into ‘parquet format’ that can easily integrate with a number of advanced analytics Services such as Azure Machine Learning, Azure Databricks, and other third-party applications.  Time Series Insights can serve as the source-of-truth for all data across an organization, thus creating a central repository for downstream analytics workloads to consume.  Since Time Series Insights is a near real-time storage service, advanced analytics models can learn continuously from incoming IoT telemetry data to make more accurate predictions.

Second, Time Series Insights can be fed the output of machine learning and prediction models to visualize and store their results, thus helping organizations to optimize and tweak their models.  What’s more, Time Series Insights makes it simple to visualize streaming telemetry data on the same plane as the trained model outputs to help data science teams spot anomalies and identify patterns.  

## Next steps

Learn more about the [TSI explorer](./time-series-insights-update-explorer.md).

To plan out your environment, read [TSI (Preview) planning](./time-series-insights-update-plan.md).

Read the [TSI client](https://github.com/Microsoft/tsiclient) documentation.

<!-- Images -->
[1]: media/v2-update-use-cases/data-explorer.svg
[2]: media/v2-update-use-cases/overview.svg
[3]: media/v2-update-use-cases/advanced-analytics.svg
