---
title: Choose a real-time analytics and streaming processing technology on Azure
description: Learn about how to choose the right real-time analytics and streaming processing technology to build your application on Azure.
author: zhongc
ms.author: zhongc
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/09/2019
---

# Choose a real-time analytics and streaming processing technology on Azure

There are several options available for real-time analytics and streaming processing on Azure. This article provides the information you need in order to decide which technology is the best fit for your application.

## When to use Azure Stream Analytics

Azure Stream Analytics is the recommended service for stream analytics on Azure. It is meant for a wide range of scenarios that include but are not limited to:

* Dashboards for data visualization
* Real-time alerts from temporal and spatial patterns or anomalies
* Extract, Transform, Load (ETL)
* [Event Sourcing pattern](/azure/architecture/patterns/event-sourcing.md)
* IoT Edge

Adding an Azure Stream Analytics job to your application is the fastest way to get streaming analytics up and running in Azure, using the SQL language you already know. Azure Stream Analytics is a job service, so you don't have to spend time managing clusters, and you don't have to worry about downtime with a 99.9% SLA at the job level. Billing is also done at the job level making startup costs low (one Streaming Unit), but scalable (up to 192 Streaming Units). It's much more cost effective to run a few Stream Analytics jobs than it is to run and maintain a cluster.

Azure Stream Analytics has a rich out-of-the-box experience. You can immediately take advantage of the following features without any additional setup:

* Built-in processing logic
* Native Azure [input](stream-analytics-add-inputs.md) and [output](stream-analytics-define-outputs.md) adapters
* Support for slow changing [reference data](stream-analytics-use-reference-data.md) (also known as a look up tables)
* Integrated solutions, such as [Anomaly Detection](stream-analytics-machine-learning-anomaly-detection.md)
* Multiple time windows in the same query
* Under 100 ms end-to-end latency from input arriving at Event Hubs, to output landing in Event Hubs, including the network delay from and to Event Hubs, at sustained high throughput

## When to use other technologies

### You need to input from or output to Kafka

Azure Stream Analytics does not have an Apache Kafka input or output adapter. If you have events landing in or need to send to Kafka, you can use Spark Structured Streaming or Storm on HDInsight. You can also use the Event Hubs Kafka API to interop with the rest of your solution, allowing Azure Stream Analytics to read from and write to Event Hubs.

### You don't want to write UDFs and UDAs in JavaScript (or C# for IoT Edge jobs)

Azure Stream Analytics supports user-defined functions (UDF) or user-defined aggregates (UDA) in JavaScript for cloud jobs and C# for IoT Edge jobs. If you want to deserialize custom formats, or write UDFs and UDAs in other languages, such as Java or Python, you can use Spark Structured Streaming. You can slo run the Event Hubs **EventProcessorHost** on your own virtual machines.

### Your solution is in a multi-cloud or on-premises environment

Azure Stream Analytics is Microsoft's proprietary technology and is only available on Azure. If you need your solution to be portable across Clouds or on-premises, consider open-source technologies such as Spark Structured Streaming or Storm.

## Next steps

* [Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Create a Stream Analytics job by using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Create a Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Create a Stream Analytics job by using Visual Studio Code](quick-create-vs-code.md)