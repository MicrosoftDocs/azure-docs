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
	ms.date="06/22/2015"
	ms.author="jeffstok"/>

# Comparison of Apache Storm and Azure Stream Analytics #

| | |  | Azure Stream Analytics | Apache Storm on HDInsight | | |
| ------------------------------------------------------------- |
| | --------------------------------------------------------- | |
| | |  | ---------------------- | ------------------------- | | |
| | | General |  |  | | |
| | | Open Source | No. Microsoft proprietary offering | Yes. Apache licensed technology | | |
| | | Microsoft Supported | Yes | Yes | | |
| | | Hardware requirements | No hardware requirement. It’s an Azure Service | No hardware requirement. It’s an Azure Service | | |
| | | Cluster concept  | No. Azure Stream Analytics is a Job Service. Customers don’t maintain their clusters. Customers author and monitor job without the worry for cluster management | Storm on HDInsight is a managed PaaS service. Customers provision Storm Clusters that can run Streaming workload | | |
| | | Price |  Stream Analytics is priced by volume of data processed and the number of streaming units required to process it. |   The Unit of purchase is cluster.  | | |
| | |  | Link to the pricing page. | Link to the pricing page. | | |
| | | Authoring |  |  | | |
| | | Capabilities: SQL DSL | Yes. Easy to use SQL language support | No. Customer write code in Java C# or use Trident APIs | | |
| | | Capabilities: Temporal operators | Windowed aggregates, and temporal joins are supported out of the box. | Temporal operators need to be implemented by customer. | | |
| | | Development Experience | Interactive authoring and debugging experience through Azure Portal on sampled data. | Development, debugging and monitoring experience through the Visual Studio experience for .NET users and for Java and other languages customers use IDE of their choice. | | |
| | | Debugging support | When things don’t work, using job status and then looking via Management services logs is the only option, no way to setup Logs to verbose mode | Detailed logs available for debugging purposes.  Two ways to surface logs to user via visual studio or user can RDP into cluster to get access to logs. | | |
| | | Support for UDF (User Defined Functions) | Currently no support for UDFs | Yes. Can be written in C#, Java or the language of your choice. | | |
| | | Extensible - custom code  | None | Yes. Ability to write custom code. Can be done in C#, Java or other supported languages on Storm. | | |
| | | Input and Output |  |  | | |
| | | Input data sources | A streaming job can have a set of inputs. Currently restricted to Event Hubs, Azure Blobs. | No restrictions. Connectors available for Event Hubs, Service Bus, Kafka etc. Unsupported ones can be implemented via custom code | | |
| | | Input Data formats | Avro, JSON, CSV. | No restrictions. Can be implemented via custom code | | |
| | | Outputs | A streaming job can have multiple outputs. Currently restricted to Event Hubs, Blob Storage, Azure Table, Azure SQL DB, and PowerBI. | Support for many outputs in a topology, each output can have custom logic for downstream processing. Out of the box it comes with connectors for PowerBI, Event Hubs, Azure Blob Store, DocumentDB, SQL and HBase. Unsupported ones can be implemented via custom code | | |
| | | Data Encoding formats | UTF-8 | No restrictions. Can be implemented via custom code | | |
| | | Management and operations |  |  | | |
| | | Job Deployment model | Via portal, PowerShell and REST APIs | Via portal, PowerShell, Visual studio and REST APIs | | |
| | | -          Portal |  |  | | |
| | | -          Visual Studio |  |  | | |
| | | -          PowerShell |  |  | | |
| | | Monitoring (stats, counters, etc.) | Via Azure Portal and REST APIs | Via Storm UI and REST APIs | | |
| | |  | User can configure Azure alerts. |  | | |
| | | Scalability | Number of Streaming Units for each job. Each Streaming Unit processes up to 1MB/s. Max of 50 units by default. Call to increase limit. | Number of nodes in the HDI Storm cluster. No limit on number of nodes (top limit defined by your Azure quota). | | |
| | | Data process limits | Scale up or down number of Streaming Units to optimize for costs. | Scale up or down cluster size to have more resources. There is no limit  to data processed since Azure would allow to create cluster of any size | | |
| | |  | Goal to scale up to 1 GB/s |  | | |
| | | Job update by user | Stop and resume from last place stopped |   Stop and resume from last place stopped based on the watermark | | |
| | | Service and framework update | Automatic update for bug fix and security update without job downtime. | Automatic patching with no downtime. | | |
| | | Business continuity through a Highly Available Service with guaranteed SLA’s | SLA of 99.9% uptime | SLA of 99.9% uptime of the Storm cluster. Apache Storm is a fault tolerant streaming platform however its Customer responsibility to ensure their streaming jobs run uninterrupted. | | |
| | |  | Auto-recovery from failures |  | | |
| | |  | Recovery of stateful temporal operators is built-in. |  | | |
| | | Advanced Features |  |  | | |
| | | Late arrival and out of order event handling | Built-in configurable policies to reorder, drop events or adjust event time. | Customer needs to implement logic to handle. | | |
| | | Reference data | Reference data available from Azure Blobs with max size of 100 MB of in-memory lookup cache. Refreshing of reference data is managed by the service. | No limits on size or sources. Connectors available for HBase, DocumentDB, SQL Server /Azure. Unsupported ones can be implemented via custom code. | | |
| | |  |  | Refreshing of reference data need to be handled by custom code | | |
| | | Integration with Machine Learning | Yes, by configuring published Azure Machine Learning models as functions during ASA job creation | Available through Storm Bolts | | |


