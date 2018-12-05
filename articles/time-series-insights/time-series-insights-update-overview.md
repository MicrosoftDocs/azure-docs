---
title: Azure Time Series Insights overview | Microsoft Docs
description: Azure Time Series Insights overview
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: anshan
ms.workload: big-data
ms.topic: overview
ms.date: 12/05/2018
---

# Azure Time Series Insights overview

Azure Time Series Insights (TSI) is an end-to-end Platform-As-A-Service to ingest, process, store, and query highly contextualized, time-series-optimized IoT-scale data. As such, Azure TSI is ideal for ad-hoc data exploration as well as operational analysis. TSI is a uniquely extensible and customized service offering that meets the broad needs of industrial IoT deployments.

## What is IoT data?

IoT data is any "industrial" data available in asset intensive organizations. IoT data is often highly unstructured since it's sent from a wide-range of assets that record fairly noisy measurements such as temperature, motion, humidity. Additionally, these data streams are frequently characterized by significant gaps, corrupted messages, and false readings. Data from those streams must be cleaned up before any analysis can occur. “ IoT data is often meaningful only in the context of additional data inputs coming from first-party data sources (such as CRM or ERP) or third-party data sources (for example, weather or location).

As a result, only a negligible fraction of that data gets used for operational and business purposes. Such data provides consistent, comprehensive, current, and correct information for business reporting and analysis. Turning collected IoT data into actionable insights therefore requires a few of key capabilities:

* Data processing to clean, filter, interpolate, transform, and prepare data for analysis
* Structure to navigate and understand the data (to normalize and contextualize the data)
* Cost effective storage for long / infinite retention for decades worth of processed (derived) as well as raw data

Typical IoT data flow can be depicted as follows:

  ![IoT data flow][1]

## Azure Time Series Insights for industrial IoT

The current IoT landscape is diverse. It includes customers spanning manufacturing, automobile, oil & gas, power & utility, smart buildings, and consulting. Scenarios include ad-hoc data exploration where the shape of the data is unknown, as well as operational analysis over schematized (explicitly modeled) data to drive operational efficiency. These scenarios typically exist side-by-side and support different use cases. Platform capabilities like multi-layered storage (warm and cold), the ability to store decades worth of time series data, and the ability to explicitly model and optimize queries for asset-based operational intelligence are becoming key to the success of industrial IoT enterprises and their digital revolution.

Azure TSI is a comprehensive end-to-end Platform-As-A-Service offering for both IoT data exploration as well as operational insights. TSI offers a fully managed cloud service for analyzing IoT-scale time series data.

Customers can store raw data in a schema-less, in-memory store, and perform interactive ad-hoc queries through a distributed query engine and API as well as leverage our rich user experience for visualizing billions of events in seconds. Learn more about our [data exploration capabilities](./time-series-insights-overview.md).

TSI also offers operational insights capabilities currently in Preview. Together with interactive data exploration and operational intelligence, TSI enables customers to derive more value out of data collected from IoT assets. Specifically, the Preview offering supports the following key capabilities:

* A scalable, performance and cost-optimized time series data store that enables a cloud-based IoT solution to trend years’ worth of time series data in seconds.
* Semantic model support to describe the domain and metadata associated with the derived and non-derived signals from assets and devices.
* An enhanced user experience that combines asset-based data insights with rich, ad-hoc data analytics for driving business and operational intelligence
* Integration with advanced machine learning and analytics tools like Azure Databricks, Apache Spark, Azure Machine Learning, Jupyter notebooks, Power BI, etc. to help customers tackle time series data challenges and drive operational efficiency.

Together operational insights and data exploration are offered with a simple pay-as-you-go pricing model for data processing, storage, and query, thereby providing customers a much more scalable model to suit their changing business needs.

Below is a high-level data flow diagram that depicts the updated capabilities:

  ![Key capabilities][2]

With the introduction of these key industrial IoT capabilities, Azure TSI provides the following key benefits.

* Multi-layered storage for IoT-scale time series data

  * With a common data processing pipeline for ingesting data, customers have the ability store data in warm storage for interactive queries and/or cold storage for storing large volumes of data and take advantage of highly performant, asset-based queries.

  * Dynamic routing across storage layers is coming soon.

* Time series model for contextualizing raw telemetry and deriving asset-based insights

  * Customers can contextualize raw telemetry data with descriptive time series model and derive rich operational intelligence with highly performance- and cost-optimized device-based queries.

* Seamless integration with other data solutions
  
  * Since data in Azure TSI is stored in open-sourced Apache Parquet files, customers can easily integrate with other data solutions (first or third party) for end-to-end scenarios including business intelligence, advanced machine learning, predictive analytics, etc.

* Near real-time data exploration

  * Azure  TSI explorer user experience provides visualization for all data streaming through the ingestion pipeline. Shortly after connecting an event source, customers can view, explore, and query event data for validating whether a device is emitting data as expected and monitoring an IoT asset for health, productivity, and overall effectiveness.

* Root-cause analysis and anomaly detection

  * Azure TSI explorer supports patterns and perspective views to conduct and save multi-step root-cause analysis. In combination with Azure Stream Analytics, customers can use Time Series Insights to detect alerts and anomalies in near real-time.

* Build custom applications on TSI platform

  * Azure TSI supports JavaScript SDK with rich controls and simplified access to queries to enable customers to build custom IoT applications on top of TSI platform to suit the needs of individual businesses.
  * Customers can also use TSI query APIs directly to drive data into custom IoT applications.

## Next steps

You are ready to get started with the Azure TSI (Preview):

> [!div class="nextstepaction"]
> [Read the Quickstart guide](./time-series-insights-update-quickstart.md)

Learn about use cases:

> [!div class="nextstepaction"]
> [Azure TSI use cases](./time-series-insights-update-use-cases.md)

<!-- Images -->
[1]: media/v2-update-overview/overview_one.png
[2]: media/v2-update-overview/overview_two.png