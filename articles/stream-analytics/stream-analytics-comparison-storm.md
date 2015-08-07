<properties
	pageTitle="Comparison: Apache Storm vs. Azure Stream Analytics | Microsoft Azure"
	description="Learn how to use Stream Analytics for real-time Twitter sentiment analysis. Step-by-step guidance from event generation to data on a live dashboard."
	keywords="real-time twitter,sentiment analysis,social media analysis,social media analytics tools"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="08/04/2015"
	ms.author="jeffstok"/>

# Comparison of Apache Storm and Azure Stream Analytics #

## Introduction ##

This document illustrates the positioning of Azure Stream Analytics and Apache Storm as a managed service on HDInsight. The goal is to help customers understand the value proposition of both services, and make a decision on which is the right choice for their business use case.

While both provide benefits of a PaaS solution, there are a few major distinguishing capabilities that differentiate these services. We believe that listing out the capabilities, as well as the limitations, of these services will help customers land on the solution they need to achieve their goals.

## General ##

|Azure Stream Analytics|Apache Storm on HDInsight
---|---|---
Open Source|No, Azure Stream Analytics is a Microsoft proprietary offering.|Yes, Apache Storm is an Apache licensed technology.
Microsoft Supported|Yes|Yes
Hardware requirements|There are no hardware requirements. Azure Stream Analytics is an Azure Service.|There are no hardware requirements. Apache Storm is an Azure Service.
Top Level Unit|With Azure Stream Analytics customers deploy and monitor streaming jobs.|With Apache Storm on HDInsight customers deploy and monitor a whole cluster, which can host multiple Storm jobs as well as other  workloads (incl. batch).
Price|Stream Analytics is priced by volume of data processed and the number of streaming units (per hour the job is running) required.<p>[Further pricing information can be found here.](../pricing/details/stream-analytics/)|For Apache Storm on HDInsight, the unit of purchase is cluster-based, and is charged based on the time the cluster is running, independent of jobs deployed.<p>[Further pricing information can be found here.](../pricing/details/stream-analytics/)

## Authoring ##

|Azure Stream Analytics|Apache Storm on HDInsight
---|---|---
Capabilities: SQL DSL|Yes, an easy to use SQL language support is available.|No, users must write code in Java C# or use Trident APIs.
Capabilities: Temporal operators|Windowed aggregates, and temporal joins are supported out of the box.|Temporal operators must to be implemented by the user.
Development Experience|Interactive authoring and debugging experience through Azure Portal on sample data.|Development, debugging and monitoring experience is provided through the Visual Studio experience for .NET users, while for Java and other languages developers may use the IDE of their choice.
Debugging support|Stream Analytics offers basic job status and Operations logs as a way of debugging, but currently does not offer flexibility in what/how much is included in the logs ie: verbose mode.|Detailed logs are available for debugging purposes. There are two ways to surface logs to user, via visual Studio or user can RDP into the cluster to access logs.
Support for UDF (User Defined Functions)|Currently there is no support for UDFs.|UDFs can be written in C#, Java or the language of your choice.
Extensible - custom code |There is no support for extensible code in Stream Analytics.|Yes, there is availability to write custom code in C#, Java or other supported languages on Storm.

## Input and Output ##

|Azure Stream Analytics|Apache Storm on HDInsight
---|---|---
Input Data Sources|The supported input sources are Azure Event Hubs and Azure Blobs.|There are connectors available for Event Hubs, Service Bus, Kafka, etc. Unsupported connectors may be implemented via custom code.
Input Data formats|Supported input formats are Avro, JSON, CSV.|Any format may be implemented via custom code.
Outputs|A streaming job may have multiple outputs. Supported Outputs: Azure Event Hubs, Azure Blob Storage, Azure Tables, Azure SQL DB, and PowerBI.|Support for many outputs in a topology, each output may have custom logic for downstream processing. Out of the box Storm includes connectors for PowerBI, Azure Event Hubs, Azure Blob Store, Azure DocumentDB, SQL and HBase. Unsupported connectors may be implemented via custom code.
Data Encoding formats|Stream Analytics requires UTF-8 data format to be utilized.|Any data encoding format may be implemented via custom code.

## Management and operations ##
|Azure Stream Analytics|Apache Storm on HDInsight
---|---|---
Job Deployment model<p><p>Azure Portal<p><p>Visual Studio<p><p>PowerShell|Deployment is implemented via Azure Portal, PowerShell and REST APIs.|Depolyment is implemented via Azure Portal, PowerShell, Visual Studio and REST APIs.
Monitoring (stats, counters, etc.)|Monitoring is implemented via Azure Portal and REST APIs.<p>The user may also configure Azure alerts.|Monitoring is implemented via Storm UI and REST APIs.
Scalability|Number of Streaming Units for each job. Each Streaming Unit processes up to 1MB/s. Max of 50 units by default. Call to increase limit.|Number of nodes in the HDI Storm cluster. No limit on number of nodes (Top limit defined by your Azure quota). Call to increase limit.
Data processing limits|Users can scale up or down number of Streaming Units to increase data processing or optimize costs.<p><pScale up to 1 GB/s|User can scale up or down cluster size to meet needs.
Stop/Resume|Stop and resume from last place stopped.|Stop and resume from last place stopped based on the watermark.
Service and framework update|Automatic patching with no downtime.|Automatic patching with no downtime.
Business continuity through a Highly Available Service with guaranteed SLA’s|SLA of 99.9% uptime
Auto-recovery from failures|Recovery of stateful temporal operators is built-in.|SLA of 99.9% uptime of the Storm cluster. Apache Storm is a fault tolerant streaming platform however it is the customers' responsibility to ensure their streaming jobs run uninterrupted.

## Advanced Features ##
|Azure Stream Analytics|Apache Storm on HDInsight
---|---|---
Late arrival and out of order event handling|Built-in configurable policies to reorder, drop events or adjust event time.|User must implement logic to handle this scenario.
Reference data|Reference data available from Azure Blobs with max size of 100 MB of in-memory lookup cache. Refreshing of reference data is managed by the service.|No limits on data size. Connectors available for HBase, DocumentDB, SQL Server and Azure. Unsupported connectors may be implemented via custom code. 
Refreshing of reference data must be handled by custom code.|Integration with Machine Learning|Yes, by configuring published Azure Machine Learning models as functions during ASA job creation. Available through Storm Bolts
