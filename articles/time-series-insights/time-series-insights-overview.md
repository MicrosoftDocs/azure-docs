---
title: Overview of Azure Time Series Insights | Microsoft Docs
description: Introduction to Azure Time Series Insights, a new service for time series data analytics and IoT solutions
services: time-series-insights
ms.service: time-series-insights
author: op-ravi
ms.author: omravi
manager: jhubbard
editor: MarkMcGeeAtAquent, jasonwhowell, kfile, MicrosoftDocs/tsidocs
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.workload: big-data
ms.topic: article
ms.date: 11/15/2017
---

# What is Azure Time Series Insights? An Overview:

Azure Time Series Insights is a fully managed analytics, storage, and visualization service that makes it simple to explore and analyze billions of IoT events simultaneously.  It gives you a global view of your data, letting you quickly validate your IoT solution and avoid costly downtime to mission-critical devices by helping you discover hidden trends, spot anomalies, and conduct root-cause analyses in near real-time.  If you are building an application that needs to store or query time series data, you can develop using Time Series Insights using REST APIs.

Time Series Insights allows you to get started visualizing and querying data flowing into Azure IoT Hubs and Event Hubs in minutes, enabling you to query extremely large volumes of time series data in seconds.  It was designed for the internet-of-things (IoT) scale and can handle terabytes of data.  Additionally:

- Time Series Insights is schema-less, so there is no need to prep data to get started.
- There is no coding required to get started using the Time Series Insights explorer.  
- You don’t need to know SQL or a technical database language to query Time Series Insights; you can click, select, and zoom to drill down into your data.

## Is Time Series Insights for you?

Time Series Insights is built for storing, visualizing, and querying very large amounts of time series data.  If you want to store, manage, query, or visualize time series data in the cloud, Time Series Insights is likely right for you.  

If you are building an application, either for internal consumption or for external customers to use, Time Series Insights can be leveraged as a backend for indexing, storing, and aggregating time series data.  You can build a custom visualization and user experience on top.  Time Series Insights exposes REST Query APIs to enable this scenario.  

If you are unsure if your data is time series, here is what you should know.  Time series data represents how an asset or process changes over time.  It’s unique in that it has a timestamp and time is most meaningful as an axis.  Time series data typically arrives in time order and is usually treated as an insert rather than an update to your database.  Because Time Series Insights captures and stores every new event as a row, change is measured over time, enabling you to look backward and to predict future change.  In large volumes, storing, indexing, querying, analyzing, and visualizing time series data can be very challenging.  

## Primary scenarios

- Storing time series data in a massively scalable way.  
  - Simply put, at its core, Time Series Insights has a database designed with time series data in mind.  Because it is scalable and fully managed, Time Series Insights does all the work of storing and managing events.

- Out-of-the-box, near real-time data exploration.  
  - Time Series Insights provides an explorer that visualized all data streaming into an environment.  Within minutes of connecting an event source, event data can be viewed, explored, and queried within Time Series Insights.  This is especially useful for validating a device is emitting data as expected and monitoring an IoT asset for health, productivity, and overall effectiveness.  

- Expediated root-cause analysis and anomaly detection.
  - Time Series Insights has powerful tools like patterns and perspective views to conduct and save multi-step root-cause analysis.  Further, Time Series Insights works great in conjunction with alerting services like Azure Stream Analytics, so alerts and detected anomalies can be viewed in near real-time in the Time Series Insights explorer.  

- A global view of time series data streaming from disparate locations for multi-asset/site comparison.
  - You can connect multiple event sources to a Time Series Insights environment.  This means that data streaming in from multiple, disparate locations can be viewed together in near real-time.  Users can take advantage of this visibility to share data quickly with business leaders and to enable better collaboration with domain experts who can apply their know-how to help solve problems, apply best practices, and share learnings.

- Building a customer application on top of Time Series Insights. 
  - Time Series Insights exposes REST Query APIs, making it simple to build powerful applications that use time series data.

## Capabilities and benefits

- **Easy to get started:** Azure Time Series Insights requires no up-front data preparation and is incredibly fast. Connect to billions of events in your Azure IoT Hub or Event Hub in minutes. Once connected, visualize and interact with sensor data in seconds to quickly validate your IoT solutions. Time Series Insights is easy to use; you can interact with your data without writing a single line of code. 
There is no new language to learn; Time Series Insights provides a granular, free-text query surface for advanced users, and point and click exploration for all.
- **Near Real-time insights:** Time Series Insights can ingest hundreds of millions of sensor events per day, with one minute latency, so you can react to changes quickly. Time Series Insights helps you gain deep insights into your sensor data by helping you spot trends and anomalies quickly, conduct complex root-cause analyses, and avoid costly downtime. By enabling cross-correlation between real-time and historical data, Time Series Insights helps you unlock hidden trends in the data.
- **Build custom solutions:** Embed Azure Time Series Insights data into your existing applications, or create new custom solutions with Time Series Insights REST APIs. Creating and sharing personalized views you can share for others to explore your discoveries.
- **Scalability:** Time Series Insights is designed to support IoT at scale. In Preview, it can ingress from 1 million to 100 million events per day, with a default retention span of 31 days. You can visualize and analyze live data streams in near real-time, alongside vast amounts of historical data. Moving forward, ingress and retention rates will increase to accommodate an ever evolving enterprise scale.

## Time Series Insights architecture
Getting started takes less than 5 minutes. 

1.	To get started, provision a Time Series Insights environment in the Azure portal. 
2.	Connect an event source like an Azure IoT Hub or Event Hub.  
3.	Upload reference data (this is not an additional service).
4.	See your data in minutes with the Time Series Insights explorer.

This diagram shows an example of basic architecture to get started using Time Series Insights:
![Time Series Insights architecture](media/overview/time-series-insights-overview-flow.png)

## Next steps
- [Explore using Time Series Insights explorer in a demonstration environment](./time-series-quickstart.md)
- [Plan your own Time Series Insights environment](time-series-insights-environment-planning.md)

