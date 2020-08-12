---
title: Choose a real-time and stream processing solution on Azure
description: Learn about how to choose the right real-time analytics and streaming processing technology to build your application on Azure.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/15/2019
---

# Choose a real-time analytics and streaming processing technology on Azure

There are several services available for real-time analytics and streaming processing on Azure. This article provides the information you need to decide which technology is the best fit for your application.

## When to use Azure Stream Analytics

Azure Stream Analytics is the recommended service for stream analytics on Azure. It's meant for a wide range of scenarios that include but aren't limited to:

* Dashboards for data visualization
* Real-time [alerts](stream-analytics-set-up-alerts.md) from temporal and spatial patterns or anomalies
* Extract, Transform, Load (ETL)
* [Event Sourcing pattern](/azure/architecture/patterns/event-sourcing)
* [IoT Edge](stream-analytics-edge.md)

Adding an Azure Stream Analytics job to your application is the fastest way to get streaming analytics up and running in Azure, using the SQL language you already know. Azure Stream Analytics is a job service, so you don't have to spend time managing clusters, and you don't have to worry about downtime with a 99.9% SLA at the job level. Billing is also done at the job level making startup costs low (one Streaming Unit), but scalable (up to 192 Streaming Units). It's much more cost effective to run a few Stream Analytics jobs than it is to run and maintain a cluster.

Azure Stream Analytics has a rich out-of-the-box experience. You can immediately take advantage of the following features without any additional setup:

* Built-in temporal operators, such as [windowed aggregates](stream-analytics-window-functions.md), temporal joins, and temporal analytic functions.
* Native Azure [input](stream-analytics-add-inputs.md) and [output](stream-analytics-define-outputs.md) adapters
* Support for slow changing [reference data](stream-analytics-use-reference-data.md) (also known as a lookup tables), including joining with geospatial reference data for geofencing.
* Integrated solutions, such as [Anomaly Detection](stream-analytics-machine-learning-anomaly-detection.md)
* Multiple time windows in the same query
* Ability to compose multiple temporal operators in arbitrary sequences.
* Under 100-ms end-to-end latency from input arriving at Event Hubs, to output landing in Event Hubs, including the network delay from and to Event Hubs, at sustained high throughput

## When to use other technologies

### You want to write UDFs, UDAs, and custom deserializers in a language other than JavaScript or C#

Azure Stream Analytics supports user-defined functions (UDF) or user-defined aggregates (UDA) in JavaScript for cloud jobs and C# for IoT Edge jobs. C# user-defined deserializers are also supported. If you want to implement a deserializer, a UDF, or a UDA in other languages, such as Java or Python, you can use Spark Structured Streaming. You can also run the Event Hubs **EventProcessorHost** on your own virtual machines to do arbitrary streaming processing.

### Your solution is in a multi-cloud or on-premises environment

Azure Stream Analytics is Microsoft's proprietary technology and is only available on Azure. If you need your solution to be portable across Clouds or on-premises, consider open-source technologies such as Spark Structured Streaming or Storm.

## Next steps

* [Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Create a Stream Analytics job by using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Create a Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Create a Stream Analytics job by using Visual Studio Code](quick-create-vs-code.md)
