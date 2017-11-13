---
title: Overview of Azure Time Series Insights | Microsoft Docs
description: Introduction to Azure Time Series Insight, a new service for time series data analytics and IoT solutions
keywords:  
services: tsi
documentationcenter:
author: op-ravi
manager: jhubbard
editor: 

ms.assetid:
ms.service: tsi
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/20/2017
ms.author: omravi
---

# What is Azure Time Series Insights

Azure Time Series Insights is a managed cloud service with storage, analytics, and visualization components that make it easy to ingest, store, explore and analyze billions of events simultaneously. Time Series Insights gives you a global view of your data, letting you quickly validate your IoT Solutions, and avoid costly device downtime, by helping you discover hidden trends and anomalies, and conduct root-cause analyses in near real-time. Time Series Insights ingests time-series data from event-brokers (e.g. IoT Hubs or Event Hubs), indexes the data, and retires data based on a configurable retention policy. Users consume the data either through an intuitive UX or REST Query APIs.

![Time Series Insight Overview](media/overview/time-series-insights-overview-flow.png)

## Primary scenarios

* Monitor and validate IoT solutions in minutes.
* Visualize and analyze IoT data at scale.
* Expedite root-cause analysis and anomaly detection.
* Create a global view of multiple devices, plants, and data.

## Capabilities and benefits

* **Easy to get started**: Azure Time Series Insights requires no up-front data preparation and is incredibly fast. Connect to billions of events in your Azure IoT Hub or Event Hub in minutes. Once connected, visualize and interact with sensor data in seconds to quickly validate your IoT solutions. Time Series Insights is easy to use; you can interact with your data without writing a single line of code.  There is no new language to learn; Time Series Insights provides a granular, free-text query surface for advanced users, and point and click exploration for all.

* **Near Real-time insights**: Time Series Insights can ingest hundreds of millions of sensor events per day, with one minute latency, so you can react to changes quickly. Time Series Insights helps you gain deep insights into your sensor data by helping you spot trends and anomalies quickly, conduct complex root-cause analyses, and avoid costly downtime. By enabling cross-correlation between real-time and historical data, Time Series Insights helps you unlock hidden trends in the data.

* **Build custom solutions**: Embed Azure Time Series Insights data into your existing applications, or create new custom solutions with Time Series Insights REST APIs. Creating and sharing personalized views you can share for others to explore your discoveries.

* **Scalability**: Time Series Insights is designed to support IoT at scale. In Preview, it can ingress from 1 million to 100 million events per day, with a default retention span of 31 days. You can visualize and analyze live data streams in near real-time, alongside vast amounts of historical data. Moving forward, ingress and retention rates will increase to accommodate an ever evolving enterprise scale.

## Time Series Insights glossary

* **Environment**: An environment is an Azure resource with ingress and storage capacity.  Customers provision environments through the Azure portal with their required capacity.
* **Event Source**: An Event Source is derived from an event broker, like Azure Event Hubs.  Time Series Insights connects directly to Event Sources, ingesting the data stream without writing any code. Currently, Time Series Insights supports Azure Event Hubs and Azure IoT Hubs.
* **Reference data**: Time Series Insights provides users the ability to join time series data with reference data.  Reference data can include metadata about devices, or other static data that changes relatively infrequently. Time Series Insights joins the reference data with data streams, allowing users to visualize and analyze this data in near real-time.
