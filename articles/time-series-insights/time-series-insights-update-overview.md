---
title: 'Overview: Azure Time Series Insights Preview | Microsoft Docs'
description: Azure Time Series Insights Preview overview.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: dpalled
manager: cshankar
ms.reviewer: dpalled
ms.workload: big-data
ms.topic: overview
ms.date: 04/26/2019
ms.custom: seodec18
---

# Azure Time Series Insights Preview

Azure Time Series Insights Preview is an end-to-end platform-as-a-service (PaaS) offering. It's used to collect, process, store, analyze, and query highly contextualized, time-series-optimized IoT-scale data. Time Series Insights is ideal for ad hoc data exploration and operational analysis. Time Series Insights is a uniquely extensible and customized service offering that meets the broad needs of industrial IoT deployments.

> [!TIP]
> For features in general availability (GA), read the [Azure Time Series Insights GA overview](time-series-insights-overview.md).

## Video

### Learn more about Azure Time Series Insights Preview. </br>

> [!VIDEO https://channel9.msdn.com/Shows/Internet-of-Things-Show/Azure-Time-Series-Insights-e2e-solution-for-industrial-IoT-analytics/player]

## Define IoT data

IoT data is any industrial data that's available in asset-intensive organizations. IoT data is often highly unstructured because it's sent from assets that record fairly noisy measurements. These measurements include temperature, motion, and humidity. These data streams are frequently characterized by significant gaps, corrupted messages, and false readings. Data from these streams must be cleaned up before any analysis can occur.

IoT data is often meaningful only in the context of additional data inputs that come from first-party sources, such as CRM or ERP. Inputs also come from third-party data sources, such as weather or location.

As a result, only a fraction of the data gets used for operational and business purposes. Such data provides consistent, comprehensive, current, and correct information for business reporting and analysis. Turning collected IoT data into actionable insights requires:

* Data processing to clean, filter, interpolate, transform, and prepare data for analysis.
* A structure to navigate and understand the data, that is, to normalize and contextualize the data.
* Cost-effective storage for long or infinite retention for decades' worth of processed, or derived, data, and raw data.

A typical IoT data flow is shown in the following image.

  ![IoT data flow][1]

## Azure Time Series Insights for industrial IoT

The current IoT landscape is diverse. Customers span the manufacturing, automotive, energy, utilities, smart buildings, and consulting industries. Scenarios include ad hoc data exploration where the shape of the data is unknown. Scenarios also include operational analysis over schematized, or explicitly modeled, data to drive operational efficiency. These scenarios typically exist side by side and support different use cases. Platform capabilities that are key to the success of industrial IoT enterprises and their digital revolution include:

- Multilayered storage, both warm and cold.
- The ability to store decades' worth of time series data.
- The ability to explicitly model and optimize queries for asset-based operational intelligence.

Time Series Insights is a comprehensive, end-to-end PaaS offering for IoT data exploration and operational insights. Time Series Insights offers a fully managed cloud service for analyzing IoT-scale time series data.

You can store raw data in a schema-less, in-memory store. You can then carry out interactive ad hoc queries through a distributed query engine and API. Make use of the rich user experience to visualize billions of events in seconds. Learn more about the [data exploration capabilities](./time-series-insights-overview.md).

Time Series Insights also offers operational insights capabilities currently in preview. Together with interactive data exploration and operational intelligence, you can use Time Series Insights to derive more value out of data collected from IoT assets. The preview offering supports:

* A scalable and performance- and cost-optimized time series data store. This cloud-based IoT solution can trend years’ worth of time series data in seconds.
* Semantic model support that describes the domain and metadata associated with the derived and nonderived signals from assets and devices.
* An enhanced user experience that combines asset-based data insights with rich, ad hoc data analytics. This combination drives business and operational intelligence.
* Integration with advanced machine learning and analytics tools. Tools include Azure Databricks, Apache Spark, Azure Machine Learning, Jupyter notebooks, and Power BI. These tools help you tackle time series data challenges and drive operational efficiency.

Together, operational insights and data exploration are offered with a simple pay-as-you-go pricing model for data processing, storage, and query. This billing model is suited to your changing business needs.

This high-level data flow diagram shows the updates.

  ![Key capabilities][2]

With the introduction of these key industrial IoT capabilities, Time Series Insights provides the following key benefits.

| | |
| ---| ---|
| Multilayered storage for IoT-scale time series data | With a common data processing pipeline for ingesting data, you can store data in warm storage for interactive queries. You also can store data in cold storage for large volumes of data. Take advantage of high-performing asset-based [queries](./time-series-insights-update-tsq.md). |
| Time Series Model to contextualize raw telemetry and derive asset-based insights | Contextualize raw telemetry data with the descriptive [Time Series Model](./time-series-insights-update-tsm.md). Derive rich operational intelligence with highly performance- and cost-optimized device-based queries. |
| Smooth and continuous integration with other data solutions | Data in Time Series Insights is [stored](./time-series-insights-update-storage-ingress.md) in open-sourced Apache Parquet files. This integration with other data solutions, whether first or third party, is easy for end-to-end scenarios. These scenarios include business intelligence, advanced machine learning, and predictive analytics. |
| Near real-time data exploration | The [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md) user experience provides visualization for all data streaming through the ingestion pipeline. Shortly after you connect an event source, you can view, explore, and query event data. In this way, you can validate whether a device emits data as expected. You also can monitor an IoT asset for health, productivity, and overall effectiveness. |
| Root-cause analysis and anomaly detection | The [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md) supports both pattern and perspective views to conduct and save multistep, root-cause analysis. In combination with Azure Stream Analytics, you can use Time Series Insights to detect alerts and anomalies in near real time. |
| Custom applications built on Time Series Insights platform | Time Series Insights supports the [JavaScript SDK](./tutorial-explore-js-client-lib.md). The SDK provides rich controls and simplified access to queries. Use the SDK to build custom IoT applications on top of Time Series Insights to suit your specific business needs. You also can use the Time Series Insights [Query APIs](./time-series-insights-update-tsq.md) directly to drive data into custom IoT applications. |

## Next steps

Get started with Azure Time Series Insights Preview:

> [!div class="nextstepaction"]
> [Read the Quickstart guide](./time-series-insights-update-quickstart.md)

Learn about use cases:

> [!div class="nextstepaction"]
> [Azure Time Series Insights Preview use cases](./time-series-insights-update-use-cases.md)

<!-- Images -->
[1]: media/v2-update-overview/overview-one.png
[2]: media/v2-update-overview/overview-two.png
